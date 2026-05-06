import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, ArrowLeft, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Question {
  question: string;
  options: { label: string; type: string }[];
}

const questions: Question[] = [
  {
    question: 'How do you approach solving a complex problem?',
    options: [
      { label: 'I brainstorm 10 wild ideas and pick the boldest', type: 'visionary' },
      { label: 'I break it into steps and execute systematically', type: 'operator' },
      { label: 'I research what others have done and improve on it', type: 'analyst' },
      { label: 'I gather a team and delegate immediately', type: 'leader' },
    ],
  },
  {
    question: 'What drives you the most in a startup?',
    options: [
      { label: 'Changing the world with a breakthrough idea', type: 'visionary' },
      { label: 'Building a profitable, efficient machine', type: 'operator' },
      { label: 'Understanding data and finding hidden patterns', type: 'analyst' },
      { label: 'Inspiring and growing an incredible team', type: 'leader' },
    ],
  },
  {
    question: 'Your MVP just failed its first user test. What do you do?',
    options: [
      { label: 'Pivot to an entirely new concept', type: 'visionary' },
      { label: 'Fix the bugs, optimize, and retest tomorrow', type: 'operator' },
      { label: 'Deep-dive into the analytics to find why it failed', type: 'analyst' },
      { label: 'Talk to users personally and rally the team', type: 'leader' },
    ],
  },
  {
    question: 'What\'s your ideal Saturday?',
    options: [
      { label: 'Sketching product concepts on a whiteboard', type: 'visionary' },
      { label: 'Organizing my workspace and clearing my to-do list', type: 'operator' },
      { label: 'Reading research papers or market reports', type: 'analyst' },
      { label: 'Networking at a founder event', type: 'leader' },
    ],
  },
  {
    question: 'Which risk are you most comfortable taking?',
    options: [
      { label: 'Betting everything on an unproven market', type: 'visionary' },
      { label: 'Scaling aggressively before profitability', type: 'operator' },
      { label: 'Making a data-driven bet against popular opinion', type: 'analyst' },
      { label: 'Hiring senior people before you can really afford them', type: 'leader' },
    ],
  },
];

const founderTypes: Record<string, { title: string; emoji: string; description: string; strengths: string[]; color: string }> = {
  visionary: {
    title: 'The Visionary',
    emoji: '🚀',
    description: 'You see the future before anyone else. Your strength is imagining what could be and inspiring others to believe in it.',
    strengths: ['Big-picture thinking', 'Creative problem-solving', 'Pitching & fundraising', 'Product innovation'],
    color: 'from-violet-500 to-purple-600',
  },
  operator: {
    title: 'The Operator',
    emoji: '⚙️',
    description: 'You turn chaos into systems. Your superpower is building processes that scale and making things work reliably.',
    strengths: ['Process optimization', 'Cost management', 'Execution speed', 'Quality control'],
    color: 'from-primary to-accent',
  },
  analyst: {
    title: 'The Analyst',
    emoji: '📊',
    description: 'You let data guide every decision. Your edge is finding insights others miss and making calculated, winning bets.',
    strengths: ['Data-driven decisions', 'Risk assessment', 'Market research', 'Financial modeling'],
    color: 'from-blue-500 to-cyan-500',
  },
  leader: {
    title: 'The Leader',
    emoji: '👑',
    description: 'You build legendary teams. Your ability to attract, inspire, and retain talent is your greatest competitive advantage.',
    strengths: ['Team building', 'Culture creation', 'Stakeholder management', 'Strategic partnerships'],
    color: 'from-amber-500 to-orange-500',
  },
};

export default function FounderQuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleSelect = (type: string) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate result
      const counts: Record<string, number> = {};
      newAnswers.forEach((a) => { counts[a] = (counts[a] || 0) + 1; });
      const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      setResult(winner);
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  const progress = ((result ? questions.length : currentQ) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Founder DNA Quiz
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Discover your founder archetype in 5 questions.
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-muted/50 mb-8 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <p className="text-xs text-muted-foreground mb-2">
              Question {currentQ + 1} of {questions.length}
            </p>
            <h3 className="text-lg font-semibold text-foreground mb-6">
              {questions[currentQ].question}
            </h3>

            <div className="space-y-3">
              {questions[currentQ].options.map((opt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => handleSelect(opt.type)}
                  className="w-full text-left px-4 py-3.5 rounded-xl text-sm text-foreground glass glass-hover flex items-center gap-3 group"
                >
                  <span className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 group-hover:bg-primary/20 transition">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.label}
                </motion.button>
              ))}
            </div>

            {currentQ > 0 && (
              <button
                onClick={handleBack}
                className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Previous
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <div className="text-5xl mb-4">{founderTypes[result].emoji}</div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${founderTypes[result].color} text-white mb-3`}>
              Your Archetype
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {founderTypes[result].title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              {founderTypes[result].description}
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-8">
              {founderTypes[result].strengths.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass rounded-lg px-3 py-2 text-xs text-foreground flex items-center gap-2"
                >
                  <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />
                  {s}
                </motion.div>
              ))}
            </div>

            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw className="h-3.5 w-3.5" />
              Retake Quiz
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
