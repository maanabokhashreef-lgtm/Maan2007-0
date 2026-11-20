/* تم توليد هذا الملف تلقائياً من src/screens1.jsx — عدّل ملف المصدر ثم شغّل: npm run build */
function mfsInitials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '؟';
  return parts.slice(0, 2).map(function (p) {
    return p[0];
  }).join('');
}
const LoginGate = function LoginGate({
  onLogin,
  onDemo
}) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    studentId: '',
    college: '',
    year: ''
  });
  const [errors, setErrors] = useState({});
  const upd = function (k, v) {
    setForm(function (f) {
      return Object.assign({}, f, {
        [k]: v
      });
    });
  };
  function validate() {
    const er = {};
    if (!form.username.trim() || form.username.trim().length < 2) er.username = 'أدخل اسماً صحيحاً (حرفان على الأقل)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) er.email = 'أدخل بريداً إلكترونياً صحيحاً';
    if (!form.studentId.trim()) er.studentId = 'الرقم الجامعي مطلوب';
    if (!form.college) er.college = 'اختر الكلية';
    if (!form.year) er.year = 'اختر السنة الدراسية';
    return er;
  }
  function submit(e) {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    onLogin({
      username: form.username.trim(),
      email: form.email.trim(),
      studentId: form.studentId.trim(),
      college: form.college,
      year: form.year
    });
  }
  return React.createElement("section", {
    className: "login-gate"
  }, React.createElement("div", {
    className: "login-card"
  }, React.createElement("div", {
    className: "login-visual"
  }, React.createElement("div", {
    className: "login-avatar"
  }, React.createElement(UI.Icon, {
    name: "cap",
    size: 30,
    strokeWidth: 1.6
  })), React.createElement("h2", null, "\u0623\u0647\u0644\u0627\u064B \u0628\u0643 \u0641\u064A \u0645\u0646\u0638\u0645\u0643 \u0627\u0644\u062F\u0631\u0627\u0633\u064A"), React.createElement("p", null, "\u0633\u062C\u0651\u0644 \u0628\u064A\u0627\u0646\u0627\u062A\u0643 \u0645\u0631\u0629 \u0648\u0627\u062D\u062F\u0629 \u0644\u062A\u0628\u062F\u0623 \u0627\u0644\u062A\u0646\u0638\u064A\u0645: \u062C\u062F\u0648\u0644 \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A\u060C \u062E\u0637\u0629 \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629\u060C \u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0648\u0627\u0644\u0625\u0646\u062C\u0627\u0632\u0627\u062A \u2014 \u0643\u0644 \u0634\u064A\u0621 \u064A\u064F\u062D\u0641\u0638 \u0639\u0644\u0649 \u062C\u0647\u0627\u0632\u0643 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B."), React.createElement("ul", {
    className: "login-features"
  }, React.createElement("li", null, React.createElement(UI.Icon, {
    name: "calendar",
    size: 15
  }), " \u0639\u062F \u062A\u0646\u0627\u0632\u0644\u064A \u062D\u064A \u0644\u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646"), React.createElement("li", null, React.createElement(UI.Icon, {
    name: "zap",
    size: 15
  }), " \u062E\u0648\u0627\u0631\u0632\u0645\u064A\u0629 \u062A\u0648\u0644\u0651\u062F \u062E\u0637\u062A\u0643 \u0648 \u062A\u0648\u0632\u0639 \u0633\u0644\u0627\u064A\u062F\u0627\u062A\u0643 \u064A\u0648\u0645\u064A\u0627\u064B"), React.createElement("li", null, React.createElement(UI.Icon, {
    name: "hourglass",
    size: 15
  }), " \u0645\u0624\u0642\u062A \u0645\u0630\u0627\u0643\u0631\u0629 \u0648\u0628\u0648\u0645\u0648\u062F\u0648\u0631\u0648 \u0645\u0639 \u062A\u062A\u0628\u0639 \u0627\u0644\u0627\u0633\u062A\u0639\u062F\u0627\u062F"), React.createElement("li", null, React.createElement(UI.Icon, {
    name: "chart",
    size: 15
  }), " \u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0648\u062A\u0642\u0648\u064A\u0645 \u0648\u0625\u0646\u062C\u0627\u0632\u0627\u062A \u062A\u062D\u0641\u064A\u0632\u064A\u0629"))), React.createElement("form", {
    className: "login-form",
    onSubmit: submit,
    noValidate: true
  }, React.createElement("div", {
    className: "login-form-title"
  }, React.createElement(UI.Icon, {
    name: "user",
    size: 16
  }), React.createElement("span", null, "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0627\u0644\u0628")), React.createElement(UI.Field, {
    label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645",
    icon: "user"
  }, React.createElement("input", {
    type: "text",
    value: form.username,
    placeholder: "\u0645\u062B\u0627\u0644: Ma'an Majed",
    onChange: function (e) {
      upd('username', e.target.value);
    }
  }), errors.username ? React.createElement("span", {
    className: "field-error"
  }, errors.username) : null), React.createElement(UI.Field, {
    label: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
    icon: "mail"
  }, React.createElement("input", {
    type: "email",
    dir: "ltr",
    value: form.email,
    placeholder: "name@example.com",
    onChange: function (e) {
      upd('email', e.target.value);
    }
  }), errors.email ? React.createElement("span", {
    className: "field-error"
  }, errors.email) : null), React.createElement(UI.Field, {
    label: "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u062C\u0627\u0645\u0639\u064A",
    icon: "hash"
  }, React.createElement("input", {
    type: "text",
    dir: "ltr",
    value: form.studentId,
    placeholder: "\u0645\u062B\u0627\u0644: 2024001",
    onChange: function (e) {
      upd('studentId', e.target.value);
    }
  }), errors.studentId ? React.createElement("span", {
    className: "field-error"
  }, errors.studentId) : null), React.createElement("div", {
    className: "field-row"
  }, React.createElement(UI.Field, {
    label: "\u0627\u0644\u0643\u0644\u064A\u0629",
    icon: "cap",
    className: "grow"
  }, React.createElement("select", {
    value: form.college,
    onChange: function (e) {
      upd('college', e.target.value);
    }
  }, React.createElement("option", {
    value: "",
    disabled: true
  }, "\u0627\u062E\u062A\u0631 \u0627\u0644\u0643\u0644\u064A\u0629..."), Core.COLLEGES.map(function (c) {
    return React.createElement("option", {
      key: c,
      value: c
    }, c);
  })), errors.college ? React.createElement("span", {
    className: "field-error"
  }, errors.college) : null), React.createElement(UI.Field, {
    label: "\u0627\u0644\u0633\u0646\u0629",
    icon: "layers"
  }, React.createElement("select", {
    value: form.year,
    onChange: function (e) {
      upd('year', e.target.value);
    }
  }, React.createElement("option", {
    value: "",
    disabled: true
  }, "..."), Core.YEARS.map(function (y) {
    return React.createElement("option", {
      key: y,
      value: y
    }, "\u0627\u0644\u0633\u0646\u0629 ", y);
  })), errors.year ? React.createElement("span", {
    className: "field-error"
  }, errors.year) : null)), React.createElement("button", {
    type: "submit",
    className: "btn btn-primary btn-block"
  }, React.createElement(UI.Icon, {
    name: "check",
    size: 16
  }), " \u062D\u0641\u0638 \u0648\u0627\u0644\u062F\u062E\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0645\u0646\u0638\u0645"), React.createElement("button", {
    type: "button",
    className: "btn btn-ghost btn-block",
    onClick: onDemo
  }, React.createElement(UI.Icon, {
    name: "zap",
    size: 15
  }), " \u062F\u062E\u0648\u0644 \u062A\u062C\u0631\u064A\u0628\u064A \u0633\u0631\u064A\u0639 (\u0628\u064A\u0627\u0646\u0627\u062A \u062A\u0648\u0636\u064A\u062D\u064A\u0629)"))));
};
const Header = function Header({
  theme,
  onToggleTheme,
  quote,
  onNewQuote,
  notifStatus,
  onEnableNotifs,
  onTogglePomo,
  pomoOpen
}) {
  const [spin, setSpin] = useState(false);
  function newQuote() {
    setSpin(true);
    onNewQuote();
    setTimeout(function () {
      setSpin(false);
    }, 600);
  }
  return React.createElement("header", {
    className: "site-header"
  }, React.createElement("div", {
    className: "container header-grid"
  }, React.createElement("div", {
    className: "header-brand"
  }, React.createElement("span", {
    className: "brand-logo"
  }, React.createElement("img", {
    src: "assets/iust-logo.svg",
    alt: "\u0634\u0639\u0627\u0631 \u0627\u0644\u062C\u0627\u0645\u0639\u0629 \u0627\u0644\u062F\u0648\u0644\u064A\u0629 IUST"
  })), React.createElement("div", {
    className: "brand-text"
  }, React.createElement("strong", null, "Med~Final~Study"), React.createElement("span", null, "\u0645\u0646\u0638\u0645 \u0627\u0644\u062C\u062F\u0648\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A"))), React.createElement("div", {
    className: "header-quote",
    key: quote.i
  }, React.createElement(UI.Icon, {
    name: "star",
    size: 14,
    className: "quote-star"
  }), React.createElement("p", null, "\"", quote.text, "\""), React.createElement("button", {
    type: "button",
    className: 'quote-btn' + (spin ? ' spin' : ''),
    onClick: newQuote,
    title: "\u0639\u0628\u0627\u0631\u0629 \u062A\u062D\u0641\u064A\u0632\u064A\u0629 \u0623\u062E\u0631\u0649",
    "aria-label": "\u0639\u0628\u0627\u0631\u0629 \u062A\u062D\u0641\u064A\u0632\u064A\u0629 \u0623\u062E\u0631\u0649"
  }, React.createElement(UI.Icon, {
    name: "refresh",
    size: 14
  }))), React.createElement("div", {
    className: "header-actions"
  }, React.createElement("button", {
    type: "button",
    className: 'icon-btn' + (pomoOpen ? ' active' : ''),
    onClick: onTogglePomo,
    title: "\u0645\u0624\u0642\u062A \u0627\u0644\u0628\u0648\u0645\u0648\u062F\u0648\u0631\u0648",
    "aria-label": "\u0645\u0624\u0642\u062A \u0627\u0644\u0628\u0648\u0645\u0648\u062F\u0648\u0631\u0648"
  }, React.createElement(UI.Icon, {
    name: "hourglass",
    size: 17
  })), notifStatus !== 'granted' && notifStatus !== 'unsupported' ? React.createElement("button", {
    type: "button",
    className: "icon-btn",
    onClick: onEnableNotifs,
    title: "\u062A\u0641\u0639\u064A\u0644 \u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A",
    "aria-label": "\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0646\u0628\u064A\u0647\u0627\u062A"
  }, React.createElement(UI.Icon, {
    name: "bell",
    size: 17
  }), React.createElement("span", {
    className: "ping-dot"
  })) : null, notifStatus === 'granted' ? React.createElement("span", {
    className: "icon-btn static",
    title: "\u0627\u0644\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0645\u0641\u0639\u0651\u0644\u0629"
  }, React.createElement(UI.Icon, {
    name: "bell",
    size: 17
  }), React.createElement("span", {
    className: "ping-dot on"
  })) : null, React.createElement("button", {
    type: "button",
    className: "icon-btn",
    onClick: onToggleTheme,
    title: theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن',
    "aria-label": "\u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u0645\u0638\u0647\u0631"
  }, React.createElement(UI.Icon, {
    name: theme === 'dark' ? 'sun' : 'moon',
    size: 17
  })), React.createElement("span", {
    className: "dev-badge"
  }, React.createElement(UI.Icon, {
    name: "user",
    size: 13
  }), " Eng: Ma'an Majed"))));
};
const TodayFocus = function TodayFocus({
  focus,
  onStartPlan,
  onGoPlans
}) {
  if (!focus || !focus.top || focus.top.score <= 0) return null;
  const top = focus.top;
  const exam = top.exam;
  const color = Core.colorOf(top.index);
  const suggestedPerDay = Math.max(1, Math.ceil((parseInt(exam.slides, 10) || 0) / Math.max(1, top.daysLeft)));
  return React.createElement("div", {
    className: "today-focus glass",
    style: {
      '--accent': color
    }
  }, React.createElement("div", {
    className: "tf-head"
  }, React.createElement("span", {
    className: "tf-icon",
    style: {
      background: color + '1E',
      color: color
    }
  }, React.createElement(UI.Icon, {
    name: "target",
    size: 20
  })), React.createElement("div", null, React.createElement("h3", null, "\u0645\u0627\u0630\u0627 \u062A\u0630\u0627\u0643\u0631 \u0627\u0644\u064A\u0648\u0645\u061F"), React.createElement("p", null, "\u0642\u0631\u0627\u0631 \u062E\u0648\u0627\u0631\u0632\u0645\u064A: \u0625\u0644\u062D\u0627\u062D \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646 60% + \u0639\u062C\u0632 \u0627\u0644\u062C\u0627\u0647\u0632\u064A\u0629 40%"))), React.createElement("div", {
    className: "tf-body"
  }, React.createElement("div", {
    className: "tf-main"
  }, React.createElement("strong", {
    className: "tf-subject"
  }, exam.subject), React.createElement("div", {
    className: "tf-meta"
  }, React.createElement(UI.Badge, {
    color: color
  }, React.createElement(UI.Icon, {
    name: "calendar",
    size: 12
  }), " ", Core.fmtDate(exam.date)), React.createElement(UI.Badge, {
    color: top.daysLeft <= 2 ? '#e11d48' : '#f59e0b'
  }, React.createElement(UI.Icon, {
    name: "zap",
    size: 12
  }), " ", top.daysLeft <= 0 ? 'اليوم!' : 'باقي ' + top.daysLeft + ' يوم'), React.createElement(UI.Badge, {
    color: "#0ea5e9"
  }, React.createElement(UI.Icon, {
    name: "chart",
    size: 12
  }), " \u0627\u0644\u062C\u0627\u0647\u0632\u064A\u0629 ", top.ready.pct, "%")), React.createElement("div", {
    className: "tf-suggest"
  }, focus.smartEntry ? React.createElement("span", {
    className: "tf-line smart"
  }, React.createElement(UI.Icon, {
    name: "zap",
    size: 13
  }), "\u0647\u062F\u0641\u0643 \u0645\u0646 \u0627\u0644\u062E\u0637\u0629 \u0627\u0644\u0630\u0643\u064A\u0629 \u0627\u0644\u064A\u0648\u0645: ", React.createElement("strong", null, focus.smartEntry.slides, " \u0633\u0644\u0627\u064A\u062F"), " (\u0634\u0627\u0628\u062A\u0631 ", focus.smartEntry.chapters, ") \u2014 ", focus.smartEntry.heavy ? 'يوم ثقيل' : focus.smartEntry.light ? 'يوم خفيف للمراجعة' : 'يوم متوازن') : React.createElement("span", {
    className: "tf-line"
  }, React.createElement(UI.Icon, {
    name: "info",
    size: 13
  }), "\u0627\u0644\u0648\u062A\u064A\u0631\u0629 \u0627\u0644\u0645\u0642\u062A\u0631\u062D\u0629: ", React.createElement("strong", null, suggestedPerDay), " \u0633\u0644\u0627\u064A\u062F \u064A\u0648\u0645\u064A\u0627\u064B \u0644\u0644\u0648\u0635\u0648\u0644 \u0628\u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0645\u0646\u0627\u0633\u0628"), focus.runnerUp ? React.createElement("span", {
    className: "tf-line next"
  }, React.createElement(UI.Icon, {
    name: "layers",
    size: 13
  }), " \u0627\u0644\u0623\u0648\u0644\u0648\u064A\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629: ", focus.runnerUp.exam.subject, " (\u0628\u0627\u0642\u064A ", focus.runnerUp.daysLeft, " \u064A\u0648\u0645)") : null)), React.createElement("button", {
    type: "button",
    className: "btn btn-primary tf-start",
    onClick: onStartPlan
  }, React.createElement(UI.Icon, {
    name: "play",
    size: 15
  }), " \u0627\u0628\u062F\u0623 \u062C\u0644\u0633\u0629 \u0627\u0644\u064A\u0648\u0645")));
};
const HeroNextExam = function HeroNextExam({
  exams,
  plans,
  now,
  streak,
  totalStudy,
  onGoAdd,
  onGoCalendar,
  profile
}) {
  const upcoming = useMemo(function () {
    const withCd = exams.map(function (e, i) {
      return {
        e,
        i,
        cd: Core.countdown(e, now)
      };
    }).filter(function (x) {
      return !x.cd.done;
    });
    withCd.sort(function (a, b) {
      return a.cd.total - b.cd.total;
    });
    return withCd[0] || null;
  }, [exams, now]);
  const totalSlides = exams.reduce(function (a, e) {
    return a + (parseInt(e.slides, 10) || 0);
  }, 0);
  const ready = upcoming ? Core.examReadiness(upcoming.e, plans, now) : null;
  const grade = upcoming ? Algo.readinessGrade(upcoming.e, plans, now, streak.todayPct) : null;
  const urgent = upcoming && upcoming.cd.total < 2 * 86400000;
  const milestones = upcoming ? Algo.reviewMilestones(upcoming.e).filter(function (m) {
    return !m.past;
  }) : [];
  return React.createElement("div", {
    className: "hero"
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
    label: "\u0633\u0627\u0639\u0629 \u0645\u0630\u0627\u0643\u0631\u0629",
    value: totalStudy / 3600,
    decimals: 1,
    color: "#10b981",
    delay: 120
  }), React.createElement(UI.StatCard, {
    icon: "flame",
    label: "\u0633\u0644\u0633\u0644\u0629 \u0627\u0644\u0627\u0644\u062A\u0632\u0627\u0645",
    value: streak.current + ' أيام',
    sub: 'هدف يومي: ' + streak.todayPct + '%',
    color: "#f59e0b",
    delay: 180
  })), upcoming ? React.createElement("div", {
    className: 'next-exam glass' + (urgent ? ' urgent' : '')
  }, React.createElement("div", {
    className: "next-exam-main"
  }, React.createElement("div", {
    className: "next-exam-label"
  }, React.createElement(UI.Icon, {
    name: urgent ? 'zap' : 'calendar',
    size: 15
  }), urgent ? 'امتحان قريب جداً!' : 'الامتحان القادم'), React.createElement("h3", {
    className: "next-exam-name"
  }, upcoming.e.subject), React.createElement("div", {
    className: "next-exam-meta"
  }, React.createElement(UI.Badge, {
    color: Core.colorOf(upcoming.i)
  }, React.createElement(UI.Icon, {
    name: "calendar",
    size: 12
  }), " ", Core.fmtDate(upcoming.e.date)), React.createElement(UI.Badge, {
    color: "#06b6d4"
  }, React.createElement(UI.Icon, {
    name: "clock",
    size: 12
  }), " ", upcoming.e.time), React.createElement(UI.Badge, {
    color: "#0d9488"
  }, React.createElement(UI.Icon, {
    name: "layers",
    size: 12
  }), " ", upcoming.e.slides, " \u0633\u0644\u0627\u064A\u062F"), React.createElement(UI.Badge, {
    color: "#f59e0b"
  }, React.createElement(UI.Icon, {
    name: "book",
    size: 12
  }), " ", upcoming.e.chapters, " \u0634\u0627\u0628\u062A\u0631"), React.createElement(UI.GradeBadge, {
    g: grade,
    compact: true
  })), React.createElement("div", {
    className: "next-exam-ready"
  }, React.createElement(UI.ProgressBar, {
    pct: ready.pct,
    color: Core.colorOf(upcoming.i),
    height: 9
  }), React.createElement("span", null, "\u0627\u0644\u0627\u0633\u062A\u0639\u062F\u0627\u062F: ", React.createElement("strong", null, ready.pct, "%"), milestones.length ? React.createElement("em", {
    className: "ms-hint"
  }, " \u2022 \u0645\u0631\u0627\u062C\u0639\u0627\u062A \u0645\u062A\u0628\u0627\u0639\u062F\u0629: ", milestones.map(function (m) {
    return m.date.slice(5);
  }).join(' ← ')) : null))), React.createElement("div", {
    className: "countdown",
    dir: "ltr"
  }, [{
    v: upcoming.cd.d,
    l: 'يوم'
  }, {
    v: upcoming.cd.h,
    l: 'ساعة'
  }, {
    v: upcoming.cd.m,
    l: 'دقيقة'
  }, {
    v: upcoming.cd.s,
    l: 'ثانية'
  }].map(function (b, idx) {
    return React.createElement("div", {
      className: "cd-box",
      key: b.l
    }, React.createElement("span", {
      className: "cd-num",
      key: idx === 3 ? 's' + b.v : 'static' + b.v
    }, String(b.v).padStart(2, '0')), React.createElement("span", {
      className: "cd-label"
    }, b.l));
  })), React.createElement(UI.Ring, {
    pct: ready.pct,
    size: 86,
    stroke: 9,
    color: Core.colorOf(upcoming.i),
    className: "next-exam-ring"
  }, React.createElement("strong", null, ready.pct, "%")), React.createElement("button", {
    type: "button",
    className: "btn btn-soft btn-sm next-exam-cal",
    onClick: onGoCalendar,
    title: "\u0627\u0641\u062A\u062D \u0627\u0644\u062A\u0642\u0648\u064A\u0645"
  }, React.createElement(UI.Icon, {
    name: "calendar",
    size: 13
  }), " \u0627\u0644\u062A\u0642\u0648\u064A\u0645")) : React.createElement("div", {
    className: "next-exam glass no-exam"
  }, exams.length ? React.createElement(UI.EmptyState, {
    icon: "award",
    title: "\u0623\u062D\u0633\u0646\u062A! \u0644\u0627 \u062A\u0648\u062C\u062F \u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A \u0642\u0627\u062F\u0645\u0629 \u0645\u062C\u062F\u0648\u0644\u0629",
    hint: "\u0623\u0636\u0641 \u0627\u0645\u062A\u062D\u0627\u0646\u0627\u064B \u062C\u062F\u064A\u062F\u0627\u064B \u0644\u0628\u062F\u0621 \u0639\u062F \u062A\u0646\u0627\u0632\u0644\u064A \u0648\u062E\u0637\u0629 \u0645\u0630\u0627\u0643\u0631\u0629 \u0645\u0646\u0627\u0633\u0628\u0629."
  }, React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: onGoAdd
  }, React.createElement(UI.Icon, {
    name: "plus",
    size: 15
  }), " \u0625\u0636\u0627\u0641\u0629 \u0645\u0627\u062F\u0629")) : React.createElement(UI.EmptyState, {
    icon: "book",
    title: 'مرحباً ' + (profile ? profile.username : '') + '! ابدأ بإضافة أول مادة',
    hint: "\u0633\u062C\u0651\u0644 \u0645\u0648\u0627\u062F\u0643 \u0648\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A\u0647\u0627\u060C \u0648\u0633\u064A\u0642\u0648\u0645 \u0627\u0644\u0645\u0646\u0638\u0645 \u0628\u062D\u0633\u0627\u0628 \u0627\u0644\u0639\u062F \u0627\u0644\u062A\u0646\u0627\u0632\u0644\u064A \u0648\u062E\u0637\u0637 \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B."
  }, React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: onGoAdd
  }, React.createElement(UI.Icon, {
    name: "plus",
    size: 15
  }), " \u0625\u0636\u0627\u0641\u0629 \u0623\u0648\u0644 \u0645\u0627\u062F\u0629"))));
};
const ExamFormModal = function ExamFormModal({
  exam,
  onClose,
  onSave
}) {
  const [form, setForm] = useState({
    subject: exam.subject,
    date: exam.date,
    time: exam.time,
    chapters: String(exam.chapters),
    slides: String(exam.slides)
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
    if (!form.subject.trim()) return setError('اسم المادة مطلوب');
    if (!form.date) return setError('تاريخ الامتحان مطلوب');
    if (!form.time) return setError('وقت الامتحان مطلوب');
    if (parseInt(form.chapters, 10) < 1) return setError('عدد الشابترات يجب أن يكون 1 على الأقل');
    if (parseInt(form.slides, 10) < 1) return setError('مجموع السلايدات يجب أن يكون 1 على الأقل');
    onSave(exam.id, {
      subject: form.subject.trim(),
      date: form.date,
      time: form.time,
      chapters: parseInt(form.chapters, 10),
      slides: parseInt(form.slides, 10)
    });
  }
  return React.createElement(UI.Modal, {
    open: true,
    onClose: onClose,
    title: "\u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0627\u062F\u0629",
    icon: "edit"
  }, React.createElement("form", {
    onSubmit: submit,
    className: "form-grid modal-form",
    noValidate: true
  }, React.createElement(UI.Field, {
    label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0627\u062F\u0629",
    icon: "book"
  }, React.createElement("input", {
    type: "text",
    value: form.subject,
    onChange: function (e) {
      upd('subject', e.target.value);
    },
    autoFocus: true
  })), React.createElement("div", {
    className: "field-row"
  }, React.createElement(UI.Field, {
    label: "\u0627\u0644\u062A\u0627\u0631\u064A\u062E",
    icon: "calendar",
    className: "grow"
  }, React.createElement("input", {
    type: "date",
    value: form.date,
    onChange: function (e) {
      upd('date', e.target.value);
    }
  })), React.createElement(UI.Field, {
    label: "\u0627\u0644\u0648\u0642\u062A",
    icon: "clock"
  }, React.createElement("input", {
    type: "time",
    value: form.time,
    onChange: function (e) {
      upd('time', e.target.value);
    }
  }))), React.createElement("div", {
    className: "field-row"
  }, React.createElement(UI.Field, {
    label: "\u0639\u062F\u062F \u0627\u0644\u0634\u0627\u0628\u062A\u0631\u0627\u062A",
    icon: "book",
    className: "grow"
  }, React.createElement("input", {
    type: "number",
    min: "1",
    value: form.chapters,
    onChange: function (e) {
      upd('chapters', e.target.value);
    }
  })), React.createElement(UI.Field, {
    label: "\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0627\u062A",
    icon: "layers",
    className: "grow"
  }, React.createElement("input", {
    type: "number",
    min: "1",
    value: form.slides,
    onChange: function (e) {
      upd('slides', e.target.value);
    }
  }))), error ? React.createElement("p", {
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
const ExamsTab = function ExamsTab({
  exams,
  plans,
  now,
  streakPct,
  onAdd,
  onUpdate,
  onDelete,
  onNotes,
  onGenerate
}) {
  const [form, setForm] = useState({
    subject: '',
    date: '',
    time: '',
    chapters: '',
    slides: ''
  });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');
  const [editing, setEditing] = useState(null);
  const today = Core.todayStr();
  const upd = function (k, v) {
    setForm(function (f) {
      return Object.assign({}, f, {
        [k]: v
      });
    });
  };
  function submit(e) {
    e.preventDefault();
    if (!form.subject.trim()) return setError('اسم المادة مطلوب');
    const dup = exams.some(function (x) {
      return x.subject === form.subject.trim();
    });
    if (dup) return setError('هذه المادة مسجلة مسبقاً في الجدول');
    if (!form.date) return setError('تاريخ الامتحان مطلوب');
    if (form.date < today) return setError('لا يمكن إضافة امتحان بتاريخ في الماضي');
    if (!form.time) return setError('وقت الامتحان مطلوب');
    if (parseInt(form.chapters, 10) < 1) return setError('عدد الشابترات يجب أن يكون 1 على الأقل');
    if (parseInt(form.slides, 10) < 1) return setError('مجموع السلايدات يجب أن يكون 1 على الأقل');
    setError('');
    onAdd({
      subject: form.subject.trim(),
      date: form.date,
      time: form.time,
      chapters: parseInt(form.chapters, 10),
      slides: parseInt(form.slides, 10)
    });
    setForm({
      subject: '',
      date: '',
      time: '',
      chapters: '',
      slides: ''
    });
  }
  let shown = exams.map(function (e, i) {
    return Object.assign({}, e, {
      _i: i,
      _cd: Core.countdown(e, now),
      _ready: Core.examReadiness(e, plans, now),
      _pace: Algo.paceInfo(e, plans, now)
    });
  });
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    shown = shown.filter(function (e) {
      return e.subject.toLowerCase().includes(q);
    });
  }
  shown.sort(function (a, b) {
    if (sort === 'slides') return b.slides - a.slides;
    if (sort === 'name') return a.subject.localeCompare(b.subject, 'ar');
    return Core.examDateTime(a) - Core.examDateTime(b);
  });
  return React.createElement("section", {
    className: "tab-content"
  }, React.createElement("div", {
    className: "card"
  }, React.createElement(UI.CardHeader, {
    icon: "calendar",
    color: "#0d9488",
    title: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0627\u062F\u0629 \u0625\u0644\u0649 \u062C\u062F\u0648\u0644 \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A",
    sub: "\u0633\u062C\u0651\u0644 \u0627\u0644\u0645\u0648\u0627\u062F \u0648\u0639\u062F\u062F \u0627\u0644\u0634\u0627\u0628\u062A\u0631\u0627\u062A \u0648\u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0627\u062A\u060C \u0648\u0633\u064A\u062A\u0643\u0641\u0644 \u0627\u0644\u0645\u0646\u0638\u0645 \u0628\u0627\u0644\u062D\u0633\u0627\u0628 \u0648\u0627\u0644\u0639\u062F \u0627\u0644\u062A\u0646\u0627\u0632\u0644\u064A \u0648\u0627\u0644\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0630\u0643\u064A."
  }), React.createElement("form", {
    className: "form-grid",
    onSubmit: submit,
    noValidate: true
  }, React.createElement(UI.Field, {
    label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0627\u062F\u0629",
    icon: "book"
  }, React.createElement("input", {
    type: "text",
    value: form.subject,
    placeholder: "\u0645\u062B\u0627\u0644: Pharmacology I",
    onChange: function (e) {
      upd('subject', e.target.value);
    }
  })), React.createElement(UI.Field, {
    label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646",
    icon: "calendar"
  }, React.createElement("input", {
    type: "date",
    min: today,
    value: form.date,
    onChange: function (e) {
      upd('date', e.target.value);
    }
  })), React.createElement(UI.Field, {
    label: "\u0648\u0642\u062A \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646",
    icon: "clock"
  }, React.createElement("input", {
    type: "time",
    value: form.time,
    onChange: function (e) {
      upd('time', e.target.value);
    }
  })), React.createElement(UI.Field, {
    label: "\u0639\u062F\u062F \u0627\u0644\u0634\u0627\u0628\u062A\u0631\u0627\u062A",
    icon: "book"
  }, React.createElement("input", {
    type: "number",
    min: "1",
    placeholder: "\u0645\u062B\u0627\u0644: 8",
    value: form.chapters,
    onChange: function (e) {
      upd('chapters', e.target.value);
    }
  })), React.createElement(UI.Field, {
    label: "\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0627\u062A",
    icon: "layers"
  }, React.createElement("input", {
    type: "number",
    min: "1",
    placeholder: "\u0645\u062B\u0627\u0644: 320",
    value: form.slides,
    onChange: function (e) {
      upd('slides', e.target.value);
    }
  })), React.createElement("div", {
    className: "field submit-field"
  }, React.createElement("button", {
    type: "submit",
    className: "btn btn-primary btn-block"
  }, React.createElement(UI.Icon, {
    name: "plus",
    size: 15
  }), " \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0627\u062F\u0629"))), error ? React.createElement("p", {
    className: "field-error"
  }, React.createElement(UI.Icon, {
    name: "alert",
    size: 13
  }), " ", error) : null), React.createElement("div", {
    className: "card"
  }, React.createElement(UI.CardHeader, {
    icon: "chart",
    color: "#06b6d4",
    title: "\u062C\u062F\u0648\u0644 \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A",
    sub: 'عدد المواد المعروضة: ' + shown.length + ' من ' + exams.length
  }, React.createElement("div", {
    className: "card-tools"
  }, React.createElement(UI.SearchBox, {
    value: search,
    onChange: setSearch,
    placeholder: "\u0627\u0628\u062D\u062B \u0639\u0646 \u0645\u0627\u062F\u0629..."
  }), React.createElement("select", {
    className: "sort-select",
    value: sort,
    onChange: function (e) {
      setSort(e.target.value);
    },
    "aria-label": "\u062A\u0631\u062A\u064A\u0628"
  }, React.createElement("option", {
    value: "date"
  }, "\u0627\u0644\u062A\u0631\u062A\u064A\u0628: \u062D\u0633\u0628 \u0627\u0644\u062A\u0627\u0631\u064A\u062E"), React.createElement("option", {
    value: "slides"
  }, "\u0627\u0644\u062A\u0631\u062A\u064A\u0628: \u062D\u0633\u0628 \u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0627\u062A"), React.createElement("option", {
    value: "name"
  }, "\u0627\u0644\u062A\u0631\u062A\u064A\u0628: \u0623\u0628\u062C\u062F\u064A")), React.createElement("button", {
    type: "button",
    className: "btn btn-soft btn-sm no-print",
    onClick: function () {
      window.print();
    },
    title: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u062C\u062F\u0648\u0644"
  }, React.createElement(UI.Icon, {
    name: "download",
    size: 13
  }), " \u0637\u0628\u0627\u0639\u0629"))), exams.length === 0 ? React.createElement(UI.EmptyState, {
    icon: "book",
    title: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0648\u0627\u062F \u0628\u0639\u062F",
    hint: "\u0623\u0636\u0641 \u0623\u0648\u0644 \u0645\u0627\u062F\u0629 \u0645\u0646 \u0627\u0644\u0646\u0645\u0648\u0630\u062C \u0623\u0639\u0644\u0627\u0647 \u0644\u064A\u0628\u062F\u0623 \u0627\u0644\u0639\u062F \u0627\u0644\u062A\u0646\u0627\u0632\u0644\u064A."
  }) : shown.length === 0 ? React.createElement(UI.EmptyState, {
    icon: "search",
    title: "\u0644\u0627 \u0646\u062A\u0627\u0626\u062C \u0645\u0637\u0627\u0628\u0642\u0629",
    hint: "\u062C\u0631\u0651\u0628 \u0643\u0644\u0645\u0629 \u0628\u062D\u062B \u0623\u062E\u0631\u0649."
  }) : React.createElement("div", {
    className: "table-responsive"
  }, React.createElement("table", {
    className: "data-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "\u0627\u0644\u0645\u0627\u062F\u0629"), React.createElement("th", null, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0648\u0627\u0644\u0648\u0642\u062A"), React.createElement("th", null, "\u0627\u0644\u0634\u0627\u0628\u062A\u0631\u0627\u062A"), React.createElement("th", null, "\u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0627\u062A"), React.createElement("th", null, "\u0633\u0644\u0627\u064A\u062F/\u0634\u0627\u0628\u062A\u0631"), React.createElement("th", null, "\u0627\u0644\u0627\u0633\u062A\u0639\u062F\u0627\u062F"), React.createElement("th", null, "\u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0645\u062A\u0628\u0642\u064A"), React.createElement("th", null, "\u0627\u0644\u0648\u062A\u064A\u0631\u0629"), React.createElement("th", null, "\u0625\u062C\u0631\u0627\u0621\u0627\u062A"))), React.createElement("tbody", null, shown.map(function (e) {
    const color = Core.colorOf(e._i);
    const cdClass = e._cd.done ? 'cd-done' : e._cd.total < 2 * 86400000 ? 'cd-urgent' : '';
    const avg = parseInt(e.chapters, 10) > 0 ? (e.slides / e.chapters).toFixed(1) : '—';
    const grade = Algo.readinessGrade(e, plans, now, streakPct);
    const hasPlan = plans.some(function (p) {
      return p.examId === e.id;
    });
    return React.createElement("tr", {
      key: e.id,
      className: e._cd.done ? 'row-done' : ''
    }, React.createElement("td", {
      "data-label": "\u0627\u0644\u0645\u0627\u062F\u0629"
    }, React.createElement("span", {
      className: "subject-cell"
    }, React.createElement("span", {
      className: "dot",
      style: {
        background: color
      }
    }), React.createElement("strong", null, e.subject)), e.notes && String(e.notes).trim() ? React.createElement("small", {
      className: "notes-hint"
    }, React.createElement(UI.Icon, {
      name: "edit",
      size: 11
    }), " \u0645\u0644\u0627\u062D\u0638\u0629 \u0645\u062D\u0641\u0648\u0638\u0629") : null), React.createElement("td", {
      "data-label": "\u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0648\u0627\u0644\u0648\u0642\u062A"
    }, Core.fmtDate(e.date), React.createElement("small", {
      className: "muted block"
    }, e.time)), React.createElement("td", {
      "data-label": "\u0627\u0644\u0634\u0627\u0628\u062A\u0631\u0627\u062A"
    }, e.chapters), React.createElement("td", {
      "data-label": "\u0627\u0644\u0633\u0644\u0627\u064A\u062F\u0627\u062A"
    }, e.slides), React.createElement("td", {
      "data-label": "\u0633\u0644\u0627\u064A\u062F/\u0634\u0627\u0628\u062A\u0631"
    }, avg), React.createElement("td", {
      "data-label": "\u0627\u0644\u0627\u0633\u062A\u0639\u062F\u0627\u062F"
    }, e._ready.target > 0 ? React.createElement("span", {
      className: "ready-cell"
    }, React.createElement(UI.ProgressBar, {
      pct: e._ready.pct,
      color: color,
      height: 6
    }), React.createElement(UI.GradeBadge, {
      g: grade,
      compact: true
    })) : React.createElement("small", {
      className: "muted"
    }, "\u0628\u0644\u0627 \u062E\u0637\u0629")), React.createElement("td", {
      "data-label": "\u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0645\u062A\u0628\u0642\u064A"
    }, React.createElement("span", {
      className: 'cd-badge ' + cdClass
    }, e._cd.done ? 'انتهى' : Core.fmtDur(e._cd.total / 1000))), React.createElement("td", {
      "data-label": "\u0627\u0644\u0648\u062A\u064A\u0631\u0629"
    }, React.createElement(UI.PaceChip, {
      pace: e._pace
    })), React.createElement("td", {
      "data-label": "\u0625\u062C\u0631\u0627\u0621\u0627\u062A"
    }, React.createElement("div", {
      className: "action-group"
    }, hasPlan ? React.createElement("button", {
      type: "button",
      className: "icon-btn teal",
      title: "\u062A\u0648\u0644\u064A\u062F \u062E\u0637\u0629 \u0630\u0643\u064A\u0629",
      "aria-label": "\u062A\u0648\u0644\u064A\u062F \u062E\u0637\u0629 \u0630\u0643\u064A\u0629",
      onClick: function () {
        onGenerate(e);
      }
    }, React.createElement(UI.Icon, {
      name: "zap",
      size: 14
    })) : null, React.createElement("button", {
      type: "button",
      className: "icon-btn amber",
      title: "\u062A\u0639\u062F\u064A\u0644",
      "aria-label": "\u062A\u0639\u062F\u064A\u0644",
      onClick: function () {
        setEditing(e);
      }
    }, React.createElement(UI.Icon, {
      name: "edit",
      size: 14
    })), React.createElement("button", {
      type: "button",
      className: "icon-btn sky",
      title: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A",
      "aria-label": "\u0645\u0644\u0627\u062D\u0638\u0627\u062A",
      onClick: function () {
        onNotes(e);
      }
    }, React.createElement(UI.Icon, {
      name: "info",
      size: 14
    })), React.createElement("button", {
      type: "button",
      className: "icon-btn red",
      title: "\u062D\u0630\u0641",
      "aria-label": "\u062D\u0630\u0641",
      onClick: function () {
        onDelete(e);
      }
    }, React.createElement(UI.Icon, {
      name: "trash",
      size: 14
    })))));
  }))))), editing ? React.createElement(ExamFormModal, {
    exam: editing,
    onClose: function () {
      setEditing(null);
    },
    onSave: onUpdate
  }) : null);
};
const Screens1 = {
  LoginGate,
  Header,
  TodayFocus,
  HeroNextExam,
  ExamsTab
};