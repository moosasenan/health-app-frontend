// كود آمن ومبسط
const API_BASE = 'https://health-app-backend.onrender.com/api';

// وظائف أساسية
function showSection(sectionId) {
    // إخفاء جميع الأقسام
    const sections = document.getElementsByClassName('section');
    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.add('hidden');
    }
    
    // إظهار القسم المطلوب
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

function showForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.classList.remove('hidden');
    }
}

function hideForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.classList.add('hidden');
    }
}

// رسائل التنبيه
function showMessage(message, type = 'success') {
    alert(message); // استخدام alert بسيط مؤقتاً
}

// تحميل أولي آمن
document.addEventListener('DOMContentLoaded', function() {
    // تأكد أن لوحة التحكم تظهر أولاً
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.classList.remove('hidden');
    }
    
    // إخفاء جميع النماذج
    const forms = document.getElementsByClassName('hidden');
    for (let i = 0; i < forms.length; i++) {
        if (forms[i].id.includes('form')) {
            forms[i].classList.add('hidden');
        }
    }
});

// إضافة وظائف أساسية للمرضى (بدون اتصال API مؤقتاً)
function loadPatients() {
    const patientsList = document.getElementById('patients-list');
    if (patientsList) {
        patientsList.innerHTML = '<div class="data-item">جاري التحميل...</div>';
    }
}

function addPatient() {
    const name = document.getElementById('patient-name');
    if (name && name.value) {
        showMessage('سيتم إضافة المريض: ' + name.value);
        hideForm('add-patient-form');
    } else {
        showMessage('الرجاء إدخال اسم المريض', 'error');
    }
}
