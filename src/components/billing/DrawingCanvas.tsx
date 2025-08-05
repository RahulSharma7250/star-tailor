import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Eraser, Save } from "lucide-react";

interface DrawingCanvasProps {
  onSaveDrawing: (dataUrl: string) => void;
}

const DrawingCanvas = ({ onSaveDrawing }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 200;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configure drawing context for smooth lines
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctxRef.current = ctx;
  }, []);

  const getPointerPos = useCallback((e: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const startDrawing = useCallback((e: PointerEvent) => {
    const pos = getPointerPos(e);
    setIsDrawing(true);
    setLastPos(pos);
    
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, [getPointerPos]);

  const draw = useCallback((e: PointerEvent) => {
    if (!isDrawing) return;
    
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    const pos = getPointerPos(e);
    
    // Draw smooth line from last position to current position
    ctx.quadraticCurveTo(lastPos.x, lastPos.y, (pos.x + lastPos.x) / 2, (pos.y + lastPos.y) / 2);
    ctx.stroke();
    
    setLastPos(pos);
  }, [isDrawing, lastPos, getPointerPos]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    ctx.closePath();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Add pointer event listeners for better stylus/touch support
    canvas.addEventListener('pointerdown', startDrawing);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointerleave', stopDrawing);

    // Prevent scrolling when touching the canvas
    canvas.addEventListener('touchstart', (e) => e.preventDefault());
    canvas.addEventListener('touchmove', (e) => e.preventDefault());
    canvas.addEventListener('touchend', (e) => e.preventDefault());

    return () => {
      canvas.removeEventListener('pointerdown', startDrawing);
      canvas.removeEventListener('pointermove', draw);
      canvas.removeEventListener('pointerup', stopDrawing);
      canvas.removeEventListener('pointerleave', stopDrawing);
      canvas.removeEventListener('touchstart', (e) => e.preventDefault());
      canvas.removeEventListener('touchmove', (e) => e.preventDefault());
      canvas.removeEventListener('touchend', (e) => e.preventDefault());
    };
  }, [startDrawing, draw, stopDrawing]);

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    toast({
      title: "Canvas cleared",
      description: "Drawing has been cleared",
    });
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    onSaveDrawing(dataUrl);
    
    toast({
      title: "Drawing saved",
      description: "Your drawing has been saved successfully",
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Drawing/Signature Pad</h4>
        
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <canvas 
            ref={canvasRef}
            className="touch-none cursor-crosshair block"
            style={{ 
              touchAction: 'none',
              width: '100%',
              height: 'auto',
              maxWidth: '300px'
            }}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleClear}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eraser className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button
            onClick={handleSave}
            variant="default"
            size="sm"
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-1" />
            Save Drawing
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DrawingCanvas;