'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  RefreshCw,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react';
import { useChat } from '@/hooks/use-chat';
import { TripPlanCard } from './trip-plan-card';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';

const suggestedPrompts = [
  'Quiero un viaje de 3 días con mi familia',
  'Busco aventura y senderismo',
  'Necesito relajarme en termales',
  'Me interesa la cultura del café',
];

export function ChatInterface() {
  const { messages, isLoading, sendMessage, clearChat, currentPlan } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestedPrompt = async (prompt: string) => {
    await sendMessage(prompt);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Chat Panel */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Asistente de Viaje</h2>
              <p className="text-xs text-muted-foreground">
                Potenciado por IA para Caldas
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearChat}
            disabled={messages.length === 0}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Nueva conversación
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <WelcomeMessage onPromptClick={handleSuggestedPrompt} />
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-secondary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Pensando...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe tu viaje ideal..."
              className="min-h-[52px] max-h-32 resize-none"
              rows={1}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-[52px] w-[52px] bg-primary hover:bg-primary/90"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
              <span className="sr-only">Enviar mensaje</span>
            </Button>
          </form>
        </div>
      </Card>

      {/* Trip Plan Sidebar */}
      {currentPlan && (
        <div className="w-96 hidden lg:block">
          <TripPlanCard plan={currentPlan} />
        </div>
      )}
    </div>
  );
}

interface WelcomeMessageProps {
  onPromptClick: (prompt: string) => void;
}

function WelcomeMessage({ onPromptClick }: WelcomeMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Planifica tu Viaje con IA
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md">
        Cuéntame sobre el viaje que tienes en mente y te ayudaré a crear 
        el itinerario perfecto para explorar Caldas.
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {suggestedPrompts.map((prompt) => (
          <Button
            key={prompt}
            variant="outline"
            className="h-auto py-3 px-4 text-left justify-start text-sm"
            onClick={() => onPromptClick(prompt)}
          >
            <Sparkles className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
            <span className="line-clamp-2">{prompt}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={cn(
          isUser ? 'bg-secondary' : 'bg-primary text-primary-foreground'
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        'max-w-[80%] px-4 py-3 rounded-2xl',
        isUser 
          ? 'bg-primary text-primary-foreground rounded-br-md' 
          : 'bg-secondary rounded-bl-md'
      )}>
        <div className={cn(
          'text-sm whitespace-pre-wrap prose prose-sm',
          isUser ? 'prose-invert' : ''
        )}>
          {message.content.split('\n').map((line, i) => {
            // Handle bold text
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>
                {parts.map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j}>{part.slice(2, -2)}</strong>;
                  }
                  return part;
                })}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
