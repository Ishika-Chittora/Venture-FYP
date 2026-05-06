import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, BarChart3, Shield, TrendingUp, ArrowRight, Sparkles, Target, Brain } from 'lucide-react';
import { FloatingShapes } from '@/components/FloatingShapes';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const steps = [
  {
    icon: Target,
    title: 'Describe Your Startup',
    description: 'Enter your idea, industry, burn rate, and team size in a simple form.',
    color: 'from-rose-400 to-pink-500',
  },
  {
    icon: Brain,
    title: 'AI Analyzes Everything',
    description: 'Our Gemini-powered engine evaluates feasibility, competitors, financials & SWOT.',
    color: 'from-primary to-accent',
  },
  {
    icon: BarChart3,
    title: 'Get Your Risk Report',
    description: 'Receive a comprehensive dashboard with scores, charts, and a 30-day action plan.',
    color: 'from-amber-400 to-orange-500',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic mesh gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[140px] animate-mesh-1"
          style={{ background: 'radial-gradient(circle, hsl(250 80% 60% / 0.15), transparent 70%)' }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] animate-mesh-2"
          style={{ background: 'radial-gradient(circle, hsl(187 92% 45% / 0.12), transparent 70%)' }} />
        <div className="absolute top-[30%] left-[50%] w-[500px] h-[500px] rounded-full blur-[120px] animate-mesh-3"
          style={{ background: 'radial-gradient(circle, hsl(280 70% 50% / 0.1), transparent 70%)' }} />
        <div className="absolute top-[60%] left-[20%] w-[400px] h-[400px] rounded-full blur-[100px] animate-mesh-1"
          style={{ background: 'radial-gradient(circle, hsl(152 76% 36% / 0.08), transparent 70%)', animationDelay: '3s' }} />
      </div>

      {/* Floating shapes */}
      <FloatingShapes />

      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px',
      }} />

      {/* Sticky Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-border/20"
        style={{
          background: 'rgba(2, 6, 23, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold gradient-text">VentureIQ</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition shadow-lg shadow-primary/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-4 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-6"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Startup Intelligence
          </div>

          {/* Hero card with strong glassmorphism */}
          <div className="max-w-3xl mx-auto rounded-3xl p-10 sm:p-14 relative"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              <span className="text-foreground">Know Your Startup's</span>
              <br />
              <span className="gradient-text">Risk Before You Launch</span>
            </h1>

            <p className="max-w-xl mx-auto text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed">
              VentureIQ uses advanced AI to evaluate your startup idea across{' '}
              <span className="text-foreground font-medium">feasibility, financials, competitors</span>{' '}
              and market sentiment — delivering a full risk report in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth"
                className="group px-8 py-3.5 rounded-2xl font-semibold text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-primary/25"
              >
                Start Evaluating
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-3.5 rounded-2xl font-semibold text-sm text-foreground hover:bg-white/5 transition"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                See How It Works
              </a>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-20 grid grid-cols-3 gap-4 max-w-lg mx-auto"
        >
          {[
            { value: '5-Axis', label: 'Feasibility Scoring' },
            { value: '24-Mo', label: 'Financial Projections' },
            { value: '<15s', label: 'Full Analysis' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl sm:text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative max-w-5xl mx-auto px-4 py-20">
        <motion.h2
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-center mb-4"
        >
          How It <span className="gradient-text">Works</span>
        </motion.h2>
        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-sm text-muted-foreground text-center max-w-md mx-auto mb-14"
        >
          Three simple steps to a comprehensive startup risk assessment.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              custom={i + 2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl p-6 text-center group glass-card"
            >
              <div className={`inline-flex h-12 w-12 rounded-xl bg-gradient-to-br ${step.color} items-center justify-center mb-4`}>
                <step.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs font-mono text-muted-foreground mb-2">Step {i + 1}</div>
              <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <motion.h2
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-center mb-12"
        >
          Everything You Need to{' '}
          <span className="gradient-text">De-Risk</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { icon: Shield, title: 'SWOT Analysis', desc: 'Strengths, weaknesses, opportunities & threats with impact scoring.' },
            { icon: TrendingUp, title: 'Financial Projections', desc: '24-month P&L forecasting with break-even analysis.' },
            { icon: BarChart3, title: 'Competitor Intelligence', desc: 'AI-identified competitors with threat levels & competitive edges.' },
            { icon: Sparkles, title: '30-Day Action Plan', desc: 'Week-by-week execution roadmap from foundation to growth.' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-5 flex gap-4 items-start"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to <span className="gradient-text">Validate Your Idea?</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
              Join founders who use AI-powered risk analysis to make smarter decisions.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition shadow-lg shadow-primary/25"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold gradient-text">VentureIQ</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 VentureIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
