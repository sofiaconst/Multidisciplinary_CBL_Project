// Screen 5 — Settings page
// Two layout variations: A tabbed, B scrollable. Desktop + mobile.

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
  dangerBg: '#FFF0F0',
  dangerBorder: '#F5C6C6',
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
    height: 40,
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
    height: 40,
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

// ---------- Settings primitives ----------
function Card({ children, padding = 24, style }) {
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Label({ children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 6 }}>
      <span style={{ fontSize: 13, color: HS.text1, fontWeight: 500 }}>{children}</span>
      {hint ? <span style={{ fontSize: 12, color: HS.text3 }}>{hint}</span> : null}
    </div>
  );
}

function Input({ value, defaultValue, type = 'text', placeholder, rightSlot, leftSlot, onChange }) {
  const [focused, setFocused] = React.useState(false);
  const controlled = typeof onChange === 'function';
  const inputProps = controlled
    ? { value: value ?? '', onChange: (e) => onChange(e.target.value) }
    : { defaultValue: defaultValue ?? value };
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 40,
        background: HS.surface,
        border: `0.5px solid ${focused ? HS.teal : HS.border}`,
        boxShadow: focused ? `0 0 0 3px ${HS.tealLight}` : 'none',
        borderRadius: 10,
        padding: '0 12px',
        transition: 'border-color .12s, box-shadow .12s',
      }}
    >
      {leftSlot}
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
  );
}

function Row({ children, columns = 2, gap = 12 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {children}
    </div>
  );
}

function PillGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange && onChange(opt)}
            style={{
              padding: '8px 14px',
              borderRadius: 20,
              border: `0.5px solid ${active ? HS.teal : HS.border}`,
              background: active ? HS.tealLight : HS.surface,
              color: active ? HS.tealDark : HS.text1,
              fontSize: 13,
              fontWeight: active ? 500 : 400,
              fontFamily: HS.font,
              cursor: 'pointer',
              transition: 'all .12s',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function UnitToggle({ units, value, onChange }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: 3,
        background: HS.bg,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 10,
        height: 40,
        alignItems: 'center',
        flex: '0 0 auto',
      }}
    >
      {units.map((u) => {
        const active = u === value;
        return (
          <button
            key={u}
            type="button"
            onClick={() => onChange && onChange(u)}
            style={{
              padding: '0 12px',
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: active ? HS.surface : 'transparent',
              color: active ? HS.text1 : HS.text2,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: HS.font,
              boxShadow: active ? '0 0 0 0.5px ' + HS.border : 'none',
              transition: 'all .12s',
            }}
          >
            {u}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange && onChange(!value)}
      aria-pressed={value}
      style={{
        width: 40,
        height: 22,
        borderRadius: 20,
        border: 'none',
        background: value ? HS.teal : '#C7C5BC',
        position: 'relative',
        cursor: 'pointer',
        padding: 0,
        transition: 'background .15s',
        flex: '0 0 auto',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: value ? 20 : 2,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          transition: 'left .15s',
        }}
      />
    </button>
  );
}

function NumberStepper({ value, onChange, step = 50, suffix = 'ml' }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 40,
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => onChange && onChange(value - step)}
        style={{
          width: 36,
          height: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          color: HS.text2,
          fontSize: 18,
        }}
      >
        <Icon name="subtract-line" size={14} color={HS.text2} />
      </button>
      <div
        style={{
          minWidth: 80,
          textAlign: 'center',
          fontSize: 14,
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
          color: HS.text1,
          borderLeft: `0.5px solid ${HS.border}`,
          borderRight: `0.5px solid ${HS.border}`,
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          padding: '0 10px',
        }}
      >
        {value.toLocaleString()}
        <span style={{ fontSize: 11, color: HS.text3, marginLeft: 0, fontWeight: 400 }}> {suffix}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange && onChange(value + step)}
        style={{
          width: 36,
          height: '100%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          color: HS.text2,
        }}
      >
        <Icon name="add-line" size={14} color={HS.text2} />
      </button>
    </div>
  );
}

// ---------- Sections ----------
function ProfileSection({ compact }) {
  const [gender, setGender] = React.useState('Female');
  const [activity, setActivity] = React.useState('Moderately active');
  const [hUnit, setHUnit] = React.useState('cm');
  const [wUnit, setWUnit] = React.useState('kg');
  return (
    <Card padding={compact ? 20 : 28}>
      <SectionHeader title="Profile" subtitle="Personal info used to personalize your goals." />
      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: HS.tealLight,
              color: HS.tealDark,
              display: 'grid',
              placeItems: 'center',
              fontSize: 22,
              fontWeight: 500,
            }}
          >
            AR
          </div>
          <button
            type="button"
            aria-label="Upload avatar"
            style={{
              position: 'absolute',
              right: -2,
              bottom: -2,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: HS.surface,
              border: `0.5px solid ${HS.border}`,
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              padding: 0,
            }}
          >
            <Icon name="camera-line" size={12} color={HS.text2} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: HS.text1 }}>Alex Rivera</span>
          <span style={{ fontSize: 13, color: HS.text3 }}>Hover the avatar to upload a new photo.</span>
        </div>
      </div>
      {/* Name fields */}
      <Row columns={compact ? 1 : 2}>
        <Field label="First name" defaultValue="Alex" />
        <Field label="Last name" defaultValue="Rivera" />
      </Row>
      <div style={{ height: 12 }} />
      <Field label="Email" type="email" defaultValue="alex@hydrate.co" rightLink="Change email" />
      <div style={{ height: 12 }} />
      <Field label="Date of birth" type="date" defaultValue="1992-04-08" />
      <div style={{ height: 18 }} />
      <Label>Gender</Label>
      <PillGroup
        options={['Male', 'Female', 'Other', 'Prefer not to say']}
        value={gender}
        onChange={setGender}
      />
      <div style={{ height: 18 }} />
      <Row columns={compact ? 1 : 2}>
        <div>
          <Label>Height</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input defaultValue={hUnit === 'cm' ? '168' : "5'6\""} />
            <UnitToggle units={['cm', 'ft']} value={hUnit} onChange={setHUnit} />
          </div>
        </div>
        <div>
          <Label>Weight</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input defaultValue={wUnit === 'kg' ? '62' : '137'} />
            <UnitToggle units={['kg', 'lbs']} value={wUnit} onChange={setWUnit} />
          </div>
        </div>
      </Row>
      <div style={{ height: 18 }} />
      <Label>Activity level</Label>
      <PillGroup
        options={['Sedentary', 'Lightly active', 'Moderately active', 'Very active']}
        value={activity}
        onChange={setActivity}
      />
      <div style={{ height: 22 }} />
      <button type="button" style={tealBtn()}>Save profile</button>
    </Card>
  );
}

function Field({ label, hint, type = 'text', defaultValue, rightLink, placeholder }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <Label hint={hint}>{label}</Label>
        {rightLink ? (
          <a href="#" style={{ fontSize: 12, color: HS.teal, textDecoration: 'none', fontWeight: 500 }}>
            {rightLink}
          </a>
        ) : null}
      </div>
      <Input type={type} defaultValue={defaultValue} placeholder={placeholder} />
    </div>
  );
}

function SectionHeader({ title, subtitle, right }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        justifyContent: 'space-between',
        marginBottom: 22,
      }}
    >
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500, letterSpacing: -0.4, color: HS.text1 }}>
          {title}
        </h2>
        {subtitle ? (
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: HS.text2 }}>{subtitle}</p>
        ) : null}
      </div>
      {right}
    </div>
  );
}

function GoalsSection({ compact, withRecommend = false }) {
  const [daily, setDaily] = React.useState(2500);
  const [hourly, setHourly] = React.useState(180);
  return (
    <Card padding={compact ? 20 : 28}>
      <SectionHeader title="Goals" subtitle="Personal hydration targets." />
      <Row columns={compact ? 1 : 2}>
        <div>
          <Label hint="The target you'll be tracking against.">Daily water target</Label>
          <NumberStepper value={daily} onChange={setDaily} step={100} suffix="ml" />
        </div>
        <div>
          <Label hint="Used to pace adaptive reminders.">Hourly target</Label>
          <NumberStepper value={hourly} onChange={setHourly} step={10} suffix="ml" />
        </div>
      </Row>
      <div style={{ height: 14 }} />
      <a href="#" style={{ fontSize: 13, color: HS.teal, textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        Calculate recommended intake
      </a>
      {withRecommend ? (
        <div
          style={{
            marginTop: 16,
            padding: 18,
            borderRadius: 14,
            background: HS.tealLight,
            border: `0.5px solid ${HS.tealMid}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            animation: 'hsFadeIn 320ms ease-out',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: HS.surface,
              display: 'grid',
              placeItems: 'center',
              flex: '0 0 auto',
            }}
          >
            <Icon name="sparkles-line" size={16} color={HS.teal} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: HS.tealDark, fontWeight: 500, marginBottom: 2 }}>
              Recommended for you
            </div>
            <div style={{ fontSize: 14, color: HS.tealDark, lineHeight: 1.5 }}>
              Based on age 33, 62 kg, and moderately active, we recommend{' '}
              <strong style={{ fontWeight: 500 }}>2,800 ml per day</strong>.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button style={tealBtn({ height: 32, fontSize: 12.5, padding: '0 12px' })}>
                Apply 2,800 ml
              </button>
              <button style={ghostBtn({ height: 32, fontSize: 12.5, padding: '0 12px' })}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function RemindersSection({ compact }) {
  const [adaptive, setAdaptive] = React.useState(true);
  const [pace, setPace] = React.useState(35);
  const [color, setColor] = React.useState('#0087BD');
  const swatches = ['#0087BD', '#3B82F6', '#D97706', '#A32D2D', '#7C3AED', '#FFFFFF'];
  return (
    <Card padding={compact ? 20 : 28}>
      <SectionHeader title="Reminders" subtitle="When and how the coaster nudges you." />
      <RowItem
        label="Adaptive reminders"
        hint="Reminders adjust to your real-time pace."
        right={<Toggle value={adaptive} onChange={setAdaptive} />}
      />
      <Divider />
      <RowItem
        label="Reminder pace"
        hint="Minutes between expected sips."
        right={<NumberStepper value={pace} onChange={setPace} step={5} suffix="min" />}
      />
      <Divider />
      <RowItem
        label="LED reminder color"
        hint="The coaster pulses this color when it's time to drink."
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {swatches.map((s) => {
                const active = s === color;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setColor(s)}
                    aria-label={s}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: s,
                      border: `${active ? 2 : 0.5}px solid ${active ? HS.teal : HS.border}`,
                      cursor: 'pointer',
                      padding: 0,
                      boxShadow: active ? `0 0 0 3px ${HS.tealLight}` : 'none',
                      transition: 'all .12s',
                    }}
                  />
                );
              })}
            </div>
            <Input defaultValue={color} />
            <button style={ghostBtn({ height: 36, padding: '0 12px', fontSize: 13 })}>
              <Icon name="light-line" size={14} color={HS.text1} />
              Test LED
            </button>
          </div>
        }
        stack={compact}
      />
    </Card>
  );
}

function ScaleSection({ compact }) {
  const [adv, setAdv] = React.useState(false);
  const [debug, setDebug] = React.useState(false);
  return (
    <Card padding={compact ? 20 : 28}>
      <SectionHeader title="Scale" subtitle="Calibration and hardware behavior." />
      <Row columns={compact ? 1 : 2}>
        <Field label="Reference weight" hint="Place a known-mass cup or weight to calibrate." defaultValue="250" />
        <div>
          <Label>&nbsp;</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={ghostBtn()}>
              <Icon name="refresh-1-line" size={14} color={HS.text1} />
              Tare scale
            </button>
            <button style={tealBtn()}>
              <Icon name="settings-3-line" size={14} color="#FFFFFF" />
              Calibrate
            </button>
          </div>
        </div>
      </Row>
      <Divider />
      <button
        type="button"
        onClick={() => setAdv((v) => !v)}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: HS.text1,
          fontWeight: 500,
          fontFamily: HS.font,
        }}
      >
        <Icon
          name="right-line"
          size={12}
          color={HS.text2}
          style={{ transform: adv ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .15s' }}
        />
        Advanced thresholds
        <span style={{ fontSize: 12, color: HS.text3, fontWeight: 400 }}>
          {adv ? 'hide' : 'show'} 6 expert settings
        </span>
      </button>
      {adv ? (
        <div
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: compact ? '1fr' : '1fr 1fr',
            gap: 14,
          }}
        >
          {[
            ['Cup presence threshold', '12 g', 'Min weight to consider a cup is on the coaster.'],
            ['Cup removal threshold', '4 g', 'Weight below which cup is considered lifted.'],
            ['Stability band', '0.6 g', 'Reading must stay within this band to settle.'],
            ['Settle duration', '350 ms', 'Time of stability before classifying as steady.'],
            ['Sip threshold', '8 g', 'Minimum delta between settles to register a sip.'],
            ['Refill threshold', '40 g', 'Delta required to classify as a refill, not a sip.'],
          ].map(([name, val, desc]) => (
            <div key={name}>
              <Label hint={desc}>{name}</Label>
              <Input defaultValue={val} />
            </div>
          ))}
        </div>
      ) : null}
      <Divider />
      <RowItem
        label="Debug mode"
        hint="Shows raw readings and timing in the dashboard."
        right={<Toggle value={debug} onChange={setDebug} />}
      />
    </Card>
  );
}

function AccountSection({ compact }) {
  return (
    <Card padding={compact ? 20 : 28}>
      <SectionHeader title="Account" subtitle="Password, sign out, and deletion." />
      <Label>Change password</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Input type="password" defaultValue="••••••••" placeholder="Current password" />
        <Input type="password" defaultValue="" placeholder="New password" />
        <Input type="password" defaultValue="" placeholder="Confirm new password" />
        <button style={tealBtn({ alignSelf: 'flex-start' })}>Update password</button>
      </div>
      <Divider />
      <div
        style={{
          background: HS.dangerBg,
          border: `0.5px solid ${HS.dangerBorder}`,
          borderRadius: 14,
          padding: 18,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: HS.danger,
            fontWeight: 500,
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          <Icon name="alert-octagon-line" size={16} color={HS.danger} />
          Danger zone
        </div>
        <p style={{ margin: 0, fontSize: 13, color: HS.text2, lineHeight: 1.5 }}>
          Deleting your account permanently removes all your data, including history and personal goals. This cannot be undone.
        </p>
        <button
          style={{
            marginTop: 14,
            height: 36,
            padding: '0 14px',
            borderRadius: 12,
            background: 'transparent',
            color: HS.danger,
            border: `0.5px solid ${HS.danger}`,
            fontSize: 13.5,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: HS.font,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Icon name="delete-2-line" size={14} color={HS.danger} />
          Delete account
        </button>
      </div>
      <Divider />
      <button style={ghostBtn()}>
        <Icon name="exit-line" size={14} color={HS.text1} />
        Sign out
      </button>
    </Card>
  );
}

function RowItem({ label, hint, right, stack }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: stack ? 'flex-start' : 'center',
        flexDirection: stack ? 'column' : 'row',
        gap: stack ? 10 : 14,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: HS.text1, fontWeight: 500 }}>{label}</div>
        {hint ? <div style={{ fontSize: 12.5, color: HS.text3, marginTop: 2 }}>{hint}</div> : null}
      </div>
      <div>{right}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: HS.border, opacity: 0.6, margin: '20px 0' }} />;
}

// ---------- Navbar reused ----------
function SettingsNavbar({ mobile }) {
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
        <button
          style={{
            width: 32,
            height: 32,
            border: 'none',
            background: 'transparent',
            display: 'grid',
            placeItems: 'center',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <Icon name="left-line" size={18} color={HS.text1} />
        </button>
        <span style={{ flex: 1, fontWeight: 500, fontSize: 16, color: HS.text1 }}>Settings</span>
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
          Hydr8
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 28 }}>
        {['Dashboard', 'History', 'Settings'].map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontSize: 14,
              color: l === 'Settings' ? HS.text1 : HS.text2,
              fontWeight: l === 'Settings' ? 500 : 400,
              textDecoration: 'none',
            }}
          >
            {l}
          </a>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 20,
            border: `0.5px solid ${HS.tealMid}`,
            background: HS.tealLight,
            color: HS.tealDark,
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
          Scale connected
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            height: 36,
            padding: '0 12px 0 4px',
            borderRadius: 20,
            border: `0.5px solid ${HS.border}`,
            background: HS.surface,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: HS.tealLight,
              color: HS.tealDark,
              display: 'grid',
              placeItems: 'center',
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            AR
          </span>
          <span style={{ fontSize: 13, color: HS.text1, fontWeight: 500 }}>Alex</span>
        </span>
      </div>
    </nav>
  );
}

// =====================================================
// VARIATION A — Tabbed
// =====================================================
const TABS = ['Profile', 'Goals', 'Reminders', 'Scale', 'Account'];

function SettingsA({ initialTab = 'Profile', mobile = false }) {
  const [tab, setTab] = React.useState(initialTab);
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
      <SettingsNavbar mobile={mobile} />
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 920,
          margin: '0 auto',
          padding: mobile ? '20px 16px 40px' : '32px 24px 56px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          boxSizing: 'border-box',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: mobile ? 24 : 30,
              fontWeight: 500,
              letterSpacing: -0.6,
              margin: 0,
              color: HS.text1,
            }}
          >
            Settings
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: HS.text2 }}>
            Manage your profile, hydration goals, and hardware.
          </p>
        </div>
        {/* Tab strip */}
        <div
          style={{
            display: 'flex',
            gap: 2,
            borderBottom: `0.5px solid ${HS.border}`,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {TABS.map((t) => {
            const active = t === tab;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  fontFamily: HS.font,
                  fontSize: 14,
                  fontWeight: 500,
                  color: active ? HS.teal : HS.text2,
                  borderBottom: `2px solid ${active ? HS.teal : 'transparent'}`,
                  marginBottom: -0.5,
                  whiteSpace: 'nowrap',
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
        {tab === 'Profile' && <ProfileSection compact={compact} />}
        {tab === 'Goals' && <GoalsSection compact={compact} withRecommend />}
        {tab === 'Reminders' && <RemindersSection compact={compact} />}
        {tab === 'Scale' && <ScaleSection compact={compact} />}
        {tab === 'Account' && <AccountSection compact={compact} />}
      </main>
    </div>
  );
}

// =====================================================
// VARIATION B — Scrollable, all sections
// =====================================================
function SettingsB({ mobile = false }) {
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
        position: 'relative',
      }}
    >
      <SettingsNavbar mobile={mobile} />
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 920,
          margin: '0 auto',
          padding: mobile ? '20px 16px 96px' : '32px 24px 96px',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          boxSizing: 'border-box',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: mobile ? 24 : 30,
              fontWeight: 500,
              letterSpacing: -0.6,
              margin: 0,
            }}
          >
            Settings
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: HS.text2 }}>
            Everything on one scrollable page.
          </p>
        </div>
        <ProfileSection compact={compact} />
        <GoalsSection compact={compact} withRecommend />
        <RemindersSection compact={compact} />
        <ScaleSection compact={compact} />
        <AccountSection compact={compact} />
      </main>
      {/* Sticky save bar */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          marginTop: 'auto',
          background: 'rgba(255,255,255,0.92)',
          borderTop: `0.5px solid ${HS.border}`,
          backdropFilter: 'blur(8px)',
          padding: mobile ? '12px 16px' : '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13, color: HS.text2 }}>You have unsaved changes.</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={ghostBtn({ height: 36, fontSize: 13 })}>Discard</button>
          <button style={tealBtn({ height: 36, fontSize: 13 })}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SettingsA, SettingsB });
