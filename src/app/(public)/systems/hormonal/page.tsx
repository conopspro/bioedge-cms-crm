import { Gauge, ArrowLeft, AlertCircle, Search, Sparkles, Play, HelpCircle, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

/**
 * Hormonal System Page
 *
 * Your Body's Orchestra - endocrine system, hormone balance, thyroid, adrenals
 * Part of the bioEDGE Decoder 15 Systems Framework.
 */
export default function HormonalSystemPage() {
  return (
    <>
      {/* Hero */}
      <div className="be-event-hero">
        <div className="be-container py-16 relative z-10">
          
            <Link
              href="/systems"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Systems
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <Gauge className="h-10 w-10 text-gold" />
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white">
                Hormonal System
              </h1>
            </div>
            <p className="text-xl text-white/80">
              Your Body&apos;s Orchestra
            </p>
            <p className="text-sm text-gold mt-4 font-heading uppercase tracking-wider">
              bioEDGE Decoder
            </p>
        </div>
      </div>

      {/* Content */}
      <div className="be-container py-12">
        <div className="space-y-12">

          {/* Section 1: Natural Intelligence */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">1</span>
              <h2 className="section-title">Natural Intelligence</h2>
            </div>
            <div className="be-card space-y-4 body-text">
              <p>
                Your hormonal system orchestrates your biology through chemical messengers. Every moment, hormones travel through your bloodstream coordinating processes across distant organs and tissues—regulating metabolism, stress response, blood sugar, reproduction, growth, sleep-wake cycles, and mood. These aren&apos;t isolated chemicals acting independently. They&apos;re a continuous conversation between your thyroid, adrenals, pancreas, and reproductive organs.
              </p>
              <p className="font-semibold text-navy">
                What makes this system unique among the fourteen is its governance of chemical coordination across time. While your nervous system responds in milliseconds and your immune system in hours, hormones work in rhythms—daily cortisol patterns, monthly menstrual cycles, seasonal shifts, and life-stage transitions spanning decades. This is the slow, steady conductor ensuring every instrument plays in harmony.
              </p>
              <p>
                Your hormonal system is part of what scientists call the psychophysiological supersystem. Your endocrine, nervous, and immune systems don&apos;t operate in isolation. They communicate constantly through shared messengers and feedback loops so integrated that affecting one inevitably affects the others. When you face a challenge, this network responds as one—your adrenals release cortisol, your thyroid adjusts metabolic rate, your pancreas modulates blood sugar. They don&apos;t hold committee meetings. They act in concert, without conscious direction.
              </p>
              <p>
                When hormonal axes become dysregulated—thyroid dysfunction, insulin resistance, cortisol patterns disrupted, sex hormone imbalances—the disturbance cascades through every other system. But here&apos;s what&apos;s worth remembering: this system has been refined over hundreds of millions of years of evolution.
              </p>
              <p className="text-electric-blue font-medium">
                Your body already knows how to orchestrate. Your job is to listen to the signals, remove interference, and trust the intelligence that has always been there.
              </p>
            </div>
          </section>

          {/* Section 2: Eliminate */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">2</span>
              <h2 className="section-title">Eliminate</h2>
            </div>
            <p className="body-text mb-6">
              Before adding anything new, consider what might be interfering with hormonal communication. These are factors worth examining—not definitive causes, but considerations.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Lifestyle Factors */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Lifestyle Factors</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Irregular sleep schedules disrupting cortisol and melatonin rhythms</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Insufficient morning light or excessive evening blue light</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Erratic eating patterns affecting blood sugar and insulin</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Exercise extremes—both sedentary and overtraining</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Chronic under-recovery depleting adrenal reserves</span></li>
                </ul>
              </div>

              {/* Dietary Considerations */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Dietary Considerations</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>High-glycemic meals contributing to insulin resistance</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Insufficient protein affecting hormone production</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Low iodine, selenium, or zinc affecting thyroid function</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Inflammatory foods triggering individual sensitivity</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Late-day caffeine interfering with cortisol and melatonin</span></li>
                </ul>
              </div>

              {/* Environmental Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Environmental Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Endocrine disruptors in plastics, pesticides, personal care products</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Artificial light at night suppressing melatonin</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Temperature extremes affecting thyroid and adrenal function</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Electromagnetic fields potentially affecting melatonin</span></li>
                </ul>
              </div>

              {/* Relationship & Emotional Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Relationship &amp; Emotional Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Ongoing relationship tension sustaining cortisol elevation</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Unexpressed emotions manifesting as hormonal patterns</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Lack of connection affecting oxytocin and stress balance</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Caretaking without receiving contributing to depletion</span></li>
                </ul>
              </div>

              {/* Habitual Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Habitual Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Chronic rushing keeping cortisol elevated</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Regular meal-skipping affecting blood sugar regulation</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Pushing through fatigue contributing to HPA axis disruption</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Ignoring menstrual cycle signals increasing hormonal stress</span></li>
                </ul>
              </div>

              {/* Digital Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Digital Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Evening screen exposure suppressing melatonin</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Constant connectivity preventing cortisol recovery</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Social media comparison activating stress hormones</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Fragmented attention contributing to chronic stress</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Decode */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">3</span>
              <h2 className="section-title">Decode</h2>
            </div>

            {/* Signal Inventory */}
            <div className="be-card be-card-accent mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-gold" />
                <h3 className="font-heading font-bold text-navy">Signal Inventory</h3>
              </div>
              <p className="body-text mb-6">
                The Hormonal System communicates through 38 signals across 6 categories:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Thyroid Signals — Metabolic (10)</h4>
                  <ul className="body-text space-y-1">
                    <li>Persistent fatigue with cold intolerance</li>
                    <li>Unexplained weight gain despite normal eating</li>
                    <li>Difficulty losing weight despite effort</li>
                    <li>Brain fog with sluggish thinking</li>
                    <li>Hair thinning or loss</li>
                    <li>Dry skin and brittle nails</li>
                    <li>Constipation (metabolic, not digestive)</li>
                    <li>Feeling wired but exhausted (hyperthyroid)</li>
                    <li>Heat intolerance and excessive sweating</li>
                    <li>Tremor or shakiness</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Adrenal/Cortisol Signals (7)</h4>
                  <ul className="body-text space-y-1">
                    <li>Morning fatigue that improves through day</li>
                    <li>Afternoon crash (typically 2-4pm)</li>
                    <li>Crashing after stress (disproportionate recovery)</li>
                    <li>Salt cravings</li>
                    <li>Dizziness upon standing</li>
                    <li>Decreased stress tolerance</li>
                    <li>3-4am waking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Blood Sugar/Insulin Signals (5)</h4>
                  <ul className="body-text space-y-1">
                    <li>Energy crashes 1-2 hours after eating carbs</li>
                    <li>Hangry episodes (irritability when hungry)</li>
                    <li>Intense sugar/carb cravings</li>
                    <li>Abdominal weight gain</li>
                    <li>Difficulty building or maintaining muscle</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Sex Hormone Signals (10)</h4>
                  <ul className="body-text space-y-1">
                    <li>Hot flashes and night sweats</li>
                    <li>Mood swings tied to cycle</li>
                    <li>Low libido</li>
                    <li>Erectile dysfunction</li>
                    <li>Vaginal dryness and discomfort</li>
                    <li>Breast tenderness (cyclic)</li>
                    <li>Heavy or painful periods</li>
                    <li>Irregular periods</li>
                    <li>Fatigue worse at certain cycle times</li>
                    <li>Perimenopause/andropause changes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Growth &amp; Repair Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Slow recovery from exercise or injury</li>
                    <li>Poor sleep quality despite adequate time</li>
                    <li>Decreased sense of wellbeing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Sleep/Circadian Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Difficulty falling asleep</li>
                    <li>Waking too early</li>
                    <li>Disrupted sleep-wake cycle</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* TRADE Framework */}
            <div className="be-card mb-8">
              <h3 className="font-heading font-bold text-navy mb-4">The TRADE Framework</h3>
              <p className="body-text mb-6">
                Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">T</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Trigger</p>
                    <p className="body-text">You notice you&apos;ve gained weight around your midsection despite not changing your diet. You feel foggy in the afternoons and crash after eating bread.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">R</span>
                  <div>
                    <p className="font-heading font-bold text-navy">React</p>
                    <p className="body-text">Your body responds with frustration. You feel discouraged. Maybe you eat more comfort food to cope.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">A</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Assume</p>
                    <p className="body-text">&quot;I&apos;m just getting older.&quot; &quot;I have no willpower.&quot; &quot;This is genetic—nothing I can do.&quot; &quot;I need to exercise more and eat less.&quot;</p>
                  </div>
                </div>
                <div className="p-4 bg-pink-accent/10 rounded-lg">
                  <p className="body-text italic">
                    Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">D</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Decode</p>
                    <p className="body-text">What if this isn&apos;t about willpower at all? What if your insulin is elevated? What if your thyroid is underperforming? When did this pattern start—after a stressful period? After a pregnancy? In your forties? What happens 1-2 hours after you eat carbs?</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">E</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Encode</p>
                    <p className="body-text">&quot;What I called &apos;aging&apos; might be my blood sugar signaling that my insulin response has shifted. The brain fog wasn&apos;t personal failure—it was metabolic information. Now I notice patterns rather than assigning blame.&quot;</p>
                  </div>
                </div>
              </div>
              <p className="body-text mt-6 text-electric-blue font-medium">
                Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life. This doesn&apos;t stop with your health. This can apply to your career, your family, your friends, anything.
              </p>
            </div>

            {/* Common Mislabels */}
            <div className="be-card">
              <h3 className="font-heading font-bold text-navy mb-4">Common Mislabels</h3>
              <p className="body-text mb-4">
                Hormonal signals are frequently attributed to other causes. The following patterns may be worth exploring:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full body-text">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 pr-4 font-heading text-navy">What It Gets Called</th>
                      <th className="text-left py-3 font-heading text-navy">What It Might Be Worth Exploring</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Laziness, depression, &quot;just aging&quot;</td>
                      <td className="py-3">Thyroid fatigue (persistent fatigue with cold intolerance)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Anxiety disorder, burnout, &quot;can&apos;t handle stress&quot;</td>
                      <td className="py-3">Adrenal depletion (crashing after stress, decreased tolerance)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Mood disorder, &quot;being dramatic&quot;</td>
                      <td className="py-3">Blood sugar crashes (energy crashes after carbs, irritability)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Normal aging, depression, &quot;lost his drive&quot;</td>
                      <td className="py-3">Low testosterone (fatigue, low libido, poor recovery)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Mental illness, &quot;she&apos;s crazy,&quot; personality change</td>
                      <td className="py-3">Perimenopause mood changes</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Panic attacks, &quot;just stress&quot;</td>
                      <td className="py-3">Hot flashes and night sweats</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Early dementia, ADHD</td>
                      <td className="py-3">Hormone-related brain fog</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Lack of willpower, &quot;not trying hard enough&quot;</td>
                      <td className="py-3">Unexplained weight gain (thyroid or insulin patterns)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Relationship problem, &quot;doesn&apos;t love partner&quot;</td>
                      <td className="py-3">Low libido (hormonal origin)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Personality flaw, &quot;too sensitive&quot;</td>
                      <td className="py-3">Cycle-related mood changes</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Insomnia, &quot;worrying too much&quot;</td>
                      <td className="py-3">3-4am waking (cortisol pattern)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Poor sleep hygiene, &quot;night owl&quot;</td>
                      <td className="py-3">Morning fatigue that improves through day</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Hypochondria, &quot;just stand up slower&quot;</td>
                      <td className="py-3">Dizziness upon standing (aldosterone)</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Poor diet choices, addiction</td>
                      <td className="py-3">Salt cravings (adrenal pattern)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 4: Gain */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">4</span>
              <h2 className="section-title">Gain</h2>
            </div>
            <p className="body-text mb-6">
              The following are options to explore—not prescriptions or recommendations. Consider what might be relevant to your situation.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Awareness Tools */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Cycle tracking: how signals correlate with menstrual phases</li>
                  <li>Time-of-day patterns: when signals appear and if they follow rhythms</li>
                  <li>Meal-signal correlation: before/after eating, especially carbs</li>
                  <li>Life-stage awareness: perimenopause, andropause, post-pregnancy</li>
                  <li>Temperature awareness: consistently running hot or cold</li>
                </ul>
              </div>

              {/* Exploratory Practices */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Morning light exposure within first hour of waking</li>
                  <li>Consistent meal timing to observe effects on energy</li>
                  <li>Protein at breakfast to see if it affects energy stability</li>
                  <li>Evening light reduction to observe sleep effects</li>
                  <li>Stress recovery periods after demanding times</li>
                </ul>
              </div>

              {/* Environmental Adjustments */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Gauge className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Reduce endocrine disruptor exposure (products, containers)</li>
                  <li>Create morning light access in living/working space</li>
                  <li>Adjust evening lighting and temperature for circadian support</li>
                  <li>Reduce access to blood-sugar-spiking foods</li>
                </ul>
              </div>

              {/* Professional Resources */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Functional medicine practitioners (comprehensive assessment)</li>
                  <li>Endocrinologists (hormonal conditions and testing)</li>
                  <li>Integrative gynecologists (reproductive health context)</li>
                  <li>Naturopathic doctors (hormone-supportive approaches)</li>
                  <li>Certified clinical nutritionists (dietary patterns)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Execute */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">5</span>
              <h2 className="section-title">Execute</h2>
            </div>

            {/* Foundation Practices */}
            <div className="be-card be-card-accent mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-gold" />
                <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>
              </div>
              <p className="body-text mb-4">Start with what&apos;s sustainable rather than what&apos;s dramatic:</p>
              <ol className="space-y-4 body-text">
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">1</span>
                  <div><strong className="text-navy">Consistent sleep and wake times.</strong> The body&apos;s hormonal rhythms calibrate to predictable patterns.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">2</span>
                  <div><strong className="text-navy">Morning light, evening dimness.</strong> This single practice affects multiple hormonal axes.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">3</span>
                  <div><strong className="text-navy">Regular meals with protein.</strong> Blood sugar stability supports the entire hormonal system.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">4</span>
                  <div><strong className="text-navy">Movement you&apos;ll actually do.</strong> Regular activity affects insulin, cortisol, and sex hormone patterns.</div>
                </li>
              </ol>
            </div>

            {/* Tracking What You Notice */}
            <div className="be-card mb-6">
              <h3 className="font-heading font-bold text-navy mb-4">Tracking What You Notice</h3>
              <p className="body-text mb-4">Rather than optimizing metrics, simply observe:</p>
              <ul className="space-y-3 body-text">
                <li>When do you feel most energized? When do you crash?</li>
                <li>How do you feel 1-2 hours after different meals?</li>
                <li>If you have a menstrual cycle, what patterns emerge at different phases?</li>
                <li>What happens to your symptoms when you&apos;re away from your usual environment?</li>
                <li>How long does it take you to recover after stressful periods?</li>
              </ul>
              <p className="text-sm text-text-light mt-4 italic">
                Write observations in plain language. The patterns often become visible over time.
              </p>
            </div>

            {/* The Patience Principle */}
            <div className="be-card bg-off-white">
              <h3 className="font-heading font-bold text-navy mb-4">The Patience Principle</h3>
              <p className="body-text mb-4">
                Hormonal patterns often develop gradually over weeks, months, or years. They typically shift on similar timescales. Thyroid patterns may take weeks to months to change noticeably. Adrenal patterns may require months of consistent recovery. Sex hormone patterns may shift over several cycles.
              </p>
              <p className="text-electric-blue font-medium">
                This is not a system that responds to weekend interventions. It responds to sustained changes maintained over time. Notice small shifts without demanding transformation. The body rebalances at its own pace.
              </p>
            </div>
          </section>

          {/* Section 6: Questions for Clarity */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">6</span>
              <h2 className="section-title">Questions for Clarity</h2>
            </div>
            <p className="body-text mb-6">
              Use these questions to explore whether signals might originate from the Hormonal System:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Pattern Questions</h3>
                </div>
                <ol className="space-y-3 body-text list-decimal list-inside">
                  <li>Does this follow predictable time patterns (day, cycle, life stage)?</li>
                  <li>Did this develop gradually over weeks to months?</li>
                  <li>Does this cluster with signals suggesting same hormonal axis?</li>
                  <li>Is this about rhythms and cycles or nervous system activation?</li>
                  <li>Does rest help, or does fatigue persist regardless?</li>
                </ol>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Hormonal Axis Questions</h3>
                </div>
                <ol className="space-y-3 body-text list-decimal list-inside">
                  <li>Thyroid: Changes in weight, temperature, skin, hair, nails?</li>
                  <li>Adrenal: Time-of-day pattern? Morning fatigue? Afternoon crash?</li>
                  <li>Blood sugar: Does eating improve or worsen this?</li>
                  <li>Sex hormones: Tied to cycle, reproductive function, life stage?</li>
                  <li>Did this correlate with stress, pregnancy, perimenopause?</li>
                </ol>
              </div>
            </div>

            <div className="be-card mt-6">
              <h3 className="font-heading font-bold text-navy mb-4">Distinguishing Overlaps</h3>
              <ul className="space-y-3 body-text">
                <li><strong className="text-navy">Fatigue sluggish and heavy</strong> → suggests thyroid</li>
                <li><strong className="text-navy">Fatigue wired and depleted</strong> → suggests adrenal or hyperthyroid</li>
                <li><strong className="text-navy">Anxiety with tremor, heat, racing heart at rest</strong> → may be thyroid</li>
                <li><strong className="text-navy">Anxiety triggered by stressful situations</strong> → may be Stress Response</li>
                <li><strong className="text-navy">Mood changes correlate with cycles/time of day</strong> → Hormonal</li>
                <li><strong className="text-navy">Mood changes independent of physical patterns</strong> → Emotional</li>
              </ul>
            </div>
          </section>

          {/* Section 7: Cross-System Connections */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">7</span>
              <h2 className="section-title">Cross-System Connections</h2>
            </div>
            <p className="body-text mb-6">
              The Hormonal System interfaces extensively with other systems, explaining why signals often overlap:
            </p>

            <div className="grid gap-4">
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Stress Response</h4>
                  <p className="body-text">The adrenal glands produce both stress hormones and are part of the hormonal system. Chronic nervous system activation depletes hormonal reserves. Cortisol suppresses sex hormones. The distinction: acute activation (Stress) vs. hormonal fuel being depleted (Hormonal).</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Energy Production</h4>
                  <p className="body-text">Thyroid hormones regulate metabolic rate and cellular energy production. Blood sugar involves both insulin (hormonal) and how cells use glucose (energy). Fatigue improving with food may point to Energy; persisting regardless suggests thyroid or adrenal.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-pink-accent rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Emotional System</h4>
                  <p className="body-text">Hormones directly affect neurotransmitters and mood. The key distinction: do mood changes correlate with cycles, time of day, or life stage (Hormonal) or are they independent and relate to emotional processing (Emotional)?</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-deep-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Temperature System</h4>
                  <p className="body-text">Thyroid dysfunction often presents as temperature dysregulation—cold intolerance in hypothyroid, heat intolerance in hyperthyroid. Hot flashes during perimenopause are hormonal signals using the Temperature System as output.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Defense System</h4>
                  <p className="body-text">Inflammation affects hormonal function, and hormones affect immune response. Cytokines can disrupt hormonal axes. When fatigue accompanies inflammatory markers (joint pain, frequent illness), Defense and Hormonal may both be involved.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Regeneration System</h4>
                  <p className="body-text">Growth hormone, primarily released during sleep, drives tissue repair. Poor recovery may reflect inadequate growth hormone release (Hormonal) or impaired repair processes (Regeneration). Sleep quality affects both systems.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="be-card be-card-accent text-center">
            <p className="body-text text-navy mb-4">
              Your hormonal system orchestrates your biology through chemical messengers coordinating processes across distant organs and tissues. This slow, steady conductor has been refined over hundreds of millions of years of evolution.
            </p>
            <p className="body-text italic">
              This decoder is designed for exploration, not diagnosis. The signals listed here are invitations to investigate, not conclusions. Your body&apos;s intelligence is already working. Your role is to listen, learn, and support what it&apos;s trying to tell you.
            </p>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border">
            <Link
              href="/systems/energy-production"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Energy Production
            </Link>
            <Link
              href="/systems/hydration"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-pink-accent transition-colors font-medium"
            >
              Next: Hydration
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Hormonal System | bioEDGE Decoder",
  description: "Your Body's Orchestra. The Hormonal System orchestrates your biology through chemical messengers—coordinating metabolism, stress response, blood sugar, reproduction, growth, sleep-wake cycles, and mood.",
}
