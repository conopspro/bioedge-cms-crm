import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SystemDirectory } from "@/components/directory/system-solutions"

/**
 * Stress Response System Page
 *
 * Part of the bioEDGE Decoder 15 Biological Systems Framework.
 * Covers fight or flight, cortisol regulation, and stress adaptation.
 */

export default function StressResponseSystemPage() {
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
            Stress Response System
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Alert System
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
              Your Stress Response System governs <strong className="text-navy">activation and recovery</strong>. It determines whether you&apos;re in survival mode or restoration mode—the fundamental toggle between responding to threat and restoring to baseline.
            </p>

            <p>
              This system is the autonomic nervous system expressing itself through felt experience. It regulates your state of readiness, shifting resources between sympathetic activation (fight, flight, or freeze) and parasympathetic recovery (rest, digest, and restore). When functioning well, it responds proportionally to genuine threats, then returns to baseline. When compromised, it gets stuck in activation, stuck in shutdown, or oscillates unpredictably between states.
            </p>

            <p>
              What makes this system unique among the fourteen is that it governs your <strong className="text-navy">activation state</strong>, not the emotions you feel about being activated (Emotional System) or your awareness of the state (Consciousness System). This is the difference between the physical experience of a racing heart and the felt emotion of fear—between the body that can&apos;t relax and the mind that worries about not relaxing.
            </p>

            <p>
              Your body operates as a unified intelligence network. The psychophysiological supersystem—where your endocrine, nervous, and immune systems speak the same chemical language—orchestrates your stress response without conscious direction. When you face a threat, this network responds as one. Your nervous system signals danger. Your endocrine system releases cortisol and adrenaline. Your immune system shifts resources. They act in concert, executing coordinated responses that have been refined over hundreds of millions of years.
            </p>

            <p>
              Right now, your body is replacing 330 billion cells. Your heart beats without instruction. Your nervous system monitors your environment, calibrating your readiness state based on cues you may never consciously notice. This is Natural Intelligence at work. Your body already knows how to respond to danger and how to return to safety. The question is whether the signals it sends are being heard.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              The following are factors worth examining that may contribute to stress system dysregulation. These are not causes or diagnoses—they are considerations for investigation.
            </p>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Activity patterns lacking movement discharge (stress hormones accumulate when sedentary)</li>
              <li>Sleep timing conflicting with circadian rhythms (irregular schedules, late nights)</li>
              <li>Lack of genuine rest periods (vacations, weekends that don&apos;t allow recovery)</li>
              <li>Over-scheduled days with no buffer between demands</li>
              <li>Exercise patterns either absent or excessive (both can dysregulate)</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Caffeine timing and quantity (stimulants extending activation states)</li>
              <li>Blood sugar instability from irregular eating or processed carbohydrates</li>
              <li>Alcohol as a relaxation strategy (disrupts sleep architecture and recovery)</li>
              <li>Eating patterns skipping meals or ignoring hunger signals</li>
              <li>Inflammatory foods contributing to systemic stress load</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Constant noise exposure without periods of silence</li>
              <li>Artificial light after sunset (interfering with cortisol rhythm)</li>
              <li>Cluttered or chaotic physical spaces maintaining low-level activation</li>
              <li>Lack of access to nature or calming environments</li>
              <li>Workplace environments designed for productivity over regulation</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Relationships where safety isn&apos;t reliably present</li>
              <li>Unexpressed emotional content the body holds as tension</li>
              <li>Conflict avoidance leaving the nervous system in anticipatory states</li>
              <li>Caregiving roles without adequate support or boundaries</li>
              <li>Isolation or lack of co-regulation with trusted others</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>&quot;Pushing through&quot; as a default response to fatigue or overwhelm</li>
              <li>Chronic overcommitment beyond sustainable capacity</li>
              <li>Identity tied to productivity or performance rather than wellbeing</li>
              <li>Using work or busyness to avoid uncomfortable internal states</li>
              <li>Delayed responses to body signals (waiting too long to eat, rest, or stop)</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Constant connectivity and notification-driven interruptions</li>
              <li>Screen use during times intended for rest or recovery</li>
              <li>News consumption maintaining threat-detection states</li>
              <li>Social media comparison triggering subtle activation</li>
              <li>Work email or messaging extending the workday into recovery periods</li>
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
              The Stress Response System communicates through <strong>35 distinct signals</strong> across 8 categories. These signals are your body&apos;s way of reporting on its activation state—not signs that something is wrong, but information about what your nervous system is experiencing.
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Sympathetic Activation — Fight/Flight (7)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Racing heart or heart pounding</li>
              <li>Chest tightness or difficulty breathing</li>
              <li>Muscle tension or inability to relax</li>
              <li>Sweating or hot flashes (stress-related)</li>
              <li>Jittery, restless, can&apos;t sit still</li>
              <li>Hypervigilance or feeling on high alert</li>
              <li>Exaggerated startle response</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Parasympathetic Shutdown — Freeze/Collapse (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Freeze response or inability to move or act</li>
              <li>Dissociation, checked out, &quot;not here&quot; feeling</li>
              <li>Collapse or sudden exhaustion during stress</li>
              <li>Numbness or inability to feel during stress</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Chronic Stress Signals (5)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Wired and tired</li>
              <li>Can&apos;t wind down or can&apos;t relax</li>
              <li>Easily overwhelmed</li>
              <li>Sensitivity to stimulation (sounds, lights)</li>
              <li>Constant low-level anxiety or dread</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Sleep &amp; Recovery Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Can&apos;t fall asleep or activation at bedtime</li>
              <li>Waking in middle of night (especially 2-4am)</li>
              <li>Unrefreshing sleep or waking exhausted</li>
              <li>Nightmares or disturbed dreams</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Digestive Stress Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Stress gut or nervous stomach</li>
              <li>Stress-induced diarrhea or constipation</li>
              <li>Loss of appetite when stressed</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Cognitive Stress Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Racing mind at rest</li>
              <li>Difficulty concentrating under stress</li>
              <li>Difficulty making decisions</li>
              <li>Memory problems under stress</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Nervous System Dysregulation (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Unpredictable state shifts</li>
              <li>Difficulty returning to baseline</li>
              <li>Low resilience or stress intolerance</li>
              <li>Feeling unsafe in body</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Physical Stress Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Chronic headaches or tension headaches</li>
              <li>Jaw clenching or teeth grinding</li>
              <li>Fatigue after stress response</li>
              <li>Frequent illness or lowered immunity</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You notice your heart racing while sitting at your desk. Nothing external is happening. You weren&apos;t startled. You weren&apos;t running. Your body has activated without an obvious reason.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your nervous system responds with more activation. Your breathing becomes shallow. Your shoulders climb toward your ears. Your jaw tightens. The body recognizes its own activation and interprets it as confirmation that something is wrong.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> Your brain assigns a story: Something must be wrong with me. I&apos;m having a panic attack. I&apos;m losing control. My heart is failing. I can&apos;t handle this.
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> What if you investigated instead of assumed? When did this start? Was I activated before I noticed? Is there something from earlier today—or earlier this week—that my body is still processing? Am I safe right now, even though my body doesn&apos;t feel safe? Is this a pattern I&apos;ve experienced before? What was happening in my life when this pattern first emerged?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> When you investigate and discover that your racing heart was your body still processing a difficult conversation from this morning, you remember differently. The signal wasn&apos;t a failure. It was your body doing exactly what it was designed to do—responding to perceived threat and asking you to pay attention. Next time activation arises, you might recognize it sooner. You might remember that your body knows how to return to baseline when given the conditions to do so.
            </p>

            <p>
              Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life. This doesn&apos;t stop with your health. This can apply to your career, your family, your friends, anything.
            </p>

            <h3 className="font-heading font-bold text-navy">Common Mislabels</h3>

            <p>
              Stress-related signals are frequently attributed to other causes. The following patterns may be worth exploring:
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
                    <td className="py-3 pr-4">Generalized anxiety disorder</td>
                    <td className="py-3">Chronic sympathetic activation where the nervous system&apos;s baseline is elevated</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Type A personality&quot;</td>
                    <td className="py-3">Nervous system that has lost access to parasympathetic states; can&apos;t wind down</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Panic disorder</td>
                    <td className="py-3">Extreme sympathetic activation, often with fear of the attacks creating a cycle</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">ADHD (in some cases)</td>
                    <td className="py-3">Dissociation during stress or chronic hypervigilance fragmenting attention</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Insomnia</td>
                    <td className="py-3">Sympathetic activation blocking sleep onset, or cortisol pattern disruptions</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Depression (in some cases)</td>
                    <td className="py-3">Freeze/collapse response; dorsal vagal shutdown mistaken for lack of motivation</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Chronic fatigue syndrome</td>
                    <td className="py-3">HPA axis dysregulation with &quot;wired and tired&quot; quality; nervous system exhaustion</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Lazy&quot; or &quot;unmotivated&quot;</td>
                    <td className="py-3">Freeze response where the body chose immobility when fight/flight wasn&apos;t possible</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">IBS or &quot;sensitive stomach&quot;</td>
                    <td className="py-3">Gut-brain axis responding to nervous system activation states</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;High-strung&quot; or &quot;jumpy&quot;</td>
                    <td className="py-3">Hypervigilance and exaggerated startle response from trauma or chronic stress</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Just stress&quot; (dismissive)</td>
                    <td className="py-3">Chronic muscle tension, tension headaches, or physical manifestations of activation</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Bad sleep hygiene&quot;</td>
                    <td className="py-3">Nervous system that can&apos;t shift to parasympathetic state regardless of habits</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">&quot;Weakness&quot; or &quot;fragile&quot;</td>
                    <td className="py-3">Low resilience from exhausted stress response capacity</td>
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
              The following are options to explore, not prescriptions to follow. What works for one nervous system may not work for another.
            </p>

            <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Noticing when activation begins rather than after it has peaked</li>
              <li>Tracking what time of day signals appear most frequently</li>
              <li>Observing which environments, people, or activities correlate with activation or calm</li>
              <li>Paying attention to the quality of breathing throughout the day</li>
              <li>Recognizing freeze or shutdown states, which may feel like &quot;nothing&quot; rather than stress</li>
              <li>Noticing how long it takes to return to baseline after activation</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Slow exhale breathing (extending exhale longer than inhale may engage parasympathetic response)</li>
              <li>Cold exposure in controlled doses (cold water on face, cold showers) may stimulate vagal tone</li>
              <li>Humming, singing, or gargling (activities that engage the vagus nerve)</li>
              <li>Bilateral movements (walking, swimming) that may help complete stress cycles</li>
              <li>Progressive muscle relaxation to address chronic tension patterns</li>
              <li>Orienting to present-moment safety through sensory grounding</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Creating spaces with minimal stimulation for nervous system recovery</li>
              <li>Reducing noise pollution where possible</li>
              <li>Ensuring access to natural light during daytime and darkness at night</li>
              <li>Identifying &quot;safe&quot; environments where the body naturally relaxes</li>
              <li>Reducing visual clutter in living and working spaces</li>
              <li>Creating transition rituals between work and rest</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Trauma-informed therapists who understand nervous system regulation</li>
              <li>Somatic experiencing practitioners who work with the body directly</li>
              <li>Practitioners trained in polyvagal-informed approaches</li>
              <li>Biofeedback specialists who can measure and train nervous system responses</li>
              <li>Bodyworkers who understand the relationship between tissue and trauma</li>
              <li>Integrative practitioners who consider the whole system</li>
            </ul>

            {/* Execute */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Take action with patience and consistency</p>
            </div>

            <p>
              The stress response system responds to consistency more than intensity. The following are anchors that may support regulation over time.
            </p>

            <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>

            <ol className="list-decimal pl-6 space-y-3">
              <li><strong className="text-navy">Morning regulation window.</strong> The first hour after waking may set the nervous system&apos;s tone for the day. Exposure to natural light, movement that discharges overnight cortisol, and avoiding immediate stimulation (news, email, social media) may support a more regulated baseline.</li>
              <li><strong className="text-navy">Transition rituals.</strong> Brief practices that signal to the nervous system that one context has ended and another has begun. This might be as simple as a few slow breaths between meetings, a walk between work and home, or changing clothes when the workday ends.</li>
              <li><strong className="text-navy">Evening decompression.</strong> The final hours before sleep may require intentional downshifting—reducing stimulation, dimming lights, and allowing the body to recognize that the day&apos;s demands have ended.</li>
              <li><strong className="text-navy">Regular discharge.</strong> Movement that matches the body&apos;s activation state. When activated, movement that expends energy. When frozen, gentle movement that restores access to the body.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <p>These are observations, not metrics to optimize:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>When signals appear (time of day, context, preceding events)</li>
              <li>How long activation or shutdown states last</li>
              <li>What helps and what doesn&apos;t in a given moment</li>
              <li>Patterns over weeks and months, not just days</li>
              <li>The difference between signals that resolve with rest and those that persist</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              The stress response system often operates on timelines measured in months or years, not days or weeks. Chronic patterns took time to develop and may take time to shift.
            </p>

            <p>
              If years were spent in chronic activation, the nervous system may not immediately trust that safety is available even when circumstances change. If freeze or collapse became a default response, accessing activation again may require patience.
            </p>

            <p>
              Improvement may not feel linear. Good days followed by difficult days don&apos;t mean the process isn&apos;t working. The nervous system is recalibrating, and that process includes testing new patterns against old ones.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              The following questions may help explore whether signals originate in the Stress Response System or elsewhere.
            </p>

            <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Is this about activation state or emotional content? If primarily physical—racing heart, muscle tension, sweating, can&apos;t settle—it points toward Stress Response. If primarily about felt emotions—fear, worry, anger—it may involve the Emotional System.</li>
              <li>Are there clear physical signs of autonomic nervous system involvement? Heart rate changes, breathing changes, muscle tension, sweating, temperature shifts, digestive changes—these point toward the Stress Response System.</li>
              <li>Does this correlate clearly with stress exposure or perceived threat? If signals appear during or after stressful periods and resolve when stress decreases, this points toward Stress Response. If constant regardless of circumstances, this may indicate chronic dysregulation.</li>
              <li>Is the core issue an inability to shift states? Can&apos;t calm down even when safe? Can&apos;t activate even when needed? Stuck in freeze? These are Stress Response System patterns.</li>
              <li>Does relaxation intervention provide relief, even temporarily? If breathing exercises, vagal toning, or safe environments help even briefly, the Stress Response System is involved. If nothing shifts the state, other factors may be contributing.</li>
              <li>Is there a freeze, collapse, or shutdown component during overwhelm? Immobility, collapse, numbness during threat point toward Stress Response (dorsal vagal). Chronic numbness not tied to overwhelm may involve the Emotional System.</li>
              <li>Does this feel like a survival response—body acting as if under threat even when safe? This is characteristic Stress Response System dysregulation. The nervous system is responding to perceived threat that exists in pattern rather than in present reality.</li>
              <li>Is recovery from activation impaired? Taking too long to return to baseline after stress points toward Stress Response System. If recovery is normal but emotions linger, the Emotional System may be more involved.</li>
              <li>Does this follow a &quot;wired and tired&quot; pattern? Exhausted but unable to rest, depleted but can&apos;t access parasympathetic states—this classic pattern points to HPA axis dysregulation and Stress Response System involvement.</li>
            </ol>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              The Stress Response System interfaces closely with several other systems.
            </p>

            <p>
              <strong className="text-navy">Emotional System</strong> — Stress provides the physiological activation; Emotional provides the felt quality. Anxiety often involves both—the body&apos;s racing heart (Stress) and the felt sense of fear (Emotional). Freeze states (Stress) may be mistaken for emotional numbness (Emotional).
            </p>

            <p>
              <strong className="text-navy">Consciousness System</strong> — Racing thoughts and difficulty concentrating may originate in either system. Stress affects cognition through cortisol and activation states; Consciousness involves the quality of awareness itself. Dissociation during stress (Stress) differs from chronic depersonalization (Consciousness).
            </p>

            <p>
              <strong className="text-navy">Energy Production System</strong> — &quot;Wired and tired&quot; involves both systems. The Stress System provides the &quot;wired&quot; component; Energy provides the fatigue. Chronic stress depletes mitochondrial function, creating overlap that requires attention to both systems.
            </p>

            <p>
              <strong className="text-navy">Hormonal System</strong> — Cortisol is both a stress hormone and a hormone. The HPA axis connects stress response to broader hormonal regulation. Sleep disruption, circadian rhythm issues, and cortisol patterns involve both systems.
            </p>

            <p>
              <strong className="text-navy">Defense System</strong> — Chronic stress suppresses immune function. Frequent illness may indicate Stress System overwhelm rather than primary immune dysfunction. Inflammation can drive both systems simultaneously.
            </p>

            <p>
              <strong className="text-navy">Breath System</strong> — Breathing patterns both reflect and influence activation state. Chronic hyperventilation may be mistaken for anxiety. Breathing dysfunction and stress dysregulation often coexist and amplify each other.
            </p>


            <Suspense fallback={null}>
              <SystemDirectory system="Stress Response" label="Stress Response" />
            </Suspense>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your body has been navigating activation and recovery for as long as you&apos;ve been alive. It already knows how to return to baseline when given the conditions to do so. The signals it sends are not failures—they are information. Your job is not to override this system but to decode what it&apos;s telling you.
              </p>
              <p className="mt-4 italic">
                This report is an invitation to explore: not a diagnosis or prescription. Your body&apos;s intelligence has been refined over millions of years. The signals it sends through your stress response deserve your curious attention.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/regeneration"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Regeneration System
            </Link>
            <Link
              href="/systems"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors font-medium"
            >
              All Systems
            </Link>
            <Link
              href="/systems/structure-movement"
              className="inline-flex items-center gap-2 text-sm text-[#017ab2] hover:text-navy transition-colors font-medium"
            >
              Next: Structure &amp; Movement
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Stress Response System | bioEDGE Decoder",
  description:
    "Your Body's Alert System. Explore the bioEDGE Decoder framework for understanding fight or flight, cortisol regulation, and stress adaptation.",
}
