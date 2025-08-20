/**
 * 🎥 Real-Time Preview System - Day 3 Implementation
 * 超越Higgsfield的核心差异化功能 - 实时预览相机轨迹和效果
 * Higgsfield没有实时预览，用户需要等待30分钟才能看到结果！
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Camera, 
  Zap, 
  TrendingUp,
  Target,
  Sparkles
} from 'lucide-react';

interface PathPoint {
  x: number;
  y: number;
  timestamp?: number;
}

interface PreviewFrame {
  position: [number, number, number];
  rotation: [number, number, number];
  fov: number;
  timestamp: number;
}

interface RealTimePreviewProps {
  pathData: PathPoint[];
  selectedEffect: string;
  imageUrl?: string;
  onQualityUpdate?: (score: number) => void;
  onRecommendationUpdate?: (recommendations: string[]) => void;
}

/**
 * 🚀 Real-Time Preview Component
 * 实时显示相机轨迹、效果预测、质量评估
 */
export const RealTimePreview: React.FC<RealTimePreviewProps> = ({
  pathData,
  selectedEffect,
  imageUrl,
  onQualityUpdate,
  onRecommendationUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Preview state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [previewFrames, setPreviewFrames] = useState<PreviewFrame[]>([]);
  const [qualityScore, setQualityScore] = useState(0);
  const [cinematicScore, setCinematicScore] = useState(0);
  const [previewSpeed, setPreviewSpeed] = useState(1);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * 🧠 Real-Time Path Analysis
   */
  const analyzePathInRealTime = useCallback(async (path: PathPoint[]) => {
    if (path.length < 2) return;
    
    setIsAnalyzing(true);
    
    // Simulate real-time analysis (in production, this would be optimized)
    const analysis = await performRealTimeAnalysis(path, selectedEffect);
    
    setAnalysisData(analysis);
    setQualityScore(analysis.qualityScore);
    setCinematicScore(analysis.cinematicScore);
    
    // Generate preview frames
    const frames = generatePreviewFrames(path, selectedEffect, analysis);
    setPreviewFrames(frames);
    
    // Update callbacks
    onQualityUpdate?.(analysis.qualityScore);
    onRecommendationUpdate?.(analysis.recommendations);
    
    setIsAnalyzing(false);
  }, [selectedEffect, onQualityUpdate, onRecommendationUpdate]);

  /**
   * 🎬 Generate Preview Frames for Animation
   */
  const generatePreviewFrames = (path: PathPoint[], effect: string, analysis: any): PreviewFrame[] => {
    const frames: PreviewFrame[] = [];
    const totalFrames = 60; // 60 frames for smooth preview
    
    for (let i = 0; i < totalFrames; i++) {
      const t = i / (totalFrames - 1);
      const pathIndex = Math.floor(t * (path.length - 1));
      const point = path[Math.min(pathIndex, path.length - 1)];
      
      // Calculate camera position based on effect
      const position = calculateCameraPosition(point, t, effect, analysis);
      const rotation = calculateCameraRotation(path, pathIndex, effect);
      const fov = calculateDynamicFOV(t, effect, analysis.complexity);
      
      frames.push({
        position,
        rotation,
        fov,
        timestamp: t
      });
    }
    
    return frames;
  };

  /**
   * 🎨 Canvas Rendering System
   */
  const renderPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pathData.length || !previewFrames.length) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render background image if available
    if (imageUrl) {
      renderBackgroundImage(ctx, canvas, imageUrl);
    }
    
    // Render path trail
    renderPathTrail(ctx, pathData, currentFrame);
    
    // Render camera position and FOV
    if (previewFrames[currentFrame]) {
      renderCameraVisualization(ctx, canvas, previewFrames[currentFrame]);
    }
    
    // Render effect visualization
    renderEffectVisualization(ctx, canvas, selectedEffect, currentFrame);
    
    // Render analysis overlays
    renderAnalysisOverlay(ctx, canvas, analysisData);
    
  }, [pathData, selectedEffect, imageUrl, currentFrame, previewFrames, analysisData]);

  /**
   * 🎮 Animation Control
   */
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const resetPreview = () => {
    setCurrentFrame(0);
    setIsPlaying(false);
  };

  /**
   * ⚡ Animation Loop
   */
  useEffect(() => {
    if (isPlaying && previewFrames.length > 0) {
      animationRef.current = requestAnimationFrame(() => {
        setCurrentFrame(prev => {
          const next = prev + previewSpeed;
          return next >= previewFrames.length ? 0 : next;
        });
      });
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentFrame, previewFrames.length, previewSpeed]);

  /**
   * 🔄 Real-Time Updates
   */
  useEffect(() => {
    if (pathData.length > 1) {
      analyzePathInRealTime(pathData);
    }
  }, [pathData, selectedEffect, analyzePathInRealTime]);

  /**
   * 🎨 Canvas Rendering
   */
  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  return (
    <div className="space-y-4">
      {/* Preview Canvas */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-purple-500/30">
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
          <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
            <Eye className="w-3 h-3 mr-1" />
            Real-Time Preview
          </Badge>
          {selectedEffect && (
            <Badge variant="outline" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
              {selectedEffect.replace('_', ' ').toUpperCase()}
            </Badge>
          )}
        </div>
        
        {/* Quality Indicators */}
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-right">
            <div className="text-xs text-gray-400">Quality Score</div>
            <div className="text-lg font-bold text-green-400">
              {qualityScore.toFixed(1)}/10
            </div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-right">
            <div className="text-xs text-gray-400">Cinematic</div>
            <div className="text-lg font-bold text-purple-400">
              {cinematicScore.toFixed(1)}/10
            </div>
          </div>
        </div>
        
        {/* Canvas */}
        <canvas 
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-[400px] rounded-lg"
        />
        
        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2 animate-spin" />
              <div className="text-white font-medium">Analyzing Path...</div>
              <div className="text-gray-400 text-sm">Real-time camera calculation</div>
            </div>
          </div>
        )}
      </Card>

      {/* 📱 Mobile-Optimized Preview Controls */}
      <Card className="p-3 sm:p-4 bg-slate-800/50 border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-4">
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={togglePlayback}
              className="bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/30 touch-manipulation min-w-12"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetPreview}
              className="bg-slate-600/20 hover:bg-slate-600/30 border-slate-500/30 touch-manipulation min-w-12"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="min-w-12">Speed:</span>
            <Slider 
              value={[previewSpeed]} 
              onValueChange={(value) => setPreviewSpeed(value[0])}
              min={0.5}
              max={3}
              step={0.5}
              className="w-16 sm:w-20"
            />
            <span className="min-w-8">{previewSpeed}x</span>
          </div>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Frame {currentFrame + 1} / {previewFrames.length}</span>
            <span>{((currentFrame / Math.max(previewFrames.length - 1, 1)) * 100).toFixed(0)}%</span>
          </div>
          <Progress 
            value={(currentFrame / Math.max(previewFrames.length - 1, 1)) * 100} 
            className="h-2 bg-slate-700"
          />
        </div>
      </Card>

      {/* 📱 Mobile-Optimized Analysis Results */}
      {analysisData && (
        <Card className="p-3 sm:p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white">Real-Time Analysis</h3>
            </div>
            <Badge variant="secondary" className="bg-green-600/20 text-green-300 self-start sm:self-auto">
              {analysisData.confidence?.toFixed(0)}% Confidence
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-400">{analysisData.complexity?.toFixed(1)}</div>
              <div className="text-xs text-gray-400">Complexity</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-400">{analysisData.smoothness?.toFixed(1)}</div>
              <div className="text-xs text-gray-400">Smoothness</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-400">{analysisData.viralPotential?.toFixed(1)}</div>
              <div className="text-xs text-gray-400">Viral Score</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-400">{analysisData.motionIntensity?.toFixed(1)}</div>
              <div className="text-xs text-gray-400">Motion</div>
            </div>
          </div>
          
          {/* Recommendations */}
          {analysisData.recommendations && analysisData.recommendations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-300">Smart Recommendations:</span>
              </div>
              <div className="space-y-1">
                {analysisData.recommendations.slice(0, 3).map((rec: string, index: number) => (
                  <div key={index} className="text-xs sm:text-sm text-gray-300 bg-slate-800/50 rounded p-2">
                    • {rec}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

/**
 * 🔧 Helper Functions for Real-Time Analysis and Rendering
 */

async function performRealTimeAnalysis(pathData: PathPoint[], effect: string) {
  // Simulate API call to our advanced analysis system
  await new Promise(resolve => setTimeout(resolve, 100)); // Fast analysis!
  
  // Calculate real metrics
  const complexity = calculatePathComplexity(pathData);
  const smoothness = calculatePathSmoothness(pathData);
  const qualityScore = Math.min(10, 6 + complexity * 0.3 + smoothness * 0.2);
  const cinematicScore = Math.min(10, complexity * 0.4 + smoothness * 0.6);
  const viralPotential = calculateViralPotential(effect, complexity);
  const motionIntensity = complexity * 0.8 + (effect.includes('crash') ? 3 : 1);
  const confidence = Math.min(100, 70 + complexity * 3);
  
  const recommendations = generateSmartRecommendations(pathData, effect, {
    complexity, smoothness, qualityScore
  });
  
  return {
    complexity,
    smoothness,
    qualityScore,
    cinematicScore,
    viralPotential,
    motionIntensity,
    confidence,
    recommendations
  };
}

function calculatePathComplexity(pathData: PathPoint[]): number {
  if (pathData.length < 2) return 1;
  
  let totalAngleChange = 0;
  let totalDistance = 0;
  
  for (let i = 1; i < pathData.length - 1; i++) {
    const p1 = pathData[i - 1];
    const p2 = pathData[i];
    const p3 = pathData[i + 1];
    
    // Distance
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    totalDistance += Math.sqrt(dx * dx + dy * dy);
    
    // Angle change
    const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    totalAngleChange += Math.abs(angle2 - angle1);
  }
  
  const avgAngleChange = totalAngleChange / Math.max(1, pathData.length - 2);
  return Math.min(10, avgAngleChange * 5);
}

function calculatePathSmoothness(pathData: PathPoint[]): number {
  if (pathData.length < 3) return 5;
  
  const velocities = [];
  for (let i = 1; i < pathData.length; i++) {
    const dx = pathData[i].x - pathData[i-1].x;
    const dy = pathData[i].y - pathData[i-1].y;
    velocities.push(Math.sqrt(dx * dx + dy * dy));
  }
  
  // Calculate velocity variance
  const avgVel = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
  const variance = velocities.reduce((sum, v) => sum + Math.pow(v - avgVel, 2), 0) / velocities.length;
  
  return Math.max(0, 10 - Math.sqrt(variance));
}

function calculateViralPotential(effect: string, complexity: number): number {
  const viralEffects: Record<string, number> = {
    'dramatic_spiral': 9,
    'crash_zoom': 8,
    'orbit': 7,
    'zoom_in': 6,
    'pull_back': 7,
    'floating_follow': 5
  };
  
  const baseScore = viralEffects[effect] || 5;
  const complexityBonus = Math.min(2, complexity / 3);
  
  return Math.min(10, baseScore + complexityBonus);
}

function generateSmartRecommendations(pathData: PathPoint[], effect: string, analysis: any): string[] {
  const recommendations = [];
  
  if (analysis.complexity < 3) {
    recommendations.push("添加更多曲线变化可以增加视觉吸引力");
  }
  
  if (analysis.smoothness < 5) {
    recommendations.push("路径过于急躁，建议绘制更平滑的曲线");
  }
  
  if (analysis.qualityScore > 8) {
    recommendations.push("路径质量很高，适合生成专业级视频");
  }
  
  if (effect === 'dramatic_spiral' && analysis.complexity < 6) {
    recommendations.push("螺旋效果建议使用更复杂的路径");
  }
  
  return recommendations;
}

// Camera calculation functions
function calculateCameraPosition(point: PathPoint, t: number, effect: string, analysis: any): [number, number, number] {
  const baseZ = -5 - t * 3;
  
  switch (effect) {
    case 'zoom_in':
      return [point.x * (1 - t * 0.3), point.y * (1 - t * 0.3), baseZ * (1 - t * 0.5)];
    case 'orbit':
      const angle = t * Math.PI * 2;
      return [Math.cos(angle) * 5, point.y * 0.5, Math.sin(angle) * 5];
    case 'pull_back':
      return [point.x * (1 + t * 2), point.y * (1 + t * 2), baseZ * (1 + t)];
    default:
      return [point.x, point.y, baseZ];
  }
}

function calculateCameraRotation(pathData: PathPoint[], index: number, effect: string): [number, number, number] {
  if (index >= pathData.length - 1) return [0, 0, 0];
  
  const current = pathData[index];
  const next = pathData[index + 1];
  
  const angle = Math.atan2(next.y - current.y, next.x - current.x);
  return [0, angle, 0];
}

function calculateDynamicFOV(t: number, effect: string, complexity: number): number {
  const baseFOV = 50;
  
  switch (effect) {
    case 'zoom_in':
      return baseFOV - t * 20;
    case 'pull_back':
      return baseFOV + t * 30;
    case 'crash_zoom':
      return baseFOV - t * 35;
    default:
      return baseFOV + Math.sin(t * Math.PI) * complexity;
  }
}

// Canvas rendering functions (simplified for space)
function renderBackgroundImage(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, imageUrl: string) {
  // Placeholder for background image rendering
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function renderPathTrail(ctx: CanvasRenderingContext2D, pathData: PathPoint[], currentFrame: number) {
  if (pathData.length < 2) return;
  
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  for (let i = 0; i < pathData.length - 1; i++) {
    const alpha = Math.max(0.2, 1 - (currentFrame - i) * 0.05);
    ctx.globalAlpha = alpha;
    
    if (i === 0) {
      ctx.moveTo(pathData[i].x, pathData[i].y);
    } else {
      ctx.lineTo(pathData[i].x, pathData[i].y);
    }
  }
  
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function renderCameraVisualization(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: PreviewFrame) {
  const [x, y] = frame.position;
  
  // Camera position
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(x + canvas.width/2, y + canvas.height/2, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // FOV visualization
  ctx.strokeStyle = '#f59e0b';
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(x + canvas.width/2, y + canvas.height/2, frame.fov * 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function renderEffectVisualization(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, effect: string, frame: number) {
  // Effect-specific visual indicators
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  switch (effect) {
    case 'dramatic_spiral':
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      const spiralRadius = 20 + frame * 2;
      const spiralAngle = frame * 0.2;
      
      for (let i = 0; i < 3; i++) {
        const angle = spiralAngle + i * (Math.PI * 2 / 3);
        const x = centerX + Math.cos(angle) * spiralRadius;
        const y = centerY + Math.sin(angle) * spiralRadius;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
      
    case 'crash_zoom':
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      const zoomLines = 8;
      for (let i = 0; i < zoomLines; i++) {
        const angle = (i / zoomLines) * Math.PI * 2;
        const length = 20 + frame * 3;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * length,
          centerY + Math.sin(angle) * length
        );
        ctx.stroke();
      }
      break;
  }
}

function renderAnalysisOverlay(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, analysisData: any) {
  if (!analysisData) return;
  
  // Quality indicator
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, 10, 150, 60);
  
  ctx.fillStyle = '#10b981';
  ctx.font = '14px sans-serif';
  ctx.fillText(`Quality: ${analysisData.qualityScore?.toFixed(1)}/10`, 20, 30);
  ctx.fillText(`Complexity: ${analysisData.complexity?.toFixed(1)}`, 20, 50);
}