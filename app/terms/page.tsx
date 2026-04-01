'use client'

import { useEffect } from 'react'

export default function TermsOfServicePage() {
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

  const caps: React.CSSProperties = {
    ...body,
    fontWeight: 500,
    fontSize: 15,
    color: '#94A3B8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.01em',
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
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 48px)', color: '#F1F5F9', margin: '16px 0 12px', lineHeight: 1.2 }}>Terms of Service</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#94A3B8' }}>Effective: March 2026 | legacy-loop.com/terms</p>
        </div>

        <div style={{ background: 'rgba(0,188,212,0.05)', border: '1px solid rgba(0,188,212,0.15)', borderRadius: 12, padding: '16px 20px', marginBottom: 48 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#CBD5E1', margin: 0, lineHeight: 1.6 }}>Please read these Terms of Service carefully before using LegacyLoop. By accessing or using our platform, you agree to be bound by these Terms.</p>
        </div>

        {/* Section 1 */}
        <h2 style={heading}>1. Agreement to Terms</h2>
        <p style={body}>These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you and LegacyLoop (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) governing your access to and use of legacy-loop.com and all related services (collectively, the &ldquo;Service&rdquo;).</p>
        <p style={body}>By creating an account, accessing, or using the Service, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, do not use the Service.</p>

        {/* Section 2 */}
        <h2 style={heading}>2. Description of Service</h2>
        <p style={body}>LegacyLoop is an AI-powered resale automation platform designed to help individuals and families sell secondhand items, manage estate sales, and conduct garage and yard sales. The Service includes:</p>
        <ul style={list}>
          <li style={li}>AI-powered item identification and valuation</li>
          <li style={li}>Automated listing generation</li>
          <li style={li}>Shipping coordination and label creation</li>
          <li style={li}>Buyer outreach and matching tools</li>
          <li style={li}>Dashboard and inventory management tools</li>
          <li style={li}>Integration with third-party marketplaces and social platforms</li>
        </ul>

        {/* Section 3 */}
        <h2 style={heading}>3. User Accounts</h2>
        <h3 style={subheading}>Account Creation</h3>
        <p style={body}>To access certain features, you must create an account. You agree to provide accurate, complete, and current information and to update it as necessary.</p>
        <h3 style={subheading}>Account Security</h3>
        <p style={body}>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately at support@legacy-loop.com if you suspect unauthorized access.</p>
        <h3 style={subheading}>Account Termination</h3>
        <p style={body}>We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or harm other users.</p>

        {/* Section 4 */}
        <h2 style={heading}>4. Acceptable Use</h2>
        <p style={body}>You agree to use the Service only for lawful purposes. You may NOT:</p>
        <ul style={list}>
          <li style={li}>Post false, misleading, or fraudulent item listings</li>
          <li style={li}>Sell prohibited, illegal, or stolen items</li>
          <li style={li}>Harass, abuse, or harm other users</li>
          <li style={li}>Attempt to access systems or data you are not authorized to access</li>
          <li style={li}>Use automated bots, scrapers, or scripts without our written permission</li>
          <li style={li}>Circumvent or interfere with security features of the Service</li>
          <li style={li}>Use the Service to send spam or unsolicited communications</li>
          <li style={li}>Violate any applicable local, state, national, or international law</li>
        </ul>

        {/* Section 5 */}
        <h2 style={heading}>5. Seller Responsibilities</h2>
        <p style={body}>As a seller using LegacyLoop, you acknowledge and agree that:</p>
        <ul style={list}>
          <li style={li}>You have the legal right to sell the items you list</li>
          <li style={li}>Item descriptions and photos must be accurate and honest</li>
          <li style={li}>You are responsible for fulfilling sales you commit to</li>
          <li style={li}>LegacyLoop&apos;s AI valuations are estimates only — final pricing decisions are yours</li>
          <li style={li}>You are responsible for collecting and remitting any applicable sales taxes</li>
          <li style={li}>You are responsible for proper packing and shipping of sold items</li>
        </ul>

        {/* Section 6 */}
        <h2 style={heading}>6. Fees and Payments</h2>
        <p style={body}>LegacyLoop operates on a tiered service model. Applicable fees, commission rates, and subscription terms are described at legacy-loop.com and in your account dashboard. By using paid features, you agree to those fees.</p>
        <p style={body}>Payments are processed through Square. By making a payment, you also agree to Square&apos;s terms of service. LegacyLoop does not store your full payment card information.</p>

        {/* Section 7 */}
        <h2 style={heading}>7. AI Features and Accuracy</h2>
        <p style={body}>LegacyLoop uses artificial intelligence to provide item identification, valuation estimates, listing suggestions, and other automated features. You acknowledge that:</p>
        <ul style={list}>
          <li style={li}>AI-generated valuations are estimates and not guaranteed</li>
          <li style={li}>AI item identification may not always be accurate</li>
          <li style={li}>You retain final responsibility for all listing decisions and pricing</li>
          <li style={li}>LegacyLoop is not liable for losses arising from reliance on AI-generated outputs</li>
        </ul>

        {/* Section 8 */}
        <h2 style={heading}>8. Third-Party Integrations</h2>
        <p style={body}>The Service integrates with third-party platforms including Facebook, Instagram, eBay, Square, Shippo, and others. Use of these integrations is subject to the respective third-party terms of service. LegacyLoop is not responsible for the actions, content, or policies of third-party platforms.</p>

        {/* Section 9 */}
        <h2 style={heading}>9. Intellectual Property</h2>
        <p style={body}>The LegacyLoop name, logo, platform design, software, and content created by us are protected by intellectual property laws and owned by LegacyLoop. You may not copy, reproduce, or distribute our proprietary materials without written permission.</p>
        <p style={body}>You retain ownership of content you upload (photos, descriptions). By uploading content, you grant LegacyLoop a non-exclusive license to use, display, and distribute that content for the purposes of operating the Service.</p>

        {/* Section 10 */}
        <h2 style={heading}>10. Disclaimers</h2>
        <p style={caps}>THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, LEGACYLOOP DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>

        {/* Section 11 */}
        <h2 style={heading}>11. Limitation of Liability</h2>
        <p style={caps}>TO THE FULLEST EXTENT PERMITTED BY LAW, LEGACYLOOP SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
        <p style={body}>Our total liability to you for any claim arising from use of the Service shall not exceed the amount you paid to LegacyLoop in the twelve months preceding the claim.</p>

        {/* Section 12 */}
        <h2 style={heading}>12. Indemnification</h2>
        <p style={body}>You agree to indemnify, defend, and hold harmless LegacyLoop and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys&apos; fees) arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.</p>

        {/* Section 13 */}
        <h2 style={heading}>13. Governing Law</h2>
        <p style={body}>These Terms are governed by and construed in accordance with the laws of the State of Maine, United States, without regard to conflict of law provisions. Any disputes shall be resolved in the courts of Maine.</p>

        {/* Section 14 */}
        <h2 style={heading}>14. Changes to Terms</h2>
        <p style={body}>We may modify these Terms at any time. We will notify you of material changes by email or by posting a notice on the platform. Continued use of the Service after changes take effect constitutes acceptance of the new Terms.</p>

        {/* Section 15 */}
        <h2 style={heading}>15. Contact Us</h2>
        <p style={body}>Questions about these Terms? Contact us:</p>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,188,212,0.15)', borderRadius: 12, padding: 24, marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px 24px', fontFamily: 'var(--font-body)', fontSize: 15 }}>
            <span style={{ color: '#94A3B8' }}>Email</span>
            <a href="mailto:hello@legacy-loop.com" style={{ color: '#00BCD4', textDecoration: 'none' }}>hello@legacy-loop.com</a>
            <span style={{ color: '#94A3B8' }}>Legal Inquiries</span>
            <a href="mailto:ryan@legacy-loop.com" style={{ color: '#00BCD4', textDecoration: 'none' }}>ryan@legacy-loop.com</a>
            <span style={{ color: '#94A3B8' }}>Website</span>
            <span style={{ color: '#CBD5E1' }}>legacy-loop.com</span>
            <span style={{ color: '#94A3B8' }}>Address</span>
            <span style={{ color: '#CBD5E1' }}>LegacyLoop, Maine, USA</span>
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', fontStyle: 'italic', marginTop: 24 }}>Last updated: March 2026</p>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(0,188,212,0.08)', padding: '32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280' }}>&copy; 2026 LegacyLoop Tech LLC. All rights reserved. | <a href="/landing" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</a> | <a href="/privacy" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy Policy</a></p>
      </footer>
    </div>
  )
}
