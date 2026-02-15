import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SystemDirectory } from "@/components/directory/system-solutions"

/**
 * Nervous System Page
 *
 * Part of the bioEDGE Decoder 15 Biological Systems Framework.
 * Covers brain-body connection, neural pathways, and vagal tone.
 */

export default function NervousSystemPage() {
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
            Nervous System
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Communication Network
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
              Your nervous system is the body&apos;s wiring—the infrastructure that carries every message, every sensation, every command between body and brain.
            </p>

            <p>
              Right now, billions of electrical signals are traveling through nerve fibers at speeds up to 268 miles per hour. Sensory nerves are reporting temperature, pressure, texture, and position from every surface of your skin. Motor nerves are coordinating the microscopic muscle adjustments that keep you upright. Pain pathways are monitoring tissue integrity across every organ, every joint, every inch of your body.
            </p>

            <p>
              You did not learn any of this. No one taught your nerves how to transmit signals, how to amplify important information, how to dampen irrelevant noise. This intelligence is encoded in the architecture itself.
            </p>

            <p>
              What makes this system unique among the fourteen biological systems is that it governs <strong className="text-navy">fidelity—the accuracy of transmission</strong>. Other systems generate signals. The Nervous System carries them. Other systems respond to conditions. The Nervous System reports conditions. When this wiring works well, pain reflects actual tissue state. Sensations match stimuli. Motor commands execute cleanly.
            </p>

            <p>
              When compromised, the nervous system itself becomes a source of aberrant signals. Pain without tissue damage. Amplified sensations. Distorted perception. The wiring starts generating its own static.
            </p>

            <p>
              This system speaks the same language as your endocrine and immune systems. When you cut your finger, your nervous system signals pain to protect the area while your endocrine system releases clotting factors and your immune system dispatches white blood cells. They don&apos;t hold committee meetings. They act in concert—the psychophysiological supersystem operating as unified intelligence.
            </p>

            <p>
              Your body already knows how to transmit, process, and modulate signals. It has been refining this capacity for over half a billion years. The nervous system began allowing organisms to sense their environment and respond. Over time, these networks became more complex. You inherited and elaborated on these ancient structures.
            </p>

            <p>
              The intelligence is there, operating beneath the surface, waiting to be heard. It speaks through signals.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              The following factors may be worth examining as you explore what might be contributing to nervous system signals. These are not causes or diagnoses—they are considerations for investigation.
            </p>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Repetitive movements or sustained postures that may compress nerve pathways</li>
              <li>Prolonged sitting or standing without position changes</li>
              <li>Sleep positions that may put pressure on nerves (arms under pillows, awkward neck angles)</li>
              <li>Activity patterns involving repetitive stress on specific nerve territories</li>
              <li>Footwear choices that may compress nerves or alter gait patterns</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Blood sugar fluctuations that may affect nerve function over time</li>
              <li>Nutrient patterns—B vitamins (particularly B12), omega-3 fatty acids associated with nerve health</li>
              <li>Alcohol consumption patterns—worth exploring if tingling or numbness is present</li>
              <li>Hydration levels—adequate fluid intake supports nerve conduction</li>
              <li>Inflammatory dietary patterns that may contribute to sensitization</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Workstation ergonomics—keyboard height, monitor position, chair support</li>
              <li>Vibration exposure from tools, vehicles, or equipment</li>
              <li>Cold exposure that may affect nerve function</li>
              <li>Chemical exposures in work or home environments</li>
              <li>Compression sources—tight clothing, constrictive accessories, or equipment</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chronic stress patterns that may contribute to sensitization over time</li>
              <li>Trauma history—physical or emotional—that may affect signal processing</li>
              <li>Hypervigilance patterns that may amplify sensory perception</li>
              <li>Relational dynamics contributing to ongoing activation states</li>
              <li>Suppressed expression patterns manifesting in physical tension and nerve compression</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Postures held unconsciously—crossed legs, hunched shoulders, forward head position</li>
              <li>Tension patterns that may compress nerve pathways</li>
              <li>Bracing or guarding behaviors that have become automatic</li>
              <li>Movement avoidance that may contribute to deconditioning</li>
              <li>Pain behaviors that may inadvertently reinforce sensitization</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device postures—looking down at phones, laptop use without external keyboard</li>
              <li>Wrist positions during typing or scrolling</li>
              <li>Grip patterns on devices</li>
              <li>Screen time duration and associated static postures</li>
              <li>Notification patterns contributing to activation states affecting sensitization</li>
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
              Your nervous system communicates through <strong>27 distinct signals</strong> across six categories. Each signal is your body&apos;s way of transmitting information about transmission quality, processing accuracy, and pathway integrity.
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Pain Processing Signals (6)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Neuropathic Pain (burning, electric, shooting)</li>
              <li>Allodynia (pain from non-painful stimuli)</li>
              <li>Hyperalgesia (disproportionate pain response)</li>
              <li>Central Sensitization (amplified processing)</li>
              <li>Wind-Up Phenomenon (progressive pain increase)</li>
              <li>Persistent Post-Injury Pain</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Peripheral Nerve Signals (5)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Numbness (loss of sensation)</li>
              <li>Tingling / Paresthesias (pins and needles)</li>
              <li>Nerve Territory Pain</li>
              <li>Temperature Sensation Loss</li>
              <li>Vibration Sense Loss</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Sensory Processing Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Phantom Sensations</li>
              <li>Referred Pain (distant from source)</li>
              <li>Sensory Distortion</li>
              <li>Sensory Amplification</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Motor Nerve Signals (5)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nerve-Related Weakness</li>
              <li>Muscle Wasting</li>
              <li>Fasciculations (muscle twitches)</li>
              <li>Tremor</li>
              <li>Coordination Difficulties</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Autonomic Nerve Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Abnormal Sweating Patterns</li>
              <li>Temperature Dysregulation</li>
              <li>Vasomotor Changes (color changes)</li>
              <li>Orthostatic Intolerance</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Nerve Transmission Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Delayed Signal Transmission</li>
              <li>Nerve Misfiring (spontaneous signals)</li>
              <li>Spread of Sensation</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You notice a burning sensation in your feet that wasn&apos;t there before. Or a shooting pain down your arm when you turn your head. Or numbness in your fingers that comes and goes. The signal arrives.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your heart rate increases. Your attention narrows. You brace against the sensation. You start avoiding certain positions or activities. Your body has already responded before your conscious mind catches up.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> The brain assigns a story. This is nerve damage. Something is seriously wrong. This is what happened to my father. I&apos;m falling apart. This will only get worse. The story feels true because the sensation is real.
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> This is where investigation begins. What is this signal actually telling me? Is this burning sensation following a nerve pattern or is it diffuse? Does this numbness improve with position change (suggesting compression) or is it constant (suggesting something else)? Did this begin after an injury, gradually over time, or seemingly out of nowhere? What makes it better? What makes it worse? Is there a mismatch between what I&apos;m feeling and what&apos;s actually happening to my tissues?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> Now you remember differently. Instead of &quot;something is wrong with my nerves,&quot; you might remember: &quot;my body is communicating about signal processing, and I&apos;m learning to decode what that means.&quot; Instead of &quot;I have nerve damage,&quot; you might remember: &quot;I notice burning sensations in a specific pattern that I&apos;m tracking to understand better.&quot; The signal remains, but your relationship to it changes.
            </p>

            <p>
              Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life. This doesn&apos;t stop with your health. This can apply to your career, your family, your friends, anything.
            </p>

            <h3 className="font-heading font-bold text-navy">Common Mislabels</h3>

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
                    <td className="py-3 pr-4">&quot;Just pain&quot; or &quot;muscle pain&quot;</td>
                    <td className="py-3">Neuropathic pain with distinctive burning, electric, or shooting quality</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Hypochondria&quot; or &quot;just sensitive&quot;</td>
                    <td className="py-3">Central sensitization—nervous system amplification</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Exaggerating&quot; or &quot;it can&apos;t hurt that much&quot;</td>
                    <td className="py-3">Allodynia—stimulus-response mismatch</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Anxiety&quot; or &quot;circulation problems&quot;</td>
                    <td className="py-3">Small fiber neuropathy</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Muscle strain&quot; or &quot;just tension&quot;</td>
                    <td className="py-3">Nerve entrapment or compression</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Normal healing&quot; or &quot;it should be better by now&quot;</td>
                    <td className="py-3">Persistent post-surgical nerve involvement</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Imagination&quot; or &quot;making it up&quot;</td>
                    <td className="py-3">Phantom sensations—real neurological phenomenon</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Drama&quot; or &quot;psychiatric condition&quot;</td>
                    <td className="py-3">Complex Regional Pain Syndrome</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Getting older&quot; or &quot;just side effects&quot;</td>
                    <td className="py-3">Medication-induced nerve changes</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Poor circulation only&quot;</td>
                    <td className="py-3">Diabetic neuropathy</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;The price of treatment&quot;</td>
                    <td className="py-3">Chemotherapy-induced neuropathy (often persists)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Threw out your back&quot;</td>
                    <td className="py-3">Radiculopathy—nerve root compression</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Low pain tolerance&quot;</td>
                    <td className="py-3">Hyperalgesia—processing amplification</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Nervousness&quot; or &quot;caffeine&quot;</td>
                    <td className="py-3">Neurological tremor with distinctive pattern</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">&quot;Clumsiness&quot; or &quot;not paying attention&quot;</td>
                    <td className="py-3">Nerve-based coordination difficulties</td>
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
              <li><strong>Signal mapping</strong> — Notice whether sensations follow specific patterns. Does numbness correspond to specific fingers? Does pain radiate in a line?</li>
              <li><strong>Stimulus-response observation</strong> — Notice the relationship between what touches you and what you feel. Is the response proportional? Amplified? Delayed?</li>
              <li><strong>Pattern tracking</strong> — Does this signal appear at certain times? Worse at night? Position-dependent? Related to activities?</li>
              <li><strong>Quality distinction</strong> — Learn to notice the character of sensations. Burning versus aching. Shooting versus throbbing. Electric versus mechanical.</li>
              <li><strong>Body mapping</strong> — Where exactly is this sensation? Can you trace its boundaries? Does it follow anatomical patterns?</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Position experiments</strong> — If signals change with position, explore what positions reduce or increase them</li>
              <li><strong>Movement exploration</strong> — Gentle, varied movement may help identify what&apos;s related to compression versus other causes</li>
              <li><strong>Nerve gliding</strong> — Gentle movements allowing nerves to slide through pathways. Worth exploring with appropriate guidance</li>
              <li><strong>Temperature observation</strong> — Notice how temperature affects your signals. Does warmth help? Does cold make things worse?</li>
              <li><strong>Rest and activity balance</strong> — Observe what happens with rest versus activity. Some nerve issues improve with rest; some don&apos;t</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Workstation assessment</strong> — Keyboard height, monitor position, chair support. Small changes may reduce compression on nerve pathways</li>
              <li><strong>Sleep environment</strong> — Pillow height and firmness, mattress support, sleep position aids</li>
              <li><strong>Pressure point reduction</strong> — Cushioning for areas where nerves may be compressed (elbows, wrists, heels)</li>
              <li><strong>Temperature management</strong> — If temperature affects your signals, consider warming or cooling options</li>
              <li><strong>Vibration reduction</strong> — If vibration exposure is part of daily life, padding or tool modification</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Neurologists</strong> — Specialists who can perform diagnostic testing and characterize specific conditions</li>
              <li><strong>Physiatrists</strong> — Physical medicine and rehabilitation specialists addressing nerve-related functional issues</li>
              <li><strong>Physical therapists</strong> — Particularly those specializing in neurological conditions or chronic pain</li>
              <li><strong>Pain specialists</strong> — Physicians focusing on pain management, including nerve-targeting approaches</li>
              <li><strong>Electrodiagnostic specialists</strong> — Perform nerve conduction studies and EMG to objectively measure nerve function</li>
              <li><strong>Occupational therapists</strong> — Address functional adaptation and ergonomic modifications</li>
            </ul>

            {/* Execute */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Take action with patience and consistency</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>

            <p>Simple daily anchors—not intensive protocols, but sustainable patterns.</p>

            <ol className="list-decimal pl-6 space-y-3">
              <li><strong className="text-navy">Daily body scan.</strong> Spend a few minutes each morning noticing sensations throughout your body. Not judging, not worrying, just noticing. What&apos;s present today?</li>
              <li><strong className="text-navy">Position variation.</strong> If you sit, stand periodically. If you stand, sit. If you hold positions for work, build in micro-breaks for position change.</li>
              <li><strong className="text-navy">Gentle movement.</strong> The nervous system benefits from movement that doesn&apos;t demand. Walking. Stretching. Moving through ranges of motion without force.</li>
              <li><strong className="text-navy">Signal acknowledgment.</strong> When signals arise, pause before reacting. Acknowledge what you&apos;re feeling. Then choose your response.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <p>
              This is about observation, not optimization. Not metrics to achieve, but patterns to understand.
            </p>

            <p>Consider tracking:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>When signals appear and how long they last</li>
              <li>What positions or activities precede changes</li>
              <li>Quality descriptions (burning, tingling, numbness, shooting)</li>
              <li>Location and whether it changes or spreads</li>
              <li>What, if anything, provides relief</li>
              <li>Overall patterns over weeks and months</li>
            </ul>

            <p className="italic">
              The goal is pattern recognition, not score improvement.
            </p>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              The nervous system operates on its own timeline.
            </p>

            <p>
              Nerve regeneration—when it occurs—proceeds at approximately one inch per month. Sensitization that developed over months or years may take comparable time to resolve. Central changes in how pain is processed are neuroplastic adaptations that require neuroplastic solutions, and neuroplasticity is gradual.
            </p>

            <p>
              Quick fixes often don&apos;t apply here. What may serve you instead:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-navy">Consistency over intensity</strong> — Small, sustainable practices continued over time tend to matter more than dramatic interventions.</li>
              <li><strong className="text-navy">Observation over urgency</strong> — Rushing to conclusions about what signals mean may lead you away from what your body is actually communicating.</li>
              <li><strong className="text-navy">Patience as practice</strong> — The nervous system responds to safety, stability, and sustained input. Patience itself may be part of what supports change.</li>
            </ul>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              These are self-inquiry questions to explore what your signals might be communicating and whether they originate from the Nervous System or elsewhere.
            </p>

            <h3 className="font-heading font-bold text-navy">Signal Origin Questions</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Does this signal have a distinctive quality—burning, electric, shooting, tingling—or does it feel more like aching, throbbing, or mechanical pressure?</li>
              <li>Does this follow a specific pattern in my body (along a nerve, in a dermatomal distribution, in a &quot;glove and stocking&quot; pattern)?</li>
              <li>Is there a mismatch between what&apos;s touching me and what I feel? Does light touch cause pain? Do normal stimuli cause extreme responses?</li>
              <li>Did this begin after something that might have affected nerves—surgery, injury, shingles, diabetes, or medication changes?</li>
              <li>Does this persist even though any original injury has healed? Is there pain without ongoing tissue damage?</li>
              <li>Are there phantom sensations—feeling something in a body part that&apos;s numb or where nothing is happening?</li>
              <li>Is there objective change—weakness in specific muscles, visible wasting, areas I can&apos;t feel when touched?</li>
              <li>Does temperature dramatically affect this signal? Does cold make it much worse? Can I sense temperature properly?</li>
              <li>When stimulation is repeated, does pain get progressively worse instead of habituating?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Distinguishing from Other Systems</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-navy">Is this Nervous System or Structure?</strong> Does pain have burning/electric quality (Nervous) or mechanical/load-related quality (Structure)? Does it follow nerve distribution (Nervous) or muscle/joint patterns (Structure)?</li>
              <li><strong className="text-navy">Is this Nervous System or Circulation?</strong> Does numbness follow nerve distribution (Nervous) or improve with movement/position change (Circulation)?</li>
              <li><strong className="text-navy">Is this Nervous System or Stress?</strong> Does sensory sensitivity persist regardless of activation state (Nervous) or is it clearly tied to stress and improves with calming (Stress)?</li>
              <li><strong className="text-navy">Is this Nervous System or Defense?</strong> Is hypersensitivity present without inflammatory signs (Nervous) or are there swelling, heat, and redness (Defense)?</li>
              <li><strong className="text-navy">Is this Nervous System or Energy?</strong> Is weakness in a specific nerve distribution (Nervous) or generalized and improving with rest (Energy)?</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Deeper Inquiry</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>When did I first notice this signal, and what was happening in my life at that time?</li>
              <li>Has this signal changed over time—in quality, location, intensity, or pattern?</li>
              <li>What story have I been telling myself about what this signal means?</li>
              <li>What happens when I simply observe this sensation without attaching meaning to it?</li>
              <li>What would change in how I live if I approached this with curiosity rather than fear?</li>
            </ol>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              The Nervous System interfaces with multiple other systems. Understanding these connections may help clarify whether a signal originates from the wiring itself or is being accurately transmitted from elsewhere.
            </p>

            <p>
              <strong className="text-navy">Structure &amp; Movement</strong> — The Nervous System transmits signals from structural tissues. Nerve compression often results from structural issues (disc herniation, tunnel syndromes). Distinguishing factor: Nervous System signals have distinctive neuropathic qualities; Structure signals are mechanical and load-related.
            </p>

            <p>
              <strong className="text-navy">Circulation</strong> — Both systems can cause numbness and tingling. Distinguishing factor: Nervous System signals follow nerve distribution patterns; Circulation signals are position-dependent and improve with movement.
            </p>

            <p>
              <strong className="text-navy">Stress Response</strong> — The Stress System affects sensitization. Chronic activation can amplify nerve signals. Distinguishing factor: Stress-related sensitivity is tied to activation state and improves with calming; Nervous System sensitization persists regardless of current state.
            </p>

            <p>
              <strong className="text-navy">Defense</strong> — Inflammation can affect nerves, and nerve signals can be confused with inflammatory pain. Distinguishing factor: Defense signals have swelling, heat, and redness and respond to anti-inflammatories; Nervous System signals have no inflammatory signs.
            </p>

            <p>
              <strong className="text-navy">Consciousness</strong> — Coordination issues can arise from nerve pathways or from processing and attention. Distinguishing factor: Nervous System coordination issues involve impaired sensory feedback; Consciousness coordination issues involve attention and processing.
            </p>

            <p>
              <strong className="text-navy">Energy Production</strong> — Both systems can cause weakness and tremor. Distinguishing factor: Nervous System weakness follows nerve distribution and may include wasting; Energy weakness is generalized and improves with rest.
            </p>


            <Suspense fallback={null}>
              <SystemDirectory system="Nervous System" label="Nervous System" />
            </Suspense>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your body&apos;s communication network has been refining signal transmission for over half a billion years. When signals seem distorted, amplified, or aberrant, this is information. Not something wrong with you—something your body is communicating about the wiring itself. Your role is not to fix, but to decode. To notice. To observe patterns. To develop vocabulary for your experience. To see connections you might have missed. The intelligence is already there.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/hydration"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Hydration System
            </Link>
            <Link
              href="/systems"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors font-medium"
            >
              All Systems
            </Link>
            <Link
              href="/systems/regeneration"
              className="inline-flex items-center gap-2 text-sm text-[#017ab2] hover:text-navy transition-colors font-medium"
            >
              Next: Regeneration
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Nervous System | bioEDGE Decoder",
  description:
    "Your Body's Communication Network. Explore the bioEDGE Decoder framework for understanding brain-body connection, neural pathways, and signal transmission.",
}
