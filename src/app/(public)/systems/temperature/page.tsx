import Link from "next/link"
import {
  Thermometer,
  AlertCircle,
  Search,
  Sparkles,
  Play,
  HelpCircle,
  LinkIcon,
  ArrowLeft,
} from "lucide-react"

/**
 * Temperature System Page
 *
 * Part of the bioEDGE Decoder 15 Biological Systems Framework.
 * Covers heat regulation, cold tolerance, and metabolic temperature.
 */

export default function TemperatureSystemPage() {
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
                <Thermometer className="h-8 w-8 text-gold" />
              </div>
              <p className="text-sm text-gold font-heading uppercase tracking-wider">
                bioEDGE Decoder
              </p>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Temperature System
            </h1>
            <p className="text-xl text-white/80">
              Your Body&apos;s Thermostat
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
                Your body maintains its core temperature within an astonishingly narrow range—approximately 36.5 to 37.5°C (97.7 to 99.5°F)—regardless of whether you&apos;re standing in a snowstorm or a summer heatwave. This is not simple mechanics. This is orchestration.
              </p>
              <p className="body-text mb-4">
                The Temperature System <strong>regulates</strong>. Your hypothalamus acts as a master thermostat, coordinating an ensemble of responses: blood vessels dilating to release heat or constricting to preserve it, sweat glands activating to cool the surface, muscles shivering to generate warmth, metabolism adjusting to produce more or less heat. All of this happens without conscious instruction, executing moment by moment, adapting to every change in your environment.
              </p>
              <p className="body-text mb-4">
                What makes this system remarkable among the fourteen is its role as both sensor and effector. <strong>Temperature serves as a universal language across your entire biology.</strong> Fever isn&apos;t malfunction—it&apos;s your immune system deliberately raising the thermostat to create a hostile environment for pathogens. Chills aren&apos;t weakness—they&apos;re your body generating heat through rapid muscle contractions. Every temperature signal carries meaning.
              </p>
              <p className="body-text mb-4">
                This is your psychophysiological supersystem in action. Your endocrine system adjusts metabolic heat production through thyroid hormones. Your nervous system detects temperature changes and initiates responses before you consciously register them. Your immune system communicates with your thermostat, requesting temperature changes when fighting infection. These three systems speak the same chemical language, responding as one unified intelligence.
              </p>
              <p className="body-text mb-4">
                When your Temperature System functions well, you adapt seamlessly. You move from air-conditioned buildings to summer heat, from heated homes to winter cold, without conscious effort. You tolerate variation. You adapt to seasons. Your body already knows how.
              </p>
              <p className="body-text">
                This knowledge was not learned. It was inherited through billions of years of evolution—from organisms that survived because they could sense and respond to their thermal environment. The intelligence encoded in your thermoregulatory system is older than thought, deeper than language.
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
              The following factors may be worth examining if you&apos;re exploring temperature-related signals. These are considerations, not causes—patterns to investigate rather than conclusions to draw.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Lifestyle Factors
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Extended sedentary periods reducing metabolic heat production and circulation</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Irregular physical activity patterns affecting thermoregulatory adaptation</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Rapid transitions between extreme temperature environments without acclimatization</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Avoiding all temperature challenges (always climate-controlled), reducing adaptive capacity</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Pushing through temperature discomfort signals rather than responding</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Sleep timing irregularities affecting overnight temperature regulation</span>
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
                    <span>Very low calorie intake reducing metabolic heat production</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Dehydration patterns affecting sweating and heat dissipation</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Caffeine and alcohol timing influencing temperature regulation</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Blood sugar instability correlating with temperature fluctuations</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Inflammatory food patterns affecting the temperature-immune interface</span>
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
                    <span>Constant artificial climate control without exposure to natural temperature variation</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Synthetic clothing that may trap heat or prevent appropriate cooling</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Bedding materials and sleep environment temperature</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Workplace temperature settings and lack of personal control</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Humidity levels in living and working spaces</span>
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
                    <span>Suppressed anger or frustration (sometimes associated with heat sensations)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Social anxiety patterns that may trigger flushing or sweating</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Unexpressed emotions that might manifest as temperature sensations</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Stress from interpersonal conflict</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Isolation patterns reducing opportunities for co-regulation</span>
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
                    <span>Automatic reaching for extra layers or fans before pausing to notice actual sensation</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Habitual complaints about temperature without investigation</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Overreliance on external temperature control rather than building tolerance</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Avoiding outdoor activities due to temperature concerns</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Dismissing temperature signals as &quot;just how I am&quot;</span>
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
                    <span>Screen time before bed affecting overnight temperature regulation</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Reduced outdoor time due to device use, limiting temperature exposure</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Blue light exposure patterns influencing circadian-linked temperature rhythms</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Sedentary device use reducing metabolic heat production</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Stress responses from notifications affecting temperature</span>
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
                The Temperature System communicates through <strong>22 distinct signals</strong> across 8 categories.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Cold Intolerance Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Feeling cold when others are comfortable</li>
                    <li>• Difficulty warming up once cold</li>
                    <li>• Shivering or chills without being cold</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Heat Intolerance Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Overheating easily</li>
                    <li>• Excessive sweating</li>
                    <li>• Difficulty cooling down</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Temperature Fluctuation Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Internal temperature swings</li>
                    <li>• Night sweats</li>
                    <li>• Feeling feverish without fever</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Extremity Temperature Signals (2)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Cold hands and feet</li>
                    <li>• Hot hands and feet (burning sensations)</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Environmental Adaptation Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Inability to adapt to temperature changes</li>
                    <li>• Seasonal sensitivity</li>
                    <li>• Weather-related temperature disturbances</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Fever & Immune-Temperature Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Low-grade fever patterns</li>
                    <li>• Subnormal body temperature</li>
                    <li>• Absent or blunted fever response</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Hot Flash & Vasomotor Signals (2)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Hot flashes or power surges</li>
                    <li>• Flushing or redness without heat</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Tolerance & Resilience Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Lost cold tolerance</li>
                    <li>• Lost heat tolerance</li>
                    <li>• Reduced thermal resilience (narrowed comfort zone)</li>
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
                      You&apos;re in a meeting, and suddenly warmth floods your face and chest. Or you&apos;re at home, comfortable by everyone else&apos;s standards, but you&apos;re reaching for another blanket. The temperature sensation arrives.
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
                      Your body responds automatically. Blood vessels dilate or constrict. Sweat glands activate or skin prickles with cold. Your physiology shifts before you&apos;ve consciously processed anything.
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
                      Your brain assigns a story. Something&apos;s wrong with me. I&apos;m getting sick. This is menopause. I&apos;m broken. I&apos;m weak. I can&apos;t handle anything. This is going to be embarrassing. Everyone will notice.
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
                      You investigate instead of accepting the assumption. Is this temperature signal coming from my thermostat, or is it my hormones using temperature as an output? Did this start suddenly or gradually? Does it correlate with stress? With my cycle? With certain environments? Does movement help or not? Is my whole body affected, or just my extremities? What was I eating, thinking, or doing when this started?
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
                      You remember differently. Instead of &quot;I&apos;m broken,&quot; you encode &quot;My body communicated something. I investigated. I learned that my temperature signals seem connected to [pattern you discovered]. This is information, not pathology. My system is working—I just needed to decode the message.&quot;
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
                      <td className="py-3 pr-4">&quot;Just cold-natured&quot; or &quot;thin blood&quot;</td>
                      <td className="py-3">Whether the thermostat set point has shifted, hormonal influences (especially thyroid), or circulation patterns</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Poor circulation&quot;</td>
                      <td className="py-3">Whether the core body is also cold (Temperature) or just extremities while core is warm (Circulation)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Out of shape&quot; or &quot;need to lose weight&quot;</td>
                      <td className="py-3">Whether heat intolerance might relate to thermoregulatory capacity, thyroid function, or hydration status</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Just anxiety&quot; or &quot;nerves&quot;</td>
                      <td className="py-3">Whether sweating or flushing follows stress patterns (Stress) or occurs independently (Temperature)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Hot temper&quot;</td>
                      <td className="py-3">Whether heat sensations connect to emotional states or occur without emotional triggers</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Being dramatic&quot; or &quot;too sensitive&quot;</td>
                      <td className="py-3">Whether temperature swings follow identifiable patterns worth investigating</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Normal aging&quot;</td>
                      <td className="py-3">Whether lost temperature tolerance might be influenced by factors that can be addressed</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Just menopause&quot;</td>
                      <td className="py-3">Whether hot flashes and night sweats warrant further exploration of hormonal patterns</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Low iron&quot; or &quot;anemia&quot;</td>
                      <td className="py-3">Whether cold intolerance might also involve thyroid function, circulation, or thermoregulation</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Always been this way&quot;</td>
                      <td className="py-3">Whether gradual changes in temperature tolerance might warrant investigation</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Hyperhidrosis&quot; (treated as cosmetic)</td>
                      <td className="py-3">Whether excessive sweating patterns might connect to stress, hormones, or thermoregulation</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Fever of unknown origin&quot;</td>
                      <td className="py-3">Whether chronic low-grade temperature elevation might relate to inflammation, immune activity, or thermostat drift</td>
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
              The following are options to explore—not prescriptions. You might investigate what resonates and notice what you observe.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Awareness Tools
                  </h3>
                </div>
                <p className="text-xs text-text-light mb-3">Ways to observe and notice your temperature patterns.</p>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Morning temperature tracking at consistent times to establish your baseline</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Noting temperature sensations alongside what you were doing, eating, feeling, or thinking</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Observing whether temperature signals follow patterns (time of day, cycle, stress levels, meals)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Noticing whether others around you share your temperature perception or differ</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Tracking how long it takes to warm up or cool down after temperature changes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Paying attention to which body areas signal first (extremities vs. core, face vs. body)</span>
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
                <p className="text-xs text-text-light mb-3">Things to try and experiment with.</p>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Gradual cold exposure (ending showers cooler, brief outdoor cold exposure) to explore cold tolerance</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Heat acclimatization through gradual, safe exposure to warmer conditions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Movement exploration to observe effects on temperature regulation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Breathwork practices that may influence temperature perception</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Mindful attention to temperature sensations without immediately &quot;fixing&quot; them</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Experimenting with clothing layers to find what supports rather than overrides thermoregulation</span>
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
                    <span>Natural fiber bedding and clothing that may support temperature regulation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Bedroom temperature optimization for sleep (often cooler than daytime preferences)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Access to outdoor temperature variation rather than constant climate control</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Humidity levels in living and sleeping spaces</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Reducing synthetic materials against skin</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Creating options for temperature layering rather than relying solely on ambient control</span>
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
                <p className="text-xs text-text-light mb-3">Types of practitioners who work with this system.</p>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Functional medicine practitioners who may assess thyroid, hormonal, and metabolic contributors</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Endocrinologists for suspected hormonal influences on temperature regulation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Integrative medicine physicians who consider multiple system interactions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Cardiologists or vascular specialists if circulation components are suspected</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Neurologists if autonomic nervous system involvement seems possible</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Traditional Chinese Medicine practitioners who work with temperature patterns</span>
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
                <p className="body-text mb-4">Simple daily anchors that support temperature system awareness.</p>
                <ul className="space-y-4 body-text">
                  <li>
                    <p className="font-bold text-navy mb-1">Morning temperature observation</p>
                    <p>Before getting out of bed, notice your temperature sensation. Warm? Cold? Comfortable? This takes seconds and builds awareness of your baseline.</p>
                  </li>
                  <li>
                    <p className="font-bold text-navy mb-1">One intentional temperature exposure</p>
                    <p>At some point each day, allow yourself to experience temperature variation rather than immediately adjusting your environment. This might mean stepping outside briefly, allowing a room to be slightly cooler before adjusting, or noticing temperature before reaching for a layer.</p>
                  </li>
                  <li>
                    <p className="font-bold text-navy mb-1">Evening temperature check-in</p>
                    <p>Before sleep, notice your temperature state. How did it shift throughout the day? Any patterns emerging?</p>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Tracking What You Notice
                </h3>
                <p className="body-text mb-4">
                  This is observation, not optimization. You&apos;re gathering information, not trying to achieve a particular number.
                </p>
                <p className="body-text mb-2">Consider tracking:</p>
                <ul className="space-y-3 body-text mb-4">
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Temperature sensations at consistent times</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>What seemed to precede temperature changes (activities, foods, emotions, environments)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>How long temperature sensations lasted</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Whether patterns repeat across days, weeks, or cycles</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>What you tried and what you observed (not &quot;what worked&quot;—just what you noticed)</span>
                  </li>
                </ul>
                <p className="body-text mb-2">Avoid:</p>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-pink-accent font-bold">•</span>
                    <span>Obsessive measurement that creates anxiety</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-pink-accent font-bold">•</span>
                    <span>Trying to &quot;fix&quot; every temperature sensation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-pink-accent font-bold">•</span>
                    <span>Judging yourself for patterns you observe</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-pink-accent font-bold">•</span>
                    <span>Comparing your patterns to others or to ideals</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  The Patience Principle
                </h3>
                <p className="body-text mb-4">
                  The Temperature System responds to consistent input over time. Thermoregulatory adaptation doesn&apos;t happen overnight.
                </p>
                <p className="body-text mb-4">
                  If you&apos;re exploring cold tolerance building, for example, you might notice subtle shifts over weeks—not dramatic changes after a single cold shower. If you&apos;re investigating whether dietary patterns influence your temperature, several weeks of observation may be needed to notice patterns.
                </p>
                <p className="body-text">
                  Sustainable change comes from consistent, moderate practices maintained over months—not intense interventions maintained for days. The Temperature System rewards patience and consistency over urgency and intensity.
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
              These questions are for exploration, not diagnosis. They may help clarify whether a signal originates from the Temperature System or might connect to other systems.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this primarily about thermal sensation, or are other signals present?</strong>
                  <br />If temperature changes accompany fatigue, weight changes, or hair changes, the Hormonal System (particularly thyroid) may be worth exploring. If temperature signals appear alone, the Temperature System may be primary.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does movement quickly change this signal?</strong>
                  <br />If cold extremities warm quickly with movement, Circulation may be involved. If cold persists despite activity, Temperature is more likely primary.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Are there color changes in the extremities?</strong>
                  <br />A white → blue → red sequence in fingers or toes suggests Circulation (Raynaud&apos;s phenomenon) rather than Temperature.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does this signal follow hormonal patterns?</strong>
                  <br />If temperature changes correlate with menstrual cycles, perimenopause, menopause, or thyroid fluctuations, the Hormonal System may be using Temperature as an output.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this signal triggered by stress, anxiety, or emotional states?</strong>
                  <br />Flushing with embarrassment, sweating with anxiety, or chills with fear suggest the Stress or Emotional Systems rather than Temperature.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does this persist when you&apos;re well-fed, well-rested, and calm?</strong>
                  <br />If temperature signals resolve with rest, eating, or stress reduction, other systems may be primary. Persistent signals across varied conditions point more strongly to Temperature.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is there an illness component?</strong>
                  <br />Fever, malaise, or other signs of infection suggest the Defense System is involved. Temperature dysregulation without illness signs points to Temperature.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is sweating proportional to actual heat and exertion?</strong>
                  <br />Proportional sweating is normal thermoregulation. Disproportionate sweating may indicate Temperature system involvement or, if stress-triggered, the Stress System.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this about adaptation capacity or a constant state?</strong>
                  <br />Difficulty adjusting when environments change (adaptation failure) points to Temperature. Always feeling cold OR always feeling hot regardless of environment may involve Hormonal or other systems.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is the signal localized or generalized?</strong>
                  <br />Cold only in extremities while core is comfortable suggests Circulation. Whole-body temperature issues point more to Temperature.
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
              The Temperature System interfaces with multiple other systems, often making it challenging to determine where signals originate.
            </p>

            <div className="space-y-4">
              <div className="be-card border-l-4 border-l-gold">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Hormonal System
                  </h3>
                </div>
                <p className="body-text">
                  The thyroid gland directly influences metabolic heat production. Low thyroid function often manifests as cold intolerance; high thyroid function as heat intolerance. Reproductive hormones also communicate with the thermostat—hot flashes during menopause are hormonal signals using temperature as output. When temperature signals accompany other hormonal signs (cycle changes, weight changes, fatigue, mood shifts), the Hormonal System may be primary.
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
                  Blood flow delivers heat to tissues and releases heat through the skin. Cold extremities while the core is warm often indicates Circulation rather than Temperature. Raynaud&apos;s phenomenon—where blood vessels overreact to cold—lives at the intersection of these systems. The distinguishing question: Does the whole body struggle with temperature (Temperature) or just the delivery of warmth to specific areas (Circulation)?
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
                  Stress hormones affect vasodilation, sweating, and metabolic rate. Sweating triggered by social situations, flushing with anxiety, or chills with fear are Stress signals, not Temperature malfunction. The autonomic nervous system—which governs stress responses—also influences thermoregulation. Dysautonomia affects both systems simultaneously.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-deep-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-deep-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Defense System
                  </h3>
                </div>
                <p className="body-text">
                  Fever is a Temperature output driven by immune signals. When your immune system detects a threat, it requests a higher thermostat setting. Night sweats during infection, chills with illness, and temperature changes during immune activation are the Defense and Temperature systems working together. The absence of fever during illness (blunted fever response) sits at this same interface.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-gold">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Energy Production System
                  </h3>
                </div>
                <p className="body-text">
                  Mitochondria produce heat as a byproduct of energy production. Low metabolic output may contribute to feeling cold; high metabolic output to warmth. Blood sugar drops can trigger temperature sensations. When temperature signals accompany profound fatigue or energy fluctuations, the Energy Production System may be worth exploring.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-electric-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-electric-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Hydration System
                  </h3>
                </div>
                <p className="body-text">
                  Adequate hydration supports sweating—the body&apos;s primary cooling mechanism. Dehydration can impair heat dissipation and worsen heat intolerance. When heat-related temperature signals accompany signs of dehydration, both systems may be involved.
                </p>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="mb-12">
            <div className="be-card bg-gradient-to-br from-navy to-deep-blue text-white">
              <p className="text-lg leading-relaxed">
                Your body&apos;s thermostat has been regulating temperature since before your ancestors could think about temperature. It carries intelligence refined across billions of years of evolution. The signals it sends are not random—they&apos;re communication. Your role is not to override this system but to decode what it&apos;s telling you.
              </p>
            </div>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Link
              href="/systems/structure-movement"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              ← Structure & Movement
            </Link>
            <Link
              href="/systems"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              All Systems
            </Link>
            <span className="text-text-light font-heading font-medium">
              Last System
            </span>
          </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Temperature System | bioEDGE Decoder",
  description:
    "Your Body's Thermostat. Explore the bioEDGE Decoder framework for understanding heat regulation, cold tolerance, and metabolic temperature.",
}
