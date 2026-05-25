// Landing page variations for Hydration Scale
// Three independent layouts (A: split hero, B: centered bold, C: live demo)

// -------- Design tokens (in-component, scoped) --------
const HS = {
  bg: '#F1EFE8',
  surface: '#FFFFFF',
  border: '#D3D1C7',
  text1: '#2C2C2A',
  text2: '#5F5E5A',
  text3: '#888780',
  teal: '#1D9E75',
  tealDark: '#0F6E56',
  tealLight: '#E1F5EE',
  tealMid: '#9FE1CB',
  amberBg: '#FAEEDA',
  amberBorder: '#FAC775',
  amberText: '#854F0B',
  danger: '#A32D2D',
  font: '"DM Sans", system-ui, -apple-system, sans-serif',
};

// -------- Mingcute icon via Iconify CDN --------
// <Icon name="droplet-fill" size={20} color="#1D9E75" />
function Icon({ name, size = 20, color = 'currentColor', style }) {
  const url = `https://api.iconify.design/mingcute/${name}.svg?color=${encodeURIComponent(color)}`;
  return (
    <img
      src={url}
      width={size}
      height={size}
      alt=""
      draggable={false}
      style={{ display: 'inline-block', verticalAlign: 'middle', flex: '0 0 auto', ...style }}
    />
  );
}

// -------- Shared bits --------
function Navbar({ guest = true }) {
  return (
    <nav
      style={{
        height: 64,
        background: HS.surface,
        borderBottom: `0.5px solid ${HS.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: 32,
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: HS.tealLight,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Icon name="drop-fill" size={16} color={HS.teal} />
        </div>
        <span style={{ fontWeight: 500, fontSize: 15, color: HS.text1, letterSpacing: -0.1 }}>
          Hydration Scale
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 28 }}>
        {(guest ? ['Dashboard', 'Settings'] : ['Dashboard', 'History', 'Settings']).map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontSize: 14,
              color: HS.text2,
              textDecoration: 'none',
              fontWeight: 400,
            }}
          >
            {l}
          </a>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={ghostBtn()}>Sign in</button>
        <button style={tealBtn()}>Create account</button>
      </div>
    </nav>
  );
}

function tealBtn(extra = {}) {
  return {
    height: 36,
    padding: '0 16px',
    borderRadius: 12,
    background: HS.teal,
    color: '#fff',
    border: 'none',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: HS.font,
    cursor: 'pointer',
    ...extra,
  };
}
function ghostBtn(extra = {}) {
  return {
    height: 36,
    padding: '0 14px',
    borderRadius: 12,
    background: 'transparent',
    color: HS.text1,
    border: `0.5px solid ${HS.border}`,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: HS.font,
    cursor: 'pointer',
    ...extra,
  };
}

function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        padding: '24px 32px',
        borderTop: `0.5px solid ${HS.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 12,
        color: HS.text3,
      }}
    >
      <span>© 2026 Hydration Scale</span>
      <span>Built by the Hydration team · v1.0</span>
    </footer>
  );
}

// =====================================================
// VARIATION A — Split hero
// =====================================================
function LandingA() {
  return (
    <div
      style={{
        background: HS.bg,
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      {/* Hero */}
      <section
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '72px 32px 56px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 56,
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 20,
              background: HS.tealLight,
              color: HS.tealDark,
              fontSize: 12,
              fontWeight: 500,
              marginBottom: 20,
            }}
          >
            <Icon name="bluetooth-line" size={12} color={HS.tealDark} />
            Smart coaster · Bluetooth ready
          </div>
          <h1
            style={{
              fontSize: 56,
              lineHeight: 1.05,
              fontWeight: 500,
              letterSpacing: -1.5,
              margin: '0 0 20px',
              textWrap: 'balance',
            }}
          >
            Know every sip.
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: HS.text2,
              margin: '0 0 32px',
              maxWidth: 460,
              textWrap: 'pretty',
            }}
          >
            The Hydration Scale coaster tracks your water intake automatically.
            No manual logging. Just drink.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={tealBtn({ height: 48, fontSize: 15, padding: '0 22px' })}>
              Create account
            </button>
            <button style={ghostBtn({ height: 48, fontSize: 15, padding: '0 20px' })}>
              Try as guest
            </button>
          </div>
          <div
            style={{
              marginTop: 28,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 13,
              color: HS.text3,
            }}
          >
            <Icon name="check-circle-line" size={14} color={HS.text3} />
            No app install · Works in your browser
          </div>
        </div>

        {/* Right: coaster + cup mockup */}
        <CoasterMockup />
      </section>

      {/* Features */}
      <section
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '24px 32px 72px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          <FeatureCard
            icon="scale-line"
            title="Automatic sip detection"
            body="Senses every cup pickup and refill from millisecond weight changes."
          />
          <FeatureCard
            icon="chart-line-line"
            title="Real-time tracking"
            body="Live dashboard updates the instant the coaster sees a change."
          />
          <FeatureCard
            icon="notification-line"
            title="Smart reminders"
            body="Adaptive nudges that learn your pace — never naggy."
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, body }) {
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding: 24,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: HS.tealLight,
          display: 'grid',
          placeItems: 'center',
          marginBottom: 16,
        }}
      >
        <Icon name={icon} size={18} color={HS.teal} />
      </div>
      <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: HS.text2, lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}

// Placeholder coaster visual: round coaster + cup, no slop, just clean shapes
function CoasterMockup() {
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        background: `linear-gradient(180deg, ${HS.tealLight} 0%, ${HS.bg} 100%)`,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 24,
        overflow: 'hidden',
      }}
    >
      {/* subtle stripe placeholder pattern in corner */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, rgba(15,110,86,0.04) 0 8px, transparent 8px 16px)`,
        }}
      />
      {/* Cup */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '32%',
          transform: 'translateX(-50%)',
          width: '38%',
          height: '40%',
          background: '#fff',
          border: `0.5px solid ${HS.border}`,
          borderRadius: '12% 12% 22% 22% / 6% 6% 18% 18%',
          boxShadow: 'inset 0 -16px 0 0 ' + HS.tealLight,
        }}
      >
        {/* water level */}
        <div
          style={{
            position: 'absolute',
            left: 8,
            right: 8,
            bottom: 8,
            height: '55%',
            background: HS.tealMid,
            borderRadius: '0 0 14% 14% / 0 0 30% 30%',
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 11,
            color: HS.text3,
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          }}
        >
          glass · 240ml
        </div>
      </div>
      {/* Coaster */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '14%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '14%',
          background: '#fff',
          border: `0.5px solid ${HS.border}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <span style={{ fontSize: 10, color: HS.text3, fontFamily: 'ui-monospace,monospace' }}>
          weight
        </span>
        <span
          style={{
            fontSize: 12,
            color: HS.teal,
            fontFamily: 'ui-monospace,monospace',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          412 g
        </span>
      </div>
      {/* BLE pulse dot */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 8px 4px 6px',
          borderRadius: 20,
          background: HS.surface,
          border: `0.5px solid ${HS.border}`,
          fontSize: 11,
          color: HS.text2,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: HS.teal,
            boxShadow: `0 0 0 0 ${HS.teal}55`,
            animation: 'hsPulse 1.6s ease-out infinite',
          }}
        />
        connected
      </div>
    </div>
  );
}

// =====================================================
// VARIATION B — Centered bold
// =====================================================
function LandingB() {
  return (
    <div
      style={{
        background: HS.bg,
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      {/* Centered hero */}
      <section
        style={{
          maxWidth: 880,
          margin: '0 auto',
          padding: '96px 32px 56px',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 20,
            background: HS.surface,
            border: `0.5px solid ${HS.border}`,
            color: HS.text2,
            fontSize: 12,
            fontWeight: 500,
            marginBottom: 28,
          }}
        >
          <Icon name="sparkles-line" size={12} color={HS.teal} />
          Now shipping · Hydration Scale v1
        </div>
        <h1
          style={{
            fontSize: 64,
            lineHeight: 1.02,
            fontWeight: 500,
            letterSpacing: -2,
            margin: '0 0 24px',
            textWrap: 'balance',
          }}
        >
          Track hydration.{' '}
          <span style={{ color: HS.teal }}>Automatically.</span>
        </h1>
        <p
          style={{
            fontSize: 19,
            lineHeight: 1.5,
            color: HS.text2,
            margin: '0 auto 36px',
            maxWidth: 560,
            textWrap: 'pretty',
          }}
        >
          A smart coaster that knows the difference between a sip, a refill, and a
          cup you forgot. Drink. We'll handle the rest.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <button
            style={tealBtn({ height: 52, fontSize: 16, padding: '0 28px', minWidth: 220 })}
          >
            Create account
          </button>
          <button
            style={ghostBtn({
              height: 44,
              fontSize: 14,
              background: 'transparent',
              border: 'none',
              color: HS.text2,
            })}
          >
            Try as guest →
          </button>
        </div>
      </section>

      {/* Stat strip */}
      <section
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 32px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            background: HS.surface,
            border: `0.5px solid ${HS.border}`,
            borderRadius: 16,
            padding: '36px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
          }}
        >
          {[
            ['Sip detected in', '< 1s', 'low-latency weight delta'],
            ['Works with', 'any cup', 'no special hardware required'],
            ['No app', 'needed', 'runs in your browser via BLE'],
          ].map(([pre, big, post], i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                padding: '0 16px',
                borderLeft: i === 0 ? 'none' : `0.5px solid ${HS.border}`,
              }}
            >
              <div style={{ fontSize: 13, color: HS.text3, marginBottom: 6 }}>{pre}</div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  letterSpacing: -0.8,
                  color: HS.teal,
                  marginBottom: 6,
                }}
              >
                {big}
              </div>
              <div style={{ fontSize: 13, color: HS.text2 }}>{post}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Alternating feature blocks */}
      <section
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '88px 32px 96px',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 72,
        }}
      >
        <AltFeature
          icon="scale-line"
          title="Sip detection that just works"
          body="The coaster watches sub-gram weight changes and classifies pickups, sips, and refills without a single tap from you."
          flip={false}
        />
        <AltFeature
          icon="chart-line-line"
          title="A dashboard that reacts in real time"
          body="Numbers move as you drink. See your hourly pace, daily total, and streak update live — no refresh."
          flip
        />
        <AltFeature
          icon="notification-line"
          title="Reminders that adapt to your day"
          body="Quiet when you're on pace. Gentle nudges when you're behind. Configurable, never noisy."
          flip={false}
        />
      </section>

      <Footer />
    </div>
  );
}

function AltFeature({ icon, title, body, flip }) {
  const text = (
    <div style={{ flex: '1 1 0' }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: HS.tealLight,
          display: 'grid',
          placeItems: 'center',
          marginBottom: 18,
        }}
      >
        <Icon name={icon} size={20} color={HS.teal} />
      </div>
      <h3
        style={{
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: -0.6,
          margin: '0 0 12px',
          lineHeight: 1.15,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: HS.text2, margin: 0, maxWidth: 440 }}>
        {body}
      </p>
    </div>
  );
  const visual = (
    <div
      style={{
        flex: '1 1 0',
        aspectRatio: '4 / 3',
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 20,
        backgroundImage: `repeating-linear-gradient(45deg, ${HS.bg} 0 12px, transparent 12px 24px)`,
        display: 'grid',
        placeItems: 'center',
        color: HS.text3,
        fontFamily: 'ui-monospace, monospace',
        fontSize: 12,
      }}
    >
      product visual
    </div>
  );
  return (
    <div
      style={{
        display: 'flex',
        gap: 56,
        alignItems: 'center',
        flexDirection: flip ? 'row-reverse' : 'row',
      }}
    >
      {text}
      {visual}
    </div>
  );
}

// =====================================================
// VARIATION C — Minimal w/ live demo card
// =====================================================
function LandingC() {
  // Animated mock values
  const [ml, setMl] = React.useState(720);
  const [sips, setSips] = React.useState(6);
  const [weight, setWeight] = React.useState(412);
  React.useEffect(() => {
    const id = setInterval(() => {
      setMl((v) => Math.min(2500, v + 18));
      setSips((s) => s + (Math.random() > 0.5 ? 1 : 0));
      setWeight((w) => Math.max(280, w + (Math.random() > 0.5 ? -8 : 4)));
    }, 2200);
    return () => clearInterval(id);
  }, []);
  const goal = 2500;
  const pct = Math.min(100, (ml / goal) * 100);

  return (
    <div
      style={{
        background: HS.bg,
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      <section
        style={{
          maxWidth: 920,
          margin: '0 auto',
          padding: '72px 32px 56px',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 12px 5px 10px',
            borderRadius: 20,
            background: HS.surface,
            border: `0.5px solid ${HS.border}`,
            color: HS.text2,
            fontSize: 12,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: HS.teal,
              boxShadow: `0 0 0 0 ${HS.teal}55`,
              animation: 'hsPulse 1.6s ease-out infinite',
            }}
          />
          Smart coaster · BLE connected
        </div>
        <h1
          style={{
            fontSize: 52,
            lineHeight: 1.04,
            fontWeight: 500,
            letterSpacing: -1.6,
            margin: '0 0 18px',
            textWrap: 'balance',
          }}
        >
          Your hydration, live.
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: HS.text2,
            margin: '0 auto 40px',
            maxWidth: 540,
            textWrap: 'pretty',
          }}
        >
          A preview of the dashboard you'll see the moment your coaster pairs.
          No screenshots, no marketing speak — the real thing.
        </p>

        {/* Live preview card */}
        <div
          style={{
            background: HS.surface,
            border: `0.5px solid ${HS.border}`,
            borderRadius: 16,
            padding: 28,
            textAlign: 'left',
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          {/* Progress */}
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              background: HS.bg,
              border: `0.5px solid ${HS.border}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 13, color: HS.text3 }}>Today</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: HS.amberBg,
                  border: `0.5px solid ${HS.amberBorder}`,
                  color: HS.amberText,
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                <Icon name="fire-line" size={11} color={HS.amberText} />
                14 day streak
              </span>
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 500,
                letterSpacing: -1,
                fontVariantNumeric: 'tabular-nums',
                color: HS.text1,
                marginBottom: 4,
                transition: 'all .4s ease-out',
              }}
            >
              {ml.toLocaleString()}{' '}
              <span style={{ fontSize: 20, color: HS.text3, fontWeight: 400 }}>
                / {goal.toLocaleString()} ml
              </span>
            </div>
            <div style={{ fontSize: 13, color: HS.text2, marginBottom: 14 }}>
              {Math.round(pct)}% of daily goal
            </div>
            <div
              style={{
                height: 8,
                background: HS.border,
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: HS.teal,
                  borderRadius: 20,
                  transition: 'width 400ms cubic-bezier(.2,.7,.3,1)',
                }}
              />
            </div>
          </div>
          {/* Live readings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <MiniStat label="Scale weight" value={`${weight} g`} icon="scale-line" />
            <MiniStat label="Sips today" value={sips} icon="drop-line" />
            <MiniStat label="Avg sip" value={`32 ml`} icon="chart-bar-line" />
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <button
            style={tealBtn({ height: 48, fontSize: 15, padding: '0 28px', minWidth: 200 })}
          >
            Start tracking
          </button>
          <div style={{ marginTop: 12, fontSize: 13, color: HS.text3 }}>
            Free · Browser-only · No signup to try
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function MiniStat({ label, value, icon }) {
  return (
    <div
      style={{
        flex: 1,
        padding: 14,
        borderRadius: 12,
        border: `0.5px solid ${HS.border}`,
        background: HS.bg,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: HS.tealLight,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Icon name={icon} size={16} color={HS.teal} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 11, color: HS.text3 }}>{label}</span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: HS.text1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

// =====================================================
// MOBILE VARIATIONS (390px viewport)
// =====================================================

function MobileNavbar() {
  return (
    <nav
      style={{
        height: 56,
        background: HS.surface,
        borderBottom: `0.5px solid ${HS.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: HS.tealLight,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Icon name="drop-fill" size={14} color={HS.teal} />
        </div>
        <span style={{ fontWeight: 500, fontSize: 14, color: HS.text1 }}>
          Hydration Scale
        </span>
      </div>
      <button style={tealBtn({ height: 32, fontSize: 13, padding: '0 12px' })}>
        Sign in
      </button>
      <button
        style={{
          width: 32,
          height: 32,
          border: `0.5px solid ${HS.border}`,
          borderRadius: 10,
          background: 'transparent',
          display: 'grid',
          placeItems: 'center',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <Icon name="menu-line" size={16} color={HS.text1} />
      </button>
    </nav>
  );
}

function MobileFooter() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        padding: '20px 20px 24px',
        borderTop: `0.5px solid ${HS.border}`,
        fontSize: 11,
        color: HS.text3,
        textAlign: 'center',
      }}
    >
      © 2026 Hydration Scale · v1.0
    </footer>
  );
}

// MOBILE A — stacked split
function MobileLandingA() {
  return (
    <div
      style={{
        background: HS.bg,
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MobileNavbar />
      <section style={{ padding: '32px 20px 24px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 20,
            background: HS.tealLight,
            color: HS.tealDark,
            fontSize: 11,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          <Icon name="bluetooth-line" size={11} color={HS.tealDark} />
          Smart coaster · BLE
        </div>
        <h1
          style={{
            fontSize: 36,
            lineHeight: 1.05,
            fontWeight: 500,
            letterSpacing: -1,
            margin: '0 0 14px',
            textWrap: 'balance',
          }}
        >
          Know every sip.
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.55,
            color: HS.text2,
            margin: '0 0 22px',
          }}
        >
          The Hydration Scale coaster tracks your water intake automatically. No
          manual logging. Just drink.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={tealBtn({ height: 46, fontSize: 15, width: '100%' })}>
            Create account
          </button>
          <button style={ghostBtn({ height: 46, fontSize: 15, width: '100%' })}>
            Try as guest
          </button>
        </div>
      </section>
      <section style={{ padding: '0 20px 24px' }}>
        <div style={{ height: 240 }}>
          <CoasterMockup />
        </div>
      </section>
      <section
        style={{
          padding: '8px 20px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <FeatureCard
          icon="scale-line"
          title="Automatic sip detection"
          body="Sub-gram weight deltas, classified into pickups, sips, refills."
        />
        <FeatureCard
          icon="chart-line-line"
          title="Real-time tracking"
          body="Dashboard updates the instant the coaster sees a change."
        />
        <FeatureCard
          icon="notification-line"
          title="Smart reminders"
          body="Adaptive nudges that learn your pace — never naggy."
        />
      </section>
      <MobileFooter />
    </div>
  );
}

// MOBILE B — centered bold
function MobileLandingB() {
  return (
    <div
      style={{
        background: HS.bg,
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MobileNavbar />
      <section
        style={{
          padding: '44px 20px 32px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 20,
            background: HS.surface,
            border: `0.5px solid ${HS.border}`,
            color: HS.text2,
            fontSize: 11,
            fontWeight: 500,
            marginBottom: 20,
          }}
        >
          <Icon name="sparkles-line" size={11} color={HS.teal} />
          Now shipping v1
        </div>
        <h1
          style={{
            fontSize: 40,
            lineHeight: 1.02,
            fontWeight: 500,
            letterSpacing: -1.4,
            margin: '0 0 16px',
            textWrap: 'balance',
          }}
        >
          Track hydration. <span style={{ color: HS.teal }}>Automatically.</span>
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.5,
            color: HS.text2,
            margin: '0 auto 24px',
            maxWidth: 320,
          }}
        >
          A smart coaster that knows the difference between a sip, a refill, and
          a cup you forgot.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            style={tealBtn({ height: 48, fontSize: 15, width: '100%' })}
          >
            Create account
          </button>
          <button
            style={{
              height: 40,
              fontSize: 14,
              background: 'transparent',
              border: 'none',
              color: HS.text2,
              cursor: 'pointer',
              fontFamily: HS.font,
            }}
          >
            Try as guest →
          </button>
        </div>
      </section>
      {/* Stat strip stacked */}
      <section style={{ padding: '0 20px 32px' }}>
        <div
          style={{
            background: HS.surface,
            border: `0.5px solid ${HS.border}`,
            borderRadius: 16,
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {[
            ['Sip detected in', '< 1s', 'low-latency weight delta'],
            ['Works with', 'any cup', 'no special hardware'],
            ['No app', 'needed', 'runs in your browser'],
          ].map(([pre, big, post], i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                paddingTop: i === 0 ? 0 : 14,
                borderTop: i === 0 ? 'none' : `0.5px solid ${HS.border}`,
              }}
            >
              <div style={{ fontSize: 12, color: HS.text3, marginBottom: 4 }}>
                {pre}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  letterSpacing: -0.6,
                  color: HS.teal,
                  marginBottom: 4,
                }}
              >
                {big}
              </div>
              <div style={{ fontSize: 12, color: HS.text2 }}>{post}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Features stacked */}
      <section
        style={{
          padding: '4px 20px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {[
          [
            'scale-line',
            'Sip detection that just works',
            'Sub-gram weight changes classified into pickups, sips, and refills.',
          ],
          [
            'chart-line-line',
            'A dashboard that reacts',
            'Numbers move as you drink. Live pace, total, and streak.',
          ],
          [
            'notification-line',
            'Reminders that adapt',
            'Quiet when on pace. Gentle nudges when behind.',
          ],
        ].map(([icon, t, b], i) => (
          <div key={i}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: HS.tealLight,
                display: 'grid',
                placeItems: 'center',
                marginBottom: 12,
              }}
            >
              <Icon name={icon} size={18} color={HS.teal} />
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: -0.4,
                margin: '0 0 6px',
              }}
            >
              {t}
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: HS.text2,
                margin: 0,
              }}
            >
              {b}
            </p>
          </div>
        ))}
      </section>
      <MobileFooter />
    </div>
  );
}

// MOBILE C — live demo
function MobileLandingC() {
  const [ml, setMl] = React.useState(720);
  const [sips, setSips] = React.useState(6);
  const [weight, setWeight] = React.useState(412);
  React.useEffect(() => {
    const id = setInterval(() => {
      setMl((v) => Math.min(2500, v + 18));
      setSips((s) => s + (Math.random() > 0.5 ? 1 : 0));
      setWeight((w) => Math.max(280, w + (Math.random() > 0.5 ? -8 : 4)));
    }, 2200);
    return () => clearInterval(id);
  }, []);
  const goal = 2500;
  const pct = Math.min(100, (ml / goal) * 100);

  return (
    <div
      style={{
        background: HS.bg,
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MobileNavbar />
      <section style={{ padding: '32px 20px 28px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px 4px 8px',
            borderRadius: 20,
            background: HS.surface,
            border: `0.5px solid ${HS.border}`,
            color: HS.text2,
            fontSize: 11,
            fontWeight: 500,
            marginBottom: 18,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: HS.teal,
              boxShadow: `0 0 0 0 ${HS.teal}55`,
              animation: 'hsPulse 1.6s ease-out infinite',
            }}
          />
          BLE connected
        </div>
        <h1
          style={{
            fontSize: 34,
            lineHeight: 1.05,
            fontWeight: 500,
            letterSpacing: -1.1,
            margin: '0 0 12px',
            textWrap: 'balance',
          }}
        >
          Your hydration, live.
        </h1>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.55,
            color: HS.text2,
            margin: '0 0 24px',
          }}
        >
          A preview of the dashboard you'll see the moment your coaster pairs.
        </p>
        {/* Live preview card */}
        <div
          style={{
            background: HS.surface,
            border: `0.5px solid ${HS.border}`,
            borderRadius: 16,
            padding: 16,
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: HS.bg,
              border: `0.5px solid ${HS.border}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 12, color: HS.text3 }}>Today</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: HS.amberBg,
                  border: `0.5px solid ${HS.amberBorder}`,
                  color: HS.amberText,
                  fontSize: 10,
                  fontWeight: 500,
                }}
              >
                <Icon name="fire-line" size={10} color={HS.amberText} />
                14 day streak
              </span>
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: -0.8,
                fontVariantNumeric: 'tabular-nums',
                marginBottom: 2,
              }}
            >
              {ml.toLocaleString()}
              <span style={{ fontSize: 14, color: HS.text3, fontWeight: 400 }}>
                {' '}
                / {goal.toLocaleString()} ml
              </span>
            </div>
            <div style={{ fontSize: 12, color: HS.text2, marginBottom: 12 }}>
              {Math.round(pct)}% of daily goal
            </div>
            <div
              style={{
                height: 6,
                background: HS.border,
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: HS.teal,
                  borderRadius: 20,
                  transition: 'width 400ms cubic-bezier(.2,.7,.3,1)',
                }}
              />
            </div>
          </div>
          <MiniStat label="Scale weight" value={`${weight} g`} icon="scale-line" />
          <MiniStat label="Sips today" value={sips} icon="drop-line" />
          <MiniStat label="Avg sip" value="32 ml" icon="chart-bar-line" />
        </div>
        <div style={{ marginTop: 24 }}>
          <button
            style={tealBtn({ height: 48, fontSize: 15, width: '100%' })}
          >
            Start tracking
          </button>
          <div style={{ marginTop: 10, fontSize: 12, color: HS.text3 }}>
            Free · Browser-only · No signup
          </div>
        </div>
      </section>
      <MobileFooter />
    </div>
  );
}

// expose
Object.assign(window, {
  LandingA,
  LandingB,
  LandingC,
  MobileLandingA,
  MobileLandingB,
  MobileLandingC,
});
