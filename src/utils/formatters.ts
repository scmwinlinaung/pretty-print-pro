// Formatting utilities for different languages

export interface FormatResult {
  formatted: string;
  isValid: boolean;
  error?: string;
}

export const formatters = {
  json: (input: string, indent: number = 2): FormatResult => {
    try {
      if (!input.trim()) {
        return { formatted: '', isValid: true };
      }
      
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      return { formatted, isValid: true };
    } catch (error) {
      return {
        formatted: input,
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid JSON syntax'
      };
    }
  },

  typescript: (input: string, indent: number = 2): FormatResult => {
    try {
      // Basic TypeScript/JavaScript formatting
      if (!input.trim()) {
        return { formatted: '', isValid: true };
      }

      let formatted = input;
      const indentStr = ' '.repeat(indent);
      
      // Basic formatting rules
      formatted = formatted
        // Remove extra spaces
        .replace(/\s+/g, ' ')
        // Add spaces around operators
        .replace(/([=+\-*/<>!])(?!=)/g, ' $1 ')
        .replace(/([=+\-*/<>!])\s*=/g, '$1= ')
        // Format braces and brackets
        .replace(/{\s*/g, '{\n' + indentStr)
        .replace(/\s*}/g, '\n}')
        .replace(/;\s*/g, ';\n')
        .replace(/,\s*/g, ',\n' + indentStr)
        // Clean up multiple newlines
        .replace(/\n+/g, '\n')
        .trim();

      return { formatted, isValid: true };
    } catch (error) {
      return {
        formatted: input,
        isValid: false,
        error: 'TypeScript formatting error'
      };
    }
  },

  xml: (input: string, indent: number = 2): FormatResult => {
    try {
      if (!input.trim()) {
        return { formatted: '', isValid: true };
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'application/xml');
      
      // Check for parsing errors
      const errorNode = xmlDoc.querySelector('parsererror');
      if (errorNode) {
        return {
          formatted: input,
          isValid: false,
          error: 'Invalid XML syntax'
        };
      }

      // Basic XML formatting
      const indentStr = ' '.repeat(indent);
      let formatted = input
        .replace(/>\s*</g, '>\n<')
        .replace(/^\s+|\s+$/gm, '')
        .split('\n')
        .map((line, index) => {
          const level = line.match(/<\//g) ? -1 : line.match(/</g) ? 0 : 0;
          return indentStr.repeat(Math.max(0, index + level)) + line;
        })
        .join('\n');

      return { formatted, isValid: true };
    } catch (error) {
      return {
        formatted: input,
        isValid: false,
        error: 'XML parsing error'
      };
    }
  },

  css: (input: string, indent: number = 2): FormatResult => {
    try {
      if (!input.trim()) {
        return { formatted: '', isValid: true };
      }

      const indentStr = ' '.repeat(indent);
      
      let formatted = input
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Format selectors and braces
        .replace(/{\s*/g, ' {\n')
        .replace(/}\s*/g, '\n}\n\n')
        .replace(/;\s*/g, ';\n')
        .replace(/:\s*/g, ': ')
        // Add proper indentation
        .split('\n')
        .map(line => {
          line = line.trim();
          if (line.includes('{') || line.includes('}')) {
            return line;
          } else if (line.length > 0) {
            return indentStr + line;
          }
          return line;
        })
        .join('\n')
        // Clean up multiple newlines
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      return { formatted, isValid: true };
    } catch (error) {
      return {
        formatted: input,
        isValid: false,
        error: 'CSS formatting error'
      };
    }
  },

  html: (input: string, indent: number = 2): FormatResult => {
    try {
      if (!input.trim()) {
        return { formatted: '', isValid: true };
      }

      const indentStr = ' '.repeat(indent);
      let depth = 0;
      
      const formatted = input
        .replace(/>\s*</g, '><')
        .replace(/></g, '>\n<')
        .split('\n')
        .map(line => {
          line = line.trim();
          if (line.length === 0) return '';
          
          // Decrease depth for closing tags
          if (line.startsWith('</')) {
            depth = Math.max(0, depth - 1);
          }
          
          const indentedLine = indentStr.repeat(depth) + line;
          
          // Increase depth for opening tags (but not self-closing)
          if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>')) {
            depth++;
          }
          
          return indentedLine;
        })
        .join('\n')
        .trim();

      return { formatted, isValid: true };
    } catch (error) {
      return {
        formatted: input,
        isValid: false,
        error: 'HTML formatting error'
      };
    }
  }
};

export const validateCode = (code: string, language: string): { isValid: boolean; error?: string } => {
  const result = formatters[language as keyof typeof formatters]?.(code);
  return {
    isValid: result?.isValid ?? false,
    error: result?.error
  };
};