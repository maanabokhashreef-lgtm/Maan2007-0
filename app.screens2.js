/* تم توليد هذا الملف تلقائياً من src/screens2.jsx — عدّل ملف المصدر ثم شغّل: npm run build */
const PlanFormModal = function PlanFormModal({
  plan,
  exams,
  onClose,
  onSave
}) {
  const [form, setForm] = useState({
    examId: plan.examId || '',
    startDate: plan.startDate,
    endDate: plan.endDate,
    dailyHours: String(plan.dailyHours)
  });
  const [error, setError] = useState('');
  const upd = function (k, v) {
    setForm(function (f) {
      return Object.assign({}, f, {
        [k]: v
      });
    });
  };
  function submit(e) {
    e.preventDefault();
    if (!form.examId) return setError('اختر المادة المرتبطة بالخطة');
    if (!form.startDate) return setError('تاريخ البداية مطلوب');
    if (!form.endDate) return setError('تاريخ النهاية مطلوب');
    if (form.endDate < form.startDate) return setError('تاريخ النهاية يجب أن يكون بعد تاريخ البداية أو مساوياً له');
    const h = parseFloat(form.dailyHours);
    if (!(h > 0) || h > 16) return setError('ساعات الدراسة اليومية يجب أن تكون بين 0.5 و 16');
    onSave(plan.id, {
      examId: form.examId,
      subject: (exams.find(function (x) {
        return x.id === form.examId;
      }) || {}).subject || plan.subject,
      startDate: form.startDate,
      endDate: form.endDate,
      dailyHours: h
    });
  }
  return React.createElement(UI.Modal, {
    open: true,
    onClose: onClose,
    title: "\u062A\u0639\u062F\u064A\u0644 \u062E\u0637\u0629 \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629",
    icon: "edit"
  }, React.createElement("form", {
    onSubmit: submit,
    className: "form-grid modal-form",
    noValidate: true
  }, React.createElement(UI.Field, {
    label: "\u0627\u0644\u0645\u0627\u062F\u0629 \u0627\u0644\u0645\u0631\u062A\u0628\u0637\u0629",
    icon: "book"
  }, React.createElement("select", {
    value: form.examId,
    onChange: function (e) {
      upd('examId', e.target.value);
    }
  }, React.createElement("option", {
    value: "",
    disabled: true
  }, "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0627\u062F\u0629..."), exams.map(function (x) {
    return React.createElement("option", {
      key: x.id,
      value: x.id
    }, x.subject);
  }))), React.createElement("div", {
    className: "field-row"
  }, React.createElement(UI.Field, {
    label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0628\u062F\u0627\u064A\u0629",
    icon: "calendar",
    className: "grow"
  }, React.createElement("input", {
    type: "date",
    value: form.startDate,
    onChange: function (e) {
      upd('startDate', e.target.value);
    }
  })), React.createElement(UI.Field, {
    label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0646\u0647\u0627\u064A\u0629",
    icon: "calendar",
    className: "grow"
  }, React.createElement("input", {
    type: "date",
    value: form.endDate,
    onChange: function (e) {
      upd('endDate', e.target.value);
    }
  }))), React.createElement(UI.Field, {
    label: "\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u062F\u0631\u0627\u0633\u0629 \u064A\u0648\u0645\u064A\u0627\u064B",
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
  })), error ? React.createElement("p", {
    className: "field-error center"
  }, React.createElement(UI.Icon, {
    name: "alert",
    size: 13
  }), " ", error) : null, React.createElement("div", {
    className: "confirm-actions"
  }, React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, React.createElement(UI.Icon, {
    name: "check",
    size: 15
  }), " \u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644"), React.createElement("button", {
    type: "button",
    className: "btn btn-ghost",
    onClick: onClose
  }, "\u0625\u0644\u063A\u0627\u0621"))));
};
const PlanCard = function PlanCard({
  p,
  idx,
  exams,
  now,
  today,
  onComplete,
  onTimerToggle,
  onTimerReset,
  onToggleDay,
  onEdit,
  onDelete
}) {
  const [schedOpen, setSchedOpen] = useState(false);
  const color = Core.colorOf(idx % Core.COLORS.length);
  const elapsed = Core.planElapsed(p, now);
  const pct = Core.planPct(p, now);
  const targetH = Core.planTargetHours(p);
  const days = Core.planDays(p);
  const dailySlides = Core.planDailySlides(p, exams);
  const exam = exams.find(function (x) {
    return x.id === p.examId;
  });
  const sched = p.schedule || [];
  const schedDone = sched.filter(function (s) {
    return s.done;
  }).length;
  const todayEntry = sched.find(function (s) {
    return s.date === today;
  });
  return React.createElement("div", {
    className: 'plan-card glass' + (p.isCompleted ? ' done' : '') + (p.isRunning ? ' running' : ''),
    style: {
      animationDelay: idx * 50 + 'ms'
    }
  }, React.createElement("div", {
    className: "plan-head"
  }, React.createElement("span", {
    className: "dot big",
    style: {
      background: color
    }
  }), React.createElement("strong", {
    className: "plan-subject"
  }, p.subject), p.generated ? React.createElement(UI.Badge, {
    color: "#0d9488"
  }, React.createElement(UI.Icon, {
    name: "zap",
    size: 12
  }), " \u0630\u0643\u064A\u0629") : null, p.isRunning ? React.createElement(UI.Badge, {
    color: "#f59e0b"
  }, React.createElement("span", {
    className: "pulse-dot"
  }), " \u064A\u0639\u0645\u0644") : null, p.isCompleted ? React.createElement(UI.Badge, {
    color: "#10b981"
  }, React.createElement(UI.Icon, {
    name: "checkCircle",
    size: 12
  }), " \u0645\u0643\u062A\u0645\u0644\u0629") : null), React.createElement("div", {
    className: "plan-meta"
  }, React.createElement("span", null, React.createElement(UI.Icon, {
    name: "calendar",
    size: 13
  }), " ", Core.fmtDate(p.startDate), " \u2190 ", Core.fmtDate(p.endDate)), React.createElement("span", null, React.createElement(UI.Icon, {
    name: "clock",
    size: 13
  }), " ", days, " \u064A\u0648\u0645 \u2022 ", p.dailyHours, " \u0633\u0627\u0639\u0629/\u064A\u0648\u0645"), exam ? React.createElement("span", null, React.createElement(UI.Icon, {
    name: "zap",
    size: 13
  }), " \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646: ", Core.fmtDate(exam.date), " - ", exam.time) : null, dailySlides ? React.createElement("span", null, React.createElement(UI.Icon, {
    name: "layers",
    size: 13
  }), " \u0647\u062F\u0641 \u064A\u0648\u0645\u064A: ", dailySlides, " \u0633\u0644\u0627\u064A\u062F") : null, todayEntry && !todayEntry.done ? React.createElement("span", {
    className: "today-entry"
  }, React.createElement(UI.Icon, {
    name: "target",
    size: 13
  }), " \u0627\u0644\u064A\u0648\u0645: ", todayEntry.slides, " \u0633\u0644\u0627\u064A\u062F (\u0634\u0627\u0628\u062A\u0631 ", todayEntry.chapters, ")") : null), React.createElement("div", {
    className: "plan-progress"
  }, React.createElement("div", {
    className: "plan-progress-text"
  }, React.createElement("span", null, Core.fmtDur(elapsed), " \u0645\u0646 ", targetH.toFixed(1), " \u0633\u0627\u0639\u0629"), React.createElement("strong", null, pct, "%")), React.createElement(UI.ProgressBar, {
    pct: pct,
    color: color,
    height: 9
  })), React.createElement("div", {
    className: "plan-timer"
  }, React.createElement("span", {
    className: 'timer-display' + (p.isRunning ? ' live' : ''),
    dir: "ltr"
  }, Core.fmtHMS(elapsed)), React.createElement("div", {
    className: "action-group"
  }, React.createElement("button", {
    type: "button",
    className: 'btn btn-sm ' + (p.isRunning ? 'btn-warning' : 'btn-success'),
    onClick: function () {
      onTimerToggle(p);
    }
  }, React.createElement(UI.Icon, {
    name: p.isRunning ? 'pause' : 'play',
    size: 13
  }), " ", p.isRunning ? 'إيقاف' : 'البدء'), React.createElement("button", {
    type: "button",
    className: "btn btn-sm btn-soft",
    title: "\u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0645\u0624\u0642\u062A",
    onClick: function () {
      onTimerReset(p);
    }
  }, React.createElement(UI.Icon, {
    name: "rotateCcw",
    size: 13
  })))), sched.length ? React.createElement("div", {
    className: "plan-schedule no-print"
  }, React.createElement("button", {
    type: "button",
    className: 'sched-toggle' + (schedOpen ? ' open' : ''),
    onClick: function () {
      setSchedOpen(!schedOpen);
    }
  }, React.createElement(UI.Icon, {
    name: "layers",
    size: 14
  }), React.createElement("span", null, "\u0627\u0644\u062C\u062F\u0648\u0644 \u0627\u0644\u0630\u0643\u064A \u2014 ", schedDone, "/", sched.length, " \u064A\u0648\u0645 \u0645\u0643\u062A\u0645\u0644"), React.createElement("span", {
    className: "sched-arrow"
  }, React.createElement(UI.Icon, {
    name: "chevronDown",
    size: 14
  }))), schedOpen ? React.createElement("div", {
    className: "sched-list"
  }, sched.map(function (s) {
    return React.createElement("label", {
      key: s.date,
      className: 'sched-row' + (s.done ? ' done' : '') + (s.date === today ? ' today' : '')
    }, React.createElement("input", {
      type: "checkbox",
      checked: Boolean(s.done),
      onChange: function () {
        onToggleDay(p.id, s.date);
      }
    }), React.createElement("span", {
      className: "sched-date"
    }, s.dayName, " ", s.date.slice(5)), React.createElement("span", {
      className: "sched-target"
    }, s.slides, " \u0633\u0644\u0627\u064A\u062F \u2022 \u0634\u0627\u0628\u062A\u0631 ", s.chapters), React.createElement("span", {
      className: 'sched-load' + (s.heavy ? ' heavy' : s.light ? ' light' : '')
    }, s.heavy ? 'ثقيل' : s.light ? 'خفيف' : 'متوازن'));
  })) : null) : null, React.createElement("div", {
    className: "plan-actions"
  }, React.createElement("button", {
    type: "button",
    className: 'btn btn-sm ' + (p.isCompleted ? 'btn-soft' : 'btn-success-soft'),
    onClick: function () {
      onComplete(p);
    }
  }, React.createElement(UI.Icon, {
    name: p.isCompleted ? 'refresh' : 'checkCircle',
    size: 13
  }), " ", p.isCompleted ? 'استئناف المراجعة' : 'تم الإنهاء'), React.createElement("button", {
    type: "button",
    className: "icon-btn amber",
    title: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062E\u0637\u0629",
    onClick: function () {
      onEdit(p);
    }
  }, React.createElement(UI.Icon, {
    name: "edit",
    size: 14
  })), React.createElement("button", {
    type: "button",
    className: "icon-btn red",
    title: "\u062D\u0630\u0641 \u0627\u0644\u062E\u0637\u0629",
    onClick: function () {
      onDelete(p);
    }
  }, React.createElement(UI.Icon, {
    name: "trash",
    size: 14
  }))));
};
const PlansTab = function PlansTab({
  exams,
  plans,
  now,
  onAdd,
  onUpdate,
  onDelete,
  onComplete,
  onTimerToggle,
  onTimerReset,
  onToggleDay,
  onGenerate
}) {
  const [form, setForm] = useState({
    examId: '',
    startDate: '',
    endDate: '',
    dailyHours: ''
  });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const today = Core.todayStr();
  const upd = function (k, v) {
    setForm(function (f) {
      const next = Object.assign({}, f, {
        [k]: v
      });
      if (k === 'examId' && v) {
        const exam = exams.find(function (x) {
          return x.id === v;
        });
        if (exam) {
          if (!f.startDate) next.startDate = today;
          if (exam.date && (!f.endDate || f.endDate < exam.date)) next.endDate = exam.date;
        }
      }
      return next;
    });
  };
  const selectedExam = exams.find(function (x) {
    return x.id === form.examId;
  });
  const previewDays = form.startDate && form.endDate && form.endDate >= form.startDate ? Core.planDays({
    startDate: form.startDate,
    endDate: form.endDate
  }) : null;
  const previewSlides = selectedExam && previewDays && selectedExam.slides ? Math.ceil(selectedExam.slides / previewDays) : null;
  function submit(e) {
    e.preventDefault();
    if (!form.examId) return setError('اختر المادة من جدول الامتحانات');
    if (!form.startDate) return setError('تاريخ البداية مطلوب');
    if (!form.endDate) return setError('تاريخ النهاية مطلوب');
    if (form.endDate < form.startDate) return setError('تاريخ النهاية يجب أن يكون بعد تاريخ البداية أو مساوياً له');
    const h = parseFloat(form.dailyHours);
    if (!(h > 0) || h > 16) return setError('ساعات الدراسة اليومية يجب أن تكون بين 0.5 و 16');
    setError('');
    const exam = exams.find(function (x) {
      return x.id === form.examId;
    });
    onAdd({
      examId: form.examId,
      subject: exam ? exam.subject : '',
      startDate: form.startDate,
      endDate: form.endDate,
      dailyHours: h
    });
    setForm({
      examId: '',
      startDate: '',
      endDate: '',
      dailyHours: ''
    });
  }
  const runningCount = plans.filter(function (p) {
    return p.isRunning;
  }).length;
  let shown = plans.slice();
  if (filter === 'active') shown = shown.filter(function (p) {
    return !p.isCompleted;
  });
  if (filter === 'done') shown = shown.filter(function (p) {
    return p.isCompleted;
  });
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    shown = shown.filter(function (p) {
      return p.subject.toLowerCase().includes(q);
    });
  }
  shown.sort(function (a, b) {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return (a.startDate || '').localeCompare(b.startDate || '');
  });
  const chips = [{
    id: 'all',
    label: 'الكل',
    n: plans.length
  }, {
    id: 'active',
    label: 'قيد المذاكرة',
    n: plans.length - plans.filter(function (p) {
      return p.isCompleted;
    }).length
  }, {
    id: 'done',
    label: 'مكتملة',
    n: plans.filter(function (p) {
      return p.isCompleted;
    }).length
  }];
  return React.createElement("section", {
    className: "tab-content"
  }, React.createElement("div", {
    className: "card"
  }, React.createElement(UI.CardHeader, {
    icon: "target",
    color: "#10b981",
    title: "\u0625\u0646\u0634\u0627\u0621 \u062E\u0637\u0629 \u0645\u0630\u0627\u0643\u0631\u0629",
    sub: "\u0627\u0631\u0628\u0637 \u062E\u0637\u062A\u0643 \u0628\u0645\u0627\u062F\u0629 \u0648\u062D\u062F\u062F \u0627\u0644\u0641\u062A\u0631\u0629 \u2014 \u0623\u0648 \u062F\u0639 \u0627\u0644\u0645\u0648\u0644\u062F \u0627\u0644\u0630\u0643\u064A \u064A\u0648\u0632\u0639 \u0633\u0644\u0627\u064A\u062F\u0627\u062A\u0643 \u0639\u0644\u0649 \u0627\u0644\u0623\u064A\u0627\u0645 \u0628\u0623\u0648\u0632\u0627\u0646 \u0645\u062F\u0631\u0648\u0633\u0629."
  }, runningCount > 0 ? React.createElement(UI.Badge, {
    color: "#f59e0b"
  }, React.createElement("span", {
    className: "pulse-dot"
  }), " ", runningCount, " \u0645\u0624\u0642\u062A \u064A\u0639\u0645\u0644 \u0627\u0644\u0622\u0646") : null), React.createElement("form", {
    className: "form-grid",
    onSubmit: submit,
    noValidate: true
  }, React.createElement(UI.Field, {
    label: "\u0627\u0644\u0645\u0627\u062F\u0629 (\u0645\u0646 \u062C\u062F\u0648\u0644 \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A)",
    icon: "book",
    className: "span-2"
  }, React.createElement("select", {
    value: form.examId,
    onChange: function (e) {
      upd('examId', e.target.value);
    }
  }, React.createElement("option", {
    value: "",
    disabled: true
  }, "\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0627\u062F\u0629..."), exams.length === 0 ? React.createElement("option", {
    value: "",
    disabled: true
  }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0648\u0627\u062F \u2014 \u0623\u0636\u0641 \u0645\u0627\u062F\u0629 \u0623\u0648\u0644\u0627\u064B \u0641\u064A \u062A\u0628\u0648\u064A\u0628 \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A") : null, exams.map(function (x) {
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
    label: "\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629 \u064A\u0648\u0645\u064A\u0627\u064B",
    icon: "clock"
  }, React.createElement("input", {
    type: "number",
    min: "0.5",
    max: "16",
    step: "0.5",
    placeholder: "\u0645\u062B\u0627\u0644: 3",
    value: form.dailyHours,
    onChange: function (e) {
      upd('dailyHours', e.target.value);
    }
  })), React.createElement("div", {
    className: "field submit-field"
  }, React.createElement("button", {
    type: "submit",
    className: "btn btn-success btn-block",
    disabled: exams.length === 0
  }, React.createElement(UI.Icon, {
    name: "plus",
    size: 15
  }), " \u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u062E\u0637\u0629"))), previewDays && selectedExam ? React.createElement("p", {
    className: "form-hint"
  }, React.createElement(UI.Icon, {
    name: "info",
    size: 13
  }), " \u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u062E\u0637\u0629: ", React.createElement("strong", null, previewDays), " \u064A\u0648\u0645 \xD7 ", React.createElement("strong", null, form.dailyHours || '—'), " \u0633\u0627\u0639\u0629/\u064A\u0648\u0645 = ", React.createElement("strong", null, previewDays && form.dailyHours ? (previewDays * parseFloat(form.dailyHours || 0)).toFixed(1) : '—'), " \u0633\u0627\u0639\u0629 \u0625\u062C\u0645\u0627\u0644\u064A\u0629", previewSlides ? React.createElement(React.Fragment, null, " \u2022 \u0647\u062F\u0641 \u064A\u0648\u0645\u064A: ", React.createElement("strong", null, previewSlides), " \u0633\u0644\u0627\u064A\u062F") : null, exams.length ? React.createElement(React.Fragment, null, " \u2014 \u0623\u0648 \u0627\u0633\u062A\u062E\u062F\u0645 ", React.createElement("button", {
    type: "button",
    className: "link-btn",
    onClick: function () {
      onGenerate(selectedExam);
    }
  }, React.createElement(UI.Icon, {
    name: "zap",
    size: 12
  }), " \u0627\u0644\u0645\u0648\u0644\u062F \u0627\u0644\u0630\u0643\u064A"), " \u0644\u062A\u0648\u0632\u064A\u0639 \u0645\u062F\u0631\u0648\u0633") : null) : null, error ? React.createElement("p", {
    className: "field-error"
  }, React.createElement(UI.Icon, {
    name: "alert",
    size: 13
  }), " ", error) : null), React.createElement("div", {
    className: "card"
  }, React.createElement(UI.CardHeader, {
    icon: "hourglass",
    color: "#0d9488",
    title: "\u062E\u0637\u0637 \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629",
    sub: "\u0634\u063A\u0651\u0644 \u0627\u0644\u0645\u0624\u0642\u062A \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629\u060C \u0648\u0639\u0644\u0651\u0645 \u0623\u064A\u0627\u0645 \u0627\u0644\u062C\u062F\u0648\u0644 \u0627\u0644\u0630\u0643\u064A \u0639\u0646\u062F \u0625\u0646\u0647\u0627\u0626\u0647\u0627."
  }, React.createElement("div", {
    className: "card-tools"
  }, React.createElement(UI.SearchBox, {
    value: search,
    onChange: setSearch,
    placeholder: "\u0627\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u062E\u0637\u0637..."
  }), exams.length ? React.createElement("button", {
    type: "button",
    className: "btn btn-primary btn-sm",
    onClick: function () {
      onGenerate(exams[0]);
    }
  }, React.createElement(UI.Icon, {
    name: "zap",
    size: 13
  }), " \u062A\u0648\u0644\u064A\u062F \u062E\u0637\u0629 \u0630\u0643\u064A\u0629") : null)), React.createElement("div", {
    className: "chips-row"
  }, chips.map(function (c) {
    return React.createElement("button", {
      key: c.id,
      type: "button",
      className: 'chip' + (filter === c.id ? ' active' : ''),
      onClick: function () {
        setFilter(c.id);
      }
    }, c.label, " ", React.createElement("span", {
      className: "chip-n"
    }, c.n));
  })), plans.length === 0 ? React.createElement(UI.EmptyState, {
    icon: "target",
    title: "\u0644\u0627 \u062A\u0648\u062C\u062F \u062E\u0637\u0637 \u0628\u0639\u062F",
    hint: exams.length ? 'أنشئ خطتك الأولى من النموذج أعلاه، أو ولّد خطة ذكية بضغطة واحدة.' : 'أضف مادة إلى جدول الامتحانات أولاً، ثم أنشئ خطة مذاكرة مرتبطة بها.'
  }) : shown.length === 0 ? React.createElement(UI.EmptyState, {
    icon: "search",
    title: "\u0644\u0627 \u0646\u062A\u0627\u0626\u062C \u0645\u0637\u0627\u0628\u0642\u0629",
    hint: "\u062C\u0631\u0651\u0628 \u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0628\u062D\u062B \u0623\u0648 \u0627\u0644\u0641\u0644\u062A\u0631."
  }) : React.createElement("div", {
    className: "plans-grid"
  }, shown.map(function (p, idx) {
    return React.createElement(PlanCard, {
      key: p.id,
      p: p,
      idx: idx,
      exams: exams,
      now: now,
      today: today,
      onComplete: onComplete,
      onTimerToggle: onTimerToggle,
      onTimerReset: onTimerReset,
      onToggleDay: onToggleDay,
      onEdit: function (x) {
        setEditing(x);
      },
      onDelete: onDelete
    });
  }))), editing ? React.createElement(PlanFormModal, {
    plan: editing,
    exams: exams,
    onClose: function () {
      setEditing(null);
    },
    onSave: onUpdate
  }) : null);
};
const StatsTab = function StatsTab({
  exams,
  plans,
  stats,
  settings,
  now,
  pomoSessions
}) {
  const totalStudy = Core.totalStudySeconds(plans, now);
  const completed = plans.filter(function (p) {
    return p.isCompleted;
  }).length;
  const completionPct = plans.length ? Math.round(completed / plans.length * 100) : 0;
  const totalSlides = exams.reduce(function (a, e) {
    return a + (parseInt(e.slides, 10) || 0);
  }, 0);
  const week = useMemo(function () {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = Core.todayStr(d);
      out.push({
        key,
        label: Core.dayShort(key),
        sec: stats[key] || 0
      });
    }
    return out;
  }, [stats]);
  const maxSec = Math.max.apply(null, week.map(function (w) {
    return w.sec;
  }).concat([1]));
  const streak = Core.streakInfo(stats, settings.dailyGoalMin);
  const readiness = exams.map(function (e, i) {
    return Object.assign({}, e, {
      _i: i,
      _r: Core.examReadiness(e, plans, now),
      _g: Algo.readinessGrade(e, plans, now, streak.todayPct)
    });
  });
  return React.createElement("section", {
    className: "tab-content"
  }, React.createElement("div", {
    className: "hero-stats"
  }, React.createElement(UI.StatCard, {
    icon: "book",
    label: "\u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u0645\u0633\u062C\u0644\u0629",
    value: exams.length,
    color: "#0d9488",
    delay: 0
  }), React.createElement(UI.StatCard, {
    icon: "layers",
    label: "\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0627\u062A",
    value: totalSlides,
    color: "#06b6d4",
    delay: 60
  }), React.createElement(UI.StatCard, {
    icon: "clock",
    label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629",
    value: totalStudy / 3600,
    decimals: 1,
    color: "#10b981",
    delay: 120
  }), React.createElement(UI.StatCard, {
    icon: "checkCircle",
    label: "\u062E\u0637\u0637 \u0645\u0643\u062A\u0645\u0644\u0629",
    value: completed + ' / ' + plans.length,
    sub: completionPct + '% إنجاز',
    color: "#f59e0b",
    delay: 180
  })), React.createElement("div", {
    className: "stats-grid"
  }, React.createElement("div", {
    className: "card"
  }, React.createElement(UI.CardHeader, {
    icon: "chart",
    color: "#0d9488",
    title: "\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629 \u2014 \u0622\u062E\u0631 7 \u0623\u064A\u0627\u0645",
    sub: 'السلسلة الحالية: ' + streak.current + ' يوم • أفضل سلسلة: ' + streak.best + ' يوم • جلسات بومودورو: ' + (pomoSessions || 0)
  }), React.createElement("div", {
    className: "barchart",
    role: "img",
    "aria-label": "\u0631\u0633\u0645 \u0628\u064A\u0627\u0646\u064A \u0644\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629 \u0622\u062E\u0631 7 \u0623\u064A\u0627\u0645"
  }, week.map(function (w) {
    const pctH = Math.max(4, Math.round(w.sec / maxSec * 100));
    return React.createElement("div", {
      className: "bar-col",
      key: w.key,
      title: w.label + ': ' + Core.fmtDur(w.sec)
    }, React.createElement("span", {
      className: "bar-value"
    }, w.sec > 0 ? Core.fmtDur(w.sec) : ''), React.createElement("div", {
      className: "bar",
      style: {
        height: pctH + '%'
      }
    }), React.createElement("span", {
      className: "bar-label"
    }, w.label));
  })), week.every(function (w) {
    return w.sec === 0;
  }) ? React.createElement("p", {
    className: "form-hint"
  }, React.createElement(UI.Icon, {
    name: "info",
    size: 13
  }), " \u0634\u063A\u0651\u0644 \u0645\u0624\u0642\u062A \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629 \u0623\u0648 \u0627\u0644\u0628\u0648\u0645\u0648\u062F\u0648\u0631\u0648 \u0644\u064A\u0628\u062F\u0623 \u0633\u062C\u0644 \u0627\u0644\u0623\u064A\u0627\u0645 \u0628\u0627\u0644\u0627\u0645\u062A\u0644\u0627\u0621.") : null), React.createElement("div", {
    className: "card center-col"
  }, React.createElement(UI.CardHeader, {
    icon: "target",
    color: "#10b981",
    title: "\u0646\u0633\u0628\u0629 \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062E\u0637\u0637",
    sub: "\u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u062E\u0637\u0637 \u0627\u0644\u0645\u0643\u062A\u0645\u0644\u0629 \u0628\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A\u0629"
  }), React.createElement(UI.Ring, {
    pct: completionPct,
    size: 150,
    stroke: 13,
    color: "#10b981",
    className: "big-ring"
  }, React.createElement("div", {
    className: "ring-big"
  }, React.createElement("strong", null, completionPct, "%"), React.createElement("span", null, completed, " \u0645\u0646 ", plans.length))))), React.createElement("div", {
    className: "card"
  }, React.createElement(UI.CardHeader, {
    icon: "zap",
    color: "#f59e0b",
    title: "\u0627\u0644\u062C\u0627\u0647\u0632\u064A\u0629 \u0627\u0644\u0630\u0643\u064A\u0629 \u0644\u0643\u0644 \u0645\u0627\u062F\u0629",
    sub: "\u0646\u062A\u064A\u062C\u0629 \u0645\u0631\u0643\u0628\u0629: \u062A\u063A\u0637\u064A\u0629 \u0627\u0644\u0648\u0642\u062A 65% + \u0623\u064A\u0627\u0645 \u0627\u0644\u062C\u062F\u0648\u0644 \u0627\u0644\u0630\u0643\u064A 20% + \u0627\u0646\u062A\u0638\u0627\u0645 \u0627\u0644\u0633\u0644\u0633\u0644\u0629 15%."
  }), exams.length === 0 ? React.createElement(UI.EmptyState, {
    icon: "book",
    title: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0648\u0627\u062F \u0628\u0639\u062F",
    hint: "\u0623\u0636\u0641 \u0645\u0648\u0627\u062F \u0648\u062E\u0637\u0637 \u0645\u0630\u0627\u0643\u0631\u0629 \u0644\u062A\u0638\u0647\u0631 \u0627\u0644\u062C\u0627\u0647\u0632\u064A\u0629 \u0647\u0646\u0627."
  }) : readiness.every(function (r) {
    return r._r.target === 0;
  }) ? React.createElement(UI.EmptyState, {
    icon: "target",
    title: "\u0644\u0627 \u062A\u0648\u062C\u062F \u062E\u0637\u0637 \u0645\u0630\u0627\u0643\u0631\u0629 \u0645\u0631\u062A\u0628\u0637\u0629",
    hint: "\u0623\u0646\u0634\u0626 \u062E\u0637\u0629 \u0645\u0630\u0627\u0643\u0631\u0629 \u0644\u0643\u0644 \u0645\u0627\u062F\u0629 \u0644\u062A\u0638\u0647\u0631 \u0646\u0633\u0628\u0629 \u0627\u0644\u062C\u0627\u0647\u0632\u064A\u0629."
  }) : React.createElement("div", {
    className: "ready-list"
  }, readiness.map(function (r) {
    const color = Core.colorOf(r._i);
    return React.createElement("div", {
      key: r.id,
      className: "ready-row"
    }, React.createElement("span", {
      className: "subject-cell"
    }, React.createElement("span", {
      className: "dot",
      style: {
        background: color
      }
    }), React.createElement("strong", null, r.subject)), React.createElement("div", {
      className: "ready-bar"
    }, React.createElement(UI.ProgressBar, {
      pct: r._r.pct,
      color: color,
      height: 10
    })), React.createElement("span", {
      className: "ready-num"
    }, Core.fmtDur(r._r.elapsed), " / ", (r._r.target / 3600).toFixed(1), " \u0633"), React.createElement(UI.GradeBadge, {
      g: r._g
    }));
  }))));
};
const AchievementsTab = function AchievementsTab({
  achMap,
  exams,
  plans,
  stats,
  settings,
  now,
  pomoSessions
}) {
  const satisfied = Core.evalAchievements({
    exams,
    plans,
    stats,
    settings,
    now,
    extras: {
      pomoSessions: pomoSessions
    }
  });
  const unlockedCount = Core.ACH.filter(function (a) {
    return achMap[a.id] || satisfied.includes(a.id);
  }).length;
  const pct = Math.round(unlockedCount / Core.ACH.length * 100);
  return React.createElement("section", {
    className: "tab-content"
  }, React.createElement("div", {
    className: "card"
  }, React.createElement(UI.CardHeader, {
    icon: "award",
    color: "#f59e0b",
    title: "\u0644\u0648\u062D\u0629 \u0627\u0644\u0625\u0646\u062C\u0627\u0632\u0627\u062A",
    sub: "\u0643\u0644 \u0625\u0646\u062C\u0627\u0632 \u062A\u0641\u062A\u062D\u0647 \u0647\u0648 \u062E\u0637\u0648\u0629 \u0623\u0642\u0631\u0628 \u0644\u0644\u062A\u0641\u0648\u0642 \u2014 \u062D\u0627\u0641\u0638 \u0639\u0644\u0649 \u0633\u0644\u0633\u0644\u062A\u0643 \u0627\u0644\u064A\u0648\u0645\u064A\u0629!"
  }, React.createElement(UI.Badge, {
    color: "#f59e0b"
  }, unlockedCount, " / ", Core.ACH.length)), React.createElement(UI.ProgressBar, {
    pct: pct,
    color: "#f59e0b",
    height: 10,
    className: "ach-progress"
  }), React.createElement("div", {
    className: "ach-grid"
  }, Core.ACH.map(function (a, i) {
    const unlocked = Boolean(achMap[a.id] || satisfied.includes(a.id));
    return React.createElement("div", {
      key: a.id,
      className: 'ach-card' + (unlocked ? ' unlocked' : ''),
      style: {
        animationDelay: i * 40 + 'ms'
      }
    }, React.createElement("span", {
      className: "ach-icon",
      style: unlocked ? {
        background: a.color + '1E',
        color: a.color
      } : null
    }, React.createElement(UI.Icon, {
      name: unlocked ? a.icon : 'lock',
      size: 22,
      strokeWidth: 1.8
    })), React.createElement("strong", null, a.title), React.createElement("p", null, a.desc), unlocked && achMap[a.id] ? React.createElement("span", {
      className: "ach-date"
    }, React.createElement(UI.Icon, {
      name: "checkCircle",
      size: 11
    }), " ", achMap[a.id]) : null);
  }))));
};
const SettingsTab = function SettingsTab({
  profile,
  settings,
  notifStatus,
  pomoSessions,
  onEditProfile,
  onTheme,
  onGoal,
  onPomo,
  onExport,
  onImportFile,
  onDemo,
  onResetAll,
  onEnableNotifs
}) {
  const p = settings.pomo || Algo.POMO_DEFAULTS;
  return React.createElement("section", {
    className: "tab-content"
  }, React.createElement("div", {
    className: "settings-grid"
  }, React.createElement("div", {
    className: "card"
  }, React.createElement(UI.CardHeader, {
    icon: "user",
    color: "#0d9488",
    title: "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0627\u0644\u0628",
    sub: "\u062A\u064F\u0633\u062A\u062E\u062F\u0645 \u0641\u064A \u0627\u0644\u062A\u0631\u062D\u064A\u0628 \u0648\u0627\u0644\u0634\u0631\u064A\u0637 \u0627\u0644\u0639\u0644\u0648\u064A."
  }), React.createElement("div", {
    className: "profile-box"
  }, React.createElement("span", {
    className: "avatar"
  }, mfsInitials(profile.username)), React.createElement("div", {
    className: "profile-info"
  }, React.createElement("strong", null, profile.username), React.createElement("span", {
    dir: "ltr",
    className: "muted"
  }, profile.email), React.createElement("div", {
    className: "profile-chips"
  }, React.createElement(UI.Badge, null, React.createElement(UI.Icon, {
    name: "hash",
    size: 12
  }), " ", profile.studentId), React.createElement(UI.Badge, null, React.createElement(UI.Icon, {
    name: "cap",
    size: 12
  }), " ", profile.college), React.createElement(UI.Badge, null, React.createElement(UI.Icon, {
    name: "layers",
    size: 12
  }), " \u0627\u0644\u0633\u0646\u0629 ", profile.year))), React.createElement("button", {
    type: "button",
    className: "btn btn-soft",
    onClick: onEditProfile
  }, React.createElement(UI.Icon, {
    name: "edit",
    size: 14
  }), " \u062A\u0639\u062F\u064A\u0644"))), React.createElement("div", {
    className: "card"
  }, React.createElement(UI.CardHeader, {
    icon: "sliders",
    color: "#06b6d4",
    title: "\u0627\u0644\u0645\u0638\u0647\u0631 \u0648\u0627\u0644\u0647\u062F\u0641 \u0627\u0644\u064A\u0648\u0645\u064A",
    sub: "\u062E\u0635\u0651\u0635 \u0627\u0644\u0645\u0646\u0638\u0645 \u0628\u0645\u0627 \u064A\u0646\u0627\u0633\u0628 \u0637\u0631\u064A\u0642\u0629 \u062F\u0631\u0627\u0633\u062A\u0643."
  }), React.createElement("div", {
    className: "setting-row"
  }, React.createElement("span", null, "\u0627\u0644\u0645\u0638\u0647\u0631"), React.createElement("div", {
    className: "theme-toggle"
  }, React.createElement("button", {
    type: "button",
    className: 'chip' + (settings.theme !== 'dark' ? ' active' : ''),
    onClick: function () {
      onTheme('light');
    }
  }, React.createElement(UI.Icon, {
    name: "sun",
    size: 14
  }), " \u0641\u0627\u062A\u062D"), React.createElement("button", {
    type: "button",
    className: 'chip' + (settings.theme === 'dark' ? ' active' : ''),
    onClick: function () {
      onTheme('dark');
    }
  }, React.createElement(UI.Icon, {
    name: "moon",
    size: 14
  }), " \u062F\u0627\u0643\u0646"))), React.createElement("div", {
    className: "setting-row"
  }, React.createElement("span", null, "\u0647\u062F\u0641 \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629 \u0627\u0644\u064A\u0648\u0645\u064A", React.createElement("small", {
    className: "muted block"
  }, "\u064A\u064F\u062D\u062A\u0633\u0628 \u064A\u0648\u0645\u0643 \u0641\u064A \u0633\u0644\u0633\u0644\u0629 \u0627\u0644\u0627\u0644\u062A\u0632\u0627\u0645 \u0639\u0646\u062F \u0645\u0630\u0627\u0643\u0631\u0629 \u0647\u0630\u0627 \u0627\u0644\u0645\u0642\u062F\u0627\u0631 \u064A\u0648\u0645\u064A\u0627\u064B.")), React.createElement("div", {
    className: "goal-input"
  }, React.createElement("input", {
    type: "number",
    min: "15",
    max: "720",
    step: "15",
    value: settings.dailyGoalMin,
    onChange: function (e) {
      const v = parseInt(e.target.value, 10);
      if (v >= 1 && v <= 720) onGoal(v);
    }
  }), React.createElement("span", null, "\u062F\u0642\u064A\u0642\u0629"))), React.createElement("div", {
    className: "setting-row"
  }, React.createElement("span", null, "\u062F\u0648\u0631\u0629 \u0627\u0644\u0628\u0648\u0645\u0648\u062F\u0648\u0631\u0648 (\u062F\u0642\u0627\u0626\u0642)", React.createElement("small", {
    className: "muted block"
  }, "\u062A\u0631\u0643\u064A\u0632 \u2190 \u0627\u0633\u062A\u0631\u0627\u062D\u0629 \u0642\u0635\u064A\u0631\u0629\u060C \u0648\u0643\u0644 4 \u062C\u0644\u0633\u0627\u062A \u0627\u0633\u062A\u0631\u0627\u062D\u0629 \u0637\u0648\u064A\u0644\u0629. \u062C\u0644\u0633\u0627\u062A\u0643 \u0627\u0644\u0645\u0643\u062A\u0645\u0644\u0629: ", pomoSessions || 0)), React.createElement("div", {
    className: "pomo-inputs"
  }, React.createElement("label", null, React.createElement("input", {
    type: "number",
    min: "5",
    max: "120",
    value: p.focus,
    onChange: function (e) {
      const v = parseInt(e.target.value, 10);
      if (v >= 1 && v <= 180) onPomo('focus', v);
    }
  }), " \u062A\u0631\u0643\u064A\u0632"), React.createElement("label", null, React.createElement("input", {
    type: "number",
    min: "1",
    max: "30",
    value: p.brk,
    onChange: function (e) {
      const v = parseInt(e.target.value, 10);
      if (v >= 1 && v <= 60) onPomo('brk', v);
    }
  }), " \u0627\u0633\u062A\u0631\u0627\u062D\u0629"), React.createElement("label", null, React.createElement("input", {
    type: "number",
    min: "5",
    max: "60",
    value: p.long,
    onChange: function (e) {
      const v = parseInt(e.target.value, 10);
      if (v >= 1 && v <= 90) onPomo('long', v);
    }
  }), " \u0637\u0648\u064A\u0644\u0629"))), React.createElement("div", {
    className: "setting-row"
  }, React.createElement("span", null, "\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A", React.createElement("small", {
    className: "muted block"
  }, "\u0625\u0634\u0639\u0627\u0631 \u0642\u0628\u0644 \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646 \u0628\u0623\u0642\u0644 \u0645\u0646 24 \u0633\u0627\u0639\u0629 \u0623\u062B\u0646\u0627\u0621 \u062A\u0635\u0641\u062D \u0627\u0644\u0645\u0648\u0642\u0639.")), notifStatus === 'unsupported' ? React.createElement(UI.Badge, {
    color: "#94a3b8"
  }, "\u063A\u064A\u0631 \u0645\u062F\u0639\u0648\u0645 \u0641\u064A \u0645\u062A\u0635\u0641\u062D\u0643") : notifStatus === 'granted' ? React.createElement(UI.Badge, {
    color: "#10b981"
  }, React.createElement(UI.Icon, {
    name: "checkCircle",
    size: 12
  }), " \u0645\u0641\u0639\u0651\u0644\u0629") : notifStatus === 'denied' ? React.createElement(UI.Badge, {
    color: "#e11d48"
  }, "\u0645\u0631\u0641\u0648\u0636\u0629 \u0645\u0646 \u0627\u0644\u0645\u062A\u0635\u0641\u062D") : React.createElement("button", {
    type: "button",
    className: "btn btn-soft",
    onClick: onEnableNotifs
  }, React.createElement(UI.Icon, {
    name: "bell",
    size: 14
  }), " \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0646\u0628\u064A\u0647\u0627\u062A"))), React.createElement("div", {
    className: "card"
  }, React.createElement(UI.CardHeader, {
    icon: "layers",
    color: "#06b6d4",
    title: "\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0648\u0627\u0644\u0646\u0633\u062E \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A",
    sub: "\u0628\u064A\u0627\u0646\u0627\u062A\u0643 \u0645\u062D\u0641\u0648\u0638\u0629 \u0639\u0644\u0649 \u062C\u0647\u0627\u0632\u0643 \u0641\u0642\u0637 (localStorage) \u2014 \u0635\u062F\u0651\u0631\u0647\u0627 \u0644\u0646\u0642\u0644\u0647\u0627 \u0628\u064A\u0646 \u0627\u0644\u0623\u062C\u0647\u0632\u0629."
  }), React.createElement("div", {
    className: "setting-actions"
  }, React.createElement("button", {
    type: "button",
    className: "btn btn-soft",
    onClick: onExport
  }, React.createElement(UI.Icon, {
    name: "download",
    size: 14
  }), " \u062A\u0635\u062F\u064A\u0631 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629"), React.createElement("label", {
    className: "btn btn-soft import-btn"
  }, React.createElement(UI.Icon, {
    name: "upload",
    size: 14
  }), " \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0646\u0633\u062E\u0629", React.createElement("input", {
    type: "file",
    accept: "application/json,.json",
    onChange: onImportFile
  })), React.createElement("button", {
    type: "button",
    className: "btn btn-soft",
    onClick: onDemo
  }, React.createElement(UI.Icon, {
    name: "zap",
    size: 14
  }), " \u062A\u062D\u0645\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u062A\u062C\u0631\u064A\u0628\u064A\u0629"))), React.createElement("div", {
    className: "card danger-card"
  }, React.createElement(UI.CardHeader, {
    icon: "alert",
    color: "#e11d48",
    title: "\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u062E\u0637\u0631",
    sub: "\u0625\u062C\u0631\u0627\u0621 \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646\u0647."
  }), React.createElement("button", {
    type: "button",
    className: "btn btn-danger",
    onClick: onResetAll
  }, React.createElement(UI.Icon, {
    name: "trash",
    size: 14
  }), " \u0645\u0633\u062D \u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A (\u0627\u0644\u062D\u0633\u0627\u0628\u060C \u0627\u0644\u0645\u0648\u0627\u062F\u060C \u0627\u0644\u062E\u0637\u0637\u060C \u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A)"))));
};
const Footer = function Footer() {
  return React.createElement("footer", {
    className: "site-footer"
  }, React.createElement("div", {
    className: "container"
  }, React.createElement("p", {
    className: "ayah"
  }, "\uFD3F \u0648\u064E\u0623\u064E\u0646 \u0644\u064E\u0651\u064A\u0652\u0633\u064E \u0644\u0650\u0644\u0652\u0625\u0650\u0646\u0633\u064E\u0627\u0646\u0650 \u0625\u0650\u0644\u064E\u0651\u0627 \u0645\u064E\u0627 \u0633\u064E\u0639\u064E\u0649\u0670 * \u0648\u064E\u0623\u064E\u0646\u064E\u0651 \u0633\u064E\u0639\u0652\u064A\u064E\u0647\u064F \u0633\u064E\u0648\u0652\u0641\u064E \u064A\u064F\u0631\u064E\u0649\u0670 \uFD3E"), React.createElement("span", {
    className: "surah"
  }, "\u0633\u0648\u0631\u0629 \u0627\u0644\u0646\u062C\u0645 \u2014 \u0627\u0644\u0622\u064A\u062A\u0627\u0646 39-40"), React.createElement("div", {
    className: "creator-box"
  }, React.createElement("h3", null, React.createElement(UI.Icon, {
    name: "user",
    size: 15
  }), " \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0645\u0646\u0634\u0626 \u0627\u0644\u0645\u0648\u0642\u0639"), React.createElement("div", {
    className: "creator-grid"
  }, React.createElement("div", {
    className: "creator-item"
  }, React.createElement(UI.Icon, {
    name: "user",
    size: 14
  }), " ", React.createElement("span", null, React.createElement("strong", null, "\u0627\u0644\u0627\u0633\u0645:"), " Eng: Ma'an Majed")), React.createElement("div", {
    className: "creator-item"
  }, React.createElement(UI.Icon, {
    name: "cap",
    size: 14
  }), " ", React.createElement("span", null, React.createElement("strong", null, "\u0627\u0644\u062C\u0627\u0645\u0639\u0629:"), " \u0627\u0644\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644\u064A\u0629 \u0627\u0644\u062E\u0627\u0635\u0629 \u0644\u0644\u0639\u0644\u0648\u0645 \u0648\u0627\u0644\u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 (IUST)")), React.createElement("div", {
    className: "creator-item"
  }, React.createElement(UI.Icon, {
    name: "phone",
    size: 14
  }), " ", React.createElement("a", {
    href: "tel:+963992328101",
    dir: "ltr"
  }, "+963 992 328 101")), React.createElement("div", {
    className: "creator-item"
  }, React.createElement(UI.Icon, {
    name: "mail",
    size: 14
  }), " ", React.createElement("a", {
    href: "mailto:maanabokhashreef@gmail.com",
    dir: "ltr"
  }, "maanabokhashreef@gmail.com")), React.createElement("div", {
    className: "creator-item"
  }, React.createElement(UI.Icon, {
    name: "linkedin",
    size: 14
  }), " ", React.createElement("span", null, "ma'an abokhashreef")))), React.createElement("p", {
    className: "footer-note"
  }, "Med~Final~Study \u2014 \u0646\u0633\u062E\u0629 React v3 \u2022 \u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0645\u062D\u0641\u0648\u0638\u0629 \u0639\u0644\u0649 \u062C\u0647\u0627\u0632\u0643 \u2022 \u0635\u064F\u0646\u0639 \u0628\u062D\u0628 \u0645\u0646 \u0623\u062C\u0644 \u0627\u0644\u0637\u0644\u0627\u0628")));
};
const Screens2 = {
  PlansTab,
  StatsTab,
  AchievementsTab,
  SettingsTab,
  Footer
};