/* الشاشات 1: بوابة الدخول، الترويسة، أولوية اليوم، الامتحان القادم، تبويب الامتحانات */

function mfsInitials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '؟';
  return parts.slice(0, 2).map(function (p) { return p[0]; }).join('');
}

/* ============ بوابة تسجيل الدخول ============ */
const LoginGate = function LoginGate({ onLogin, onDemo }) {
  const [form, setForm] = useState({ username: '', email: '', studentId: '', college: '', year: '' });
  const [errors, setErrors] = useState({});
  const upd = function (k, v) { setForm(function (f) { return Object.assign({}, f, { [k]: v }); }); };

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
      username: form.username.trim(), email: form.email.trim(), studentId: form.studentId.trim(),
      college: form.college, year: form.year,
    });
  }
  return (
    <section className="login-gate">
      <div className="login-card">
        <div className="login-visual">
          <div className="login-avatar"><UI.Icon name="cap" size={30} strokeWidth={1.6} /></div>
          <h2>أهلاً بك في منظمك الدراسي</h2>
          <p>سجّل بياناتك مرة واحدة لتبدأ التنظيم: جدول الامتحانات، خطة المذاكرة، الإحصائيات والإنجازات — كل شيء يُحفظ على جهازك تلقائياً.</p>
          <ul className="login-features">
            <li><UI.Icon name="calendar" size={15} /> عد تنازلي حي لكل امتحان</li>
            <li><UI.Icon name="zap" size={15} /> خوارزمية تولّد خطتك و توزع سلايداتك يومياً</li>
            <li><UI.Icon name="hourglass" size={15} /> مؤقت مذاكرة وبومودورو مع تتبع الاستعداد</li>
            <li><UI.Icon name="chart" size={15} /> إحصائيات وتقويم وإنجازات تحفيزية</li>
          </ul>
        </div>
        <form className="login-form" onSubmit={submit} noValidate>
          <div className="login-form-title">
            <UI.Icon name="user" size={16} />
            <span>بيانات الطالب</span>
          </div>
          <UI.Field label="اسم المستخدم" icon="user">
            <input type="text" value={form.username} placeholder="مثال: Ma'an Majed"
              onChange={function (e) { upd('username', e.target.value); }} />
            {errors.username ? <span className="field-error">{errors.username}</span> : null}
          </UI.Field>
          <UI.Field label="البريد الإلكتروني" icon="mail">
            <input type="email" dir="ltr" value={form.email} placeholder="name@example.com"
              onChange={function (e) { upd('email', e.target.value); }} />
            {errors.email ? <span className="field-error">{errors.email}</span> : null}
          </UI.Field>
          <UI.Field label="الرقم الجامعي" icon="hash">
            <input type="text" dir="ltr" value={form.studentId} placeholder="مثال: 2024001"
              onChange={function (e) { upd('studentId', e.target.value); }} />
            {errors.studentId ? <span className="field-error">{errors.studentId}</span> : null}
          </UI.Field>
          <div className="field-row">
            <UI.Field label="الكلية" icon="cap" className="grow">
              <select value={form.college} onChange={function (e) { upd('college', e.target.value); }}>
                <option value="" disabled>اختر الكلية...</option>
                {Core.COLLEGES.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
              </select>
              {errors.college ? <span className="field-error">{errors.college}</span> : null}
            </UI.Field>
            <UI.Field label="السنة" icon="layers">
              <select value={form.year} onChange={function (e) { upd('year', e.target.value); }}>
                <option value="" disabled>...</option>
                {Core.YEARS.map(function (y) { return <option key={y} value={y}>السنة {y}</option>; })}
              </select>
              {errors.year ? <span className="field-error">{errors.year}</span> : null}
            </UI.Field>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            <UI.Icon name="check" size={16} /> حفظ والدخول إلى المنظم
          </button>
          <button type="button" className="btn btn-ghost btn-block" onClick={onDemo}>
            <UI.Icon name="zap" size={15} /> دخول تجريبي سريع (بيانات توضيحية)
          </button>
        </form>
      </div>
    </section>
  );
};

/* ============ الترويسة العلوية ============ */
const Header = function Header({ theme, onToggleTheme, quote, onNewQuote, notifStatus, onEnableNotifs, onTogglePomo, pomoOpen }) {
  const [spin, setSpin] = useState(false);
  function newQuote() {
    setSpin(true);
    onNewQuote();
    setTimeout(function () { setSpin(false); }, 600);
  }
  return (
    <header className="site-header">
      <div className="container header-grid">
        <div className="header-brand">
          <span className="brand-logo">
            {/* ضع صورة الشعار الرسمية باسم IUST.jpg في مجلد assets ثم غيّر المسار إلى assets/IUST.jpg */}
            <img src="assets/iust-logo.svg" alt="شعار الجامعة الدولية IUST" />
          </span>
          <div className="brand-text">
            <strong>Med~Final~Study</strong>
            <span>منظم الجدول الدراسي</span>
          </div>
        </div>
        <div className="header-quote" key={quote.i}>
          <UI.Icon name="star" size={14} className="quote-star" />
          <p>"{quote.text}"</p>
          <button type="button" className={'quote-btn' + (spin ? ' spin' : '')} onClick={newQuote} title="عبارة تحفيزية أخرى" aria-label="عبارة تحفيزية أخرى">
            <UI.Icon name="refresh" size={14} />
          </button>
        </div>
        <div className="header-actions">
          <button type="button" className={'icon-btn' + (pomoOpen ? ' active' : '')} onClick={onTogglePomo} title="مؤقت البومودورو" aria-label="مؤقت البومودورو">
            <UI.Icon name="hourglass" size={17} />
          </button>
          {notifStatus !== 'granted' && notifStatus !== 'unsupported' ? (
            <button type="button" className="icon-btn" onClick={onEnableNotifs} title="تفعيل تنبيهات الامتحانات" aria-label="تفعيل التنبيهات">
              <UI.Icon name="bell" size={17} />
              <span className="ping-dot" />
            </button>
          ) : null}
          {notifStatus === 'granted' ? (
            <span className="icon-btn static" title="التنبيهات مفعّلة"><UI.Icon name="bell" size={17} /><span className="ping-dot on" /></span>
          ) : null}
          <button type="button" className="icon-btn" onClick={onToggleTheme} title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'} aria-label="تبديل المظهر">
            <UI.Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </button>
          <span className="dev-badge"><UI.Icon name="user" size={13} /> Eng: Ma'an Majed</span>
        </div>
      </div>
    </header>
  );
};

/* ============ أولوية اليوم: ماذا تذاكر الآن؟ ============ */
const TodayFocus = function TodayFocus({ focus, onStartPlan, onGoPlans }) {
  if (!focus || !focus.top || focus.top.score <= 0) return null;
  const top = focus.top;
  const exam = top.exam;
  const color = Core.colorOf(top.index);
  const suggestedPerDay = Math.max(1, Math.ceil((parseInt(exam.slides, 10) || 0) / Math.max(1, top.daysLeft)));
  return (
    <div className="today-focus glass" style={{ '--accent': color }}>
      <div className="tf-head">
        <span className="tf-icon" style={{ background: color + '1E', color: color }}><UI.Icon name="target" size={20} /></span>
        <div>
          <h3>ماذا تذاكر اليوم؟</h3>
          <p>قرار خوارزمي: إلحاح الامتحان 60% + عجز الجاهزية 40%</p>
        </div>
      </div>
      <div className="tf-body">
        <div className="tf-main">
          <strong className="tf-subject">{exam.subject}</strong>
          <div className="tf-meta">
            <UI.Badge color={color}><UI.Icon name="calendar" size={12} /> {Core.fmtDate(exam.date)}</UI.Badge>
            <UI.Badge color={top.daysLeft <= 2 ? '#e11d48' : '#f59e0b'}>
              <UI.Icon name="zap" size={12} /> {top.daysLeft <= 0 ? 'اليوم!' : 'باقي ' + top.daysLeft + ' يوم'}
            </UI.Badge>
            <UI.Badge color="#0ea5e9"><UI.Icon name="chart" size={12} /> الجاهزية {top.ready.pct}%</UI.Badge>
          </div>
          <div className="tf-suggest">
            {focus.smartEntry ? (
              <span className="tf-line smart">
                <UI.Icon name="zap" size={13} />
                هدفك من الخطة الذكية اليوم: <strong>{focus.smartEntry.slides} سلايد</strong> (شابتر {focus.smartEntry.chapters}) — {focus.smartEntry.heavy ? 'يوم ثقيل' : focus.smartEntry.light ? 'يوم خفيف للمراجعة' : 'يوم متوازن'}
              </span>
            ) : (
              <span className="tf-line">
                <UI.Icon name="info" size={13} />
                الوتيرة المقترحة: <strong>{suggestedPerDay}</strong> سلايد يومياً للوصول بالوقت المناسب
              </span>
            )}
            {focus.runnerUp ? (
              <span className="tf-line next">
                <UI.Icon name="layers" size={13} /> الأولوية التالية: {focus.runnerUp.exam.subject} (باقي {focus.runnerUp.daysLeft} يوم)
              </span>
            ) : null}
          </div>
        </div>
        <button type="button" className="btn btn-primary tf-start" onClick={onStartPlan}>
          <UI.Icon name="play" size={15} /> ابدأ جلسة اليوم
        </button>
      </div>
    </div>
  );
};

/* ============ شريط الطالب + الامتحان القادم ============ */
const HeroNextExam = function HeroNextExam({ exams, plans, now, streak, totalStudy, onGoAdd, onGoCalendar, profile }) {
  const upcoming = useMemo(function () {
    const withCd = exams.map(function (e, i) { return { e, i, cd: Core.countdown(e, now) }; })
      .filter(function (x) { return !x.cd.done; });
    withCd.sort(function (a, b) { return a.cd.total - b.cd.total; });
    return withCd[0] || null;
  }, [exams, now]);

  const totalSlides = exams.reduce(function (a, e) { return a + (parseInt(e.slides, 10) || 0); }, 0);
  const ready = upcoming ? Core.examReadiness(upcoming.e, plans, now) : null;
  const grade = upcoming ? Algo.readinessGrade(upcoming.e, plans, now, streak.todayPct) : null;
  const urgent = upcoming && upcoming.cd.total < 2 * 86400000;
  const milestones = upcoming ? Algo.reviewMilestones(upcoming.e).filter(function (m) { return !m.past; }) : [];

  return (
    <div className="hero">
      <div className="hero-stats">
        <UI.StatCard icon="book" label="المواد المسجلة" value={exams.length} color="#0d9488" delay={0} />
        <UI.StatCard icon="layers" label="مجموع السلايدات" value={totalSlides} color="#06b6d4" delay={60} />
        <UI.StatCard icon="clock" label="ساعة مذاكرة" value={totalStudy / 3600} decimals={1} color="#10b981" delay={120} />
        <UI.StatCard icon="flame" label="سلسلة الالتزام" value={streak.current + ' أيام'} sub={'هدف يومي: ' + streak.todayPct + '%'} color="#f59e0b" delay={180} />
      </div>

      {upcoming ? (
        <div className={'next-exam glass' + (urgent ? ' urgent' : '')}>
          <div className="next-exam-main">
            <div className="next-exam-label">
              <UI.Icon name={urgent ? 'zap' : 'calendar'} size={15} />
              {urgent ? 'امتحان قريب جداً!' : 'الامتحان القادم'}
            </div>
            <h3 className="next-exam-name">{upcoming.e.subject}</h3>
            <div className="next-exam-meta">
              <UI.Badge color={Core.colorOf(upcoming.i)}><UI.Icon name="calendar" size={12} /> {Core.fmtDate(upcoming.e.date)}</UI.Badge>
              <UI.Badge color="#06b6d4"><UI.Icon name="clock" size={12} /> {upcoming.e.time}</UI.Badge>
              <UI.Badge color="#0d9488"><UI.Icon name="layers" size={12} /> {upcoming.e.slides} سلايد</UI.Badge>
              <UI.Badge color="#f59e0b"><UI.Icon name="book" size={12} /> {upcoming.e.chapters} شابتر</UI.Badge>
              <UI.GradeBadge g={grade} compact />
            </div>
            <div className="next-exam-ready">
              <UI.ProgressBar pct={ready.pct} color={Core.colorOf(upcoming.i)} height={9} />
              <span>الاستعداد: <strong>{ready.pct}%</strong>{milestones.length ? <em className="ms-hint"> • مراجعات متباعدة: {milestones.map(function (m) { return m.date.slice(5); }).join(' ← ')}</em> : null}</span>
            </div>
          </div>
          <div className="countdown" dir="ltr">
            {[{ v: upcoming.cd.d, l: 'يوم' }, { v: upcoming.cd.h, l: 'ساعة' }, { v: upcoming.cd.m, l: 'دقيقة' }, { v: upcoming.cd.s, l: 'ثانية' }].map(function (b, idx) {
              return (
                <div className="cd-box" key={b.l}>
                  <span className="cd-num" key={idx === 3 ? 's' + b.v : 'static' + b.v}>{String(b.v).padStart(2, '0')}</span>
                  <span className="cd-label">{b.l}</span>
                </div>
              );
            })}
          </div>
          <UI.Ring pct={ready.pct} size={86} stroke={9} color={Core.colorOf(upcoming.i)} className="next-exam-ring">
            <strong>{ready.pct}%</strong>
          </UI.Ring>
          <button type="button" className="btn btn-soft btn-sm next-exam-cal" onClick={onGoCalendar} title="افتح التقويم">
            <UI.Icon name="calendar" size={13} /> التقويم
          </button>
        </div>
      ) : (
        <div className="next-exam glass no-exam">
          {exams.length ? (
            <UI.EmptyState icon="award" title="أحسنت! لا توجد امتحانات قادمة مجدولة" hint="أضف امتحاناً جديداً لبدء عد تنازلي وخطة مذاكرة مناسبة.">
              <button type="button" className="btn btn-primary" onClick={onGoAdd}><UI.Icon name="plus" size={15} /> إضافة مادة</button>
            </UI.EmptyState>
          ) : (
            <UI.EmptyState icon="book" title={'مرحباً ' + (profile ? profile.username : '') + '! ابدأ بإضافة أول مادة'} hint="سجّل موادك وامتحاناتها، وسيقوم المنظم بحساب العد التنازلي وخطط المذاكرة تلقائياً.">
              <button type="button" className="btn btn-primary" onClick={onGoAdd}><UI.Icon name="plus" size={15} /> إضافة أول مادة</button>
            </UI.EmptyState>
          )}
        </div>
      )}
    </div>
  );
};

/* ============ نافذة تعديل مادة ============ */
const ExamFormModal = function ExamFormModal({ exam, onClose, onSave }) {
  const [form, setForm] = useState({
    subject: exam.subject, date: exam.date, time: exam.time,
    chapters: String(exam.chapters), slides: String(exam.slides),
  });
  const [error, setError] = useState('');
  const upd = function (k, v) { setForm(function (f) { return Object.assign({}, f, { [k]: v }); }); };
  function submit(e) {
    e.preventDefault();
    if (!form.subject.trim()) return setError('اسم المادة مطلوب');
    if (!form.date) return setError('تاريخ الامتحان مطلوب');
    if (!form.time) return setError('وقت الامتحان مطلوب');
    if (parseInt(form.chapters, 10) < 1) return setError('عدد الشابترات يجب أن يكون 1 على الأقل');
    if (parseInt(form.slides, 10) < 1) return setError('مجموع السلايدات يجب أن يكون 1 على الأقل');
    onSave(exam.id, {
      subject: form.subject.trim(), date: form.date, time: form.time,
      chapters: parseInt(form.chapters, 10), slides: parseInt(form.slides, 10),
    });
  }
  return (
    <UI.Modal open onClose={onClose} title="تعديل بيانات المادة" icon="edit">
      <form onSubmit={submit} className="form-grid modal-form" noValidate>
        <UI.Field label="اسم المادة" icon="book">
          <input type="text" value={form.subject} onChange={function (e) { upd('subject', e.target.value); }} autoFocus />
        </UI.Field>
        <div className="field-row">
          <UI.Field label="التاريخ" icon="calendar" className="grow">
            <input type="date" value={form.date} onChange={function (e) { upd('date', e.target.value); }} />
          </UI.Field>
          <UI.Field label="الوقت" icon="clock">
            <input type="time" value={form.time} onChange={function (e) { upd('time', e.target.value); }} />
          </UI.Field>
        </div>
        <div className="field-row">
          <UI.Field label="عدد الشابترات" icon="book" className="grow">
            <input type="number" min="1" value={form.chapters} onChange={function (e) { upd('chapters', e.target.value); }} />
          </UI.Field>
          <UI.Field label="مجموع السلايدات" icon="layers" className="grow">
            <input type="number" min="1" value={form.slides} onChange={function (e) { upd('slides', e.target.value); }} />
          </UI.Field>
        </div>
        {error ? <p className="field-error center"><UI.Icon name="alert" size={13} /> {error}</p> : null}
        <div className="confirm-actions">
          <button type="submit" className="btn btn-primary"><UI.Icon name="check" size={15} /> حفظ التعديل</button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>إلغاء</button>
        </div>
      </form>
    </UI.Modal>
  );
};

/* ============ تبويب جدول الامتحانات ============ */
const ExamsTab = function ExamsTab({ exams, plans, now, streakPct, onAdd, onUpdate, onDelete, onNotes, onGenerate }) {
  const [form, setForm] = useState({ subject: '', date: '', time: '', chapters: '', slides: '' });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');
  const [editing, setEditing] = useState(null);

  const today = Core.todayStr();
  const upd = function (k, v) { setForm(function (f) { return Object.assign({}, f, { [k]: v }); }); };

  function submit(e) {
    e.preventDefault();
    if (!form.subject.trim()) return setError('اسم المادة مطلوب');
    const dup = exams.some(function (x) { return x.subject === form.subject.trim(); });
    if (dup) return setError('هذه المادة مسجلة مسبقاً في الجدول');
    if (!form.date) return setError('تاريخ الامتحان مطلوب');
    if (form.date < today) return setError('لا يمكن إضافة امتحان بتاريخ في الماضي');
    if (!form.time) return setError('وقت الامتحان مطلوب');
    if (parseInt(form.chapters, 10) < 1) return setError('عدد الشابترات يجب أن يكون 1 على الأقل');
    if (parseInt(form.slides, 10) < 1) return setError('مجموع السلايدات يجب أن يكون 1 على الأقل');
    setError('');
    onAdd({
      subject: form.subject.trim(), date: form.date, time: form.time,
      chapters: parseInt(form.chapters, 10), slides: parseInt(form.slides, 10),
    });
    setForm({ subject: '', date: '', time: '', chapters: '', slides: '' });
  }

  let shown = exams.map(function (e, i) { return Object.assign({}, e, { _i: i, _cd: Core.countdown(e, now), _ready: Core.examReadiness(e, plans, now), _pace: Algo.paceInfo(e, plans, now) }); });
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    shown = shown.filter(function (e) { return e.subject.toLowerCase().includes(q); });
  }
  shown.sort(function (a, b) {
    if (sort === 'slides') return b.slides - a.slides;
    if (sort === 'name') return a.subject.localeCompare(b.subject, 'ar');
    return Core.examDateTime(a) - Core.examDateTime(b);
  });

  return (
    <section className="tab-content">
      <div className="card">
        <UI.CardHeader icon="calendar" color="#0d9488" title="إضافة مادة إلى جدول الامتحانات"
          sub="سجّل المواد وعدد الشابترات والسلايدات، وسيتكفل المنظم بالحساب والعد التنازلي والتوزيع الذكي." />
        <form className="form-grid" onSubmit={submit} noValidate>
          <UI.Field label="اسم المادة" icon="book">
            <input type="text" value={form.subject} placeholder="مثال: Pharmacology I"
              onChange={function (e) { upd('subject', e.target.value); }} />
          </UI.Field>
          <UI.Field label="تاريخ الامتحان" icon="calendar">
            <input type="date" min={today} value={form.date} onChange={function (e) { upd('date', e.target.value); }} />
          </UI.Field>
          <UI.Field label="وقت الامتحان" icon="clock">
            <input type="time" value={form.time} onChange={function (e) { upd('time', e.target.value); }} />
          </UI.Field>
          <UI.Field label="عدد الشابترات" icon="book">
            <input type="number" min="1" placeholder="مثال: 8" value={form.chapters}
              onChange={function (e) { upd('chapters', e.target.value); }} />
          </UI.Field>
          <UI.Field label="مجموع السلايدات" icon="layers">
            <input type="number" min="1" placeholder="مثال: 320" value={form.slides}
              onChange={function (e) { upd('slides', e.target.value); }} />
          </UI.Field>
          <div className="field submit-field">
            <button type="submit" className="btn btn-primary btn-block"><UI.Icon name="plus" size={15} /> إضافة المادة</button>
          </div>
        </form>
        {error ? <p className="field-error"><UI.Icon name="alert" size={13} /> {error}</p> : null}
      </div>

      <div className="card">
        <UI.CardHeader icon="chart" color="#06b6d4" title="جدول الامتحانات"
          sub={'عدد المواد المعروضة: ' + shown.length + ' من ' + exams.length}>
          <div className="card-tools">
            <UI.SearchBox value={search} onChange={setSearch} placeholder="ابحث عن مادة..." />
            <select className="sort-select" value={sort} onChange={function (e) { setSort(e.target.value); }} aria-label="ترتيب">
              <option value="date">الترتيب: حسب التاريخ</option>
              <option value="slides">الترتيب: حسب السلايدات</option>
              <option value="name">الترتيب: أبجدي</option>
            </select>
            <button type="button" className="btn btn-soft btn-sm no-print" onClick={function () { window.print(); }} title="طباعة الجدول">
              <UI.Icon name="download" size={13} /> طباعة
            </button>
          </div>
        </UI.CardHeader>

        {exams.length === 0 ? (
          <UI.EmptyState icon="book" title="لا توجد مواد بعد" hint="أضف أول مادة من النموذج أعلاه ليبدأ العد التنازلي." />
        ) : shown.length === 0 ? (
          <UI.EmptyState icon="search" title="لا نتائج مطابقة" hint="جرّب كلمة بحث أخرى." />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>المادة</th><th>التاريخ والوقت</th><th>الشابترات</th><th>السلايدات</th>
                  <th>سلايد/شابتر</th><th>الاستعداد</th><th>الوقت المتبقي</th><th>الوتيرة</th><th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {shown.map(function (e) {
                  const color = Core.colorOf(e._i);
                  const cdClass = e._cd.done ? 'cd-done' : (e._cd.total < 2 * 86400000 ? 'cd-urgent' : '');
                  const avg = parseInt(e.chapters, 10) > 0 ? (e.slides / e.chapters).toFixed(1) : '—';
                  const grade = Algo.readinessGrade(e, plans, now, streakPct);
                  const hasPlan = plans.some(function (p) { return p.examId === e.id; });
                  return (
                    <tr key={e.id} className={e._cd.done ? 'row-done' : ''}>
                      <td data-label="المادة">
                        <span className="subject-cell"><span className="dot" style={{ background: color }} /><strong>{e.subject}</strong></span>
                        {e.notes && String(e.notes).trim() ? <small className="notes-hint"><UI.Icon name="edit" size={11} /> ملاحظة محفوظة</small> : null}
                      </td>
                      <td data-label="التاريخ والوقت">{Core.fmtDate(e.date)}<small className="muted block">{e.time}</small></td>
                      <td data-label="الشابترات">{e.chapters}</td>
                      <td data-label="السلايدات">{e.slides}</td>
                      <td data-label="سلايد/شابتر">{avg}</td>
                      <td data-label="الاستعداد">
                        {e._ready.target > 0 ? (
                          <span className="ready-cell">
                            <UI.ProgressBar pct={e._ready.pct} color={color} height={6} />
                            <UI.GradeBadge g={grade} compact />
                          </span>
                        ) : <small className="muted">بلا خطة</small>}
                      </td>
                      <td data-label="الوقت المتبقي">
                        <span className={'cd-badge ' + cdClass}>
                          {e._cd.done ? 'انتهى' : Core.fmtDur(e._cd.total / 1000)}
                        </span>
                      </td>
                      <td data-label="الوتيرة"><UI.PaceChip pace={e._pace} /></td>
                      <td data-label="إجراءات">
                        <div className="action-group">
                          {hasPlan ? (
                            <button type="button" className="icon-btn teal" title="توليد خطة ذكية" aria-label="توليد خطة ذكية" onClick={function () { onGenerate(e); }}><UI.Icon name="zap" size={14} /></button>
                          ) : null}
                          <button type="button" className="icon-btn amber" title="تعديل" aria-label="تعديل" onClick={function () { setEditing(e); }}><UI.Icon name="edit" size={14} /></button>
                          <button type="button" className="icon-btn sky" title="ملاحظات" aria-label="ملاحظات" onClick={function () { onNotes(e); }}><UI.Icon name="info" size={14} /></button>
                          <button type="button" className="icon-btn red" title="حذف" aria-label="حذف" onClick={function () { onDelete(e); }}><UI.Icon name="trash" size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing ? <ExamFormModal exam={editing} onClose={function () { setEditing(null); }} onSave={onUpdate} /> : null}
    </section>
  );
};

const Screens1 = { LoginGate, Header, TodayFocus, HeroNextExam, ExamsTab };
