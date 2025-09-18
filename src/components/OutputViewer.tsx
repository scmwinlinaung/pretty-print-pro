import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { JsonTreeViewer } from "./JsonTreeViewer";
import { Copy, Download, Check, TreePine, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OutputViewerProps {
  title: string;
  value: string;
  language: string;
  className?: string;
}

export function OutputViewer({ title, value, language, className = "" }: OutputViewerProps) {
  const [viewMode, setViewMode] = useState<'tree' | 'text'>(language === 'json' ? 'tree' : 'text');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Formatted code has been copied successfully",
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

  const handleDownload = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`editor-panel h-full min-h-[600px] flex flex-col animate-fade-in ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-3">
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          {language === 'json' && (
            <div className="flex items-center space-x-1 bg-muted rounded-md p-1">
              <Button
                variant={viewMode === 'tree' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('tree')}
                className="h-7 px-2 text-xs"
              >
                <TreePine className="w-3 h-3 mr-1" />
                Tree
              </Button>
              <Button
                variant={viewMode === 'text' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('text')}
                className="h-7 px-2 text-xs"
              >
                <FileText className="w-3 h-3 mr-1" />
                Text
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
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

      {/* Content */}
      <div className="flex-1 relative">
        {value ? (
          <>
            {language === 'json' && viewMode === 'tree' ? (
              <JsonTreeViewer data={value} className="h-full" />
            ) : (
              <Textarea
                value={value}
                readOnly
                placeholder="Formatted code will appear here..."
                className={`
                  editor-textarea border-0 rounded-none resize-none text-sm leading-6
                  ${language === 'json' ? 'syntax-json' : ''}
                  bg-muted/20 focus:ring-0 focus:border-0 min-h-[500px]
                `}
                style={{ minHeight: '500px', height: '500px' }}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Formatted code will appear here...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}