// بيانات المستخدمين
const users = [
    {
        id: 1,
        email: 'admin@sehati.com',
        password: '123456',
        name: 'مدير النظام',
        role: 'admin',
        phone: '+967711111111',
        specialty: null,
        twoFactorEnabled: true,
        requiresPasswordChange: false,
        createdAt: '2024-01-01'
    },
    {
        id: 2,
        email: 'doctor@sehati.com',
        password: '123456', 
        name: 'د. أحمد محمد',
        role: 'doctor',
        phone: '+967722222222',
        specialty: 'باطنية',
        twoFactorEnabled: false,
        requiresPasswordChange: false,
        createdAt: '2024-01-01'
    },
    {
        id: 3,
        email: 'patient@sehati.com',
        password: '123456',
        name: 'محمد المريض',
        role: 'patient',
        phone: '+967733333333',
        specialty: null,
        twoFactorEnabled: false,
        requiresPasswordChange: false,
        createdAt: '2024-01-01'
    },
    {
        id: 4,
        email: 'accountant@sehati.com',
        password: '123456',
        name: 'المحاسب العام',
        role: 'accountant',
        phone: '+967744444444',
        specialty: null,
        twoFactorEnabled: true,
        requiresPasswordChange: false,
        createdAt: '2024-01-01'
    }
];

// بيانات التطبيق
const appData = {
    patients: [
        { id: 1, name: 'موسى إبراهيم', phone: '775686818', city: 'تقرأ', age: 35, gender: 'ذكر' },
        { id: 2, name: 'أحمد محمد', phone: '123456789', city: 'الرياض', age: 28, gender: 'ذكر' },
        { id: 3, name: 'فاطمة علي', phone: '555123456', city: 'جدة', age: 42, gender: 'أنثى' },
        { id: 4, name: 'خالد حسن', phone: '777888999', city: 'الدمام', age: 31, gender: 'ذكر' }
    ],
    doctors: [
        { id: 1, name: 'د. أحمد محمد', specialty: 'باطنية', phone: '111222333', clinic: 'العيادة المركزية', fees: 150, rating: 4.8 },
        { id: 2, name: 'د. فاطمة علي', specialty: 'قلب', phone: '444555666', clinic: 'مستشفى الثورة', fees: 250, rating: 4.9 },
        { id: 3, name: 'د. خالد حسن', specialty: 'عظام', phone: '777888999', clinic: 'مركز العظام', fees: 200, rating: 4.7 },
        { id: 4, name: 'د. سارة عبدالله', specialty: 'أطفال', phone: '111333555', clinic: 'مستشفى الأطفال', fees: 180, rating: 4.8 }
    ],
    appointments: [
        { id: 1, patientId: 3, doctorId: 1, date: '2024-01-20', time: '10:00', status: 'مؤكد', notes: 'كشف دوري', type: 'كشف عادي' },
        { id: 2, patientId: 3, doctorId: 2, date: '2024-01-22', time: '11:30', status: 'معلق', notes: 'ضغط دم مرتفع', type: 'كشف عاجل' },
        { id: 3, patientId: 1, doctorId: 3, date: '2024-01-25', time: '14:00', status: 'مؤكد', notes: 'متابعة علاج', type: 'كشف متابعة' }
    ],
    clinics: [
        { 
            id: 1, 
            name: 'العيادة المركزية', 
            address: 'صنعاء - حي الرياض - شارع الستين', 
            phone: '0111111111', 
            city: 'صنعاء',
            lat: 15.3694, 
            lng: 44.1910,
            specialties: ['باطنية', 'عظام', 'أطفال'],
            workingHours: '8:00 ص - 10:00 م'
        },
        { 
            id: 2, 
            name: 'مستشفى الثورة', 
            address: 'صنعاء - شارع الزبيري', 
            phone: '0222222222', 
            city: 'صنعاء',
            lat: 15.3543, 
            lng: 44.2066,
            specialties: ['قلب', 'جراحة', 'نساء وتوليد'],
            workingHours: '24 ساعة'
        },
        { 
            id: 3, 
            name: 'مركز العظام التخصصي', 
            address: 'صنعاء - حي التحرير', 
            phone: '0333333333', 
            city: 'صنعاء',
            lat: 15.3515, 
            lng: 44.2102,
            specialties: ['عظام', 'علاج طبيعي'],
            workingHours: '9:00 ص - 8:00 م'
        }
    ],
    transactions: [
        { id: 1, type: 'دخل', amount: 150, description: 'كشف د. أحمد', date: '2024-01-15', status: 'مكتمل', patientId: 3 },
        { id: 2, type: 'دخل', amount: 250, description: 'كشف د. فاطمة', date: '2024-01-16', status: 'معلق', patientId: 3 },
        { id: 3, type: 'دخل', amount: 200, description: 'كشف د. خالد', date: '2024-01-17', status: 'مكتمل', patientId: 1 },
        { id: 4, type: 'مصروف', amount: 50, description: 'شراء مستلزمات', date: '2024-01-18', status: 'مكتمل' }
    ]
};

let currentUser = null;

// نظام تسجيل الدخول
function fillLogin(email, password) {
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = password;
}

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    if (!email || !password) {
        showNotification('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showNotification('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
        return;
    }
    
    // التحقق إذا كان المستخدم بحاجة لتغيير كلمة المرور
    if (user.requiresPasswordChange) {
        showNotification('يجب تغيير كلمة المرور أولاً', 'warning');
        return;
    }
    
    currentUser = user;
    
    // حفظ بيانات المستخدم في localStorage
    saveUserSession(user);
    
    // تسجيل نشاط الدخول
    logUserActivity(user.id, 'login', 'تسجيل دخول إلى النظام');
    
    showDashboard(user.role);
    showNotification(`مرحباً ${user.name}!`, 'success');
    
    // تحديث اسم المستخدم في الواجهة
    updateUserInfo(user);
    
    // تحديث إحصائيات الجلسات
    sessionManager.updateSessionStats();
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
    
    // تحديث حالة الجلسة في الواجهة
    updateSessionStatus();
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
    if (currentUser) {
        // تسجيل نشاط الخروج
        logUserActivity(currentUser.id, 'logout', 'تسجيل خروج من النظام');
        showNotification(`مع السلامة ${currentUser.name}!`, 'success');
    }
    
    // مسح جلسة المستخدم
    clearUserSession();
    currentUser = null;
    
    // إعادة التعيين إلى صفحة الدخول
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('doctor-dashboard').classList.add('hidden');
    document.getElementById('patient-dashboard').classList.add('hidden');
    document.getElementById('accountant-dashboard').classList.add('hidden');
    
    // مسح حقول الدخول
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

// لوحة المدير
function loadAdminDashboard() {
    showAdminSection('stats');
    updateAdminStats();
    loadAdminUsers();
    loadAdminDoctors();
}

function showAdminSection(section) {
    // إخفاء جميع الأقسام
    const sections = ['stats', 'users', 'reports', 'doctors', 'clinics', 'financial', 'settings', 'specialties', 'appearance', 'ai'];
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
    // تحديث الإحصائيات
    const today = new Date().toLocaleDateString('ar-EG');
    const todayElement = document.getElementById('doctor-today-date');
    if (todayElement) {
        todayElement.textContent = today;
    }
    
    // تحديث إحصائيات النظام
    const stats = sessionManager.loadAppStatistics();
    if (stats) {
        console.log('📊 إحصائيات النظام:', stats);
    }
}

function loadAdminUsers() {
    const usersList = document.getElementById('admin-users-list');
    if (!usersList) return;
    
    const allUsers = window.adminSystem ? window.adminSystem.userManagement.users : users;
    
    usersList.innerHTML = allUsers.map(user => `
        <div class="table-row">
            <div>
                <strong>${user.name}</strong>
                ${user.requiresPasswordChange ? '<span style="color: #e74c3c; margin-right: 5px;" title="يجب تغيير كلمة المرور">🔒</span>' : ''}
                ${user.twoFactorEnabled ? '<span style="color: #27ae60; margin-right: 5px;" title="المصادقة الثنائية مفعلة">🔐</span>' : ''}
            </div>
            <div>${user.email}</div>
            <div>${user.phone || '<span style="color: #999;">لم يتم إضافته</span>'}</div>
            <div>
                <span class="user-role-badge ${user.role}">${getRoleDisplayName(user.role)}</span>
            </div>
            <div>
                <span class="status confirmed">نشط</span>
                ${isUserOnline(user.id) ? '<span style="color: #27ae60; margin-right: 5px;" title="متصل حالياً">●</span>' : ''}
            </div>
            <div>
                <button class="action-btn" onclick="showEditUserForm(${user.id})" title="تعديل البيانات">✏️</button>
                <button class="action-btn" onclick="showSecurityForm(${user.id})" title="إعدادات الأمان">🔒</button>
                <button class="action-btn" onclick="viewUserActivity(${user.id})" title="النشاط">📊</button>
                <button class="action-btn" onclick="deleteUser(${user.id})" title="حذف">🗑️</button>
            </div>
        </div>
    `).join('');
}

function loadAdminDoctors() {
    const doctorsList = document.getElementById('admin-doctors-list');
    if (!doctorsList) return;
    
    doctorsList.innerHTML = appData.doctors.map(doctor => `
        <div class="appointment-card">
            <h4>${doctor.name}</h4>
            <p>🩺 ${doctor.specialty}</p>
            <p>📞 ${doctor.phone}</p>
            <p>🏥 ${doctor.clinic}</p>
            <p>💰 ${doctor.fees} ريال</p>
            <p>⭐ ${doctor.rating}/5</p>
            <div class="quick-actions">
                <button class="action-btn" onclick="editDoctor(${doctor.id})">✏️ تعديل</button>
                <button class="action-btn" onclick="deleteDoctor(${doctor.id})">🗑️ حذف</button>
            </div>
        </div>
    `).join('');
}

function showAddUserForm() {
    showNotification('نموذج إضافة مستخدم سيظهر هنا', 'info');
}

function showAddDoctorForm() {
    showNotification('نموذج إضافة طبيب سيظهر هنا', 'info');
}

function exportReports() {
    showNotification('جاري تصدير التقارير...', 'success');
}

function exportFinancialData() {
    showNotification('جاري تصدير البيانات المالية...', 'success');
}

function editUser(userId) {
    showNotification(`جاري تحرير المستخدم #${userId}`, 'info');
}

function deleteUser(userId) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        showNotification('تم حذف المستخدم', 'success');
    }
}

function editDoctor(doctorId) {
    showNotification(`جاري تحرير الطبيب #${doctorId}`, 'info');
}

function deleteDoctor(doctorId) {
    if (confirm('هل أنت متأكد من حذف هذا الطبيب؟')) {
        showNotification('تم حذف الطبيب', 'success');
    }
}

// لوحة الطبيب
function loadDoctorDashboard() {
    showDoctorSection('appointments');
    updateDoctorAppointments();
    updateDoctorPatients();
    updateDoctorSchedule();
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
    
    const appointmentsList = document.getElementById('doctor-appointments-list');
    if (appointmentsList) {
        appointmentsList.innerHTML = doctorAppointments.map(apt => {
            const patient = appData.patients.find(p => p.id === apt.patientId);
            return `
                <div class="appointment-card">
                    <h4>${patient ? patient.name : 'مريض'}</h4>
                    <p>⏰ ${apt.time}</p>
                    <p>📝 ${apt.notes}</p>
                    <p>📋 ${apt.type}</p>
                    <span class="status ${apt.status === 'مؤكد' ? 'confirmed' : 'pending'}">${apt.status}</span>
                    <div class="quick-actions">
                        <button class="action-btn" onclick="confirmAppointment(${apt.id})">✅ تأكيد</button>
                        <button class="action-btn" onclick="cancelAppointment(${apt.id})">❌ إلغاء</button>
                        <button class="action-btn" onclick="viewPatientDetails(${apt.patientId})">👁️ التفاصيل</button>
                    </div>
                </div>
            `;
        }).join('') || '<p>لا توجد مواعيد لليوم</p>';
    }
}

function updateDoctorPatients() {
    const patientsList = document.getElementById('doctor-patients-list');
    if (!patientsList) return;
    
    patientsList.innerHTML = appData.patients.map(patient => `
        <div class="appointment-card">
            <h4>${patient.name}</h4>
            <p>📞 ${patient.phone}</p>
            <p>📍 ${patient.city}</p>
            <p>🎂 ${patient.age} سنة - ${patient.gender}</p>
            <div class="quick-actions">
                <button class="action-btn" onclick="viewPatientHistory(${patient.id})">📋 السجل</button>
                <button class="action-btn" onclick="addAppointmentForPatient(${patient.id})">📅 موعد</button>
                <button class="action-btn" onclick="viewPatientDetails(${patient.id})">👁️ التفاصيل</button>
            </div>
        </div>
    `).join('');
}

function updateDoctorSchedule() {
    const scheduleContainer = document.getElementById('doctor-schedule-container');
    if (!scheduleContainer) return;
    
    scheduleContainer.innerHTML = `
        <div class="appointment-card">
            <h4>الاثنين - الجمعة</h4>
            <p>⏰ 9:00 ص - 2:00 م</p>
            <p>⏰ 5:00 م - 9:00 م</p>
        </div>
        <div class="appointment-card">
            <h4>السبت</h4>
            <p>⏰ 10:00 ص - 1:00 م</p>
        </div>
        <div class="appointment-card">
            <h4>الأحد</h4>
            <p>⏰ إجازة</p>
        </div>
    `;
}

function showAddPatientForm() {
    showNotification('نموذج إضافة مريض سيظهر هنا', 'info');
}

function addScheduleSlot() {
    showNotification('إضافة وقت جديد للجدول', 'info');
}

function confirmAppointment(appointmentId) {
    const appointment = appData.appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        appointment.status = 'مؤكد';
        showNotification('تم تأكيد الموعد', 'success');
        updateDoctorAppointments();
    }
}

function cancelAppointment(appointmentId) {
    if (confirm('هل أنت متأكد من إلغاء هذا الموعد؟')) {
        const appointment = appData.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            appointment.status = 'ملغى';
            showNotification('تم إلغاء الموعد', 'success');
            updateDoctorAppointments();
        }
    }
}

function viewPatientHistory(patientId) {
    showNotification(`عرض سجل المريض #${patientId}`, 'info');
}

function addAppointmentForPatient(patientId) {
    showNotification(`إضافة موعد للمريض #${patientId}`, 'info');
}

function viewPatientDetails(patientId) {
    showNotification(`عرض تفاصيل المريض #${patientId}`, 'info');
}

// لوحة المريض
function loadPatientDashboard() {
    showPatientSection('appointments');
    updatePatientAppointments();
    updatePatientDoctors();
    updatePatientClinics();
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
    
    const appointmentsContainer = document.getElementById('patient-appointments-list');
    if (appointmentsContainer) {
        appointmentsContainer.innerHTML = patientAppointments.map(apt => {
            const doctor = appData.doctors.find(d => d.id === apt.doctorId);
            return `
                <div class="appointment-card">
                    <h4>🩺 ${doctor ? doctor.name : 'طبيب'}</h4>
                    <p>📅 ${apt.date}</p>
                    <p>⏰ ${apt.time}</p>
                    <p>📝 ${apt.notes}</p>
                    <p>📋 ${apt.type}</p>
                    <span class="status ${apt.status === 'مؤكد' ? 'confirmed' : 'pending'}">${apt.status}</span>
                    <div class="quick-actions">
                        <button class="action-btn" onclick="rescheduleAppointment(${apt.id})">🔄 إعادة جدولة</button>
                        <button class="action-btn" onclick="cancelPatientAppointment(${apt.id})">❌ إلغاء</button>
                        <button class="action-btn" onclick="viewDoctorProfile(${apt.doctorId})">👁️ الطبيب</button>
                    </div>
                </div>
            `;
        }).join('') || '<p>لا توجد مواعيد حالية</p>';
    }
}

function updatePatientDoctors() {
    const doctorsList = document.getElementById('patient-doctors-list');
    if (!doctorsList) return;
    
    doctorsList.innerHTML = appData.doctors.map(doctor => `
        <div class="appointment-card">
            <h4>${doctor.name}</h4>
            <p>🩺 ${doctor.specialty}</p>
            <p>📞 ${doctor.phone}</p>
            <p>🏥 ${doctor.clinic}</p>
            <p>💰 ${doctor.fees} ريال</p>
            <p>⭐ ${doctor.rating}/5</p>
            <div class="quick-actions">
                <button class="action-btn primary" onclick="bookWithDoctor(${doctor.id})">📅 حجز موعد</button>
                <button class="action-btn" onclick="viewDoctorProfile(${doctor.id})">👁️ الملف</button>
                <button class="action-btn" onclick="viewDoctorReviews(${doctor.id})">💬 التقييمات</button>
            </div>
        </div>
    `).join('');
}

function updatePatientClinics() {
    const clinicsList = document.getElementById('patient-clinics-list');
    if (!clinicsList) return;
    
    clinicsList.innerHTML = appData.clinics.map(clinic => `
        <div class="clinic-item" onclick="selectClinic(${clinic.id})">
            <h4>${clinic.name}</h4>
            <p>📍 ${clinic.address}</p>
            <p>📞 ${clinic.phone}</p>
            <p>🕒 ${clinic.workingHours}</p>
            <p>🎯 ${clinic.specialties.join('، ')}</p>
            <div class="quick-actions">
                <button class="action-btn" onclick="openGoogleMaps(${clinic.lat}, ${clinic.lng}, '${clinic.name}')">🗺️ فتح الخريطة</button>
                <button class="action-btn" onclick="viewClinicDetails(${clinic.id})">👁️ التفاصيل</button>
            </div>
        </div>
    `).join('');
}

function initPatientMap() {
    const mapElement = document.getElementById('patient-map');
    if (!mapElement) return;
    
    const clinics = appData.clinics || [];
    
    if (clinics.length > 0) {
        mapElement.innerHTML = `
            <div style="background: linear-gradient(135deg, var(--bg-color) 0%, #764ba2 100%); color: white; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; text-align: center; border-radius: 10px;">
                <h3 style="margin-bottom: 20px; font-size: 1.5em;">🗺️ خريطة العيادات</h3>
                <p style="margin-bottom: 15px;">انقر على أي عيادة لفتح موقعها في خرائط جوجل</p>
                
                <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 10px 0; width: 90%;">
                    <strong>📍 محاكاة الخريطة التفاعلية</strong>
                    <p style="margin: 10px 0; font-size: 0.9em;">هذه محاكاة للخريطة الحقيقية</p>
                    <div style="background: rgba(255,255,255,0.3); padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <strong>العيادات المتاحة:</strong>
                        ${clinics.map(clinic => `
                            <div style="margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.2); border-radius: 5px;">
                                ${clinic.name} - ${clinic.city}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                ${clinics.map(clinic => `
                    <button onclick="openGoogleMaps(${clinic.lat}, ${clinic.lng}, '${clinic.name}')" 
                            style="background: white; color: var(--primary-color); border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; width: 90%; font-weight: bold;">
                        🗺️ فتح ${clinic.name} في خرائط جوجل
                    </button>
                `).join('')}
            </div>
        `;
    } else {
        mapElement.innerHTML = `
            <div style="background: var(--light-bg); color: #666; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; text-align: center; border-radius: 10px;">
                <h3 style="margin-bottom: 15px;">🗺️ الخرائط</h3>
                <p>لا توجد عيادات متاحة للعرض حالياً</p>
            </div>
        `;
    }
}

function openGoogleMaps(lat, lng, name) {
    // استخدام رابط خرائط جوجل دقيق مع إحداثيات وzoom
    const zoomLevel = 15;
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=${zoomLevel}&ll=${lat},${lng}`;
    
    // فتح في نافذة جديدة
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
    
    showNotification(`جاري فتح موقع ${name} في خرائط جوجل`, 'success');
    
    // تسجيل النشاط للتحليلات
    logMapActivity(name, lat, lng);
}

function logMapActivity(clinicName, lat, lng) {
    if (currentUser) {
        logUserActivity(currentUser.id, 'map_view', `عرض موقع ${clinicName} على الخريطة`);
    }
}

function bookNewAppointment() {
    showNotification('جاري فتح نموذج حجز موعد جديد...', 'info');
}

function bookWithDoctor(doctorId) {
    showNotification(`جاري حجز موعد مع الطبيب #${doctorId}`, 'info');
}

function viewDoctorProfile(doctorId) {
    showNotification(`عرض ملف الطبيب #${doctorId}`, 'info');
}

function viewDoctorReviews(doctorId) {
    showNotification(`عرض تقييمات الطبيب #${doctorId}`, 'info');
}

function selectClinic(clinicId) {
    showNotification(`تم اختيار العيادة #${clinicId}`, 'success');
}

function viewClinicDetails(clinicId) {
    showNotification(`عرض تفاصيل العيادة #${clinicId}`, 'info');
}

function rescheduleAppointment(appointmentId) {
    showNotification(`إعادة جدولة الموعد #${appointmentId}`, 'info');
}

function cancelPatientAppointment(appointmentId) {
    if (confirm('هل أنت متأكد من إلغاء هذا الموعد؟')) {
        const appointment = appData.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            appointment.status = 'ملغى';
            showNotification('تم إلغاء الموعد', 'success');
            updatePatientAppointments();
        }
    }
}

// المساعد الذكي
function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const userInput = document.getElementById('user-message');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    addChatMessage('user', message);
    userInput.value = '';
    
    // محاكاة استجابة الذكاء الاصطناعي
    setTimeout(() => {
        const response = generateAIResponse(message);
        addChatMessage('ai', response);
    }, 1000);
}

function addChatMessage(sender, message) {
    const chatMessages = document.getElementById('ai-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
    
    const timestamp = new Date().toLocaleTimeString('ar-EG', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <strong>${sender === 'user' ? 'أنت' : 'المساعد'}:</strong> ${message}
        <div style="font-size: 0.8em; color: #666; margin-top: 5px; text-align: ${sender === 'user' ? 'left' : 'right'};">${timestamp}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('ألم') || lowerMessage.includes('وجع')) {
        return 'بناءً على وصفك للألم، أنصحك بمراجعة طبيب باطنية. يمكنك حجز موعد من قسم "🩺 الأطباء". هل تريد المساعدة في العثور على طبيب قريب؟';
    } else if (lowerMessage.includes('حرارة') || lowerMessage.includes('سخونة')) {
        return 'الحرارة قد تكون عرضاً لعدة حالات. أنصح بعمل تحاليل دم وصورة شعاعية للصدر. يمكنني مساعدتك في العثور على مختبر قريب من قسم "🏥 العيادات".';
    } else if (lowerMessage.includes('ضغط') || lowerMessage.includes('دوار')) {
        return 'هذه الأعراض قد تكون مرتبطة بضغط الدم. أنصح بمراجعة طبيب قلب وأوعية دموية. لدينا أطباء متخصصون في هذا المجال في قسم "🩺 الأطباء".';
    } else if (lowerMessage.includes('حساسية') || lowerMessage.includes('حكة')) {
        return 'الأعراض تشير إلى احتمالية وجود حساسية. جرب تناول مضاد هستامين، وإذا استمرت الأعراض راجع طبيب جلدية من قسم "🩺 الأطباء".';
    } else if (lowerMessage.includes('موعد') || lowerMessage.includes('حجز')) {
        return 'يمكنك حجز موعد جديد من خلال الضغط على زر "📅 حجز موعد جديد" في قسم المواعيد. كما يمكنك تصفح الأطباء المتاحين من قسم "🩺 الأطباء".';
    } else if (lowerMessage.includes('عيادة') || lowerMessage.includes('مستشفى')) {
        return 'يمكنك العثور على جميع العيادات والمستشفيات المتاحة في قسم "🏥 العيادات". هناك خرائط تفاعلية لمساعدتك في الوصول إلى الموقع.';
    } else {
        return 'شكراً لاستشارتك. للحصول على تشخيص دقيق، أنصح بمراجعة طبيب متخصص. يمكنني مساعدتك في حجز موعد مع طبيب مناسب من خلال التطبيق.';
    }
}

function askQuickQuestion(question) {
    document.getElementById('user-message').value = question;
    sendMessage();
}

// لوحة المحاسب
function loadAccountantDashboard() {
    showAccountantSection('transactions');
    updateFinancialStats();
    loadTransactions();
}

function showAccountantSection(section) {
    const sections = ['transactions', 'reports', 'invoices', 'ai-accounting', 'verification'];
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
    const totalIncome = appData.transactions
        .filter(t => t.type === 'دخل' && t.status === 'مكتمل')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingAmount = appData.transactions
        .filter(t => t.status === 'معلق')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = appData.transactions
        .filter(t => t.type === 'مصروف' && t.status === 'مكتمل')
        .reduce((sum, t) => sum + t.amount, 0);
    
    console.log('💰 الإحصائيات المالية:', { totalIncome, pendingAmount, expenses });
}

function loadTransactions() {
    const transactionsList = document.getElementById('accountant-transactions-list');
    if (!transactionsList) return;
    
    transactionsList.innerHTML = appData.transactions.map(transaction => `
        <div class="appointment-card">
            <h4>${transaction.description}</h4>
            <p>💰 ${transaction.amount} ريال</p>
            <p>📅 ${transaction.date}</p>
            <p>📋 ${transaction.type}</p>
            <span class="status ${transaction.status === 'مكتمل' ? 'confirmed' : 'pending'}">${transaction.status}</span>
            ${transaction.patientId ? `<p>👤 ${appData.patients.find(p => p.id === transaction.patientId)?.name || 'مريض'}</p>` : ''}
        </div>
    `).join('');
}

function generateDailyReport() {
    showNotification('جاري إنشاء التقرير اليومي...', 'success');
}

function generateMonthlyReport() {
    showNotification('جاري إنشاء التقرير الشهري...', 'success');
}

function generateYearlyReport() {
    showNotification('جاري إنشاء التقرير السنوي...', 'success');
}

function createNewInvoice() {
    showNotification('إنشاء فاتورة جديدة', 'info');
}

function viewAllInvoices() {
    showNotification('عرض جميع الفواتير', 'info');
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

// دالات مساعدة
function getRoleDisplayName(role) {
    const roleNames = {
        'admin': 'مدير النظام',
        'doctor': 'طبيب',
        'patient': 'مريض',
        'accountant': 'محاسب'
    };
    return roleNames[role] || role;
}

function updateSessionStatus() {
    const sessionStatus = document.getElementById('session-status');
    if (sessionStatus) {
        sessionStatus.textContent = 'نشط';
        sessionStatus.className = 'session-status active';
    }
}

// التهيئة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Health App Initialized with Session Management');
    
    // محاولة تحميل جلسة المستخدم المحفوظة
    const savedUser = loadUserSession();
    
    if (savedUser && savedUser.id) {
        console.log('✅ تم العثور على جلسة مستخدم محفوظة:', savedUser.name);
        
        // التحقق من صحة الجلسة
        if (validateUserSession()) {
            // تحديث المستخدم الحالي
            currentUser = savedUser;
            
            // عرض لوحة التحكم المناسبة
            showDashboard(savedUser.role);
            showNotification(`مرحباً بعودتك ${savedUser.name}!`, 'success');
            
            // تحديث معلومات المستخدم في الواجهة
            updateUserInfo(savedUser);
        } else {
            console.log('❌ جلسة غير صالحة');
            clearUserSession();
        }
    } else {
        // إذا لم توجد جلسة محفوظة، عرض صفحة الدخول
        console.log('ℹ️ لا توجد جلسة مستخدم محفوظة');
        document.getElementById('login-page').classList.remove('hidden');
    }
    
    // تحديث تاريخ اليوم
    const today = new Date().toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const todayElement = document.getElementById('doctor-today-date');
    if (todayElement) {
        todayElement.textContent = today;
    }
    
    // تطبيق إعدادات التطبيق إذا كانت موجودة
    if (typeof window.adminSystem !== 'undefined') {
        setTimeout(() => {
            window.adminSystem.applyAppSettings();
        }, 100);
    }
    
    // تحميل الإحصائيات الأولية
    loadInitialStats();
});

// تحميل الإحصائيات الأولية
function loadInitialStats() {
    try {
        // تحميل إحصائيات من localStorage إذا وجدت
        const savedStats = sessionManager.loadAppStatistics();
        if (savedStats) {
            console.log('📊 إحصائيات التطبيق:', savedStats);
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل الإحصائيات:', error);
    }
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
`;
document.head.appendChild(style);

// جعل المتغيرات متاحة globally للاستخدام في الملفات الأخرى
window.users = users;
window.appData = appData;
window.currentUser = currentUser;
