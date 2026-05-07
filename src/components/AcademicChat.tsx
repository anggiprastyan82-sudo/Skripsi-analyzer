import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Loader2, BookOpen, MoreVertical } from 'lucide-react';
import { chatWithAI } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function AcademicChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Halo! Saya asisten AI akademik Anda. Ada bagian skripsi yang ingin saya bantu pertajam atau perbaiki strukturnya?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await chatWithAI(history, userMessage);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Maaf, saya tidak bisa memproses permintaan Anda.' }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Terjadi kesalahan koneksi. Silakan coba lagi.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <span className="font-bold text-sm text-slate-700">Tanya AI Dosen</span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      <ScrollArea className="flex-1 p-4 bg-white/50">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border", 
                msg.role === 'user' ? "bg-teal-600 border-teal-500 text-white font-bold text-[10px]" : "bg-slate-100 border-slate-200 text-[10px]")}>
                {msg.role === 'user' ? "M" : "🤖"}
              </div>
              <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-sm leading-relaxed", 
                msg.role === 'user' ? "bg-teal-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-700 rounded-tl-none")}>
                <div className="prose prose-sm max-w-none prose-slate">
                  <ReactMarkdown 
                    components={{
                       p: ({ children }) => <p className="mb-0 leading-relaxed font-medium">{children}</p>,
                       li: ({ children }) => <li className="mb-1">{children}</li>,
                       strong: ({ children }) => <strong className="font-black underline decoration-teal-400/30">{children}</strong>
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 border-slate-200 border flex items-center justify-center animate-pulse">
                <span className="text-[10px]">🤖</span>
              </div>
              <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">AI sedang mengetik...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative group">
          <Input 
            placeholder="Ketik pertanyaan akademik..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="w-full bg-slate-50 border-slate-200 rounded-xl py-5 pl-4 pr-12 text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()} 
            className="absolute right-2 top-1.5 p-2 bg-teal-600 text-white rounded-lg shadow-sm shadow-teal-200 hover:bg-teal-700 disabled:opacity-50 disabled:shadow-none transition-all active:scale-90"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
