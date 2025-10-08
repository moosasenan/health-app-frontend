/**
 * التطبيق الرئيسي - نظام إدارة المستشفيات المتكامل
 * ✅ نظام التسجيل والدخول الجديد
 * ✅ إدارة المستخدمين والصلاحيات
 * ✅ نظام المواعيد والمرضى
 * ✅ الواجهات المتخصصة لكل دور
 */

// بيانات المستخدمين
let users = JSON.parse(localStorage.getItem('systemUsers')) || [
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
        qualification: 'دكتوراه في الباطنية',
        experience: 10,
        clinic: 'العيادة المركزية',
        description: 'أخصائي أمراض باطنية مع خبرة أكثر من 10 سنوات في تشخيص وعلاج الأمراض الداخلية',
        fees: 150,
        rating: 4.8,
        age: 45,
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
        age: 35,
        gender: 'ذكر',
        city: 'صنعاء',
        bloodType: 'O+',
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
        age: 40,
        specialty: null,
        twoFactorEnabled: true,
        requiresPasswordChange: false,
        createdAt: '2024-01-01'
    }
];

// بيانات التطبيق
const appData = {
    patients: [
        { id: 1, name: 'موسى إبراهيم', phone: '775686818', city: 'تقرأ', age: 35, gender: 'ذكر', bloodType: 'A+', email: 'mousa@example.com' },
        { id: 2, name: 'أحمد محمد', phone: '123456789', city: 'الرياض', age: 28, gender: 'ذكر', bloodType: 'B+', email: 'ahmed@example.com' },
        { id: 3, name: 'فاطمة علي', phone: '555123456', city: 'جدة', age: 42, gender: 'أنثى', bloodType: 'O-', email: 'fatima@example.com' },
        { id: 4, name: 'خالد حسن', phone: '777888999', city: 'الدمام', age: 31, gender: 'ذكر', bloodType: 'AB+', email: 'khaled@example.com' }
    ],
    doctors: [
        { id: 1, name: 'د. أحمد محمد', specialty: 'باطنية', phone: '111222333', clinic: 'العيادة المركزية', fees: 150, rating: 4.8, qualification: 'دكتوراه في الباطنية', experience: 10, description: 'أخصائي أمراض باطنية', email: 'doctor@sehati.com' },
        { id: 2, name: 'د. فاطمة علي', specialty: 'قلب', phone: '444555666', clinic: 'مستشفى الثورة', fees: 250, rating: 4.9, qualification: 'استشاري قلب', experience: 15, description: 'استشاري أمراض القلب', email: 'fatima@example.com' },
        { id: 3, name: 'د. خالد حسن', specialty: 'عظام', phone: '777888999', clinic: 'مركز العظام', fees: 200, rating: 4.7, qualification: 'استشاري عظام', experience: 12, description: 'استشاري جراحة العظام', email: 'khaled@example.com' }
    ],
    appointments: [
        { id: 1, patientId: 3, doctorId: 1, date: '2024-01-20', time: '10:00', status: 'مؤكد', notes: 'كشف دوري', type: 'كشف عادي', patientName: 'فاطمة علي', doctorName: 'د. أحمد محمد' },
        { id: 2, patientId: 3, doctorId: 2, date: '2024-01-22', time: '11:30', status: 'معلق', notes: 'ضغط دم مرتفع', type: 'كشف عاجل', patientName: 'فاطمة علي', doctorName: 'د. فاطمة علي' },
        { id: 3, patientId: 1, doctorId: 3, date: '2024-01-25', time: '14:00', status: 'مؤكد', notes: 'متابعة علاج', type: 'كشف متابعة', patientName: 'موسى إبراهيم', doctorName: 'د. خالد حسن' }
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
            workingHours: '8:00 ص - 10:00 م',
            description: 'عيادة متكاملة تقدم خدمات طبية شاملة'
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
            workingHours: '24 ساعة',
            description: 'مستشفى مرجعي يقدم خدمات طبية متقدمة'
        }
    ],
    transactions: [
        { id: 1, type: 'دخل', amount: 150, description: 'كشف د. أحمد', date: '2024-01-15', status: 'مكتمل', patientId: 3, patientName: 'فاطمة علي' },
        { id: 2, type: 'دخل', amount: 250, description: 'كشف د. فاطمة', date: '2024-01-16', status: 'معلق', patientId: 3, patientName: 'فاطمة علي' },
        { id: 3, type: 'دخل', amount: 200, description: 'كشف د. خالد', date: '2024-01-17', status: 'مكتمل', patientId: 1, patientName: 'موسى إبراهيم' },
        { id: 4, type: 'مصروف', amount: 50, description: 'شراء مستلزمات', date: '2024-01-18', status: 'مكتمل' }
    ]
};

let currentUser = null;
let selectedUserType = '';

/**
 * نظام اختيار نوع المستخدم
 */
function selectUserType(userType) {
    selectedUserType = userType;
    
    // تحديث العنوان حسب نوع المستخدم
    const titles = {
        'patient': { title: 'المريض', subtitle: 'اهلاً بك! سجل دخولك أو أنشئ حساب جديد' },
        'doctor': { title: 'الطبيب', subtitle: 'مرحباً دكتور! سجل دخولك أو أنشئ حساب طبي' },
        'accountant': { title: 'المحاسب', subtitle: 'مرحباً! سجل دخولك أو أنشئ حساب محاسب' },
        'admin': { title: 'مدير النظام', subtitle: 'مرحباً! سجل دخولك كمدير للنظام' }
    };
    
    const titleInfo = titles[userType];
    document.getElementById('login-title').textContent = `تسجيل الدخول - ${titleInfo.title}`;
    document.getElementById('login-subtitle').textContent = titleInfo.subtitle;
    
    // إظهار/إخفاء الحقول الإضافية حسب نوع المستخدم
    document.getElementById('doctor-extra-fields').classList.add('hidden');
    document.getElementById('patient-extra-fields').classList.add('hidden');
    
    if (userType === 'doctor') {
        document.getElementById('doctor-extra-fields').classList.remove('hidden');
    } else if (userType === 'patient') {
        document.getElementById('patient-extra-fields').classList.remove('hidden');
    }
    
    // الانتقال إلى شاشة الدخول
    document.getElementById('user-type-selection').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    
    // إعادة تعيين النماذج
    switchAuthTab('login');
}

function goBackToUserSelection() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('user-type-selection').classList.remove('hidden');
    resetForms();
}

function switchAuthTab(tab) {
    // تحديث الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // إظهار/إخفاء النماذج
    document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
    document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
}

function resetForms() {
    // مسح جميع الحقول
    const fields = [
        'login-email', 'login-password',
        'register-name', 'register-age', 'register-phone', 'register-email', 
        'register-password', 'register-confirm-password',
        'doctor-specialty', 'doctor-clinic', 'doctor-qualification', 
        'doctor-experience', 'doctor-description', 'doctor-fees',
        'patient-gender', 'patient-city', 'patient-blood-type'
    ];
    
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) element.value = '';
    });
    
    // إعادة تعيين القيم الافتراضية
    document.getElementById('doctor-fees').value = '150';
    document.getElementById('remember-me').checked = false;
}

/**
 * نظام تسجيل الدخول
 */
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
    
    // التحقق من نوع المستخدم
    if (selectedUserType && user.role !== selectedUserType) {
        showNotification(`هذا الحساب ليس ${getRoleDisplayName(selectedUserType)}`, 'error');
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
}

/**
 * نظام التسجيل الجديد
 */
function handleRegistration() {
    const name = document.getElementById('register-name').value;
    const age = document.getElementById('register-age').value;
    const phone = document.getElementById('register-phone').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // التحقق من الحقول الأساسية
    if (!name || !age || !phone || !email || !password || !confirmPassword) {
        showNotification('يرجى ملء جميع الحقول الأساسية', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('كلمات المرور غير متطابقة', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        return;
    }
    
    if (age < 1 || age > 120) {
        showNotification('يرجى إدخال عمر صحيح', 'error');
        return;
    }
    
    // التحقق من البريد الإلكتروني
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        showNotification('البريد الإلكتروني مسجل مسبقاً', 'error');
        return;
    }
    
    // إنشاء مستخدم جديد
    const newUser = {
        id: Date.now(),
        email: email,
        password: password,
        name: name,
        role: selectedUserType,
        phone: phone,
        age: parseInt(age),
        twoFactorEnabled: false,
        requiresPasswordChange: false,
        createdAt: new Date().toISOString().split('T')[0],
        isActive: true
    };
    
    // إضافة معلومات إضافية حسب نوع المستخدم
    if (selectedUserType === 'doctor') {
        const specialty = document.getElementById('doctor-specialty').value;
        const clinic = document.getElementById('doctor-clinic').value;
        const qualification = document.getElementById('doctor-qualification').value;
        const experience = document.getElementById('doctor-experience').value;
        const description = document.getElementById('doctor-description').value;
        const fees = document.getElementById('doctor-fees').value;
        
        if (!specialty || !clinic || !qualification) {
            showNotification('يرجى ملء جميع الحقول الطبية', 'error');
            return;
        }
        
        newUser.specialty = specialty;
        newUser.clinic = clinic;
        newUser.qualification = qualification;
        newUser.experience = parseInt(experience) || 0;
        newUser.description = description;
        newUser.fees = parseInt(fees) || 150;
        newUser.rating = 5.0;
        
    } else if (selectedUserType === 'patient') {
        const gender = document.getElementById('patient-gender').value;
        const city = document.getElementById('patient-city').value;
        const bloodType = document.getElementById('patient-blood-type').value;
        
        if (!gender) {
            showNotification('يرجى اختيار الجنس', 'error');
            return;
        }
        
        newUser.gender = gender;
        newUser.city = city;
        newUser.bloodType = bloodType;
    }
    
    // إضافة المستخدم الجديد
    users.push(newUser);
    saveUsersToStorage();
    
    // تسجيل الدخول تلقائياً
    currentUser = newUser;
    saveUserSession(newUser);
    logUserActivity(newUser.id, 'register', `تسجيل حساب جديد كـ ${getRoleDisplayName(selectedUserType)}`);
    
    showDashboard(selectedUserType);
    showNotification(`🎉 تم إنشاء حسابك بنجاح! مرحباً ${name}`, 'success');
    updateUserInfo(newUser);
}

function saveUsersToStorage() {
    localStorage.setItem('systemUsers', JSON.stringify(users));
}

/**
 * نظام العرض والواجهات
 */
function showDashboard(role) {
    // إخفاء جميع اللوحات
    const allSections = [
        'user-type-selection', 'login-page',
        'admin-dashboard', 'doctor-dashboard', 'patient-dashboard', 'accountant-dashboard'
    ];
    
    allSections.forEach(section => {
        document.getElementById(section).classList.add('hidden');
    });
    
    // إظهار اللوحة المناسبة
    const dashboardId = `${role}-dashboard`;
    const dashboard = document.getElementById(dashboardId);
    if (dashboard) {
        dashboard.classList.remove('hidden');
    }
    
    // تحميل البيانات الخاصة بكل لوحة
    switch(role) {
        case 'admin':
            loadAdminDashboard();
            break;
        case 'doctor':
            loadDoctorDashboard();
            break;
        case 'patient':
            loadPatientDashboard();
            break;
        case 'accountant':
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
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = user.name;
        }
    }
}

function logout() {
    if (currentUser) {
        showNotification(`مع السلامة ${currentUser.name}!`, 'success');
    }
    
    // مسح جلسة المستخدم
    clearUserSession();
    currentUser = null;
    selectedUserType = '';
    
    // إعادة التعيين إلى اختيار نوع المستخدم
    showDashboard('user-type-selection');
    resetForms();
}

/**
 * لوحة المدير
 */
function loadAdminDashboard() {
    showAdminSection('stats');
    updateAdminStats();
    loadAdminUsers();
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
    // تحديث الإحصائيات
    const today = new Date().toLocaleDateString('ar-EG');
    const todayElement = document.getElementById('doctor-today-date');
    if (todayElement) {
        todayElement.textContent = today;
    }
}

function loadAdminUsers() {
    const usersList = document.getElementById('admin-users-list');
    if (!usersList) return;
    
    usersList.innerHTML = users.map(user => `
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
            </div>
            <div>
                <button class="action-btn" onclick="showEditUserForm(${user.id})" title="تعديل البيانات">✏️</button>
                <button class="action-btn" onclick="showSecurityForm(${user.id})" title="إعدادات الأمان">🔒</button>
                ${user.role !== 'admin' ? `<button class="action-btn" onclick="deleteUser(${user.id})" title="حذف">🗑️</button>` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * لوحة الطبيب
 */
function loadDoctorDashboard() {
    showDoctorSection('appointments');
    updateDoctorAppointments();
    updateDoctorPatients();
    loadDoctorProfile();
}

function showDoctorSection(section) {
    const sections = ['appointments', 'patients', 'schedule', 'profile'];
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
                    <p>📞 ${patient ? patient.phone : 'لا يوجد'}</p>
                    <span class="status ${apt.status === 'مؤكد' ? 'confirmed' : 'pending'}">${apt.status}</span>
                    <div class="quick-actions">
                        <button class="action-btn" onclick="confirmAppointment(${apt.id})">✅ تأكيد</button>
                        <button class="action-btn" onclick="rescheduleAppointment(${apt.id})">🔄 إعادة جدولة</button>
                        <button class="action-btn" onclick="cancelAppointment(${apt.id})">❌ إلغاء</button>
                    </div>
                </div>
            `;
        }).join('') || '<div class="no-data">لا توجد مواعيد لليوم</div>';
    }
}

function updateDoctorPatients() {
    const patientsList = document.getElementById('doctor-patients-list');
    if (!patientsList) return;
    
    // المرضى الذين لديهم مواعيد مع الطبيب
    const doctorAppointments = appData.appointments.filter(apt => apt.doctorId === currentUser.id);
    const patientIds = [...new Set(doctorAppointments.map(apt => apt.patientId))];
    const doctorPatients = appData.patients.filter(p => patientIds.includes(p.id));
    
    patientsList.innerHTML = doctorPatients.map(patient => `
        <div class="appointment-card">
            <h4>${patient.name}</h4>
            <p>📞 ${patient.phone}</p>
            <p>📍 ${patient.city}</p>
            <p>🎂 ${patient.age} سنة - ${patient.gender}</p>
            <p>🩸 ${patient.bloodType || 'غير محدد'}</p>
            <div class="quick-actions">
                <button class="action-btn" onclick="viewPatientHistory(${patient.id})">📋 السجل</button>
                <button class="action-btn" onclick="addAppointmentForPatient(${patient.id})">📅 موعد</button>
            </div>
        </div>
    `).join('') || '<div class="no-data">لا توجد مرضى مسجلين</div>';
}

function loadDoctorProfile() {
    const profileContainer = document.getElementById('doctor-profile-container');
    if (!profileContainer || !currentUser) return;
    
    profileContainer.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">🩺</div>
            <div class="profile-info">
                <h3>${currentUser.name}</h3>
                <p>${currentUser.specialty} - ${currentUser.qualification}</p>
                <p>📧 ${currentUser.email} | 📞 ${currentUser.phone}</p>
            </div>
        </div>
        
        <div class="profile-details">
            <div class="detail-group">
                <h4>🩺 المعلومات المهنية</h4>
                <div class="detail-item">
                    <span>التخصص:</span>
                    <span>${currentUser.specialty}</span>
                </div>
                <div class="detail-item">
                    <span>العيادة:</span>
                    <span>${currentUser.clinic}</span>
                </div>
                <div class="detail-item">
                    <span>سنوات الخبرة:</span>
                    <span>${currentUser.experience} سنة</span>
                </div>
                <div class="detail-item">
                    <span>رسوم الكشف:</span>
                    <span>${currentUser.fees} ريال</span>
                </div>
            </div>
            
            <div class="detail-group">
                <h4>📊 الإحصائيات</h4>
                <div class="detail-item">
                    <span>المواعيد اليوم:</span>
                    <span>${appData.appointments.filter(apt => apt.doctorId === currentUser.id && apt.date === new Date().toISOString().split('T')[0]).length}</span>
                </div>
                <div class="detail-item">
                    <span>إجمالي المرضى:</span>
                    <span>${new Set(appData.appointments.filter(apt => apt.doctorId === currentUser.id).map(apt => apt.patientId)).size}</span>
                </div>
                <div class="detail-item">
                    <span>التقييم:</span>
                    <span>⭐ ${currentUser.rating}/5</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * لوحة المريض
 */
function loadPatientDashboard() {
    showPatientSection('appointments');
    updatePatientAppointments();
    updatePatientDoctors();
    updatePatientClinics();
    loadPatientProfile();
}

function showPatientSection(section) {
    const sections = ['appointments', 'doctors', 'clinics', 'ai', 'profile'];
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
                    <p>🏥 ${doctor ? doctor.clinic : 'غير محدد'}</p>
                    <span class="status ${apt.status === 'مؤكد' ? 'confirmed' : apt.status === 'معلق' ? 'pending' : 'cancelled'}">${apt.status}</span>
                    <div class="quick-actions">
                        <button class="action-btn" onclick="rescheduleAppointment(${apt.id})">🔄 إعادة جدولة</button>
                        <button class="action-btn" onclick="cancelPatientAppointment(${apt.id})">❌ إلغاء</button>
                    </div>
                </div>
            `;
        }).join('') || '<div class="no-data">لا توجد مواعيد حالية</div>';
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
            </div>
        </div>
    `).join('');
}

function updatePatientClinics() {
    const clinicsList = document.getElementById('patient-clinics-list');
    if (!clinicsList) return;
    
    clinicsList.innerHTML = appData.clinics.map(clinic => `
        <div class="appointment-card">
            <h4>🏥 ${clinic.name}</h4>
            <p>📍 ${clinic.address}</p>
            <p>📞 ${clinic.phone}</p>
            <p>🕒 ${clinic.workingHours}</p>
            <p>🎯 التخصصات: ${clinic.specialties.join('، ')}</p>
            <div class="quick-actions">
                <button class="action-btn primary" onclick="viewClinicOnMap(${clinic.id})">🗺️ عرض على الخريطة</button>
                <button class="action-btn" onclick="callClinic('${clinic.phone}')">📞 اتصل</button>
            </div>
        </div>
    `).join('');
}

function loadPatientProfile() {
    const profileContainer = document.getElementById('patient-profile-container');
    if (!profileContainer || !currentUser) return;
    
    const patientAppointments = appData.appointments.filter(apt => apt.patientId === currentUser.id);
    const confirmedAppointments = patientAppointments.filter(apt => apt.status === 'مؤكد').length;
    const completedAppointments = patientAppointments.filter(apt => apt.status === 'مكتمل').length;
    const uniqueDoctors = new Set(patientAppointments.map(apt => apt.doctorId)).size;
    
    profileContainer.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">👤</div>
            <div class="profile-info">
                <h3>${currentUser.name}</h3>
                <p>🎂 ${currentUser.age} سنة - ${currentUser.gender}</p>
                <p>📧 ${currentUser.email} | 📞 ${currentUser.phone}</p>
            </div>
        </div>
        
        <div class="profile-details">
            <div class="detail-group">
                <h4>👤 المعلومات الشخصية</h4>
                <div class="detail-item">
                    <span>العمر:</span>
                    <span>${currentUser.age} سنة</span>
                </div>
                <div class="detail-item">
                    <span>الجنس:</span>
                    <span>${currentUser.gender}</span>
                </div>
                <div class="detail-item">
                    <span>المدينة:</span>
                    <span>${currentUser.city || 'غير محدد'}</span>
                </div>
                <div class="detail-item">
                    <span>فصيلة الدم:</span>
                    <span>${currentUser.bloodType || 'غير محدد'}</span>
                </div>
            </div>
            
            <div class="detail-group">
                <h4>📊 الإحصائيات</h4>
                <div class="detail-item">
                    <span>المواعيد القادمة:</span>
                    <span>${confirmedAppointments}</span>
                </div>
                <div class="detail-item">
                    <span>المواعيد السابقة:</span>
                    <span>${completedAppointments}</span>
                </div>
                <div class="detail-item">
                    <span>عدد الأطباء:</span>
                    <span>${uniqueDoctors}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * لوحة المحاسب
 */
function loadAccountantDashboard() {
    showAccountantSection('transactions');
    updateAccountantTransactions();
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

function updateAccountantTransactions() {
    const transactionsList = document.getElementById('accountant-transactions-list');
    if (!transactionsList) return;
    
    transactionsList.innerHTML = appData.transactions.map(transaction => `
        <div class="table-row">
            <div>${transaction.id}</div>
            <div>
                <span class="transaction-type ${transaction.type}">${transaction.type}</span>
            </div>
            <div>${transaction.amount} ريال</div>
            <div>${transaction.description}</div>
            <div>${transaction.date}</div>
            <div>
                <span class="status ${transaction.status}">${transaction.status}</span>
            </div>
            <div>${transaction.patientName || '-'}</div>
            <div>
                <button class="action-btn" onclick="editTransaction(${transaction.id})">✏️</button>
                <button class="action-btn" onclick="deleteTransaction(${transaction.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function updateFinancialStats() {
    const totalIncome = appData.transactions
        .filter(t => t.type === 'دخل' && t.status === 'مكتمل')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = appData.transactions
        .filter(t => t.type === 'مصروف' && t.status === 'مكتمل')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingIncome = appData.transactions
        .filter(t => t.type === 'دخل' && t.status === 'معلق')
        .reduce((sum, t) => sum + t.amount, 0);
    
    document.getElementById('total-income').textContent = `${totalIncome} ريال`;
    document.getElementById('total-expenses').textContent = `${totalExpenses} ريال`;
    document.getElementById('net-profit').textContent = `${totalIncome - totalExpenses} ريال`;
    document.getElementById('pending-income').textContent = `${pendingIncome} ريال`;
}

/**
 * دوال مساعدة عامة
 */
function getRoleDisplayName(role) {
    const roles = {
        'admin': 'مدير النظام',
        'doctor': 'طبيب',
        'patient': 'مريض',
        'accountant': 'محاسب'
    };
    return roles[role] || role;
}

function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // إضافة الإشعار إلى الصفحة
    const container = document.getElementById('notifications-container') || createNotificationsContainer();
    container.appendChild(notification);
    
    // إزالة الإشعار تلقائياً بعد 5 ثواني
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function createNotificationsContainer() {
    const container = document.createElement('div');
    container.id = 'notifications-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
    `;
    document.body.appendChild(container);
    return container;
}

function saveUserSession(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userSession', 'active');
    localStorage.setItem('lastLogin', new Date().toISOString());
}

function clearUserSession() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userSession');
}

function updateSessionStatus() {
    const sessionStatus = document.getElementById('session-status');
    if (sessionStatus) {
        sessionStatus.textContent = 'نشط';
        sessionStatus.className = 'session-status active';
    }
}

function logUserActivity(userId, action, description) {
    const activities = JSON.parse(localStorage.getItem('userActivities')) || [];
    activities.push({
        userId,
        action,
        description,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('userActivities', JSON.stringify(activities));
}

// دوال تفاعلية
function bookWithDoctor(doctorId) {
    const doctor = appData.doctors.find(d => d.id === doctorId);
    if (doctor) {
        showNotification(`جاري فتح نموذج الحجز مع ${doctor.name}`, 'info');
    }
}

function viewDoctorProfile(doctorId) {
    const doctor = appData.doctors.find(d => d.id === doctorId);
    if (doctor) {
        showNotification(`عرض ملف الدكتور: ${doctor.name}`, 'info');
    }
}

function cancelPatientAppointment(appointmentId) {
    if (confirm('هل أنت متأكد من إلغاء هذا الموعد؟')) {
        const appointment = appData.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            appointment.status = 'ملغي';
            showNotification('تم إلغاء الموعد بنجاح', 'success');
            updatePatientAppointments();
        }
    }
}

function viewClinicOnMap(clinicId) {
    const clinic = appData.clinics.find(c => c.id === clinicId);
    if (clinic) {
        showNotification(`عرض عيادة ${clinic.name} على الخريطة`, 'info');
    }
}

function callClinic(phone) {
    showNotification(`جاري الاتصال بالرقم: ${phone}`, 'info');
}

function bookNewAppointment() {
    showNotification('جاري فتح نموذج حجز موعد جديد', 'info');
}

function editTransaction(transactionId) {
    showNotification(`تعديل المعاملة رقم: ${transactionId}`, 'info');
}

function deleteTransaction(transactionId) {
    if (confirm('هل أنت متأكد من حذف هذه المعاملة؟')) {
        showNotification('تم حذف المعاملة', 'success');
    }
}

// دوال احتياطية للواجهات غير المكتملة
function showEditUserForm(userId) {
    showNotification('جاري فتح نموذج تعديل المستخدم', 'info');
}

function showSecurityForm(userId) {
    showNotification('جاري فتح إعدادات الأمان', 'info');
}

function deleteUser(userId) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        showNotification('تم حذف المستخدم', 'success');
    }
}

function confirmAppointment(appointmentId) {
    const appointment = appData.appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        appointment.status = 'مؤكد';
        showNotification('تم تأكيد الموعد', 'success');
        updateDoctorAppointments();
    }
}

function rescheduleAppointment(appointmentId) {
    showNotification('جاري فتح نموذج إعادة جدولة الموعد', 'info');
}

function cancelAppointment(appointmentId) {
    if (confirm('هل أنت متأكد من إلغاء هذا الموعد؟')) {
        const appointment = appData.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            appointment.status = 'ملغي';
            showNotification('تم إلغاء الموعد', 'success');
            updateDoctorAppointments();
        }
    }
}

function viewPatientHistory(patientId) {
    showNotification('جاري فتح السجل الطبي للمريض', 'info');
}

function addAppointmentForPatient(patientId) {
    showNotification('جاري فتح نموذج إضافة موعد للمريض', 'info');
}

// تهيئة التطبيق عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من وجود جلسة نشطة
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard(currentUser.role);
        updateUserInfo(currentUser);
    } else {
        showDashboard('user-type-selection');
    }
    
    console.log('🚀 نظام إدارة المستشفيات المتكامل جاهز للعمل!');
});
