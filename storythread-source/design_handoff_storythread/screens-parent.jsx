// Parent Mode — 4-question interview

function ProgressDots({ step, total=4 }) {
  return (
    <div style={{ display:'flex', gap:6 }}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{
          width: i<step ? 24 : 18, height:3,
          background: i<step ? ST.ink : ST.ink15, borderRadius:2,
          transition:'width .25s',
        }}/>
      ))}
    </div>
  );
}

function InterviewHeader({ step, kicker }) {
  return (
    <>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <button style={{ background:'none', border:'none', padding:6, cursor:'pointer' }}>
          <Icon name="chevL" size={22} color={ST.ink70}/>
        </button>
        <ProgressDots step={step}/>
        <button style={{ background:'none', border:'none', padding:6, cursor:'pointer',
          fontFamily:FONT_SANS, fontSize:13, color:ST.ink50 }}>Skip</button>
      </div>
      <div style={{ marginTop:24 }}>
        <div style={{
          fontFamily:FONT_SANS, fontSize:11, fontWeight:500, letterSpacing:'.18em',
          textTransform:'uppercase', color:ST.amber, marginBottom:10,
        }}>{kicker}</div>
      </div>
    </>
  );
}

function PromptCard({ children }){
  return (
    <div style={{
      fontFamily:FONT_SERIF, fontSize:26, lineHeight:1.22, color:ST.ink,
      letterSpacing:'-0.01em', marginBottom:24, textWrap:'pretty',
    }}>{children}</div>
  );
}

// Q1 — freeform: what happened today
function ParentQ1() {
  return (
    <Phone>
      <ScreenBody>
        <InterviewHeader step={1} kicker="Tonight · Question 1 of 4"/>
        <PromptCard>What was the moment that stuck with you about Iris's day?</PromptCard>

        <div style={{
          borderRadius:16, background:ST.cream2, border:`1px solid ${ST.ink15}`,
          padding:16, minHeight:180, fontFamily:FONT_SERIF, fontSize:16, lineHeight:1.5,
          color:ST.ink,
        }}>
          She came home and went straight to her room. Said nothing happened. At dinner she mentioned no one sat with her at lunch but brushed it off when I asked.
          <span style={{ display:'inline-block', width:1.5, height:18, background:ST.ember,
            verticalAlign:'middle', marginLeft:2, animation:'none' }}/>
        </div>
        <div style={{
          marginTop:10, fontFamily:FONT_SANS, fontSize:12, color:ST.ink50,
        }}>
          Whatever you write stays on this device. The story will reshape it, not repeat it.
        </div>

        <div style={{ marginTop:'auto', paddingTop:24 }}>
          <Pill primary style={{ width:'100%', height:52, marginTop:24 }}>
            Continue
          </Pill>
        </div>
      </ScreenBody>
    </Phone>
  );
}

// Q2 — freeform + friend chip autocomplete
function ParentQ2() {
  return (
    <Phone>
      <ScreenBody>
        <InterviewHeader step={2} kicker="Question 2 of 4"/>
        <PromptCard>Who was around today — for better or worse?</PromptCard>

        <div style={{ fontFamily:FONT_SANS, fontSize:12, color:ST.ink50, marginBottom:8 }}>
          Tap a name to include them, or just write.
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>
          <Chip active>Maya</Chip>
          <Chip active>Theo</Chip>
          <Chip>Jules</Chip>
          <Chip>Priya</Chip>
          <Chip>Sam</Chip>
        </div>

        <div style={{
          borderRadius:16, background:ST.cream2, border:`1px solid ${ST.ink15}`,
          padding:16, minHeight:140, fontFamily:FONT_SERIF, fontSize:16, lineHeight:1.5,
          color:ST.ink,
        }}>
          <span style={{
            display:'inline-flex', alignItems:'center', height:26, padding:'0 8px',
            borderRadius:13, background:ST.ink, color:ST.cream,
            fontFamily:FONT_SANS, fontSize:13, fontWeight:500, marginRight:6,
            verticalAlign:'baseline', position:'relative', top:-1,
          }}>Maya</span>
          was at lunch but sat with the new girl. 
          <span style={{
            display:'inline-flex', alignItems:'center', height:26, padding:'0 8px',
            borderRadius:13, background:ST.ink, color:ST.cream,
            fontFamily:FONT_SANS, fontSize:13, fontWeight:500, margin:'0 4px',
            verticalAlign:'baseline', position:'relative', top:-1,
          }}>Theo</span>
          texted her after school but she didn't reply.
        </div>

        <Pill primary style={{ width:'100%', height:52, marginTop:24 }}>
          Continue
        </Pill>
      </ScreenBody>
    </Phone>
  );
}

// Q3 — emotion chips + optional freeform
function ParentQ3() {
  const emo = [
    ['Left out', true], ['Frustrated', true], ['Embarrassed', false],
    ['Quiet', true], ['Worried', false], ['Tired', false],
    ['Proud', false], ['Confused', false], ['Hurt', false],
  ];
  return (
    <Phone>
      <ScreenBody>
        <InterviewHeader step={3} kicker="Question 3 of 4"/>
        <PromptCard>How did she seem to be carrying it?</PromptCard>

        <div style={{ fontFamily:FONT_SANS, fontSize:12, color:ST.ink50, marginBottom:12 }}>
          Pick as many as fit.
        </div>

        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:22 }}>
          {emo.map(([w, active]) => <Chip key={w} active={active}>{w}</Chip>)}
        </div>

        <div style={{ fontFamily:FONT_SANS, fontSize:12, fontWeight:500, color:ST.ink, marginBottom:8 }}>
          Anything else? <span style={{ color:ST.ink50, fontWeight:400 }}>Optional</span>
        </div>
        <div style={{
          borderRadius:14, background:ST.cream2, border:`1px solid ${ST.ink15}`,
          padding:14, minHeight:88, fontFamily:FONT_SERIF, fontSize:15, color:ST.ink50,
          fontStyle:'italic',
        }}>
          A note, a phrase she used, anything…
        </div>

        <Pill primary style={{ width:'100%', height:52, marginTop:24 }}>
          Continue
        </Pill>
      </ScreenBody>
    </Phone>
  );
}

// Q4 — emotional destination
function ParentQ4() {
  const dests = [
    ['Hopeful',   'A lighter ending. Things shift.'],
    ['Understood','Someone sees her clearly.'],
    ['Brave',     'She steps toward, not away.'],
    ['Confident', 'Her own voice gets louder.'],
    ['Calm',      'The day quiets and softens.'],
    ['Empowered', 'She chooses what comes next.'],
  ];
  return (
    <Phone>
      <ScreenBody>
        <InterviewHeader step={4} kicker="Question 4 of 4"/>
        <PromptCard>Where should the story leave her?</PromptCard>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
          {dests.map(([t,s],i)=>{
            const sel = i===0;
            return (
              <div key={t} style={{
                borderRadius:14,
                background: sel ? ST.ink : ST.cream2,
                color: sel ? ST.cream : ST.ink,
                padding:'14px 14px 16px', minHeight:88,
                border: sel ? 'none' : `1px solid ${ST.ink15}`,
                position:'relative',
              }}>
                <div style={{ fontFamily:FONT_SERIF, fontSize:18, marginBottom:4 }}>{t}</div>
                <div style={{
                  fontFamily:FONT_SANS, fontSize:11.5, lineHeight:1.4,
                  color: sel ? 'rgba(250,244,232,0.7)' : ST.ink50,
                }}>{s}</div>
                {sel && (
                  <div style={{
                    position:'absolute', top:10, right:10, width:18, height:18, borderRadius:9,
                    background:ST.amberSoft, display:'flex', alignItems:'center', justifyContent:'center',
                  }}><Icon name="check" size={12} color={ST.ink} stroke={2}/></div>
                )}
              </div>
            );
          })}
        </div>

        <Pill primary style={{ width:'100%', height:54, fontSize:16 }}>
          Write her story
          <Icon name="sparkle" size={14} color={ST.cream}/>
        </Pill>
        <div style={{ textAlign:'center', marginTop:10, fontFamily:FONT_SANS, fontSize:12, color:ST.ink50 }}>
          Takes about 20 seconds.
        </div>
      </ScreenBody>
    </Phone>
  );
}

Object.assign(window, { ParentQ1, ParentQ2, ParentQ3, ParentQ4 });
