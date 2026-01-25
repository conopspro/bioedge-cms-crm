import Link from "next/link"
import {
  AlertTriangle,
  AlertCircle,
  Search,
  Sparkles,
  Play,
  HelpCircle,
  LinkIcon,
  ArrowLeft,
} from "lucide-react"

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
              className="inline-flex items-center gap-2 text-white/70 hover:text-gold mb-6 text-sm font-heading"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Systems
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur">
                <AlertTriangle className="h-8 w-8 text-gold" />
              </div>
              <p className="text-sm text-gold font-heading uppercase tracking-wider">
                bioEDGE Decoder
              </p>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Stress Response System
            </h1>
            <p className="text-xl text-white/80">
              Your Body&apos;s Alert System
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
                Your Stress Response System governs <strong>activation and recovery</strong>. It determines whether you&apos;re in survival mode or restoration mode—the fundamental toggle between responding to threat and restoring to baseline.
              </p>
              <p className="body-text mb-4">
                This system is the autonomic nervous system expressing itself through felt experience. It regulates your state of readiness, shifting resources between sympathetic activation (fight, flight, or freeze) and parasympathetic recovery (rest, digest, and restore). When functioning well, it responds proportionally to genuine threats, then returns to baseline. When compromised, it gets stuck in activation, stuck in shutdown, or oscillates unpredictably between states.
              </p>
              <p className="body-text mb-4">
                What makes this system unique among the fourteen is that it governs your <strong>activation state</strong>, not the emotions you feel about being activated (Emotional System) or your awareness of the state (Consciousness System). This is the difference between the physical experience of a racing heart and the felt emotion of fear—between the body that can&apos;t relax and the mind that worries about not relaxing.
              </p>
              <p className="body-text mb-4">
                Your body operates as a unified intelligence network. The psychophysiological supersystem—where your endocrine, nervous, and immune systems speak the same chemical language—orchestrates your stress response without conscious direction. When you face a threat, this network responds as one. Your nervous system signals danger. Your endocrine system releases cortisol and adrenaline. Your immune system shifts resources. They act in concert, executing coordinated responses that have been refined over hundreds of millions of years.
              </p>
              <p className="body-text">
                Right now, your body is replacing 330 billion cells. Your heart beats without instruction. Your nervous system monitors your environment, calibrating your readiness state based on cues you may never consciously notice. This is Natural Intelligence at work. Your body already knows how to respond to danger and how to return to safety. The question is whether the signals it sends are being heard.
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
              The following are factors worth examining that may contribute to stress system dysregulation. These are not causes or diagnoses—they are considerations for investigation.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Lifestyle Factors
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Activity patterns lacking movement discharge (stress hormones accumulate when sedentary)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Sleep timing conflicting with circadian rhythms (irregular schedules, late nights)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Lack of genuine rest periods (vacations, weekends that don&apos;t allow recovery)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Over-scheduled days with no buffer between demands</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Exercise patterns either absent or excessive (both can dysregulate)</span>
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
                    <span>Caffeine timing and quantity (stimulants extending activation states)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Blood sugar instability from irregular eating or processed carbohydrates</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Alcohol as a relaxation strategy (disrupts sleep architecture and recovery)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Eating patterns skipping meals or ignoring hunger signals</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Inflammatory foods contributing to systemic stress load</span>
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
                    <span>Constant noise exposure without periods of silence</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Artificial light after sunset (interfering with cortisol rhythm)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Cluttered or chaotic physical spaces maintaining low-level activation</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Lack of access to nature or calming environments</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Workplace environments designed for productivity over regulation</span>
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
                    <span>Relationships where safety isn&apos;t reliably present</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Unexpressed emotional content the body holds as tension</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Conflict avoidance leaving the nervous system in anticipatory states</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Caregiving roles without adequate support or boundaries</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Isolation or lack of co-regulation with trusted others</span>
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
                    <span>&quot;Pushing through&quot; as a default response to fatigue or overwhelm</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Chronic overcommitment beyond sustainable capacity</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Identity tied to productivity or performance rather than wellbeing</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Using work or busyness to avoid uncomfortable internal states</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Delayed responses to body signals (waiting too long to eat, rest, or stop)</span>
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
                    <span>Constant connectivity and notification-driven interruptions</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Screen use during times intended for rest or recovery</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>News consumption maintaining threat-detection states</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Social media comparison triggering subtle activation</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Work email or messaging extending the workday into recovery periods</span>
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
                The Stress Response System communicates through <strong>35 distinct signals</strong> across 8 categories. These signals are your body&apos;s way of reporting on its activation state—not signs that something is wrong, but information about what your nervous system is experiencing.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Sympathetic Activation — Fight/Flight (7)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Racing heart or heart pounding</li>
                    <li>• Chest tightness or difficulty breathing</li>
                    <li>• Muscle tension or inability to relax</li>
                    <li>• Sweating or hot flashes (stress-related)</li>
                    <li>• Jittery, restless, can&apos;t sit still</li>
                    <li>• Hypervigilance or feeling on high alert</li>
                    <li>• Exaggerated startle response</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Parasympathetic Shutdown — Freeze/Collapse (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Freeze response or inability to move or act</li>
                    <li>• Dissociation, checked out, &quot;not here&quot; feeling</li>
                    <li>• Collapse or sudden exhaustion during stress</li>
                    <li>• Numbness or inability to feel during stress</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Chronic Stress Signals (5)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Wired and tired</li>
                    <li>• Can&apos;t wind down or can&apos;t relax</li>
                    <li>• Easily overwhelmed</li>
                    <li>• Sensitivity to stimulation (sounds, lights)</li>
                    <li>• Constant low-level anxiety or dread</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Sleep & Recovery Signals (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Can&apos;t fall asleep or activation at bedtime</li>
                    <li>• Waking in middle of night (especially 2-4am)</li>
                    <li>• Unrefreshing sleep or waking exhausted</li>
                    <li>• Nightmares or disturbed dreams</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Digestive Stress Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Stress gut or nervous stomach</li>
                    <li>• Stress-induced diarrhea or constipation</li>
                    <li>• Loss of appetite when stressed</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Cognitive Stress Signals (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Racing mind at rest</li>
                    <li>• Difficulty concentrating under stress</li>
                    <li>• Difficulty making decisions</li>
                    <li>• Memory problems under stress</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Nervous System Dysregulation (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Unpredictable state shifts</li>
                    <li>• Difficulty returning to baseline</li>
                    <li>• Low resilience or stress intolerance</li>
                    <li>• Feeling unsafe in body</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Physical Stress Signals (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Chronic headaches or tension headaches</li>
                    <li>• Jaw clenching or teeth grinding</li>
                    <li>• Fatigue after stress response</li>
                    <li>• Frequent illness or lowered immunity</li>
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
                      You notice your heart racing while sitting at your desk. Nothing external is happening. You weren&apos;t startled. You weren&apos;t running. Your body has activated without an obvious reason.
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
                      Your nervous system responds with more activation. Your breathing becomes shallow. Your shoulders climb toward your ears. Your jaw tightens. The body recognizes its own activation and interprets it as confirmation that something is wrong.
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
                      Your brain assigns a story: Something must be wrong with me. I&apos;m having a panic attack. I&apos;m losing control. My heart is failing. I can&apos;t handle this.
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
                      What if you investigated instead of assumed? When did this start? Was I activated before I noticed? Is there something from earlier today—or earlier this week—that my body is still processing? Am I safe right now, even though my body doesn&apos;t feel safe? Is this a pattern I&apos;ve experienced before? What was happening in my life when this pattern first emerged?
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
                      When you investigate and discover that your racing heart was your body still processing a difficult conversation from this morning, you remember differently. The signal wasn&apos;t a failure. It was your body doing exactly what it was designed to do—responding to perceived threat and asking you to pay attention. Next time activation arises, you might recognize it sooner. You might remember that your body knows how to return to baseline when given the conditions to do so.
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
                      <td className="py-3 pr-4">Generalized anxiety disorder</td>
                      <td className="py-3">Chronic sympathetic activation where the nervous system&apos;s baseline is elevated</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Type A personality&quot;</td>
                      <td className="py-3">Nervous system that has lost access to parasympathetic states; can&apos;t wind down</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Panic disorder</td>
                      <td className="py-3">Extreme sympathetic activation, often with fear of the attacks creating a cycle</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">ADHD (in some cases)</td>
                      <td className="py-3">Dissociation during stress or chronic hypervigilance fragmenting attention</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Insomnia</td>
                      <td className="py-3">Sympathetic activation blocking sleep onset, or cortisol pattern disruptions</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Depression (in some cases)</td>
                      <td className="py-3">Freeze/collapse response; dorsal vagal shutdown mistaken for lack of motivation</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Chronic fatigue syndrome</td>
                      <td className="py-3">HPA axis dysregulation with &quot;wired and tired&quot; quality; nervous system exhaustion</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Lazy&quot; or &quot;unmotivated&quot;</td>
                      <td className="py-3">Freeze response where the body chose immobility when fight/flight wasn&apos;t possible</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">IBS or &quot;sensitive stomach&quot;</td>
                      <td className="py-3">Gut-brain axis responding to nervous system activation states</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;High-strung&quot; or &quot;jumpy&quot;</td>
                      <td className="py-3">Hypervigilance and exaggerated startle response from trauma or chronic stress</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Just stress&quot; (dismissive)</td>
                      <td className="py-3">Chronic muscle tension, tension headaches, or physical manifestations of activation</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Bad sleep hygiene&quot;</td>
                      <td className="py-3">Nervous system that can&apos;t shift to parasympathetic state regardless of habits</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Weakness&quot; or &quot;fragile&quot;</td>
                      <td className="py-3">Low resilience from exhausted stress response capacity</td>
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

            <p className="body-text mb-6">
              The following are options to explore, not prescriptions to follow. What works for one nervous system may not work for another.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Awareness Tools
                  </h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Noticing when activation begins rather than after it has peaked</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Tracking what time of day signals appear most frequently</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Observing which environments, people, or activities correlate with activation or calm</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Paying attention to the quality of breathing throughout the day</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Recognizing freeze or shutdown states, which may feel like &quot;nothing&quot; rather than stress</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Noticing how long it takes to return to baseline after activation</span>
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
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Slow exhale breathing (extending exhale longer than inhale may engage parasympathetic response)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Cold exposure in controlled doses (cold water on face, cold showers) may stimulate vagal tone</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Humming, singing, or gargling (activities that engage the vagus nerve)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Bilateral movements (walking, swimming) that may help complete stress cycles</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Progressive muscle relaxation to address chronic tension patterns</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Orienting to present-moment safety through sensory grounding</span>
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
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Creating spaces with minimal stimulation for nervous system recovery</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Reducing noise pollution where possible</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Ensuring access to natural light during daytime and darkness at night</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Identifying &quot;safe&quot; environments where the body naturally relaxes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Reducing visual clutter in living and working spaces</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Creating transition rituals between work and rest</span>
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
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Trauma-informed therapists who understand nervous system regulation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Somatic experiencing practitioners who work with the body directly</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Practitioners trained in polyvagal-informed approaches</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Biofeedback specialists who can measure and train nervous system responses</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Bodyworkers who understand the relationship between tissue and trauma</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Integrative practitioners who consider the whole system</span>
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

            <p className="body-text mb-6">
              The stress response system responds to consistency more than intensity. The following are anchors that may support regulation over time.
            </p>

            <div className="space-y-6">
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Foundation Practices
                </h3>
                <ul className="space-y-4 body-text">
                  <li>
                    <p className="font-bold text-navy mb-1">Morning regulation window</p>
                    <p>The first hour after waking may set the nervous system&apos;s tone for the day. Exposure to natural light, movement that discharges overnight cortisol, and avoiding immediate stimulation (news, email, social media) may support a more regulated baseline.</p>
                  </li>
                  <li>
                    <p className="font-bold text-navy mb-1">Transition rituals</p>
                    <p>Brief practices that signal to the nervous system that one context has ended and another has begun. This might be as simple as a few slow breaths between meetings, a walk between work and home, or changing clothes when the workday ends.</p>
                  </li>
                  <li>
                    <p className="font-bold text-navy mb-1">Evening decompression</p>
                    <p>The final hours before sleep may require intentional downshifting—reducing stimulation, dimming lights, and allowing the body to recognize that the day&apos;s demands have ended.</p>
                  </li>
                  <li>
                    <p className="font-bold text-navy mb-1">Regular discharge</p>
                    <p>Movement that matches the body&apos;s activation state. When activated, movement that expends energy. When frozen, gentle movement that restores access to the body.</p>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Tracking What You Notice
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>When signals appear (time of day, context, preceding events)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>How long activation or shutdown states last</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>What helps and what doesn&apos;t in a given moment</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Patterns over weeks and months, not just days</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>The difference between signals that resolve with rest and those that persist</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  The Patience Principle
                </h3>
                <p className="body-text mb-4">
                  The stress response system often operates on timelines measured in months or years, not days or weeks. Chronic patterns took time to develop and may take time to shift.
                </p>
                <p className="body-text mb-4">
                  If years were spent in chronic activation, the nervous system may not immediately trust that safety is available even when circumstances change. If freeze or collapse became a default response, accessing activation again may require patience.
                </p>
                <p className="body-text">
                  Improvement may not feel linear. Good days followed by difficult days don&apos;t mean the process isn&apos;t working. The nervous system is recalibrating, and that process includes testing new patterns against old ones.
                </p>
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
              The following questions may help explore whether signals originate in the Stress Response System or elsewhere.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this about activation state or emotional content?</strong>
                  <br />If primarily physical—racing heart, muscle tension, sweating, can&apos;t settle—it points toward Stress Response. If primarily about felt emotions—fear, worry, anger—it may involve the Emotional System.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Are there clear physical signs of autonomic nervous system involvement?</strong>
                  <br />Heart rate changes, breathing changes, muscle tension, sweating, temperature shifts, digestive changes—these point toward the Stress Response System.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does this correlate clearly with stress exposure or perceived threat?</strong>
                  <br />If signals appear during or after stressful periods and resolve when stress decreases, this points toward Stress Response. If constant regardless of circumstances, this may indicate chronic dysregulation.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is the core issue an inability to shift states?</strong>
                  <br />Can&apos;t calm down even when safe? Can&apos;t activate even when needed? Stuck in freeze? These are Stress Response System patterns.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does relaxation intervention provide relief, even temporarily?</strong>
                  <br />If breathing exercises, vagal toning, or safe environments help even briefly, the Stress Response System is involved. If nothing shifts the state, other factors may be contributing.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is there a freeze, collapse, or shutdown component during overwhelm?</strong>
                  <br />Immobility, collapse, numbness during threat point toward Stress Response (dorsal vagal). Chronic numbness not tied to overwhelm may involve the Emotional System.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does this feel like a survival response—body acting as if under threat even when safe?</strong>
                  <br />This is characteristic Stress Response System dysregulation. The nervous system is responding to perceived threat that exists in pattern rather than in present reality.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is recovery from activation impaired?</strong>
                  <br />Taking too long to return to baseline after stress points toward Stress Response System. If recovery is normal but emotions linger, the Emotional System may be more involved.
                </p>
              </div>

              <div className="be-card md:col-span-2">
                <p className="body-text">
                  <strong className="text-navy">Does this follow a &quot;wired and tired&quot; pattern?</strong>
                  <br />Exhausted but unable to rest, depleted but can&apos;t access parasympathetic states—this classic pattern points to HPA axis dysregulation and Stress Response System involvement.
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
              The Stress Response System interfaces closely with several other systems.
            </p>

            <div className="space-y-4">
              <div className="be-card border-l-4 border-l-gold">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Emotional System
                  </h3>
                </div>
                <p className="body-text">
                  Stress provides the physiological activation; Emotional provides the felt quality. Anxiety often involves both—the body&apos;s racing heart (Stress) and the felt sense of fear (Emotional). Freeze states (Stress) may be mistaken for emotional numbness (Emotional).
                </p>
              </div>

              <div className="be-card border-l-4 border-l-electric-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-electric-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Consciousness System
                  </h3>
                </div>
                <p className="body-text">
                  Racing thoughts and difficulty concentrating may originate in either system. Stress affects cognition through cortisol and activation states; Consciousness involves the quality of awareness itself. Dissociation during stress (Stress) differs from chronic depersonalization (Consciousness).
                </p>
              </div>

              <div className="be-card border-l-4 border-l-pink-accent">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-pink-accent" />
                  <h3 className="font-heading font-bold text-navy">
                    Energy Production System
                  </h3>
                </div>
                <p className="body-text">
                  &quot;Wired and tired&quot; involves both systems. The Stress System provides the &quot;wired&quot; component; Energy provides the fatigue. Chronic stress depletes mitochondrial function, creating overlap that requires attention to both systems.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-deep-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-deep-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Hormonal System
                  </h3>
                </div>
                <p className="body-text">
                  Cortisol is both a stress hormone and a hormone. The HPA axis connects stress response to broader hormonal regulation. Sleep disruption, circadian rhythm issues, and cortisol patterns involve both systems.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-gold">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Defense System
                  </h3>
                </div>
                <p className="body-text">
                  Chronic stress suppresses immune function. Frequent illness may indicate Stress System overwhelm rather than primary immune dysfunction. Inflammation can drive both systems simultaneously.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-electric-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-electric-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Breath System
                  </h3>
                </div>
                <p className="body-text">
                  Breathing patterns both reflect and influence activation state. Chronic hyperventilation may be mistaken for anxiety. Breathing dysfunction and stress dysregulation often coexist and amplify each other.
                </p>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="mb-12">
            <div className="be-card bg-gradient-to-br from-navy to-deep-blue text-white">
              <p className="text-lg leading-relaxed">
                Your body has been navigating activation and recovery for as long as you&apos;ve been alive. It already knows how to return to baseline when given the conditions to do so. The signals it sends are not failures—they are information. Your job is not to override this system but to decode what it&apos;s telling you.
              </p>
            </div>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Link
              href="/systems/regeneration"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              ← Regeneration System
            </Link>
            <Link
              href="/systems"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              All Systems
            </Link>
            <Link
              href="/systems/structure-movement"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              Structure & Movement →
            </Link>
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
