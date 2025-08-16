/**
 * 简单可靠的视频生成服务 - 立即可用的MVP解决方案
 */

import { promises as fs } from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import fetch from 'node-fetch';

export interface SimpleVideoOptions {
  imageUrl: string;
  effect: string;
  duration?: number;
}

export class SimpleVideoGenerator {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
  }

  async generateVideo(options: SimpleVideoOptions): Promise<string> {
    console.log('🎬 Starting simple video generation...');
    
    try {
      // 1. 确保目录存在
      await fs.mkdir(this.uploadsDir, { recursive: true });
      
      // 2. 下载图片
      const imagePath = await this.downloadImage(options.imageUrl);
      
      // 3. 生成视频
      const videoPath = await this.createSimpleVideo(imagePath, options.effect, options.duration || 5);
      
      // 4. 返回公开URL
      const filename = path.basename(videoPath);
      const baseUrl = process.env.REPLIT_DOMAINS 
        ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
        : `http://localhost:${process.env.PORT || 5000}`;
      
      const publicUrl = `${baseUrl}/uploads/${filename}`;
      console.log('✅ Simple video generation completed:', publicUrl);
      
      return publicUrl;
      
    } catch (error) {
      console.error('❌ Simple video generation failed:', error);
      throw error;
    }
  }

  private async downloadImage(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    const filename = `input_${Date.now()}.jpg`;
    const imagePath = path.join(this.uploadsDir, filename);
    
    await fs.writeFile(imagePath, Buffer.from(buffer));
    return imagePath;
  }

  private async createSimpleVideo(imagePath: string, effect: string, duration: number): Promise<string> {
    const outputFilename = `video_${Date.now()}.mp4`;
    const outputPath = path.join(this.uploadsDir, outputFilename);
    
    return new Promise((resolve, reject) => {
      const filters = this.getVideoFilter(effect, duration);
      
      ffmpeg(imagePath)
        .inputOptions(['-loop', '1'])
        .outputOptions([
          '-c:v', 'libx264',
          '-t', duration.toString(),
          '-pix_fmt', 'yuv420p',
          '-vf', filters,
          '-r', '24'
        ])
        .output(outputPath)
        .on('start', (cmd) => {
          console.log('🎬 FFmpeg command:', cmd);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log('🎬 Progress:', Math.round(progress.percent) + '%');
          }
        })
        .on('end', () => {
          console.log('✅ Video created successfully');
          resolve(outputPath);
        })
        .on('error', (err) => {
          console.error('❌ FFmpeg error:', err.message);
          reject(new Error(`Video generation failed: ${err.message}`));
        })
        .run();
    });
  }

  private getVideoFilter(effect: string, duration: number): string {
    const filters = {
      zoom_in: `scale=1024*(1+0.5*t/${duration}):576*(1+0.5*t/${duration}):force_original_aspect_ratio=decrease,pad=1024:576:(ow-iw)/2:(oh-ih)/2`,
      orbit: `rotate=2*PI*t/${duration}:ow=1024:oh=576:c=black`,
      pull_back: `scale=1024*(2-0.5*t/${duration}):576*(2-0.5*t/${duration}):force_original_aspect_ratio=decrease,pad=1024:576:(ow-iw)/2:(oh-ih)/2`,
      crash_zoom: `scale=1024*(1+t/${duration}):576*(1+t/${duration}):force_original_aspect_ratio=decrease,pad=1024:576:(ow-iw)/2:(oh-ih)/2`,
      floating_follow: `translate=20*sin(2*PI*t/${duration}):15*cos(2*PI*t/${duration}),scale=1024:576:force_original_aspect_ratio=decrease,pad=1024:576:(ow-iw)/2:(oh-ih)/2`
    };
    
    return filters[effect as keyof typeof filters] || filters.zoom_in;
  }
}