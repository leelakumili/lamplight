// Story Reading View — the centerpiece. Book-style.

// Sample story text — written to feel like a real published story for a teen.
const STORY = {
  title: 'The Long Way Home',
  by:    'A Storythread story for Iris',
  pages: [
    `The school bus dropped Iris three stops early. She didn't decide it on purpose. She just stayed in her seat as Maya stood up and walked off with the new girl, and then she stayed a little longer, and then she was alone, and the driver was looking at her in the mirror.

She got off at the corner near the old theatre.

It was almost dark already, which felt wrong for four o'clock, but October did this — it stole the day in small handfuls until you noticed the lamps were on. Iris pulled her sleeves over her hands and started walking the long way home.`,

    `She had not told her mother about lunch. She hadn't told anyone. There had not been a single dramatic thing about it. Maya had simply set her tray down at the table by the windows, and someone had laughed, and Iris had turned a corner with her own tray still warm in her hands, and there was nowhere obvious to put it down.

So she had eaten outside, on the cold bench, with her sketchbook open against her knee and a sandwich she didn't really want. She drew a hand. Then she drew the same hand again. Then she stopped, because the lines had started to look angry, and she didn't want to make anything angry today.`,
  ],
};

function ReadingDark({ fontSize=18 }) {
  return (
    <Phone dark>
      <div style={{
        minHeight:'100%', background:ST.mid, color:ST.paperD,
        fontFamily:FONT_SERIF, boxSizing:'border-box',
      }}>
        <StatusTopPad dark/>
        <ReadingChrome dark/>
        <ReadingPage fontSize={fontSize} dark/>
        <ReadingFooter dark page={2} total={7}/>
      </div>
    </Phone>
  );
}

function ReadingLight({ fontSize=18 }) {
  return (
    <Phone>
      <div style={{
        minHeight:'100%', background:ST.cream, color:ST.ink,
        fontFamily:FONT_SERIF, boxSizing:'border-box',
      }}>
        <StatusTopPad/>
        <ReadingChrome/>
        <ReadingPage fontSize={fontSize}/>
        <ReadingFooter page={2} total={7}/>
      </div>
    </Phone>
  );
}

// With the type control sheet open over the dark reader
function ReadingWithControls() {
  return (
    <Phone dark>
      <div style={{
        position:'relative', minHeight:'100%', background:ST.mid, color:ST.paperD,
        fontFamily:FONT_SERIF, boxSizing:'border-box',
      }}>
        <StatusTopPad dark/>
        <ReadingChrome dark/>
        <ReadingPage fontSize={18} dark/>
        <ReadingFooter dark page={2} total={7}/>
        <div style={{
          position:'absolute', inset:0, background:'rgba(21,24,42,0.55)',
          backdropFilter:'blur(2px)',
        }}/>
        <TypeSheet/>
      </div>
    </Phone>
  );
}

function ReadingChrome({ dark=false }) {
  const fg = dark? ST.paperD : ST.ink;
  const fg50 = dark? ST.paperD70 : ST.ink50;
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'8px 22px 14px',
    }}>
      <button style={{ background:'none', border:'none', padding:6, cursor:'pointer' }}>
        <Icon name="chevL" size={22} color={fg}/>
      </button>
      <div style={{
        fontFamily:FONT_SANS, fontSize:11, letterSpacing:'.2em',
        textTransform:'uppercase', color:fg50, fontWeight:500,
      }}>Storythread</div>
      <div style={{ display:'flex', gap:6 }}>
        <button style={{ background:'none', border:'none', padding:6, cursor:'pointer' }}>
          <Icon name="text" size={20} color={fg}/>
        </button>
      </div>
    </div>
  );
}

function ReadingPage({ fontSize=18, dark=false }) {
  const fg = dark? ST.paperD : ST.ink;
  const fg70 = dark? ST.paperD70 : ST.ink70;
  return (
    <div style={{
      padding:'4px 30px 24px', maxWidth:'100%', boxSizing:'border-box',
    }}>
      {/* Title + drop cap on chapter open */}
      <div style={{
        fontFamily:FONT_SERIF, fontSize:30, lineHeight:1.1, letterSpacing:'-0.015em',
        color:fg, marginTop:6,
      }}>The Long Way Home</div>
      <div style={{
        fontFamily:FONT_SANS, fontSize:11.5, letterSpacing:'.16em', textTransform:'uppercase',
        color: dark? 'rgba(229,181,116,0.85)' : ST.ember, marginTop:14, fontWeight:500,
      }}>Chapter One · The Bench</div>

      <div style={{ marginTop:18 }}>
        <p style={{
          margin:0, fontSize:fontSize, lineHeight:1.65, color:fg,
          fontFamily:FONT_SERIF, textWrap:'pretty',
        }}>
          <span style={{
            float:'left', fontFamily:FONT_SERIF, fontSize:fontSize*3.3, lineHeight:0.88,
            paddingRight:8, paddingTop:4, color: dark? ST.amberSoft : ST.ember,
            fontStyle:'italic',
          }}>T</span>
          he school bus dropped Iris three stops early. She didn't decide it on purpose. She just stayed in her seat as Maya stood up and walked off with the new girl, and then she stayed a little longer, and then she was alone, and the driver was looking at her in the mirror.
        </p>
        <p style={{
          margin:'14px 0 0', fontSize:fontSize, lineHeight:1.65, color:fg70,
          fontFamily:FONT_SERIF, textWrap:'pretty', fontStyle:'italic',
        }}>
          She got off at the corner near the old theatre.
        </p>
        <p style={{
          margin:'14px 0 0', fontSize:fontSize, lineHeight:1.65, color:fg,
          fontFamily:FONT_SERIF, textWrap:'pretty',
        }}>
          It was almost dark already, which felt wrong for four o'clock, but October did this — it stole the day in small handfuls until you noticed the lamps were on.
        </p>

        {/* Inline scene illustration */}
        <div style={{ margin:'22px -6px 18px' }}>
          <Scene dark={dark} h={150} label="scene · streetlamp at the theatre"/>
        </div>

        <p style={{
          margin:0, fontSize:fontSize, lineHeight:1.65, color:fg,
          fontFamily:FONT_SERIF, textWrap:'pretty',
        }}>
          Iris pulled her sleeves over her hands and started walking the long way home. She had not told her mother about lunch. She hadn't told anyone.
        </p>
      </div>
    </div>
  );
}

function ReadingFooter({ dark=false, page=2, total=7 }) {
  const fg = dark? ST.paperD70 : ST.ink50;
  const track = dark? 'rgba(233,223,201,0.12)' : ST.ink15;
  const fill = dark? ST.amberSoft : ST.ember;
  return (
    <div style={{
      padding:'6px 24px 40px', display:'flex', alignItems:'center', gap:12,
      fontFamily:FONT_SANS, fontSize:11, color:fg, letterSpacing:'.06em',
    }}>
      <span style={{ minWidth:24 }}>{String(page).padStart(2,'0')}</span>
      <div style={{ flex:1, height:2, background:track, borderRadius:1, overflow:'hidden' }}>
        <div style={{ width:`${(page/total)*100}%`, height:'100%', background:fill }}/>
      </div>
      <span>{total}</span>
    </div>
  );
}

function TypeSheet() {
  return (
    <div style={{
      position:'absolute', left:14, right:14, bottom:24, borderRadius:24,
      background:ST.mid2, border:'1px solid rgba(233,223,201,0.1)',
      padding:'18px 20px 22px', color:ST.paperD,
      boxShadow:'0 30px 80px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        width:36, height:4, background:'rgba(233,223,201,0.25)', borderRadius:2,
        margin:'0 auto 16px',
      }}/>
      <div style={{
        fontFamily:FONT_SANS, fontSize:11, fontWeight:500, letterSpacing:'.18em',
        textTransform:'uppercase', color:ST.paperD70, marginBottom:14,
      }}>Reading</div>

      {/* Font size */}
      <div style={{
        background:'rgba(233,223,201,0.06)', borderRadius:14,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'4px 8px', marginBottom:10, height:52,
      }}>
        <button style={{
          width:40, height:40, borderRadius:10, background:'rgba(233,223,201,0.08)',
          border:'none', color:ST.paperD, display:'flex', alignItems:'center', justifyContent:'center',
        }}><span style={{ fontFamily:FONT_SERIF, fontSize:14 }}>Aa</span></button>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:0, justifyContent:'center' }}>
          {[14,16,18,20,22].map((s,i) => (
            <div key={s} style={{
              width:`${100/5}%`, height:40, display:'flex', alignItems:'center', justifyContent:'center',
              position:'relative',
            }}>
              <div style={{
                width: i===2 ? 10 : 6, height: i===2 ? 10 : 6, borderRadius:'50%',
                background: i===2 ? ST.amberSoft : 'rgba(233,223,201,0.25)',
              }}/>
            </div>
          ))}
        </div>
        <button style={{
          width:40, height:40, borderRadius:10, background:'rgba(233,223,201,0.08)',
          border:'none', color:ST.paperD, display:'flex', alignItems:'center', justifyContent:'center',
        }}><span style={{ fontFamily:FONT_SERIF, fontSize:20 }}>Aa</span></button>
      </div>

      {/* Theme toggle */}
      <div style={{
        background:'rgba(233,223,201,0.06)', borderRadius:14, padding:4,
        display:'flex', height:48, marginBottom:10,
      }}>
        {[
          { l:'Cream',   bg:ST.cream,  fg:ST.ink, on:false },
          { l:'Sepia',   bg:'#2a2218', fg:'#e9dfc9', on:false },
          { l:'Midnight',bg:ST.mid,    fg:ST.paperD, on:true },
        ].map((t,i)=>(
          <div key={i} style={{
            flex:1, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
            background: t.on ? 'rgba(229,181,116,0.16)' : 'transparent',
            border: t.on ? `1px solid ${ST.amberSoft}` : '1px solid transparent',
            gap:8,
          }}>
            <div style={{ width:14, height:14, borderRadius:'50%', background:t.bg, border:`1px solid rgba(233,223,201,0.3)` }}/>
            <span style={{ fontFamily:FONT_SANS, fontSize:13, color: t.on? ST.amberSoft : ST.paperD70, fontWeight: t.on? 600 : 500 }}>{t.l}</span>
          </div>
        ))}
      </div>

      {/* Font family */}
      <div style={{
        background:'rgba(233,223,201,0.06)', borderRadius:14, padding:'2px',
        display:'flex', height:48,
      }}>
        {[
          { l:'Newsreader', f:FONT_SERIF, on:true },
          { l:'Sans',  f:FONT_SANS, on:false },
        ].map((t,i)=>(
          <div key={i} style={{
            flex:1, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
            background: t.on ? 'rgba(233,223,201,0.1)' : 'transparent',
            fontFamily:t.f, fontSize:15, color: t.on? ST.paperD : ST.paperD70,
            fontWeight: t.on ? 500 : 400,
          }}>{t.l}</div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ReadingDark, ReadingLight, ReadingWithControls });
