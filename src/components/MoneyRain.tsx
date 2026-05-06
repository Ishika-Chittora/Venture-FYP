import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';

interface RainItem {
  id: number;
  left: number;
  delay: number;
  duration: number;
  emoji: string;
  scale: number;
  drift: number;
}

interface Props {
  show: boolean;
  onComplete?: () => void;
}

const createRainItems = (): RainItem[] =>
  Array.from({ length: 14 }, (_, index) => {
    const isCoin = index % 3 === 0;
    return {
      id: index,
      left: Math.random() * 92,
      delay: Math.random() * 0.8,
      duration: 2.5 + Math.random() * 0.8,
      emoji: isCoin ? '🪙' : '💵',
      scale: 0.9 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 120,
    };
  });

export function MoneyRain({ show, onComplete }: Props) {
  const items = useMemo(createRainItems, []);

  useEffect(() => {
    if (!show) return;
    const timeout = window.setTimeout(() => onComplete?.(), 3400);
    return () => window.clearTimeout(timeout);
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show ? (
        <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
          {items.map((item) => (
            <motion.span
              key={item.id}
              className="absolute text-3xl"
              style={{ left: `${item.left}%`, top: '-5rem', scale: item.scale }}
              initial={{ opacity: 0, y: -80, x: 0, rotate: 0 }}
              animate={{ opacity: [1, 1, 0], y: ['-5rem', '110vh'], x: [0, item.drift], rotate: [0, 20, -20] }}
              transition={{ duration: item.duration, delay: item.delay, ease: 'easeInOut' }}
            >
              {item.emoji}
            </motion.span>
          ))}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-emerald-100/30 via-transparent to-transparent" />
        </div>
      ) : null}
    </AnimatePresence>
  );
}
