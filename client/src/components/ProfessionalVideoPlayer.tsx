import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Download, 
  RotateCcw, 
  Share2, 
  Twitter, 
  Instagram, 
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";

interface ProfessionalVideoPlayerProps {
  videoUrl?: string;
  status: "created" | "processing" | "completed" | "failed";
  onRegenerateVideo?: () => void;
  onStartOver?: () => void;
  processingProgress?: number;
  estimatedTime?: string;
  className?: string;
}

export function ProfessionalVideoPlayer({ 
  videoUrl, 
  status, 
  onRegenerateVideo, 
  onStartOver,
  processingProgress = 0,
  estimatedTime = "12-20 minutes",
  className = "" 
}: ProfessionalVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleDownload = async () => {
    if (!videoUrl) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `drawtovideo-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const shareToSocial = (platform: string) => {
    const url = window.location.href;
    const text = "Check out this amazing AI-generated video I created with DrawToVideo!";
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing, copy link instead
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard! Share on Instagram Stories.');
        break;
    }
    setShowShareMenu(false);
  };

  const renderStatusContent = () => {
    switch (status) {
      case "processing":
        return (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                <Sparkles className="w-8 h-8 text-white relative z-10" />
              </div>
              
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-purple-600/20 rounded-full animate-ping"></div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">
                AI正在创作你的电影
              </h3>
              <p className="text-gray-300 text-lg">
                分析你的绘制指令，生成专业级视频内容
              </p>
              
              <div className="max-w-md mx-auto space-y-3">
                <Progress value={processingProgress} className="h-2 bg-gray-700">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500" 
                       style={{ width: `${processingProgress}%` }} />
                </Progress>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{Math.round(processingProgress)}% 完成</span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    预计 {estimatedTime}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-sm">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-violet-400 font-semibold mb-1">第1步</div>
                  <div className="text-gray-300">分析图像内容</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-violet-400 font-semibold mb-1">第2步</div>
                  <div className="text-gray-300">理解运动指令</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-violet-400 font-semibold mb-1">第3步</div>
                  <div className="text-gray-300">渲染动画序列</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "failed":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-red-500/30">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">
                视频生成失败
              </h3>
              <p className="text-gray-300">
                生成过程中遇到错误，请重新尝试
              </p>
              
              <div className="space-y-3">
                {onRegenerateVideo && (
                  <Button 
                    onClick={onRegenerateVideo}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    重新生成
                  </Button>
                )}
                
                {onStartOver && (
                  <Button variant="outline" onClick={onStartOver} className="border-white/20 text-white hover:bg-white/10">
                    重新开始
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case "completed":
        if (!videoUrl) return null;
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/30">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                视频生成完成！
              </h3>
              <p className="text-gray-300">
                你的AI动画视频已经准备就绪
              </p>
            </div>
            
            {/* Video Player */}
            <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl">
              <video
                src={videoUrl}
                controls
                className="w-full h-auto max-h-96"
                poster="/api/placeholder/800/450"
                preload="metadata"
              >
                <source src={videoUrl} type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
              
              {/* Video Overlay Info */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <Badge className="bg-black/60 text-white border-0 backdrop-blur-sm">
                  AI Generated
                </Badge>
                <Badge className="bg-black/60 text-white border-0 backdrop-blur-sm">
                  HD Quality
                </Badge>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                onClick={handleDownload}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6"
              >
                <Download className="w-4 h-4 mr-2" />
                {isLoading ? "下载中..." : "下载视频"}
              </Button>
              
              <div className="relative">
                <Button 
                  variant="outline" 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </Button>
                
                {showShareMenu && (
                  <div className="absolute top-full mt-2 left-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-10">
                    <div className="p-2 space-y-1 min-w-32">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-white hover:bg-white/10"
                        onClick={() => shareToSocial('twitter')}
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-white hover:bg-white/10"
                        onClick={() => shareToSocial('instagram')}
                      >
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {onRegenerateVideo && (
                <Button 
                  variant="outline" 
                  onClick={onRegenerateVideo}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重新生成
                </Button>
              )}
              
              {onStartOver && (
                <Button 
                  variant="outline" 
                  onClick={onStartOver}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  创建新项目
                </Button>
              )}
            </div>
            
            {/* Video Stats */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-violet-400 font-semibold">格式</div>
                <div className="text-gray-300">MP4 HD</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-violet-400 font-semibold">时长</div>
                <div className="text-gray-300">3-5秒</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-violet-400 font-semibold">质量</div>
                <div className="text-gray-300">720p</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-violet-500/30">
              <Play className="w-8 h-8 text-violet-400" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">
                准备生成视频
              </h3>
              <p className="text-gray-300">
                完成绘制指令后，点击生成按钮开始创作
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className={`bg-white/5 border-white/10 backdrop-blur-sm ${className}`}>
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-violet-400" />
              AI视频生成
            </h2>
            <Badge 
              variant="secondary" 
              className={`
                px-3 py-1 text-xs font-semibold
                ${status === "created" && "bg-gray-500/20 text-gray-300 border-gray-500/30"}
                ${status === "processing" && "bg-violet-500/20 text-violet-300 border-violet-500/30"}
                ${status === "completed" && "bg-green-500/20 text-green-300 border-green-500/30"}
                ${status === "failed" && "bg-red-500/20 text-red-300 border-red-500/30"}
              `}
            >
              {status === "created" && "待生成"}
              {status === "processing" && "生成中"}
              {status === "completed" && "已完成"}
              {status === "failed" && "失败"}
            </Badge>
          </div>
          
          {renderStatusContent()}
        </div>
      </CardContent>
    </Card>
  );
}