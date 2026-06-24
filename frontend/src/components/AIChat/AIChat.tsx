import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface AIChatProps {
  context?: {
    source?: string;
    destination?: string;
    distance?: number;
  };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { label: 'Best places?', icon: '🏛️', question: 'What are the best places to visit along this route?' },
  { label: 'Weather safe?', icon: '🌤️', question: 'Is the weather safe for travel on my selected dates?' },
  { label: 'Cheapest option?', icon: '💰', question: 'What is the cheapest way to travel between these cities?' },
  { label: 'Where to stay?', icon: '🏨', question: 'Where should I stay along the route? Recommend hotels.' },
  { label: 'Food recommendations?', icon: '🍽️', question: 'What food and restaurants should I try on this trip?' },
  { label: 'Trip duration?', icon: '⏱️', question: 'How long will the trip take and how should I plan my time?' },
];

export default function AIChat({ context }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: context?.source && context?.destination
        ? `Hello! I'm your AI travel assistant for your trip from ${context.source} to ${context.destination} (${context.distance || '~'} km). Ask me anything about attractions, weather, costs, hotels, or restaurants!`
        : 'Hello! I\'m your AI travel assistant. Please search for a route first, then I can help you with specific travel information!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: message.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await aiAPI.chat(message, context);
      const assistantMsg: Message = { role: 'assistant', content: res.response || 'I apologize, I could not process that request.', timestamp: new Date() };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallback: Message = {
        role: 'assistant',
        content: 'I apologize, but I seem to be having trouble connecting. Here are some tips:\n- Check the Attractions tab for places to visit\n- Check the Weather tab for forecasts\n- Check the Costs tab for fare comparisons\n- Check Hotels and Restaurants tabs for accommodations and dining',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallback]);
      toast.error('AI service unavailable. Showing offline tips.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (question: string) => {
    handleSend(question);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[600px]"
    >
      <div className="glass-card flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-blue-100/50 dark:to-blue-800/20">
          <h2 className="section-title mb-1">🤖 AI Travel Assistant</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ask me anything about your trip</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex overflow-x-auto gap-2 pb-2">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(action.question)}
                disabled={loading}
                className="flex-shrink-0 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl text-xs text-gray-600 dark:text-gray-300 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about places, weather, costs..."
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-primary !px-4 !py-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
