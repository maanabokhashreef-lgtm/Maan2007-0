/* تم توليد هذا الملف تلقائياً من src/core.jsx — عدّل ملف المصدر ثم شغّل: npm run build */
const Core = {
  K: {
    profile: 'mfs_profile_v2',
    exams: 'mfs_exams_v2',
    plans: 'mfs_plans_v2',
    stats: 'mfs_stats_v2',
    settings: 'mfs_settings_v2',
    achievements: 'mfs_achievements_v2',
    quote: 'mfs_quote_v2',
    notifs: 'mfs_notifs_v2',
    pomo: 'mfs_pomo_v2',
    backupV1: 'mfs_backup_v1'
  },
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  },
  migrate() {
    try {
      if (localStorage.getItem(this.K.exams) !== null) return;
      const oldProfile = localStorage.getItem('medStudentProfile');
      const oldExams = localStorage.getItem('medExams');
      const oldPlans = localStorage.getItem('medStudyPlans');
      const oldQuote = localStorage.getItem('medCurrentQuote');
      if (oldProfile || oldExams || oldPlans || oldQuote) {
        this.set(this.K.backupV1, {
          profile: oldProfile,
          exams: oldExams,
          plans: oldPlans,
          quote: oldQuote
        });
      }
      let exams = [];
      if (oldExams) {
        exams = (JSON.parse(oldExams) || []).map(function (e) {
          return {
            id: Core.uid(),
            subject: String(e.subject || 'مادة'),
            date: e.date,
            time: e.time,
            chapters: parseInt(e.chapters, 10) || 1,
            slides: parseInt(e.slides, 10) || 0,
            createdAt: Date.now()
          };
        });
        this.set(this.K.exams, exams);
      }
      if (oldPlans) {
        const bySubject = {};
        exams.forEach(function (e) {
          bySubject[e.subject] = e.id;
        });
        const plans = (JSON.parse(oldPlans) || []).map(function (p) {
          return {
            id: Core.uid(),
            examId: bySubject[p.subject] || null,
            subject: String(p.subject || ''),
            startDate: p.startDate,
            endDate: p.endDate,
            dailyHours: p.dailyHours || 1,
            elapsedSeconds: parseInt(p.elapsedSeconds, 10) || 0,
            isRunning: false,
            lastStartTime: null,
            isCompleted: !!p.isCompleted,
            completedAt: null,
            createdAt: Date.now()
          };
        });
        this.set(this.K.plans, plans);
      }
      if (oldProfile) {
        const p = JSON.parse(oldProfile);
        this.set(this.K.profile, {
          username: p.username || '',
          email: p.email || '',
          studentId: p.studentId || '',
          college: p.college || '',
          year: p.year || ''
        });
      }
      ['medStudentProfile', 'medExams', 'medStudyPlans', 'medCurrentQuote'].forEach(function (k) {
        localStorage.removeItem(k);
      });
    } catch (e) {
      console.warn('migration failed', e);
    }
  },
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  },
  todayStr(d) {
    const t = d ? new Date(d) : new Date();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const day = String(t.getDate()).padStart(2, '0');
    return t.getFullYear() + '-' + m + '-' + day;
  },
  dayShort(dateStr) {
    try {
      return ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'][new Date(dateStr + 'T12:00:00').getDay()];
    } catch (e) {
      return '';
    }
  },
  fmtDate(dateStr) {
    if (!dateStr) return '—';
    return this.dayShort(dateStr) + ' ' + dateStr.slice(5);
  },
  fmtHMS(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600),
      m = Math.floor(sec % 3600 / 60),
      s = sec % 60;
    return [h, m, s].map(function (v) {
      return String(v).padStart(2, '0');
    }).join(':');
  },
  fmtDur(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600),
      m = Math.floor(sec % 3600 / 60);
    if (h === 0 && m === 0) return 'أقل من دقيقة';
    if (h === 0) return m + ' دقيقة';
    if (m === 0) return h + ' ساعة';
    return h + ' س ' + m + ' د';
  },
  clamp(v, lo, hi) {
    return Math.min(hi, Math.max(lo, v));
  },
  examDateTime(exam) {
    try {
      return new Date(exam.date + 'T' + (exam.time || '08:00'));
    } catch (e) {
      return new Date(NaN);
    }
  },
  countdown(exam, now) {
    const target = this.examDateTime(exam).getTime();
    const diff = target - now;
    if (isNaN(target)) return {
      done: true,
      total: 0,
      d: 0,
      h: 0,
      m: 0,
      s: 0
    };
    if (diff <= 0) return {
      done: true,
      total: 0,
      d: 0,
      h: 0,
      m: 0,
      s: 0
    };
    return {
      done: false,
      total: diff,
      d: Math.floor(diff / 86400000),
      h: Math.floor(diff / 3600000 % 24),
      m: Math.floor(diff / 60000 % 60),
      s: Math.floor(diff / 1000 % 60)
    };
  },
  planDays(plan) {
    try {
      const s = new Date(plan.startDate + 'T12:00:00');
      const e = new Date(plan.endDate + 'T12:00:00');
      return Math.max(1, Math.round((e - s) / 86400000) + 1);
    } catch (e) {
      return 1;
    }
  },
  planTargetHours(plan) {
    return this.planDays(plan) * (parseFloat(plan.dailyHours) || 0);
  },
  planElapsed(plan, now) {
    let total = plan.elapsedSeconds || 0;
    if (plan.isRunning && plan.lastStartTime) {
      total += Math.floor(this.clamp((now - plan.lastStartTime) / 1000, 0, 43200));
    }
    return Math.max(0, total);
  },
  planPct(plan, now) {
    const target = this.planTargetHours(plan) * 3600;
    if (target <= 0) return 0;
    return this.clamp(Math.round(this.planElapsed(plan, now) / target * 100), 0, 100);
  },
  planDailySlides(plan, exams) {
    const exam = exams.find(function (e) {
      return e.id === plan.examId;
    });
    if (!exam || !exam.slides) return null;
    return Math.ceil(exam.slides / this.planDays(plan));
  },
  examReadiness(exam, plans, now) {
    let elapsed = 0,
      target = 0;
    plans.forEach(function (p) {
      if (p.examId === exam.id) {
        elapsed += Core.planElapsed(p, now);
        target += Core.planTargetHours(p) * 3600;
      }
    });
    const pct = target > 0 ? Core.clamp(Math.round(elapsed / target * 100), 0, 100) : 0;
    return {
      pct,
      elapsed,
      target
    };
  },
  totalStudySeconds(plans, now) {
    return plans.reduce(function (acc, p) {
      return acc + Core.planElapsed(p, now);
    }, 0);
  },
  streakInfo(daily, goalMin) {
    daily = daily || {};
    const goal = (goalMin || 60) * 60;
    const keys = Object.keys(daily).sort();
    const met = {};
    keys.forEach(function (k) {
      met[k] = (daily[k] || 0) >= goal;
    });
    let current = 0;
    const today = Core.todayStr();
    let cursor = new Date();
    if (!met[today]) cursor.setDate(cursor.getDate() - 1);
    for (;;) {
      const k = Core.todayStr(cursor);
      if (met[k]) {
        current++;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
      if (current > 3650) break;
    }
    let best = 0,
      run = 0,
      prev = null;
    keys.forEach(function (k) {
      if (met[k]) {
        if (prev !== null) {
          const diff = Math.round((new Date(k + 'T12:00:00') - new Date(prev + 'T12:00:00')) / 86400000);
          run = diff === 1 ? run + 1 : 1;
        } else run = 1;
        best = Math.max(best, run);
        prev = k;
      } else {
        run = 0;
        prev = null;
      }
    });
    const todaySec = daily[today] || 0;
    return {
      current,
      best,
      todaySec,
      todayPct: Core.clamp(Math.round(todaySec / goal * 100), 0, 100)
    };
  },
  ACH: [{
    id: 'first_subject',
    icon: 'book',
    color: '#6366f1',
    title: 'الخطوة الأولى',
    desc: 'أضف أول مادة إلى جدول الامتحانات'
  }, {
    id: 'five_subjects',
    icon: 'layers',
    color: '#0ea5e9',
    title: 'منظم محترف',
    desc: 'أضف 5 مواد أو أكثر'
  }, {
    id: 'first_plan',
    icon: 'target',
    color: '#8b5cf6',
    title: 'خطة واضحة',
    desc: 'أنشئ أول خطة مذاكرة'
  }, {
    id: 'hour1',
    icon: 'clock',
    color: '#f59e0b',
    title: 'ساعة تركيز',
    desc: 'اجمع ساعة مذاكرة كاملة بالمؤقت'
  }, {
    id: 'hours5',
    icon: 'zap',
    color: '#ec4899',
    title: 'خمس ساعات إنتاجية',
    desc: 'اجمع 5 ساعات مذاكرة'
  }, {
    id: 'hours10',
    icon: 'flame',
    color: '#f43f5e',
    title: 'عشر ساعات ذهبية',
    desc: 'اجمع 10 ساعات مذاكرة'
  }, {
    id: 'streak3',
    icon: 'flame',
    color: '#f97316',
    title: 'ملتزم',
    desc: 'ذاكر 3 أيام متتالية حسب هدفك اليومي'
  }, {
    id: 'streak7',
    icon: 'award',
    color: '#f59e0b',
    title: 'أسطورة الانضباط',
    desc: 'ذاكر 7 أيام متتالية حسب هدفك اليومي'
  }, {
    id: 'first_complete',
    icon: 'checkCircle',
    color: '#10b981',
    title: 'بداية الإنجاز',
    desc: 'أكمل أول خطة مذاكرة'
  }, {
    id: 'three_completes',
    icon: 'award',
    color: '#10b981',
    title: 'مراجع مجتهد',
    desc: 'أكمل 3 خطط مذاكرة'
  }, {
    id: 'ready100',
    icon: 'target',
    color: '#14b8a6',
    title: 'جاهز للمعركة',
    desc: 'أكمل 100% من الوقت المستهدف لأي خطة'
  }, {
    id: 'backup',
    icon: 'download',
    color: '#0ea5e9',
    title: 'أمين الأرشيف',
    desc: 'صدّر نسخة احتياطية من بياناتك'
  }, {
    id: 'smart_plan',
    icon: 'zap',
    color: '#0d9488',
    title: 'مهندس الخطط',
    desc: 'ولّد خطة ذكية موزونة بالمولد الآلي'
  }, {
    id: 'pomo5',
    icon: 'target',
    color: '#e11d48',
    title: 'جامع التركيز',
    desc: 'أكمل 5 جلسات بومودورو بنجاح'
  }, {
    id: 'pomo15',
    icon: 'award',
    color: '#f59e0b',
    title: 'سيد التركيز',
    desc: 'أكمل 15 جلسة بومودورو'
  }, {
    id: 'notes',
    icon: 'edit',
    color: '#06b6d4',
    title: 'كاتب الأفكار',
    desc: 'احفظ ملاحظة مراجعة لأحدى موادك'
  }],
  evalAchievements(data) {
    const done = [];
    const totalStudy = this.totalStudySeconds(data.plans, data.now);
    const streak = this.streakInfo(data.stats, data.settings.dailyGoalMin);
    const completed = data.plans.filter(function (p) {
      return p.isCompleted;
    }).length;
    const ex = data.extras || {};
    if (data.exams.length >= 1) done.push('first_subject');
    if (data.exams.length >= 5) done.push('five_subjects');
    if (data.plans.length >= 1) done.push('first_plan');
    if (totalStudy >= 3600) done.push('hour1');
    if (totalStudy >= 18000) done.push('hours5');
    if (totalStudy >= 36000) done.push('hours10');
    if (streak.current >= 3) done.push('streak3');
    if (streak.current >= 7) done.push('streak7');
    if (completed >= 1) done.push('first_complete');
    if (completed >= 3) done.push('three_completes');
    if (data.plans.some(function (p) {
      return Core.planPct(p, data.now) >= 100;
    })) done.push('ready100');
    if (data.plans.some(function (p) {
      return p.generated;
    })) done.push('smart_plan');
    if ((ex.pomoSessions || 0) >= 5) done.push('pomo5');
    if ((ex.pomoSessions || 0) >= 15) done.push('pomo15');
    if (data.exams.some(function (e) {
      return e.notes && String(e.notes).trim().length > 0;
    })) done.push('notes');
    return done;
  },
  rebaseRunning(plans, stats) {
    const now = Date.now();
    const daily = Object.assign({}, stats);
    let changed = false;
    const next = plans.map(function (p) {
      if (p.isRunning && p.lastStartTime) {
        const session = Math.floor(Core.clamp((now - p.lastStartTime) / 1000, 0, 43200));
        const dayKey = Core.todayStr(new Date(p.lastStartTime));
        if (session > 0) {
          daily[dayKey] = (daily[dayKey] || 0) + session;
        }
        changed = true;
        return Object.assign({}, p, {
          elapsedSeconds: (p.elapsedSeconds || 0) + session,
          lastStartTime: now
        });
      }
      return p;
    });
    return {
      plans: next,
      stats: daily,
      changed
    };
  },
  flushPlan(plan, now) {
    if (!plan.isRunning || !plan.lastStartTime) return {
      plan,
      session: 0
    };
    const session = Math.floor(Core.clamp((now - plan.lastStartTime) / 1000, 0, 43200));
    const dayKey = Core.todayStr(new Date(plan.lastStartTime));
    const next = Object.assign({}, plan, {
      elapsedSeconds: (plan.elapsedSeconds || 0) + session,
      isRunning: false,
      lastStartTime: null
    });
    return {
      plan: next,
      session,
      dayKey
    };
  },
  buildBackup(payload) {
    return {
      app: 'Med~Final~Study',
      version: 3,
      exportedAt: new Date().toISOString(),
      profile: payload.profile,
      exams: payload.exams,
      plans: payload.plans,
      stats: payload.stats,
      settings: payload.settings,
      achievements: payload.achievements,
      pomo: payload.pomo || {
        sessions: 0
      }
    };
  },
  validateImport(obj) {
    if (!obj || typeof obj !== 'object') return {
      ok: false,
      error: 'الملف غير صالح'
    };
    if (obj.app !== 'Med~Final~Study') return {
      ok: false,
      error: 'هذا الملف ليس نسخة احتياطية من المنظم'
    };
    if (!Array.isArray(obj.exams)) return {
      ok: false,
      error: 'بيانات المواد مفقودة أو تالفة'
    };
    if (!Array.isArray(obj.plans)) return {
      ok: false,
      error: 'بيانات الخطط مفقودة أو تالفة'
    };
    return {
      ok: true,
      data: obj
    };
  },
  downloadJSON(obj, filename) {
    try {
      const blob = new Blob([JSON.stringify(obj, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1500);
      return true;
    } catch (e) {
      return false;
    }
  },
  demoProfile: {
    username: 'طالب تجريبي',
    email: 'demo@student.iust.edu.sy',
    studentId: '2024001',
    college: 'الصيدلة',
    year: '3'
  },
  demoContent: function () {
    const now = Date.now();
    const day = 86400000;
    const d = function (offset) {
      return Core.todayStr(new Date(now + offset * day));
    };
    const exams = [{
      id: Core.uid(),
      subject: 'Pharmacology I',
      date: d(6),
      time: '09:00',
      chapters: 8,
      slides: 320,
      createdAt: now
    }, {
      id: Core.uid(),
      subject: 'Anatomy',
      date: d(10),
      time: '11:30',
      chapters: 12,
      slides: 540,
      createdAt: now
    }, {
      id: Core.uid(),
      subject: 'Organic Chemistry',
      date: d(14),
      time: '13:00',
      chapters: 6,
      slides: 240,
      createdAt: now
    }];
    const plans = [{
      id: Core.uid(),
      examId: exams[0].id,
      subject: exams[0].subject,
      startDate: d(0),
      endDate: d(5),
      dailyHours: 3,
      elapsedSeconds: 4800,
      isRunning: false,
      lastStartTime: null,
      isCompleted: false,
      completedAt: null,
      createdAt: now
    }, {
      id: Core.uid(),
      examId: exams[1].id,
      subject: exams[1].subject,
      startDate: d(1),
      endDate: d(9),
      dailyHours: 2.5,
      elapsedSeconds: 0,
      isRunning: false,
      lastStartTime: null,
      isCompleted: false,
      completedAt: null,
      createdAt: now
    }];
    try {
      const gen = Algo.weightedSchedule(exams[0], d(0), d(5), 3, []);
      if (gen.ok) {
        plans[0].schedule = gen.schedule;
        plans[0].generated = true;
      }
    } catch (e) {}
    return {
      exams,
      plans
    };
  },
  QUOTES: ['النجاح هو مجموع مجهودات صغيرة تتكرر يوماً بعد يوم.', 'تعب المذاكرة يزول، وفرحة الإنجاز تبقى طويلاً.', 'لا تؤجل عمل اليوم إلى الغد، ابدأ الآن ولو بنصف ساعة.', 'كل ساعة تقضيها في الدراسة تقربك خطوة من هدفك.', 'التركيز والاستمرارية هما سر التفوق في الاختبارات.', 'أنت قادر على تجاوز كل الصعاب، ثق بقدراتك واجتهد.', 'صعوبة اليوم هي قوة الغد؛ استمر ولا تتوقف.', 'كل صفحة تقرأها اليوم توفر عليك قلق الامتحان غداً.', 'الانضباط يتفوق على الحماس عندما يقل الدافع.', 'مجهودك في Med و Final هو استثمار مباشر في مستقبلك.', 'قسّم الكبير إلى صغير، وستجد المستحيل ممكناً.', 'المراجعة المبكرة أرحم من الازدحام الليلي قبل الامتحان.', 'لا تقس نجاحك بساعات الجلوس، بل بما حفظته وفهمته فعلاً.', 'أعطِ عقلك فترات راحة قصيرة، فإنه يعود أسرع وأصفى.', 'اليوم الذي لا تذاكر فيه شيئاً هو يوم خسرته؛ اجعل أيامك كلها رابحة.'],
  COLLEGES: ['الصيدلة', 'طب الأسنان', 'الهندسة المعلوماتية', 'هندسة الإتصالات', 'هندسة مدنية', 'هندسة معمارية', 'تصميم داخلي و ديكور', 'إدارة الأعمال'],
  YEARS: ['1', '2', '3', '4', '5'],
  COLORS: ['#0d9488', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#e11d48', '#f97316', '#14b8a6'],
  colorOf(index) {
    return this.COLORS[index % this.COLORS.length];
  },
  fireConfetti() {
    try {
      const existing = document.getElementById('mfs-confetti');
      if (existing) return;
      const canvas = document.createElement('canvas');
      canvas.id = 'mfs-confetti';
      canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999';
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      const W = canvas.width = window.innerWidth;
      const H = canvas.height = window.innerHeight;
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9', '#f43f5e'];
      const parts = [];
      for (let i = 0; i < 130; i++) {
        parts.push({
          x: W / 2 + (Math.random() - 0.5) * W * 0.55,
          y: H * 0.28 + Math.random() * 60,
          vx: (Math.random() - 0.5) * 9,
          vy: -6 - Math.random() * 7,
          w: 5 + Math.random() * 6,
          h: 8 + Math.random() * 8,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      const started = performance.now();
      function frame(t) {
        const elapsed = t - started;
        ctx.clearRect(0, 0, W, H);
        let alive = false;
        parts.forEach(function (p) {
          p.vy += 0.22;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          if (p.y < H + 40) alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, 1 - elapsed / 2600);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        });
        if (alive && elapsed < 2700) requestAnimationFrame(frame);else canvas.remove();
      }
      requestAnimationFrame(frame);
    } catch (e) {}
  }
};