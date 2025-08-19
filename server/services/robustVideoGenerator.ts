/**
 * 🎬 鲁棒性视频生成器 - 解决FFmpeg依赖问题的完整解决方案
 * 提供多种fallback机制，确保视频生成功能始终可用
 */

import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import fetch from 'node-fetch';

export interface RobustVideoOptions {
  imageUrl: string;
  effect: string;
  duration?: number;
  fallbackMode?: 'css_animation' | 'canvas_frames' | 'demo_video';
}

export class RobustVideoGenerator {
  private uploadsDir: string;
  private ffmpegAvailable: boolean = false;
  private replicateApiKey: string | undefined;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.replicateApiKey = process.env.REPLICATE_API_TOKEN;
    this.checkFFmpegAvailability();
  }

  /**
   * 检查FFmpeg可用性
   */
  private async checkFFmpegAvailability(): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', ['-version']);
        ffmpeg.on('close', (code) => {
          if (code === 0) {
            this.ffmpegAvailable = true;
            console.log('✅ FFmpeg detected and available');
            resolve(void 0);
          } else {
            reject(new Error('FFmpeg not working'));
          }
        });
        ffmpeg.on('error', () => reject(new Error('FFmpeg not found')));
      });
    } catch (error) {
      console.log('⚠️ FFmpeg not available, using fallback methods');
      this.ffmpegAvailable = false;
    }
  }

  /**
   * 主要生成方法 - 智能选择最佳策略
   */
  async generateVideo(options: RobustVideoOptions): Promise<string> {
    console.log('🚀 Starting robust video generation...');
    
    try {
      // 确保目录存在
      await fs.mkdir(this.uploadsDir, { recursive: true });
      
      // 策略1: 使用FFmpeg (如果可用)
      if (this.ffmpegAvailable) {
        console.log('🎬 Using FFmpeg generation');
        return await this.generateWithFFmpeg(options);
      }
      
      // 策略2: 使用Replicate API (如果配置)
      if (this.replicateApiKey) {
        console.log('🤖 Using Replicate API generation');
        return await this.generateWithReplicate(options);
      }
      
      // 策略3: 生成CSS动画版本 (最终fallback)
      console.log('🎨 Using CSS animation fallback');
      return await this.generateCSSAnimationFallback(options);
      
    } catch (error) {
      console.error('❌ All generation methods failed:', error);
      throw new Error(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * FFmpeg生成方法 (改进版)
   */
  private async generateWithFFmpeg(options: RobustVideoOptions): Promise<string> {
    const imagePath = await this.downloadImage(options.imageUrl);
    const outputFilename = `video_${Date.now()}.mp4`;
    const outputPath = path.join(this.uploadsDir, outputFilename);
    
    return new Promise((resolve, reject) => {
      const filter = this.getImprovedVideoFilter(options.effect, options.duration || 5);
      const duration = (options.duration || 5).toString();
      
      console.log('🎬 FFmpeg command will use filter:', filter);
      
      const ffmpeg = spawn('ffmpeg', [
        '-loop', '1',
        '-i', imagePath,
        '-c:v', 'libx264',
        '-t', duration,
        '-pix_fmt', 'yuv420p',
        '-vf', filter,
        '-r', '24',
        '-y', // Overwrite output file
        outputPath
      ]);

      let errorOutput = '';
      
      ffmpeg.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          console.log('✅ FFmpeg generation successful');
          const publicUrl = this.getPublicUrl(outputFilename);
          resolve(publicUrl);
        } else {
          console.error('❌ FFmpeg failed with code:', code);
          console.error('Error output:', errorOutput);
          reject(new Error(`FFmpeg failed with exit code ${code}`));
        }
      });

      ffmpeg.on('error', (err) => {
        console.error('❌ FFmpeg spawn error:', err);
        reject(new Error(`FFmpeg error: ${err.message}`));
      });
    });
  }

  /**
   * Replicate API生成方法
   */
  private async generateWithReplicate(options: RobustVideoOptions): Promise<string> {
    console.log('🤖 Attempting Replicate API generation...');
    
    try {
      const imageBase64 = await this.imageToBase64(options.imageUrl);
      
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.replicateApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "5f0af177b649ad5c2fbdce5d32db4b2e4ccd6b52", // Stable Video Diffusion
          input: {
            image: `data:image/jpeg;base64,${imageBase64}`,
            motion_bucket_id: this.getMotionIntensity(options.effect),
            num_frames: Math.min((options.duration || 5) * 6, 30), // Max 30 frames
            fps: 6,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.statusText}`);
      }

      const prediction = await response.json();
      return await this.waitForReplicateCompletion(prediction.id);
      
    } catch (error) {
      console.error('❌ Replicate API failed:', error);
      throw error;
    }
  }

  /**
   * CSS动画fallback - 创建HTML5视频替代
   */
  private async generateCSSAnimationFallback(options: RobustVideoOptions): Promise<string> {
    console.log('🎨 Generating CSS animation fallback...');
    
    const imagePath = await this.downloadImage(options.imageUrl);
    const htmlFilename = `animation_${Date.now()}.html`;
    const htmlPath = path.join(this.uploadsDir, htmlFilename);
    
    const animationHtml = this.createAnimationHTML(imagePath, options.effect, options.duration || 5);
    await fs.writeFile(htmlPath, animationHtml);
    
    // 创建一个JSON描述符，前端可以使用这个来显示动画
    const descriptorFilename = `animation_${Date.now()}.json`;
    const descriptorPath = path.join(this.uploadsDir, descriptorFilename);
    
    const animationDescriptor = {
      type: 'css_animation',
      imageUrl: this.getPublicUrl(path.basename(imagePath)),
      effect: options.effect,
      duration: options.duration || 5,
      htmlUrl: this.getPublicUrl(htmlFilename),
      instructions: '这是一个CSS动画fallback。请在前端使用CSS动画来模拟视频效果。'
    };
    
    await fs.writeFile(descriptorPath, JSON.stringify(animationDescriptor, null, 2));
    return this.getPublicUrl(descriptorFilename);
  }

  /**
   * 创建动画HTML
   */
  private createAnimationHTML(imagePath: string, effect: string, duration: number): string {
    const imageFilename = path.basename(imagePath);
    const publicImageUrl = this.getPublicUrl(imageFilename);
    
    const animations = {
      zoom_in: `
        @keyframes zoomIn {
          from { transform: scale(1) translate(0, 0); }
          to { transform: scale(2) translate(-25%, -25%); }
        }
        .animation { animation: zoomIn ${duration}s ease-in-out infinite; }
      `,
      orbit: `
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(50px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
        }
        .animation { animation: orbit ${duration}s linear infinite; }
      `,
      pull_back: `
        @keyframes pullBack {
          from { transform: scale(2) translate(-25%, -25%); }
          to { transform: scale(0.5) translate(50%, 50%); }
        }
        .animation { animation: pullBack ${duration}s ease-out infinite; }
      `,
      floating_follow: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animation { animation: float ${duration}s ease-in-out infinite; }
      `,
      crash_zoom: `
        @keyframes crashZoom {
          0% { transform: scale(1); }
          80% { transform: scale(1.1); }
          100% { transform: scale(3); }
        }
        .animation { animation: crashZoom ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; }
      `
    };

    const selectedAnimation = animations[effect as keyof typeof animations] || animations.zoom_in;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Draw to Video - ${effect} Effect</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }
        .container {
            width: 800px;
            height: 600px;
            position: relative;
            overflow: hidden;
            border: 2px solid #333;
            border-radius: 8px;
        }
        .animation {
            width: 100%;
            height: 100%;
            background-image: url('${publicImageUrl}');
            background-size: cover;
            background-position: center;
            transform-origin: center center;
        }
        ${selectedAnimation}
        .controls {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
        }
        .info {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="animation"></div>
        <div class="info">Effect: ${effect.replace('_', ' ').toUpperCase()}</div>
        <div class="controls">Duration: ${duration}s | CSS Animation Fallback</div>
    </div>
</body>
</html>`;
  }

  /**
   * 改进的视频滤镜
   */
  private getImprovedVideoFilter(effect: string, duration: number): string {
    const filters = {
      zoom_in: `scale=w=1024*min(2\\,1+0.8*t/${duration}):h=576*min(2\\,1+0.8*t/${duration}):eval=frame,crop=1024:576`,
      
      orbit: `rotate=2*PI*t/${duration}:fillcolor=black:ow=1024:oh=576,scale=1024:576:force_original_aspect_ratio=decrease,pad=1024:576:(ow-iw)/2:(oh-ih)/2`,
      
      pull_back: `scale=w=1024*max(0.3\\,2-1.7*t/${duration}):h=576*max(0.3\\,2-1.7*t/${duration}):eval=frame,pad=1024:576:(ow-iw)/2:(oh-ih)/2:black`,
      
      floating_follow: `translate=x=20*sin(2*PI*t/${duration}):y=15*cos(3*PI*t/${duration}),scale=1024:576:force_original_aspect_ratio=decrease,pad=1024:576:(ow-iw)/2:(oh-ih)/2`,
      
      crash_zoom: `scale=w=1024*min(4\\,1+3*pow(t/${duration}\\,2)):h=576*min(4\\,1+3*pow(t/${duration}\\,2)):eval=frame,crop=1024:576`,
      
      dramatic_spiral: `rotate=4*PI*t/${duration}:fillcolor=black:ow=1024:oh=576,scale=w=1024*min(2\\,1+sin(4*PI*t/${duration})*0.3):h=576*min(2\\,1+sin(4*PI*t/${duration})*0.3):eval=frame`,
      
      vertigo_effect: `scale=w=1024*(1+t/${duration}):h=576*(1+t/${duration}):eval=frame,crop=1024:576`
    };
    
    return filters[effect as keyof typeof filters] || filters.zoom_in;
  }

  /**
   * 下载图像
   */
  private async downloadImage(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      
      const buffer = await response.arrayBuffer();
      const filename = `input_${Date.now()}.jpg`;
      const imagePath = path.join(this.uploadsDir, filename);
      
      await fs.writeFile(imagePath, Buffer.from(buffer));
      console.log('✅ Image downloaded successfully');
      return imagePath;
      
    } catch (error) {
      console.error('❌ Image download failed:', error);
      throw error;
    }
  }

  /**
   * 转换图像为Base64
   */
  private async imageToBase64(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
  }

  /**
   * 等待Replicate完成
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
      });

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
   * 获取运动强度
   */
  private getMotionIntensity(effect: string): number {
    const intensityMap = {
      zoom_in: 127,
      orbit: 180,
      pull_back: 100,
      dramatic_spiral: 220,
      crash_zoom: 200,
      floating_follow: 80,
      vertigo_effect: 160
    };
    
    return intensityMap[effect as keyof typeof intensityMap] || 127;
  }

  /**
   * 获取公开URL
   */
  private getPublicUrl(filename: string): string {
    const baseUrl = process.env.REPLIT_DOMAINS 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
      : `http://localhost:${process.env.PORT || 5000}`;
    
    return `${baseUrl}/uploads/${filename}`;
  }

  /**
   * 健康检查方法
   */
  async healthCheck(): Promise<{ status: string; capabilities: string[] }> {
    await this.checkFFmpegAvailability();
    
    const capabilities = [];
    
    if (this.ffmpegAvailable) {
      capabilities.push('FFmpeg (Local High-Quality Generation)');
    }
    
    if (this.replicateApiKey) {
      capabilities.push('Replicate API (AI-Powered Generation)');
    }
    
    capabilities.push('CSS Animation Fallback (Always Available)');
    
    return {
      status: capabilities.length > 1 ? 'optimal' : 'degraded',
      capabilities
    };
  }
}

export const robustVideoGenerator = new RobustVideoGenerator();