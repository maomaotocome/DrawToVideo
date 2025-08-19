/**
 * 🧠 Vercel API Function - Advanced Path Analysis (Day 2)
 * 超越Higgsfield的AI驱动路径分析和电影级效果推荐
 * Integration: Advanced Camera Engine + ML-inspired classification
 */

import { VercelRequest, VercelResponse } from '@vercel/node';

interface PathPoint {
  x: number;
  y: number;
  timestamp?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pathData } = req.body;
    
    if (!pathData || !Array.isArray(pathData)) {
      return res.status(400).json({
        success: false,
        error: "Invalid path data"
      });
    }

    console.log(`🧠 Analyzing path with ${pathData.length} points`);

    // Perform intelligent path analysis
    const analysis = analyzePathIntelligently(pathData);

    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error("❌ Path analysis failed:", error);
    res.status(500).json({
      success: false,
      error: "Path analysis failed",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * 🧠 Advanced Path Analysis Algorithm
 * 超越Higgsfield的智能路径识别
 */
function analyzePathIntelligently(pathData: PathPoint[]) {
  if (pathData.length < 2) {
    return {
      pathComplexity: 0,
      recommendedEffect: "zoom_in",
      confidence: 0.5,
      alternativeEffects: ["orbit", "pull_back"],
      estimatedQuality: 6.0,
      optimizationTips: [
        "路径点数过少，建议绘制更完整的路径",
        "增加更多路径点可以提高生成质量"
      ]
    };
  }

  // Calculate path metrics
  const pathMetrics = calculatePathMetrics(pathData);
  
  // Determine path shape
  const pathShape = classifyPathShape(pathData, pathMetrics);
  
  // Recommend best effect
  const recommendation = recommendOptimalEffect(pathShape, pathMetrics);
  
  // Generate optimization tips
  const tips = generateOptimizationTips(pathMetrics, pathShape);

  return {
    pathComplexity: pathMetrics.complexity,
    recommendedEffect: recommendation.primary,
    confidence: recommendation.confidence,
    alternativeEffects: recommendation.alternatives,
    estimatedQuality: Math.min(10, 6 + pathMetrics.smoothness * 2 + pathMetrics.complexity / 2),
    optimizationTips: tips,
    // Additional analytics
    pathShape,
    metrics: {
      totalDistance: pathMetrics.totalDistance,
      avgSpeed: pathMetrics.avgSpeed,
      smoothness: pathMetrics.smoothness,
      directionChanges: pathMetrics.directionChanges
    }
  };
}

/**
 * 📊 Calculate Advanced Path Metrics
 */
function calculatePathMetrics(pathData: PathPoint[]) {
  let totalDistance = 0;
  let totalAngleChange = 0;
  let maxSpeed = 0;
  let directionChanges = 0;
  const speeds: number[] = [];

  for (let i = 1; i < pathData.length; i++) {
    const prev = pathData[i - 1];
    const curr = pathData[i];
    
    // Distance and speed calculation
    const distance = Math.sqrt(
      Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
    );
    totalDistance += distance;
    speeds.push(distance);
    maxSpeed = Math.max(maxSpeed, distance);
    
    // Angle change calculation for smoothness
    if (i > 1) {
      const prevPrev = pathData[i - 2];
      const angle1 = Math.atan2(prev.y - prevPrev.y, prev.x - prevPrev.x);
      const angle2 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
      const angleChange = Math.abs(angle2 - angle1);
      totalAngleChange += angleChange;
      
      // Count significant direction changes
      if (angleChange > Math.PI / 4) { // 45 degrees
        directionChanges++;
      }
    }
  }

  const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
  const speedVariation = calculateStandardDeviation(speeds);
  const avgAngleChange = totalAngleChange / Math.max(1, pathData.length - 2);
  
  return {
    totalDistance,
    avgSpeed,
    maxSpeed,
    speedVariation,
    avgAngleChange,
    directionChanges,
    complexity: Math.min(10, (avgAngleChange * 5) + (speedVariation / 10)),
    smoothness: Math.max(0, 10 - avgAngleChange * 3)
  };
}

/**
 * 🔍 Classify Path Shape
 */
function classifyPathShape(pathData: PathPoint[], metrics: any): string {
  const { totalDistance, avgAngleChange, directionChanges } = metrics;
  
  // Check for circular/spiral patterns
  if (isCircularPath(pathData)) {
    return "circular";
  }
  
  if (isSpiralPath(pathData)) {
    return "spiral";
  }
  
  // Linear path detection
  if (avgAngleChange < 0.3 && directionChanges < 2) {
    return "linear";
  }
  
  // S-curve detection
  if (directionChanges >= 2 && directionChanges <= 4) {
    return "s_curve";
  }
  
  // Complex path
  if (directionChanges > 4 || avgAngleChange > 1.5) {
    return "complex";
  }
  
  return "freeform";
}

/**
 * 🎯 Smart Effect Recommendation
 */
function recommendOptimalEffect(pathShape: string, metrics: any) {
  const recommendations: Record<string, any> = {
    circular: {
      primary: "orbit",
      confidence: 0.95,
      alternatives: ["floating_follow", "dramatic_spiral"]
    },
    spiral: {
      primary: "dramatic_spiral",
      confidence: 0.92,
      alternatives: ["orbit", "crash_zoom"]
    },
    linear: {
      primary: metrics.avgSpeed > 5 ? "crash_zoom" : "zoom_in",
      confidence: 0.88,
      alternatives: ["pull_back", "floating_follow"]
    },
    s_curve: {
      primary: "floating_follow",
      confidence: 0.85,
      alternatives: ["orbit", "pull_back"]
    },
    complex: {
      primary: "pull_back",
      confidence: 0.80,
      alternatives: ["dramatic_spiral", "floating_follow"]
    },
    freeform: {
      primary: "zoom_in",
      confidence: 0.75,
      alternatives: ["orbit", "pull_back"]
    }
  };

  return recommendations[pathShape] || recommendations.freeform;
}

/**
 * 💡 Generate Optimization Tips
 */
function generateOptimizationTips(metrics: any, pathShape: string): string[] {
  const tips: string[] = [];
  
  // Smoothness tips
  if (metrics.smoothness < 5) {
    tips.push("路径有些急转弯，尝试绘制更流畅的路径可以提高视频质量");
  } else {
    tips.push("路径流畅度很好，适合生成高质量视频");
  }
  
  // Complexity tips
  if (metrics.complexity < 2) {
    tips.push("路径相对简单，考虑增加一些变化可以让视频更有趣");
  } else if (metrics.complexity > 8) {
    tips.push("路径很复杂，可能会产生令人惊喜的效果");
  } else {
    tips.push("路径复杂度适中，很适合生成专业级视频");
  }
  
  // Shape-specific tips
  switch (pathShape) {
    case "circular":
      tips.push("检测到圆形路径，非常适合产品展示和360度视角");
      break;
    case "spiral":
      tips.push("螺旋形路径很适合制作病毒式传播的动态效果");
      break;
    case "linear":
      tips.push("直线路径适合制作冲击感强烈的zoom效果");
      break;
    case "s_curve":
      tips.push("S形路径适合制作优雅的浮动跟随效果");
      break;
    case "complex":
      tips.push("复杂路径可以创造独特的视觉效果");
      break;
  }

  return tips;
}

/**
 * 🔄 Utility Functions
 */
function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function isCircularPath(pathData: PathPoint[]): boolean {
  if (pathData.length < 8) return false;
  
  // Calculate center point
  const centerX = pathData.reduce((sum, p) => sum + p.x, 0) / pathData.length;
  const centerY = pathData.reduce((sum, p) => sum + p.y, 0) / pathData.length;
  
  // Check if distances from center are relatively consistent
  const distances = pathData.map(p => 
    Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
  );
  
  const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
  const distanceVariation = calculateStandardDeviation(distances);
  
  return distanceVariation / avgDistance < 0.3; // Less than 30% variation
}

function isSpiralPath(pathData: PathPoint[]): boolean {
  if (pathData.length < 10) return false;
  
  const centerX = pathData.reduce((sum, p) => sum + p.x, 0) / pathData.length;
  const centerY = pathData.reduce((sum, p) => sum + p.y, 0) / pathData.length;
  
  const distances = pathData.map(p => 
    Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
  );
  
  // Check for monotonic increase/decrease in distance
  let increasing = 0;
  let decreasing = 0;
  
  for (let i = 1; i < distances.length; i++) {
    if (distances[i] > distances[i-1]) increasing++;
    else if (distances[i] < distances[i-1]) decreasing++;
  }
  
  const trend = Math.max(increasing, decreasing) / (distances.length - 1);
  return trend > 0.7; // 70% trend towards increasing or decreasing
}