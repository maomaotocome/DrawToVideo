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
          title: "第一步：上传图片",
          description: "请选择一张清晰的图片作为视频素材",
          instructions: [
            "支持 JPG、PNG 格式",
            "建议图片尺寸 1920x1080 或更高",
            "文件大小不超过 10MB",
            "图片内容越清晰，生成效果越好"
          ],
          icon: <Upload className="w-6 h-6 text-green-500" />,
          color: "border-green-200 bg-green-50"
        };
      
      case "drawing":
        return {
          title: "第二步：绘制相机路径",
          description: "用鼠标在图片上绘制相机运动轨迹",
          instructions: [
            "按住鼠标左键并拖拽绘制路径",
            "路径长度决定运动幅度",
            "绘制方向决定相机移动方向",
            `已绘制 ${pathLength} 个点，建议绘制 20-50 个点`
          ],
          icon: <MousePointer2 className="w-6 h-6 text-purple-500" />,
          color: "border-purple-200 bg-purple-50"
        };
      
      case "effect":
        return {
          title: "第三步：选择相机效果",
          description: "选择专业的相机运动效果",
          instructions: [
            `当前效果：${getEffectName(selectedEffect || 'zoom_in')}`,
            "推进特写 - 适合突出主体",
            "环绕拍摄 - 适合展示全貌",
            "螺旋戏剧 - 适合动感场景"
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
    'zoom_in': '推进特写',
    'orbit': '环绕拍摄',
    'pull_back': '拉远全景',
    'dramatic_spiral': '螺旋戏剧',
    'vertigo_effect': '眩晕效果',
    'bullet_time': '子弹时间',
    'crash_zoom': '冲击推进',
    'floating_follow': '悬浮跟随'
  };
  return effectNames[effect] || effect;
}