import { ArrowLeft } from "lucide-react"
import Link from "next/link"

/**
 * Detoxification System Page
 *
 * Your Body's Clearing House - liver function, lymphatic drainage, elimination
 * Part of the bioEDGE Decoder 15 Systems Framework.
 */
export default function DetoxificationSystemPage() {
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
            Detoxification System
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Clearing House
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
              Right now, your liver is running 500 different functions simultaneously. Your kidneys are filtering your entire blood volume every hour. Your lymphatic system is patrolling 37 trillion cells, collecting cellular debris and routing it for elimination. Your skin is releasing what doesn&apos;t belong through millions of sweat glands.
            </p>

            <p>
              <strong className="text-navy">You did not learn how to do any of this.</strong>
            </p>

            <p>
              This system CLEARS. It identifies, neutralizes, and eliminates substances that don&apos;t belong in the body: environmental toxins, metabolic waste products, medication byproducts, and cellular debris. The liver transforms fat-soluble toxins into water-soluble forms. The kidneys filter blood and excrete waste through urine. The lymphatic system—which has no pump of its own—relies on your movement to circulate lymph and carry waste to elimination. The skin acts as a third kidney, releasing what overflows through sweat.
            </p>

            <p>
              What makes this system unique among the fourteen is that it governs toxic load and clearance capacity. Not immune response to threats (that&apos;s Defense). Not cellular energy production (that&apos;s Energy). Not nervous system activation (that&apos;s Stress). This system determines whether what enters your body gets processed and eliminated, or whether it accumulates, recirculates, and generates signals across multiple systems.
            </p>

            <p>
              Your detoxification systems evolved for a world of natural toxins: snake venom, poisonous plants, environmental contaminants. Your ancestors survived because their livers could transform threats into harmless compounds. Today, you encounter thousands of synthetic chemicals unknown to human biology a century ago. The wisdom encoded in your cells hasn&apos;t changed. The assault on those systems has.
            </p>

            <p>
              Your endocrine system, nervous system, and immune system speak the same chemical language as your detoxification organs. When your liver is overburdened, your hormones become imbalanced (the liver clears excess estrogen). When your lymph is stagnant, your immune cells can&apos;t reach where they&apos;re needed. When toxins accumulate, your nervous system receives inflammatory signals that affect mood, cognition, and sensation.
            </p>

            <p>
              When functioning well, toxic load stays manageable and clearance keeps pace with exposure. When overwhelmed, toxins accumulate—and your body sends signals.
            </p>

            <p>
              Your body already knows how to clear. The question is whether the pathways are open and the burden is manageable.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              The following factors may contribute to detoxification burden or impaired clearance. These are not causes or diagnoses—they are considerations worth examining.
            </p>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sedentary patterns contributing to lymphatic stagnation (lymph has no pump)</li>
              <li>Lack of sweating reducing one elimination pathway</li>
              <li>Disrupted sleep impairing brain&apos;s glymphatic clearing system</li>
              <li>Eating late at night when liver should be clearing, not digesting</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processed foods with preservatives, artificial colors, and additives</li>
              <li>Conventionally grown produce with pesticide residues</li>
              <li>Alcohol requiring significant liver processing</li>
              <li>Constant grazing never allowing liver to focus on clearing</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Mold and water damage (most common unrecognized chronic exposure)</li>
              <li>Indoor air pollutants, air fresheners, scented products</li>
              <li>Water quality—chlorine, fluoride, pharmaceutical residues</li>
              <li>Personal care products absorbed through skin</li>
              <li>Occupational exposures (manufacturing, agriculture, healthcare, salons)</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chronic stress preventing recovery mode needed for clearance</li>
              <li>Suppressed expression affecting bile flow and processing</li>
              <li>Consistently stressful relationships keeping nervous system activated</li>
              <li>Feeling unsafe chronically impairing clearance capacity</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Breath holding or shallow breathing impairing oxygen delivery</li>
              <li>Insufficient water intake concentrating rather than flushing toxins</li>
              <li>Infrequent bowel movements allowing toxin reabsorption</li>
              <li>Avoiding sweating, reducing one elimination pathway</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>EMF exposure (some notice correlations with detox signals)</li>
              <li>Blue light at night disrupting liver&apos;s processing patterns</li>
              <li>Constant connectivity maintaining nervous system activation</li>
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
              The Detoxification System generates 22 distinct signals across 8 categories:
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Toxic Load Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Chemical Sensitivity / Multiple Chemical Sensitivity</li>
              <li>Toxic Overload Feeling / Body Feels Poisoned</li>
              <li>Vacation Effect / Better When Away From Home or Work</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Liver &amp; Metabolic Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Digestive Changes / Fat Intolerance</li>
              <li>Intolerance to Alcohol, Caffeine, or Medications</li>
              <li>Right-Sided Pain or Discomfort (Liver Area)</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Kidney &amp; Urinary Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Changes in Urination Patterns</li>
              <li>Kidney Area Pain or Discomfort (Flank Pain)</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Lymphatic Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Lymph Node Swelling or Tenderness</li>
              <li>Sluggish Lymph / Fluid Retention</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Skin Signals—As Detox Pathway (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Unexplained Rashes or Skin Eruptions</li>
              <li>Skin Odor or Unusual Body Odor</li>
              <li>Poor Wound Healing</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Neurological &amp; Cognitive Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Toxin-Related Brain Fog</li>
              <li>Peripheral Neuropathy / Tingling and Numbness</li>
              <li>Tremors or Involuntary Movements</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Systemic Burden Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Multiple System Involvement Without Clear Diagnosis</li>
              <li>Post-Exertional Worsening</li>
              <li>Histamine Intolerance / Mast Cell Activation</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Elimination Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Constipation or Sluggish Bowels</li>
              <li>Unusual Stool Characteristics</li>
              <li>Excessive Sweating or Night Sweats (Non-Hormonal)</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You walk into a department store. Within minutes, your head feels foggy, you notice a headache forming, and your nose runs. You step outside and within an hour, you feel fine. The next week, the same thing happens at a freshly painted friend&apos;s house.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your liver pathways engage with the chemical load. Your immune system responds to the assault. Your nervous system registers the exposure. Your body mounts a response—maybe inflammation, maybe nausea, maybe immediate fatigue.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> &quot;I&apos;m just sensitive.&quot; &quot;I&apos;m being dramatic.&quot; &quot;Nobody else seems bothered, so it must be in my head.&quot; &quot;I&apos;m becoming a hypochondriac.&quot; &quot;Maybe I&apos;m just anxious about chemicals.&quot;
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> Is there an environmental exposure I haven&apos;t identified? Did my signals begin after moving, renovating, or changing workplaces? Do my signals improve dramatically when I&apos;m away from home or work? Am I reacting to substances at doses that don&apos;t bother others? Are multiple body systems involved without a unifying diagnosis?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> This isn&apos;t anxiety or hypochondria. My body is accurately detecting something that doesn&apos;t belong and communicating that the clearance pathways are overwhelmed. Chemical sensitivity is my detox system telling me the bucket is full. The vacation effect is my body recovering when the assault stops.
            </p>

            <p>
              Investigating takes courage. When you question a story that feels true—especially one that&apos;s been reinforced by medical professionals—you gain more agency over your entire life.
            </p>

            <h3 className="font-heading font-bold text-navy">Common Mislabels</h3>

            <p>
              Detoxification signals are frequently attributed to other causes. The following patterns may be worth exploring:
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
                    <td className="py-3 pr-4">Anxiety, panic disorder, psychosomatic</td>
                    <td className="py-3">Chemical sensitivity indicating pathway overload</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Depression, early dementia, ADHD, &quot;brain aging&quot;</td>
                    <td className="py-3">Brain fog from toxic burden affecting cognition</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Fibromyalgia, chronic fatigue, somatization</td>
                    <td className="py-3">Multi-system symptoms from accumulated toxic load</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Just stress,&quot; malingering</td>
                    <td className="py-3">Vacation effect indicating environmental exposure</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Eczema, psoriasis, dermatitis</td>
                    <td className="py-3">Skin eruptions as elimination pathway activation</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Diabetic neuropathy, B12 deficiency, &quot;aging&quot;</td>
                    <td className="py-3">Peripheral neuropathy from neurotoxic burden</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Essential tremor, early Parkinson&apos;s</td>
                    <td className="py-3">Tremors from heavy metal or mycotoxin exposure</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Gallbladder disease, IBS</td>
                    <td className="py-3">Fat intolerance from liver congestion</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Laziness, depression, poor sleep habits</td>
                    <td className="py-3">Fatigue from toxic burden requiring clearance</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Chronic allergies, recurrent infection</td>
                    <td className="py-3">Lymph congestion from debris accumulation</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Food allergies, panic attacks</td>
                    <td className="py-3">Histamine intolerance from impaired breakdown</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Deconditioning, &quot;out of shape&quot;</td>
                    <td className="py-3">Post-exertional worsening from mobilized toxins</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Lightweight,&quot; poor metabolism</td>
                    <td className="py-3">Substance intolerance from compromised liver pathways</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Poor hygiene</td>
                    <td className="py-3">Unusual body odor from toxin excretion through sweat</td>
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
              The following are options to explore—not prescriptions. Different approaches resonate with different people and situations.
            </p>

            <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Environmental assessment—do signals correlate with specific locations?</li>
              <li>Track if you feel better when away from home/work for several days</li>
              <li>Reaction mapping—which substances provoke responses?</li>
              <li>Notice timing between exposure and response (immediate vs. delayed)</li>
              <li>Timeline construction—when did symptoms begin, what changed?</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Movement for lymph (walking, rebounding, swimming, yoga)</li>
              <li>Sweating practices (sauna, steam, hot baths, exercise)</li>
              <li>Deep diaphragmatic breathing for lymphatic flow</li>
              <li>Adequate hydration to dilute and flush toxins</li>
              <li>Time-restricted eating allowing liver to clear rather than digest</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Air purifiers with HEPA and activated carbon</li>
              <li>Removing air fresheners and scented products</li>
              <li>Water filtration addressing local quality concerns</li>
              <li>Glass or stainless steel instead of plastic containers</li>
              <li>Professional mold assessment if water damage history exists</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Environmental medicine physicians</li>
              <li>Functional medicine practitioners</li>
              <li>Naturopathic physicians trained in environmental medicine</li>
              <li>Mold-literate practitioners (CIRS specialists)</li>
              <li>Occupational medicine specialists</li>
              <li>Building biologists for indoor environmental quality</li>
            </ul>

            {/* Execute */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Take action with patience and consistency</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>

            <p>Simple anchors that may support detoxification:</p>

            <ol className="list-decimal pl-6 space-y-3">
              <li><strong className="text-navy">Move daily.</strong> Any movement that contracts muscles supports lymph flow. Walking, stretching, rebounding, swimming—consistency matters more than intensity.</li>
              <li><strong className="text-navy">Hydrate consistently.</strong> Water is the medium for elimination. Adequate intake throughout the day supports kidney filtration and bowel regularity.</li>
              <li><strong className="text-navy">Maintain bowel regularity.</strong> Daily elimination prevents reabsorption of toxins bound in stool.</li>
              <li><strong className="text-navy">Sweat regularly.</strong> Whether through exercise, sauna, or hot baths—regular sweating opens one elimination pathway.</li>
              <li><strong className="text-navy">Breathe deeply.</strong> A few minutes of conscious deep breathing daily supports both oxygenation and lymphatic flow.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <p>This isn&apos;t about metrics or optimization. It&apos;s about pattern recognition:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Whether signals correlate with specific locations or improve when away</li>
              <li>Reactions to substances and whether sensitivity is stable or expanding</li>
              <li>Elimination changes—urine color, stool characteristics, sweat patterns</li>
              <li>Which practices seem to shift how you feel</li>
              <li>Energy patterns and cognitive clarity in different environments</li>
            </ul>

            <p className="text-sm italic">
              Simple notes—not elaborate tracking systems—may reveal patterns over time.
            </p>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              Detoxification patterns often develop over months to years of accumulated exposure. Clearance doesn&apos;t happen overnight.
            </p>

            <p>
              Some people notice improvement within days of removing themselves from an exposure source. Others find that clearing accumulated burden takes months of consistent support. Herxheimer reactions (temporary worsening during active detoxification) are common—sometimes feeling worse before feeling better indicates the process is working.
            </p>

            <p>
              The bucket filled slowly. It may empty slowly. Reducing inflow while supporting outflow is the consistent principle.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              These questions may help distinguish whether signals originate from the Detoxification System:
            </p>

            <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Is there known or suspected toxic exposure (mold, chemicals, heavy metals)?</li>
              <li>Did signals begin after a move, renovation, or environmental change?</li>
              <li>Do signals improve dramatically when away from home or work?</li>
              <li>Is there sensitivity to chemicals that don&apos;t bother most people?</li>
              <li>Are multiple systems involved without clear diagnosis?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Deeper Investigation</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Is there unusual intolerance to alcohol, caffeine, or medications?</li>
              <li>Are there elimination changes (sweating, skin, stool, urine, odor)?</li>
              <li>Is there a &quot;toxic&quot; or &quot;poisoned&quot; quality to symptoms?</li>
              <li>Do symptoms worsen 24-48 hours after physical exertion?</li>
              <li>Has sensitivity expanded to include more substances over time?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Distinguishing Overlaps</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-navy">Brain fog that improves with food</strong> → Energy Production</li>
              <li><strong className="text-navy">Brain fog that improves with movement</strong> → Circulation</li>
              <li><strong className="text-navy">Brain fog that correlates with environment</strong> → Detoxification</li>
              <li><strong className="text-navy">Fatigue that improves with rest</strong> → Energy Production</li>
              <li><strong className="text-navy">Fatigue with &quot;wired and tired&quot; quality</strong> → Stress Response</li>
              <li><strong className="text-navy">Fatigue with &quot;toxic&quot; or &quot;poisoned&quot; quality</strong> → Detoxification</li>
              <li><strong className="text-navy">Skin issues with clear allergic triggers</strong> → Defense</li>
              <li><strong className="text-navy">Skin issues that improve with sweating</strong> → Detoxification</li>
            </ul>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              The Detoxification System interfaces with multiple other systems. Toxic burden rarely affects one system in isolation:
            </p>

            <p>
              <strong className="text-navy">Energy Production</strong> — Toxins can damage mitochondria, the cellular structures that produce energy. Fatigue is often present with toxic burden. When clearance improves, energy often returns.
            </p>

            <p>
              <strong className="text-navy">Defense System</strong> — The immune system responds to toxins, and chronic toxic exposure can trigger persistent inflammation. The Defense System may appear overactive when the real issue is ongoing assault that never resolves.
            </p>

            <p>
              <strong className="text-navy">Digestive System</strong> — The liver produces bile that flows to the gut for fat digestion and toxin elimination. Liver congestion affects digestion. Gut dysfunction affects what gets absorbed (including toxins) and what gets eliminated.
            </p>

            <p>
              <strong className="text-navy">Stress Response</strong> — Chronic stress activation impairs detoxification capacity. The nervous system state directly affects whether the body can prioritize clearance functions. Toxic burden itself creates internal stress.
            </p>

            <p>
              <strong className="text-navy">Consciousness</strong> — Neurotoxins directly affect brain function. Brain fog, memory impairment, processing difficulties, and mood changes may all stem from toxic burden affecting neural tissue.
            </p>

            <p>
              <strong className="text-navy">Circulation</strong> — Blood delivers nutrients to detox organs and carries toxins away. Compromised circulation may impair clearance. The lymphatic system works in parallel to move debris.
            </p>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your body&apos;s clearing systems have been refined over half a billion years. The liver, kidneys, lymph, and skin work in concert to identify, transform, and eliminate what doesn&apos;t belong.
              </p>
              <p className="mt-4 italic">
                This report is for exploration purposes only and does not constitute medical advice, diagnosis, or treatment. The information presented invites investigation into patterns your body may be communicating.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/defense"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Defense
            </Link>
            <Link
              href="/systems/digestive"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-pink-accent transition-colors font-medium"
            >
              Next: Digestive
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Detoxification System | bioEDGE Decoder",
  description: "Your Body's Clearing House. The Detoxification System identifies, neutralizes, and eliminates substances that don't belong—governing toxic load and clearance capacity through liver, kidneys, lymph, and skin.",
}
