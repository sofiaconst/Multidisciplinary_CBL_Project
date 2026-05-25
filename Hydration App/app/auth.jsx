// Auth pages — Variation B (split: dark blue panel left, form right).
// Uses Firebase Auth + Firestore. Used by signin.html and signup.html.

const HS = window.HS;

// ---------- Input atoms ----------
function Field({ label, type = 'text', placeholder, value, onChange, rightSlot, hint }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13, color: HS.text2, fontWeight: 500 }}>{label}</span>
      <span
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height: 44,
          background: HS.surface,
          border: `0.5px solid ${focused ? HS.teal : HS.border}`,
          boxShadow: focused ? `0 0 0 3px ${HS.tealLight}` : 'none',
          borderRadius: 10,
          padding: '0 12px',
          transition: 'border-color .12s, box-shadow .12s',
        }}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: HS.text1,
            fontFamily: HS.font,
            fontSize: 14,
            padding: 0,
            minWidth: 0,
          }}
        />
        {rightSlot}
      </span>
      {hint ? <span style={{ fontSize: 11, color: HS.text3 }}>{hint}</span> : null}
    </label>
  );
}

function PasswordField({ label = 'Password', placeholder = '••••••••', value, onChange }) {
  const [hidden, setHidden] = React.useState(true);
  return (
    <Field
      label={label}
      type={hidden ? 'password' : 'text'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rightSlot={
        <button
          type="button"
          onClick={() => setHidden((h) => !h)}
          aria-label={hidden ? 'Show password' : 'Hide password'}
          style={{
            width: 28,
            height: 28,
            border: 'none',
            background: 'transparent',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            padding: 0,
            color: HS.text3,
          }}
        >
          <Icon name={hidden ? 'eye-line' : 'eye-close-line'} size={16} color={HS.text3} />
        </button>
      }
    />
  );
}

function Divider({ label = 'or' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: HS.text3, fontSize: 12 }}>
      <span style={{ flex: 1, height: 1, background: HS.border }} />
      {label}
      <span style={{ flex: 1, height: 1, background: HS.border }} />
    </div>
  );
}

// ---------- Error banner (shared style) ----------
function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        background: HS.dangerBg,
        border: `0.5px solid ${HS.dangerBorder}`,
        color: HS.danger,
        padding: '8px 12px',
        borderRadius: 10,
        fontSize: 13,
      }}
    >
      {message}
    </div>
  );
}

// ---------- Strength bar (sign-up) ----------
const PASSWORD_REQS = [
  { test: (p) => p.length >= 6,        label: 'At least 6 characters' },
  { test: (p) => /[A-Z]/.test(p),      label: 'One uppercase letter' },
  { test: (p) => /[^A-Za-z0-9]/.test(p), label: 'One special symbol' },
];

function StrengthBar({ password = '' }) {
  const met = PASSWORD_REQS.filter((r) => r.test(password)).length;
  const fillMap  = [0, 1, 2, 4];
  const colorMap = ['#D9D9D2', HS.danger, '#D88742', HS.success];
  const labelMap = ['Add a password', 'Weak', 'Almost there', 'Strong'];
  const fill  = fillMap[met];
  const color = colorMap[met];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 4,
              background: i < fill ? color : '#E6E4DC',
              transition: 'background .2s',
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: HS.text3,
        }}
      >
        <span>{labelMap[met]}</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{met}/3</span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {PASSWORD_REQS.map((r, i) => {
          const ok = r.test(password);
          return (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: ok ? HS.text2 : HS.text3,
                transition: 'color .15s',
              }}
            >
              {ok ? (
                <span
                  style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: HS.tealLight, display: 'grid',
                    placeItems: 'center', flex: '0 0 auto',
                  }}
                >
                  <Icon name="check-line" size={9} color={HS.tealDark} />
                </span>
              ) : (
                <span
                  style={{
                    width: 14, height: 14, borderRadius: '50%',
                    border: `1px solid ${HS.border}`, flex: '0 0 auto',
                  }}
                />
              )}
              {r.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------- Sign-in form ----------
function SignInForm() {
  const [email, setEmail] = React.useState('');
  const [pwd,   setPwd]   = React.useState('');
  const [busy,  setBusy]  = React.useState(false);
  const [err,   setErr]   = React.useState('');

  function submit(e) {
    e.preventDefault();
    setErr('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr('Please enter a valid email address.');
    if (!pwd) return setErr('Please enter your password.');
    setBusy(true);
    window.HS_AUTH.signInWithEmailAndPassword(email, pwd)
      .then(() => { window.location.href = 'dashboard.html'; })
      .catch((e) => { setBusy(false); setErr(window.HS_AUTH_ERR(e.code)); });
  }

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={submit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1 style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.5, margin: 0, color: HS.text1 }}>
          Welcome back
        </h1>
        <p style={{ margin: 0, color: HS.text2, fontSize: 14 }}>
          Sign in to see your hydration history.
        </p>
      </div>
      <Field label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
      <div>
        <PasswordField value={pwd} onChange={setPwd} />
        <div style={{ textAlign: 'right', marginTop: 6 }}>
          <a href="#" style={{ fontSize: 12, color: HS.tealText, textDecoration: 'none', fontWeight: 500 }}>
            Forgot password?
          </a>
        </div>
      </div>
      <ErrorBanner message={err} />
      <button
        type="submit"
        disabled={busy}
        style={tealBtn({ height: 44, fontSize: 15, width: '100%', justifyContent: 'center', opacity: busy ? 0.7 : 1, cursor: busy ? 'progress' : 'pointer' })}
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
      <div style={{ textAlign: 'center', fontSize: 13, color: HS.text2, marginTop: 4 }}>
        Don't have an account?{' '}
        <a href="signup.html" style={{ color: HS.tealText, textDecoration: 'none', fontWeight: 500 }}>
          Create one
        </a>
      </div>
    </form>
  );
}

// ---------- Create-account form ----------
function CreateAccountForm() {
  const [name,  setName]  = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pwd,   setPwd]   = React.useState('');
  const [pwd2,  setPwd2]  = React.useState('');
  const [busy,  setBusy]  = React.useState(false);
  const [err,   setErr]   = React.useState('');

  function submit(e) {
    e.preventDefault();
    setErr('');
    if (!name.trim()) return setErr('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr('Please enter a valid email address.');
    if (PASSWORD_REQS.filter((r) => r.test(pwd)).length < 3)
      return setErr('Password does not meet all requirements.');
    if (pwd !== pwd2) return setErr('Passwords do not match.');

    setBusy(true);
    const trimmedName = name.trim();
    const parts = trimmedName.split(' ');
    const firstName = parts[0];
    const lastName  = parts.slice(1).join(' ');

    window.HS_AUTH.createUserWithEmailAndPassword(email, pwd)
      .then((cred) => {
        return window.HS_DB.collection('users').doc(cred.user.uid).set({
          name:              trimmedName,
          firstName:         firstName,
          lastName:          lastName,
          email:             email.toLowerCase(),
          gender:            'Prefer not to say',
          dob:               '',
          heightValue:       '',
          heightUnit:        'cm',
          weightValue:       '',
          weightUnit:        'kg',
          activityLevel:     'Moderately active',
          dailyGoal:         2500,
          hourlyGoal:        180,
          adaptiveReminders: true,
          reminderPace:      35,
          ledColor:          HS.teal,
          createdAt:         firebase.firestore.FieldValue.serverTimestamp(),
        });
      })
      .then(() => { window.location.href = 'dashboard.html'; })
      .catch((e) => { setBusy(false); setErr(window.HS_AUTH_ERR(e.code)); });
  }

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={submit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1 style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.5, margin: 0, color: HS.text1 }}>
          Create your account
        </h1>
        <p style={{ margin: 0, color: HS.text2, fontSize: 14 }}>
          Start tracking sip-by-sip — takes ten seconds.
        </p>
      </div>
      <Field label="Full name" placeholder="Your full name" value={name} onChange={setName} />
      <Field label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
      <div>
        <PasswordField label="Password" value={pwd} onChange={setPwd} />
        <StrengthBar password={pwd} />
      </div>
      <PasswordField label="Confirm password" value={pwd2} onChange={setPwd2} />
      <ErrorBanner message={err} />
      <button
        type="submit"
        disabled={busy}
        style={tealBtn({ height: 44, fontSize: 15, width: '100%', justifyContent: 'center', opacity: busy ? 0.7 : 1, cursor: busy ? 'progress' : 'pointer' })}
      >
        {busy ? 'Creating account…' : 'Create account'}
      </button>
      <p style={{ fontSize: 11, color: HS.text3, margin: 0, lineHeight: 1.5, textAlign: 'center' }}>
        By signing up you agree to our{' '}
        <a href="#" style={{ color: HS.tealText, textDecoration: 'none' }}>Terms</a>
        {' '}and{' '}
        <a href="#" style={{ color: HS.tealText, textDecoration: 'none' }}>Privacy Policy</a>.
      </p>
      <div style={{ textAlign: 'center', fontSize: 13, color: HS.text2, marginTop: 2 }}>
        Already have an account?{' '}
        <a href="signin.html" style={{ color: HS.tealText, textDecoration: 'none', fontWeight: 500 }}>
          Sign in
        </a>
      </div>
    </form>
  );
}

// ---------- Layout (B: split panel) ----------
function AuthSplit({ children }) {
  return (
    <div
      style={{
        background: HS.bg,
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      }}
    >
      <button
        type="button"
        onClick={() => window.history.back()}
        aria-label="Go back"
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 100,
          width: 36,
          height: 36,
          borderRadius: 10,
          border: '0.5px solid rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(6px)',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}
      >
        <Icon name="arrow-left-line" size={18} color="#FFFFFF" />
      </button>
      {/* Left dark blue panel */}
      <div
        style={{
          background: HS.tealDark,
          color: '#FFFFFF',
          padding: '56px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 20% 80%, rgba(0,135,189,0.22) 0, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0, transparent 35%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Logo size={32} dark />
        </div>
        <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>
          <div
            style={{
              fontSize: 32, fontWeight: 500, lineHeight: 1.15,
              letterSpacing: -0.6, marginBottom: 14, maxWidth: 360, textWrap: 'balance',
            }}
          >
            The scale watches. You drink. We do the rest.
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.78)', margin: '0 0 28px', maxWidth: 380 }}>
            An account saves your history, sets a personal goal, and unlocks adaptive reminders.
          </p>
          <ul
            style={{
              listStyle: 'none', padding: 0, margin: 0, display: 'flex',
              flexDirection: 'column', gap: 12, fontSize: 14, color: 'rgba(255,255,255,0.92)',
            }}
          >
            {[
              'Daily, weekly, and yearly history',
              'Personalized hydration target',
              'Adaptive reminders tuned to your pace',
              'Multi-device sync (BLE + browser)',
            ].map((t, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 18, height: 18, borderRadius: '50%', background: HS.teal,
                    display: 'grid', placeItems: 'center', flex: '0 0 auto',
                  }}
                >
                  <Icon name="check-line" size={11} color={HS.tealDark} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ position: 'relative', zIndex: 1, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
          © 2026 Hydr8
        </div>
      </div>
      {/* Right form panel */}
      <div
        style={{
          background: HS.surface,
          padding: '64px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minWidth: 0,
        }}
      >
        <div style={{ width: '100%', maxWidth: 380, margin: '0 auto' }}>{children}</div>
      </div>
    </div>
  );
}

function SignInPage()  { return <AuthSplit><SignInForm /></AuthSplit>; }
function SignUpPage()  { return <AuthSplit><CreateAccountForm /></AuthSplit>; }

Object.assign(window, { SignInPage, SignUpPage });
