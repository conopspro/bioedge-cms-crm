import { Wind, ArrowLeft, AlertCircle, Search, Sparkles, Play, HelpCircle, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

/**
 * Breath System Page
 *
 * Comprehensive guide to the Breath biological system.
 * Part of the bioEDGE Decoder 15 Systems Framework.
 */
export default function BreathSystemPage() {
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
              <Wind className="h-10 w-10 text-gold" />
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white">
                Breath System
              </h1>
            </div>
            <p className="text-xl text-white/80">
              Your Body&apos;s Bridge
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
                Right now, as you read this, your lungs expand without permission. Your diaphragm contracts and releases. Oxygen crosses membranes into your bloodstream while carbon dioxide flows the opposite direction. All of this happens in the time it takes to finish this sentence.
              </p>
              <p>
                The Breath System governs oxygen delivery, carbon dioxide removal, and blood pH regulation. It delivers what every cell requires and removes what would become toxic if accumulated. But this system does something no other vital function can do.
              </p>
              <p className="font-semibold text-navy">
                The Breath System bridges. It is the only vital function that operates both automatically (you breathe while sleeping) and consciously (you can choose to hold your breath right now). This unique dual-control makes breath the primary access point for influencing your autonomic nervous system.
              </p>
              <p>
                Your body operates as a unified intelligence network. Scientists call this the psychophysiological supersystem: your endocrine system, nervous system, and immune system communicating constantly through shared chemical messengers. They speak the same language. And breath is the only place where you get to participate in the conversation.
              </p>
              <p>
                Beyond gas exchange, your breathing pattern directly affects heart rate, blood pressure, nervous system state, and blood chemistry. A dysfunctional breathing pattern can create signals that mimic anxiety, fatigue, and cognitive impairment. The intelligence required for respiration has been refined over half a billion years of evolution.
              </p>
              <p className="text-electric-blue font-medium">
                Your body already knows how to breathe. The question is whether anything has interfered with this knowing.
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
              The following factors may be worth examining. These are not causes or diagnoses: they are considerations for investigation.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Lifestyle Factors */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Lifestyle Factors</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Prolonged sitting or desk work, which may compress the diaphragm and restrict breath depth</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Physical inactivity, which may reduce respiratory fitness and capacity</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Sleep position patterns, particularly back sleeping which may contribute to airway issues</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Wearing tight clothing or restrictive garments around the chest or abdomen</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Chronic rushing or time pressure, which may elevate baseline breathing rate</span></li>
                </ul>
              </div>

              {/* Dietary Considerations */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Dietary Considerations</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Foods that may contribute to nasal congestion or mucus production</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Alcohol consumption, particularly before sleep, which may relax airway muscles</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Large meals close to bedtime, which may restrict diaphragm movement</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Food sensitivities that may trigger inflammatory responses affecting airways</span></li>
                </ul>
              </div>

              {/* Environmental Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Environmental Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Poor indoor air quality, dust, mold, or volatile organic compounds</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Dry air that may irritate nasal passages and promote mouth breathing</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Allergens in home or work environment</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Altitude changes if recently relocated</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Temperature extremes that may affect breathing comfort</span></li>
                </ul>
              </div>

              {/* Relationship & Emotional Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Relationship &amp; Emotional Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Chronic interpersonal tension, which may maintain elevated stress breathing</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Suppressed emotional expression, which may manifest as breath holding or chest constriction</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Environments where deep sighing or audible breathing feels unsafe</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Relationships that require constant vigilance or guardedness</span></li>
                </ul>
              </div>

              {/* Habitual Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Habitual Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Chronic mouth breathing established in childhood</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Habitual breath holding during concentration or stress</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Upper chest breathing pattern that has become automatic</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Sighing or yawning patterns that may indicate chronic over-breathing</span></li>
                </ul>
              </div>

              {/* Digital Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Digital Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>&quot;Email apnea&quot;: unconscious breath holding during screen use</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Forward head posture from device use compressing the chest</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Shallow breathing during focused screen work</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Notification patterns that may repeatedly trigger stress breathing</span></li>
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
                The Breath System produces 25 signals across 8 categories. These represent patterns your body may be communicating through respiration.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Breathing Pattern Signals (5)</h4>
                  <ul className="body-text space-y-1">
                    <li>Shallow Breathing / Insufficient Breath Depth</li>
                    <li>Rapid Breathing / Over-Breathing</li>
                    <li>Breath Holding / Unconscious Apnea</li>
                    <li>Excessive Sighing / Air Hunger</li>
                    <li>Irregular Breathing Rhythm</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Oxygenation &amp; Gas Exchange (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Breathlessness at Rest / Dyspnea</li>
                    <li>Exercise Intolerance / Early Breathlessness</li>
                    <li>Excessive Yawning</li>
                    <li>Light-Headedness from Breathing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Blood Chemistry &amp; pH Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Tingling / Numbness from Hyperventilation</li>
                    <li>Chronic Mild Alkalosis Symptoms</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Sleep-Related Breath Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Waking Gasping or Choking</li>
                    <li>Snoring</li>
                    <li>Non-Restorative Sleep / Morning Fatigue</li>
                    <li>Morning Headaches</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Mechanical &amp; Structural (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Chest Tightness Related to Breathing</li>
                    <li>Throat Tightness / Constricted Airway Feeling</li>
                    <li>Diaphragm Dysfunction / Can&apos;t Breathe Into Belly</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Mouth Breathing &amp; Nasal Function (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Chronic Mouth Breathing</li>
                    <li>Nasal Congestion Affecting Breathing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Autonomic Bridge Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Breathing Doesn&apos;t Calm Me Down</li>
                    <li>Lost Connection to Breath</li>
                    <li>Breath Responds to Stress But Won&apos;t Recover</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Conscious Control Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Can&apos;t Stop Thinking About Breathing</li>
                    <li>Feel Like I&apos;m Not Getting Enough Air</li>
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
                    <p className="body-text">You notice you&apos;ve been sighing repeatedly for the past hour. Each sigh feels unsatisfying, like you can&apos;t quite get a full breath.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">R</span>
                  <div>
                    <p className="font-heading font-bold text-navy">React</p>
                    <p className="body-text">Your body tries to take deeper breaths. You yawn. You feel your chest tighten slightly. A vague unease settles in.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">A</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Assume</p>
                    <p className="body-text">&quot;Something is wrong with my lungs.&quot; &quot;I&apos;m not getting enough oxygen.&quot; &quot;I&apos;m having a panic attack.&quot; &quot;My asthma is flaring up.&quot; &quot;I&apos;m out of shape.&quot; &quot;This is my anxiety.&quot;</p>
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
                    <p className="body-text">&quot;What is my breathing rate right now?&quot; &quot;Am I breathing through my mouth or nose?&quot; &quot;Does my belly expand when I breathe, or only my chest?&quot; &quot;Did I notice my breathing before I felt anxious, or after?&quot; &quot;What happens if I breathe less, not more?&quot; &quot;How long can I comfortably hold my breath after a normal exhale?&quot;</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">E</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Encode</p>
                    <p className="body-text">You discover that deliberately slowing your breathing and extending your exhale reduces the air hunger. You notice that the sighing started during a stressful email exchange. You remember that taking bigger breaths made it worse, not better. The signal isn&apos;t telling you that you need more air. It may be telling you that you&apos;re already over-breathing.</p>
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
                Breath-related signals are frequently attributed to other causes. The following patterns may be worth exploring:
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
                      <td className="py-3 pr-4">Anxiety disorder, panic disorder</td>
                      <td className="py-3">Chronic hyperventilation pattern driving physical symptoms</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Need more cardio,&quot; &quot;out of shape&quot;</td>
                      <td className="py-3">Air hunger from CO2 depletion (paradoxically from over-breathing)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Just stressed,&quot; &quot;need to relax&quot;</td>
                      <td className="py-3">Breath holding during work/screens (email apnea)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Depression, laziness, &quot;not a morning person&quot;</td>
                      <td className="py-3">Morning fatigue from sleep disordered breathing</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Neurological problem, nerve damage</td>
                      <td className="py-3">Tingling from respiratory alkalosis (hyperventilation)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Breathwork doesn&apos;t work for me&quot;</td>
                      <td className="py-3">Chronic over-breather who needs LESS breathing, not more</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Allergies, &quot;just how I breathe&quot;</td>
                      <td className="py-3">Chronic mouth breathing habit established early in life</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Heart problem, psychosomatic</td>
                      <td className="py-3">Chest tightness from respiratory pattern dysfunction</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Low blood sugar, inner ear issue</td>
                      <td className="py-3">Light-headedness from breathing pattern and CO2 imbalance</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Nightmares, night terrors</td>
                      <td className="py-3">Waking gasping from airway events during sleep</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">&quot;Normal,&quot; &quot;harmless quirk&quot;</td>
                      <td className="py-3">Snoring indicating partial airway obstruction during sleep</td>
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
                <ul className="space-y-3 body-text">
                  <li>Noticing whether you breathe through your mouth or nose throughout the day</li>
                  <li>Observing whether your belly or chest moves when you breathe at rest</li>
                  <li>Counting your breathing rate at rest (breaths per minute)</li>
                  <li>Checking in on your breath during screen work, stressful moments, and transitions</li>
                  <li>The BOLT test (Body Oxygen Level Test): timing comfortable breath-hold after normal exhale</li>
                  <li>Noticing when sighing or yawning increases</li>
                  <li>Asking a partner or family member if they notice snoring, mouth breathing, or breath holding</li>
                </ul>
              </div>

              {/* Exploratory Practices */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Diaphragmatic breathing practice (belly rises on inhale)</li>
                  <li>Extended exhale breathing (exhale longer than inhale)</li>
                  <li>Nasal breathing during light activity</li>
                  <li>Coherent breathing (rhythmic, balanced breath patterns)</li>
                  <li>Humming or &quot;om&quot; practice (extends exhale, stimulates vagus nerve)</li>
                  <li>Light physical movement with attention to breath</li>
                  <li>Gentle breath reduction practices (for those who may be chronic over-breathers)</li>
                </ul>
              </div>

              {/* Environmental Adjustments */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Wind className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Improving air quality (plants, air filters, reducing chemical products)</li>
                  <li>Humidifying dry environments</li>
                  <li>Reducing allergen exposure in sleeping environment</li>
                  <li>Mouth taping during sleep (with appropriate precautions)</li>
                  <li>Elevating head position during sleep if indicated</li>
                  <li>Creating breath-awareness reminders in work environment</li>
                </ul>
              </div>

              {/* Professional Resources */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Breathing educators and Buteyko practitioners</li>
                  <li>Sleep medicine specialists (if sleep disordered breathing is suspected)</li>
                  <li>Myofunctional therapists (for mouth breathing and tongue position)</li>
                  <li>Respiratory therapists</li>
                  <li>ENT specialists (if structural nasal issues are present)</li>
                  <li>Pulmonologists (for evaluation of respiratory function)</li>
                  <li>Yoga therapists with focus on pranayama</li>
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
              <p className="body-text mb-4">Simple anchors that may support breath awareness:</p>
              <ol className="space-y-4 body-text">
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">1</span>
                  <div><strong className="text-navy">Morning breath check.</strong> Before getting out of bed, notice your breathing. Is it through your nose? Does your belly move? What is its rhythm?</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">2</span>
                  <div><strong className="text-navy">Transition breaths.</strong> Before starting a new activity, take three conscious breaths through your nose into your belly.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">3</span>
                  <div><strong className="text-navy">Screen awareness.</strong> Set a reminder to check your breathing every 30-60 minutes during screen work.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">4</span>
                  <div><strong className="text-navy">Evening wind-down.</strong> Five minutes of extended exhale breathing before sleep.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">5</span>
                  <div><strong className="text-navy">Nasal breathing default.</strong> Notice when you switch to mouth breathing and gently return to nasal.</div>
                </li>
              </ol>
            </div>

            {/* Tracking What You Notice */}
            <div className="be-card mb-6">
              <h3 className="font-heading font-bold text-navy mb-4">Tracking What You Notice</h3>
              <p className="body-text mb-4">These are observations, not metrics to optimize:</p>
              <ul className="space-y-3 body-text">
                <li>When does air hunger or sighing increase?</li>
                <li>What is your resting breathing rate at different times of day?</li>
                <li>How long is your comfortable breath-hold after normal exhale (BOLT)?</li>
                <li>Do you wake with dry mouth, indicating mouth breathing during sleep?</li>
                <li>When does chest tightness or throat constriction appear?</li>
                <li>How quickly does your breathing return to baseline after stress?</li>
                <li>What activities or environments change your breathing pattern?</li>
              </ul>
            </div>

            {/* The Patience Principle */}
            <div className="be-card bg-off-white">
              <h3 className="font-heading font-bold text-navy mb-4">The Patience Principle</h3>
              <p className="body-text mb-4">
                Breathing patterns may have developed over years or decades. If chronic over-breathing or dysfunctional patterns are present, the respiratory centers have adapted to that baseline.
              </p>
              <p className="body-text mb-4">
                Changing these patterns requires time for the body to recalibrate its CO2 tolerance and for new habits to become automatic. Some people notice shifts within days. For others, weeks or months of consistent practice may be needed before the changes integrate.
              </p>
              <p className="text-electric-blue font-medium">
                Consistency matters more than intensity. Three minutes of breath awareness daily will likely serve you better than an hour once a week.
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
              These questions may help you explore whether signals originate from the Breath System:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
                </div>
                <ol className="space-y-3 body-text list-decimal list-inside">
                  <li>Is this signal directly related to breathing pattern, rate, or depth?</li>
                  <li>Does consciously changing your breathing pattern affect this signal?</li>
                  <li>Does the signal involve sensations of air hunger, suffocation, or inability to get enough air?</li>
                  <li>Are there observable signs (snoring, visible chest-only breathing, breath holding)?</li>
                  <li>Does slowing your breathing or switching to nasal breathing change the signal?</li>
                </ol>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Deeper Investigation</h3>
                </div>
                <ol className="space-y-3 body-text list-decimal list-inside">
                  <li>Is the signal paradoxically worse at rest than during activity? (Classic hyperventilation pattern)</li>
                  <li>Have you tried breathwork and found it made things worse? (May need LESS breathing, not more)</li>
                  <li>Is sleep quality poor with snoring, gasping awake, or morning headaches?</li>
                  <li>Does physical exertion trigger the signal, with breathing being the limiting factor?</li>
                  <li>Does stress trigger the signal AND does it persist long after the stressor resolves?</li>
                </ol>
              </div>
            </div>

            <div className="be-card mt-6">
              <h3 className="font-heading font-bold text-navy mb-4">Distinguishing from Other Systems</h3>
              <ul className="space-y-3 body-text">
                <li><strong className="text-navy">Could this be Nervous System?</strong> Stress affects the whole nervous system. If only breathing pattern seems involved, it may be Breath.</li>
                <li><strong className="text-navy">Could this be Circulation?</strong> Does the signal include heart symptoms, swelling, or circulation-related patterns?</li>
                <li><strong className="text-navy">Could this be Energy Production?</strong> Does eating improve the signal? (Points to Energy, not Breath.)</li>
                <li><strong className="text-navy">Could this be Immunity?</strong> Are there allergic triggers, wheezing, or inflammatory patterns?</li>
                <li><strong className="text-navy">Could this be Emotional?</strong> Does the signal carry specific emotional content, or is it purely physical?</li>
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
              The Breath System interfaces with multiple other systems. These connections may be worth exploring:
            </p>

            <div className="grid gap-4">
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Nervous System</h4>
                  <p className="body-text">Breath is the primary conscious access point for shifting nervous system state. Breathing pattern may drive stress symptoms rather than result from them.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Circulation</h4>
                  <p className="body-text">Breathing rate and depth affect heart rate and blood pressure. Breathlessness may originate in either system and requires distinguishing questions.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-pink-accent rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Energy Production</h4>
                  <p className="body-text">Oxygen delivery supports cellular energy production. Chronic hyperventilation can contribute to fatigue. Fatigue from breathing issues may improve with pattern correction.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-deep-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Sleep &amp; Recovery</h4>
                  <p className="body-text">Sleep disordered breathing directly impairs restorative sleep. Morning fatigue may originate in overnight breathing patterns.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Emotional</h4>
                  <p className="body-text">Unexpressed emotion can manifest as breath holding, chest constriction, or throat tightness. Emotional release may shift breathing patterns.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Immunity</h4>
                  <p className="body-text">Allergic and inflammatory responses can affect airways. Asthma and exercise-induced breathing issues require distinguishing from pattern dysfunction.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="be-card be-card-accent text-center">
            <p className="body-text text-navy mb-4">
              The breath is always available. It requires no equipment, no subscription, no external permission. It is happening right now, in this moment, waiting to be noticed.
            </p>
            <p className="body-text italic">
              This report is an invitation to explore: not a diagnosis or prescription. Your body&apos;s intelligence has been refined over millions of years. The signals it sends through your breath deserve your curious attention.
            </p>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border">
            <Link
              href="/systems"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Systems
            </Link>
            <Link
              href="/systems/circulation"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-pink-accent transition-colors font-medium"
            >
              Next: Circulation
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Breath System | bioEDGE Decoder",
  description: "Your Body's Bridge. The Breath System governs oxygen delivery, carbon dioxide removal, and blood pH regulation. It is the only vital function that operates both automatically and consciously.",
}
