import { useState } from "react";
import { ProfessionalCanvas } from "@/components/ProfessionalCanvas";
import { ProfessionalVideoPlayer } from "@/components/ProfessionalVideoPlayer";

type WorkflowStep = "upload" | "drawing" | "processing" | "completed";

export default function DrawToVideoWorkflow() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setCurrentStep("drawing");
  };

  const handleGenerate = async (annotationData: any[]) => {
    setAnnotations(annotationData);
    setCurrentStep("processing");
    setProcessingProgress(0);

    // Simulate processing with progress updates
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Simulate completion
          setTimeout(() => {
            setVideoUrl("/api/placeholder/video/generated-result.mp4");
            setCurrentStep("completed");
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

  const handleBackToDrawing = () => {
    setCurrentStep("drawing");
  };

  if (currentStep === "drawing" && uploadedImage) {
    return (
      <ProfessionalCanvas
        imageUrl={uploadedImage}
        onGenerate={handleGenerate}
        onBack={handleStartOver}
      />
    );
  }

  if (currentStep === "processing" || currentStep === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">DTV</span>
                </div>
                <h1 className="text-xl font-bold text-white">Draw to Video</h1>
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
            estimatedTime="30-60 seconds"
          />
        </div>
      </div>
    );
  }

  // Default return to upload page (handled by NewHome component)
  return null;
}