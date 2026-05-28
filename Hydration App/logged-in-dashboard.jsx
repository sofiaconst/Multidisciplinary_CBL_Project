// Screen 4 — Logged-in dashboard
// Three layout variations × desktop + mobile.

const HS = {
  bg: '#F1EFE8',
  surface: '#FFFFFF',
  border: '#D3D1C7',
  text1: '#2C2C2A',
  text2: '#5F5E5A',
  text3: '#888780',
  teal: '#0087BD',
  tealDark: '#005C82',
  tealLight: '#E0F2FA',
  tealMid: '#7FC3DE',
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
    padding: '0 14px',
    borderRadius: 12,
    background: HS.teal,
    color: '#fff',
    border: 'none',
    fontSize: 13.5,
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
    fontSize: 13.5,
    fontWeight: 500,
    fontFamily: HS.font,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    ...extra,
  };
}

// ----- Avatar pill (logged-in user) -----
function AvatarPill({ initials = 'AR', name = 'Alex', compact = false }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: compact ? 32 : 36,
        padding: compact ? '0 10px 0 4px' : '0 12px 0 4px',
        borderRadius: 20,
        border: `0.5px solid ${HS.border}`,
        background: HS.surface,
        fontFamily: HS.font,
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          width: compact ? 24 : 28,
          height: compact ? 24 : 28,
          borderRadius: '50%',
          background: HS.tealLight,
          color: HS.tealDark,
          display: 'grid',
          placeItems: 'center',
          fontSize: 11,
          fontWeight: 500,
        }}
      >
        {initials}
      </span>
      <span style={{ fontSize: 13, color: HS.text1, fontWeight: 500 }}>{name}</span>
    </div>
  );
}

// ----- Logged-in navbar -----
function LoggedNavbar({ mobile, active = 'Dashboard', connected = true }) {
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
          gap: 10,
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
            Sippy
          </span>
        </div>
        <ConnectionPill connected={connected} compact />
        <AvatarPill compact />
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
          Sippy
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 28 }}>
        {['Dashboard', 'History', 'Settings'].map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontSize: 14,
              color: l === active ? HS.text1 : HS.text2,
              textDecoration: 'none',
              fontWeight: l === active ? 500 : 400,
              position: 'relative',
            }}
          >
            {l}
            {l === active ? (
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -22,
                  height: 2,
                  borderRadius: 2,
                  background: HS.teal,
                }}
              />
            ) : null}
          </a>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {connected ? (
          <ConnectionPill connected />
        ) : (
          <button style={tealBtn()}>
            <Icon name="bluetooth-line" size={14} color="#FFFFFF" />
            Connect scale
          </button>
        )}
        <AvatarPill />
      </div>
    </nav>
  );
}

function ConnectionPill({ connected, compact }) {
  if (!connected) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 20,
          border: `0.5px solid ${HS.border}`,
          background: HS.surface,
          fontSize: 12,
          color: HS.text2,
          fontWeight: 500,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: HS.text3,
          }}
        />
        Scale offline
      </span>
    );
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 20,
        border: `0.5px solid ${HS.tealMid}`,
        background: HS.tealLight,
        fontSize: 12,
        color: HS.tealDark,
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
      {compact ? 'Live' : 'Scale connected'}
    </span>
  );
}

// ----- Live session hook -----
function useLive() {
  const [ml, setMl] = React.useState(1620);
  const [sips, setSips] = React.useState(14);
  const [weight, setWeight] = React.useState(412);
  const [nextDue, setNextDue] = React.useState(11);
  React.useEffect(() => {
    const id = setInterval(() => {
      setMl((v) => Math.min(2800, v + 24));
      setSips((s) => s + (Math.random() > 0.6 ? 1 : 0));
      setWeight((w) => Math.max(280, Math.min(560, w + Math.round((Math.random() - 0.5) * 20))));
      setNextDue((n) => (n <= 1 ? 28 : n - 1));
    }, 2500);
    return () => clearInterval(id);
  }, []);
  return { ml, sips, weight, nextDue, goal: 2800 };
}

// ----- Streak pill (only if streak > 0) -----
function StreakPill({ days = 14, compact = false }) {
  if (!days) return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: compact ? '2px 8px' : '4px 10px',
        borderRadius: 20,
        background: HS.amberBg,
        border: `0.5px solid ${HS.amberBorder}`,
        color: HS.amberText,
        fontSize: compact ? 11 : 12,
        fontWeight: 500,
      }}
    >
      <Icon name="fire-fill" size={compact ? 11 : 12} color={HS.amberText} />
      {days} day streak
    </span>
  );
}

// ----- Greeting bar -----
function GreetingBar({ name = 'Alex', mobile }) {
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding: mobile ? '14px 16px' : '18px 22px',
        display: 'flex',
        alignItems: mobile ? 'flex-start' : 'center',
        gap: 12,
        flexDirection: mobile ? 'column' : 'row',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: HS.text3, marginBottom: 2 }}>
          {greetingFor(new Date())}
        </div>
        <div
          style={{
            fontSize: mobile ? 22 : 24,
            fontWeight: 500,
            letterSpacing: -0.4,
            color: HS.text1,
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <StreakPill days={14} />
        <ConnectionPill connected />
      </div>
    </div>
  );
}
function greetingFor(d) {
  const h = d.getHours();
  if (h < 5) return 'Late night';
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

// ----- Daily goal card -----
function DailyGoal({ ml, goal, mobile }) {
  const pct = Math.min(100, (ml / goal) * 100);
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding: mobile ? 18 : 22,
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
        <span style={{ fontSize: 13, color: HS.text3 }}>Today's goal</span>
        <span
          style={{
            fontSize: 13,
            color: HS.text2,
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 500,
          }}
        >
          {Math.round(pct)}%
        </span>
      </div>
      <div
        style={{
          fontSize: mobile ? 30 : 38,
          fontWeight: 500,
          letterSpacing: -1,
          color: HS.text1,
          fontVariantNumeric: 'tabular-nums',
          marginBottom: 14,
        }}
      >
        {ml.toLocaleString()}{' '}
        <span style={{ fontSize: 16, color: HS.text3, fontWeight: 400 }}>
          / {goal.toLocaleString()} ml
        </span>
      </div>
      <div
        style={{
          height: 10,
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
    </div>
  );
}

// ----- Stat tile -----
function Stat({ label, value, sub, icon, compact, trend }) {
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: HS.text3,
          fontSize: 12,
        }}
      >
        <Icon name={icon} size={14} color={HS.text3} />
        {label}
      </div>
      <div
        style={{
          fontSize: compact ? 22 : 28,
          fontWeight: 500,
          letterSpacing: -0.6,
          color: HS.text1,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: HS.text3 }}>
        {trend ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: HS.teal,
              fontWeight: 500,
            }}
          >
            <Icon name="arrow-up-line" size={11} color={HS.teal} />
            {trend}
          </span>
        ) : null}
        {sub}
      </div>
    </div>
  );
}

// ----- Reminder card (white normal / amber due) -----
function ReminderCard({ due = false, compact }) {
  const ambient = due
    ? {
        bg: HS.amberBg,
        border: HS.amberBorder,
        text: HS.amberText,
      }
    : {
        bg: HS.surface,
        border: HS.border,
        text: HS.text2,
      };
  return (
    <div
      style={{
        background: ambient.bg,
        border: `0.5px solid ${ambient.border}`,
        borderRadius: 16,
        padding: compact ? 16 : 22,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        transition: 'background .3s, border-color .3s',
      }}
    >
      <div
        style={{
          width: compact ? 40 : 48,
          height: compact ? 40 : 48,
          borderRadius: 14,
          background: due ? 'rgba(133,79,11,0.12)' : HS.tealLight,
          display: 'grid',
          placeItems: 'center',
          flex: '0 0 auto',
        }}
      >
        <Icon
          name={due ? 'notification-line' : 'time-line'}
          size={compact ? 18 : 22}
          color={due ? HS.amberText : HS.teal}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            color: ambient.text,
            fontWeight: 500,
            marginBottom: 2,
          }}
        >
          {due ? 'Time to drink' : 'Next reminder'}
        </div>
        <div
          style={{
            fontSize: compact ? 14 : 15,
            color: due ? HS.amberText : HS.text1,
            lineHeight: 1.4,
          }}
        >
          {due
            ? "You're 8 minutes overdue. Take a sip."
            : 'In 28 minutes · adaptive pacing'}
        </div>
      </div>
      {due ? (
        <button
          style={{
            height: 34,
            padding: '0 14px',
            borderRadius: 12,
            background: HS.amberText,
            color: '#fff',
            border: 'none',
            fontSize: 13,
            fontWeight: 500,
            fontFamily: HS.font,
            cursor: 'pointer',
          }}
        >
          Snooze
        </button>
      ) : null}
    </div>
  );
}

// ----- Scale reading card -----
function ScaleReading({ weight, compact }) {
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding: compact ? 16 : 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="scale-line" size={16} color={HS.teal} />
        <span style={{ fontSize: 13, color: HS.text2, fontWeight: 500 }}>
          Live scale reading
        </span>
        <span
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 11,
            color: HS.teal,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: HS.teal,
              boxShadow: `0 0 0 0 ${HS.teal}55`,
              animation: 'hsPulse 1.6s ease-out infinite',
            }}
          />
          live
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: compact ? 30 : 38,
            fontWeight: 500,
            letterSpacing: -1,
            color: HS.text1,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}
        >
          {weight}
          <span style={{ fontSize: 16, color: HS.text3, fontWeight: 400 }}> g</span>
        </div>
        <span style={{ fontSize: 12, color: HS.text3 }}>cup detected</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button style={ghostBtn({ height: 34, fontSize: 13, padding: '0 12px' })}>
          <Icon name="refresh-1-line" size={13} color={HS.text1} />
          Tare
        </button>
        <button style={ghostBtn({ height: 34, fontSize: 13, padding: '0 12px' })}>
          <Icon name="qrcode-line" size={13} color={HS.text1} />
          Re-pair via QR
        </button>
      </div>
    </div>
  );
}

// ----- Sidebar (Variation B) -----
function Sidebar() {
  const items = [
    { name: 'Dashboard', icon: 'home-4-line', active: true },
    { name: 'History', icon: 'history-line' },
    { name: 'Settings', icon: 'settings-3-line' },
  ];
  return (
    <aside
      style={{
        width: 280,
        background: HS.surface,
        borderRight: `0.5px solid ${HS.border}`,
        padding: '24px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
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
        <span style={{ fontWeight: 500, fontSize: 15, color: HS.text1 }}>
          Sippy
        </span>
      </div>
      {/* User block */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px',
          borderRadius: 14,
          background: HS.bg,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: HS.tealLight,
            color: HS.tealDark,
            display: 'grid',
            placeItems: 'center',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          AR
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: HS.text1 }}>Alex Rivera</span>
          <StreakPill days={14} compact />
        </div>
      </div>
      {/* Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((it) => (
          <a
            key={it.name}
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              borderRadius: 10,
              textDecoration: 'none',
              background: it.active ? HS.tealLight : 'transparent',
              color: it.active ? HS.tealDark : HS.text1,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <Icon name={it.icon} size={16} color={it.active ? HS.tealDark : HS.text2} />
            {it.name}
          </a>
        ))}
      </div>
      <div style={{ marginTop: 'auto' }}>
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: HS.bg,
            border: `0.5px solid ${HS.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: HS.text2,
              fontWeight: 500,
            }}
          >
            <Icon name="scale-line" size={14} color={HS.teal} />
            Linked scale
          </div>
          <div style={{ fontSize: 12, color: HS.text3, lineHeight: 1.5 }}>
            HS-Coaster · v1.0
            <br />
            Battery 78% · Last sync 2s ago
          </div>
          <ConnectionPill connected />
        </div>
      </div>
    </aside>
  );
}

// =====================================================
// VARIATION A — Single column (centered)
// =====================================================
function LoggedA({ mobile = false, reminderDue = false }) {
  const live = useLive();
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
      <LoggedNavbar mobile={mobile} />
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 800,
          margin: '0 auto',
          padding: mobile ? '20px 16px 32px' : '32px 24px 56px',
          display: 'flex',
          flexDirection: 'column',
          gap: mobile ? 14 : 18,
          boxSizing: 'border-box',
        }}
      >
        <GreetingBar mobile={mobile} />
        <DailyGoal ml={live.ml} goal={live.goal} mobile={mobile} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          <Stat
            label="Sips"
            value={live.sips}
            sub="today"
            icon="drop-line"
            trend="+3"
            compact={compact}
          />
          <Stat
            label="Consumed"
            value={`${live.ml.toLocaleString()} ml`}
            sub="vs 1,420 yesterday"
            icon="drink-line"
            compact={compact}
          />
          <Stat
            label="Avg sip"
            value="34 ml"
            sub="last 7 days"
            icon="chart-bar-line"
            compact={compact}
          />
          <Stat
            label="Next sip due"
            value={`${live.nextDue} min`}
            sub="adaptive pacing"
            icon="time-line"
            compact={compact}
          />
        </div>
        <ReminderCard due={reminderDue} compact={compact} />
        <ScaleReading weight={live.weight} compact={compact} />
      </main>
    </div>
  );
}

// =====================================================
// VARIATION B — Sidebar + main
// =====================================================
function LoggedB({ mobile = false, reminderDue = false }) {
  const live = useLive();
  const compact = mobile;

  if (mobile) {
    // Mobile: collapse sidebar; show navbar instead
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
        <LoggedNavbar mobile />
        <main style={{ flex: 1, padding: '20px 16px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* User strip at top, mobile equivalent of sidebar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 16,
              background: HS.surface,
              border: `0.5px solid ${HS.border}`,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: HS.tealLight,
                color: HS.tealDark,
                display: 'grid',
                placeItems: 'center',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              AR
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, color: HS.text1, fontWeight: 500 }}>Alex Rivera</div>
              <div style={{ fontSize: 11, color: HS.text3 }}>HS-Coaster v1.0 · 78%</div>
            </div>
            <StreakPill days={14} compact />
          </div>
          <GreetingBar mobile />
          <DailyGoal ml={live.ml} goal={live.goal} mobile />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Stat label="Sips" value={live.sips} sub="today" icon="drop-line" compact />
            <Stat label="Consumed" value={`${live.ml.toLocaleString()} ml`} sub="" icon="drink-line" compact />
            <Stat label="Avg sip" value="34 ml" sub="" icon="chart-bar-line" compact />
            <Stat label="Next sip" value={`${live.nextDue} m`} sub="adaptive" icon="time-line" compact />
          </div>
          <ReminderCard due={reminderDue} compact />
          <ScaleReading weight={live.weight} compact />
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        background: HS.bg,
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100%',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
      }}
    >
      <Sidebar />
      <main
        style={{
          padding: '32px 32px 56px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          minWidth: 0,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: HS.text3, marginBottom: 4 }}>
            {greetingFor(new Date())}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: -0.5,
              color: HS.text1,
              lineHeight: 1.1,
            }}
          >
            Alex
          </div>
        </div>
        <DailyGoal ml={live.ml} goal={live.goal} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          <Stat label="Sips" value={live.sips} sub="today" icon="drop-line" trend="+3" />
          <Stat label="Consumed" value={`${live.ml.toLocaleString()} ml`} sub="vs 1,420 yesterday" icon="drink-line" />
          <Stat label="Avg sip" value="34 ml" sub="last 7 days" icon="chart-bar-line" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <ReminderCard due={reminderDue} />
          <ScaleReading weight={live.weight} />
        </div>
      </main>
    </div>
  );
}

// =====================================================
// VARIATION C — Card grid w/ teal hero
// =====================================================
function HeroProgress({ ml, goal }) {
  const pct = Math.min(100, (ml / goal) * 100);
  return (
    <div
      style={{
        borderRadius: 20,
        padding: '36px 32px',
        background: `linear-gradient(135deg, ${HS.tealDark} 0%, ${HS.teal} 100%)`,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 18% 75%, rgba(255,255,255,0.10) 0, transparent 35%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.07) 0, transparent 35%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          fontSize: 13,
          color: 'rgba(255,255,255,0.7)',
          marginBottom: 14,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
        }}
      >
        Today
      </div>
      <div
        style={{
          position: 'relative',
          fontSize: 88,
          fontWeight: 500,
          letterSpacing: -3,
          lineHeight: 1,
          marginBottom: 6,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {Math.round(pct)}
        <span style={{ fontSize: 36, color: 'rgba(255,255,255,0.55)' }}>%</span>
      </div>
      <div
        style={{
          position: 'relative',
          fontSize: 16,
          color: 'rgba(255,255,255,0.85)',
          marginBottom: 22,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {ml.toLocaleString()} / {goal.toLocaleString()} ml
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          height: 10,
          background: 'rgba(255,255,255,0.18)',
          borderRadius: 20,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: '#fff',
            borderRadius: 20,
            transition: 'width 600ms cubic-bezier(.2,.7,.3,1)',
          }}
        />
      </div>
    </div>
  );
}

function LoggedC({ mobile = false, reminderDue = false }) {
  const live = useLive();
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
      <LoggedNavbar mobile={mobile} />
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 1180,
          margin: '0 auto',
          padding: mobile ? '20px 16px 32px' : '28px 24px 56px',
          display: 'flex',
          flexDirection: 'column',
          gap: mobile ? 14 : 18,
          boxSizing: 'border-box',
        }}
      >
        {/* Top greeting strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: mobile ? 'flex-start' : 'center',
            gap: 12,
            flexDirection: mobile ? 'column' : 'row',
            padding: mobile ? '0' : '4px 4px',
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: HS.text3, marginBottom: 2 }}>
              {greetingFor(new Date())}
            </div>
            <div
              style={{
                fontSize: mobile ? 22 : 26,
                fontWeight: 500,
                letterSpacing: -0.5,
                color: HS.text1,
                lineHeight: 1.1,
              }}
            >
              Alex
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StreakPill days={14} />
            <ConnectionPill connected />
          </div>
        </div>
        <HeroProgress ml={live.ml} goal={live.goal} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: 12,
          }}
        >
          <Stat label="Sips" value={live.sips} sub="today" icon="drop-line" trend="+3" compact={compact} />
          <Stat label="Consumed" value={`${live.ml.toLocaleString()} ml`} sub="vs 1,420 yest." icon="drink-line" compact={compact} />
          <Stat label="Avg sip" value="34 ml" sub="last 7 days" icon="chart-bar-line" compact={compact} />
          <Stat label="Next sip" value={`${live.nextDue} m`} sub="adaptive pace" icon="time-line" compact={compact} />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
            gap: 14,
          }}
        >
          <ReminderCard due={reminderDue} compact={compact} />
          <ScaleReading weight={live.weight} compact={compact} />
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { LoggedA, LoggedB, LoggedC });
