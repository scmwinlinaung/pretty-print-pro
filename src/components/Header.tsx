import { Button } from "@/components/ui/button";
import { FileText, Code2, Braces, Palette, Globe } from "lucide-react";

interface HeaderProps {
  activeFormatter: string;
  onFormatterChange: (formatter: string) => void;
}

const formatters = [
  { id: 'json', name: 'JSON', icon: Braces, description: 'Format & validate JSON' },
  { id: 'typescript', name: 'TypeScript', icon: Code2, description: 'Format TypeScript code' },
  { id: 'xml', name: 'XML', icon: FileText, description: 'Format XML documents' },
  { id: 'css', name: 'CSS', icon: Palette, description: 'Beautify CSS styles' },
  { id: 'html', name: 'HTML', icon: Globe, description: 'Format HTML markup' },
];

export function Header({ activeFormatter, onFormatterChange }: HeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  CodeFormat Pro
                </h1>
                <p className="text-xs text-muted-foreground">
                  Professional Code Formatter
                </p>
              </div>
            </div>
          </div>

          <nav className="flex items-center space-x-1 bg-muted/50 p-1 rounded-xl">
            {formatters.map((formatter) => {
              const Icon = formatter.icon;
              return (
                <Button
                  key={formatter.id}
                  variant={activeFormatter === formatter.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onFormatterChange(formatter.id)}
                  className={`
                    relative px-3 py-2 text-sm font-medium transition-all duration-300
                    ${activeFormatter === formatter.id 
                      ? "bg-gradient-primary text-white shadow-accent" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }
                  `}
                  title={formatter.description}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {formatter.name}
                  {activeFormatter === formatter.id && (
                    <div className="absolute inset-0 bg-gradient-primary rounded-md opacity-20 animate-pulse" />
                  )}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}