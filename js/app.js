// بيانات المستخدمين
const users = [
    {
        id: 1,
        email: 'admin@sehati.com',
        password: '123456',
        name: 'مدير النظام',
        role: 'admin',
        phone: '+967711111111',
        specialty: null
    },
    {
        id: 2,
        email: 'doctor@sehati.com',
        password: '123456', 
        name: 'د. أحمد محمد',
        role: 'doctor',
        phone: '+967722222222',
        specialty: 'باطنية'
    },
    {
        id: 3,
        email: 'patient@sehati.com',
        password: '123456',
        name: 'محمد المريض',
        role: 'patient',
        phone: '+967733333333',
        specialty: null
    },
    {
        id: 4,
        email: 'accountant@sehati.com',
        password: '123456',
        name: 'المحاسب العام',
        role: 'accountant',
        phone: '+967744444444',
        specialty: null
    }
];

// بيانات التطبيق
const appData = {
    patients: [
        { id: 1, name: 'موسى إبراهيم', phone: '775686818', city: 'تقرأ', age: 35 },
        { id: 2, name: 'أحمد محمد', phone: '123456789', city: 'الرياض', age: 28 },
        { id: 3, name: 'فاطمة علي', phone: '555123456', city: 'جدة', age: 42 }
    ],
    doctors: [
        { id: 1, name: 'د. أحمد محمد', specialty: 'باطنية', phone: '111222333', clinic: 'العيادة المركزية', fees: 150 },
        { id: 2, name: 'د. فاطمة علي', specialty: 'قلب', phone: '444555666', clinic: 'مستشفى الثورة', fees: 250 }
    ],
    appointments: [
        { id: 1, patientId: 3, doctorId: 1, date: '2024-01-20', time: '10:00', status: 'مؤكد', notes: 'كشف دوري' },
        { id: 2, patientId: 3, doctorId: 2, date: '2024-01-22', time: '11:30', status: 'معلق', notes: 'ضغط دم مرتفع' }
    ],
    clinics: [
        { 
            id: 1, 
            name: 'العيادة المركزية', 
            address: 'صنعاء - حي الرياض - شارع الستين', 
            phone: '0111111111', 
            city: 'صنعاء',
            lat: 15.3694, 
            lng: 44.1910
        },
        { 
            id: 2, 
            name: 'مستشفى الثورة', 
            address: 'صنعاء - شارع الزبيري', 
            phone: '0222222222', 
            city: 'صنعاء',
            lat: 15.3543, 
            lng: 44.2066
        }
    ]
};

let currentUser = null;
let map = null;

// نظام تسجيل الدخول
function fillLogin(email, password) {
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = password;
}

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showNotification('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showNotification('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
        return;
    }
    
    currentUser = user;
    showDashboard(user.role);
    showNotification(`مرحباً ${user.name}!
    
    // تحديث اسم المستخدم في الواجهة
    updateUserInfo(user);
}

function showDashboard(role) {
    // إخفاء جميع اللوحات
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('doctor-dashboard').classList.add('hidden');
    document.getElementById('patient-dashboard').classList.add('hidden');
    document.getElementById('accountant-dashboard').classList.add('hidden');
    
    // إظهار اللوحة المناسبة
    switch(role) {
        case 'admin':
            document.getElementById('admin-dashboard').classList.remove('hidden');
            loadAdminDashboard();
            break;
        case 'doctor':
            document.getElementById('doctor-dashboard').classList.remove('hidden');
            loadDoctorDashboard();
            break;
        case 'patient':
            document.getElementById('patient-dashboard').classList.remove('hidden');
            loadPatientDashboard();
            break;
        case 'accountant':
            document.getElementById('accountant-dashboard').classList.remove('hidden');
            loadAccountantDashboard();
            break;
    }
}

function updateUserInfo(user) {
    const elements = {
        admin: 'admin-name',
        doctor: 'doctor-name', 
        patient: 'patient-name',
        accountant: 'accountant-name'
    };
    
    const elementId = elements[user.role];
    if (elementId) {
        document.getElementById(elementId).textContent = user.name;
    }
}

function logout() {
    currentUser = null;
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('doctor-dashboard').classList.add('hidden');
    document.getElementById('patient-dashboard').classList.add('hidden');
    document.getElementById('accountant-dashboard').classList.add('hidden');
    
    // مسح حقول الدخول
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    
    showNotification('تم تسجيل الخروج بنجاح', 'success');
}

// لوحة المدير
function loadAdminDashboard() {
    showAdminSection('stats');
    updateAdminStats();
}

function showAdminSection(section) {
    // إخفاء جميع الأقسام
    const sections = ['stats', 'users', 'reports', 'doctors', 'clinics', 'financial', 'settings'];
    sections.forEach(sec => {
        const element = document.getElementById(`admin-${sec}`);
        if (element) element.classList.add('hidden');
    });
    
    // إظهار القسم المطلوب
    const targetSection = document.getElementById(`admin-${section}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

function updateAdminStats() {
    // في التطبيق الحقيقي، سيتم جلب البيانات من الخادم
    console.log('Updating admin stats...');
}

function showAddUserForm() {
    showNotification('نموذج إضافة مستخدم سيظهر هنا', 'info');
}

function exportReports() {
    showNotification('جاري تصدير التقارير...', 'success');
}

// لوحة الطبيب
function loadDoctorDashboard() {
    showDoctorSection('appointments');
    updateDoctorAppointments();
}

function showDoctorSection(section) {
    const sections = ['appointments', 'patients', 'schedule'];
    sections.forEach(sec => {
        const element = document.getElementById(`doctor-${sec}`);
        if (element) element.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(`doctor-${section}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

function updateDoctorAppointments() {
    const today = new Date().toISOString().split('T')[0];
    const doctorAppointments = appData.appointments.filter(apt => 
        apt.doctorId === currentUser.id && apt.date === today
    );
    
    const appointmentsList = document.querySelector('.appointments-list');
    if (appointmentsList) {
        appointmentsList.innerHTML = doctorAppointments.map(apt => {
            const patient = appData.patients.find(p => p.id === apt.patientId);
            return `
                <div class="appointment-card">
                    <h4>${patient ? patient.name : 'مريض'}</h4>
                    <p>⏰ ${apt.time}</p>
                    <p>📝 ${apt.notes}</p>
                    <span class="status ${apt.status === 'مؤكد' ? 'confirmed' : 'pending'}">${apt.status}</span>
                </div>
            `;
        }).join('') || '<p>لا توجد مواعيد لليوم</p>';
    }
}

function showAddPatientForm() {
    showNotification('نموذج إضافة مريض سيظهر هنا', 'info');
}

// لوحة المريض
function loadPatientDashboard() {
    showPatientSection('appointments');
    updatePatientAppointments();
    initPatientMap();
}

function showPatientSection(section) {
    const sections = ['appointments', 'doctors', 'clinics', 'ai'];
    sections.forEach(sec => {
        const element = document.getElementById(`patient-${sec}`);
        if (element) element.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(`patient-${section}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

function updatePatientAppointments() {
    const patientAppointments = appData.appointments.filter(apt => 
        apt.patientId === currentUser.id
    );
    
    const appointmentsContainer = document.querySelector('.appointments-cards');
    if (appointmentsContainer) {
        appointmentsContainer.innerHTML = patientAppointments.map(apt => {
            const doctor = appData.doctors.find(d => d.id === apt.doctorId);
            return `
                <div class="appointment-card">
                    <h4>🩺 ${doctor ? doctor.name : 'طبيب'}</h4>
                    <p>📅 ${apt.date}</p>
                    <p>⏰ ${apt.time}</p>
                    <p>📝 ${apt.notes}</p>
                    <span class="status ${apt.status === 'مؤكد' ? 'confirmed' : 'pending'}">${apt.status}</span>
                </div>
            `;
        }).join('') || '<p>لا توجد مواعيد حالية</p>';
    }
}

function bookNewAppointment() {
    showNotification('جاري فتح نموذج حجز موعد جديد...', 'info');
}

function initPatientMap() {
    const mapElement = document.getElementById('patient-map');
    if (!mapElement) return;
    
    // عرض خريطة تجريبية (بدون API Key)
    mapElement.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; text-align: center;">
            <h3 style="margin-bottom: 20px; font-size: 1.5em;">🗺️ خريطة العيادات</h3>
            <p style="margin-bottom: 15px;">لتفعيل الخرائط الحقيقية، يرجى إضافة مفتاح Google Maps API</p>
            
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin: 10px 0; width: 80%;">
                <strong>📍 العيادة المركزية</strong>
                <p style="margin: 5px 0; font-size: 0.9em;">صنعاء - حي الرياض</p>
                <button onclick="openGoogleMaps(15.3694, 44.1910, 'العيادة المركزية')" 
                        style="background: white; color: #667eea; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-top: 5px;">
                    🗺️ فتح في خرائط جوجل
                </button>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin: 10px 0; width: 80%;">
                <strong>📍 مستشفى الثورة</strong>
                <p style="margin: 5px 0; font-size: 0.9em;">صنعاء - شارع الزبيري</p>
                <button onclick="openGoogleMaps(15.3543, 44.2066, 'مستشفى الثورة')" 
                        style="background: white; color: #667eea; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-top: 5px;">
                    🗺️ فتح في خرائط جوجل
                </button>
            </div>
        </div>
    `;
}

function openGoogleMaps(lat, lng, name) {
    const url = `https://www.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=15`;
    window.open(url, '_blank');
    showNotification(`جاري فتح موقع ${name} في خرائط جوجل`, 'success');
}

// لوحة المحاسب
function loadAccountantDashboard() {
    showAccountantSection('transactions');
    updateFinancialStats();
}

function showAccountantSection(section) {
    const sections = ['transactions', 'reports', 'invoices'];
    sections.forEach(sec => {
        const element = document.getElementById(`accountant-${sec}`);
        if (element) element.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(`accountant-${section}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

function updateFinancialStats() {
    // تحديث الإحصائيات المالية
    console.log('Updating financial stats...');
}

// نظام الإشعارات
function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 5 ثوان
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || '💡';
}

function getNotificationColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || '#3498db';
}

// إضافة أنيميشن للإشعارات
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .status {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8em;
        font-weight: bold;
    }
    
    .status.confirmed {
        background: #d4edda;
        color: #155724;
    }
    
    .status.pending {
        background: #fff3cd;
        color: #856404;
    }
`;
document.head.appendChild(style);

// التهيئة
document.addEventListener('DOMContentLoaded', function() {
    console.log('Health App Initialized');
    // التأكد من ظهور شاشة الدخول أولاً
    document.getElementById('login-page').classList.remove('hidden');
});
