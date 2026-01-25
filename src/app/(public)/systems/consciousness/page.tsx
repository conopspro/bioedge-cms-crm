import { Lightbulb, ArrowLeft, AlertCircle, Search, Sparkles, Play, HelpCircle, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

/**
 * Consciousness System Page
 *
 * Comprehensive guide to the Consciousness biological system.
 * Part of the bioEDGE Decoder 15 Systems Framework.
 */
export default function ConsciousnessSystemPage() {
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
              <Lightbulb className="h-10 w-10 text-gold" />
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white">
                Consciousness System
              </h1>
            </div>
            <p className="text-xl text-white/80">
              Your Body&apos;s Inner Witness
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
                Right now, you are aware. This awareness is not something you learned to do. Before you understood language, before you could name what you were experiencing, something in you was already present, already noticing, already receiving the stream of sensation and perception that constitutes being alive. You did not construct consciousness. It came with your biology.
              </p>
              <p>
                The Consciousness System is your body&apos;s capacity for awareness itself: the quality of your attention, the clarity of your inner observation, the degree to which you can witness your own experience. When this system functions well, thoughts are clear, focus is available, the mind feels spacious rather than cluttered, and you can distinguish between what is actually happening and the stories you&apos;re telling yourself about it.
              </p>
              <p className="font-semibold text-navy">
                What makes this system unique among the fourteen is that it both generates signals and perceives all the others. Every signal from every other system passes through Consciousness to be interpreted.
              </p>
              <p>
                When Consciousness is clouded, foggy, or fragmented, your ability to accurately decode what&apos;s happening in your body diminishes. When it&apos;s clear, you can notice subtleties that would otherwise be missed.
              </p>
              <p>
                This system speaks the language of thought quality, attention capacity, mental clarity, and the felt sense of being present versus absent. When something interferes with consciousness: whether biochemical, neurological, inflammatory, or psychological: you may experience brain fog, difficulty concentrating, racing or intrusive thoughts, a sense of being &quot;not quite here,&quot; or the inability to access your own inner experience. These are signals worth decoding.
              </p>
              <p className="text-electric-blue font-medium">
                Your body already knows how to be aware. The signals you&apos;re receiving about thought quality and mental clarity are communications from a system that wants to function clearly. They are not evidence of weakness or failure, but invitations to investigate what might be interfering with your natural capacity for presence and perception.
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
              Factors to examine that may interfere with consciousness and mental clarity:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Biochemical Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Biochemical Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Blood sugar instability correlating with mental fog or racing thoughts</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Dehydration affecting cognitive clarity</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Nutrient deficiencies (B vitamins, iron, omega-3s) and thought quality</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Hormonal fluctuations affecting mental clarity</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Thyroid function and cognitive processing</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Medications with cognitive side effects</span></li>
                </ul>
              </div>

              {/* Sleep & Recovery Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Sleep &amp; Recovery Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Poor sleep quality affecting next-day mental clarity</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Sleep deprivation and thought organization</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Circadian rhythm disruption and cognitive timing</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Lack of mental rest and recovery time</span></li>
                </ul>
              </div>

              {/* Environmental Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Environmental Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Constant noise or interruption fragmenting attention</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Cluttered or chaotic physical environments affecting mental state</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Poor air quality or ventilation and cognitive function</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Lighting quality affecting alertness and focus</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Temperature extremes and mental clarity</span></li>
                </ul>
              </div>

              {/* Digital & Attention Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Digital &amp; Attention Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Constant context-switching and notification interruption</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Social media patterns fragmenting sustained attention</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Information overload and decision fatigue</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Screen time before sleep affecting mental restoration</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Multi-tasking habits degrading single-task focus</span></li>
                </ul>
              </div>

              {/* Psychological & Emotional Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Psychological &amp; Emotional Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Chronic worry or rumination consuming mental bandwidth</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Unprocessed emotional material creating background noise</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Perfectionism creating mental loops</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Avoidance patterns requiring mental energy to maintain</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Trauma responses affecting presence and awareness</span></li>
                </ul>
              </div>

              {/* Inflammatory & Immune Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Inflammatory &amp; Immune Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Systemic inflammation affecting brain function</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Gut-brain axis disruption and mental clarity</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Chronic infections and cognitive symptoms</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Autoimmune processes with neurological involvement</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Histamine or mast cell activation affecting cognition</span></li>
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
                The Consciousness System communicates through 22 signals across nine categories:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Clarity Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Brain fog / mental cloudiness</li>
                    <li>Difficulty thinking clearly</li>
                    <li>Mental sluggishness</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Attention Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Difficulty concentrating</li>
                    <li>Scattered or fragmented attention</li>
                    <li>Inability to sustain focus</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Thought Quality Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Racing thoughts</li>
                    <li>Intrusive or unwanted thoughts</li>
                    <li>Thought loops / rumination</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Memory &amp; Processing Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Short-term memory problems</li>
                    <li>Word-finding difficulty</li>
                    <li>Slow cognitive processing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Presence Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Dissociation / feeling disconnected</li>
                    <li>Depersonalization / derealization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Mental Energy Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Mental fatigue / cognitive exhaustion</li>
                    <li>Decision fatigue</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Perception Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Sensory overload / overwhelm</li>
                    <li>Difficulty filtering stimuli</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Awareness Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Loss of self-awareness or insight</li>
                    <li>Difficulty accessing inner experience</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Reality Testing Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Confusion about what&apos;s real</li>
                    <li>Difficulty distinguishing thoughts from facts</li>
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
                    <p className="body-text">You sit down to work on something important. Within minutes, your mind is elsewhere. Thoughts intrude. You read the same paragraph three times without absorbing it. The fog descends.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">R</span>
                  <div>
                    <p className="font-heading font-bold text-navy">React</p>
                    <p className="body-text">Frustration. You try harder. You check your phone for a dopamine hit. You get coffee. You force yourself to stare at the screen.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">A</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Assume</p>
                    <p className="body-text">&quot;I must have ADHD.&quot; &quot;I&apos;m just not disciplined.&quot; &quot;I&apos;m getting old.&quot; &quot;Something is wrong with my brain.&quot; &quot;I&apos;m not smart enough for this.&quot; &quot;Everyone else can focus, why can&apos;t I?&quot;</p>
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
                    <p className="body-text">Instead of accepting the story, you investigate: When does this happen most? What did I eat before this? How did I sleep? Is this worse at certain times of day? Does movement help or hurt? Is this related to what I&apos;m trying to focus on, or does it happen regardless of subject? What was I doing for the hour before I sat down? Is there something I&apos;m avoiding that might be creating mental noise?</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">E</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Encode</p>
                    <p className="body-text">Next time, you remember differently. You notice that the fog always comes after a carb-heavy lunch. You see that you can focus in the morning but not after 3pm. You recognize that the intrusive thoughts are about an unresolved conversation. The signal becomes a data point. You adjust accordingly. Clarity returns.</p>
                  </div>
                </div>
              </div>
              <p className="body-text mt-6 text-electric-blue font-medium">
                Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life.
              </p>
            </div>

            {/* Common Mislabels */}
            <div className="be-card">
              <h3 className="font-heading font-bold text-navy mb-4">Common Mislabels</h3>
              <p className="body-text mb-4">
                Consciousness-related signals are frequently attributed to other causes:
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
                      <td className="py-3 pr-4">ADHD, attention deficit disorder</td>
                      <td className="py-3">Blood sugar instability, sleep deficit, or inflammation affecting focus</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Just aging,&quot; &quot;senior moments&quot;</td>
                      <td className="py-3">Hormonal changes, B12 deficiency, or sleep quality affecting cognition</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Depression, lack of motivation</td>
                      <td className="py-3">Cognitive fatigue from chronic inflammation or unresolved stress</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Anxiety disorder, panic</td>
                      <td className="py-3">Racing thoughts from blood sugar crashes or thyroid dysregulation</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Not smart enough,&quot; learning disability</td>
                      <td className="py-3">Processing issues from inadequate sleep or nutritional deficiencies</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Burnout, just need a vacation</td>
                      <td className="py-3">Chronic cognitive overload without adequate mental recovery</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Lazy,&quot; lack of discipline</td>
                      <td className="py-3">Decision fatigue from too many micro-choices or poor energy regulation</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Early dementia concerns</td>
                      <td className="py-3">Reversible cognitive impairment from medication, B12, thyroid, or sleep apnea</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Just stress,&quot; normal modern life</td>
                      <td className="py-3">Chronic activation state preventing cognitive restoration</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Dissociative disorder</td>
                      <td className="py-3">Protective dissociation from chronic pain, illness, or overwhelm</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Sensitive,&quot; &quot;too much&quot;</td>
                      <td className="py-3">Sensory processing differences or nervous system dysregulation</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">OCD, intrusive thought disorder</td>
                      <td className="py-3">Thought loops from unprocessed emotional material or nervous system patterns</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Brain damage,&quot; permanent impairment</td>
                      <td className="py-3">Post-viral cognitive changes or treatable neuroinflammation</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Just need more coffee&quot;</td>
                      <td className="py-3">Circadian rhythm disruption or inadequate restorative sleep</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Personality trait, &quot;scatterbrained&quot;</td>
                      <td className="py-3">Environmental or physiological factors affecting attention capacity</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">&quot;Normal for women,&quot; hormonal</td>
                      <td className="py-3">Treatable hormonal impacts on cognition (perimenopause, thyroid, etc.)</td>
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
              The following are options to explore, not prescriptions. Your body will guide you toward what works.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Awareness Tools */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
                </div>
                <p className="text-sm text-text-light mb-3">Ways to observe and notice:</p>
                <ul className="space-y-3 body-text">
                  <li>Track the timing of mental clarity versus fog throughout the day</li>
                  <li>Notice the relationship between food and cognitive state</li>
                  <li>Observe how sleep quality affects next-day thinking</li>
                  <li>Pay attention to what environments support versus fragment your attention</li>
                  <li>Notice patterns in when racing thoughts or intrusions occur</li>
                  <li>Track how screen time and digital patterns affect mental state</li>
                </ul>
              </div>

              {/* Exploratory Practices */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
                </div>
                <p className="text-sm text-text-light mb-3">Things to try and experiment with:</p>
                <ul className="space-y-3 body-text">
                  <li>Experiment with blood sugar stability (protein with meals, regular eating)</li>
                  <li>Try single-tasking instead of multi-tasking for a week</li>
                  <li>Explore the impact of caffeine timing on focus</li>
                  <li>Consider a digital sunset (no screens 1-2 hours before bed)</li>
                  <li>Experiment with brief meditation or mindfulness practices</li>
                  <li>Try brain dumps (writing everything on your mind) to clear mental clutter</li>
                  <li>Explore movement breaks and their effect on cognitive refreshment</li>
                </ul>
              </div>

              {/* Environmental Adjustments */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
                </div>
                <p className="text-sm text-text-light mb-3">Changes to physical surroundings to consider:</p>
                <ul className="space-y-3 body-text">
                  <li>Create a dedicated focus space with minimal visual clutter</li>
                  <li>Reduce notification interruptions during cognitive work</li>
                  <li>Optimize lighting for alertness (bright during focus, dim in evening)</li>
                  <li>Consider noise management: silence, white noise, or specific soundscapes</li>
                  <li>Ensure adequate ventilation and air quality in work spaces</li>
                </ul>
              </div>

              {/* Professional Resources */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
                </div>
                <p className="text-sm text-text-light mb-3">Types of practitioners who work with this system:</p>
                <ul className="space-y-3 body-text">
                  <li>Neurologists (structural and functional brain issues)</li>
                  <li>Psychiatrists (when cognitive symptoms have psychiatric components)</li>
                  <li>Neuropsychologists (cognitive testing and assessment)</li>
                  <li>Functional medicine practitioners (root cause investigation)</li>
                  <li>Integrative medicine doctors (whole-person approaches)</li>
                  <li>Therapists specializing in cognitive behavioral approaches</li>
                  <li>Meditation teachers or mindfulness instructors</li>
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
              <p className="body-text mb-4">Simple daily anchors:</p>
              <ol className="space-y-4 body-text">
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">1</span>
                  <div><strong className="text-navy">Morning clarity check.</strong> Before reaching for your phone, notice the quality of your mind. Clear? Foggy? Anxious? Calm? This baseline matters.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">2</span>
                  <div><strong className="text-navy">One focused block.</strong> Protect at least one period of uninterrupted focus per day, even if short. Single-task during this time.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">3</span>
                  <div><strong className="text-navy">Movement for mental reset.</strong> When fog descends, move your body before forcing through. Even a few minutes can shift cognitive state.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">4</span>
                  <div><strong className="text-navy">Evening wind-down.</strong> Give your brain transition time before sleep. Reduce stimulation gradually rather than going from screens to pillow.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">5</span>
                  <div><strong className="text-navy">Weekly mental rest.</strong> Schedule genuine cognitive rest: time without input, decisions, or mental demands.</div>
                </li>
              </ol>
            </div>

            {/* Tracking What You Notice */}
            <div className="be-card mb-6">
              <h3 className="font-heading font-bold text-navy mb-4">Tracking What You Notice</h3>
              <p className="body-text mb-4">Observations, not metrics to optimize:</p>
              <ul className="space-y-3 body-text">
                <li>Note when mental clarity is best and worst throughout the day</li>
                <li>Track what you ate before periods of fog or clarity</li>
                <li>Record sleep quality and next-day cognitive impact</li>
                <li>Notice which activities restore mental energy versus deplete it</li>
                <li>Observe patterns in intrusive thoughts or rumination timing</li>
              </ul>
            </div>

            {/* The Patience Principle */}
            <div className="be-card bg-off-white">
              <h3 className="font-heading font-bold text-navy mb-4">The Patience Principle</h3>
              <p className="body-text mb-4">
                Consciousness responds to both immediate interventions and long-term patterns. Some things shift quickly: blood sugar stability can improve mental clarity within hours. Others take time: retraining attention after years of fragmentation requires weeks or months of consistent practice.
              </p>
              <p className="body-text mb-4">
                If you&apos;ve been running on chronic cognitive overload, mental restoration won&apos;t happen in a weekend. If inflammatory processes are involved, resolution takes time. If you&apos;re rebuilding attention capacity, expect gradual improvement rather than sudden transformation.
              </p>
              <p className="text-electric-blue font-medium">
                Trust the process. Your brain has remarkable plasticity. Given the right conditions, clarity can return.
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
              Self-inquiry questions to explore whether a signal originates from Consciousness:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Timing and Patterns</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Does this signal have a time-of-day pattern?</li>
                  <li>Is this related to meals, sleep, or specific activities?</li>
                  <li>Does it come and go, or is it constant?</li>
                  <li>What makes it better? What makes it worse?</li>
                </ul>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Content vs. Capacity</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Is this about WHAT I&apos;m thinking (content) or my ABILITY to think (capacity)?</li>
                  <li>Can I focus on things I enjoy but not things I find boring (content-dependent)?</li>
                  <li>Is my thinking impaired regardless of subject matter (capacity issue)?</li>
                </ul>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Physical vs. Psychological</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Does this feel like a physical fog or an emotional overwhelm?</li>
                  <li>Is there identifiable emotional content driving the mental noise?</li>
                  <li>Does this improve with physical interventions (food, sleep, movement)?</li>
                  <li>Does this improve with psychological interventions (talking, processing, rest)?</li>
                </ul>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">New vs. Lifelong</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Is this new, or has it been present as long as I can remember?</li>
                  <li>Did something change when this started (illness, medication, life event)?</li>
                  <li>Is this a worsening of something that was always there?</li>
                </ul>
              </div>
            </div>

            <div className="be-card mt-6">
              <h3 className="font-heading font-bold text-navy mb-4">Distinguishing from Other Systems</h3>
              <ul className="space-y-3 body-text">
                <li><strong className="text-navy">Observer vs. Content:</strong> Is this about my ability to OBSERVE (Consciousness) or what&apos;s being observed (other systems)?</li>
                <li><strong className="text-navy">Thinking vs. Feeling:</strong> Is this about thought quality (Consciousness) or emotional experience (Emotional System)?</li>
                <li><strong className="text-navy">Mental fatigue vs. Physical fatigue:</strong> Is this cognitive exhaustion (Consciousness) or bodily tiredness (Energy Production)?</li>
                <li><strong className="text-navy">Brain fog vs. Low energy:</strong> Can I think clearly but lack energy, or do I have energy but can&apos;t think clearly?</li>
                <li><strong className="text-navy">Attention vs. Anxiety:</strong> Is my attention scattered because of cognitive impairment (Consciousness) or because of worry and activation (Nervous System)?</li>
                <li><strong className="text-navy">Sleep quality:</strong> Does this trace back primarily to sleep issues (Sleep &amp; Recovery)?</li>
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
              The Consciousness System interfaces with multiple other systems. These connections may be worth exploring:
            </p>

            <div className="grid gap-4">
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Sleep &amp; Recovery System</h4>
                  <p className="body-text">Sleep is when cognitive restoration happens. Poor sleep quality directly impairs next-day consciousness. Many cognitive complaints trace back to inadequate or non-restorative sleep.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Nervous System</h4>
                  <p className="body-text">Chronic stress activation fragments attention and impairs cognitive function. Anxiety creates racing thoughts. The nervous system&apos;s state profoundly affects consciousness quality. Distinguishing between cognitive impairment and nervous system activation is essential.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-pink-accent rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Energy Production System</h4>
                  <p className="body-text">The brain requires enormous amounts of energy. When cellular energy production is compromised, cognitive function often suffers first. Mental fatigue may be a downstream effect of mitochondrial dysfunction.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-deep-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Circulation System</h4>
                  <p className="body-text">Cerebral blood flow is essential for cognition. Brain fog may trace back to inadequate perfusion. Circulation problems that improve with movement may affect cognitive symptoms.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Hormones System</h4>
                  <p className="body-text">Thyroid hormones directly affect cognitive processing speed. Sex hormones influence cognition across the lifespan. Hormonal transitions (perimenopause, andropause) commonly include cognitive symptoms.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Digestion System</h4>
                  <p className="body-text">The gut-brain axis is real. Gut inflammation, dysbiosis, and digestive dysfunction can all manifest as cognitive symptoms. &quot;Brain fog&quot; often has digestive roots.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="be-card be-card-accent text-center">
            <p className="body-text text-navy mb-4">
              Your capacity for awareness is not something you constructed. It came with your biology. The moments of clarity you&apos;ve experienced, the times when thinking was easy and presence was effortless, those are not anomalies. They&apos;re glimpses of what your system is capable of when interference is removed. The signals you&apos;re receiving about thought quality and mental clarity are communications from a system that wants to function clearly.
            </p>
            <p className="text-electric-blue font-medium italic">
              Trust your inner witness. It knows when something is off.
            </p>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border">
            <Link
              href="/systems/circulation"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Circulation
            </Link>
            <Link
              href="/systems/defense"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-pink-accent transition-colors font-medium"
            >
              Next: Defense
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Consciousness System | bioEDGE Decoder",
  description: "Your Body's Inner Witness. The Consciousness System is your body's capacity for awareness itself: the quality of your attention, the clarity of your inner observation, the degree to which you can witness your own experience.",
}
