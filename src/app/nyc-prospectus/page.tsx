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
              <div className="prospectus-hero-detail-label">Setup & VIP Dinner</div>
              <div className="prospectus-hero-detail-value">July 10, 2026</div>
            </div>
            <div className="prospectus-hero-detail">
              <div className="prospectus-hero-detail-label">Main Event</div>
              <div className="prospectus-hero-detail-value">July 11, 2026</div>
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
              <div className="prospectus-audience-percent">75%</div>
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
              <div className="prospectus-audience-percent">25%</div>
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

      {/* Booth Packages Section */}
      <section className="prospectus-booths">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Exhibiting Opportunities</div>
          <h2 className="prospectus-section-title">Booth Packages</h2>
          <p className="prospectus-section-subtitle">
            Connect face-to-face with 750+ high-intent health optimizers and practitioners actively seeking solutions.
          </p>

          <div className="prospectus-booths-grid">
            <div className="prospectus-booth-card">
              <div className="prospectus-booth-header premier">
                <p className="prospectus-booth-tier">8x8 Corner Booth in Prime Location</p>
              </div>
              <div className="prospectus-booth-body">
                <p className="prospectus-booth-price">$5,000</p>
              </div>
            </div>

            <div className="prospectus-booth-card">
              <div className="prospectus-booth-header corner">
                <p className="prospectus-booth-tier">8x8 Corner Booth</p>
              </div>
              <div className="prospectus-booth-body">
                <p className="prospectus-booth-price">$3,500</p>
              </div>
            </div>

            <div className="prospectus-booth-card">
              <div className="prospectus-booth-header table">
                <p className="prospectus-booth-tier">6 Foot Skirted Table</p>
              </div>
              <div className="prospectus-booth-body">
                <p className="prospectus-booth-price">$2,500</p>
              </div>
            </div>
          </div>

          <div className="prospectus-all-exhibitors">
            <p className="prospectus-all-exhibitors-label">All Exhibitors Get</p>
            <ul className="prospectus-all-exhibitors-list">
              <li>1 Skirted 6 Foot Table</li>
              <li>1 Chair</li>
              <li>4 Exhibitor Badges</li>
              <li>Logo on bioedgelongevity.com</li>
            </ul>
          </div>

          <p className="prospectus-booth-note">Additional exhibitor badges: $199 each • Lead retrieval: $400</p>
        </div>
      </section>

      {/* Sponsorship Opportunities */}
      <section className="prospectus-sponsorships">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Sponsorship Opportunities</div>
          <h2 className="prospectus-section-title">Activation Menu</h2>
          <p className="prospectus-section-subtitle">
            Maximize your visibility with exclusive branding opportunities that put your brand in front of every attendee.
          </p>

          {/* Title Sponsor */}
          <div className="prospectus-title-sponsor">
            <p className="prospectus-title-sponsor-label">Exclusive Opportunity</p>
            <p className="prospectus-title-sponsor-name">Title Sponsor</p>
            <p className="prospectus-title-sponsor-price">$100,000</p>
            <p className="prospectus-title-sponsor-desc">
              Premier branding across all event materials, signage, sampling, and communications, including the bioEDGE Longevity Magazine Cover plus centerfold. The ultimate visibility package.
            </p>
          </div>

          {/* Sponsor Categories */}
          <div className="prospectus-sponsor-categories">
            <div className="prospectus-sponsor-category">
              <h3 className="prospectus-sponsor-cat-title">Premier Activations</h3>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">VIP Party Sponsor</span>
                <span className="prospectus-sponsor-price">$15,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Coffee Sponsor</span>
                <span className="prospectus-sponsor-price">$15,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Practitioner Meetup</span>
                <span className="prospectus-sponsor-price">$15,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Swag Bag Sponsor</span>
                <span className="prospectus-sponsor-price">$15,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Pet Zone Sponsor</span>
                <span className="prospectus-sponsor-price">$10,000</span>
              </div>
            </div>

            <div className="prospectus-sponsor-category">
              <h3 className="prospectus-sponsor-cat-title">Brand Visibility</h3>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Main Stage Banner</span>
                <span className="prospectus-sponsor-price">$10,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Expo Hall / Welcome Banner</span>
                <span className="prospectus-sponsor-price">$10,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Badge Sponsor</span>
                <span className="prospectus-sponsor-price">$10,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Internet Sponsor</span>
                <span className="prospectus-sponsor-price">$10,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Step & Repeat</span>
                <span className="prospectus-sponsor-price">$10,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Lanyard Sponsor</span>
                <span className="prospectus-sponsor-price">$5,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Ticket Confirmation Page</span>
                <span className="prospectus-sponsor-price">$5,000</span>
              </div>
            </div>

            <div className="prospectus-sponsor-category">
              <h3 className="prospectus-sponsor-cat-title">Digital & Print</h3>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Program Guide Front Cover</span>
                <span className="prospectus-sponsor-price">$5,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Program Guide Back Cover</span>
                <span className="prospectus-sponsor-price">$3,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Program Guide Inside Cover</span>
                <span className="prospectus-sponsor-price">$2,500</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Program Full Page Ad</span>
                <span className="prospectus-sponsor-price">$2,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Program Half Page Ad</span>
                <span className="prospectus-sponsor-price">$1,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Program 1/4 Page Ad</span>
                <span className="prospectus-sponsor-price">$500</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Newsletter Inclusion</span>
                <span className="prospectus-sponsor-price">$800</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Social Media Post</span>
                <span className="prospectus-sponsor-price">$500</span>
              </div>
            </div>

            <div className="prospectus-sponsor-category">
              <h3 className="prospectus-sponsor-cat-title">On-Site Activations</h3>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Sponsor Reel - 60 Second</span>
                <span className="prospectus-sponsor-price">$2,500</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Dedicated Intro/Pre-Show</span>
                <span className="prospectus-sponsor-price">$2,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Sponsor Reel - 30 Second</span>
                <span className="prospectus-sponsor-price">$1,500</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Bag Stuffer</span>
                <span className="prospectus-sponsor-price">$1,500</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Sponsor Reel - 15 Second</span>
                <span className="prospectus-sponsor-price">$1,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Pull-Up Banner</span>
                <span className="prospectus-sponsor-price">$1,000</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Seat Drops</span>
                <span className="prospectus-sponsor-price">$500</span>
              </div>
              <div className="prospectus-sponsor-item">
                <span className="prospectus-sponsor-name">Registration Area Handouts</span>
                <span className="prospectus-sponsor-price">$500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speaker Opportunities */}
      <section className="prospectus-speaker-opps">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Speaker Opportunities</div>
          <h2 className="prospectus-section-title">Presentation Slots</h2>
          <p className="prospectus-section-subtitle">
            Position your brand as a thought leader with a 25-minute presentation slot on our main stage.
          </p>

          <div className="prospectus-speaker-grid">
            <div className="prospectus-speaker-slot">
              <p className="prospectus-speaker-slot-time">12:00 PM & 1:00 PM</p>
              <p className="prospectus-speaker-slot-tier">Prime Slots</p>
              <p className="prospectus-speaker-slot-price">$5,000</p>
            </div>
            <div className="prospectus-speaker-slot">
              <p className="prospectus-speaker-slot-time">11:00 AM & 3:00 PM</p>
              <p className="prospectus-speaker-slot-tier">Secondary Slots</p>
              <p className="prospectus-speaker-slot-price">$3,000</p>
            </div>
            <div className="prospectus-speaker-slot">
              <p className="prospectus-speaker-slot-time">10AM, 4PM & 5PM</p>
              <p className="prospectus-speaker-slot-tier">Tertiary Slots</p>
              <p className="prospectus-speaker-slot-price">$2,000</p>
            </div>
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
