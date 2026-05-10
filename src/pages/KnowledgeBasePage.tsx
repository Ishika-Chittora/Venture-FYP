import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const articles = [
  {
    title: 'How to Calculate Burn Rate',
    category: 'Finance',
    description: 'Understand how fast your startup is spending money and how to optimize it.',
    content: `## What is Burn Rate?

Burn rate is how much cash your startup spends every month. It's one of the most critical metrics for any early-stage company.

## Two Types of Burn Rate

**Gross Burn Rate**
Total monthly expenses — salaries, rent, software, marketing, everything.

> Gross Burn = Total Monthly Expenses

**Net Burn Rate**
How much cash you're actually losing after revenue.

> Net Burn = Monthly Expenses − Monthly Revenue

## How to Calculate Runway

Runway tells you how many months until you run out of money.

> Runway (months) = Cash in Bank ÷ Net Burn Rate

**Example:** $500,000 in bank ÷ $50,000/mo net burn = **10 months runway**

## Common Mistakes

- **Ignoring one-time costs** — a big server bill or legal fee can distort your monthly burn
- **Using gross instead of net** — if you have revenue, net burn is the number that matters
- **Not updating it monthly** — burn rate changes as you hire and grow

## How to Reduce Burn Rate

- Delay non-critical hires
- Negotiate annual SaaS contracts (usually 20–40% cheaper)
- Move to remote to cut office rent
- Use AWS/GCP credits available for startups
- Cut paid marketing until product-market fit is confirmed

## Healthy Benchmarks

| Stage | Typical Monthly Burn |
|---|---|
| Pre-seed | $10K – $30K |
| Seed | $30K – $100K |
| Series A | $100K – $500K |

Keep at least **12–18 months of runway** at all times before raising again.`,
  },
  {
    title: 'TAM, SAM, SOM Explained',
    category: 'Market',
    description: 'Break down your total addressable market to find realistic revenue targets.',
    content: `## Why Market Sizing Matters

Investors ask about TAM, SAM, and SOM to understand if your business can become large enough to justify venture investment. Getting this right shows you understand your market deeply.

## The Three Layers

### TAM — Total Addressable Market
The total global demand for your product if you had 100% market share.

> Example: The global food delivery market = $500B TAM

### SAM — Serviceable Addressable Market
The portion of TAM you can realistically target given your product, geography, and business model.

> Example: Food delivery in Tier-1 Indian cities = $8B SAM

### SOM — Serviceable Obtainable Market
What you can realistically capture in the next 3–5 years.

> Example: 2% of SAM in Year 3 = $160M SOM

## How to Calculate Each

**Top-Down (use industry reports):**
Start with total market size, narrow by your segment.

**Bottom-Up (more credible):**
- Number of potential customers × average revenue per customer
- Example: 50,000 restaurants × $200/mo = $120M/yr SAM

## Common Mistakes

- **TAM too broad** — "We're targeting the $10T global retail market" tells investors nothing
- **No source cited** — always reference reports (Statista, IBISWorld, CB Insights)
- **SOM too optimistic** — 10% market share in Year 1 is not realistic

## What Investors Want to See

- TAM large enough to build a $100M+ business
- SAM that shows you understand your real addressable segment
- SOM with a clear go-to-market strategy to back it up`,
  },
  {
    title: 'Crafting a Competitive Moat',
    category: 'Strategy',
    description: 'Learn how to build sustainable competitive advantages early on.',
    content: `## What is a Competitive Moat?

A moat is a durable advantage that makes it hard for competitors to take your customers. Warren Buffett coined the term — businesses with wide moats maintain profits longer.

## The 5 Types of Moats

### 1. Network Effects
Your product becomes more valuable as more people use it.
- **Examples:** WhatsApp, LinkedIn, Uber
- Hard to replicate once established
- Best moat for marketplace and social products

### 2. Switching Costs
Customers lose too much by leaving your product.
- **Examples:** Salesforce, Slack, AWS
- Data migration, retraining, integrations make leaving painful
- Build deep integrations and workflows early

### 3. Cost Advantages
You can deliver the same product cheaper than anyone else.
- **Examples:** Walmart, Costco, Xiaomi
- Comes from scale, proprietary processes, or geography

### 4. Intangible Assets
Brand, patents, licenses, or proprietary data.
- **Examples:** Apple (brand), Pharma companies (patents)
- Data moats are emerging — unique datasets AI competitors can't replicate

### 5. Efficient Scale
You serve a market just large enough that competition isn't worth entering.
- Works well in specialized industries and niche B2B SaaS

## How to Build Your Moat Early

- **Day 1:** Focus on one moat type that fits your business model
- **0–100 users:** Collect proprietary data your competitors don't have
- **100–1000 users:** Build features that create switching costs
- **1000+ users:** Lean into network effects or brand building

## Questions to Ask Yourself

- Why can't a well-funded competitor copy this in 6 months?
- What do we have that gets harder to replicate as we grow?
- Would our customers notice or care if we were replaced tomorrow?`,
  },
  {
    title: 'Reading Your SWOT Analysis',
    category: 'Analysis',
    description: 'How to interpret strengths, weaknesses, opportunities and threats effectively.',
    content: `## What is a SWOT Analysis?

SWOT stands for **Strengths, Weaknesses, Opportunities, Threats**. It's a structured way to evaluate your startup's position and build strategy around it.

## Breaking Down Each Quadrant

### Strengths (Internal, Positive)
What you do better than anyone else right now.
- Unique technology or IP
- Strong founding team with domain expertise
- Early traction or partnerships
- **Action:** Double down on these. Build your go-to-market around your strengths.

### Weaknesses (Internal, Negative)
Honest gaps inside your organization.
- Limited runway or cash
- Missing key roles (no CTO, no sales lead)
- Unproven product with no PMF yet
- **Action:** Either fix critical weaknesses before scaling, or hire to fill gaps.

### Opportunities (External, Positive)
Market trends or gaps you can exploit.
- Regulatory changes favouring your model
- Competitors exiting the market
- **Action:** Prioritize opportunities that align with your strengths.

### Threats (External, Negative)
External risks that could hurt your business.
- Well-funded competitor entering your space
- Technology disruption making your model obsolete
- **Action:** Build contingency plans. Don't ignore High-impact threats.

## How to Use SWOT Strategically

| Combination | Strategy |
|---|---|
| Strength + Opportunity | Aggressive growth — go all in |
| Strength + Threat | Use strengths to defend against threats |
| Weakness + Opportunity | Fix weakness to capture opportunity |
| Weakness + Threat | Survival mode — reduce exposure |

## Common Mistakes

- Being too vague ("Our strength is our team")
- Listing too many items — focus on top 3 per quadrant
- Doing SWOT once and never revisiting it`,
  },
  {
    title: 'Unit Economics 101',
    category: 'Finance',
    description: 'CAC, LTV, and why they matter for your startup survival.',
    content: `## What Are Unit Economics?

Unit economics measure the revenue and costs associated with a single customer. They tell you whether your business model is fundamentally healthy — before you scale.

## The Core Metrics

### CAC — Customer Acquisition Cost
How much you spend to acquire one paying customer.

> CAC = Total Sales & Marketing Spend ÷ New Customers Acquired

**Example:** ₹2,00,000 spent in a month → 40 new customers = **₹5,000 CAC**

### LTV — Lifetime Value
Total revenue you expect from one customer over their lifetime.

> LTV = Average Revenue Per User × Average Customer Lifespan

**Example:** ₹1,000/mo × 18 months = **₹18,000 LTV**

### LTV:CAC Ratio

| Ratio | Meaning |
|---|---|
| < 1x | Losing money on every customer |
| 1–3x | Marginal — needs improvement |
| 3x+ | Healthy business model |
| 5x+ | Very strong — potential to scale |

### Payback Period
How many months to recover your CAC.

> Payback = CAC ÷ Monthly Revenue Per Customer

Aim for **under 12 months** at Seed stage.

### Churn Rate
% of customers who cancel each month.

Even 5% monthly churn means losing **46% of customers per year**.

## How to Improve Your Unit Economics

- **Reduce CAC:** Invest in organic (SEO, referrals, content) over paid ads
- **Increase LTV:** Add annual plans, upsells, and reduce churn with better onboarding
- **Improve margins:** Automate manual processes, renegotiate vendor contracts`,
  },
  {
    title: 'When to Pivot vs Persevere',
    category: 'Strategy',
    description: 'Data-driven frameworks for making the hardest startup decision.',
    content: `## The Hardest Decision in Startups

Almost every successful startup looked different at the start. Knowing when to change direction vs. when to push through is what separates great founders from the rest.

## Signs You Should Pivot

- **No growth despite effort:** You've tried 3+ acquisition channels and nothing moves
- **Customers use it differently than intended:** That's a signal for a new direction
- **High churn with no clear fix:** People try it and leave without actionable feedback
- **The market isn't there:** TAM is smaller than you thought
- **Competitors dominate and you have no differentiation**

## Signs You Should Persevere

- **You have a retention core:** A small group of users genuinely love the product
- **Clear feedback on what's missing:** Customers churn but tell you exactly what would keep them
- **Early traction in one segment:** It's not working broadly but one niche is responding
- **The problem is still real:** The market exists, your solution just needs refinement

## Types of Pivots

| Pivot Type | Description | Example |
|---|---|---|
| Zoom-in | One feature becomes the whole product | Slack (from game to messaging) |
| Zoom-out | Product becomes one feature of something bigger | Instagram (from check-in app to photos) |
| Customer segment | Same product, different audience | — |
| Business model | Same product, different pricing/delivery | — |
| Technology | Same problem, different tech approach | — |

## The Rule of Thumb

> If your **core problem hypothesis is still valid** but your solution isn't working — iterate. If the **problem hypothesis is wrong** — pivot.

Never pivot out of panic. Always pivot based on data and customer conversations.`,
  },
];

const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

const categoryColors: Record<string, string> = {
  Finance: 'bg-emerald-500/10 text-emerald-400',
  Market: 'bg-blue-500/10 text-blue-400',
  Strategy: 'bg-purple-500/10 text-purple-400',
  Analysis: 'bg-amber-500/10 text-amber-400',
};

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);

  const filtered = articles.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-1">
          <BookOpen className="h-5 w-5 text-primary" />
          Knowledge Base
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Curated resources to help you build and evaluate your startup.
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-muted/30 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeCategory === cat
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:text-foreground bg-muted/20 hover:bg-muted/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((article, i) => (
          <motion.div
            key={article.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedArticle(article)}
            className="glass glass-hover rounded-xl p-5 group block cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[article.category] || 'bg-primary/10 text-primary'}`}>
                {article.category}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1.5">{article.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{article.description}</p>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-12">No articles found.</p>
      )}

      {/* Article Drawer */}
      <AnimatePresence>
        {selectedArticle && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl glass border-l border-border/30 flex flex-col"
            >
              <div className="flex items-start justify-between px-6 py-5 border-b border-border/30">
                <div className="flex-1 pr-4">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[selectedArticle.category] || 'bg-primary/10 text-primary'}`}>
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-base font-bold text-foreground mt-2">{selectedArticle.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedArticle.description}</p>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-muted-foreground hover:text-foreground transition flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="prose prose-sm prose-invert max-w-none
                  prose-headings:text-foreground prose-headings:font-semibold
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-li:text-muted-foreground
                  prose-strong:text-foreground
                  prose-h2:text-base prose-h3:text-sm
                  prose-blockquote:border-primary/40 prose-blockquote:text-muted-foreground prose-blockquote:bg-primary/5 prose-blockquote:px-3 prose-blockquote:py-2 prose-blockquote:rounded-md
                  prose-table:text-sm prose-th:text-foreground prose-td:text-muted-foreground
                  prose-ul:space-y-1 prose-ol:space-y-1">
                  <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                </div>

                {/* ✅ ADDED SCORE EXPLANATION (NO CHANGES ABOVE) */}
                <div className="mt-8 rounded-xl border border-border/30 bg-muted/20 p-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    📊 How Your Startup Score Is Calculated
                  </h3>

                  <p className="text-xs text-muted-foreground mb-4">
                    The final score is computed using a weighted evaluation of core startup metrics. Each dimension contributes proportionally based on its importance.
                  </p>

                        <div className="overflow-hidden rounded-lg border border-border/30 mb-4">
        <table className="w-full text-xs">
          <thead className="bg-muted/40 text-foreground">
            <tr>
              <th className="p-2 text-left">Factor</th>
              <th className="p-2 text-left">What It Measures</th>
              <th className="p-2 text-left">Weight</th>
            </tr>
          </thead>

          <tbody className="text-muted-foreground">
            <tr className="border-t border-border/20">
              <td className="p-2">Market Potential</td>
              <td className="p-2">
                TAM, market demand, industry growth, timing
              </td>
              <td className="p-2 text-primary font-medium">30%</td>
            </tr>

            <tr className="border-t border-border/20">
              <td className="p-2">Financial Strength</td>
              <td className="p-2">
                Burn rate, runway, monetization sustainability
              </td>
              <td className="p-2 text-primary font-medium">25%</td>
            </tr>

            <tr className="border-t border-border/20">
              <td className="p-2">Competitive Edge</td>
              <td className="p-2">
                Moat, differentiation, market positioning
              </td>
              <td className="p-2 text-primary font-medium">15%</td>
            </tr>

            <tr className="border-t border-border/20">
              <td className="p-2">Technical Feasibility</td>
              <td className="p-2">
                Scalability, implementation complexity, execution risk
              </td>
              <td className="p-2 text-primary font-medium">10%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-primary font-medium">
        Overall Score =
        (Market × 0.30) +
        (Finance × 0.25) +
        (Competition × 0.15) +
        (Technical × 0.10)
      </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-primary font-medium">
                    Final Score = Σ (Metric Score × Weight)
                  </div>

                  <p className="text-[11px] text-muted-foreground mt-3">
                    Example: Even with strong financials, a weak market or poor execution can significantly reduce the overall score due to weighted impact.
                  </p>
                </div>

              </div>

              <div className="px-6 py-4 border-t border-border/30">
                <p className="text-[10px] text-muted-foreground text-center">
                  VentureIQ Knowledge Base • Curated startup resources
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}