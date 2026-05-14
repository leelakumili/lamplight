// Home + Settings

function ScreenHome() {
  return (
    <Phone>
      <ScreenBody pad={24}>
        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{
            width:34, height:34, borderRadius:10,
            background:`linear-gradient(155deg, ${ST.amber}, ${ST.ember})`,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Icon name="moon" size={18} color={ST.cream}/>
          </div>
          <button style={{ background:'none', border:'none', padding:6, cursor:'pointer' }}>
            <Icon name="cog" size={22} color={ST.ink70}/>
          </button>
        </div>

        {/* Greeting */}
        <div style={{ marginTop:22 }}>
          <div style={{
            fontFamily:FONT_SANS, fontSize:13, color:ST.ink50, fontWeight:500,
          }}>Wednesday · 9:14 pm</div>
          <div style={{
            fontFamily:FONT_SERIF, fontSize:30, color:ST.ink, marginTop:6, lineHeight:1.12,
            letterSpacing:'-0.01em',
          }}>
            Good evening.
          </div>
        </div>

        {/* Two entry points */}
        <div style={{ marginTop:26, display:'flex', flexDirection:'column', gap:14 }}>

          {/* Tonight's Story — parent */}
          <div style={{
            position:'relative', borderRadius:22, overflow:'hidden',
            background:`linear-gradient(155deg, #2c3158 0%, #15182a 65%)`,
            padding:'22px 22px 24px', minHeight:170,
            boxShadow:'0 14px 40px rgba(21,24,42,0.22)',
          }}>
            <div style={{ position:'absolute', right:-30, bottom:-40, opacity:0.18 }}>
              <Icon name="moon" size={180} color={ST.amberSoft}/>
            </div>
            <div style={{ position:'relative' }}>
              <div style={{
                fontFamily:FONT_SANS, fontSize:11, fontWeight:500, letterSpacing:'.18em',
                textTransform:'uppercase', color:ST.amberSoft,
              }}>For the parent</div>
              <div style={{
                fontFamily:FONT_SERIF, fontSize:26, color:ST.paperD, marginTop:10, lineHeight:1.15,
                letterSpacing:'-0.01em',
              }}>
                Tonight's story
              </div>
              <div style={{
                fontFamily:FONT_SERIF, fontSize:14, color:ST.paperD70, marginTop:6, maxWidth:240,
              }}>
                Four quiet questions about Iris's day. Then a story by bedtime.
              </div>
              <div style={{
                marginTop:18, display:'inline-flex', alignItems:'center', gap:6,
                fontFamily:FONT_SANS, fontSize:14, fontWeight:600, color:ST.cream,
              }}>
                Start <Icon name="chevR" size={14} color={ST.cream}/>
              </div>
            </div>
          </div>

          {/* Make my story — teen */}
          <div style={{
            borderRadius:22, background:ST.cream3, padding:'22px 22px 24px',
            minHeight:128, position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', right:-20, bottom:-30, opacity:0.4 }}>
              <Icon name="sparkle" size={140} color={ST.ember}/>
            </div>
            <div style={{ position:'relative' }}>
              <div style={{
                fontFamily:FONT_SANS, fontSize:11, fontWeight:500, letterSpacing:'.18em',
                textTransform:'uppercase', color:ST.ember,
              }}>For Iris</div>
              <div style={{
                fontFamily:FONT_SERIF, fontSize:24, color:ST.ink, marginTop:10, lineHeight:1.15,
                letterSpacing:'-0.01em',
              }}>
                Make my story
              </div>
              <div style={{
                fontFamily:FONT_SERIF, fontSize:14, color:ST.ink50, marginTop:6, maxWidth:230,
              }}>
                Pick something that fits how the day went.
              </div>
            </div>
          </div>
        </div>

        {/* Recent */}
        <div style={{ marginTop:28 }}>
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:12,
          }}>
            <div style={{
              fontFamily:FONT_SANS, fontSize:11, fontWeight:500, letterSpacing:'.18em',
              textTransform:'uppercase', color:ST.ink50,
            }}>Recent stories</div>
            <div style={{ fontFamily:FONT_SANS, fontSize:13, color:ST.ink50 }}>See all</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {[
              ['The Long Way Home','Tue · 8 min · Hopeful'],
              ['What the Light Said','Mon · 6 min · Calm'],
              ['Bench by the Theatre','Sun · 9 min · Understood'],
            ].map(([t,m]) => (
              <div key={t} style={{
                display:'flex', alignItems:'center', gap:12, padding:'10px 0',
                borderBottom:`1px solid ${ST.ink15}`,
              }}>
                <div style={{
                  width:38, height:48, borderRadius:4,
                  background:`linear-gradient(180deg, ${ST.ember}, ${ST.amber})`,
                  boxShadow:'1px 1px 0 rgba(0,0,0,0.05)',
                }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:FONT_SERIF, fontSize:16, color:ST.ink }}>{t}</div>
                  <div style={{ fontFamily:FONT_SANS, fontSize:12, color:ST.ink50, marginTop:2 }}>{m}</div>
                </div>
                <Icon name="chevR" size={16} color={ST.ink30}/>
              </div>
            ))}
          </div>
        </div>
      </ScreenBody>
    </Phone>
  );
}

function ScreenSettings() {
  return (
    <Phone>
      <ScreenBody>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button style={{ background:'none', border:'none', padding:6, cursor:'pointer' }}>
            <Icon name="chevL" size={22} color={ST.ink70}/>
          </button>
          <div style={{ fontFamily:FONT_SANS, fontSize:15, fontWeight:500, color:ST.ink }}>Settings</div>
          <div style={{ width:34 }}/>
        </div>

        <SettingsGroup title="Reader profile">
          <Row label="Name" value="Iris"/>
          <Row label="Age" value="13"/>
        </SettingsGroup>

        <SettingsGroup title="Friends" right="5 / 5">
          <div style={{ padding:'8px 14px 14px', display:'flex', flexWrap:'wrap', gap:8 }}>
            {['Maya','Theo','Jules','Priya','Sam'].map(n => (
              <Chip key={n}>{n} <span style={{ marginLeft:6, color:ST.ink50 }}>×</span></Chip>
            ))}
            <Chip soft>+ add</Chip>
          </div>
        </SettingsGroup>

        <SettingsGroup title="Character sketch">
          <div style={{ padding:'10px 14px 14px' }}>
            <div style={{
              borderRadius:10, background:'transparent',
              fontFamily:FONT_SERIF, fontSize:14.5, color:ST.ink70, lineHeight:1.5,
            }}>
              Loves drawing, hates being talked over. Quiet but funny once she opens up. Currently in a Studio Ghibli phase.
            </div>
            <div style={{
              marginTop:10, fontFamily:FONT_SANS, fontSize:13, color:ST.ember, fontWeight:500,
            }}>Edit sketch</div>
          </div>
        </SettingsGroup>

        <SettingsGroup title="Story engine">
          <Row label="Provider" value="Claude Sonnet ›"/>
          <Row label="API key" value="•••• a3f9 ›"/>
          <Row label="Use local model" value={<Toggle on={false}/>} compact/>
        </SettingsGroup>

        <SettingsGroup title="Reading">
          <Row label="Default font size" value="Medium ›"/>
          <Row label="Dark mode on open" value={<Toggle on={true}/>} compact/>
        </SettingsGroup>

        <div style={{
          textAlign:'center', marginTop:18, fontFamily:FONT_SANS, fontSize:12, color:ST.ink50,
        }}>
          Storythread · v0.4 · local-first
        </div>
      </ScreenBody>
    </Phone>
  );
}
function SettingsGroup({ title, right, children }) {
  return (
    <div style={{ marginTop:22 }}>
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'baseline',
        padding:'0 4px 8px',
      }}>
        <div style={{
          fontFamily:FONT_SANS, fontSize:11, fontWeight:500, letterSpacing:'.16em',
          textTransform:'uppercase', color:ST.ink50,
        }}>{title}</div>
        {right && <div style={{ fontFamily:FONT_SANS, fontSize:12, color:ST.ink50 }}>{right}</div>}
      </div>
      <div style={{
        background:ST.cream2, borderRadius:14, overflow:'hidden',
      }}>{children}</div>
    </div>
  );
}
function Row({ label, value, compact=false }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:`${compact? 10 : 14}px 16px`, borderBottom:`1px solid rgba(31,27,22,0.06)`,
      fontFamily:FONT_SANS, fontSize:14.5,
    }}>
      <span style={{ color:ST.ink }}>{label}</span>
      <span style={{ color:ST.ink70 }}>{value}</span>
    </div>
  );
}
function Toggle({ on=false }) {
  return (
    <div style={{
      width:44, height:26, borderRadius:13, padding:2,
      background: on ? ST.ember : ST.ink15,
      display:'flex', alignItems:'center', justifyContent: on? 'flex-end':'flex-start',
    }}>
      <div style={{ width:22, height:22, borderRadius:11, background:'#fff',
        boxShadow:'0 1px 3px rgba(0,0,0,0.18)' }}/>
    </div>
  );
}

Object.assign(window, { ScreenHome, ScreenSettings });
