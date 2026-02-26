/**
 * Outreach Persona Briefing Library
 *
 * Curated persona briefings for the General Outreach email module.
 * The AI receives the relevant briefing in its system prompt so it can write
 * with genuine understanding of the recipient's world — without knowing them
 * personally and without using their name.
 *
 * Two tiers:
 *   Tier 1 — Practice-type personas (minority of contacts, richer personalization)
 *   Tier 2 — Longevity enthusiast default (majority of contacts — no practice type)
 *
 * IMPORTANT: These briefings are curated content, not user-generated.
 * Keep them grounded, specific, and skepticism-aware. Generic wellness platitudes
 * are the enemy here.
 */

export interface PersonaBriefing {
  group: string
  displayName: string        // shown in campaign form UI
  businessTypeMatches: string[]  // which Business Type strings map to this group
  context: string            // injected verbatim into AI system prompt
}

// ---------------------------------------------------------------------------
// Tier 1: Practice-type personas
// ---------------------------------------------------------------------------

const CHIROPRACTOR: PersonaBriefing = {
  group: 'chiropractor',
  displayName: 'Chiropractors',
  businessTypeMatches: [
    'Chiropractor',
    'Doctor of Chiropractic',
    'Chiropractic',
    'Chiropractor / DC',
  ],
  context: `You are writing to a chiropractor or chiropractic practice owner. Their world:

- They see patients daily with musculoskeletal complaints — back pain, neck pain, disc issues, sports injuries, headaches.
- Many run their own practice: they manage staff, insurance billing, front desk, and patient scheduling simultaneously.
- They are clinically trained and scientifically minded, but many have a strong interest in integrative and functional approaches beyond adjustments alone.
- They're often frustrated that the medical establishment undervalues chiropractic, which makes them defensive about anything that sounds like outsider judgment.
- They are deeply skeptical of "vendor pitch" language. They receive many solicitations and can smell a mass email immediately.
- Time is their scarcest resource. Between patients there are minutes, not hours.
- What genuinely interests them: evidence-based longevity science, neuromuscular aging, fascia research, patient compliance, anything that improves outcomes they can observe.
- Language they use: adjustment, subluxation, soft tissue, neuromuscular, spinal integrity, mobility, range of motion, functional restoration, chiropractic biophysics.
- What earns their attention: being treated as a peer professional, specific and actionable information, someone who understands their clinical reality.
- What loses them immediately: vague value propositions, corporate wellness language, anything that sounds like an expo vendor pitch.`,
}

const MEDICAL_SPA: PersonaBriefing = {
  group: 'medical_spa',
  displayName: 'Med Spas',
  businessTypeMatches: [
    'Medical spa',
    'Med spa',
    'Medspa',
    'Medical Spa',
  ],
  context: `You are writing to a med spa owner, director, or lead practitioner. Their world:

- Med spas occupy the intersection of aesthetics and medicine — injectables, laser treatments, body contouring, skin rejuvenation, IV therapy, hormone therapy.
- Owners are often nurse practitioners, PAs, or physicians who pivoted from clinical medicine; some are business owners who hired medical directors.
- They operate in a competitive, price-sensitive market. Client retention and word-of-mouth are everything.
- Their clients are primarily women 35–60 focused on appearance and energy — a demographic that is increasingly interested in longevity, not just aesthetics.
- They're interested in expanding their service menu to stay relevant — biohacking-adjacent services (NAD+, peptides, metabolic panels) are a growing draw for them.
- They're skeptical of anything that competes with their revenue or makes them feel like a referral source for someone else's business.
- What genuinely interests them: trends their clients are asking about, adding longevity-adjacent services, peer community, clinical education that differentiates them.
- Language they use: aesthetics, injectables, body contouring, treatment protocols, client retention, consultation conversion, service menu.
- What earns their attention: relevant trends, practical business implications, peer recognition in the longevity space.
- What loses them: anything that talks down to aesthetics professionals, generic wellness pitch, "transform your practice" language.`,
}

const ACUPUNCTURE: PersonaBriefing = {
  group: 'acupuncture',
  displayName: 'Acupuncturists',
  businessTypeMatches: [
    'Acupuncture clinic',
    'Acupuncturist',
    'Acupuncture',
    'Licensed Acupuncturist',
  ],
  context: `You are writing to an acupuncturist or acupuncture clinic owner. Their world:

- They practice traditional Chinese medicine, often integrating acupuncture with cupping, moxibustion, herbal protocols, and nutritional guidance.
- Many practice independently or in small multi-practitioner clinics. Insurance reimbursement is inconsistent, so they rely on cash-pay clientele.
- They navigate a constant tension between traditional Eastern medicine philosophy and Western scientific validation — many have embraced evidence-based frameworks while defending their traditional roots.
- Their patients come for chronic pain, stress, fertility, digestive issues, and increasingly for performance and longevity optimization.
- They are philosophically aligned with longevity and functional medicine; they already think in terms of systemic balance, not symptom suppression.
- They are skeptical of anything that feels like it's trying to make them more "mainstream" or suggesting their practice is incomplete.
- What genuinely interests them: the intersection of TCM principles and modern longevity science, clinical tools that bridge both worlds, community with other integrative practitioners.
- Language they use: qi, meridians, five elements, constitutional type, root and branch, dampness, deficiency, excess, liver qi stagnation.
- What earns their attention: genuine respect for their training, practical clinical insights, community with peers who take integrative medicine seriously.
- What loses them: patronizing language, oversimplification of their medicine, anything that suggests acupuncture is just "needles for pain."`,
}

const FITNESS: PersonaBriefing = {
  group: 'fitness',
  displayName: 'Fitness Professionals',
  businessTypeMatches: [
    'Personal trainer',
    'Personal Trainer',
    'Fitness center',
    'Gym',
    'Physical fitness program',
    'Health and Wellness Coach...Group Fitness Instructor',
    'Group Fitness Instructor',
    'Fitness Coach',
  ],
  context: `You are writing to a personal trainer, gym owner, or fitness professional. Their world:

- They work with clients one-on-one or in groups, designing programs around strength, conditioning, weight loss, athletic performance, or rehabilitation.
- Many are self-employed or rent space in a facility; income is closely tied to client retention and referrals.
- They see the direct, daily effects of aging on their clients' bodies — loss of muscle, declining mobility, metabolic slowdown — which makes longevity science personally relevant to their work.
- They already know a lot about exercise science but often feel left out of broader health conversations dominated by clinicians.
- They're looking for tools and frameworks that help them add value beyond programming — nutrition, recovery, lifestyle guidance — without overstepping their scope of practice.
- What genuinely interests them: the science of muscle preservation with aging, recovery optimization, metabolic health, anything that helps them serve their clients better and differentiate their services.
- Language they use: progressive overload, periodization, VO2 max, body composition, mobility, recovery, client adherence, functional movement.
- What earns their attention: practical application to their clients, peer respect, science that's accessible but not dumbed down.
- What loses them: content clearly aimed at physicians or clinicians, anything that makes them feel like they're outside the "real" health professional world.`,
}

const MARTIAL_ARTS: PersonaBriefing = {
  group: 'martial_arts',
  displayName: 'Martial Arts Schools',
  businessTypeMatches: [
    'Martial arts school',
    'Boxing Coaching Center',
    'Boxing gym',
    'Martial arts',
  ],
  context: `You are writing to a martial arts school owner or head coach. Their world:

- They run performance-focused training environments — MMA, BJJ, boxing, Muay Thai, karate, judo, or similar disciplines.
- Their students range from recreational adults and kids to competitive fighters and serious athletes.
- They are deeply invested in physical longevity for practical reasons: aging athletes, injury recovery, and helping students train for decades rather than years.
- Many school owners are former competitive athletes who have navigated their own injury and recovery journeys and are personally invested in performance longevity.
- They're entrepreneurial and community-oriented — the school is often their life's work.
- They're skeptical of anything academic or overly clinical; they value things that have been tested in the real world.
- What genuinely interests them: injury prevention and recovery science, training longevity, how their students can perform at high levels longer, nutrition for fighters.
- Language they use: training camp, sparring, drilling, performance, conditioning, recovery, injury prevention, competition.
- What earns their attention: practical, proven application to athletic longevity; respect for the sport; peer recognition.
- What loses them: generic wellness language, anything that sounds soft or academic without practical application.`,
}

const YOGA_PILATES: PersonaBriefing = {
  group: 'yoga_pilates',
  displayName: 'Yoga & Pilates Instructors',
  businessTypeMatches: [
    'Yoga instructor',
    'Yoga Instructor',
    'Kids Yoga Instructor',
    'Yoga Teacher',
    'Bikram yoga studio',
    'Pilates studio',
    'Pilates',
  ],
  context: `You are writing to a yoga or Pilates instructor or studio owner. Their world:

- They teach movement practices rooted in body awareness, breath, alignment, and mind-body connection.
- Their students are often health-conscious adults seeking stress reduction, flexibility, injury rehabilitation, and overall wellbeing — an audience increasingly interested in longevity.
- Many are deeply spiritual as well as physically practiced; they value holistic approaches and can be skeptical of purely mechanistic health frameworks.
- Studio owners deal with the relentless economics of small fitness businesses: student retention, class scheduling, competitive local markets.
- They have genuine expertise in movement, breathing mechanics, and somatic awareness that is undervalued in the broader health conversation.
- What genuinely interests them: the science behind why their practices work (nervous system, connective tissue, breath-longevity connection), how to speak to longevity-interested clients, community with health professionals who respect their work.
- Language they use: breath, alignment, somatic, nervous system, parasympathetic, flexibility, functional movement, mindfulness, presence, body awareness.
- What earns their attention: genuine respect for their discipline, intersections with longevity science they may not have encountered, peer community.
- What loses them: being treated as a fitness instructor rather than a health professional, generic wellness pitch, anything that ignores the mind-body dimension.`,
}

const SPA_WELLNESS: PersonaBriefing = {
  group: 'spa_wellness',
  displayName: 'Spas & Massage Therapists',
  businessTypeMatches: [
    'Day spa',
    'Health spa',
    'Massage therapist',
    'Massage Therapist',
    'Licensed Massage Therapist',
    'Massage spa',
    'Facial spa',
    'Beauty Parlour',
    'Nail salon',
    'Hair salon',
  ],
  context: `You are writing to a spa owner, massage therapist, or wellness spa practitioner. Their world:

- They work in the recovery and relaxation space — massage therapy, bodywork, skin care, and complementary wellness services.
- Licensed massage therapists often work independently or rent space; income depends entirely on bookings and repeat clients.
- They see daily evidence of how chronic stress, poor posture, and sedentary behavior accumulate in the body — making them practically informed about longevity even if not clinically trained in it.
- Many are exploring biohacking-adjacent services (infrared sauna, lymphatic drainage, red light therapy, cryotherapy) as differentiators.
- They care deeply about client wellbeing but often feel peripheral to the "real" health conversation dominated by medical professionals.
- What genuinely interests them: the science behind recovery modalities they already use, longevity applications of bodywork and stress reduction, ways to educate clients, professional community that includes them.
- Language they use: soft tissue, myofascial, lymphatic, recovery, nervous system regulation, relaxation response, therapeutic touch, modality.
- What earns their attention: being included as a legitimate part of the health professional ecosystem, practical clinical language about what they do, peer recognition.
- What loses them: being talked down to, anything that implies they're outside the "real" health profession, generic pitch language.`,
}

const COACHING: PersonaBriefing = {
  group: 'coaching',
  displayName: 'Health & Life Coaches',
  businessTypeMatches: [
    'Life coach',
    'Life Coach',
    'Health coach',
    'Health Coach',
    'Wellness Coach',
    'Health and Wellness Coach',
    'Health & Wellness Coach',
    'Certified Health Coach',
    'Certified Holistic Health Coach',
    'Health & Nutrition Coach',
    'Executive Coach',
    'Executive Coach & Facilitator',
    'Coach Trainer',
    'Coaching Center',
    'Health consultant',
    'Health Consultant',
    'Educational consultant',
  ],
  context: `You are writing to a health or life coach. Their world:

- They work one-on-one with clients on behavior change, lifestyle optimization, stress management, nutrition, and personal goals.
- Many are IIN (Institute for Integrative Nutrition) graduates or hold similar health coaching certifications; they blend functional nutrition with coaching psychology.
- They operate in a crowded market and differentiate themselves through niche specialization, personal brand, and client outcomes.
- They are sophisticated consumers of health information — they read widely, follow functional medicine thought leaders, and are on top of longevity trends.
- They often feel professionally between worlds: too health-science-focused for mainstream life coaching, too coaching-focused for clinical health professionals.
- Their clients are typically health-motivated adults who are frustrated with conventional medicine and looking for practical lifestyle guidance.
- What genuinely interests them: frameworks they can bring to clients, staying current on longevity science, tools that strengthen their professional value proposition, peer community with other coaches and practitioners.
- Language they use: root cause, functional nutrition, bioindividuality, mindset, behavior change, habit stacking, coaching framework, client transformation.
- What earns their attention: substantive content they can actually use with clients, being treated as a peer professional, community with practitioners who take coaching seriously.
- What loses them: being lumped in with generic wellness influencers, oversimplified health content, anything with a network marketing feel.`,
}

const BEHAVIORAL_HEALTH: PersonaBriefing = {
  group: 'behavioral_health',
  displayName: 'Addiction & Behavioral Health Centers',
  businessTypeMatches: [
    'Addiction treatment center',
    'Mental Hospital',
    'Behavioral health',
    'Mental health',
  ],
  context: `You are writing to a professional at an addiction treatment center or behavioral health facility. Their world:

- They work in intensive care environments — residential treatment, intensive outpatient, detox — helping people recover from substance use disorders and co-occurring mental health conditions.
- Their clients often have severe physiological dysregulation: mitochondrial dysfunction, hormonal disruption, nutritional deficiency, chronic inflammation from years of substance use.
- They are increasingly interested in integrative approaches that address physical healing alongside psychological treatment: nutrition, exercise, sleep, stress regulation.
- They operate in a highly regulated environment with licensing requirements, insurance constraints, and clinical compliance demands.
- They care deeply about outcomes but are subject to enormous systemic pressures and often have limited budgets for ancillary programming.
- What genuinely interests them: evidence-based integrative protocols for recovery, the longevity science of physiological repair, tools for helping clients understand biological healing, peer community with integrative practitioners.
- Language they use: recovery, sobriety, co-occurring, trauma, dual diagnosis, continuum of care, aftercare, relapse prevention, evidence-based.
- What earns their attention: genuine clinical rigor, practical protocols, respect for the complexity of their work.
- What loses them: anything that feels like a sales pitch disguised as clinical education, oversimplified wellness language that ignores the severity of their patient population.`,
}

const ALTERNATIVE_MEDICINE: PersonaBriefing = {
  group: 'alternative_medicine',
  displayName: 'Alternative & Holistic Practitioners',
  businessTypeMatches: [
    'Holistic medicine practitioner',
    'Alternative medicine practitioner',
    'Alternative Medicine',
    'Hypnotherapy service',
    'Hypnotherapy',
    'Homeopath',
    'Craniosacral therapy',
    'Metaphysical supply store',
    'Herb shop',
    'Astrologer',
    'Reiki',
  ],
  context: `You are writing to an alternative or holistic health practitioner. Their world:

- They practice outside or at the edges of conventional medicine — hypnotherapy, homeopathy, energy medicine, craniosacral therapy, herbal medicine, or similar modalities.
- They serve clients who have often been underserved by conventional medicine and are seeking root-cause or whole-person approaches.
- Many have faced professional skepticism from the medical establishment and are sensitive to anything that implies their work lacks scientific legitimacy.
- They tend to have a broad philosophical framework for health — they think systemically and holistically, and they're interested in longevity from a whole-person perspective.
- They're a curious, information-hungry group who reads widely across disciplines — functional medicine, quantum biology, consciousness research, ancient healing traditions.
- What genuinely interests them: bridges between traditional healing wisdom and modern longevity science, community that respects diverse healing modalities, practical tools for their clients.
- Language they use: energetic, vibrational, root cause, whole-person, intuitive, mind-body-spirit, healing intelligence, energetic imbalance.
- What earns their attention: genuine intellectual openness to multiple frameworks, respect for their clinical experience, community with other integrative practitioners.
- What loses them: condescension about their modality, exclusively reductionist scientific framing, anything that feels like it's trying to convert them to a conventional approach.`,
}

const COUNSELING: PersonaBriefing = {
  group: 'counseling',
  displayName: 'Counselors & Therapists',
  businessTypeMatches: [
    'Counselor',
    'Marriage Consultant',
    'Family counselor',
    'Psychospiritual Life Coach',
    'Mental health counselor',
    'Therapist',
  ],
  context: `You are writing to a licensed counselor, therapist, or mental health professional. Their world:

- They work with clients on emotional wellbeing, relationships, trauma, anxiety, depression, life transitions, and personal growth.
- Many are licensed (LPC, LMFT, LCSW) and take clinical ethics very seriously; they're careful about their professional scope.
- They're increasingly aware of the mind-body connection in mental health — the role of inflammation, gut health, hormones, sleep, and movement in psychological wellbeing.
- They are sophisticated clinicians who are skeptical of oversimplification, especially in the mental health space.
- Many are interested in longevity science as it applies to psychological resilience, cognitive aging, and the biology of stress.
- What genuinely interests them: the neuroscience and biology of mental health, tools for helping clients understand how physical health affects mood and cognition, community with practitioners who bridge mental and physical health.
- Language they use: trauma, attachment, resilience, nervous system regulation, window of tolerance, co-regulation, somatic, therapeutic alliance.
- What earns their attention: clinical respect for the complexity of mental health, bridges to biology that are evidence-based, peer community.
- What loses them: wellness-light mental health language, anything that minimizes psychological complexity, sales-forward messaging.`,
}

const NUTRITION: PersonaBriefing = {
  group: 'nutrition',
  displayName: 'Nutritionists & Dietitians',
  businessTypeMatches: [
    'Nutritionist',
    'Dietitian',
    'Dietician',
    'Nutrition',
  ],
  context: `You are writing to a registered dietitian or nutritionist. Their world:

- They provide evidence-based nutritional guidance for health optimization, disease management, weight, athletic performance, or specific conditions.
- RDs are highly credentialed and take the science/evidence distinction very seriously; they're often the most rigorously trained professionals in nutrition and are skeptical of trends.
- Many are increasingly interested in longevity nutrition — time-restricted eating, metabolic flexibility, muscle preservation with aging, mitochondrial nutrition.
- They work with clients who are often confused by contradictory nutrition information and need practical, individualized guidance.
- They bridge between clinical medicine and daily life behavior — a position that is both powerful and often underutilized in healthcare.
- What genuinely interests them: longevity-focused nutrition science, metabolic health research, practical tools for client education, peer community with other nutrition professionals.
- Language they use: macronutrients, micronutrients, metabolic rate, insulin sensitivity, glycemic load, oxidative stress, mitochondrial function, dietary protocol.
- What earns their attention: scientific rigor, peer respect, practical clinical application.
- What loses them: anything that looks like fad nutrition, ignores evidence, or assumes they don't already know the basics.`,
}

const MEDICAL: PersonaBriefing = {
  group: 'medical',
  displayName: 'Medical Professionals',
  businessTypeMatches: [
    'Doctor',
    'Dentist',
    'Dental clinic',
    'Dermatologist',
    'Medical clinic',
    'Medical office',
    'Physiotherapy Center',
    'Physical therapist',
    'Physical Health & Wellness Coach',
    'Medical Esthetician',
  ],
  context: `You are writing to a licensed medical professional — physician, dentist, dermatologist, or physical therapist. Their world:

- They work in conventional medicine or an adjacent clinical field with formal licensure and a patient care focus.
- They are highly educated, evidence-demanding, and appropriately skeptical of claims that lack clinical rigor.
- Many are becoming increasingly interested in longevity and functional medicine — the limitations of conventional "sick care" are frustrating to them, and they see patients aging poorly despite standard-of-care treatment.
- They are time-poor, credential-aware, and treat their clinical identity as central to how they engage with the world.
- What genuinely interests them: evidence-based longevity protocols, preventive health frameworks that complement their clinical practice, peer community with other practitioners who take longevity science seriously.
- Language they use: clinical, evidence-based, protocol, comorbidities, prophylactic, standard of care, differential, mechanism of action.
- What earns their attention: clinical rigor, peer respect, practical frameworks that don't require abandoning their existing practice model.
- What loses them: anything that seems anti-medicine, alternative-medicine language without evidence, generic wellness pitch.`,
}

// ---------------------------------------------------------------------------
// Tier 2: Default — Longevity Enthusiast
// This is the most-used persona. Most contacts have no business type.
// These people are health-interested individuals of unknown background.
// ---------------------------------------------------------------------------

const LONGEVITY_ENTHUSIAST: PersonaBriefing = {
  group: 'default',
  displayName: 'Longevity Enthusiasts (General)',
  businessTypeMatches: [
    'Valid',
    '',
  ],
  context: `You are writing to a health-interested individual whose specific background you don't know. What you do know:

- They've shown interest in longevity, biohacking, or health optimization — enough to have gotten onto a list connected to the bioEDGE or biohacking community.
- They could be a health professional, an entrepreneur, an athlete, a parent trying to age well, or someone who recently had a health wake-up call.
- They're tired of generic wellness content but hungry for real, specific, actionable information about their health.
- They have been marketed to constantly by the wellness industry and have developed a strong filter for anything that sounds like an ad, a funnel, or a mass campaign.
- They respond to: peer voice (someone who cares about the same things they care about), specific and honest language, content that respects their intelligence.
- They do not respond to: "unlock your potential," "transform your health," celebrity-style wellness influencer language, countdown timers, or anything that implies they're broken and need fixing.
- They are probably somewhere on a personal longevity journey — they may have read books, tried protocols, worn a CGM, experimented with fasting, or just started asking questions about why they feel the way they feel.
- What earns their attention: an email that feels like it came from a real person who is working on the same problems they are, offers something genuinely useful or interesting, and doesn't waste their time.
- What loses them immediately: any sentence that could appear in a mass marketing email, hyperbolic language, "I came across your profile" opener, fake urgency.`,
}

// ---------------------------------------------------------------------------
// All personas in order of specificity
// ---------------------------------------------------------------------------
const ALL_PERSONAS: PersonaBriefing[] = [
  CHIROPRACTOR,
  MEDICAL_SPA,
  ACUPUNCTURE,
  FITNESS,
  MARTIAL_ARTS,
  YOGA_PILATES,
  SPA_WELLNESS,
  COACHING,
  BEHAVIORAL_HEALTH,
  ALTERNATIVE_MEDICINE,
  COUNSELING,
  NUTRITION,
  MEDICAL,
  LONGEVITY_ENTHUSIAST,  // default — always last
]

// ---------------------------------------------------------------------------
// Public utilities
// ---------------------------------------------------------------------------

/**
 * Maps a business_type string (from the outreach_contacts table) to a
 * persona group key. Case-insensitive. Returns 'default' if no match.
 */
export function getPersonaGroup(businessType: string | null | undefined): string {
  if (!businessType || businessType.trim() === '' || businessType === 'Valid') {
    return 'default'
  }
  const normalized = businessType.trim().toLowerCase()
  for (const persona of ALL_PERSONAS) {
    if (persona.group === 'default') continue
    for (const match of persona.businessTypeMatches) {
      if (normalized === match.toLowerCase()) {
        return persona.group
      }
    }
  }
  // Fuzzy fallback — partial match on first word
  for (const persona of ALL_PERSONAS) {
    if (persona.group === 'default') continue
    for (const match of persona.businessTypeMatches) {
      if (normalized.includes(match.toLowerCase().split(' ')[0])) {
        return persona.group
      }
    }
  }
  return 'default'
}

/**
 * Returns the PersonaBriefing for a group key.
 */
export function getPersonaBriefing(group: string): PersonaBriefing {
  return ALL_PERSONAS.find((p) => p.group === group) ?? LONGEVITY_ENTHUSIAST
}

/**
 * Given an array of distinct business_type values from the database,
 * returns the distinct persona groups represented and whether the
 * default (untagged) persona will be needed.
 */
export function analyzeBusinessTypes(businessTypes: (string | null)[]): {
  groups: string[]
  hasDefault: boolean
} {
  const groupSet = new Set<string>()
  let hasDefault = false

  for (const bt of businessTypes) {
    const group = getPersonaGroup(bt)
    if (group === 'default') {
      hasDefault = true
    } else {
      groupSet.add(group)
    }
  }

  return {
    groups: Array.from(groupSet),
    hasDefault,
  }
}

/**
 * Returns all personas sorted: practice-type first, default last.
 * Used to populate UI dropdowns and campaign form persona previews.
 */
export function getAllPersonas(): PersonaBriefing[] {
  return ALL_PERSONAS
}
