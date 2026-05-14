// Design System foundation cards — color, type, spacing, components, principles

function SwatchGrid({ items, dark=false }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
      {items.map(([name, val, hex]) => (
        <div key={name} style={{
          background: dark? 'rgba(233,223,201,0.05)' : ST.cream2,
          borderRadius:12, padding:12, display:'flex', alignItems:'center', gap:12,
        }}>
          <div style={{
            width:44, height:44, borderRadius:10, background:val,
            border:'1px solid rgba(0,0,0,0.06)',
          }}/>
          <div>
            <div style={{ fontFamily:FONT_SANS, fontSize:12, fontWeight:600, color: dark? ST.paperD : ST.ink }}>{name}</div>
            <div style={{ fontFamily:FONT_MONO, fontSize:10.5, color: dark? ST.paperD70 : ST.ink50, marginTop:2 }}>{hex}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CardWrap({ title, kicker, children, w=420, h=600, dark=false }) {
  return (
    <div style={{
      width:w, height:h, background: dark? ST.mid : ST.cream,
      borderRadius:20, overflow:'hidden',
      boxShadow:'0 8px 28px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
      padding:'28px 28px 24px', boxSizing:'border-box',
      fontFamily:FONT_SANS,
    }}>
      {kicker && (
        <div style={{
          fontFamily:FONT_SANS, fontSize:11, fontWeight:500, letterSpacing:'.2em',
          textTransform:'uppercase', color: dark? ST.paperD70 : ST.ink50, marginBottom:10,
        }}>{kicker}</div>
      )}
      <div style={{
        fontFamily:FONT_SERIF, fontSize:26, color: dark? ST.paperD : ST.ink,
        letterSpacing:'-0.01em', marginBottom:18, lineHeight:1.12,
      }}>{title}</div>
      {children}
    </div>
  );
}

function ColorTokensCard() {
  return (
    <CardWrap kicker="Color tokens" title="A palette for late-night reading" w={440} h={620}>
      <div style={{ fontFamily:FONT_SANS, fontSize:11, fontWeight:600, color:ST.ink50, marginBottom:8, letterSpacing:'.1em', textTransform:'uppercase' }}>Surface — light</div>
      <SwatchGrid items={[
        ['Cream',     ST.cream,  '#faf4e8'],
        ['Cream-2',   ST.cream2, '#f3ead8'],
        ['Cream-3',   ST.cream3, '#ebdfc7'],
        ['Ink-15',    ST.ink15,  '#dfd5bd'],
      ]}/>
      <div style={{ height:14 }}/>
      <div style={{ fontFamily:FONT_SANS, fontSize:11, fontWeight:600, color:ST.ink50, marginBottom:8, letterSpacing:'.1em', textTransform:'uppercase' }}>Surface — dark (reader default)</div>
      <SwatchGrid items={[
        ['Midnight',  ST.mid,    '#15182a'],
        ['Midnight-2',ST.mid2,   '#1c2138'],
        ['Midnight-3',ST.mid3,   '#262c47'],
        ['Paper-D',   ST.paperD, '#e9dfc9'],
      ]}/>
      <div style={{ height:14 }}/>
      <div style={{ fontFamily:FONT_SANS, fontSize:11, fontWeight:600, color:ST.ink50, marginBottom:8, letterSpacing:'.1em', textTransform:'uppercase' }}>Accents — use sparingly</div>
      <SwatchGrid items={[
        ['Amber',     ST.amber,    '#c9924a'],
        ['Amber-soft',ST.amberSoft,'#e5b574'],
        ['Ember',     ST.ember,    '#a35d3a'],
        ['Sage',      ST.sage,     '#6e8579'],
      ]}/>
    </CardWrap>
  );
}

function TypeCard() {
  return (
    <CardWrap kicker="Typography" title="Two voices, in conversation" w={460} h={620}>
      <div style={{ borderTop:`1px solid ${ST.ink15}`, paddingTop:14, marginBottom:18 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:14, marginBottom:6 }}>
          <div style={{ fontFamily:FONT_SANS, fontSize:11, color:ST.ink50, letterSpacing:'.1em', textTransform:'uppercase' }}>Story · Newsreader</div>
          <div style={{ fontFamily:FONT_MONO, fontSize:11, color:ST.ink50 }}>serif · variable</div>
        </div>
        <div style={{ fontFamily:FONT_SERIF, fontSize:38, lineHeight:1.05, color:ST.ink, letterSpacing:'-0.02em' }}>The long way home.</div>
        <div style={{ fontFamily:FONT_SERIF, fontSize:18, lineHeight:1.5, color:ST.ink70, marginTop:8, textWrap:'pretty' }}>
          She drew a hand. Then she drew the same hand again. Then she stopped, <span style={{ fontStyle:'italic' }}>because the lines had started to look angry.</span>
        </div>
      </div>

      <div style={{ borderTop:`1px solid ${ST.ink15}`, paddingTop:14 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:14, marginBottom:8 }}>
          <div style={{ fontFamily:FONT_SANS, fontSize:11, color:ST.ink50, letterSpacing:'.1em', textTransform:'uppercase' }}>UI · DM Sans</div>
          <div style={{ fontFamily:FONT_MONO, fontSize:11, color:ST.ink50 }}>sans · 400 / 500 / 600</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {[
            ['Display / 28', 28, 400],
            ['Title / 22',   22, 500],
            ['Body / 15',    15, 400],
            ['Label / 13',   13, 500],
            ['Kicker / 11 — uppercase, .2em', 11, 500, true],
          ].map(([l,s,w,kicker]) => (
            <div key={l} style={{
              fontFamily:FONT_SANS, fontSize:s, fontWeight:w, color:ST.ink,
              letterSpacing: kicker? '.2em' : '-0.005em',
              textTransform: kicker? 'uppercase' : 'none',
            }}>{l}</div>
          ))}
        </div>
      </div>

      <div style={{ borderTop:`1px solid ${ST.ink15}`, paddingTop:14, marginTop:18 }}>
        <div style={{ fontFamily:FONT_MONO, fontSize:12, color:ST.ink50 }}>
          Scale 12 · 13 · 15 · 18 · 22 · 28 · 38
        </div>
      </div>
    </CardWrap>
  );
}

function SpacingCard() {
  return (
    <CardWrap kicker="Spacing · Radii · Shadow" title="The grid is quiet" w={440} h={520}>
      <div style={{ fontFamily:FONT_SANS, fontSize:11, color:ST.ink50, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Spacing scale (px)</div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:10, marginBottom:22 }}>
        {[4,8,12,16,22,28,36,48].map(n => (
          <div key={n} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <div style={{ width:n, height:n, background:ST.ember, borderRadius:2 }}/>
            <div style={{ fontFamily:FONT_MONO, fontSize:10, color:ST.ink50 }}>{n}</div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily:FONT_SANS, fontSize:11, color:ST.ink50, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Corner radii</div>
      <div style={{ display:'flex', gap:14, marginBottom:22 }}>
        {[
          ['xs', 6,  'inputs'],
          ['sm', 10, 'chips'],
          ['md', 14, 'fields'],
          ['lg', 18, 'cards'],
          ['xl', 22, 'sheets'],
        ].map(([n,r,u]) => (
          <div key={n} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <div style={{ width:50, height:42, borderRadius:r, background:ST.cream2, border:`1px solid ${ST.ink15}` }}/>
            <div style={{ fontFamily:FONT_MONO, fontSize:10, color:ST.ink }}>{n} · {r}</div>
            <div style={{ fontFamily:FONT_SANS, fontSize:10, color:ST.ink50 }}>{u}</div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily:FONT_SANS, fontSize:11, color:ST.ink50, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Elevation</div>
      <div style={{ display:'flex', gap:14 }}>
        <div style={{ width:120, height:64, borderRadius:14, background:ST.cream, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}/>
        <div style={{ width:120, height:64, borderRadius:14, background:ST.cream, boxShadow:'0 8px 24px rgba(0,0,0,0.08)' }}/>
        <div style={{ width:120, height:64, borderRadius:14, background:ST.cream, boxShadow:'0 30px 60px rgba(0,0,0,0.18)' }}/>
      </div>
    </CardWrap>
  );
}

function ComponentsCard() {
  return (
    <CardWrap kicker="Component library" title="Small kit, used everywhere" w={460} h={620}>
      <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

        <div>
          <Sub>Buttons</Sub>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
            <Pill primary style={{ height:44 }}>Continue</Pill>
            <Pill style={{ height:44 }}>Cancel</Pill>
            <Pill ghost style={{ height:44 }}>Skip</Pill>
          </div>
        </div>

        <div>
          <Sub>Chips</Sub>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <Chip>Maya</Chip>
            <Chip active>Theo</Chip>
            <Chip>Jules</Chip>
            <Chip soft>+ add</Chip>
          </div>
        </div>

        <div>
          <Sub>Input</Sub>
          <Input value="Iris"/>
        </div>

        <div>
          <Sub>Selectable card</Sub>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div style={{
              borderRadius:14, background:ST.ink, color:ST.cream, padding:'12px 14px 14px',
            }}>
              <div style={{ fontFamily:FONT_SERIF, fontSize:16 }}>Hopeful</div>
              <div style={{ fontFamily:FONT_SANS, fontSize:11.5, color:'rgba(250,244,232,0.7)', marginTop:2 }}>A lighter ending.</div>
            </div>
            <div style={{
              borderRadius:14, background:ST.cream2, color:ST.ink, padding:'12px 14px 14px',
              border:`1px solid ${ST.ink15}`,
            }}>
              <div style={{ fontFamily:FONT_SERIF, fontSize:16 }}>Calm</div>
              <div style={{ fontFamily:FONT_SANS, fontSize:11.5, color:ST.ink50, marginTop:2 }}>The day softens.</div>
            </div>
          </div>
        </div>

        <div>
          <Sub>Theme mark</Sub>
          <div style={{ display:'flex', gap:14 }}>
            {['arc','wave','echo','spark','horizon'].map(n => (
              <div key={n} style={{
                width:44, height:44, borderRadius:12, background:ST.cream2,
                border:`1px solid ${ST.ink15}`, display:'flex',
                alignItems:'center', justifyContent:'center',
              }}>
                <Mark name={n} color={ST.ember}/>
              </div>
            ))}
          </div>
        </div>

      </div>
    </CardWrap>
  );
}
function Sub({ children }) {
  return (
    <div style={{
      fontFamily:FONT_SANS, fontSize:11, color:ST.ink50, letterSpacing:'.1em',
      textTransform:'uppercase', marginBottom:8, fontWeight:500,
    }}>{children}</div>
  );
}

function PrinciplesCard() {
  const items = [
    {
      n:'01',
      t:'The story is the product.',
      b:'Every UI choice defers to the reading experience. If a feature would compete with the prose for attention, it doesn\'t belong on the page.',
    },
    {
      n:'02',
      t:'Quiet, not clinical.',
      b:'No streaks, badges, notifications or scores. No therapy framing, no clinical language. Warmth comes from typography, restraint, and copy that sounds like a person.',
    },
    {
      n:'03',
      t:'The teen never knows it was engineered.',
      b:'Parent inputs leave no trace in the teen-facing surface. Stories arrive plainly. Reflection is private, never shared back upstream.',
    },
  ];
  return (
    <CardWrap kicker="UX Principles" title="Three things we won't break" w={520} h={500} dark>
      <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
        {items.map(it => (
          <div key={it.n} style={{ display:'flex', gap:18 }}>
            <div style={{
              fontFamily:FONT_MONO, fontSize:13, color:ST.amberSoft, minWidth:28,
              paddingTop:4,
            }}>{it.n}</div>
            <div>
              <div style={{ fontFamily:FONT_SERIF, fontSize:21, color:ST.paperD, letterSpacing:'-0.01em', marginBottom:6 }}>{it.t}</div>
              <div style={{ fontFamily:FONT_SERIF, fontSize:14.5, lineHeight:1.55, color:ST.paperD70, textWrap:'pretty' }}>{it.b}</div>
            </div>
          </div>
        ))}
      </div>
    </CardWrap>
  );
}

Object.assign(window, { ColorTokensCard, TypeCard, SpacingCard, ComponentsCard, PrinciplesCard });
