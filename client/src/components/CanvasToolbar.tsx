import { Button } from "@/components/ui/button";
import { MousePointer, Pen, ArrowRight, Type, Square, Circle, Undo, Trash2, Sparkles } from "lucide-react";

interface CanvasToolbarProps {
  currentTool: string;
  onToolChange: (tool: string) => void;
  onUndo: () => void;
  onClear: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function CanvasToolbar({
  currentTool,
  onToolChange,
  onUndo,
  onClear,
  onGenerate,
  isGenerating,
}: CanvasToolbarProps) {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'pen', icon: Pen, label: 'Free Draw' },
    { id: 'arrow', icon: ArrowRight, label: 'Draw Arrow' },
    { id: 'text', icon: Type, label: 'Add Text' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-2xl px-6 py-3 flex items-center space-x-3 shadow-2xl">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Button
            key={tool.id}
            variant="ghost"
            size="sm"
            className={`text-white hover:text-accent transition-colors p-3 rounded-lg ${
              currentTool === tool.id ? 'bg-white/10' : ''
            }`}
            onClick={() => onToolChange(tool.id)}
            title={tool.label}
          >
            <Icon className="w-5 h-5" />
          </Button>
        );
      })}
      
      <div className="w-px h-8 bg-gray-600"></div>
      
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:text-gray-300 transition-colors p-3 rounded-lg"
        onClick={onUndo}
        title="Undo"
      >
        <Undo className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:text-red-400 transition-colors p-3 rounded-lg"
        onClick={onClear}
        title="Clear All"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
      
      <div className="w-px h-8 bg-gray-600"></div>
      
      <Button
        className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
        onClick={onGenerate}
        disabled={isGenerating}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {isGenerating ? 'Generating...' : 'Generate Video'}
      </Button>
    </div>
  );
}
