import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, SendHorizonal, AlertTriangle } from 'lucide-react';
import { getChatbotResponse, GeminiServiceError } from '@/lib/geminiService'; // ChatHistoryMessage removed
// import { useToast } from '@/hooks/use-toast'; // Using sonner directly
import { toast as sonnerToast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMutation } from '@tanstack/react-query';


interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const SEOChatbot: React.FC = () => {
  const { language } = useLanguage(); // Consume global language context
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  // const [isLoading, setIsLoading] = useState(false); // Replaced by mutation.isPending
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  // const { toast } = useToast(); // Replaced by sonnerToast

  // System instruction is not currently passed to backend with new geminiService
  // const getSystemInstruction = (): string => {
    if (language === 'th') {
      return "You are an expert SEO assistant. Please respond in Thai. Provide helpful, concise, and accurate advice on SEO topics. If you don't know an answer, say so. Keep responses relatively short and easy to read in a chat interface.";
    }
    return "You are an expert SEO assistant. Provide helpful, concise, and accurate advice on SEO topics. If you don't know an answer, say so. Keep responses relatively short and easy to read in a chat interface.";
  };

  // const formatChatHistory = (msgs: Message[]): ChatHistoryMessage[] => { ... } // History not sent

  const chatMutation = useMutation<
    string, // Expecting string response (bot's message)
    GeminiServiceError,
    string // User input string
  >({
    mutationFn: async (userMessage) => {
      // The refactored getChatbotResponse only takes userPrompt.
      // History and system instructions are not passed with current backend.
      return getChatbotResponse(userMessage);
    },
    onSuccess: (botResponseText) => {
      const newBotMessage: Message = {
        id: Date.now().toString() + '-bot',
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      sonnerToast.success("Response received!");
    },
    onError: (error: GeminiServiceError) => {
      console.error("Error getting chatbot response:", error);
      let errorText = "Sorry, I encountered an error. Please try again.";
      if (error.isApiKeyInvalid) {
        errorText = "API Key is invalid or missing. Please configure it in Settings.";
        setApiKeyError(errorText); // Show persistent error in UI
      } else if (error.message) {
        errorText = error.message;
      }
      const errorBotMessage: Message = {
        id: Date.now().toString() + '-bot-error',
        sender: 'bot',
        text: errorText,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorBotMessage]);
      sonnerToast.error("Chatbot Error", { description: errorText });
    },
  });

  const handleSendMessage = useCallback(() => {
    if (userInput.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now().toString() + '-user',
      sender: 'user',
      text: userInput,
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    // Call mutation
    chatMutation.mutate(userInput);

    setUserInput('');
    setApiKeyError(null); // Clear previous API key errors
  }, [userInput, chatMutation]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !chatMutation.isPending) {
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Auto-scroll to the bottom
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl flex flex-col h-[70vh] min-h-[400px]">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-6 w-6 text-blue-600" />
          SEO Assistant Chatbot
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  message.sender === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex items-end gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="max-w-[70%] p-3 rounded-lg shadow bg-slate-100 text-slate-800 rounded-bl-none">
                  <p className="text-sm flex items-center">
                    <span className="animate-pulse">Typing</span>
                    <span className="animate-pulse delay-150">.</span>
                    <span className="animate-pulse delay-300">.</span>
                    <span className="animate-pulse delay-450">.</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full items-center gap-2">
          <Input
            type="text"
            placeholder="Ask about SEO..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={chatMutation.isPending} // Use mutation's pending state
            className="flex-grow"
          />
          <Button onClick={handleSendMessage} disabled={chatMutation.isPending || userInput.trim() === ''}>
            <SendHorizonal className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        {apiKeyError && (
            <div className="mt-2 p-2 text-xs bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {apiKeyError}
            </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SEOChatbot;
