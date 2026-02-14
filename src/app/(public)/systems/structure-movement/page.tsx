import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Systems
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Structure & Movement
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Living Architecture
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
              Your body is a structural masterpiece that rebuilds itself constantly. Right now, your skeleton is remodeling, bone cells dissolving old tissue while others lay down new. Your fascia—a continuous web of connective tissue—responds to every movement you make, reorganizing its fibers along lines of tension. Your muscles remember patterns, encode movement habits, and adapt their architecture to what you ask of them.
            </p>

            <p>
              This system governs <strong className="text-navy">posture, motion, and lymphatic pumping through muscular contraction</strong>. It maintains structural integrity through bones, joints, ligaments, tendons, and fascia while enabling all physical motion through muscular contraction.
            </p>

            <p>
              What makes this system unique among the fourteen: <strong className="text-navy">your lymphatic system has no heart of its own</strong>. Lymph—the fluid that carries immune cells and clears metabolic waste—moves only when muscles contract. Every time you walk, stretch, or shift position, you&apos;re pumping your lymphatic system. Stillness isn&apos;t neutral. Stillness means stagnation.
            </p>

            <p>
              When this system is coherent, posture is effortless. Movement is fluid. Lymph flows freely. You don&apos;t have to think about standing straight or remember to move your body correctly. The architecture simply works.
            </p>

            <p>
              This is your psychophysiological supersystem at its most tangible. Your nervous system sends signals to muscles. Your muscles pull on bones and squeeze lymphatic vessels. Your hormones influence tissue repair. Your immune cells travel through lymph that your movement propels. It all speaks the same language.
            </p>

            <p>
              Your body already knows how to stand, how to move, how to rebuild what breaks down. That intelligence is encoded in tissue that has been adapting to gravity and motion for hundreds of millions of years. The wisdom is there. Your job is to stop interfering with it.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Prolonged sitting patterns throughout the day</li>
              <li>Extended periods without position changes</li>
              <li>Sleep positions that create strain or compression</li>
              <li>Movement patterns dominated by repetitive motions</li>
              <li>Physical inactivity following illness or injury</li>
              <li>Avoidance of activities due to past pain experiences</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Inadequate protein intake affecting tissue repair</li>
              <li>Insufficient collagen-supporting nutrients</li>
              <li>Low intake of anti-inflammatory foods</li>
              <li>Dehydration affecting tissue pliability</li>
              <li>Mineral imbalances affecting muscle function</li>
              <li>Foods that may contribute to systemic inflammation</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Workstation setup that encourages poor posture</li>
              <li>Chair height, screen position, and desk ergonomics</li>
              <li>Mattress and pillow support during sleep</li>
              <li>Footwear that alters natural gait patterns</li>
              <li>Carrying heavy bags on one shoulder consistently</li>
              <li>Environments that restrict natural movement throughout the day</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Protective posturing from past physical or emotional trauma</li>
              <li>Holding patterns that reflect unexpressed emotions</li>
              <li>Tension accumulating in jaw, shoulders, or back during conflict</li>
              <li>Movement restriction from fear of pain or re-injury</li>
              <li>Body armoring in response to feeling unsafe</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Crossing the same leg repeatedly</li>
              <li>Favoring one side for carrying, reaching, or standing</li>
              <li>Slumping when tired or distracted</li>
              <li>Compensatory movements that have become automatic</li>
              <li>Bracing or guarding patterns that persist after tissue healing</li>
              <li>Rushing through movements without awareness</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Hours of screen time with head jutting forward</li>
              <li>Looking down at phones repeatedly throughout the day</li>
              <li>Scrolling and typing positions straining hands and wrists</li>
              <li>Gaming postures that lock the body in fixed positions</li>
              <li>Virtual meetings keeping the body static for extended periods</li>
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
              The Structure & Movement System communicates through <strong>30 signals</strong> across 8 categories.
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Posture &amp; Alignment Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Poor Posture Awareness</li>
              <li>Forward Head Position</li>
              <li>Spinal Curvature Abnormalities</li>
              <li>Structural Asymmetry</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Muscle Tension &amp; Holding Patterns (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Chronic Muscle Tension</li>
              <li>Trigger Points / Muscle Knots</li>
              <li>Fascial Restrictions</li>
              <li>Jaw Tension / TMJ Holding</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Mobility &amp; Flexibility Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Reduced Range of Motion</li>
              <li>Morning Stiffness (Brief)</li>
              <li>Global Inflexibility</li>
              <li>Joint Hypermobility</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Strength &amp; Stability Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Muscular Weakness</li>
              <li>Core Instability</li>
              <li>Balance Impairment</li>
              <li>Joint Instability</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Pain &amp; Discomfort Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Joint Pain</li>
              <li>Muscle Pain</li>
              <li>Movement-Related Pain</li>
              <li>Load-Bearing Pain</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Movement Quality Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Compensatory Movement Patterns</li>
              <li>Loss of Coordination</li>
              <li>Guarded Movement</li>
              <li>Movement Feels Effortful</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Lymphatic Flow Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Inactivity-Related Swelling</li>
              <li>Sluggish Lymph Feeling</li>
              <li>Localized Puffiness</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Recovery &amp; Fatigue Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Prolonged Post-Exercise Soreness</li>
              <li>Reduced Exercise Tolerance</li>
              <li>Muscle Fatigue with Minimal Effort</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You bend down to pick something up and feel a sharp twinge in your lower back. Or you notice your neck aches after a day of work. Or your knee feels unstable walking downstairs.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your body responds immediately. Muscles tighten around the area. You shift your weight. You hold your breath slightly. You move more cautiously.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> Your brain assigns a story. &quot;Something is wrong with my back.&quot; &quot;I&apos;m getting old.&quot; &quot;I must have injured myself.&quot; &quot;This is going to get worse.&quot; &quot;I shouldn&apos;t bend like that anymore.&quot;
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> What if you paused before the assumption solidified? Does this signal change with position or movement? How long does morning stiffness last—under thirty minutes or over an hour? Is this related to a specific movement or constant regardless of activity? Was there a period of inactivity before this started? Does it respond to movement, heat, or manual pressure? Is this creating compensatory patterns elsewhere in my body?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> You remember this investigation. The twinge in your back was position-dependent. It improved with gentle movement. It correlated with three days of sitting more than usual. It resolved when you started walking again. You encode this: my body responded to immobility with stiffness, not damage.
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
                    <td className="py-3 pr-4">Arthritis, &quot;getting old&quot;</td>
                    <td className="py-3">Brief morning stiffness that resolves with movement (mechanical pattern)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Anxiety, stress disorder, psychological</td>
                    <td className="py-3">Chronic muscle tension from postural or mechanical patterns</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Laziness, lack of discipline</td>
                    <td className="py-3">Poor posture related to muscular endurance or proprioception</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Just how I move,&quot; normal</td>
                    <td className="py-3">Compensatory movement patterns creating strain elsewhere</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Inevitable decline, aging</td>
                    <td className="py-3">Deconditioning that responds to progressive loading</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Being flexible, good at yoga</td>
                    <td className="py-3">Joint hypermobility with stability challenges</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Fibromyalgia, nerve pain, psychosomatic</td>
                    <td className="py-3">Trigger points with characteristic referral patterns</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Weight gain, water retention</td>
                    <td className="py-3">Lymphatic puffiness that improves with movement</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Injury requiring complete rest</td>
                    <td className="py-3">Movement-related pain that benefits from modified activity</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Inner ear problem, vestibular disorder</td>
                    <td className="py-3">Balance impairment from muscular or proprioceptive factors</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Permanent damage, &quot;bone on bone&quot;</td>
                    <td className="py-3">Reduced range of motion that improves with consistent mobility work</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Weak abs, need more crunches</td>
                    <td className="py-3">Core instability involving deep stabilizer coordination</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Bad habit, tech addiction</td>
                    <td className="py-3">Forward head position creating downstream mechanical effects</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Out of shape, lazy, not trying</td>
                    <td className="py-3">Muscle fatigue related to deconditioning</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Weak joint, need surgery</td>
                    <td className="py-3">Joint instability that responds to targeted strengthening</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Just not a flexible person, genetic</td>
                    <td className="py-3">Global inflexibility from tissue adaptation to limited ranges</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Fear, anxiety, malingering</td>
                    <td className="py-3">Guarded movement that persists after tissue healing</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Normal variation, nothing to address</td>
                    <td className="py-3">Structural asymmetry creating compensatory patterns</td>
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

            <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Noticing how your posture changes throughout the day without correction</li>
              <li>Observing which activities create stiffness and which create ease</li>
              <li>Paying attention to whether signals change with position, movement, or load</li>
              <li>Recognizing patterns in when swelling appears and what helps it resolve</li>
              <li>Tracking whether morning stiffness resolves within thirty minutes or persists</li>
              <li>Noticing compensatory patterns—which side do you favor, where do you brace?</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gentle movement first thing in the morning to explore stiffness patterns</li>
              <li>Walking to observe how movement affects swelling and lymphatic flow</li>
              <li>Position changes throughout the day rather than sustained static postures</li>
              <li>Exploring range of motion without forcing end ranges</li>
              <li>Movement variety—different directions, speeds, and loads</li>
              <li>Self-massage or foam rolling to explore areas of fascial restriction</li>
              <li>Breathing practices that engage the diaphragm and core stabilizers</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Workstation modifications that support neutral posture without forcing it</li>
              <li>Standing desk options or position variety throughout the day</li>
              <li>Screen height that doesn&apos;t require forward head position</li>
              <li>Chair support that allows natural spinal curves</li>
              <li>Footwear that permits natural foot mechanics</li>
              <li>Sleep surface and pillow arrangements that don&apos;t create strain</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Physical therapists who assess movement patterns and tissue function</li>
              <li>Manual therapists (massage, myofascial release) for tension and restriction patterns</li>
              <li>Movement specialists (Feldenkrais, Alexander Technique) for awareness and retraining</li>
              <li>Structural integration practitioners for fascial patterns</li>
              <li>Lymphatic drainage specialists for chronic swelling patterns</li>
              <li>Sports medicine physicians for mechanical injuries and pain patterns</li>
            </ul>

            {/* Execute */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Take action with patience and consistency</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>

            <ol className="list-decimal pl-6 space-y-3">
              <li><strong className="text-navy">Daily movement.</strong> The lymphatic system pumps with muscle contraction. This doesn&apos;t require intense exercise—walking, stretching, gentle movement throughout the day keeps fluid moving and tissue healthy.</li>
              <li><strong className="text-navy">Position variety.</strong> No single posture is ideal for extended periods. The best posture is your next posture. Change positions frequently rather than optimizing one static position.</li>
              <li><strong className="text-navy">Brief mobility work.</strong> Five minutes of movement through available ranges helps maintain tissue pliability. This isn&apos;t stretching to force flexibility—it&apos;s moving through what your body currently allows.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <ul className="list-disc pl-6 space-y-2">
              <li>Morning stiffness duration—does it resolve within thirty minutes?</li>
              <li>How does movement affect signals—better, worse, or no change?</li>
              <li>Which activities correlate with increased tension or pain?</li>
              <li>Whether swelling responds to movement and elevation</li>
              <li>How soreness duration compares to what seems typical</li>
              <li>Whether signals create compensatory patterns elsewhere</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              Structural patterns develop over months and years. They don&apos;t reorganize overnight. Fascia remodels along lines of tension, but this process takes time—typically months of consistent input before tissue architecture changes. Deconditioning reverses with progressive loading, but muscle and cardiovascular adaptation follows biological timelines, not willpower.
            </p>

            <p>
              Meaningful change in this system often becomes noticeable within four to twelve weeks of consistent practice. Some signals shift quickly (morning stiffness, lymphatic puffiness). Others take longer (postural patterns, fascial restrictions, strength building). Trust the process. Consistency matters more than intensity.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong className="text-navy">Does position or movement change this signal?</strong> If yes, this points toward Structure & Movement. If no change regardless of position or activity, consider Defense (inflammatory), Energy Production, or other systems.</li>
              <li><strong className="text-navy">Does the signal have a clear mechanical relationship to load or motion?</strong> Specific movements reproducing it suggests Structure. Constant regardless of activity suggests other systems.</li>
              <li><strong className="text-navy">How long does morning stiffness last?</strong> Under thirty minutes that resolves with movement points to Structure (mechanical). Over one hour with swelling or heat suggests Defense (inflammatory).</li>
              <li><strong className="text-navy">Does swelling improve with movement and elevation?</strong> Yes points to Structure (lymphatic). No, or with heat and redness, suggests Circulation or Defense.</li>
              <li><strong className="text-navy">Is there heat, redness, or swelling at the pain site?</strong> Yes suggests Defense (inflammatory). No, and position-dependent, suggests Structure (mechanical). Throbbing with pulse suggests Circulation.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Deeper Investigation</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong className="text-navy">Is weakness specific to certain muscles or global?</strong> Specific to particular movements points to Structure. Global weakness with fatigue suggests Energy Production. Correlated with stress suggests Stress Response.</li>
              <li><strong className="text-navy">Does this respond to physical therapy, movement, or manual treatment?</strong> Yes strongly points to Structure. No response to physical approaches suggests other systems.</li>
              <li><strong className="text-navy">Does muscle tension correlate with stress levels?</strong> If it releases with relaxation, consider Stress Response. If constant regardless of mental state, consider Structure (postural/mechanical pattern).</li>
              <li><strong className="text-navy">Is this related to deconditioning or a period of disuse?</strong> If it followed inactivity and responds to gradual loading, this is Structure (trainable, reversible). If progressive despite activity, consider other systems.</li>
              <li><strong className="text-navy">Are there compensatory movements elsewhere in the body?</strong> Yes points to Structure (biomechanical adaptation). Primary issues in one area often create secondary problems elsewhere.</li>
            </ol>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              <strong className="text-navy">Defense System</strong> — Pain with heat, swelling, or morning stiffness lasting over one hour may involve inflammatory processes rather than mechanical patterns. Chronic pain without tissue damage may involve central sensitization.
            </p>

            <p>
              <strong className="text-navy">Energy Production System</strong> — Global weakness and fatigue affecting all activities may be cellular energy rather than muscular. Muscle fatigue with minimal effort that doesn&apos;t improve with training warrants exploration of metabolic factors.
            </p>

            <p>
              <strong className="text-navy">Stress Response System</strong> — Tension that correlates with mental state and releases with relaxation involves the stress system. Protective postures adopted during high-stress periods may become mechanical patterns that persist.
            </p>

            <p>
              <strong className="text-navy">Circulation System</strong> — Swelling that doesn&apos;t respond to movement, is bilateral and pitting, or throbs with pulse involves circulatory factors. Balance issues with dizziness or vertigo warrant evaluation of vestibular function.
            </p>

            <p>
              <strong className="text-navy">Hydration System</strong> — Swelling patterns related to fluid and mineral balance, particularly with dietary correlation, involve hydration. Muscle cramping may connect to electrolyte balance.
            </p>

            <p>
              <strong className="text-navy">Regeneration System</strong> — Prolonged soreness, slow healing, and tissue changes with aging involve regenerative capacity. When structural issues don&apos;t respond to appropriate loading, regeneration factors warrant exploration.
            </p>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your body already knows how to stand, how to move, how to rebuild what breaks down. That intelligence is encoded in tissue that has been adapting to gravity and motion for hundreds of millions of years. The wisdom is there. Your job is to stop interfering with it and start listening to what your structure is communicating.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/stress-response"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Stress Response
            </Link>
            <Link
              href="/systems"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors font-medium"
            >
              All Systems
            </Link>
            <Link
              href="/systems/temperature"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-pink-accent transition-colors font-medium"
            >
              Next: Temperature
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
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
