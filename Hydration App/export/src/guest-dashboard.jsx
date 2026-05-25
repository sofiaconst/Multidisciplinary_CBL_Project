// Screen 3 — Guest Dashboard
// Two layouts × (before-connect / after-connect) × desktop + mobile.
// Includes "Scan QR code" pairing affordance throughout.

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

function Icon({ name, size = 20, color = 'currentColor', style }) {
  const tag = String(color).replace('#', '').toLowerCase();
  const key = `icon__${name}__${tag}`;
  const bundled =
    typeof window !== 'undefined' && window.__resources && window.__resources[key];
  const url =
    bundled ||
    `https://api.iconify.design/mingcute/${name}.svg?color=${encodeURIComponent(color)}`;
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    ...extra,
  };
}

// ----- Navbar -----
function GuestNavbar({ mobile = false }) {
  if (mobile) {
    return (
      <nav
        style={{
          height: 56,
          background: HS.surface,
          borderBottom: `0.5px solid ${HS.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 8,
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
      </nav>
    );
  }
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
        {['Dashboard', 'Settings'].map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontSize: 14,
              color: l === 'Dashboard' ? HS.text1 : HS.text2,
              textDecoration: 'none',
              fontWeight: l === 'Dashboard' ? 500 : 400,
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

// ----- Guest banner -----
function GuestBanner({ compact = false }) {
  return (
    <div
      style={{
        background: HS.tealLight,
        border: `0.5px solid ${HS.tealMid}`,
        borderRadius: 12,
        padding: compact ? '12px 14px' : '14px 18px',
        display: 'flex',
        alignItems: compact ? 'flex-start' : 'center',
        flexDirection: compact ? 'column' : 'row',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
        <Icon name="information-line" size={18} color={HS.tealDark} style={{ marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 14, color: HS.tealDark, fontWeight: 500, marginBottom: 2 }}>
            You're browsing as a guest
          </div>
          <div style={{ fontSize: 13, color: HS.tealDark, opacity: 0.85, lineHeight: 1.45 }}>
            Create a free account to save your history and set personal goals.
          </div>
        </div>
      </div>
      <button
        style={tealBtn({
          height: 34,
          fontSize: 13,
          padding: '0 14px',
          flex: '0 0 auto',
        })}
      >
        Create account
      </button>
    </div>
  );
}

// ----- Connect card (before state) -----
function ConnectCard({ compact = false }) {
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding: compact ? 24 : 40,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: compact ? 56 : 72,
          height: compact ? 56 : 72,
          borderRadius: '50%',
          background: HS.tealLight,
          display: 'grid',
          placeItems: 'center',
          marginBottom: 16,
          position: 'relative',
        }}
      >
        <Icon name="bluetooth-line" size={compact ? 28 : 34} color={HS.teal} />
        <span
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            border: `1px solid ${HS.tealMid}`,
            animation: 'hsRing 2s ease-out infinite',
          }}
        />
      </div>
      <h2
        style={{
          fontSize: compact ? 18 : 22,
          fontWeight: 500,
          letterSpacing: -0.3,
          margin: '0 0 6px',
          color: HS.text1,
        }}
      >
        Connect your scale to start tracking
      </h2>
      <p
        style={{
          margin: '0 0 22px',
          color: HS.text2,
          fontSize: compact ? 13 : 14,
          maxWidth: 400,
          lineHeight: 1.5,
        }}
      >
        Pair via Bluetooth, or scan the QR code on the bottom of your coaster.
      </p>
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button style={tealBtn({ height: 42, padding: '0 18px', fontSize: 14 })}>
          <Icon name="bluetooth-line" size={16} color="#fff" />
          Connect via Bluetooth
        </button>
        <button style={ghostBtn({ height: 42, padding: '0 16px', fontSize: 14 })}>
          <Icon name="qrcode-line" size={16} color={HS.text1} />
          Scan QR code
        </button>
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: HS.text3 }}>
        Works with Chrome, Edge, and Opera.
      </div>
    </div>
  );
}

// ----- Live (connected) stats -----
function useLiveSession() {
  const [ml, setMl] = React.useState(820);
  const [sips, setSips] = React.useState(8);
  const [weight, setWeight] = React.useState(412);
  const [nextDue, setNextDue] = React.useState(11);
  React.useEffect(() => {
    const id = setInterval(() => {
      setMl((v) => Math.min(2500, v + 22));
      setSips((s) => s + (Math.random() > 0.55 ? 1 : 0));
      setWeight((w) =>
        Math.max(280, Math.min(560, w + Math.round((Math.random() - 0.5) * 18)))
      );
      setNextDue((n) => (n <= 1 ? 24 : n - 1));
    }, 2400);
    return () => clearInterval(id);
  }, []);
  return { ml, sips, weight, nextDue, goal: 2500 };
}

function LiveWeightCard({ weight, compact }) {
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding: compact ? 18 : 22,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <div
        style={{
          width: compact ? 44 : 52,
          height: compact ? 44 : 52,
          borderRadius: 14,
          background: HS.tealLight,
          display: 'grid',
          placeItems: 'center',
          flex: '0 0 auto',
        }}
      >
        <Icon name="scale-line" size={compact ? 22 : 26} color={HS.teal} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: HS.text3, marginBottom: 2 }}>
          Live scale weight
        </div>
        <div
          style={{
            fontSize: compact ? 26 : 32,
            fontWeight: 500,
            letterSpacing: -0.8,
            color: HS.text1,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}
        >
          {weight}{' '}
          <span style={{ fontSize: 15, color: HS.text3, fontWeight: 400 }}>g</span>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: HS.teal,
          fontSize: 12,
          fontWeight: 500,
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
        tracking
      </div>
    </div>
  );
}

function StatTile({ label, value, icon, sub, compact }) {
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding: compact ? 14 : 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name={icon} size={14} color={HS.text3} />
        <span style={{ fontSize: 12, color: HS.text3 }}>{label}</span>
      </div>
      <div
        style={{
          fontSize: compact ? 22 : 26,
          fontWeight: 500,
          letterSpacing: -0.6,
          color: HS.text1,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub ? <div style={{ fontSize: 12, color: HS.text3 }}>{sub}</div> : null}
    </div>
  );
}

function ProgressCard({ ml, goal, compact }) {
  const pct = Math.min(100, (ml / goal) * 100);
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding: compact ? 18 : 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 13, color: HS.text3 }}>Today · default goal</span>
        <span
          style={{
            fontSize: 12,
            color: HS.text2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.round(pct)}%
        </span>
      </div>
      <div
        style={{
          fontSize: compact ? 28 : 36,
          fontWeight: 500,
          letterSpacing: -1,
          color: HS.text1,
          marginBottom: 14,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {ml.toLocaleString()}{' '}
        <span style={{ fontSize: 16, color: HS.text3, fontWeight: 400 }}>
          / {goal.toLocaleString()} ml
        </span>
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
            transition: 'width 600ms cubic-bezier(.2,.7,.3,1)',
          }}
        />
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: HS.text3 }}>
        Sign in to set a personal goal and save this session.
      </div>
    </div>
  );
}

function TipCard() {
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding: 22,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Icon name="information-line" size={16} color={HS.teal} />
        <span style={{ fontSize: 14, fontWeight: 500 }}>How it works</span>
      </div>
      <ol
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          counterReset: 'step',
        }}
      >
        {[
          ['Place the coaster', 'On a flat, dry surface.'],
          ['Pair via Bluetooth or QR', 'Browser pairing only — no app.'],
          ['Set your cup down', 'Sips, refills, and pickups are detected automatically.'],
        ].map(([t, b], i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: HS.tealLight,
                color: HS.tealDark,
                fontSize: 12,
                fontWeight: 500,
                display: 'grid',
                placeItems: 'center',
                flex: '0 0 auto',
              }}
            >
              {i + 1}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: HS.text1, fontWeight: 500 }}>{t}</div>
              <div style={{ fontSize: 12.5, color: HS.text2, marginTop: 2, lineHeight: 1.5 }}>
                {b}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BenefitsCard() {
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding: 22,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Icon name="gift-line" size={16} color={HS.teal} />
        <span style={{ fontSize: 14, fontWeight: 500 }}>With an account</span>
      </div>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {[
          'Save daily, weekly, and monthly history',
          'Set a personal hydration target',
          'Adaptive reminders + LED color',
          'Sync across devices',
        ].map((t, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              fontSize: 13.5,
              color: HS.text1,
            }}
          >
            <Icon name="check-circle-fill" size={14} color={HS.teal} />
            {t}
          </li>
        ))}
      </ul>
      <button
        style={tealBtn({
          height: 38,
          marginTop: 18,
          width: '100%',
          justifyContent: 'center',
        })}
      >
        Create free account
      </button>
    </div>
  );
}

// =====================================================
// VARIATION A — Single column centered
// =====================================================
function GuestA({ connected = false, mobile = false }) {
  const live = useLiveSession();
  const compact = mobile;
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
      <GuestNavbar mobile={mobile} />
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 720,
          margin: '0 auto',
          padding: mobile ? '20px 16px 32px' : '32px 24px 56px',
          display: 'flex',
          flexDirection: 'column',
          gap: mobile ? 16 : 20,
          boxSizing: 'border-box',
        }}
      >
        <GuestBanner compact={mobile} />
        {connected ? (
          <>
            <ProgressCard ml={live.ml} goal={live.goal} compact={compact} />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: mobile ? '1fr 1fr 1fr' : 'repeat(3, 1fr)',
                gap: 12,
              }}
            >
              <StatTile
                label="Sips"
                value={live.sips}
                icon="drop-line"
                sub="this session"
                compact={compact}
              />
              <StatTile
                label="Consumed"
                value={`${live.ml.toLocaleString()} ml`}
                icon="drink-line"
                compact={compact}
              />
              <StatTile
                label="Avg sip"
                value="32 ml"
                icon="chart-bar-line"
                compact={compact}
              />
            </div>
            <LiveWeightCard weight={live.weight} compact={compact} />
          </>
        ) : (
          <ConnectCard compact={compact} />
        )}
      </main>
      <footer
        style={{
          padding: mobile ? '16px 20px' : '24px 32px',
          borderTop: `0.5px solid ${HS.border}`,
          fontSize: 12,
          color: HS.text3,
          textAlign: 'center',
        }}
      >
        © 2026 Hydration Scale
      </footer>
    </div>
  );
}

// =====================================================
// VARIATION B — Dashboard layout (main + side rail)
// =====================================================
function GuestB({ connected = false, mobile = false }) {
  const live = useLiveSession();
  const compact = mobile;
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
      <GuestNavbar mobile={mobile} />
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 1180,
          margin: '0 auto',
          padding: mobile ? '20px 16px 32px' : '32px 32px 56px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ marginBottom: mobile ? 16 : 20 }}>
          <GuestBanner compact={mobile} />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: mobile ? '1fr' : 'minmax(0, 1fr) 320px',
            gap: mobile ? 16 : 20,
          }}
        >
          {/* Main column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 14 : 16 }}>
            {connected ? (
              <>
                <ProgressCard ml={live.ml} goal={live.goal} compact={compact} />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(3, 1fr)',
                    gap: 12,
                  }}
                >
                  <StatTile label="Sips" value={live.sips} icon="drop-line" sub="this session" compact={compact} />
                  <StatTile label="Consumed" value={`${live.ml.toLocaleString()} ml`} icon="drink-line" compact={compact} />
                  <StatTile label="Avg sip" value="32 ml" icon="chart-bar-line" compact={compact} />
                </div>
                <LiveWeightCard weight={live.weight} compact={compact} />
              </>
            ) : (
              <ConnectCard compact={compact} />
            )}
          </div>
          {/* Side rail */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: mobile ? 14 : 16,
              minWidth: 0,
            }}
          >
            <TipCard />
            <BenefitsCard />
          </div>
        </div>
      </main>
      <footer
        style={{
          padding: mobile ? '16px 20px' : '24px 32px',
          borderTop: `0.5px solid ${HS.border}`,
          fontSize: 12,
          color: HS.text3,
          textAlign: 'center',
        }}
      >
        © 2026 Hydration Scale
      </footer>
    </div>
  );
}

// =====================================================
// QR pairing modal preview (bonus artboard)
// =====================================================
function QRPairingModal() {
  return (
    <div
      style={{
        background: 'rgba(20,18,15,0.32)',
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
      }}
    >
      <div
        style={{
          width: 420,
          background: HS.surface,
          border: `0.5px solid ${HS.border}`,
          borderRadius: 20,
          padding: 28,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div
          style={{
            alignSelf: 'center',
            width: 40,
            height: 40,
            borderRadius: 12,
            background: HS.tealLight,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Icon name="qrcode-line" size={22} color={HS.teal} />
        </div>
        <h3
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: -0.4,
          }}
        >
          Scan your scale's QR code
        </h3>
        <p style={{ margin: 0, fontSize: 13.5, color: HS.text2, lineHeight: 1.5 }}>
          Flip the coaster over. Point your camera at the square code on the
          underside.
        </p>
        {/* QR placeholder */}
        <div
          style={{
            alignSelf: 'center',
            width: 220,
            height: 220,
            borderRadius: 16,
            border: `0.5px solid ${HS.border}`,
            position: 'relative',
            overflow: 'hidden',
            background: HS.bg,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {/* Faux QR — grid of squares */}
          <div
            style={{
              width: 180,
              height: 180,
              display: 'grid',
              gridTemplateColumns: 'repeat(11, 1fr)',
              gap: 2,
            }}
          >
            {Array.from({ length: 121 }).map((_, i) => (
              <span
                key={i}
                style={{
                  background:
                    // pseudo-random pattern but stable
                    (i * 17 + 3) % 7 < 3 ? HS.text1 : 'transparent',
                  borderRadius: 1,
                }}
              />
            ))}
          </div>
          {/* Corner markers */}
          {[
            { top: 6, left: 6 },
            { top: 6, right: 6 },
            { bottom: 6, left: 6 },
          ].map((pos, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                ...pos,
                width: 32,
                height: 32,
                border: `4px solid ${HS.text1}`,
                borderRadius: 6,
                background: HS.bg,
              }}
            />
          ))}
          {/* Scan line */}
          <span
            style={{
              position: 'absolute',
              left: 12,
              right: 12,
              height: 2,
              background: HS.teal,
              boxShadow: `0 0 12px ${HS.teal}`,
              animation: 'hsScan 1.8s ease-in-out infinite',
              borderRadius: 2,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 12,
            color: HS.text3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: HS.amberBorder,
              animation: 'hsPulse 1.6s ease-out infinite',
            }}
          />
          Looking for code…
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button style={ghostBtn({ flex: 1, justifyContent: 'center' })}>
            Use Bluetooth instead
          </button>
          <button style={tealBtn({ flex: 1, justifyContent: 'center' })}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { GuestA, GuestB, QRPairingModal });
