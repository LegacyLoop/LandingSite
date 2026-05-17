'use client'

import { useEffect } from 'react'

export default function SecurityHubPage() {
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

  const body: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontWeight: 400,
    fontSize: 17,
    color: '#CBD5E1',
    lineHeight: 1.75,
    marginBottom: 16,
  }

  const cardLink: React.CSSProperties = {
    display: 'block',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(0,188,212,0.15)',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  }

  const cardTitle: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: 20,
    color: '#00BCD4',
    marginBottom: 8,
  }

  const cardBody: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    color: '#CBD5E1',
    lineHeight: 1.6,
    marginBottom: 8,
  }

  const cardMeta: React.CSSProperties = {
    fontFamily: 'var(--font-data)',
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
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
          <a href="/landing" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', textDecoration: 'none' }}>Back to Home</a>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '64px 32px 120px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ fontFamily: 'var(--font-data)', fontWeight: 600, fontSize: 12, color: '#00BCD4', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>LEGACY-LOOP TRUST CENTER</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 48px)', color: '#F1F5F9', margin: '16px 0 12px', lineHeight: 1.2 }}>Security &amp; Trust</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#94A3B8' }}>Effective: May 2026 | legacy-loop.com/security</p>
        </div>

        <h2 style={heading}>Our Commitment</h2>
        <p style={body}>Legacy-Loop Tech LLC takes the security of user data, platform integrity, and third-party data we receive through API integrations seriously. We operate under documented security policies that govern how we detect incidents, conduct reviews, and protect personal information.</p>
        <p style={body}>This page is the canonical entry point for our published security documentation. Each policy is reviewed at minimum quarterly and after any material change to our platform, sub-processors, or applicable law.</p>

        <h2 style={heading}>Published Policies</h2>

        <a href="/security/incident-response" style={cardLink}>
          <span style={cardMeta}>Policy · v1.0 · Effective May 16, 2026</span>
          <h3 style={cardTitle}>Incident Response Plan</h3>
          <p style={cardBody}>How Legacy-Loop detects, contains, investigates, and reports security incidents affecting user data, platform integrity, or third-party data received through APIs including Meta Platform Data, Google OAuth profile data, and payment processor data.</p>
          <span style={{ ...cardMeta, color: '#00BCD4' }}>Read full policy →</span>
        </a>

        <a href="/security/security-review" style={cardLink}>
          <span style={cardMeta}>Policy · v1.0 · Effective May 16, 2026</span>
          <h3 style={cardTitle}>Security Review Process</h3>
          <p style={cardBody}>How Legacy-Loop conducts continuous, quarterly, annual, and event-triggered security reviews to protect user data, platform integrity, and third-party data received through API integrations.</p>
          <span style={{ ...cardMeta, color: '#00BCD4' }}>Read full policy →</span>
        </a>

        <h2 style={heading}>Related Legal Documents</h2>
        <p style={body}>For information on what data we collect and how we use it, see our <a href="/privacy" style={{ color: '#00BCD4', textDecoration: 'none' }}>Privacy Policy</a>. For service terms, see our <a href="/terms" style={{ color: '#00BCD4', textDecoration: 'none' }}>Terms of Service</a>. To request deletion of your data, see <a href="/data-deletion" style={{ color: '#00BCD4', textDecoration: 'none' }}>Data Deletion</a>.</p>

        <h2 style={heading}>Reporting Security Issues</h2>
        <p style={body}>If you have discovered a potential security vulnerability or wish to report a security concern, please contact us at <a href="mailto:support@legacy-loop.com" style={{ color: '#00BCD4', textDecoration: 'none' }}>support@legacy-loop.com</a> with subject line &ldquo;Security Report&rdquo;. We acknowledge receipt within 5 business days and coordinate disclosure responsibly.</p>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', fontStyle: 'italic', marginTop: 48 }}>Last updated: May 16, 2026</p>
      </main>

      <footer style={{ borderTop: '1px solid rgba(0,188,212,0.08)', padding: '32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280' }}>&copy; 2026 Legacy-Loop Tech LLC. All rights reserved. | <a href="/landing" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</a> | <a href="/privacy" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy Policy</a> | <a href="/terms" style={{ color: '#6B7280', textDecoration: 'none' }}>Terms of Service</a> | <a href="/data-deletion" style={{ color: '#6B7280', textDecoration: 'none' }}>Data Deletion</a></p>
      </footer>
    </div>
  )
}
