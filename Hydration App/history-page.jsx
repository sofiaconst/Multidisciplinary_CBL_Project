// History page — Screen 6
// Two variations × desktop + mobile.

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

// ----- Navbar -----
function HistoryNavbar({ mobile }) {
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
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <Icon name="left-line" size={18} color={HS.text1} />
        </button>
        <span style={{ flex: 1, fontSize: 16, fontWeight: 500, color: HS.text1 }}>History</span>
        <button
          style={{
            width: 32,
            height: 32,
            border: 'none',
            background: 'transparent',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <Icon name="calendar-line" size={18} color={HS.text1} />
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
        {['Dashboard', 'History', 'Settings'].map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontSize: 14,
              color: l === 'History' ? HS.text1 : HS.text2,
              fontWeight: l === 'History' ? 500 : 400,
              textDecoration: 'none',
              position: 'relative',
            }}
          >
            {l}
            {l === 'History' ? (
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

// ----- Range selector -----
function RangePills({ value = 'Week', onChange }) {
  const opts = ['Day', 'Week', 'Month', 'Year'];
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: 3,
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 12,
        gap: 2,
      }}
    >
      {opts.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange && onChange(o)}
            style={{
              padding: '6px 14px',
              borderRadius: 10,
              border: 'none',
              background: active ? HS.tealLight : 'transparent',
              color: active ? HS.tealDark : HS.text2,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: HS.font,
              cursor: 'pointer',
              transition: 'all .12s',
            }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

// ----- Bar chart -----
const WEEK_DATA = [
  { day: 'Mon', date: '4', ml: 2400, sips: 14 },
  { day: 'Tue', date: '5', ml: 2680, sips: 16 },
  { day: 'Wed', date: '6', ml: 1980, sips: 12 },
  { day: 'Thu', date: '7', ml: 2820, sips: 18 },
  { day: 'Fri', date: '8', ml: 3120, sips: 19 },
  { day: 'Sat', date: '9', ml: 2200, sips: 13 },
  { day: 'Sun', date: '10', ml: 2540, sips: 15 },
];

function WeekChart({ data = WEEK_DATA, goal = 2800, compact }) {
  const max = Math.max(...data.map((d) => d.ml), goal) * 1.1;
  const today = 4; // Friday highlighted
  return (
    <div style={{ position: 'relative', paddingTop: 8 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: compact ? 8 : 18,
          height: compact ? 180 : 240,
          padding: '0 4px',
          position: 'relative',
        }}
      >
        {/* Goal line */}
        <div
          style={{
            position: 'absolute',
            left: 4,
            right: 4,
            top: `${(1 - goal / max) * 100}%`,
            borderTop: `1px dashed ${HS.tealMid}`,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              position: 'absolute',
              right: 0,
              top: -16,
              fontSize: 10,
              color: HS.tealDark,
              background: HS.surface,
              padding: '1px 6px',
              borderRadius: 6,
              border: `0.5px solid ${HS.tealMid}`,
            }}
          >
            goal · {goal} ml
          </span>
        </div>
        {data.map((d, i) => {
          const h = (d.ml / max) * 100;
          const isToday = i === today;
          return (
            <div
              key={d.day}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                height: '100%',
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-end',
                  width: '100%',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${h}%`,
                    background: isToday ? HS.teal : HS.tealMid,
                    borderRadius: '8px 8px 4px 4px',
                    transition: 'height 600ms cubic-bezier(.2,.7,.3,1)',
                    position: 'relative',
                  }}
                >
                  {isToday ? (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 6px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 11,
                        color: HS.text1,
                        background: HS.surface,
                        border: `0.5px solid ${HS.border}`,
                        padding: '2px 8px',
                        borderRadius: 6,
                        whiteSpace: 'nowrap',
                        fontWeight: 500,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {d.ml.toLocaleString()} ml
                    </span>
                  ) : null}
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: isToday ? HS.text1 : HS.text3,
                  fontWeight: isToday ? 500 : 400,
                  textAlign: 'center',
                }}
              >
                <div>{d.day}</div>
                <div style={{ fontSize: 10 }}>{d.date}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----- Stat -----
function HistoryStat({ label, value, sub, accent }) {
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ fontSize: 12, color: HS.text3 }}>{label}</div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: -0.6,
          color: accent ? HS.teal : HS.text1,
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

// ----- Sessions list -----
const SESSIONS = [
  { day: 'Today, Fri 8', total: '2,820 ml', sips: 18, dur: '11h 42m', pct: 100 },
  { day: 'Thu 7', total: '2,820 ml', sips: 18, dur: '11h 06m', pct: 100 },
  { day: 'Wed 6', total: '1,980 ml', sips: 12, dur: '9h 18m', pct: 70 },
  { day: 'Tue 5', total: '2,680 ml', sips: 16, dur: '10h 48m', pct: 95 },
  { day: 'Mon 4', total: '2,400 ml', sips: 14, dur: '10h 12m', pct: 85 },
  { day: 'Sun 3', total: '2,540 ml', sips: 15, dur: '11h 22m', pct: 90 },
];

function SessionsList({ compact }) {
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: compact ? '14px 16px' : '16px 22px',
          borderBottom: `0.5px solid ${HS.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: HS.text1 }}>Recent days</span>
        <a href="#" style={{ fontSize: 12, color: HS.teal, textDecoration: 'none', fontWeight: 500 }}>
          Export CSV
        </a>
      </div>
      <div>
        {SESSIONS.map((s, i) => (
          <div
            key={s.day}
            style={{
              display: 'grid',
              gridTemplateColumns: compact ? '1fr auto' : '1.5fr 1fr 1fr 1fr auto',
              alignItems: 'center',
              gap: compact ? 8 : 12,
              padding: compact ? '12px 16px' : '14px 22px',
              borderTop: i === 0 ? 'none' : `0.5px solid ${HS.border}`,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: 14, color: HS.text1, fontWeight: i === 0 ? 500 : 400 }}>
                {s.day}
              </span>
              {compact ? (
                <span style={{ fontSize: 12, color: HS.text3 }}>
                  {s.total} · {s.sips} sips · {s.dur}
                </span>
              ) : null}
            </div>
            {!compact ? (
              <>
                <span style={{ fontSize: 13, color: HS.text2, fontVariantNumeric: 'tabular-nums' }}>
                  {s.total}
                </span>
                <span style={{ fontSize: 13, color: HS.text2 }}>{s.sips} sips</span>
                <span style={{ fontSize: 13, color: HS.text2 }}>{s.dur}</span>
              </>
            ) : null}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 8px',
                borderRadius: 20,
                background: s.pct >= 100 ? HS.tealLight : HS.bg,
                color: s.pct >= 100 ? HS.tealDark : HS.text2,
                fontSize: 11.5,
                fontWeight: 500,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {s.pct >= 100 ? <Icon name="check-line" size={10} color={HS.tealDark} /> : null}
              {s.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// VARIATION A — Time-series dashboard
// =====================================================
function HistoryA({ mobile = false }) {
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
      <HistoryNavbar mobile={mobile} />
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 1180,
          margin: '0 auto',
          padding: mobile ? '20px 16px 32px' : '32px 24px 56px',
          display: 'flex',
          flexDirection: 'column',
          gap: mobile ? 14 : 20,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: mobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            flexDirection: mobile ? 'column' : 'row',
            gap: 12,
          }}
        >
          {mobile ? null : (
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: -0.6, margin: 0 }}>
                History
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: HS.text2 }}>
                Hydration over time. Pick a range.
              </p>
            </div>
          )}
          <RangePills value="Week" />
        </div>
        {/* Chart card */}
        <div
          style={{
            background: HS.surface,
            border: `0.5px solid ${HS.border}`,
            borderRadius: 16,
            padding: mobile ? 18 : 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 16,
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: HS.text3, marginBottom: 4 }}>This week</div>
              <div
                style={{
                  fontSize: mobile ? 26 : 32,
                  fontWeight: 500,
                  letterSpacing: -0.8,
                  color: HS.text1,
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                }}
              >
                17,740 ml
              </div>
              <div style={{ fontSize: 13, color: HS.text2, marginTop: 4 }}>
                <span style={{ color: HS.teal, fontWeight: 500 }}>+12%</span> vs last week
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 16,
                fontSize: 11,
                color: HS.text3,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: HS.teal }} />
                Today
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: HS.tealMid }} />
                Past
              </span>
            </div>
          </div>
          <WeekChart compact={compact} />
        </div>
        {/* Stat row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: 12,
          }}
        >
          <HistoryStat label="Daily avg" value="2,534 ml" sub="vs goal 2,800" />
          <HistoryStat label="Best day" value="3,120 ml" sub="Fri Aug 8" accent />
          <HistoryStat label="Goal hits" value="5 / 7" sub="this week" />
          <HistoryStat label="Longest streak" value="14 days" sub="current" />
        </div>
        <SessionsList compact={mobile} />
      </main>
    </div>
  );
}

// =====================================================
// VARIATION B — Year heatmap + day detail
// =====================================================
function YearHeatmap({ compact }) {
  // 52 weeks × 7 days. Deterministic pseudo-random intensity.
  const cols = compact ? 26 : 52;
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: HS.text3, marginBottom: 2 }}>This year</div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: HS.text1,
              letterSpacing: -0.3,
            }}
          >
            218 logged days · 78% goal-hit
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: HS.text3 }}>
          less
          {[0, 0.2, 0.45, 0.7, 1].map((v, i) => (
            <span
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: v === 0 ? HS.bg : tealShade(v),
                border: v === 0 ? `0.5px solid ${HS.border}` : 'none',
              }}
            />
          ))}
          more
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: 'repeat(7, 1fr)',
          gridAutoFlow: 'column',
          gap: 3,
          aspectRatio: `${cols} / 7`,
        }}
      >
        {Array.from({ length: cols * 7 }).map((_, i) => {
          // Skip future days (last few cells)
          const future = i >= cols * 7 - 8;
          const seed = (i * 37 + 11) % 100;
          let intensity;
          if (future) intensity = -1;
          else if (seed < 12) intensity = 0;
          else if (seed < 35) intensity = 0.25;
          else if (seed < 60) intensity = 0.5;
          else if (seed < 85) intensity = 0.78;
          else intensity = 1;
          return (
            <span
              key={i}
              style={{
                borderRadius: 3,
                background:
                  intensity === -1
                    ? 'transparent'
                    : intensity === 0
                    ? HS.bg
                    : tealShade(intensity),
                border:
                  intensity === 0
                    ? `0.5px solid ${HS.border}`
                    : intensity === -1
                    ? `0.5px dashed ${HS.border}`
                    : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
function tealShade(v) {
  // Returns an oklch teal interpolation from light to dark.
  if (v >= 0.85) return HS.tealDark;
  if (v >= 0.6) return HS.teal;
  if (v >= 0.35) return HS.tealMid;
  return HS.tealLight;
}

function DayTimeline({ compact }) {
  const sips = [
    { t: '07:14', ml: 220 },
    { t: '08:02', ml: 60 },
    { t: '09:30', ml: 180 },
    { t: '10:48', ml: 90 },
    { t: '12:12', ml: 320 },
    { t: '13:40', ml: 140 },
    { t: '14:55', ml: 60 },
    { t: '16:18', ml: 220 },
    { t: '17:42', ml: 180 },
    { t: '19:08', ml: 260 },
    { t: '20:22', ml: 90 },
    { t: '21:35', ml: 110 },
  ];
  const maxSip = Math.max(...sips.map((s) => s.ml));
  return (
    <div
      style={{
        background: HS.surface,
        border: `0.5px solid ${HS.border}`,
        borderRadius: 16,
        padding: compact ? 18 : 22,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: HS.text3 }}>Friday, Aug 8</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: HS.text1, letterSpacing: -0.3 }}>
            3,120 ml · {sips.length} sips
          </div>
        </div>
        <span
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
          }}
        >
          <Icon name="check-line" size={12} color={HS.tealDark} />
          Goal hit
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: compact ? 4 : 6,
          height: 100,
          marginBottom: 14,
        }}
      >
        {sips.map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${(s.ml / maxSip) * 100}%`,
              background: HS.teal,
              borderRadius: 4,
              opacity: 0.4 + (s.ml / maxSip) * 0.6,
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: HS.text3,
        }}
      >
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>00:00</span>
      </div>
    </div>
  );
}

function HistoryB({ mobile = false }) {
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
      <HistoryNavbar mobile={mobile} />
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 1180,
          margin: '0 auto',
          padding: mobile ? '20px 16px 32px' : '32px 24px 56px',
          display: 'flex',
          flexDirection: 'column',
          gap: mobile ? 14 : 20,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: mobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexDirection: mobile ? 'column' : 'row',
          }}
        >
          {mobile ? null : (
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: -0.6, margin: 0 }}>
                History
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: HS.text2 }}>
                Year at a glance. Tap a day to see the timeline.
              </p>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button style={ghostBtn({ height: 36, fontSize: 13 })}>
              <Icon name="left-line" size={14} color={HS.text1} />
              2025
            </button>
            <span style={{ fontSize: 15, fontWeight: 500 }}>2026</span>
            <button style={ghostBtn({ height: 36, fontSize: 13, opacity: 0.5 })}>
              2027
              <Icon name="right-line" size={14} color={HS.text1} />
            </button>
          </div>
        </div>
        {/* Heatmap card */}
        <div
          style={{
            background: HS.surface,
            border: `0.5px solid ${HS.border}`,
            borderRadius: 16,
            padding: mobile ? 18 : 24,
          }}
        >
          <YearHeatmap compact={mobile} />
        </div>
        {/* Stat row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: 12,
          }}
        >
          <HistoryStat label="Logged" value="218" sub="of 220 days" />
          <HistoryStat label="Goal hits" value="78%" sub="this year" accent />
          <HistoryStat label="Best month" value="June" sub="93% goal hit" />
          <HistoryStat label="Longest streak" value="34" sub="days, in March" />
        </div>
        <DayTimeline compact={mobile} />
      </main>
    </div>
  );
}

Object.assign(window, { HistoryA, HistoryB });
