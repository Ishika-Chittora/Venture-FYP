import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { EvaluationResult, IdeaInput } from '@/types/evaluation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  result: EvaluationResult;
  input: IdeaInput;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function AIChatDrawer({ result, input }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    const userMsg = query.trim();
    setQuery('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const contextPrompt = `You are VentureIQ's AI analyst. You have just completed a risk evaluation for "${input.name}". Here is the evaluation context:
- Overall Score: ${result.overallScore}/100 (${result.riskLevel} Risk)
- Feasibility: Market ${result.feasibility.market}, Technical ${result.feasibility.technical}, Financial ${result.feasibility.financial}, Team ${result.feasibility.team}, Timing ${result.feasibility.timing}
- Burn Rate: $${result.burnRate}/mo, CAC/LTV: ${result.cacLtvRatio}x, Break-even: Month ${result.breakEvenMonth}
- Market Sentiment: ${(result.marketSentiment * 100).toFixed(0)}%
- Summary: ${result.summary}
- Competitors: ${result.competitors.map(c => `${c.name} (${c.threat} threat)`).join(', ')}
- Key Strengths: ${result.swot.strengths.map(s => s.text).join('; ')}
- Key Weaknesses: ${result.swot.weaknesses.map(w => w.text).join('; ')}

Answer the user's question concisely and specifically based on this data. Use bullet points for clarity. Be direct and actionable.`;

      const allMessages = [
        { role: 'system', content: contextPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMsg },
      ];

      const response = await fetch(`${SUPABASE_URL}/functions/v1/evaluate-startup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'x-chat-mode': 'true',
        },
        body: JSON.stringify({ messages: allMessages, chatMode: true }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'I couldn\'t generate a response.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Why is my technical risk high?',
    'How can I reduce burn rate?',
    'What\'s my strongest competitive advantage?',
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary shadow-xl"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md glass border-l border-border/30 flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Ask the Analyst</h3>
                </div>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Ask anything about your evaluation for <span className="font-semibold text-foreground">{input.name}</span>.</p>
                    <div className="space-y-2">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setQuery(s); }}
                          className="block w-full text-left px-3 py-2 rounded-lg bg-muted/30 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : ''}`}>
                    {m.role === 'assistant' && (
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/40 text-foreground'
                    }`}>
                      {m.role === 'assistant' ? (
                        <div className="prose prose-sm prose-invert max-w-none">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : m.content}
                    </div>
                    {m.role === 'user' && (
                      <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="rounded-xl px-3.5 py-2.5 bg-muted/40">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>

              <div className="px-5 py-4 border-t border-border/30">
                <div className="flex gap-2">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about your evaluation..."
                    className="flex-1 rounded-lg bg-muted/50 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!query.trim() || loading}
                    className="px-3 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
