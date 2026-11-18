const quotes = [
    "النجاح هو مجموع مجهودات صغيرة تتكرر يوماً بعد يوم.",
    "تعب المذاكرة يزول، وفرحة الإنجاز تبقى طويلاً.",
    "لا تؤجل عمل اليوم إلى الغد، ابدأ الآن ولو بنصف ساعة.",
    "كل ساعة تقضيها في الدراسة تقربك خطوة من هدفك.",
    "التركيز والاستمرارية هما سر التفوق في الاختبارات.",
    "أنت قادر على تجاوز كل الصعاب، ثق بقدراتك واجتهد."
];

const quoteText = document.getElementById('quote-text');
const newQuoteBtn = document.getElementById('new-quote-btn');

// استرجاع العبارة المحفوظة أو عرض الافتراضية
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

// استرجاع البيانات المحفوظة من ذاكرة المتصفح الدائمة
let exams = JSON.parse(localStorage.getItem('medExams')) || [];
let studyPlans = JSON.parse(localStorage.getItem('medStudyPlans')) || [];

const examForm = document.getElementById('exam-form');
const examTableBody = document.getElementById('exam-table-body');
const studySubjectSelect = document.getElementById('study-subject');

const studyForm = document.getElementById('study-form');
const studyTableBody = document.getElementById('study-table-body');

// دالة الحفظ الفوري والدائم
function saveData() {
    localStorage.setItem('medExams', JSON.stringify(exams));
    localStorage.setItem('medStudyPlans', JSON.stringify(studyPlans));
}

// حساب الوقت المتبقي بدقة (أيام، ساعات، دقائق، ثواني) اعتماداً على ساعة النظام الفعلية
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

// تحديث قائمة المواد في جدول المذاكرة
function updateSubjectDropdown() {
    const currentSelected = studySubjectSelect.value;
    studySubjectSelect.innerHTML = '<option value="" disabled selected>اختر المادة من جدول الاختبارات...</option>';
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

// عرض جدول الاختبارات
function renderExams() {
    exams.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    
    examTableBody.innerHTML = '';
    exams.forEach((exam, index) => {
        const remaining = getTimeRemaining(exam.date, exam.time);
        let badgeClass = 'countdown-badge';
        if (remaining.status === 'urgent') badgeClass += ' countdown-urgent';
        if (remaining.status === 'done') badgeClass += ' countdown-done';

        const avgSlides = (parseInt(exam.slides) / parseInt(exam.chapters)).toFixed(1);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${exam.subject}</strong></td>
            <td>${exam.date} <br><small style="color:var(--muted)">${exam.time}</small></td>
            <td>${exam.chapters} شابتر</td>
            <td>${exam.slides} سلايد</td>
            <td>${avgSlides} سلايد / شابتر</td>
            <td><span class="${badgeClass}" data-date="${exam.date}" data-time="${exam.time}">${remaining.text}</span></td>
            <td><button class="delete-btn" onclick="deleteExam(${index})">حذف</button></td>
        `;
        examTableBody.appendChild(row);
    });
    updateSubjectDropdown();
}

// تحديث العداد التنازلي كل ثانية دون إعادة بناء الجدول بالكامل
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

    exams.push({ subject, date, time, chapters, slides });
    saveData();
    renderExams();
    examForm.reset();
});

window.deleteExam = function(index) {
    exams.splice(index, 1);
    saveData();
    renderExams();
};

function renderStudyPlans() {
    studyTableBody.innerHTML = '';
    studyPlans.forEach((plan, index) => {
        const start = new Date(plan.startDate);
        const end = new Date(plan.endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const totalHours = (diffDays * parseFloat(plan.dailyHours)).toFixed(1);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${plan.subject}</strong></td>
            <td>${plan.startDate}</td>
            <td>${plan.endDate}</td>
            <td>${diffDays} يوم</td>
            <td>${plan.dailyHours} ساعة / يوم</td>
            <td><strong>${totalHours} ساعة</strong></td>
            <td><button class="delete-btn" onclick="deleteStudyPlan(${index})">حذف</button></td>
        `;
        studyTableBody.appendChild(row);
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

    studyPlans.push({ subject, startDate, endDate, dailyHours });
    saveData();
    renderStudyPlans();
    studyForm.reset();
});

window.deleteStudyPlan = function(index) {
    studyPlans.splice(index, 1);
    saveData();
    renderStudyPlans();
};

// ضمان الحفظ عند إغلاق التبويب أو الخروج من الصفحة
window.addEventListener('beforeunload', saveData);

// تحديث العداد فوراً عند العودة إلى التبويب أو فتح التطبيق من الخلفية
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateCountdownsOnly();
    }
});

// التشغيل الأولي وتحديث الثواني باستمرار
renderExams();
renderStudyPlans();
setInterval(updateCountdownsOnly, 1000);