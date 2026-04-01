'use client'

import { useEffect } from 'react'

export default function PrivacyPolicyPage() {
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
    fontSize: 17,
    color: '#CBD5E1',
    lineHeight: 1.75,
    paddingLeft: 24,
    marginBottom: 16,
  }

  const li: React.CSSProperties = {
    marginBottom: 6,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Nav */}
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
            <img src="/logos/LegacyLoop-Logo-Master-Outlines-transparent-05.png" alt="LegacyLoop" style={{ height: 32, objectFit: 'contain' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 18, color: '#FFFFFF' }}>Legacy-Loop</span>
          </a>
          <a href="/landing" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', textDecoration: 'none' }}>Back to Home</a>
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '64px 32px 120px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ fontFamily: 'var(--font-data)', fontWeight: 600, fontSize: 12, color: '#00BCD4', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>LEGACYLOOP LEGAL</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 48px)', color: '#F1F5F9', margin: '16px 0 12px', lineHeight: 1.2 }}>Privacy Policy</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#94A3B8' }}>Effective: March 2026 | legacy-loop.com/privacy</p>
        </div>

        {/* Section 1 */}
        <h2 style={heading}>1. Introduction</h2>
        <p style={body}>LegacyLoop (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the LegacyLoop platform accessible at legacy-loop.com (the &ldquo;Service&rdquo;). We are committed to protecting your personal information and your right to privacy.</p>
        <p style={body}>This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it. Please read it carefully. If you disagree with its terms, please discontinue use of our Service.</p>

        {/* Section 2 */}
        <h2 style={heading}>2. Information We Collect</h2>
        <h3 style={subheading}>Information You Provide</h3>
        <ul style={list}>
          <li style={li}>Account registration: name, email address, password</li>
          <li style={li}>Profile information: address, phone number, seller preferences</li>
          <li style={li}>Item listings: photos, item descriptions, pricing preferences</li>
          <li style={li}>Communications: messages sent through our platform</li>
          <li style={li}>Payment information: processed through Square — we do not store full payment card details</li>
        </ul>
        <h3 style={subheading}>Information Collected Automatically</h3>
        <ul style={list}>
          <li style={li}>Device and browser information</li>
          <li style={li}>IP address and approximate location</li>
          <li style={li}>Pages visited and features used within the Service</li>
          <li style={li}>Referring URLs and session data</li>
          <li style={li}>Cookies and similar tracking technologies</li>
        </ul>
        <h3 style={subheading}>Information from Third Parties</h3>
        <ul style={list}>
          <li style={li}>Facebook and Instagram: if you connect your accounts, we receive basic profile and page information as permitted by Meta&apos;s policies</li>
          <li style={li}>eBay and other marketplace integrations: listing and pricing data used to improve valuation accuracy</li>
          <li style={li}>Square: payment confirmation and transaction identifiers</li>
        </ul>

        {/* Section 3 */}
        <h2 style={heading}>3. How We Use Your Information</h2>
        <p style={body}>We use the information we collect to:</p>
        <ul style={list}>
          <li style={li}>Provide, operate, and maintain the LegacyLoop platform</li>
          <li style={li}>Process and complete transactions</li>
          <li style={li}>Send transactional emails and service notifications</li>
          <li style={li}>Improve, personalize, and expand our Service</li>
          <li style={li}>Understand and analyze how you use our Service</li>
          <li style={li}>Develop new products, services, and features</li>
          <li style={li}>Communicate with you for customer support, updates, and marketing (with your consent)</li>
          <li style={li}>Process payments and prevent fraudulent transactions</li>
          <li style={li}>Comply with legal obligations</li>
        </ul>

        {/* Section 4 */}
        <h2 style={heading}>4. Sharing Your Information</h2>
        <p style={body}>We do not sell your personal information. We may share your information in the following limited circumstances:</p>
        <ul style={list}>
          <li style={li}>Service providers: companies that help us operate (Square for payments, Resend for email, Shippo for shipping, Supabase for data storage) under strict confidentiality agreements</li>
          <li style={li}>Platform integrations: when you authorize connections to Facebook, Instagram, eBay, or other platforms</li>
          <li style={li}>Legal requirements: when required by law, subpoena, or to protect the rights and safety of our users</li>
          <li style={li}>Business transfers: in connection with a merger, acquisition, or sale of assets — you will be notified beforehand</li>
        </ul>

        {/* Section 5 */}
        <h2 style={heading}>5. Data Retention</h2>
        <p style={body}>We retain your personal information for as long as your account is active or as needed to provide you Services. You may request deletion of your account and associated data at any time. See Section 9 for instructions.</p>
        <p style={body}>Some information may be retained for longer periods where required by law or for legitimate business purposes such as fraud prevention and financial record-keeping.</p>

        {/* Section 6 */}
        <h2 style={heading}>6. Cookies</h2>
        <p style={body}>We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser. Note that disabling certain cookies may affect the functionality of our Service.</p>
        <ul style={list}>
          <li style={li}>Essential cookies: required for the platform to function</li>
          <li style={li}>Analytics cookies: help us understand usage patterns</li>
          <li style={li}>Preference cookies: remember your settings and preferences</li>
        </ul>

        {/* Section 7 */}
        <h2 style={heading}>7. Facebook and Meta Platform</h2>
        <p style={body}>LegacyLoop may integrate with Facebook and Instagram through Meta&apos;s official APIs. When you connect your Facebook or Instagram account:</p>
        <ul style={list}>
          <li style={li}>We access only the permissions you explicitly grant</li>
          <li style={li}>We use this access to post content to your connected pages and accounts on your behalf</li>
          <li style={li}>We do not access your personal messages, friends list, or private profile information</li>
          <li style={li}>You may revoke this access at any time through your Facebook or Instagram settings</li>
        </ul>
        <p style={body}>Our use of information received from Meta APIs complies with Meta&apos;s Platform Terms and Developer Policies.</p>

        {/* Section 8 */}
        <h2 style={heading}>8. Your Privacy Rights</h2>
        <p style={body}>Depending on your location, you may have the following rights:</p>
        <ul style={list}>
          <li style={li}>Access: request a copy of the personal data we hold about you</li>
          <li style={li}>Correction: request correction of inaccurate or incomplete data</li>
          <li style={li}>Deletion: request deletion of your personal data (see Section 9)</li>
          <li style={li}>Portability: receive your data in a structured, machine-readable format</li>
          <li style={li}>Objection: object to certain types of processing, including marketing</li>
          <li style={li}>Restriction: request that we limit how we use your data</li>
        </ul>
        <p style={body}>To exercise these rights, contact us at: privacy@legacy-loop.com or hello@legacy-loop.com</p>

        {/* Section 9 */}
        <h2 style={heading}>9. Data Deletion</h2>
        <p style={body}>You have the right to request deletion of your personal data at any time. To do so:</p>
        <ol style={{ ...list, listStyleType: 'decimal' }}>
          <li style={li}>Email us at: hello@legacy-loop.com with subject line &ldquo;Data Deletion Request&rdquo;</li>
          <li style={li}>Include your full name and the email address associated with your account</li>
          <li style={li}>We will confirm receipt within 5 business days</li>
          <li style={li}>Deletion will be completed within 30 days of your request</li>
          <li style={li}>We will send confirmation when deletion is complete</li>
        </ol>
        <p style={body}>You may also submit a deletion request at: legacy-loop.com/data-deletion</p>

        {/* Section 10 */}
        <h2 style={heading}>10. Children&apos;s Privacy</h2>
        <p style={body}>LegacyLoop is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately at hello@legacy-loop.com and we will take steps to delete that information.</p>

        {/* Section 11 */}
        <h2 style={heading}>11. Security</h2>
        <p style={body}>We implement commercially reasonable technical and organizational measures to protect your personal information against unauthorized access, loss, or alteration. These include encrypted data storage, secure HTTPS connections, and access controls.</p>
        <p style={body}>However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security and encourage you to use strong passwords and keep your account credentials confidential.</p>

        {/* Section 12 */}
        <h2 style={heading}>12. Changes to This Policy</h2>
        <p style={body}>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the effective date. We encourage you to review this policy periodically.</p>

        {/* Section 13 */}
        <h2 style={heading}>13. Contact Us</h2>
        <p style={body}>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,188,212,0.15)', borderRadius: 12, padding: 24, marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px 24px', fontFamily: 'var(--font-body)', fontSize: 15 }}>
            <span style={{ color: '#94A3B8' }}>Email</span>
            <a href="mailto:hello@legacy-loop.com" style={{ color: '#00BCD4', textDecoration: 'none' }}>hello@legacy-loop.com</a>
            <span style={{ color: '#94A3B8' }}>Support Email</span>
            <a href="mailto:support@legacy-loop.com" style={{ color: '#00BCD4', textDecoration: 'none' }}>support@legacy-loop.com</a>
            <span style={{ color: '#94A3B8' }}>Website</span>
            <span style={{ color: '#CBD5E1' }}>legacy-loop.com</span>
            <span style={{ color: '#94A3B8' }}>Mailing Address</span>
            <span style={{ color: '#CBD5E1' }}>LegacyLoop, Maine, USA</span>
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', fontStyle: 'italic', marginTop: 24 }}>Last updated: March 2026</p>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(0,188,212,0.08)', padding: '32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280' }}>&copy; 2026 LegacyLoop Tech LLC. All rights reserved. | <a href="/landing" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</a> | <a href="/terms" style={{ color: '#6B7280', textDecoration: 'none' }}>Terms of Service</a></p>
      </footer>
    </div>
  )
}
