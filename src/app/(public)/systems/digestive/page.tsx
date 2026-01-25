import { Apple, ArrowLeft, AlertCircle, Search, Sparkles, Play, HelpCircle, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

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
            <div className="flex items-center gap-3 mb-4">
              <Apple className="h-10 w-10 text-gold" />
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white">
                Digestive System
              </h1>
            </div>
            <p className="text-xl text-white/80">
              Your Body&apos;s Transformation Engine
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
                Your digestive system governs the transformation of external matter into internal resources. It converts food into nutrients, energy substrates, and signaling molecules that power every cell in your body. This is not simple processing. This is alchemy.
              </p>
              <p className="font-semibold text-navy">
                What makes this system unique among the 14 biological systems is its dual identity. It houses 70-80% of your immune system. It produces 90% of your body&apos;s serotonin. It maintains constant, bidirectional communication with your brain through the gut-brain axis. Your digestive system is not just where food goes. It is a command center for immunity, mood, and cognition.
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
              <p className="text-electric-blue font-medium">
                When this system works in harmony, you extract maximum nutrition with minimal effort. Food becomes energy without drama. Your mood remains stable. Your mind stays clear. You feel nourished, not just fed.
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
              The following factors may interfere with digestive function. These are considerations to examine, not causes or diagnoses.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Lifestyle Factors */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Lifestyle Factors</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Eating while distracted, rushed, or standing</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Eating in a stressed state (away from &quot;rest and digest&quot; mode)</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Irregular meal timing disrupting digestive rhythm</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Lack of physical movement slowing gut motility</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Insufficient chewing before swallowing</span></li>
                </ul>
              </div>

              {/* Dietary Considerations */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Dietary Considerations</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Highly processed foods lacking fiber and enzymes</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Artificial sweeteners affecting gut bacteria and motility</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Inadequate fiber intake affecting bowel regularity</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Eating very large meals overwhelming digestive capacity</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Foods eaten repeatedly without rotation</span></li>
                </ul>
              </div>

              {/* Environmental Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Environmental Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Antibiotic exposure altering gut microbiome composition</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>NSAIDs and medications affecting gut lining integrity</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Pesticide residues on food influencing gut bacteria</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Chlorinated water affecting microbial balance</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Travel and changes in water sources</span></li>
                </ul>
              </div>

              {/* Relationship & Emotional Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Relationship &amp; Emotional Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Eating during conflict or emotional distress</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Suppressed emotions manifesting as gut sensations</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Social pressure around food choices creating stress</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Family food patterns established in childhood</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Shame or anxiety about eating activating stress responses</span></li>
                </ul>
              </div>

              {/* Habitual Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Habitual Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Eating out of habit rather than hunger</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Mindless eating without attention reducing digestive secretions</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Relying on antacids without investigating underlying patterns</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Pushing through digestive discomfort</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Habitual late-night eating interfering with repair</span></li>
                </ul>
              </div>

              {/* Digital Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Digital Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Screen use during meals reducing digestive secretions</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Stress from notifications keeping nervous system activated</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Blue light at night affecting circadian rhythms of gut function</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Social media creating complicated relationships with food</span></li>
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
                The Digestive System communicates through 29 distinct signals across 8 categories:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Motility Signals (5)</h4>
                  <ul className="body-text space-y-1">
                    <li>Constipation</li>
                    <li>Diarrhea</li>
                    <li>Alternating constipation and diarrhea</li>
                    <li>Urgency</li>
                    <li>Incomplete evacuation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Pain &amp; Discomfort Signals (6)</h4>
                  <ul className="body-text space-y-1">
                    <li>Abdominal cramping</li>
                    <li>Bloating and abdominal distension</li>
                    <li>Gas and flatulence</li>
                    <li>Heartburn and acid reflux</li>
                    <li>Upper abdominal pain</li>
                    <li>Lower abdominal pain</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Nausea &amp; Appetite Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Nausea</li>
                    <li>Loss of appetite</li>
                    <li>Early satiety</li>
                    <li>Excessive hunger or insatiable appetite</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Malabsorption &amp; Nutrient Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Undigested food in stool</li>
                    <li>Fatty or floating stool</li>
                    <li>Nutrient deficiency despite adequate intake</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Gut-Brain Axis Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Anxiety linked to gut symptoms</li>
                    <li>Mood changes with gut state</li>
                    <li>Brain fog after eating</li>
                    <li>Food affecting sleep</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Food Reaction Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Food intolerance reactions</li>
                    <li>Post-meal fatigue</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Structural &amp; Functional Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Difficulty swallowing</li>
                    <li>Regurgitation</li>
                    <li>Excessive belching or burping</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Inflammation &amp; Barrier Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Mucus in stool</li>
                    <li>Food sensitivities increasing over time</li>
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
                    <p className="body-text">You notice bloating thirty minutes after lunch. Your pants feel tight. There&apos;s visible distension in your abdomen.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">R</span>
                  <div>
                    <p className="font-heading font-bold text-navy">React</p>
                    <p className="body-text">Your body responds automatically. Discomfort. Perhaps self-consciousness. Maybe an urge to cancel evening plans. Your nervous system registers the sensation and begins to react.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">A</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Assume</p>
                    <p className="body-text">&quot;I have IBS.&quot; &quot;My digestion is broken.&quot; &quot;I shouldn&apos;t have eaten that.&quot; &quot;I&apos;m always going to feel this way.&quot; &quot;I need to go on an elimination diet.&quot; &quot;Maybe I should just stop eating lunch.&quot;</p>
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
                    <p className="body-text">You pause. You investigate. What did I eat? Was it what I ate, or how I ate? Was I rushed? Stressed? Distracted? Does this happen with all foods or specific ones? Is there a pattern with certain food combinations? What was my stress level before eating?</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">E</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Encode</p>
                    <p className="body-text">Instead of &quot;I have IBS,&quot; you might encode: &quot;When I eat quickly at my desk while reading emails, I often notice bloating afterward. When I take twenty minutes to eat lunch without screens, I usually feel fine.&quot;</p>
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
                Digestive signals are frequently attributed to other causes. The following patterns may be worth exploring:
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
            </div>
          </section>

          {/* Section 4: Gain */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">4</span>
              <h2 className="section-title">Gain</h2>
            </div>
            <p className="body-text mb-6">
              The following are options to explore, not prescriptions. Consider what resonates with your experience.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Awareness Tools */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Notice how you feel before eating, not just after</li>
                  <li>Observe whether certain foods consistently produce certain sensations</li>
                  <li>Pay attention to timing between eating and any signals</li>
                  <li>Notice whether gut state correlates with mood or mental clarity</li>
                  <li>Track whether eating environment affects how you feel afterward</li>
                  <li>Notice the difference between hunger and other signals</li>
                </ul>
              </div>

              {/* Exploratory Practices */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Experiment with eating without screens or distractions</li>
                  <li>Try chewing each bite more thoroughly before swallowing</li>
                  <li>Take a few breaths before meals to shift into rest state</li>
                  <li>Consider whether elimination approach might identify triggers</li>
                  <li>Experiment with meal timing and spacing</li>
                  <li>Explore whether movement after eating affects your experience</li>
                </ul>
              </div>

              {/* Environmental Adjustments */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Apple className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Create a calm eating environment when possible</li>
                  <li>Consider the pace at which meals happen in your setting</li>
                  <li>Explore which dining settings produce better experiences</li>
                  <li>Consider role of conversation and social dynamics during meals</li>
                  <li>Evaluate bathroom access and privacy for regular habits</li>
                </ul>
              </div>

              {/* Professional Resources */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Gastroenterologists for evaluation and testing</li>
                  <li>Functional medicine practitioners for comprehensive exploration</li>
                  <li>Registered dietitians with GI experience</li>
                  <li>Naturopathic physicians for alternative testing</li>
                  <li>Psychologists specializing in gut-brain interaction</li>
                  <li>Pelvic floor physical therapists for elimination issues</li>
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
                  <div><strong className="text-navy">Chew thoroughly.</strong> This is the only part of digestion under your conscious control. Enzymes in saliva begin breaking down food, and mechanical breakdown makes the stomach&apos;s job easier.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">2</span>
                  <div><strong className="text-navy">Create a transition before eating.</strong> Even thirty seconds of settling can shift your nervous system toward &quot;rest and digest&quot; mode. A few breaths. Setting down your phone. Noticing the food in front of you.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">3</span>
                  <div><strong className="text-navy">Maintain consistency in meal timing.</strong> Your digestive system anticipates food based on patterns. Irregular timing may reduce enzyme readiness.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">4</span>
                  <div><strong className="text-navy">Move your body.</strong> Physical activity supports gut motility. Even a short walk can make a difference.</div>
                </li>
              </ol>
            </div>

            {/* Tracking What You Notice */}
            <div className="be-card mb-6">
              <h3 className="font-heading font-bold text-navy mb-4">Tracking What You Notice</h3>
              <p className="body-text mb-4">Keep observations simple:</p>
              <ul className="space-y-3 body-text">
                <li>What did you eat? How did you eat it? What did you notice afterward?</li>
                <li>Over time, patterns may emerge that aren&apos;t obvious in the moment</li>
                <li>Notice without judgment—every observation is useful data</li>
                <li>Consider tracking food, stress, sleep, and digestive signals together</li>
                <li>The connections between them often reveal more than any single factor</li>
              </ul>
            </div>

            {/* The Patience Principle */}
            <div className="be-card bg-off-white">
              <h3 className="font-heading font-bold text-navy mb-4">The Patience Principle</h3>
              <p className="body-text mb-4">
                The gut microbiome may take weeks to months to shift with dietary changes. Motility patterns established over years may require sustained consistency before changing. The gut lining, if compromised, may need extended time to rebuild. Improvements often come in waves rather than linear progressions.
              </p>
              <p className="text-electric-blue font-medium">
                Consistency matters more than intensity. A sustainable change maintained for months will likely produce more benefit than a dramatic intervention abandoned after two weeks.
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
              These questions may help you explore whether a signal originates from the Digestive System:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
                </div>
                <ol className="space-y-3 body-text list-decimal list-inside">
                  <li>Is there a clear relationship to food or eating?</li>
                  <li>Does the signal involve sensations in the GI tract?</li>
                  <li>Is there a relationship to bowel function?</li>
                  <li>Are there other GI signals present (bloating, gas, nausea, pain)?</li>
                  <li>Does the signal improve with dietary changes or elimination?</li>
                </ol>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Deeper Investigation</h3>
                </div>
                <ol className="space-y-3 body-text list-decimal list-inside">
                  <li>Does stress produce gut symptoms specifically?</li>
                  <li>Did this start after a GI event (food poisoning, antibiotics)?</li>
                  <li>Does eating any food produce fatigue, or only specific foods?</li>
                  <li>Is brain fog specifically post-meal or food-triggered?</li>
                  <li>Do mood changes correlate with gut symptoms or food intake?</li>
                </ol>
              </div>
            </div>

            <div className="be-card mt-6">
              <h3 className="font-heading font-bold text-navy mb-4">Distinguishing Overlaps</h3>
              <ul className="space-y-3 body-text">
                <li><strong className="text-navy">Fatigue after high-carb meals</strong> → May involve both Digestive and Energy Production (blood sugar)</li>
                <li><strong className="text-navy">Gut symptoms driving anxiety</strong> → Digestive through gut-brain axis</li>
                <li><strong className="text-navy">Anxiety producing gut symptoms</strong> → Stress Response affecting digestion</li>
                <li><strong className="text-navy">Food sensitivities with immune activation</strong> → Overlap with Defense System</li>
                <li><strong className="text-navy">Mood changes following gut state</strong> → Digestive through serotonin/microbiome</li>
                <li><strong className="text-navy">Mood changes independent of gut</strong> → Consider Emotional or Hormonal</li>
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
              The Digestive System interfaces with multiple other systems through the gut-brain axis and immune connection:
            </p>

            <div className="grid gap-4">
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Energy Production</h4>
                  <p className="body-text">Blood sugar fluctuations after eating may produce signals that overlap with or compound digestive signals. Fatigue after high-carbohydrate meals may involve both systems.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Stress Response</h4>
                  <p className="body-text">The gut-brain axis means stress directly affects gut function, and gut dysfunction can trigger stress responses. Separating top-down (brain affecting gut) from bottom-up (gut affecting brain) helps clarify origin.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-pink-accent rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Defense System</h4>
                  <p className="body-text">70-80% of immune tissue resides in the gut. Gut inflammation may trigger systemic immune activation. Food sensitivities may involve immune response. The line between Digestive and Defense often blurs.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-deep-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Emotional System</h4>
                  <p className="body-text">Mood changes may originate in the gut through serotonin production and microbiome signaling. Emotional states also affect digestive function. The relationship flows both directions.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Detoxification</h4>
                  <p className="body-text">The liver processes nutrients absorbed from the gut and clears toxins. Sluggish detoxification may produce signals that seem digestive. The gut is also an elimination pathway.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Consciousness</h4>
                  <p className="body-text">Brain fog may originate from gut inflammation, food reactions, or nutrient malabsorption. When cognitive symptoms consistently follow eating, the gut-brain axis deserves exploration.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="be-card be-card-accent text-center">
            <p className="body-text text-navy mb-4">
              Your digestive system is not just where food goes. It is a command center for immunity, mood, and cognition—a transformation engine that has been refined over millions of years of evolution.
            </p>
            <p className="body-text italic">
              When this system works in harmony, you extract maximum nutrition with minimal effort. Food becomes energy without drama. You feel nourished, not just fed.
            </p>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border">
            <Link
              href="/systems/detoxification"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Detoxification
            </Link>
            <Link
              href="/systems/emotional"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-pink-accent transition-colors font-medium"
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
