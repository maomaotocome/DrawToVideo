import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer, 
  ArrowUpRight, 
  Type, 
  Circle, 
  Square, 
  Undo, 
  RotateCcw, 
  Sparkles,
  Play,
  Settings,
  Layers,
  Palette
} from "lucide-react";

interface DrawingTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  cursor: string;
  color: string;
}

interface MotionPreset {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "Camera" | "Object" | "Effect";
}

interface ProfessionalCanvasProps {
  imageUrl: string;
  onGenerate: (annotations: any[]) => void;
  onBack: () => void;
}

const drawingTools: DrawingTool[] = [
  { id: "select", name: "Select", icon: <MousePointer className="w-4 h-4" />, cursor: "default", color: "#8B5CF6" },
  { id: "arrow", name: "Movement", icon: <ArrowUpRight className="w-4 h-4" />, cursor: "crosshair", color: "#F59E0B" },
  { id: "text", name: "Action", icon: <Type className="w-4 h-4" />, cursor: "text", color: "#10B981" },
  { id: "circle", name: "Focus", icon: <Circle className="w-4 h-4" />, cursor: "crosshair", color: "#EF4444" },
  { id: "rectangle", name: "Frame", icon: <Square className="w-4 h-4" />, cursor: "crosshair", color: "#3B82F6" },
];

const motionPresets: MotionPreset[] = [
  { id: "dolly-in", name: "Dolly In", description: "Smooth forward push", thumbnail: "🎬", category: "Camera" },
  { id: "dolly-out", name: "Dolly Out", description: "Elegant pullback", thumbnail: "📹", category: "Camera" },
  { id: "pan-left", name: "Pan Left", description: "Cinematic sweep", thumbnail: "⬅️", category: "Camera" },
  { id: "pan-right", name: "Pan Right", description: "Dynamic flow", thumbnail: "➡️", category: "Camera" },
  { id: "tilt-up", name: "Tilt Up", description: "Reveal shot", thumbnail: "⬆️", category: "Camera" },
  { id: "dutch-angle", name: "Dutch Angle", description: "Dramatic tilt", thumbnail: "🎭", category: "Effect" },
];

export function ProfessionalCanvas({ imageUrl, onGenerate, onBack }: ProfessionalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState("select");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [actionSequence, setActionSequence] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;

    const ctx = canvas.getContext('2d');
    const overlayCtx = overlay.getContext('2d');
    if (!ctx || !overlayCtx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions
      const maxWidth = 800;
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const width = img.width * ratio;
      const height = img.height * ratio;
      
      canvas.width = width;
      canvas.height = height;
      overlay.width = width;
      overlay.height = height;
      
      // Draw image
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      // Apply modern filter overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      drawAnnotations(overlayCtx);
    };
    img.src = imageUrl;
  }, [imageUrl, annotations]);

  const drawAnnotations = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    annotations.forEach((annotation, index) => {
      ctx.save();
      
      switch (annotation.type) {
        case 'arrow':
          drawArrow(ctx, annotation.data, index + 1);
          break;
        case 'text':
          drawTextAnnotation(ctx, annotation.data, index + 1);
          break;
        case 'circle':
          drawCircleAnnotation(ctx, annotation.data, index + 1);
          break;
        case 'rectangle':
          drawRectangleAnnotation(ctx, annotation.data, index + 1);
          break;
      }
      
      ctx.restore();
    });
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, data: any, sequence: number) => {
    const { startX, startY, endX, endY } = data;
    
    // Gradient arrow
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    gradient.addColorStop(0, '#F59E0B');
    gradient.addColorStop(1, '#D97706');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
    ctx.shadowBlur = 8;
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Draw arrowhead
    const angle = Math.atan2(endY - startY, endX - startX);
    const headLength = 20;
    
    ctx.fillStyle = gradient;
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
    
    // Sequence number
    drawSequenceNumber(ctx, startX - 15, startY - 15, sequence);
  };

  const drawTextAnnotation = (ctx: CanvasRenderingContext2D, data: any, sequence: number) => {
    const { x, y, text } = data;
    
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillStyle = '#10B981';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
    ctx.shadowBlur = 8;
    
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    
    drawSequenceNumber(ctx, x - 25, y - 25, sequence);
  };

  const drawCircleAnnotation = (ctx: CanvasRenderingContext2D, data: any, sequence: number) => {
    const { centerX, centerY, radius } = data;
    
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 5]);
    ctx.shadowColor = 'rgba(239, 68, 68, 0.5)';
    ctx.shadowBlur = 8;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    drawSequenceNumber(ctx, centerX - 15, centerY - radius - 25, sequence);
  };

  const drawRectangleAnnotation = (ctx: CanvasRenderingContext2D, data: any, sequence: number) => {
    const { startX, startY, width, height } = data;
    
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 4]);
    ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
    ctx.shadowBlur = 8;
    
    ctx.strokeRect(startX, startY, width, height);
    
    drawSequenceNumber(ctx, startX - 15, startY - 15, sequence);
  };

  const drawSequenceNumber = (ctx: CanvasRenderingContext2D, x: number, y: number, number: number) => {
    ctx.save();
    ctx.shadowColor = 'transparent';
    ctx.setLineDash([]);
    
    // Background circle
    ctx.fillStyle = '#8B5CF6';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    // Number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number.toString(), x, y);
    
    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentTool === "select") return;
    
    const canvas = overlayRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    setIsDrawing(true);
    setStartPos({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || currentTool === "select") return;
    
    const canvas = overlayRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    let newAnnotation: any = null;
    
    switch (currentTool) {
      case "arrow":
        newAnnotation = {
          id: Date.now().toString(),
          type: "arrow",
          data: { startX: startPos.x, startY: startPos.y, endX: x, endY: y }
        };
        break;
      case "text":
        const text = prompt("Enter action description:");
        if (text) {
          newAnnotation = {
            id: Date.now().toString(),
            type: "text",
            data: { x: startPos.x, y: startPos.y, text }
          };
        }
        break;
      case "circle":
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        newAnnotation = {
          id: Date.now().toString(),
          type: "circle",
          data: { centerX: startPos.x, centerY: startPos.y, radius }
        };
        break;
      case "rectangle":
        newAnnotation = {
          id: Date.now().toString(),
          type: "rectangle",
          data: { 
            startX: Math.min(startPos.x, x), 
            startY: Math.min(startPos.y, y),
            width: Math.abs(x - startPos.x),
            height: Math.abs(y - startPos.y)
          }
        };
        break;
    }
    
    if (newAnnotation) {
      setAnnotations(prev => [...prev, newAnnotation]);
      setActionSequence(prev => prev + 1);
    }
    
    setIsDrawing(false);
  };

  const handleGenerate = () => {
    if (annotations.length === 0) {
      alert("Please add at least one movement or action annotation");
      return;
    }
    onGenerate(annotations);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
                ← Back
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Draw to Video</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                {annotations.length} Actions
              </Badge>
              <Button 
                onClick={handleGenerate}
                disabled={annotations.length === 0}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Generate Video
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-4 gap-6">
        {/* Tools Panel */}
        <Card className="lg:col-span-1 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Drawing Tools
            </h3>
            
            <div className="space-y-2">
              {drawingTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={currentTool === tool.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    currentTool === tool.id 
                      ? "bg-violet-500 hover:bg-violet-600" 
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setCurrentTool(tool.id)}
                >
                  {tool.icon}
                  <span className="ml-2">{tool.name}</span>
                </Button>
              ))}
            </div>

            <Separator className="my-6 bg-white/10" />

            <h4 className="text-md font-semibold text-white mb-4 flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              Motion Presets
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              {motionPresets.slice(0, 6).map((preset) => (
                <Button
                  key={preset.id}
                  variant={selectedPreset === preset.id ? "default" : "outline"}
                  className={`h-auto p-3 flex flex-col items-center text-xs ${
                    selectedPreset === preset.id
                      ? "bg-violet-500 border-violet-400"
                      : "border-white/20 text-white hover:bg-white/10"
                  }`}
                  onClick={() => setSelectedPreset(preset.id)}
                >
                  <div className="text-lg mb-1">{preset.thumbnail}</div>
                  <div className="font-medium">{preset.name}</div>
                </Button>
              ))}
            </div>

            <Separator className="my-6 bg-white/10" />

            <div className="space-y-2">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <Undo className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="relative">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Draw Your <span className="text-violet-400">Scene Instructions</span>
                  </h2>
                  <p className="text-gray-400">
                    Add movement arrows, action text, and focus areas to direct the AI
                  </p>
                </div>
                
                <div className="relative bg-black/20 rounded-2xl overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-auto"
                  />
                  <canvas
                    ref={overlayRef}
                    className={`relative w-full h-auto cursor-${drawingTools.find(t => t.id === currentTool)?.cursor || 'default'}`}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                  />
                  
                  {/* Instruction Overlay */}
                  {annotations.length === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-4xl mb-4">🎨</div>
                        <h3 className="text-xl font-semibold mb-2">Start Drawing Instructions</h3>
                        <p className="text-gray-300">Select a tool and draw on the image to create movement</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Legend */}
                {annotations.length > 0 && (
                  <div className="mt-4 p-4 bg-black/20 rounded-xl">
                    <h4 className="text-white font-semibold mb-2">Action Sequence:</h4>
                    <div className="flex flex-wrap gap-2">
                      {annotations.map((annotation, index) => (
                        <Badge key={annotation.id} variant="secondary" className="bg-violet-500/20 text-violet-300">
                          {index + 1}. {annotation.type} instruction
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}