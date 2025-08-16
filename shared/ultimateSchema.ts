import { z } from "zod";

// 🎬 终极Draw to Video数据模型 - 超越Higgsfield
export const PathPointSchema = z.object({
  x: z.number(),
  y: z.number(),
  timestamp: z.number().optional(),
  pressure: z.number().optional(),
});

export const PathFeaturesSchema = z.object({
  shape: z.enum(['circular', 'spiral', 'straight', 'freeform']),
  avgCurvature: z.number(),
  maxCurvature: z.number(),
  pathLength: z.number(),
  speedVariation: z.number(),
  avgSpeed: z.number(),
  suggestedEffect: z.string(),
});

export const CinematicTrajectorySchema = z.object({
  positions: z.array(z.array(z.number())),
  orientations: z.array(z.array(z.number())),
  fov: z.array(z.number()),
  focusDistance: z.array(z.number()),
  aperture: z.array(z.number()),
  motionBlur: z.array(z.number()),
  speedCurve: z.array(z.number()),
  metadata: z.object({
    fps: z.number(),
    duration: z.number(),
    totalFrames: z.number(),
    preset: z.string(),
    quality: z.string(),
  }),
  colorGrading: z.object({
    temperature: z.number(),
    tint: z.number(),
    saturation: z.number(),
    contrast: z.number(),
    highlights: z.number(),
    shadows: z.number(),
    style: z.string(),
  }).optional(),
});

export const UltimateVideoGenerationSchema = z.object({
  imageUrl: z.string().url(),
  pathData: z.array(PathPointSchema),
  effect: z.enum([
    'zoom_in', 
    'orbit', 
    'pull_back', 
    'dramatic_spiral', 
    'vertigo_effect', 
    'bullet_time', 
    'crash_zoom', 
    'floating_follow'
  ]),
  duration: z.number().min(1).max(30).optional().default(5),
  quality: z.enum(['preview', 'hd', '4k', 'cinema']).optional().default('hd'),
  socialPlatform: z.enum(['tiktok', 'instagram', 'youtube', 'general']).optional().default('general'),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '4:5']).optional().default('16:9'),
  style: z.enum(['realistic', 'cinematic', 'dramatic', 'ethereal']).optional().default('cinematic'),
});

export const VideoGenerationResultSchema = z.object({
  videoUrl: z.string().url(),
  previewUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  metadata: z.object({
    duration: z.number(),
    resolution: z.string(),
    fps: z.number(),
    fileSize: z.number().optional(),
    effect: z.string(),
    generationTime: z.number(),
    strategy: z.string(),
  }),
  analytics: z.object({
    pathComplexity: z.number(),
    motionIntensity: z.number(),
    qualityScore: z.number(),
    viralPotential: z.number().optional(),
  }).optional(),
});

// 类型导出
export type PathPoint = z.infer<typeof PathPointSchema>;
export type PathFeatures = z.infer<typeof PathFeaturesSchema>;
export type CinematicTrajectory = z.infer<typeof CinematicTrajectorySchema>;
export type UltimateVideoGeneration = z.infer<typeof UltimateVideoGenerationSchema>;
export type VideoGenerationResult = z.infer<typeof VideoGenerationResultSchema>;

// 性能监控和分析
export const PerformanceMetricsSchema = z.object({
  generationCount: z.number(),
  avgGenerationTime: z.number(),
  successRate: z.number(),
  currentLoad: z.number(),
  popularEffects: z.array(z.string()),
  userSatisfaction: z.number().optional(),
});

export const UserAnalyticsSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string(),
  device: z.string(),
  platform: z.string(),
  effects: z.array(z.string()),
  generationCount: z.number(),
  totalDuration: z.number(),
  createdAt: z.date(),
});

export type PerformanceMetrics = z.infer<typeof PerformanceMetricsSchema>;
export type UserAnalytics = z.infer<typeof UserAnalyticsSchema>;