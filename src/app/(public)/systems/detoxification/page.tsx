import { Droplets, ArrowLeft, AlertCircle, Search, Sparkles, Play, HelpCircle, Link as LinkIcon } from "lucide-react"
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
            <div className="flex items-center gap-3 mb-4">
              <Droplets className="h-10 w-10 text-gold" />
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white">
                Detoxification System
              </h1>
            </div>
            <p className="text-xl text-white/80">
              Your Body&apos;s Clearing House
            </p>
            <p className="text-sm text-gold mt-4 font-heading uppercase tracking-wider">
              bioEDGE Decoder
            </p>
        </div>
      </div>

      {/* Content */}
      <div className="be-container py-12">
        <div className="space-y-12">

          {/* Section 1: Natural Intelligence */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">1</span>
              <h2 className="section-title">Natural Intelligence</h2>
            </div>
            <div className="be-card space-y-4 body-text">
              <p>
                Right now, your liver is running 500 different functions simultaneously. Your kidneys are filtering your entire blood volume every hour. Your lymphatic system is patrolling 37 trillion cells, collecting cellular debris and routing it for elimination. Your skin is releasing what doesn&apos;t belong through millions of sweat glands.
              </p>
              <p className="font-semibold text-navy">
                You did not learn how to do any of this.
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
              <p className="text-electric-blue font-medium">
                Your body already knows how to clear. The question is whether the pathways are open and the burden is manageable.
              </p>
            </div>
          </section>

          {/* Section 2: Eliminate */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">2</span>
              <h2 className="section-title">Eliminate</h2>
            </div>
            <p className="body-text mb-6">
              The following factors may contribute to detoxification burden or impaired clearance. These are not causes or diagnoses—they are considerations worth examining.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Lifestyle Factors */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Lifestyle Factors</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Sedentary patterns contributing to lymphatic stagnation (lymph has no pump)</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Lack of sweating reducing one elimination pathway</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Disrupted sleep impairing brain&apos;s glymphatic clearing system</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Eating late at night when liver should be clearing, not digesting</span></li>
                </ul>
              </div>

              {/* Dietary Considerations */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Dietary Considerations</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Processed foods with preservatives, artificial colors, and additives</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Conventionally grown produce with pesticide residues</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Alcohol requiring significant liver processing</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Constant grazing never allowing liver to focus on clearing</span></li>
                </ul>
              </div>

              {/* Environmental Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Environmental Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Mold and water damage (most common unrecognized chronic exposure)</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Indoor air pollutants, air fresheners, scented products</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Water quality—chlorine, fluoride, pharmaceutical residues</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Personal care products absorbed through skin</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Occupational exposures (manufacturing, agriculture, healthcare, salons)</span></li>
                </ul>
              </div>

              {/* Relationship & Emotional Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Relationship &amp; Emotional Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Chronic stress preventing recovery mode needed for clearance</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Suppressed expression affecting bile flow and processing</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Consistently stressful relationships keeping nervous system activated</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Feeling unsafe chronically impairing clearance capacity</span></li>
                </ul>
              </div>

              {/* Habitual Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Habitual Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Breath holding or shallow breathing impairing oxygen delivery</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Insufficient water intake concentrating rather than flushing toxins</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Infrequent bowel movements allowing toxin reabsorption</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Avoiding sweating, reducing one elimination pathway</span></li>
                </ul>
              </div>

              {/* Digital Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Digital Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>EMF exposure (some notice correlations with detox signals)</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Blue light at night disrupting liver&apos;s processing patterns</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Constant connectivity maintaining nervous system activation</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Decode */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">3</span>
              <h2 className="section-title">Decode</h2>
            </div>

            {/* Signal Inventory */}
            <div className="be-card be-card-accent mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-gold" />
                <h3 className="font-heading font-bold text-navy">Signal Inventory</h3>
              </div>
              <p className="body-text mb-6">
                The Detoxification System generates 22 distinct signals across 8 categories:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Toxic Load Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Chemical Sensitivity / Multiple Chemical Sensitivity</li>
                    <li>Toxic Overload Feeling / Body Feels Poisoned</li>
                    <li>Vacation Effect / Better When Away From Home or Work</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Liver &amp; Metabolic Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Digestive Changes / Fat Intolerance</li>
                    <li>Intolerance to Alcohol, Caffeine, or Medications</li>
                    <li>Right-Sided Pain or Discomfort (Liver Area)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Kidney &amp; Urinary Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Changes in Urination Patterns</li>
                    <li>Kidney Area Pain or Discomfort (Flank Pain)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Lymphatic Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Lymph Node Swelling or Tenderness</li>
                    <li>Sluggish Lymph / Fluid Retention</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Skin Signals—As Detox Pathway (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Unexplained Rashes or Skin Eruptions</li>
                    <li>Skin Odor or Unusual Body Odor</li>
                    <li>Poor Wound Healing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Neurological &amp; Cognitive Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Toxin-Related Brain Fog</li>
                    <li>Peripheral Neuropathy / Tingling and Numbness</li>
                    <li>Tremors or Involuntary Movements</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Systemic Burden Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Multiple System Involvement Without Clear Diagnosis</li>
                    <li>Post-Exertional Worsening</li>
                    <li>Histamine Intolerance / Mast Cell Activation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Elimination Signals (3)</h4>
                  <ul className="body-text space-y-1">
                    <li>Constipation or Sluggish Bowels</li>
                    <li>Unusual Stool Characteristics</li>
                    <li>Excessive Sweating or Night Sweats (Non-Hormonal)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* TRADE Framework */}
            <div className="be-card mb-8">
              <h3 className="font-heading font-bold text-navy mb-4">The TRADE Framework</h3>
              <p className="body-text mb-6">
                Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">T</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Trigger</p>
                    <p className="body-text">You walk into a department store. Within minutes, your head feels foggy, you notice a headache forming, and your nose runs. You step outside and within an hour, you feel fine. The next week, the same thing happens at a freshly painted friend&apos;s house.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">R</span>
                  <div>
                    <p className="font-heading font-bold text-navy">React</p>
                    <p className="body-text">Your liver pathways engage with the chemical load. Your immune system responds to the assault. Your nervous system registers the exposure. Your body mounts a response—maybe inflammation, maybe nausea, maybe immediate fatigue.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">A</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Assume</p>
                    <p className="body-text">&quot;I&apos;m just sensitive.&quot; &quot;I&apos;m being dramatic.&quot; &quot;Nobody else seems bothered, so it must be in my head.&quot; &quot;I&apos;m becoming a hypochondriac.&quot; &quot;Maybe I&apos;m just anxious about chemicals.&quot;</p>
                  </div>
                </div>
                <div className="p-4 bg-pink-accent/10 rounded-lg">
                  <p className="body-text italic">
                    Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">D</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Decode</p>
                    <p className="body-text">Is there an environmental exposure I haven&apos;t identified? Did my signals begin after moving, renovating, or changing workplaces? Do my signals improve dramatically when I&apos;m away from home or work? Am I reacting to substances at doses that don&apos;t bother others? Are multiple body systems involved without a unifying diagnosis?</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">E</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Encode</p>
                    <p className="body-text">This isn&apos;t anxiety or hypochondria. My body is accurately detecting something that doesn&apos;t belong and communicating that the clearance pathways are overwhelmed. Chemical sensitivity is my detox system telling me the bucket is full. The vacation effect is my body recovering when the assault stops.</p>
                  </div>
                </div>
              </div>
              <p className="body-text mt-6 text-electric-blue font-medium">
                Investigating takes courage. When you question a story that feels true—especially one that&apos;s been reinforced by medical professionals—you gain more agency over your entire life.
              </p>
            </div>

            {/* Common Mislabels */}
            <div className="be-card">
              <h3 className="font-heading font-bold text-navy mb-4">Common Mislabels</h3>
              <p className="body-text mb-4">
                Detoxification signals are frequently attributed to other causes. The following patterns may be worth exploring:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full body-text">
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
            </div>
          </section>

          {/* Section 4: Gain */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">4</span>
              <h2 className="section-title">Gain</h2>
            </div>
            <p className="body-text mb-6">
              The following are options to explore—not prescriptions. Different approaches resonate with different people and situations.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Awareness Tools */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Environmental assessment—do signals correlate with specific locations?</li>
                  <li>Track if you feel better when away from home/work for several days</li>
                  <li>Reaction mapping—which substances provoke responses?</li>
                  <li>Notice timing between exposure and response (immediate vs. delayed)</li>
                  <li>Timeline construction—when did symptoms begin, what changed?</li>
                </ul>
              </div>

              {/* Exploratory Practices */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Movement for lymph (walking, rebounding, swimming, yoga)</li>
                  <li>Sweating practices (sauna, steam, hot baths, exercise)</li>
                  <li>Deep diaphragmatic breathing for lymphatic flow</li>
                  <li>Adequate hydration to dilute and flush toxins</li>
                  <li>Time-restricted eating allowing liver to clear rather than digest</li>
                </ul>
              </div>

              {/* Environmental Adjustments */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Droplets className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Air purifiers with HEPA and activated carbon</li>
                  <li>Removing air fresheners and scented products</li>
                  <li>Water filtration addressing local quality concerns</li>
                  <li>Glass or stainless steel instead of plastic containers</li>
                  <li>Professional mold assessment if water damage history exists</li>
                </ul>
              </div>

              {/* Professional Resources */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Environmental medicine physicians</li>
                  <li>Functional medicine practitioners</li>
                  <li>Naturopathic physicians trained in environmental medicine</li>
                  <li>Mold-literate practitioners (CIRS specialists)</li>
                  <li>Occupational medicine specialists</li>
                  <li>Building biologists for indoor environmental quality</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Execute */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">5</span>
              <h2 className="section-title">Execute</h2>
            </div>

            {/* Foundation Practices */}
            <div className="be-card be-card-accent mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-gold" />
                <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>
              </div>
              <ol className="space-y-4 body-text">
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">1</span>
                  <div><strong className="text-navy">Move daily.</strong> Any movement that contracts muscles supports lymph flow. Walking, stretching, rebounding, swimming—consistency matters more than intensity.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">2</span>
                  <div><strong className="text-navy">Hydrate consistently.</strong> Water is the medium for elimination. Adequate intake throughout the day supports kidney filtration and bowel regularity.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">3</span>
                  <div><strong className="text-navy">Maintain bowel regularity.</strong> Daily elimination prevents reabsorption of toxins bound in stool.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">4</span>
                  <div><strong className="text-navy">Sweat regularly.</strong> Whether through exercise, sauna, or hot baths—regular sweating opens one elimination pathway.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">5</span>
                  <div><strong className="text-navy">Breathe deeply.</strong> A few minutes of conscious deep breathing daily supports both oxygenation and lymphatic flow.</div>
                </li>
              </ol>
            </div>

            {/* Tracking What You Notice */}
            <div className="be-card mb-6">
              <h3 className="font-heading font-bold text-navy mb-4">Tracking What You Notice</h3>
              <p className="body-text mb-4">This isn&apos;t about metrics or optimization. It&apos;s about pattern recognition:</p>
              <ul className="space-y-3 body-text">
                <li>Whether signals correlate with specific locations or improve when away</li>
                <li>Reactions to substances and whether sensitivity is stable or expanding</li>
                <li>Elimination changes—urine color, stool characteristics, sweat patterns</li>
                <li>Which practices seem to shift how you feel</li>
                <li>Energy patterns and cognitive clarity in different environments</li>
              </ul>
              <p className="text-sm text-text-light mt-4 italic">
                Simple notes—not elaborate tracking systems—may reveal patterns over time.
              </p>
            </div>

            {/* The Patience Principle */}
            <div className="be-card bg-off-white">
              <h3 className="font-heading font-bold text-navy mb-4">The Patience Principle</h3>
              <p className="body-text mb-4">
                Detoxification patterns often develop over months to years of accumulated exposure. Clearance doesn&apos;t happen overnight.
              </p>
              <p className="body-text mb-4">
                Some people notice improvement within days of removing themselves from an exposure source. Others find that clearing accumulated burden takes months of consistent support. Herxheimer reactions (temporary worsening during active detoxification) are common—sometimes feeling worse before feeling better indicates the process is working.
              </p>
              <p className="text-electric-blue font-medium">
                The bucket filled slowly. It may empty slowly. Reducing inflow while supporting outflow is the consistent principle.
              </p>
            </div>
          </section>

          {/* Section 6: Questions for Clarity */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">6</span>
              <h2 className="section-title">Questions for Clarity</h2>
            </div>
            <p className="body-text mb-6">
              These questions may help distinguish whether signals originate from the Detoxification System:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
                </div>
                <ol className="space-y-3 body-text list-decimal list-inside">
                  <li>Is there known or suspected toxic exposure (mold, chemicals, heavy metals)?</li>
                  <li>Did signals begin after a move, renovation, or environmental change?</li>
                  <li>Do signals improve dramatically when away from home or work?</li>
                  <li>Is there sensitivity to chemicals that don&apos;t bother most people?</li>
                  <li>Are multiple systems involved without clear diagnosis?</li>
                </ol>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Deeper Investigation</h3>
                </div>
                <ol className="space-y-3 body-text list-decimal list-inside">
                  <li>Is there unusual intolerance to alcohol, caffeine, or medications?</li>
                  <li>Are there elimination changes (sweating, skin, stool, urine, odor)?</li>
                  <li>Is there a &quot;toxic&quot; or &quot;poisoned&quot; quality to symptoms?</li>
                  <li>Do symptoms worsen 24-48 hours after physical exertion?</li>
                  <li>Has sensitivity expanded to include more substances over time?</li>
                </ol>
              </div>
            </div>

            <div className="be-card mt-6">
              <h3 className="font-heading font-bold text-navy mb-4">Distinguishing Overlaps</h3>
              <ul className="space-y-3 body-text">
                <li><strong className="text-navy">Brain fog that improves with food</strong> → Energy Production</li>
                <li><strong className="text-navy">Brain fog that improves with movement</strong> → Circulation</li>
                <li><strong className="text-navy">Brain fog that correlates with environment</strong> → Detoxification</li>
                <li><strong className="text-navy">Fatigue that improves with rest</strong> → Energy Production</li>
                <li><strong className="text-navy">Fatigue with &quot;wired and tired&quot; quality</strong> → Stress Response</li>
                <li><strong className="text-navy">Fatigue with &quot;toxic&quot; or &quot;poisoned&quot; quality</strong> → Detoxification</li>
                <li><strong className="text-navy">Skin issues with clear allergic triggers</strong> → Defense</li>
                <li><strong className="text-navy">Skin issues that improve with sweating</strong> → Detoxification</li>
              </ul>
            </div>
          </section>

          {/* Section 7: Cross-System Connections */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">7</span>
              <h2 className="section-title">Cross-System Connections</h2>
            </div>
            <p className="body-text mb-6">
              The Detoxification System interfaces with multiple other systems. Toxic burden rarely affects one system in isolation:
            </p>

            <div className="grid gap-4">
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Energy Production</h4>
                  <p className="body-text">Toxins can damage mitochondria, the cellular structures that produce energy. Fatigue is often present with toxic burden. When clearance improves, energy often returns.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Defense System</h4>
                  <p className="body-text">The immune system responds to toxins, and chronic toxic exposure can trigger persistent inflammation. The Defense System may appear overactive when the real issue is ongoing assault that never resolves.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-pink-accent rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Digestive System</h4>
                  <p className="body-text">The liver produces bile that flows to the gut for fat digestion and toxin elimination. Liver congestion affects digestion. Gut dysfunction affects what gets absorbed (including toxins) and what gets eliminated.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-deep-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Stress Response</h4>
                  <p className="body-text">Chronic stress activation impairs detoxification capacity. The nervous system state directly affects whether the body can prioritize clearance functions. Toxic burden itself creates internal stress.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Consciousness</h4>
                  <p className="body-text">Neurotoxins directly affect brain function. Brain fog, memory impairment, processing difficulties, and mood changes may all stem from toxic burden affecting neural tissue.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Circulation</h4>
                  <p className="body-text">Blood delivers nutrients to detox organs and carries toxins away. Compromised circulation may impair clearance. The lymphatic system works in parallel to move debris.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="be-card be-card-accent text-center">
            <p className="body-text text-navy mb-4">
              Your body&apos;s clearing systems have been refined over half a billion years. The liver, kidneys, lymph, and skin work in concert to identify, transform, and eliminate what doesn&apos;t belong.
            </p>
            <p className="body-text italic">
              This report is for exploration purposes only and does not constitute medical advice, diagnosis, or treatment. The information presented invites investigation into patterns your body may be communicating.
            </p>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border">
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
