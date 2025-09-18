import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Copy, Check, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface EditorPanelProps {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  isOutput?: boolean;
  isValid?: boolean;
  error?: string;
  onUpload?: (content: string) => void;
  onDownload?: () => void;
  language?: string;
}

export function EditorPanel({
  title,
  value,
  onChange,
  placeholder,
  isOutput = false,
  isValid,
  error,
  onUpload,
  onDownload,
  language = 'json'
}: EditorPanelProps) {
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState("2");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied successfully",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpload) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onUpload(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      const blob = new Blob([value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `formatted.${language}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="editor-panel h-full min-h-[600px] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-3">
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          {!isOutput && isValid !== undefined && (
            <div className="flex items-center space-x-1">
              {isValid ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : (
                <AlertCircle className="w-4 h-4 text-destructive" />
              )}
              <span className={`text-xs ${isValid ? 'text-success' : 'text-destructive'}`}>
                {isValid ? 'Valid' : 'Invalid'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!isOutput && (
            <>
              <Select value={indentSize} onValueChange={setIndentSize}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Space</SelectItem>
                  <SelectItem value="4">4 Space</SelectItem>
                  <SelectItem value="tab">Tab</SelectItem>
                </SelectContent>
              </Select>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={`.${language},.txt`}
                onChange={handleUpload}
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 px-2 hover:bg-accent/20 hover:text-accent"
                title="Upload file"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!value}
            className={`h-8 px-2 transition-colors duration-300 ${
              copied 
                ? 'bg-success/20 text-success hover:bg-success/30' 
                : 'hover:bg-accent/20 hover:text-accent'
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={!value}
            className="h-8 px-2 hover:bg-accent/20 hover:text-accent"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative">
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={isOutput}
          className={`
            editor-textarea border-0 rounded-none resize-none text-sm leading-6
            ${language === 'json' ? 'syntax-json' : ''}
            ${isOutput ? 'bg-muted/20' : 'bg-transparent'}
            focus:ring-0 focus:border-0 min-h-[500px]
          `}
          style={{ minHeight: '500px', height: '500px' }}
        />
        
        {error && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm text-destructive">
                <p className="font-medium">Validation Error</p>
                <p className="text-xs mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}