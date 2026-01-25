import { Shield, ArrowLeft, AlertCircle, Search, Sparkles, Play, HelpCircle, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

/**
 * Defense System Page
 *
 * Your Body's Intelligent Shield - immune function, inflammation, autoimmunity
 * Part of the bioEDGE Decoder 15 Systems Framework.
 */
export default function DefenseSystemPage() {
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
              <Shield className="h-10 w-10 text-gold" />
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white">
                Defense System
              </h1>
            </div>
            <p className="text-xl text-white/80">
              Your Body&apos;s Intelligent Shield
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
                Your body operates a sophisticated surveillance network more complex than any security system ever designed. Right now, as you read this, immune cells are patrolling 37 trillion cells, distinguishing self from other, friend from foe, in decisions that execute faster than thought.
              </p>
              <p>
                The Defense System governs protection against pathogens and the management of inflammation. Its core function is to protect: identifying what doesn&apos;t belong, neutralizing threats, and repairing damage.
              </p>
              <p className="font-semibold text-navy">
                What makes this system remarkable among the fourteen biological systems is its dual capacity for precision and proportionality. When functioning well, your Defense System mounts strong responses to genuine threats and stands down when those threats pass. It knows the difference between a splinter and a virus, between pollen and a pathogen, between your own tissue and foreign invaders.
              </p>
              <p>
                Inflammation is its primary tool—beneficial when acute, destructive when chronic. A fever isn&apos;t a malfunction; it&apos;s an intentional immune response. Your body raises its temperature because most pathogens can&apos;t survive the heat. A cut swells and reddens because immune cells are flooding the area, bringing reinforcements and building supplies for repair.
              </p>
              <p>
                This is the psychophysiological supersystem at work. Your endocrine system, nervous system, and immune system don&apos;t operate in isolation. They communicate constantly through shared chemical messengers. When you face a threat, this network responds as one. Cut your finger, and your nervous system signals pain to protect the area. Your endocrine system releases clotting factors. Your immune system dispatches white blood cells to prevent infection. No committee meetings. No filed reports. Coordinated response without conscious direction.
              </p>
              <p>
                Consider how ancient this intelligence is. By the time humans appeared, the immune system had already been refined for half a billion years. You inherited this. The wisdom encoded in your Defense System carries intelligence accumulated across evolutionary time.
              </p>
              <p className="text-electric-blue font-medium">
                Your body already knows how to protect you. The signals it sends are information, not failures. The question is whether you&apos;re listening.
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
              The following factors may warrant examination when exploring signals that might originate from your Defense System. These are not causes or diagnoses—they are considerations worth investigating.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Lifestyle Factors */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Lifestyle Factors</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Prolonged inactivity, which might contribute to inflammatory accumulation</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Excessive exercise without adequate recovery, which may deplete immune resources</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Sleep disruption, as immune repair and regulation often occur during rest</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Irregular schedules that may affect circadian rhythm governing immune cell activity</span></li>
                </ul>
              </div>

              {/* Dietary Considerations */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Dietary Considerations</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Highly processed foods, refined sugars, and industrial seed oils</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Foods you may have developed sensitivities to</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Timing, speed of eating, and nervous system state during meals</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Gut-immune interactions (the gut houses 70-80% of your immune system)</span></li>
                </ul>
              </div>

              {/* Environmental Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Environmental Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Water-damaged buildings and mold exposure</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Poor air quality and chemical-laden environments</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Workplace exposures and home environments</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Air quality in spaces where you spend significant time</span></li>
                </ul>
              </div>

              {/* Relationship & Emotional Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Relationship &amp; Emotional Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Chronic interpersonal stress influencing immune regulation</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Suppressed emotions and unresolved conflicts</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Relationships that consistently activate stress response</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Social isolation (associated with immune dysfunction)</span></li>
                </ul>
              </div>

              {/* Habitual Patterns */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Habitual Patterns</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Chronic overwork and pushing through illness</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Ignoring early signals and patterns of self-neglect</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>The story you tell yourself about rest (earned vs. wasteful)</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>How you respond to immune signals</span></li>
                </ul>
              </div>

              {/* Digital Interference */}
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">Digital Interference</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Screen time and notification patterns disrupting sleep</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Blue light exposure at night affecting circadian rhythms</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Stress of constant connectivity</span></li>
                  <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Displacement of restorative activities</span></li>
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
                The Defense System communicates through 26 signals organized across 9 categories:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Acute Inflammatory Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Localized swelling</li>
                    <li>Localized heat</li>
                    <li>Redness or erythema</li>
                    <li>Fever or elevated temperature</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Chronic Inflammatory Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Persistent joint pain</li>
                    <li>Chronic fatigue that doesn&apos;t improve with rest</li>
                    <li>Brain fog or mental cloudiness</li>
                    <li>Chronic skin issues (eczema, psoriasis, rashes)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Immune Activation Signals (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Frequent illness or getting sick often</li>
                    <li>Swollen lymph nodes</li>
                    <li>Night sweats</li>
                    <li>Prolonged recovery from illness</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Allergic &amp; Hypersensitivity (4)</h4>
                  <ul className="body-text space-y-1">
                    <li>Environmental allergies (pollen, dust, mold)</li>
                    <li>Food reactions or sensitivities</li>
                    <li>Hives or urticaria</li>
                    <li>Chemical sensitivity</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Autoimmune &amp; Self-Attack (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Feeling of body attacking itself</li>
                    <li>Systemic inflammation patterns (multiple systems)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Gut-Immune Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Gut inflammation / &quot;leaky gut&quot; patterns</li>
                    <li>Post-meal immune activation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Healing Response Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Slow wound healing</li>
                    <li>Abnormal scarring patterns (keloids)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Immune Depletion Signals (2)</h4>
                  <ul className="body-text space-y-1">
                    <li>Post-exertional malaise</li>
                    <li>Reactive / hypervigilant immune system</li>
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-heading text-sm font-bold text-navy mb-2">Infection Signals (2)</h4>
                  <ul className="body-text space-y-1 md:flex md:gap-8">
                    <li>Low-grade persistent feeling of being sick</li>
                    <li>Reactivation patterns (cold sores recurring)</li>
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
                    <p className="body-text">You notice joint stiffness in the morning. It takes a while to get moving. Your fingers feel puffy.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">R</span>
                  <div>
                    <p className="font-heading font-bold text-navy">React</p>
                    <p className="body-text">Your body has already responded—there&apos;s inflammation present, immune cells are active, fluid has accumulated.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-navy font-heading font-bold text-sm flex-shrink-0">A</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Assume</p>
                    <p className="body-text">&quot;I&apos;m getting old.&quot; &quot;This is just arthritis.&quot; &quot;I must have slept wrong.&quot; &quot;Everyone in my family has joint problems.&quot; &quot;I need to push through.&quot; &quot;It&apos;s nothing.&quot;</p>
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
                    <p className="body-text">Is there heat or swelling present? Does the stiffness last more than 30 minutes? Did this cluster with other inflammatory signals—fatigue, brain fog, skin issues? What was I eating, how stressed was I, what exposures occurred before this started? Did this begin after an infection or illness?</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">E</span>
                  <div>
                    <p className="font-heading font-bold text-navy">Encode</p>
                    <p className="body-text">You remember this differently. Morning stiffness isn&apos;t who you are. It&apos;s information. Your body was telling you something about inflammatory load. The signal was accurate. The original story was incomplete.</p>
                  </div>
                </div>
              </div>
              <p className="body-text mt-6 text-electric-blue font-medium">
                Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life. This doesn&apos;t stop with your health. This can apply to your career, your family, your friends, anything.
              </p>
            </div>

            {/* Common Mislabels */}
            <div className="be-card">
              <h3 className="font-heading font-bold text-navy mb-4">Common Mislabels</h3>
              <p className="body-text mb-4">
                Defense System signals are frequently attributed to other causes. The following patterns may be worth exploring:
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
                      <td className="py-3 pr-4">Laziness, depression, &quot;just tired&quot;</td>
                      <td className="py-3">Chronic fatigue from inflammation that doesn&apos;t improve with rest</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">ADHD, early dementia, aging</td>
                      <td className="py-3">Brain fog accompanied by other inflammatory markers</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Hypochondria, &quot;making it up,&quot; picky eating</td>
                      <td className="py-3">Food sensitivities producing real immune responses</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Anxiety disorder, &quot;too sensitive,&quot; hysteria</td>
                      <td className="py-3">Multiple chemical sensitivity with measurable reactions</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Deconditioning, lack of willpower</td>
                      <td className="py-3">Post-exertional malaise—worsening after activity</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">&quot;Labs are normal,&quot; psychosomatic</td>
                      <td className="py-3">Autoimmune patterns not yet captured by standard testing</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Normal aging, &quot;arthritis runs in the family&quot;</td>
                      <td className="py-3">Inflammatory joint pain that may respond to triggers</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Weak constitution, bad luck</td>
                      <td className="py-3">Frequent illness indicating depleted immune resources</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Panic disorder, &quot;just sensitive&quot;</td>
                      <td className="py-3">Histamine or mast cell patterns producing physical symptoms</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Multiple separate diagnoses</td>
                      <td className="py-3">Systemic inflammation affecting multiple systems</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Stress, &quot;nervous reaction&quot;</td>
                      <td className="py-3">Hives and urticaria from mast cell activation</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Poor self-care, &quot;just how you heal&quot;</td>
                      <td className="py-3">Slow wound healing indicating immune dysfunction</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 pr-4">Menopause, anxiety</td>
                      <td className="py-3">Night sweats indicating chronic immune activation</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Anxiety, hypervigilance (psychological)</td>
                      <td className="py-3">Reactive immune system with real inflammatory responses</td>
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
              The following represent options worth exploring. These are not prescriptions—they are invitations to investigate.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Awareness Tools */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Observe timing patterns—signals worsening in the morning suggest inflammation</li>
                  <li>Notice signals that flare after meals (food-related immune activation)</li>
                  <li>Track patterns correlating with stress, weather, or environments</li>
                  <li>Notice clusters: joint pain + fatigue + brain fog + skin issues together</li>
                  <li>Track what happens after exertion—normal fatigue vs. post-exertional malaise</li>
                </ul>
              </div>

              {/* Exploratory Practices */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Elimination approaches for food-related triggers</li>
                  <li>Stress reduction practices (given stress-immune communication)</li>
                  <li>Movement appropriate to current capacity</li>
                  <li>Rest as a practice, not just when you collapse</li>
                  <li>Observing what shifts when potential triggers are removed</li>
                </ul>
              </div>

              {/* Environmental Adjustments */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Air quality in living and working spaces</li>
                  <li>Reducing chemical exposure (fragrances, cleaning products)</li>
                  <li>Addressing water damage or potential mold issues</li>
                  <li>Examining personal care products for burden</li>
                </ul>
              </div>

              {/* Professional Resources */}
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li>Immunologists and rheumatologists</li>
                  <li>Allergists</li>
                  <li>Functional medicine practitioners (chronic inflammatory patterns)</li>
                  <li>Naturopathic physicians</li>
                  <li>Environmental medicine practitioners</li>
                  <li>Integrative practitioners who consider the whole picture</li>
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
              <p className="body-text mb-4">Simple daily anchors that may support immune function:</p>
              <ol className="space-y-4 body-text">
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">1</span>
                  <div><strong className="text-navy">Consistent sleep pattern.</strong> Adequate sleep in a regular rhythm, as immune repair occurs during rest.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">2</span>
                  <div><strong className="text-navy">Appropriate movement.</strong> Regular activity matched to your current capacity—not pushing through signals.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">3</span>
                  <div><strong className="text-navy">Non-triggering meals.</strong> Eating foods that don&apos;t provoke obvious reactions.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">4</span>
                  <div><strong className="text-navy">Time outdoors.</strong> Natural settings where your nervous system can settle.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white font-heading font-bold text-xs flex-shrink-0">5</span>
                  <div><strong className="text-navy">Genuine rest.</strong> Periods where you truly recover, not just collapse.</div>
                </li>
              </ol>
              <p className="text-electric-blue font-medium mt-4">
                Consistency matters more than intensity. Small practices maintained over time often outperform dramatic interventions that can&apos;t be sustained.
              </p>
            </div>

            {/* Tracking What You Notice */}
            <div className="be-card mb-6">
              <h3 className="font-heading font-bold text-navy mb-4">Tracking What You Notice</h3>
              <p className="body-text mb-4">This is observation, not optimization. You&apos;re building a relationship with your body&apos;s signals:</p>
              <ul className="space-y-3 body-text">
                <li>What you eat and how you feel in the hours and days afterward</li>
                <li>Sleep quality and how you feel upon waking</li>
                <li>When signals appear, worsen, or improve</li>
                <li>What was happening in your environment before a flare</li>
                <li>How long morning stiffness lasts</li>
                <li>Whether rest helps or doesn&apos;t change things</li>
              </ul>
              <p className="text-sm text-text-light mt-4 italic">
                This isn&apos;t about perfect data. It&apos;s about pattern recognition over time.
              </p>
            </div>

            {/* The Patience Principle */}
            <div className="be-card bg-off-white">
              <h3 className="font-heading font-bold text-navy mb-4">The Patience Principle</h3>
              <p className="body-text mb-4">
                The Defense System operates on its own timeline. Immune rebalancing doesn&apos;t happen in days. Changes to inflammatory patterns may take weeks to months to become apparent. If your immune system has been dysregulated for years, resolution won&apos;t arrive overnight.
              </p>
              <p className="body-text mb-4">
                Inflammation accumulated slowly often resolves slowly. Triggers removed today may show effects weeks from now. This is frustrating when you want answers and improvement now.
              </p>
              <p className="text-electric-blue font-medium">
                Trust the process. Notice small shifts, not just dramatic changes. Sometimes &quot;less bad&quot; is the first sign that something is moving in the right direction.
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
              These questions may help explore whether a signal originates from your Defense System:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
                </div>
                <ol className="space-y-3 body-text list-decimal list-inside">
                  <li>Is there visible or measurable inflammation—swelling, heat, redness?</li>
                  <li>Does this signal cluster with other inflammatory markers?</li>
                  <li>Does morning stiffness last more than 30 minutes?</li>
                  <li>Does rest help this fatigue? (If no, points to Defense)</li>
                  <li>Is there post-exertional malaise—worsening hours or days after activity?</li>
                </ol>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">Deeper Investigation</h3>
                </div>
                <ol className="space-y-3 body-text list-decimal list-inside">
                  <li>Do anti-inflammatory approaches help?</li>
                  <li>Are there identified triggers—foods, chemicals, environments?</li>
                  <li>Did this start after an infection, toxic exposure, or triggering event?</li>
                  <li>Are sensitivities multiplying over time?</li>
                  <li>Is there a pattern of immune signals together?</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Section 7: Cross-System Connections */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-navy text-white font-heading font-bold">7</span>
              <h2 className="section-title">Cross-System Connections</h2>
            </div>
            <p className="body-text mb-6">
              The Defense System interfaces with multiple other systems, reflecting the psychophysiological supersystem:
            </p>

            <div className="grid gap-4">
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Energy Production</h4>
                  <p className="body-text">Chronic inflammation depletes cellular energy resources. Inflammatory fatigue and post-exertional malaise involve both systems. When immune activity consumes energy, less remains for everything else.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Stress Response</h4>
                  <p className="body-text">The nervous system and immune system share chemical messengers. Stress lowers the threshold for immune reactions—autoimmune flares, allergic responses, and hives often worsen during stressful periods.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-pink-accent rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Digestive</h4>
                  <p className="body-text">70-80% of immune tissue resides in the gut. Gut inflammation affects systemic immune function. Food sensitivities develop when gut barrier integrity is compromised.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-deep-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Detoxification</h4>
                  <p className="body-text">Chronic inflammatory response syndrome (CIRS) patterns involve both toxic burden and immune response. Mold exposure triggers immune activation. The liver&apos;s detoxification capacity affects inflammatory load.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-gold rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Hormonal</h4>
                  <p className="body-text">Hormones modulate immune function. Autoimmune conditions show gender differences related to hormonal patterns. Thyroid dysfunction and immune dysregulation often co-occur.</p>
                </div>
              </div>
              <div className="be-card flex gap-4">
                <div className="w-2 bg-electric-blue rounded-full flex-shrink-0"></div>
                <div>
                  <h4 className="font-heading font-bold text-navy">Consciousness</h4>
                  <p className="body-text">Brain fog from inflammation reflects how cytokines (immune messengers) cross into the brain and affect cognitive function. Inflammation-driven mood changes have a flat quality distinct from emotional processing.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="be-card be-card-accent text-center">
            <p className="body-text text-navy mb-4">
              Your Defense System carries intelligence accumulated across half a billion years of evolution. It knows how to protect you, repair damage, and distinguish friend from foe. The signals it sends are information, not failures.
            </p>
            <p className="body-text italic">
              Your job is to listen, decode, and respond—trusting that your body already knows how.
            </p>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border">
            <Link
              href="/systems/consciousness"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Consciousness
            </Link>
            <Link
              href="/systems/detoxification"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-pink-accent transition-colors font-medium"
            >
              Next: Detoxification
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Defense System | bioEDGE Decoder",
  description: "Your Body's Intelligent Shield. The Defense System governs protection against pathogens and the management of inflammation—identifying what doesn't belong, neutralizing threats, and repairing damage.",
}
