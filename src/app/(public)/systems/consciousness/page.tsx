import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SystemDirectory } from "@/components/directory/system-solutions"
import { SystemNews } from "@/components/directory/system-news"

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
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Consciousness System
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Inner Witness
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
              Right now, you are aware. This awareness is not something you learned to do. Before you understood language, before you could name what you were experiencing, something in you was already present, already noticing, already receiving the stream of sensation and perception that constitutes being alive. You did not construct consciousness. It came with your biology.
            </p>

            <p>
              The Consciousness System is your body&apos;s capacity for awareness itself: the quality of your attention, the clarity of your inner observation, the degree to which you can witness your own experience. When this system functions well, thoughts are clear, focus is available, the mind feels spacious rather than cluttered, and you can distinguish between what is actually happening and the stories you&apos;re telling yourself about it.
            </p>

            <p>
              <strong className="text-navy">What makes this system unique among the fourteen is that it both generates signals and perceives all the others.</strong> Every signal from every other system passes through Consciousness to be interpreted.
            </p>

            <p>
              When Consciousness is clouded, foggy, or fragmented, your ability to accurately decode what&apos;s happening in your body diminishes. When it&apos;s clear, you can notice subtleties that would otherwise be missed.
            </p>

            <p>
              This system speaks the language of thought quality, attention capacity, mental clarity, and the felt sense of being present versus absent. When something interferes with consciousness: whether biochemical, neurological, inflammatory, or psychological: you may experience brain fog, difficulty concentrating, racing or intrusive thoughts, a sense of being &quot;not quite here,&quot; or the inability to access your own inner experience. These are signals worth decoding.
            </p>

            <p>
              Your body already knows how to be aware. The signals you&apos;re receiving about thought quality and mental clarity are communications from a system that wants to function clearly. They are not evidence of weakness or failure, but invitations to investigate what might be interfering with your natural capacity for presence and perception.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              Factors to examine that may interfere with consciousness and mental clarity:
            </p>

            <h3 className="font-heading font-bold text-navy">Biochemical Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Blood sugar instability correlating with mental fog or racing thoughts</li>
              <li>Dehydration affecting cognitive clarity</li>
              <li>Nutrient deficiencies (B vitamins, iron, omega-3s) and thought quality</li>
              <li>Hormonal fluctuations affecting mental clarity</li>
              <li>Thyroid function and cognitive processing</li>
              <li>Medications with cognitive side effects</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Sleep &amp; Recovery Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Poor sleep quality affecting next-day mental clarity</li>
              <li>Sleep deprivation and thought organization</li>
              <li>Circadian rhythm disruption and cognitive timing</li>
              <li>Lack of mental rest and recovery time</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Constant noise or interruption fragmenting attention</li>
              <li>Cluttered or chaotic physical environments affecting mental state</li>
              <li>Poor air quality or ventilation and cognitive function</li>
              <li>Lighting quality affecting alertness and focus</li>
              <li>Temperature extremes and mental clarity</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital &amp; Attention Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Constant context-switching and notification interruption</li>
              <li>Social media patterns fragmenting sustained attention</li>
              <li>Information overload and decision fatigue</li>
              <li>Screen time before sleep affecting mental restoration</li>
              <li>Multi-tasking habits degrading single-task focus</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Psychological &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chronic worry or rumination consuming mental bandwidth</li>
              <li>Unprocessed emotional material creating background noise</li>
              <li>Perfectionism creating mental loops</li>
              <li>Avoidance patterns requiring mental energy to maintain</li>
              <li>Trauma responses affecting presence and awareness</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Inflammatory &amp; Immune Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Systemic inflammation affecting brain function</li>
              <li>Gut-brain axis disruption and mental clarity</li>
              <li>Chronic infections and cognitive symptoms</li>
              <li>Autoimmune processes with neurological involvement</li>
              <li>Histamine or mast cell activation affecting cognition</li>
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
              The Consciousness System communicates through 22 signals across nine categories:
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Clarity Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Brain fog / mental cloudiness</li>
              <li>Difficulty thinking clearly</li>
              <li>Mental sluggishness</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Attention Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Difficulty concentrating</li>
              <li>Scattered or fragmented attention</li>
              <li>Inability to sustain focus</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Thought Quality Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Racing thoughts</li>
              <li>Intrusive or unwanted thoughts</li>
              <li>Thought loops / rumination</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Memory &amp; Processing Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Short-term memory problems</li>
              <li>Word-finding difficulty</li>
              <li>Slow cognitive processing</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Presence Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Dissociation / feeling disconnected</li>
              <li>Depersonalization / derealization</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Mental Energy Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Mental fatigue / cognitive exhaustion</li>
              <li>Decision fatigue</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Perception Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sensory overload / overwhelm</li>
              <li>Difficulty filtering stimuli</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Awareness Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Loss of self-awareness or insight</li>
              <li>Difficulty accessing inner experience</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Reality Testing Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Confusion about what&apos;s real</li>
              <li>Difficulty distinguishing thoughts from facts</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You sit down to work on something important. Within minutes, your mind is elsewhere. Thoughts intrude. You read the same paragraph three times without absorbing it. The fog descends.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Frustration. You try harder. You check your phone for a dopamine hit. You get coffee. You force yourself to stare at the screen.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> &quot;I must have ADHD.&quot; &quot;I&apos;m just not disciplined.&quot; &quot;I&apos;m getting old.&quot; &quot;Something is wrong with my brain.&quot; &quot;I&apos;m not smart enough for this.&quot; &quot;Everyone else can focus, why can&apos;t I?&quot;
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> Instead of accepting the story, you investigate: When does this happen most? What did I eat before this? How did I sleep? Is this worse at certain times of day? Does movement help or hurt? Is this related to what I&apos;m trying to focus on, or does it happen regardless of subject? What was I doing for the hour before I sat down? Is there something I&apos;m avoiding that might be creating mental noise?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> Next time, you remember differently. You notice that the fog always comes after a carb-heavy lunch. You see that you can focus in the morning but not after 3pm. You recognize that the intrusive thoughts are about an unresolved conversation. The signal becomes a data point. You adjust accordingly. Clarity returns.
            </p>

            <p>
              Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life.
            </p>

            <h3 className="font-heading font-bold text-navy">Common Mislabels</h3>

            <p>
              Consciousness-related signals are frequently attributed to other causes:
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
              <li>Track the timing of mental clarity versus fog throughout the day</li>
              <li>Notice the relationship between food and cognitive state</li>
              <li>Observe how sleep quality affects next-day thinking</li>
              <li>Pay attention to what environments support versus fragment your attention</li>
              <li>Notice patterns in when racing thoughts or intrusions occur</li>
              <li>Track how screen time and digital patterns affect mental state</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Experiment with blood sugar stability (protein with meals, regular eating)</li>
              <li>Try single-tasking instead of multi-tasking for a week</li>
              <li>Explore the impact of caffeine timing on focus</li>
              <li>Consider a digital sunset (no screens 1-2 hours before bed)</li>
              <li>Experiment with brief meditation or mindfulness practices</li>
              <li>Try brain dumps (writing everything on your mind) to clear mental clutter</li>
              <li>Explore movement breaks and their effect on cognitive refreshment</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create a dedicated focus space with minimal visual clutter</li>
              <li>Reduce notification interruptions during cognitive work</li>
              <li>Optimize lighting for alertness (bright during focus, dim in evening)</li>
              <li>Consider noise management: silence, white noise, or specific soundscapes</li>
              <li>Ensure adequate ventilation and air quality in work spaces</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Neurologists (structural and functional brain issues)</li>
              <li>Psychiatrists (when cognitive symptoms have psychiatric components)</li>
              <li>Neuropsychologists (cognitive testing and assessment)</li>
              <li>Functional medicine practitioners (root cause investigation)</li>
              <li>Integrative medicine doctors (whole-person approaches)</li>
              <li>Therapists specializing in cognitive behavioral approaches</li>
              <li>Meditation teachers or mindfulness instructors</li>
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
              <li><strong className="text-navy">Morning clarity check.</strong> Before reaching for your phone, notice the quality of your mind. Clear? Foggy? Anxious? Calm? This baseline matters.</li>
              <li><strong className="text-navy">One focused block.</strong> Protect at least one period of uninterrupted focus per day, even if short. Single-task during this time.</li>
              <li><strong className="text-navy">Movement for mental reset.</strong> When fog descends, move your body before forcing through. Even a few minutes can shift cognitive state.</li>
              <li><strong className="text-navy">Evening wind-down.</strong> Give your brain transition time before sleep. Reduce stimulation gradually rather than going from screens to pillow.</li>
              <li><strong className="text-navy">Weekly mental rest.</strong> Schedule genuine cognitive rest: time without input, decisions, or mental demands.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <p>Observations, not metrics to optimize:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Note when mental clarity is best and worst throughout the day</li>
              <li>Track what you ate before periods of fog or clarity</li>
              <li>Record sleep quality and next-day cognitive impact</li>
              <li>Notice which activities restore mental energy versus deplete it</li>
              <li>Observe patterns in intrusive thoughts or rumination timing</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              Consciousness responds to both immediate interventions and long-term patterns. Some things shift quickly: blood sugar stability can improve mental clarity within hours. Others take time: retraining attention after years of fragmentation requires weeks or months of consistent practice.
            </p>

            <p>
              If you&apos;ve been running on chronic cognitive overload, mental restoration won&apos;t happen in a weekend. If inflammatory processes are involved, resolution takes time. If you&apos;re rebuilding attention capacity, expect gradual improvement rather than sudden transformation.
            </p>

            <p>
              Trust the process. Your brain has remarkable plasticity. Given the right conditions, clarity can return.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              Self-inquiry questions to explore whether a signal originates from Consciousness:
            </p>

            <h3 className="font-heading font-bold text-navy">Timing and Patterns</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Does this signal have a time-of-day pattern?</li>
              <li>Is this related to meals, sleep, or specific activities?</li>
              <li>Does it come and go, or is it constant?</li>
              <li>What makes it better? What makes it worse?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Content vs. Capacity</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Is this about WHAT I&apos;m thinking (content) or my ABILITY to think (capacity)?</li>
              <li>Can I focus on things I enjoy but not things I find boring (content-dependent)?</li>
              <li>Is my thinking impaired regardless of subject matter (capacity issue)?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Physical vs. Psychological</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Does this feel like a physical fog or an emotional overwhelm?</li>
              <li>Is there identifiable emotional content driving the mental noise?</li>
              <li>Does this improve with physical interventions (food, sleep, movement)?</li>
              <li>Does this improve with psychological interventions (talking, processing, rest)?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">New vs. Lifelong</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Is this new, or has it been present as long as I can remember?</li>
              <li>Did something change when this started (illness, medication, life event)?</li>
              <li>Is this a worsening of something that was always there?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Distinguishing from Other Systems</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-navy">Observer vs. Content:</strong> Is this about my ability to OBSERVE (Consciousness) or what&apos;s being observed (other systems)?</li>
              <li><strong className="text-navy">Thinking vs. Feeling:</strong> Is this about thought quality (Consciousness) or emotional experience (Emotional System)?</li>
              <li><strong className="text-navy">Mental fatigue vs. Physical fatigue:</strong> Is this cognitive exhaustion (Consciousness) or bodily tiredness (Energy Production)?</li>
              <li><strong className="text-navy">Brain fog vs. Low energy:</strong> Can I think clearly but lack energy, or do I have energy but can&apos;t think clearly?</li>
              <li><strong className="text-navy">Attention vs. Anxiety:</strong> Is my attention scattered because of cognitive impairment (Consciousness) or because of worry and activation (Nervous System)?</li>
              <li><strong className="text-navy">Sleep quality:</strong> Does this trace back primarily to sleep issues (Sleep &amp; Recovery)?</li>
            </ul>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              The Consciousness System interfaces with multiple other systems. These connections may be worth exploring:
            </p>

            <p>
              <strong className="text-navy">Sleep &amp; Recovery System</strong> — Sleep is when cognitive restoration happens. Poor sleep quality directly impairs next-day consciousness. Many cognitive complaints trace back to inadequate or non-restorative sleep.
            </p>

            <p>
              <strong className="text-navy">Nervous System</strong> — Chronic stress activation fragments attention and impairs cognitive function. Anxiety creates racing thoughts. The nervous system&apos;s state profoundly affects consciousness quality. Distinguishing between cognitive impairment and nervous system activation is essential.
            </p>

            <p>
              <strong className="text-navy">Energy Production System</strong> — The brain requires enormous amounts of energy. When cellular energy production is compromised, cognitive function often suffers first. Mental fatigue may be a downstream effect of mitochondrial dysfunction.
            </p>

            <p>
              <strong className="text-navy">Circulation System</strong> — Cerebral blood flow is essential for cognition. Brain fog may trace back to inadequate perfusion. Circulation problems that improve with movement may affect cognitive symptoms.
            </p>

            <p>
              <strong className="text-navy">Hormones System</strong> — Thyroid hormones directly affect cognitive processing speed. Sex hormones influence cognition across the lifespan. Hormonal transitions (perimenopause, andropause) commonly include cognitive symptoms.
            </p>

            <p>
              <strong className="text-navy">Digestion System</strong> — The gut-brain axis is real. Gut inflammation, dysbiosis, and digestive dysfunction can all manifest as cognitive symptoms. &quot;Brain fog&quot; often has digestive roots.
            </p>


            <Suspense fallback={null}>
              <SystemNews system="Consciousness" label="Consciousness" />
            </Suspense>

            <Suspense fallback={null}>
              <SystemDirectory system="Consciousness" label="Consciousness" />
            </Suspense>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your capacity for awareness is not something you constructed. It came with your biology. The moments of clarity you&apos;ve experienced, the times when thinking was easy and presence was effortless, those are not anomalies. They&apos;re glimpses of what your system is capable of when interference is removed. The signals you&apos;re receiving about thought quality and mental clarity are communications from a system that wants to function clearly.
              </p>
              <p className="mt-4 italic">
                Trust your inner witness. It knows when something is off.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/circulation"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Circulation
            </Link>
            <Link
              href="/systems/defense"
              className="inline-flex items-center gap-2 text-sm text-[#017ab2] hover:text-navy transition-colors font-medium"
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
  alternates: {
    canonical: "/systems/consciousness",
  },
}
