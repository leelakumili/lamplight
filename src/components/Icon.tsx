import React from 'react'

interface IconProps {
  name: string
  size?: number
  color?: string
  strokeWidth?: number
  style?: React.CSSProperties
}

export function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 1.6, style }: IconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 26 26',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style,
  }

  switch (name) {
    case 'moon':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )
    case 'chevron-left':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      )
    case 'chevron-right':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    case 'sparkle':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2H22l-6.4 4.8 2.4 7.2-6.4-4.8L5.2 21l2.4-7.2L1.2 9h7.4z" />
        </svg>
      )
    case 'eye':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'eye-off':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      )
    case 'check':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    case 'x':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )
    case 'book':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    case 'type':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      )
    case 'trash':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      )
    case 'speaker':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      )
    case 'pause':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <rect x="6" y="4" width="4" height="16"/>
          <rect x="14" y="4" width="4" height="16"/>
        </svg>
      )
    case 'bookmark':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      )
    case 'share':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      )
    case 'chevron-down':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      )
    // Theme SVG marks (26×26 viewBox)
    case 'arc':
      return (
        <svg width={size} height={size} viewBox="0 0 26 26" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
          <path d="M3 19a10 10 0 0 1 20 0" stroke={color} />
          <circle cx="13" cy="19" r="1.6" fill={color} stroke="none" />
        </svg>
      )
    case 'crack':
      return (
        <svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
          <path d="M5 4l4 6-3 4 5 4-2 4" />
        </svg>
      )
    case 'knot':
      return (
        <svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
          <circle cx="9" cy="13" r="5" />
          <circle cx="17" cy="13" r="5" />
        </svg>
      )
    case 'echo':
      return (
        <svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
          <circle cx="13" cy="13" r="3" />
          <circle cx="13" cy="13" r="7" />
          <circle cx="13" cy="13" r="11" />
        </svg>
      )
    case 'wave':
      return (
        <svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
          <path d="M3 13c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
        </svg>
      )
    case 'spark':
      return (
        <svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
          <path d="M13 4v6M13 16v6M4 13h6M16 13h6" />
        </svg>
      )
    case 'horizon':
      return (
        <svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
          <circle cx="13" cy="15" r="5" />
          <path d="M3 21h20" />
        </svg>
      )
    case 'door':
      return (
        <svg width={size} height={size} viewBox="0 0 26 26" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
          <path d="M7 4h12v18H7z" />
          <path d="M14 13.5v1" />
        </svg>
      )
    default:
      return null
  }
}
