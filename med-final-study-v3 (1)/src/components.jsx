/* مكوّنات الواجهة المشتركة + Hooks */
const { useState, useEffect, useMemo, useRef, useCallback, Fragment } = React;

const UI = {};

/* أيقونة SVG */
UI.Icon = function Icon({ name, size = 18, className = '', strokeWidth = 2 }) {
  const d = Icons.paths[name] || Icons.paths.info;
  return (
    <svg className={'icon ' + className} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" dangerouslySetInnerHTML={{ __html: d }} />
  );
};

/* عدّاد رقمي متحرك */
UI.useCountUp = function useCountUp(target, opts) {
  const o = opts || {};
  const duration = o.duration || 900;
  const decimals = o.decimals || 0;
  const [val, setVal] = useState(0);
  const fromRef = useRef(0);
  useEffect(function () {
    const from = fromRef.current;
    const start = performance.now();
    let raf;
    function tick(t) {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = from + (target - from) * eased;
      setVal(v);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    }
    raf = requestAnimationFrame(tick);
    return function () { cancelAnimationFrame(raf); fromRef.current = target; };
  }, [target, duration]);
  return decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString('en-US');
};

/* شريط تقدم */
UI.ProgressBar = function ProgressBar({ pct, color, height = 8, className = '' }) {
  const c = color || '#6366f1';
  const p = Core.clamp(pct || 0, 0, 100);
  return (
    <div className={'progressbar ' + className} style={{ height }} role="progressbar" aria-valuenow={p} aria-valuemin="0" aria-valuemax="100">
      <div className="progressbar-fill" style={{ width: p + '%', background: 'linear-gradient(90deg, ' + c + ', ' + c + 'CC)' }} />
    </div>
  );
};

/* حلقة تقدم دائرية */
UI.Ring = function Ring({ pct, size = 72, stroke = 8, color = '#6366f1', children, className = '' }) {
  const p = Core.clamp(pct || 0, 0, 100);
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const off = C * (1 - p / 100);
  return (
    <div className={'ring ' + className} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size}>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" />
        <circle className="ring-fill" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none"
          stroke={color} strokeDasharray={C} strokeDashoffset={off} strokeLinecap="round"
          transform={'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')'} />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
};

/* بطاقة إحصائية */
UI.StatCard = function StatCard({ icon, label, value, sub, color, delay = 0, decimals = 0 }) {
  const isNum = typeof value === 'number';
  const shown = UI.useCountUp(isNum ? value : 0, { decimals: decimals });
  return (
    <div className="stat-card" style={{ animationDelay: delay + 'ms' }}>
      <span className="stat-icon" style={{ background: (color || '#6366f1') + '1E', color: color || '#6366f1' }}>
        <UI.Icon name={icon} size={20} />
      </span>
      <div className="stat-body">
        <div className="stat-value">{isNum ? shown : value}</div>
        <div className="stat-label">{label}</div>
        {sub ? <div className="stat-sub">{sub}</div> : null}
      </div>
    </div>
  );
};

/* حالة فارغة */
UI.EmptyState = function EmptyState({ icon, title, hint, children }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><UI.Icon name={icon || 'info'} size={30} strokeWidth={1.6} /></div>
      <h3>{title}</h3>
      {hint ? <p>{hint}</p> : null}
      {children}
    </div>
  );
};

/* حقل إدخال مع عنوان */
UI.Field = function Field({ label, icon, children, className = '' }) {
  return (
    <div className={'field ' + className}>
      {label ? <label className="field-label"><UI.Icon name={icon || 'info'} size={13} /> {label}</label> : null}
      {children}
    </div>
  );
};

/* خانة بحث */
UI.SearchBox = function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="searchbox">
      <UI.Icon name="search" size={15} className="searchbox-icon" />
      <input type="text" value={value} onChange={function (e) { onChange(e.target.value); }} placeholder={placeholder || 'بحث...'} />
      {value ? (
        <button type="button" className="searchbox-clear" onClick={function () { onChange(''); }} aria-label="مسح البحث">
          <UI.Icon name="x" size={13} />
        </button>
      ) : null}
    </div>
  );
};

/* شارة صغيرة */
UI.Badge = function Badge({ color, children, className = '' }) {
  return (
    <span className={'badge ' + className} style={color ? { background: color + '1A', color: color, borderColor: color + '4D' } : null}>
      {children}
    </span>
  );
};

/* التبويبات */
UI.Tabs = function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map(function (t) {
        const isActive = t.id === active;
        return (
          <button key={t.id} type="button" role="tab" aria-selected={isActive}
            className={'tab-btn' + (isActive ? ' active' : '')}
            onClick={function () { onChange(t.id); }}>
            <UI.Icon name={t.icon} size={16} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

/* نافذة منبثقة */
UI.Modal = function Modal({ open, onClose, title, icon, children, footer, width = 560 }) {
  useEffect(function () {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return function () {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={function (e) { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-panel" style={{ maxWidth: width }} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>{icon ? <UI.Icon name={icon} size={17} /> : null} {title}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="إغلاق">
            <UI.Icon name="x" size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
};

/* نافذة تأكيد */
UI.ConfirmDialog = function ConfirmDialog({ cfg }) {
  if (!cfg || !cfg.open) return null;
  return (
    <UI.Modal open={cfg.open} onClose={cfg.onClose} title={cfg.title || 'تأكيد'} icon={cfg.icon || 'alert'} width={440}>
      <p className="confirm-message">{cfg.message}</p>
      <div className="confirm-actions">
        <button type="button" className={'btn ' + (cfg.danger ? 'btn-danger' : 'btn-primary')} onClick={cfg.onConfirm}>
          {cfg.confirmText || 'تأكيد'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={cfg.onClose}>إلغاء</button>
      </div>
    </UI.Modal>
  );
};

/* حاوية التنبيهات Toast */
UI.Toasts = function Toasts({ items, onDismiss }) {
  return (
    <div className="toasts" aria-live="polite">
      {items.map(function (t) {
        return (
          <div key={t.id} className={'toast toast-' + t.type} onClick={function () { onDismiss(t.id); }}>
            <span className="toast-icon">
              <UI.Icon name={t.type === 'success' ? 'checkCircle' : t.type === 'error' ? 'alert' : 'info'} size={17} />
            </span>
            <div className="toast-body">
              <strong>{t.title}</strong>
              {t.msg ? <span>{t.msg}</span> : null}
            </div>
            <UI.Icon name="x" size={13} className="toast-close" />
          </div>
        );
      })}
    </div>
  );
};

/* عنوان قسم داخل بطاقة */
UI.CardHeader = function CardHeader({ icon, title, sub, color, children }) {
  return (
    <div className="card-header">
      <div className="card-header-text">
        <h2>{icon ? <span className="card-h-icon" style={color ? { background: color + '1E', color: color } : null}><UI.Icon name={icon} size={16} /></span> : null}{title}</h2>
        {sub ? <p className="card-sub">{sub}</p> : null}
      </div>
      {children}
    </div>
  );
};

/* شارة تقدير الجاهزية الذكية */
UI.GradeBadge = function GradeBadge({ g, compact }) {
  if (!g) return null;
  return (
    <span className={'grade-badge' + (compact ? ' compact' : '')} style={{ background: g.color + '1A', color: g.color, borderColor: g.color + '4D' }}
      title={'النتيجة الذكية: ' + g.score + '/100 — ' + g.grade}>
      <strong>{g.letter}</strong>
      {!compact ? <span>{g.grade} • {g.score}%</span> : null}
    </span>
  );
};

/* شريحة الوتيرة والتوقع */
UI.PaceChip = function PaceChip({ pace }) {
  if (!pace || pace.status === 'done' || pace.status === 'none') return null;
  return (
    <span className={'pace-chip pace-' + pace.status} style={{ color: pace.color, borderColor: pace.color + '4D', background: pace.color + '14' }}
      title={'الوتيرة الحالية: ' + pace.currentPerDay + ' سلايد/يوم — المطلوب: ' + pace.requiredPerDay}>
      <UI.Icon name={pace.status === 'behind' ? 'alert' : pace.status === 'ahead' ? 'zap' : 'checkCircle'} size={12} />
      {pace.label}
    </span>
  );
};
