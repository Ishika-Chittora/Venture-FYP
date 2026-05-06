import { motion } from 'framer-motion';

const shapes = [
  { type: 'sphere', size: 80, x: '10%', y: '20%', delay: 0, duration: 20, color: 'hsl(250 80% 65% / 0.08)' },
  { type: 'sphere', size: 120, x: '80%', y: '15%', delay: 2, duration: 25, color: 'hsl(187 92% 45% / 0.06)' },
  { type: 'triangle', size: 60, x: '70%', y: '60%', delay: 1, duration: 22, color: 'hsl(280 70% 55% / 0.07)' },
  { type: 'sphere', size: 50, x: '25%', y: '70%', delay: 3, duration: 18, color: 'hsl(152 76% 36% / 0.06)' },
  { type: 'triangle', size: 90, x: '50%', y: '40%', delay: 4, duration: 24, color: 'hsl(220 80% 60% / 0.05)' },
  { type: 'sphere', size: 40, x: '90%', y: '80%', delay: 1.5, duration: 19, color: 'hsl(330 70% 55% / 0.06)' },
];

export function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: shape.x, top: shape.y }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 20, 0],
            rotate: shape.type === 'triangle' ? [0, 180, 360] : undefined,
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        >
          {shape.type === 'sphere' ? (
            <div
              className="rounded-full"
              style={{
                width: shape.size,
                height: shape.size,
                background: `radial-gradient(circle at 30% 30%, ${shape.color}, transparent 70%)`,
                filter: 'blur(1px)',
              }}
            />
          ) : (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid`,
                borderBottomColor: shape.color.replace(')', '').replace('hsl(', 'hsla(').replace('/ ', ',').concat(')'),
                filter: 'blur(2px)',
                opacity: 0.6,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
