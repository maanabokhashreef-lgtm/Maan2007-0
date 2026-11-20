/* تم توليد هذا الملف تلقائياً من src/components.jsx — عدّل ملف المصدر ثم شغّل: npm run build */
const {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  Fragment
} = React;
const UI = {};
UI.Icon = function Icon({
  name,
  size = 18,
  className = '',
  strokeWidth = 2
}) {
  const d = Icons.paths[name] || Icons.paths.info;
  return React.createElement("svg", {
    className: 'icon ' + className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    dangerouslySetInnerHTML: {
      __html: d
    }
  });
};
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
      if (p < 1) raf = requestAnimationFrame(tick);else fromRef.current = target;
    }
    raf = requestAnimationFrame(tick);
    return function () {
      cancelAnimationFrame(raf);
      fromRef.current = target;
    };
  }, [target, duration]);
  return decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString('en-US');
};
UI.ProgressBar = function ProgressBar({
  pct,
  color,
  height = 8,
  className = ''
}) {
  const c = color || '#6366f1';
  const p = Core.clamp(pct || 0, 0, 100);
  return React.createElement("div", {
    className: 'progressbar ' + className,
    style: {
      height
    },
    role: "progressbar",
    "aria-valuenow": p,
    "aria-valuemin": "0",
    "aria-valuemax": "100"
  }, React.createElement("div", {
    className: "progressbar-fill",
    style: {
      width: p + '%',
      background: 'linear-gradient(90deg, ' + c + ', ' + c + 'CC)'
    }
  }));
};
UI.Ring = function Ring({
  pct,
  size = 72,
  stroke = 8,
  color = '#6366f1',
  children,
  className = ''
}) {
  const p = Core.clamp(pct || 0, 0, 100);
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const off = C * (1 - p / 100);
  return React.createElement("div", {
    className: 'ring ' + className,
    style: {
      width: size,
      height: size
    }
  }, React.createElement("svg", {
    width: size,
    height: size,
    viewBox: '0 0 ' + size + ' ' + size
  }, React.createElement("circle", {
    className: "ring-track",
    cx: size / 2,
    cy: size / 2,
    r: r,
    strokeWidth: stroke,
    fill: "none"
  }), React.createElement("circle", {
    className: "ring-fill",
    cx: size / 2,
    cy: size / 2,
    r: r,
    strokeWidth: stroke,
    fill: "none",
    stroke: color,
    strokeDasharray: C,
    strokeDashoffset: off,
    strokeLinecap: "round",
    transform: 'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')'
  })), React.createElement("div", {
    className: "ring-center"
  }, children));
};
UI.StatCard = function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  delay = 0,
  decimals = 0
}) {
  const isNum = typeof value === 'number';
  const shown = UI.useCountUp(isNum ? value : 0, {
    decimals: decimals
  });
  return React.createElement("div", {
    className: "stat-card",
    style: {
      animationDelay: delay + 'ms'
    }
  }, React.createElement("span", {
    className: "stat-icon",
    style: {
      background: (color || '#6366f1') + '1E',
      color: color || '#6366f1'
    }
  }, React.createElement(UI.Icon, {
    name: icon,
    size: 20
  })), React.createElement("div", {
    className: "stat-body"
  }, React.createElement("div", {
    className: "stat-value"
  }, isNum ? shown : value), React.createElement("div", {
    className: "stat-label"
  }, label), sub ? React.createElement("div", {
    className: "stat-sub"
  }, sub) : null));
};
UI.EmptyState = function EmptyState({
  icon,
  title,
  hint,
  children
}) {
  return React.createElement("div", {
    className: "empty-state"
  }, React.createElement("div", {
    className: "empty-icon"
  }, React.createElement(UI.Icon, {
    name: icon || 'info',
    size: 30,
    strokeWidth: 1.6
  })), React.createElement("h3", null, title), hint ? React.createElement("p", null, hint) : null, children);
};
UI.Field = function Field({
  label,
  icon,
  children,
  className = ''
}) {
  return React.createElement("div", {
    className: 'field ' + className
  }, label ? React.createElement("label", {
    className: "field-label"
  }, React.createElement(UI.Icon, {
    name: icon || 'info',
    size: 13
  }), " ", label) : null, children);
};
UI.SearchBox = function SearchBox({
  value,
  onChange,
  placeholder
}) {
  return React.createElement("div", {
    className: "searchbox"
  }, React.createElement(UI.Icon, {
    name: "search",
    size: 15,
    className: "searchbox-icon"
  }), React.createElement("input", {
    type: "text",
    value: value,
    onChange: function (e) {
      onChange(e.target.value);
    },
    placeholder: placeholder || 'بحث...'
  }), value ? React.createElement("button", {
    type: "button",
    className: "searchbox-clear",
    onClick: function () {
      onChange('');
    },
    "aria-label": "\u0645\u0633\u062D \u0627\u0644\u0628\u062D\u062B"
  }, React.createElement(UI.Icon, {
    name: "x",
    size: 13
  })) : null);
};
UI.Badge = function Badge({
  color,
  children,
  className = ''
}) {
  return React.createElement("span", {
    className: 'badge ' + className,
    style: color ? {
      background: color + '1A',
      color: color,
      borderColor: color + '4D'
    } : null
  }, children);
};
UI.Tabs = function Tabs({
  tabs,
  active,
  onChange
}) {
  return React.createElement("div", {
    className: "tabs",
    role: "tablist"
  }, tabs.map(function (t) {
    const isActive = t.id === active;
    return React.createElement("button", {
      key: t.id,
      type: "button",
      role: "tab",
      "aria-selected": isActive,
      className: 'tab-btn' + (isActive ? ' active' : ''),
      onClick: function () {
        onChange(t.id);
      }
    }, React.createElement(UI.Icon, {
      name: t.icon,
      size: 16
    }), React.createElement("span", null, t.label));
  }));
};
UI.Modal = function Modal({
  open,
  onClose,
  title,
  icon,
  children,
  footer,
  width = 560
}) {
  useEffect(function () {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return function () {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open) return null;
  return React.createElement("div", {
    className: "modal-backdrop",
    onClick: function (e) {
      if (e.target === e.currentTarget) onClose();
    }
  }, React.createElement("div", {
    className: "modal-panel",
    style: {
      maxWidth: width
    },
    role: "dialog",
    "aria-modal": "true"
  }, React.createElement("div", {
    className: "modal-header"
  }, React.createElement("h3", null, icon ? React.createElement(UI.Icon, {
    name: icon,
    size: 17
  }) : null, " ", title), React.createElement("button", {
    type: "button",
    className: "icon-btn",
    onClick: onClose,
    "aria-label": "\u0625\u063A\u0644\u0627\u0642"
  }, React.createElement(UI.Icon, {
    name: "x",
    size: 16
  }))), React.createElement("div", {
    className: "modal-body"
  }, children), footer ? React.createElement("div", {
    className: "modal-footer"
  }, footer) : null));
};
UI.ConfirmDialog = function ConfirmDialog({
  cfg
}) {
  if (!cfg || !cfg.open) return null;
  return React.createElement(UI.Modal, {
    open: cfg.open,
    onClose: cfg.onClose,
    title: cfg.title || 'تأكيد',
    icon: cfg.icon || 'alert',
    width: 440
  }, React.createElement("p", {
    className: "confirm-message"
  }, cfg.message), React.createElement("div", {
    className: "confirm-actions"
  }, React.createElement("button", {
    type: "button",
    className: 'btn ' + (cfg.danger ? 'btn-danger' : 'btn-primary'),
    onClick: cfg.onConfirm
  }, cfg.confirmText || 'تأكيد'), React.createElement("button", {
    type: "button",
    className: "btn btn-ghost",
    onClick: cfg.onClose
  }, "\u0625\u0644\u063A\u0627\u0621")));
};
UI.Toasts = function Toasts({
  items,
  onDismiss
}) {
  return React.createElement("div", {
    className: "toasts",
    "aria-live": "polite"
  }, items.map(function (t) {
    return React.createElement("div", {
      key: t.id,
      className: 'toast toast-' + t.type,
      onClick: function () {
        onDismiss(t.id);
      }
    }, React.createElement("span", {
      className: "toast-icon"
    }, React.createElement(UI.Icon, {
      name: t.type === 'success' ? 'checkCircle' : t.type === 'error' ? 'alert' : 'info',
      size: 17
    })), React.createElement("div", {
      className: "toast-body"
    }, React.createElement("strong", null, t.title), t.msg ? React.createElement("span", null, t.msg) : null), React.createElement(UI.Icon, {
      name: "x",
      size: 13,
      className: "toast-close"
    }));
  }));
};
UI.CardHeader = function CardHeader({
  icon,
  title,
  sub,
  color,
  children
}) {
  return React.createElement("div", {
    className: "card-header"
  }, React.createElement("div", {
    className: "card-header-text"
  }, React.createElement("h2", null, icon ? React.createElement("span", {
    className: "card-h-icon",
    style: color ? {
      background: color + '1E',
      color: color
    } : null
  }, React.createElement(UI.Icon, {
    name: icon,
    size: 16
  })) : null, title), sub ? React.createElement("p", {
    className: "card-sub"
  }, sub) : null), children);
};
UI.GradeBadge = function GradeBadge({
  g,
  compact
}) {
  if (!g) return null;
  return React.createElement("span", {
    className: 'grade-badge' + (compact ? ' compact' : ''),
    style: {
      background: g.color + '1A',
      color: g.color,
      borderColor: g.color + '4D'
    },
    title: 'النتيجة الذكية: ' + g.score + '/100 — ' + g.grade
  }, React.createElement("strong", null, g.letter), !compact ? React.createElement("span", null, g.grade, " \u2022 ", g.score, "%") : null);
};
UI.PaceChip = function PaceChip({
  pace
}) {
  if (!pace || pace.status === 'done' || pace.status === 'none') return null;
  return React.createElement("span", {
    className: 'pace-chip pace-' + pace.status,
    style: {
      color: pace.color,
      borderColor: pace.color + '4D',
      background: pace.color + '14'
    },
    title: 'الوتيرة الحالية: ' + pace.currentPerDay + ' سلايد/يوم — المطلوب: ' + pace.requiredPerDay
  }, React.createElement(UI.Icon, {
    name: pace.status === 'behind' ? 'alert' : pace.status === 'ahead' ? 'zap' : 'checkCircle',
    size: 12
  }), pace.label);
};