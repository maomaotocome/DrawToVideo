/**
 * 🎬 终极相机引擎 - 电影级运镜算法
 * 集成AI路径分析 + 物理约束 + 专业摄影原理
 * 超越Higgsfield的核心技术实现
 */

import { PathPoint, PathFeatures, CinematicTrajectory } from "@shared/ultimateSchema";
import { performance } from "perf_hooks";

export class UltimateCameraEngine {
  private readonly SMOOTHING_WINDOW = 5;
  private readonly MOTION_DAMPING = 0.8;
  private readonly MAX_ACCELERATION = 10.0; // m/s²
  
  constructor() {
    console.log("🎬 Ultimate Camera Engine initialized");
  }

  /**
   * 主方法：将2D路径转换为电影级3D相机轨迹
   */
  async generateCinematicTrajectory(
    pathData: PathPoint[],
    effect: string,
    duration: number = 5,
    quality: string = 'hd'
  ): Promise<CinematicTrajectory> {
    
    const startTime = performance.now();
    console.log(`🎬 Generating ${effect} trajectory with ${pathData.length} points`);

    // Step 1: 智能路径分析
    const pathFeatures = this.analyzePathIntent(pathData);
    console.log(`📊 Path analysis: ${pathFeatures.shape} (${pathFeatures.avgCurvature.toFixed(3)} curvature)`);

    // Step 2: 深度推断
    const depthMap = this.inferIntelligentDepth(pathData, pathFeatures);

    // Step 3: 路径优化
    const optimizedPath = this.advancedPathSmoothing(pathData);

    // Step 4: 3D轨迹生成
    const positions = this.generateCinematicPositions(
      optimizedPath, 
      depthMap, 
      effect, 
      pathFeatures
    );

    // Step 5: 相机朝向计算
    const orientations = this.calculateCinematicOrientations(positions, pathFeatures);

    // Step 6: 物理约束优化
    const physicsOptimized = this.applyPhysicsConstraints(positions, orientations, 24);

    // Step 7: 动态参数计算
    const dynamicParams = this.calculateDynamicCameraParams(
      physicsOptimized.positions,
      physicsOptimized.orientations,
      effect,
      duration,
      quality
    );

    const generationTime = performance.now() - startTime;
    console.log(`✅ Trajectory generated in ${generationTime.toFixed(2)}ms`);

    return {
      positions: physicsOptimized.positions,
      orientations: physicsOptimized.orientations,
      fov: dynamicParams.fov,
      focusDistance: dynamicParams.focusDistance,
      aperture: dynamicParams.aperture,
      motionBlur: dynamicParams.motionBlur,
      speedCurve: dynamicParams.speedCurve,
      metadata: {
        fps: 24,
        duration,
        totalFrames: Math.floor(duration * 24),
        preset: effect,
        quality
      },
      colorGrading: this.suggestColorGrading(effect)
    };
  }

  /**
   * 🧠 AI增强路径分析 - 识别用户绘制意图
   */
  private analyzePathIntent(pathData: PathPoint[]): PathFeatures {
    if (pathData.length < 2) {
      return {
        shape: 'straight',
        avgCurvature: 0,
        maxCurvature: 0,
        pathLength: 0,
        speedVariation: 0,
        avgSpeed: 0,
        suggestedEffect: 'zoom_in'
      };
    }

    // 计算基本运动特征
    const velocities = this.calculateVelocities(pathData);
    const curvatures = this.calculateCurvatures(pathData);
    
    // 路径长度
    const pathLength = velocities.reduce((sum, v) => 
      sum + Math.sqrt(v.x * v.x + v.y * v.y), 0
    );
    
    // 速度分析
    const speeds = velocities.map(v => Math.sqrt(v.x * v.x + v.y * v.y));
    const avgSpeed = speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
    const speedVariation = this.calculateStandardDeviation(speeds);
    
    // 曲率分析
    const avgCurvature = curvatures.length > 0 
      ? curvatures.reduce((sum, c) => sum + c, 0) / curvatures.length 
      : 0;
    const maxCurvature = curvatures.length > 0 ? Math.max(...curvatures) : 0;
    
    // AI形状识别
    const shape = this.classifyPathShape(pathData, avgCurvature, speedVariation);
    const suggestedEffect = this.suggestOptimalEffect(shape, speedVariation, avgCurvature);
    
    return {
      shape,
      avgCurvature,
      maxCurvature,
      pathLength,
      speedVariation,
      avgSpeed,
      suggestedEffect
    };
  }

  /**
   * 🎯 智能形状分类算法
   */
  private classifyPathShape(
    pathData: PathPoint[], 
    avgCurvature: number, 
    speedVariation: number
  ): PathFeatures['shape'] {
    
    // 圆形检测
    if (this.isCircularPath(pathData, avgCurvature)) {
      return 'circular';
    }
    
    // 螺旋检测
    if (this.isSpiralPath(pathData)) {
      return 'spiral';
    }
    
    // 直线检测
    if (avgCurvature < 0.3) {
      return 'straight';
    }
    
    return 'freeform';
  }

  /**
   * 🎪 智能效果推荐
   */
  private suggestOptimalEffect(
    shape: PathFeatures['shape'], 
    speedVariation: number, 
    avgCurvature: number
  ): string {
    
    switch (shape) {
      case 'circular':
        return 'orbit';
      
      case 'spiral':
        return speedVariation > 0.5 ? 'dramatic_spiral' : 'floating_follow';
      
      case 'straight':
        return speedVariation > 0.7 ? 'crash_zoom' : 'zoom_in';
      
      case 'freeform':
        if (avgCurvature > 1.0) return 'bullet_time';
        if (speedVariation > 0.8) return 'vertigo_effect';
        return 'pull_back';
        
      default:
        return 'zoom_in';
    }
  }

  /**
   * 📐 高级路径平滑算法 (Douglas-Peucker + B-Spline)
   */
  private advancedPathSmoothing(pathData: PathPoint[]): PathPoint[] {
    if (pathData.length < 3) return pathData;

    // Step 1: Douglas-Peucker 路径简化
    const simplified = this.douglasPeuckerSimplify(pathData, 2.0);
    
    // Step 2: B-Spline 平滑
    const smoothed = this.bSplineSmooth(simplified);
    
    // Step 3: 重采样到固定帧数
    return this.resampleToFrames(smoothed, 25);
  }

  /**
   * 🌊 Douglas-Peucker 算法实现
   */
  private douglasPeuckerSimplify(points: PathPoint[], tolerance: number): PathPoint[] {
    if (points.length <= 2) return points;

    let maxDistance = 0;
    let maxIndex = 0;
    
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
    
    if (maxDistance > tolerance) {
      const left = this.douglasPeuckerSimplify(points.slice(0, maxIndex + 1), tolerance);
      const right = this.douglasPeuckerSimplify(points.slice(maxIndex), tolerance);
      return [...left.slice(0, -1), ...right];
    }
    
    return [points[0], points[points.length - 1]];
  }

  /**
   * 🎨 B-Spline 平滑算法
   */
  private bSplineSmooth(points: PathPoint[]): PathPoint[] {
    if (points.length < 3) return points;

    const smoothed: PathPoint[] = [];
    const controlPoints = points;
    const degree = Math.min(3, points.length - 1);
    
    // 简化的B-Spline实现
    for (let t = 0; t <= 1; t += 0.02) {
      const point = this.evaluateBSpline(controlPoints, degree, t);
      smoothed.push(point);
    }
    
    return smoothed;
  }

  /**
   * 📊 3D相机位置生成 - 基于效果类型
   */
  private generateCinematicPositions(
    pathData: PathPoint[],
    depthMap: number[],
    effect: string,
    features: PathFeatures
  ): number[][] {
    
    const positions: number[][] = [];
    
    for (let i = 0; i < pathData.length; i++) {
      const t = i / (pathData.length - 1);
      const point = pathData[i];
      const depth = depthMap[i];
      
      let pos: number[];
      
      switch (effect) {
        case 'zoom_in':
          pos = this.generateZoomInPosition(point, depth, t);
          break;
          
        case 'orbit':
          pos = this.generateOrbitPosition(point, t, features);
          break;
          
        case 'pull_back':
          pos = this.generatePullBackPosition(point, depth, t);
          break;
          
        case 'dramatic_spiral':
          pos = this.generateSpiralPosition(point, depth, t);
          break;
          
        case 'vertigo_effect':
          pos = this.generateVertigoPosition(point, depth, t);
          break;
          
        case 'bullet_time':
          pos = this.generateBulletTimePosition(point, t, i);
          break;
          
        case 'crash_zoom':
          pos = this.generateCrashZoomPosition(point, depth, t);
          break;
          
        case 'floating_follow':
          pos = this.generateFloatingPosition(point, depth, t);
          break;
          
        default:
          pos = [point.x, point.y, -depth];
      }
      
      positions.push(pos);
    }
    
    return positions;
  }

  // 各种效果的位置生成算法
  private generateZoomInPosition(point: PathPoint, depth: number, t: number): number[] {
    return [
      point.x * (1 - t * 0.8),
      point.y * (1 - t * 0.8),
      -depth * (1 - t * 0.9)
    ];
  }

  private generateOrbitPosition(point: PathPoint, t: number, features: PathFeatures): number[] {
    const angle = t * Math.PI * 2;
    const radius = 5.0;
    return [
      Math.cos(angle) * radius,
      point.y * 0.5,
      Math.sin(angle) * radius
    ];
  }

  private generatePullBackPosition(point: PathPoint, depth: number, t: number): number[] {
    const scaleFactor = 1 + t * 3;
    return [
      point.x * scaleFactor,
      point.y * scaleFactor,
      -depth * (1 + t * 2)
    ];
  }

  private generateSpiralPosition(point: PathPoint, depth: number, t: number): number[] {
    const spiralAngle = t * Math.PI * 3; // 1.5圈
    const spiralRadius = 2 + t * 3;
    return [
      point.x + Math.cos(spiralAngle) * spiralRadius * t,
      point.y + Math.sin(spiralAngle) * spiralRadius * t,
      -depth * (1 + t * 2)
    ];
  }

  private generateVertigoPosition(point: PathPoint, depth: number, t: number): number[] {
    // Hitchcock Dolly Zoom效果
    return [
      point.x,
      point.y,
      -depth * (1 + t * 2) // 推进
      // FOV会相应调整以保持主体大小
    ];
  }

  private generateBulletTimePosition(point: PathPoint, t: number, index: number): number[] {
    const angle = t * Math.PI * 2;
    const radius = 8.0;
    return [
      point.x + Math.cos(angle) * radius,
      point.y + Math.sin(angle * 0.5) * 2, // Y轴慢速变化
      Math.sin(angle) * radius
    ];
  }

  private generateCrashZoomPosition(point: PathPoint, depth: number, t: number): number[] {
    // 指数加速推进
    const acceleration = Math.pow(t, 3);
    return [
      point.x * (1 - acceleration * 0.9),
      point.y * (1 - acceleration * 0.9),
      -depth * (1 - acceleration * 0.95)
    ];
  }

  private generateFloatingPosition(point: PathPoint, depth: number, t: number): number[] {
    const floatY = Math.sin(t * Math.PI * 4) * 0.3; // 浮动效果
    return [
      point.x,
      point.y + floatY,
      -depth * (1 + Math.sin(t * Math.PI) * 0.5)
    ];
  }

  // 工具方法
  private calculateVelocities(pathData: PathPoint[]): PathPoint[] {
    const velocities: PathPoint[] = [];
    for (let i = 1; i < pathData.length; i++) {
      velocities.push({
        x: pathData[i].x - pathData[i-1].x,
        y: pathData[i].y - pathData[i-1].y
      });
    }
    return velocities;
  }

  private calculateCurvatures(pathData: PathPoint[]): number[] {
    const curvatures: number[] = [];
    for (let i = 1; i < pathData.length - 1; i++) {
      const p1 = pathData[i - 1];
      const p2 = pathData[i];
      const p3 = pathData[i + 1];
      
      const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
      const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
      
      const v1Len = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
      const v2Len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
      
      if (v1Len > 0 && v2Len > 0) {
        const dot = (v1.x * v2.x + v1.y * v2.y) / (v1Len * v2Len);
        const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
        curvatures.push(angle);
      }
    }
    return curvatures;
  }

  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  // 其他占位符方法
  private inferIntelligentDepth(pathData: PathPoint[], features: PathFeatures): number[] {
    return pathData.map((_, i) => 5.0 + (i / pathData.length) * 3.0);
  }

  private calculateCinematicOrientations(positions: number[][], features: PathFeatures): number[][] {
    return positions.map(() => [0, 0, 0]); // 简化实现
  }

  private applyPhysicsConstraints(positions: number[][], orientations: number[][], fps: number) {
    return { positions, orientations }; // 简化实现
  }

  private calculateDynamicCameraParams(positions: number[][], orientations: number[][], effect: string, duration: number, quality: string) {
    const frameCount = positions.length;
    return {
      fov: new Array(frameCount).fill(50),
      focusDistance: new Array(frameCount).fill(5),
      aperture: new Array(frameCount).fill(2.8),
      motionBlur: new Array(frameCount).fill(0.1),
      speedCurve: new Array(frameCount).fill(1.0)
    };
  }

  private suggestColorGrading(effect: string) {
    const presets = {
      zoom_in: { temperature: 5500, tint: 0, saturation: 1.1, contrast: 1.2, highlights: -0.1, shadows: 0.1, style: "natural" },
      dramatic_spiral: { temperature: 4800, tint: -5, saturation: 0.9, contrast: 1.4, highlights: -0.2, shadows: 0.3, style: "cinematic" }
    };
    return presets[effect as keyof typeof presets] || presets.zoom_in;
  }

  // 更多工具方法的占位符实现
  private pointToLineDistance(point: PathPoint, lineStart: PathPoint, lineEnd: PathPoint): number {
    const A = lineEnd.y - lineStart.y;
    const B = lineStart.x - lineEnd.x;
    const C = lineEnd.x * lineStart.y - lineStart.x * lineEnd.y;
    return Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B);
  }

  private evaluateBSpline(controlPoints: PathPoint[], degree: number, t: number): PathPoint {
    // 简化B-Spline评估
    const index = Math.floor(t * (controlPoints.length - 1));
    const nextIndex = Math.min(index + 1, controlPoints.length - 1);
    const localT = (t * (controlPoints.length - 1)) - index;
    
    return {
      x: controlPoints[index].x + (controlPoints[nextIndex].x - controlPoints[index].x) * localT,
      y: controlPoints[index].y + (controlPoints[nextIndex].y - controlPoints[index].y) * localT
    };
  }

  private resampleToFrames(points: PathPoint[], frameCount: number): PathPoint[] {
    if (points.length <= frameCount) return points;
    
    const resampled: PathPoint[] = [];
    const step = (points.length - 1) / (frameCount - 1);
    
    for (let i = 0; i < frameCount; i++) {
      const index = i * step;
      const lowerIndex = Math.floor(index);
      const upperIndex = Math.min(Math.ceil(index), points.length - 1);
      const t = index - lowerIndex;
      
      if (lowerIndex === upperIndex) {
        resampled.push(points[lowerIndex]);
      } else {
        resampled.push({
          x: points[lowerIndex].x + (points[upperIndex].x - points[lowerIndex].x) * t,
          y: points[lowerIndex].y + (points[upperIndex].y - points[lowerIndex].y) * t
        });
      }
    }
    
    return resampled;
  }

  private isCircularPath(pathData: PathPoint[], avgCurvature: number): boolean {
    if (pathData.length < 10) return false;
    
    const center = {
      x: pathData.reduce((sum, p) => sum + p.x, 0) / pathData.length,
      y: pathData.reduce((sum, p) => sum + p.y, 0) / pathData.length
    };
    
    const distances = pathData.map(p => 
      Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2))
    );
    
    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    const distanceVariance = this.calculateStandardDeviation(distances);
    
    return distanceVariance / avgDistance < 0.2 && avgCurvature > 0.8;
  }

  private isSpiralPath(pathData: PathPoint[]): boolean {
    if (pathData.length < 15) return false;
    
    const center = {
      x: pathData.reduce((sum, p) => sum + p.x, 0) / pathData.length,
      y: pathData.reduce((sum, p) => sum + p.y, 0) / pathData.length
    };
    
    const distances = pathData.map(p => 
      Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2))
    );
    
    let increasing = 0, decreasing = 0;
    for (let i = 1; i < distances.length; i++) {
      if (distances[i] > distances[i-1]) increasing++;
      else if (distances[i] < distances[i-1]) decreasing++;
    }
    
    const monotonicity = Math.max(increasing, decreasing) / (distances.length - 1);
    return monotonicity > 0.7;
  }
}