// Shared UI components for Sippy website.
// Exposed on window so each page's app script can pick them up.

const HS = window.HS;

// ---------- Icon (Mingcute via Iconify CDN) ----------
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

// ---------- Buttons ----------
function tealBtn(extra = {}) {
  return {
    height: 36,
    padding: '0 16px',
    borderRadius: 12,
    background: HS.teal,
    color: '#FFFFFF',
    border: 'none',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: HS.font,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    textShadow: '0 1px 0 rgba(14,61,107,0.18)',
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
    textDecoration: 'none',
    ...extra,
  };
}

// ---------- Logo / wordmark ----------
// Uses the real Sippy brand assets:
//   - app/logo-icon.png       — standalone app icon (used in the navbar mark)
//   - app/logo-wordmark.png   — full "sippy" lockup (used as wordmark)
// If you want the full lockup as a single image, pass `wordmarkOnly`.
function Logo({ size = 32, dark = false, wordmarkOnly = false }) {
  if (wordmarkOnly) {
    return (
      <a
        href="index.html"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <img
          src="app/logo-wordmark.png"
          alt="Sippy"
          height={size * 1.1}
          style={{
            height: size * 1.1,
            width: 'auto',
            display: 'block',
            filter: dark ? 'brightness(0) invert(1)' : 'none',
          }}
          draggable={false}
        />
      </a>
    );
  }
  return (
    <a
      href="index.html"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <img
        src="app/logo-icon.png"
        alt=""
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          display: 'block',
        }}
        draggable={false}
      />
      <span
        style={{
          fontWeight: 500,
          fontSize: size * 0.5,
          color: dark ? '#FFFFFF' : HS.text1,
          letterSpacing: -0.3,
        }}
      >
        Sippy
      </span>
    </a>
  );
}

// ---------- Public navbar (guest) ----------
function PublicNavbar({ active }) {
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
      <Logo size={28} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 28 }}>
        {[
          { label: 'Home', href: 'index.html' },
          { label: 'Dashboard', href: 'dashboard.html' },
          { label: 'Settings', href: 'settings.html' },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            style={{
              fontSize: 14,
              color: active === l.label ? HS.text1 : HS.text2,
              textDecoration: 'none',
              fontWeight: active === l.label ? 500 : 400,
            }}
          >
            {l.label}
          </a>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href="signin.html" style={ghostBtn()}>Sign in</a>
        <a href="signup.html" style={tealBtn()}>Create account</a>
      </div>
    </nav>
  );
}

// ---------- Authenticated navbar (with active state + sign out) ----------
function AppNavbar({ active = 'Dashboard', connected = true }) {
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
      <Logo size={28} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 28 }}>
        {[
          { label: 'Dashboard', href: 'dashboard.html' },
          { label: 'Settings', href: 'settings.html' },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            style={{
              fontSize: 14,
              color: l.label === active ? HS.text1 : HS.text2,
              textDecoration: 'none',
              fontWeight: l.label === active ? 500 : 400,
              position: 'relative',
            }}
          >
            {l.label}
            {l.label === active ? (
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
        <ConnectionPill connected={connected} />
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
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: HS.text3 }} />
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
        color: HS.tealText,
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

function AvatarPill({ initials = 'AR', name = 'Alex' }) {
  return (
    <a
      href="settings.html"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 36,
        padding: '0 12px 0 4px',
        borderRadius: 20,
        border: `0.5px solid ${HS.border}`,
        background: HS.surface,
        fontFamily: HS.font,
        textDecoration: 'none',
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: HS.tealLight,
          color: HS.tealText,
          display: 'grid',
          placeItems: 'center',
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        {initials}
      </span>
      <span style={{ fontSize: 13, color: HS.text1, fontWeight: 500 }}>{name}</span>
    </a>
  );
}

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
        fontFamily: HS.font,
      }}
    >
      <span>© 2026 Sippy</span>
      <span>Built by the Sippy team · v1.0</span>
    </footer>
  );
}

Object.assign(window, {
  Icon,
  Logo,
  tealBtn,
  ghostBtn,
  PublicNavbar,
  AppNavbar,
  ConnectionPill,
  AvatarPill,
  StreakPill,
  Footer,
});
