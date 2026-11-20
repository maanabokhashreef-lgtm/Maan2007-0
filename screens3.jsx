/* الشاشات 3: التقويم الشهري، المولد الذكي للخطط، ملاحظات المواد، مؤقت البومودورو */

/* ============ المولد الذكي للخطط (خوارزمية التوزيع الموزون) ============ */
const SmartPlanModal = function SmartPlanModal({ exam, exams, onClose, onCreate }) {
  const [form, setForm] = useState({
    examId: exam.id,
    startDate: Core.todayStr(),
    endDate: exam.date && exam.date > Core.todayStr() ? exam.date : Core.todayStr(new Date(Date.now() + 6 * 86400000)),
    dailyHours: '3',
    restDays: [5], // الجمعة راحة افتراضياً
  });
  const upd = function (k, v) { setForm(function (f) { return Object.assign({}, f, { [k]: v }); }); };
  const toggleRest = function (d) {
    setForm(function (f) {
      const has = f.restDays.includes(d);
      return Object.assign({}, f, { restDays: has ? f.restDays.filter(function (x) { return x !== d; }) : f.restDays.concat([d]).sort() });
    });
  };

  const result = useMemo(function () {
    const examSel = exams.find(function (x) { return x.id === form.examId; });
    if (!examSel) return null;
    return Algo.weightedSchedule(examSel, form.startDate, form.endDate, parseFloat(form.dailyHours) || 0, form.restDays);
  }, [form, exams]);

  function create() {
    if (!result || !result.ok) return;
    const examSel = exams.find(function (x) { return x.id === form.examId; });
    onCreate({
      examId: form.examId,
      subject: examSel ? examSel.subject : '',
      startDate: form.startDate,
      endDate: form.endDate,
      dailyHours: parseFloat(form.dailyHours) || 1,
      schedule: result.schedule,
      generated: true,
    });
  }

  return (
    <UI.Modal open onClose={onClose} title="المولد الذكي للخطط" icon="zap" width={640}>
      <p className="modal-intro">
        خوارزمية التوزيع الموزون: أيام البداية أثقل (استيعاب المادة الجديدة)، والأيام الأخيرة أخف
        (مساحة مراجعة قبل الامتحان) — والسلايدات تُقسم بعدالة بين الأيام بطريقة أكبر البقايا.
      </p>
      <div className="form-grid modal-form">
        <UI.Field label="المادة" icon="book" className="span-2">
          <select value={form.examId} onChange={function (e) { upd('examId', e.target.value); }}>
            {exams.map(function (x) { return <option key={x.id} value={x.id}>{x.subject}</option>; })}
          </select>
        </UI.Field>
        <UI.Field label="تاريخ البداية" icon="calendar">
          <input type="date" value={form.startDate} onChange={function (e) { upd('startDate', e.target.value); }} />
        </UI.Field>
        <UI.Field label="تاريخ النهاية" icon="calendar">
          <input type="date" value={form.endDate} onChange={function (e) { upd('endDate', e.target.value); }} />
        </UI.Field>
        <UI.Field label="ساعات يومياً" icon="clock">
          <input type="number" min="0.5" max="16" step="0.5" value={form.dailyHours} onChange={function (e) { upd('dailyHours', e.target.value); }} />
        </UI.Field>
        <UI.Field label="أيام الراحة الأسبوعية" icon="sliders" className="span-2">
          <div className="restdays-row">
            {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(function (lbl, d) {
              const active = form.restDays.includes(d);
              return (
                <button key={lbl} type="button" className={'chip rest-chip' + (active ? ' active' : '')} onClick={function () { toggleRest(d); }}>
                  {lbl}
                </button>
              );
            })}
          </div>
        </UI.Field>
      </div>

      {result && result.ok ? (
        <div className="gen-result">
          <div className="gen-summary">
            <span><UI.Icon name="calendar" size={13} /> {result.summary.days} يوم مذاكرة</span>
            <span><UI.Icon name="sliders" size={13} /> {result.summary.restDays} يوم راحة</span>
            <span><UI.Icon name="clock" size={13} /> {result.summary.totalHours} ساعة إجمالية</span>
            <span><UI.Icon name="layers" size={13} /> ~{result.summary.slidesPerDay} سلايد/يوم</span>
          </div>
          <div className="gen-table-wrap">
            <table className="gen-table">
              <thead>
                <tr><th>اليوم</th><th>التاريخ</th><th>السلايدات</th><th>الشابترات</th><th>الحمل</th></tr>
              </thead>
              <tbody>
                {result.schedule.map(function (s) {
                  return (
                    <tr key={s.date} className={s.heavy ? 'heavy' : s.light ? 'light' : ''}>
                      <td>{s.dayName}</td>
                      <td dir="ltr">{s.date.slice(5)}</td>
                      <td><strong>{s.slides}</strong></td>
                      <td>شابتر {s.chapters}</td>
                      <td><span className={'sched-load' + (s.heavy ? ' heavy' : s.light ? ' light' : '')}>{s.heavy ? 'ثقيل' : s.light ? 'خفيف' : 'متوازن'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : result ? (
        <p className="field-error center"><UI.Icon name="alert" size={13} /> {result.error}</p>
      ) : null}

      <div className="confirm-actions">
        <button type="button" className="btn btn-primary" disabled={!result || !result.ok} onClick={create}>
          <UI.Icon name="check" size={15} /> إنشاء الخطة الذكية
        </button>
        <button type="button" className="btn btn-ghost" onClick={onClose}>إلغاء</button>
      </div>
    </UI.Modal>
  );
};

/* ============ ملاحظات المادة ============ */
const NotesModal = function NotesModal({ exam, onClose, onSave }) {
  const [text, setText] = useState(exam.notes || '');
  return (
    <UI.Modal open onClose={onClose} title="ملاحظات المادة" icon="edit" width={520}>
      <p className="modal-intro">
        ملاحظات {exam.subject}: نقاط ضعف، صفحات متأخرة، أجزاء كررها الأستاذ — تظهر في الجدول كعلامة ذكية.
      </p>
      <textarea className="notes-textarea" dir="auto" rows="7" placeholder="اكتب ملاحظاتك هنا..."
        value={text} onChange={function (e) { setText(e.target.value); }} maxLength={2000} />
      <div className="notes-foot">
        <span className="muted">{text.length}/2000 حرف</span>
        <div className="confirm-actions">
          <button type="button" className="btn btn-primary" onClick={function () { onSave(exam.id, text); }}>
            <UI.Icon name="check" size={15} /> حفظ الملاحظة
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </UI.Modal>
  );
};

/* ============ التقويم الشهري ============ */
const CalendarTab = function CalendarTab({ exams, plans, now, onToggleDay }) {
  const [cursor, setCursor] = useState(function () {
    const t = new Date();
    return { y: t.getFullYear(), m: t.getMonth() };
  });
  const [selected, setSelected] = useState(Core.todayStr());

  const WEEK = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const y = cursor.y, m = cursor.m;
  const monthName = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][m];
  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = Core.todayStr();

  // بناء أحداث الشهر: امتحانات، مراجعات متباعدة، أيام خطط
  const events = useMemo(function () {
    const map = {};
    function add(date, ev) {
      if (!map[date]) map[date] = [];
      map[date].push(ev);
    }
    exams.forEach(function (e, i) {
      if (e.date && e.date.startsWith(y + '-' + String(m + 1).padStart(2, '0'))) {
        add(e.date, { type: 'exam', exam: e, color: Core.colorOf(i), label: 'امتحان: ' + e.subject });
      }
      Algo.reviewMilestones(e).forEach(function (ms) {
        if (ms.date.startsWith(y + '-' + String(m + 1).padStart(2, '0'))) {
          add(ms.date, { type: 'review', exam: e, color: '#f59e0b', label: ms.label + ' — ' + e.subject });
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
          const entry = (p.schedule || []).find(function (x) { return x.date === key; });
          add(key, { type: 'plan', plan: p, color: '#0d9488', label: 'خطة: ' + p.subject, entry });
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
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  const selEvents = events[selected] || [];
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <section className="tab-content">
      <div className="card">
        <UI.CardHeader icon="calendar" color="#0d9488" title="تقويم المذاكرة والامتحانات"
          sub="امتحاناتك، مراجعاتك المتباعدة (7 و3 ويوم قبل كل امتحان)، وأيام خططك — كل شيء في مكان واحد.">
          <div className="cal-nav no-print">
            <button type="button" className="icon-btn teal" onClick={function () { shift(-1); }} aria-label="الشهر السابق"><UI.Icon name="chevronDown" size={15} className="rot90" /></button>
            <strong className="cal-title">{monthName} {y}</strong>
            <button type="button" className="icon-btn teal" onClick={function () { shift(1); }} aria-label="الشهر التالي"><UI.Icon name="chevronDown" size={15} className="rot270" /></button>
            <button type="button" className="btn btn-soft btn-sm" onClick={function () { const t = new Date(); setCursor({ y: t.getFullYear(), m: t.getMonth() }); setSelected(Core.todayStr()); }}>اليوم</button>
          </div>
        </UI.CardHeader>

        <div className="cal-legend no-print">
          <span><i className="lg-dot" style={{ background: '#e11d48' }} /> امتحان</span>
          <span><i className="lg-dot" style={{ background: '#f59e0b' }} /> مراجعة متباعدة</span>
          <span><i className="lg-dot" style={{ background: '#0d9488' }} /> يوم خطة مذاكرة</span>
          <span><i className="lg-dot lg-today" /> اليوم</span>
        </div>

        <div className="cal-grid" role="grid">
          {WEEK.map(function (w) { return <div key={w} className="cal-weekday">{w}</div>; })}
          {cells.map(function (d, i) {
            if (d === null) return <div key={'b' + i} className="cal-cell blank" />;
            const key = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
            const evs = events[key] || [];
            const hasExam = evs.some(function (e) { return e.type === 'exam'; });
            const hasReview = evs.some(function (e) { return e.type === 'review'; });
            const hasPlan = evs.some(function (e) { return e.type === 'plan'; });
            return (
              <button key={key} type="button"
                className={'cal-cell' + (key === today ? ' today' : '') + (key === selected ? ' selected' : '') + (hasExam ? ' has-exam' : '')}
                onClick={function () { setSelected(key); }}>
                <span className="cal-day">{d}</span>
                <span className="cal-dots">
                  {hasPlan ? <i className="lg-dot" style={{ background: '#0d9488' }} /> : null}
                  {hasReview ? <i className="lg-dot" style={{ background: '#f59e0b' }} /> : null}
                  {hasExam ? <i className="lg-dot" style={{ background: '#e11d48' }} /> : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className="cal-detail">
          <h4><UI.Icon name="calendar" size={14} /> أحداث {Core.fmtDate(selected)} {selected === today ? '(اليوم)' : ''}</h4>
          {selEvents.length === 0 ? (
            <p className="muted cal-empty">لا أحداث في هذا اليوم — يوم هادئ، استغله في التقديم!</p>
          ) : (
            <div className="cal-events">
              {selEvents.map(function (ev, i) {
                return (
                  <div key={i} className="cal-event" style={{ borderInlineStartColor: ev.color }}>
                    <span className="cal-ev-icon" style={{ color: ev.color }}>
                      <UI.Icon name={ev.type === 'exam' ? 'zap' : ev.type === 'review' ? 'refresh' : 'book'} size={14} />
                    </span>
                    <span className="cal-ev-label">{ev.label}</span>
                    {ev.type === 'exam' ? <UI.Badge color={ev.color}>{ev.exam.time}</UI.Badge> : null}
                    {ev.type === 'plan' && ev.entry ? (
                      <span className="cal-ev-extra">{ev.entry.slides} سلايد • شابتر {ev.entry.chapters}
                        <label className="cal-done">
                          <input type="checkbox" checked={Boolean(ev.entry.done)} onChange={function () { onToggleDay(ev.plan.id, ev.entry.date); }} />
                          تم
                        </label>
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/* ============ مؤقت البومودورو العائم ============ */
const PomodoroWidget = function PomodoroWidget({ pomo, settings, plans, now, onStart, onPause, onSkip, onClose, onLinkPlan }) {
  const totalMs = Algo.pomoMinutes(pomo.mode, settings) * 60000;
  const remain = pomo.running ? Math.max(0, pomo.endsAt - now) : pomo.remainMs;
  const pct = Core.clamp(Math.round((1 - remain / totalMs) * 100), 0, 100);
  const mm = Math.floor(remain / 60000);
  const ss = Math.floor((remain % 60000) / 1000);
  const isFocus = pomo.mode === 'focus';
  const modeColor = isFocus ? '#0d9488' : pomo.mode === 'brk' ? '#f59e0b' : '#06b6d4';
  const cycleInSet = (pomo.cycles % 4) + (isFocus ? 1 : 0);

  return (
    <div className={'pomo-widget glass' + (pomo.running ? ' running' : '')} style={{ '--accent': modeColor }}>
      <div className="pomo-head">
        <span className="pomo-title"><UI.Icon name="hourglass" size={15} /> {Algo.pomoLabel(pomo.mode)}</span>
        <div className="action-group">
          <button type="button" className="icon-btn red" onClick={onClose} aria-label="إغلاق البومودورو"><UI.Icon name="x" size={13} /></button>
        </div>
      </div>
      <div className="pomo-body">
        <UI.Ring pct={pct} size={92} stroke={8} color={modeColor}>
          <strong className="pomo-time" dir="ltr">{String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}</strong>
        </UI.Ring>
        <div className="pomo-side">
          <div className="pomo-dots" title={'الجلسة ' + cycleInSet + ' من 4'}>
            {[1, 2, 3, 4].map(function (n) {
              return <i key={n} className={'pomo-dot' + (n <= cycleInSet ? ' on' : '')} />;
            })}
          </div>
          <select className="pomo-plan-select" value={pomo.planId || ''} onChange={function (e) { onLinkPlan(e.target.value); }} aria-label="ربط بمادة">
            <option value="">بدون ربط بمادة</option>
            {plans.filter(function (p) { return !p.isCompleted; }).map(function (p) {
              return <option key={p.id} value={p.id}>{p.subject}</option>;
            })}
          </select>
          <div className="pomo-actions">
            <button type="button" className={'btn btn-sm ' + (pomo.running ? 'btn-warning' : 'btn-primary')} onClick={pomo.running ? onPause : onStart}>
              <UI.Icon name={pomo.running ? 'pause' : 'play'} size={13} /> {pomo.running ? 'إيقاف مؤقت' : 'ابدأ'}
            </button>
            <button type="button" className="btn btn-sm btn-soft" onClick={onSkip} title="إنهاء المرحلة الحالية والانتقال للتالية">
              <UI.Icon name="refresh" size={13} /> تخطي
            </button>
          </div>
        </div>
      </div>
      <p className="pomo-hint">
        {isFocus ? 'كل جلسة تركيز مكتملة تُسجل تلقائياً في إحصائيات اليوم' + (pomo.planId ? ' وفي وقت الخطة المرتبطة.' : '.') : 'استرح بعيداً عن الشاشة — عقلك يستحق فسحة!'}
      </p>
    </div>
  );
};

const Screens3 = { CalendarTab, SmartPlanModal, NotesModal, PomodoroWidget };
