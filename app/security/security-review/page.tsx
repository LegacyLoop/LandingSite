'use client'

import { useEffect } from 'react'

export default function SecurityReviewPage() {
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
        backdropFilter: 'blur(24px)',
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
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px, 4.5vw, 42px)', color: '#F1F5F9', margin: '16px 0 12px', lineHeight: 1.2 }}>Security Review Process</h1>
          <div style={{ marginTop: 16 }}>
            <p style={meta}>Version 1.0 &middot; Effective May 16, 2026</p>
            <p style={meta}>Owner: Ryan Hallee, Founder &amp; CEO</p>
            <p style={meta}>Entity: Legacy-Loop Tech LLC &middot; EIN 42-1834363 &middot; Maine Charter 202609949DC</p>
            <p style={meta}>Review Cadence: Quarterly + before each major release</p>
          </div>
        </div>

        <h2 style={heading}>1. Purpose</h2>
        <p style={body}>This document defines how Legacy-Loop Tech LLC (&ldquo;Legacy-Loop&rdquo;) conducts security reviews to protect user data, platform integrity, and third-party data received through APIs including Meta Platform Data and Google OAuth data.</p>
        <p style={body}>The Security Review Process applies to all Legacy-Loop systems including:</p>
        <ul style={list}>
          <li style={li}>Application code (Next.js, TypeScript, Prisma)</li>
          <li style={li}>Authentication systems (Google OAuth, Facebook Login, email/password, magic link, JWT session tokens)</li>
          <li style={li}>Database (Turso encrypted at rest)</li>
          <li style={li}>Sub-processor relationships (Vercel, Turso, Cloudinary, Stripe)</li>
          <li style={li}>API integrations (Meta Platform, Google OAuth, Stripe, Cloudinary)</li>
        </ul>

        <h2 style={heading}>2. Security Principles</h2>
        <p style={body}>Legacy-Loop operates under the following security principles:</p>
        <ul style={list}>
          <li style={li}><strong style={{ color: '#F1F5F9' }}>Least privilege</strong> &mdash; Each system component and user role receives the minimum access necessary</li>
          <li style={li}><strong style={{ color: '#F1F5F9' }}>Defense in depth</strong> &mdash; Multiple layers of security controls (HTTPS, encryption at rest, authentication, authorization, audit logging)</li>
          <li style={li}><strong style={{ color: '#F1F5F9' }}>Secure by default</strong> &mdash; Default configurations favor security over convenience</li>
          <li style={li}><strong style={{ color: '#F1F5F9' }}>Audit before trust</strong> &mdash; Code, configurations, and dependencies are reviewed before deployment</li>
          <li style={li}><strong style={{ color: '#F1F5F9' }}>No data resale</strong> &mdash; User data is never sold, rented, or licensed to third parties</li>
          <li style={li}><strong style={{ color: '#F1F5F9' }}>User control</strong> &mdash; Users can access, export, and delete their data at any time</li>
        </ul>

        <h2 style={heading}>3. Review Cadence</h2>

        <h3 style={subheading}>3.1 &mdash; Continuous Reviews (Per Release)</h3>
        <p style={body}>Performed before every production deployment:</p>
        <ul style={list}>
          <li style={li}>Code review by Founder/CEO and any engaged senior developers</li>
          <li style={li}>Automated dependency vulnerability scan (npm audit, pnpm audit)</li>
          <li style={li}>Static analysis via TypeScript strict mode (tsc --noEmit must pass)</li>
          <li style={li}>Secret scanning to verify no API keys, tokens, or credentials are committed</li>
          <li style={li}>Manual smoke test of authentication flows</li>
          <li style={li}>Verification that no new third-party data flows have been introduced without review</li>
        </ul>

        <h3 style={subheading}>3.2 &mdash; Quarterly Reviews</h3>
        <p style={body}>Performed at the start of each calendar quarter:</p>
        <ul style={list}>
          <li style={li}>Full review of this document and the Incident Response Plan</li>
          <li style={li}>Sub-processor list verification &mdash; confirm Vercel, Turso, Cloudinary, Stripe still match Privacy Policy disclosure</li>
          <li style={li}>Sub-processor security posture check (review their published security pages and any security incidents disclosed)</li>
          <li style={li}>Access review &mdash; verify only authorized individuals have access to production environments, vault credentials, and Meta/Google developer accounts</li>
          <li style={li}>Credential rotation review &mdash; assess whether any long-lived credentials should be rotated</li>
          <li style={li}>Backup and recovery test &mdash; verify production data backup and restoration process</li>
          <li style={li}>Privacy Policy, Terms of Service, and Data Deletion page review for accuracy</li>
        </ul>

        <h3 style={subheading}>3.3 &mdash; Annual Reviews</h3>
        <p style={body}>Performed at least once every 12 months:</p>
        <ul style={list}>
          <li style={li}>Full security audit of authentication flows (Google OAuth, Facebook Login, email/password, magic link, JWT)</li>
          <li style={li}>Full data flow audit (what data enters the system, how it is stored, where it is sent, when it is deleted)</li>
          <li style={li}>Review of all environment variables and secrets stored in Vercel and Mac Keychain</li>
          <li style={li}>Review of all webhooks, callbacks, and redirect URIs for current accuracy</li>
          <li style={li}>Penetration test consideration (engage third-party firm if user count or data sensitivity warrants)</li>
          <li style={li}>Updated threat model documenting current risks and mitigations</li>
        </ul>

        <h3 style={subheading}>3.4 &mdash; Event-Triggered Reviews</h3>
        <p style={body}>Performed whenever any of the following occur:</p>
        <ul style={list}>
          <li style={li}>Security incident (per <a href="/security/incident-response" style={{ color: '#00BCD4', textDecoration: 'none' }}>Incident Response Plan</a>)</li>
          <li style={li}>Onboarding a new sub-processor or third-party integration</li>
          <li style={li}>Material change to authentication, payment, or data storage architecture</li>
          <li style={li}>Material change to applicable privacy or security law</li>
          <li style={li}>Reported vulnerability from a researcher or user</li>
        </ul>

        <h2 style={heading}>4. Review Checklist (Used Each Cycle)</h2>

        <h3 style={subheading}>4.1 &mdash; Code &amp; Application Security</h3>
        <ul style={list}>
          <li style={li}>All routes that handle user data require authentication</li>
          <li style={li}>All user input is validated and sanitized</li>
          <li style={li}>Database queries use parameterized statements (Prisma ORM enforces this)</li>
          <li style={li}>Session tokens use cryptographically secure signing</li>
          <li style={li}>OAuth flows include CSRF state validation</li>
          <li style={li}>Error messages do not leak sensitive information</li>
        </ul>

        <h3 style={subheading}>4.2 &mdash; Data Protection</h3>
        <ul style={list}>
          <li style={li}>All connections to and from the application use HTTPS (TLS 1.2 or higher)</li>
          <li style={li}>Turso database encryption at rest is enabled</li>
          <li style={li}>User passwords are hashed using bcrypt or equivalent</li>
          <li style={li}>API keys, OAuth secrets, and JWT signing keys are stored only in: Vercel encrypted environment variables (production/preview/development); local .env.local files (gitignored, never committed); Mac Keychain (developer machines)</li>
          <li style={li}>No secrets appear in code, git history, logs, screenshots, or chat transcripts</li>
        </ul>

        <h3 style={subheading}>4.3 &mdash; Access Control</h3>
        <ul style={list}>
          <li style={li}>Only authorized individuals have access to the production Vercel project</li>
          <li style={li}>Only authorized individuals have access to the Meta Developer dashboard</li>
          <li style={li}>Only authorized individuals have access to the Turso production database</li>
          <li style={li}>Two-factor authentication is enabled on all accounts where supported (GitHub, Vercel, Meta, Google, Stripe)</li>
          <li style={li}>Vault credentials (1Password or equivalent) are used for credential storage</li>
        </ul>

        <h3 style={subheading}>4.4 &mdash; Third-Party Data Handling</h3>
        <ul style={list}>
          <li style={li}>Sub-processor list in Privacy Policy is current and accurate</li>
          <li style={li}>Each sub-processor&apos;s Data Processing Agreement (DPA) or Terms of Service has been reviewed</li>
          <li style={li}>No user data is shared with parties not disclosed in the Privacy Policy</li>
          <li style={li}>Meta Platform Data (Facebook Login email + public_profile) is used only as disclosed in the App Review submission</li>
          <li style={li}>Google OAuth profile data is used only for account identification and personalization</li>
          <li style={li}>Stripe payment data is processed by Stripe and never stored in Legacy-Loop databases except as required tokens</li>
        </ul>

        <h3 style={subheading}>4.5 &mdash; Logging &amp; Monitoring</h3>
        <ul style={list}>
          <li style={li}>Vercel request logs are enabled</li>
          <li style={li}>Authentication events (login, logout, password reset, account deletion) are logged</li>
          <li style={li}>Failed authentication attempts are logged for anomaly detection</li>
          <li style={li}>Logs do not contain raw passwords, full credit card numbers, or other sensitive PII in plaintext</li>
          <li style={li}>Log retention is documented and limited to what is operationally necessary</li>
        </ul>

        <h3 style={subheading}>4.6 &mdash; Backup &amp; Recovery</h3>
        <ul style={list}>
          <li style={li}>Turso database has point-in-time recovery enabled per the Turso plan</li>
          <li style={li}>Application code is backed up via GitHub (LegacyLoop/LegacyLoop-MVP and LegacyLoop/LandingSite)</li>
          <li style={li}>Critical configuration is documented in private internal documents</li>
        </ul>

        <h3 style={subheading}>4.7 &mdash; Compliance &amp; Disclosure</h3>
        <ul style={list}>
          <li style={li}>Privacy Policy at <a href="/privacy" style={{ color: '#00BCD4', textDecoration: 'none' }}>legacy-loop.com/privacy</a> is current and accurate</li>
          <li style={li}>Terms of Service at <a href="/terms" style={{ color: '#00BCD4', textDecoration: 'none' }}>legacy-loop.com/terms</a> is current and accurate</li>
          <li style={li}>Data Deletion page at <a href="/data-deletion" style={{ color: '#00BCD4', textDecoration: 'none' }}>legacy-loop.com/data-deletion</a> is current and functional</li>
          <li style={li}>In-app account deletion at app.legacy-loop.com/settings is functional</li>
          <li style={li}>All required regulatory disclosures (GDPR, CCPA) are honored</li>
        </ul>

        <h2 style={heading}>5. Review Documentation</h2>
        <p style={body}>Each review cycle produces a written record stored internally:</p>
        <ul style={list}>
          <li style={li}>Date of review</li>
          <li style={li}>Reviewer name</li>
          <li style={li}>Checklist items completed</li>
          <li style={li}>Findings identified</li>
          <li style={li}>Remediation actions taken or planned</li>
          <li style={li}>Date of next scheduled review</li>
        </ul>
        <p style={body}>Records are retained for a minimum of 24 months.</p>

        <h2 style={heading}>6. Roles &amp; Responsibilities</h2>
        <p style={body}>Legacy-Loop is a single-member LLC. The Founder &amp; CEO holds primary responsibility for security review execution. External vendors and contracted senior developers may be engaged to assist with specialized reviews (e.g., penetration testing, cryptographic review).</p>
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,188,212,0.15)', borderRadius: 12 }}>
            <thead>
              <tr><th style={tableHeader}>Activity</th><th style={tableHeader}>Primary</th><th style={tableHeader}>Support</th></tr>
            </thead>
            <tbody>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Continuous reviews (per release)</td><td style={tableCell}>Founder/CEO</td><td style={tableCell}>Contracted senior developers</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Quarterly reviews</td><td style={tableCell}>Founder/CEO</td><td style={tableCell}>&mdash;</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Annual reviews</td><td style={tableCell}>Founder/CEO</td><td style={tableCell}>Third-party security consultants as needed</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Event-triggered reviews</td><td style={tableCell}>Founder/CEO</td><td style={tableCell}>Engineering staff, legal counsel as needed</td></tr>
              <tr><td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9', borderBottom: 'none' }}>Documentation and record-keeping</td><td style={{ ...tableCell, borderBottom: 'none' }}>Founder/CEO</td><td style={{ ...tableCell, borderBottom: 'none' }}>&mdash;</td></tr>
            </tbody>
          </table>
        </div>

        <h2 style={heading}>7. Independence and Scale Acknowledgment</h2>
        <p style={body}>Legacy-Loop Tech LLC is a single-member LLC operating at early-stage scale. The Security Review Process is designed to be commensurate with this scale while still providing meaningful protection of user data.</p>
        <p style={body}>As Legacy-Loop grows, this process will scale accordingly. Specifically:</p>
        <ul style={list}>
          <li style={li}>At 1,000 active users: Engage a third-party security firm for an annual penetration test</li>
          <li style={li}>At 10,000 active users: Pursue SOC 2 Type I attestation</li>
          <li style={li}>At 50,000 active users: Pursue SOC 2 Type II attestation</li>
          <li style={li}>Upon any material data processing change: Re-evaluate the cadence and depth of this review</li>
        </ul>

        <h2 style={heading}>8. Plan Maintenance</h2>
        <p style={body}>This Security Review Process is reviewed and updated:</p>
        <ul style={list}>
          <li style={li}>Quarterly by the Founder &amp; CEO</li>
          <li style={li}>After any security incident requiring Incident Response Plan activation</li>
          <li style={li}>When material changes occur to the platform, sub-processors, or applicable law</li>
          <li style={li}>At minimum, annually</li>
        </ul>
        <p style={body}>Most recent review: May 16, 2026. Next scheduled review: August 16, 2026.</p>

        <h2 style={heading}>9. Acknowledgment</h2>
        <p style={body}>By operating Legacy-Loop Tech LLC, the Founder &amp; CEO accepts responsibility for the maintenance and execution of this Security Review Process.</p>
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
