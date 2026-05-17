'use client'

import { useEffect } from 'react'

export default function DataDeletionPage() {
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

  const tableCell: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 16,
    color: '#CBD5E1',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(0,188,212,0.12)',
    textAlign: 'left' as const,
    verticalAlign: 'top' as const,
  }

  const tableHeader: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: 14,
    color: '#00BCD4',
    padding: '12px 16px',
    textAlign: 'left' as const,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    borderBottom: '2px solid rgba(0,188,212,0.3)',
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
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,188,212,0.08)',
      }}>
        <div style={{ maxWidth: 800, width: '100%', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/landing" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logos/LegacyLoop-Logo-Master-Outlines-transparent-05.png" alt="Legacy-Loop" style={{ height: 32, objectFit: 'contain' }} />
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
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 48px)', color: '#F1F5F9', margin: '16px 0 12px', lineHeight: 1.2 }}>Data Deletion</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#94A3B8' }}>Effective: March 2026 | legacy-loop.com/data-deletion</p>
        </div>

        {/* Section 1 */}
        <h2 style={heading}>1. Your Right to Deletion</h2>
        <p style={body}>Legacy-Loop respects your right to have your personal data deleted. This right is protected under the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and Meta Platform Policy. You can request complete deletion of your account and all associated data at any time.</p>
        <p style={body}>This page provides the canonical instructions for submitting a data deletion request, as referenced in Section 9 of our <a href="/privacy" style={{ color: '#00BCD4', textDecoration: 'none' }}>Privacy Policy</a>.</p>

        {/* Section 2 */}
        <h2 style={heading}>2. How to Request Data Deletion</h2>

        <h3 style={subheading}>Option 1: Email Request</h3>
        <ol style={{ ...list, listStyleType: 'decimal' }}>
          <li style={li}>Send an email to <a href="mailto:support@legacy-loop.com" style={{ color: '#00BCD4', textDecoration: 'none' }}>support@legacy-loop.com</a></li>
          <li style={li}>Subject line: &ldquo;Data Deletion Request&rdquo;</li>
          <li style={li}>Include the email address associated with your Legacy-Loop account</li>
          <li style={li}>Include any specific data you want deleted (or request full account deletion)</li>
          <li style={li}>We will confirm receipt within 5 business days</li>
        </ol>

        <h3 style={subheading}>Option 2: In-App Account Settings</h3>
        <p style={body}>If you have an active Legacy-Loop account, you can initiate immediate deletion directly from the app:</p>
        <ol style={{ ...list, listStyleType: 'decimal' }}>
          <li style={li}>Log in at <a href="https://app.legacy-loop.com" style={{ color: '#00BCD4', textDecoration: 'none' }}>app.legacy-loop.com</a></li>
          <li style={li}>Navigate to <strong style={{ color: '#F1F5F9' }}>Settings</strong></li>
          <li style={li}>Select <strong style={{ color: '#F1F5F9' }}>Delete My Account</strong></li>
          <li style={li}>Confirm by re-entering your account email</li>
          <li style={li}>Deletion is initiated immediately</li>
        </ol>

        {/* Section 3 */}
        <h2 style={heading}>3. What Happens After You Request Deletion</h2>
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,188,212,0.15)', borderRadius: 12 }}>
            <thead>
              <tr>
                <th style={tableHeader}>Timeline</th>
                <th style={tableHeader}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Within 5 business days</td>
                <td style={tableCell}>We confirm receipt of your deletion request</td>
              </tr>
              <tr>
                <td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Within 30 days</td>
                <td style={tableCell}>All personal data is permanently deleted from our systems</td>
              </tr>
              <tr>
                <td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9' }}>Within 30 days</td>
                <td style={tableCell}>Data shared with Meta (Facebook/Instagram) connections is removed</td>
              </tr>
              <tr>
                <td style={{ ...tableCell, fontWeight: 600, color: '#F1F5F9', borderBottom: 'none' }}>After completion</td>
                <td style={{ ...tableCell, borderBottom: 'none' }}>Confirmation email sent to your registered email address</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4 */}
        <h2 style={heading}>4. Data We May Retain</h2>
        <p style={body}>In limited circumstances, we may retain certain data as required by law or for legitimate business purposes:</p>
        <ul style={list}>
          <li style={li}><strong style={{ color: '#F1F5F9' }}>Legal requirements:</strong> Transaction records required for tax and financial reporting</li>
          <li style={li}><strong style={{ color: '#F1F5F9' }}>Fraud prevention:</strong> Data needed to prevent fraud or enforce our Terms of Service</li>
          <li style={li}><strong style={{ color: '#F1F5F9' }}>Anonymized data:</strong> Aggregated, anonymized analytics data that cannot identify you</li>
          <li style={li}><strong style={{ color: '#F1F5F9' }}>Backups:</strong> Encrypted backups are purged on a rolling schedule (typically within 90 days)</li>
        </ul>

        {/* Section 5 */}
        <h2 style={heading}>5. Facebook and Instagram Data</h2>
        <p style={body}>If you connected your Facebook or Instagram account to Legacy-Loop, we will remove all data obtained through those connections within 30 days of your deletion request. Our use of Meta-provided data complies with Meta&apos;s Platform Terms and Developer Policies.</p>
        <p style={body}>You can also revoke Legacy-Loop&apos;s access to your Meta accounts directly:</p>
        <h3 style={subheading}>Revoke via Facebook</h3>
        <ol style={{ ...list, listStyleType: 'decimal' }}>
          <li style={li}>Go to <strong style={{ color: '#F1F5F9' }}>Facebook Settings</strong> → <strong style={{ color: '#F1F5F9' }}>Apps and Websites</strong></li>
          <li style={li}>Find &ldquo;Legacy-Loop&rdquo; in your active apps list</li>
          <li style={li}>Click <strong style={{ color: '#F1F5F9' }}>Remove</strong> to revoke access</li>
        </ol>
        <h3 style={subheading}>Revoke via Instagram</h3>
        <ol style={{ ...list, listStyleType: 'decimal' }}>
          <li style={li}>Go to <strong style={{ color: '#F1F5F9' }}>Instagram Settings</strong> → <strong style={{ color: '#F1F5F9' }}>Security</strong> → <strong style={{ color: '#F1F5F9' }}>Apps and Websites</strong></li>
          <li style={li}>Find &ldquo;Legacy-Loop&rdquo; under Active</li>
          <li style={li}>Tap <strong style={{ color: '#F1F5F9' }}>Remove</strong> to revoke access</li>
        </ol>
        <p style={body}>Revoking access in Meta&apos;s settings stops future data sharing but does not delete data we may have already stored. To request deletion of stored data, follow the steps in Section 2.</p>

        {/* Section 6 */}
        <h2 style={heading}>6. Third-Party Marketplace Data</h2>
        <p style={body}>If you connected eBay, Mercari, Poshmark, or other marketplace accounts to Legacy-Loop, we will remove all stored credentials and listing data associated with your account within 30 days of your deletion request. We recommend you also revoke Legacy-Loop&apos;s access via each marketplace&apos;s app authorization settings.</p>

        {/* Section 7 */}
        <h2 style={heading}>7. Contact Us</h2>
        <p style={body}>Questions about data deletion? Contact us:</p>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,188,212,0.15)', borderRadius: 12, padding: 24, marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px 24px', fontFamily: 'var(--font-body)', fontSize: 15 }}>
            <span style={{ color: '#94A3B8' }}>Email</span>
            <a href="mailto:support@legacy-loop.com" style={{ color: '#00BCD4', textDecoration: 'none' }}>support@legacy-loop.com</a>
            <span style={{ color: '#94A3B8' }}>Website</span>
            <span style={{ color: '#CBD5E1' }}>legacy-loop.com</span>
            <span style={{ color: '#94A3B8' }}>Mailing Address</span>
            <span style={{ color: '#CBD5E1' }}>Legacy-Loop Tech LLC, Maine, USA</span>
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', fontStyle: 'italic', marginTop: 24 }}>Last updated: March 2026</p>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(0,188,212,0.08)', padding: '32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280' }}>&copy; 2026 Legacy-Loop Tech LLC. All rights reserved. | <a href="/landing" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</a> | <a href="/security" style={{ color: '#6B7280', textDecoration: 'none' }}>Security</a> | <a href="/privacy" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy Policy</a> | <a href="/terms" style={{ color: '#6B7280', textDecoration: 'none' }}>Terms of Service</a></p>
      </footer>
    </div>
  )
}
