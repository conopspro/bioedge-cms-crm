import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SystemDirectory } from "@/components/directory/system-solutions"
import { SystemNews } from "@/components/directory/system-news"

/**
 * Hydration System Page
 *
 * Part of the bioEDGE Decoder 15 Biological Systems Framework.
 * Covers fluid balance, electrolytes, and cellular hydration.
 */

export default function HydrationSystemPage() {
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
            Hydration System
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Internal Ocean
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
              Your body is approximately 60% water. Your brain floats in fluid. Your joints slide on cushions of moisture. Every cell in your body exists within a carefully regulated internal ocean, and the composition of that ocean determines whether your cells can communicate, contract, conduct electrical signals, or perform any of the biochemical reactions that keep you alive.
            </p>

            <p>
              This is what the Hydration System governs: <strong className="text-navy">fluid balance, mineral distribution, and electrical conductivity across cell membranes.</strong>
            </p>

            <p>
              What makes this system unique among all fourteen is that it provides the medium in which every other system operates. Your Energy Production system cannot generate ATP without the right fluid environment. Your Circulation system cannot transport oxygen without adequate blood volume. Your nervous system cannot fire electrical signals without the precise electrolyte gradients that water and minerals create. When hydration is compromised, cells cannot communicate efficiently, and every system downstream feels the effects.
            </p>

            <p>
              Water does not simply fill space in your body. It transports nutrients, removes metabolic waste, cushions your organs, and regulates your temperature. Electrolytes—sodium, potassium, magnesium, calcium, chloride—create the electrical gradients that power nerve conduction, muscle contraction, and cellular communication.
            </p>

            <p>
              This is your psychophysiological supersystem at work. Your endocrine system monitors fluid balance and signals thirst through antidiuretic hormone. Your nervous system registers changes in blood volume and adjusts heart rate to compensate. Your kidneys regulate what stays and what leaves. These systems do not operate in isolation. They communicate constantly through shared messengers and feedback loops so integrated that affecting one inevitably affects the others.
            </p>

            <p>
              Your body already knows how to maintain this balance. For millions of years, your ancestors found water, regulated their intake, and preserved the internal ocean that made all other functions possible. That intelligence is encoded in you. Your job is not to override this system but to listen to what it&apos;s telling you.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              The following factors may be worth examining if you&apos;re exploring whether your hydration signals are responding to something in your environment, habits, or daily patterns. These are not causes or diagnoses—they are considerations.
            </p>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Activity patterns involving significant sweating without corresponding fluid replacement</li>
              <li>Sleep patterns resulting in 8+ hours without water intake</li>
              <li>Daily rhythms without regular water access or drinking opportunities</li>
              <li>Extended periods of sitting or standing affecting fluid distribution</li>
              <li>Habitual suppression of thirst cues due to busy schedules</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>High sodium intake from processed or restaurant foods</li>
              <li>Low intake of water-rich foods such as fruits and vegetables</li>
              <li>Caffeine consumption patterns increasing fluid output</li>
              <li>Alcohol intake inhibiting antidiuretic hormone</li>
              <li>High protein diets increasing water needs for processing</li>
              <li>Timing of fluid intake relative to meals and activities</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Air conditioning or heating systems reducing ambient humidity</li>
              <li>High-altitude environments with increased respiratory fluid loss</li>
              <li>Hot or humid climates increasing sweating</li>
              <li>Dry office environments</li>
              <li>Limited access to clean drinking water throughout the day</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Stress states increasing cortisol and affecting fluid balance</li>
              <li>Emotional patterns leading to forgetting basic needs like drinking water</li>
              <li>Anxiety about bathroom access leading to intentional under-hydrating</li>
              <li>Caregiving responsibilities prioritizing others&apos; needs over personal hydration</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Drinking only when thirsty rather than maintaining steady intake</li>
              <li>Habitual substitution of caffeinated or sweetened beverages for water</li>
              <li>Forgetting to drink water when absorbed in work or activities</li>
              <li>Using thirst as the only indicator (thirst often appears after dehydration has begun)</li>
              <li>Chronic mild under-hydration that has become normalized</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Extended screen time without breaks that might prompt water intake</li>
              <li>Absorption in digital activities overriding body signal awareness</li>
              <li>Working through natural break times when hydration would typically occur</li>
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
              The Hydration System communicates through <strong>26 signals</strong> organized across 8 categories.
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Fluid Deficit Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Thirst / Dry Mouth</li>
              <li>Dark Urine / Reduced Urination</li>
              <li>Dry Skin / Poor Skin Turgor</li>
              <li>Sunken Eyes / Hollow Appearance</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Electrolyte Imbalance Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Muscle Cramps / Spasms</li>
              <li>Muscle Twitching / Fasciculations</li>
              <li>Heart Palpitations / Irregular Heartbeat</li>
              <li>Numbness or Tingling</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Cognitive &amp; Mental Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Dehydration Headache</li>
              <li>Mental Fog / Cognitive Slowing</li>
              <li>Difficulty Concentrating</li>
              <li>Irritability / Mood Changes</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Energy &amp; Performance Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fatigue / Lethargy</li>
              <li>Reduced Physical Performance</li>
              <li>Delayed Recovery After Exercise</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Digestive &amp; Elimination Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Constipation</li>
              <li>Reduced Sweating / Inability to Sweat</li>
              <li>Decreased Tear Production / Dry Eyes</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Circulatory &amp; Blood Pressure Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Lightheadedness / Dizziness</li>
              <li>Low Blood Pressure / Orthostatic Hypotension</li>
              <li>Rapid Heart Rate at Rest</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Temperature Regulation Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Heat Intolerance</li>
              <li>Feeling Cold / Chills with Dehydration</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Fluid Excess &amp; Imbalance Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Edema / Swelling</li>
              <li>Excessive Urination / Frequent Urination</li>
              <li>Overhydration / Water Intoxication Signs</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You notice a dull headache building in the afternoon. Your mouth feels dry. You haven&apos;t been to the bathroom in hours. Your concentration keeps slipping.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your body is sending signals through multiple channels at once—pain receptors in your head, dryness in mucous membranes, reduced urine output, cognitive fog settling in.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> The brain assigns stories to these signals: &quot;I&apos;m stressed from work.&quot; &quot;I always get headaches.&quot; &quot;I didn&apos;t sleep well last night.&quot; &quot;I&apos;m just getting older.&quot; &quot;I need more coffee.&quot;
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> What if the signal is simpler than the story? What color is your urine right now? When did you last drink water—not coffee, not soda, but water? Did this headache follow a period of sweating, heat exposure, or inadequate intake? Would this improve if you drank a glass of water with a pinch of salt? Has this happened before at the same time of day?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> You notice the pattern: afternoon headaches correlate with mornings spent drinking only coffee. You remember this signal cluster. Next time it appears, the first question is not &quot;what&apos;s wrong with me?&quot; but &quot;what&apos;s my urine color?&quot;
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
                    <td className="py-3 pr-4">Tension headache, migraine, stress headache</td>
                    <td className="py-3">Dehydration headache—especially if it follows inadequate intake, sweating, or alcohol</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Brain fog, ADHD, cognitive decline</td>
                    <td className="py-3">Mental fog from dehydration—especially if it resolves within 30-60 minutes of drinking water</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Chronic fatigue syndrome, laziness, depression</td>
                    <td className="py-3">Fatigue from dehydration—especially if it improves with hydration</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Overuse injury, aging, &quot;normal for exercise&quot;</td>
                    <td className="py-3">Muscle cramps from electrolyte deficit—especially if cramps follow sweating or respond to electrolytes</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Mood disorder, personality flaw, anxiety</td>
                    <td className="py-3">Irritability from dehydration—especially if mood normalizes with fluid intake</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">IBS, digestive disorder, &quot;slow metabolism&quot;</td>
                    <td className="py-3">Constipation from dehydration—especially if bowel movements improve with increased water</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Anxiety, inner ear problem, vertigo</td>
                    <td className="py-3">Dizziness from reduced blood volume—especially if worse when standing after fluid loss</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Anxiety disorder, panic attacks, heart disease</td>
                    <td className="py-3">Heart palpitations from electrolyte imbalance—especially if following sweating, diuretics, or heat exposure</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Being out of shape, aging, lack of motivation</td>
                    <td className="py-3">Reduced physical performance from dehydration—even 2% dehydration can reduce performance by 10-20%</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">ADHD, stress, lack of discipline</td>
                    <td className="py-3">Poor concentration from dehydration—especially if focus improves after drinking water</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Aging, eczema, &quot;just dry skin&quot;</td>
                    <td className="py-3">Dry skin from chronic dehydration—especially if accompanied by other fluid deficit signals</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Stress, ALS fear, neurological problem</td>
                    <td className="py-3">Muscle twitching from mineral insufficiency—especially if worse after caffeine or intense exercise</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Diabetes only, anxiety</td>
                    <td className="py-3">Excessive thirst that doesn&apos;t resolve—worth exploring whether basic hydration status has been addressed first</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Thyroid problem only, menopause</td>
                    <td className="py-3">Heat intolerance—dehydration impairs thermoregulation and may contribute alongside other factors</td>
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
              The following options are not prescriptions. They are possibilities to explore, ways of observing, and resources to consider.
            </p>

            <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Noticing urine color as a simple, accessible indicator—pale yellow generally suggests adequate hydration, dark amber suggests deficit</li>
              <li>Observing timing of signals throughout the day and whether they correlate with intake patterns</li>
              <li>Paying attention to whether signals cluster together (thirst + headache + dark urine + fatigue)</li>
              <li>Noticing how quickly signals resolve with fluid intake—often within 30-60 minutes</li>
              <li>Becoming aware that thirst sensation may diminish with age or habit</li>
              <li>Observing whether signals worsen after caffeine, alcohol, or heat exposure</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Testing whether headaches, fatigue, or mood changes improve with water intake before reaching for other interventions</li>
              <li>Exploring whether electrolyte-rich foods or drinks help more than plain water alone</li>
              <li>Experimenting with intake timing—consistent small amounts vs. large amounts at intervals</li>
              <li>Noticing how intake before, during, and after exercise affects performance and recovery</li>
              <li>Exploring the relationship between hydration and sleep quality</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keeping water accessible in frequently occupied spaces</li>
              <li>Using visual cues or reminders if intake tends to be forgotten</li>
              <li>Considering ambient humidity in living and working spaces</li>
              <li>Adjusting fluid intake based on climate, altitude, and activity levels</li>
              <li>Creating natural break points in the day when hydration can be addressed</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Primary care providers who can assess overall fluid balance and rule out underlying conditions</li>
              <li>Registered dietitians specializing in sports nutrition or general hydration practices</li>
              <li>Nephrologists for concerns about kidney function and fluid regulation</li>
              <li>Cardiologists if fluid balance appears connected to blood pressure or heart rhythm</li>
              <li>Endocrinologists if excessive thirst or urination suggests hormonal involvement</li>
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
              <li><strong className="text-navy">Starting the day with water.</strong> The body has been without fluid intake for hours during sleep.</li>
              <li><strong className="text-navy">Maintaining steady intake throughout the day.</strong> Rather than large amounts at intervals.</li>
              <li><strong className="text-navy">Including water with meals.</strong> A natural anchor point.</li>
              <li><strong className="text-navy">Drinking before thirst signals become pronounced.</strong> Thirst often indicates dehydration has already begun.</li>
              <li><strong className="text-navy">Replenishing after any activity that causes sweating or fluid loss.</strong></li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <ul className="list-disc pl-6 space-y-2">
              <li>Observing urine color at different times of day without judgment, simply gathering information</li>
              <li>Noticing which times of day headaches, fatigue, or concentration difficulties tend to appear</li>
              <li>Noting how intake changes with seasons, activity levels, and environmental conditions</li>
              <li>Paying attention to whether certain signals cluster together and what precedes them</li>
              <li>Observing recovery time after exercise and whether it correlates with post-activity hydration</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              Hydration signals often respond rapidly—many improve within 30-60 minutes of adequate intake. Urine color typically shifts within hours. However, chronic dehydration patterns that have developed over months or years may take days or weeks of consistent intake to fully resolve. Dry skin and constipation that have become habitual may require sustained attention rather than a single glass of water. Approach this system with patience while also recognizing it is one of the more responsive systems to direct intervention.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              The following questions may help you explore whether a signal originates from the Hydration System or another system.
            </p>

            <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Does this signal improve within 30-60 minutes of drinking water with electrolytes if needed? A rapid response points strongly toward Hydration.</li>
              <li>Is there a recent history of fluid loss—sweating, heat exposure, exercise, vomiting, diarrhea, alcohol? Context of fluid loss points toward Hydration.</li>
              <li>What color is your urine currently? Dark yellow, amber, or brown points toward fluid deficit. Pale yellow suggests less likely dehydration. Completely clear with frequent urination might indicate overhydration or Hormonal involvement.</li>
              <li>Are multiple hydration signals present together? Signal clustering (thirst + dark urine + headache + fatigue) strongly points toward Hydration.</li>
              <li>Is this signal worse after exercise, heat exposure, or sweating? A relationship to physical activity or heat points toward Hydration.</li>
              <li>Do electrolyte-rich foods or drinks help more than plain water alone? If yes, the electrolyte component of Hydration may be involved.</li>
              <li>Does the signal follow a daily pattern related to intake? Worse in morning from overnight deficit or worse in afternoon from cumulative deficit points toward Hydration.</li>
              <li>Is the signal orthostatic—worse when standing up? If yes, with other hydration signals, this points to Hydration from reduced blood volume.</li>
              <li>Did this signal develop in relation to caffeine, alcohol, or diuretic use? These substances increase fluid loss and point toward Hydration.</li>
              <li>Is this an acute change or a chronic pattern? Acute onset after identifiable fluid loss points toward Hydration. Chronic patterns despite adequate intake may involve other systems.</li>
              <li>Does increasing water intake over 24-48 hours resolve these signals? Resolution confirms Hydration. Partial improvement suggests Hydration may be a contributing factor. No improvement suggests considering Energy Production, Defense, Hormonal, or Circulation.</li>
            </ol>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              <strong className="text-navy">Energy Production System</strong> — Fatigue may originate from either system. If fatigue improves within 30-60 minutes of drinking water, Hydration is likely involved. If fatigue improves with food, Energy Production may be the primary source. Both systems can contribute simultaneously.
            </p>

            <p>
              <strong className="text-navy">Circulation System</strong> — Dizziness, orthostatic hypotension, and rapid heart rate can arise from either reduced blood volume (Hydration) or primary cardiovascular factors (Circulation). The distinguishing question is whether there&apos;s been recent fluid loss and whether signals respond to rehydration.
            </p>

            <p>
              <strong className="text-navy">Stress Response System</strong> — Headache, heart palpitations, and irritability can appear with both dehydration and stress activation. If stress-triggered with no fluid context, the Stress Response system may be primary. If preceded by sweating, heat, or inadequate intake, Hydration is worth exploring first.
            </p>

            <p>
              <strong className="text-navy">Hormonal System</strong> — Excessive thirst that doesn&apos;t resolve with drinking, heart palpitations with temperature sensitivity and weight changes, and frequent urination may indicate Hormonal involvement (such as thyroid or blood sugar regulation) rather than primary Hydration. Hormonal conditions can also affect fluid balance indirectly.
            </p>

            <p>
              <strong className="text-navy">Consciousness System</strong> — Brain fog and difficulty concentrating can originate from both systems. Hydration-related cognitive fog typically resolves quickly with fluid intake. Persistent fog despite adequate hydration suggests Consciousness, Energy Production, or Detoxification.
            </p>

            <p>
              <strong className="text-navy">Digestive System</strong> — Constipation can involve both systems. If bowel movements improve with increased water intake, Hydration is likely contributing. If constipation persists despite adequate hydration, the Digestive system may require separate attention.
            </p>


            <Suspense fallback={null}>
              <SystemNews system="Hydration" label="Hydration" />
            </Suspense>

            <Suspense fallback={null}>
              <SystemDirectory system="Hydration" label="Hydration" />
            </Suspense>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your body already knows how to maintain its internal ocean. The signals are not symptoms of something wrong with you—they are accurate reports from a system that has been communicating fluid status for as long as your ancestors have existed. Your role is not to override this intelligence but to listen to what it&apos;s telling you.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/hormonal"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Hormonal
            </Link>
            <Link
              href="/systems/nervous-system"
              className="inline-flex items-center gap-2 text-sm text-[#017ab2] hover:text-navy transition-colors font-medium"
            >
              Next: Nervous System
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Hydration System | bioEDGE Decoder",
  description:
    "Your Body's Internal Ocean. Explore the bioEDGE Decoder framework for understanding fluid balance, electrolytes, and cellular hydration signals.",
  alternates: {
    canonical: "/systems/hydration",
  },
}
