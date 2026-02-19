import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SystemDirectory } from "@/components/directory/system-solutions"
import { SystemNews } from "@/components/directory/system-news"

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
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Systems
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Temperature System
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Thermostat
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
              Your body maintains its core temperature within an astonishingly narrow range—approximately 36.5 to 37.5°C (97.7 to 99.5°F)—regardless of whether you&apos;re standing in a snowstorm or a summer heatwave. This is not simple mechanics. This is orchestration.
            </p>

            <p>
              The Temperature System <strong className="text-navy">regulates</strong>. Your hypothalamus acts as a master thermostat, coordinating an ensemble of responses: blood vessels dilating to release heat or constricting to preserve it, sweat glands activating to cool the surface, muscles shivering to generate warmth, metabolism adjusting to produce more or less heat. All of this happens without conscious instruction, executing moment by moment, adapting to every change in your environment.
            </p>

            <p>
              What makes this system remarkable among the fourteen is its role as both sensor and effector. <strong className="text-navy">Temperature serves as a universal language across your entire biology.</strong> Fever isn&apos;t malfunction—it&apos;s your immune system deliberately raising the thermostat to create a hostile environment for pathogens. Chills aren&apos;t weakness—they&apos;re your body generating heat through rapid muscle contractions. Every temperature signal carries meaning.
            </p>

            <p>
              This is your psychophysiological supersystem in action. Your endocrine system adjusts metabolic heat production through thyroid hormones. Your nervous system detects temperature changes and initiates responses before you consciously register them. Your immune system communicates with your thermostat, requesting temperature changes when fighting infection. These three systems speak the same chemical language, responding as one unified intelligence.
            </p>

            <p>
              When your Temperature System functions well, you adapt seamlessly. You move from air-conditioned buildings to summer heat, from heated homes to winter cold, without conscious effort. You tolerate variation. You adapt to seasons. Your body already knows how.
            </p>

            <p>
              This knowledge was not learned. It was inherited through billions of years of evolution—from organisms that survived because they could sense and respond to their thermal environment. The intelligence encoded in your thermoregulatory system is older than thought, deeper than language.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              The following factors may be worth examining if you&apos;re exploring temperature-related signals. These are considerations, not causes—patterns to investigate rather than conclusions to draw.
            </p>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Extended sedentary periods reducing metabolic heat production and circulation</li>
              <li>Irregular physical activity patterns affecting thermoregulatory adaptation</li>
              <li>Rapid transitions between extreme temperature environments without acclimatization</li>
              <li>Avoiding all temperature challenges (always climate-controlled), reducing adaptive capacity</li>
              <li>Pushing through temperature discomfort signals rather than responding</li>
              <li>Sleep timing irregularities affecting overnight temperature regulation</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Very low calorie intake reducing metabolic heat production</li>
              <li>Dehydration patterns affecting sweating and heat dissipation</li>
              <li>Caffeine and alcohol timing influencing temperature regulation</li>
              <li>Blood sugar instability correlating with temperature fluctuations</li>
              <li>Inflammatory food patterns affecting the temperature-immune interface</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Constant artificial climate control without exposure to natural temperature variation</li>
              <li>Synthetic clothing that may trap heat or prevent appropriate cooling</li>
              <li>Bedding materials and sleep environment temperature</li>
              <li>Workplace temperature settings and lack of personal control</li>
              <li>Humidity levels in living and working spaces</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Suppressed anger or frustration (sometimes associated with heat sensations)</li>
              <li>Social anxiety patterns that may trigger flushing or sweating</li>
              <li>Unexpressed emotions that might manifest as temperature sensations</li>
              <li>Stress from interpersonal conflict</li>
              <li>Isolation patterns reducing opportunities for co-regulation</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Automatic reaching for extra layers or fans before pausing to notice actual sensation</li>
              <li>Habitual complaints about temperature without investigation</li>
              <li>Overreliance on external temperature control rather than building tolerance</li>
              <li>Avoiding outdoor activities due to temperature concerns</li>
              <li>Dismissing temperature signals as &quot;just how I am&quot;</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Screen time before bed affecting overnight temperature regulation</li>
              <li>Reduced outdoor time due to device use, limiting temperature exposure</li>
              <li>Blue light exposure patterns influencing circadian-linked temperature rhythms</li>
              <li>Sedentary device use reducing metabolic heat production</li>
              <li>Stress responses from notifications affecting temperature</li>
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
              The Temperature System communicates through <strong>22 distinct signals</strong> across 8 categories.
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Cold Intolerance Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Feeling cold when others are comfortable</li>
              <li>Difficulty warming up once cold</li>
              <li>Shivering or chills without being cold</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Heat Intolerance Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Overheating easily</li>
              <li>Excessive sweating</li>
              <li>Difficulty cooling down</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Temperature Fluctuation Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Internal temperature swings</li>
              <li>Night sweats</li>
              <li>Feeling feverish without fever</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Extremity Temperature Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cold hands and feet</li>
              <li>Hot hands and feet (burning sensations)</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Environmental Adaptation Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Inability to adapt to temperature changes</li>
              <li>Seasonal sensitivity</li>
              <li>Weather-related temperature disturbances</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Fever &amp; Immune-Temperature Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Low-grade fever patterns</li>
              <li>Subnormal body temperature</li>
              <li>Absent or blunted fever response</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Hot Flash &amp; Vasomotor Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Hot flashes or power surges</li>
              <li>Flushing or redness without heat</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Tolerance &amp; Resilience Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Lost cold tolerance</li>
              <li>Lost heat tolerance</li>
              <li>Reduced thermal resilience (narrowed comfort zone)</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You&apos;re in a meeting, and suddenly warmth floods your face and chest. Or you&apos;re at home, comfortable by everyone else&apos;s standards, but you&apos;re reaching for another blanket. The temperature sensation arrives.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your body responds automatically. Blood vessels dilate or constrict. Sweat glands activate or skin prickles with cold. Your physiology shifts before you&apos;ve consciously processed anything.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> Your brain assigns a story. Something&apos;s wrong with me. I&apos;m getting sick. This is menopause. I&apos;m broken. I&apos;m weak. I can&apos;t handle anything. This is going to be embarrassing. Everyone will notice.
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> You investigate instead of accepting the assumption. Is this temperature signal coming from my thermostat, or is it my hormones using temperature as an output? Did this start suddenly or gradually? Does it correlate with stress? With my cycle? With certain environments? Does movement help or not? Is my whole body affected, or just my extremities? What was I eating, thinking, or doing when this started?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> You remember differently. Instead of &quot;I&apos;m broken,&quot; you encode &quot;My body communicated something. I investigated. I learned that my temperature signals seem connected to [pattern you discovered]. This is information, not pathology. My system is working—I just needed to decode the message.&quot;
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
                    <td className="py-3 pr-4">&quot;Just cold-natured&quot; or &quot;thin blood&quot;</td>
                    <td className="py-3">Whether the thermostat set point has shifted, hormonal influences (especially thyroid), or circulation patterns</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Poor circulation&quot;</td>
                    <td className="py-3">Whether the core body is also cold (Temperature) or just extremities while core is warm (Circulation)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Out of shape&quot; or &quot;need to lose weight&quot;</td>
                    <td className="py-3">Whether heat intolerance might relate to thermoregulatory capacity, thyroid function, or hydration status</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Just anxiety&quot; or &quot;nerves&quot;</td>
                    <td className="py-3">Whether sweating or flushing follows stress patterns (Stress) or occurs independently (Temperature)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Hot temper&quot;</td>
                    <td className="py-3">Whether heat sensations connect to emotional states or occur without emotional triggers</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Being dramatic&quot; or &quot;too sensitive&quot;</td>
                    <td className="py-3">Whether temperature swings follow identifiable patterns worth investigating</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Normal aging&quot;</td>
                    <td className="py-3">Whether lost temperature tolerance might be influenced by factors that can be addressed</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Just menopause&quot;</td>
                    <td className="py-3">Whether hot flashes and night sweats warrant further exploration of hormonal patterns</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Low iron&quot; or &quot;anemia&quot;</td>
                    <td className="py-3">Whether cold intolerance might also involve thyroid function, circulation, or thermoregulation</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Always been this way&quot;</td>
                    <td className="py-3">Whether gradual changes in temperature tolerance might warrant investigation</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Hyperhidrosis&quot; (treated as cosmetic)</td>
                    <td className="py-3">Whether excessive sweating patterns might connect to stress, hormones, or thermoregulation</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">&quot;Fever of unknown origin&quot;</td>
                    <td className="py-3">Whether chronic low-grade temperature elevation might relate to inflammation, immune activity, or thermostat drift</td>
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
              The following are options to explore—not prescriptions. You might investigate what resonates and notice what you observe.
            </p>

            <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Morning temperature tracking at consistent times to establish your baseline</li>
              <li>Noting temperature sensations alongside what you were doing, eating, feeling, or thinking</li>
              <li>Observing whether temperature signals follow patterns (time of day, cycle, stress levels, meals)</li>
              <li>Noticing whether others around you share your temperature perception or differ</li>
              <li>Tracking how long it takes to warm up or cool down after temperature changes</li>
              <li>Paying attention to which body areas signal first (extremities vs. core, face vs. body)</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gradual cold exposure (ending showers cooler, brief outdoor cold exposure) to explore cold tolerance</li>
              <li>Heat acclimatization through gradual, safe exposure to warmer conditions</li>
              <li>Movement exploration to observe effects on temperature regulation</li>
              <li>Breathwork practices that may influence temperature perception</li>
              <li>Mindful attention to temperature sensations without immediately &quot;fixing&quot; them</li>
              <li>Experimenting with clothing layers to find what supports rather than overrides thermoregulation</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Natural fiber bedding and clothing that may support temperature regulation</li>
              <li>Bedroom temperature optimization for sleep (often cooler than daytime preferences)</li>
              <li>Access to outdoor temperature variation rather than constant climate control</li>
              <li>Humidity levels in living and sleeping spaces</li>
              <li>Reducing synthetic materials against skin</li>
              <li>Creating options for temperature layering rather than relying solely on ambient control</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Functional medicine practitioners who may assess thyroid, hormonal, and metabolic contributors</li>
              <li>Endocrinologists for suspected hormonal influences on temperature regulation</li>
              <li>Integrative medicine physicians who consider multiple system interactions</li>
              <li>Cardiologists or vascular specialists if circulation components are suspected</li>
              <li>Neurologists if autonomic nervous system involvement seems possible</li>
              <li>Traditional Chinese Medicine practitioners who work with temperature patterns</li>
            </ul>

            {/* Execute */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Take action with patience and consistency</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>

            <p>Simple daily anchors that support temperature system awareness.</p>

            <ol className="list-decimal pl-6 space-y-3">
              <li><strong className="text-navy">Morning temperature observation.</strong> Before getting out of bed, notice your temperature sensation. Warm? Cold? Comfortable? This takes seconds and builds awareness of your baseline.</li>
              <li><strong className="text-navy">One intentional temperature exposure.</strong> At some point each day, allow yourself to experience temperature variation rather than immediately adjusting your environment. This might mean stepping outside briefly, allowing a room to be slightly cooler before adjusting, or noticing temperature before reaching for a layer.</li>
              <li><strong className="text-navy">Evening temperature check-in.</strong> Before sleep, notice your temperature state. How did it shift throughout the day? Any patterns emerging?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <p>
              This is observation, not optimization. You&apos;re gathering information, not trying to achieve a particular number.
            </p>

            <p>Consider tracking:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Temperature sensations at consistent times</li>
              <li>What seemed to precede temperature changes (activities, foods, emotions, environments)</li>
              <li>How long temperature sensations lasted</li>
              <li>Whether patterns repeat across days, weeks, or cycles</li>
              <li>What you tried and what you observed (not &quot;what worked&quot;—just what you noticed)</li>
            </ul>

            <p>Avoid:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Obsessive measurement that creates anxiety</li>
              <li>Trying to &quot;fix&quot; every temperature sensation</li>
              <li>Judging yourself for patterns you observe</li>
              <li>Comparing your patterns to others or to ideals</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              The Temperature System responds to consistent input over time. Thermoregulatory adaptation doesn&apos;t happen overnight.
            </p>

            <p>
              If you&apos;re exploring cold tolerance building, for example, you might notice subtle shifts over weeks—not dramatic changes after a single cold shower. If you&apos;re investigating whether dietary patterns influence your temperature, several weeks of observation may be needed to notice patterns.
            </p>

            <p>
              Sustainable change comes from consistent, moderate practices maintained over months—not intense interventions maintained for days. The Temperature System rewards patience and consistency over urgency and intensity.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              These questions are for exploration, not diagnosis. They may help clarify whether a signal originates from the Temperature System or might connect to other systems.
            </p>

            <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong className="text-navy">Is this primarily about thermal sensation, or are other signals present?</strong> If temperature changes accompany fatigue, weight changes, or hair changes, the Hormonal System (particularly thyroid) may be worth exploring. If temperature signals appear alone, the Temperature System may be primary.</li>
              <li><strong className="text-navy">Does movement quickly change this signal?</strong> If cold extremities warm quickly with movement, Circulation may be involved. If cold persists despite activity, Temperature is more likely primary.</li>
              <li><strong className="text-navy">Are there color changes in the extremities?</strong> A white → blue → red sequence in fingers or toes suggests Circulation (Raynaud&apos;s phenomenon) rather than Temperature.</li>
              <li><strong className="text-navy">Does this signal follow hormonal patterns?</strong> If temperature changes correlate with menstrual cycles, perimenopause, menopause, or thyroid fluctuations, the Hormonal System may be using Temperature as an output.</li>
              <li><strong className="text-navy">Is this signal triggered by stress, anxiety, or emotional states?</strong> Flushing with embarrassment, sweating with anxiety, or chills with fear suggest the Stress or Emotional Systems rather than Temperature.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Deeper Investigation</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong className="text-navy">Does this persist when you&apos;re well-fed, well-rested, and calm?</strong> If temperature signals resolve with rest, eating, or stress reduction, other systems may be primary. Persistent signals across varied conditions point more strongly to Temperature.</li>
              <li><strong className="text-navy">Is there an illness component?</strong> Fever, malaise, or other signs of infection suggest the Defense System is involved. Temperature dysregulation without illness signs points to Temperature.</li>
              <li><strong className="text-navy">Is sweating proportional to actual heat and exertion?</strong> Proportional sweating is normal thermoregulation. Disproportionate sweating may indicate Temperature system involvement or, if stress-triggered, the Stress System.</li>
              <li><strong className="text-navy">Is this about adaptation capacity or a constant state?</strong> Difficulty adjusting when environments change (adaptation failure) points to Temperature. Always feeling cold OR always feeling hot regardless of environment may involve Hormonal or other systems.</li>
              <li><strong className="text-navy">Is the signal localized or generalized?</strong> Cold only in extremities while core is comfortable suggests Circulation. Whole-body temperature issues point more to Temperature.</li>
            </ol>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              The Temperature System interfaces with multiple other systems, often making it challenging to determine where signals originate.
            </p>

            <p>
              <strong className="text-navy">Hormonal System</strong> — The thyroid gland directly influences metabolic heat production. Low thyroid function often manifests as cold intolerance; high thyroid function as heat intolerance. Reproductive hormones also communicate with the thermostat—hot flashes during menopause are hormonal signals using temperature as output. When temperature signals accompany other hormonal signs (cycle changes, weight changes, fatigue, mood shifts), the Hormonal System may be primary.
            </p>

            <p>
              <strong className="text-navy">Circulation System</strong> — Blood flow delivers heat to tissues and releases heat through the skin. Cold extremities while the core is warm often indicates Circulation rather than Temperature. Raynaud&apos;s phenomenon—where blood vessels overreact to cold—lives at the intersection of these systems. The distinguishing question: Does the whole body struggle with temperature (Temperature) or just the delivery of warmth to specific areas (Circulation)?
            </p>

            <p>
              <strong className="text-navy">Stress Response System</strong> — Stress hormones affect vasodilation, sweating, and metabolic rate. Sweating triggered by social situations, flushing with anxiety, or chills with fear are Stress signals, not Temperature malfunction. The autonomic nervous system—which governs stress responses—also influences thermoregulation. Dysautonomia affects both systems simultaneously.
            </p>

            <p>
              <strong className="text-navy">Defense System</strong> — Fever is a Temperature output driven by immune signals. When your immune system detects a threat, it requests a higher thermostat setting. Night sweats during infection, chills with illness, and temperature changes during immune activation are the Defense and Temperature systems working together. The absence of fever during illness (blunted fever response) sits at this same interface.
            </p>

            <p>
              <strong className="text-navy">Energy Production System</strong> — Mitochondria produce heat as a byproduct of energy production. Low metabolic output may contribute to feeling cold; high metabolic output to warmth. Blood sugar drops can trigger temperature sensations. When temperature signals accompany profound fatigue or energy fluctuations, the Energy Production System may be worth exploring.
            </p>

            <p>
              <strong className="text-navy">Hydration System</strong> — Adequate hydration supports sweating—the body&apos;s primary cooling mechanism. Dehydration can impair heat dissipation and worsen heat intolerance. When heat-related temperature signals accompany signs of dehydration, both systems may be involved.
            </p>


            <Suspense fallback={null}>
              <SystemNews system="Temperature" label="Temperature" />
            </Suspense>

            <Suspense fallback={null}>
              <SystemDirectory system="Temperature" label="Temperature" />
            </Suspense>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your body&apos;s thermostat has been regulating temperature since before your ancestors could think about temperature. It carries intelligence refined across billions of years of evolution. The signals it sends are not random—they&apos;re communication. Your role is not to override this system but to decode what it&apos;s telling you.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/structure-movement"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Structure & Movement
            </Link>
            <Link
              href="/systems"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors font-medium"
            >
              All Systems
            </Link>
            <span className="text-sm text-text-light font-medium">
              Last System
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Temperature System | bioEDGE Decoder",
  description:
    "Your Body's Thermostat. Explore the bioEDGE Decoder framework for understanding heat regulation, cold tolerance, and metabolic temperature.",
  alternates: {
    canonical: "/systems/temperature",
  },
}
