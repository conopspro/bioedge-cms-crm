import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SystemDirectory } from "@/components/directory/system-solutions"
import { SystemNews } from "@/components/directory/system-news"

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
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Circulation System
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Delivery Network
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
              Your heart beats without instruction. Right now, blood is traveling through 60,000 miles of vessels, delivering oxygen to 37 trillion cells, removing waste, and maintaining the pressure that keeps every tissue alive. You did not learn how to do this. No one taught your heart to synchronize its rhythm or your vessels to dilate when muscles demand more blood.
            </p>

            <p>
              The Circulation System is your body&apos;s delivery network. It transports oxygen from lungs to cells, carries nutrients from digestion to where they&apos;re needed, clears metabolic waste, and maintains the precise pressure required to reach every corner of your body. When this system functions well, every tissue receives what it needs, waste clears efficiently, and your heart pumps with steady rhythm.
            </p>

            <p>
              <strong className="text-navy">What makes this system unique among the fourteen is its role as the great connector.</strong> While your lungs bring in oxygen and your digestive system absorbs nutrients, Circulation is what delivers these resources everywhere they&apos;re needed. It bridges every other system.
            </p>

            <p>
              Your brain depends on cerebral blood flow for cognition. Your muscles depend on perfusion for strength. Your skin depends on capillary reach for healing. Without delivery, nothing else functions.
            </p>

            <p>
              This system speaks the same language as the rest of your psychophysiological supersystem. When your nervous system detects threat, your vessels constrict to prioritize vital organs. When inflammation arises, blood flow increases to the affected area. When you exercise, your heart rate rises and vessels dilate without conscious direction. These coordinated responses happen automatically, without instruction.
            </p>

            <p>
              Your body already knows how to circulate. It has been refining this knowledge across billions of heartbeats. The signals it sends through cold fingers, dizziness, or fatigue are communications from an intelligent system, not failures of a broken machine.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              Factors to examine that may interfere with circulation:
            </p>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Prolonged sitting or standing without movement</li>
              <li>Relationship between physical activity patterns and how you feel</li>
              <li>Sedentary periods correlating with brain fog, cold extremities, or leg heaviness</li>
              <li>Habitual leg crossing or restrictive positions</li>
              <li>Sleep positions and morning symptoms</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Heavily processed foods, excessive sodium, or inflammatory foods correlating with swelling or blood pressure changes</li>
              <li>Meals high in fat triggering discomfort or fatigue</li>
              <li>Caffeine or alcohol patterns related to palpitations or blood pressure fluctuations</li>
              <li>Timing of eating in relation to symptoms</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Hot environments, saunas, or hot showers triggering lightheadedness or fatigue</li>
              <li>Temperature extremes affecting your extremities</li>
              <li>Altitude or barometric pressure changes correlating with how you feel</li>
              <li>Constrictive clothing, tight socks, or compression-free seated positions</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Unresolved stress or conflict correlating with blood pressure changes or heart racing</li>
              <li>Suppressed emotional expression relating to chest tightness</li>
              <li>Social isolation patterns coinciding with decreased physical activity</li>
              <li>Relationship dynamics affecting your physical state</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Smoking or previous smoking history</li>
              <li>Habitual postures that may restrict blood flow</li>
              <li>Breath-holding during concentration</li>
              <li>Compression garment use or avoidance affecting symptoms</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Prolonged screen time correlating with decreased movement and worsening circulation signals</li>
              <li>Scrolling postures restricting blood flow</li>
              <li>Digital habits interfering with physical activity that supports circulation</li>
              <li>Sedentary screen use and leg swelling or brain fog</li>
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
              The Circulation System communicates through 28 signals across eight categories:
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Blood Pressure Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Low blood pressure (chronic)</li>
              <li>Orthostatic intolerance / standing causes problems</li>
              <li>High blood pressure</li>
              <li>Blood pressure fluctuations</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Blood Flow &amp; Perfusion Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cold hands and feet (chronic)</li>
              <li>Numbness or tingling in extremities</li>
              <li>Slow wound healing</li>
              <li>Easy bruising</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Heart Function Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Heart palpitations / irregular heartbeat</li>
              <li>Chest pressure or tightness</li>
              <li>Heart fatigue / heart can&apos;t keep up</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Oxygenation &amp; Perfusion Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Shortness of breath with exertion</li>
              <li>Shortness of breath at rest or lying flat</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Swelling &amp; Fluid Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Leg / ankle swelling</li>
              <li>Blood pooling in legs</li>
              <li>Facial puffiness</li>
              <li>Visible vein changes</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Skin &amp; Tissue Signals (5)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Skin color changes in extremities</li>
              <li>Pale or waxy skin</li>
              <li>Poor skin quality / tissue changes</li>
              <li>Skin breakdown concerns</li>
              <li>Varicose or spider vein appearance</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Exertion &amp; Recovery Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Exercise intolerance</li>
              <li>Abnormal heart rate response to exercise</li>
              <li>Post-exercise fatigue</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Cognitive &amp; Neurological Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Memory problems from poor perfusion</li>
              <li>Visual disturbances</li>
              <li>Tinnitus / pulsatile sounds</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You stand up from your desk after an hour of focused work. The room tilts. Your vision grays at the edges. Your heart pounds.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your body responds before you can think. Blood pressure drops. Heart rate spikes to compensate. You grip the desk.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> &quot;I&apos;m going to faint.&quot; &quot;Something is wrong with my heart.&quot; &quot;I&apos;m just out of shape.&quot; &quot;I must have an anxiety disorder.&quot; &quot;This is just how I am.&quot;
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> Instead of accepting the story, you investigate: Does this happen specifically with position changes? Does sitting down quickly resolve it? How long was I sitting before this happened? Does it worsen with heat exposure or after eating? Is my heart rate doing something measurable, or does it just feel that way? Does movement throughout the day prevent this?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> Next time, you remember differently. You notice the dizziness without panic. You recognize it as a signal about blood pooling and position change, not a sign of impending doom. You sit back down, give your body a moment to redistribute blood, and stand again more slowly. You start taking movement breaks. The signal becomes information rather than emergency.
            </p>

            <p>
              Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life.
            </p>

            <h3 className="font-heading font-bold text-navy">Common Mislabels</h3>

            <p>
              Circulation-related signals are frequently attributed to other causes:
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

            {/* Gain */}

            <div id="gain" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Gain
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Explore supportive practices and resources</p>
            </div>

            <p>
              The following are options to explore, not prescriptions. Your body will guide you toward what works.
            </p>

            <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Notice the relationship between position changes and symptoms</li>
              <li>Observe whether signals improve with movement or worsen with stillness</li>
              <li>Pay attention to timing patterns: morning versus evening, after sitting versus after walking</li>
              <li>Track whether heat exposure or hot showers correlate with changes</li>
              <li>Notice extremity color and temperature at different times</li>
              <li>Observe the connection between how long you sit and how you feel afterward</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Explore whether gradual position changes affect symptoms</li>
              <li>Experiment with movement breaks during sedentary periods</li>
              <li>Consider trying leg elevation after prolonged standing</li>
              <li>Explore whether gentle inversions (legs up the wall) affect how you feel</li>
              <li>Experiment with calf muscle activation before standing</li>
              <li>Consider exploring hydration and salt intake patterns</li>
              <li>Try moving for a few minutes before assessing how you feel</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Evaluate workstation setup for opportunities to alternate sitting and standing</li>
              <li>Consider whether compression garments might be worth exploring</li>
              <li>Assess whether cooler shower temperatures affect symptoms</li>
              <li>Explore workspace temperature and its relationship to how you feel</li>
              <li>Consider a small step stool or foot rest to encourage position changes</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cardiologists (heart function and rhythm)</li>
              <li>Vascular specialists (vessel health and blood flow)</li>
              <li>Autonomic specialists (blood pressure and heart rate regulation)</li>
              <li>Physical therapists specializing in reconditioning</li>
              <li>Integrative medicine practitioners</li>
              <li>Primary care physicians who can order appropriate testing</li>
            </ul>

            {/* Execute */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Take action with patience and consistency</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>

            <p>Simple daily anchors:</p>

            <ol className="list-decimal pl-6 space-y-3">
              <li><strong className="text-navy">Move hourly.</strong> Move for at least a few minutes every hour of sitting.</li>
              <li><strong className="text-navy">Gradual transitions.</strong> Change positions gradually rather than jumping up suddenly.</li>
              <li><strong className="text-navy">Calf activation.</strong> Activate calf muscles before standing from prolonged sitting.</li>
              <li><strong className="text-navy">Leg elevation.</strong> Spend some time with legs elevated if swelling is present.</li>
              <li><strong className="text-navy">Hydration.</strong> Stay adequately hydrated throughout the day.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <p>Observations, not metrics to optimize:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Note the relationship between activity and symptoms</li>
              <li>Observe how position changes affect your experience</li>
              <li>Notice timing patterns in swelling, fatigue, or cognitive clarity</li>
              <li>Record what improves and what worsens without judgment</li>
              <li>Pay attention to what your body communicates after different activities</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              Circulation responds to consistency over weeks and months. Blood vessels adapt gradually. The heart strengthens incrementally. Reconditioning happens through sustained, gentle effort, not aggressive overhaul.
            </p>

            <p>
              If you&apos;ve been sedentary, improvements may take weeks to become noticeable. If autonomic patterns are involved, patience becomes even more important. Some signals may shift quickly with simple interventions like movement breaks; others require sustained attention over months.
            </p>

            <p>
              Trust the gradual process. Your circulation has been adapting for decades: give it time to adapt in a new direction.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              Self-inquiry questions to explore whether a signal originates from Circulation:
            </p>

            <h3 className="font-heading font-bold text-navy">Movement and Position</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Does this signal improve significantly with walking or movement?</li>
              <li>Does this signal worsen with prolonged sitting or standing still?</li>
              <li>Is this signal affected by position changes: lying to sitting, sitting to standing?</li>
              <li>Does lying down resolve symptoms that appear when upright?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Blood Pressure and Heart Rate</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Is there a blood pressure component to this signal?</li>
              <li>Does heart rate respond abnormally: spiking too fast, not recovering, erratic?</li>
              <li>Do symptoms worsen in heat or after hot showers?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Visible and Measurable Signs</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Are there visible vascular signs: swelling, vein changes, color changes, skin changes?</li>
              <li>Is there a gravity-dependent pattern: worse in legs when standing, better when elevated?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Timing Patterns</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Is this worse in the morning upon rising (orthostatic pattern)?</li>
              <li>Is this worse at the end of the day (venous insufficiency pattern)?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Distinguishing from Other Systems</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-navy">Delivery vs Production:</strong> Is this about DELIVERY of oxygen and nutrients (Circulation) or PRODUCTION of cellular energy (Energy)?</li>
              <li><strong className="text-navy">Pump and Pipes:</strong> Is this about the PUMP and PIPES (Circulation) or what happens inside cells (Energy)?</li>
              <li><strong className="text-navy">Rest response:</strong> Does rest help (points away from Circulation toward Energy)?</li>
              <li><strong className="text-navy">Position independence:</strong> Is this position-independent (consider other systems)?</li>
              <li><strong className="text-navy">Blood flow interventions:</strong> Does improving blood flow help: compression, elevation, inversions (points to Circulation)?</li>
              <li><strong className="text-navy">Anxiety distinction:</strong> Does this accompany anxiety without measurable heart rate or blood pressure changes (consider Stress)?</li>
            </ul>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              The Circulation System interfaces with multiple other systems. These connections may be worth exploring:
            </p>

            <p>
              <strong className="text-navy">Energy Production System</strong> — Circulation delivers oxygen and nutrients; Energy Production uses them to create cellular fuel. When delivery is compromised, energy production suffers. Fatigue from Circulation improves with movement; fatigue from Energy Production improves with rest.
            </p>

            <p>
              <strong className="text-navy">Nervous System</strong> — The nervous system regulates heart rate and vessel constriction. Chronic stress activation can cause blood pressure fluctuations and heart palpitations. Distinguishing between structural cardiac issues and stress-driven cardiovascular changes is essential.
            </p>

            <p>
              <strong className="text-navy">Breath System</strong> — Circulation delivers the oxygen that breathing brings in. Shortness of breath may be about oxygen delivery (Circulation) or breathing mechanics (Breath). The two systems work together so intimately that signals often overlap.
            </p>

            <p>
              <strong className="text-navy">Hydration System</strong> — Blood volume depends on adequate fluid. Dehydration reduces blood pressure and impairs perfusion. Many Circulation signals: dizziness, fatigue, cognitive fog: may improve with proper hydration.
            </p>

            <p>
              <strong className="text-navy">Temperature Regulation System</strong> — Blood vessels dilate and constrict to regulate body temperature. Cold extremities may be Circulation (chronic poor perfusion) or Temperature (regulation issue). Heat exposure affects both systems.
            </p>

            <p>
              <strong className="text-navy">Cognition System</strong> — The brain depends on cerebral blood flow for cognition. Brain fog, memory problems, and visual disturbances may all trace back to inadequate perfusion when they improve with movement or worsen with position.
            </p>


            <Suspense fallback={null}>
              <SystemNews system="Circulation" label="Circulation" />
            </Suspense>

            <Suspense fallback={null}>
              <SystemDirectory system="Circulation" label="Circulation" />
            </Suspense>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your body has been circulating blood for every moment of your existence. Every heartbeat you&apos;ve ever had happened without instruction. The signals you&apos;re receiving are not evidence of failure: they&apos;re communications from a system that has been delivering life to your tissues since before you were born.
              </p>
              <p className="mt-4 italic">
                Honor what it&apos;s telling you.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/breath"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Breath
            </Link>
            <Link
              href="/systems/consciousness"
              className="inline-flex items-center gap-2 text-sm text-[#017ab2] hover:text-navy transition-colors font-medium"
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
  alternates: {
    canonical: "/systems/circulation",
  },
}
