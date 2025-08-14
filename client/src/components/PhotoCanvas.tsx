import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { CanvasToolbar } from "@/components/CanvasToolbar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, RotateCcw, Sparkles } from "lucide-react";

interface PhotoCanvasProps {
  projectId: string;
  onStartOver: () => void;
}

export interface CanvasAnnotation {
  id: string;
  type: 'arrow' | 'text' | 'circle' | 'rectangle' | 'freehand';
  data: any;
}

export function PhotoCanvas({ projectId, onStartOver }: PhotoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [annotations, setAnnotations] = useState<CanvasAnnotation[]>([]);
  const [currentTool, setCurrentTool] = useState<string>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showResult, setShowResult] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: project, isLoading } = useQuery({
    queryKey: ['/api/projects', projectId],
    refetchInterval: showResult ? 2000 : false,
  });

  const updateAnnotationsMutation = useMutation({
    mutationFn: async (newAnnotations: CanvasAnnotation[]) => {
      const response = await apiRequest("PUT", `/api/projects/${projectId}/annotations`, {
        annotations: newAnnotations,
      });
      return response.json();
    },
  });

  const generateVideoMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/generate`);
      return response.json();
    },
    onSuccess: () => {
      setShowResult(true);
      toast({
        title: "视频生成开始了！",
        description: "AI正在分析你的绘制指令，预计需要12-20分钟。",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (project && 'status' in project && project.status === 'completed' && 'videoUrl' in project && project.videoUrl) {
      setVideoUrl(project.videoUrl as string);
      toast({
        title: "视频生成完成！",
        description: "你的动画视频已经成功生成。",
      });
    }
  }, [project, toast]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !project) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load and draw the original image
    const img = new Image();
    img.onload = () => {
      canvas.width = Math.min(800, img.width);
      canvas.height = (img.height * canvas.width) / img.width;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Draw annotations
      annotations.forEach(annotation => {
        drawAnnotation(ctx, annotation);
      });
    };
    if (project && 'originalImageUrl' in project) {
      img.src = project.originalImageUrl as string;
    }
  }, [project, annotations]);

  const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: CanvasAnnotation) => {
    ctx.save();
    
    switch (annotation.type) {
      case 'arrow':
        drawArrow(ctx, annotation.data);
        break;
      case 'text':
        drawText(ctx, annotation.data);
        break;
      case 'circle':
        drawCircle(ctx, annotation.data);
        break;
      case 'rectangle':
        drawRectangle(ctx, annotation.data);
        break;
      case 'freehand':
        drawFreehand(ctx, annotation.data);
        break;
    }
    
    ctx.restore();
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, data: any) => {
    const { startX, startY, endX, endY } = data;
    
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Draw arrowhead
    const angle = Math.atan2(endY - startY, endX - startX);
    const headLength = 15;
    
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle - Math.PI / 6),
      endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - headLength * Math.cos(angle + Math.PI / 6),
      endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const drawText = (ctx: CanvasRenderingContext2D, data: any) => {
    const { x, y, text } = data;
    
    ctx.font = 'bold 16px Inter';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(x - 5, y - 20, ctx.measureText(text).width + 10, 25);
    
    ctx.fillStyle = '#F59E0B';
    ctx.fillText(text, x, y);
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, data: any) => {
    const { x, y, radius } = data;
    
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const drawRectangle = (ctx: CanvasRenderingContext2D, data: any) => {
    const { x, y, width, height } = data;
    
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
  };

  const drawFreehand = (ctx: CanvasRenderingContext2D, data: any) => {
    const { points } = data;
    
    if (points.length < 2) return;
    
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.stroke();
  };

  const getCanvasPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPosition(e);
    setStartPos(pos);
    
    if (currentTool === 'text') {
      const text = prompt('Enter your instruction:');
      if (text) {
        const newAnnotation: CanvasAnnotation = {
          id: Date.now().toString(),
          type: 'text',
          data: { x: pos.x, y: pos.y, text },
        };
        const newAnnotations = [...annotations, newAnnotation];
        setAnnotations(newAnnotations);
        updateAnnotationsMutation.mutate(newAnnotations);
      }
      return;
    }
    
    if (currentTool === 'circle') {
      const newAnnotation: CanvasAnnotation = {
        id: Date.now().toString(),
        type: 'circle',
        data: { x: pos.x, y: pos.y, radius: 50 },
      };
      const newAnnotations = [...annotations, newAnnotation];
      setAnnotations(newAnnotations);
      updateAnnotationsMutation.mutate(newAnnotations);
      return;
    }
    
    if (currentTool === 'rectangle') {
      const newAnnotation: CanvasAnnotation = {
        id: Date.now().toString(),
        type: 'rectangle',
        data: { x: pos.x, y: pos.y, width: 100, height: 100 },
      };
      const newAnnotations = [...annotations, newAnnotation];
      setAnnotations(newAnnotations);
      updateAnnotationsMutation.mutate(newAnnotations);
      return;
    }
    
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const pos = getCanvasPosition(e);
    
    if (currentTool === 'arrow') {
      // Create or update temporary arrow
      const tempAnnotations = annotations.filter(a => a.id !== 'temp');
      const arrowAnnotation: CanvasAnnotation = {
        id: 'temp',
        type: 'arrow',
        data: {
          startX: startPos.x,
          startY: startPos.y,
          endX: pos.x,
          endY: pos.y,
        },
      };
      setAnnotations([...tempAnnotations, arrowAnnotation]);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentTool === 'arrow') {
      // Finalize the arrow
      const finalAnnotations = annotations.map(a => 
        a.id === 'temp' ? { ...a, id: Date.now().toString() } : a
      );
      setAnnotations(finalAnnotations);
      updateAnnotationsMutation.mutate(finalAnnotations);
    }
    
    setIsDrawing(false);
  };

  const handleUndo = () => {
    if (annotations.length > 0) {
      const newAnnotations = annotations.slice(0, -1);
      setAnnotations(newAnnotations);
      updateAnnotationsMutation.mutate(newAnnotations);
    }
  };

  const handleClear = () => {
    setAnnotations([]);
    updateAnnotationsMutation.mutate([]);
  };

  const handleGenerate = () => {
    if (annotations.length === 0) {
      toast({
        title: "No annotations",
        description: "Please add some annotations before generating a video.",
        variant: "destructive",
      });
      return;
    }
    
    generateVideoMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
          <h3 className="text-2xl font-semibold text-slate-text mb-2">Loading Project...</h3>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-primary">DrawToVideo</h1>
              <Button variant="outline" onClick={onStartOver}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>
          </nav>
        </header>

        <div className="max-w-4xl mx-auto py-20 px-4">
          <VideoPlayer
            videoUrl={project && 'videoUrl' in project ? project.videoUrl as string : undefined}
            status={(project && 'status' in project ? project.status : "created") as "created" | "processing" | "completed" | "failed"}
            onRegenerateVideo={() => generateVideoMutation.mutate()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary">DrawToVideo</h1>
            <Button variant="outline" onClick={onStartOver}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-text mb-4">
            Draw Your <span className="text-primary">Instructions</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Add arrows for movement, text for actions, and shapes to highlight objects
          </p>
        </div>

        <Card className="shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full h-auto max-h-96 md:max-h-none cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => setIsDrawing(false)}
              />
              
              <CanvasToolbar
                currentTool={currentTool}
                onToolChange={setCurrentTool}
                onUndo={handleUndo}
                onClear={handleClear}
                onGenerate={handleGenerate}
                isGenerating={generateVideoMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
