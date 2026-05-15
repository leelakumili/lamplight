// Immersive reading view — full-bleed scene + floating text card.
// Inspired by the picture-book convention, adapted for teens:
// scene-based, no character portrait, moodier palette, editorial type.

function ImmersiveScene({ dark=true, palette='dusk', label }) {
  // Layered gradient + soft shapes as a placeholder scene
  // (real illustrations would replace this).
  const palettes = {
    dusk: dark
      ? { sky:'#1c2138', mid:'#2a3052', low:'#3c3a4f', glow:'#c9924a' }
      : { sky:'#e8d5b7', mid:'#d9b48a', low:'#b58761', glow:'#a35d3a' },
    night: dark
      ? { sky:'#10121f', mid:'#1c2138', low:'#262c47', glow:'#7e8aa8' }
      : { sky:'#d9d6c8', mid:'#bdb9a7', low:'#88857a', glow:'#bb7d4a' },
    bench: dark
      ? { sky:'#181f2d', mid:'#252c3f', low:'#3a3f55', glow:'#e5b574' }
      : { sky:'#f0e3c8', mid:'#d8b88e', low:'#9a7252', glow:'#a35d3a' },
  };
  const p = palettes[palette] || palettes.dusk;

  return (
    <div style={{
      position:'absolute', inset:0, overflow:'hidden',
      background:`linear-gradient(180deg, ${p.sky} 0%, ${p.mid} 55%, ${p.low} 100%)`,
    }}>
      {/* Soft moon / streetlamp glow */}
      <div style={{
        position:'absolute', top:'18%', right:'18%', width:140, height:140, borderRadius:'50%',
        background:`radial-gradient(circle, ${p.glow}cc, ${p.glow}00 65%)`,
        filter:'blur(2px)', opacity: dark? 0.9 : 0.7,
      }}/>
      {/* Horizon band */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:'34%', height:1,
        background: dark? 'rgba(229,181,116,0.18)' : 'rgba(31,27,22,0.18)',
      }}/>
      {/* Silhouetted distant shapes (rooftops, trees) */}
      <svg viewBox="0 0 390 200" preserveAspectRatio="none" style={{
        position:'absolute', left:0, right:0, bottom:'30%', width:'100%', height:90,
      }}>
        <path d="M0,80 L0,55 L20,55 L20,40 L45,40 L45,60 L70,60 L70,30 L100,30 L100,55 L130,55 L130,45 L160,45 L160,60 L185,60 L185,35 L215,35 L215,55 L245,55 L245,42 L275,42 L275,58 L305,58 L305,30 L340,30 L340,55 L370,55 L370,42 L390,42 L390,80 Z"
          fill={dark? '#0c0e18' : '#3a2e22'} opacity={dark? 0.95 : 0.65}/>
      </svg>
      {/* Ground texture stripes */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, height:'30%',
        background:`repeating-linear-gradient(0deg, ${p.low}, ${p.low} 2px, transparent 2px, transparent 16px)`,
        opacity:0.3,
      }}/>
      {/* Vignette */}
      <div style={{
        position:'absolute', inset:0,
        background:`radial-gradient(ellipse at center, transparent 40%, ${dark? '#0a0c14' : '#2a2218'}88 100%)`,
      }}/>
      {/* Placeholder label */}
      {label && (
        <div style={{
          position:'absolute', top:60, left:18,
          fontFamily:FONT_MONO, fontSize:9, letterSpacing:'.1em',
          color: dark? 'rgba(233,223,201,0.32)' : 'rgba(31,27,22,0.38)',
          textTransform:'uppercase',
        }}>{label}</div>
      )}
    </div>
  );
}

function ImmersiveChrome({ dark=true }) {
  const fg = dark? ST.paperD : ST.ink;
  return (
    <div style={{
      position:'absolute', top:47, left:0, right:0, zIndex:5,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'10px 20px',
    }}>
      <div style={{
        width:38, height:38, borderRadius:19,
        background: dark? 'rgba(15,17,28,0.45)' : 'rgba(250,244,232,0.55)',
        backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        border: `1px solid ${dark? 'rgba(233,223,201,0.12)' : 'rgba(31,27,22,0.08)'}`,
      }}>
        <Icon name="chevL" size={18} color={fg}/>
      </div>
      <div style={{
        height:38, padding:'0 14px', borderRadius:19,
        background: dark? 'rgba(15,17,28,0.45)' : 'rgba(250,244,232,0.55)',
        backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
        display:'flex', alignItems:'center', gap:8,
        border: `1px solid ${dark? 'rgba(233,223,201,0.12)' : 'rgba(31,27,22,0.08)'}`,
        fontFamily:FONT_SANS, fontSize:11.5, letterSpacing:'.16em',
        textTransform:'uppercase', color: dark? ST.paperD70 : ST.ink50, fontWeight:500,
      }}>
        Chapter 1
      </div>
      <div style={{
        width:38, height:38, borderRadius:19,
        background: dark? 'rgba(15,17,28,0.45)' : 'rgba(250,244,232,0.55)',
        backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        border: `1px solid ${dark? 'rgba(233,223,201,0.12)' : 'rgba(31,27,22,0.08)'}`,
      }}>
        <Icon name="text" size={18} color={fg}/>
      </div>
    </div>
  );
}

function ImmersiveCard({ dark=true, body, italic, page=3, total=7 }) {
  return (
    <div style={{
      position:'absolute', left:14, right:14, bottom:34, zIndex:5,
    }}>
      <div style={{
        borderRadius:22,
        background: dark? 'rgba(250,244,232,0.96)' : 'rgba(250,244,232,0.98)',
        boxShadow:'0 30px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(31,27,22,0.04)',
        padding:'22px 24px 16px',
        color:ST.ink,
        backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
      }}>
        {italic && (
          <div style={{
            fontFamily:FONT_SERIF, fontSize:13, fontStyle:'italic',
            color:ST.ember, marginBottom:10, letterSpacing:'.01em',
          }}>{italic}</div>
        )}
        <p style={{
          margin:0, fontFamily:FONT_SERIF, fontSize:16.5, lineHeight:1.55,
          color:ST.ink, textWrap:'pretty',
        }}>{body}</p>

        <div style={{
          marginTop:18, paddingTop:14, borderTop:`1px solid ${ST.ink15}`,
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div style={{
            fontFamily:FONT_MONO, fontSize:11, letterSpacing:'.12em',
            color:ST.ink50,
          }}>{String(page).padStart(2,'0')} / {String(total).padStart(2,'0')}</div>
          <div style={{ display:'flex', gap:4 }}>
            {Array.from({length:total}).map((_,i)=>(
              <div key={i} style={{
                width: i===page-1? 14 : 4, height:4, borderRadius:2,
                background: i<page? ST.ember : ST.ink15,
              }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadingImmersiveDark() {
  return (
    <Phone dark>
      <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden' }}>
        <ImmersiveScene dark palette="dusk" label="scene · the long walk home"/>
        <ImmersiveChrome dark/>
        <ImmersiveCard
          dark
          italic="The Long Way Home"
          body="It was almost dark already, which felt wrong for four o'clock, but October did this — it stole the day in small handfuls until you noticed the lamps were on. Iris pulled her sleeves over her hands and started walking the long way home."
          page={3} total={7}
        />
      </div>
    </Phone>
  );
}

function ReadingImmersiveLight() {
  return (
    <Phone>
      <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden', background:ST.cream }}>
        <ImmersiveScene dark={false} palette="bench" label="scene · the bench at lunch"/>
        <ImmersiveChrome dark={false}/>
        <ImmersiveCard
          dark={false}
          italic="Chapter One"
          body="So she ate outside, on the cold bench, with her sketchbook open against her knee. She drew a hand. Then she drew the same hand again. Then she stopped, because the lines had started to look angry, and she didn't want to make anything angry today."
          page={2} total={7}
        />
      </div>
    </Phone>
  );
}

// After the story — soft reflection moment (the Storythread equivalent of
// where Oscar/StoryWizard puts activity sheets).  Not a quiz. Not gamified.
// One private question, three soft answers, nothing tracked.
function AfterStory() {
  return (
    <Phone dark>
      <ScreenBody dark pad={26}>
        <div style={{
          display:'flex', flexDirection:'column', height:'calc(100% - 47px)', justifyContent:'space-between',
        }}>
          <div>
            <div style={{ paddingTop:8, marginBottom:24 }}>
              <button style={{ background:'none', border:'none', padding:6, cursor:'pointer' }}>
                <Icon name="chevL" size={22} color={ST.paperD}/>
              </button>
            </div>
            <div style={{
              fontFamily:FONT_SANS, fontSize:11, letterSpacing:'.2em',
              textTransform:'uppercase', color:ST.amberSoft, fontWeight:500,
            }}>The end</div>
            <div style={{
              fontFamily:FONT_SERIF, fontSize:30, lineHeight:1.15, color:ST.paperD,
              marginTop:14, letterSpacing:'-0.01em', textWrap:'pretty',
            }}>
              How did that land?
            </div>
            <div style={{
              fontFamily:FONT_SERIF, fontSize:15, lineHeight:1.5, color:ST.paperD70,
              marginTop:10, textWrap:'pretty', maxWidth:300,
            }}>
              Just for you. No one sees this. No streaks, no scores — only a way to mark the night.
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:32 }}>
              {[
                ['That felt right.',  'Save it'],
                ['Something else.',   'Write another'],
                ['Just done.',        'Close the book'],
              ].map(([t,s],i)=>(
                <div key={t} style={{
                  borderRadius:16, padding:'16px 18px',
                  background: i===0 ? 'rgba(229,181,116,0.12)' : 'rgba(233,223,201,0.05)',
                  border: `1px solid ${i===0 ? 'rgba(229,181,116,0.4)' : 'rgba(233,223,201,0.1)'}`,
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                }}>
                  <div>
                    <div style={{
                      fontFamily:FONT_SERIF, fontSize:17, color:ST.paperD, marginBottom:2,
                    }}>{t}</div>
                    <div style={{
                      fontFamily:FONT_SANS, fontSize:12, color:ST.paperD70,
                    }}>{s}</div>
                  </div>
                  <Icon name="chevR" size={16} color={ST.paperD70}/>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            fontFamily:FONT_MONO, fontSize:10, letterSpacing:'.16em',
            color:ST.paperD30, textAlign:'center', paddingBottom:8, textTransform:'uppercase',
          }}>nothing tracked · nothing shared</div>
        </div>
      </ScreenBody>
    </Phone>
  );
}

Object.assign(window, { ReadingImmersiveDark, ReadingImmersiveLight, AfterStory });
