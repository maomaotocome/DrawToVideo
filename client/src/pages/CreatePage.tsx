import { useState, useRef, useEffect } from "react";
import { ProfessionalCanvas } from "@/components/ProfessionalCanvas";
import { ProfessionalVideoPlayer } from "@/components/ProfessionalVideoPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  Sparkles, 
  Video, 
  Star,
  Zap,
  Target,
  Camera,
  TrendingUp,
  Users,
  Play,
  Download,
  Share2
} from "lucide-react";

type WorkflowStep = "upload" | "drawing" | "processing" | "completed";

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 检查URL参数是否有图片
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const imageParam = urlParams.get('image');
    if (imageParam) {
      setUploadedImage(decodeURIComponent(imageParam));
      setCurrentStep("drawing");
    }
  }, []);

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
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setCurrentStep("drawing");
        toast({
          title: "Image uploaded successfully",
          description: "Now you can start drawing motion paths"
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

  const handleGenerate = async (annotationData: any[]) => {
    setAnnotations(annotationData);
    setCurrentStep("processing");
    setProcessingProgress(0);

    // 模拟AI处理过程
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setVideoUrl("/api/placeholder/video/sample.mp4");
            setCurrentStep("completed");
            toast({
              title: "Video generated successfully!",
              description: "Your AI animated video is ready"
            });
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const handleRegenerateVideo = () => {
    setCurrentStep("processing");
    setProcessingProgress(0);
    handleGenerate(annotations);
  };

  const handleStartOver = () => {
    setCurrentStep("upload");
    setUploadedImage(null);
    setAnnotations([]);
    setVideoUrl(null);
    setProcessingProgress(0);
  };

  const goHome = () => {
    window.location.href = '/';
  };

  // 处理绘制步骤
  if (currentStep === "drawing" && uploadedImage) {
    return (
      <ProfessionalCanvas
        imageUrl={uploadedImage}
        onGenerate={handleGenerate}
        onBack={handleStartOver}
      />
    );
  }

  // 处理生成和完成步骤
  if (currentStep === "processing" || currentStep === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={goHome} className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-white">DrawToVideo</h1>
                  <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                    AI-Powered
                  </Badge>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <div className="max-w-5xl mx-auto p-6">
          <ProfessionalVideoPlayer
            videoUrl={videoUrl || undefined}
            status={currentStep === "processing" ? "processing" : "completed"}
            onRegenerateVideo={handleRegenerateVideo}
            onStartOver={handleStartOver}
            processingProgress={processingProgress}
            estimatedTime="10-30 seconds"
          />
        </div>
      </div>
    );
  }

  // 默认上传界面
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={goHome} className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">DrawToVideo</h1>
                <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Create Mode
                </Badge>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Start Creating Your <span className="text-blue-400">Viral Video</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Upload an image and draw movement paths to generate professional camera movements instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div
                  className={`
                    relative border-2 border-dashed rounded-2xl p-16 transition-all duration-300 cursor-pointer
                    ${dragActive 
                      ? 'border-blue-400 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-blue-500 hover:bg-blue-500/5'
                    }
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Upload className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Upload Your Image</h3>
                    <p className="text-gray-400 mb-6 text-lg">
                      Drop an image here or click to browse your files
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 text-sm">
                      <Badge variant="secondary" className="bg-gray-800/50 text-gray-300">
                        PNG, JPG up to 10MB
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-800/50 text-gray-300">
                        Best: 1920x1080 or higher
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-800/50 text-gray-300">
                        Instant processing
                      </Badge>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>

                {/* Sample Images */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Or try with sample images:</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: "Nature Scene", url: "/api/placeholder/400/300", category: "Landscape" },
                      { name: "Product Shot", url: "/api/placeholder/400/300", category: "Commercial" },
                      { name: "Portrait", url: "/api/placeholder/400/300", category: "People" }
                    ].map((sample, index) => (
                      <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-3 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                          <h5 className="font-semibold text-white text-sm">{sample.name}</h5>
                          <p className="text-xs text-gray-400">{sample.category}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Live Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Videos Created Today</span>
                    <span className="font-bold text-white">2,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Users</span>
                    <span className="font-bold text-white">1,293</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Avg. Generation Time</span>
                    <span className="font-bold text-green-400">8.2s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Preview */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                  What You'll Get
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: <Target className="w-4 h-4" />, text: "Zero-prompt video generation", color: "text-blue-400" },
                    { icon: <Zap className="w-4 h-4" />, text: "5-10 second processing", color: "text-green-400" },
                    { icon: <Camera className="w-4 h-4" />, text: "50+ professional camera effects", color: "text-purple-400" },
                    { icon: <Download className="w-4 h-4" />, text: "HD MP4 instant download", color: "text-pink-400" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`${feature.color}`}>
                        {feature.icon}
                      </div>
                      <span className="text-gray-300 text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Proof */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white font-semibold mb-2">Loved by creators worldwide</p>
                  <p className="text-sm text-gray-300 mb-4">
                    "Best AI video tool I've ever used. My TikTok views went viral!"
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>10K+ happy creators</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}