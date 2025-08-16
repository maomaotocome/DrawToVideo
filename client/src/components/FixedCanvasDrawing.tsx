/**
 * 🎨 Fixed Canvas Drawing - 完全修复的绘画组件
 * 修复所有Canvas交互问题，确保用户能正常绘制路径
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Undo, RotateCcw, Eye } from "lucide-react";

interface PathPoint {
  x: number;
  y: number;
  timestamp?: number;
}

interface FixedCanvasDrawingProps {
  imageUrl: string;
  onPathChange: (pathData: PathPoint[]) => void;
  selectedEffect: string;
  isGenerating?: boolean;
}

export function FixedCanvasDrawing({ 
  imageUrl, 
  onPathChange, 
  selectedEffect,
  isGenerating = false 
}: FixedCanvasDrawingProps) {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pathData, setPathData] = useState<PathPoint[]>([]);
  const [brushSize, setBrushSize] = useState([8]);
  const [pathOpacity, setPathOpacity] = useState([0.8]);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 设置固定Canvas尺寸
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 320;

  // 初始化Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 设置Canvas实际尺寸
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置绘图样式
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;
    
    console.log('Canvas initialized:', canvas.width, 'x', canvas.height);
  }, []);

  // 加载并绘制背景图片
  useEffect(() => {
    if (!imageUrl) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    console.log('Loading image:', imageUrl);
    setImageLoaded(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('Image loaded successfully:', img.naturalWidth, 'x', img.naturalHeight);
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 计算图片适应尺寸
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvas.width / canvas.height;
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;
      
      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }
      
      // 绘制图片
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      setImageLoaded(true);
      console.log('Image drawn to canvas');
      
      // 重新绘制路径（如果有）
      drawPath(ctx);
    };

    img.onerror = (error) => {
      console.error('Image loading failed:', error);
      console.error('Failed URL:', imageUrl);
      setImageLoaded(false);
      
      // 显示错误状态并尝试重新加载
      setTimeout(() => {
        console.log('Retrying image load...');
        img.src = imageUrl;
      }, 2000);
    };

    img.onabort = () => {
      console.error('Image loading aborted');
      setImageLoaded(false);
    };
    
    img.src = imageUrl;
  }, [imageUrl]);

  // 绘制路径
  const drawPath = useCallback((ctx?: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    const context = ctx || canvas?.getContext('2d');
    if (!context || !canvas || pathData.length === 0) return;

    // 设置路径样式
    context.strokeStyle = `rgba(147, 51, 234, ${pathOpacity[0]})`;
    context.lineWidth = brushSize[0];
    context.shadowBlur = 8;
    context.shadowColor = 'rgba(147, 51, 234, 0.4)';
    context.lineCap = 'round';
    context.lineJoin = 'round';

    context.beginPath();
    
    // 绘制平滑路径
    if (pathData.length === 1) {
      const point = pathData[0];
      context.arc(point.x, point.y, brushSize[0] / 2, 0, Math.PI * 2);
      context.fillStyle = `rgba(147, 51, 234, ${pathOpacity[0]})`;
      context.fill();
    } else {
      context.moveTo(pathData[0].x, pathData[0].y);
      
      for (let i = 1; i < pathData.length - 1; i++) {
        const current = pathData[i];
        const next = pathData[i + 1];
        const cpx = (current.x + next.x) / 2;
        const cpy = (current.y + next.y) / 2;
        context.quadraticCurveTo(current.x, current.y, cpx, cpy);
      }
      
      if (pathData.length > 1) {
        const lastPoint = pathData[pathData.length - 1];
        context.lineTo(lastPoint.x, lastPoint.y);
      }
    }
    
    context.stroke();
    
    // 绘制方向箭头
    if (pathData.length > 10) {
      drawArrows(context);
    }
  }, [pathData, brushSize, pathOpacity]);

  // 绘制方向箭头
  const drawArrows = useCallback((ctx: CanvasRenderingContext2D) => {
    const arrowCount = 3;
    const step = Math.floor(pathData.length / (arrowCount + 1));
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.8)';
    ctx.lineWidth = 2;
    
    for (let i = 1; i <= arrowCount; i++) {
      const index = i * step;
      if (index >= pathData.length - 5) continue;
      
      const current = pathData[index];
      const next = pathData[Math.min(index + 5, pathData.length - 1)];
      
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length > 10) {
        const unitX = dx / length;
        const unitY = dy / length;
        
        const arrowLength = 12;
        const arrowWidth = 8;
        
        const tipX = current.x + unitX * arrowLength;
        const tipY = current.y + unitY * arrowLength;
        
        const perpX = -unitY * arrowWidth / 2;
        const perpY = unitX * arrowWidth / 2;
        
        // 绘制箭头
        ctx.beginPath();
        ctx.moveTo(current.x + perpX, current.y + perpY);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(current.x - perpX, current.y - perpY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
  }, [pathData]);

  // 获取鼠标/触摸坐标
  const getEventPos = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }, []);

  // 开始绘制
  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isGenerating || !imageLoaded) return;
    
    e.preventDefault();
    setIsDrawing(true);
    
    const pos = getEventPos(e.nativeEvent as MouseEvent | TouchEvent);
    const newPoint: PathPoint = { 
      x: pos.x, 
      y: pos.y, 
      timestamp: Date.now() 
    };
    
    setPathData([newPoint]);
  }, [isGenerating, imageLoaded, getEventPos]);

  // 继续绘制
  const continueDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isGenerating || !imageLoaded) return;
    
    e.preventDefault();
    const pos = getEventPos(e.nativeEvent as MouseEvent | TouchEvent);
    
    setPathData(prev => {
      const newPoint: PathPoint = { 
        x: pos.x, 
        y: pos.y, 
        timestamp: Date.now() 
      };
      
      // 过滤过近的点
      if (prev.length > 0) {
        const lastPoint = prev[prev.length - 1];
        const distance = Math.sqrt(
          Math.pow(newPoint.x - lastPoint.x, 2) + 
          Math.pow(newPoint.y - lastPoint.y, 2)
        );
        
        if (distance < 3) return prev; // 忽略过近的点
      }
      
      return [...prev, newPoint];
    });
  }, [isDrawing, isGenerating, imageLoaded, getEventPos]);

  // 结束绘制
  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    console.log('Path data updated:', pathData.length, 'points');
    onPathChange(pathData);
  }, [isDrawing, pathData, onPathChange]);

  // 重绘Canvas
  useEffect(() => {
    if (!imageLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // 重新加载图片
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvas.width / canvas.height;
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;
      
      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }
      
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      drawPath(ctx);
    };
    img.src = imageUrl;
  }, [pathData, imageUrl, imageLoaded, drawPath]);

  // 清除路径
  const clearPath = () => {
    setPathData([]);
    onPathChange([]);
  };

  // 撤销最后一步
  const undoLastPoint = () => {
    setPathData(prev => {
      const newPath = prev.slice(0, -Math.max(1, Math.floor(prev.length * 0.1)));
      onPathChange(newPath);
      return newPath;
    });
  };

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
          Draw Camera Movement Path
        </h3>
        <div className="text-sm text-gray-600 flex items-center justify-center gap-1 flex-wrap">
          <span>Click and drag to draw camera movement direction (Effect:</span>
          <Badge variant="outline">
            {selectedEffect.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          <span>)</span>
        </div>
      </div>

      {/* Canvas容器 */}
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <canvas
          ref={canvasRef}
          className="w-full h-auto max-w-full cursor-crosshair rounded-lg"
          style={{ display: 'block', maxHeight: '320px' }}
          onMouseDown={startDrawing}
          onMouseMove={continueDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={continueDrawing}
          onTouchEnd={stopDrawing}
        />
        
        {!imageLoaded && imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center space-y-3">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-600">Loading image...</p>
              <div className="text-xs text-gray-400 max-w-xs break-all">
                {imageUrl.substring(0, 60)}...
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="text-xs text-purple-600 hover:text-purple-800 underline"
              >
                Reload if stuck
              </button>
            </div>
          </div>
        )}
        
        {!imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <p className="text-gray-600">No image uploaded</p>
              <p className="text-xs text-gray-400">Please upload an image first</p>
            </div>
          </div>
        )}
        
        {pathData.length === 0 && imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="font-medium">Start Drawing Camera Path</p>
              <p className="text-sm opacity-80">Click and drag to set movement direction</p>
            </div>
          </div>
        )}
      </div>

      {/* 控制面板 */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Brush Size</label>
          <div className="w-24">
            <Slider
              value={brushSize}
              onValueChange={setBrushSize}
              max={20}
              min={2}
              step={1}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <label className="text-sm font-medium">Opacity</label>
          <div className="w-20">
            <Slider
              value={pathOpacity}
              onValueChange={setPathOpacity}
              max={1}
              min={0.1}
              step={0.1}
            />
          </div>
          <span className="text-xs text-gray-500">{Math.round(pathOpacity[0] * 100)}%</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={undoLastPoint}
          disabled={pathData.length === 0}
        >
          <Undo className="w-4 h-4 mr-1" />
          Undo
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={clearPath}
          disabled={pathData.length === 0}
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Clear
        </Button>

        {pathData.length > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {pathData.length} points drawn
          </Badge>
        )}
      </div>
    </div>
  );
}