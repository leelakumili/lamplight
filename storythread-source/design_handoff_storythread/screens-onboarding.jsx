// Onboarding — Welcome, Profile setup, LLM setup

function Phone({ children, dark=false, width=390, height=844, keyboard=false }) {
  return (
    <IOSDevice width={width} height={height} dark={dark} keyboard={keyboard}>
      {children}
    </IOSDevice>
  );
}

function ScreenBody({ children, dark=false, pad=24 }) {
  return (
    <div style={{
      minHeight:'100%', background: dark? ST.mid : ST.cream,
      padding:`${pad}px ${pad}px 32px`,
      fontFamily: FONT_SANS, color: dark? ST.paperD : ST.ink,
      boxSizing:'border-box',
    }}>
      <StatusTopPad dark={dark} />
      {children}
    </div>
  );
}

// 1. Welcome
function OnbWelcome() {
  return (
    <Phone>
      <ScreenBody pad={28}>
        <div style={{ display:'flex', flexDirection:'column', height:'calc(100% - 47px)', justifyContent:'space-between' }}>
          <div style={{ paddingTop:48 }}>
            <div style={{
              width:56, height:56, borderRadius:18,
              background:`linear-gradient(155deg, ${ST.amber}, ${ST.ember})`,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:`0 12px 30px ${ST.amber}44`,
            }}>
              <Icon name="moon" size={28} color={ST.cream}/>
            </div>
            <div style={{
              fontFamily:FONT_SANS, fontSize:12, fontWeight:500, letterSpacing:'.2em',
              textTransform:'uppercase', color:ST.ink50, marginTop:40,
            }}>Storythread</div>
            <div style={{
              fontFamily:FONT_SERIF, fontSize:38, lineHeight:1.08, marginTop:14,
              color:ST.ink, letterSpacing:'-0.02em',
            }}>
              A new story,<br/>
              <span style={{ fontStyle:'italic', color:ST.ember }}>just for tonight.</span>
            </div>
            <div style={{
              fontFamily:FONT_SERIF, fontSize:17, lineHeight:1.55, marginTop:20,
              color:ST.ink70, textWrap:'pretty',
            }}>
              Bedtime stories written for the teen in your life — quietly shaped around the day they actually had.
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, paddingBottom:24 }}>
            <Pill primary style={{ width:'100%', height:54, fontSize:16 }}>Begin setup</Pill>
            <button style={{
              background:'none', border:'none', color:ST.ink50, fontFamily:FONT_SANS,
              fontSize:14, padding:'12px 0', cursor:'pointer',
            }}>I already have an account</button>
          </div>
        </div>
      </ScreenBody>
    </Phone>
  );
}

// 2. Profile setup — name, friends, character builder
function OnbProfile() {
  const friends = ['Maya','Theo','Jules','Priya','Sam'];
  return (
    <Phone>
      <ScreenBody>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button style={{ background:'none', border:'none', padding:6, cursor:'pointer' }}>
            <Icon name="chevL" size={22} color={ST.ink70}/>
          </button>
          <div style={{ display:'flex', gap:6 }}>
            <div style={{ width:24, height:3, background:ST.ink, borderRadius:2 }}/>
            <div style={{ width:24, height:3, background:ST.ink, borderRadius:2 }}/>
            <div style={{ width:24, height:3, background:ST.ink15, borderRadius:2 }}/>
          </div>
          <div style={{ width:34 }}/>
        </div>

        <H kicker="Step 2 of 3" mt={22} mb={6}>Who is the story for?</H>
        <div style={{ fontFamily:FONT_SERIF, fontSize:16, color:ST.ink50, marginBottom:24, textWrap:'pretty' }}>
          We'll weave these names quietly into every story. No one else sees them.
        </div>

        <Field label="Their name">
          <Input value="Iris" />
        </Field>

        <Field label="Their friends (up to 5)" sublabel="Optional. Add the ones who show up most.">
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:10 }}>
            {friends.map(n => <Chip key={n}>{n} <span style={{ marginLeft:6, color:ST.ink50 }}>×</span></Chip>)}
          </div>
          <div style={{
            height:44, borderRadius:12, background:ST.cream2, border:`1px dashed ${ST.ink15}`,
            display:'flex', alignItems:'center', padding:'0 14px', color:ST.ink50, fontSize:14,
            gap:8,
          }}>
            <Icon name="plus" size={16} color={ST.ink50}/> Add a friend's name
          </div>
        </Field>

        <Field label="Quick character sketch" sublabel="Two or three details. The stories will hold them.">
          <div style={{
            borderRadius:14, background:ST.cream2, padding:14, minHeight:96,
            fontFamily:FONT_SERIF, fontSize:15, color:ST.ink, lineHeight:1.5,
          }}>
            13. Loves drawing, hates being talked over. Has a beat-up sketchbook she carries everywhere. Quiet but funny once she opens up.
          </div>
        </Field>

        <Pill primary style={{ width:'100%', height:52, marginTop:8 }}>
          Continue <Icon name="chevR" size={16} color={ST.cream}/>
        </Pill>
      </ScreenBody>
    </Phone>
  );
}

function Field({ label, sublabel, children }) {
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ fontFamily:FONT_SANS, fontSize:13, fontWeight:500, color:ST.ink, marginBottom:4 }}>{label}</div>
      {sublabel && <div style={{ fontFamily:FONT_SANS, fontSize:12, color:ST.ink50, marginBottom:10 }}>{sublabel}</div>}
      {!sublabel && <div style={{ height:6 }}/>}
      {children}
    </div>
  );
}
function Input({ value, placeholder, dark=false }) {
  return (
    <div style={{
      height:48, borderRadius:12,
      background: dark? 'rgba(233,223,201,0.06)' : ST.cream2,
      border: dark? '1px solid rgba(233,223,201,0.1)' : `1px solid ${ST.ink15}`,
      display:'flex', alignItems:'center', padding:'0 14px',
      fontFamily:FONT_SANS, fontSize:15, color: dark? ST.paperD : ST.ink,
    }}>{value || <span style={{ color: dark? ST.paperD30 : ST.ink50 }}>{placeholder}</span>}</div>
  );
}
function Chip({ children, active=false, dark=false, soft=false }) {
  const bg = active ? ST.ink : (soft ? 'transparent' : (dark? 'rgba(233,223,201,0.08)' : ST.cream3));
  const col = active ? ST.cream : (dark? ST.paperD : ST.ink);
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', height:34, padding:'0 12px', borderRadius:18,
      background:bg, color:col, fontFamily:FONT_SANS, fontSize:13, fontWeight:500,
      border: soft? `1px solid ${dark? 'rgba(233,223,201,0.2)' : ST.ink15}` : 'none',
    }}>{children}</span>
  );
}

// 3. LLM setup
function OnbLLM() {
  return (
    <Phone>
      <ScreenBody>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button style={{ background:'none', border:'none', padding:6, cursor:'pointer' }}>
            <Icon name="chevL" size={22} color={ST.ink70}/>
          </button>
          <div style={{ display:'flex', gap:6 }}>
            <div style={{ width:24, height:3, background:ST.ink, borderRadius:2 }}/>
            <div style={{ width:24, height:3, background:ST.ink, borderRadius:2 }}/>
            <div style={{ width:24, height:3, background:ST.ink, borderRadius:2 }}/>
          </div>
          <div style={{ width:34 }}/>
        </div>

        <H kicker="Step 3 of 3" mt={22} mb={6}>Where should stories come from?</H>
        <div style={{ fontFamily:FONT_SERIF, fontSize:16, color:ST.ink50, marginBottom:22, textWrap:'pretty' }}>
          Storythread doesn't generate anything itself. Pick the writer it talks to.
        </div>

        {/* Provider toggle */}
        <div style={{
          display:'flex', background:ST.cream2, padding:4, borderRadius:14, marginBottom:18,
        }}>
          {['Cloud (API)','Local (Ollama)'].map((l,i)=>(
            <div key={l} style={{
              flex:1, height:40, display:'flex', alignItems:'center', justifyContent:'center',
              borderRadius:10, background: i===0 ? ST.cream : 'transparent',
              boxShadow: i===0 ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              fontFamily:FONT_SANS, fontSize:13, fontWeight: i===0 ? 600 : 500,
              color: i===0 ? ST.ink : ST.ink50,
            }}>{l}</div>
          ))}
        </div>

        <Field label="Provider">
          <div style={{
            height:48, borderRadius:12, background:ST.cream2, border:`1px solid ${ST.ink15}`,
            display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 14px',
            fontFamily:FONT_SANS, fontSize:15,
          }}>
            <span>Anthropic · Claude Sonnet</span>
            <Icon name="chevR" size={16} color={ST.ink50}/>
          </div>
        </Field>

        <Field label="API key" sublabel="Stored encrypted on this device only.">
          <Input value="sk-ant-•••••••••••••••••••••••••a3f9" />
        </Field>

        <div style={{
          background:ST.cream2, borderRadius:14, padding:'14px 16px', marginTop:6, marginBottom:24,
          display:'flex', gap:12,
        }}>
          <div style={{ marginTop:2 }}><Icon name="eye" size={18} color={ST.ember}/></div>
          <div style={{ fontFamily:FONT_SANS, fontSize:13, color:ST.ink70, lineHeight:1.45 }}>
            What you tell us about your teen never leaves your device. Stories are generated, read, and forgotten.
          </div>
        </div>

        <Pill primary style={{ width:'100%', height:52 }}>
          Finish setup
        </Pill>
      </ScreenBody>
    </Phone>
  );
}

Object.assign(window, { Phone, ScreenBody, OnbWelcome, OnbProfile, OnbLLM, Field, Input, Chip });
