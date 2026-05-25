// Dashboard page — Variation C (card grid with hero progress).

const HS = window.HS;

// ---------- Auth guard + user loader ----------
function useFirebaseUser() {
  const [state, setState] = React.useState('loading'); // 'loading' | 'ok'
  const [user,  setUser]  = React.useState(null);

  React.useEffect(() => {
    const unsub = window.HS_AUTH.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) {
        window.location.href = 'signin.html';
        return;
      }
      window.HS_DB.collection('users').doc(firebaseUser.uid).get()
        .then((doc) => {
          setUser(doc.exists ? doc.data() : { name: firebaseUser.email });
          setState('ok');
        })
        .catch(() => {
          setUser({ name: firebaseUser.email });
          setState('ok');
        });
    });
    return unsub;
  }, []);

  return { state, user };
}

// ---------- Live session hook ----------
function useLive() {
  const [ml,      setMl]      = React.useState(1620);
  const [sips,    setSips]    = React.useState(14);
  const [weight,  setWeight]  = React.useState(412);
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

// ---------- Loading screen ----------
function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: HS.bg,
        fontFamily: HS.font,
        display: 'grid',
        placeItems: 'center',
        color: HS.text3,
        fontSize: 14,
      }}
    >
      Loading…
    </div>
  );
}

// ---------- Hero progress (big % card) ----------
function HeroProgress({ ml, goal }) {
  const pct = Math.min(100, (ml / goal) * 100);
  return (
    <div
      style={{
        borderRadius: 20,
        padding: '36px 32px',
        background: `linear-gradient(135deg, ${HS.tealDark} 0%, #2A7AB9 60%, ${HS.teal} 100%)`,
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
          position: 'absolute', inset: 0,
          backgroundImage:
            'radial-gradient(circle at 18% 75%, rgba(255,255,255,0.12) 0, transparent 35%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.08) 0, transparent 35%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', fontSize: 13, color: 'rgba(255,255,255,0.78)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.8 }}>
        Today
      </div>
      <div style={{ position: 'relative', fontSize: 88, fontWeight: 500, letterSpacing: -3, lineHeight: 1, marginBottom: 6, fontVariantNumeric: 'tabular-nums' }}>
        {Math.round(pct)}
        <span style={{ fontSize: 36, color: 'rgba(255,255,255,0.6)' }}>%</span>
      </div>
      <div style={{ position: 'relative', fontSize: 16, color: 'rgba(255,255,255,0.88)', marginBottom: 22, fontVariantNumeric: 'tabular-nums' }}>
        {ml.toLocaleString()} / {goal.toLocaleString()} ml
      </div>
      <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: 10, background: 'rgba(255,255,255,0.20)', borderRadius: 20, overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`, height: '100%', background: '#fff', borderRadius: 20,
            transition: 'width 600ms cubic-bezier(.2,.7,.3,1)',
          }}
        />
      </div>
    </div>
  );
}

// ---------- Stat tile ----------
function Stat({ label, value, sub, icon, trend }) {
  return (
    <div style={{ background: HS.surface, border: `0.5px solid ${HS.border}`, borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: HS.text3, fontSize: 12 }}>
        <Icon name={icon} size={14} color={HS.text3} />
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.6, color: HS.text1, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: HS.text3 }}>
        {trend ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: HS.tealText, fontWeight: 500 }}>
            <Icon name="arrow-up-line" size={11} color={HS.tealText} />
            {trend}
          </span>
        ) : null}
        {sub}
      </div>
    </div>
  );
}

// ---------- Reminder card ----------
function ReminderCard({ due }) {
  const ambient = due
    ? { bg: HS.amberBg, border: HS.amberBorder, text: HS.amberText }
    : { bg: HS.surface, border: HS.border, text: HS.text2 };
  return (
    <div style={{ background: ambient.bg, border: `0.5px solid ${ambient.border}`, borderRadius: 16, padding: 22, display: 'flex', alignItems: 'center', gap: 14, transition: 'background .3s, border-color .3s' }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: due ? 'rgba(133,79,11,0.12)' : HS.tealLight, display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>
        <Icon name={due ? 'notification-line' : 'time-line'} size={22} color={due ? HS.amberText : HS.tealDark} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: ambient.text, fontWeight: 500, marginBottom: 2 }}>
          {due ? 'Time to drink' : 'Next reminder'}
        </div>
        <div style={{ fontSize: 15, color: due ? HS.amberText : HS.text1, lineHeight: 1.4 }}>
          {due ? "You're 8 minutes overdue. Take a sip." : 'In 28 minutes · adaptive pacing'}
        </div>
      </div>
      {due ? (
        <button style={{ height: 34, padding: '0 14px', borderRadius: 12, background: HS.amberText, color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, fontFamily: HS.font, cursor: 'pointer' }}>
          Snooze
        </button>
      ) : null}
    </div>
  );
}

// ---------- Scale reading card ----------
function ScaleReading({ weight }) {
  return (
    <div style={{ background: HS.surface, border: `0.5px solid ${HS.border}`, borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="scale-line" size={16} color={HS.tealDark} />
        <span style={{ fontSize: 13, color: HS.text2, fontWeight: 500 }}>Live scale reading</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: HS.tealDark, fontWeight: 600 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: HS.teal, boxShadow: `0 0 0 0 ${HS.teal}55`, animation: 'hsPulse 1.6s ease-out infinite' }} />
          live
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <div style={{ fontSize: 38, fontWeight: 500, letterSpacing: -1, color: HS.text1, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
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

function greetingFor(d) {
  const h = d.getHours();
  if (h < 5)  return 'Late night,';
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

// ---------- Page ----------
function Dashboard() {
  const { state, user } = useFirebaseUser();
  const live = useLive();

  if (state === 'loading') return <LoadingScreen />;

  const firstName = user?.firstName || (user?.name || '').split(' ')[0] || 'there';

  return (
    <div style={{ background: HS.bg, fontFamily: HS.font, color: HS.text1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNavbar active="Dashboard" user={user} />
      <main
        style={{
          flex: 1, width: '100%', maxWidth: 1180, margin: '0 auto',
          padding: '28px 24px 56px', display: 'flex', flexDirection: 'column',
          gap: 18, boxSizing: 'border-box',
        }}
      >
        {/* Greeting + streak strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '4px 4px' }}>
          <div>
            <div style={{ fontSize: 13, color: HS.text3, marginBottom: 2 }}>{greetingFor(new Date())}</div>
            <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.5, color: HS.text1, lineHeight: 1.1 }}>
              {firstName}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StreakPill days={14} />
          </div>
        </div>

        <HeroProgress ml={live.ml} goal={live.goal} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
          <Stat label="Sips"      value={live.sips}                   sub="today"        icon="drop-line"    trend="+3" />
          <Stat label="Consumed"  value={`${live.ml.toLocaleString()} ml`} sub="vs 1,420 yest." icon="drink-line" />
          <Stat label="Avg sip"   value="34 ml"                       sub="last 7 days"  icon="chart-bar-line" />
          <Stat label="Next sip"  value={`${live.nextDue} m`}         sub="adaptive pace" icon="time-line" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
          <ReminderCard due={false} />
          <ScaleReading weight={live.weight} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

window.Dashboard = Dashboard;
