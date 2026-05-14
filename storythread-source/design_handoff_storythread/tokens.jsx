// Storythread — shared tokens, helpers, placeholders

const ST = {
  // Light (input flows)
  cream:    '#faf4e8',
  cream2:   '#f3ead8',
  cream3:   '#ebdfc7',
  ink:      '#1f1b16',
  ink70:    '#3e3830',
  ink50:    '#76705f',
  ink30:    '#b2aa97',
  ink15:    '#dfd5bd',
  // Dark (reading)
  mid:      '#15182a',   // base midnight
  mid2:     '#1c2138',
  mid3:     '#262c47',
  paperD:   '#e9dfc9',   // cream-on-dark body
  paperD70: 'rgba(233,223,201,0.66)',
  paperD30: 'rgba(233,223,201,0.32)',
  // Accents
  amber:    '#c9924a',
  amberSoft:'#e5b574',
  ember:    '#a35d3a',   // warmer secondary
  sage:     '#6e8579',   // calm chip color
  dusk:     '#4a4d6b',
};

// Story serif (Newsreader), UI sans (DM Sans), mono for placeholders (IBM Plex Mono).
const FONT_SERIF = '"Newsreader", "Source Serif Pro", Georgia, serif';
const FONT_SANS  = '"DM Sans", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
const FONT_MONO  = '"IBM Plex Mono", ui-monospace, "SF Mono", monospace';

// Striped scene placeholder — for illustrations we don't have yet.
function Scene({ label='scene', h=180, dark=false, accent }) {
  const stripe = dark ? 'rgba(233,223,201,0.07)' : 'rgba(31,27,22,0.05)';
  const bg = dark ? '#1c2138' : '#ebdfc7';
  const fg = accent || (dark ? 'rgba(233,223,201,0.45)' : 'rgba(31,27,22,0.45)');
  return (
    <div style={{
      width:'100%', height:h, borderRadius:6,
      background:`repeating-linear-gradient(135deg, ${stripe} 0 12px, transparent 12px 24px), ${bg}`,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:FONT_MONO, fontSize:10, color:fg, letterSpacing:'.05em',
      textTransform:'uppercase',
    }}>{label}</div>
  );
}

// Generic-looking 16px icon stroke set. Hand-drawn paths kept simple.
function Icon({ name, size=20, color='currentColor', stroke=1.6 }) {
  const p = {
    moon: 'M14.5 12.5A6.5 6.5 0 0 1 7.5 5.5c0-.7.1-1.4.3-2A6.5 6.5 0 1 0 16.5 12.2c-.6.2-1.3.3-2 .3z',
    sparkle: 'M10 3v4M10 13v4M3 10h4M13 10h4M5.5 5.5l2.5 2.5M12 12l2.5 2.5M14.5 5.5L12 8M8 12l-2.5 2.5',
    chevR: 'M8 4l6 6-6 6',
    chevL: 'M12 4l-6 6 6 6',
    plus: 'M10 4v12M4 10h12',
    x:    'M5 5l10 10M15 5L5 15',
    book: 'M3 4h6a2 2 0 0 1 2 2v11a2 2 0 0 0-2-2H3V4zM17 4h-6a2 2 0 0 0-2 2v11a2 2 0 0 1 2-2h6V4z',
    cog:  'M10 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM10 2v2M10 16v2M2 10h2M16 10h2M4.4 4.4l1.4 1.4M14.2 14.2l1.4 1.4M4.4 15.6l1.4-1.4M14.2 5.8l1.4-1.4',
    home: 'M3 9l7-5 7 5v8a1 1 0 0 1-1 1h-3v-5H7v5H4a1 1 0 0 1-1-1V9z',
    heart:'M10 16s-6-3.7-6-8a3.5 3.5 0 0 1 6-2.4A3.5 3.5 0 0 1 16 8c0 4.3-6 8-6 8z',
    user: 'M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 17c0-3.3 2.7-6 6-6s6 2.7 6 6',
    text: 'M5 6h10M5 10h10M5 14h6',
    minus:'M4 10h12',
    check:'M4 10l4 4 8-8',
    eye:  'M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5zM10 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  }[name];
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none"
         stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={p} />
    </svg>
  );
}

// Soft pill button
function Pill({ children, dark=false, primary=false, ghost=false, style={}, ...p }) {
  const bg = primary ? ST.ink : (ghost ? 'transparent' : (dark? 'rgba(233,223,201,0.08)' : ST.cream2));
  const col = primary ? ST.cream : (dark? ST.paperD : ST.ink);
  const border = ghost ? `1px solid ${dark? 'rgba(233,223,201,0.18)' : ST.ink15}` : 'none';
  return (
    <button {...p} style={{
      height:48, padding:'0 20px', borderRadius:14, border, background:bg, color:col,
      fontFamily:FONT_SANS, fontSize:15, fontWeight:500, letterSpacing:'-0.01em',
      display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
      cursor:'pointer', ...style,
    }}>{children}</button>
  );
}

// Section heading inside iOS frame body
function H({ children, dark=false, kicker, mt=0, mb=8, align='left' }) {
  return (
    <div style={{ marginTop:mt, marginBottom:mb, textAlign:align }}>
      {kicker && (
        <div style={{
          fontFamily:FONT_SANS, fontSize:11, fontWeight:500,
          letterSpacing:'.16em', textTransform:'uppercase',
          color: dark? ST.paperD70 : ST.ink50, marginBottom:8,
        }}>{kicker}</div>
      )}
      <div style={{
        fontFamily:FONT_SERIF, fontSize:28, lineHeight:1.12,
        color: dark? ST.paperD : ST.ink, fontWeight:400, letterSpacing:'-0.01em',
      }}>{children}</div>
    </div>
  );
}

// Status bar override so we can tint to match the screen.
function StatusTopPad({ dark=false }){
  // 47px iOS safe area; status bar already inside IOSDevice
  return <div style={{ height: 47 }} />;
}

Object.assign(window, { ST, FONT_SERIF, FONT_SANS, FONT_MONO, Scene, Icon, Pill, H, StatusTopPad });
