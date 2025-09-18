import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, 
  RotateCcw, 
  Minimize2, 
  Copy, 
  Download,
  FileText,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface ActionBarProps {
  onFormat: () => void;
  onClear: () => void;
  onMinify: () => void;
  onValidate: () => void;
  isValid?: boolean;
  hasError?: boolean;
  indentSize: string;
  onIndentChange: (size: string) => void;
  language: string;
  inputLength: number;
  outputLength: number;
}

export function ActionBar({
  onFormat,
  onClear,
  onMinify,
  onValidate,
  isValid,
  hasError,
  indentSize,
  onIndentChange,
  language,
  inputLength,
  outputLength
}: ActionBarProps) {
  return (
    <div className="flex flex-col space-y-4 p-6 bg-muted/30 border-y animate-slide-up">
      {/* Main Actions */}
      <div className="flex items-center justify-center space-x-3">
        <Button
          onClick={onFormat}
          className="btn-gradient px-6 py-2 font-semibold shadow-glow"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Format / Beautify
        </Button>

        <Button
          variant="outline"
          onClick={onMinify}
          className="hover:border-accent hover:text-accent transition-colors duration-300"
        >
          <Minimize2 className="w-4 h-4 mr-2" />
          Minify / Compact
        </Button>

        <Button
          variant="outline"
          onClick={onValidate}
          className={`transition-colors duration-300 ${
            isValid === true 
              ? 'border-success text-success hover:bg-success/10' 
              : hasError 
              ? 'border-destructive text-destructive hover:bg-destructive/10'
              : 'hover:border-accent hover:text-accent'
          }`}
        >
          {isValid === true ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : hasError ? (
            <AlertTriangle className="w-4 h-4 mr-2" />
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          Validate
        </Button>

        <Button
          variant="ghost"
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-300"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Settings Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-muted-foreground">
              Indentation:
            </label>
            <Select value={indentSize} onValueChange={onIndentChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Spaces</SelectItem>
                <SelectItem value="4">4 Spaces</SelectItem>
                <SelectItem value="8">8 Spaces</SelectItem>
                <SelectItem value="tab">Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {language.toUpperCase()}
            </Badge>
            {isValid !== undefined && (
              <Badge 
                variant={isValid ? "default" : "destructive"}
                className={`text-xs ${
                  isValid 
                    ? "bg-success/20 text-success border-success/30" 
                    : "bg-destructive/20 text-destructive border-destructive/30"
                }`}
              >
                {isValid ? "Valid" : "Invalid"}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <span>Input: {inputLength.toLocaleString()} chars</span>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>Output: {outputLength.toLocaleString()} chars</span>
          </div>
          {inputLength > 0 && outputLength > 0 && (
            <>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span className={`${
                outputLength < inputLength ? 'text-success' : 'text-primary'
              }`}>
                {outputLength < inputLength 
                  ? `${Math.round((1 - outputLength / inputLength) * 100)}% smaller`
                  : `${Math.round((outputLength / inputLength - 1) * 100)}% larger`
                }
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}