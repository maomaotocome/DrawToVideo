/**
 * 🎬 Ultimate Draw to Video Schema
 * 终极视频生成系统的类型定义和数据结构
 */

import { z } from "zod";

// 基础路径点类型
export interface PathPoint {
  x: number;
  y: number;
  timestamp?: number;
}

// 路径特征分析
export interface PathFeatures {
  shape: 'straight' | 'circular' | 'spiral' | 'freeform';
  avgCurvature: number;
  maxCurvature: number;
  pathLength: number;
  speedVariation: number;
  avgSpeed: number;
  suggestedEffect: string;
}

// 电影级轨迹数据
export interface CinematicTrajectory {
  positions: number[][];
  orientations: number[][];
  fov: number[];
  focusDistance: number[];
  aperture: number[];
  motionBlur: number[];
  speedCurve: number[];
  metadata: {
    fps: number;
    duration: number;
    totalFrames: number;
    preset: string;
    quality: string;
  };
  colorGrading?: {
    temperature: number;
    tint: number;
    saturation: number;
    contrast: number;
    highlights: number;
    shadows: number;
    style: string;
  };
}

// 视频生成选项
export interface UltimateVideoGeneration {
  imageUrl: string;
  pathData: PathPoint[];
  effect: string;
  duration?: number;
  quality?: 'preview' | 'hd' | '4k' | 'cinema';
  socialPlatform?: 'tiktok' | 'instagram' | 'youtube' | 'general';
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5';
  style?: 'realistic' | 'cinematic' | 'dramatic' | 'ethereal';
}

// 视频生成结果
export interface VideoGenerationResult {
  videoUrl: string;
  thumbnailUrl?: string;
  metadata: {
    duration: number;
    fps: number;
    resolution: string;
    fileSize: number;
    generationTime: number;
  };
  analytics?: {
    qualityScore: number;
    motionSmoothnessScore: number;
    visualAppealScore: number;
  };
}

// 分析结果
export interface PathAnalysisResult {
  features: PathFeatures;
  suggestedEffects: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedGenerationTime: number;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// Zod验证模式
export const PathPointSchema = z.object({
  x: z.number(),
  y: z.number(),
  timestamp: z.number().optional()
});

export const UltimateVideoGenerationSchema = z.object({
  imageUrl: z.string().url(),
  pathData: z.array(PathPointSchema).min(1),
  effect: z.string(),
  duration: z.number().min(1).max(30).default(5),
  quality: z.enum(['preview', 'hd', '4k', 'cinema']).default('hd'),
  socialPlatform: z.enum(['tiktok', 'instagram', 'youtube', 'general']).default('general'),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '4:5']).default('16:9'),
  style: z.enum(['realistic', 'cinematic', 'dramatic', 'ethereal']).default('cinematic')
});

export const PathAnalysisSchema = z.object({
  pathData: z.array(PathPointSchema).min(1)
});

// 相机效果列表
export const ULTIMATE_CAMERA_EFFECTS = [
  'zoom_in',
  'orbit', 
  'pull_back',
  'dramatic_spiral',
  'vertigo_effect',
  'bullet_time',
  'crash_zoom',
  'floating_follow'
] as const;

export type UltimateCameraEffect = typeof ULTIMATE_CAMERA_EFFECTS[number];

// 用于类型推导的工具类型
export type UltimateVideoGenerationInput = z.infer<typeof UltimateVideoGenerationSchema>;
export type PathAnalysisInput = z.infer<typeof PathAnalysisSchema>;