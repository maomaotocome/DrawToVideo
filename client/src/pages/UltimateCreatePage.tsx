/**
 * 🎬 Ultimate Draw to Video Creation Page
 * 超越Higgsfield的专业视频生成界面
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { UltimateEffectSelector } from "@/components/UltimateEffectSelector";
import { UltimateCanvasDrawing } from "@/components/UltimateCanvasDrawing";
import { useUltimateVideo } from "@/hooks/useUltimateVideo";
import { getUploadedImageFromSession, clearUploadedImageSession } from "@/components/ImageUploadHandler";
import { 
  ArrowLeft, 
  Upload, 
  Sparkles, 
  Video, 
  Download,
  Share2,
  CheckCircle,
  Play,
  Timer
} from "lucide-react";

// 终极相机效果类型
type UltimateCameraEffect = 
  | "zoom_in" 
  | "orbit" 
  | "pull_back" 
  | "dramatic_spiral" 
  | "vertigo_effect" 
  | "bullet_time" 
  | "crash_zoom" 
  | "floating_follow";

type WorkflowStep = "upload" | "drawing" | "effect" | "processing" | "completed";

interface PathPoint {
  x: number;
  y: number;
  timestamp?: number;
}

export default function UltimateCreatePage() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("upload");
  const [selectedEffect, setSelectedEffect] = useState<UltimateCameraEffect>("zoom_in");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [pathData, setPathData] = useState<PathPoint[]>([]);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { 
    isGenerating, 
    progress, 
    result, 
    error, 
    currentStep: generationStep,
    generateVideo,
    resetGeneration
  } = useUltimateVideo();

  // 检查是否有从落地页上传的图片
  useEffect(() => {
    const sessionImageUrl = getUploadedImageFromSession();
    if (sessionImageUrl) {
      setUploadedImageUrl(sessionImageUrl);
      setCurrentStep("drawing");
      clearUploadedImageSession(); // 使用后清理
      toast({
        title: "图片已加载",
        description: "开始绘制运镜路径",
      });
    }
  }, [toast]);

  // 示例图片
  const SAMPLE_IMAGES = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop"
  ];

  // 文件上传处理
  const handleFileUpload = async (file: File) => {
    try {
      // 使用直接上传API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('public', 'true');

      const uploadResponse = await fetch('/api/images/direct-upload', { 
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const result = await uploadResponse.json();
      
      if (result.success) {
        setUploadedImageUrl(result.publicUrl);
        setCurrentStep("drawing");
        
        toast({
          title: "图片上传成功",
          description: "现在开始绘制运镜路径",
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "上传失败",
        description: "请重试或选择示例图片",
        variant: "destructive"
      });
    }
  };

  // 拖拽上传
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  };

  // 选择示例图片
  const selectSampleImage = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    setCurrentStep("drawing");
    toast({
      title: "示例图片已选择",
      description: "开始绘制运镜路径",
    });
  };

  // 路径绘制完成
  const handlePathComplete = (newPathData: PathPoint[]) => {
    setPathData(newPathData);
    if (newPathData.length > 5) {
      setCurrentStep("effect");
    }
  };

  // 开始视频生成
  const handleGenerateVideo = async () => {
    if (!uploadedImageUrl || pathData.length === 0) return;

    setCurrentStep("processing");
    
    try {
      await generateVideo({
        imageUrl: uploadedImageUrl,
        pathData,
        effect: selectedEffect,
        duration: 5,
        quality: 'hd',
        socialPlatform: 'general',
        aspectRatio: '16:9',
        style: 'cinematic'
      });
      
      setCurrentStep("completed");
    } catch (error) {
      console.error('Generation failed:', error);
      setCurrentStep("effect");
    }
  };

  // 重新开始
  const handleRestart = () => {
    setCurrentStep("upload");
    setUploadedImageUrl("");
    setPathData([]);
    setSelectedEffect("zoom_in");
    resetGeneration();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* 顶部标题和进度 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🎬 Ultimate Draw to Video
            </h1>
          </div>
          
          <p className="text-muted-foreground mb-6">
            超越Higgsfield的专业视频生成平台 - 零提示词，纯视觉操作
          </p>

          {/* 步骤进度条 */}
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            {[
              { step: 'upload', label: '上传图片', icon: Upload },
              { step: 'drawing', label: '绘制路径', icon: Video },
              { step: 'effect', label: '选择效果', icon: Sparkles },
              { step: 'processing', label: '生成视频', icon: Timer },
              { step: 'completed', label: '完成', icon: CheckCircle }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep === step ? 'bg-purple-600 text-white' :
                  ['upload', 'drawing', 'effect', 'processing', 'completed'].indexOf(currentStep) > index ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="ml-2 text-xs font-medium hidden sm:block">{label}</span>
                {index < 4 && <div className="w-8 h-0.5 bg-gray-300 mx-2 hidden sm:block"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-6xl mx-auto">
          
          {/* 步骤1: 上传图片 */}
          {currentStep === "upload" && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  上传图片或选择示例
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 拖拽上传区域 */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300'
                  }`}
                  onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">拖拽图片到这里</p>
                  <p className="text-gray-500 mb-4">支持 JPG, PNG, GIF 格式，最大 10MB</p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    选择文件
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </div>

                {/* 示例图片 */}
                <div>
                  <h3 className="font-medium mb-3">或选择示例图片</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {SAMPLE_IMAGES.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-400 transition-colors"
                        onClick={() => selectSampleImage(imageUrl)}
                      >
                        <img
                          src={imageUrl}
                          alt={`示例 ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 步骤2: 绘制路径 */}
          {currentStep === "drawing" && uploadedImageUrl && (
            <div className="space-y-6">
              <UltimateCanvasDrawing
                imageUrl={uploadedImageUrl}
                onPathChange={handlePathComplete}
                selectedEffect={selectedEffect}
                isGenerating={isGenerating}
              />
              
              {pathData.length > 5 && (
                <div className="text-center">
                  <Button onClick={() => setCurrentStep("effect")} size="lg">
                    选择相机效果 <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* 步骤3: 选择效果 */}
          {currentStep === "effect" && (
            <div className="space-y-6">
              <UltimateEffectSelector
                selectedEffect={selectedEffect}
                onEffectChange={(effect) => setSelectedEffect(effect as UltimateCameraEffect)}
                userPlan="free"
              />
              
              <div className="text-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("drawing")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  修改路径
                </Button>
                
                <Button 
                  onClick={handleGenerateVideo}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  生成视频
                </Button>
              </div>
            </div>
          )}

          {/* 步骤4: 处理中 */}
          {currentStep === "processing" && (
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-purple-600 animate-spin" />
                  正在生成电影级视频
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">进度</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    {generationStep || '准备生成...'}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">生成信息</h4>
                  <div className="text-sm space-y-1">
                    <p>效果: <Badge variant="outline">{selectedEffect}</Badge></p>
                    <p>路径点数: {pathData.length}</p>
                    <p>预计时间: 5-15秒</p>
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-700">{error}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentStep("effect")}
                      className="mt-2"
                    >
                      重试
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 步骤5: 完成 */}
          {currentStep === "completed" && result && (
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  视频生成完成！
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 视频预览 */}
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video 
                    src={result.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                    poster={result.thumbnailUrl}
                  >
                    您的浏览器不支持视频播放
                  </video>
                </div>

                {/* 视频信息 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{result.analytics?.qualityScore?.toFixed(1) || '9.2'}</p>
                    <p className="text-xs text-gray-600">质量评分</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{result.metadata.resolution}</p>
                    <p className="text-xs text-gray-600">分辨率</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{result.metadata.fps}fps</p>
                    <p className="text-xs text-gray-600">帧率</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-600">{result.metadata.generationTime.toFixed(1)}s</p>
                    <p className="text-xs text-gray-600">生成时间</p>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    下载视频
                  </Button>
                  
                  <Button variant="outline" className="flex-1" size="lg">
                    <Share2 className="w-4 h-4 mr-2" />
                    分享视频
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleRestart}
                    size="lg"
                  >
                    重新创建
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}