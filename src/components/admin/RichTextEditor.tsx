"use client";

import { useState, useRef, useCallback } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Type, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Quote,
  Eye,
  Edit3
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
  showPreview?: boolean;
}

interface ToolbarButton {
  icon: React.ComponentType<any>;
  action: string;
  title: string;
  shortcut?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe tu contenido aquí...",
  className = "",
  minHeight = 200,
  showPreview = true
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Funciones de formato
  const insertText = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Restaurar posición del cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }, [value, onChange]);

  const insertAtCursor = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + text + value.substring(start);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  }, [value, onChange]);

  // Acciones de la toolbar
  const toolbarActions = {
    bold: () => insertText('**', '**'),
    italic: () => insertText('*', '*'),
    underline: () => insertText('<u>', '</u>'),
    h2: () => insertText('## ', ''),
    h3: () => insertText('### ', ''),
    bulletList: () => insertText('- ', ''),
    numberedList: () => insertText('1. ', ''),
    link: () => {
      const url = prompt('Ingresa la URL:');
      if (url) insertText(`[texto del enlace](${url})`, '');
    },
    image: () => {
      const url = prompt('Ingresa la URL de la imagen:');
      if (url) insertText(`![alt text](${url})`, '');
    },
    code: () => insertText('`', '`'),
    codeBlock: () => insertText('\n```\n', '\n```\n'),
    quote: () => insertText('> ', ''),
    divider: () => insertAtCursor('\n\n---\n\n'),
  };

  // Definición de botones de la toolbar
  const toolbarButtons: ToolbarButton[] = [
    { icon: Bold, action: 'bold', title: 'Negrita', shortcut: 'Ctrl+B' },
    { icon: Italic, action: 'italic', title: 'Cursiva', shortcut: 'Ctrl+I' },
    { icon: Underline, action: 'underline', title: 'Subrayado', shortcut: 'Ctrl+U' },
    { icon: Type, action: 'h2', title: 'Título H2' },
    { icon: Type, action: 'h3', title: 'Título H3' },
    { icon: List, action: 'bulletList', title: 'Lista con viñetas' },
    { icon: ListOrdered, action: 'numberedList', title: 'Lista numerada' },
    { icon: Link, action: 'link', title: 'Insertar enlace' },
    { icon: Image, action: 'image', title: 'Insertar imagen' },
    { icon: Code, action: 'code', title: 'Código inline' },
    { icon: Quote, action: 'quote', title: 'Cita' },
  ];

  // Convertir markdown básico a HTML para preview
  const markdownToHtml = (markdown: string): string => {
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Underline
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      // Code inline
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Quotes
      .replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>')
      // Line breaks
      .replace(/\n/g, '<br>')
      // Lists
      .replace(/^- (.*)$/gim, '<li>$1</li>')
      .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
      .replace(/^(\d+)\. (.*)$/gim, '<li>$2</li>')
      // Horizontal rule
      .replace(/^---$/gim, '<hr>');
  };

  // Manejar shortcuts de teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          toolbarActions.bold();
          break;
        case 'i':
          e.preventDefault();
          toolbarActions.italic();
          break;
        case 'u':
          e.preventDefault();
          toolbarActions.underline();
          break;
      }
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <button
                key={index}
                onClick={() => toolbarActions[button.action as keyof typeof toolbarActions]?.()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                title={`${button.title}${button.shortcut ? ` (${button.shortcut})` : ''}`}
                type="button"
              >
                <IconComponent className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* Toggle Preview */}
        {showPreview && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPreview(false)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                !isPreview 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              type="button"
            >
              <Edit3 className="h-4 w-4 inline mr-1" />
              Editar
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                isPreview 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              type="button"
            >
              <Eye className="h-4 w-4 inline mr-1" />
              Preview
            </button>
          </div>
        )}
      </div>

      {/* Editor/Preview Area */}
      <div style={{ minHeight }}>
        {isPreview ? (
          // Preview Mode
          <div 
            className="p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
          />
        ) : (
          // Edit Mode
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full p-4 border-none outline-none resize-none font-mono text-sm"
            style={{ minHeight }}
          />
        )}
      </div>

      {/* Footer con ayuda */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>
            Soporta Markdown: **negrita**, *cursiva*, [enlaces](url), ![imagen](url)
          </span>
          <span>
            {value.length} caracteres
          </span>
        </div>
      </div>
    </div>
  );
}