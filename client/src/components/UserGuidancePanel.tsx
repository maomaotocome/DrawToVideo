/**
 * 🎯 用户指导面板 - 提供清晰的中文指导
 * 解决用户困惑和界面混乱问题
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MousePointer2, 
  Upload, 
  Wand2, 
  Play,
  Info,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface UserGuidancePanelProps {
  currentStep: string;
  selectedEffect?: string;
  pathLength?: number;
}

export function UserGuidancePanel({ currentStep, selectedEffect, pathLength = 0 }: UserGuidancePanelProps) {
  
  const getStepInfo = () => {
    switch (currentStep) {
      case "upload":
        return {
          title: "Step 1: Upload Image",
          description: "Select a high-quality image for your video creation",
          instructions: [
            "Supports JPG, PNG formats",
            "Recommended resolution: 1920x1080 or higher",
            "File size limit: 10MB max",
            "Higher quality images produce better results"
          ],
          icon: <Upload className="w-6 h-6 text-green-500" />,
          color: "border-green-200 bg-green-50"
        };
      
      case "drawing":
        return {
          title: "Step 2: Draw Camera Path",
          description: "Draw the camera movement path directly on your image",
          instructions: [
            "Click and drag to draw the movement path",
            "Path length determines motion amplitude",
            "Drawing direction sets camera movement",
            `${pathLength} points drawn (recommended: 20-50 points)`
          ],
          icon: <MousePointer2 className="w-6 h-6 text-purple-500" />,
          color: "border-purple-200 bg-purple-50"
        };
      
      case "effect":
        return {
          title: "Step 3: Choose Camera Effect",
          description: "Select professional cinematic camera effects",
          instructions: [
            `Current effect: ${getEffectName(selectedEffect || 'zoom_in')}`,
            "Zoom In - Perfect for subject focus",
            "Orbit - Great for full scene reveal",
            "Dramatic Spiral - Ideal for dynamic scenes"
          ],
          icon: <Wand2 className="w-6 h-6 text-blue-500" />,
          color: "border-blue-200 bg-blue-50"
        };
      
      case "processing":
        return {
          title: "第四步：生成中",
          description: "AI正在为您制作专业视频",
          instructions: [
            "使用先进的AI技术生成",
            "预计时间：10-30 秒",
            "生成过程中请勿关闭页面",
            "即将完成，请稍候..."
          ],
          icon: <Play className="w-6 h-6 text-orange-500" />,
          color: "border-orange-200 bg-orange-50"
        };
      
      case "completed":
        return {
          title: "第五步：完成",
          description: "您的专业视频已生成完成",
          instructions: [
            "视频生成成功",
            "可以下载保存到本地",
            "分享到社交媒体",
            "重新制作其他视频"
          ],
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          color: "border-green-200 bg-green-50"
        };
      
      default:
        return {
          title: "开始制作",
          description: "按照步骤完成视频制作",
          instructions: [],
          icon: <Info className="w-6 h-6 text-gray-500" />,
          color: "border-gray-200 bg-gray-50"
        };
    }
  };

  const stepInfo = getStepInfo();
  
  return (
    <Card className={`${stepInfo.color} border-2 transition-all duration-300`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          {stepInfo.icon}
          {stepInfo.title}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          {stepInfo.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {stepInfo.instructions.map((instruction, index) => (
            <div key={index} className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{instruction}</span>
            </div>
          ))}
        </div>
        
        {currentStep === "drawing" && (
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <h4 className="font-medium text-sm mb-2">💡 绘制技巧：</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 慢速绘制获得更平滑的路径</li>
              <li>• 从左到右：相机向右移动</li>
              <li>• 从上到下：相机向下移动</li>
              <li>• 圆形路径：相机环绕运动</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getEffectName(effect: string): string {
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
}