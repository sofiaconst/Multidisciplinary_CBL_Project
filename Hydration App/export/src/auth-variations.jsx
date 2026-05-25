// Screen 2 — Sign in / Create account
// Two layout variations × two modes × desktop + mobile.

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

function authTealBtn(extra = {}) {
  return {
    height: 44,
    padding: '0 16px',
    borderRadius: 12,
    background: HS.teal,
    color: '#fff',
    border: 'none',
    fontSize: 15,
    fontWeight: 500,
    fontFamily: HS.font,
    cursor: 'pointer',
    width: '100%',
    ...extra,
  };
}
function authGhostBtn(extra = {}) {
  return {
    height: 44,
    padding: '0 14px',
    borderRadius: 12,
    background: 'transparent',
    color: HS.text1,
    border: `0.5px solid ${HS.border}`,
    fontSize: 15,
    fontWeight: 500,
    fontFamily: HS.font,
    cursor: 'pointer',
    width: '100%',
    ...extra,
  };
}

// ---------- Form atoms ----------
// Field works in either mode:
//   uncontrolled: pass `value` only (used as defaultValue)
//   controlled:   pass `value` + `onChange` (string -> void)
function Field({ label, type = 'text', placeholder, value, onChange, rightSlot, hint, compact }) {
  const [focused, setFocused] = React.useState(false);
  const controlled = typeof onChange === 'function';
  const inputProps = controlled
    ? { value: value ?? '', onChange: (e) => onChange(e.target.value) }
    : { defaultValue: value };
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13, color: HS.text2, fontWeight: 400 }}>{label}</span>
      <span
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height: compact ? 40 : 44,
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
          {...inputProps}
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
      {hint ? (
        <span style={{ fontSize: 11, color: HS.text3 }}>{hint}</span>
      ) : null}
    </label>
  );
}

function PasswordField({ label = 'Password', placeholder = '••••••••', value = 'hydrate2026', onChange, compact }) {
  const [hidden, setHidden] = React.useState(true);
  return (
    <Field
      label={label}
      type={hidden ? 'password' : 'text'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      compact={compact}
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color: HS.text3,
        fontSize: 12,
      }}
    >
      <span style={{ flex: 1, height: 1, background: HS.border }} />
      {label}
      <span style={{ flex: 1, height: 1, background: HS.border }} />
    </div>
  );
}

// ---------- Strength bar (interactive) ----------
const PASSWORD_REQS = [
  { test: (p) => p.length >= 6, label: 'At least 6 characters' },
  { test: (p) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p) => /[^A-Za-z0-9]/.test(p), label: 'One special symbol' },
];

function StrengthBar({ password = '' }) {
  const met = PASSWORD_REQS.filter((r) => r.test(password)).length;
  // 0/1/2/3 reqs met -> 0/1/2/4 segments filled (skip 3 to make 'all good' read as 'full bar')
  const fillMap = [0, 1, 2, 4];
  const colorMap = ['#D9D9D2', HS.danger, '#D88742', HS.teal];
  const labelMap = ['Add a password', 'Weak', 'Almost there', 'Strong'];
  const fill = fillMap[met];
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
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
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
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: HS.tealLight,
                    display: 'grid',
                    placeItems: 'center',
                    flex: '0 0 auto',
                  }}
                >
                  <Icon name="check-line" size={9} color={HS.teal} />
                </span>
              ) : (
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    border: `1px solid ${HS.border}`,
                    flex: '0 0 auto',
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

// ---------- Logo / wordmark ----------
function Logo({ size = 32, dark = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 10,
          background: dark ? 'rgba(255,255,255,0.12)' : HS.tealLight,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Icon name="drop-fill" size={size * 0.55} color={dark ? '#FFFFFF' : HS.teal} />
      </div>
      <span
        style={{
          fontWeight: 500,
          fontSize: size * 0.5,
          color: dark ? '#FFFFFF' : HS.text1,
          letterSpacing: -0.2,
        }}
      >
        Hydration Scale
      </span>
    </div>
  );
}

// =====================================================
// FORMS
// =====================================================
function SignInForm({ compact = false }) {
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={(e) => e.preventDefault()}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1
          style={{
            fontSize: compact ? 22 : 26,
            fontWeight: 500,
            letterSpacing: -0.5,
            margin: 0,
            color: HS.text1,
          }}
        >
          Welcome back
        </h1>
        <p style={{ margin: 0, color: HS.text2, fontSize: 14 }}>
          Sign in to see your hydration history.
        </p>
      </div>
      <Field label="Email" type="email" placeholder="you@example.com" value="alex@hydrate.co" compact={compact} />
      <div>
        <PasswordField compact={compact} />
        <div style={{ textAlign: 'right', marginTop: 6 }}>
          <a href="#" style={{ fontSize: 12, color: HS.teal, textDecoration: 'none', fontWeight: 500 }}>
            Forgot password?
          </a>
        </div>
      </div>
      <button type="submit" style={authTealBtn()}>Sign in</button>
      <Divider />
      <button type="button" style={authGhostBtn()}>Continue as guest</button>
      <div style={{ textAlign: 'center', fontSize: 13, color: HS.text2, marginTop: 4 }}>
        Don't have an account?{' '}
        <a href="#" style={{ color: HS.teal, textDecoration: 'none', fontWeight: 500 }}>
          Create one
        </a>
      </div>
    </form>
  );
}

function CreateAccountForm({ compact = false }) {
  const [pwd, setPwd] = React.useState('Hydra26');
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={(e) => e.preventDefault()}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1
          style={{
            fontSize: compact ? 22 : 26,
            fontWeight: 500,
            letterSpacing: -0.5,
            margin: 0,
            color: HS.text1,
          }}
        >
          Create your account
        </h1>
        <p style={{ margin: 0, color: HS.text2, fontSize: 14 }}>
          Start tracking sip-by-sip — takes ten seconds.
        </p>
      </div>
      <Field label="Full name" placeholder="Alex Rivera" value="Alex Rivera" compact={compact} />
      <Field label="Email" type="email" placeholder="you@example.com" value="alex@hydrate.co" compact={compact} />
      <div>
        <PasswordField label="Password" value={pwd} onChange={setPwd} compact={compact} />
        <StrengthBar password={pwd} />
      </div>
      <PasswordField label="Confirm password" value="" compact={compact} />
      <button type="submit" style={authTealBtn()}>Create account</button>
      <p style={{ fontSize: 11, color: HS.text3, margin: 0, lineHeight: 1.5, textAlign: 'center' }}>
        By signing up you agree to our{' '}
        <a href="#" style={{ color: HS.teal, textDecoration: 'none' }}>Terms</a> and{' '}
        <a href="#" style={{ color: HS.teal, textDecoration: 'none' }}>Privacy Policy</a>.
      </p>
      <div style={{ textAlign: 'center', fontSize: 13, color: HS.text2, marginTop: 2 }}>
        Already have an account?{' '}
        <a href="#" style={{ color: HS.teal, textDecoration: 'none', fontWeight: 500 }}>
          Sign in
        </a>
      </div>
    </form>
  );
}

// =====================================================
// LAYOUT A — Single centered card on warm bg
// =====================================================
function AuthA({ children }) {
  return (
    <div
      style={{
        background: HS.bg,
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: 24,
      }}
    >
      <Logo size={36} />
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: HS.surface,
          border: `0.5px solid ${HS.border}`,
          borderRadius: 20,
          padding: 32,
        }}
      >
        {children}
      </div>
      <div style={{ fontSize: 12, color: HS.text3 }}>
        © 2026 Hydration Scale
      </div>
    </div>
  );
}

// =====================================================
// LAYOUT B — Split (left teal, right white form)
// =====================================================
function AuthB({ children }) {
  return (
    <div
      style={{
        background: HS.bg,
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}
    >
      {/* Left teal panel */}
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
        {/* subtle bg pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0, transparent 35%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Logo size={32} dark />
        </div>
        <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: -0.6,
              marginBottom: 14,
              maxWidth: 360,
              textWrap: 'balance',
            }}
          >
            The scale watches. You drink. We do the rest.
          </div>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.78)',
              margin: '0 0 28px',
              maxWidth: 380,
            }}
          >
            An account saves your history, sets a personal goal, and unlocks
            adaptive reminders.
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              fontSize: 14,
              color: 'rgba(255,255,255,0.92)',
            }}
          >
            {[
              'Daily, weekly, and yearly history',
              'Personalized hydration target',
              'Adaptive reminders tuned to your pace',
              'Multi-device sync (BLE + browser)',
            ].map((t, i) => (
              <li
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.14)',
                    display: 'grid',
                    placeItems: 'center',
                    flex: '0 0 auto',
                  }}
                >
                  <Icon name="check-line" size={11} color="#FFFFFF" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          © 2026 Hydration Scale
        </div>
      </div>
      {/* Right form panel */}
      <div
        style={{
          background: HS.surface,
          padding: '64px 64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: 380, margin: '0 auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ----- Mobile B (stacked split) -----
function AuthBMobile({ children }) {
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
      {/* top teal slab */}
      <div
        style={{
          background: HS.tealDark,
          color: '#FFFFFF',
          padding: '32px 24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <Logo size={28} dark />
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: -0.4,
            textWrap: 'balance',
          }}
        >
          The scale watches. You drink. We do the rest.
        </div>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.78)',
            margin: 0,
          }}
        >
          An account saves your history and unlocks adaptive reminders.
        </p>
      </div>
      <div
        style={{
          flex: 1,
          background: HS.surface,
          padding: '28px 20px 32px',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ----- Mobile A -----
function AuthAMobile({ children }) {
  return (
    <div
      style={{
        background: HS.bg,
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px 24px',
        gap: 20,
      }}
    >
      <Logo size={32} />
      <div
        style={{
          width: '100%',
          background: HS.surface,
          border: `0.5px solid ${HS.border}`,
          borderRadius: 20,
          padding: 22,
        }}
      >
        {children}
      </div>
      <div style={{ fontSize: 11, color: HS.text3 }}>© 2026 Hydration Scale</div>
    </div>
  );
}

// ----- Composed artboards -----
function AuthA_SignIn() {
  return <AuthA><SignInForm /></AuthA>;
}
function AuthA_Create() {
  return <AuthA><CreateAccountForm /></AuthA>;
}
function AuthB_SignIn() {
  return <AuthB><SignInForm /></AuthB>;
}
function AuthB_Create() {
  return <AuthB><CreateAccountForm /></AuthB>;
}
function AuthA_SignIn_M() {
  return <AuthAMobile><SignInForm compact /></AuthAMobile>;
}
function AuthA_Create_M() {
  return <AuthAMobile><CreateAccountForm compact /></AuthAMobile>;
}
function AuthB_SignIn_M() {
  return <AuthBMobile><SignInForm compact /></AuthBMobile>;
}
function AuthB_Create_M() {
  return <AuthBMobile><CreateAccountForm compact /></AuthBMobile>;
}

Object.assign(window, {
  AuthA_SignIn,
  AuthA_Create,
  AuthB_SignIn,
  AuthB_Create,
  AuthA_SignIn_M,
  AuthA_Create_M,
  AuthB_SignIn_M,
  AuthB_Create_M,
});
