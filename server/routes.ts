import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService } from "./objectStorage";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const objectStorageService = new ObjectStorageService();

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

      // Simulate video generation (in real implementation, this would call AI service)
      setTimeout(async () => {
        try {
          // In production, this would generate actual video
          const mockVideoUrl = "/objects/uploads/mock-video-" + project.id + ".mp4";
          await storage.updateProject(req.params.id, {
            videoUrl: mockVideoUrl,
            status: "completed"
          });
        } catch (error) {
          console.error("Error in video generation:", error);
          await storage.updateProjectStatus(req.params.id, "failed");
        }
      }, 3000);

      res.json({ message: "Video generation started", projectId: req.params.id });
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

  const httpServer = createServer(app);
  return httpServer;
}
