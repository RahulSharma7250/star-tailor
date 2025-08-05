
import { useState } from "react";
import { Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import DrawingCanvas from "./DrawingCanvas";

interface DesignInstructionsFormProps {
  designImage: File | null;
  instructions: string;
  onImageUpload: (file: File | null) => void;
  onInstructionsChange: (instructions: string) => void;
  onDrawingSave?: (dataUrl: string) => void;
}

const DesignInstructionsForm = ({ 
  designImage, 
  instructions, 
  onImageUpload, 
  onInstructionsChange,
  onDrawingSave 
}: DesignInstructionsFormProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      onImageUpload(file);
      toast({
        title: "Image uploaded",
        description: "Design image has been uploaded successfully",
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload JPG, PNG, or WebP files only",
        variant: "destructive"
      });
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: blob.type });
          onImageUpload(file);
          toast({
            title: "Image pasted",
            description: "Design image has been pasted successfully",
          });
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
        onImageUpload(file);
        toast({
          title: "Image uploaded",
          description: "Design image has been uploaded successfully",
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload JPG, PNG, or WebP files only",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design & Instructions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="designImage">Upload Design Image</Label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onPaste={handlePaste}
              tabIndex={0}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-4">
                Drag & drop an image, click to upload, or paste from clipboard (Ctrl+V)
              </p>
              <Input
                id="designImage"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('designImage')?.click()}
              >
                Choose File
              </Button>
            </div>
            {designImage && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700">
                  ✓ File uploaded: {designImage.name}
                </p>
              </div>
            )}
          </div>
          
          <div>
            <DrawingCanvas 
              onSaveDrawing={(dataUrl) => {
                if (onDrawingSave) {
                  onDrawingSave(dataUrl);
                }
              }}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="instructions">Tailoring Instructions</Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            placeholder="Enter specific instructions for the tailor..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignInstructionsForm;
