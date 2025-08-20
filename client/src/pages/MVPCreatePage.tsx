import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { UltimateEffectSelector } from "@/components/UltimateEffectSelector";
import { 
  ArrowLeft, 
  ArrowUp,
  Upload, 
  Sparkles, 
  Video, 
  Zap,
  Target,
  Camera,
  Play,
  Download,
  Share2,
  RotateCcw,
  Undo,
  RefreshCw,
  Eye,
  MousePointer2,
  Timer,
  CheckCircle
} from "lucide-react";

// 🎬 终极相机效果类型 - 扩展超越Higgsfield
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
  pressure?: number;
}

interface DrawingPath {
  points: PathPoint[];
  id: string;
}

// 🎬 终极相机效果配置
const ULTIMATE_CAMERA_EFFECTS = [
  {
    id: "zoom_in" as UltimateCameraEffect,
    name: "Zoom In",
    description: "Camera pushes forward along path - perfect for product reveals",
    icon: <Target className="w-6 h-6" />,
    preview: "Cinema-grade push movement",
    gradient: "from-blue-500 to-cyan-500",
    difficulty: "Beginner",
    estimatedTime: "5-10s"
  },
  {
    id: "orbit" as UltimateCameraEffect,
    name: "Orbit",
    description: "Smooth 360° rotation around subject",
    icon: <RotateCcw className="w-6 h-6" />,
    preview: "Professional circular movement", 
    gradient: "from-green-500 to-emerald-500",
    difficulty: "Beginner",
    estimatedTime: "8-15s"
  },
  {
    id: "pull_back" as UltimateCameraEffect,
    name: "Pull Back",
    description: "Dramatic reveal of the bigger picture",
    icon: <ArrowUp className="w-6 h-6" />,
    preview: "Cinematic reveal shot",
    gradient: "from-purple-500 to-violet-500",
    difficulty: "Intermediate", 
    estimatedTime: "10-20s"
  },
  {
    id: "dramatic_spiral" as UltimateCameraEffect,
    name: "Dramatic Spiral",
    description: "Viral spiral zoom with speed effects",
    icon: <Sparkles className="w-6 h-6" />,
    preview: "TikTok viral effect",
    gradient: "from-pink-500 to-rose-500",
    difficulty: "Advanced",
    estimatedTime: "15-25s",
    isNew: true
  },
  {
    id: "vertigo_effect" as UltimateCameraEffect,
    name: "Vertigo Effect",
    description: "Hitchcock zoom - push in while zoom out",
    icon: <Eye className="w-6 h-6" />,
    preview: "Mind-bending classic",
    gradient: "from-red-500 to-orange-500",
    difficulty: "Master",
    estimatedTime: "20-35s",
    isPremium: true
  },
  {
    id: "crash_zoom" as UltimateCameraEffect,
    name: "Crash Zoom",
    description: "Rapid aggressive zoom for impact moments",
    icon: <Zap className="w-6 h-6" />,
    preview: "Action movie style",
    gradient: "from-yellow-500 to-amber-500",
    difficulty: "Intermediate",
    estimatedTime: "8-15s"
  },
  {
    id: "floating_follow" as UltimateCameraEffect,
    name: "Floating Follow",
    description: "Dreamy organic camera movement",
    icon: <RefreshCw className="w-6 h-6" />,
    preview: "Ethereal movement",
    gradient: "from-teal-500 to-cyan-500",
    difficulty: "Advanced",
    estimatedTime: "12-20s"
  }
];

const CAMERA_EFFECTS = [
  {
    id: "zoom_in",
    name: "Zoom In",
    description: "Camera moves forward along the path - perfect for product reveals",
    icon: <Target className="w-6 h-6" />,
    preview: "Push into focus",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "orbit",
    name: "Orbit",
    description: "Camera circles around the subject - great for 360° showcases",
    icon: <RotateCcw className="w-6 h-6" />,
    preview: "Circular movement",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "pull_back",
    name: "Pull Back",
    description: "Camera pulls away to reveal the bigger picture",
    icon: <Eye className="w-6 h-6" />,
    preview: "Reveal the scene",
    gradient: "from-green-500 to-emerald-500"
  }
];

export default function MVPCreatePage() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [drawnPaths, setDrawnPaths] = useState<DrawingPath[]>([]);
  const [selectedEffect, setSelectedEffect] = useState<string>("zoom_in");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<PathPoint[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // 示例图片（根据MVP需求提供5张高质量示例）
  const SAMPLE_IMAGES = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop"
  ];

  // 检查URL参数
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const imageParam = urlParams.get('image');
    if (imageParam) {
      setUploadedImage(decodeURIComponent(imageParam));
      setCurrentStep("drawing");
    }
  }, []);

  // 初始化画布
  useEffect(() => {
    if (canvasRef.current && uploadedImage && currentStep === "drawing") {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        // 设置画布尺寸
        canvas.width = 800;
        canvas.height = 600;
        
        // 绘制背景图片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // 重绘所有路径
        drawnPaths.forEach(path => drawPath(ctx, path.points));
      };
      img.src = uploadedImage;
    }
  }, [uploadedImage, currentStep, drawnPaths]);

  const drawPath = (ctx: CanvasRenderingContext2D, points: PathPoint[]) => {
    if (points.length < 2) return;

    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.stroke();
    
    // 绘制方向箭头
    if (points.length > 10) {
      const lastPoint = points[points.length - 1];
      const secondLastPoint = points[points.length - 10];
      
      const angle = Math.atan2(lastPoint.y - secondLastPoint.y, lastPoint.x - secondLastPoint.x);
      const arrowLength = 15;
      
      ctx.fillStyle = '#6366F1';
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(
        lastPoint.x - arrowLength * Math.cos(angle - Math.PI / 6),
        lastPoint.y - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        lastPoint.x - arrowLength * Math.cos(angle + Math.PI / 6),
        lastPoint.y - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentStep !== "drawing") return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentStep !== "drawing") return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPath(prev => [...prev, { x, y }]);
    
    // 实时绘制
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && currentPath.length > 0) {
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(currentPath[currentPath.length - 1].x, currentPath[currentPath.length - 1].y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (currentPath.length > 5) {
      const newPath: DrawingPath = {
        id: Date.now().toString(),
        points: currentPath
      };
      setDrawnPaths(prev => [...prev, newPath]);
    }
    
    setCurrentPath([]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      // 检查文件大小（MVP限制：最大10MB）
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setCurrentStep("drawing");
        toast({
          title: "Image uploaded successfully",
          description: "Now draw a path to define camera movement"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleSampleImageSelect = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setCurrentStep("drawing");
    toast({
      title: "Sample image selected",
      description: "Draw a path to create your video"
    });
  };

  const clearCanvas = () => {
    setDrawnPaths([]);
    if (canvasRef.current && uploadedImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = uploadedImage;
      }
    }
  };

  const undoLastPath = () => {
    if (drawnPaths.length > 0) {
      setDrawnPaths(prev => prev.slice(0, -1));
    }
  };

  const handleContinueToEffects = () => {
    if (drawnPaths.length === 0) {
      toast({
        title: "No path drawn",
        description: "Please draw at least one path to continue",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep("effect");
  };

  const handleEffectSelect = (effect: UltimateCameraEffect) => {
    setSelectedEffect(effect);
  };

  const handleGenerate = async () => {
    if (!selectedEffect) {
      toast({
        title: "No effect selected",
        description: "Please select a camera effect",
        variant: "destructive"
      });
      return;
    }

    if (!uploadedImage || drawnPaths.length === 0) {
      toast({
        title: "Missing required data",
        description: "Please upload an image and draw a path",
        variant: "destructive"
      });
      return;
    }

    setCurrentStep("processing");
    setProcessingProgress(0);

    try {
      // 🚀 REAL Video Generation using Ultimate Video API
      console.log("🎬 Starting REAL video generation...");
      
      // Prepare path data from drawn paths
      const pathData = drawnPaths.length > 0 
        ? drawnPaths[0].points 
        : [{ x: 0, y: 0 }, { x: 100, y: 100 }]; // fallback path

      // Update progress
      setProcessingProgress(10);

      // Call the real video generation API
      const response = await fetch('/api/ultimate-video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: uploadedImage,
          effect: selectedEffect,
          pathData: pathData,
          duration: 5,
          quality: 'hd'
        }),
      });

      setProcessingProgress(40);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error:", errorData);
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      setProcessingProgress(70);

      if (!result.success) {
        throw new Error(result.error || 'Video generation failed');
      }

      console.log("✅ Video generation successful:", result);

      setProcessingProgress(100);

      // Set the generated video URL
      setVideoUrl(result.data.videoUrl);
      setCurrentStep("completed");

      toast({
        title: result.isDemo ? "🎬 Demo video generated!" : "🎉 Video generated successfully!",
        description: result.isDemo 
          ? `${selectedEffect} effect analyzed from your path (${pathData.length} points). Add API token for custom generation.`
          : `${selectedEffect} effect applied. Quality: ${result.data.analytics?.qualityScore?.toFixed(1)}/10`,
      });

    } catch (error) {
      console.error("❌ Video generation failed:", error);
      
      setProcessingProgress(0);
      setCurrentStep("effect"); // Go back to effect selection
      
      toast({
        title: "❌ Video generation failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `drawvideo_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your video is being downloaded"
      });
    }
  };

  const handleStartOver = () => {
    setCurrentStep("upload");
    setUploadedImage(null);
    setDrawnPaths([]);
    setSelectedEffect(null);
    setVideoUrl(null);
    setProcessingProgress(0);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const renderUploadStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Upload Your Image
        </h1>
        <p className="text-xl text-gray-300">
          Start by uploading an image or choosing from our samples
        </p>
      </div>

      {/* Upload Area */}
      <Card 
        className={`mb-8 transition-all duration-300 cursor-pointer ${
          dragActive 
            ? 'border-blue-400 bg-blue-500/10 shadow-2xl shadow-blue-500/25' 
            : 'border-gray-600 hover:border-blue-500 hover:bg-blue-500/5'
        } bg-gradient-to-br from-white/[0.03] to-white/[0.08] backdrop-blur-xl`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-16 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Upload className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Drop your image here
          </h3>
          <p className="text-gray-400 mb-6">
            or click to browse • JPG, PNG, WebP up to 10MB
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="text-green-300 border-green-500/30 bg-green-500/10">
              High Quality
            </Badge>
            <Badge variant="outline" className="text-blue-300 border-blue-500/30 bg-blue-500/10">
              Auto Optimized
            </Badge>
            <Badge variant="outline" className="text-purple-300 border-purple-500/30 bg-purple-500/10">
              Instant Preview
            </Badge>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Sample Images */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">
          Or choose from sample images
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {SAMPLE_IMAGES.map((imageUrl, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:scale-105 transition-all duration-300 bg-white/5 border-white/20 hover:border-blue-500/50"
              onClick={() => handleSampleImageSelect(imageUrl)}
            >
              <CardContent className="p-2">
                <img 
                  src={imageUrl} 
                  alt={`Sample ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDrawingStep = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Draw Camera Movement Path
        </h1>
        <p className="text-xl text-gray-300">
          Draw on the image to define how the camera should move
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <Card className="bg-gradient-to-br from-white/[0.03] to-white/[0.08] border-white/20 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-auto border-2 border-white/20 rounded-lg cursor-crosshair"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                <div className="absolute top-4 left-4 bg-black/80 rounded-lg px-3 py-2">
                  <p className="text-white text-sm font-medium">
                    <MousePointer2 className="w-4 h-4 inline mr-2" />
                    Click and drag to draw camera path
                  </p>
                </div>
              </div>
              
              {/* Canvas Controls */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={undoLastPath}
                    disabled={drawnPaths.length === 0}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Undo className="w-4 h-4 mr-2" />
                    Undo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearCanvas}
                    disabled={drawnPaths.length === 0}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
                <div className="text-gray-400 text-sm">
                  Paths drawn: {drawnPaths.length}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions Panel */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 backdrop-blur-xl mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                <Sparkles className="w-6 h-6 inline mr-2" />
                How to Draw
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <p className="text-sm">Click and drag to draw a path on your image</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <p className="text-sm">The arrow shows camera movement direction</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <p className="text-sm">Draw multiple paths for complex movements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <Button 
            onClick={handleContinueToEffects}
            disabled={drawnPaths.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold h-12"
          >
            Continue to Effects
            <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderEffectStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Choose Camera Effect
        </h1>
        <p className="text-xl text-gray-300">
          Select how the camera should move along your drawn path
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {CAMERA_EFFECTS.map((effect: any) => (
          <Card 
            key={effect.id}
            className={`cursor-pointer transition-all duration-300 ${
              selectedEffect === effect.id
                ? `bg-gradient-to-br ${effect.gradient} shadow-2xl scale-105 border-white/40`
                : 'bg-gradient-to-br from-white/[0.03] to-white/[0.08] hover:scale-105 border-white/20 hover:border-white/40'
            } backdrop-blur-xl`}
            onClick={() => handleEffectSelect(effect.id)}
          >
            <CardContent className="p-8 text-center">
              <div className={`w-16 h-16 ${selectedEffect === effect.id ? 'bg-white/20' : 'bg-gradient-to-br ' + effect.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white`}>
                {effect.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{effect.name}</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">{effect.description}</p>
              <Badge variant="outline" className="text-gray-400 border-gray-600">
                {effect.preview}
              </Badge>
              {selectedEffect === effect.id && (
                <div className="mt-4">
                  <CheckCircle className="w-6 h-6 text-white mx-auto" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleGenerate}
          disabled={!selectedEffect}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-12 py-4 text-lg"
        >
          <Video className="w-6 h-6 mr-3" />
          Generate Video
        </Button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Generating Your Video
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          AI is creating your cinematic video with {selectedEffect?.replace('_', ' ')} effect
        </p>
      </div>

      <Card className="bg-gradient-to-br from-white/[0.03] to-white/[0.08] border-white/20 backdrop-blur-xl mb-8">
        <CardContent className="p-8">
          <div className="space-y-6">
            <Progress value={processingProgress} className="h-3" />
            <div className="flex justify-between text-sm text-gray-400">
              <span>Processing paths...</span>
              <span>{Math.round(processingProgress)}%</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Timer className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">5-10 seconds</p>
              </div>
              <div>
                <Camera className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">720p HD</p>
              </div>
              <div>
                <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">24 FPS</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompletedStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Video Ready!
        </h1>
        <p className="text-xl text-gray-300">
          Your AI-generated video has been created successfully
        </p>
      </div>

      {/* Video Player */}
      {videoUrl && (
        <Card className="bg-gradient-to-br from-white/[0.03] to-white/[0.08] border-white/20 backdrop-blur-xl mb-8">
          <CardContent className="p-6">
            <video 
              src={videoUrl}
              controls
              autoPlay
              loop
              muted
              className="w-full rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button 
          onClick={handleDownload}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-3"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Video
        </Button>
        <Button 
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share
        </Button>
        <Button 
          variant="outline"
          onClick={handleStartOver}
          className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Create Another
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <Timer className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Generation Time</p>
            <p className="text-gray-400">8.2 seconds</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <Video className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Video Quality</p>
            <p className="text-gray-400">720p HD • 24fps</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 backdrop-blur-xl">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Effect Used</p>
            <p className="text-gray-400">{selectedEffect?.replace('_', ' ')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleGoBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            {['upload', 'drawing', 'effect', 'processing', 'completed'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  ['upload', 'drawing', 'effect', 'processing', 'completed'].indexOf(currentStep) >= index
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-600 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 4 && (
                  <div className={`w-12 h-0.5 ${
                    ['upload', 'drawing', 'effect', 'processing', 'completed'].indexOf(currentStep) > index
                      ? 'bg-blue-500'
                      : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-12">
        {currentStep === "upload" && renderUploadStep()}
        {currentStep === "drawing" && renderDrawingStep()}
        {currentStep === "effect" && renderEffectStep()}
        {currentStep === "processing" && renderProcessingStep()}
        {currentStep === "completed" && renderCompletedStep()}
      </div>
    </div>
  );
}