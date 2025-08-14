import { useState, useRef } from "react";
import { ProfessionalCanvas } from "@/components/ProfessionalCanvas";
import { ProfessionalVideoPlayer } from "@/components/ProfessionalVideoPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Sparkles, Play, ArrowRight, Zap, Camera, Film, Palette, Download } from "lucide-react";

type WorkflowStep = "upload" | "drawing" | "processing" | "completed";

export default function NewHome() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("upload");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
          title: "图片上传成功",
          description: "现在可以开始绘制运动指令了"
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

    // Simulate AI processing with realistic progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setVideoUrl("/api/placeholder/video/sample.mp4");
            setCurrentStep("completed");
            toast({
              title: "视频生成完成！",
              description: "您的AI动画视频已准备就绪"
            });
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 600);
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

  // Handle drawing step
  if (currentStep === "drawing" && uploadedImage) {
    return (
      <ProfessionalCanvas
        imageUrl={uploadedImage}
        onGenerate={handleGenerate}
        onBack={handleStartOver}
      />
    );
  }

  // Handle processing and completion steps
  if (currentStep === "processing" || currentStep === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">DrawToVideo</h1>
                <Badge variant="secondary" className="text-xs bg-violet-500/20 text-violet-300 border-violet-500/30">
                  Professional AI
                </Badge>
              </div>
            </div>
          </nav>
        </header>

        <div className="max-w-4xl mx-auto p-6">
          <ProfessionalVideoPlayer
            videoUrl={videoUrl || undefined}
            status={currentStep === "processing" ? "processing" : "completed"}
            onRegenerateVideo={handleRegenerateVideo}
            onStartOver={handleStartOver}
            processingProgress={processingProgress}
            estimatedTime="30-90 seconds"
          />
        </div>
      </div>
    );
  }

  // Default upload step
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">DrawToVideo</h1>
              <Badge variant="secondary" className="text-xs bg-violet-500/20 text-violet-300 border-violet-500/30">
                AI Powered
              </Badge>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Sign In
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32">
          
          {/* Main Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300">Turn sketches into cinema instantly</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Draw to
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Video
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Your sketch turns into cinema in seconds. No prompts needed. 
              Just draw movement paths and watch AI create professional video content.
            </p>

            {/* Upload Area */}
            <div className="max-w-2xl mx-auto mb-16">
              {!uploadedImage ? (
                <div
                  className={`
                    relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer
                    ${dragActive 
                      ? 'border-violet-400 bg-violet-500/10' 
                      : 'border-gray-600 hover:border-violet-500 hover:bg-violet-500/5'
                    }
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Upload your image</h3>
                    <p className="text-gray-400 mb-6">Drag & drop or click to browse</p>
                    <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                      <span>PNG, JPG up to 10MB</span>
                      <span>•</span>
                      <span>or paste from clipboard</span>
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
              ) : (
                <div className="relative">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0"
                    >
                      <Palette className="w-5 h-5 mr-2" />
                      Start Drawing
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Camera className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Film className="w-4 h-4 mr-2" />
                Browse Examples
              </Button>
            </div>
          </div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                step: "01",
                title: "Choose motion",
                description: "Select movement patterns for your scene",
                icon: <ArrowRight className="w-6 h-6" />
              },
              {
                step: "02", 
                title: "Add image",
                description: "Upload or generate your starting image",
                icon: <Upload className="w-6 h-6" />
              },
              {
                step: "03",
                title: "Get video",
                description: "AI creates your cinematic video instantly",
                icon: <Play className="w-6 h-6" />
              }
            ].map((step, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                    {step.icon}
                  </div>
                  <div className="text-3xl font-bold text-violet-400 mb-2">{step.step}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "50+ Camera Presets",
                description: "Hollywood-style movements",
                icon: <Film className="w-6 h-6" />
              },
              {
                title: "Zero Prompts",
                description: "Pure visual direction",
                icon: <Palette className="w-6 h-6" />
              },
              {
                title: "Instant Generation",
                description: "30 second processing",
                icon: <Zap className="w-6 h-6" />
              },
              {
                title: "HD Quality",
                description: "Professional output",
                icon: <Download className="w-6 h-6" />
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 text-violet-400">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}