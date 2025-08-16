import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService } from "./objectStorage";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";
import { ultimateVideoGeneration } from "./services/videoGeneration";
import { directUploadHandler, handleDirectUpload } from "./routes/direct-upload";


// Helper function to convert annotations to descriptive prompt
function generatePromptFromAnnotations(annotations: any[]): string {
  if (!annotations || annotations.length === 0) {
    return "Create a cinematic video with smooth camera movement and natural motion";
  }

  const prompts: string[] = [];
  
  for (const annotation of annotations) {
    switch (annotation.type) {
      case 'arrow':
        const direction = getArrowDirection(annotation);
        prompts.push(`camera moves ${direction} with smooth motion`);
        break;
      case 'text':
        if (annotation.text) {
          prompts.push(annotation.text);
        }
        break;
      case 'circle':
        prompts.push("focus on the highlighted area with dramatic emphasis");
        break;
      case 'rectangle':
        prompts.push("emphasize the selected region with cinematic framing");
        break;
    }
  }

  const combinedPrompt = prompts.length > 0 
    ? prompts.join(", ") + ". Create a high-quality cinematic video with smooth transitions."
    : "Create a cinematic video with smooth camera movement and natural motion";

  return combinedPrompt;
}

function getArrowDirection(arrow: any): string {
  if (!arrow.endX || !arrow.endY || !arrow.startX || !arrow.startY) {
    return "forward";
  }
  
  const deltaX = arrow.endX - arrow.startX;
  const deltaY = arrow.endY - arrow.startY;
  
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? "right" : "left";
  } else {
    return deltaY > 0 ? "down" : "up";
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const objectStorageService = new ObjectStorageService();

  // 直接上传端点 - 避免URL参数过长问题
  app.post("/api/images/direct-upload", directUploadHandler, handleDirectUpload);

  // Get upload URL for project images
  app.post("/api/images/upload", async (req, res) => {
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Serve uploaded images
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving image:", error);
      res.status(404).json({ error: "Image not found" });
    }
  });

  // Create new project
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      
      // Normalize the object path
      const normalizedImageUrl = objectStorageService.normalizeObjectEntityPath(
        validatedData.originalImageUrl
      );

      const project = await storage.createProject({
        ...validatedData,
        originalImageUrl: normalizedImageUrl,
      });

      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error getting project:", error);
      res.status(500).json({ error: "Failed to get project" });
    }
  });

  // Update project annotations
  app.put("/api/projects/:id/annotations", async (req, res) => {
    try {
      const { annotations } = req.body;
      const project = await storage.updateProjectAnnotations(req.params.id, annotations);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error updating annotations:", error);
      res.status(500).json({ error: "Failed to update annotations" });
    }
  });

  // Generate video from project
  app.post("/api/projects/:id/generate", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Update status to processing
      await storage.updateProjectStatus(req.params.id, "processing");

      // Start video generation in background
      const generateVideo = async () => {
        try {
          // Convert annotations to a descriptive prompt
          const prompt = generatePromptFromAnnotations(project.annotations as any[]);
          
          // Get the full URL for the image
          const baseUrl = req.protocol + '://' + req.get('host');
          const imageUrl = project.originalImageUrl.startsWith('http') 
            ? project.originalImageUrl 
            : baseUrl + project.originalImageUrl;

          console.log(`Generating video for project ${project.id} with prompt: "${prompt}"`);

          // 使用终极视频生成服务
          const result = await ultimateVideoGeneration.generateVideo({
            imageUrl,
            pathData: [], // TODO: 从annotations转换路径数据
            effect: 'zoom_in', // 默认效果
            duration: 8,
            quality: 'hd'
          });

          if (result) {
            // 直接更新项目状态为完成
            await storage.updateProject(req.params.id, {
              videoUrl: result,
              status: "completed"
            });
            console.log(`Ultimate video generation completed for project ${project.id}: ${result}`);
          } else {
            throw new Error('Video generation failed');
          }
        } catch (error) {
          console.error("Error in video generation:", error);
          await storage.updateProjectStatus(req.params.id, "failed");
        }
      };

      // Run video generation asynchronously
      generateVideo();

      res.json({ 
        message: "Video generation started", 
        projectId: req.params.id,
        estimatedTime: "12-20 minutes"
      });
    } catch (error) {
      console.error("Error starting video generation:", error);
      res.status(500).json({ error: "Failed to start video generation" });
    }
  });

  // Get project status
  app.get("/api/projects/:id/status", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ 
        status: project.status, 
        videoUrl: project.videoUrl,
        updatedAt: project.updatedAt 
      });
    } catch (error) {
      console.error("Error getting project status:", error);
      res.status(500).json({ error: "Failed to get project status" });
    }
  });

  // 注册终极视频API路由
  const { default: ultimateVideoRouter } = await import('./api/ultimate-video');
  app.use("/api/ultimate-video", ultimateVideoRouter);

  // 注册文件上传路由
  const { default: uploadRouter } = await import('./middleware/uploadHandler');
  app.use("/api/images", uploadRouter);

  const httpServer = createServer(app);
  return httpServer;
}
