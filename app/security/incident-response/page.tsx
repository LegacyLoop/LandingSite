'use client'

import { useEffect } from 'react'

export default function IncidentResponsePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const heading: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: 28,
    color: '#F1F5F9',
    marginTop: 48,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid rgba(0,188,212,0.15)',
  }

  const subheading: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    fontSize: 20,
    color: '#00BCD4',
    marginTop: 28,
    marginBottom: 8,
  }

  const body: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontWeight: 400,
    fontSize: 17,
    color: '#CBD5E1',
    lineHeight: 1.75,
    marginBottom: 16,
  }

  const list: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontWeight: 400,
    fontSize: 17,
    color: '#CBD5E1',
    lineHeight: 1.75,
    marginBottom: 16,
    paddingLeft: 24,
  }

  const li: React.CSSProperties = {
    marginBottom: 6,
  }

  const meta: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  }

  const tableCell: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    color: '#CBD5E1',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(0,188,212,0.12)',
    textAlign: 'left' as const,
    verticalAlign: 'top' as const,
  }

  const tableHeader: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: 13,
    color: '#00BCD4',
    padding: '12px 16px',
    textAlign: 'left' as const,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    borderBottom: '2px solid rgba(0,188,212,0.3)',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(13,17,23,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,188,212,0.08)',
      }}>
        <div style={{ maxWidth: 800, width: '100%', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/landing" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logos/LegacyLoop-Logo-Master-Outlines-transparent-05.png" alt="Legacy-Loop" style={{ height: 32, objectFit: 'contain' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, color: '#FFFFFF' }}>Legacy-Loop</span>
          </a>
          <a href="/security" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', textDecoration: 'none' }}>Back to Security</a>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '64px 32px 120px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontFamily: 'var(--font-data)', fontWeight: 600, fontSize: 12, color: '#00BCD4', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>LEGACY-LOOP SECURITY POLICY</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px, 4.5vw, 42px)', color: '#F1F5F9', margin: '16px 0 12px', lineHeight: 1.2 }}>Incident Response Plan</h1>
          <div style={{ marginTop: 16 }}>
            <p style={meta}>Version 1.0 &middot; Effective May 16, 2026</p>
            <p style={meta}>Owner: Ryan Hallee, Founder &amp; CEO</p>
            <p style={meta}>Entity: Legacy-Loop Tech LLC &middot; EIN 42-1834363 &middot; Maine Charter 202609949DC</p>
            <p style={meta}>Review Cadence: Quarterly or upon material change</p>
          </div>
        </div>

        <h2 style={heading}>1. Purpose</h2>
        <p style={body}>This document defines how Legacy-Loop Tech LLC (&ldquo;Legacy-Loop&rdquo;) detects, contains, investigates, and reports security incidents affecting user data, platform integrity, or third-party data received through APIs including Meta Platform Data, Google OAuth profile data, payment processor data, and any other personally identifiable information (&ldquo;PII&rdquo;) processed by the platform.</p>
        <p style={body}>This plan applies to all systems operated by Legacy-Loop, including:</p>
        <ul style={list}>
          <li style={li}>Production application at app.legacy-loop.com</li>
          <li style={li}>Marketing landing site at legacy-loop.com</li>
          <li style={li}>All sub-processors handling user data (Vercel, Turso, Cloudinary, Stripe)</li>
          <li style={li}>All authentication providers (Google OAuth, Facebook Login, email/password, magic link)</li>
        </ul>

        <h2 style={heading}>2. Definitions</h2>
        <p style={body}><strong style={{ color: '#F1F5F9' }}>Security Incident</strong> &mdash; Any unauthorized access, disclosure, alteration, destruction, or loss of user data, system integrity, or service availability. Includes confirmed or reasonably suspected events.</p>
        <p style={body}><strong style={{ color: '#F1F5F9' }}>Personal Data</strong> &mdash; Any information that identifies or could identify an individual user, including email addresses, names, profile pictures, listing photos, IP addresses, payment information, and OAuth provider identifiers.</p>
        <p style={body}><strong style={{ color: '#F1F5F9' }}>Platform Data</strong> &mdash; Data received from Meta Platform APIs (Facebook Login: email, public_profile fields including user ID, display name, profile picture).</p>
        <p style={body}><strong style={{ color: '#F1F5F9' }}>Breach</strong> &mdash; A Security Incident that involves confirmed unauthorized acquisition, access, use, or disclosure of Personal Data.</p>

        <h2 style={heading}>3. Response Team</h2>
        <p style={body}>Legacy-Loop is a single-member LLC. The Founder &amp; CEO serves as the Incident Response Lead. External vendors are engaged as needed.</p>
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,188,212,0.15)', borderRadius: 12 }}>
            <thead>
              <tr><th style={tableHeader}>Role</th><th style={tableHeader}>Holder</th><th style={tableHeader}>Responsibilities</th></tr>
            </thead>
            <tbody>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Incident Response Lead</td><td style={tableCell}>Ryan Hallee, CEO</td><td style={tableCell}>Decision authority, communication, escalation</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Technical Lead (Engineering)</td><td style={tableCell}>Ryan Hallee + contracted senior developers</td><td style={tableCell}>Containment, forensics, remediation</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Communications Lead</td><td style={tableCell}>Ryan Hallee</td><td style={tableCell}>User notifications, regulatory reporting, vendor coordination</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9', borderBottom: 'none' }}>Legal Counsel</td><td style={{ ...tableCell, borderBottom: 'none' }}>Retained as needed</td><td style={{ ...tableCell, borderBottom: 'none' }}>Regulatory compliance, disclosure obligations</td></tr>
            </tbody>
          </table>
        </div>

        <h2 style={heading}>4. Detection Sources</h2>
        <p style={body}>Security incidents may be detected through any of the following:</p>
        <ul style={list}>
          <li style={li}>Automated alerts from Vercel deployment monitoring</li>
          <li style={li}>Error logs and runtime exceptions captured via Vercel logs</li>
          <li style={li}>Database anomaly alerts from Turso</li>
          <li style={li}>User-reported issues sent to support@legacy-loop.com</li>
          <li style={li}>Third-party security researcher disclosures</li>
          <li style={li}>Sub-processor breach notifications (Vercel, Turso, Cloudinary, Stripe)</li>
          <li style={li}>Suspicious authentication patterns observed in audit logs</li>
        </ul>

        <h2 style={heading}>5. Response Phases</h2>

        <h3 style={subheading}>Phase 1 &mdash; Detection &amp; Triage (Within 1 Hour of Detection)</h3>
        <ul style={list}>
          <li style={li}>Incident Response Lead acknowledges the alert or report</li>
          <li style={li}>Initial severity assessment performed using the severity matrix in Section 6</li>
          <li style={li}>Incident logged with timestamp, source, and initial scope notes</li>
          <li style={li}>Internal incident channel opened</li>
        </ul>

        <h3 style={subheading}>Phase 2 &mdash; Containment (Within 4 Hours)</h3>
        <ul style={list}>
          <li style={li}>Revoke all credentials potentially compromised: rotate affected API keys and OAuth client secrets; invalidate active user sessions (JWT signing key rotation if warranted); disable affected user accounts pending investigation</li>
          <li style={li}>Isolate affected systems where feasible</li>
          <li style={li}>Preserve logs and forensic evidence (Vercel logs, Turso query history, application server logs)</li>
          <li style={li}>Apply emergency patches to stop ongoing exploitation</li>
        </ul>

        <h3 style={subheading}>Phase 3 &mdash; Investigation (Within 24 Hours)</h3>
        <ul style={list}>
          <li style={li}>Determine scope of affected data and users</li>
          <li style={li}>Identify root cause (vulnerability, misconfiguration, credential compromise, third-party breach)</li>
          <li style={li}>Document timeline of events</li>
          <li style={li}>Assess regulatory disclosure obligations under applicable law</li>
        </ul>

        <h3 style={subheading}>Phase 4 &mdash; Notification (Within 72 Hours)</h3>
        <p style={body}><strong style={{ color: '#F1F5F9' }}>4.1 &mdash; User Notification.</strong> Affected users receive direct email notification including: description of the incident; categories of data involved; date or date range of the incident; steps taken in response; recommended user actions (password reset, monitoring, etc.); contact for questions at <a href="mailto:support@legacy-loop.com" style={{ color: '#00BCD4', textDecoration: 'none' }}>support@legacy-loop.com</a>.</p>
        <p style={body}><strong style={{ color: '#F1F5F9' }}>4.2 &mdash; Regulatory Notification.</strong> Where legally required:</p>
        <ul style={list}>
          <li style={li}>GDPR (EU users): Notify supervisory authority within 72 hours per Article 33</li>
          <li style={li}>CCPA (California users): Notify Attorney General if 500+ California residents affected</li>
          <li style={li}>State breach laws: Notify in accordance with each applicable state law</li>
        </ul>
        <p style={body}><strong style={{ color: '#F1F5F9' }}>4.3 &mdash; Platform Notification.</strong> If Meta Platform Data is involved: notify Meta via the Data Incident Reporting form within 72 hours, including incident scope, affected fields, and remediation status. If Google OAuth data is involved, notify Google via Google Developer Console security contact. If Stripe payment data is involved, notify Stripe per the Stripe Connected Account Agreement.</p>

        <h3 style={subheading}>Phase 5 &mdash; Remediation &amp; Recovery (Within 7 Days)</h3>
        <ul style={list}>
          <li style={li}>Deploy permanent fix for root cause</li>
          <li style={li}>Verify fix with regression testing</li>
          <li style={li}>Restore normal operations</li>
          <li style={li}>Document lessons learned</li>
        </ul>

        <h3 style={subheading}>Phase 6 &mdash; Post-Incident Review (Within 30 Days)</h3>
        <ul style={list}>
          <li style={li}>Written post-mortem documenting: timeline, root cause, containment actions, affected users and data, remediation, process improvements identified</li>
          <li style={li}>Update Incident Response Plan based on lessons learned</li>
          <li style={li}>Update relevant code, documentation, or training materials</li>
        </ul>

        <h2 style={heading}>6. Severity Matrix</h2>
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,188,212,0.15)', borderRadius: 12 }}>
            <thead>
              <tr><th style={tableHeader}>Severity</th><th style={tableHeader}>Definition</th><th style={tableHeader}>Response Time</th><th style={tableHeader}>Examples</th></tr>
            </thead>
            <tbody>
              <tr><td style={{ ...tableCell, fontWeight: 700, color: '#ef4444' }}>Critical</td><td style={tableCell}>Confirmed breach of user PII or Platform Data affecting &gt; 100 users</td><td style={tableCell}>Immediate (&lt; 1 hour)</td><td style={tableCell}>Database exfiltration, mass credential leak</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 700, color: '#f59e0b' }}>High</td><td style={tableCell}>Confirmed breach affecting &lt; 100 users OR critical service outage</td><td style={tableCell}>&lt; 4 hours</td><td style={tableCell}>Single account takeover, API key leak</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 700, color: '#00BCD4' }}>Medium</td><td style={tableCell}>Suspected breach pending investigation OR partial service disruption</td><td style={tableCell}>&lt; 24 hours</td><td style={tableCell}>Suspicious access pattern, individual user data exposure</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 700, color: '#22c55e', borderBottom: 'none' }}>Low</td><td style={{ ...tableCell, borderBottom: 'none' }}>Vulnerability discovered but no evidence of exploitation</td><td style={{ ...tableCell, borderBottom: 'none' }}>&lt; 7 days</td><td style={{ ...tableCell, borderBottom: 'none' }}>Code-level security finding, scanner alert</td></tr>
            </tbody>
          </table>
        </div>

        <h2 style={heading}>7. User Right to Deletion (Independent of Incidents)</h2>
        <p style={body}>Users may request deletion of their data at any time via:</p>
        <ul style={list}>
          <li style={li}>Self-service: Account Settings &rarr; Delete Account</li>
          <li style={li}>Web form: <a href="/data-deletion" style={{ color: '#00BCD4', textDecoration: 'none' }}>legacy-loop.com/data-deletion</a></li>
          <li style={li}>Email: <a href="mailto:support@legacy-loop.com" style={{ color: '#00BCD4', textDecoration: 'none' }}>support@legacy-loop.com</a></li>
        </ul>
        <p style={body}>Deletion is processed within 30 days. For Meta Platform Data specifically: Facebook OAuth-linked accounts can revoke access at any time via Facebook Settings &rarr; Apps and Websites. Legacy-Loop honors deletion requests received from Meta on behalf of users. Deletion includes purging Platform Data from production databases and any backups within 30 days.</p>

        <h2 style={heading}>8. Sub-Processor Incident Coordination</h2>
        <p style={body}>Legacy-Loop uses the following sub-processors. If any of them experience a security incident affecting Legacy-Loop user data, the Incident Response Lead will coordinate joint response and forward user notifications as required.</p>
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,188,212,0.15)', borderRadius: 12 }}>
            <thead>
              <tr><th style={tableHeader}>Sub-Processor</th><th style={tableHeader}>Data Handled</th><th style={tableHeader}>Notification Contact</th></tr>
            </thead>
            <tbody>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Vercel Inc.</td><td style={tableCell}>Application hosting, request logs</td><td style={tableCell}>security@vercel.com</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Chiselstrike Inc. (Turso)</td><td style={tableCell}>User account database (encrypted at rest)</td><td style={tableCell}>Per Turso ToS</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Cloudinary Ltd.</td><td style={tableCell}>User-uploaded photos</td><td style={tableCell}>security@cloudinary.com</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9', borderBottom: 'none' }}>Stripe Inc.</td><td style={{ ...tableCell, borderBottom: 'none' }}>Payment processing</td><td style={{ ...tableCell, borderBottom: 'none' }}>Per Stripe DPA</td></tr>
            </tbody>
          </table>
        </div>
        <p style={body}>Legacy-Loop reviews each sub-processor&apos;s security posture during onboarding and at least annually thereafter.</p>

        <h2 style={heading}>9. Communication Templates</h2>
        <h3 style={subheading}>9.1 &mdash; User Breach Notification (Template)</h3>
        <p style={body}><strong style={{ color: '#F1F5F9' }}>Subject:</strong> Important: Security Notice from Legacy-Loop</p>
        <p style={body}>Dear [User Name], On [Date], Legacy-Loop became aware of a security incident affecting [scope]. We are writing to inform you of what happened, what data was involved, and what we are doing about it. What happened: [Brief description]. Data involved: [Specific data categories]. What we have done: [Actions taken]. What you should do: [Recommended user actions]. More information: support@legacy-loop.com. We sincerely apologize for this incident and the concern it may cause. &mdash; The Legacy-Loop Team</p>

        <h3 style={subheading}>9.2 &mdash; Meta Platform Data Incident Report (Template)</h3>
        <p style={body}>App ID: 871910582591145 &middot; Business: Legacy-Loop Tech LLC &middot; Incident Date: [Date] &middot; Detection Date: [Date] &middot; Affected Permissions: [email, public_profile, etc.] &middot; Estimated Affected Users: [Number or &ldquo;Under investigation&rdquo;] &middot; Root Cause: [Description] &middot; Containment Status: [Actions taken] &middot; Remediation Plan: [Next steps] &middot; Contact: support@legacy-loop.com</p>

        <h2 style={heading}>10. Plan Maintenance</h2>
        <p style={body}>This Incident Response Plan is reviewed and updated:</p>
        <ul style={list}>
          <li style={li}>Quarterly by the Founder &amp; CEO</li>
          <li style={li}>After any incident requiring activation</li>
          <li style={li}>When material changes occur to the platform, sub-processors, or applicable law</li>
          <li style={li}>At minimum, annually</li>
        </ul>
        <p style={body}>Most recent review: May 16, 2026. Next scheduled review: August 16, 2026.</p>

        <h2 style={heading}>11. Acknowledgment</h2>
        <p style={body}>By operating Legacy-Loop Tech LLC, the Founder &amp; CEO accepts responsibility for the maintenance and execution of this Incident Response Plan.</p>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,188,212,0.15)', borderRadius: 12, padding: 24, marginTop: 16 }}>
          <p style={{ ...body, marginBottom: 4 }}><strong style={{ color: '#F1F5F9' }}>Signed:</strong> Ryan Hallee, Founder &amp; CEO</p>
          <p style={{ ...body, marginBottom: 4 }}><strong style={{ color: '#F1F5F9' }}>Date:</strong> May 16, 2026</p>
          <p style={{ ...body, marginBottom: 0 }}><strong style={{ color: '#F1F5F9' }}>Entity:</strong> Legacy-Loop Tech LLC</p>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', fontStyle: 'italic', marginTop: 48 }}>Last updated: May 16, 2026 | <a href="/security" style={{ color: '#00BCD4', textDecoration: 'none' }}>Return to Security &amp; Trust</a></p>
      </main>

      <footer style={{ borderTop: '1px solid rgba(0,188,212,0.08)', padding: '32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280' }}>&copy; 2026 Legacy-Loop Tech LLC. All rights reserved. | <a href="/landing" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</a> | <a href="/security" style={{ color: '#6B7280', textDecoration: 'none' }}>Security</a> | <a href="/privacy" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy</a> | <a href="/terms" style={{ color: '#6B7280', textDecoration: 'none' }}>Terms</a></p>
      </footer>
    </div>
  )
}
