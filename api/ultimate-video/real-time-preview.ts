/**
 * 🎥 Vercel API Function - Real-Time Preview Analysis (Day 3)
 * 超高速实时分析 - 专为0延迟预览优化
 * 性能目标：<100ms响应时间，支持每秒10+请求
 */

import { VercelRequest, VercelResponse } from '@vercel/node';

interface PathPoint {
  x: number;
  y: number;
  timestamp?: number;
}

interface RealTimeAnalysisRequest {
  pathData: PathPoint[];
  effect: string;
  lastAnalysisHash?: string; // 用于避免重复计算
}

interface RealTimeAnalysisResponse {
  complexity: number;
  smoothness: number;
  qualityScore: number;
  cinematicScore: number;
  viralPotential: number;
  motionIntensity: number;
  emotionalTone: 'calm' | 'dynamic' | 'dramatic' | 'aggressive' | 'ethereal';
  recommendedEffect: string;
  confidence: number;
  recommendations: string[];
  estimatedGenerationTime: number;
  pathShape: string;
  analysisHash: string; // 用于缓存优化
  cacheHit: boolean;
  processingTime: number;
}

// 简单内存缓存（生产环境应使用Redis）
const analysisCache = new Map<string, { result: RealTimeAnalysisResponse; timestamp: number }>();
const CACHE_TTL = 30000; // 30秒TTL

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();

  // Enable CORS with optimized headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-analysis-hash');
  res.setHeader('Cache-Control', 'no-cache'); // 禁用缓存确保实时性

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pathData, effect, lastAnalysisHash }: RealTimeAnalysisRequest = req.body;
    
    // 🚀 Ultra-fast validation
    if (!pathData || !Array.isArray(pathData) || pathData.length < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid path data'
      });
    }

    if (!effect) {
      return res.status(400).json({
        success: false,
        error: 'Effect parameter required'
      });
    }

    // 🎯 Generate analysis hash for caching
    const analysisHash = generateAnalysisHash(pathData, effect);
    
    // 🔄 Check cache first
    const cached = analysisCache.get(analysisHash);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log(`✅ Cache hit for hash: ${analysisHash}`);
      const result = {
        ...cached.result,
        cacheHit: true,
        processingTime: Date.now() - startTime
      };
      
      return res.json({
        success: true,
        data: result
      });
    }

    // 🚀 Perform ultra-fast analysis
    console.log(`🧠 Real-time analysis: ${pathData.length} points, effect: ${effect}`);
    
    const analysis = await performUltraFastAnalysis(pathData, effect);
    
    const result: RealTimeAnalysisResponse = {
      ...analysis,
      analysisHash,
      cacheHit: false,
      processingTime: Date.now() - startTime
    };

    // 💾 Cache the result
    analysisCache.set(analysisHash, {
      result,
      timestamp: Date.now()
    });

    // 🧹 Clean old cache entries (basic cleanup)
    if (analysisCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of analysisCache.entries()) {
        if ((now - value.timestamp) > CACHE_TTL) {
          analysisCache.delete(key);
        }
      }
    }

    console.log(`✅ Analysis completed in ${result.processingTime}ms`);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Real-time analysis failed:', error);
    
    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      processingTime: Date.now() - startTime
    });
  }
}

/**
 * 🚀 Ultra-Fast Analysis Engine (目标: <50ms)
 */
async function performUltraFastAnalysis(pathData: PathPoint[], effect: string) {
  const analysisStart = Date.now();

  // 🔥 Phase 1: Lightning-fast metrics (0-10ms)
  const basicMetrics = calculateBasicMetrics(pathData);
  
  // 🔥 Phase 2: Advanced analysis (10-30ms)
  const advancedMetrics = calculateAdvancedMetrics(pathData, basicMetrics);
  
  // 🔥 Phase 3: Effect optimization (30-40ms)
  const effectOptimization = optimizeForEffect(advancedMetrics, effect);
  
  // 🔥 Phase 4: Recommendations (40-50ms)
  const recommendations = generateRecommendations(advancedMetrics, effect);

  console.log(`⚡ Analysis phases completed in ${Date.now() - analysisStart}ms`);

  return {
    complexity: advancedMetrics.complexity,
    smoothness: advancedMetrics.smoothness,
    qualityScore: effectOptimization.qualityScore,
    cinematicScore: effectOptimization.cinematicScore,
    viralPotential: effectOptimization.viralPotential,
    motionIntensity: advancedMetrics.motionIntensity,
    emotionalTone: advancedMetrics.emotionalTone,
    recommendedEffect: effectOptimization.recommendedEffect,
    confidence: advancedMetrics.confidence,
    recommendations: recommendations.tips,
    estimatedGenerationTime: effectOptimization.estimatedTime,
    pathShape: advancedMetrics.pathShape
  };
}

/**
 * ⚡ Basic Metrics Calculation (Ultra-Optimized)
 */
function calculateBasicMetrics(pathData: PathPoint[]) {
  if (pathData.length < 2) {
    return {
      totalDistance: 0,
      avgVelocity: 0,
      maxVelocity: 0,
      velocityVariance: 0,
      pointCount: pathData.length
    };
  }

  let totalDistance = 0;
  let maxVelocity = 0;
  const velocities: number[] = [];

  // Single pass calculation for efficiency
  for (let i = 1; i < pathData.length; i++) {
    const dx = pathData[i].x - pathData[i-1].x;
    const dy = pathData[i].y - pathData[i-1].y;
    const velocity = Math.sqrt(dx * dx + dy * dy);
    
    totalDistance += velocity;
    velocities.push(velocity);
    
    if (velocity > maxVelocity) {
      maxVelocity = velocity;
    }
  }

  const avgVelocity = totalDistance / velocities.length;
  
  // Fast variance calculation
  let varianceSum = 0;
  for (const vel of velocities) {
    const diff = vel - avgVelocity;
    varianceSum += diff * diff;
  }
  const velocityVariance = varianceSum / velocities.length;

  return {
    totalDistance,
    avgVelocity,
    maxVelocity,
    velocityVariance,
    pointCount: pathData.length
  };
}

/**
 * 🧠 Advanced Metrics Calculation
 */
function calculateAdvancedMetrics(pathData: PathPoint[], basicMetrics: any) {
  // Complexity calculation (optimized)
  const complexity = Math.min(10, 
    (basicMetrics.velocityVariance / 100) * 3 + 
    (basicMetrics.avgVelocity / 20) * 2 +
    Math.log10(basicMetrics.pointCount) * 2
  );

  // Smoothness calculation
  const smoothness = Math.max(0, 10 - Math.sqrt(basicMetrics.velocityVariance) * 0.8);

  // Motion intensity
  const motionIntensity = Math.min(10, 
    (basicMetrics.maxVelocity / 50) * 5 + complexity * 0.5
  );

  // Emotional tone detection (fast heuristics)
  let emotionalTone: 'calm' | 'dynamic' | 'dramatic' | 'aggressive' | 'ethereal' = 'calm';
  
  if (basicMetrics.maxVelocity > 30 && complexity > 7) {
    emotionalTone = 'aggressive';
  } else if (complexity > 5 && basicMetrics.velocityVariance > 100) {
    emotionalTone = 'dramatic';
  } else if (basicMetrics.avgVelocity > 15 && smoothness > 6) {
    emotionalTone = 'dynamic';
  } else if (smoothness > 8 && complexity < 4) {
    emotionalTone = 'ethereal';
  }

  // Path shape classification (simplified)
  let pathShape = 'linear';
  if (complexity > 6) {
    pathShape = 'complex';
  } else if (complexity > 3) {
    pathShape = 'curved';
  }

  // Confidence calculation
  const confidence = Math.min(100, 
    60 + complexity * 4 + (basicMetrics.pointCount / 20) * 10
  );

  return {
    complexity,
    smoothness,
    motionIntensity,
    emotionalTone,
    pathShape,
    confidence
  };
}

/**
 * 🎯 Effect-Specific Optimization
 */
function optimizeForEffect(metrics: any, effect: string) {
  // Effect-quality matching
  const effectQualityMap: Record<string, number> = {
    'zoom_in': 7,
    'orbit': 8,
    'pull_back': 7.5,
    'dramatic_spiral': 8.5,
    'crash_zoom': 7,
    'floating_follow': 6.5
  };

  const baseQuality = effectQualityMap[effect] || 6;
  const qualityScore = Math.min(10, 
    baseQuality + metrics.complexity * 0.2 + metrics.smoothness * 0.15
  );

  const cinematicScore = Math.min(10,
    qualityScore * 0.8 + metrics.complexity * 0.3
  );

  // Viral potential calculation
  const viralEffectMultiplier: Record<string, number> = {
    'dramatic_spiral': 1.4,
    'crash_zoom': 1.3,
    'orbit': 1.1,
    'zoom_in': 1.0,
    'pull_back': 1.2,
    'floating_follow': 0.9
  };

  const multiplier = viralEffectMultiplier[effect] || 1.0;
  const viralPotential = Math.min(10, 
    qualityScore * multiplier + metrics.complexity * 0.2
  );

  // Recommended effect suggestion
  const recommendedEffect = suggestBestEffect(metrics);

  // Estimated generation time
  const baseTime = 8;
  const complexityFactor = metrics.complexity * 0.5;
  const effectFactor = effect.includes('dramatic') ? 2 : effect.includes('crash') ? 1.5 : 1;
  const estimatedTime = Math.max(5, Math.min(30, baseTime + complexityFactor + effectFactor));

  return {
    qualityScore,
    cinematicScore,
    viralPotential,
    recommendedEffect,
    estimatedTime
  };
}

/**
 * 💡 Smart Recommendations Generator
 */
function generateRecommendations(metrics: any, effect: string) {
  const tips: string[] = [];

  // Complexity-based recommendations
  if (metrics.complexity < 2) {
    tips.push("路径相对简单，尝试添加更多弯曲变化可以提升视觉效果");
  } else if (metrics.complexity > 8) {
    tips.push("路径非常复杂！适合创造独特的视觉效果");
  }

  // Smoothness recommendations
  if (metrics.smoothness < 4) {
    tips.push("路径有些急躁，绘制更平滑的曲线可以提升质量");
  } else if (metrics.smoothness > 8) {
    tips.push("路径非常平滑，适合制作专业级视频");
  }

  // Effect-specific tips
  const effectTips: Record<string, string> = {
    'dramatic_spiral': "螺旋效果建议使用更复杂的路径来增强戏剧性",
    'orbit': "环绕效果适合圆形或弧形路径",
    'crash_zoom': "冲击变焦适合快速直线或突然变向的路径",
    'zoom_in': "推进效果适合简单直接的路径",
    'pull_back': "拉远效果适合从中心向外扩散的路径"
  };

  if (effectTips[effect]) {
    tips.push(effectTips[effect]);
  }

  // Ensure we always have at least one tip
  if (tips.length === 0) {
    tips.push("当前路径质量良好，可以直接生成视频");
  }

  return { tips };
}

/**
 * 🎯 Smart Effect Suggestion
 */
function suggestBestEffect(metrics: any): string {
  if (metrics.emotionalTone === 'aggressive') return 'crash_zoom';
  if (metrics.emotionalTone === 'dramatic') return 'dramatic_spiral';
  if (metrics.emotionalTone === 'ethereal') return 'floating_follow';
  if (metrics.pathShape === 'complex') return 'orbit';
  if (metrics.complexity > 6) return 'dramatic_spiral';
  return 'zoom_in';
}

/**
 * 🔑 Analysis Hash Generation for Caching
 */
function generateAnalysisHash(pathData: PathPoint[], effect: string): string {
  // 简化的哈希生成 - 基于路径关键点和效果
  const keyPoints = pathData.length > 10 ? 
    [pathData[0], pathData[Math.floor(pathData.length/2)], pathData[pathData.length-1]] :
    pathData;
  
  const pathString = keyPoints.map(p => `${Math.round(p.x)},${Math.round(p.y)}`).join('|');
  const hashInput = `${pathString}-${effect}-${pathData.length}`;
  
  // 简单哈希函数
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}