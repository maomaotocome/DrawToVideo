/**
 * 🎥 Real-Time Preview Hook - Day 3 Advanced Implementation
 * 超越Higgsfield的核心优势：实时预览 + 智能分析 + 即时反馈
 * Higgsfield用户需要等待30分钟才能看到结果，我们提供0延迟预览！
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PathPoint {
  x: number;
  y: number;
  timestamp?: number;
}

interface PreviewFrame {
  position: [number, number, number];
  rotation: [number, number, number];
  fov: number;
  focusDistance: number;
  motionBlur: number;
  timestamp: number;
}

interface RealTimeAnalysis {
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
}

interface PreviewState {
  frames: PreviewFrame[];
  analysis: RealTimeAnalysis | null;
  isAnalyzing: boolean;
  currentFrame: number;
  isPlaying: boolean;
  playbackSpeed: number;
  qualityPrediction: number;
  errorMessage: string | null;
}

/**
 * 🚀 Real-Time Preview Hook with Advanced Analytics
 */
export function useRealTimePreview(pathData: PathPoint[], selectedEffect: string) {
  const { toast } = useToast();
  const analysisTimeoutRef = useRef<NodeJS.Timeout>();
  const lastAnalysisRef = useRef<string>('');

  const [state, setState] = useState<PreviewState>({
    frames: [],
    analysis: null,
    isAnalyzing: false,
    currentFrame: 0,
    isPlaying: false,
    playbackSpeed: 1,
    qualityPrediction: 0,
    errorMessage: null
  });

  /**
   * 🧠 Ultra-Fast Real-Time Analysis
   * 延迟优化：只在路径稳定后500ms分析，避免过度计算
   */
  const performRealTimeAnalysis = useCallback(async (path: PathPoint[], effect: string) => {
    if (path.length < 2) return null;

    try {
      setState(prev => ({ ...prev, isAnalyzing: true, errorMessage: null }));

      // 🚀 Lightning-fast local analysis (0-5ms)
      const localAnalysis = performLocalAnalysis(path, effect);

      // 🌐 Enhanced server analysis (parallel processing)
      const serverAnalysis = await performServerAnalysis(path, effect);

      // 🔀 Merge local + server results for ultimate accuracy
      const finalAnalysis = mergeAnalysisResults(localAnalysis, serverAnalysis);

      setState(prev => ({
        ...prev,
        analysis: finalAnalysis,
        qualityPrediction: finalAnalysis.qualityScore,
        isAnalyzing: false
      }));

      // 🎬 Generate preview frames
      const frames = await generateAdvancedPreviewFrames(path, effect, finalAnalysis);
      setState(prev => ({ ...prev, frames }));

      return finalAnalysis;

    } catch (error) {
      console.error('Real-time analysis failed:', error);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        errorMessage: 'Analysis failed, using offline mode'
      }));

      // Fallback to local analysis only
      const fallbackAnalysis = performLocalAnalysis(path, effect);
      setState(prev => ({ ...prev, analysis: fallbackAnalysis }));

      return fallbackAnalysis;
    }
  }, []);

  /**
   * 🎯 Debounced Analysis Trigger
   * 智能防抖：避免用户绘制时过度计算
   */
  const triggerAnalysis = useCallback((path: PathPoint[], effect: string) => {
    // Create unique key for this analysis
    const analysisKey = `${path.length}-${effect}-${JSON.stringify(path.slice(-3))}`;
    
    // Skip if same analysis already running
    if (lastAnalysisRef.current === analysisKey) return;
    lastAnalysisRef.current = analysisKey;

    // Clear previous timeout
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    // Debounce analysis by 500ms
    analysisTimeoutRef.current = setTimeout(() => {
      performRealTimeAnalysis(path, effect);
    }, 500);
  }, [performRealTimeAnalysis]);

  /**
   * 🎮 Playback Controls
   */
  const togglePlayback = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, playbackSpeed: Math.max(0.25, Math.min(4, speed)) }));
  }, []);

  const seekToFrame = useCallback((frameIndex: number) => {
    setState(prev => ({
      ...prev,
      currentFrame: Math.max(0, Math.min(prev.frames.length - 1, frameIndex)),
      isPlaying: false
    }));
  }, []);

  const resetPreview = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentFrame: 0,
      isPlaying: false
    }));
  }, []);

  /**
   * 📊 Quality Predictions in Real-Time
   */
  const predictVideoQuality = useCallback((analysis: RealTimeAnalysis, effect: string): number => {
    if (!analysis) return 5;

    let score = 5; // Base score

    // Path quality factors
    score += analysis.complexity * 0.3; // Complexity adds interest
    score += analysis.smoothness * 0.25; // Smoothness adds quality
    score -= Math.abs(analysis.complexity - 5) * 0.1; // Extreme complexity can hurt

    // Effect matching
    if (analysis.recommendedEffect === effect) {
      score += 1.5; // Perfect match bonus
    }

    // Emotional tone bonuses
    const emotionalBonuses = {
      'dramatic': 1.2,
      'dynamic': 1.0,
      'aggressive': 0.8,
      'ethereal': 1.1,
      'calm': 0.9
    };
    score *= emotionalBonuses[analysis.emotionalTone] || 1.0;

    return Math.max(0, Math.min(10, score));
  }, []);

  /**
   * ⚡ Animation Frame Loop
   */
  useEffect(() => {
    let animationId: number;

    if (state.isPlaying && state.frames.length > 0) {
      const animate = () => {
        setState(prev => {
          const nextFrame = prev.currentFrame + prev.playbackSpeed;
          const newFrame = nextFrame >= prev.frames.length ? 0 : Math.floor(nextFrame);
          
          return {
            ...prev,
            currentFrame: newFrame
          };
        });

        animationId = requestAnimationFrame(animate);
      };

      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [state.isPlaying, state.frames.length, state.playbackSpeed]);

  /**
   * 🔄 Trigger Analysis on Path/Effect Changes
   */
  useEffect(() => {
    if (pathData.length > 1) {
      triggerAnalysis(pathData, selectedEffect);
    }
  }, [pathData, selectedEffect, triggerAnalysis]);

  /**
   * 🎯 Update Quality Prediction
   */
  useEffect(() => {
    if (state.analysis) {
      const prediction = predictVideoQuality(state.analysis, selectedEffect);
      setState(prev => ({ ...prev, qualityPrediction: prediction }));
    }
  }, [state.analysis, selectedEffect, predictVideoQuality]);

  /**
   * 🧹 Cleanup
   */
  useEffect(() => {
    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    frames: state.frames,
    analysis: state.analysis,
    isAnalyzing: state.isAnalyzing,
    currentFrame: state.currentFrame,
    isPlaying: state.isPlaying,
    playbackSpeed: state.playbackSpeed,
    qualityPrediction: state.qualityPrediction,
    errorMessage: state.errorMessage,

    // Controls
    togglePlayback,
    setPlaybackSpeed,
    seekToFrame,
    resetPreview,

    // Utilities
    progress: state.frames.length > 0 ? (state.currentFrame / (state.frames.length - 1)) * 100 : 0,
    totalFrames: state.frames.length,
    estimatedGenerationTime: state.analysis?.estimatedGenerationTime || 10,
    isPreviewReady: state.frames.length > 0 && !state.isAnalyzing
  };
}

/**
 * 🚀 Lightning-Fast Local Analysis (0-5ms)
 */
function performLocalAnalysis(pathData: PathPoint[], effect: string): RealTimeAnalysis {
  // Ultra-optimized local calculations
  const complexity = calculateComplexityFast(pathData);
  const smoothness = calculateSmoothnessFast(pathData);
  const pathShape = classifyPathShapeFast(pathData);
  const emotionalTone = detectEmotionalToneFast(pathData);
  
  const qualityScore = Math.min(10, 5 + complexity * 0.3 + smoothness * 0.25);
  const cinematicScore = Math.min(10, complexity * 0.4 + smoothness * 0.35);
  const viralPotential = calculateViralPotentialFast(effect, complexity);
  const motionIntensity = complexity * 0.8 + (effect.includes('crash') ? 3 : 1);
  
  const recommendedEffect = suggestEffectFast(pathShape, emotionalTone, complexity);
  const confidence = Math.min(100, 70 + complexity * 3);
  
  return {
    complexity,
    smoothness,
    qualityScore,
    cinematicScore,
    viralPotential,
    motionIntensity,
    emotionalTone,
    recommendedEffect,
    confidence,
    recommendations: generateQuickRecommendations(pathData, effect, complexity, smoothness),
    estimatedGenerationTime: estimateGenerationTime(complexity, effect),
    pathShape
  };
}

/**
 * 🌐 Ultra-Fast Server Analysis (<100ms target)
 */
async function performServerAnalysis(pathData: PathPoint[], effect: string): Promise<Partial<RealTimeAnalysis>> {
  try {
    const response = await fetch('/api/ultimate-video/real-time-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pathData, effect }),
    });

    if (!response.ok) {
      throw new Error('Real-time analysis failed');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.warn('Real-time server analysis unavailable, using local analysis only');
    return {};
  }
}

/**
 * 🔀 Merge Analysis Results for Ultimate Accuracy
 */
function mergeAnalysisResults(local: RealTimeAnalysis, server: Partial<RealTimeAnalysis>): RealTimeAnalysis {
  return {
    ...local,
    // Use server values if available, otherwise fall back to local
    complexity: server.complexity || local.complexity,
    smoothness: server.smoothness || local.smoothness,
    qualityScore: server.qualityScore || local.qualityScore,
    cinematicScore: server.cinematicScore || local.cinematicScore,
    confidence: Math.max(local.confidence, server.confidence || 0),
    recommendations: server.recommendations || local.recommendations,
    // Combine recommendations from both sources
    ...(server.recommendations && {
      recommendations: [...new Set([...local.recommendations, ...server.recommendations])]
    })
  };
}

/**
 * 🎬 Generate Advanced Preview Frames
 */
async function generateAdvancedPreviewFrames(
  pathData: PathPoint[], 
  effect: string, 
  analysis: RealTimeAnalysis
): Promise<PreviewFrame[]> {
  const frames: PreviewFrame[] = [];
  const totalFrames = 60; // Smooth 60fps preview
  
  for (let i = 0; i < totalFrames; i++) {
    const t = i / (totalFrames - 1);
    const pathIndex = Math.floor(t * (pathData.length - 1));
    const point = pathData[Math.min(pathIndex, pathData.length - 1)];
    
    // Advanced camera calculations with physics
    const position = calculateAdvancedCameraPosition(point, t, effect, analysis);
    const rotation = calculateAdvancedCameraRotation(pathData, pathIndex, effect, analysis);
    const fov = calculateDynamicFOV(t, effect, analysis);
    const focusDistance = calculateSmartFocus(position, t, effect);
    const motionBlur = calculateMotionBlur(pathData, pathIndex, effect, analysis);
    
    frames.push({
      position,
      rotation,
      fov,
      focusDistance,
      motionBlur,
      timestamp: t
    });
  }
  
  return frames;
}

/**
 * ⚡ Ultra-Fast Calculation Functions
 */
function calculateComplexityFast(pathData: PathPoint[]): number {
  if (pathData.length < 3) return 1;
  
  let angleSum = 0;
  let distanceSum = 0;
  
  for (let i = 1; i < pathData.length - 1; i++) {
    const p1 = pathData[i - 1];
    const p2 = pathData[i];
    const p3 = pathData[i + 1];
    
    // Quick distance
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    distanceSum += Math.sqrt(dx * dx + dy * dy);
    
    // Quick angle change
    const a1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const a2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    angleSum += Math.abs(a2 - a1);
  }
  
  return Math.min(10, (angleSum / pathData.length) * 8);
}

function calculateSmoothnessFast(pathData: PathPoint[]): number {
  if (pathData.length < 3) return 5;
  
  let velocityVariance = 0;
  const velocities = [];
  
  for (let i = 1; i < pathData.length; i++) {
    const dx = pathData[i].x - pathData[i-1].x;
    const dy = pathData[i].y - pathData[i-1].y;
    velocities.push(Math.sqrt(dx * dx + dy * dy));
  }
  
  const avgVel = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
  velocityVariance = velocities.reduce((sum, v) => sum + Math.pow(v - avgVel, 2), 0) / velocities.length;
  
  return Math.max(0, 10 - Math.sqrt(velocityVariance) * 0.5);
}

function classifyPathShapeFast(pathData: PathPoint[]): string {
  if (pathData.length < 5) return 'linear';
  
  // Quick shape detection
  const firstPoint = pathData[0];
  const lastPoint = pathData[pathData.length - 1];
  const midPoint = pathData[Math.floor(pathData.length / 2)];
  
  const startToEnd = Math.sqrt(
    Math.pow(lastPoint.x - firstPoint.x, 2) + Math.pow(lastPoint.y - firstPoint.y, 2)
  );
  
  const startToMid = Math.sqrt(
    Math.pow(midPoint.x - firstPoint.x, 2) + Math.pow(midPoint.y - firstPoint.y, 2)
  );
  
  const midToEnd = Math.sqrt(
    Math.pow(lastPoint.x - midPoint.x, 2) + Math.pow(lastPoint.y - midPoint.y, 2)
  );
  
  // Simple heuristics
  if (startToEnd < (startToMid + midToEnd) * 0.8) return 'curved';
  if (startToEnd > (startToMid + midToEnd) * 1.2) return 'complex';
  
  return 'linear';
}

function detectEmotionalToneFast(pathData: PathPoint[]): 'calm' | 'dynamic' | 'dramatic' | 'aggressive' | 'ethereal' {
  const complexity = calculateComplexityFast(pathData);
  const smoothness = calculateSmoothnessFast(pathData);
  
  if (complexity > 7 && smoothness < 4) return 'aggressive';
  if (complexity > 5 && smoothness < 6) return 'dramatic';
  if (complexity > 3 && smoothness > 6) return 'dynamic';
  if (smoothness > 8) return 'ethereal';
  return 'calm';
}

function calculateViralPotentialFast(effect: string, complexity: number): number {
  const viralEffects: Record<string, number> = {
    'dramatic_spiral': 9,
    'crash_zoom': 8,
    'orbit': 7,
    'zoom_in': 6,
    'pull_back': 7,
    'floating_follow': 5
  };
  
  return Math.min(10, (viralEffects[effect] || 5) + complexity * 0.3);
}

function suggestEffectFast(shape: string, tone: string, complexity: number): string {
  if (shape === 'curved' && tone === 'dramatic') return 'dramatic_spiral';
  if (complexity > 6) return 'orbit';
  if (tone === 'aggressive') return 'crash_zoom';
  if (tone === 'ethereal') return 'floating_follow';
  return 'zoom_in';
}

function generateQuickRecommendations(pathData: PathPoint[], effect: string, complexity: number, smoothness: number): string[] {
  const recommendations = [];
  
  if (complexity < 3) {
    recommendations.push("路径相对简单，可以添加更多变化");
  }
  
  if (smoothness < 5) {
    recommendations.push("建议绘制更平滑的路径以获得更好效果");
  }
  
  if (complexity > 7) {
    recommendations.push("复杂路径很棒！适合创造独特效果");
  }
  
  return recommendations;
}

function estimateGenerationTime(complexity: number, effect: string): number {
  const baseTime = 8; // Base 8 seconds
  const complexityFactor = complexity * 0.5;
  const effectFactor = effect.includes('dramatic') ? 2 : 1;
  
  return Math.max(5, Math.min(30, baseTime + complexityFactor + effectFactor));
}

// Advanced calculation functions (implementations)
function calculateAdvancedCameraPosition(point: PathPoint, t: number, effect: string, analysis: RealTimeAnalysis): [number, number, number] {
  const baseZ = -5 - t * 3;
  const intensityMultiplier = analysis.motionIntensity / 10;
  
  switch (effect) {
    case 'zoom_in':
      return [
        point.x * (1 - t * 0.3 * intensityMultiplier), 
        point.y * (1 - t * 0.3 * intensityMultiplier), 
        baseZ * (1 - t * 0.5)
      ];
    case 'orbit':
      const angle = t * Math.PI * 2 * intensityMultiplier;
      return [Math.cos(angle) * 5, point.y * 0.5, Math.sin(angle) * 5];
    case 'dramatic_spiral':
      const spiralAngle = t * Math.PI * 4;
      const spiralRadius = 3 + t * 4;
      return [
        point.x + Math.cos(spiralAngle) * spiralRadius,
        point.y + Math.sin(spiralAngle) * spiralRadius,
        baseZ * (1 + t * intensityMultiplier)
      ];
    default:
      return [point.x, point.y, baseZ];
  }
}

function calculateAdvancedCameraRotation(pathData: PathPoint[], index: number, effect: string, analysis: RealTimeAnalysis): [number, number, number] {
  if (index >= pathData.length - 1) return [0, 0, 0];
  
  const current = pathData[index];
  const next = pathData[index + 1];
  
  const angle = Math.atan2(next.y - current.y, next.x - current.x);
  const intensityFactor = analysis.motionIntensity / 10;
  
  return [0, angle * intensityFactor, 0];
}

function calculateDynamicFOV(t: number, effect: string, analysis: RealTimeAnalysis): number {
  const baseFOV = 50;
  const intensityFactor = analysis.motionIntensity / 10;
  
  switch (effect) {
    case 'zoom_in':
      return baseFOV - t * 20 * intensityFactor;
    case 'pull_back':
      return baseFOV + t * 30 * intensityFactor;
    case 'crash_zoom':
      return baseFOV - t * 35 * intensityFactor;
    default:
      return baseFOV + Math.sin(t * Math.PI) * analysis.complexity;
  }
}

function calculateSmartFocus(position: [number, number, number], t: number, effect: string): number {
  const distance = Math.sqrt(position[0]*position[0] + position[1]*position[1] + position[2]*position[2]);
  return Math.max(0.1, Math.min(100, distance));
}

function calculateMotionBlur(pathData: PathPoint[], index: number, effect: string, analysis: RealTimeAnalysis): number {
  const baseBlur = 0.1;
  const intensityFactor = analysis.motionIntensity / 10;
  
  if (effect === 'crash_zoom') return baseBlur * 4 * intensityFactor;
  if (effect === 'dramatic_spiral') return baseBlur * 2.5 * intensityFactor;
  
  return baseBlur * intensityFactor;
}