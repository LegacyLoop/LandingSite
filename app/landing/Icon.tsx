import type { ReactNode } from 'react'

export default function Icon({ name, size = 22, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const common = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const svg = (children: ReactNode) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ display: 'block' }}>{children}</svg>
  )
  switch (name) {
    case 'camera':
      return svg(<><path {...common} d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2l1.2-1.6a1 1 0 0 1 .8-.4h3a1 1 0 0 1 .8.4L13.5 7h6A1.5 1.5 0 0 1 21 8.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><circle {...common} cx="12" cy="13" r="3.2" /></>)
    case 'brain':
      return svg(<><path {...common} d="M9 4a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 5 11a2.5 2.5 0 0 0 1.5 4.5A2.5 2.5 0 0 0 9 19a2 2 0 0 0 2-2V5a1 1 0 0 0-1-1z" /><path {...common} d="M15 4a2.5 2.5 0 0 1 2.5 2.5A2.5 2.5 0 0 1 19 11a2.5 2.5 0 0 1-1.5 4.5A2.5 2.5 0 0 1 15 19a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1z" /></>)
    case 'megaphone':
      return svg(<><path {...common} d="M3 11v2a1 1 0 0 0 1 1h2l7 4V6l-7 4H4a1 1 0 0 0-1 1z" /><path {...common} d="M17 8a5 5 0 0 1 0 8" /><path {...common} d="M7 14v3a1 1 0 0 0 1 1h1" /></>)
    case 'box':
      return svg(<><path {...common} d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path {...common} d="M4 7.5l8 4.5 8-4.5" /><path {...common} d="M12 12v9" /></>)
    case 'mailbox':
      return svg(<><path {...common} d="M4 10a4 4 0 0 1 8 0v8H6a2 2 0 0 1-2-2z" /><path {...common} d="M12 10h6a2 2 0 0 1 2 2v6h-8" /><path {...common} d="M7 10v3" /><path {...common} d="M15 14v4" /></>)
    case 'truck':
      return svg(<><path {...common} d="M3 6h11v9H3z" /><path {...common} d="M14 9h4l3 3v3h-7z" /><circle {...common} cx="7" cy="18" r="1.6" /><circle {...common} cx="17" cy="18" r="1.6" /></>)
    case 'robot':
      return svg(<><rect {...common} x="5" y="8" width="14" height="10" rx="2" /><path {...common} d="M12 4v4" /><circle {...common} cx="12" cy="4" r="1" /><path {...common} d="M9 12v2M15 12v2" /><path {...common} d="M3 12v3M21 12v3" /></>)
    case 'ruler':
      return svg(<><path {...common} d="M4 14L14 4l6 6L10 20z" /><path {...common} d="M8 8l2 2M11 5l2 2M6 12l2 2M13 11l2 2" /></>)
    case 'home':
      return svg(<><path {...common} d="M4 11l8-7 8 7" /><path {...common} d="M6 10v9h12v-9" /><path {...common} d="M10 19v-5h4v5" /></>)
    case 'tag':
      return svg(<><path {...common} d="M3 12V4h8l9 9-7 7-9-9z" /><circle {...common} cx="7.5" cy="7.5" r="1.4" /></>)
    case 'search':
      return svg(<><circle {...common} cx="11" cy="11" r="7" /><path {...common} d="M16.5 16.5L21 21" /></>)
    case 'chart':
      return svg(<><path {...common} d="M4 4v16h16" /><path {...common} d="M8 15v-4M12 15V8M16 15v-6" /></>)
    case 'note':
      return svg(<><rect {...common} x="5" y="3" width="14" height="18" rx="2" /><path {...common} d="M9 8h6M9 12h6M9 16h4" /></>)
    case 'target':
      return svg(<><circle {...common} cx="12" cy="12" r="8" /><circle {...common} cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1.2" fill={color} stroke="none" /></>)
    case 'satellite':
      return svg(<><path {...common} d="M5 15l4-4 4 4-4 4-4-4z" /><path {...common} d="M7 9l3-3M11 13l3-3" /><path {...common} d="M13 5a6 6 0 0 1 6 6" /><path {...common} d="M13 8a3 3 0 0 1 3 3" /></>)
    case 'star':
      return svg(<path {...common} d="M12 3l2.5 5.5 6 .5-4.5 4 1.4 6-5.4-3.2L6.1 19l1.4-6L3 9l6-.5z" />)
    case 'film':
      return svg(<><rect {...common} x="3" y="5" width="18" height="14" rx="2" /><path {...common} d="M7 5v14M17 5v14M3 10h4M17 10h4M3 14h4M17 14h4" /></>)
    case 'car':
      return svg(<><path {...common} d="M4 15l1.5-5a2 2 0 0 1 2-1.5h9a2 2 0 0 1 2 1.5L20 15" /><path {...common} d="M3 15h18v3H3z" /><circle {...common} cx="7.5" cy="18" r="1.4" /><circle {...common} cx="16.5" cy="18" r="1.4" /></>)
    case 'broadcast':
      return svg(<><circle {...common} cx="12" cy="12" r="2" /><path {...common} d="M8 8a5.5 5.5 0 0 0 0 8M16 8a5.5 5.5 0 0 1 0 8" /><path {...common} d="M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14" /></>)
    case 'chat':
      return svg(<><path {...common} d="M4 5h16v11H9l-4 4v-4H4z" /><path {...common} d="M8 9h8M8 12h5" /></>)
    case 'bolt':
      return svg(<path {...common} d="M13 3L5 13h5l-1 8 8-11h-5z" />)
    case 'bell':
      return svg(<><path {...common} d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path {...common} d="M10 20a2 2 0 0 0 4 0" /></>)
    case 'vase':
      return svg(<><path {...common} d="M8 3h8M9 3c0 2-2 3-2 6a5 5 0 0 0 10 0c0-3-2-4-2-6" /><path {...common} d="M9 12h6" /></>)
    case 'globe':
      return svg(<><circle {...common} cx="12" cy="12" r="8" /><path {...common} d="M4 12h16M12 4a13 13 0 0 1 0 16M12 4a13 13 0 0 0 0 16" /></>)
    case 'medal':
      return svg(<><circle {...common} cx="12" cy="14" r="5" /><path {...common} d="M9 9L6 3M15 9l3-6M10 3l2 4 2-4" /><path {...common} d="M12 12l.8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.9-1.6.9.3-1.7-1.2-1.2 1.7-.2z" /></>)
    case 'sparkle':
      return svg(<><path {...common} d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" /><path {...common} d="M18 15l.7 1.8L20.5 18l-1.8.7L18 20.5l-.7-1.8L15.5 18l1.8-.7z" /></>)
    case 'tree':
      return svg(<><path {...common} d="M12 3l5 7h-3l3 5H7l3-5H7z" /><path {...common} d="M12 15v5" /></>)
    case 'faith':
      return svg(<path {...common} d="M12 3v18M8 8h8" />)
    case 'heart':
      return svg(<path {...common} d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5c0 5-7 9.5-7 9.5z" />)
    case 'handshake':
      return svg(<><path {...common} d="M12 8l3-2 5 4-2 2" /><path {...common} d="M12 8L9 6 4 10l2 2" /><path {...common} d="M6 12l3 3 2-2 2 2 2-2 3 2" /></>)
    case 'apple':
      return svg(<><path {...common} d="M16 13c0 3-2 6-4 6-1 0-1.5-.6-2.5-.6S8 19 7 19c-2 0-4-3-4-6s2-5 4-5c1 0 1.7.6 2.5.6S11 8 12 8s4 2 4 5z" /><path {...common} d="M12 8c0-2 1.5-3.5 3-3.5" /></>)
    case 'laptop':
      return svg(<><rect {...common} x="5" y="5" width="14" height="10" rx="1.5" /><path {...common} d="M3 19h18" /></>)
    case 'lock':
      return svg(<><rect {...common} x="5" y="10" width="14" height="10" rx="2" /><path {...common} d="M8 10V8a4 4 0 0 1 8 0v2" /></>)
    case 'shield':
      return svg(<><path {...common} d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" /><path {...common} d="M9 12l2 2 4-4" /></>)
    case 'book':
      return svg(<><path {...common} d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2z" /><path {...common} d="M20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2z" /></>)
    case 'mail':
      return svg(<><rect {...common} x="3" y="5" width="18" height="14" rx="2" /><path {...common} d="M3 7l9 6 9-6" /></>)
    case 'check':
      return svg(<path {...common} d="M4 12l5 5L20 6" />)
    case 'close':
      return svg(<path {...common} d="M6 6l12 12M18 6L6 18" />)
    case 'menu':
      return svg(<path {...common} d="M4 7h16M4 12h16M4 17h16" />)
    case 'clock':
      return svg(<><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M12 7v5l3 2" /></>)
    default:
      return svg(<circle {...common} cx="12" cy="12" r="7" />)
  }
}
