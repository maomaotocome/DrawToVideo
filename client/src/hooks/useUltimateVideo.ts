/**
 * 🎬 Ultimate Video Generation Hook
 * 管理整个视频生成流程的React Hook
 */

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { PathPoint, UltimateVideoGeneration, VideoGenerationResult } from "@shared/ultimateSchema";

interface VideoGenerationState {
  isGenerating: boolean;
  progress: number;
  result: VideoGenerationResult | null;
  error: string | null;
  currentStep: string;
}

export function useUltimateVideo() {
  const { toast } = useToast();
  
  const [state, setState] = useState<VideoGenerationState>({
    isGenerating: false,
    progress: 0,
    result: null,
    error: null,
    currentStep: ''
  });

  const generateVideo = useCallback(async (options: UltimateVideoGeneration) => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      progress: 0,
      error: null,
      currentStep: '准备生成...'
    }));

    try {
      // Step 1: 路径分析
      setState(prev => ({ ...prev, progress: 10, currentStep: '分析绘制路径...' }));
      
      // 模拟路径分析时间
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: 相机轨迹生成
      setState(prev => ({ ...prev, progress: 25, currentStep: '生成电影级相机轨迹...' }));
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Step 3: 视频生成
      setState(prev => ({ ...prev, progress: 40, currentStep: `应用${options.effect}效果...` }));
      
      const response = await fetch('/api/ultimate-video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error('视频生成请求失败');
      }

      const responseData = await response.json();
      
      if (!responseData.success) {
        throw new Error(responseData.error || '视频生成失败');
      }

      // Step 4: 后处理
      setState(prev => ({ ...prev, progress: 75, currentStep: '优化视频质量...' }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 5: 完成
      setState(prev => ({ 
        ...prev, 
        progress: 100, 
        currentStep: '生成完成！', 
        isGenerating: false,
        result: responseData.data 
      }));

      toast({
        title: "🎉 视频生成成功！",
        description: `${options.effect}效果已生成，质量评分：${responseData.data.analytics?.qualityScore?.toFixed(1)}/10`,
      });

      return responseData.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
        currentStep: '生成失败'
      }));

      toast({
        title: "❌ 视频生成失败",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  }, [toast]);

  const analyzePathData = useCallback(async (pathData: PathPoint[]) => {
    try {
      const response = await fetch('/api/ultimate-video/analyze-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pathData }),
      });

      if (!response.ok) {
        throw new Error('路径分析失败');
      }

      const responseData = await response.json();
      return responseData.data;

    } catch (error) {
      console.error('Path analysis error:', error);
      return null;
    }
  }, []);

  const getAvailableEffects = useCallback(async () => {
    try {
      const response = await fetch('/api/ultimate-video/effects');
      
      if (!response.ok) {
        throw new Error('获取效果列表失败');
      }

      const responseData = await response.json();
      return responseData.data;

    } catch (error) {
      console.error('Effects fetch error:', error);
      return [];
    }
  }, []);

  const resetGeneration = useCallback(() => {
    setState({
      isGenerating: false,
      progress: 0,
      result: null,
      error: null,
      currentStep: ''
    });
  }, []);

  return {
    // 状态
    isGenerating: state.isGenerating,
    progress: state.progress,
    result: state.result,
    error: state.error,
    currentStep: state.currentStep,
    
    // 方法
    generateVideo,
    analyzePathData, 
    getAvailableEffects,
    resetGeneration,
  };
}