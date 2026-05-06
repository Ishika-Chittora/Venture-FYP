import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  recommendations: string[];
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function Recommendations({ recommendations }: Props) {
  if (!recommendations) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Recommendations</h3>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
        {recommendations.map((r, i) => (
          <motion.div key={i} variants={item} className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ArrowRight className="h-3 w-3 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{r}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
