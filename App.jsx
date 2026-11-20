/* المكوّن الجذر: إدارة الحالة الكاملة + كل المعالجات + ربط الميزات الذكية */

const ProfileModal = function ProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    username: profile.username || '', email: profile.email || '', studentId: profile.studentId || '',
    college: profile.college || '', year: profile.year || '',
  });
  const [error, setError] = useState('');
  const upd = function (k, v) { setForm(function (f) { return Object.assign({}, f, { [k]: v }); }); };
  function submit(e) {
    e.preventDefault();
    if (!form.username.trim() || form.username.trim().length < 2) return setError('أدخل اسماً صحيحاً (حرفان على الأقل)');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('أدخل بريداً إلكترونياً صحيحاً');
    if (!form.studentId.trim()) return setError('الرقم الجامعي مطلوب');
    if (!form.college) return setError('اختر الكلية');
    if (!form.year) return setError('اختر السنة الدراسية');
    onSave({ username: form.username.trim(), email: form.email.trim(), studentId: form.studentId.trim(), college: form.college, year: form.year });
  }
  return (
    <UI.Modal open onClose={onClose} title="تعديل بيانات الطالب" icon="user">
      <form onSubmit={submit} className="form-grid modal-form" noValidate>
        <UI.Field label="اسم المستخدم" icon="user">
          <input type="text" value={form.username} onChange={function (e) { upd('username', e.target.value); }} autoFocus />
        </UI.Field>
        <UI.Field label="البريد الإلكتروني" icon="mail">
          <input type="email" dir="ltr" value={form.email} onChange={function (e) { upd('email', e.target.value); }} />
        </UI.Field>
        <UI.Field label="الرقم الجامعي" icon="hash">
          <input type="text" dir="ltr" value={form.studentId} onChange={function (e) { upd('studentId', e.target.value); }} />
        </UI.Field>
        <div className="field-row">
          <UI.Field label="الكلية" icon="cap" className="grow">
            <select value={form.college} onChange={function (e) { upd('college', e.target.value); }}>
              <option value="" disabled>اختر الكلية...</option>
              {Core.COLLEGES.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
            </select>
          </UI.Field>
          <UI.Field label="السنة" icon="layers">
            <select value={form.year} onChange={function (e) { upd('year', e.target.value); }}>
              <option value="" disabled>...</option>
              {Core.YEARS.map(function (y) { return <option key={y} value={y}>السنة {y}</option>; })}
            </select>
          </UI.Field>
        </div>
        {error ? <p className="field-error center"><UI.Icon name="alert" size={13} /> {error}</p> : null}
        <div className="confirm-actions">
          <button type="submit" className="btn btn-primary"><UI.Icon name="check" size={15} /> حفظ البيانات</button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>إلغاء</button>
        </div>
      </form>
    </UI.Modal>
  );
};

const App = function App() {
  /* ---------- الحالة ---------- */
  const [profile, setProfile] = useState(null);
  const [exams, setExams] = useState([]);
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState({});
  const [achievements, setAchievements] = useState({});
  const [settings, setSettings] = useState({ theme: 'light', dailyGoalMin: 60, pomo: Algo.POMO_DEFAULTS });
  const [pomoSessions, setPomoSessions] = useState(0);
  const [notifs, setNotifs] = useState([]);
  const [notifStatus, setNotifStatus] = useState('default');
  const [now, setNow] = useState(Date.now());
  const [tab, setTab] = useState('exams');
  const [toasts, setToasts] = useState([]);
  const [quote, setQuote] = useState({ i: 0, text: Core.QUOTES[0] });
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmCfg, setConfirmCfg] = useState(null);
  const [pomoOpen, setPomoOpen] = useState(false);
  const [pomo, setPomo] = useState({ mode: 'focus', running: false, remainMs: Algo.POMO_DEFAULTS.focus * 60000, endsAt: 0, cycles: 0, planId: '' });
  const [smartExam, setSmartExam] = useState(null);
  const [notesExam, setNotesExam] = useState(null);
  const loadedRef = useRef(false);
  const settingsRef = useRef(settings);
  useEffect(function () { settingsRef.current = settings; }, [settings]);

  /* ---------- التحميل الأولي + الترحيل ---------- */
  useEffect(function () {
    Core.migrate();
    const p = Core.get(Core.K.profile, null);
    if (p && p.username && p.studentId) setProfile(p);
    const ex = (Core.get(Core.K.exams, []) || []).map(function (e) { return Object.assign({ notes: '' }, e); });
    const plRaw = Core.get(Core.K.plans, []) || [];
    const pl = plRaw.map(function (x) { return Object.assign({ schedule: [] }, x); });
    const st = Core.get(Core.K.stats, { daily: {}, notified: [] });
    const re = Core.rebaseRunning(pl, st.daily || {});
    if (re.changed) {
      Core.set(Core.K.plans, re.plans);
      Core.set(Core.K.stats, { daily: re.stats, notified: st.notified || [] });
    }
    setExams(ex);
    setPlans(re.plans);
    setStats(re.stats);
    setAchievements(Core.get(Core.K.achievements, {}));
    const pm = Core.get(Core.K.pomo, { sessions: 0 });
    setPomoSessions(parseInt(pm.sessions, 10) || 0);
    const s = Core.get(Core.K.settings, {});
    const merged = {
      theme: s.theme === 'dark' ? 'dark' : 'light',
      dailyGoalMin: parseInt(s.dailyGoalMin, 10) > 0 ? parseInt(s.dailyGoalMin, 10) : 60,
      pomo: Object.assign({}, Algo.POMO_DEFAULTS, s.pomo || {}),
    };
    setSettings(merged);
    document.documentElement.dataset.theme = merged.theme;
    setNotifs(Core.get(Core.K.notifs, []));
    const qi = Core.get(Core.K.quote, 0);
    setQuote({ i: qi, text: Core.QUOTES[qi % Core.QUOTES.length] });
    if (typeof Notification !== 'undefined') setNotifStatus(Notification.permission || 'default');
    else setNotifStatus('unsupported');
    loadedRef.current = true;
  }, []);

  /* ---------- عدّاد الوقت (كل ثانية) ---------- */
  useEffect(function () {
    const t = setInterval(function () { setNow(Date.now()); }, 1000);
    return function () { clearInterval(t); };
  }, []);

  /* ---------- الحفظ التلقائي ---------- */
  useEffect(function () { if (loadedRef.current) Core.set(Core.K.profile, profile); }, [profile]);
  useEffect(function () { if (loadedRef.current) Core.set(Core.K.exams, exams); }, [exams]);
  useEffect(function () { if (loadedRef.current) Core.set(Core.K.plans, plans); }, [plans]);
  useEffect(function () {
    if (!loadedRef.current) return;
    const notified = Core.get(Core.K.stats, { daily: {}, notified: [] }).notified || notifs;
    Core.set(Core.K.stats, { daily: stats, notified });
  }, [stats]);
  useEffect(function () { if (loadedRef.current) Core.set(Core.K.notifs, notifs); }, [notifs]);
  useEffect(function () { if (loadedRef.current) Core.set(Core.K.achievements, achievements); }, [achievements]);
  useEffect(function () { if (loadedRef.current) Core.set(Core.K.pomo, { sessions: pomoSessions }); }, [pomoSessions]);
  useEffect(function () {
    if (!loadedRef.current) return;
    Core.set(Core.K.settings, settings);
    document.documentElement.dataset.theme = settings.theme;
  }, [settings]);

  /* ---------- تدوير العبارة التحفيزية تلقائياً ---------- */
  useEffect(function () {
    const t = setInterval(function () {
      if (document.hidden) return;
      setQuote(function (q) {
        const i = (q.i + 1) % Core.QUOTES.length;
        Core.set(Core.K.quote, i);
        return { i, text: Core.QUOTES[i] };
      });
    }, 14000);
    return function () { clearInterval(t); };
  }, []);

  /* ---------- التنبيهات Toast ---------- */
  const addToast = useCallback(function (type, title, msg) {
    const id = Core.uid();
    setToasts(function (ts) { return ts.concat([{ id, type, title, msg }]); });
    setTimeout(function () {
      setToasts(function (ts) { return ts.filter(function (t) { return t.id !== id; }); });
    }, 4200);
  }, []);
  const dismissToast = useCallback(function (id) {
    setToasts(function (ts) { return ts.filter(function (t) { return t.id !== id; }); });
  }, []);

  const openConfirm = useCallback(function (cfg) {
    setConfirmCfg(Object.assign({ open: true }, cfg, {
      onClose: function () { setConfirmCfg(null); },
      onConfirm: function () { setConfirmCfg(null); cfg.onConfirm(); },
    }));
  }, []);

  /* ---------- تقييم الإنجازات ---------- */
  useEffect(function () {
    if (!loadedRef.current) return;
    const satisfied = Core.evalAchievements({ exams, plans, stats, settings, now: Date.now(), extras: { pomoSessions } });
    const newOnes = satisfied.filter(function (id) { return !achievements[id]; });
    if (newOnes.length) {
      const stamp = Core.todayStr() + ' ' + new Date().toTimeString().slice(0, 5);
      setAchievements(function (m) {
        const next = Object.assign({}, m);
        let added = false;
        newOnes.forEach(function (id) { if (!next[id]) { next[id] = stamp; added = true; } });
        return added ? next : m;
      });
      const a = Core.ACH.find(function (x) { return x.id === newOnes[0]; });
      if (a) {
        addToast('success', '🏆 إنجاز جديد: ' + a.title, a.desc);
        Core.fireConfetti();
      }
    }
  }, [exams, plans, stats, settings, achievements, pomoSessions, addToast]);

  /* ---------- إشعارات الامتحانات القريبة ---------- */
  useEffect(function () {
    if (notifStatus !== 'granted') return;
    const notifiedList = Core.get(Core.K.stats, { daily: {}, notified: [] }).notified || [];
    let changed = false;
    exams.forEach(function (e) {
      const cd = Core.countdown(e, now);
      if (!cd.done && cd.total < 24 * 3600000 && !notifiedList.includes(e.id)) {
        try {
          new Notification('⏰ امتحان قريب: ' + e.subject, { body: 'يبدأ بعد ' + Core.fmtDur(cd.total / 1000) + ' — بالتوفيق!', tag: e.id });
        } catch (err) { /* غير مدعوم */ }
        notifiedList.push(e.id);
        changed = true;
      }
    });
    if (changed) {
      setNotifs(notifiedList);
      Core.set(Core.K.stats, { daily: stats, notified: notifiedList });
    }
  }, [exams, notifStatus, now, stats]);

  /* ---------- البومودورو: آلة حالات ---------- */
  const pomoRef = useRef(pomo);
  useEffect(function () { pomoRef.current = pomo; }, [pomo]);

  const completePomoPhase = useCallback(function () {
    const st = pomoRef.current;
    const s = settingsRef.current;
    if (st.mode === 'focus') {
      const mins = Algo.pomoMinutes('focus', s);
      setPomoSessions(function (v) { return v + 1; });
      setStats(function (prev) {
        const next = Object.assign({}, prev);
        const k = Core.todayStr();
        next[k] = (next[k] || 0) + mins * 60;
        return next;
      });
      if (st.planId) {
        setPlans(function (ps) {
          return ps.map(function (p) {
            return p.id === st.planId ? Object.assign({}, p, { elapsedSeconds: (p.elapsedSeconds || 0) + mins * 60 }) : p;
          });
        });
      }
      addToast('success', '🎯 جلسة تركيز اكتملت!', mins + ' دقيقة موفقة — قوم باستراحة الآن.');
      const nextMode = Algo.pomoNext('focus', st.cycles);
      setPomo(function (p) {
        return Object.assign({}, p, {
          mode: nextMode, cycles: p.cycles + 1, running: true,
          endsAt: Date.now() + Algo.pomoMinutes(nextMode, s) * 60000, remainMs: 0,
        });
      });
    } else {
      addToast('info', 'انتهت الاستراحة ☕', 'هيا نعود لجلسة تركيز جديدة!');
      setPomo(function (p) {
        return Object.assign({}, p, {
          mode: 'focus', running: true,
          endsAt: Date.now() + Algo.pomoMinutes('focus', s) * 60000, remainMs: 0,
        });
      });
    }
  }, [addToast]);

  useEffect(function () {
    if (!pomo.running) return;
    if (now < pomo.endsAt) return;
    completePomoPhase();
  }, [now, pomo.running, pomo.endsAt, completePomoPhase]);

  function pomoStart() {
    setPomo(function (p) {
      const remain = p.remainMs > 0 ? p.remainMs : Algo.pomoMinutes(p.mode, settingsRef.current) * 60000;
      return Object.assign({}, p, { running: true, endsAt: Date.now() + remain, remainMs: 0 });
    });
  }
  function pomoPause() {
    setPomo(function (p) {
      const remain = p.running ? Math.max(0, p.endsAt - Date.now()) : p.remainMs;
      return Object.assign({}, p, { running: false, remainMs: remain, endsAt: 0 });
    });
  }
  function pomoSkip() { completePomoPhase(); }

  /* ---------- معالجات: الحساب ---------- */
  function handleLogin(data) {
    setProfile(data);
    addToast('success', 'أهلاً ' + data.username + ' 👋', 'تم تجهيز منظمك الدراسي — بالتوفيق!');
  }
  function demoLogin() {
    setProfile(Core.demoProfile);
    if (exams.length === 0) {
      const demo = Core.demoContent();
      setExams(demo.exams);
      setPlans(demo.plans);
      const daily = Object.assign({}, stats);
      const d1 = new Date(); d1.setDate(d1.getDate() - 1);
      const d2 = new Date(); d2.setDate(d2.getDate() - 2);
      daily[Core.todayStr(d1)] = (daily[Core.todayStr(d1)] || 0) + 5400;
      daily[Core.todayStr(d2)] = (daily[Core.todayStr(d2)] || 0) + 4200;
      setStats(daily);
      addToast('info', 'تم تجهيز بيانات تجريبية', 'أُضيفت مواد وخطط وجدول ذكي توضيحي — امسحها من الإعدادات متى شئت.');
    } else {
      addToast('info', 'دخول تجريبي', 'جدولك الحالي محفوظ ولم يتغير.');
    }
  }

  /* ---------- معالجات: المواد ---------- */
  function addExam(data) {
    setExams(function (xs) { return xs.concat([Object.assign({ id: Core.uid(), notes: '', createdAt: Date.now() }, data)]); });
    addToast('success', 'أُضيفت المادة', data.subject + ' — بدأ العد التنازلي!');
  }
  function updateExam(id, data) {
    setExams(function (xs) { return xs.map(function (e) { return e.id === id ? Object.assign({}, e, data) : e; }); });
    addToast('success', 'تم تحديث المادة', data.subject);
  }
  function saveNotes(id, text) {
    setExams(function (xs) { return xs.map(function (e) { return e.id === id ? Object.assign({}, e, { notes: text }) : e; }); });
    setNotesExam(null);
    addToast('success', 'حُفظت الملاحظة', 'ستظهر كعلامة ذكية في جدول الامتحانات.');
  }
  function deleteExamFlow(exam) {
    const linked = plans.filter(function (p) { return p.examId === exam.id; });
    openConfirm({
      title: 'حذف المادة', icon: 'trash', danger: true, confirmText: 'نعم، احذف',
      message: linked.length
        ? 'سيتم حذف المادة "' + exam.subject + '" و' + linked.length + ' خطة مذاكرة مرتبطة بها (مع جدولها الذكي). هل أنت متأكد؟'
        : 'سيتم حذف المادة "' + exam.subject + '" نهائياً من الجدول. هل أنت متأكد؟',
      onConfirm: function () {
        setExams(function (xs) { return xs.filter(function (e) { return e.id !== exam.id; }); });
        setPlans(function (ps) { return ps.filter(function (p) { return p.examId !== exam.id; }); });
        setSmartExam(function (se) { return se && se.id === exam.id ? null : se; });
        addToast('info', 'تم الحذف', exam.subject);
      },
    });
  }

  /* ---------- معالجات: الخطط ---------- */
  function addPlan(data) {
    setPlans(function (ps) {
      return ps.concat([Object.assign({
        id: Core.uid(), elapsedSeconds: 0, isRunning: false, lastStartTime: null,
        isCompleted: false, completedAt: null, createdAt: Date.now(), schedule: [], generated: false,
      }, data)]);
    });
    addToast('success', data.generated ? '🧠 وُلّدت خطة ذكية!' : 'أُنشئت الخطة',
      data.subject + (data.generated ? ' — الجدول الذكي جاهز داخل بطاقة الخطة.' : ' — هدف يومي جاهز للبدء!'));
  }
  function updatePlan(id, data) {
    setPlans(function (ps) { return ps.map(function (p) { return p.id === id ? Object.assign({}, p, data) : p; }); });
    addToast('success', 'تم تحديث الخطة', data.subject);
  }
  function togglePlanDay(planId, date) {
    setPlans(function (ps) {
      return ps.map(function (p) {
        if (p.id !== planId || !p.schedule) return p;
        return Object.assign({}, p, {
          schedule: p.schedule.map(function (s) {
            return s.date === date ? Object.assign({}, s, { done: !s.done }) : s;
          }),
        });
      });
    });
  }
  function deletePlanFlow(plan) {
    openConfirm({
      title: 'حذف الخطة', icon: 'trash', danger: true, confirmText: 'نعم، احذف',
      message: 'سيتم حذف خطة مذاكرة "' + plan.subject + '" مع الوقت المسجل فيها (' + Core.fmtDur(Core.planElapsed(plan, now)) + ')' + (plan.schedule && plan.schedule.length ? ' وجدولها الذكي' : '') + '. هل أنت متأكد؟',
      onConfirm: function () {
        setPlans(function (ps) { return ps.filter(function (p) { return p.id !== plan.id; }); });
        addToast('info', 'تم حذف الخطة', plan.subject);
      },
    });
  }
  function applyFlush(plan) {
    const res = Core.flushPlan(plan, Date.now());
    if (res.session > 0) {
      setStats(function (s) {
        const next = Object.assign({}, s);
        next[res.dayKey] = (next[res.dayKey] || 0) + res.session;
        return next;
      });
    }
    return res.plan;
  }
  function toggleTimer(plan) {
    if (plan.isRunning) {
      const stopped = applyFlush(plan);
      setPlans(function (ps) { return ps.map(function (p) { return p.id === plan.id ? stopped : p; }); });
      addToast('info', 'تم إيقاف المؤقت', plan.subject + ' — سُجل ' + Core.fmtDur(stopped.elapsedSeconds) + ' إجمالاً.');
    } else {
      setPlans(function (ps) {
        return ps.map(function (p) { return p.id === plan.id ? Object.assign({}, p, { isRunning: true, lastStartTime: Date.now() }) : p; });
      });
      addToast('success', 'انطلق! 🚀', 'بدأ مؤقت المذاكرة لمادة ' + plan.subject);
    }
  }
  function resetTimerFlow(plan) {
    openConfirm({
      title: 'تصفير المؤقت', icon: 'rotateCcw', danger: true, confirmText: 'نعم، صفّر',
      message: 'سيتم تصفير وقت خطة "' + plan.subject + '" (' + Core.fmtDur(Core.planElapsed(plan, now)) + '). لا يمكن التراجع.',
      onConfirm: function () {
        setPlans(function (ps) {
          return ps.map(function (p) { return p.id === plan.id ? Object.assign({}, p, { elapsedSeconds: 0, isRunning: false, lastStartTime: null }) : p; });
        });
        addToast('info', 'تم التصفير', plan.subject);
      },
    });
  }
  function toggleComplete(plan) {
    if (!plan.isCompleted) {
      const stopped = plan.isRunning ? applyFlush(plan) : plan;
      setPlans(function (ps) {
        return ps.map(function (p) { return p.id === plan.id ? Object.assign({}, stopped, { isCompleted: true, completedAt: Core.todayStr() }) : p; });
      });
      Core.fireConfetti();
      addToast('success', '🎉 أحسنت! خطة مكتملة', plan.subject + ' — جرّب مراجعة سريعة قبل الامتحان.');
    } else {
      setPlans(function (ps) {
        return ps.map(function (p) { return p.id === plan.id ? Object.assign({}, p, { isCompleted: false, completedAt: null }) : p; });
      });
      addToast('info', 'أعيدت الخطة للمراجعة', plan.subject);
    }
  }
  function startTodaySession() {
    if (!todayFocus) return;
    const target = plans.find(function (p) { return p.examId === todayFocus.top.exam.id && !p.isCompleted; });
    if (target) {
      setTab('plans');
      if (!target.isRunning) toggleTimer(target);
      else addToast('info', 'المؤقت يعمل بالفعل', target.subject + ' — واصل التركيز!');
    } else {
      setTab('plans');
      addToast('info', 'لا توجد خطة لهذه المادة', 'أنشئ خطة من تبويب خطة المذاكرة أو ولّدها بالمولد الذكي.');
    }
  }

  /* ---------- معالجات: الإعدادات والبيانات ---------- */
  function toggleTheme() {
    setSettings(function (s) { return Object.assign({}, s, { theme: s.theme === 'dark' ? 'light' : 'dark' }); });
  }
  function setGoal(min) {
    setSettings(function (s) { return Object.assign({}, s, { dailyGoalMin: min }); });
  }
  function setPomoField(key, val) {
    setSettings(function (s) {
      return Object.assign({}, s, { pomo: Object.assign({}, s.pomo, { [key]: val }) });
    });
  }
  function handleExport() {
    const backup = Core.buildBackup({ profile, exams, plans, stats, settings, achievements, pomo: { sessions: pomoSessions } });
    const ok = Core.downloadJSON(backup, 'med-final-study-backup-' + Core.todayStr() + '.json');
    if (ok) {
      setAchievements(function (m) { return Object.assign({}, m, { backup: Core.todayStr() + ' ' + new Date().toTimeString().slice(0, 5) }); });
      addToast('success', 'تم التصدير', 'نزّل ملف النسخة الاحتياطية واحفظه بأمان.');
    } else addToast('error', 'فشل التصدير', 'المتصفح منع التنزيل — جرّب مرة أخرى.');
  }
  function handleImportFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const obj = JSON.parse(reader.result);
        const v = Core.validateImport(obj);
        if (!v.ok) return addToast('error', 'استيراد فاشل', v.error);
        const d = v.data;
        setExams((d.exams || []).map(function (x) { return Object.assign({ notes: '' }, x, { id: x.id || Core.uid() }); }));
        setPlans((d.plans || []).map(function (p) { return Object.assign({ schedule: [] }, p, { id: p.id || Core.uid(), isRunning: false, lastStartTime: null }); }));
        setStats((d.stats && d.stats.daily) ? d.stats.daily : {});
        if (d.profile && d.profile.username) setProfile(d.profile);
        setSettings(function (s) {
          return Object.assign({}, s, {
            theme: d.settings && d.settings.theme === 'dark' ? 'dark' : s.theme,
            dailyGoalMin: d.settings && parseInt(d.settings.dailyGoalMin, 10) > 0 ? parseInt(d.settings.dailyGoalMin, 10) : s.dailyGoalMin,
            pomo: Object.assign({}, s.pomo, (d.settings && d.settings.pomo) || {}),
          });
        });
        if (d.achievements) setAchievements(d.achievements);
        if (d.pomo) setPomoSessions(parseInt(d.pomo.sessions, 10) || 0);
        addToast('success', 'تم الاستيراد بنجاح', 'استُعيدت كل بياناتك من النسخة الاحتياطية.');
      } catch (err) {
        addToast('error', 'استيراد فاشل', 'تعذر قراءة الملف — تأكد أنه ملف نسخة صحيح.');
      }
    };
    reader.readAsText(file);
  }
  function loadDemoContent() {
    if (exams.length > 0) {
      addToast('info', 'الجدول ليس فارغاً', 'البيانات التجريبية تُضاف فقط عندما يكون جدول الامتحانات فارغاً.');
      return;
    }
    const demo = Core.demoContent();
    setExams(demo.exams);
    setPlans(demo.plans);
    const daily = Object.assign({}, stats);
    const d1 = new Date(); d1.setDate(d1.getDate() - 1);
    daily[Core.todayStr(d1)] = (daily[Core.todayStr(d1)] || 0) + 5400;
    setStats(daily);
    addToast('success', 'تم تحميل بيانات تجريبية', 'استكشف الميزات ثم امسحها من منطقة الخطر.');
  }
  function resetAllFlow() {
    openConfirm({
      title: 'مسح جميع البيانات', icon: 'alert', danger: true, confirmText: 'نعم، امسح كل شيء',
      message: 'سيتم مسح حسابك وجميع المواد والخطط والجداول الذكية والإحصائيات والإنجازات نهائياً من هذا الجهاز. ننصح بتصدير نسخة احتياطية أولاً. هل أنت متأكد؟',
      onConfirm: function () {
        Object.keys(Core.K).forEach(function (k) { try { localStorage.removeItem(Core.K[k]); } catch (e) { /* تجاهل */ } });
        setProfile(null);
        setExams([]); setPlans([]); setStats({}); setAchievements({});
        setSettings({ theme: settings.theme, dailyGoalMin: 60, pomo: Algo.POMO_DEFAULTS });
        setPomoSessions(0);
        setPomo({ mode: 'focus', running: false, remainMs: Algo.POMO_DEFAULTS.focus * 60000, endsAt: 0, cycles: 0, planId: '' });
        setNotifs([]);
        setTab('exams');
        setPomoOpen(false);
        addToast('info', 'تم مسح جميع البيانات', 'أُعيد المنظم إلى حالته الأولى.');
      },
    });
  }
  function enableNotifs() {
    if (typeof Notification === 'undefined') { setNotifStatus('unsupported'); return; }
    Notification.requestPermission().then(function (st) {
      setNotifStatus(st);
      if (st === 'granted') addToast('success', 'التنبيهات مفعّلة 🔔', 'سننبّهك قبل كل امتحان بأقل من 24 ساعة.');
      else if (st === 'denied') addToast('error', 'تم رفض التنبيهات', 'يمكنك تفعيلها لاحقاً من إعدادات المتصفح.');
    });
  }
  function newQuote() {
    setQuote(function (q) {
      let i = Math.floor(Math.random() * Core.QUOTES.length);
      if (i === q.i) i = (i + 1) % Core.QUOTES.length;
      Core.set(Core.K.quote, i);
      return { i, text: Core.QUOTES[i] };
    });
  }
  function goAddExam() {
    setTab('exams');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function goCalendar() {
    setTab('calendar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const totalStudy = Core.totalStudySeconds(plans, now);
  const streak = Core.streakInfo(stats, settings.dailyGoalMin);
  const todayFocus = useMemo(function () {
    return Algo.todayFocus(exams, plans, now);
  }, [exams, plans, now]);

  const TABS = [
    { id: 'exams', label: 'الامتحانات', icon: 'book' },
    { id: 'plans', label: 'خطة المذاكرة', icon: 'hourglass' },
    { id: 'calendar', label: 'التقويم', icon: 'calendar' },
    { id: 'stats', label: 'الإحصائيات', icon: 'chart' },
    { id: 'ach', label: 'الإنجازات', icon: 'award' },
    { id: 'settings', label: 'الإعدادات', icon: 'sliders' },
  ];

  return (
    <Fragment>
      <div className="bg-aurora" aria-hidden="true">
        <span className="aur a1" /><span className="aur a2" /><span className="aur a3" /><span className="aur a4" />
        <span className="noise" />
      </div>

      <Screens1.Header
        theme={settings.theme} onToggleTheme={toggleTheme}
        quote={quote} onNewQuote={newQuote}
        notifStatus={notifStatus} onEnableNotifs={enableNotifs}
        onTogglePomo={function () { setPomoOpen(!pomoOpen); }} pomoOpen={pomoOpen}
      />

      <main className="container main-area">
        {!profile ? (
          <Screens1.LoginGate onLogin={handleLogin} onDemo={demoLogin} />
        ) : (
          <Fragment>
            <div className="student-banner glass">
              <span className="avatar small">{mfsInitials(profile.username)}</span>
              <div className="banner-text">
                <strong>أهلاً {profile.username} 👋</strong>
                <span className="muted">{profile.college} — السنة {profile.year} • الرقم الجامعي {profile.studentId}</span>
              </div>
              <div className="banner-actions">
                <button type="button" className="btn btn-soft" onClick={function () { setProfileOpen(true); }}>
                  <UI.Icon name="edit" size={13} /> تعديل البيانات
                </button>
              </div>
            </div>

            {todayFocus && todayFocus.top && todayFocus.top.score > 0 ? (
              <Screens1.TodayFocus focus={todayFocus} onStartPlan={startTodaySession} onGoPlans={function () { setTab('plans'); }} />
            ) : null}

            <Screens1.HeroNextExam
              exams={exams} plans={plans} now={now} streak={streak}
              totalStudy={totalStudy} onGoAdd={goAddExam} onGoCalendar={goCalendar} profile={profile}
            />

            <UI.Tabs tabs={TABS} active={tab} onChange={setTab} />

            {tab === 'exams' ? (
              <Screens1.ExamsTab
                exams={exams} plans={plans} now={now} streakPct={streak.todayPct}
                onAdd={addExam} onUpdate={updateExam} onDelete={deleteExamFlow}
                onNotes={function (e) { setNotesExam(e); }}
                onGenerate={function (e) { setSmartExam(e); }}
              />
            ) : null}
            {tab === 'plans' ? (
              <Screens2.PlansTab
                exams={exams} plans={plans} now={now}
                onAdd={addPlan} onUpdate={updatePlan} onDelete={deletePlanFlow}
                onComplete={toggleComplete} onTimerToggle={toggleTimer} onTimerReset={resetTimerFlow}
                onToggleDay={togglePlanDay} onGenerate={function (e) { setSmartExam(e); }}
              />
            ) : null}
            {tab === 'calendar' ? (
              <Screens3.CalendarTab exams={exams} plans={plans} now={now} onToggleDay={togglePlanDay} />
            ) : null}
            {tab === 'stats' ? (
              <Screens2.StatsTab exams={exams} plans={plans} stats={stats} settings={settings} now={now} pomoSessions={pomoSessions} />
            ) : null}
            {tab === 'ach' ? (
              <Screens2.AchievementsTab achMap={achievements} exams={exams} plans={plans} stats={stats} settings={settings} now={now} pomoSessions={pomoSessions} />
            ) : null}
            {tab === 'settings' ? (
              <Screens2.SettingsTab
                profile={profile} settings={settings} notifStatus={notifStatus} pomoSessions={pomoSessions}
                onEditProfile={function () { setProfileOpen(true); }}
                onTheme={function (t) { setSettings(function (s) { return Object.assign({}, s, { theme: t }); }); }}
                onGoal={setGoal} onPomo={setPomoField} onExport={handleExport} onImportFile={handleImportFile}
                onDemo={loadDemoContent} onResetAll={resetAllFlow} onEnableNotifs={enableNotifs}
              />
            ) : null}
          </Fragment>
        )}
      </main>

      <Screens2.Footer />

      {pomoOpen && profile ? (
        <Screens3.PomodoroWidget
          pomo={pomo} settings={settings} plans={plans} now={now}
          onStart={pomoStart} onPause={pomoPause} onSkip={pomoSkip}
          onClose={function () { setPomoOpen(false); }}
          onLinkPlan={function (id) { setPomo(function (p) { return Object.assign({}, p, { planId: id }); }); }}
        />
      ) : null}

      <UI.Toasts items={toasts} onDismiss={dismissToast} />
      <UI.ConfirmDialog cfg={confirmCfg} />
      {profileOpen && profile ? (
        <ProfileModal
          profile={profile}
          onClose={function () { setProfileOpen(false); }}
          onSave={function (data) { setProfile(data); setProfileOpen(false); addToast('success', 'تم حفظ البيانات', 'أهلاً ' + data.username + '!'); }}
        />
      ) : null}
      {smartExam ? (
        <Screens3.SmartPlanModal
          exam={smartExam} exams={exams}
          onClose={function () { setSmartExam(null); }}
          onCreate={function (data) { setSmartExam(null); addPlan(data); setTab('plans'); }}
        />
      ) : null}
      {notesExam ? (
        <Screens3.NotesModal
          exam={notesExam}
          onClose={function () { setNotesExam(null); }}
          onSave={saveNotes}
        />
      ) : null}
    </Fragment>
  );
};
