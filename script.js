const quotes = [
    "النجاح هو مجموع مجهودات صغيرة تتكرر يوماً بعد يوم.",
    "تعب المذاكرة يزول، وفرحة الإنجاز تبقى طويلاً.",
    "لا تؤجل عمل اليوم إلى الغد، ابدأ الآن ولو بنصف ساعة.",
    "كل ساعة تقضيها في الدراسة تقربك خطوة من هدفك.",
    "التركيز والاستمرارية هما سر التفوق في الاختبارات.",
    "أنت قادر على تجاوز كل الصعاب، ثق بقدراتك واجتهد.",
    "صعوبة اليوم هي قوة الغد؛ استمر ولا تتوقف.",
    "كل صفحة تقرأها اليوم توفر عليك قلق الامتحان غداً.",
    "الانضباط يتفوق على الحماس عندما يقل الدافع.",
    "مجهودك في Med و Final هو استثمار مباشر في مستقبلك."
];

const quoteText = document.getElementById('quote-text');
const newQuoteBtn = document.getElementById('new-quote-btn');

const savedQuote = localStorage.getItem('medCurrentQuote');
if (savedQuote) {
    quoteText.textContent = savedQuote;
}

newQuoteBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const chosenQuote = `"${quotes[randomIndex]}"`;
    quoteText.textContent = chosenQuote;
    localStorage.setItem('medCurrentQuote', chosenQuote);
});

// بوابة تسجيل الدخول الإجبارية وحفظ بيانات الطالب
const editProfileBtn = document.getElementById('edit-profile-btn');
const loginGate = document.getElementById('login-gate');
const loginForm = document.getElementById('login-form');
const plannerWorkspace = document.getElementById('planner-workspace');
const studentBanner = document.getElementById('student-banner');

let studentProfile = JSON.parse(localStorage.getItem('medStudentProfile')) || null;

function applyAuthState() {
    if (studentProfile && studentProfile.username && studentProfile.studentId) {
        loginGate.classList.add('hidden');
        plannerWorkspace.classList.remove('hidden');
        editProfileBtn.classList.remove('hidden');

        document.getElementById('student-username').value = studentProfile.username || '';
        document.getElementById('student-email').value = studentProfile.email || '';
        document.getElementById('student-id').value = studentProfile.studentId || '';
        document.getElementById('student-college').value = studentProfile.college || '';
        document.getElementById('student-year').value = studentProfile.year || '';

        studentBanner.innerHTML = `
            <span>
                مرحباً <strong>${studentProfile.username}</strong> |
                الرقم الجامعي: <strong>${studentProfile.studentId}</strong> |
                الكلية: <strong>${studentProfile.college}</strong> |
                السنة: <strong>السنة ${studentProfile.year}</strong>
            </span>
            <button type="button" class="edit-btn" onclick="openLoginGate()">تعديل بيانات الطالب</button>
        `;
    } else {
        loginGate.classList.remove('hidden');
        plannerWorkspace.classList.add('hidden');
        editProfileBtn.classList.add('hidden');
    }
}

window.openLoginGate = function() {
    loginGate.classList.remove('hidden');
    plannerWorkspace.classList.add('hidden');
};

editProfileBtn.addEventListener('click', () => {
    window.openLoginGate();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    studentProfile = {
        username: document.getElementById('student-username').value.trim(),
        email: document.getElementById('student-email').value.trim(),
        studentId: document.getElementById('student-id').value.trim(),
        college: document.getElementById('student-college').value.trim(),
        year: document.getElementById('student-year').value.trim()
    };
    localStorage.setItem('medStudentProfile', JSON.stringify(studentProfile));
    applyAuthState();
});

// بيانات جدول الدراسة وخطة المذاكرة
let exams = JSON.parse(localStorage.getItem('medExams')) || [];
let studyPlans = JSON.parse(localStorage.getItem('medStudyPlans')) || [];
let editingExamIndex = null;

const examForm = document.getElementById('exam-form');
const examSubmitBtn = examForm.querySelector('button[type="submit"]');
const examTableBody = document.getElementById('exam-table-body');
const studySubjectSelect = document.getElementById('study-subject');

const studyForm = document.getElementById('study-form');
const studyTableBody = document.getElementById('study-table-body');

function saveData() {
    localStorage.setItem('medExams', JSON.stringify(exams));
    localStorage.setItem('medStudyPlans', JSON.stringify(studyPlans));
}

function getTimeRemaining(dateStr, timeStr) {
    const examDateTime = new Date(`${dateStr}T${timeStr}`).getTime();
    const now = Date.now();
    const diff = examDateTime - now;

    if (diff <= 0) {
        return { text: "انتهى وقت الاختبار", status: "done" };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    let text = "";
    if (days > 0) text += `${days} يوم و `;
    text += `${hours} س : ${minutes} د : ${seconds} ث`;

    const status = days < 2 ? "urgent" : "normal";
    return { text, status };
}

function updateSubjectDropdown() {
    const currentSelected = studySubjectSelect.value;
    studySubjectSelect.innerHTML = '<option value="" disabled selected>اختر المادة من جدول الدراسة...</option>';
    exams.forEach(exam => {
        const option = document.createElement('option');
        option.value = exam.subject;
        option.textContent = exam.subject;
        if (exam.subject === currentSelected) {
            option.selected = true;
        }
        studySubjectSelect.appendChild(option);
    });
}

function renderExams() {
    exams.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    examTableBody.innerHTML = '';
    exams.forEach((exam, index) => {
        const remaining = getTimeRemaining(exam.date, exam.time);
        let badgeClass = 'countdown-badge';
        if (remaining.status === 'urgent') badgeClass += ' countdown-urgent';
        if (remaining.status === 'done') badgeClass += ' countdown-done';

        const avgSlides = (parseInt(exam.slides, 10) / parseInt(exam.chapters, 10)).toFixed(1);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${exam.subject}</strong></td>
            <td>${exam.date} <br><small style="color:var(--muted)">${exam.time}</small></td>
            <td>${exam.chapters} شابتر</td>
            <td>${exam.slides} سلايد</td>
            <td>${avgSlides} سلايد / شابتر</td>
            <td><span class="${badgeClass}" data-date="${exam.date}" data-time="${exam.time}">${remaining.text}</span></td>
            <td>
                <div class="action-group">
                    <button type="button" class="edit-btn" onclick="editExam(${index})">تعديل</button>
                    <button type="button" class="delete-btn" onclick="deleteExam(${index})">حذف</button>
                </div>
            </td>
        `;
        examTableBody.appendChild(row);
    });
    updateSubjectDropdown();
}

function updateCountdownsOnly() {
    const badges = document.querySelectorAll('.countdown-badge');
    badges.forEach(badge => {
        const date = badge.getAttribute('data-date');
        const time = badge.getAttribute('data-time');
        if (date && time) {
            const remaining = getTimeRemaining(date, time);
            badge.textContent = remaining.text;
            badge.className = 'countdown-badge';
            if (remaining.status === 'urgent') badge.classList.add('countdown-urgent');
            if (remaining.status === 'done') badge.classList.add('countdown-done');
        }
    });
}

examForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('exam-subject').value.trim();
    const date = document.getElementById('exam-date').value;
    const time = document.getElementById('exam-time').value;
    const chapters = document.getElementById('exam-chapters').value;
    const slides = document.getElementById('exam-slides').value;

    if (editingExamIndex !== null) {
        const oldSubject = exams[editingExamIndex].subject;
        exams[editingExamIndex] = { subject, date, time, chapters, slides };
        studyPlans.forEach(plan => {
            if (plan.subject === oldSubject) {
                plan.subject = subject;
            }
        });
        editingExamIndex = null;
        examSubmitBtn.textContent = 'إضافة مادة';
    } else {
        exams.push({ subject, date, time, chapters, slides });
    }

    saveData();
    renderExams();
    renderStudyPlans();
    examForm.reset();
});

window.editExam = function(index) {
    const exam = exams[index];
    document.getElementById('exam-subject').value = exam.subject;
    document.getElementById('exam-date').value = exam.date;
    document.getElementById('exam-time').value = exam.time;
    document.getElementById('exam-chapters').value = exam.chapters;
    document.getElementById('exam-slides').value = exam.slides;
    editingExamIndex = index;
    examSubmitBtn.textContent = 'حفظ التعديل';
    document.getElementById('exam-subject').focus();
};

window.deleteExam = function(index) {
    exams.splice(index, 1);
    if (editingExamIndex === index) {
        editingExamIndex = null;
        examSubmitBtn.textContent = 'إضافة مادة';
        examForm.reset();
    }
    saveData();
    renderExams();
};

function getElapsedStudySeconds(plan) {
    let total = plan.elapsedSeconds || 0;
    if (plan.isRunning && plan.lastStartTime) {
        total += Math.floor((Date.now() - plan.lastStartTime) / 1000);
    }
    return Math.max(0, total);
}

function formatSeconds(sec) {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return [hrs, mins, secs].map(v => String(v).padStart(2, '0')).join(':');
}

function renderStudyPlans() {
    studyTableBody.innerHTML = '';
    studyPlans.forEach((plan, index) => {
        const start = new Date(plan.startDate);
        const end = new Date(plan.endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const totalHours = (diffDays * parseFloat(plan.dailyHours)).toFixed(1);
        const elapsedText = formatSeconds(getElapsedStudySeconds(plan));
        const isCompleted = Boolean(plan.isCompleted);

        const row = document.createElement('tr');
        if (isCompleted) {
            row.classList.add('completed-row');
        }

        row.innerHTML = `
            <td><strong>${plan.subject}</strong></td>
            <td>${plan.startDate}</td>
            <td>${plan.endDate}</td>
            <td>${diffDays} يوم</td>
            <td>${plan.dailyHours} ساعة / يوم</td>
            <td><strong>${totalHours} ساعة</strong></td>
            <td>
                <div class="timer-box">
                    <span class="timer-display" id="timer-display-${index}">${elapsedText}</span>
                    <div class="action-group">
                        <button type="button" class="timer-btn ${plan.isRunning ? 'running' : ''}" onclick="toggleStudyTimer(${index})">
                            ${plan.isRunning ? 'إيقاف' : 'البدء'}
                        </button>
                        <button type="button" class="btn-small-secondary" onclick="resetStudyTimer(${index})">تصفير</button>
                    </div>
                </div>
            </td>
            <td>
                <button type="button" class="complete-btn ${isCompleted ? 'review-mode' : ''}" onclick="toggleCompletePlan(${index})">
                    ${isCompleted ? 'انقر للمراجعة' : 'تم الإنتهاء'}
                </button>
            </td>
            <td>
                <div class="action-group">
                    <button type="button" class="edit-btn" onclick="editStudySubject(${index})">تعديل المادة</button>
                    <button type="button" class="delete-btn" onclick="deleteStudyPlan(${index})">حذف</button>
                </div>
            </td>
        `;
        studyTableBody.appendChild(row);
    });
}

window.toggleCompletePlan = function(index) {
    const plan = studyPlans[index];
    if (!plan.isCompleted) {
        if (plan.isRunning) {
            plan.elapsedSeconds = getElapsedStudySeconds(plan);
            plan.isRunning = false;
            plan.lastStartTime = null;
        }
        plan.isCompleted = true;
    } else {
        plan.isCompleted = false;
    }
    saveData();
    renderStudyPlans();
};

window.toggleStudyTimer = function(index) {
    const plan = studyPlans[index];
    if (plan.isRunning) {
        plan.elapsedSeconds = getElapsedStudySeconds(plan);
        plan.isRunning = false;
        plan.lastStartTime = null;
    } else {
        plan.isRunning = true;
        plan.lastStartTime = Date.now();
    }
    saveData();
    renderStudyPlans();
};

window.resetStudyTimer = function(index) {
    studyPlans[index].elapsedSeconds = 0;
    studyPlans[index].isRunning = false;
    studyPlans[index].lastStartTime = null;
    saveData();
    renderStudyPlans();
};

window.editStudySubject = function(index) {
    const currentSubject = studyPlans[index].subject;
    const newSubject = prompt('أدخل اسم المادة الجديد:', currentSubject);
    if (newSubject && newSubject.trim() !== '') {
        studyPlans[index].subject = newSubject.trim();
        saveData();
        renderStudyPlans();
    }
};

function updateStudyTimersOnly() {
    studyPlans.forEach((plan, index) => {
        const el = document.getElementById(`timer-display-${index}`);
        if (el) {
            el.textContent = formatSeconds(getElapsedStudySeconds(plan));
        }
    });
}

studyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = studySubjectSelect.value;
    const startDate = document.getElementById('study-start').value;
    const endDate = document.getElementById('study-end').value;
    const dailyHours = document.getElementById('study-hours').value;

    if (new Date(endDate) < new Date(startDate)) {
        alert("تاريخ النهاية يجب أن يكون بعد أو نفس تاريخ البداية!");
        return;
    }

    studyPlans.push({
        subject,
        startDate,
        endDate,
        dailyHours,
        elapsedSeconds: 0,
        isRunning: false,
        lastStartTime: null,
        isCompleted: false
    });
    saveData();
    renderStudyPlans();
    studyForm.reset();
});

window.deleteStudyPlan = function(index) {
    studyPlans.splice(index, 1);
    saveData();
    renderStudyPlans();
};

window.addEventListener('beforeunload', saveData);

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateCountdownsOnly();
        updateStudyTimersOnly();
    }
});

applyAuthState();
renderExams();
renderStudyPlans();
setInterval(() => {
    updateCountdownsOnly();
    updateStudyTimersOnly();
}, 1000);