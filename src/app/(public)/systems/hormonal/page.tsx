import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SystemDirectory } from "@/components/directory/system-solutions"
import { SystemNews } from "@/components/directory/system-news"

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
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Hormonal System
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Orchestra
          </p>
          <p className="text-sm text-gold mt-4 font-heading uppercase tracking-wider">
            bioEDGE Decoder
          </p>
        </div>
      </div>

      {/* Section Nav */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="be-container">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-x-6 gap-y-2 py-3 text-sm">
            <a href="#natural-intelligence" className="text-electric-blue hover:text-navy transition-colors">Natural Intelligence</a>
            <a href="#eliminate" className="text-electric-blue hover:text-navy transition-colors">Eliminate</a>
            <a href="#decode" className="text-electric-blue hover:text-navy transition-colors">Decode</a>
            <a href="#gain" className="text-electric-blue hover:text-navy transition-colors">Gain</a>
            <a href="#execute" className="text-electric-blue hover:text-navy transition-colors">Execute</a>
            <a href="#questions" className="text-electric-blue hover:text-navy transition-colors">Questions</a>
            <a href="#connections" className="text-electric-blue hover:text-navy transition-colors">Connections</a>
            <a href="#news" className="text-electric-blue hover:text-navy transition-colors">News</a>
            <a href="#directory" className="text-electric-blue hover:text-navy transition-colors">Directory</a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="be-container py-12">
        <div className="max-w-3xl mx-auto">
          <article className="space-y-8 body-text">

            {/* Natural Intelligence */}

            <div id="natural-intelligence" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Natural Intelligence
              </h2>
            </div>

            <p>
              Your hormonal system orchestrates your biology through chemical messengers. Every moment, hormones travel through your bloodstream coordinating processes across distant organs and tissues—regulating metabolism, stress response, blood sugar, reproduction, growth, sleep-wake cycles, and mood. These aren&apos;t isolated chemicals acting independently. They&apos;re a continuous conversation between your thyroid, adrenals, pancreas, and reproductive organs.
            </p>

            <p>
              <strong className="text-navy">What makes this system unique among the fourteen is its governance of chemical coordination across time.</strong> While your nervous system responds in milliseconds and your immune system in hours, hormones work in rhythms—daily cortisol patterns, monthly menstrual cycles, seasonal shifts, and life-stage transitions spanning decades. This is the slow, steady conductor ensuring every instrument plays in harmony.
            </p>

            <p>
              Your hormonal system is part of what scientists call the psychophysiological supersystem. Your endocrine, nervous, and immune systems don&apos;t operate in isolation. They communicate constantly through shared messengers and feedback loops so integrated that affecting one inevitably affects the others. When you face a challenge, this network responds as one—your adrenals release cortisol, your thyroid adjusts metabolic rate, your pancreas modulates blood sugar. They don&apos;t hold committee meetings. They act in concert, without conscious direction.
            </p>

            <p>
              When hormonal axes become dysregulated—thyroid dysfunction, insulin resistance, cortisol patterns disrupted, sex hormone imbalances—the disturbance cascades through every other system. But here&apos;s what&apos;s worth remembering: this system has been refined over hundreds of millions of years of evolution.
            </p>

            <p>
              Your body already knows how to orchestrate. Your job is to listen to the signals, remove interference, and trust the intelligence that has always been there.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              Before adding anything new, consider what might be interfering with hormonal communication. These are factors worth examining—not definitive causes, but considerations.
            </p>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Irregular sleep schedules disrupting cortisol and melatonin rhythms</li>
              <li>Insufficient morning light or excessive evening blue light</li>
              <li>Erratic eating patterns affecting blood sugar and insulin</li>
              <li>Exercise extremes—both sedentary and overtraining</li>
              <li>Chronic under-recovery depleting adrenal reserves</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>High-glycemic meals contributing to insulin resistance</li>
              <li>Insufficient protein affecting hormone production</li>
              <li>Low iodine, selenium, or zinc affecting thyroid function</li>
              <li>Inflammatory foods triggering individual sensitivity</li>
              <li>Late-day caffeine interfering with cortisol and melatonin</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Endocrine disruptors in plastics, pesticides, personal care products</li>
              <li>Artificial light at night suppressing melatonin</li>
              <li>Temperature extremes affecting thyroid and adrenal function</li>
              <li>Electromagnetic fields potentially affecting melatonin</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ongoing relationship tension sustaining cortisol elevation</li>
              <li>Unexpressed emotions manifesting as hormonal patterns</li>
              <li>Lack of connection affecting oxytocin and stress balance</li>
              <li>Caretaking without receiving contributing to depletion</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chronic rushing keeping cortisol elevated</li>
              <li>Regular meal-skipping affecting blood sugar regulation</li>
              <li>Pushing through fatigue contributing to HPA axis disruption</li>
              <li>Ignoring menstrual cycle signals increasing hormonal stress</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Evening screen exposure suppressing melatonin</li>
              <li>Constant connectivity preventing cortisol recovery</li>
              <li>Social media comparison activating stress hormones</li>
              <li>Fragmented attention contributing to chronic stress</li>
            </ul>

            {/* Decode */}

            <div id="decode" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Decode
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Understand what your body is communicating</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Signal Inventory</h3>

            <p>
              The Hormonal System communicates through 38 signals across 6 categories:
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Thyroid Signals — Metabolic (10)</h4>
            <ul className="list-disc pl-6 space-y-1">
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

            <h4 className="font-heading text-sm font-bold text-navy">Adrenal/Cortisol Signals (7)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Morning fatigue that improves through day</li>
              <li>Afternoon crash (typically 2-4pm)</li>
              <li>Crashing after stress (disproportionate recovery)</li>
              <li>Salt cravings</li>
              <li>Dizziness upon standing</li>
              <li>Decreased stress tolerance</li>
              <li>3-4am waking</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Blood Sugar/Insulin Signals (5)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Energy crashes 1-2 hours after eating carbs</li>
              <li>Hangry episodes (irritability when hungry)</li>
              <li>Intense sugar/carb cravings</li>
              <li>Abdominal weight gain</li>
              <li>Difficulty building or maintaining muscle</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Sex Hormone Signals (10)</h4>
            <ul className="list-disc pl-6 space-y-1">
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

            <h4 className="font-heading text-sm font-bold text-navy">Growth &amp; Repair Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Slow recovery from exercise or injury</li>
              <li>Poor sleep quality despite adequate time</li>
              <li>Decreased sense of wellbeing</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Sleep/Circadian Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Difficulty falling asleep</li>
              <li>Waking too early</li>
              <li>Disrupted sleep-wake cycle</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You notice you&apos;ve gained weight around your midsection despite not changing your diet. You feel foggy in the afternoons and crash after eating bread.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your body responds with frustration. You feel discouraged. Maybe you eat more comfort food to cope.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> &quot;I&apos;m just getting older.&quot; &quot;I have no willpower.&quot; &quot;This is genetic—nothing I can do.&quot; &quot;I need to exercise more and eat less.&quot;
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> What if this isn&apos;t about willpower at all? What if your insulin is elevated? What if your thyroid is underperforming? When did this pattern start—after a stressful period? After a pregnancy? In your forties? What happens 1-2 hours after you eat carbs?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> &quot;What I called &apos;aging&apos; might be my blood sugar signaling that my insulin response has shifted. The brain fog wasn&apos;t personal failure—it was metabolic information. Now I notice patterns rather than assigning blame.&quot;
            </p>

            <p>
              Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life. This doesn&apos;t stop with your health. This can apply to your career, your family, your friends, anything.
            </p>

            <h3 className="font-heading font-bold text-navy">Common Mislabels</h3>

            <p>
              Hormonal signals are frequently attributed to other causes. The following patterns may be worth exploring:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
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

            {/* Gain */}

            <div id="gain" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Gain
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Explore supportive practices and resources</p>
            </div>

            <p>
              The following are options to explore—not prescriptions or recommendations. Consider what might be relevant to your situation.
            </p>

            <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cycle tracking: how signals correlate with menstrual phases</li>
              <li>Time-of-day patterns: when signals appear and if they follow rhythms</li>
              <li>Meal-signal correlation: before/after eating, especially carbs</li>
              <li>Life-stage awareness: perimenopause, andropause, post-pregnancy</li>
              <li>Temperature awareness: consistently running hot or cold</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Morning light exposure within first hour of waking</li>
              <li>Consistent meal timing to observe effects on energy</li>
              <li>Protein at breakfast to see if it affects energy stability</li>
              <li>Evening light reduction to observe sleep effects</li>
              <li>Stress recovery periods after demanding times</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reduce endocrine disruptor exposure (products, containers)</li>
              <li>Create morning light access in living/working space</li>
              <li>Adjust evening lighting and temperature for circadian support</li>
              <li>Reduce access to blood-sugar-spiking foods</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Functional medicine practitioners (comprehensive assessment)</li>
              <li>Endocrinologists (hormonal conditions and testing)</li>
              <li>Integrative gynecologists (reproductive health context)</li>
              <li>Naturopathic doctors (hormone-supportive approaches)</li>
              <li>Certified clinical nutritionists (dietary patterns)</li>
            </ul>

            {/* Execute */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Take action with patience and consistency</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>

            <p>Start with what&apos;s sustainable rather than what&apos;s dramatic:</p>

            <ol className="list-decimal pl-6 space-y-3">
              <li><strong className="text-navy">Consistent sleep and wake times.</strong> The body&apos;s hormonal rhythms calibrate to predictable patterns.</li>
              <li><strong className="text-navy">Morning light, evening dimness.</strong> This single practice affects multiple hormonal axes.</li>
              <li><strong className="text-navy">Regular meals with protein.</strong> Blood sugar stability supports the entire hormonal system.</li>
              <li><strong className="text-navy">Movement you&apos;ll actually do.</strong> Regular activity affects insulin, cortisol, and sex hormone patterns.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <p>Rather than optimizing metrics, simply observe:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>When do you feel most energized? When do you crash?</li>
              <li>How do you feel 1-2 hours after different meals?</li>
              <li>If you have a menstrual cycle, what patterns emerge at different phases?</li>
              <li>What happens to your symptoms when you&apos;re away from your usual environment?</li>
              <li>How long does it take you to recover after stressful periods?</li>
            </ul>

            <p className="text-sm italic">
              Write observations in plain language. The patterns often become visible over time.
            </p>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              Hormonal patterns often develop gradually over weeks, months, or years. They typically shift on similar timescales. Thyroid patterns may take weeks to months to change noticeably. Adrenal patterns may require months of consistent recovery. Sex hormone patterns may shift over several cycles.
            </p>

            <p>
              This is not a system that responds to weekend interventions. It responds to sustained changes maintained over time. Notice small shifts without demanding transformation. The body rebalances at its own pace.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              Use these questions to explore whether signals might originate from the Hormonal System:
            </p>

            <h3 className="font-heading font-bold text-navy">Pattern Questions</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Does this follow predictable time patterns (day, cycle, life stage)?</li>
              <li>Did this develop gradually over weeks to months?</li>
              <li>Does this cluster with signals suggesting same hormonal axis?</li>
              <li>Is this about rhythms and cycles or nervous system activation?</li>
              <li>Does rest help, or does fatigue persist regardless?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Hormonal Axis Questions</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Thyroid: Changes in weight, temperature, skin, hair, nails?</li>
              <li>Adrenal: Time-of-day pattern? Morning fatigue? Afternoon crash?</li>
              <li>Blood sugar: Does eating improve or worsen this?</li>
              <li>Sex hormones: Tied to cycle, reproductive function, life stage?</li>
              <li>Did this correlate with stress, pregnancy, perimenopause?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Distinguishing Overlaps</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-navy">Fatigue sluggish and heavy</strong> → suggests thyroid</li>
              <li><strong className="text-navy">Fatigue wired and depleted</strong> → suggests adrenal or hyperthyroid</li>
              <li><strong className="text-navy">Anxiety with tremor, heat, racing heart at rest</strong> → may be thyroid</li>
              <li><strong className="text-navy">Anxiety triggered by stressful situations</strong> → may be Stress Response</li>
              <li><strong className="text-navy">Mood changes correlate with cycles/time of day</strong> → Hormonal</li>
              <li><strong className="text-navy">Mood changes independent of physical patterns</strong> → Emotional</li>
            </ul>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              The Hormonal System interfaces extensively with other systems, explaining why signals often overlap:
            </p>

            <p>
              <strong className="text-navy">Stress Response</strong> — The adrenal glands produce both stress hormones and are part of the hormonal system. Chronic nervous system activation depletes hormonal reserves. Cortisol suppresses sex hormones. The distinction: acute activation (Stress) vs. hormonal fuel being depleted (Hormonal).
            </p>

            <p>
              <strong className="text-navy">Energy Production</strong> — Thyroid hormones regulate metabolic rate and cellular energy production. Blood sugar involves both insulin (hormonal) and how cells use glucose (energy). Fatigue improving with food may point to Energy; persisting regardless suggests thyroid or adrenal.
            </p>

            <p>
              <strong className="text-navy">Emotional System</strong> — Hormones directly affect neurotransmitters and mood. The key distinction: do mood changes correlate with cycles, time of day, or life stage (Hormonal) or are they independent and relate to emotional processing (Emotional)?
            </p>

            <p>
              <strong className="text-navy">Temperature System</strong> — Thyroid dysfunction often presents as temperature dysregulation—cold intolerance in hypothyroid, heat intolerance in hyperthyroid. Hot flashes during perimenopause are hormonal signals using the Temperature System as output.
            </p>

            <p>
              <strong className="text-navy">Defense System</strong> — Inflammation affects hormonal function, and hormones affect immune response. Cytokines can disrupt hormonal axes. When fatigue accompanies inflammatory markers (joint pain, frequent illness), Defense and Hormonal may both be involved.
            </p>

            <p>
              <strong className="text-navy">Regeneration System</strong> — Growth hormone, primarily released during sleep, drives tissue repair. Poor recovery may reflect inadequate growth hormone release (Hormonal) or impaired repair processes (Regeneration). Sleep quality affects both systems.
            </p>


            <Suspense fallback={null}>
              <SystemNews system="Hormonal" label="Hormonal" />
            </Suspense>

            <Suspense fallback={null}>
              <SystemDirectory system="Hormonal" label="Hormonal" />
            </Suspense>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your hormonal system orchestrates your biology through chemical messengers coordinating processes across distant organs and tissues. This slow, steady conductor has been refined over hundreds of millions of years of evolution.
              </p>
              <p className="mt-4 italic">
                This decoder is designed for exploration, not diagnosis. The signals listed here are invitations to investigate, not conclusions. Your body&apos;s intelligence is already working. Your role is to listen, learn, and support what it&apos;s trying to tell you.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/energy-production"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Energy Production
            </Link>
            <Link
              href="/systems/hydration"
              className="inline-flex items-center gap-2 text-sm text-[#017ab2] hover:text-navy transition-colors font-medium"
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
