/* تم توليد هذا الملف تلقائياً من src/screens3.jsx — عدّل ملف المصدر ثم شغّل: npm run build */
const SmartPlanModal = function SmartPlanModal({
  exam,
  exams,
  onClose,
  onCreate
}) {
  const [form, setForm] = useState({
    examId: exam.id,
    startDate: Core.todayStr(),
    endDate: exam.date && exam.date > Core.todayStr() ? exam.date : Core.todayStr(new Date(Date.now() + 6 * 86400000)),
    dailyHours: '3',
    restDays: [5]
  });
  const upd = function (k, v) {
    setForm(function (f) {
      return Object.assign({}, f, {
        [k]: v
      });
    });
  };
  const toggleRest = function (d) {
    setForm(function (f) {
      const has = f.restDays.includes(d);
      return Object.assign({}, f, {
        restDays: has ? f.restDays.filter(function (x) {
          return x !== d;
        }) : f.restDays.concat([d]).sort()
      });
    });
  };
  const result = useMemo(function () {
    const examSel = exams.find(function (x) {
      return x.id === form.examId;
    });
    if (!examSel) return null;
    return Algo.weightedSchedule(examSel, form.startDate, form.endDate, parseFloat(form.dailyHours) || 0, form.restDays);
  }, [form, exams]);
  function create() {
    if (!result || !result.ok) return;
    const examSel = exams.find(function (x) {
      return x.id === form.examId;
    });
    onCreate({
      examId: form.examId,
      subject: examSel ? examSel.subject : '',
      startDate: form.startDate,
      endDate: form.endDate,
      dailyHours: parseFloat(form.dailyHours) || 1,
      schedule: result.schedule,
      generated: true
    });
  }
  return React.createElement(UI.Modal, {
    open: true,
    onClose: onClose,
    title: "\u0627\u0644\u0645\u0648\u0644\u062F \u0627\u0644\u0630\u0643\u064A \u0644\u0644\u062E\u0637\u0637",
    icon: "zap",
    width: 640
  }, React.createElement("p", {
    className: "modal-intro"
  }, "\u062E\u0648\u0627\u0631\u0632\u0645\u064A\u0629 \u0627\u0644\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0645\u0648\u0632\u0648\u0646: \u0623\u064A\u0627\u0645 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0623\u062B\u0642\u0644 (\u0627\u0633\u062A\u064A\u0639\u0627\u0628 \u0627\u0644\u0645\u0627\u062F\u0629 \u0627\u0644\u062C\u062F\u064A\u062F\u0629)\u060C \u0648\u0627\u0644\u0623\u064A\u0627\u0645 \u0627\u0644\u0623\u062E\u064A\u0631\u0629 \u0623\u062E\u0641 (\u0645\u0633\u0627\u062D\u0629 \u0645\u0631\u0627\u062C\u0639\u0629 \u0642\u0628\u0644 \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646) \u2014 \u0648\u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0627\u062A \u062A\u064F\u0642\u0633\u0645 \u0628\u0639\u062F\u0627\u0644\u0629 \u0628\u064A\u0646 \u0627\u0644\u0623\u064A\u0627\u0645 \u0628\u0637\u0631\u064A\u0642\u0629 \u0623\u0643\u0628\u0631 \u0627\u0644\u0628\u0642\u0627\u064A\u0627."), React.createElement("div", {
    className: "form-grid modal-form"
  }, React.createElement(UI.Field, {
    label: "\u0627\u0644\u0645\u0627\u062F\u0629",
    icon: "book",
    className: "span-2"
  }, React.createElement("select", {
    value: form.examId,
    onChange: function (e) {
      upd('examId', e.target.value);
    }
  }, exams.map(function (x) {
    return React.createElement("option", {
      key: x.id,
      value: x.id
    }, x.subject);
  }))), React.createElement(UI.Field, {
    label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0628\u062F\u0627\u064A\u0629",
    icon: "calendar"
  }, React.createElement("input", {
    type: "date",
    value: form.startDate,
    onChange: function (e) {
      upd('startDate', e.target.value);
    }
  })), React.createElement(UI.Field, {
    label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0646\u0647\u0627\u064A\u0629",
    icon: "calendar"
  }, React.createElement("input", {
    type: "date",
    value: form.endDate,
    onChange: function (e) {
      upd('endDate', e.target.value);
    }
  })), React.createElement(UI.Field, {
    label: "\u0633\u0627\u0639\u0627\u062A \u064A\u0648\u0645\u064A\u0627\u064B",
    icon: "clock"
  }, React.createElement("input", {
    type: "number",
    min: "0.5",
    max: "16",
    step: "0.5",
    value: form.dailyHours,
    onChange: function (e) {
      upd('dailyHours', e.target.value);
    }
  })), React.createElement(UI.Field, {
    label: "\u0623\u064A\u0627\u0645 \u0627\u0644\u0631\u0627\u062D\u0629 \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A\u0629",
    icon: "sliders",
    className: "span-2"
  }, React.createElement("div", {
    className: "restdays-row"
  }, ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(function (lbl, d) {
    const active = form.restDays.includes(d);
    return React.createElement("button", {
      key: lbl,
      type: "button",
      className: 'chip rest-chip' + (active ? ' active' : ''),
      onClick: function () {
        toggleRest(d);
      }
    }, lbl);
  })))), result && result.ok ? React.createElement("div", {
    className: "gen-result"
  }, React.createElement("div", {
    className: "gen-summary"
  }, React.createElement("span", null, React.createElement(UI.Icon, {
    name: "calendar",
    size: 13
  }), " ", result.summary.days, " \u064A\u0648\u0645 \u0645\u0630\u0627\u0643\u0631\u0629"), React.createElement("span", null, React.createElement(UI.Icon, {
    name: "sliders",
    size: 13
  }), " ", result.summary.restDays, " \u064A\u0648\u0645 \u0631\u0627\u062D\u0629"), React.createElement("span", null, React.createElement(UI.Icon, {
    name: "clock",
    size: 13
  }), " ", result.summary.totalHours, " \u0633\u0627\u0639\u0629 \u0625\u062C\u0645\u0627\u0644\u064A\u0629"), React.createElement("span", null, React.createElement(UI.Icon, {
    name: "layers",
    size: 13
  }), " ~", result.summary.slidesPerDay, " \u0633\u0644\u0627\u064A\u062F/\u064A\u0648\u0645")), React.createElement("div", {
    className: "gen-table-wrap"
  }, React.createElement("table", {
    className: "gen-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "\u0627\u0644\u064A\u0648\u0645"), React.createElement("th", null, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E"), React.createElement("th", null, "\u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0627\u062A"), React.createElement("th", null, "\u0627\u0644\u0634\u0627\u0628\u062A\u0631\u0627\u062A"), React.createElement("th", null, "\u0627\u0644\u062D\u0645\u0644"))), React.createElement("tbody", null, result.schedule.map(function (s) {
    return React.createElement("tr", {
      key: s.date,
      className: s.heavy ? 'heavy' : s.light ? 'light' : ''
    }, React.createElement("td", null, s.dayName), React.createElement("td", {
      dir: "ltr"
    }, s.date.slice(5)), React.createElement("td", null, React.createElement("strong", null, s.slides)), React.createElement("td", null, "\u0634\u0627\u0628\u062A\u0631 ", s.chapters), React.createElement("td", null, React.createElement("span", {
      className: 'sched-load' + (s.heavy ? ' heavy' : s.light ? ' light' : '')
    }, s.heavy ? 'ثقيل' : s.light ? 'خفيف' : 'متوازن')));
  }))))) : result ? React.createElement("p", {
    className: "field-error center"
  }, React.createElement(UI.Icon, {
    name: "alert",
    size: 13
  }), " ", result.error) : null, React.createElement("div", {
    className: "confirm-actions"
  }, React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    disabled: !result || !result.ok,
    onClick: create
  }, React.createElement(UI.Icon, {
    name: "check",
    size: 15
  }), " \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062E\u0637\u0629 \u0627\u0644\u0630\u0643\u064A\u0629"), React.createElement("button", {
    type: "button",
    className: "btn btn-ghost",
    onClick: onClose
  }, "\u0625\u0644\u063A\u0627\u0621")));
};
const NotesModal = function NotesModal({
  exam,
  onClose,
  onSave
}) {
  const [text, setText] = useState(exam.notes || '');
  return React.createElement(UI.Modal, {
    open: true,
    onClose: onClose,
    title: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0645\u0627\u062F\u0629",
    icon: "edit",
    width: 520
  }, React.createElement("p", {
    className: "modal-intro"
  }, "\u0645\u0644\u0627\u062D\u0638\u0627\u062A ", exam.subject, ": \u0646\u0642\u0627\u0637 \u0636\u0639\u0641\u060C \u0635\u0641\u062D\u0627\u062A \u0645\u062A\u0623\u062E\u0631\u0629\u060C \u0623\u062C\u0632\u0627\u0621 \u0643\u0631\u0631\u0647\u0627 \u0627\u0644\u0623\u0633\u062A\u0627\u0630 \u2014 \u062A\u0638\u0647\u0631 \u0641\u064A \u0627\u0644\u062C\u062F\u0648\u0644 \u0643\u0639\u0644\u0627\u0645\u0629 \u0630\u0643\u064A\u0629."), React.createElement("textarea", {
    className: "notes-textarea",
    dir: "auto",
    rows: "7",
    placeholder: "\u0627\u0643\u062A\u0628 \u0645\u0644\u0627\u062D\u0638\u0627\u062A\u0643 \u0647\u0646\u0627...",
    value: text,
    onChange: function (e) {
      setText(e.target.value);
    },
    maxLength: 2000
  }), React.createElement("div", {
    className: "notes-foot"
  }, React.createElement("span", {
    className: "muted"
  }, text.length, "/2000 \u062D\u0631\u0641"), React.createElement("div", {
    className: "confirm-actions"
  }, React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: function () {
      onSave(exam.id, text);
    }
  }, React.createElement(UI.Icon, {
    name: "check",
    size: 15
  }), " \u062D\u0641\u0638 \u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0629"), React.createElement("button", {
    type: "button",
    className: "btn btn-ghost",
    onClick: onClose
  }, "\u0625\u0644\u063A\u0627\u0621"))));
};
const CalendarTab = function CalendarTab({
  exams,
  plans,
  now,
  onToggleDay
}) {
  const [cursor, setCursor] = useState(function () {
    const t = new Date();
    return {
      y: t.getFullYear(),
      m: t.getMonth()
    };
  });
  const [selected, setSelected] = useState(Core.todayStr());
  const WEEK = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const y = cursor.y,
    m = cursor.m;
  const monthName = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][m];
  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = Core.todayStr();
  const events = useMemo(function () {
    const map = {};
    function add(date, ev) {
      if (!map[date]) map[date] = [];
      map[date].push(ev);
    }
    exams.forEach(function (e, i) {
      if (e.date && e.date.startsWith(y + '-' + String(m + 1).padStart(2, '0'))) {
        add(e.date, {
          type: 'exam',
          exam: e,
          color: Core.colorOf(i),
          label: 'امتحان: ' + e.subject
        });
      }
      Algo.reviewMilestones(e).forEach(function (ms) {
        if (ms.date.startsWith(y + '-' + String(m + 1).padStart(2, '0'))) {
          add(ms.date, {
            type: 'review',
            exam: e,
            color: '#f59e0b',
            label: ms.label + ' — ' + e.subject
          });
        }
      });
    });
    plans.forEach(function (p) {
      if (!p.startDate || !p.endDate) return;
      const s = new Date(p.startDate + 'T12:00:00');
      const en = new Date(p.endDate + 'T12:00:00');
      if (isNaN(s) || isNaN(en)) return;
      let guard = 0;
      const cur = new Date(s);
      while (cur <= en && guard < 120) {
        const key = Core.todayStr(cur);
        if (key.startsWith(y + '-' + String(m + 1).padStart(2, '0'))) {
          const entry = (p.schedule || []).find(function (x) {
            return x.date === key;
          });
          add(key, {
            type: 'plan',
            plan: p,
            color: '#0d9488',
            label: 'خطة: ' + p.subject,
            entry
          });
        }
        cur.setDate(cur.getDate() + 1);
        guard++;
      }
    });
    return map;
  }, [exams, plans, y, m]);
  function shift(delta) {
    setCursor(function (c) {
      const d = new Date(c.y, c.m + delta, 1);
      return {
        y: d.getFullYear(),
        m: d.getMonth()
      };
    });
  }
  const selEvents = events[selected] || [];
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return React.createElement("section", {
    className: "tab-content"
  }, React.createElement("div", {
    className: "card"
  }, React.createElement(UI.CardHeader, {
    icon: "calendar",
    color: "#0d9488",
    title: "\u062A\u0642\u0648\u064A\u0645 \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629 \u0648\u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A",
    sub: "\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A\u0643\u060C \u0645\u0631\u0627\u062C\u0639\u0627\u062A\u0643 \u0627\u0644\u0645\u062A\u0628\u0627\u0639\u062F\u0629 (7 \u06483 \u0648\u064A\u0648\u0645 \u0642\u0628\u0644 \u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646)\u060C \u0648\u0623\u064A\u0627\u0645 \u062E\u0637\u0637\u0643 \u2014 \u0643\u0644 \u0634\u064A\u0621 \u0641\u064A \u0645\u0643\u0627\u0646 \u0648\u0627\u062D\u062F."
  }, React.createElement("div", {
    className: "cal-nav no-print"
  }, React.createElement("button", {
    type: "button",
    className: "icon-btn teal",
    onClick: function () {
      shift(-1);
    },
    "aria-label": "\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0633\u0627\u0628\u0642"
  }, React.createElement(UI.Icon, {
    name: "chevronDown",
    size: 15,
    className: "rot90"
  })), React.createElement("strong", {
    className: "cal-title"
  }, monthName, " ", y), React.createElement("button", {
    type: "button",
    className: "icon-btn teal",
    onClick: function () {
      shift(1);
    },
    "aria-label": "\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u062A\u0627\u0644\u064A"
  }, React.createElement(UI.Icon, {
    name: "chevronDown",
    size: 15,
    className: "rot270"
  })), React.createElement("button", {
    type: "button",
    className: "btn btn-soft btn-sm",
    onClick: function () {
      const t = new Date();
      setCursor({
        y: t.getFullYear(),
        m: t.getMonth()
      });
      setSelected(Core.todayStr());
    }
  }, "\u0627\u0644\u064A\u0648\u0645"))), React.createElement("div", {
    className: "cal-legend no-print"
  }, React.createElement("span", null, React.createElement("i", {
    className: "lg-dot",
    style: {
      background: '#e11d48'
    }
  }), " \u0627\u0645\u062A\u062D\u0627\u0646"), React.createElement("span", null, React.createElement("i", {
    className: "lg-dot",
    style: {
      background: '#f59e0b'
    }
  }), " \u0645\u0631\u0627\u062C\u0639\u0629 \u0645\u062A\u0628\u0627\u0639\u062F\u0629"), React.createElement("span", null, React.createElement("i", {
    className: "lg-dot",
    style: {
      background: '#0d9488'
    }
  }), " \u064A\u0648\u0645 \u062E\u0637\u0629 \u0645\u0630\u0627\u0643\u0631\u0629"), React.createElement("span", null, React.createElement("i", {
    className: "lg-dot lg-today"
  }), " \u0627\u0644\u064A\u0648\u0645")), React.createElement("div", {
    className: "cal-grid",
    role: "grid"
  }, WEEK.map(function (w) {
    return React.createElement("div", {
      key: w,
      className: "cal-weekday"
    }, w);
  }), cells.map(function (d, i) {
    if (d === null) return React.createElement("div", {
      key: 'b' + i,
      className: "cal-cell blank"
    });
    const key = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    const evs = events[key] || [];
    const hasExam = evs.some(function (e) {
      return e.type === 'exam';
    });
    const hasReview = evs.some(function (e) {
      return e.type === 'review';
    });
    const hasPlan = evs.some(function (e) {
      return e.type === 'plan';
    });
    return React.createElement("button", {
      key: key,
      type: "button",
      className: 'cal-cell' + (key === today ? ' today' : '') + (key === selected ? ' selected' : '') + (hasExam ? ' has-exam' : ''),
      onClick: function () {
        setSelected(key);
      }
    }, React.createElement("span", {
      className: "cal-day"
    }, d), React.createElement("span", {
      className: "cal-dots"
    }, hasPlan ? React.createElement("i", {
      className: "lg-dot",
      style: {
        background: '#0d9488'
      }
    }) : null, hasReview ? React.createElement("i", {
      className: "lg-dot",
      style: {
        background: '#f59e0b'
      }
    }) : null, hasExam ? React.createElement("i", {
      className: "lg-dot",
      style: {
        background: '#e11d48'
      }
    }) : null));
  })), React.createElement("div", {
    className: "cal-detail"
  }, React.createElement("h4", null, React.createElement(UI.Icon, {
    name: "calendar",
    size: 14
  }), " \u0623\u062D\u062F\u0627\u062B ", Core.fmtDate(selected), " ", selected === today ? '(اليوم)' : ''), selEvents.length === 0 ? React.createElement("p", {
    className: "muted cal-empty"
  }, "\u0644\u0627 \u0623\u062D\u062F\u0627\u062B \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645 \u2014 \u064A\u0648\u0645 \u0647\u0627\u062F\u0626\u060C \u0627\u0633\u062A\u063A\u0644\u0647 \u0641\u064A \u0627\u0644\u062A\u0642\u062F\u064A\u0645!") : React.createElement("div", {
    className: "cal-events"
  }, selEvents.map(function (ev, i) {
    return React.createElement("div", {
      key: i,
      className: "cal-event",
      style: {
        borderInlineStartColor: ev.color
      }
    }, React.createElement("span", {
      className: "cal-ev-icon",
      style: {
        color: ev.color
      }
    }, React.createElement(UI.Icon, {
      name: ev.type === 'exam' ? 'zap' : ev.type === 'review' ? 'refresh' : 'book',
      size: 14
    })), React.createElement("span", {
      className: "cal-ev-label"
    }, ev.label), ev.type === 'exam' ? React.createElement(UI.Badge, {
      color: ev.color
    }, ev.exam.time) : null, ev.type === 'plan' && ev.entry ? React.createElement("span", {
      className: "cal-ev-extra"
    }, ev.entry.slides, " \u0633\u0644\u0627\u064A\u062F \u2022 \u0634\u0627\u0628\u062A\u0631 ", ev.entry.chapters, React.createElement("label", {
      className: "cal-done"
    }, React.createElement("input", {
      type: "checkbox",
      checked: Boolean(ev.entry.done),
      onChange: function () {
        onToggleDay(ev.plan.id, ev.entry.date);
      }
    }), "\u062A\u0645")) : null);
  })))));
};
const PomodoroWidget = function PomodoroWidget({
  pomo,
  settings,
  plans,
  now,
  onStart,
  onPause,
  onSkip,
  onClose,
  onLinkPlan
}) {
  const totalMs = Algo.pomoMinutes(pomo.mode, settings) * 60000;
  const remain = pomo.running ? Math.max(0, pomo.endsAt - now) : pomo.remainMs;
  const pct = Core.clamp(Math.round((1 - remain / totalMs) * 100), 0, 100);
  const mm = Math.floor(remain / 60000);
  const ss = Math.floor(remain % 60000 / 1000);
  const isFocus = pomo.mode === 'focus';
  const modeColor = isFocus ? '#0d9488' : pomo.mode === 'brk' ? '#f59e0b' : '#06b6d4';
  const cycleInSet = pomo.cycles % 4 + (isFocus ? 1 : 0);
  return React.createElement("div", {
    className: 'pomo-widget glass' + (pomo.running ? ' running' : ''),
    style: {
      '--accent': modeColor
    }
  }, React.createElement("div", {
    className: "pomo-head"
  }, React.createElement("span", {
    className: "pomo-title"
  }, React.createElement(UI.Icon, {
    name: "hourglass",
    size: 15
  }), " ", Algo.pomoLabel(pomo.mode)), React.createElement("div", {
    className: "action-group"
  }, React.createElement("button", {
    type: "button",
    className: "icon-btn red",
    onClick: onClose,
    "aria-label": "\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0628\u0648\u0645\u0648\u062F\u0648\u0631\u0648"
  }, React.createElement(UI.Icon, {
    name: "x",
    size: 13
  })))), React.createElement("div", {
    className: "pomo-body"
  }, React.createElement(UI.Ring, {
    pct: pct,
    size: 92,
    stroke: 8,
    color: modeColor
  }, React.createElement("strong", {
    className: "pomo-time",
    dir: "ltr"
  }, String(mm).padStart(2, '0'), ":", String(ss).padStart(2, '0'))), React.createElement("div", {
    className: "pomo-side"
  }, React.createElement("div", {
    className: "pomo-dots",
    title: 'الجلسة ' + cycleInSet + ' من 4'
  }, [1, 2, 3, 4].map(function (n) {
    return React.createElement("i", {
      key: n,
      className: 'pomo-dot' + (n <= cycleInSet ? ' on' : '')
    });
  })), React.createElement("select", {
    className: "pomo-plan-select",
    value: pomo.planId || '',
    onChange: function (e) {
      onLinkPlan(e.target.value);
    },
    "aria-label": "\u0631\u0628\u0637 \u0628\u0645\u0627\u062F\u0629"
  }, React.createElement("option", {
    value: ""
  }, "\u0628\u062F\u0648\u0646 \u0631\u0628\u0637 \u0628\u0645\u0627\u062F\u0629"), plans.filter(function (p) {
    return !p.isCompleted;
  }).map(function (p) {
    return React.createElement("option", {
      key: p.id,
      value: p.id
    }, p.subject);
  })), React.createElement("div", {
    className: "pomo-actions"
  }, React.createElement("button", {
    type: "button",
    className: 'btn btn-sm ' + (pomo.running ? 'btn-warning' : 'btn-primary'),
    onClick: pomo.running ? onPause : onStart
  }, React.createElement(UI.Icon, {
    name: pomo.running ? 'pause' : 'play',
    size: 13
  }), " ", pomo.running ? 'إيقاف مؤقت' : 'ابدأ'), React.createElement("button", {
    type: "button",
    className: "btn btn-sm btn-soft",
    onClick: onSkip,
    title: "\u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u0645\u0631\u062D\u0644\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0648\u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0644\u0644\u062A\u0627\u0644\u064A\u0629"
  }, React.createElement(UI.Icon, {
    name: "refresh",
    size: 13
  }), " \u062A\u062E\u0637\u064A")))), React.createElement("p", {
    className: "pomo-hint"
  }, isFocus ? 'كل جلسة تركيز مكتملة تُسجل تلقائياً في إحصائيات اليوم' + (pomo.planId ? ' وفي وقت الخطة المرتبطة.' : '.') : 'استرح بعيداً عن الشاشة — عقلك يستحق فسحة!'));
};
const Screens3 = {
  CalendarTab,
  SmartPlanModal,
  NotesModal,
  PomodoroWidget
};