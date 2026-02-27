import "./nyc-prospectus.css"

/**
 * NYC Prospectus Page
 *
 * Exhibits & Sponsorships prospectus for NYC 2026 event.
 * Metropolitan Pavilion, July 10-11, 2026
 */
export default function NYCProspectusPage() {
  return (
    <div className="prospectus-page">
      {/* Hero Section */}
      <section className="prospectus-hero">
        <div className="prospectus-container">
          <div className="prospectus-logo">
            <span className="prospectus-logo-text">
              <span className="bio">BIO</span>
              <span className="edge">EDGE</span>
            </span>
            <span className="prospectus-logo-subtitle">LONGEVITY SUMMIT</span>
          </div>

          <div className="prospectus-hero-badge">Year 3 • Expanding Nationwide</div>

          <h1 className="prospectus-hero-headline">
            The human body is designed to live 120 years.
          </h1>

          <p className="prospectus-hero-tagline">
            So why's life expectancy 77?
          </p>

          <div className="prospectus-hero-details">
            <div className="prospectus-hero-detail">
              <div className="prospectus-hero-detail-label">Location</div>
              <div className="prospectus-hero-detail-value">NYC Metropolitan Pavilion</div>
            </div>
            <div className="prospectus-hero-detail">
              <div className="prospectus-hero-detail-label">Day 1 — July 10, 2026</div>
              <div className="prospectus-hero-detail-value">2:00 PM – 6:00 PM</div>
              <div className="prospectus-hero-detail-sub">Exhibitor setup 8:00 AM – 1:30 PM</div>
            </div>
            <div className="prospectus-hero-detail">
              <div className="prospectus-hero-detail-label">Day 2 — July 11, 2026</div>
              <div className="prospectus-hero-detail-value">9:00 AM – 5:00 PM</div>
              <div className="prospectus-hero-detail-sub">Breakdown 5:30 PM – 11:00 PM</div>
            </div>
          </div>

          <a href="mailto:peter@bioedgelongevity.com" className="prospectus-hero-cta">
            Reserve Your Spot <span>→</span>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="prospectus-about">
        <div className="prospectus-container">
          <div className="prospectus-about-grid">
            <div className="prospectus-about-text">
              <p className="prospectus-section-label">About the Event</p>
              <h2 className="prospectus-section-title">A Transformational Live Experience</h2>

              <p>
                <strong>bioEDGE Longevity Summit</strong> brings the EDGE Framework to major cities across the USA. After two successful years in Miami, we're expanding to New York City.
              </p>

              <p>
                This isn't another wellness expo. Our attendees are serious health optimizers and clinical practitioners actively seeking evidence-based solutions to extend healthspan.
              </p>
            </div>

            <div className="prospectus-stats-grid">
              <div className="prospectus-stat-card">
                <p className="prospectus-stat-label">Venue</p>
                <p className="prospectus-stat-value venue">Metropolitan Pavilion</p>
                <p className="prospectus-stat-desc">New York City</p>
              </div>
              <div className="prospectus-stat-card gold">
                <p className="prospectus-stat-label">Expected Attendance</p>
                <p className="prospectus-stat-value">750+</p>
                <p className="prospectus-stat-desc">Health optimizers & practitioners</p>
              </div>
              <div className="prospectus-stat-card pink">
                <p className="prospectus-stat-label">Exhibit Spaces</p>
                <p className="prospectus-stat-value">50</p>
                <p className="prospectus-stat-desc">Premier, Corner & Table options</p>
              </div>
              <div className="prospectus-stat-card">
                <p className="prospectus-stat-label">Speakers</p>
                <p className="prospectus-stat-value">50</p>
                <p className="prospectus-stat-desc">Industry experts & practitioners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Attends Section */}
      <section className="prospectus-section">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Who Attends</div>
          <h2 className="prospectus-section-title">High-Intent Buyers & Decision Makers</h2>
          <p className="prospectus-section-subtitle">
            Our attendees aren't browsers—they're buyers actively seeking the next solution for their health journey.
          </p>

          <div className="prospectus-audience-grid">
            <div className="prospectus-audience-card optimizers">
              <div className="prospectus-audience-percent">50%</div>
              <div className="prospectus-audience-type">Health Optimizers</div>
              <p className="prospectus-audience-desc">
                Status-driven high performers who view their biology as a strategic asset. These are executives, founders, and professionals who invest significantly in their health and make fast purchasing decisions.
              </p>
              <div className="prospectus-audience-tags">
                <span className="prospectus-audience-tag">High Purchase Intent</span>
                <span className="prospectus-audience-tag">Decision Makers</span>
                <span className="prospectus-audience-tag">Early Adopters</span>
                <span className="prospectus-audience-tag">High Net Worth</span>
              </div>
            </div>
            <div className="prospectus-audience-card practitioners">
              <div className="prospectus-audience-percent">50%</div>
              <div className="prospectus-audience-type">Clinical Practitioners</div>
              <p className="prospectus-audience-desc">
                Licensed healthcare providers seeking advanced protocols and technologies for their practices.
              </p>
              <div className="prospectus-audience-tags">
                <span className="prospectus-audience-tag">MDs & DOs</span>
                <span className="prospectus-audience-tag">Nurse Practitioners</span>
                <span className="prospectus-audience-tag">Chiropractors</span>
                <span className="prospectus-audience-tag">Acupuncturists</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Section */}
      <section className="prospectus-opportunity">
        <div className="prospectus-container">
          <div className="prospectus-section-label">The Opportunity</div>
          <h2 className="prospectus-section-title white">The Business of Living Longer</h2>
          <p className="prospectus-section-subtitle white">
            The longevity economy is booming. From health tech and biotech to wellness and personalized medicine, investors and consumers are betting big on extending healthspan.
          </p>

          <div className="prospectus-market-stats">
            <div className="prospectus-market-stat">
              <a href="https://www.ubs.com/global/en/wealthmanagement/insights/chief-investment-office/house-view/daily/2025/latest-28032025.html" target="_blank" rel="noopener noreferrer" className="prospectus-market-stat-link">
                <div className="prospectus-market-stat-value">$8T</div>
                <div className="prospectus-market-stat-label">Longevity Spending by 2030</div>
                <p className="prospectus-market-stat-desc">UBS projection</p>
              </a>
            </div>
            <div className="prospectus-market-stat">
              <a href="https://www.wsj.com/health/wellness/billionaires-longevity-health-04dd205c" target="_blank" rel="noopener noreferrer" className="prospectus-market-stat-link">
                <div className="prospectus-market-stat-value">$5B+</div>
                <div className="prospectus-market-stat-label">Billionaire Investment</div>
                <p className="prospectus-market-stat-desc">In longevity startups</p>
              </a>
            </div>
            <div className="prospectus-market-stat">
              <a href="https://www.medicaleconomics.com/view/as-the-world-and-the-nation-get-older-investments-in-longevity-hold-opportunity" target="_blank" rel="noopener noreferrer" className="prospectus-market-stat-link">
                <div className="prospectus-market-stat-value">50%</div>
                <div className="prospectus-market-stat-label">65+ Population Growth</div>
                <p className="prospectus-market-stat-desc">By 2030 in the U.S.</p>
              </a>
            </div>
          </div>

          <p className="prospectus-section-label" style={{ textAlign: 'center', marginBottom: '20px' }}>Industries We Serve</p>
          <div className="prospectus-industries">
            <span className="prospectus-industry-tag">Diagnostics & Testing</span>
            <span className="prospectus-industry-tag">Energy & Light Therapy</span>
            <span className="prospectus-industry-tag">Environment</span>
            <span className="prospectus-industry-tag">Fitness</span>
            <span className="prospectus-industry-tag">Mind & Neurotech</span>
            <span className="prospectus-industry-tag">Recovery</span>
            <span className="prospectus-industry-tag">Sleep Technology</span>
            <span className="prospectus-industry-tag">Supplements & Compounds</span>
            <span className="prospectus-industry-tag">Wearables & Monitoring</span>
          </div>
        </div>
      </section>

      {/* Pricing Guide */}
      <section className="prospectus-pricing">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Investment</div>
          <h2 className="prospectus-section-title">Complete Pricing Guide</h2>
          <p className="prospectus-section-subtitle">
            All opportunities available for NYC 2026. Contact us to reserve or bundle.
          </p>

          <div className="prospectus-pricing-grid">

            {/* Magazine & Mailer */}
            <div className="prospectus-pricing-category">
              <h3 className="prospectus-pricing-cat-title">Magazine & Mailer</h3>
              <div className="prospectus-pricing-items">
                {[
                  { name: "Front Cover Feature", price: "$6,500", desc: "Positions your brand alongside the leaders and chief scientists shaping longevity." },
                  { name: "Back Cover Advertisement", price: "$4,000", desc: "Highly viewed exterior surface. Maximum exposure during distribution and display." },
                  { name: "Inside Front Cover Advertisement", price: "$2,000", desc: "Seen before any editorial content, capturing attention at peak reader engagement." },
                  { name: "Inside Back Cover Advertisement", price: "$2,000", desc: "High-visibility closing position for lasting recall as readers finish each issue." },
                  { name: "Envelope Logo Placement", price: "$2,000", desc: "Logo on the mailing envelope. Brand visibility before the magazine is even opened." },
                  { name: "Magazine Bag Stuffer", price: "$1,000", desc: "Insert into the clinic mailer alongside each issue. Max 8.5×11″. Samples welcome." },
                  { name: "Full-Page Advertisement", price: "$1,000", desc: "Maximum visual real estate reaching practitioners across 2,000+ clinic distribution points." },
                  { name: "Native Article Placement", price: "$1,000", desc: "One-page editorial in the bioEDGE voice, distributed to 2,000+ longevity clinics." },
                  { name: "Half-Page Advertisement", price: "$750", desc: "Targeted visibility to the longevity clinic network. Ideal for launches and brand awareness." },
                  { name: "Quarter-Page Advertisement", price: "$500", desc: "Efficient placement for directory listings or supporting a larger editorial presence." },
                  { name: "Local Directory Listing", price: "$200", desc: "Curated listing with company name, category, location, and contact. 2,000+ clinic reach." },
                ].map((item) => (
                  <div key={item.name} className="prospectus-pricing-item">
                    <div className="prospectus-pricing-item-info">
                      <div className="prospectus-pricing-item-name">{item.name}</div>
                      <div className="prospectus-pricing-item-desc">{item.desc}</div>
                    </div>
                    <div className="prospectus-pricing-item-price">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summit Sponsorships */}
            <div className="prospectus-pricing-category">
              <h3 className="prospectus-pricing-cat-title">Sponsorships</h3>
              <div className="prospectus-pricing-items">
                {[
                  { name: "Main Stage Presenting Sponsorship", price: "$15,000", desc: "Venue-wide branding, stage recognition, and association with all keynote content." },
                  { name: "Expo Hall / Welcome Banner Sponsorship", price: "$12,000", desc: "First branded surface attendees see upon entry. Anchors the experience." },
                  { name: "Practitioner Meetup Sponsorship", price: "$10,000", desc: "Curated networking session for longevity clinicians and functional medicine providers." },
                  { name: "Coffee Sponsorship", price: "$10,000", desc: "Brand presence at the highest-traffic touchpoint. Every coffee break, every conversation." },
                  { name: "Bag Sponsorship", price: "$10,000", desc: "Your brand on every attendee tote. Visibility throughout the event and beyond." },
                  { name: "VIP Lounge Sponsorship", price: "$10,000", desc: "Premium gathering space for top-tier attendees, speakers, and practitioners." },
                  { name: "Badge Sponsorship", price: "$5,000", desc: "Your logo on every badge. Consistent exposure during every introduction and interaction." },
                  { name: "Internet / WiFi Sponsorship", price: "$5,000", desc: "Your brand on the network name and login page seen by every connected attendee." },
                  { name: "Ticket Confirmation Email Sponsorship", price: "$5,000", desc: "Exclusive placement in the ticket confirmation email. High open-rate, opted-in audience." },
                  { name: "Lanyard Sponsorship", price: "$2,000", desc: "Your brand on every lanyard worn by 750+ attendees." },
                  { name: "Newsletter Sponsorship", price: "$500", desc: "Sponsored placement in the bioEDGE newsletter. Content-adjacent, trusted environment." },
                  { name: "Social Media Post – Sponsored", price: "$500", desc: "Dedicated sponsored post reaching the broader bioEDGE audience." },
                  { name: "Sponsor Reel – 15-Second Spot", price: "$500", desc: "15-second branded spot on main stage screens between sessions." },
                  { name: "Seat Drop", price: "$500", desc: "Branded materials on every seat before sessions begin. First thing attendees see." },
                  { name: "Summit Bag Stuffer", price: "$500", desc: "Direct-to-hand insert in every attendee bag. Max 8.5×11″. Samples welcome." },
                  { name: "Lead Retrieval System", price: "$400", desc: "Digital lead capture with QR and scan capability for post-event follow-up." },
                ].map((item) => (
                  <div key={item.name} className="prospectus-pricing-item">
                    <div className="prospectus-pricing-item-info">
                      <div className="prospectus-pricing-item-name">{item.name}</div>
                      <div className="prospectus-pricing-item-desc">{item.desc}</div>
                    </div>
                    <div className="prospectus-pricing-item-price">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summit Exhibitions */}
            <div className="prospectus-pricing-category">
              <h3 className="prospectus-pricing-cat-title">Exhibition Spaces</h3>
              <div className="prospectus-pricing-items">
                {[
                  { name: "Premier Front Corner Booth", price: "$5,000", desc: "Highest-traffic position. Corner placement with visibility from multiple entry points." },
                  { name: "Premier Front Inline Booth", price: "$3,500", desc: "Premier front inline. Strong foot traffic with dedicated display area." },
                  { name: "Center Inline Booth", price: "$3,000", desc: "Solid attendee flow. Well-suited for demos and practitioner engagement." },
                  { name: "8-Foot Table – Premier Front", price: "$3,000", desc: "Streamlined table presence in the highest-traffic zone of the expo hall." },
                  { name: "8-Foot Table – Center", price: "$2,500", desc: "Consistent attendee access. Well-suited for sampling and demos." },
                  { name: "Rear Inline Booth", price: "$2,000", desc: "Dedicated expo presence. Strategic entry point for first-time summit exhibitors." },
                  { name: "8-Foot Table – Rear", price: "$2,000", desc: "Accessible table presence at an approachable investment level." },
                ].map((item) => (
                  <div key={item.name} className="prospectus-pricing-item">
                    <div className="prospectus-pricing-item-info">
                      <div className="prospectus-pricing-item-name">{item.name}</div>
                      <div className="prospectus-pricing-item-desc">{item.desc}</div>
                    </div>
                    <div className="prospectus-pricing-item-price">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Store NYC + Video Content stacked */}
            <div className="prospectus-pricing-category-stack">
              <div className="prospectus-pricing-category">
                <h3 className="prospectus-pricing-cat-title">On-Site Store</h3>
                <div className="prospectus-pricing-items">
                  {[
                    { name: "Branded Face-Out Display", price: "$3,000", desc: "Fully branded face-out display. Maximum shelf visibility for high-intent attendees." },
                    { name: "Single Shelf Display", price: "$500", desc: "Dedicated shelf in a curated retail environment. 750+ health optimizers over two days." },
                    { name: "Literature Rack Placement", price: "$250", desc: "Brochures or sell sheets placed where attendees actively browse solutions." },
                  ].map((item) => (
                    <div key={item.name} className="prospectus-pricing-item">
                      <div className="prospectus-pricing-item-info">
                        <div className="prospectus-pricing-item-name">{item.name}</div>
                        <div className="prospectus-pricing-item-desc">{item.desc}</div>
                      </div>
                      <div className="prospectus-pricing-item-price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="prospectus-pricing-category" style={{ marginTop: '24px' }}>
                <h3 className="prospectus-pricing-cat-title">Video Content</h3>
                <div className="prospectus-pricing-items">
                  {[
                    { name: "Professional Exhibitor Interview", price: "$1,000", desc: "On-site video interview capturing your brand story and product highlights for your channels." },
                    { name: "Professional Testimonial Interview", price: "$500", desc: "Structured testimonial interviews filmed on-site and delivered as brand-ready content." },
                  ].map((item) => (
                    <div key={item.name} className="prospectus-pricing-item">
                      <div className="prospectus-pricing-item-info">
                        <div className="prospectus-pricing-item-name">{item.name}</div>
                        <div className="prospectus-pricing-item-desc">{item.desc}</div>
                      </div>
                      <div className="prospectus-pricing-item-price">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summit Speaking */}
            <div className="prospectus-pricing-category">
              <h3 className="prospectus-pricing-cat-title">Speaking Slots</h3>
              <div className="prospectus-pricing-items">
                {[
                  { name: "Saturday Prime Speaking Slot (12pm or 1pm)", price: "$5,000", desc: "Peak-attendance Saturday slot. Ideal for keynotes and signature thought leadership." },
                  { name: "Saturday Secondary Speaking Slot (11am or 3pm)", price: "$3,000", desc: "Strong Saturday position flanking prime hours. High practitioner attendance." },
                  { name: "Saturday Tertiary Speaking Slot (10am or 4pm)", price: "$2,000", desc: "Saturday bookend slot reaching early arrivals and closing-session attendees." },
                  { name: "Friday Speaking Slot (3pm, 4pm, 5pm, or 6pm)", price: "$2,000", desc: "Friday afternoon main stage slot. 750+ health optimization practitioners and consumers." },
                ].map((item) => (
                  <div key={item.name} className="prospectus-pricing-item">
                    <div className="prospectus-pricing-item-info">
                      <div className="prospectus-pricing-item-name">{item.name}</div>
                      <div className="prospectus-pricing-item-desc">{item.desc}</div>
                    </div>
                    <div className="prospectus-pricing-item-price">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summit Program Guide */}
            <div className="prospectus-pricing-category">
              <h3 className="prospectus-pricing-cat-title">Summit Program Guide</h3>
              <div className="prospectus-pricing-items">
                {[
                  { name: "Front Cover Feature", price: "$5,000", desc: "Your brand defines the visual identity of the official event publication." },
                  { name: "Back Cover", price: "$3,000", desc: "Highly visible exterior surface of the program guide. Seen by all attendees." },
                  { name: "Inside Back Cover", price: "$2,000", desc: "High-visibility closing position as attendees reference schedules and exhibitors." },
                  { name: "Inside Front Cover", price: "$2,000", desc: "First advertising position seen when every attendee opens the program guide." },
                  { name: "Full-Page Ad", price: "$1,000", desc: "Full-page with premium editorial adjacency in the official event publication." },
                  { name: "Half-Page Ad", price: "$750", desc: "Half-page in the definitive event reference distributed to all 750+ attendees." },
                  { name: "Quarter-Page Ad", price: "$500", desc: "Quarter-page in the program guide held by every attendee." },
                ].map((item) => (
                  <div key={item.name} className="prospectus-pricing-item">
                    <div className="prospectus-pricing-item-info">
                      <div className="prospectus-pricing-item-name">{item.name}</div>
                      <div className="prospectus-pricing-item-desc">{item.desc}</div>
                    </div>
                    <div className="prospectus-pricing-item-price">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="prospectus-pricing-cta">
            <a href="mailto:peter@bioedgelongevity.com" className="prospectus-hero-cta">
              Reserve Your Opportunity <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="prospectus-testimonials">
        <div className="prospectus-container">
          <div className="prospectus-section-label">What People Say</div>
          <h2 className="prospectus-section-title">From Past Events</h2>

          <div className="prospectus-testimonials-grid">
            <div className="prospectus-testimonial-card">
              <p className="prospectus-testimonial-quote">
                "I had the pleasure of attending the Biohacker Expo organized by Sandy Martin, and it was nothing short of outstanding. The event was impeccably organized, featuring a roster of amazing thought leaders... What truly made this event special was Sandy. Her professionalism and warmth created an unforgettable experience for all involved."
              </p>
              <div className="prospectus-testimonial-author">
                <div className="prospectus-testimonial-avatar">CP</div>
                <div>
                  <p className="prospectus-testimonial-name">Dr. Christopher Palmer, MD</p>
                  <p className="prospectus-testimonial-role">Psychiatrist & Researcher</p>
                </div>
              </div>
            </div>

            <div className="prospectus-testimonial-card">
              <p className="prospectus-testimonial-quote">
                "At last year's Biohacker Expo, with the support of the enthusiastic crowd there, we officially launched our new book 'Lies I Taught in Medical School' to become a New York Times Bestseller! I wouldn't miss this year's event with the unusual combination of fascinating and useful information presented in a celebratory and fun environment!"
              </p>
              <div className="prospectus-testimonial-author">
                <div className="prospectus-testimonial-avatar">RL</div>
                <div>
                  <p className="prospectus-testimonial-name">Dr. Robert Lufkin, MD</p>
                  <p className="prospectus-testimonial-role">Medical School Professor</p>
                </div>
              </div>
            </div>

            <div className="prospectus-testimonial-card">
              <p className="prospectus-testimonial-quote">
                "The event was an excellent opportunity to educate on the connection between red light therapy and the gut-brain axis... The Expo enabled me to forge valuable connections, engage in meaningful dialogues, and explore cutting-edge advancements. I am already looking forward to next year's event."
              </p>
              <div className="prospectus-testimonial-author">
                <div className="prospectus-testimonial-avatar">ST</div>
                <div>
                  <p className="prospectus-testimonial-name">Sarah Turner</p>
                  <p className="prospectus-testimonial-role">CEO & Co-Founder, CeraThrive LLC</p>
                </div>
              </div>
            </div>

            <div className="prospectus-testimonial-card">
              <p className="prospectus-testimonial-quote">
                "It was an honor to speak at the Biohacker Expo. Sandy brought the best speakers in the biohacking space, and incredible vendors. I loved the intimate touch of being able to connect with my audience in person during my book signings. The connections and friendships I made from this event are invaluable!"
              </p>
              <div className="prospectus-testimonial-author">
                <div className="prospectus-testimonial-avatar">BA</div>
                <div>
                  <p className="prospectus-testimonial-name">Ben Azadi</p>
                  <p className="prospectus-testimonial-role">Author & Health Expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="prospectus-leadership">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Leadership</div>
          <h2 className="prospectus-section-title">Meet Our Team</h2>
          <p className="prospectus-section-subtitle">
            bioEDGE Longevity is led by proven event producers with combined 40+ years of experience building large, engaging conferences.
          </p>

          <div className="prospectus-leaders-grid">
            <div className="prospectus-leader-card sandy">
              <div className="prospectus-leader-header">
                <div className="prospectus-leader-avatar sandy">SM</div>
                <div>
                  <p className="prospectus-leader-name">Sandy Martin</p>
                  <p className="prospectus-leader-role">Founder</p>
                </div>
              </div>
              <p className="prospectus-leader-bio">
                Before entering the longevity space, Sandy spent 15 years producing large-scale comic cons like Supercon and GalaxyCon drawing more than 50,000 attendees to each one. After a health crisis from mold exposure led to a $97,000 recovery journey, she founded bioEDGE to help others navigate the longevity landscape.
              </p>
              <div className="prospectus-leader-highlight">
                <p className="prospectus-leader-highlight-label">Author</p>
                <p className="prospectus-leader-highlight-value">
                  <a href="https://www.amazon.com/dp/B0GJQ5NDGF" target="_blank" rel="noopener noreferrer">Biological EDGE: A Practical Guide to Longevity</a>
                </p>
                <p className="prospectus-leader-highlight-value">
                  <a href="https://www.amazon.com/dp/B0F9VZHVY3" target="_blank" rel="noopener noreferrer">Biohacking Starts with NO: A Radical Guide to Longevity</a>
                </p>
              </div>
            </div>

            <div className="prospectus-leader-card peter">
              <div className="prospectus-leader-header">
                <div className="prospectus-leader-avatar peter">PK</div>
                <div>
                  <p className="prospectus-leader-name">Peter Katz</p>
                  <p className="prospectus-leader-role">President</p>
                </div>
              </div>
              <p className="prospectus-leader-bio">
                Peter is a lifelong distance runner with multiple marathons under his belt. His professional track record lies in crossing the chasm—when he entered the comic con industry over 20 years ago, it was niche. Through leadership at Wizard World, Fan Expo, and GalaxyCon, he has connected over a million fans with their heroes.
              </p>
              <div className="prospectus-leader-highlight">
                <p className="prospectus-leader-highlight-label">Expertise</p>
                <p className="prospectus-leader-highlight-value">Event Scaling • Operations • Strategic Growth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="prospectus-cta" id="contact">
        <div className="prospectus-container">
          <h2 className="prospectus-cta-title">Secure Your Position</h2>
          <p className="prospectus-cta-subtitle">
            Booth spaces and sponsorships are limited. Connect with 750+ high-intent health optimizers in NYC.
          </p>
          <div className="prospectus-cta-buttons">
            <a href="mailto:peter@bioedgelongevity.com" className="prospectus-cta-button primary">
              Reserve Your Spot →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="prospectus-footer">
        <div className="prospectus-container">
          <div className="prospectus-logo" style={{ marginBottom: '20px' }}>
            <span className="prospectus-logo-text">
              <span className="bio">BIO</span>
              <span className="edge">EDGE</span>
            </span>
            <span className="prospectus-logo-subtitle">LONGEVITY SUMMIT</span>
          </div>
          <p>NYC Metropolitan Pavilion • July 10-11, 2026</p>
          <p>© {new Date().getFullYear()} bioEDGE Longevity LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export const metadata = {
  title: "NYC 2026 Exhibits & Sponsorships | bioEDGE Longevity Summit",
  description: "Partner with bioEDGE Longevity Summit NYC 2026. Booth packages, sponsorship opportunities, and speaker slots available. Connect with 750+ motivated longevity consumers at Metropolitan Pavilion.",
}
