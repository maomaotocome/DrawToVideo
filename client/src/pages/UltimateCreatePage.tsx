/**
 * 🎬 Ultimate Draw to Video Creation Page
 * 超越Higgsfield的专业视频生成界面
 */

import { useState, useRef, useEffect } from "react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { HoverCardEnhanced } from "@/components/ui/hover-card-enhanced";
import { FadeIn } from "@/components/ui/fade-in";
import { ProgressEnhanced } from "@/components/ui/progress-enhanced";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UltimateEffectSelector } from "@/components/UltimateEffectSelector";
import { FixedCanvasDrawing } from "@/components/FixedCanvasDrawing";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { UserGuidancePanel } from "@/components/UserGuidancePanel";
import { useUltimateVideo } from "@/hooks/useUltimateVideo";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { AuthGate } from "@/components/AuthGate";
import { getUploadedImageFromSession, clearUploadedImageSession } from "@/components/ImageUploadHandler";
import { ClearSessionButton } from "@/components/ClearSessionButton";
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

// Ultimate Camera Effect Types
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
  const { isAuthenticated, isLoading, login } = useAuth();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("upload");
  const [selectedEffect, setSelectedEffect] = useState<UltimateCameraEffect>("zoom_in");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [pathData, setPathData] = useState<PathPoint[]>([]);
  
  // Debug: Track path data changes
  useEffect(() => {
    console.log('Path data updated:', pathData.length, 'points');
  }, [pathData]);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Camera effect name mapping function
  const getCameraEffectName = (effect: string): string => {
    const effectNames: Record<string, string> = {
      'zoom_in': 'Zoom In',
      'orbit': 'Orbit Shot', 
      'pull_back': 'Pull Back',
      'dramatic_spiral': 'Dramatic Spiral',
      'vertigo_effect': 'Vertigo Effect',
      'bullet_time': 'Bullet Time',
      'crash_zoom': 'Crash Zoom',
      'floating_follow': 'Floating Follow'
    };
    return effectNames[effect] || effect;
  };
  
  const { 
    isGenerating, 
    progress, 
    result, 
    error, 
    currentStep: generationStep,
    generateVideo,
    resetGeneration
  } = useUltimateVideo();

  const {
    subscription,
    handleGenerationAttempt,
    trackGeneration,
    showUpgradeModal,
    setShowUpgradeModal,
    upgradeTrigger,
    upgradeSubscription,
    getRemainingCredits,
    getRemainingGenerations
  } = useSubscription();

  // Check for uploaded image from landing page
  useEffect(() => {
    const sessionImageUrl = getUploadedImageFromSession();
    if (sessionImageUrl) {
      // 验证URL是否有效，如果是旧的Object Storage URL则忽略
      if (sessionImageUrl.includes('googleapis.com') && sessionImageUrl.includes('.private')) {
        console.log('Ignoring old broken Object Storage URL');
        clearUploadedImageSession();
        setCurrentStep("upload");
        return;
      }
      
      setUploadedImageUrl(sessionImageUrl);
      setCurrentStep("drawing");
      clearUploadedImageSession(); // Clean up after use
      toast({
        title: "Image Loaded",
        description: "Start drawing camera path",
      });
    }
  }, [toast]);

  // Sample Images
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

  // Drag and drop upload
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  };

  // Select sample image
  const selectSampleImage = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    setCurrentStep("drawing");
    toast({
      title: "Sample image selected",
      description: "Start drawing camera movement path",
    });
  };

  // Handle path drawing completion
  const handlePathComplete = (newPathData: PathPoint[]) => {
    setPathData(newPathData);
    if (newPathData.length > 3) {
      setCurrentStep("effect");
    }
  };

  // Start video generation with subscription check
  const handleGenerateVideo = async () => {
    if (!uploadedImageUrl || pathData.length === 0) return;

    // Check subscription limits
    if (!handleGenerationAttempt()) {
      return; // Will show upgrade modal automatically
    }

    setCurrentStep("processing");
    trackGeneration(); // Track usage
    
    try {
      await generateVideo({
        imageUrl: uploadedImageUrl,
        pathData,
        effect: selectedEffect,
        duration: 5,
        quality: subscription.plan === 'free' ? 'preview' : 'hd',
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

  // Restart workflow
  const handleRestart = () => {
    setCurrentStep("upload");
    setUploadedImageUrl("");
    setPathData([]);
    setSelectedEffect("zoom_in");
    resetGeneration();
  };

  // 如果用户未认证，显示认证界面
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthGate onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header and Progress */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {/* Subscription Status */}
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <div className="text-right text-sm">
                <div className="text-gray-600">
                  Credits: {getRemainingCredits()}/{subscription.creditsTotal}
                </div>
                <div className="text-gray-500 text-xs">
                  {subscription.plan.toUpperCase()} Plan
                </div>
              </div>
              {subscription.plan === 'free' && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  Upgrade
                </Button>
              )}
            </div>
            
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Draw to Video Studio
            </h1>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Transform your drawings into viral videos with AI-powered cinema effects
          </p>

          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            {[
              { step: 'upload', label: 'Upload', icon: Upload },
              { step: 'drawing', label: 'Draw Path', icon: Video },
              { step: 'effect', label: 'Choose Effect', icon: Sparkles },
              { step: 'processing', label: 'Generate', icon: Timer },
              { step: 'completed', label: 'Complete', icon: CheckCircle }
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

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          
          {/* Left: User Guidance Panel */}
          <div className="lg:col-span-1">
            <UserGuidancePanel 
              currentStep={currentStep}
              selectedEffect={selectedEffect}
              pathLength={pathData.length}
            />
          </div>
          
          {/* Right: Main Work Area */}
          <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Upload Image */}
          {currentStep === "upload" && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  Upload Image or Choose Sample
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
                  <p className="text-lg font-medium mb-2">Drop Your Image Here</p>
                  <p className="text-gray-500 mb-4">Supports JPG, PNG, GIF formats, max 10MB</p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Choose File
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

                {/* Sample Images */}
                <div>
                  <h3 className="font-medium mb-3">Or Choose Sample Image</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {SAMPLE_IMAGES.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-400 transition-colors"
                        onClick={() => selectSampleImage(imageUrl)}
                      >
                        <img
                          src={imageUrl}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Draw Path */}
          {currentStep === "drawing" && uploadedImageUrl && (
            <div className="space-y-6">
              <FixedCanvasDrawing
                imageUrl={uploadedImageUrl}
                selectedEffect={selectedEffect}
                onPathChange={setPathData}
                isGenerating={isGenerating}
              />
              
              <div className="text-center space-y-3">
                <div className="text-sm text-gray-600">
                  {pathData.length > 0 
                    ? `Path drawn with ${pathData.length} points • Ready for camera effect`
                    : 'Draw a path on the image to continue'
                  }
                </div>
                <div className="flex items-center justify-center gap-3">
                  {subscription.plan === 'free' && pathData.length > 0 && (
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getRemainingGenerations()} generations remaining today
                    </div>
                  )}
                  <AnimatedButton 
                    onClick={() => setCurrentStep("effect")} 
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    scaleOnHover={true}
                    disabled={pathData.length === 0}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Choose Camera Effect
                  </AnimatedButton>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Choose Effect */}
          {currentStep === "effect" && (
            <div className="space-y-6">
              <UltimateEffectSelector
                selectedEffect={selectedEffect}
                onEffectChange={(effect) => setSelectedEffect(effect as UltimateCameraEffect)}
                userPlan="free"
              />
              
              <div className="space-y-4">
                {subscription.plan === 'free' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-yellow-800 mb-2">
                      Free plan: {getRemainingGenerations()} generations remaining • Preview quality
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                      onClick={() => setShowUpgradeModal(true)}
                    >
                      Upgrade for HD & Unlimited
                    </Button>
                  </div>
                )}
                
                <div className="text-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep("drawing")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Edit Path
                  </Button>
                  
                  <AnimatedButton 
                    onClick={handleGenerateVideo}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    isLoading={isGenerating}
                    loadingText="Generating..."
                    scaleOnHover={true}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Generate Video
                  </AnimatedButton>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Processing */}
          {currentStep === "processing" && (
            <FadeIn direction="up" delay={0}>
              <HoverCardEnhanced className="w-full max-w-2xl mx-auto" shadowIntensity="xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-purple-600 animate-spin" />
                  Generating Cinema-Quality Video
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <ProgressEnhanced value={progress} className="w-full" animated={true} color="purple" showPercentage={false} />
                  <p className="text-sm text-muted-foreground text-center">
                    {generationStep || 'Preparing to generate...'}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Generation Details</h4>
                  <div className="text-sm space-y-1">
                    <p>Effect: <Badge variant="outline">{getCameraEffectName(selectedEffect)}</Badge></p>
                    <p>Path Points: {pathData.length}</p>
                    <p>Quality: {subscription.plan === 'free' ? 'Preview (480p)' : 'HD (1080p)'}</p>
                    <p>Credits Used: 1/{subscription.creditsTotal}</p>
                    <p>Estimated Time: 5-15 seconds</p>
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
                      Retry
                    </Button>
                  </div>
                )}
              </CardContent>
              </HoverCardEnhanced>
            </FadeIn>
          )}

          {/* Step 5: Complete */}
          {currentStep === "completed" && result && (
            <FadeIn direction="up" delay={0}>
              <HoverCardEnhanced className="w-full max-w-2xl mx-auto" shadowIntensity="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Video Generated Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video Preview */}
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video 
                    src={result.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                    poster={result.thumbnailUrl}
                  >
                    Your browser does not support video playback
                  </video>
                </div>

                {/* Video Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{result.analytics?.qualityScore?.toFixed(1) || '9.2'}</p>
                    <p className="text-xs text-gray-600">Quality Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{result.metadata.resolution}</p>
                    <p className="text-xs text-gray-600">Resolution</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{result.metadata.fps}fps</p>
                    <p className="text-xs text-gray-600">Frame Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-600">{result.metadata.generationTime.toFixed(1)}s</p>
                    <p className="text-xs text-gray-600">Generation Time</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download Video
                  </Button>
                  
                  <Button variant="outline" className="flex-1" size="lg">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Video
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleRestart}
                    size="lg"
                  >
                    Create New Video
                  </Button>
                </div>
              </CardContent>
              </HoverCardEnhanced>
            </FadeIn>
          )}
          
          </div>
        </div>
      </div>
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger={upgradeTrigger}
        onUpgrade={upgradeSubscription}
      />
    </div>
  );
}