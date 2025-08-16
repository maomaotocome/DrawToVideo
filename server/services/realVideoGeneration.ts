/**
 * 🎬 真实视频生成服务 - 集成Stable Video Diffusion
 * 替换演示模式，提供真正的AI视频生成能力
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import ffmpeg from 'fluent-ffmpeg';
import { VideoGenerationOptions } from './videoGeneration';
import { UltimateCameraEngine } from './ultimateCameraEngine';

export class RealVideoGenerationService {
  private replicateApiKey: string | undefined;
  private cameraEngine: UltimateCameraEngine;
  private tempDir: string;

  constructor() {
    this.replicateApiKey = process.env.REPLICATE_API_TOKEN;
    this.cameraEngine = new UltimateCameraEngine();
    this.tempDir = path.join(process.cwd(), 'temp');
    this.ensureTempDir();
    console.log('🎬 Real Video Generation Service initialized');
  }

  private async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  /**
   * 真实视频生成 - 使用Stable Video Diffusion
   */
  async generateVideo(options: VideoGenerationOptions): Promise<string> {
    const startTime = Date.now();
    console.log(`🚀 Starting real video generation with ${options.effect}`);

    try {
      // 1. 生成电影级相机轨迹
      const trajectory = await this.cameraEngine.generateCinematicTrajectory(
        options.pathData,
        options.effect,
        options.duration || 5,
        options.quality || 'hd'
      );

      // 2. 创建运动描述符
      const motionPrompt = this.createMotionPrompt(options.effect, trajectory);

      // 3. 准备图像输入
      const processedImagePath = await this.preprocessImage(options.imageUrl);

      // 4. 调用视频生成API
      const videoUrl = await this.callVideoGenerationAPI(
        processedImagePath,
        motionPrompt,
        options
      );

      // 5. 后处理和优化
      const finalVideoUrl = await this.postProcessVideo(videoUrl, options);

      const generationTime = Date.now() - startTime;
      console.log(`✅ Real video generated in ${generationTime}ms`);

      return finalVideoUrl;

    } catch (error) {
      console.error('❌ Real video generation failed:', error);
      throw error;
    }
  }

  /**
   * 创建运动描述符
   */
  private createMotionPrompt(effect: string, trajectory: any): string {
    const motionDescriptors = {
      zoom_in: "smooth camera push forward, cinematic dolly in, professional film quality, steady motion, focus pull",
      orbit: "circular camera movement around subject, 360 degree rotation, smooth orbital motion, professional cinematography",
      pull_back: "dramatic camera pull back, revealing shot, wide establishing movement, cinema quality dolly out",
      dramatic_spiral: "dynamic spiral camera movement, swirling motion, energy and drama, viral video style",
      vertigo_effect: "dolly zoom effect, Hitchcock zoom, disorienting camera movement, professional film technique",
      bullet_time: "Matrix-style 360 rotation, time freeze effect, slow motion bullet time, cinematic revolution",
      crash_zoom: "rapid aggressive zoom, fast camera push, action movie style, dynamic crash movement",
      floating_follow: "smooth floating camera, organic movement, dreamy cinematography, gentle following motion"
    };

    const basePrompt = motionDescriptors[effect as keyof typeof motionDescriptors] || motionDescriptors.zoom_in;
    
    return `${basePrompt}, high quality video, professional lighting, smooth motion blur, 24fps cinematic, no artifacts`;
  }

  /**
   * 预处理图像
   */
  private async preprocessImage(imageUrl: string): Promise<string> {
    try {
      // 下载图像
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      
      const imageBuffer = await response.buffer();
      const inputPath = path.join(this.tempDir, `input_${Date.now()}.jpg`);
      
      await fs.writeFile(inputPath, imageBuffer);
      
      // 图像预处理 - 调整尺寸和质量
      const outputPath = await this.resizeImage(inputPath);
      
      return outputPath;
      
    } catch (error) {
      console.error('Image preprocessing failed:', error);
      throw error;
    }
  }

  /**
   * 调整图像尺寸
   */
  private async resizeImage(inputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const outputPath = path.join(this.tempDir, `processed_${Date.now()}.jpg`);
      
      // 使用 ffmpeg 进行图像处理
      const ffmpeg = spawn('ffmpeg', [
        '-i', inputPath,
        '-vf', 'scale=1024:576:force_original_aspect_ratio=decrease,pad=1024:576:(ow-iw)/2:(oh-ih)/2',
        '-quality', '95',
        '-y',
        outputPath
      ]);

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(outputPath);
        } else {
          // 如果 ffmpeg 失败，使用原图像
          resolve(inputPath);
        }
      });

      ffmpeg.on('error', () => {
        // 如果 ffmpeg 不可用，使用原图像
        resolve(inputPath);
      });
    });
  }

  /**
   * 调用视频生成API
   */
  private async callVideoGenerationAPI(
    imagePath: string,
    motionPrompt: string,
    options: VideoGenerationOptions
  ): Promise<string> {
    
    // 方案1: 尝试 Replicate Stable Video Diffusion
    if (this.replicateApiKey) {
      try {
        return await this.callReplicateAPI(imagePath, motionPrompt, options);
      } catch (error) {
        console.log('Replicate API failed, trying alternative...');
      }
    }

    // 方案2: 本地处理（使用 ffmpeg 创建运动效果）
    return await this.generateLocalMotionVideo(imagePath, options);
  }

  /**
   * Replicate API 调用
   */
  private async callReplicateAPI(
    imagePath: string,
    motionPrompt: string,
    options: VideoGenerationOptions
  ): Promise<string> {
    
    const imageBase64 = await fs.readFile(imagePath, { encoding: 'base64' });
    const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;
    
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${this.replicateApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "5f0af177b649ad5c2fbdce5d32db4b2e4ccd6b52",
        input: {
          image: imageDataUri,
          motion_prompt: motionPrompt,
          num_frames: Math.min((options.duration || 5) * 24, 120),
          fps: 24,
          quality: options.quality === '4k' ? 'high' : 'medium'
        }
      }),
    }) as any;

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.statusText}`);
    }

    const prediction = await response.json();
    
    // 等待处理完成
    return await this.waitForReplicateCompletion(prediction.id);
  }

  /**
   * 等待 Replicate 处理完成
   */
  private async waitForReplicateCompletion(predictionId: string): Promise<string> {
    const maxWait = 5 * 60 * 1000; // 5分钟
    const interval = 3000; // 3秒
    let waited = 0;

    while (waited < maxWait) {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${this.replicateApiKey}`,
        },
      }) as any;

      const prediction = await response.json();
      
      if (prediction.status === 'succeeded') {
        return prediction.output;
      }
      
      if (prediction.status === 'failed') {
        throw new Error('Replicate generation failed: ' + prediction.error);
      }

      await new Promise(resolve => setTimeout(resolve, interval));
      waited += interval;
    }

    throw new Error('Video generation timeout');
  }

  /**
   * 本地运动视频生成（高质量ffmpeg方案）
   */
  private async generateLocalMotionVideo(
    imagePath: string,
    options: VideoGenerationOptions
  ): Promise<string> {
    
    console.log('🎬 Using high-quality local generation with FFmpeg');
    
    try {
      // 导入FFmpeg处理器
      const { ffmpegProcessor } = await import('./ffmpegProcessor');
      
      // 检查FFmpeg可用性
      const isFFmpegAvailable = await ffmpegProcessor.checkFFmpegAvailability();
      if (!isFFmpegAvailable) {
        throw new Error('FFmpeg not available for local video generation');
      }
      
      // 生成运动视频
      const videoPath = await ffmpegProcessor.createMotionVideo(
        imagePath, 
        options.effect, 
        options.duration || 5
      );
      
      // 应用视觉增强
      const enhancedVideoPath = await ffmpegProcessor.enhanceVideo(videoPath, options.effect);
      
      // 上传到对象存储
      const uploadedUrl = await this.uploadToStorage(enhancedVideoPath);
      
      console.log('✅ High-quality local video generated successfully');
      return uploadedUrl;
      
    } catch (error) {
      console.error('Local video generation failed:', error);
      throw new Error(`Local generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取 FFmpeg 运动滤镜
   */
  private getFFmpegMotionFilter(effect: string, duration: number): string {
    const filters = {
      zoom_in: `scale=1024*(1+0.5*t/${duration}):576*(1+0.5*t/${duration}):force_original_aspect_ratio=decrease,pad=1024:576:(ow-iw)/2:(oh-ih)/2`,
      orbit: `rotate=2*PI*t/${duration}:ow=1024:oh=576:c=black`,
      pull_back: `scale=1024*(2-t/${duration}):576*(2-t/${duration}):force_original_aspect_ratio=decrease,pad=1024:576:(ow-iw)/2:(oh-ih)/2`,
      dramatic_spiral: `rotate=4*PI*t/${duration}:ow=1024:oh=576:c=black,scale=1024*(1+0.3*sin(4*PI*t/${duration})):576*(1+0.3*sin(4*PI*t/${duration}))`,
      crash_zoom: `scale=1024*(1+2*pow(t/${duration},3)):576*(1+2*pow(t/${duration},3)):force_original_aspect_ratio=decrease,pad=1024:576:(ow-iw)/2:(oh-ih)/2`,
      floating_follow: `translate=30*sin(2*PI*t/${duration}):20*cos(2*PI*t/${duration})`,
      vertigo_effect: `scale=1024*(1+0.5*t/${duration}):576*(1+0.5*t/${duration}):force_original_aspect_ratio=decrease,pad=1024:576:(ow-iw)/2:(oh-ih)/2`,
      bullet_time: `rotate=2*PI*t/${duration}:ow=1024:oh=576:c=black`
    };
    
    return filters[effect as keyof typeof filters] || filters.zoom_in;
  }

  /**
   * 上传到对象存储
   */
  private async uploadToStorage(videoPath: string): Promise<string> {
    try {
      // 使用 Replit 对象存储
      const fileName = `generated_${Date.now()}.mp4`;
      const formData = new FormData();
      formData.append('file', await fs.readFile(videoPath), fileName);

      const uploadResponse = await fetch('http://localhost:5000/api/images/upload', {
        method: 'POST'
      }) as any;
      
      const { uploadURL } = await uploadResponse.json();
      
      const uploadResult = await fetch(uploadURL, {
        method: 'PUT',
        body: await fs.readFile(videoPath),
        headers: {
          'Content-Type': 'video/mp4'
        }
      }) as any;

      if (uploadResult.ok) {
        // 清理临时文件
        fs.unlink(videoPath).catch(console.error);
        return uploadURL.split('?')[0];
      } else {
        throw new Error('Upload failed');
      }
      
    } catch (error) {
      console.error('Storage upload failed:', error);
      // 返回本地文件路径作为后备
      return `/temp/${path.basename(videoPath)}`;
    }
  }

  /**
   * 后处理视频
   */
  private async postProcessVideo(videoUrl: string, options: VideoGenerationOptions): Promise<string> {
    // 这里可以添加额外的后处理步骤
    // 比如颜色分级、音频处理等
    return videoUrl;
  }
}

export const realVideoGeneration = new RealVideoGenerationService();