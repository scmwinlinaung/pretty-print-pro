import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { EditorPanel } from "@/components/EditorPanel";
import { OutputViewer } from "@/components/OutputViewer";
import { ActionBar } from "@/components/ActionBar";
import { formatters, validateCode } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeFormatter, setActiveFormatter] = useState('json');
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [indentSize, setIndentSize] = useState('2');
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  // Sample data for different formatters
  const sampleData = {
    json: '{"name":"John Doe","age":30,"city":"New York","hobbies":["reading","coding","traveling"],"address":{"street":"123 Main St","zipCode":"10001"}}',
    typescript: 'interface User{name:string;age:number;email:string;}const user:User={name:"John",age:30,email:"john@example.com"};function greetUser(user:User):string{return `Hello, ${user.name}!`;}',
    xml: '<?xml version="1.0" encoding="UTF-8"?><users><user id="1"><name>John Doe</name><email>john@example.com</email><active>true</active></user><user id="2"><name>Jane Smith</name><email>jane@example.com</email><active>false</active></user></users>',
    css: 'body{margin:0;padding:0;font-family:Arial,sans-serif;}.header{background-color:#333;color:white;padding:20px;}.container{max-width:1200px;margin:0 auto;padding:20px;}',
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Example</title></head><body><header class="header"><h1>Welcome</h1></header><main class="container"><p>This is a sample HTML document.</p></main></body></html>'
  };

  // Load sample data when formatter changes
  useEffect(() => {
    const sample = sampleData[activeFormatter as keyof typeof sampleData] || '';
    setInputCode(sample);
    handleFormat(sample);
  }, [activeFormatter]);

  const handleFormat = (code: string = inputCode) => {
    if (!code.trim()) {
      setOutputCode('');
      setIsValid(undefined);
      setError('');
      return;
    }

    const indent = indentSize === 'tab' ? 4 : parseInt(indentSize);
    const formatter = formatters[activeFormatter as keyof typeof formatters];
    
    if (formatter) {
      const result = formatter(code, indent);
      setOutputCode(result.formatted);
      setIsValid(result.isValid);
      setError(result.error || '');
      
      if (result.isValid) {
        toast({
          title: "Code formatted successfully",
          description: `Your ${activeFormatter.toUpperCase()} code has been formatted and validated.`,
        });
      }
    }
  };

  const handleMinify = () => {
    if (!inputCode.trim()) return;
    
    let minified = inputCode;
    
    if (activeFormatter === 'json') {
      try {
        const parsed = JSON.parse(inputCode);
        minified = JSON.stringify(parsed);
      } catch (e) {
        minified = inputCode.replace(/\s+/g, ' ').trim();
      }
    } else {
      minified = inputCode.replace(/\s+/g, ' ').trim();
    }
    
    setOutputCode(minified);
    toast({
      title: "Code minified",
      description: "Your code has been compacted to save space.",
    });
  };

  const handleValidate = () => {
    const validation = validateCode(inputCode, activeFormatter);
    setIsValid(validation.isValid);
    setError(validation.error || '');
    
    toast({
      title: validation.isValid ? "Code is valid" : "Code has errors",
      description: validation.error || `Your ${activeFormatter.toUpperCase()} code is valid.`,
      variant: validation.isValid ? "default" : "destructive",
    });
  };

  const handleClear = () => {
    setInputCode('');
    setOutputCode('');
    setIsValid(undefined);
    setError('');
    toast({
      title: "Editor cleared",
      description: "Both input and output have been cleared.",
    });
  };

  const handleUpload = (content: string) => {
    setInputCode(content);
    handleFormat(content);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "CodeFormat Pro",
            "description": "Professional online code formatter for JSON, TypeScript, XML, CSS, and HTML",
            "url": "https://codeformat.pro",
            "applicationCategory": "DeveloperTool",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

      <Header 
        activeFormatter={activeFormatter} 
        onFormatterChange={setActiveFormatter} 
      />

      <main className="container mx-auto px-4 py-8 max-w-full">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Professional Code Formatter & Beautifier
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Format, validate, and beautify your JSON, TypeScript, XML, CSS, and HTML code with our elegant online tools. 
            Perfect for developers who care about clean, readable code.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <span>✨ Real-time formatting</span>
            <span>🎯 Syntax validation</span>
            <span>📱 Mobile responsive</span>
            <span>🚀 Lightning fast</span>
          </div>
        </section>

        {/* Editor Interface */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8 min-h-[700px]">
          <EditorPanel
            title="Input Code"
            value={inputCode}
            onChange={setInputCode}
            placeholder={`Paste your ${activeFormatter.toUpperCase()} code here...`}
            isValid={isValid}
            error={error}
            onUpload={handleUpload}
            language={activeFormatter}
          />
          
          <OutputViewer
            title="Formatted Output"
            value={outputCode}
            language={activeFormatter}
          />
        </section>

        {/* Action Bar */}
        <ActionBar
          onFormat={() => handleFormat()}
          onClear={handleClear}
          onMinify={handleMinify}
          onValidate={handleValidate}
          isValid={isValid}
          hasError={!!error}
          indentSize={indentSize}
          onIndentChange={setIndentSize}
          language={activeFormatter}
          inputLength={inputCode.length}
          outputLength={outputCode.length}
        />

        {/* Features Section */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
          <div className="text-center p-6 rounded-xl bg-card border border-border hover:shadow-elegant transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-lg">🎨</span>
            </div>
            <h3 className="font-semibold mb-2">Beautiful Formatting</h3>
            <p className="text-sm text-muted-foreground">
              Transform messy code into clean, readable format with proper indentation and syntax highlighting.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card border border-border hover:shadow-elegant transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-lg">⚡</span>
            </div>
            <h3 className="font-semibold mb-2">Real-time Validation</h3>
            <p className="text-sm text-muted-foreground">
              Instantly validate your code syntax and get helpful error messages to fix issues quickly.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-card border border-border hover:shadow-elegant transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-lg">🛠️</span>
            </div>
            <h3 className="font-semibold mb-2">Developer Tools</h3>
            <p className="text-sm text-muted-foreground">
              Upload files, download formatted code, copy to clipboard, and customize indentation preferences.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
