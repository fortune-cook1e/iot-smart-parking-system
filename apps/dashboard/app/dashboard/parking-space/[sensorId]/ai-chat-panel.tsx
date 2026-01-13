'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  IconSend,
  IconRobot,
  IconUser,
  IconSparkles,
  IconLoader2,
  IconX,
  IconMessageCircle,
  IconArrowsMaximize,
  IconArrowsMinimize,
} from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { aiChatApi, ChatMessage, ParkingAnalysisContext } from '@/services/ai-chat';
import { cn } from '@/lib/utils';

interface AIChatPanelProps {
  context: ParkingAnalysisContext;
}

const SUGGESTED_PROMPTS = [
  'Based on the parking data, what dynamic pricing strategy do you recommend?',
  'What are the peak hours and how should I adjust prices?',
];

const MIN_WIDTH = 350;
const MIN_HEIGHT = 400;
const DEFAULT_WIDTH = 420;
const DEFAULT_HEIGHT = 550;

export function AIChatPanel({ context }: AIChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [size, setSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle resize
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      startPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
      };
    },
    [size]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = startPosRef.current.x - e.clientX;
      const deltaY = startPosRef.current.y - e.clientY;

      const newWidth = Math.max(MIN_WIDTH, startPosRef.current.width + deltaX);
      const newHeight = Math.max(MIN_HEIGHT, startPosRef.current.height + deltaY);

      // Limit to viewport
      const maxWidth = window.innerWidth - 48;
      const maxHeight = window.innerHeight - 48;

      setSize({
        width: Math.min(newWidth, maxWidth),
        height: Math.min(newHeight, maxHeight),
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'nwse-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleSend = async (messageToSend?: string) => {
    const message = messageToSend || input.trim();
    if (!message || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMessage]);

      const stream = aiChatApi.streamChat(message, context, messages);
      let fullContent = '';

      for await (const chunk of stream) {
        fullContent += chunk;
        const currentContent = fullContent;
        setMessages(prev => {
          const newMessages = prev.slice(0, -1);
          return [...newMessages, { role: 'assistant', content: currentContent }];
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: 'Sorry, ai chat failed. Please try again later.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      setSize({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
    } else {
      setSize({
        width: Math.min(800, window.innerWidth - 48),
        height: window.innerHeight - 48,
      });
    }
    setIsMaximized(!isMaximized);
  };

  const panelStyle = isMaximized
    ? { width: size.width, height: size.height }
    : { width: size.width, height: size.height };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl',
          isOpen && 'scale-0 opacity-0'
        )}
      >
        <IconMessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-black">
          AI
        </span>
      </button>

      {/* Chat Panel */}
      <div
        ref={panelRef}
        style={isOpen ? panelStyle : undefined}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl border bg-background shadow-2xl transition-all',
          isOpen ? 'scale-100 opacity-100' : 'h-0 w-0 scale-95 opacity-0 pointer-events-none',
          isResizing ? 'transition-none' : 'duration-300'
        )}
      >
        {/* Resize Handle - Top Left Corner */}
        <div
          className="absolute -top-1 -left-1 w-4 h-4 cursor-nwse-resize z-10 group"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
              <IconSparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">AI Parking Assistant</h3>
              {/* <p className="text-xs text-muted-foreground">Powered by Ollama</p> */}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleMaximize}
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? (
                <IconArrowsMinimize className="h-4 w-4" />
              ) : (
                <IconArrowsMaximize className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
                <IconRobot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">How can I help you today?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ask me about dynamic pricing strategies
                </p>
              </div>
              {/* Suggested Prompts */}
              <div className="space-y-2 w-full px-2">
                {SUGGESTED_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    className="w-full text-left text-sm p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <IconRobot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3 py-2 overflow-hidden',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-2 prose-pre:my-2 prose-pre:bg-background/50 prose-pre:overflow-x-auto prose-code:text-primary prose-code:before:content-none prose-code:after:content-none break-words">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    )}
                    {message.role === 'assistant' && message.content === '' && isLoading && (
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <IconUser className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-3 shrink-0">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask about pricing..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[44px] max-h-[120px] resize-none rounded-xl text-sm"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="h-[44px] w-[44px] rounded-xl shrink-0"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                <IconSend className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
