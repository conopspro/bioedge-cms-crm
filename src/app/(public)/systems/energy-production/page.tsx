import { Zap, ArrowLeft, AlertCircle, Search, Sparkles, Play, HelpCircle, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

/**
 * Energy Production System Page
 *
 * Your Body's Power Grid - mitochondrial function, ATP, metabolic efficiency
 * Part of the bioEDGE Decoder 15 Systems Framework.
 */
export default function EnergyProductionSystemPage() {
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
              <Zap className="h-10 w-10 text-gold" />
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white">
                Energy Production
              </h1>
            </div>
            <p className="text-xl text-white/80">
              Your Body&apos;s Power Grid
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
                Your body produces approximately 70 kilograms of ATP every single day. ATP—adenosine triphosphate—is the universal energy currency that powers every cellular process, from the firing of neurons to the beating of your heart to the healing of a wound.
              </p>
              <p>
                The machinery that makes this possible has been refined over nearly two billion years. Mitochondria, your cellular power plants, began as free-living bacteria that entered into partnership with early cells in an arrangement so successful it became permanent. Every cell in your body (except red blood cells) contains hundreds or thousands of these ancient bacterial descendants, each one carrying its own DNA—DNA passed only from mother to child across millions of generations.
              </p>
              <p className="font-semibold text-navy">
                This system is unique among the fourteen because it fuels all the others. Your Stress Response system requires ATP to mount its defense. Your Defense system requires ATP to produce immune cells. Your Consciousness system requires disproportionate amounts of ATP—the brain, representing only 2% of body weight, consumes 20% of your energy production. When the Energy Production system falters, every other system feels it downstream.
              </p>
              <p>
                The Energy Production system belongs to the psychophysiological supersystem—the unified intelligence network where hormones, nerves, and immune cells speak the same chemical language. Your endocrine system regulates the hormones that govern metabolism. Your nervous system communicates energy demands throughout the body. Your immune system relies on energy to function. They act in concert, without committee meetings or reports.
              </p>
              <p>
                You did not learn how to convert food and oxygen into cellular energy. No one taught your mitochondria how to perform the complex chemical cascades that generate ATP. This knowledge is encoded in your biology, inherited through cellular memory, through the accumulated intelligence of every ancestor who survived.
              </p>
              <p className="text-electric-blue font-medium">
                Your body already knows how to power itself. Your job is to remove interference and listen.
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
              The following are factors worth examining when exploring signals that may relate to energy production. These are not causes or diagnoses—they are considerations.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Lifestyle Factors */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Lifestyle Factors</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Activity patterns swinging between sedentary and intense demands</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Sleep that is interrupted, shortened, or poorly timed</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Daily rhythms ignoring circadian preferences</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Schedules leaving no genuine recovery time</span></li>
                </ul>
              </div>

              {/* Dietary Considerations */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Dietary Considerations</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Foods that spike blood sugar followed by crashes</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Erratic meal timing or extended fasting without metabolic flexibility</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Processed foods with poor nutrient density</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Heavy carbohydrate loads without balancing fats and proteins</span></li>
                </ul>
              </div>

              {/* Environmental Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Environmental Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Poor air quality or inadequate ventilation</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Lighting that disrupts circadian signaling</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Mold exposure burdening mitochondrial function</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Chronic low-level toxin exposure</span></li>
                </ul>
              </div>

              {/* Relationship & Emotional Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Relationship &amp; Emotional Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Relationships that drain rather than restore</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Suppressed expression creating ongoing internal tension</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Emotional patterns consuming energy without resolution</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Lack of genuine social connection and support</span></li>
                </ul>
              </div>

              {/* Habitual Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Habitual Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Caffeine dependence masking underlying depletion</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Pushing through fatigue signals rather than responding</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Normalizing exhaustion as &quot;just how life is&quot;</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Patterns of overcommitment and inadequate boundaries</span></li>
                </ul>
              </div>

              {/* Digital Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Digital Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Screen time disrupting sleep architecture</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Constant low-level activation from notifications</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Blue light exposure shifting circadian rhythms</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Digital engagement replacing restorative activities</span></li>
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
                The Energy Production system communicates through 25 signals across 7 categories:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Core Fatigue Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Physical exhaustion, deep fatigue</li>
                    <li>Post-exertional fatigue, crash after activity</li>
                    <li>Unrefreshing sleep, waking tired</li>
                    <li>Afternoon crash, energy dip</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Blood Sugar Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Hypoglycemia signals, low blood sugar feelings</li>
                    <li>Post-meal fatigue, food coma</li>
                    <li>Sugar cravings, carb cravings</li>
                    <li>Reactive mood swings related to eating patterns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Cognitive Energy Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Brain fog related to energy</li>
                    <li>Memory problems when depleted</li>
                    <li>Slow processing, cognitive sluggishness</li>
                    <li>Decision fatigue, difficulty choosing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Physical Energy Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Muscle weakness, loss of strength</li>
                    <li>Exercise intolerance, difficulty sustaining activity</li>
                    <li>Shortness of breath on exertion</li>
                    <li>Cold extremities, poor circulation feeling</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Metabolic Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Unexplained weight changes</li>
                    <li>Temperature dysregulation, always cold</li>
                    <li>Slow wound healing, poor recovery</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Sleep-Energy Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Excessive need for sleep</li>
                    <li>Difficulty waking, morning paralysis feeling</li>
                    <li>Waking at night (blood sugar related)</li>
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Systemic Energy Signals (3)</h4>
                  <ul className="body-text space-y-1 md:flex md:gap-8">
                    <li>Everything takes too much energy</li>
                    <li>Loss of physical resilience</li>
                    <li>Caffeine dependence, stimulant need</li>
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
                    <p className="body-text">You notice that familiar afternoon heaviness setting in at 2:30pm. Your eyelids feel weighted. Your thoughts slow. Your body wants to lie down.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">R</span>
                  <div>
                    <p className="font-heading font-bold text-navy">React</p>
                    <p className="body-text">Your body responds—perhaps with a yawn, a stretch toward the coffee pot, a reaching for something sweet. Energy dips, and compensation begins.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">A</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Assume</p>
                    <p className="body-text">&quot;I didn&apos;t sleep enough last night.&quot; &quot;I&apos;m getting older.&quot; &quot;I&apos;m just lazy.&quot; &quot;Everyone gets tired in the afternoon.&quot; &quot;I need more willpower.&quot; &quot;There&apos;s something wrong with me.&quot;</p>
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
                    <p className="body-text">What did I eat for lunch, and how quickly did this crash follow the meal? What was my blood sugar doing before and after? Did this happen yesterday at the same time? Does this correlate with carbohydrate intake? Does caffeine temporarily fix this, or does it just delay a bigger crash?</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">E</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Encode</p>
                    <p className="body-text">Next time the afternoon heaviness arrives, you remember: &quot;This is information. My body is reporting on fuel status. I can investigate what&apos;s driving this pattern rather than reaching for the quick fix.&quot;</p>
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
                Energy signals are frequently attributed to other causes. The following patterns may be worth exploring:
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
                      <td className="py-3 pr-4">Laziness</td>
                      <td className="py-3">Cellular energy production that may be insufficient for demand</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Depression</td>
                      <td className="py-3">Whether fatigue patterns correlate with food, rest, and sleep</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Normal aging&quot;</td>
                      <td className="py-3">Whether age-related decline may reflect accumulated interference</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Just tired&quot;</td>
                      <td className="py-3">Whether fatigue has patterns worth investigating</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Being out of shape</td>
                      <td className="py-3">Post-exertional crash patterns indicating more than deconditioning</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Anxiety disorder</td>
                      <td className="py-3">Blood sugar instability creating anxiety-like sensations</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Panic attacks</td>
                      <td className="py-3">Hypoglycemia signals that mimic panic</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">ADHD</td>
                      <td className="py-3">Brain fog patterns that correlate with energy state</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Early dementia</td>
                      <td className="py-3">Memory issues that improve with food and rest</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Lack of willpower</td>
                      <td className="py-3">Decision fatigue from depleted glucose reserves</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Mood disorder</td>
                      <td className="py-3">Reactive mood swings tied to eating patterns</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Not a morning person&quot;</td>
                      <td className="py-3">Unrefreshing sleep and morning paralysis patterns</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Hypochondria</td>
                      <td className="py-3">Real metabolic signals being dismissed</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Poor sleep hygiene</td>
                      <td className="py-3">Sleep that occurs but fails to restore energy</td>
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
              The following are options to explore—not prescriptions. Different approaches work for different people.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Awareness Tools */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Notice what times of day energy peaks and dips</li>
                  <li>Observe relationship between food and how you feel 30 min, 2 hrs, 4 hrs later</li>
                  <li>Track whether signals improve with food, rest, or sleep</li>
                  <li>Notice if fatigue is &quot;tired&quot; or &quot;wired and tired&quot;</li>
                  <li>Observe difference between physical fatigue and emotional exhaustion</li>
                </ul>
              </div>

              {/* Exploratory Practices */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Experiment with meal composition (reduce carbs, add protein/fat)</li>
                  <li>Try different meal timing patterns</li>
                  <li>Explore whether a short walk affects afternoon energy vs caffeine</li>
                  <li>Investigate what genuine rest feels like vs distraction</li>
                  <li>Notice what happens with an earlier bedtime for a week</li>
                </ul>
              </div>

              {/* Environmental Adjustments */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Examine lighting, particularly morning light exposure</li>
                  <li>Investigate air quality in primary spaces</li>
                  <li>Review sleep environment (temperature, darkness, disruptions)</li>
                  <li>Consider whether spaces support or drain energy</li>
                  <li>Look at toxin exposure from household sources</li>
                </ul>
              </div>

              {/* Professional Resources */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Functional medicine practitioners (root causes)</li>
                  <li>Endocrinologists (hormonal contributions)</li>
                  <li>Nutritionists (dietary patterns)</li>
                  <li>Naturopathic doctors (lifestyle factors)</li>
                  <li>Testing: metabolic panels, thyroid markers, fasting insulin, HbA1c, organic acids</li>
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
              <ol className="space-y-4 body-text">
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">1</span>
                  <div><strong className="text-navy">Consistent meal timing.</strong> Eating meals at regular times helps regulate blood sugar and energy patterns.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">2</span>
                  <div><strong className="text-navy">Balance macronutrients.</strong> Include protein and fat with carbohydrates to moderate blood sugar response.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">3</span>
                  <div><strong className="text-navy">Morning light.</strong> Get light exposure within an hour of waking to support circadian rhythm.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">4</span>
                  <div><strong className="text-navy">Consistent sleep window.</strong> Go to bed and wake at similar times to regulate energy production.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">5</span>
                  <div><strong className="text-navy">Movement breaks.</strong> Brief movement throughout the day supports energy regulation.</div>
                </li>
              </ol>
            </div>

            {/* Tracking What You Notice */}
            <div className="be-card mb-6">
              <h3 className="font-heading font-bold text-navy mb-4">Tracking What You Notice</h3>
              <p className="body-text mb-4">Rather than optimizing metrics, simply observe:</p>
              <ul className="space-y-3 body-text">
                <li>What time of day does energy feel best? Worst?</li>
                <li>What foods precede energy crashes? What foods sustain?</li>
                <li>Does caffeine help, delay, or make things worse?</li>
                <li>How many hours of sleep leaves you feeling restored?</li>
                <li>Does rest actually help, or does fatigue persist regardless?</li>
              </ul>
              <p className="text-sm text-text-light mt-4 italic">
                These observations are data, not judgments. They reveal patterns worth exploring.
              </p>
            </div>

            {/* The Patience Principle */}
            <div className="be-card bg-off-white">
              <h3 className="font-heading font-bold text-navy mb-4">The Patience Principle</h3>
              <p className="body-text mb-4">
                The Energy Production system reflects accumulated patterns—mitochondrial health builds over time, blood sugar regulation stabilizes gradually, cellular repair happens during consistent recovery. Changes may take weeks to months to become apparent.
              </p>
              <p className="body-text mb-4">
                This system responds to consistency over intensity. Sustainable rhythms matter more than dramatic interventions.
              </p>
              <p className="text-electric-blue font-medium">
                The body stores energy differently than a bank account. You cannot deposit frantically on weekends and withdraw all week. Restoration requires regularity.
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
              These questions may help explore whether a signal originates primarily from the Energy Production system:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
                </div>
                <ol className="space-y-3 body-text list-decimal list-inside">
                  <li>Does this improve with rest, food, or sleep? (If yes → Energy)</li>
                  <li>Is there a blood sugar component—correlates with eating patterns?</li>
                  <li>Does this have a &quot;tired&quot; quality, or &quot;wired and tired&quot;?</li>
                  <li>Does caffeine provide temporary relief then crash?</li>
                  <li>Does physical exertion cause disproportionate or delayed fatigue?</li>
                </ol>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Self-Inquiry</h3>
                </div>
                <ol className="space-y-3 body-text list-decimal list-inside">
                  <li>When did I last feel genuinely energized, and what was different?</li>
                  <li>What happens when I eat differently—more protein, fewer carbs?</li>
                  <li>Does genuine rest (not distraction) change how I feel?</li>
                  <li>Am I borrowing energy from tomorrow with caffeine or willpower?</li>
                  <li>Do I push through fatigue signals, and what happens when I don&apos;t?</li>
                </ol>
              </div>
            </div>

            <div className="be-card mt-6">
              <h3 className="font-heading font-bold text-navy mb-4">Distinguishing Overlaps</h3>
              <ul className="space-y-3 body-text">
                <li><strong className="text-navy">Pure tiredness</strong> → points to Energy Production</li>
                <li><strong className="text-navy">&quot;Wired and tired&quot;</strong> → may involve Stress Response</li>
                <li><strong className="text-navy">Caffeine makes it worse</strong> → may indicate Stress Response</li>
                <li><strong className="text-navy">Crash 24-72 hours after activity</strong> → may indicate mitochondrial involvement</li>
                <li><strong className="text-navy">Body and brain sluggish together</strong> → suggests ATP affecting everything</li>
                <li><strong className="text-navy">Fatigue persists regardless of rest</strong> → consider other systems</li>
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
              The Energy Production system fuels all other systems and interfaces with them constantly:
            </p>

            <div className="grid gap-4">
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Stress Response System</h4>
                  <p className="body-text">Energy depletion and stress activation often occur together. The &quot;wired and tired&quot; pattern involves both systems. Chronic stress burns through energy reserves while preventing restoration.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Hormonal System</h4>
                  <p className="body-text">Thyroid hormones regulate metabolic rate and thus energy production. Adrenal hormones affect blood sugar regulation. The two systems share signals and require consideration together.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-pink-accent rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Defense System</h4>
                  <p className="body-text">Inflammation consumes significant energy. Chronic immune activation drains resources. Fatigue accompanied by inflammatory signals may involve both systems.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-deep-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Consciousness System</h4>
                  <p className="body-text">The brain requires disproportionate ATP. Cognitive signals often appear first when energy production falters. Distinguishing energy-related brain fog from consciousness-related processing requires observing whether food and rest help.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Regeneration System</h4>
                  <p className="body-text">Sleep is when cellular repair occurs. Unrefreshing sleep impairs both regeneration and energy restoration. The two systems interface during recovery.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Digestive System</h4>
                  <p className="body-text">Energy comes from food. Digestive function affects nutrient absorption and blood sugar patterns. Post-meal fatigue may involve both systems.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="be-card be-card-accent text-center">
            <p className="body-text text-navy mb-4">
              Your body produces approximately 70 kilograms of ATP every single day. This ancient machinery has been refined over nearly two billion years. You did not learn how to power yourself—this wisdom is encoded in your biology.
            </p>
            <p className="body-text italic">
              The signals your body sends are communications worth investigating, not conclusions to accept. Your body&apos;s natural intelligence is already working. Your role is to listen, decode, and respond.
            </p>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border">
            <Link
              href="/systems/emotional"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Emotional
            </Link>
            <Link
              href="/systems/hormonal"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-pink-accent transition-colors font-medium"
            >
              Next: Hormonal
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Energy Production | bioEDGE Decoder",
  description: "Your Body's Power Grid. The Energy Production system governs mitochondrial function and ATP production—fueling all other systems with the universal energy currency that powers every cellular process.",
}
