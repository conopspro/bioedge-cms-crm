import { Heart, ArrowLeft, AlertCircle, Search, Sparkles, Play, HelpCircle, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

/**
 * Circulation System Page
 *
 * Comprehensive guide to the Circulation biological system.
 * Part of the bioEDGE Decoder 15 Systems Framework.
 */
export default function CirculationSystemPage() {
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
              <Heart className="h-10 w-10 text-gold" />
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white">
                Circulation System
              </h1>
            </div>
            <p className="text-xl text-white/80">
              Your Body&apos;s Delivery Network
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
                Your heart beats without instruction. Right now, blood is traveling through 60,000 miles of vessels, delivering oxygen to 37 trillion cells, removing waste, and maintaining the pressure that keeps every tissue alive. You did not learn how to do this. No one taught your heart to synchronize its rhythm or your vessels to dilate when muscles demand more blood.
              </p>
              <p>
                The Circulation System is your body&apos;s delivery network. It transports oxygen from lungs to cells, carries nutrients from digestion to where they&apos;re needed, clears metabolic waste, and maintains the precise pressure required to reach every corner of your body. When this system functions well, every tissue receives what it needs, waste clears efficiently, and your heart pumps with steady rhythm.
              </p>
              <p className="font-semibold text-navy">
                What makes this system unique among the fourteen is its role as the great connector. While your lungs bring in oxygen and your digestive system absorbs nutrients, Circulation is what delivers these resources everywhere they&apos;re needed. It bridges every other system.
              </p>
              <p>
                Your brain depends on cerebral blood flow for cognition. Your muscles depend on perfusion for strength. Your skin depends on capillary reach for healing. Without delivery, nothing else functions.
              </p>
              <p>
                This system speaks the same language as the rest of your psychophysiological supersystem. When your nervous system detects threat, your vessels constrict to prioritize vital organs. When inflammation arises, blood flow increases to the affected area. When you exercise, your heart rate rises and vessels dilate without conscious direction. These coordinated responses happen automatically, without instruction.
              </p>
              <p className="text-electric-blue font-medium">
                Your body already knows how to circulate. It has been refining this knowledge across billions of heartbeats. The signals it sends through cold fingers, dizziness, or fatigue are communications from an intelligent system, not failures of a broken machine.
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
              Factors to examine that may interfere with circulation:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Lifestyle Factors */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Lifestyle Factors</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Prolonged sitting or standing without movement</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Relationship between physical activity patterns and how you feel</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Sedentary periods correlating with brain fog, cold extremities, or leg heaviness</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Habitual leg crossing or restrictive positions</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Sleep positions and morning symptoms</span></li>
                </ul>
              </div>

              {/* Dietary Considerations */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Dietary Considerations</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Heavily processed foods, excessive sodium, or inflammatory foods correlating with swelling or blood pressure changes</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Meals high in fat triggering discomfort or fatigue</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Caffeine or alcohol patterns related to palpitations or blood pressure fluctuations</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Timing of eating in relation to symptoms</span></li>
                </ul>
              </div>

              {/* Environmental Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Environmental Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Hot environments, saunas, or hot showers triggering lightheadedness or fatigue</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Temperature extremes affecting your extremities</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Altitude or barometric pressure changes correlating with how you feel</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Constrictive clothing, tight socks, or compression-free seated positions</span></li>
                </ul>
              </div>

              {/* Relationship & Emotional Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Relationship &amp; Emotional Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Unresolved stress or conflict correlating with blood pressure changes or heart racing</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Suppressed emotional expression relating to chest tightness</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Social isolation patterns coinciding with decreased physical activity</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Relationship dynamics affecting your physical state</span></li>
                </ul>
              </div>

              {/* Habitual Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Habitual Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Smoking or previous smoking history</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Habitual postures that may restrict blood flow</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Breath-holding during concentration</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Compression garment use or avoidance affecting symptoms</span></li>
                </ul>
              </div>

              {/* Digital Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Digital Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Prolonged screen time correlating with decreased movement and worsening circulation signals</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Scrolling postures restricting blood flow</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Digital habits interfering with physical activity that supports circulation</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Sedentary screen use and leg swelling or brain fog</span></li>
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
                The Circulation System communicates through 28 signals across eight categories:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Blood Pressure Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Low blood pressure (chronic)</li>
                    <li>Orthostatic intolerance / standing causes problems</li>
                    <li>High blood pressure</li>
                    <li>Blood pressure fluctuations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Blood Flow &amp; Perfusion Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Cold hands and feet (chronic)</li>
                    <li>Numbness or tingling in extremities</li>
                    <li>Slow wound healing</li>
                    <li>Easy bruising</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Heart Function Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Heart palpitations / irregular heartbeat</li>
                    <li>Chest pressure or tightness</li>
                    <li>Heart fatigue / heart can&apos;t keep up</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Oxygenation &amp; Perfusion Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Shortness of breath with exertion</li>
                    <li>Shortness of breath at rest or lying flat</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Swelling &amp; Fluid Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Leg / ankle swelling</li>
                    <li>Blood pooling in legs</li>
                    <li>Facial puffiness</li>
                    <li>Visible vein changes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Skin &amp; Tissue Signals (5)</h4>
                  <ul className="body-text space-y-1">
                    <li>Skin color changes in extremities</li>
                    <li>Pale or waxy skin</li>
                    <li>Poor skin quality / tissue changes</li>
                    <li>Skin breakdown concerns</li>
                    <li>Varicose or spider vein appearance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Exertion &amp; Recovery Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Exercise intolerance</li>
                    <li>Abnormal heart rate response to exercise</li>
                    <li>Post-exercise fatigue</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Cognitive &amp; Neurological Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Memory problems from poor perfusion</li>
                    <li>Visual disturbances</li>
                    <li>Tinnitus / pulsatile sounds</li>
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
                    <p className="body-text">You stand up from your desk after an hour of focused work. The room tilts. Your vision grays at the edges. Your heart pounds.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">R</span>
                  <div>
                    <p className="font-heading font-bold text-navy">React</p>
                    <p className="body-text">Your body responds before you can think. Blood pressure drops. Heart rate spikes to compensate. You grip the desk.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">A</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Assume</p>
                    <p className="body-text">&quot;I&apos;m going to faint.&quot; &quot;Something is wrong with my heart.&quot; &quot;I&apos;m just out of shape.&quot; &quot;I must have an anxiety disorder.&quot; &quot;This is just how I am.&quot;</p>
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
                    <p className="body-text">Instead of accepting the story, you investigate: Does this happen specifically with position changes? Does sitting down quickly resolve it? How long was I sitting before this happened? Does it worsen with heat exposure or after eating? Is my heart rate doing something measurable, or does it just feel that way? Does movement throughout the day prevent this?</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">E</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Encode</p>
                    <p className="body-text">Next time, you remember differently. You notice the dizziness without panic. You recognize it as a signal about blood pooling and position change, not a sign of impending doom. You sit back down, give your body a moment to redistribute blood, and stand again more slowly. You start taking movement breaks. The signal becomes information rather than emergency.</p>
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
                Circulation-related signals are frequently attributed to other causes:
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
                      <td className="py-3 pr-4">Anxiety, panic attacks, panic disorder</td>
                      <td className="py-3">Orthostatic intolerance and blood pressure changes with position</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Depression, laziness, lack of motivation</td>
                      <td className="py-3">Fatigue from inadequate blood flow and tissue perfusion</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">ADHD, cognitive decline, &quot;just aging&quot;</td>
                      <td className="py-3">Brain fog related to cerebral perfusion</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Just need to exercise more,&quot; deconditioning</td>
                      <td className="py-3">Exercise intolerance from cardiac or vascular limitation</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Hypochondria, somatization</td>
                      <td className="py-3">Heart palpitations with measurable rhythm or rate changes</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Good blood pressure,&quot; nothing to worry about</td>
                      <td className="py-3">Chronically low blood pressure contributing to symptoms</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Normal aging, &quot;just water retention&quot;</td>
                      <td className="py-3">Leg and ankle swelling from venous insufficiency</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Stress, inner ear problem, vertigo</td>
                      <td className="py-3">Lightheadedness from orthostatic blood pressure drops</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Chronic fatigue syndrome, burnout</td>
                      <td className="py-3">Fatigue pattern that improves with movement</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Diabetes only, &quot;you heal slow&quot;</td>
                      <td className="py-3">Slow wound healing from inadequate peripheral circulation</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">White coat syndrome, measurement error</td>
                      <td className="py-3">Blood pressure fluctuations indicating autonomic involvement</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Cosmetic issue, &quot;genetic&quot;</td>
                      <td className="py-3">Visible vein changes indicating venous insufficiency</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Panic attack, GERD, musculoskeletal</td>
                      <td className="py-3">Chest pressure related to coronary blood flow</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Carpal tunnel, &quot;sleeping on it wrong&quot;</td>
                      <td className="py-3">Numbness and tingling from circulation to extremities</td>
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
                  <li>Notice the relationship between position changes and symptoms</li>
                  <li>Observe whether signals improve with movement or worsen with stillness</li>
                  <li>Pay attention to timing patterns: morning versus evening, after sitting versus after walking</li>
                  <li>Track whether heat exposure or hot showers correlate with changes</li>
                  <li>Notice extremity color and temperature at different times</li>
                  <li>Observe the connection between how long you sit and how you feel afterward</li>
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
                  <li>Explore whether gradual position changes affect symptoms</li>
                  <li>Experiment with movement breaks during sedentary periods</li>
                  <li>Consider trying leg elevation after prolonged standing</li>
                  <li>Explore whether gentle inversions (legs up the wall) affect how you feel</li>
                  <li>Experiment with calf muscle activation before standing</li>
                  <li>Consider exploring hydration and salt intake patterns</li>
                  <li>Try moving for a few minutes before assessing how you feel</li>
                </ul>
              </div>

              {/* Environmental Adjustments */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
                </div>
                <p className="text-sm text-text-light mb-3">Changes to physical surroundings to consider:</p>
                <ul className="space-y-3 body-text">
                  <li>Evaluate workstation setup for opportunities to alternate sitting and standing</li>
                  <li>Consider whether compression garments might be worth exploring</li>
                  <li>Assess whether cooler shower temperatures affect symptoms</li>
                  <li>Explore workspace temperature and its relationship to how you feel</li>
                  <li>Consider a small step stool or foot rest to encourage position changes</li>
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
                  <li>Cardiologists (heart function and rhythm)</li>
                  <li>Vascular specialists (vessel health and blood flow)</li>
                  <li>Autonomic specialists (blood pressure and heart rate regulation)</li>
                  <li>Physical therapists specializing in reconditioning</li>
                  <li>Integrative medicine practitioners</li>
                  <li>Primary care physicians who can order appropriate testing</li>
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
                  <div><strong className="text-navy">Move hourly.</strong> Move for at least a few minutes every hour of sitting.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">2</span>
                  <div><strong className="text-navy">Gradual transitions.</strong> Change positions gradually rather than jumping up suddenly.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">3</span>
                  <div><strong className="text-navy">Calf activation.</strong> Activate calf muscles before standing from prolonged sitting.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">4</span>
                  <div><strong className="text-navy">Leg elevation.</strong> Spend some time with legs elevated if swelling is present.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">5</span>
                  <div><strong className="text-navy">Hydration.</strong> Stay adequately hydrated throughout the day.</div>
                </li>
              </ol>
            </div>

            {/* Tracking What You Notice */}
            <div className="be-card mb-6">
              <h3 className="font-heading font-bold text-navy mb-4">Tracking What You Notice</h3>
              <p className="body-text mb-4">Observations, not metrics to optimize:</p>
              <ul className="space-y-3 body-text">
                <li>Note the relationship between activity and symptoms</li>
                <li>Observe how position changes affect your experience</li>
                <li>Notice timing patterns in swelling, fatigue, or cognitive clarity</li>
                <li>Record what improves and what worsens without judgment</li>
                <li>Pay attention to what your body communicates after different activities</li>
              </ul>
            </div>

            {/* The Patience Principle */}
            <div className="be-card bg-off-white">
              <h3 className="font-heading font-bold text-navy mb-4">The Patience Principle</h3>
              <p className="body-text mb-4">
                Circulation responds to consistency over weeks and months. Blood vessels adapt gradually. The heart strengthens incrementally. Reconditioning happens through sustained, gentle effort, not aggressive overhaul.
              </p>
              <p className="body-text mb-4">
                If you&apos;ve been sedentary, improvements may take weeks to become noticeable. If autonomic patterns are involved, patience becomes even more important. Some signals may shift quickly with simple interventions like movement breaks; others require sustained attention over months.
              </p>
              <p className="text-electric-blue font-medium">
                Trust the gradual process. Your circulation has been adapting for decades: give it time to adapt in a new direction.
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
              Self-inquiry questions to explore whether a signal originates from Circulation:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Movement and Position</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Does this signal improve significantly with walking or movement?</li>
                  <li>Does this signal worsen with prolonged sitting or standing still?</li>
                  <li>Is this signal affected by position changes: lying to sitting, sitting to standing?</li>
                  <li>Does lying down resolve symptoms that appear when upright?</li>
                </ul>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Blood Pressure and Heart Rate</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Is there a blood pressure component to this signal?</li>
                  <li>Does heart rate respond abnormally: spiking too fast, not recovering, erratic?</li>
                  <li>Do symptoms worsen in heat or after hot showers?</li>
                </ul>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Visible and Measurable Signs</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Are there visible vascular signs: swelling, vein changes, color changes, skin changes?</li>
                  <li>Is there a gravity-dependent pattern: worse in legs when standing, better when elevated?</li>
                </ul>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Timing Patterns</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Is this worse in the morning upon rising (orthostatic pattern)?</li>
                  <li>Is this worse at the end of the day (venous insufficiency pattern)?</li>
                </ul>
              </div>
            </div>

            <div className="be-card mt-6">
              <h3 className="font-heading font-bold text-navy mb-4">Distinguishing from Other Systems</h3>
              <ul className="space-y-3 body-text">
                <li><strong className="text-navy">Delivery vs Production:</strong> Is this about DELIVERY of oxygen and nutrients (Circulation) or PRODUCTION of cellular energy (Energy)?</li>
                <li><strong className="text-navy">Pump and Pipes:</strong> Is this about the PUMP and PIPES (Circulation) or what happens inside cells (Energy)?</li>
                <li><strong className="text-navy">Rest response:</strong> Does rest help (points away from Circulation toward Energy)?</li>
                <li><strong className="text-navy">Position independence:</strong> Is this position-independent (consider other systems)?</li>
                <li><strong className="text-navy">Blood flow interventions:</strong> Does improving blood flow help: compression, elevation, inversions (points to Circulation)?</li>
                <li><strong className="text-navy">Anxiety distinction:</strong> Does this accompany anxiety without measurable heart rate or blood pressure changes (consider Stress)?</li>
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
              The Circulation System interfaces with multiple other systems. These connections may be worth exploring:
            </p>

            <div className="grid gap-4">
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Energy Production System</h4>
                  <p className="body-text">Circulation delivers oxygen and nutrients; Energy Production uses them to create cellular fuel. When delivery is compromised, energy production suffers. Fatigue from Circulation improves with movement; fatigue from Energy Production improves with rest.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Nervous System</h4>
                  <p className="body-text">The nervous system regulates heart rate and vessel constriction. Chronic stress activation can cause blood pressure fluctuations and heart palpitations. Distinguishing between structural cardiac issues and stress-driven cardiovascular changes is essential.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-pink-accent rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Breath System</h4>
                  <p className="body-text">Circulation delivers the oxygen that breathing brings in. Shortness of breath may be about oxygen delivery (Circulation) or breathing mechanics (Breath). The two systems work together so intimately that signals often overlap.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-deep-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Hydration System</h4>
                  <p className="body-text">Blood volume depends on adequate fluid. Dehydration reduces blood pressure and impairs perfusion. Many Circulation signals: dizziness, fatigue, cognitive fog: may improve with proper hydration.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Temperature Regulation System</h4>
                  <p className="body-text">Blood vessels dilate and constrict to regulate body temperature. Cold extremities may be Circulation (chronic poor perfusion) or Temperature (regulation issue). Heat exposure affects both systems.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Cognition System</h4>
                  <p className="body-text">The brain depends on cerebral blood flow for cognition. Brain fog, memory problems, and visual disturbances may all trace back to inadequate perfusion when they improve with movement or worsen with position.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="be-card be-card-accent text-center">
            <p className="body-text text-navy mb-4">
              Your body has been circulating blood for every moment of your existence. Every heartbeat you&apos;ve ever had happened without instruction. The signals you&apos;re receiving are not evidence of failure: they&apos;re communications from a system that has been delivering life to your tissues since before you were born.
            </p>
            <p className="text-electric-blue font-medium italic">
              Honor what it&apos;s telling you.
            </p>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border">
            <Link
              href="/systems/breath"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Breath
            </Link>
            <Link
              href="/systems/consciousness"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-pink-accent transition-colors font-medium"
            >
              Next: Consciousness
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Circulation System | bioEDGE Decoder",
  description: "Your Body's Delivery Network. The Circulation System transports oxygen from lungs to cells, carries nutrients from digestion to where they're needed, and clears metabolic waste.",
}
