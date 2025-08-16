import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

// 专业相机运动预设
export const CAMERA_PRESETS = {
  zoom_in: {
    name: "Zoom In",
    description: "Camera pushes forward along path - perfect for product reveals",
    motionType: "linear_zoom",
    speedCurve: "ease_in_out",
    parameters: {
      startScale: 1.0,
      endScale: 2.5,
      focusPoint: "path_center"
    }
  },
  orbit: {
    name: "Orbit", 
    description: "Camera circles around subject - great for 360° showcases",
    motionType: "circular_orbit",
    speedCurve: "constant",
    parameters: {
      radius: 3.0,
      height: 0.0,
      rotationSpeed: 1.0
    }
  },
  pull_back: {
    name: "Pull Back",
    description: "Camera pulls away to reveal bigger picture",
    motionType: "exponential_pullback", 
    speedCurve: "ease_out",
    parameters: {
      startScale: 2.0,
      endScale: 0.5,
      revealType: "wide_shot"
    }
  }
};

export interface PathPoint {
  x: number;
  y: number;
  timestamp?: number;
}

export interface VideoGenerationOptions {
  imageUrl: string;
  pathData: PathPoint[];
  effect: keyof typeof CAMERA_PRESETS;
  duration?: number;
  quality?: 'sd' | 'hd' | '4k';
}

export class VideoGenerationService {
  private apiEndpoint = process.env.REPLICATE_API_URL;
  private apiKey = process.env.REPLICATE_API_TOKEN;

  /**
   * 核心算法: 将用户绘制路径转换为专业相机运动
   */
  private pathToCameraTrajectory(pathData: PathPoint[], effect: keyof typeof CAMERA_PRESETS) {
    const preset = CAMERA_PRESETS[effect];
    const trajectory = [];
    
    // 路径平滑处理
    const smoothedPath = this.smoothPath(pathData);
    
    for (let i = 0; i < smoothedPath.length; i++) {
      const point = smoothedPath[i];
      const progress = i / (smoothedPath.length - 1);
      
      let cameraMatrix;
      
      switch (effect) {
        case 'zoom_in':
          cameraMatrix = this.createZoomInMatrix(point, progress, preset.parameters);
          break;
        case 'orbit':
          cameraMatrix = this.createOrbitMatrix(point, progress, preset.parameters);
          break;
        case 'pull_back':
          cameraMatrix = this.createPullBackMatrix(point, progress, preset.parameters);
          break;
      }
      
      trajectory.push(cameraMatrix);
    }
    
    return trajectory;
  }

  /**
   * Zoom In 效果: 沿路径推进
   */
  private createZoomInMatrix(point: PathPoint, progress: number, params: any) {
    // 计算缩放 (从1.0到2.5)
    const scale = params.startScale + (params.endScale - params.startScale) * progress;
    
    // 计算位移 (跟随路径)
    const tx = (point.x - 0.5) * 2; // 归一化坐标转世界坐标
    const ty = (point.y - 0.5) * 2;
    const tz = -2 + progress * 1.5; // Z轴推进
    
    return {
      position: [tx, ty, tz],
      rotation: [0, 0, 0],
      scale: scale,
      fov: 45 - progress * 10 // FOV收窄增强推进感
    };
  }

  /**
   * Orbit 效果: 环绕运动
   */
  private createOrbitMatrix(point: PathPoint, progress: number, params: any) {
    // 以路径中心为轴心旋转
    const centerX = 0.5; // 可以基于路径计算实际中心
    const centerY = 0.5;
    
    const angle = progress * Math.PI * 2; // 完整360度
    const radius = params.radius;
    
    const tx = centerX + Math.cos(angle) * radius;
    const ty = centerY + Math.sin(angle) * radius;
    const tz = params.height;
    
    // 相机始终看向中心
    const lookAtX = centerX;
    const lookAtY = centerY;
    const rotationY = angle + Math.PI; // 面向中心
    
    return {
      position: [tx, ty, tz],
      rotation: [0, rotationY, 0],
      scale: 1.0,
      fov: 45
    };
  }

  /**
   * Pull Back 效果: 拉远揭示
   */
  private createPullBackMatrix(point: PathPoint, progress: number, params: any) {
    // 指数式拉远
    const scale = params.startScale * Math.pow(params.endScale / params.startScale, progress);
    
    // 沿路径反向运动
    const tx = (point.x - 0.5) * (2 - progress);
    const ty = (point.y - 0.5) * (2 - progress);
    const tz = -1 - progress * 3; // 快速后退
    
    return {
      position: [tx, ty, tz],
      rotation: [0, 0, 0], 
      scale: scale,
      fov: 45 + progress * 20 // FOV扩大显示更多场景
    };
  }

  /**
   * 路径平滑算法 (Douglas-Peucker + 贝塞尔曲线)
   */
  private smoothPath(pathData: PathPoint[]): PathPoint[] {
    if (pathData.length < 3) return pathData;
    
    // 1. Douglas-Peucker算法简化路径
    const simplified = this.douglasPeucker(pathData, 2.0);
    
    // 2. 贝塞尔曲线平滑
    const smoothed = this.bezierSmooth(simplified);
    
    // 3. 重新采样到固定帧数 (25帧)
    return this.resamplePath(smoothed, 25);
  }

  private douglasPeucker(points: PathPoint[], tolerance: number): PathPoint[] {
    if (points.length <= 2) return points;
    
    let maxDistance = 0;
    let maxIndex = 0;
    
    // 找到距离首尾连线最远的点
    for (let i = 1; i < points.length - 1; i++) {
      const distance = this.pointToLineDistance(
        points[i], 
        points[0], 
        points[points.length - 1]
      );
      
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }
    
    // 如果最大距离大于容差，递归简化
    if (maxDistance > tolerance) {
      const left = this.douglasPeucker(points.slice(0, maxIndex + 1), tolerance);
      const right = this.douglasPeucker(points.slice(maxIndex), tolerance);
      
      return [...left.slice(0, -1), ...right];
    } else {
      return [points[0], points[points.length - 1]];
    }
  }

  private pointToLineDistance(point: PathPoint, lineStart: PathPoint, lineEnd: PathPoint): number {
    const A = lineEnd.y - lineStart.y;
    const B = lineStart.x - lineEnd.x;
    const C = lineEnd.x * lineStart.y - lineStart.x * lineEnd.y;
    
    return Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B);
  }

  private bezierSmooth(points: PathPoint[]): PathPoint[] {
    if (points.length < 3) return points;
    
    const smoothed = [points[0]];
    
    for (let i = 1; i < points.length - 1; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      
      // 三次贝塞尔插值
      for (let t = 0; t <= 1; t += 0.1) {
        const x = this.bezierInterpolate(p0.x, p1.x, p2.x, t);
        const y = this.bezierInterpolate(p0.y, p1.y, p2.y, t);
        smoothed.push({ x, y });
      }
    }
    
    smoothed.push(points[points.length - 1]);
    return smoothed;
  }

  private bezierInterpolate(p0: number, p1: number, p2: number, t: number): number {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }

  private resamplePath(points: PathPoint[], targetFrames: number): PathPoint[] {
    if (points.length <= targetFrames) return points;
    
    const resampled = [];
    const step = (points.length - 1) / (targetFrames - 1);
    
    for (let i = 0; i < targetFrames; i++) {
      const index = i * step;
      const lowerIndex = Math.floor(index);
      const upperIndex = Math.ceil(index);
      const fraction = index - lowerIndex;
      
      if (lowerIndex === upperIndex) {
        resampled.push(points[lowerIndex]);
      } else {
        // 线性插值
        const x = points[lowerIndex].x + (points[upperIndex].x - points[lowerIndex].x) * fraction;
        const y = points[lowerIndex].y + (points[upperIndex].y - points[lowerIndex].y) * fraction;
        resampled.push({ x, y });
      }
    }
    
    return resampled;
  }

  /**
   * 主要的视频生成方法
   */
  async generateVideo(options: VideoGenerationOptions): Promise<string> {
    try {
      // 1. 路径处理和相机轨迹生成
      const cameraTrajectory = this.pathToCameraTrajectory(
        options.pathData, 
        options.effect
      );
      
      // 2. 调用Stable Video Diffusion API
      const videoUrl = await this.callVideoGenerationAPI({
        image: options.imageUrl,
        cameraTrajectory,
        duration: options.duration || 5,
        quality: options.quality || 'hd'
      });
      
      return videoUrl;
      
    } catch (error) {
      console.error('Video generation failed:', error);
      throw new Error(`Failed to generate video: ${error.message}`);
    }
  }

  /**
   * 调用外部API生成视频 (使用Replicate/自建)
   */
  private async callVideoGenerationAPI(params: any): Promise<string> {
    if (process.env.NODE_ENV === 'development') {
      // 开发环境返回示例视频
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    }
    
    // TODO: 集成实际的视频生成API
    // 这里可以接入：
    // 1. Replicate API (Stable Video Diffusion)
    // 2. 自部署的模型服务
    // 3. Higgsfield API (如果有公开API)
    
    const response = await fetch(`${this.apiEndpoint}/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'stability-ai/stable-video-diffusion',
        input: {
          input_image: params.image,
          motion_bucket_id: this.calculateMotionIntensity(params.cameraTrajectory),
          frames_per_second: 24,
          cond_aug: 0.02
        }
      })
    });
    
    const result = await response.json();
    return result.output[0]; // 视频URL
  }

  private calculateMotionIntensity(trajectory: any[]): number {
    // 基于轨迹计算运动强度 (1-255)
    let totalMovement = 0;
    
    for (let i = 1; i < trajectory.length; i++) {
      const curr = trajectory[i];
      const prev = trajectory[i - 1];
      
      const dx = curr.position[0] - prev.position[0];
      const dy = curr.position[1] - prev.position[1];
      const dz = curr.position[2] - prev.position[2];
      
      totalMovement += Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
    
    // 归一化到1-255范围
    return Math.min(255, Math.max(1, Math.floor(totalMovement * 50)));
  }

  /**
   * 获取生成进度
   */
  async getGenerationProgress(taskId: string): Promise<{ status: string, progress: number, videoUrl?: string }> {
    // 实现生成进度查询
    // 这里可以查询Redis或数据库中的任务状态
    return {
      status: 'completed',
      progress: 100,
      videoUrl: 'https://example.com/generated-video.mp4'
    };
  }
}

export const videoGeneration = new VideoGenerationService();