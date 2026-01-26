import type { Metadata } from "next"
import "./rfp.css"

export const metadata: Metadata = {
  title: "bioEDGE Longevity Summit | Venue Partnership",
  description:
    "Partner with bioEDGE Longevity Summit for Year 3 as we expand nationwide. Seeking venue partners for transformational live health optimization events.",
}

export default function RFPPage() {
  return (
    <div className="rfp-page">
      {/* Hero Section */}
      <section className="rfp-hero">
        <div className="rfp-container">
          <div className="rfp-hero-badge">Year 3 • Expanding Nationwide</div>
          <div className="rfp-logo">
            <span className="rfp-logo-text">
              <span className="bio">BIO</span>
              <span className="edge">EDGE</span>
            </span>
            <span className="rfp-logo-subtitle">LONGEVITY SUMMIT</span>
          </div>
          <h1 className="rfp-hero-headline">THE HUMAN BODY IS DESIGNED TO LIVE 120 YEARS.</h1>
          <p className="rfp-hero-tagline" style={{ fontWeight: 700 }}>
            So why's life expectancy 77?
          </p>

          <div
            className="rfp-hero-details"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px" }}
          >
            <div className="rfp-hero-detail">
              <div className="rfp-hero-detail-value">CONTACT: Peter Katz</div>
              <a
                href="mailto:peter@bioedgelongevity.com"
                className="rfp-hero-detail-value"
                style={{ color: "white", textDecoration: "none" }}
              >
                peter@bioedgelongevity.com
              </a>
            </div>
            <div className="rfp-hero-detail">
              <div className="rfp-hero-detail-value">FORMAT</div>
              <div className="rfp-hero-detail-value">Friday Setup + VIP Dinner, Saturday Main Event</div>
            </div>
            <div className="rfp-hero-detail">
              <div className="rfp-hero-detail-value">TIMING</div>
              <div className="rfp-hero-detail-value">June 2026 or Later</div>
            </div>
          </div>
        </div>
      </section>

      {/* Markets Banner */}
      <div
        className="rfp-markets-banner"
        style={{ background: "linear-gradient(135deg, #0d2840 0%, #0d598a 50%, #017ab2 100%)", padding: "24px 0" }}
      >
        <div className="rfp-container">
          <p
            style={{
              color: "white",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "2px",
              marginBottom: "12px",
              textTransform: "uppercase",
            }}
          >
            Markets Under Consideration
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <span
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "14px",
              }}
            >
              New York City
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "14px",
              }}
            >
              Boston
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "14px",
              }}
            >
              Chicago
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "14px",
              }}
            >
              San Francisco
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: "14px",
              }}
            >
              Dallas
            </span>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="rfp-about">
        <div className="rfp-container">
          <div className="rfp-about-grid">
            <div className="rfp-about-text">
              <p className="rfp-section-label">About the Event</p>
              <h2 className="rfp-section-title">A Transformational Live Experience</h2>

              <p>
                <strong>bioEDGE Longevity Summit</strong> brings health optimization to major cities across the USA.
                After two successful years in Miami, we&apos;re expanding nationally and seeking the right venue
                partners.
              </p>

              <p>
                This isn&apos;t another wellness expo. Our attendees are serious consumers of evidence-based solutions
                to extend healthspan.
              </p>

              <div className="rfp-cme-card">
                <p className="rfp-cme-label">CME Accredited</p>
                <p className="rfp-cme-title">Continuing Medical Education</p>
                <p className="rfp-cme-desc">
                  We offer CME credits for Nurse Practitioners, Medical Doctors, Chiropractors, and
                  Acupuncturists—attracting clinical practitioners alongside consumer attendees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Attends Section */}
      <section className="rfp-section">
        <div className="rfp-container">
          <p className="rfp-section-label">Who Attends</p>
          <h2 className="rfp-section-title">Longevity Leaders</h2>
          <p className="rfp-section-subtitle">Our attendees are actively seeking an EDGE on living better, longer.</p>

          <div className="rfp-audience-grid">
            <div className="rfp-audience-card optimizers">
              <p className="rfp-audience-percent">75%</p>
              <p className="rfp-audience-type">Health Optimizers</p>
              <p className="rfp-audience-desc">
                High performers who view their biology as a strategic asset. These are executives, founders, and
                professionals who invest significantly in their health and make fast purchasing decisions.
              </p>
            </div>

            <div className="rfp-audience-card practitioners">
              <p className="rfp-audience-percent">25%</p>
              <p className="rfp-audience-type">Health Practitioners</p>
              <p className="rfp-audience-desc">
                Licensed healthcare providers seeking advanced protocols and technologies for their practices. Many
                attending for CME credits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Section */}
      <section className="rfp-opportunity">
        <div className="rfp-container">
          <p className="rfp-section-label">The Opportunity</p>
          <h2 className="rfp-section-title">The Longevity Revolution Is Here</h2>
          <p className="rfp-section-subtitle">
            The longevity economy is experiencing unprecedented growth, but it doesn't have to cost a fortune. We
            deliver real solutions at affordable prices to real people.
          </p>

          <div className="rfp-market-stats">
            <div className="rfp-market-stat">
              <p className="rfp-market-stat-value">$1.9T</p>
              <p className="rfp-market-stat-label">USA Longevity Spending</p>
              <p className="rfp-market-stat-desc">Projected by 2034</p>
            </div>
            <div className="rfp-market-stat">
              <p className="rfp-market-stat-value">$1T+</p>
              <p className="rfp-market-stat-label">USA Longevity Dividend</p>
              <p className="rfp-market-stat-desc">Value of 1 Extra Year of Life</p>
            </div>
            <div className="rfp-market-stat">
              <p className="rfp-market-stat-value">25%</p>
              <p className="rfp-market-stat-label">LOWER Health Care Costs</p>
              <p className="rfp-market-stat-desc">With 1 Hour of Exercise per Week</p>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Requirements Section */}
      <section className="rfp-venue-requirements">
        <div className="rfp-container">
          <p className="rfp-section-label">What We&apos;re Looking For</p>
          <h2 className="rfp-section-title">Venue Requirements</h2>
          <p className="rfp-section-subtitle">
            We're seeking a venue partner for our national expansion in the months of June, July, and August 2026.
            Here's what we need.
          </p>

          <div className="rfp-requirements-grid">
            <div className="rfp-requirement-card">
              <div className="rfp-requirement-icon">📐</div>
              <h3 className="rfp-requirement-title">Function Space</h3>
              <ul className="rfp-requirement-list">
                <li>
                  <strong>10,000 sq ft</strong> — Exhibit hall for 50 exhibitors
                </li>
                <li>
                  <strong>5,000 sq ft</strong> — Main stage and keynotes
                </li>
                <li>
                  <strong>3,000 sq ft</strong> — CME sessions (classroom or theater)
                </li>
                <li>
                  <strong>Private dining</strong> — VIP dinner for 35 guests
                </li>
                <li>All three primary spaces required simultaneously on Saturday</li>
              </ul>
            </div>

            <div className="rfp-requirement-card">
              <div className="rfp-requirement-icon">🛏️</div>
              <h3 className="rfp-requirement-title">Guest Rooms & F&B</h3>
              <ul className="rfp-requirement-list">
                <li>
                  <strong>150 room nights</strong> — Primarily exhibitors and speakers
                </li>
                <li>Mix of standard kings/doubles with suite options</li>
                <li>
                  <strong>VIP Dinner</strong> — Seated dinner for 35 (Friday evening)
                </li>
                <li>
                  <strong>Coffee service</strong> — AM and PM stations for 1,500
                </li>
                <li>Health-conscious menu options preferred</li>
              </ul>
            </div>

            <div className="rfp-requirement-card full-width">
              <div className="rfp-requirement-icon">📅</div>
              <h3 className="rfp-requirement-title">Schedule Overview</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
                <thead>
                  <tr style={{ background: "#0d2840" }}>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        color: "white",
                        fontWeight: 600,
                        borderBottom: "2px solid #ff914d",
                      }}
                    >
                      Day
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        color: "white",
                        fontWeight: 600,
                        borderBottom: "2px solid #ff914d",
                      }}
                    >
                      Times
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        color: "white",
                        fontWeight: 600,
                        borderBottom: "2px solid #ff914d",
                      }}
                    >
                      Activity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "#f8fafc" }}>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
                      <strong>Friday</strong>
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>8:00 AM – 5:00 PM</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
                      Exhibitor load-in and setup
                    </td>
                  </tr>
                  <tr style={{ background: "white" }}>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
                      <strong>Friday</strong>
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>6:00 PM – 9:00 PM</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>VIP Reception & Dinner</td>
                  </tr>
                  <tr style={{ background: "#f8fafc" }}>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
                      <strong>Saturday</strong>
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>7:00 AM – 6:00 PM</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
                      Full event day — Exhibit hall, Main stage, CME sessions
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* What We're Not Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #0d2840 0%, #0d598a 50%, #017ab2 100%)",
          padding: "60px 0",
          color: "white",
        }}
      >
        <div className="rfp-container">
          <p
            style={{
              color: "#ff914d",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "2px",
              marginBottom: "12px",
              textTransform: "uppercase",
            }}
          >
            WHO WE ARE
          </p>
          <h2
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "36px",
              fontWeight: 700,
              letterSpacing: "3px",
              marginBottom: "20px",
              color: "white",
            }}
          >
            INDEPENDENT BY DESIGN
          </h2>

          <div className="rfp-hub-section">
            <p style={{ fontSize: "18px", lineHeight: 1.6, marginBottom: "20px", color: "rgba(255,255,255,0.9)" }}>
              Our organization is the hub between practitioners, innovators, and optimizers who are all counting on the
              synergy of their work to eliminate the &quot;Marginal Decade&quot; and thrive for 120 years.
            </p>

            <div className="rfp-hub-diagram">
              <svg viewBox="0 147 1000 700" className="rfp-hub-svg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hubGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#0d2840" }} />
                    <stop offset="50%" style={{ stopColor: "#0d598a" }} />
                    <stop offset="100%" style={{ stopColor: "#017ab2" }} />
                  </linearGradient>
                  <radialGradient id="spokeGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{ stopColor: "#ff914d" }} />
                    <stop offset="100%" style={{ stopColor: "#f83b89" }} />
                  </radialGradient>
                  <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#ff914d" }} />
                    <stop offset="100%" style={{ stopColor: "#f83b89" }} />
                  </linearGradient>
                </defs>

                {/* Spokes - 12 lines at exact 30° intervals */}
                <g stroke="#f83b89" strokeWidth="2.5" opacity="0.7">
                  <line x1="500" y1="500" x2="500" y2="220" />
                  <line x1="500" y1="500" x2="620" y2="292.36" />
                  <line x1="500" y1="500" x2="724.64" y2="370" />
                  <line x1="500" y1="500" x2="800" y2="500" />
                  <line x1="500" y1="500" x2="724.64" y2="630" />
                  <line x1="500" y1="500" x2="633.97" y2="733.97" />
                  <line x1="500" y1="500" x2="500" y2="800" />
                  <line x1="500" y1="500" x2="370" y2="724.64" />
                  <line x1="500" y1="500" x2="280" y2="630" />
                  <line x1="500" y1="500" x2="240" y2="500" />
                  <line x1="500" y1="500" x2="265" y2="365" />
                  <line x1="500" y1="500" x2="366.03" y2="266.03" />
                </g>

                {/* Center hub circle */}
                <circle
                  cx="500"
                  cy="500"
                  r="120"
                  fill="url(#hubGradient)"
                  stroke="url(#borderGradient)"
                  strokeWidth="4"
                />

                {/* Center text */}
                <text
                  x="500"
                  y="490"
                  textAnchor="middle"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="700"
                  letterSpacing="3"
                >
                  <tspan fill="#ffffff" fontSize="22">
                    BIO
                  </tspan>
                  <tspan fill="#ff914d" fontSize="38">
                    EDGE
                  </tspan>
                </text>
                <text
                  x="500"
                  y="525"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="22"
                  fontWeight="700"
                  letterSpacing="3"
                >
                  LONGEVITY
                </text>

                {/* Labels */}
                <rect x="359" y="170" width="282" height="50" rx="25" fill="#ff914d" />
                <text
                  x="500"
                  y="203"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  HEALTH OPTIMIZERS
                </text>

                <rect x="550" y="267" width="140" height="50" rx="25" fill="#017ab2" />
                <text
                  x="620"
                  y="300"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  ATHLETES
                </text>

                <rect x="654" y="345" width="140" height="50" rx="25" fill="#ff914d" />
                <text
                  x="724"
                  y="378"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  DOCTORS
                </text>

                <rect x="665" y="475" width="270" height="50" rx="25" fill="#f83b89" />
                <text
                  x="800"
                  y="508"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  FUNCTIONAL DOCTORS
                </text>

                <rect x="654" y="605" width="140" height="50" rx="25" fill="#017ab2" />
                <text
                  x="724"
                  y="638"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  NURSES
                </text>

                <rect x="529" y="709" width="210" height="50" rx="25" fill="#4caf50" />
                <text
                  x="634"
                  y="742"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  CHIROPRACTORS
                </text>

                <rect x="359" y="775" width="282" height="50" rx="25" fill="#f83b89" />
                <text
                  x="500"
                  y="808"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  ACUPUNCTURISTS
                </text>

                <rect x="280" y="700" width="160" height="50" rx="25" fill="#ff914d" />
                <text
                  x="360"
                  y="733"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  ENGINEERS
                </text>

                <rect x="145" y="605" width="190" height="50" rx="25" fill="#4caf50" />
                <text
                  x="240"
                  y="638"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  NATUROPATHS
                </text>

                <rect x="90" y="475" width="170" height="50" rx="25" fill="#017ab2" />
                <text
                  x="175"
                  y="508"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  SCIENTISTS
                </text>

                <rect x="105" y="340" width="230" height="50" rx="25" fill="#f83b89" />
                <text
                  x="220"
                  y="373"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  ENTREPRENEURS
                </text>

                <rect x="231" y="241" width="180" height="50" rx="25" fill="#4caf50" />
                <text
                  x="321"
                  y="274"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="16"
                  fontWeight="700"
                  letterSpacing="1"
                >
                  INNOVATORS
                </text>
              </svg>
            </div>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "8px", fontSize: "16px", fontWeight: 700 }}>
                Not funded by Big Pharma or Venture Capital
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ background: "#f8f9fa", padding: "60px 0" }}>
        <div className="rfp-container">
          <p
            style={{
              color: "#ff914d",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "2px",
              marginBottom: "12px",
              textTransform: "uppercase",
            }}
          >
            WHAT PEOPLE SAY
          </p>
          <h2
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "36px",
              fontWeight: 700,
              letterSpacing: "3px",
              marginBottom: "32px",
              color: "#0d2840",
            }}
          >
            FROM PAST EVENTS
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Testimonial 1 */}
            <div
              style={{
                background: "#ffffff",
                padding: "24px",
                borderRadius: "8px",
                borderLeft: "4px solid #017ab2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  marginBottom: "16px",
                  color: "#2c3e50",
                }}
              >
                &quot;I had the pleasure of attending the Biohacker Expo organized by Sandy Martin, and it was nothing
                short of outstanding. The event was impeccably organized, featuring a roster of amazing thought
                leaders... What truly made this event special was Sandy. Her professionalism and warmth created an
                unforgettable experience for all involved.&quot;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff914d 0%, #f83b89 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  CP
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "#0d2840", fontFamily: "IBM Plex Mono, monospace" }}>
                    Dr. Christopher Palmer, MD
                  </p>
                  <p style={{ color: "#2c3e50", fontSize: "14px" }}>Psychiatrist & Researcher</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div
              style={{
                background: "#ffffff",
                padding: "24px",
                borderRadius: "8px",
                borderLeft: "4px solid #017ab2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  marginBottom: "16px",
                  color: "#2c3e50",
                }}
              >
                &quot;At last year&apos;s Biohacker Expo, with the support of the enthusiastic crowd there, we
                officially launched our new book &apos;Lies I Taught in Medical School&apos; to become a New York Times
                Bestseller! I wouldn&apos;t miss this year&apos;s event with the unusual combination of fascinating and
                useful information presented in a celebratory and fun environment!&quot;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff914d 0%, #f83b89 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  RL
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "#0d2840", fontFamily: "IBM Plex Mono, monospace" }}>
                    Dr. Robert Lufkin, MD
                  </p>
                  <p style={{ color: "#2c3e50", fontSize: "14px" }}>Medical School Professor</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div
              style={{
                background: "#ffffff",
                padding: "24px",
                borderRadius: "8px",
                borderLeft: "4px solid #017ab2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  marginBottom: "16px",
                  color: "#2c3e50",
                }}
              >
                &quot;The event was an excellent opportunity to educate on the connection between red light therapy and
                the gut-brain axis... The Expo enabled me to forge valuable connections, engage in meaningful dialogues,
                and explore cutting-edge advancements. I am already looking forward to next year&apos;s event.&quot;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff914d 0%, #f83b89 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  ST
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "#0d2840", fontFamily: "IBM Plex Mono, monospace" }}>
                    Sarah Turner
                  </p>
                  <p style={{ color: "#2c3e50", fontSize: "14px" }}>CEO & Co-Founder, CeraThrive LLC</p>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div
              style={{
                background: "#ffffff",
                padding: "24px",
                borderRadius: "8px",
                borderLeft: "4px solid #017ab2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  marginBottom: "16px",
                  color: "#2c3e50",
                }}
              >
                &quot;It was an honor to speak at the Biohacker Expo. Sandy brought the best speakers in the biohacking
                space, and incredible vendors. I loved the intimate touch of being able to connect with my audience in
                person during my book signings. The connections and friendships I made from this event are
                invaluable!&quot;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff914d 0%, #f83b89 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  BA
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "#0d2840", fontFamily: "IBM Plex Mono, monospace" }}>Ben Azadi</p>
                  <p style={{ color: "#2c3e50", fontSize: "14px" }}>Author & Health Expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="rfp-leadership">
        <div className="rfp-container">
          <p className="rfp-section-label">Leadership</p>
          <h2 className="rfp-section-title">Meet Our Team</h2>
          <p className="rfp-section-subtitle">
            bioEDGE is led by proven event producers with combined 40+ years of experience building major conventions.
          </p>

          <div className="rfp-leaders-grid">
            <div className="rfp-leader-card">
              <div className="rfp-leader-header">
                <div
                  className="rfp-leader-avatar"
                  style={{
                    background: "linear-gradient(135deg, #ff914d 0%, #f83b89 100%)",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "20px",
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  SM
                </div>
                <div className="rfp-leader-info">
                  <p className="rfp-leader-name">Sandy Martin</p>
                  <p className="rfp-leader-role">Founder</p>
                </div>
              </div>
              <div className="rfp-leader-bio">
                <p>
                  Before entering the longevity space, Sandy Martin spent 15 years producing large-scale comic cons like
                  Supercon and GalaxyCon drawing more than 50,000 attendees to each one in cities across the country.
                </p>
                <p>
                  But in October 2020, Sandy&apos;s brain function went into freefall. Desperately trying to regain her
                  capacity, she spent $97,000 on interventions in the first year that failed, not because the tools were
                  bad, but because it took 5 months to discover the root cause of her &quot;symptoms&quot;.
                </p>
                <p>
                  That experience revealed a framework: The EDGE Framework, which places elimination before
                  optimization. It replaces &quot;symptoms&quot; to be managed with &quot;signals&quot; to be decoded.
                  Her book, Biohacking Starts With NO, describes this principle and how you can interpret your
                  body&apos;s natural intelligence.
                </p>
              </div>
            </div>

            <div className="rfp-leader-card">
              <div className="rfp-leader-header">
                <div
                  className="rfp-leader-avatar"
                  style={{
                    background: "linear-gradient(135deg, #017ab2 0%, #0d598a 100%)",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "20px",
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  PK
                </div>
                <div className="rfp-leader-info">
                  <p className="rfp-leader-name">Peter Katz</p>
                  <p className="rfp-leader-role">President</p>
                </div>
              </div>
              <div className="rfp-leader-bio">
                <p>
                  Peter Katz is a lifelong distance runner with thousands of miles and multiple marathons under his
                  belt. Consistent training and sustainable performance define his approach to life and career, the core
                  premise behind longevity.
                </p>
                <p>
                  His professional track record lies in crossing the chasm. When Peter entered the comic con industry
                  over 20 years ago, it was niche. Through his leadership as President of Wizard World Comic Con, Vice
                  President at Informa&apos;s Fan Expo, and Senior Vice President at GalaxyCon, he has connected over a
                  million fans with their heroes.
                </p>
                <p>
                  As President of bioEDGE, Peter applies the same playbook: bring longevity out of obscurity and into
                  the hearts of every fan of life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "linear-gradient(135deg, #0d2840 0%, #0d598a 50%, #017ab2 100%)",
          padding: "40px 0",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="rfp-container" style={{ textAlign: "center" }}>
          <div className="rfp-logo" style={{ display: "inline-block", textAlign: "center" }}>
            <div className="rfp-logo-text">
              <span className="bio">BIO</span>
              <span className="edge">EDGE</span>
            </div>
            <span className="rfp-logo-subtitle">LONGEVITY SUMMIT</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginBottom: "8px" }}>
            Year 3 • Expanding Nationwide • June 2026+
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
            © 2026 bioEDGE Longevity LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
