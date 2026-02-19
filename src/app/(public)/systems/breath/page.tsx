import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SystemDirectory } from "@/components/directory/system-solutions"
import { SystemNews } from "@/components/directory/system-news"

/**
 * Breath System Page
 *
 * Comprehensive guide to the Breath biological system.
 * Part of the bioEDGE Decoder 15 Systems Framework.
 */
export default function BreathSystemPage() {
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
            Breath System
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Bridge
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
              Right now, as you read this, your lungs expand without permission. Your diaphragm contracts and releases. Oxygen crosses membranes into your bloodstream while carbon dioxide flows the opposite direction. All of this happens in the time it takes to finish this sentence.
            </p>

            <p>
              The Breath System governs oxygen delivery, carbon dioxide removal, and blood pH regulation. It delivers what every cell requires and removes what would become toxic if accumulated. But this system does something no other vital function can do.
            </p>

            <p>
              <strong className="text-navy">The Breath System bridges.</strong> It is the only vital function that operates both automatically (you breathe while sleeping) and consciously (you can choose to hold your breath right now). This unique dual-control makes breath the primary access point for influencing your autonomic nervous system.
            </p>

            <p>
              Your body operates as a unified intelligence network. Scientists call this the psychophysiological supersystem: your endocrine system, nervous system, and immune system communicating constantly through shared chemical messengers. They speak the same language. And breath is the only place where you get to participate in the conversation.
            </p>

            <p>
              Beyond gas exchange, your breathing pattern directly affects heart rate, blood pressure, nervous system state, and blood chemistry. A dysfunctional breathing pattern can create signals that mimic anxiety, fatigue, and cognitive impairment. The intelligence required for respiration has been refined over half a billion years of evolution.
            </p>

            <p>
              Your body already knows how to breathe. The question is whether anything has interfered with this knowing.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              The following factors may be worth examining. These are not causes or diagnoses: they are considerations for investigation.
            </p>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Prolonged sitting or desk work, which may compress the diaphragm and restrict breath depth</li>
              <li>Physical inactivity, which may reduce respiratory fitness and capacity</li>
              <li>Sleep position patterns, particularly back sleeping which may contribute to airway issues</li>
              <li>Wearing tight clothing or restrictive garments around the chest or abdomen</li>
              <li>Chronic rushing or time pressure, which may elevate baseline breathing rate</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Foods that may contribute to nasal congestion or mucus production</li>
              <li>Alcohol consumption, particularly before sleep, which may relax airway muscles</li>
              <li>Large meals close to bedtime, which may restrict diaphragm movement</li>
              <li>Food sensitivities that may trigger inflammatory responses affecting airways</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Poor indoor air quality, dust, mold, or volatile organic compounds</li>
              <li>Dry air that may irritate nasal passages and promote mouth breathing</li>
              <li>Allergens in home or work environment</li>
              <li>Altitude changes if recently relocated</li>
              <li>Temperature extremes that may affect breathing comfort</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chronic interpersonal tension, which may maintain elevated stress breathing</li>
              <li>Suppressed emotional expression, which may manifest as breath holding or chest constriction</li>
              <li>Environments where deep sighing or audible breathing feels unsafe</li>
              <li>Relationships that require constant vigilance or guardedness</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chronic mouth breathing established in childhood</li>
              <li>Habitual breath holding during concentration or stress</li>
              <li>Upper chest breathing pattern that has become automatic</li>
              <li>Sighing or yawning patterns that may indicate chronic over-breathing</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>&quot;Email apnea&quot;: unconscious breath holding during screen use</li>
              <li>Forward head posture from device use compressing the chest</li>
              <li>Shallow breathing during focused screen work</li>
              <li>Notification patterns that may repeatedly trigger stress breathing</li>
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
              The Breath System produces 25 signals across 8 categories. These represent patterns your body may be communicating through respiration.
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Breathing Pattern Signals</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Shallow Breathing / Insufficient Breath Depth</li>
              <li>Rapid Breathing / Over-Breathing</li>
              <li>Breath Holding / Unconscious Apnea</li>
              <li>Excessive Sighing / Air Hunger</li>
              <li>Irregular Breathing Rhythm</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Oxygenation &amp; Gas Exchange</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Breathlessness at Rest / Dyspnea</li>
              <li>Exercise Intolerance / Early Breathlessness</li>
              <li>Excessive Yawning</li>
              <li>Light-Headedness from Breathing</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Blood Chemistry &amp; pH Signals</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Tingling / Numbness from Hyperventilation</li>
              <li>Chronic Mild Alkalosis Symptoms</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Sleep-Related Breath Signals</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Waking Gasping or Choking</li>
              <li>Snoring</li>
              <li>Non-Restorative Sleep / Morning Fatigue</li>
              <li>Morning Headaches</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Mechanical &amp; Structural</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Chest Tightness Related to Breathing</li>
              <li>Throat Tightness / Constricted Airway Feeling</li>
              <li>Diaphragm Dysfunction / Can&apos;t Breathe Into Belly</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Mouth Breathing &amp; Nasal Function</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Chronic Mouth Breathing</li>
              <li>Nasal Congestion Affecting Breathing</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Autonomic Bridge Signals</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Breathing Doesn&apos;t Calm Me Down</li>
              <li>Lost Connection to Breath</li>
              <li>Breath Responds to Stress But Won&apos;t Recover</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Conscious Control Signals</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Can&apos;t Stop Thinking About Breathing</li>
              <li>Feel Like I&apos;m Not Getting Enough Air</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You notice you&apos;ve been sighing repeatedly for the past hour. Each sigh feels unsatisfying, like you can&apos;t quite get a full breath.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your body tries to take deeper breaths. You yawn. You feel your chest tighten slightly. A vague unease settles in.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> &quot;Something is wrong with my lungs.&quot; &quot;I&apos;m not getting enough oxygen.&quot; &quot;I&apos;m having a panic attack.&quot; &quot;My asthma is flaring up.&quot; &quot;I&apos;m out of shape.&quot; &quot;This is my anxiety.&quot;
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> &quot;What is my breathing rate right now?&quot; &quot;Am I breathing through my mouth or nose?&quot; &quot;Does my belly expand when I breathe, or only my chest?&quot; &quot;Did I notice my breathing before I felt anxious, or after?&quot; &quot;What happens if I breathe less, not more?&quot; &quot;How long can I comfortably hold my breath after a normal exhale?&quot;
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> You discover that deliberately slowing your breathing and extending your exhale reduces the air hunger. You notice that the sighing started during a stressful email exchange. You remember that taking bigger breaths made it worse, not better. The signal isn&apos;t telling you that you need more air. It may be telling you that you&apos;re already over-breathing.
            </p>

            <p>
              Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life.
            </p>

            <h3 className="font-heading font-bold text-navy">Common Mislabels</h3>

            <p>
              Breath-related signals are frequently attributed to other causes. The following patterns may be worth exploring:
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
                    <td className="py-3 pr-4">Anxiety disorder, panic disorder</td>
                    <td className="py-3">Chronic hyperventilation pattern driving physical symptoms</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Need more cardio,&quot; &quot;out of shape&quot;</td>
                    <td className="py-3">Air hunger from CO2 depletion (paradoxically from over-breathing)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Just stressed,&quot; &quot;need to relax&quot;</td>
                    <td className="py-3">Breath holding during work/screens (email apnea)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Depression, laziness, &quot;not a morning person&quot;</td>
                    <td className="py-3">Morning fatigue from sleep disordered breathing</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Neurological problem, nerve damage</td>
                    <td className="py-3">Tingling from respiratory alkalosis (hyperventilation)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Breathwork doesn&apos;t work for me&quot;</td>
                    <td className="py-3">Chronic over-breather who needs LESS breathing, not more</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Allergies, &quot;just how I breathe&quot;</td>
                    <td className="py-3">Chronic mouth breathing habit established early in life</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Heart problem, psychosomatic</td>
                    <td className="py-3">Chest tightness from respiratory pattern dysfunction</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Low blood sugar, inner ear issue</td>
                    <td className="py-3">Light-headedness from breathing pattern and CO2 imbalance</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Nightmares, night terrors</td>
                    <td className="py-3">Waking gasping from airway events during sleep</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">&quot;Normal,&quot; &quot;harmless quirk&quot;</td>
                    <td className="py-3">Snoring indicating partial airway obstruction during sleep</td>
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
              The following are options to explore, not prescriptions. Your body will guide you toward what works.
            </p>

            <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Noticing whether you breathe through your mouth or nose throughout the day</li>
              <li>Observing whether your belly or chest moves when you breathe at rest</li>
              <li>Counting your breathing rate at rest (breaths per minute)</li>
              <li>Checking in on your breath during screen work, stressful moments, and transitions</li>
              <li>The BOLT test (Body Oxygen Level Test): timing comfortable breath-hold after normal exhale</li>
              <li>Noticing when sighing or yawning increases</li>
              <li>Asking a partner or family member if they notice snoring, mouth breathing, or breath holding</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Diaphragmatic breathing practice (belly rises on inhale)</li>
              <li>Extended exhale breathing (exhale longer than inhale)</li>
              <li>Nasal breathing during light activity</li>
              <li>Coherent breathing (rhythmic, balanced breath patterns)</li>
              <li>Humming or &quot;om&quot; practice (extends exhale, stimulates vagus nerve)</li>
              <li>Light physical movement with attention to breath</li>
              <li>Gentle breath reduction practices (for those who may be chronic over-breathers)</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Improving air quality (plants, air filters, reducing chemical products)</li>
              <li>Humidifying dry environments</li>
              <li>Reducing allergen exposure in sleeping environment</li>
              <li>Mouth taping during sleep (with appropriate precautions)</li>
              <li>Elevating head position during sleep if indicated</li>
              <li>Creating breath-awareness reminders in work environment</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Breathing educators and Buteyko practitioners</li>
              <li>Sleep medicine specialists (if sleep disordered breathing is suspected)</li>
              <li>Myofunctional therapists (for mouth breathing and tongue position)</li>
              <li>Respiratory therapists</li>
              <li>ENT specialists (if structural nasal issues are present)</li>
              <li>Pulmonologists (for evaluation of respiratory function)</li>
              <li>Yoga therapists with focus on pranayama</li>
            </ul>

            {/* Execute */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Take action with patience and consistency</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>

            <p>Simple anchors that may support breath awareness:</p>

            <ol className="list-decimal pl-6 space-y-3">
              <li><strong className="text-navy">Morning breath check.</strong> Before getting out of bed, notice your breathing. Is it through your nose? Does your belly move? What is its rhythm?</li>
              <li><strong className="text-navy">Transition breaths.</strong> Before starting a new activity, take three conscious breaths through your nose into your belly.</li>
              <li><strong className="text-navy">Screen awareness.</strong> Set a reminder to check your breathing every 30-60 minutes during screen work.</li>
              <li><strong className="text-navy">Evening wind-down.</strong> Five minutes of extended exhale breathing before sleep.</li>
              <li><strong className="text-navy">Nasal breathing default.</strong> Notice when you switch to mouth breathing and gently return to nasal.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <p>These are observations, not metrics to optimize:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>When does air hunger or sighing increase?</li>
              <li>What is your resting breathing rate at different times of day?</li>
              <li>How long is your comfortable breath-hold after normal exhale (BOLT)?</li>
              <li>Do you wake with dry mouth, indicating mouth breathing during sleep?</li>
              <li>When does chest tightness or throat constriction appear?</li>
              <li>How quickly does your breathing return to baseline after stress?</li>
              <li>What activities or environments change your breathing pattern?</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              Breathing patterns may have developed over years or decades. If chronic over-breathing or dysfunctional patterns are present, the respiratory centers have adapted to that baseline.
            </p>

            <p>
              Changing these patterns requires time for the body to recalibrate its CO2 tolerance and for new habits to become automatic. Some people notice shifts within days. For others, weeks or months of consistent practice may be needed before the changes integrate.
            </p>

            <p>
              Consistency matters more than intensity. Three minutes of breath awareness daily will likely serve you better than an hour once a week.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              These questions may help you explore whether signals originate from the Breath System:
            </p>

            <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Is this signal directly related to breathing pattern, rate, or depth?</li>
              <li>Does consciously changing your breathing pattern affect this signal?</li>
              <li>Does the signal involve sensations of air hunger, suffocation, or inability to get enough air?</li>
              <li>Are there observable signs (snoring, visible chest-only breathing, breath holding)?</li>
              <li>Does slowing your breathing or switching to nasal breathing change the signal?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Deeper Investigation</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Is the signal paradoxically worse at rest than during activity? (Classic hyperventilation pattern)</li>
              <li>Have you tried breathwork and found it made things worse? (May need LESS breathing, not more)</li>
              <li>Is sleep quality poor with snoring, gasping awake, or morning headaches?</li>
              <li>Does physical exertion trigger the signal, with breathing being the limiting factor?</li>
              <li>Does stress trigger the signal AND does it persist long after the stressor resolves?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Distinguishing from Other Systems</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-navy">Could this be Nervous System?</strong> Stress affects the whole nervous system. If only breathing pattern seems involved, it may be Breath.</li>
              <li><strong className="text-navy">Could this be Circulation?</strong> Does the signal include heart symptoms, swelling, or circulation-related patterns?</li>
              <li><strong className="text-navy">Could this be Energy Production?</strong> Does eating improve the signal? (Points to Energy, not Breath.)</li>
              <li><strong className="text-navy">Could this be Immunity?</strong> Are there allergic triggers, wheezing, or inflammatory patterns?</li>
              <li><strong className="text-navy">Could this be Emotional?</strong> Does the signal carry specific emotional content, or is it purely physical?</li>
            </ul>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              The Breath System interfaces with multiple other systems. These connections may be worth exploring:
            </p>

            <p>
              <strong className="text-navy">Nervous System</strong> — Breath is the primary conscious access point for shifting nervous system state. Breathing pattern may drive stress symptoms rather than result from them.
            </p>

            <p>
              <strong className="text-navy">Circulation</strong> — Breathing rate and depth affect heart rate and blood pressure. Breathlessness may originate in either system and requires distinguishing questions.
            </p>

            <p>
              <strong className="text-navy">Energy Production</strong> — Oxygen delivery supports cellular energy production. Chronic hyperventilation can contribute to fatigue. Fatigue from breathing issues may improve with pattern correction.
            </p>

            <p>
              <strong className="text-navy">Sleep &amp; Recovery</strong> — Sleep disordered breathing directly impairs restorative sleep. Morning fatigue may originate in overnight breathing patterns.
            </p>

            <p>
              <strong className="text-navy">Emotional</strong> — Unexpressed emotion can manifest as breath holding, chest constriction, or throat tightness. Emotional release may shift breathing patterns.
            </p>

            <p>
              <strong className="text-navy">Immunity</strong> — Allergic and inflammatory responses can affect airways. Asthma and exercise-induced breathing issues require distinguishing from pattern dysfunction.
            </p>


            <Suspense fallback={null}>
              <SystemNews system="Breath" label="Breath" />
            </Suspense>

            <Suspense fallback={null}>
              <SystemDirectory system="Breath" label="Breath" />
            </Suspense>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                The breath is always available. It requires no equipment, no subscription, no external permission. It is happening right now, in this moment, waiting to be noticed.
              </p>
              <p className="mt-4 italic">
                This report is an invitation to explore: not a diagnosis or prescription. Your body&apos;s intelligence has been refined over millions of years. The signals it sends through your breath deserve your curious attention.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Systems
            </Link>
            <Link
              href="/systems/circulation"
              className="inline-flex items-center gap-2 text-sm text-[#017ab2] hover:text-navy transition-colors font-medium"
            >
              Next: Circulation
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Breath System | bioEDGE Decoder",
  description: "Your Body's Bridge. The Breath System governs oxygen delivery, carbon dioxide removal, and blood pH regulation. It is the only vital function that operates both automatically and consciously.",
  alternates: {
    canonical: "/systems/breath",
  },
}
