// Landing page — Variation A (split hero) for the real website.

const HS = window.HS;

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
        <Icon name={icon} size={18} color={HS.tealDark} />
      </div>
      <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: HS.text2, lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}

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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(30,90,138,0.05) 0 8px, transparent 8px 16px)',
        }}
      />
      {/* Cup */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '30%',
          transform: 'translateX(-50%)',
          width: '38%',
          height: '40%',
          background: '#fff',
          border: `0.5px solid ${HS.border}`,
          borderRadius: '12% 12% 22% 22% / 6% 6% 18% 18%',
          boxShadow: 'inset 0 -16px 0 0 ' + HS.tealLight,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 8,
            right: 8,
            bottom: 8,
            height: '55%',
            background: HS.teal,
            borderRadius: '0 0 14% 14% / 0 0 30% 30%',
            opacity: 0.75,
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
            color: HS.tealDark,
            fontFamily: 'ui-monospace,monospace',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 600,
          }}
        >
          412 g
        </span>
      </div>
      {/* BLE pulse pill */}
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

function Landing() {
  return (
    <div
      style={{
        background: HS.bg,
        fontFamily: HS.font,
        color: HS.text1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PublicNavbar active="Home" />

      {/* Hero */}
      <section
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '72px 32px 56px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
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
              color: HS.tealText,
              fontSize: 12,
              fontWeight: 500,
              marginBottom: 20,
            }}
          >
            <Icon name="bluetooth-line" size={12} color={HS.tealText} />
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
            The Hydr8 coaster tracks your water intake automatically.
            No manual logging. Just drink.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="signup.html"
              style={tealBtn({ height: 48, fontSize: 15, padding: '0 22px', textDecoration: 'none' })}
            >
              Create account
            </a>
            <a
              href="signin.html"
              style={ghostBtn({ height: 48, fontSize: 15, padding: '0 20px' })}
            >
              Sign in
            </a>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 16 }}>
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

window.Landing = Landing;
