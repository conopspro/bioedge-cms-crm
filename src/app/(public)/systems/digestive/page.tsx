import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SystemDirectory } from "@/components/directory/system-solutions"

/**
 * Digestive System Page
 *
 * Your Body's Transformation Engine - gut health, microbiome, nutrient absorption
 * Part of the bioEDGE Decoder 15 Systems Framework.
 */
export default function DigestiveSystemPage() {
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
            Digestive System
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Transformation Engine
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
            <a href="#natural-intelligence" className="text-text-light hover:text-navy transition-colors">Natural Intelligence</a>
            <a href="#eliminate" className="text-text-light hover:text-navy transition-colors">Eliminate</a>
            <a href="#decode" className="text-text-light hover:text-navy transition-colors">Decode</a>
            <a href="#gain" className="text-text-light hover:text-navy transition-colors">Gain</a>
            <a href="#execute" className="text-text-light hover:text-navy transition-colors">Execute</a>
            <a href="#questions" className="text-text-light hover:text-navy transition-colors">Questions</a>
            <a href="#connections" className="text-text-light hover:text-navy transition-colors">Connections</a>
            <a href="#directory" className="text-text-light hover:text-navy transition-colors">Directory</a>
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
              Your digestive system governs the transformation of external matter into internal resources. It converts food into nutrients, energy substrates, and signaling molecules that power every cell in your body. This is not simple processing. This is alchemy.
            </p>

            <p>
              <strong className="text-navy">What makes this system unique among the 14 biological systems is its dual identity.</strong> It houses 70-80% of your immune system. It produces 90% of your body&apos;s serotonin. It maintains constant, bidirectional communication with your brain through the gut-brain axis. Your digestive system is not just where food goes. It is a command center for immunity, mood, and cognition.
            </p>

            <p>
              This is your psychophysiological supersystem at work. Your enteric nervous system—sometimes called the &quot;second brain&quot;—contains more neurons than your spinal cord. It communicates with your central nervous system through the vagus nerve. Your gut bacteria produce neurotransmitters that influence how you think and feel. Hormones released after eating signal satiety to your brain while simultaneously affecting insulin sensitivity and energy storage.
            </p>

            <p>
              Your endocrine system, nervous system, and immune system speak the same chemical language in your gut. Affect one, affect them all.
            </p>

            <p>
              You did not learn how to digest food. No one taught you how to extract iron from spinach or break lactose into absorbable sugars. Your body already knows how. This knowledge is encoded in enzymes that activate at precisely the right moment, in peristaltic waves that move contents at exactly the right pace, in a microbial community that has co-evolved with humans for millions of years.
            </p>

            <p>
              When this system works in harmony, you extract maximum nutrition with minimal effort. Food becomes energy without drama. Your mood remains stable. Your mind stays clear. You feel nourished, not just fed.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              The following factors may interfere with digestive function. These are considerations to examine, not causes or diagnoses.
            </p>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Eating while distracted, rushed, or standing</li>
              <li>Eating in a stressed state (away from &quot;rest and digest&quot; mode)</li>
              <li>Irregular meal timing disrupting digestive rhythm</li>
              <li>Lack of physical movement slowing gut motility</li>
              <li>Insufficient chewing before swallowing</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Highly processed foods lacking fiber and enzymes</li>
              <li>Artificial sweeteners affecting gut bacteria and motility</li>
              <li>Inadequate fiber intake affecting bowel regularity</li>
              <li>Eating very large meals overwhelming digestive capacity</li>
              <li>Foods eaten repeatedly without rotation</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Antibiotic exposure altering gut microbiome composition</li>
              <li>NSAIDs and medications affecting gut lining integrity</li>
              <li>Pesticide residues on food influencing gut bacteria</li>
              <li>Chlorinated water affecting microbial balance</li>
              <li>Travel and changes in water sources</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Eating during conflict or emotional distress</li>
              <li>Suppressed emotions manifesting as gut sensations</li>
              <li>Social pressure around food choices creating stress</li>
              <li>Family food patterns established in childhood</li>
              <li>Shame or anxiety about eating activating stress responses</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Eating out of habit rather than hunger</li>
              <li>Mindless eating without attention reducing digestive secretions</li>
              <li>Relying on antacids without investigating underlying patterns</li>
              <li>Pushing through digestive discomfort</li>
              <li>Habitual late-night eating interfering with repair</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Screen use during meals reducing digestive secretions</li>
              <li>Stress from notifications keeping nervous system activated</li>
              <li>Blue light at night affecting circadian rhythms of gut function</li>
              <li>Social media creating complicated relationships with food</li>
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
              The Digestive System communicates through 29 distinct signals across 8 categories:
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Motility Signals (5)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Constipation</li>
              <li>Diarrhea</li>
              <li>Alternating constipation and diarrhea</li>
              <li>Urgency</li>
              <li>Incomplete evacuation</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Pain &amp; Discomfort Signals (6)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Abdominal cramping</li>
              <li>Bloating and abdominal distension</li>
              <li>Gas and flatulence</li>
              <li>Heartburn and acid reflux</li>
              <li>Upper abdominal pain</li>
              <li>Lower abdominal pain</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Nausea &amp; Appetite Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nausea</li>
              <li>Loss of appetite</li>
              <li>Early satiety</li>
              <li>Excessive hunger or insatiable appetite</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Malabsorption &amp; Nutrient Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Undigested food in stool</li>
              <li>Fatty or floating stool</li>
              <li>Nutrient deficiency despite adequate intake</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Gut-Brain Axis Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Anxiety linked to gut symptoms</li>
              <li>Mood changes with gut state</li>
              <li>Brain fog after eating</li>
              <li>Food affecting sleep</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Food Reaction Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Food intolerance reactions</li>
              <li>Post-meal fatigue</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Structural &amp; Functional Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Difficulty swallowing</li>
              <li>Regurgitation</li>
              <li>Excessive belching or burping</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Inflammation &amp; Barrier Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Mucus in stool</li>
              <li>Food sensitivities increasing over time</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You notice bloating thirty minutes after lunch. Your pants feel tight. There&apos;s visible distension in your abdomen.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your body responds automatically. Discomfort. Perhaps self-consciousness. Maybe an urge to cancel evening plans. Your nervous system registers the sensation and begins to react.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> &quot;I have IBS.&quot; &quot;My digestion is broken.&quot; &quot;I shouldn&apos;t have eaten that.&quot; &quot;I&apos;m always going to feel this way.&quot; &quot;I need to go on an elimination diet.&quot; &quot;Maybe I should just stop eating lunch.&quot;
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> You pause. You investigate. What did I eat? Was it what I ate, or how I ate? Was I rushed? Stressed? Distracted? Does this happen with all foods or specific ones? Is there a pattern with certain food combinations? What was my stress level before eating?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> Instead of &quot;I have IBS,&quot; you might encode: &quot;When I eat quickly at my desk while reading emails, I often notice bloating afterward. When I take twenty minutes to eat lunch without screens, I usually feel fine.&quot;
            </p>

            <p>
              Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life. This doesn&apos;t stop with your health. This can apply to your career, your family, your friends, anything.
            </p>

            <h3 className="font-heading font-bold text-navy">Common Mislabels</h3>

            <p>
              Digestive signals are frequently attributed to other causes. The following patterns may be worth exploring:
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
                    <td className="py-3 pr-4">Anxiety or stress</td>
                    <td className="py-3">Gut-brain axis signaling, where gut symptoms may be driving anxiety</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Hypochondria or &quot;making it up&quot;</td>
                    <td className="py-3">Food intolerances that produce real physical responses</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Nervous stomach</td>
                    <td className="py-3">Autonomic nervous system patterns affecting gut motility</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Just bloating</td>
                    <td className="py-3">SIBO or small intestinal bacterial overgrowth patterns</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Need more fiber</td>
                    <td className="py-3">Constipation involving motility, hydration, or gut-brain factors</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Eating disorder</td>
                    <td className="py-3">Gastroparesis or motility issues creating genuine difficulty eating</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Laziness after meals</td>
                    <td className="py-3">Post-meal fatigue indicating malabsorption or food sensitivity</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Normal aging</td>
                    <td className="py-3">Malabsorption patterns that may be addressable</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Fad diet or orthorexia</td>
                    <td className="py-3">Food sensitivities that produce measurable, reproducible symptoms</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Just need to relax</td>
                    <td className="py-3">Functional dyspepsia with structural or motility components</td>
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
              The following are options to explore, not prescriptions. Consider what resonates with your experience.
            </p>

            <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Notice how you feel before eating, not just after</li>
              <li>Observe whether certain foods consistently produce certain sensations</li>
              <li>Pay attention to timing between eating and any signals</li>
              <li>Notice whether gut state correlates with mood or mental clarity</li>
              <li>Track whether eating environment affects how you feel afterward</li>
              <li>Notice the difference between hunger and other signals</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Experiment with eating without screens or distractions</li>
              <li>Try chewing each bite more thoroughly before swallowing</li>
              <li>Take a few breaths before meals to shift into rest state</li>
              <li>Consider whether elimination approach might identify triggers</li>
              <li>Experiment with meal timing and spacing</li>
              <li>Explore whether movement after eating affects your experience</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create a calm eating environment when possible</li>
              <li>Consider the pace at which meals happen in your setting</li>
              <li>Explore which dining settings produce better experiences</li>
              <li>Consider role of conversation and social dynamics during meals</li>
              <li>Evaluate bathroom access and privacy for regular habits</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gastroenterologists for evaluation and testing</li>
              <li>Functional medicine practitioners for comprehensive exploration</li>
              <li>Registered dietitians with GI experience</li>
              <li>Naturopathic physicians for alternative testing</li>
              <li>Psychologists specializing in gut-brain interaction</li>
              <li>Pelvic floor physical therapists for elimination issues</li>
            </ul>

            {/* Execute */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Take action with patience and consistency</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>

            <p>Simple anchors that may support digestive function:</p>

            <ol className="list-decimal pl-6 space-y-3">
              <li><strong className="text-navy">Chew thoroughly.</strong> This is the only part of digestion under your conscious control. Enzymes in saliva begin breaking down food, and mechanical breakdown makes the stomach&apos;s job easier.</li>
              <li><strong className="text-navy">Create a transition before eating.</strong> Even thirty seconds of settling can shift your nervous system toward &quot;rest and digest&quot; mode. A few breaths. Setting down your phone. Noticing the food in front of you.</li>
              <li><strong className="text-navy">Maintain consistency in meal timing.</strong> Your digestive system anticipates food based on patterns. Irregular timing may reduce enzyme readiness.</li>
              <li><strong className="text-navy">Move your body.</strong> Physical activity supports gut motility. Even a short walk can make a difference.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <p>Keep observations simple:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>What did you eat? How did you eat it? What did you notice afterward?</li>
              <li>Over time, patterns may emerge that aren&apos;t obvious in the moment</li>
              <li>Notice without judgment—every observation is useful data</li>
              <li>Consider tracking food, stress, sleep, and digestive signals together</li>
              <li>The connections between them often reveal more than any single factor</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              The gut microbiome may take weeks to months to shift with dietary changes. Motility patterns established over years may require sustained consistency before changing. The gut lining, if compromised, may need extended time to rebuild. Improvements often come in waves rather than linear progressions.
            </p>

            <p>
              Consistency matters more than intensity. A sustainable change maintained for months will likely produce more benefit than a dramatic intervention abandoned after two weeks.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              These questions may help you explore whether a signal originates from the Digestive System:
            </p>

            <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Is there a clear relationship to food or eating?</li>
              <li>Does the signal involve sensations in the GI tract?</li>
              <li>Is there a relationship to bowel function?</li>
              <li>Are there other GI signals present (bloating, gas, nausea, pain)?</li>
              <li>Does the signal improve with dietary changes or elimination?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Deeper Investigation</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Does stress produce gut symptoms specifically?</li>
              <li>Did this start after a GI event (food poisoning, antibiotics)?</li>
              <li>Does eating any food produce fatigue, or only specific foods?</li>
              <li>Is brain fog specifically post-meal or food-triggered?</li>
              <li>Do mood changes correlate with gut symptoms or food intake?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Distinguishing Overlaps</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-navy">Fatigue after high-carb meals</strong> → May involve both Digestive and Energy Production (blood sugar)</li>
              <li><strong className="text-navy">Gut symptoms driving anxiety</strong> → Digestive through gut-brain axis</li>
              <li><strong className="text-navy">Anxiety producing gut symptoms</strong> → Stress Response affecting digestion</li>
              <li><strong className="text-navy">Food sensitivities with immune activation</strong> → Overlap with Defense System</li>
              <li><strong className="text-navy">Mood changes following gut state</strong> → Digestive through serotonin/microbiome</li>
              <li><strong className="text-navy">Mood changes independent of gut</strong> → Consider Emotional or Hormonal</li>
            </ul>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              The Digestive System interfaces with multiple other systems through the gut-brain axis and immune connection:
            </p>

            <p>
              <strong className="text-navy">Energy Production</strong> — Blood sugar fluctuations after eating may produce signals that overlap with or compound digestive signals. Fatigue after high-carbohydrate meals may involve both systems.
            </p>

            <p>
              <strong className="text-navy">Stress Response</strong> — The gut-brain axis means stress directly affects gut function, and gut dysfunction can trigger stress responses. Separating top-down (brain affecting gut) from bottom-up (gut affecting brain) helps clarify origin.
            </p>

            <p>
              <strong className="text-navy">Defense System</strong> — 70-80% of immune tissue resides in the gut. Gut inflammation may trigger systemic immune activation. Food sensitivities may involve immune response. The line between Digestive and Defense often blurs.
            </p>

            <p>
              <strong className="text-navy">Emotional System</strong> — Mood changes may originate in the gut through serotonin production and microbiome signaling. Emotional states also affect digestive function. The relationship flows both directions.
            </p>

            <p>
              <strong className="text-navy">Detoxification</strong> — The liver processes nutrients absorbed from the gut and clears toxins. Sluggish detoxification may produce signals that seem digestive. The gut is also an elimination pathway.
            </p>

            <p>
              <strong className="text-navy">Consciousness</strong> — Brain fog may originate from gut inflammation, food reactions, or nutrient malabsorption. When cognitive symptoms consistently follow eating, the gut-brain axis deserves exploration.
            </p>


            <Suspense fallback={null}>
              <SystemDirectory system="Digestive" label="Digestive" />
            </Suspense>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your digestive system is not just where food goes. It is a command center for immunity, mood, and cognition—a transformation engine that has been refined over millions of years of evolution.
              </p>
              <p className="mt-4 italic">
                When this system works in harmony, you extract maximum nutrition with minimal effort. Food becomes energy without drama. You feel nourished, not just fed.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/detoxification"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Detoxification
            </Link>
            <Link
              href="/systems/emotional"
              className="inline-flex items-center gap-2 text-sm text-[#017ab2] hover:text-navy transition-colors font-medium"
            >
              Next: Emotional
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Digestive System | bioEDGE Decoder",
  description: "Your Body's Transformation Engine. The Digestive System converts food into nutrients, energy substrates, and signaling molecules—housing 70-80% of your immune system and producing 90% of your serotonin.",
}
