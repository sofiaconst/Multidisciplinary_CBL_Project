// Settings page — Variation B (scrollable), with per-section save tweak.
// Wired to Firebase Auth + Firestore for persistent user data.

const HS = window.HS;

// ---------- Tweak defaults ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "saveMode": "perSection"
}/*EDITMODE-END*/;

// ---------- Auth guard + user loader ----------
function useFirebaseUser() {
  const [state,   setState]   = React.useState('loading');
  const [uid,     setUid]     = React.useState(null);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    const unsub = window.HS_AUTH.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) {
        window.location.href = 'signin.html';
        return;
      }
      setUid(firebaseUser.uid);
      window.HS_DB.collection('users').doc(firebaseUser.uid).get()
        .then((doc) => {
          setUserData(doc.exists ? doc.data() : {});
          setState('ok');
        })
        .catch(() => {
          setUserData({});
          setState('ok');
        });
    });
    return unsub;
  }, []);

  function saveFields(fields) {
    if (!uid) return Promise.resolve();
    return window.HS_DB.collection('users').doc(uid).update(fields);
  }

  return { state, uid, userData, saveFields };
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

// ---------- Atoms ----------
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

function Input({ value, defaultValue, type = 'text', placeholder, rightSlot, leftSlot, onChange, readOnly }) {
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
        background: readOnly ? HS.bg : HS.surface,
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
        readOnly={readOnly}
        {...inputProps}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: readOnly ? HS.text3 : HS.text1,
          fontFamily: HS.font,
          fontSize: 14,
          padding: 0,
          minWidth: 0,
          cursor: readOnly ? 'default' : 'text',
        }}
      />
      {rightSlot}
    </span>
  );
}

function Row({ children, columns = 2, gap = 12 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap }}>
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
              color: active ? HS.tealText : HS.text1,
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

// min/max props clamp the stepper so users can't save nonsensical values.
function NumberStepper({ value, onChange, step = 50, suffix = 'ml', min, max }) {
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
        onClick={() => onChange && onChange(Math.max(min ?? -Infinity, value - step))}
        style={{ width: 36, height: '100%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', color: HS.text2 }}
      >
        <Icon name="subtract-line" size={14} color={HS.text2} />
      </button>
      <div
        style={{
          minWidth: 80, textAlign: 'center', fontSize: 14, fontWeight: 500,
          fontVariantNumeric: 'tabular-nums', color: HS.text1,
          borderLeft: `0.5px solid ${HS.border}`, borderRight: `0.5px solid ${HS.border}`,
          height: '100%', display: 'grid', placeItems: 'center', padding: '0 10px',
        }}
      >
        {value.toLocaleString()}
        <span style={{ fontSize: 11, color: HS.text3, fontWeight: 400 }}> {suffix}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange && onChange(Math.min(max ?? Infinity, value + step))}
        style={{ width: 36, height: '100%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center', color: HS.text2 }}
      >
        <Icon name="add-line" size={14} color={HS.text2} />
      </button>
    </div>
  );
}

function SectionHeader({ title, subtitle, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, justifyContent: 'space-between', marginBottom: 22 }}>
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500, letterSpacing: -0.4, color: HS.text1 }}>{title}</h2>
        {subtitle ? <p style={{ margin: '4px 0 0', fontSize: 13.5, color: HS.text2 }}>{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

function FieldBlock({ label, hint, type = 'text', placeholder, rightLink, value, defaultValue, onChange, readOnly }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <Label hint={hint}>{label}</Label>
        {rightLink ? (
          <a href="#" style={{ fontSize: 12, color: HS.tealText, textDecoration: 'none', fontWeight: 500 }}>
            {rightLink}
          </a>
        ) : null}
      </div>
      <Input type={type} placeholder={placeholder} value={value} defaultValue={defaultValue} onChange={onChange} readOnly={readOnly} />
    </div>
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

// ---------- SaveBlock ----------
function SaveBlock({ sectionId, dirty, onSave }) {
  const [status,  setStatus]  = React.useState('idle');
  const [saveErr, setSaveErr] = React.useState('');

  function handle() {
    if (status === 'saving') return;
    setStatus('saving');
    setSaveErr('');
    Promise.resolve(onSave && onSave())
      .then(() => {
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 1600);
      })
      .catch(() => {
        setStatus('idle');
        setSaveErr('Failed to save. Please check your connection and try again.');
      });
  }

  return (
    <div style={{ marginTop: 22, paddingTop: 18, borderTop: `0.5px dashed ${HS.border}` }}>
      {saveErr ? (
        <div style={{ fontSize: 12, color: HS.danger, marginBottom: 8 }}>{saveErr}</div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            fontSize: 12.5,
            color: status === 'saved' ? HS.tealText : dirty ? HS.amberText : HS.text3,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          {status === 'saved' ? (
            <><Icon name="check-line" size={13} color={HS.tealText} />Saved</>
          ) : dirty ? (
            <><span style={{ width: 6, height: 6, borderRadius: '50%', background: HS.amberText }} />Unsaved changes in this section</>
          ) : (
            <>All saved</>
          )}
        </span>
        <div style={{ flex: 1 }} />
        <button
          type="button"
          onClick={() => onSave && onSave('discard')}
          disabled={!dirty || status === 'saving'}
          style={ghostBtn({ height: 36, fontSize: 13, opacity: dirty ? 1 : 0.5, cursor: dirty ? 'pointer' : 'not-allowed' })}
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handle}
          disabled={!dirty || status === 'saving'}
          style={tealBtn({ height: 36, fontSize: 13, opacity: dirty || status === 'saving' ? 1 : 0.5, cursor: dirty || status === 'saving' ? 'pointer' : 'not-allowed' })}
        >
          {status === 'saving' ? 'Saving…' : `Save ${sectionId}`}
        </button>
      </div>
    </div>
  );
}

function SectionWrap({ id, dirty, onSave, perSection, children }) {
  return (
    <Card padding={28}>
      {children}
      {perSection ? <SaveBlock sectionId={id} dirty={dirty} onSave={onSave} /> : null}
    </Card>
  );
}

// ---------- Profile section ----------
function ProfileSection({ perSection, onMarkDirty, initialData, saveFields, onRegister }) {
  const init = React.useRef(initialData);
  const [dirty,        setDirty]        = React.useState(false);
  const [firstName,    setFirstName]    = React.useState(initialData.firstName    || '');
  const [lastName,     setLastName]     = React.useState(initialData.lastName     || '');
  const [dob,          setDob]          = React.useState(initialData.dob          || '');
  const [gender,       setGender]       = React.useState(initialData.gender       || 'Prefer not to say');
  const [hVal,         setHVal]         = React.useState(initialData.heightValue  || '');
  const [hUnit,        setHUnit]        = React.useState(initialData.heightUnit   || 'cm');
  const [wVal,         setWVal]         = React.useState(initialData.weightValue  || '');
  const [wUnit,        setWUnit]        = React.useState(initialData.weightUnit   || 'kg');
  const [activity,     setActivity]     = React.useState(initialData.activityLevel || 'Moderately active');

  function mark(setter) {
    return (v) => { setter(v); setDirty(true); onMarkDirty && onMarkDirty('Profile', true); };
  }

  function handleSave(action) {
    if (action === 'discard') {
      const d = init.current;
      setFirstName(d.firstName    || '');
      setLastName (d.lastName     || '');
      setDob      (d.dob          || '');
      setGender   (d.gender       || 'Prefer not to say');
      setHVal     (d.heightValue  || '');
      setHUnit    (d.heightUnit   || 'cm');
      setWVal     (d.weightValue  || '');
      setWUnit    (d.weightUnit   || 'kg');
      setActivity (d.activityLevel || 'Moderately active');
      setDirty(false);
      onMarkDirty && onMarkDirty('Profile', false);
      return;
    }
    const full = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
    const saved = {
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      name:      full,
      dob,
      gender,
      heightValue:   hVal,
      heightUnit:    hUnit,
      weightValue:   wVal,
      weightUnit:    wUnit,
      activityLevel: activity,
    };
    return saveFields(saved).then(() => {
      // Update baseline so Discard after Save resets to the just-saved values.
      init.current = { ...init.current, ...saved };
      setDirty(false);
      onMarkDirty && onMarkDirty('Profile', false);
    });
  }

  // Expose save/discard to parent for sticky-bar mode.
  const latestSave = React.useRef(handleSave);
  latestSave.current = handleSave;
  React.useEffect(() => {
    onRegister?.('Profile', () => latestSave.current(), () => latestSave.current('discard'));
  }, [onRegister]);

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'You';
  const initials = fullName.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';

  return (
    <SectionWrap id="profile" perSection={perSection} dirty={dirty} onSave={handleSave}>
      <SectionHeader title="Profile" subtitle="Personal info used to personalise your goals." />
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: '50%', background: HS.tealLight,
              color: HS.tealText, display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 600,
            }}
          >
            {initials}
          </div>
          <button
            type="button"
            aria-label="Upload avatar"
            style={{
              position: 'absolute', right: -2, bottom: -2, width: 24, height: 24, borderRadius: '50%',
              background: HS.surface, border: `0.5px solid ${HS.border}`, cursor: 'pointer',
              display: 'grid', placeItems: 'center', padding: 0,
            }}
          >
            <Icon name="camera-line" size={12} color={HS.text2} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: HS.text1 }}>{fullName}</span>
          <span style={{ fontSize: 13, color: HS.text3 }}>Hover the avatar to upload a new photo.</span>
        </div>
      </div>
      <Row columns={2}>
        <FieldBlock label="First name" placeholder="First name" value={firstName} onChange={mark(setFirstName)} />
        <FieldBlock label="Last name"  placeholder="Last name"  value={lastName}  onChange={mark(setLastName)} />
      </Row>
      <div style={{ height: 12 }} />
      <FieldBlock label="Email" type="email" value={initialData.email || ''} readOnly rightLink="Change email" />
      <div style={{ height: 12 }} />
      <FieldBlock label="Date of birth" type="date" value={dob} onChange={mark(setDob)} />
      <div style={{ height: 18 }} />
      <Label>Gender</Label>
      <PillGroup options={['Male', 'Female', 'Other', 'Prefer not to say']} value={gender} onChange={mark(setGender)} />
      <div style={{ height: 18 }} />
      <Row columns={2}>
        <div>
          <Label>Height</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input value={hVal} onChange={mark(setHVal)} placeholder={hUnit === 'cm' ? 'e.g. 168' : "e.g. 5'6\""} />
            <UnitToggle units={['cm', 'ft']} value={hUnit} onChange={mark(setHUnit)} />
          </div>
        </div>
        <div>
          <Label>Weight</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input value={wVal} onChange={mark(setWVal)} placeholder={wUnit === 'kg' ? 'e.g. 62' : 'e.g. 137'} />
            <UnitToggle units={['kg', 'lbs']} value={wUnit} onChange={mark(setWUnit)} />
          </div>
        </div>
      </Row>
      <div style={{ height: 18 }} />
      <Label>Activity level</Label>
      <PillGroup
        options={['Sedentary', 'Lightly active', 'Moderately active', 'Very active']}
        value={activity}
        onChange={mark(setActivity)}
      />
    </SectionWrap>
  );
}

// ---------- Goals section ----------
function GoalsSection({ perSection, onMarkDirty, initialData, saveFields, onRegister }) {
  const init = React.useRef(initialData);
  const [dirty, setDirty] = React.useState(false);
  const [daily,  setDaily]  = React.useState(initialData.dailyGoal  || 2500);
  const [hourly, setHourly] = React.useState(initialData.hourlyGoal || 180);
  const [showRec, setShowRec] = React.useState(true);

  function mark(setter) {
    return (v) => { setter(v); setDirty(true); onMarkDirty && onMarkDirty('Goals', true); };
  }

  function handleSave(action) {
    if (action === 'discard') {
      setDaily (init.current.dailyGoal  || 2500);
      setHourly(init.current.hourlyGoal || 180);
      setDirty(false);
      onMarkDirty && onMarkDirty('Goals', false);
      return;
    }
    return saveFields({ dailyGoal: daily, hourlyGoal: hourly }).then(() => {
      // Update baseline so Discard after Save resets to the just-saved values.
      init.current = { ...init.current, dailyGoal: daily, hourlyGoal: hourly };
      setDirty(false);
      onMarkDirty && onMarkDirty('Goals', false);
    });
  }

  // Expose save/discard to parent for sticky-bar mode.
  const latestSave = React.useRef(handleSave);
  latestSave.current = handleSave;
  React.useEffect(() => {
    onRegister?.('Goals', () => latestSave.current(), () => latestSave.current('discard'));
  }, [onRegister]);

  return (
    <SectionWrap id="goals" perSection={perSection} dirty={dirty} onSave={handleSave}>
      <SectionHeader title="Goals" subtitle="Personal hydration targets." />
      <Row columns={2}>
        <div>
          <Label hint="The target you'll be tracking against.">Daily water target</Label>
          <NumberStepper value={daily} onChange={mark(setDaily)} step={100} suffix="ml" min={500} max={10000} />
        </div>
        <div>
          <Label hint="Used to pace adaptive reminders.">Hourly target</Label>
          <NumberStepper value={hourly} onChange={mark(setHourly)} step={10} suffix="ml" min={50} max={1000} />
        </div>
      </Row>
      <div style={{ height: 14 }} />
      <a href="#" style={{ fontSize: 13, color: HS.tealText, textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        Calculate recommended intake
      </a>
      {showRec ? (
        <div
          style={{
            marginTop: 16, padding: 18, borderRadius: 14,
            background: HS.tealLight, border: `0.5px solid ${HS.tealMid}`,
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 10, background: HS.surface, display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>
            <Icon name="sparkles-line" size={16} color={HS.tealDark} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: HS.tealText, fontWeight: 600, marginBottom: 2 }}>Recommended for you</div>
            <div style={{ fontSize: 14, color: HS.tealText, lineHeight: 1.5 }}>
              Based on your profile, we recommend <strong style={{ fontWeight: 600 }}>2,800 ml per day</strong>.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button style={tealBtn({ height: 32, fontSize: 12.5, padding: '0 12px' })} onClick={() => mark(setDaily)(2800)}>
                Apply 2,800 ml
              </button>
              <button style={ghostBtn({ height: 32, fontSize: 12.5, padding: '0 12px' })} onClick={() => setShowRec(false)}>Dismiss</button>
            </div>
          </div>
        </div>
      ) : null}
    </SectionWrap>
  );
}

// ---------- Reminders section ----------
function RemindersSection({ perSection, onMarkDirty, initialData, saveFields, onRegister }) {
  const init = React.useRef(initialData);
  const [dirty,    setDirty]    = React.useState(false);
  const [adaptive, setAdaptive] = React.useState(initialData.adaptiveReminders !== false);
  const [pace,     setPace]     = React.useState(initialData.reminderPace || 35);
  const [color,    setColor]    = React.useState(initialData.ledColor     || HS.teal);
  const swatches = [HS.teal, '#3B82F6', '#D97706', '#A32D2D', '#7C3AED', '#FFFFFF'];

  function mark(setter) {
    return (v) => { setter(v); setDirty(true); onMarkDirty && onMarkDirty('Reminders', true); };
  }

  function handleSave(action) {
    if (action === 'discard') {
      setAdaptive(init.current.adaptiveReminders !== false);
      setPace(init.current.reminderPace || 35);
      setColor(init.current.ledColor    || HS.teal);
      setDirty(false);
      onMarkDirty && onMarkDirty('Reminders', false);
      return;
    }
    return saveFields({ adaptiveReminders: adaptive, reminderPace: pace, ledColor: color }).then(() => {
      // Update baseline so Discard after Save resets to the just-saved values.
      init.current = { ...init.current, adaptiveReminders: adaptive, reminderPace: pace, ledColor: color };
      setDirty(false);
      onMarkDirty && onMarkDirty('Reminders', false);
    });
  }

  // Expose save/discard to parent for sticky-bar mode.
  const latestSave = React.useRef(handleSave);
  latestSave.current = handleSave;
  React.useEffect(() => {
    onRegister?.('Reminders', () => latestSave.current(), () => latestSave.current('discard'));
  }, [onRegister]);

  // Normalize comparison so '#0087BD' and '#0087bd' both match the swatch.
  const colorLower = color.toLowerCase();

  return (
    <SectionWrap id="reminders" perSection={perSection} dirty={dirty} onSave={handleSave}>
      <SectionHeader title="Reminders" subtitle="When and how the coaster nudges you." />
      <RowItem label="Adaptive reminders" hint="Reminders adjust to your real-time pace." right={<Toggle value={adaptive} onChange={mark(setAdaptive)} />} />
      <Divider />
      <RowItem label="Reminder pace" hint="Minutes between expected sips." right={<NumberStepper value={pace} onChange={mark(setPace)} step={5} suffix="min" min={5} max={120} />} />
      <Divider />
      <RowItem
        label="LED reminder color"
        hint="The coaster pulses this color when it's time to drink."
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {swatches.map((s) => {
                const active = s.toLowerCase() === colorLower;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => mark(setColor)(s)}
                    aria-label={s}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', background: s,
                      border: `${active ? 2 : 0.5}px solid ${active ? HS.teal : HS.border}`,
                      cursor: 'pointer', padding: 0,
                      boxShadow: active ? `0 0 0 3px ${HS.tealLight}` : 'none',
                      transition: 'all .12s',
                    }}
                  />
                );
              })}
            </div>
            <Input value={color} onChange={mark(setColor)} />
            <button style={ghostBtn({ height: 36, padding: '0 12px', fontSize: 13 })}>
              <Icon name="light-line" size={14} color={HS.text1} />
              Test LED
            </button>
          </div>
        }
        stack
      />
    </SectionWrap>
  );
}

// ---------- Scale section (no Firestore — device-local) ----------
function ScaleSection({ perSection, onMarkDirty, onRegister }) {
  const [dirty, setDirty] = React.useState(false);
  const [adv,   setAdv]   = React.useState(false);
  const [debug, setDebug] = React.useState(false);
  const mark = (fn) => (v) => { fn(v); setDirty(true); onMarkDirty && onMarkDirty('Scale', true); };

  function handleSave(action) {
    setDirty(false);
    onMarkDirty && onMarkDirty('Scale', false);
  }

  const latestSave = React.useRef(handleSave);
  latestSave.current = handleSave;
  React.useEffect(() => {
    onRegister?.('Scale', () => latestSave.current(), () => latestSave.current('discard'));
  }, [onRegister]);

  return (
    <SectionWrap id="scale" perSection={perSection} dirty={dirty} onSave={handleSave}>
      <SectionHeader title="Scale" subtitle="Calibration and hardware behaviour." />
      <Row columns={2}>
        <FieldBlock label="Reference weight" hint="Place a known-mass cup or weight to calibrate." defaultValue="250" />
        <div>
          <Label>&nbsp;</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={ghostBtn({ height: 40 })}><Icon name="refresh-1-line" size={14} color={HS.text1} />Tare scale</button>
            <button style={tealBtn({ height: 40 })}><Icon name="settings-3-line" size={14} color="#FFFFFF" />Calibrate</button>
          </div>
        </div>
      </Row>
      <Divider />
      <button
        type="button"
        onClick={() => setAdv((v) => !v)}
        style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: HS.text1, fontWeight: 500, fontFamily: HS.font }}
      >
        <Icon name="right-line" size={12} color={HS.text2} style={{ transform: adv ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .15s' }} />
        Advanced thresholds
        <span style={{ fontSize: 12, color: HS.text3, fontWeight: 400 }}>{adv ? 'hide' : 'show'} 6 expert settings</span>
      </button>
      {adv ? (
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
          {[
            ['Cup presence threshold', '12 g', 'Min weight to consider a cup is on the coaster.'],
            ['Cup removal threshold',  '4 g',  'Weight below which cup is considered lifted.'],
            ['Stability band',         '0.6 g','Reading must stay within this band to settle.'],
            ['Settle duration',        '350 ms','Time of stability before classifying as steady.'],
            ['Sip threshold',          '8 g',  'Minimum delta between settles to register a sip.'],
            ['Refill threshold',       '40 g', 'Delta required to classify as a refill, not a sip.'],
          ].map(([name, val, desc]) => (
            <div key={name}><Label hint={desc}>{name}</Label><Input defaultValue={val} /></div>
          ))}
        </div>
      ) : null}
      <Divider />
      <RowItem label="Debug mode" hint="Shows raw readings and timing in the dashboard." right={<Toggle value={debug} onChange={mark(setDebug)} />} />
    </SectionWrap>
  );
}

// ---------- Account section ----------
function AccountSection({ perSection, onMarkDirty, onRegister }) {
  const [dirty, setDirty] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  function handleSave(action) {
    setDirty(false);
    onMarkDirty && onMarkDirty('Account', false);
  }

  const latestSave = React.useRef(handleSave);
  latestSave.current = handleSave;
  React.useEffect(() => {
    onRegister?.('Account', () => latestSave.current(), () => latestSave.current('discard'));
  }, [onRegister]);

  function handleSignOut() {
    setSigningOut(true);
    window.HS_AUTH.signOut()
      .then(() => { window.location.href = 'signin.html'; })
      .catch(() => setSigningOut(false));
  }

  return (
    <SectionWrap id="account" perSection={perSection} dirty={dirty} onSave={handleSave}>
      <SectionHeader title="Account" subtitle="Password, sign out, and deletion." />
      <Label>Change password</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Input type="password" placeholder="Current password"  onChange={() => { setDirty(true); onMarkDirty && onMarkDirty('Account', true); }} />
        <Input type="password" placeholder="New password"      onChange={() => { setDirty(true); onMarkDirty && onMarkDirty('Account', true); }} />
        <Input type="password" placeholder="Confirm new password" onChange={() => { setDirty(true); onMarkDirty && onMarkDirty('Account', true); }} />
        <button style={tealBtn({ alignSelf: 'flex-start', height: 36 })}>Update password</button>
      </div>
      <Divider />
      <div style={{ background: HS.dangerBg, border: `0.5px solid ${HS.dangerBorder}`, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: HS.danger, fontWeight: 500, fontSize: 14, marginBottom: 6 }}>
          <Icon name="alert-octagon-line" size={16} color={HS.danger} />
          Danger zone
        </div>
        <p style={{ margin: 0, fontSize: 13, color: HS.text2, lineHeight: 1.5 }}>
          Deleting your account permanently removes all your data, including history and personal goals. This cannot be undone.
        </p>
        <button
          style={{ marginTop: 14, height: 36, padding: '0 14px', borderRadius: 12, background: 'transparent', color: HS.danger, border: `0.5px solid ${HS.danger}`, fontSize: 13.5, fontWeight: 500, cursor: 'pointer', fontFamily: HS.font, display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Icon name="delete-2-line" size={14} color={HS.danger} />
          Delete account
        </button>
      </div>
      <Divider />
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        style={ghostBtn({ opacity: signingOut ? 0.6 : 1, cursor: signingOut ? 'progress' : 'pointer' })}
      >
        <Icon name="exit-line" size={14} color={HS.text1} />
        {signingOut ? 'Signing out…' : 'Sign out'}
      </button>
    </SectionWrap>
  );
}

// ---------- Sticky save bar (sticky mode) ----------
function StickySaveBar({ dirtyMap, onSaveAll, onDiscardAll }) {
  const [saving,   setSaving]   = React.useState(false);
  const [saveErr,  setSaveErr]  = React.useState('');
  const dirtyCount = Object.values(dirtyMap).filter(Boolean).length;

  function handleSave() {
    if (saving) return;
    setSaving(true);
    setSaveErr('');
    Promise.resolve(onSaveAll && onSaveAll())
      .then(() => setSaving(false))
      .catch(() => {
        setSaving(false);
        setSaveErr('Some changes failed to save. Please try again.');
      });
  }

  return (
    <div
      style={{
        position: 'sticky', bottom: 0, marginTop: 'auto',
        background: 'rgba(255,255,255,0.94)', borderTop: `0.5px solid ${HS.border}`,
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        padding: '14px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 12, zIndex: 5,
      }}
    >
      <span style={{ fontSize: 13, color: saveErr ? HS.danger : HS.text2 }}>
        {saveErr || (dirtyCount > 0
          ? `You have unsaved changes in ${dirtyCount} ${dirtyCount === 1 ? 'section' : 'sections'}.`
          : 'All changes saved.')}
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={ghostBtn({ height: 36, fontSize: 13, opacity: dirtyCount ? 1 : 0.5 })} disabled={!dirtyCount || saving} onClick={onDiscardAll}>Discard</button>
        <button style={tealBtn({ height: 36, fontSize: 13, opacity: dirtyCount ? 1 : 0.5 })} disabled={!dirtyCount || saving} onClick={handleSave}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

// ---------- Page ----------
function Settings() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const perSection = t.saveMode === 'perSection';

  const { state, userData, saveFields } = useFirebaseUser();

  const [dirtyMap, setDirtyMap] = React.useState({});
  const markDirty = React.useCallback((name, isDirty) => {
    setDirtyMap((m) => ({ ...m, [name]: isDirty }));
  }, []);

  // Registry for sticky-mode: each section registers its save/discard fn once.
  const sectionHandlers = React.useRef({});
  const registerHandler = React.useCallback((id, saveFn, discardFn) => {
    sectionHandlers.current[id] = { save: saveFn, discard: discardFn };
  }, []);

  const handleSaveAll = React.useCallback(() => {
    const fns = Object.values(sectionHandlers.current);
    return Promise.all(fns.map(f => Promise.resolve(f.save && f.save())));
  }, []);

  const handleDiscardAll = React.useCallback(() => {
    Object.values(sectionHandlers.current).forEach(f => f.discard && f.discard());
    setDirtyMap({});
  }, []);

  if (state === 'loading') return <LoadingScreen />;

  return (
    <div style={{ background: HS.bg, fontFamily: HS.font, color: HS.text1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNavbar active="Settings" user={userData} />
      <main
        style={{
          flex: 1, width: '100%', maxWidth: 920, margin: '0 auto',
          padding: perSection ? '32px 24px 56px' : '32px 24px 96px',
          display: 'flex', flexDirection: 'column', gap: 22, boxSizing: 'border-box',
        }}
      >
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: -0.6, margin: 0 }}>Settings</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: HS.text2 }}>
            {perSection ? 'Each section saves independently.' : 'Everything on one scrollable page — save all at once below.'}
          </p>
        </div>
        <ProfileSection   perSection={perSection} onMarkDirty={markDirty} initialData={userData} saveFields={saveFields} onRegister={registerHandler} />
        <GoalsSection     perSection={perSection} onMarkDirty={markDirty} initialData={userData} saveFields={saveFields} onRegister={registerHandler} />
        <RemindersSection perSection={perSection} onMarkDirty={markDirty} initialData={userData} saveFields={saveFields} onRegister={registerHandler} />
        <ScaleSection     perSection={perSection} onMarkDirty={markDirty} onRegister={registerHandler} />
        <AccountSection   perSection={perSection} onMarkDirty={markDirty} onRegister={registerHandler} />
      </main>
      {!perSection ? (
        <StickySaveBar dirtyMap={dirtyMap} onSaveAll={handleSaveAll} onDiscardAll={handleDiscardAll} />
      ) : null}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Settings layout">
          <TweakRadio
            label="Save behaviour"
            value={t.saveMode}
            options={[
              { value: 'perSection', label: 'Per-section' },
              { value: 'sticky',     label: 'Single bar' },
            ]}
            onChange={(v) => setTweak('saveMode', v)}
          />
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', padding: '2px 14px 10px', lineHeight: 1.5 }}>
            Per-section gives every card its own Save button. Single bar collects all changes at the bottom.
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

window.Settings = Settings;
