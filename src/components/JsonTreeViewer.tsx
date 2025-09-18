import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JsonTreeNodeProps {
  data: any;
  keyName?: string;
  level?: number;
  isLast?: boolean;
  path?: string;
}

interface JsonTreeViewerProps {
  data: string;
  className?: string;
}

function JsonTreeNode({ data, keyName, level = 0, isLast = false, path = "" }: JsonTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 3); // Auto-expand first 3 levels
  const [copied, setCopied] = useState(false);

  const isObject = data !== null && typeof data === 'object' && !Array.isArray(data);
  const isArray = Array.isArray(data);
  const isPrimitive = !isObject && !isArray;
  const hasChildren = (isObject && Object.keys(data).length > 0) || (isArray && data.length > 0);

  const indent = level * 20;

  const getValueColor = (value: any) => {
    if (value === null) return "text-gray-500";
    if (typeof value === "string") return "text-green-600 dark:text-green-400";
    if (typeof value === "number") return "text-blue-600 dark:text-blue-400";
    if (typeof value === "boolean") return "text-purple-600 dark:text-purple-400";
    return "text-foreground";
  };

  const getValueDisplay = (value: any) => {
    if (value === null) return "null";
    if (typeof value === "string") return `"${value}"`;
    return String(value);
  };

  const handleCopyPath = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(path);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error('Failed to copy path:', err);
    }
  };

  const renderCollapsedPreview = () => {
    if (isArray) {
      return (
        <span className="text-muted-foreground text-sm ml-2">
          [{data.length} {data.length === 1 ? 'item' : 'items'}]
        </span>
      );
    }
    if (isObject) {
      const keys = Object.keys(data);
      return (
        <span className="text-muted-foreground text-sm ml-2">
          {`{${keys.length} ${keys.length === 1 ? 'property' : 'properties'}}`}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="select-text">
      <div
        className={`
          flex items-center py-1 px-2 hover:bg-muted/50 rounded-md cursor-pointer group
          transition-colors duration-200
        `}
        style={{ paddingLeft: `${indent + 8}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {/* Expand/Collapse Icon */}
        <div className="w-4 h-4 mr-2 flex items-center justify-center">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )
          ) : null}
        </div>

        {/* Key Name */}
        {keyName && (
          <>
            <span className="text-red-600 dark:text-red-400 font-medium mr-1">
              "{keyName}"
            </span>
            <span className="text-muted-foreground mr-2">:</span>
          </>
        )}

        {/* Value */}
        {isPrimitive ? (
          <span className={getValueColor(data)}>{getValueDisplay(data)}</span>
        ) : (
          <div className="flex items-center">
            <span className="text-muted-foreground">
              {isArray ? "[" : "{"}
            </span>
            {!isExpanded && renderCollapsedPreview()}
            {!isExpanded && (
              <span className="text-muted-foreground ml-1">
                {isArray ? "]" : "}"}
              </span>
            )}
          </div>
        )}

        {/* Copy Path Button */}
        {path && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0"
            onClick={handleCopyPath}
            title={`Copy path: ${path}`}
          >
            {copied ? (
              <Check className="w-3 h-3 text-success" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {isArray ? (
            data.map((item: any, index: number) => (
              <JsonTreeNode
                key={index}
                data={item}
                keyName={`[${index}]`}
                level={level + 1}
                isLast={index === data.length - 1}
                path={path ? `${path}[${index}]` : `[${index}]`}
              />
            ))
          ) : (
            Object.entries(data).map(([key, value], index, entries) => (
              <JsonTreeNode
                key={key}
                data={value}
                keyName={key}
                level={level + 1}
                isLast={index === entries.length - 1}
                path={path ? `${path}.${key}` : key}
              />
            ))
          )}
          
          {/* Closing bracket */}
          <div 
            className="flex items-center py-1 px-2 text-muted-foreground"
            style={{ paddingLeft: `${indent + 8}px` }}
          >
            <div className="w-4 h-4 mr-2"></div>
            {isArray ? "]" : "}"}
            {!isLast && <span className="text-muted-foreground">,</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export function JsonTreeViewer({ data, className = "" }: JsonTreeViewerProps) {
  try {
    if (!data.trim()) {
      return (
        <div className={`p-8 text-center text-muted-foreground ${className}`}>
          <p>No JSON data to display</p>
        </div>
      );
    }

    const parsedData = JSON.parse(data);
    
    return (
      <div className={`font-mono text-sm bg-card border rounded-lg overflow-auto ${className}`}>
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">JSON Tree View</h4>
            <div className="text-xs text-muted-foreground">
              Click nodes to expand/collapse
            </div>
          </div>
        </div>
        
        <div className="p-2 max-h-[500px] overflow-auto">
          <JsonTreeNode data={parsedData} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <div className="text-destructive">
          <p className="font-medium">Invalid JSON</p>
          <p className="text-sm mt-1">
            {error instanceof Error ? error.message : 'Unable to parse JSON'}
          </p>
        </div>
      </div>
    );
  }
}