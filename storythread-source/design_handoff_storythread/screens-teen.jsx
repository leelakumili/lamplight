// Teen mode theme picker + Loading screen

function TeenThemes() {
  // 8 themes — concise titles, one-line subs, named visual mark (not childish emoji)
  const themes = [
    { t:'Left out',         s:'When no one saved you a seat.',          mark:'arc',   hue:'#6e8579' },
    { t:'Someone was mean', s:'A line that didn\'t leave your head.',   mark:'crack', hue:'#a35d3a' },
    { t:'Friend drama',     s:'Things shifted and you can feel it.',    mark:'knot',  hue:'#c9924a' },
    { t:'Misunderstood',    s:'You meant one thing. They heard another.',mark:'echo', hue:'#4a4d6b' },
    { t:'Too much noise',   s:'Your head needs the volume down.',        mark:'wave',  hue:'#6e8579' },
    { t:'A small win',      s:'Something good. Worth a real story.',     mark:'spark', hue:'#c9924a' },
    { t:'Tomorrow looms',   s:'A thing on the calendar you\'re bracing for.', mark:'horizon', hue:'#4a4d6b' },
    { t:'Just somewhere else', s:'No prompt. Take me out of today.',     mark:'door',  hue:'#a35d3a' },
  ];

  return (
    <Phone>
      <ScreenBody>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button style={{ background:'none', border:'none', padding:6, cursor:'pointer' }}>
            <Icon name="chevL" size={22} color={ST.ink70}/>
          </button>
          <div style={{ width:34 }}/>
        </div>

        <H kicker="For Iris · Tonight" mt={12} mb={6}>
          What's the<br/><span style={{ fontStyle:'italic', color:ST.ember }}>story about?</span>
        </H>
        <div style={{
          fontFamily:FONT_SERIF, fontSize:15, color:ST.ink50, marginBottom:22, textWrap:'pretty',
        }}>
          Pick whatever's closest. You can change the ending later.
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {themes.map(th => <ThemeCard key={th.t} {...th}/>)}
        </div>

        <div style={{ height:24 }}/>
      </ScreenBody>
    </Phone>
  );
}

function ThemeCard({ t, s, mark, hue }) {
  return (
    <div style={{
      background:ST.cream2, borderRadius:16, padding:'14px 14px 16px',
      minHeight:148, position:'relative', overflow:'hidden',
      border:`1px solid ${ST.ink15}`,
    }}>
      <Mark name={mark} color={hue}/>
      <div style={{ fontFamily:FONT_SERIF, fontSize:17, color:ST.ink, lineHeight:1.2, marginTop:10 }}>{t}</div>
      <div style={{
        fontFamily:FONT_SANS, fontSize:11.5, lineHeight:1.4, color:ST.ink50, marginTop:4,
      }}>{s}</div>
    </div>
  );
}

// Geometric marks instead of childish illustrations / emoji
function Mark({ name, color }) {
  const sz = 26;
  const common = { width:sz, height:sz, viewBox:'0 0 26 26', fill:'none', stroke:color, strokeWidth:1.6, strokeLinecap:'round', strokeLinejoin:'round' };
  switch(name){
    case 'arc':   return <svg {...common}><path d="M3 19a10 10 0 0 1 20 0"/><circle cx="13" cy="19" r="1.6" fill={color}/></svg>;
    case 'crack': return <svg {...common}><path d="M5 4l4 6-3 4 5 4-2 4"/></svg>;
    case 'knot':  return <svg {...common}><circle cx="9" cy="13" r="5"/><circle cx="17" cy="13" r="5"/></svg>;
    case 'echo':  return <svg {...common}><circle cx="13" cy="13" r="3"/><circle cx="13" cy="13" r="7"/><circle cx="13" cy="13" r="11"/></svg>;
    case 'wave':  return <svg {...common}><path d="M3 13c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/></svg>;
    case 'spark': return <svg {...common}><path d="M13 4v6M13 16v6M4 13h6M16 13h6"/></svg>;
    case 'horizon': return <svg {...common}><circle cx="13" cy="15" r="5"/><path d="M3 21h20"/></svg>;
    case 'door':  return <svg {...common}><path d="M7 4h12v18H7zM14 13.5v1"/></svg>;
    default: return null;
  }
}

// Loading — warm, slow breath
function StoryLoading() {
  return (
    <Phone dark>
      <ScreenBody dark pad={24}>
        <div style={{ display:'flex', flexDirection:'column', height:'calc(100% - 47px)', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
          {/* Slow breathing dot */}
          <div style={{ position:'relative', width:120, height:120, marginBottom:36 }}>
            <div style={{
              position:'absolute', inset:0, borderRadius:'50%',
              background:`radial-gradient(circle at 35% 35%, ${ST.amberSoft}, ${ST.ember} 70%, transparent 75%)`,
              filter:'blur(2px)', opacity:0.85,
              animation:'st-breath 4.5s ease-in-out infinite',
            }}/>
            <div style={{
              position:'absolute', inset:24, borderRadius:'50%',
              background:`radial-gradient(circle at 40% 40%, ${ST.amberSoft}, ${ST.amber})`,
              boxShadow:`0 0 40px ${ST.amber}`,
            }}/>
          </div>

          <div style={{
            fontFamily:FONT_SANS, fontSize:11, fontWeight:500, letterSpacing:'.2em',
            textTransform:'uppercase', color:ST.amberSoft, marginBottom:14,
          }}>Writing</div>

          <div style={{
            fontFamily:FONT_SERIF, fontSize:24, color:ST.paperD, lineHeight:1.25,
            letterSpacing:'-0.01em', maxWidth:300,
          }}>
            Lining up the streetlamps,<br/>
            <span style={{ fontStyle:'italic', color:ST.amberSoft }}>finding the right way in…</span>
          </div>

          <div style={{
            marginTop:36, fontFamily:FONT_SANS, fontSize:13, color:ST.paperD70, maxWidth:280,
          }}>
            This usually takes about twenty seconds. There's no need to wait — we'll let you know.
          </div>
        </div>

        <style>{`@keyframes st-breath {0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.08);opacity:1}}`}</style>
      </ScreenBody>
    </Phone>
  );
}

Object.assign(window, { TeenThemes, StoryLoading });
