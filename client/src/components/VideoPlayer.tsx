import { Play, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface VideoPlayerProps {
  videoUrl?: string;
  status: "created" | "processing" | "completed" | "failed";
  onRegenerateVideo?: () => void;
  className?: string;
}

export function VideoPlayer({ 
  videoUrl, 
  status, 
  onRegenerateVideo, 
  className = "" 
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);

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

  const renderVideoContent = () => {
    if (status === "processing") {
      return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">生成视频中...</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              预计需要 12-20 分钟，请稍等
            </p>
            <p className="text-xs text-gray-500">
              AI正在分析你的绘制指令并生成高质量视频
            </p>
          </div>
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-xl">⚠</span>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
              视频生成失败
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              请重新尝试生成视频
            </p>
          </div>
          {onRegenerateVideo && (
            <Button onClick={onRegenerateVideo} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              重新生成
            </Button>
          )}
        </div>
      );
    }

    if (status === "completed" && videoUrl) {
      return (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-gray-900">
            <video
              src={videoUrl}
              controls
              className="w-full h-auto max-h-80"
              poster="/api/placeholder/640/360"
            >
              <source src={videoUrl} type="video/mp4" />
              您的浏览器不支持视频播放
            </video>
          </div>
          
          <div className="flex justify-center space-x-3">
            <Button 
              onClick={handleDownload}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? "下载中..." : "下载视频"}
            </Button>
            
            {onRegenerateVideo && (
              <Button onClick={onRegenerateVideo} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                重新生成
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">准备生成视频</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            在照片上添加绘制指令后，点击生成按钮开始制作视频
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">生成的视频</h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                {status === "created" && "待生成"}
                {status === "processing" && "生成中"}
                {status === "completed" && "已完成"}
                {status === "failed" && "失败"}
              </span>
            </div>
          </div>
          
          {renderVideoContent()}
        </div>
      </CardContent>
    </Card>
  );
}