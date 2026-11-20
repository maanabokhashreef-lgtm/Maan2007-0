/* تم توليد هذا الملف تلقائياً من src/algo.jsx — عدّل ملف المصدر ثم شغّل: npm run build */
const Algo = {
  weightedSchedule(exam, startDate, endDate, dailyHours, restDays) {
    try {
      const start = new Date(startDate + 'T12:00:00');
      const end = new Date(endDate + 'T12:00:00');
      if (isNaN(start) || isNaN(end) || end < start) return {
        ok: false,
        error: 'الفترة غير صالحة'
      };
      const totalSlides = parseInt(exam.slides, 10) || 0;
      const totalChapters = parseInt(exam.chapters, 10) || 1;
      if (totalSlides <= 0) return {
        ok: false,
        error: 'هذه المادة بلا سلايدات — أضف عددها أولاً'
      };
      const days = [];
      const cur = new Date(start);
      while (cur <= end) {
        if (!restDays.includes(cur.getDay())) days.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
      }
      const n = days.length;
      if (n === 0) return {
        ok: false,
        error: 'كل أيام الفترة أيام راحة — اختر فترة أو أيام راحة أخرى'
      };
      const weights = days.map(function (_, i) {
        const t = n === 1 ? 0 : i / (n - 1);
        return 1.25 - 0.5 * t;
      });
      const W = weights.reduce(function (a, b) {
        return a + b;
      }, 0);
      const raw = weights.map(function (w) {
        return totalSlides * w / W;
      });
      const floors = raw.map(function (x) {
        return Math.floor(x);
      });
      let remainder = totalSlides - floors.reduce(function (a, b) {
        return a + b;
      }, 0);
      const order = raw.map(function (x, i) {
        return {
          i,
          frac: x - Math.floor(x)
        };
      }).sort(function (a, b) {
        return b.frac - a.frac;
      });
      for (let k = 0; k < order.length && remainder > 0; k++, remainder--) floors[order[k].i]++;
      const slidesPerChapter = totalSlides / totalChapters;
      let cumulative = 0;
      const schedule = days.map(function (d, i) {
        cumulative += floors[i];
        const fromCh = Math.floor((cumulative - floors[i]) / slidesPerChapter) + 1;
        const toCh = Math.min(totalChapters, Math.max(1, Math.ceil(cumulative / slidesPerChapter)));
        const load = weights[i] / 1.25;
        return {
          date: Core.todayStr(d),
          dayName: Core.dayShort(Core.todayStr(d)),
          slides: floors[i],
          chapters: fromCh === toCh ? String(fromCh) : fromCh + '–' + toCh,
          load: Math.round(load * 100),
          heavy: weights[i] >= 1.1,
          light: weights[i] <= 0.85
        };
      });
      return {
        ok: true,
        schedule,
        summary: {
          days: n,
          restDays: Math.round((end - start) / 86400000) + 1 - n,
          perDayHours: dailyHours,
          totalHours: Math.round(n * dailyHours * 10) / 10,
          slidesPerDay: Math.round(totalSlides / n)
        }
      };
    } catch (e) {
      return {
        ok: false,
        error: 'تعذر توليد الجدول'
      };
    }
  },
  todayPriorities(exams, plans, now) {
    const items = exams.map(function (e, i) {
      const cd = Core.countdown(e, now);
      const ready = Core.examReadiness(e, plans, now);
      const daysLeft = cd.done ? -1 : Math.ceil(cd.total / 86400000);
      const urgency = cd.done ? 0 : 1 / (daysLeft + 1);
      const deficit = 1 - ready.pct / 100;
      return {
        exam: e,
        index: i,
        cd,
        ready,
        daysLeft,
        score: cd.done ? -1 : urgency * 0.6 + deficit * 0.4
      };
    });
    items.sort(function (a, b) {
      return b.score - a.score;
    });
    return items;
  },
  todayFocus(exams, plans, now) {
    const items = this.todayPriorities(exams, plans, now).filter(function (x) {
      return x.score > 0;
    });
    if (!items.length) return null;
    const top = items[0];
    let smartEntry = null;
    const today = Core.todayStr();
    for (const p of plans) {
      if (p.examId !== top.exam.id || !p.schedule) continue;
      const entry = (p.schedule || []).find(function (s) {
        return s.date === today && !s.done;
      });
      if (entry) {
        smartEntry = entry;
        break;
      }
    }
    return {
      top,
      runnerUp: items[1] || null,
      smartEntry
    };
  },
  paceInfo(exam, plans, now) {
    const ready = Core.examReadiness(exam, plans, now);
    const cd = Core.countdown(exam, now);
    if (cd.done) return {
      status: 'done',
      label: 'انتهى'
    };
    const linked = plans.filter(function (p) {
      return p.examId === exam.id;
    });
    if (!linked.length || ready.target === 0) return {
      status: 'none',
      label: 'بلا خطة'
    };
    const slides = parseInt(exam.slides, 10) || 0;
    const doneSlides = Math.round(slides * ready.pct / 100);
    const daysLeft = Math.max(1, Math.ceil(cd.total / 86400000));
    const requiredPerDay = Math.ceil((slides - doneSlides) / daysLeft);
    const firstPlan = linked.reduce(function (a, p) {
      return (p.createdAt || 0) < (a.createdAt || 0) ? a : p;
    }, linked[0]);
    const planAgeDays = Math.max(1, Math.ceil((now - (firstPlan.createdAt || now)) / 86400000));
    const currentPerDay = Math.round(doneSlides / planAgeDays);
    let status = 'ok';
    if (requiredPerDay > currentPerDay * 1.15) status = 'behind';else if (currentPerDay > requiredPerDay * 1.15) status = 'ahead';
    const labels = {
      ok: 'على المسار — ' + currentPerDay + ' سلايد/يوم',
      behind: 'متأخر — تحتاج ' + requiredPerDay + ' سلايد/يوم',
      ahead: 'متقدم — ' + currentPerDay + ' سلايد/يوم'
    };
    const colors = {
      ok: '#10b981',
      behind: '#e11d48',
      ahead: '#0ea5e9'
    };
    return {
      status,
      label: labels[status],
      color: colors[status],
      doneSlides,
      requiredPerDay,
      currentPerDay,
      daysLeft
    };
  },
  reviewMilestones(exam) {
    const target = Core.examDateTime(exam);
    if (isNaN(target)) return [];
    const defs = [{
      offset: 7,
      label: 'مراجعة أولى'
    }, {
      offset: 3,
      label: 'مراجعة ثانية'
    }, {
      offset: 1,
      label: 'المراجعة النهائية'
    }];
    const today = Core.todayStr();
    return defs.map(function (d) {
      const dt = new Date(target);
      dt.setDate(dt.getDate() - d.offset);
      return {
        date: Core.todayStr(dt),
        label: d.label,
        past: Core.todayStr(dt) < today
      };
    });
  },
  readinessGrade(exam, plans, now, streakPct) {
    const ready = Core.examReadiness(exam, plans, now);
    let scheduleDone = null;
    const linked = plans.filter(function (p) {
      return p.examId === exam.id && p.schedule && p.schedule.length;
    });
    if (linked.length) {
      let total = 0,
        done = 0;
      linked.forEach(function (p) {
        p.schedule.forEach(function (s) {
          total++;
          if (s.done) done++;
        });
      });
      scheduleDone = total ? Math.round(done / total * 100) : 0;
    }
    const coverage = ready.pct;
    const schedulePart = scheduleDone === null ? coverage : scheduleDone;
    const streakPart = Math.min(100, Math.max(0, streakPct || 0));
    const score = Math.round(coverage * 0.65 + schedulePart * 0.2 + streakPart * 0.15);
    let grade = 'يحتاج تركيز',
      color = '#e11d48',
      letter = 'C';
    if (score >= 85) {
      grade = 'ممتاز';
      color = '#10b981';
      letter = 'A';
    } else if (score >= 70) {
      grade = 'جيد جداً';
      color = '#0d9488';
      letter = 'B';
    } else if (score >= 50) {
      grade = 'جيد';
      color = '#f59e0b';
      letter = 'C';
    }
    return {
      score,
      grade,
      color,
      letter,
      scheduleDone,
      coverage
    };
  },
  POMO_DEFAULTS: {
    focus: 25,
    brk: 5,
    long: 15
  },
  pomoNext(mode, cycles) {
    if (mode === 'focus') {
      const nextCycle = cycles + 1;
      return nextCycle % 4 === 0 ? 'long' : 'brk';
    }
    return 'focus';
  },
  pomoMinutes(mode, settings) {
    const p = settings && settings.pomo || this.POMO_DEFAULTS;
    if (mode === 'focus') return p.focus;
    if (mode === 'brk') return p.brk;
    return p.long;
  },
  pomoLabel(mode) {
    return mode === 'focus' ? 'جلسة تركيز' : mode === 'brk' ? 'استراحة قصيرة' : 'استراحة طويلة';
  }
};