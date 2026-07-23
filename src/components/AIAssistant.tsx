import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CornerDownLeft,
  User,
  Activity,
  X,
  HelpCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { ChatMessage, Medicine } from '../types';

interface AIAssistantProps {
  currentMedicineContext: Medicine | null;
  onClearMedicineContext: () => void;
}

export default function AIAssistant({ 
  currentMedicineContext, 
  onClearMedicineContext 
}: AIAssistantProps) {
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: "👋 Hello! I am your **MediStock AI Pharmacy Assistant**.\n\nI am specifically trained to help you with pharmaceutical and medical store tasks. Feel free to ask me questions like:\n- 🧪 **Explain a medicine's mechanism** of action.\n- 📦 Suggest **proper medicine storage** configurations.\n- 📋 Provide **patient counselling points** (when to take, interactions).\n- ⚠️ Summarize **common side effects**.\n- 💊 Translate **complex dosage instructions** into plain, simple language for patients.\n\n*How can I help you in the pharmacy today?*",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: "msg-" + Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentMedicineContext: currentMedicineContext
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const detail = errData?.details || errData?.error || "Server returned non-200 status.";
        throw new Error(detail);
      }

      const reply = await response.json();
      
      const modelMsg: ChatMessage = {
        id: "msg-" + Math.random().toString(36).substr(2, 9),
        role: 'model',
        content: reply.content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, modelMsg]);

    } catch (err: any) {
      console.error("AI Assistant error:", err);
      const errorMsg: ChatMessage = {
        id: "msg-err-" + Math.random().toString(36).substr(2, 9),
        role: 'model',
        content: `⚠️ **AI Assistant Connection Issue:** ${err.message || 'Unable to communicate with the server.'}\n\nPlease verify that your \`GEMINI_API_KEY\` is correctly set in **Settings > Secrets** in AI Studio.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Clickable suggested prompt bubbles
  const quickPrompts = [
    {
      label: "Explain Amoxicillin",
      prompt: "Can you explain what Amoxicillin is, its chemical class, what it is prescribed for, and generic alternatives?"
    },
    {
      label: "Dosage instructions simple",
      prompt: "Explain how to take a prescribed course of Metformin 850mg in extremely simple, patient-friendly counselling points."
    },
    {
      label: "Proper Metformin storage",
      prompt: "What are the recommended pharmaceutical storage conditions for Metformin Hydrochloride tablets?"
    },
    {
      label: "Lisinopril side effects",
      prompt: "What are the key side effects of Lisinopril and the critical precautions a patient must take?"
    }
  ];

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[460px] flex flex-col justify-between bg-white border border-slate-200 custom-shadow rounded-2xl overflow-hidden animate-in fade-in duration-300">
      
      {/* Assistant Header */}
      <header className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
            <Bot size={22} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1">
              MediStock Pharmacist AI
              <Sparkles size={14} className="text-emerald-500 fill-current" />
            </h3>
            <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Secure Clinical Knowledge Engine
            </p>
          </div>
        </div>

        {/* Dynamic Context badge */}
        {currentMedicineContext && (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-bold">
            <span>Focus Drug: {currentMedicineContext.name}</span>
            <button 
              onClick={onClearMedicineContext}
              className="hover:text-red-600 cursor-pointer"
              title="Clear focus drug context"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 max-w-[85%] ${
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar block */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.role === 'user' 
                ? "bg-slate-800 text-white" 
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Content speech bubble */}
            <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 shadow-xs border ${
              msg.role === 'user'
                ? "bg-slate-800 text-white border-slate-800 rounded-tr-none"
                : "bg-white text-slate-700 border-slate-100 rounded-tl-none"
            }`}>
              <div className="whitespace-pre-wrap">
                {msg.content.split('\n').map((line, i) => {
                  // Basic markdown list parsing
                  if (line.trim().startsWith('-') || line.trim().startsWith('* ')) {
                    return <li key={i} className="ml-3 list-disc mt-1">{line.replace(/^[\s-*]+/, '')}</li>;
                  }
                  
                  // Basic Bold formatting parsing
                  let parsedLine = line;
                  const boldRegex = /\*\*(.*?)\*\*/g;
                  let match;
                  const parts = [];
                  let lastIndex = 0;
                  
                  while ((match = boldRegex.exec(line)) !== null) {
                    if (match.index > lastIndex) {
                      parts.push(line.substring(lastIndex, match.index));
                    }
                    parts.push(<strong key={match.index} className="font-bold">{match[1]}</strong>);
                    lastIndex = boldRegex.lastIndex;
                  }
                  if (lastIndex < line.length) {
                    parts.push(line.substring(lastIndex));
                  }

                  return (
                    <p key={i} className="mt-1">
                      {parts.length > 0 ? parts : line}
                    </p>
                  );
                })}
              </div>
              <p className={`text-[9px] text-right block mt-1 ${
                msg.role === 'user' ? "text-white/60" : "text-slate-400"
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 text-slate-600 border border-slate-200">
              <Bot size={16} />
            </div>
            <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts footer bar */}
      {messages.length <= 2 && (
        <div className="p-3 border-t border-slate-100 flex flex-wrap gap-2 bg-slate-50">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 font-bold text-[10px] rounded-xl transition-all cursor-pointer shadow-xs"
            >
              {qp.label}
            </button>
          ))}
        </div>
      )}

      {/* Input controls panel */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              currentMedicineContext 
                ? `Ask me about ${currentMedicineContext.name} (e.g. storage, side effects)...` 
                : "Ask your medical or pharmaceutical query..."
            }
            className="flex-grow pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-emerald-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  );
}
