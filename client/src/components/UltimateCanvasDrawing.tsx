/**
 * 🎨 Ultimate Canvas Drawing Component
 * 专业级绘图画布，支持压感、平滑路径、实时预览
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Undo, RotateCcw, Play, Eye, MousePointer2, Palette } from "lucide-react";
import { PathPoint } from "@shared/ultimateSchema";

interface UltimateCanvasDrawingProps {
  imageUrl: string;
  onPathChange: (pathData: PathPoint[]) => void;
  selectedEffect: string;
  isGenerating?: boolean;
}

// 相机效果中文名称映射
function getCameraEffectName(effect: string): string {
  const effectNames = {
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

export function UltimateCanvasDrawing({ 
  imageUrl, 
  onPathChange, 
  selectedEffect,
  isGenerating = false 
}: UltimateCanvasDrawingProps) {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pathData, setPathData] = useState<PathPoint[]>([]);
  const [brushSize, setBrushSize] = useState([3]);
  const [showPreview, setShowPreview] = useState(true);
  const [pathOpacity, setPathOpacity] = useState([0.8]);

  // 初始化画布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置高DPI支持
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // 设置绘图样式
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;
  }, []);

  // 绘制路径
  const drawPath = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    if (pathData.length === 0) return;

    // 绘制平滑路径
    ctx.beginPath();
    ctx.strokeStyle = `rgba(147, 51, 234, ${pathOpacity[0]})`; // 紫色路径
    ctx.lineWidth = brushSize[0];
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(147, 51, 234, 0.3)';

    if (pathData.length === 1) {
      // 单点绘制小圆圈
      const point = pathData[0];
      ctx.arc(point.x, point.y, brushSize[0] / 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 51, 234, ${pathOpacity[0]})`;
      ctx.fill();
      return;
    }

    // 使用二次贝塞尔曲线平滑连接
    ctx.moveTo(pathData[0].x, pathData[0].y);

    for (let i = 1; i < pathData.length - 1; i++) {
      const currentPoint = pathData[i];
      const nextPoint = pathData[i + 1];
      
      const cpx = (currentPoint.x + nextPoint.x) / 2;
      const cpy = (currentPoint.y + nextPoint.y) / 2;
      
      ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, cpx, cpy);
    }

    // 连接到最后一点
    if (pathData.length > 1) {
      const lastPoint = pathData[pathData.length - 1];
      ctx.lineTo(lastPoint.x, lastPoint.y);
    }

    ctx.stroke();

    // 绘制方向指示器
    if (showPreview && pathData.length > 5) {
      drawDirectionIndicators(ctx);
    }

  }, [pathData, brushSize, pathOpacity, showPreview]);

  // 绘制方向指示器
  const drawDirectionIndicators = useCallback((ctx: CanvasRenderingContext2D) => {
    if (pathData.length < 10) return;

    const step = Math.floor(pathData.length / 5); // 5个指示器
    
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    
    for (let i = step; i < pathData.length - step; i += step) {
      const current = pathData[i];
      const next = pathData[Math.min(i + 5, pathData.length - 1)];
      
      // 计算方向向量
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length > 5) {
        // 归一化并绘制箭头
        const normalizedDx = dx / length;
        const normalizedDy = dy / length;
        
        const arrowLength = 15;
        const arrowWidth = 8;
        
        const endX = current.x + normalizedDx * arrowLength;
        const endY = current.y + normalizedDy * arrowLength;
        
        ctx.beginPath();
        ctx.fillStyle = `rgba(59, 130, 246, ${pathOpacity[0] * 0.9})`; // 蓝色箭头
        
        // 箭头主体
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(endX, endY);
        
        // 箭头头部
        const perpX = -normalizedDy;
        const perpY = normalizedDx;
        
        ctx.lineTo(endX - normalizedDx * 5 + perpX * arrowWidth, 
                   endY - normalizedDy * 5 + perpY * arrowWidth);
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - normalizedDx * 5 - perpX * arrowWidth, 
                   endY - normalizedDy * 5 - perpY * arrowWidth);
        
        ctx.strokeStyle = `rgba(59, 130, 246, ${pathOpacity[0]})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [pathData, pathOpacity]);

  // 重绘画布
  useEffect(() => {
    drawPath();
  }, [drawPath]);

  // 鼠标/触摸事件处理
  const getPointFromEvent = useCallback((e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if (e.type.startsWith('touch')) {
      const touchEvent = e as TouchEvent;
      clientX = touchEvent.touches[0]?.clientX || 0;
      clientY = touchEvent.touches[0]?.clientY || 0;
    } else {
      const mouseEvent = e as MouseEvent;
      clientX = mouseEvent.clientX;
      clientY = mouseEvent.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      timestamp: Date.now()
    };
  }, []);

  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || isGenerating) return;

    setIsDrawing(true);
    const point = getPointFromEvent(e, canvas);
    const newPathData = [point];
    
    setPathData(newPathData);
    onPathChange(newPathData);
  }, [getPointFromEvent, onPathChange, isGenerating]);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const point = getPointFromEvent(e, canvas);
    
    setPathData(prev => {
      const newPathData = [...prev, point];
      onPathChange(newPathData);
      return newPathData;
    });
  }, [isDrawing, getPointFromEvent, onPathChange]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // 绑定事件监听器
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 鼠标事件
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // 触摸事件
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    // 防止触摸滚动
    const preventDefault = (e: TouchEvent) => e.preventDefault();
    canvas.addEventListener('touchstart', preventDefault, { passive: false });
    canvas.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
      canvas.removeEventListener('touchstart', preventDefault);
      canvas.removeEventListener('touchmove', preventDefault);
    };
  }, [startDrawing, draw, stopDrawing]);

  // 工具方法
  const clearPath = useCallback(() => {
    setPathData([]);
    onPathChange([]);
  }, [onPathChange]);

  const undoLastPoint = useCallback(() => {
    if (pathData.length > 0) {
      const newPathData = pathData.slice(0, -10); // 删除最后10个点
      setPathData(newPathData);
      onPathChange(newPathData);
    }
  }, [pathData, onPathChange]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MousePointer2 className="w-5 h-5 text-purple-600" />
              第二步：绘制相机运动路径
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              在图片上用鼠标绘制路径，指定相机运动方向（当前效果：<Badge variant="outline" className="mx-1">{getCameraEffectName(selectedEffect)}</Badge>）
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {pathData.length > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {pathData.length} 个点
              </Badge>
            )}
            
            {showPreview && pathData.length > 5 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Eye className="w-3 h-3 mr-1" />
                预览模式
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 画布区域 */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          {/* 背景图片 */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Background"
            className="w-full h-80 object-cover opacity-70"
            draggable={false}
          />
          
          {/* 绘图画布 */}
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full ${
              isGenerating ? 'pointer-events-none opacity-50' : 'cursor-crosshair'
            }`}
            style={{ 
              touchAction: 'none',
              width: '100%',
              height: '100%' 
            }}
          />
          
          {/* 空状态提示 */}
          {pathData.length === 0 && !isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <div className="text-center text-white">
                <MousePointer2 className="w-8 h-8 mx-auto mb-2 opacity-70" />
                <p className="font-medium">开始绘制相机运动路径</p>
                <p className="text-sm opacity-70">点击并拖拽指定运镜方向</p>
              </div>
            </div>
          )}
          
          {/* 生成中遮罩 */}
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="text-center text-white">
                <div className="animate-spin w-8 h-8 mx-auto mb-2 border-2 border-white/30 border-t-white rounded-full"></div>
                <p className="font-medium">正在生成视频...</p>
              </div>
            </div>
          )}
        </div>

        {/* 绘图工具栏 */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            {/* 画笔大小 */}
            <div className="flex items-center gap-2 min-w-32">
              <Palette className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">笔刷</span>
              <Slider
                value={brushSize}
                onValueChange={setBrushSize}
                max={20}
                min={1}
                step={1}
                className="flex-1"
                disabled={isGenerating}
              />
              <span className="text-xs text-gray-500 min-w-6">{brushSize[0]}</span>
            </div>

            {/* 透明度 */}
            <div className="flex items-center gap-2 min-w-32">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">透明度</span>
              <Slider
                value={pathOpacity}
                onValueChange={setPathOpacity}
                max={1}
                min={0.1}
                step={0.1}
                className="flex-1"
                disabled={isGenerating}
              />
              <span className="text-xs text-gray-500 min-w-8">{Math.round(pathOpacity[0] * 100)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              disabled={isGenerating}
              className={showPreview ? "bg-blue-50 border-blue-300" : ""}
            >
              <Eye className="w-4 h-4 mr-1" />
              预览
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={undoLastPoint}
              disabled={pathData.length === 0 || isGenerating}
            >
              <Undo className="w-4 h-4 mr-1" />
              撤销
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={clearPath}
              disabled={pathData.length === 0 || isGenerating}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              清除
            </Button>
          </div>
        </div>

        {/* 路径统计信息 */}
        {pathData.length > 0 && (
          <div className="grid grid-cols-3 gap-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{pathData.length}</p>
              <p className="text-xs text-gray-600">路径点数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(Math.sqrt(
                  Math.pow(pathData[pathData.length - 1]?.x - pathData[0]?.x, 2) +
                  Math.pow(pathData[pathData.length - 1]?.y - pathData[0]?.y, 2)
                ))}
              </p>
              <p className="text-xs text-gray-600">运动距离</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {pathData.length > 1 ? Math.round((pathData[pathData.length - 1].timestamp! - pathData[0].timestamp!) / 1000 * 10) / 10 : 0}s
              </p>
              <p className="text-xs text-gray-600">绘制时长</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}