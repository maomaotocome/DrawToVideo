/**
 * 🎬 FFmpeg视频处理器 - 本地视频生成的增强引擎
 * 当API不可用时提供高质量的本地视频生成
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

export class FFmpegProcessor {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp');
    this.ensureTempDir();
  }

  private async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  /**
   * 创建高质量运动视频
   */
  async createMotionVideo(
    imagePath: string, 
    effect: string, 
    duration: number
  ): Promise<string> {
    const outputPath = path.join(this.tempDir, `video_${Date.now()}.mp4`);
    
    const motionFilter = this.getAdvancedMotionFilter(effect, duration);
    
    return new Promise((resolve, reject) => {
      const ffmpegArgs = [
        '-loop', '1',
        '-i', imagePath,
        '-vf', motionFilter,
        '-t', duration.toString(),
        '-pix_fmt', 'yuv420p',
        '-c:v', 'libx264',
        '-crf', '18', // 高质量编码
        '-preset', 'slow', // 更好的压缩
        '-movflags', '+faststart',
        '-r', '24',
        '-y',
        outputPath
      ];

      const ffmpeg = spawn('ffmpeg', ffmpegArgs);
      
      let stderr = '';
      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(outputPath);
        } else {
          reject(new Error(`FFmpeg failed with code ${code}: ${stderr}`));
        }
      });

      ffmpeg.on('error', (error) => {
        reject(new Error(`FFmpeg spawn error: ${error.message}`));
      });
    });
  }

  /**
   * 生成高级运动滤镜
   */
  private getAdvancedMotionFilter(effect: string, duration: number): string {
    const t = `t/${duration}`;
    
    const filters = {
      zoom_in: `scale=1024*(1+0.8*${t}):576*(1+0.8*${t}):force_original_aspect_ratio=decrease:eval=frame,pad=1024:576:(ow-iw)/2:(oh-ih)/2:eval=frame,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc`,
      
      orbit: `rotate=${2*Math.PI}*${t}:ow=1024:oh=576:c=black:eval=frame,minterpolate=fps=24`,
      
      pull_back: `scale=1024*(2-1.5*${t}):576*(2-1.5*${t}):force_original_aspect_ratio=decrease:eval=frame,pad=1024:576:(ow-iw)/2:(oh-ih)/2:eval=frame`,
      
      dramatic_spiral: `rotate=4*PI*${t}:ow=1024:oh=576:c=black:eval=frame,scale=1024*(1+0.5*sin(4*PI*${t})):576*(1+0.5*sin(4*PI*${t})):eval=frame,minterpolate=fps=24:mi_mode=mci`,
      
      crash_zoom: `scale=1024*(1+3*pow(${t},2.5)):576*(1+3*pow(${t},2.5)):force_original_aspect_ratio=decrease:eval=frame,pad=1024:576:(ow-iw)/2:(oh-ih)/2:eval=frame`,
      
      floating_follow: `translate=40*sin(3*PI*${t}):25*cos(2*PI*${t}):eval=frame,scale=1024*(1+0.1*sin(6*PI*${t})):576*(1+0.1*sin(6*PI*${t})):eval=frame`,
      
      vertigo_effect: `scale=1024*(1+0.6*${t}):576*(1+0.6*${t}):force_original_aspect_ratio=decrease:eval=frame,pad=1024:576:(ow-iw)/2:(oh-ih)/2:eval=frame,perspective=x0=50*${t}:y0=30*${t}:x1=1024-50*${t}:y1=30*${t}:x2=50*${t}:y2=576-30*${t}:x3=1024-50*${t}:y3=576-30*${t}:eval=frame`,
      
      bullet_time: `rotate=2*PI*${t}:ow=1024:oh=576:c=black:eval=frame,scale=1024*(1+0.2*sin(PI*${t})):576*(1+0.2*sin(PI*${t})):eval=frame,minterpolate=fps=24:mi_mode=blend`
    };
    
    return filters[effect as keyof typeof filters] || filters.zoom_in;
  }

  /**
   * 检查FFmpeg是否可用
   */
  async checkFFmpegAvailability(): Promise<boolean> {
    return new Promise((resolve) => {
      const ffmpeg = spawn('ffmpeg', ['-version']);
      ffmpeg.on('close', (code) => resolve(code === 0));
      ffmpeg.on('error', () => resolve(false));
    });
  }

  /**
   * 添加音效和增强效果
   */
  async enhanceVideo(inputPath: string, effect: string): Promise<string> {
    const outputPath = path.join(this.tempDir, `enhanced_${Date.now()}.mp4`);
    
    // 根据效果类型添加适当的视觉增强
    const enhancementFilter = this.getEnhancementFilter(effect);
    
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', inputPath,
        '-vf', enhancementFilter,
        '-c:v', 'libx264',
        '-crf', '20',
        '-preset', 'medium',
        '-y',
        outputPath
      ]);

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          // 清理原文件
          fs.unlink(inputPath).catch(console.error);
          resolve(outputPath);
        } else {
          reject(new Error(`Enhancement failed with code ${code}`));
        }
      });

      ffmpeg.on('error', reject);
    });
  }

  /**
   * 获取视觉增强滤镜
   */
  private getEnhancementFilter(effect: string): string {
    const enhancements = {
      zoom_in: 'unsharp=5:5:1.0:5:5:0.0,eq=contrast=1.1:brightness=0.05:saturation=1.1',
      orbit: 'unsharp=3:3:0.8,eq=contrast=1.05:saturation=1.05',
      dramatic_spiral: 'unsharp=7:7:1.2,eq=contrast=1.2:brightness=0.1:saturation=0.95,curves=vintage',
      crash_zoom: 'unsharp=9:9:1.5,eq=contrast=1.3:brightness=0.15:gamma=0.95',
      vertigo_effect: 'unsharp=5:5:1.0,eq=contrast=1.15:saturation=0.9:gamma=1.1',
      bullet_time: 'unsharp=3:3:0.7,eq=contrast=1.1:brightness=0.05,curves=strong_contrast',
      pull_back: 'unsharp=4:4:0.9,eq=contrast=1.08:saturation=1.02',
      floating_follow: 'unsharp=2:2:0.5,eq=contrast=1.02:brightness=0.02:saturation=1.05'
    };
    
    return enhancements[effect as keyof typeof enhancements] || enhancements.zoom_in;
  }
}

export const ffmpegProcessor = new FFmpegProcessor();