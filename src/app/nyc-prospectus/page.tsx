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
          <div className="prospectus-hero-badge">Exhibits & Sponsorships</div>

          <div className="prospectus-logo">
            <span className="prospectus-logo-text">
              <span className="bio">BIO</span>
              <span className="edge">EDGE</span>
            </span>
            <span className="prospectus-logo-subtitle">LONGEVITY SUMMIT</span>
          </div>

          <h1 className="prospectus-hero-headline">
            NYC 2026
          </h1>

          <p className="prospectus-hero-tagline">
            Partner With Us to Reach the Longevity Consumer
          </p>

          <div className="prospectus-hero-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', maxWidth: '600px', margin: '0 auto' }}>
            <div className="prospectus-hero-detail">
              <div className="prospectus-hero-detail-value">📍 Metropolitan Pavilion</div>
            </div>
            <div className="prospectus-hero-detail">
              <div className="prospectus-hero-detail-value">📅 July 10-11, 2026</div>
            </div>
            <div className="prospectus-hero-detail">
              <div className="prospectus-hero-detail-value">🎟️ 500+ Attendees</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="prospectus-about">
        <div className="prospectus-container">
          <div className="prospectus-about-grid">
            <div className="prospectus-about-text">
              <p>
                bioEDGE Longevity Summit is a transformational health experience designed specifically for health-conscious consumers who want to optimize their healthspan and lifespan.
              </p>
              <p>
                Unlike clinical conferences, our events connect longevity brands directly with motivated consumers actively seeking cutting-edge health solutions. Attendees arrive ready to learn, engage, and invest in their longevity journey.
              </p>
            </div>

            <div className="prospectus-stats-row">
              <div className="prospectus-stat-item">
                <div className="prospectus-stat-value">500+</div>
                <div className="prospectus-stat-label">Expected Attendees</div>
              </div>
              <div className="prospectus-stat-item">
                <div className="prospectus-stat-value">30+</div>
                <div className="prospectus-stat-label">Expert Speakers</div>
              </div>
              <div className="prospectus-stat-item">
                <div className="prospectus-stat-value">2</div>
                <div className="prospectus-stat-label">Full Days</div>
              </div>
              <div className="prospectus-stat-item">
                <div className="prospectus-stat-value">20+</div>
                <div className="prospectus-stat-label">Exhibitors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Attends Section */}
      <section className="prospectus-section">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Audience</div>
          <h2 className="prospectus-section-title">Who Attends</h2>
          <p className="prospectus-section-subtitle">
            Our audience consists of high-intent consumers actively seeking longevity solutions
          </p>

          <div className="prospectus-audience-grid">
            <div className="prospectus-audience-card optimizers">
              <div className="prospectus-audience-percent">75%</div>
              <div className="prospectus-audience-type">Health Optimizers</div>
              <p className="prospectus-audience-desc">
                Affluent consumers actively investing in their health. Interested in supplements, diagnostics, therapeutics, biohacking tools, and longevity services.
              </p>
            </div>
            <div className="prospectus-audience-card practitioners">
              <div className="prospectus-audience-percent">25%</div>
              <div className="prospectus-audience-type">Clinical Practitioners</div>
              <p className="prospectus-audience-desc">
                Physicians, health coaches, and wellness practitioners seeking to expand their longevity practice offerings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity Section */}
      <section className="prospectus-opportunity">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Market</div>
          <h2 className="prospectus-section-title">The Opportunity</h2>
          <p className="prospectus-section-subtitle">
            The longevity market is experiencing unprecedented growth
          </p>

          <div className="prospectus-market-stats">
            <div className="prospectus-market-stat">
              <div className="prospectus-market-stat-value">$44B</div>
              <div className="prospectus-market-stat-label">Current Market</div>
              <p className="prospectus-market-stat-desc">Global longevity market size in 2024</p>
            </div>
            <div className="prospectus-market-stat">
              <div className="prospectus-market-stat-value">$193B</div>
              <div className="prospectus-market-stat-label">Projected by 2034</div>
              <p className="prospectus-market-stat-desc">Expected market size within a decade</p>
            </div>
            <div className="prospectus-market-stat">
              <div className="prospectus-market-stat-value">16%</div>
              <div className="prospectus-market-stat-label">Annual Growth</div>
              <p className="prospectus-market-stat-desc">Compound annual growth rate (CAGR)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booth Packages Section */}
      <section className="prospectus-section">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Exhibit</div>
          <h2 className="prospectus-section-title">Booth Packages</h2>
          <p className="prospectus-section-subtitle">
            Connect directly with motivated longevity consumers
          </p>

          <div className="prospectus-packages-grid">
            <div className="prospectus-package-card featured">
              <div className="prospectus-package-badge">Most Popular</div>
              <div className="prospectus-package-name">Premium Booth</div>
              <div className="prospectus-package-price">$5,000</div>
              <ul className="prospectus-package-features">
                <li>10' x 10' prime floor space</li>
                <li>Premium corner or entrance location</li>
                <li>6' draped table + 2 chairs</li>
                <li>Company listing on event website</li>
                <li>4 exhibitor passes (2-day access)</li>
                <li>Logo on event signage</li>
                <li>Lead capture tools</li>
                <li>Priority booth selection</li>
              </ul>
            </div>

            <div className="prospectus-package-card">
              <div className="prospectus-package-name">Standard Booth</div>
              <div className="prospectus-package-price">$3,500</div>
              <ul className="prospectus-package-features">
                <li>10' x 10' floor space</li>
                <li>6' draped table + 2 chairs</li>
                <li>Company listing on event website</li>
                <li>3 exhibitor passes (2-day access)</li>
                <li>Standard signage placement</li>
                <li>Lead capture tools</li>
              </ul>
            </div>

            <div className="prospectus-package-card">
              <div className="prospectus-package-name">Tabletop Display</div>
              <div className="prospectus-package-price">$2,500</div>
              <ul className="prospectus-package-features">
                <li>6' tabletop space (shared area)</li>
                <li>2 chairs</li>
                <li>Company listing on event website</li>
                <li>2 exhibitor passes (2-day access)</li>
                <li>Perfect for startups & services</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Opportunities */}
      <section className="prospectus-opportunity">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Sponsor</div>
          <h2 className="prospectus-section-title">Sponsorship Opportunities</h2>
          <p className="prospectus-section-subtitle">
            Elevate your brand with premium visibility and engagement
          </p>

          {/* Title Sponsor */}
          <div className="prospectus-sponsor-highlight">
            <div className="prospectus-sponsor-highlight-badge">Exclusive</div>
            <h3 className="prospectus-sponsor-highlight-title">Title Sponsor</h3>
            <div className="prospectus-sponsor-highlight-price">$100,000</div>
            <div className="prospectus-sponsor-highlight-grid">
              <div className="prospectus-sponsor-benefit">
                <span className="benefit-icon">🎤</span>
                <span>Keynote speaking slot (30 min)</span>
              </div>
              <div className="prospectus-sponsor-benefit">
                <span className="benefit-icon">🏷️</span>
                <span>"Presented by [Your Brand]" naming rights</span>
              </div>
              <div className="prospectus-sponsor-benefit">
                <span className="benefit-icon">📍</span>
                <span>Premium 20' x 20' booth space</span>
              </div>
              <div className="prospectus-sponsor-benefit">
                <span className="benefit-icon">🎟️</span>
                <span>20 VIP passes + private reception</span>
              </div>
              <div className="prospectus-sponsor-benefit">
                <span className="benefit-icon">📧</span>
                <span>Full attendee list access</span>
              </div>
              <div className="prospectus-sponsor-benefit">
                <span className="benefit-icon">🎬</span>
                <span>Custom video content production</span>
              </div>
            </div>
          </div>

          {/* Other Sponsorships */}
          <div className="prospectus-sponsors-grid">
            <div className="prospectus-sponsor-card">
              <div className="prospectus-sponsor-name">Lunch Sponsor</div>
              <div className="prospectus-sponsor-price">$25,000</div>
              <p className="prospectus-sponsor-desc">
                Branded lunch experience with signage, napkins, and 5-minute welcome remarks to all attendees.
              </p>
            </div>
            <div className="prospectus-sponsor-card">
              <div className="prospectus-sponsor-name">Coffee Lounge</div>
              <div className="prospectus-sponsor-price">$15,000</div>
              <p className="prospectus-sponsor-desc">
                Exclusive branding of the networking coffee area with logo cups, signage, and sampling opportunity.
              </p>
            </div>
            <div className="prospectus-sponsor-card">
              <div className="prospectus-sponsor-name">Wellness Lounge</div>
              <div className="prospectus-sponsor-price">$20,000</div>
              <p className="prospectus-sponsor-desc">
                Create a branded wellness experience zone for demos, treatments, or consultations.
              </p>
            </div>
            <div className="prospectus-sponsor-card">
              <div className="prospectus-sponsor-name">Lanyard Sponsor</div>
              <div className="prospectus-sponsor-price">$10,000</div>
              <p className="prospectus-sponsor-desc">
                Your logo on every attendee lanyard—maximum visibility throughout the event.
              </p>
            </div>
            <div className="prospectus-sponsor-card">
              <div className="prospectus-sponsor-name">Swag Bag Sponsor</div>
              <div className="prospectus-sponsor-price">$7,500</div>
              <p className="prospectus-sponsor-desc">
                Include your product sample or promotional item in every attendee welcome bag.
              </p>
            </div>
            <div className="prospectus-sponsor-card">
              <div className="prospectus-sponsor-name">App Sponsor</div>
              <div className="prospectus-sponsor-price">$12,000</div>
              <p className="prospectus-sponsor-desc">
                Prominent branding in the event mobile app with push notification capability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Speaker Opportunities */}
      <section className="prospectus-section">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Speak</div>
          <h2 className="prospectus-section-title">Speaker Opportunities</h2>
          <p className="prospectus-section-subtitle">
            Position your brand as a thought leader in longevity
          </p>

          <div className="prospectus-speaker-grid">
            <div className="prospectus-speaker-card">
              <div className="prospectus-speaker-duration">45 min</div>
              <div className="prospectus-speaker-type">Breakout Session</div>
              <div className="prospectus-speaker-price">$15,000</div>
              <p className="prospectus-speaker-desc">
                Present your research, case studies, or methodology to a focused audience in a dedicated breakout room.
              </p>
              <ul className="prospectus-speaker-includes">
                <li>Standard booth included</li>
                <li>Session recording rights</li>
                <li>2 VIP passes</li>
              </ul>
            </div>
            <div className="prospectus-speaker-card featured">
              <div className="prospectus-speaker-badge">High Impact</div>
              <div className="prospectus-speaker-duration">20 min</div>
              <div className="prospectus-speaker-type">Main Stage Presentation</div>
              <div className="prospectus-speaker-price">$25,000</div>
              <p className="prospectus-speaker-desc">
                Address the full audience from the main stage. Maximum visibility and thought leadership positioning.
              </p>
              <ul className="prospectus-speaker-includes">
                <li>Premium booth included</li>
                <li>Full video production</li>
                <li>4 VIP passes</li>
                <li>Social media promotion</li>
              </ul>
            </div>
            <div className="prospectus-speaker-card">
              <div className="prospectus-speaker-duration">60 min</div>
              <div className="prospectus-speaker-type">Workshop</div>
              <div className="prospectus-speaker-price">$20,000</div>
              <p className="prospectus-speaker-desc">
                Lead an interactive, hands-on workshop. Perfect for product demonstrations or educational deep-dives.
              </p>
              <ul className="prospectus-speaker-includes">
                <li>Standard booth included</li>
                <li>Workshop recording rights</li>
                <li>3 VIP passes</li>
                <li>Branded materials</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="prospectus-testimonials">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Results</div>
          <h2 className="prospectus-section-title">What Partners Say</h2>

          <div className="prospectus-testimonials-grid">
            <div className="prospectus-testimonial-card">
              <p className="prospectus-testimonial-quote">
                "Our booth was constantly engaged. The quality of conversations and leads exceeded any other health conference we've exhibited at."
              </p>
              <div className="prospectus-testimonial-author">
                <div className="prospectus-testimonial-name">— Previous Exhibitor</div>
              </div>
            </div>
            <div className="prospectus-testimonial-card">
              <p className="prospectus-testimonial-quote">
                "The audience is unlike any other event—they're educated, motivated, and ready to invest in their longevity."
              </p>
              <div className="prospectus-testimonial-author">
                <div className="prospectus-testimonial-name">— Supplement Brand Sponsor</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="prospectus-leadership">
        <div className="prospectus-container">
          <div className="prospectus-section-label">Team</div>
          <h2 className="prospectus-section-title">Event Leadership</h2>

          <div className="prospectus-leaders-grid">
            <div className="prospectus-leader-card">
              <div className="prospectus-leader-header">
                <div className="prospectus-leader-info">
                  <h3 className="prospectus-leader-name">Sandy Martin</h3>
                  <p className="prospectus-leader-role">Founder & Host</p>
                </div>
              </div>
              <div className="prospectus-leader-bio">
                <p>
                  Sandy is the creator of bioEDGE and a leading voice in consumer longevity education. With a background in biotechnology and a passion for democratizing healthspan science, she designed the EDGE Framework to make longevity actionable for everyone.
                </p>
              </div>
            </div>
            <div className="prospectus-leader-card">
              <div className="prospectus-leader-header">
                <div className="prospectus-leader-info">
                  <h3 className="prospectus-leader-name">Peter Martin</h3>
                  <p className="prospectus-leader-role">Co-Founder & Operations</p>
                </div>
              </div>
              <div className="prospectus-leader-bio">
                <p>
                  Peter brings decades of experience in event production and business operations. He ensures every bioEDGE event delivers exceptional experiences for attendees and partners alike.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="prospectus-cta">
        <div className="prospectus-container">
          <h2 className="prospectus-cta-title">Ready to Partner?</h2>
          <p className="prospectus-cta-subtitle">
            Limited booth and sponsorship opportunities available. Secure your presence at NYC 2026 today.
          </p>
          <div className="prospectus-cta-buttons">
            <a href="mailto:partners@bioedgelongevity.com" className="prospectus-cta-button primary">
              Contact Us
            </a>
            <a href="/nyc-2026" className="prospectus-cta-button secondary">
              Learn About NYC 2026
            </a>
          </div>
          <p className="prospectus-cta-contact">
            Questions? Email <a href="mailto:partners@bioedgelongevity.com">partners@bioedgelongevity.com</a>
          </p>
        </div>
      </section>
    </div>
  )
}

export const metadata = {
  title: "NYC 2026 Exhibits & Sponsorships | bioEDGE Longevity Summit",
  description: "Partner with bioEDGE Longevity Summit NYC 2026. Booth packages, sponsorship opportunities, and speaker slots available. Connect with 500+ motivated longevity consumers.",
}
