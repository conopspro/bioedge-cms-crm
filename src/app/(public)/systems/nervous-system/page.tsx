import Link from "next/link"
import {
  Brain,
  AlertCircle,
  Search,
  Sparkles,
  Play,
  HelpCircle,
  LinkIcon,
  ArrowLeft,
} from "lucide-react"

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
              className="inline-flex items-center gap-2 text-white/70 hover:text-gold mb-6 text-sm font-heading"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Systems
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur">
                <Brain className="h-8 w-8 text-gold" />
              </div>
              <p className="text-sm text-gold font-heading uppercase tracking-wider">
                bioEDGE Decoder
              </p>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Nervous System
            </h1>
            <p className="text-xl text-white/80">
              Your Body&apos;s Communication Network
            </p>
        </div>
      </div>

      {/* Content */}
      <div className="be-container py-12">

          {/* Section 1: Natural Intelligence */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                1
              </span>
              <h2 className="section-title">Natural Intelligence</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="body-text mb-4">
                Your nervous system is the body&apos;s wiring—the infrastructure that carries every message, every sensation, every command between body and brain.
              </p>
              <p className="body-text mb-4">
                Right now, billions of electrical signals are traveling through nerve fibers at speeds up to 268 miles per hour. Sensory nerves are reporting temperature, pressure, texture, and position from every surface of your skin. Motor nerves are coordinating the microscopic muscle adjustments that keep you upright. Pain pathways are monitoring tissue integrity across every organ, every joint, every inch of your body.
              </p>
              <p className="body-text mb-4">
                You did not learn any of this. No one taught your nerves how to transmit signals, how to amplify important information, how to dampen irrelevant noise. This intelligence is encoded in the architecture itself.
              </p>
              <p className="body-text mb-4">
                What makes this system unique among the fourteen biological systems is that it governs <strong>fidelity—the accuracy of transmission</strong>. Other systems generate signals. The Nervous System carries them. Other systems respond to conditions. The Nervous System reports conditions. When this wiring works well, pain reflects actual tissue state. Sensations match stimuli. Motor commands execute cleanly.
              </p>
              <p className="body-text mb-4">
                When compromised, the nervous system itself becomes a source of aberrant signals. Pain without tissue damage. Amplified sensations. Distorted perception. The wiring starts generating its own static.
              </p>
              <p className="body-text mb-4">
                This system speaks the same language as your endocrine and immune systems. When you cut your finger, your nervous system signals pain to protect the area while your endocrine system releases clotting factors and your immune system dispatches white blood cells. They don&apos;t hold committee meetings. They act in concert—the psychophysiological supersystem operating as unified intelligence.
              </p>
              <p className="body-text mb-4">
                Your body already knows how to transmit, process, and modulate signals. It has been refining this capacity for over half a billion years. The nervous system began allowing organisms to sense their environment and respond. Over time, these networks became more complex. You inherited and elaborated on these ancient structures.
              </p>
              <p className="body-text">
                The intelligence is there, operating beneath the surface, waiting to be heard. It speaks through signals.
              </p>
            </div>
          </section>

          {/* Section 2: Eliminate */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                2
              </span>
              <h2 className="section-title">Eliminate</h2>
            </div>

            <p className="body-text mb-6">
              The following factors may be worth examining as you explore what might be contributing to nervous system signals. These are not causes or diagnoses—they are considerations for investigation.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Lifestyle Factors
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Repetitive movements or sustained postures that may compress nerve pathways</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Prolonged sitting or standing without position changes</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Sleep positions that may put pressure on nerves (arms under pillows, awkward neck angles)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Activity patterns involving repetitive stress on specific nerve territories</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Footwear choices that may compress nerves or alter gait patterns</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Dietary Considerations
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Blood sugar fluctuations that may affect nerve function over time</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Nutrient patterns—B vitamins (particularly B12), omega-3 fatty acids associated with nerve health</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Alcohol consumption patterns—worth exploring if tingling or numbness is present</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Hydration levels—adequate fluid intake supports nerve conduction</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Inflammatory dietary patterns that may contribute to sensitization</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Environmental Interference
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Workstation ergonomics—keyboard height, monitor position, chair support</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Vibration exposure from tools, vehicles, or equipment</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Cold exposure that may affect nerve function</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Chemical exposures in work or home environments</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Compression sources—tight clothing, constrictive accessories, or equipment</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Relationship & Emotional Patterns
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Chronic stress patterns that may contribute to sensitization over time</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Trauma history—physical or emotional—that may affect signal processing</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Hypervigilance patterns that may amplify sensory perception</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Relational dynamics contributing to ongoing activation states</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Suppressed expression patterns manifesting in physical tension and nerve compression</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Habitual Patterns
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Postures held unconsciously—crossed legs, hunched shoulders, forward head position</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Tension patterns that may compress nerve pathways</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Bracing or guarding behaviors that have become automatic</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Movement avoidance that may contribute to deconditioning</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Pain behaviors that may inadvertently reinforce sensitization</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Digital Interference
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Device postures—looking down at phones, laptop use without external keyboard</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Wrist positions during typing or scrolling</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Grip patterns on devices</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Screen time duration and associated static postures</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Notification patterns contributing to activation states affecting sensitization</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Decode */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                3
              </span>
              <h2 className="section-title">Decode</h2>
            </div>

            {/* Signal Inventory */}
            <div className="be-card mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Search className="h-5 w-5 text-electric-blue" />
                <h3 className="font-heading font-bold text-navy">
                  Signal Inventory
                </h3>
              </div>
              <p className="body-text mb-6">
                Your nervous system communicates through <strong>27 distinct signals</strong> across six categories. Each signal is your body&apos;s way of transmitting information about transmission quality, processing accuracy, and pathway integrity.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Pain Processing Signals (6)
                  </h4>
                  <p className="text-xs text-text-light mb-2">How pain is transmitted and processed—not the source, but the pathway itself.</p>
                  <ul className="body-text space-y-1">
                    <li>• Neuropathic Pain (burning, electric, shooting)</li>
                    <li>• Allodynia (pain from non-painful stimuli)</li>
                    <li>• Hyperalgesia (disproportionate pain response)</li>
                    <li>• Central Sensitization (amplified processing)</li>
                    <li>• Wind-Up Phenomenon (progressive pain increase)</li>
                    <li>• Persistent Post-Injury Pain</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Peripheral Nerve Signals (5)
                  </h4>
                  <p className="text-xs text-text-light mb-2">Signals from the nerve fibers themselves—the wiring of the body.</p>
                  <ul className="body-text space-y-1">
                    <li>• Numbness (loss of sensation)</li>
                    <li>• Tingling / Paresthesias (pins and needles)</li>
                    <li>• Nerve Territory Pain</li>
                    <li>• Temperature Sensation Loss</li>
                    <li>• Vibration Sense Loss</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Sensory Processing Signals (4)
                  </h4>
                  <p className="text-xs text-text-light mb-2">How the nervous system interprets and processes sensory input.</p>
                  <ul className="body-text space-y-1">
                    <li>• Phantom Sensations</li>
                    <li>• Referred Pain (distant from source)</li>
                    <li>• Sensory Distortion</li>
                    <li>• Sensory Amplification</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Motor Nerve Signals (5)
                  </h4>
                  <p className="text-xs text-text-light mb-2">Signals affecting movement and motor control through nerve pathways.</p>
                  <ul className="body-text space-y-1">
                    <li>• Nerve-Related Weakness</li>
                    <li>• Muscle Wasting</li>
                    <li>• Fasciculations (muscle twitches)</li>
                    <li>• Tremor</li>
                    <li>• Coordination Difficulties</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Autonomic Nerve Signals (4)
                  </h4>
                  <p className="text-xs text-text-light mb-2">Signals from nerves controlling involuntary functions.</p>
                  <ul className="body-text space-y-1">
                    <li>• Abnormal Sweating Patterns</li>
                    <li>• Temperature Dysregulation</li>
                    <li>• Vasomotor Changes (color changes)</li>
                    <li>• Orthostatic Intolerance</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Nerve Transmission Signals (3)
                  </h4>
                  <p className="text-xs text-text-light mb-2">Quality and accuracy of signal transmission itself.</p>
                  <ul className="body-text space-y-1">
                    <li>• Delayed Signal Transmission</li>
                    <li>• Nerve Misfiring (spontaneous signals)</li>
                    <li>• Spread of Sensation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* TRADE Framework */}
            <div className="be-card mb-8">
              <h3 className="font-heading font-bold text-navy mb-4">
                The TRADE Framework
              </h3>
              <p className="body-text mb-6">
                Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-white font-heading font-bold text-sm flex-shrink-0">
                    T
                  </span>
                  <div>
                    <p className="font-heading font-bold text-navy">Trigger</p>
                    <p className="body-text">
                      You notice a burning sensation in your feet that wasn&apos;t there before. Or a shooting pain down your arm when you turn your head. Or numbness in your fingers that comes and goes. The signal arrives.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-white font-heading font-bold text-sm flex-shrink-0">
                    R
                  </span>
                  <div>
                    <p className="font-heading font-bold text-navy">React</p>
                    <p className="body-text">
                      Your heart rate increases. Your attention narrows. You brace against the sensation. You start avoiding certain positions or activities. Your body has already responded before your conscious mind catches up.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-white font-heading font-bold text-sm flex-shrink-0">
                    A
                  </span>
                  <div>
                    <p className="font-heading font-bold text-navy">Assume</p>
                    <p className="body-text">
                      The brain assigns a story. This is nerve damage. Something is seriously wrong. This is what happened to my father. I&apos;m falling apart. This will only get worse. The story feels true because the sensation is real.
                    </p>
                  </div>
                </div>

                <div className="bg-pink-accent/10 border border-pink-accent/20 rounded-lg p-4 my-4">
                  <p className="body-text">
                    Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong className="text-pink-accent">TRAP</strong>, paralyzed.
                  </p>
                </div>

                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">
                    D
                  </span>
                  <div>
                    <p className="font-heading font-bold text-navy">Decode</p>
                    <p className="body-text">
                      This is where investigation begins. What is this signal actually telling me? Is this burning sensation following a nerve pattern or is it diffuse? Does this numbness improve with position change (suggesting compression) or is it constant (suggesting something else)? Did this begin after an injury, gradually over time, or seemingly out of nowhere? What makes it better? What makes it worse? Is there a mismatch between what I&apos;m feeling and what&apos;s actually happening to my tissues?
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">
                    E
                  </span>
                  <div>
                    <p className="font-heading font-bold text-navy">Encode</p>
                    <p className="body-text">
                      Now you remember differently. Instead of &quot;something is wrong with my nerves,&quot; you might remember: &quot;my body is communicating about signal processing, and I&apos;m learning to decode what that means.&quot; Instead of &quot;I have nerve damage,&quot; you might remember: &quot;I notice burning sensations in a specific pattern that I&apos;m tracking to understand better.&quot; The signal remains, but your relationship to it changes.
                    </p>
                  </div>
                </div>
              </div>

              <p className="body-text mt-6">
                Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life. This doesn&apos;t stop with your health. This can apply to your career, your family, your friends, anything.
              </p>
            </div>

            {/* Common Mislabels */}
            <div className="be-card">
              <h3 className="font-heading font-bold text-navy mb-4">
                Common Mislabels
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full body-text">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 pr-4 font-heading font-bold text-navy">
                        What It Gets Called
                      </th>
                      <th className="text-left py-3 font-heading font-bold text-navy">
                        What It Might Be Worth Exploring
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Just pain&quot; or &quot;muscle pain&quot;</td>
                      <td className="py-3">Neuropathic pain with distinctive burning, electric, or shooting quality</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Hypochondria&quot; or &quot;just sensitive&quot;</td>
                      <td className="py-3">Central sensitization—nervous system amplification</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Exaggerating&quot; or &quot;it can&apos;t hurt that much&quot;</td>
                      <td className="py-3">Allodynia—stimulus-response mismatch</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Anxiety&quot; or &quot;circulation problems&quot;</td>
                      <td className="py-3">Small fiber neuropathy</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Muscle strain&quot; or &quot;just tension&quot;</td>
                      <td className="py-3">Nerve entrapment or compression</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Normal healing&quot; or &quot;it should be better by now&quot;</td>
                      <td className="py-3">Persistent post-surgical nerve involvement</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Imagination&quot; or &quot;making it up&quot;</td>
                      <td className="py-3">Phantom sensations—real neurological phenomenon</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Drama&quot; or &quot;psychiatric condition&quot;</td>
                      <td className="py-3">Complex Regional Pain Syndrome</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Getting older&quot; or &quot;just side effects&quot;</td>
                      <td className="py-3">Medication-induced nerve changes</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Poor circulation only&quot;</td>
                      <td className="py-3">Diabetic neuropathy</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;The price of treatment&quot;</td>
                      <td className="py-3">Chemotherapy-induced neuropathy (often persists)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Threw out your back&quot;</td>
                      <td className="py-3">Radiculopathy—nerve root compression</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Low pain tolerance&quot;</td>
                      <td className="py-3">Hyperalgesia—processing amplification</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Nervousness&quot; or &quot;caffeine&quot;</td>
                      <td className="py-3">Neurological tremor with distinctive pattern</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Clumsiness&quot; or &quot;not paying attention&quot;</td>
                      <td className="py-3">Nerve-based coordination difficulties</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 4: Gain */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                4
              </span>
              <h2 className="section-title">Gain</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Awareness Tools
                  </h3>
                </div>
                <p className="text-xs text-text-light mb-3">Ways to observe and notice what your nervous system might be communicating.</p>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Signal mapping</strong> — Notice whether sensations follow specific patterns. Does numbness correspond to specific fingers? Does pain radiate in a line?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Stimulus-response observation</strong> — Notice the relationship between what touches you and what you feel. Is the response proportional? Amplified? Delayed?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Pattern tracking</strong> — Does this signal appear at certain times? Worse at night? Position-dependent? Related to activities?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Quality distinction</strong> — Learn to notice the character of sensations. Burning versus aching. Shooting versus throbbing. Electric versus mechanical.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Body mapping</strong> — Where exactly is this sensation? Can you trace its boundaries? Does it follow anatomical patterns?</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-3 mb-4">
                  <Play className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Exploratory Practices
                  </h3>
                </div>
                <p className="text-xs text-text-light mb-3">Things to try and experiment with—not prescriptions, but possibilities.</p>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Position experiments</strong> — If signals change with position, explore what positions reduce or increase them</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Movement exploration</strong> — Gentle, varied movement may help identify what&apos;s related to compression versus other causes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Nerve gliding</strong> — Gentle movements allowing nerves to slide through pathways. Worth exploring with appropriate guidance</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Temperature observation</strong> — Notice how temperature affects your signals. Does warmth help? Does cold make things worse?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Rest and activity balance</strong> — Observe what happens with rest versus activity. Some nerve issues improve with rest; some don&apos;t</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Environmental Adjustments
                  </h3>
                </div>
                <p className="text-xs text-text-light mb-3">Changes to physical surroundings worth considering.</p>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Workstation assessment</strong> — Keyboard height, monitor position, chair support. Small changes may reduce compression on nerve pathways</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Sleep environment</strong> — Pillow height and firmness, mattress support, sleep position aids</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Pressure point reduction</strong> — Cushioning for areas where nerves may be compressed (elbows, wrists, heels)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Temperature management</strong> — If temperature affects your signals, consider warming or cooling options</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Vibration reduction</strong> — If vibration exposure is part of daily life, padding or tool modification</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Professional Resources
                  </h3>
                </div>
                <p className="text-xs text-text-light mb-3">Types of practitioners who work with the nervous system.</p>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Neurologists</strong> — Specialists who can perform diagnostic testing and characterize specific conditions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Physiatrists</strong> — Physical medicine and rehabilitation specialists addressing nerve-related functional issues</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Physical therapists</strong> — Particularly those specializing in neurological conditions or chronic pain</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Pain specialists</strong> — Physicians focusing on pain management, including nerve-targeting approaches</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Electrodiagnostic specialists</strong> — Perform nerve conduction studies and EMG to objectively measure nerve function</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span><strong>Occupational therapists</strong> — Address functional adaptation and ergonomic modifications</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Execute */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                5
              </span>
              <h2 className="section-title">Execute</h2>
            </div>

            <div className="space-y-6">
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Foundation Practices
                </h3>
                <p className="text-xs text-text-light mb-3">Simple daily anchors—not intensive protocols, but sustainable patterns.</p>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span><strong>Daily body scan</strong> — Spend a few minutes each morning noticing sensations throughout your body. Not judging, not worrying, just noticing. What&apos;s present today?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span><strong>Position variation</strong> — If you sit, stand periodically. If you stand, sit. If you hold positions for work, build in micro-breaks for position change.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span><strong>Gentle movement</strong> — The nervous system benefits from movement that doesn&apos;t demand. Walking. Stretching. Moving through ranges of motion without force.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span><strong>Signal acknowledgment</strong> — When signals arise, pause before reacting. Acknowledge what you&apos;re feeling. Then choose your response.</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Tracking What You Notice
                </h3>
                <p className="body-text mb-4">
                  This is about observation, not optimization. Not metrics to achieve, but patterns to understand.
                </p>
                <p className="body-text mb-2">Consider tracking:</p>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>When signals appear and how long they last</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>What positions or activities precede changes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Quality descriptions (burning, tingling, numbness, shooting)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Location and whether it changes or spreads</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>What, if anything, provides relief</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Overall patterns over weeks and months</span>
                  </li>
                </ul>
                <p className="body-text mt-4 italic">
                  The goal is pattern recognition, not score improvement.
                </p>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  The Patience Principle
                </h3>
                <p className="body-text mb-4">
                  The nervous system operates on its own timeline.
                </p>
                <p className="body-text mb-4">
                  Nerve regeneration—when it occurs—proceeds at approximately one inch per month. Sensitization that developed over months or years may take comparable time to resolve. Central changes in how pain is processed are neuroplastic adaptations that require neuroplastic solutions, and neuroplasticity is gradual.
                </p>
                <p className="body-text mb-2">
                  Quick fixes often don&apos;t apply here. What may serve you instead:
                </p>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span><strong>Consistency over intensity</strong> — Small, sustainable practices continued over time tend to matter more than dramatic interventions.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span><strong>Observation over urgency</strong> — Rushing to conclusions about what signals mean may lead you away from what your body is actually communicating.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span><strong>Patience as practice</strong> — The nervous system responds to safety, stability, and sustained input. Patience itself may be part of what supports change.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6: Questions for Clarity */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                6
              </span>
              <h2 className="section-title">Questions for Clarity</h2>
            </div>

            <p className="body-text mb-6">
              These are self-inquiry questions to explore what your signals might be communicating and whether they originate from the Nervous System or elsewhere.
            </p>

            <h3 className="font-heading font-bold text-navy mb-4">Signal Origin Questions</h3>
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does this signal have a distinctive quality—burning, electric, shooting, tingling—or does it feel more like aching, throbbing, or mechanical pressure?</strong>
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does this follow a specific pattern in my body (along a nerve, in a dermatomal distribution, in a &quot;glove and stocking&quot; pattern)?</strong>
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is there a mismatch between what&apos;s touching me and what I feel? Does light touch cause pain? Do normal stimuli cause extreme responses?</strong>
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Did this begin after something that might have affected nerves—surgery, injury, shingles, diabetes, or medication changes?</strong>
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does this persist even though any original injury has healed? Is there pain without ongoing tissue damage?</strong>
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Are there phantom sensations—feeling something in a body part that&apos;s numb or where nothing is happening?</strong>
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is there objective change—weakness in specific muscles, visible wasting, areas I can&apos;t feel when touched?</strong>
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does temperature dramatically affect this signal? Does cold make it much worse? Can I sense temperature properly?</strong>
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">When stimulation is repeated, does pain get progressively worse instead of habituating?</strong>
                </p>
              </div>
            </div>

            <h3 className="font-heading font-bold text-navy mb-4">Distinguishing Questions</h3>
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this Nervous System or Structure?</strong>
                  <br />Does pain have burning/electric quality (Nervous) or mechanical/load-related quality (Structure)? Does it follow nerve distribution (Nervous) or muscle/joint patterns (Structure)?
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this Nervous System or Circulation?</strong>
                  <br />Does numbness follow nerve distribution (Nervous) or improve with movement/position change (Circulation)?
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this Nervous System or Stress?</strong>
                  <br />Does sensory sensitivity persist regardless of activation state (Nervous) or is it clearly tied to stress and improves with calming (Stress)?
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this Nervous System or Defense?</strong>
                  <br />Is hypersensitivity present without inflammatory signs (Nervous) or are there swelling, heat, and redness (Defense)?
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this Nervous System or Energy?</strong>
                  <br />Is weakness in a specific nerve distribution (Nervous) or generalized and improving with rest (Energy)?
                </p>
              </div>
            </div>

            <h3 className="font-heading font-bold text-navy mb-4">Deeper Inquiry</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">When did I first notice this signal, and what was happening in my life at that time?</strong>
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Has this signal changed over time—in quality, location, intensity, or pattern?</strong>
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">What story have I been telling myself about what this signal means?</strong>
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">What happens when I simply observe this sensation without attaching meaning to it?</strong>
                </p>
              </div>

              <div className="be-card md:col-span-2">
                <p className="body-text">
                  <strong className="text-navy">What would change in how I live if I approached this with curiosity rather than fear?</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Cross-System Connections */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                7
              </span>
              <h2 className="section-title">Cross-System Connections</h2>
            </div>

            <p className="body-text mb-6">
              The Nervous System interfaces with multiple other systems. Understanding these connections may help clarify whether a signal originates from the wiring itself or is being accurately transmitted from elsewhere.
            </p>

            <div className="space-y-4">
              <div className="be-card border-l-4 border-l-gold">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Structure & Movement
                  </h3>
                </div>
                <p className="body-text">
                  The Nervous System transmits signals from structural tissues. Nerve compression often results from structural issues (disc herniation, tunnel syndromes). <strong>Distinguishing factor:</strong> Nervous System signals have distinctive neuropathic qualities; Structure signals are mechanical and load-related.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-electric-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-electric-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Circulation
                  </h3>
                </div>
                <p className="body-text">
                  Both systems can cause numbness and tingling. <strong>Distinguishing factor:</strong> Nervous System signals follow nerve distribution patterns; Circulation signals are position-dependent and improve with movement.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-pink-accent">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-pink-accent" />
                  <h3 className="font-heading font-bold text-navy">
                    Stress Response
                  </h3>
                </div>
                <p className="body-text">
                  The Stress System affects sensitization. Chronic activation can amplify nerve signals. <strong>Distinguishing factor:</strong> Stress-related sensitivity is tied to activation state and improves with calming; Nervous System sensitization persists regardless of current state.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-deep-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-deep-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Defense
                  </h3>
                </div>
                <p className="body-text">
                  Inflammation can affect nerves, and nerve signals can be confused with inflammatory pain. <strong>Distinguishing factor:</strong> Defense signals have swelling, heat, and redness and respond to anti-inflammatories; Nervous System signals have no inflammatory signs.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-gold">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Consciousness
                  </h3>
                </div>
                <p className="body-text">
                  Coordination issues can arise from nerve pathways or from processing and attention. <strong>Distinguishing factor:</strong> Nervous System coordination issues involve impaired sensory feedback; Consciousness coordination issues involve attention and processing.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-electric-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-electric-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Energy Production
                  </h3>
                </div>
                <p className="body-text">
                  Both systems can cause weakness and tremor. <strong>Distinguishing factor:</strong> Nervous System weakness follows nerve distribution and may include wasting; Energy weakness is generalized and improves with rest.
                </p>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="mb-12">
            <div className="be-card bg-gradient-to-br from-navy to-deep-blue text-white">
              <p className="text-lg leading-relaxed">
                Your body&apos;s communication network has been refining signal transmission for over half a billion years. When signals seem distorted, amplified, or aberrant, this is information. Not something wrong with you—something your body is communicating about the wiring itself. Your role is not to fix, but to decode. To notice. To observe patterns. To develop vocabulary for your experience. To see connections you might have missed. The intelligence is already there.
              </p>
            </div>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Link
              href="/systems/hydration"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              ← Hydration System
            </Link>
            <Link
              href="/systems"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              All Systems
            </Link>
            <Link
              href="/systems/regeneration"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              Regeneration System →
            </Link>
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
