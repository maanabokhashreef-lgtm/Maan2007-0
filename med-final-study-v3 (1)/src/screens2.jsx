/* الشاشات 2: خطط المذاكرة، الإحصائيات، الإنجازات، الإعدادات، الفوتر */

/* ============ نافذة تعديل خطة ============ */
const PlanFormModal = function PlanFormModal({ plan, exams, onClose, onSave }) {
  const [form, setForm] = useState({ examId: plan.examId || '', startDate: plan.startDate, endDate: plan.endDate, dailyHours: String(plan.dailyHours) });
  const [error, setError] = useState('');
  const upd = function (k, v) { setForm(function (f) { return Object.assign({}, f, { [k]: v }); }); };
  function submit(e) {
    e.preventDefault();
    if (!form.examId) return setError('اختر المادة المرتبطة بالخطة');
    if (!form.startDate) return setError('تاريخ البداية مطلوب');
    if (!form.endDate) return setError('تاريخ النهاية مطلوب');
    if (form.endDate < form.startDate) return setError('تاريخ النهاية يجب أن يكون بعد تاريخ البداية أو مساوياً له');
    const h = parseFloat(form.dailyHours);
    if (!(h > 0) || h > 16) return setError('ساعات الدراسة اليومية يجب أن تكون بين 0.5 و 16');
    onSave(plan.id, { examId: form.examId, subject: (exams.find(function (x) { return x.id === form.examId; }) || {}).subject || plan.subject, startDate: form.startDate, endDate: form.endDate, dailyHours: h });
  }
  return (
    <UI.Modal open onClose={onClose} title="تعديل خطة المذاكرة" icon="edit">
      <form onSubmit={submit} className="form-grid modal-form" noValidate>
        <UI.Field label="المادة المرتبطة" icon="book">
          <select value={form.examId} onChange={function (e) { upd('examId', e.target.value); }}>
            <option value="" disabled>اختر المادة...</option>
            {exams.map(function (x) { return <option key={x.id} value={x.id}>{x.subject}</option>; })}
          </select>
        </UI.Field>
        <div className="field-row">
          <UI.Field label="تاريخ البداية" icon="calendar" className="grow">
            <input type="date" value={form.startDate} onChange={function (e) { upd('startDate', e.target.value); }} />
          </UI.Field>
          <UI.Field label="تاريخ النهاية" icon="calendar" className="grow">
            <input type="date" value={form.endDate} onChange={function (e) { upd('endDate', e.target.value); }} />
          </UI.Field>
        </div>
        <UI.Field label="ساعات الدراسة يومياً" icon="clock">
          <input type="number" min="0.5" max="16" step="0.5" value={form.dailyHours} onChange={function (e) { upd('dailyHours', e.target.value); }} />
        </UI.Field>
        {error ? <p className="field-error center"><UI.Icon name="alert" size={13} /> {error}</p> : null}
        <div className="confirm-actions">
          <button type="submit" className="btn btn-primary"><UI.Icon name="check" size={15} /> حفظ التعديل</button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>إلغاء</button>
        </div>
      </form>
    </UI.Modal>
  );
};

/* ============ بطاقة خطة واحدة ============ */
const PlanCard = function PlanCard({ p, idx, exams, now, today, onComplete, onTimerToggle, onTimerReset, onToggleDay, onEdit, onDelete }) {
  const [schedOpen, setSchedOpen] = useState(false);
  const color = Core.colorOf(idx % Core.COLORS.length);
  const elapsed = Core.planElapsed(p, now);
  const pct = Core.planPct(p, now);
  const targetH = Core.planTargetHours(p);
  const days = Core.planDays(p);
  const dailySlides = Core.planDailySlides(p, exams);
  const exam = exams.find(function (x) { return x.id === p.examId; });
  const sched = p.schedule || [];
  const schedDone = sched.filter(function (s) { return s.done; }).length;
  const todayEntry = sched.find(function (s) { return s.date === today; });

  return (
    <div className={'plan-card glass' + (p.isCompleted ? ' done' : '') + (p.isRunning ? ' running' : '')} style={{ animationDelay: (idx * 50) + 'ms' }}>
      <div className="plan-head">
        <span className="dot big" style={{ background: color }} />
        <strong className="plan-subject">{p.subject}</strong>
        {p.generated ? <UI.Badge color="#0d9488"><UI.Icon name="zap" size={12} /> ذكية</UI.Badge> : null}
        {p.isRunning ? <UI.Badge color="#f59e0b"><span className="pulse-dot" /> يعمل</UI.Badge> : null}
        {p.isCompleted ? <UI.Badge color="#10b981"><UI.Icon name="checkCircle" size={12} /> مكتملة</UI.Badge> : null}
      </div>
      <div className="plan-meta">
        <span><UI.Icon name="calendar" size={13} /> {Core.fmtDate(p.startDate)} ← {Core.fmtDate(p.endDate)}</span>
        <span><UI.Icon name="clock" size={13} /> {days} يوم • {p.dailyHours} ساعة/يوم</span>
        {exam ? <span><UI.Icon name="zap" size={13} /> الامتحان: {Core.fmtDate(exam.date)} - {exam.time}</span> : null}
        {dailySlides ? <span><UI.Icon name="layers" size={13} /> هدف يومي: {dailySlides} سلايد</span> : null}
        {todayEntry && !todayEntry.done ? <span className="today-entry"><UI.Icon name="target" size={13} /> اليوم: {todayEntry.slides} سلايد (شابتر {todayEntry.chapters})</span> : null}
      </div>
      <div className="plan-progress">
        <div className="plan-progress-text">
          <span>{Core.fmtDur(elapsed)} من {targetH.toFixed(1)} ساعة</span>
          <strong>{pct}%</strong>
        </div>
        <UI.ProgressBar pct={pct} color={color} height={9} />
      </div>
      <div className="plan-timer">
        <span className={'timer-display' + (p.isRunning ? ' live' : '')} dir="ltr">{Core.fmtHMS(elapsed)}</span>
        <div className="action-group">
          <button type="button" className={'btn btn-sm ' + (p.isRunning ? 'btn-warning' : 'btn-success')}
            onClick={function () { onTimerToggle(p); }}>
            <UI.Icon name={p.isRunning ? 'pause' : 'play'} size={13} /> {p.isRunning ? 'إيقاف' : 'البدء'}
          </button>
          <button type="button" className="btn btn-sm btn-soft" title="تصفير المؤقت" onClick={function () { onTimerReset(p); }}>
            <UI.Icon name="rotateCcw" size={13} />
          </button>
        </div>
      </div>
      {sched.length ? (
        <div className="plan-schedule no-print">
          <button type="button" className={'sched-toggle' + (schedOpen ? ' open' : '')} onClick={function () { setSchedOpen(!schedOpen); }}>
            <UI.Icon name="layers" size={14} />
            <span>الجدول الذكي — {schedDone}/{sched.length} يوم مكتمل</span>
            <span className="sched-arrow"><UI.Icon name="chevronDown" size={14} /></span>
          </button>
          {schedOpen ? (
            <div className="sched-list">
              {sched.map(function (s) {
                return (
                  <label key={s.date} className={'sched-row' + (s.done ? ' done' : '') + (s.date === today ? ' today' : '')}>
                    <input type="checkbox" checked={Boolean(s.done)} onChange={function () { onToggleDay(p.id, s.date); }} />
                    <span className="sched-date">{s.dayName} {s.date.slice(5)}</span>
                    <span className="sched-target">{s.slides} سلايد • شابتر {s.chapters}</span>
                    <span className={'sched-load' + (s.heavy ? ' heavy' : s.light ? ' light' : '')}>{s.heavy ? 'ثقيل' : s.light ? 'خفيف' : 'متوازن'}</span>
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="plan-actions">
        <button type="button" className={'btn btn-sm ' + (p.isCompleted ? 'btn-soft' : 'btn-success-soft')} onClick={function () { onComplete(p); }}>
          <UI.Icon name={p.isCompleted ? 'refresh' : 'checkCircle'} size={13} /> {p.isCompleted ? 'استئناف المراجعة' : 'تم الإنهاء'}
        </button>
        <button type="button" className="icon-btn amber" title="تعديل الخطة" onClick={function () { onEdit(p); }}><UI.Icon name="edit" size={14} /></button>
        <button type="button" className="icon-btn red" title="حذف الخطة" onClick={function () { onDelete(p); }}><UI.Icon name="trash" size={14} /></button>
      </div>
    </div>
  );
};

/* ============ تبويب خطة المذاكرة ============ */
const PlansTab = function PlansTab({ exams, plans, now, onAdd, onUpdate, onDelete, onComplete, onTimerToggle, onTimerReset, onToggleDay, onGenerate }) {
  const [form, setForm] = useState({ examId: '', startDate: '', endDate: '', dailyHours: '' });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const today = Core.todayStr();

  const upd = function (k, v) {
    setForm(function (f) {
      const next = Object.assign({}, f, { [k]: v });
      // عند اختيار المادة: ملء التواريخ تلقائياً (البداية اليوم، النهاية تاريخ الامتحان)
      if (k === 'examId' && v) {
        const exam = exams.find(function (x) { return x.id === v; });
        if (exam) {
          if (!f.startDate) next.startDate = today;
          if (exam.date && (!f.endDate || f.endDate < exam.date)) next.endDate = exam.date;
        }
      }
      return next;
    });
  };

  const selectedExam = exams.find(function (x) { return x.id === form.examId; });
  const previewDays = form.startDate && form.endDate && form.endDate >= form.startDate
    ? Core.planDays({ startDate: form.startDate, endDate: form.endDate }) : null;
  const previewSlides = selectedExam && previewDays && selectedExam.slides
    ? Math.ceil(selectedExam.slides / previewDays) : null;

  function submit(e) {
    e.preventDefault();
    if (!form.examId) return setError('اختر المادة من جدول الامتحانات');
    if (!form.startDate) return setError('تاريخ البداية مطلوب');
    if (!form.endDate) return setError('تاريخ النهاية مطلوب');
    if (form.endDate < form.startDate) return setError('تاريخ النهاية يجب أن يكون بعد تاريخ البداية أو مساوياً له');
    const h = parseFloat(form.dailyHours);
    if (!(h > 0) || h > 16) return setError('ساعات الدراسة اليومية يجب أن تكون بين 0.5 و 16');
    setError('');
    const exam = exams.find(function (x) { return x.id === form.examId; });
    onAdd({ examId: form.examId, subject: exam ? exam.subject : '', startDate: form.startDate, endDate: form.endDate, dailyHours: h });
    setForm({ examId: '', startDate: '', endDate: '', dailyHours: '' });
  }

  const runningCount = plans.filter(function (p) { return p.isRunning; }).length;

  let shown = plans.slice();
  if (filter === 'active') shown = shown.filter(function (p) { return !p.isCompleted; });
  if (filter === 'done') shown = shown.filter(function (p) { return p.isCompleted; });
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    shown = shown.filter(function (p) { return p.subject.toLowerCase().includes(q); });
  }
  shown.sort(function (a, b) {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return (a.startDate || '').localeCompare(b.startDate || '');
  });

  const chips = [
    { id: 'all', label: 'الكل', n: plans.length },
    { id: 'active', label: 'قيد المذاكرة', n: plans.length - plans.filter(function (p) { return p.isCompleted; }).length },
    { id: 'done', label: 'مكتملة', n: plans.filter(function (p) { return p.isCompleted; }).length },
  ];

  return (
    <section className="tab-content">
      <div className="card">
        <UI.CardHeader icon="target" color="#10b981" title="إنشاء خطة مذاكرة"
          sub="اربط خطتك بمادة وحدد الفترة — أو دع المولد الذكي يوزع سلايداتك على الأيام بأوزان مدروسة.">
          {runningCount > 0 ? <UI.Badge color="#f59e0b"><span className="pulse-dot" /> {runningCount} مؤقت يعمل الآن</UI.Badge> : null}
        </UI.CardHeader>
        <form className="form-grid" onSubmit={submit} noValidate>
          <UI.Field label="المادة (من جدول الامتحانات)" icon="book" className="span-2">
            <select value={form.examId} onChange={function (e) { upd('examId', e.target.value); }}>
              <option value="" disabled>اختر المادة...</option>
              {exams.length === 0 ? <option value="" disabled>لا توجد مواد — أضف مادة أولاً في تبويب الامتحانات</option> : null}
              {exams.map(function (x) { return <option key={x.id} value={x.id}>{x.subject}</option>; })}
            </select>
          </UI.Field>
          <UI.Field label="تاريخ البداية" icon="calendar">
            <input type="date" value={form.startDate} onChange={function (e) { upd('startDate', e.target.value); }} />
          </UI.Field>
          <UI.Field label="تاريخ النهاية" icon="calendar">
            <input type="date" value={form.endDate} onChange={function (e) { upd('endDate', e.target.value); }} />
          </UI.Field>
          <UI.Field label="ساعات المذاكرة يومياً" icon="clock">
            <input type="number" min="0.5" max="16" step="0.5" placeholder="مثال: 3" value={form.dailyHours}
              onChange={function (e) { upd('dailyHours', e.target.value); }} />
          </UI.Field>
          <div className="field submit-field">
            <button type="submit" className="btn btn-success btn-block" disabled={exams.length === 0}>
              <UI.Icon name="plus" size={15} /> إضافة للخطة
            </button>
          </div>
        </form>
        {(previewDays && selectedExam) ? (
          <p className="form-hint">
            <UI.Icon name="info" size={13} /> معاينة الخطة: <strong>{previewDays}</strong> يوم × <strong>{form.dailyHours || '—'}</strong> ساعة/يوم
            = <strong>{previewDays && form.dailyHours ? (previewDays * parseFloat(form.dailyHours || 0)).toFixed(1) : '—'}</strong> ساعة إجمالية
            {previewSlides ? <> • هدف يومي: <strong>{previewSlides}</strong> سلايد</> : null}
            {exams.length ? <> — أو استخدم <button type="button" className="link-btn" onClick={function () { onGenerate(selectedExam); }}><UI.Icon name="zap" size={12} /> المولد الذكي</button> لتوزيع مدروس</> : null}
          </p>
        ) : null}
        {error ? <p className="field-error"><UI.Icon name="alert" size={13} /> {error}</p> : null}
      </div>

      <div className="card">
        <UI.CardHeader icon="hourglass" color="#0d9488" title="خطط المذاكرة" sub="شغّل المؤقت أثناء المذاكرة، وعلّم أيام الجدول الذكي عند إنهائها.">
          <div className="card-tools">
            <UI.SearchBox value={search} onChange={setSearch} placeholder="ابحث في الخطط..." />
            {exams.length ? (
              <button type="button" className="btn btn-primary btn-sm" onClick={function () { onGenerate(exams[0]); }}>
                <UI.Icon name="zap" size={13} /> توليد خطة ذكية
              </button>
            ) : null}
          </div>
        </UI.CardHeader>

        <div className="chips-row">
          {chips.map(function (c) {
            return (
              <button key={c.id} type="button" className={'chip' + (filter === c.id ? ' active' : '')} onClick={function () { setFilter(c.id); }}>
                {c.label} <span className="chip-n">{c.n}</span>
              </button>
            );
          })}
        </div>

        {plans.length === 0 ? (
          <UI.EmptyState icon="target" title="لا توجد خطط بعد"
            hint={exams.length ? 'أنشئ خطتك الأولى من النموذج أعلاه، أو ولّد خطة ذكية بضغطة واحدة.' : 'أضف مادة إلى جدول الامتحانات أولاً، ثم أنشئ خطة مذاكرة مرتبطة بها.'} />
        ) : shown.length === 0 ? (
          <UI.EmptyState icon="search" title="لا نتائج مطابقة" hint="جرّب تغيير البحث أو الفلتر." />
        ) : (
          <div className="plans-grid">
            {shown.map(function (p, idx) {
              return (
                <PlanCard key={p.id} p={p} idx={idx} exams={exams} now={now} today={today}
                  onComplete={onComplete} onTimerToggle={onTimerToggle} onTimerReset={onTimerReset}
                  onToggleDay={onToggleDay} onEdit={function (x) { setEditing(x); }} onDelete={onDelete} />
              );
            })}
          </div>
        )}
      </div>

      {editing ? <PlanFormModal plan={editing} exams={exams} onClose={function () { setEditing(null); }} onSave={onUpdate} /> : null}
    </section>
  );
};

/* ============ تبويب الإحصائيات ============ */
const StatsTab = function StatsTab({ exams, plans, stats, settings, now, pomoSessions }) {
  const totalStudy = Core.totalStudySeconds(plans, now);
  const completed = plans.filter(function (p) { return p.isCompleted; }).length;
  const completionPct = plans.length ? Math.round((completed / plans.length) * 100) : 0;
  const totalSlides = exams.reduce(function (a, e) { return a + (parseInt(e.slides, 10) || 0); }, 0);

  // آخر 7 أيام
  const week = useMemo(function () {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = Core.todayStr(d);
      out.push({ key, label: Core.dayShort(key), sec: stats[key] || 0 });
    }
    return out;
  }, [stats]);
  const maxSec = Math.max.apply(null, week.map(function (w) { return w.sec; }).concat([1]));

  const streak = Core.streakInfo(stats, settings.dailyGoalMin);

  const readiness = exams.map(function (e, i) {
    return Object.assign({}, e, { _i: i, _r: Core.examReadiness(e, plans, now), _g: Algo.readinessGrade(e, plans, now, streak.todayPct) });
  });

  return (
    <section className="tab-content">
      <div className="hero-stats">
        <UI.StatCard icon="book" label="المواد المسجلة" value={exams.length} color="#0d9488" delay={0} />
        <UI.StatCard icon="layers" label="مجموع السلايدات" value={totalSlides} color="#06b6d4" delay={60} />
        <UI.StatCard icon="clock" label="إجمالي ساعات المذاكرة" value={totalStudy / 3600} decimals={1} color="#10b981" delay={120} />
        <UI.StatCard icon="checkCircle" label="خطط مكتملة" value={completed + ' / ' + plans.length} sub={completionPct + '% إنجاز'} color="#f59e0b" delay={180} />
      </div>

      <div className="stats-grid">
        <div className="card">
          <UI.CardHeader icon="chart" color="#0d9488" title="ساعات المذاكرة — آخر 7 أيام"
            sub={'السلسلة الحالية: ' + streak.current + ' يوم • أفضل سلسلة: ' + streak.best + ' يوم • جلسات بومودورو: ' + (pomoSessions || 0)} />
          <div className="barchart" role="img" aria-label="رسم بياني لساعات المذاكرة آخر 7 أيام">
            {week.map(function (w) {
              const pctH = Math.max(4, Math.round((w.sec / maxSec) * 100));
              return (
                <div className="bar-col" key={w.key} title={w.label + ': ' + Core.fmtDur(w.sec)}>
                  <span className="bar-value">{w.sec > 0 ? Core.fmtDur(w.sec) : ''}</span>
                  <div className="bar" style={{ height: pctH + '%' }} />
                  <span className="bar-label">{w.label}</span>
                </div>
              );
            })}
          </div>
          {week.every(function (w) { return w.sec === 0; }) ? <p className="form-hint"><UI.Icon name="info" size={13} /> شغّل مؤقت المذاكرة أو البومودورو ليبدأ سجل الأيام بالامتلاء.</p> : null}
        </div>

        <div className="card center-col">
          <UI.CardHeader icon="target" color="#10b981" title="نسبة إتمام الخطط" sub="مقارنة الخطط المكتملة بالإجمالية" />
          <UI.Ring pct={completionPct} size={150} stroke={13} color="#10b981" className="big-ring">
            <div className="ring-big">
              <strong>{completionPct}%</strong>
              <span>{completed} من {plans.length}</span>
            </div>
          </UI.Ring>
        </div>
      </div>

      <div className="card">
        <UI.CardHeader icon="zap" color="#f59e0b" title="الجاهزية الذكية لكل مادة"
          sub="نتيجة مركبة: تغطية الوقت 65% + أيام الجدول الذكي 20% + انتظام السلسلة 15%." />
        {exams.length === 0 ? (
          <UI.EmptyState icon="book" title="لا توجد مواد بعد" hint="أضف مواد وخطط مذاكرة لتظهر الجاهزية هنا." />
        ) : readiness.every(function (r) { return r._r.target === 0; }) ? (
          <UI.EmptyState icon="target" title="لا توجد خطط مذاكرة مرتبطة" hint="أنشئ خطة مذاكرة لكل مادة لتظهر نسبة الجاهزية." />
        ) : (
          <div className="ready-list">
            {readiness.map(function (r) {
              const color = Core.colorOf(r._i);
              return (
                <div key={r.id} className="ready-row">
                  <span className="subject-cell"><span className="dot" style={{ background: color }} /><strong>{r.subject}</strong></span>
                  <div className="ready-bar">
                    <UI.ProgressBar pct={r._r.pct} color={color} height={10} />
                  </div>
                  <span className="ready-num">{Core.fmtDur(r._r.elapsed)} / {(r._r.target / 3600).toFixed(1)} س</span>
                  <UI.GradeBadge g={r._g} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

/* ============ تبويب الإنجازات ============ */
const AchievementsTab = function AchievementsTab({ achMap, exams, plans, stats, settings, now, pomoSessions }) {
  const satisfied = Core.evalAchievements({ exams, plans, stats, settings, now, extras: { pomoSessions: pomoSessions } });
  const unlockedCount = Core.ACH.filter(function (a) { return achMap[a.id] || satisfied.includes(a.id); }).length;
  const pct = Math.round((unlockedCount / Core.ACH.length) * 100);
  return (
    <section className="tab-content">
      <div className="card">
        <UI.CardHeader icon="award" color="#f59e0b" title="لوحة الإنجازات"
          sub="كل إنجاز تفتحه هو خطوة أقرب للتفوق — حافظ على سلسلتك اليومية!">
          <UI.Badge color="#f59e0b">{unlockedCount} / {Core.ACH.length}</UI.Badge>
        </UI.CardHeader>
        <UI.ProgressBar pct={pct} color="#f59e0b" height={10} className="ach-progress" />
        <div className="ach-grid">
          {Core.ACH.map(function (a, i) {
            const unlocked = Boolean(achMap[a.id] || satisfied.includes(a.id));
            return (
              <div key={a.id} className={'ach-card' + (unlocked ? ' unlocked' : '')} style={{ animationDelay: (i * 40) + 'ms' }}>
                <span className="ach-icon" style={unlocked ? { background: a.color + '1E', color: a.color } : null}>
                  <UI.Icon name={unlocked ? a.icon : 'lock'} size={22} strokeWidth={1.8} />
                </span>
                <strong>{a.title}</strong>
                <p>{a.desc}</p>
                {unlocked && achMap[a.id] ? <span className="ach-date"><UI.Icon name="checkCircle" size={11} /> {achMap[a.id]}</span> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============ تبويب الإعدادات ============ */
const SettingsTab = function SettingsTab({ profile, settings, notifStatus, pomoSessions, onEditProfile, onTheme, onGoal, onPomo, onExport, onImportFile, onDemo, onResetAll, onEnableNotifs }) {
  const p = settings.pomo || Algo.POMO_DEFAULTS;
  return (
    <section className="tab-content">
      <div className="settings-grid">
        <div className="card">
          <UI.CardHeader icon="user" color="#0d9488" title="بيانات الطالب" sub="تُستخدم في الترحيب والشريط العلوي." />
          <div className="profile-box">
            <span className="avatar">{mfsInitials(profile.username)}</span>
            <div className="profile-info">
              <strong>{profile.username}</strong>
              <span dir="ltr" className="muted">{profile.email}</span>
              <div className="profile-chips">
                <UI.Badge><UI.Icon name="hash" size={12} /> {profile.studentId}</UI.Badge>
                <UI.Badge><UI.Icon name="cap" size={12} /> {profile.college}</UI.Badge>
                <UI.Badge><UI.Icon name="layers" size={12} /> السنة {profile.year}</UI.Badge>
              </div>
            </div>
            <button type="button" className="btn btn-soft" onClick={onEditProfile}><UI.Icon name="edit" size={14} /> تعديل</button>
          </div>
        </div>

        <div className="card">
          <UI.CardHeader icon="sliders" color="#06b6d4" title="المظهر والهدف اليومي" sub="خصّص المنظم بما يناسب طريقة دراستك." />
          <div className="setting-row">
            <span>المظهر</span>
            <div className="theme-toggle">
              <button type="button" className={'chip' + (settings.theme !== 'dark' ? ' active' : '')} onClick={function () { onTheme('light'); }}>
                <UI.Icon name="sun" size={14} /> فاتح
              </button>
              <button type="button" className={'chip' + (settings.theme === 'dark' ? ' active' : '')} onClick={function () { onTheme('dark'); }}>
                <UI.Icon name="moon" size={14} /> داكن
              </button>
            </div>
          </div>
          <div className="setting-row">
            <span>
              هدف المذاكرة اليومي
              <small className="muted block">يُحتسب يومك في سلسلة الالتزام عند مذاكرة هذا المقدار يومياً.</small>
            </span>
            <div className="goal-input">
              <input type="number" min="15" max="720" step="15" value={settings.dailyGoalMin}
                onChange={function (e) { const v = parseInt(e.target.value, 10); if (v >= 1 && v <= 720) onGoal(v); }} />
              <span>دقيقة</span>
            </div>
          </div>
          <div className="setting-row">
            <span>
              دورة البومودورو (دقائق)
              <small className="muted block">تركيز ← استراحة قصيرة، وكل 4 جلسات استراحة طويلة. جلساتك المكتملة: {pomoSessions || 0}</small>
            </span>
            <div className="pomo-inputs">
              <label><input type="number" min="5" max="120" value={p.focus} onChange={function (e) { const v = parseInt(e.target.value, 10); if (v >= 1 && v <= 180) onPomo('focus', v); }} /> تركيز</label>
              <label><input type="number" min="1" max="30" value={p.brk} onChange={function (e) { const v = parseInt(e.target.value, 10); if (v >= 1 && v <= 60) onPomo('brk', v); }} /> استراحة</label>
              <label><input type="number" min="5" max="60" value={p.long} onChange={function (e) { const v = parseInt(e.target.value, 10); if (v >= 1 && v <= 90) onPomo('long', v); }} /> طويلة</label>
            </div>
          </div>
          <div className="setting-row">
            <span>
              تنبيهات الامتحانات
              <small className="muted block">إشعار قبل الامتحان بأقل من 24 ساعة أثناء تصفح الموقع.</small>
            </span>
            {notifStatus === 'unsupported' ? <UI.Badge color="#94a3b8">غير مدعوم في متصفحك</UI.Badge>
              : notifStatus === 'granted' ? <UI.Badge color="#10b981"><UI.Icon name="checkCircle" size={12} /> مفعّلة</UI.Badge>
              : notifStatus === 'denied' ? <UI.Badge color="#e11d48">مرفوضة من المتصفح</UI.Badge>
              : <button type="button" className="btn btn-soft" onClick={onEnableNotifs}><UI.Icon name="bell" size={14} /> تفعيل التنبيهات</button>}
          </div>
        </div>

        <div className="card">
          <UI.CardHeader icon="layers" color="#06b6d4" title="البيانات والنسخ الاحتياطي"
            sub="بياناتك محفوظة على جهازك فقط (localStorage) — صدّرها لنقلها بين الأجهزة." />
          <div className="setting-actions">
            <button type="button" className="btn btn-soft" onClick={onExport}><UI.Icon name="download" size={14} /> تصدير نسخة احتياطية</button>
            <label className="btn btn-soft import-btn">
              <UI.Icon name="upload" size={14} /> استيراد نسخة
              <input type="file" accept="application/json,.json" onChange={onImportFile} />
            </label>
            <button type="button" className="btn btn-soft" onClick={onDemo}><UI.Icon name="zap" size={14} /> تحميل بيانات تجريبية</button>
          </div>
        </div>

        <div className="card danger-card">
          <UI.CardHeader icon="alert" color="#e11d48" title="منطقة الخطر" sub="إجراء لا يمكن التراجع عنه." />
          <button type="button" className="btn btn-danger" onClick={onResetAll}>
            <UI.Icon name="trash" size={14} /> مسح جميع البيانات (الحساب، المواد، الخطط، الإحصائيات)
          </button>
        </div>
      </div>
    </section>
  );
};

/* ============ الفوتر ============ */
const Footer = function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="ayah">﴿ وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ * وَأَنَّ سَعْيَهُ سَوْفَ يُرَىٰ ﴾</p>
        <span className="surah">سورة النجم — الآيتان 39-40</span>
        <div className="creator-box">
          <h3><UI.Icon name="user" size={15} /> معلومات منشئ الموقع</h3>
          <div className="creator-grid">
            <div className="creator-item"><UI.Icon name="user" size={14} /> <span><strong>الاسم:</strong> Eng: Ma'an Majed</span></div>
            <div className="creator-item"><UI.Icon name="cap" size={14} /> <span><strong>الجامعة:</strong> الجامعة الدولية الخاصة للعلوم والتكنولوجيا (IUST)</span></div>
            <div className="creator-item"><UI.Icon name="phone" size={14} /> <a href="tel:+963992328101" dir="ltr">+963 992 328 101</a></div>
            <div className="creator-item"><UI.Icon name="mail" size={14} /> <a href="mailto:maanabokhashreef@gmail.com" dir="ltr">maanabokhashreef@gmail.com</a></div>
            <div className="creator-item"><UI.Icon name="linkedin" size={14} /> <span>ma'an abokhashreef</span></div>
          </div>
        </div>
        <p className="footer-note">Med~Final~Study — نسخة React v3 • جميع البيانات محفوظة على جهازك • صُنع بحب من أجل الطلاب</p>
      </div>
    </footer>
  );
};

const Screens2 = { PlansTab, StatsTab, AchievementsTab, SettingsTab, Footer };
