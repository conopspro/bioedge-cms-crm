import Link from "next/link"
import {
  Bone,
  AlertCircle,
  Search,
  Sparkles,
  Play,
  HelpCircle,
  LinkIcon,
  ArrowLeft,
} from "lucide-react"

/**
 * Structure & Movement System Page
 *
 * Part of the bioEDGE Decoder 15 Biological Systems Framework.
 * Covers bones, joints, connective tissue, muscles, and mobility.
 */

export default function StructureMovementSystemPage() {
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
                <Bone className="h-8 w-8 text-gold" />
              </div>
              <p className="text-sm text-gold font-heading uppercase tracking-wider">
                bioEDGE Decoder
              </p>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Structure & Movement
            </h1>
            <p className="text-xl text-white/80">
              Your Body&apos;s Living Architecture
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
                Your body is a structural masterpiece that rebuilds itself constantly. Right now, your skeleton is remodeling, bone cells dissolving old tissue while others lay down new. Your fascia—a continuous web of connective tissue—responds to every movement you make, reorganizing its fibers along lines of tension. Your muscles remember patterns, encode movement habits, and adapt their architecture to what you ask of them.
              </p>
              <p className="body-text mb-4">
                This system governs <strong>posture, motion, and lymphatic pumping through muscular contraction</strong>. It maintains structural integrity through bones, joints, ligaments, tendons, and fascia while enabling all physical motion through muscular contraction.
              </p>
              <p className="body-text mb-4">
                What makes this system unique among the fourteen: <strong>your lymphatic system has no heart of its own</strong>. Lymph—the fluid that carries immune cells and clears metabolic waste—moves only when muscles contract. Every time you walk, stretch, or shift position, you&apos;re pumping your lymphatic system. Stillness isn&apos;t neutral. Stillness means stagnation.
              </p>
              <p className="body-text mb-4">
                When this system is coherent, posture is effortless. Movement is fluid. Lymph flows freely. You don&apos;t have to think about standing straight or remember to move your body correctly. The architecture simply works.
              </p>
              <p className="body-text mb-4">
                This is your psychophysiological supersystem at its most tangible. Your nervous system sends signals to muscles. Your muscles pull on bones and squeeze lymphatic vessels. Your hormones influence tissue repair. Your immune cells travel through lymph that your movement propels. It all speaks the same language.
              </p>
              <p className="body-text">
                Your body already knows how to stand, how to move, how to rebuild what breaks down. That intelligence is encoded in tissue that has been adapting to gravity and motion for hundreds of millions of years. The wisdom is there. Your job is to stop interfering with it.
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

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Lifestyle Factors
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Prolonged sitting patterns throughout the day</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Extended periods without position changes</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Sleep positions that create strain or compression</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Movement patterns dominated by repetitive motions</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Physical inactivity following illness or injury</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Avoidance of activities due to past pain experiences</span>
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
                    <span>Inadequate protein intake affecting tissue repair</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Insufficient collagen-supporting nutrients</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Low intake of anti-inflammatory foods</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Dehydration affecting tissue pliability</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Mineral imbalances affecting muscle function</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Foods that may contribute to systemic inflammation</span>
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
                    <span>Workstation setup that encourages poor posture</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Chair height, screen position, and desk ergonomics</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Mattress and pillow support during sleep</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Footwear that alters natural gait patterns</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Carrying heavy bags on one shoulder consistently</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Environments that restrict natural movement throughout the day</span>
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
                    <span>Protective posturing from past physical or emotional trauma</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Holding patterns that reflect unexpressed emotions</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Tension accumulating in jaw, shoulders, or back during conflict</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Movement restriction from fear of pain or re-injury</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Body armoring in response to feeling unsafe</span>
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
                    <span>Crossing the same leg repeatedly</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Favoring one side for carrying, reaching, or standing</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Slumping when tired or distracted</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Compensatory movements that have become automatic</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Bracing or guarding patterns that persist after tissue healing</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Rushing through movements without awareness</span>
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
                    <span>Hours of screen time with head jutting forward</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Looking down at phones repeatedly throughout the day</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Scrolling and typing positions straining hands and wrists</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Gaming postures that lock the body in fixed positions</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Virtual meetings keeping the body static for extended periods</span>
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
                The Structure & Movement System communicates through <strong>30 signals</strong> across 8 categories.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Posture & Alignment Signals (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Poor Posture Awareness</li>
                    <li>• Forward Head Position</li>
                    <li>• Spinal Curvature Abnormalities</li>
                    <li>• Structural Asymmetry</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Muscle Tension & Holding Patterns (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Chronic Muscle Tension</li>
                    <li>• Trigger Points / Muscle Knots</li>
                    <li>• Fascial Restrictions</li>
                    <li>• Jaw Tension / TMJ Holding</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Mobility & Flexibility Signals (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Reduced Range of Motion</li>
                    <li>• Morning Stiffness (Brief)</li>
                    <li>• Global Inflexibility</li>
                    <li>• Joint Hypermobility</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Strength & Stability Signals (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Muscular Weakness</li>
                    <li>• Core Instability</li>
                    <li>• Balance Impairment</li>
                    <li>• Joint Instability</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Pain & Discomfort Signals (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Joint Pain</li>
                    <li>• Muscle Pain</li>
                    <li>• Movement-Related Pain</li>
                    <li>• Load-Bearing Pain</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Movement Quality Signals (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Compensatory Movement Patterns</li>
                    <li>• Loss of Coordination</li>
                    <li>• Guarded Movement</li>
                    <li>• Movement Feels Effortful</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Lymphatic Flow Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Inactivity-Related Swelling</li>
                    <li>• Sluggish Lymph Feeling</li>
                    <li>• Localized Puffiness</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Recovery & Fatigue Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Prolonged Post-Exercise Soreness</li>
                    <li>• Reduced Exercise Tolerance</li>
                    <li>• Muscle Fatigue with Minimal Effort</li>
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
                      You bend down to pick something up and feel a sharp twinge in your lower back. Or you notice your neck aches after a day of work. Or your knee feels unstable walking downstairs.
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
                      Your body responds immediately. Muscles tighten around the area. You shift your weight. You hold your breath slightly. You move more cautiously.
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
                      Your brain assigns a story. &quot;Something is wrong with my back.&quot; &quot;I&apos;m getting old.&quot; &quot;I must have injured myself.&quot; &quot;This is going to get worse.&quot; &quot;I shouldn&apos;t bend like that anymore.&quot;
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
                      What if you paused before the assumption solidified? Does this signal change with position or movement? How long does morning stiffness last—under thirty minutes or over an hour? Is this related to a specific movement or constant regardless of activity? Was there a period of inactivity before this started? Does it respond to movement, heat, or manual pressure? Is this creating compensatory patterns elsewhere in my body?
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
                      You remember this investigation. The twinge in your back was position-dependent. It improved with gentle movement. It correlated with three days of sitting more than usual. It resolved when you started walking again. You encode this: my body responded to immobility with stiffness, not damage.
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
                      <td className="py-3 pr-4">Arthritis, &quot;getting old&quot;</td>
                      <td className="py-3">Brief morning stiffness that resolves with movement (mechanical pattern)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Anxiety, stress disorder, psychological</td>
                      <td className="py-3">Chronic muscle tension from postural or mechanical patterns</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Laziness, lack of discipline</td>
                      <td className="py-3">Poor posture related to muscular endurance or proprioception</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Just how I move,&quot; normal</td>
                      <td className="py-3">Compensatory movement patterns creating strain elsewhere</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Inevitable decline, aging</td>
                      <td className="py-3">Deconditioning that responds to progressive loading</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Being flexible, good at yoga</td>
                      <td className="py-3">Joint hypermobility with stability challenges</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Fibromyalgia, nerve pain, psychosomatic</td>
                      <td className="py-3">Trigger points with characteristic referral patterns</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Weight gain, water retention</td>
                      <td className="py-3">Lymphatic puffiness that improves with movement</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Injury requiring complete rest</td>
                      <td className="py-3">Movement-related pain that benefits from modified activity</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Inner ear problem, vestibular disorder</td>
                      <td className="py-3">Balance impairment from muscular or proprioceptive factors</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Permanent damage, &quot;bone on bone&quot;</td>
                      <td className="py-3">Reduced range of motion that improves with consistent mobility work</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Weak abs, need more crunches</td>
                      <td className="py-3">Core instability involving deep stabilizer coordination</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Bad habit, tech addiction</td>
                      <td className="py-3">Forward head position creating downstream mechanical effects</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Out of shape, lazy, not trying</td>
                      <td className="py-3">Muscle fatigue related to deconditioning</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Weak joint, need surgery</td>
                      <td className="py-3">Joint instability that responds to targeted strengthening</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Just not a flexible person, genetic</td>
                      <td className="py-3">Global inflexibility from tissue adaptation to limited ranges</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Fear, anxiety, malingering</td>
                      <td className="py-3">Guarded movement that persists after tissue healing</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Normal variation, nothing to address</td>
                      <td className="py-3">Structural asymmetry creating compensatory patterns</td>
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
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Noticing how your posture changes throughout the day without correction</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Observing which activities create stiffness and which create ease</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Paying attention to whether signals change with position, movement, or load</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Recognizing patterns in when swelling appears and what helps it resolve</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Tracking whether morning stiffness resolves within thirty minutes or persists</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Noticing compensatory patterns—which side do you favor, where do you brace?</span>
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
                    <span>Gentle movement first thing in the morning to explore stiffness patterns</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Walking to observe how movement affects swelling and lymphatic flow</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Position changes throughout the day rather than sustained static postures</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Exploring range of motion without forcing end ranges</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Movement variety—different directions, speeds, and loads</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Self-massage or foam rolling to explore areas of fascial restriction</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Breathing practices that engage the diaphragm and core stabilizers</span>
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
                    <span>Workstation modifications that support neutral posture without forcing it</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Standing desk options or position variety throughout the day</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Screen height that doesn&apos;t require forward head position</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Chair support that allows natural spinal curves</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Footwear that permits natural foot mechanics</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Sleep surface and pillow arrangements that don&apos;t create strain</span>
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
                    <span>Physical therapists who assess movement patterns and tissue function</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Manual therapists (massage, myofascial release) for tension and restriction patterns</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Movement specialists (Feldenkrais, Alexander Technique) for awareness and retraining</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Structural integration practitioners for fascial patterns</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Lymphatic drainage specialists for chronic swelling patterns</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Sports medicine physicians for mechanical injuries and pain patterns</span>
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
                <ul className="space-y-4 body-text">
                  <li>
                    <p className="font-bold text-navy mb-1">Daily movement</p>
                    <p>The lymphatic system pumps with muscle contraction. This doesn&apos;t require intense exercise—walking, stretching, gentle movement throughout the day keeps fluid moving and tissue healthy.</p>
                  </li>
                  <li>
                    <p className="font-bold text-navy mb-1">Position variety</p>
                    <p>No single posture is ideal for extended periods. The best posture is your next posture. Change positions frequently rather than optimizing one static position.</p>
                  </li>
                  <li>
                    <p className="font-bold text-navy mb-1">Brief mobility work</p>
                    <p>Five minutes of movement through available ranges helps maintain tissue pliability. This isn&apos;t stretching to force flexibility—it&apos;s moving through what your body currently allows.</p>
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
                    <span>Morning stiffness duration—does it resolve within thirty minutes?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>How does movement affect signals—better, worse, or no change?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Which activities correlate with increased tension or pain?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Whether swelling responds to movement and elevation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>How soreness duration compares to what seems typical</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Whether signals create compensatory patterns elsewhere</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  The Patience Principle
                </h3>
                <p className="body-text mb-4">
                  Structural patterns develop over months and years. They don&apos;t reorganize overnight. Fascia remodels along lines of tension, but this process takes time—typically months of consistent input before tissue architecture changes. Deconditioning reverses with progressive loading, but muscle and cardiovascular adaptation follows biological timelines, not willpower.
                </p>
                <p className="body-text">
                  Meaningful change in this system often becomes noticeable within four to twelve weeks of consistent practice. Some signals shift quickly (morning stiffness, lymphatic puffiness). Others take longer (postural patterns, fascial restrictions, strength building). Trust the process. Consistency matters more than intensity.
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does position or movement change this signal?</strong>
                  <br />If yes, this points toward Structure & Movement. If no change regardless of position or activity, consider Defense (inflammatory), Energy Production, or other systems.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does the signal have a clear mechanical relationship to load or motion?</strong>
                  <br />Specific movements reproducing it suggests Structure. Constant regardless of activity suggests other systems.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">How long does morning stiffness last?</strong>
                  <br />Under thirty minutes that resolves with movement points to Structure (mechanical). Over one hour with swelling or heat suggests Defense (inflammatory).
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does swelling improve with movement and elevation?</strong>
                  <br />Yes points to Structure (lymphatic). No, or with heat and redness, suggests Circulation or Defense.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is there heat, redness, or swelling at the pain site?</strong>
                  <br />Yes suggests Defense (inflammatory). No, and position-dependent, suggests Structure (mechanical). Throbbing with pulse suggests Circulation.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is weakness specific to certain muscles or global?</strong>
                  <br />Specific to particular movements points to Structure. Global weakness with fatigue suggests Energy Production. Correlated with stress suggests Stress Response.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does this respond to physical therapy, movement, or manual treatment?</strong>
                  <br />Yes strongly points to Structure. No response to physical approaches suggests other systems.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does muscle tension correlate with stress levels?</strong>
                  <br />If it releases with relaxation, consider Stress Response. If constant regardless of mental state, consider Structure (postural/mechanical pattern).
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this related to deconditioning or a period of disuse?</strong>
                  <br />If it followed inactivity and responds to gradual loading, this is Structure (trainable, reversible). If progressive despite activity, consider other systems.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Are there compensatory movements elsewhere in the body?</strong>
                  <br />Yes points to Structure (biomechanical adaptation). Primary issues in one area often create secondary problems elsewhere.
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

            <div className="space-y-4">
              <div className="be-card border-l-4 border-l-gold">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Defense System
                  </h3>
                </div>
                <p className="body-text">
                  Pain with heat, swelling, or morning stiffness lasting over one hour may involve inflammatory processes rather than mechanical patterns. Chronic pain without tissue damage may involve central sensitization.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-electric-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-electric-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Energy Production System
                  </h3>
                </div>
                <p className="body-text">
                  Global weakness and fatigue affecting all activities may be cellular energy rather than muscular. Muscle fatigue with minimal effort that doesn&apos;t improve with training warrants exploration of metabolic factors.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-pink-accent">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-pink-accent" />
                  <h3 className="font-heading font-bold text-navy">
                    Stress Response System
                  </h3>
                </div>
                <p className="body-text">
                  Tension that correlates with mental state and releases with relaxation involves the stress system. Protective postures adopted during high-stress periods may become mechanical patterns that persist.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-deep-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-deep-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Circulation System
                  </h3>
                </div>
                <p className="body-text">
                  Swelling that doesn&apos;t respond to movement, is bilateral and pitting, or throbs with pulse involves circulatory factors. Balance issues with dizziness or vertigo warrant evaluation of vestibular function.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-gold">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Hydration System
                  </h3>
                </div>
                <p className="body-text">
                  Swelling patterns related to fluid and mineral balance, particularly with dietary correlation, involve hydration. Muscle cramping may connect to electrolyte balance.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-electric-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-electric-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Regeneration System
                  </h3>
                </div>
                <p className="body-text">
                  Prolonged soreness, slow healing, and tissue changes with aging involve regenerative capacity. When structural issues don&apos;t respond to appropriate loading, regeneration factors warrant exploration.
                </p>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="mb-12">
            <div className="be-card bg-gradient-to-br from-navy to-deep-blue text-white">
              <p className="text-lg leading-relaxed">
                Your body already knows how to stand, how to move, how to rebuild what breaks down. That intelligence is encoded in tissue that has been adapting to gravity and motion for hundreds of millions of years. The wisdom is there. Your job is to stop interfering with it and start listening to what your structure is communicating.
              </p>
            </div>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Link
              href="/systems/stress-response"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              ← Stress Response
            </Link>
            <Link
              href="/systems"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              All Systems
            </Link>
            <Link
              href="/systems/temperature"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              Temperature →
            </Link>
          </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Structure & Movement | bioEDGE Decoder",
  description:
    "Your Body's Living Architecture. Explore the bioEDGE Decoder framework for understanding bones, joints, connective tissue, muscles, and mobility.",
}
