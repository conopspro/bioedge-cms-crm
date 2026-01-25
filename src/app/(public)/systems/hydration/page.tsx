import Link from "next/link"
import {
  Waves,
  AlertCircle,
  Search,
  Sparkles,
  Play,
  HelpCircle,
  LinkIcon,
  ArrowLeft,
} from "lucide-react"

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
              className="inline-flex items-center gap-2 text-white/70 hover:text-gold mb-6 text-sm font-heading"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Systems
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur">
                <Waves className="h-8 w-8 text-gold" />
              </div>
              <p className="text-sm text-gold font-heading uppercase tracking-wider">
                bioEDGE Decoder
              </p>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Hydration System
            </h1>
            <p className="text-xl text-white/80">
              Your Body&apos;s Internal Ocean
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
                Your body is approximately 60% water. Your brain floats in fluid. Your joints slide on cushions of moisture. Every cell in your body exists within a carefully regulated internal ocean, and the composition of that ocean determines whether your cells can communicate, contract, conduct electrical signals, or perform any of the biochemical reactions that keep you alive.
              </p>
              <p className="body-text mb-4">
                This is what the Hydration System governs: <strong>fluid balance, mineral distribution, and electrical conductivity across cell membranes.</strong>
              </p>
              <p className="body-text mb-4">
                What makes this system unique among all fourteen is that it provides the medium in which every other system operates. Your Energy Production system cannot generate ATP without the right fluid environment. Your Circulation system cannot transport oxygen without adequate blood volume. Your nervous system cannot fire electrical signals without the precise electrolyte gradients that water and minerals create. When hydration is compromised, cells cannot communicate efficiently, and every system downstream feels the effects.
              </p>
              <p className="body-text mb-4">
                Water does not simply fill space in your body. It transports nutrients, removes metabolic waste, cushions your organs, and regulates your temperature. Electrolytes—sodium, potassium, magnesium, calcium, chloride—create the electrical gradients that power nerve conduction, muscle contraction, and cellular communication.
              </p>
              <p className="body-text mb-4">
                This is your psychophysiological supersystem at work. Your endocrine system monitors fluid balance and signals thirst through antidiuretic hormone. Your nervous system registers changes in blood volume and adjusts heart rate to compensate. Your kidneys regulate what stays and what leaves. These systems do not operate in isolation. They communicate constantly through shared messengers and feedback loops so integrated that affecting one inevitably affects the others.
              </p>
              <p className="body-text">
                Your body already knows how to maintain this balance. For millions of years, your ancestors found water, regulated their intake, and preserved the internal ocean that made all other functions possible. That intelligence is encoded in you. Your job is not to override this system but to listen to what it&apos;s telling you.
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
              The following factors may be worth examining if you&apos;re exploring whether your hydration signals are responding to something in your environment, habits, or daily patterns. These are not causes or diagnoses—they are considerations.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Lifestyle Factors
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Activity patterns involving significant sweating without corresponding fluid replacement</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Sleep patterns resulting in 8+ hours without water intake</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Daily rhythms without regular water access or drinking opportunities</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Extended periods of sitting or standing affecting fluid distribution</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Habitual suppression of thirst cues due to busy schedules</span>
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
                    <span>High sodium intake from processed or restaurant foods</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Low intake of water-rich foods such as fruits and vegetables</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Caffeine consumption patterns increasing fluid output</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Alcohol intake inhibiting antidiuretic hormone</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>High protein diets increasing water needs for processing</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Timing of fluid intake relative to meals and activities</span>
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
                    <span>Air conditioning or heating systems reducing ambient humidity</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>High-altitude environments with increased respiratory fluid loss</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Hot or humid climates increasing sweating</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Dry office environments</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Limited access to clean drinking water throughout the day</span>
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
                    <span>Stress states increasing cortisol and affecting fluid balance</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Emotional patterns leading to forgetting basic needs like drinking water</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Anxiety about bathroom access leading to intentional under-hydrating</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Caregiving responsibilities prioritizing others&apos; needs over personal hydration</span>
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
                    <span>Drinking only when thirsty rather than maintaining steady intake</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Habitual substitution of caffeinated or sweetened beverages for water</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Forgetting to drink water when absorbed in work or activities</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Using thirst as the only indicator (thirst often appears after dehydration has begun)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Chronic mild under-hydration that has become normalized</span>
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
                    <span>Extended screen time without breaks that might prompt water intake</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Absorption in digital activities overriding body signal awareness</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Working through natural break times when hydration would typically occur</span>
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
                The Hydration System communicates through <strong>26 signals</strong> organized across 8 categories.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Fluid Deficit Signals (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Thirst / Dry Mouth</li>
                    <li>• Dark Urine / Reduced Urination</li>
                    <li>• Dry Skin / Poor Skin Turgor</li>
                    <li>• Sunken Eyes / Hollow Appearance</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Electrolyte Imbalance Signals (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Muscle Cramps / Spasms</li>
                    <li>• Muscle Twitching / Fasciculations</li>
                    <li>• Heart Palpitations / Irregular Heartbeat</li>
                    <li>• Numbness or Tingling</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Cognitive & Mental Signals (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Dehydration Headache</li>
                    <li>• Mental Fog / Cognitive Slowing</li>
                    <li>• Difficulty Concentrating</li>
                    <li>• Irritability / Mood Changes</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Energy & Performance Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Fatigue / Lethargy</li>
                    <li>• Reduced Physical Performance</li>
                    <li>• Delayed Recovery After Exercise</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Digestive & Elimination Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Constipation</li>
                    <li>• Reduced Sweating / Inability to Sweat</li>
                    <li>• Decreased Tear Production / Dry Eyes</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Circulatory & Blood Pressure Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Lightheadedness / Dizziness</li>
                    <li>• Low Blood Pressure / Orthostatic Hypotension</li>
                    <li>• Rapid Heart Rate at Rest</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Temperature Regulation Signals (2)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Heat Intolerance</li>
                    <li>• Feeling Cold / Chills with Dehydration</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Fluid Excess & Imbalance Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Edema / Swelling</li>
                    <li>• Excessive Urination / Frequent Urination</li>
                    <li>• Overhydration / Water Intoxication Signs</li>
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
                      You notice a dull headache building in the afternoon. Your mouth feels dry. You haven&apos;t been to the bathroom in hours. Your concentration keeps slipping.
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
                      Your body is sending signals through multiple channels at once—pain receptors in your head, dryness in mucous membranes, reduced urine output, cognitive fog settling in.
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
                      The brain assigns stories to these signals: &quot;I&apos;m stressed from work.&quot; &quot;I always get headaches.&quot; &quot;I didn&apos;t sleep well last night.&quot; &quot;I&apos;m just getting older.&quot; &quot;I need more coffee.&quot;
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
                      What if the signal is simpler than the story? What color is your urine right now? When did you last drink water—not coffee, not soda, but water? Did this headache follow a period of sweating, heat exposure, or inadequate intake? Would this improve if you drank a glass of water with a pinch of salt? Has this happened before at the same time of day?
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
                      You notice the pattern: afternoon headaches correlate with mornings spent drinking only coffee. You remember this signal cluster. Next time it appears, the first question is not &quot;what&apos;s wrong with me?&quot; but &quot;what&apos;s my urine color?&quot;
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
                      <td className="py-3 pr-4">Tension headache, migraine, stress headache</td>
                      <td className="py-3">Dehydration headache—especially if it follows inadequate intake, sweating, or alcohol</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Brain fog, ADHD, cognitive decline</td>
                      <td className="py-3">Mental fog from dehydration—especially if it resolves within 30-60 minutes of drinking water</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Chronic fatigue syndrome, laziness, depression</td>
                      <td className="py-3">Fatigue from dehydration—especially if it improves with hydration</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Overuse injury, aging, &quot;normal for exercise&quot;</td>
                      <td className="py-3">Muscle cramps from electrolyte deficit—especially if cramps follow sweating or respond to electrolytes</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Mood disorder, personality flaw, anxiety</td>
                      <td className="py-3">Irritability from dehydration—especially if mood normalizes with fluid intake</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">IBS, digestive disorder, &quot;slow metabolism&quot;</td>
                      <td className="py-3">Constipation from dehydration—especially if bowel movements improve with increased water</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Anxiety, inner ear problem, vertigo</td>
                      <td className="py-3">Dizziness from reduced blood volume—especially if worse when standing after fluid loss</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Anxiety disorder, panic attacks, heart disease</td>
                      <td className="py-3">Heart palpitations from electrolyte imbalance—especially if following sweating, diuretics, or heat exposure</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Being out of shape, aging, lack of motivation</td>
                      <td className="py-3">Reduced physical performance from dehydration—even 2% dehydration can reduce performance by 10-20%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">ADHD, stress, lack of discipline</td>
                      <td className="py-3">Poor concentration from dehydration—especially if focus improves after drinking water</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Aging, eczema, &quot;just dry skin&quot;</td>
                      <td className="py-3">Dry skin from chronic dehydration—especially if accompanied by other fluid deficit signals</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Stress, ALS fear, neurological problem</td>
                      <td className="py-3">Muscle twitching from mineral insufficiency—especially if worse after caffeine or intense exercise</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Diabetes only, anxiety</td>
                      <td className="py-3">Excessive thirst that doesn&apos;t resolve—worth exploring whether basic hydration status has been addressed first</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Thyroid problem only, menopause</td>
                      <td className="py-3">Heat intolerance—dehydration impairs thermoregulation and may contribute alongside other factors</td>
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
              The following options are not prescriptions. They are possibilities to explore, ways of observing, and resources to consider.
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
                    <span>Noticing urine color as a simple, accessible indicator—pale yellow generally suggests adequate hydration, dark amber suggests deficit</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Observing timing of signals throughout the day and whether they correlate with intake patterns</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Paying attention to whether signals cluster together (thirst + headache + dark urine + fatigue)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Noticing how quickly signals resolve with fluid intake—often within 30-60 minutes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Becoming aware that thirst sensation may diminish with age or habit</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Observing whether signals worsen after caffeine, alcohol, or heat exposure</span>
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
                    <span>Testing whether headaches, fatigue, or mood changes improve with water intake before reaching for other interventions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Exploring whether electrolyte-rich foods or drinks help more than plain water alone</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Experimenting with intake timing—consistent small amounts vs. large amounts at intervals</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Noticing how intake before, during, and after exercise affects performance and recovery</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Exploring the relationship between hydration and sleep quality</span>
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
                    <span>Keeping water accessible in frequently occupied spaces</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Using visual cues or reminders if intake tends to be forgotten</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Considering ambient humidity in living and working spaces</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Adjusting fluid intake based on climate, altitude, and activity levels</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Creating natural break points in the day when hydration can be addressed</span>
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
                    <span>Primary care providers who can assess overall fluid balance and rule out underlying conditions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Registered dietitians specializing in sports nutrition or general hydration practices</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Nephrologists for concerns about kidney function and fluid regulation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Cardiologists if fluid balance appears connected to blood pressure or heart rhythm</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Endocrinologists if excessive thirst or urination suggests hormonal involvement</span>
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
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Starting the day with water—the body has been without fluid intake for hours during sleep</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Maintaining steady intake throughout the day rather than large amounts at intervals</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Including water with meals as a natural anchor point</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Drinking before thirst signals become pronounced—thirst often indicates dehydration has already begun</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Replenishing after any activity that causes sweating or fluid loss</span>
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
                    <span>Observing urine color at different times of day without judgment, simply gathering information</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Noticing which times of day headaches, fatigue, or concentration difficulties tend to appear</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Noting how intake changes with seasons, activity levels, and environmental conditions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Paying attention to whether certain signals cluster together and what precedes them</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Observing recovery time after exercise and whether it correlates with post-activity hydration</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  The Patience Principle
                </h3>
                <p className="body-text">
                  Hydration signals often respond rapidly—many improve within 30-60 minutes of adequate intake. Urine color typically shifts within hours. However, chronic dehydration patterns that have developed over months or years may take days or weeks of consistent intake to fully resolve. Dry skin and constipation that have become habitual may require sustained attention rather than a single glass of water. Approach this system with patience while also recognizing it is one of the more responsive systems to direct intervention.
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
              The following questions may help you explore whether a signal originates from the Hydration System or another system.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does this signal improve within 30-60 minutes of drinking water with electrolytes if needed?</strong>
                  <br />A rapid response points strongly toward Hydration.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is there a recent history of fluid loss—sweating, heat exposure, exercise, vomiting, diarrhea, alcohol?</strong>
                  <br />Context of fluid loss points toward Hydration.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">What color is your urine currently?</strong>
                  <br />Dark yellow, amber, or brown points toward fluid deficit. Pale yellow suggests less likely dehydration. Completely clear with frequent urination might indicate overhydration or Hormonal involvement.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Are multiple hydration signals present together?</strong>
                  <br />Signal clustering (thirst + dark urine + headache + fatigue) strongly points toward Hydration.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this signal worse after exercise, heat exposure, or sweating?</strong>
                  <br />A relationship to physical activity or heat points toward Hydration.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Do electrolyte-rich foods or drinks help more than plain water alone?</strong>
                  <br />If yes, the electrolyte component of Hydration may be involved.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does the signal follow a daily pattern related to intake?</strong>
                  <br />Worse in morning from overnight deficit or worse in afternoon from cumulative deficit points toward Hydration.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is the signal orthostatic—worse when standing up?</strong>
                  <br />If yes, with other hydration signals, this points to Hydration from reduced blood volume.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Did this signal develop in relation to caffeine, alcohol, or diuretic use?</strong>
                  <br />These substances increase fluid loss and point toward Hydration.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this an acute change or a chronic pattern?</strong>
                  <br />Acute onset after identifiable fluid loss points toward Hydration. Chronic patterns despite adequate intake may involve other systems.
                </p>
              </div>

              <div className="be-card md:col-span-2">
                <p className="body-text">
                  <strong className="text-navy">Does increasing water intake over 24-48 hours resolve these signals?</strong>
                  <br />Resolution confirms Hydration. Partial improvement suggests Hydration may be a contributing factor. No improvement suggests considering Energy Production, Defense, Hormonal, or Circulation.
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
                    Energy Production System
                  </h3>
                </div>
                <p className="body-text">
                  Fatigue may originate from either system. If fatigue improves within 30-60 minutes of drinking water, Hydration is likely involved. If fatigue improves with food, Energy Production may be the primary source. Both systems can contribute simultaneously.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-electric-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-electric-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Circulation System
                  </h3>
                </div>
                <p className="body-text">
                  Dizziness, orthostatic hypotension, and rapid heart rate can arise from either reduced blood volume (Hydration) or primary cardiovascular factors (Circulation). The distinguishing question is whether there&apos;s been recent fluid loss and whether signals respond to rehydration.
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
                  Headache, heart palpitations, and irritability can appear with both dehydration and stress activation. If stress-triggered with no fluid context, the Stress Response system may be primary. If preceded by sweating, heat, or inadequate intake, Hydration is worth exploring first.
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
                  Excessive thirst that doesn&apos;t resolve with drinking, heart palpitations with temperature sensitivity and weight changes, and frequent urination may indicate Hormonal involvement (such as thyroid or blood sugar regulation) rather than primary Hydration. Hormonal conditions can also affect fluid balance indirectly.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-gold">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Consciousness System
                  </h3>
                </div>
                <p className="body-text">
                  Brain fog and difficulty concentrating can originate from both systems. Hydration-related cognitive fog typically resolves quickly with fluid intake. Persistent fog despite adequate hydration suggests Consciousness, Energy Production, or Detoxification.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-electric-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-electric-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Digestive System
                  </h3>
                </div>
                <p className="body-text">
                  Constipation can involve both systems. If bowel movements improve with increased water intake, Hydration is likely contributing. If constipation persists despite adequate hydration, the Digestive system may require separate attention.
                </p>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="mb-12">
            <div className="be-card bg-gradient-to-br from-navy to-deep-blue text-white">
              <p className="text-lg leading-relaxed">
                Your body already knows how to maintain its internal ocean. The signals are not symptoms of something wrong with you—they are accurate reports from a system that has been communicating fluid status for as long as your ancestors have existed. Your role is not to override this intelligence but to listen to what it&apos;s telling you.
              </p>
            </div>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Link
              href="/systems/hormonal"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              ← Hormonal System
            </Link>
            <Link
              href="/systems"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              All Systems
            </Link>
            <Link
              href="/systems/nervous-system"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              Nervous System →
            </Link>
          </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Hydration System | bioEDGE Decoder",
  description:
    "Your Body's Internal Ocean. Explore the bioEDGE Decoder framework for understanding fluid balance, electrolytes, and cellular hydration signals.",
}
