const API_BASE = 'https://health-app-backend.onrender.com/api';

// بيانات تجريبية موسعة
const mockData = {
    patients: [
        { id: 1, full_name: 'موسى إبراهيم', phone: '775686818', city: 'تقرأ', age: 35 },
        { id: 2, full_name: 'أحمد محمد', phone: '123456789', city: 'الرياض', age: 28 },
        { id: 3, full_name: 'فاطمة علي', phone: '555123456', city: 'جدة', age: 42 }
    ],
    doctors: [
        { id: 1, name: 'د. أحمد محمد', specialty: 'باطنية', phone: '111222333', clinic: 'العيادة المركزية', fees: 150 },
        { id: 2, name: 'د. فاطمة علي', specialty: 'قلب', phone: '444555666', clinic: 'مستشفى الثورة', fees: 250 },
        { id: 3, name: 'د. خالد حسن', specialty: 'عظام', phone: '777888999', clinic: 'مركز العظام', fees: 200 }
    ],
    appointments: [
        { id: 1, patient_id: 1, doctor_id: 1, date: '2024-01-20', time: '10:00', status: 'مؤكد', notes: 'كشف دوري' },
        { id: 2, patient_id: 2, doctor_id: 2, date: '2024-01-22', time: '11:30', status: 'معلق', notes: 'ضغط دم مرتفع' }
    ],
    clinics: [
        { id: 1, name: 'العيادة المركزية', address: 'صنعاء - حي الرياض - شارع الستين', phone: '0111111111', city: 'صنعاء' },
        { id: 2, name: 'مستشفى الثورة', address: 'صنعاء - شارع الزبيري', phone: '0222222222', city: 'صنعاء' },
        { id: 3, name: 'مركز العظام التخصصي', address: 'صنعاء - حي التحرير', phone: '0333333333', city: 'صنعاء' }
    ],
    transactions: [
        { id: 1, type: 'دخل', amount: 150, description: 'كشف د. أحمد', date: '2024-01-15', status: 'مكتمل' },
        { id: 2, type: 'دخل', amount: 250, description: 'كشف د. فاطمة', date: '2024-01-16', status: 'معلق' }
    ]
};

// وظائف أساسية
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    updateDashboardStats();
}

function showForm(formId) {
    document.getElementById(formId).classList.remove('hidden');
}

function hideForm(formId) {
    document.getElementById(formId).classList.add('hidden');
}

function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="${type}-message">${message}</div>`;
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}

// تحديث إحصائيات لوحة التحكم
function updateDashboardStats() {
    document.getElementById('patients-count').textContent = mockData.patients.length;
    document.getElementById('doctors-count').textContent = mockData.doctors.length;
    document.getElementById('appointments-count').textContent = mockData.appointments.length;
    
    const totalRevenue = mockData.transactions
        .filter(t => t.status === 'مكتمل')
        .reduce((sum, t) => sum + t.amount, 0);
    document.getElementById('revenue-count').textContent = totalRevenue + ' ريال';
}

// إدارة المرضى
function loadPatients() {
    const patientsList = document.getElementById('patients-list');
    patientsList.innerHTML = '';
    
    if (mockData.patients.length === 0) {
        patientsList.innerHTML = '<div class="data-item">لا توجد بيانات</div>';
        return;
    }
    
    mockData.patients.forEach(patient => {
        const patientDiv = document.createElement('div');
        patientDiv.className = 'data-item';
        patientDiv.innerHTML = `
            <strong>${patient.full_name}</strong>
            <br>📞 ${patient.phone}
            <br>📍 ${patient.city}
            <br>🎂 ${patient.age} سنة
            <br>🆔 ${patient.id}
        `;
        patientsList.appendChild(patientDiv);
    });
}

function addPatient() {
    const name = document.getElementById('patient-name').value;
    const phone = document.getElementById('patient-phone').value;
    const city = document.getElementById('patient-city').value;
    const age = document.getElementById('patient-age').value;
    
    if (!name) {
        showMessage('الرجاء إدخال اسم المريض', 'error');
        return;
    }
    
    const newPatient = {
        id: mockData.patients.length + 1,
        full_name: name,
        phone: phone,
        city: city,
        age: parseInt(age) || 0
    };
    
    mockData.patients.push(newPatient);
    showMessage('تم إضافة المريض بنجاح');
    
    // مسح الحقول
    document.getElementById('patient-name').value = '';
    document.getElementById('patient-phone').value = '';
    document.getElementById('patient-city').value = '';
    document.getElementById('patient-age').value = '';
    
    hideForm('add-patient-form');
    loadPatients();
    updateDashboardStats();
}

// إدارة الأطباء
function loadDoctors() {
    const doctorsList = document.getElementById('doctors-list');
    doctorsList.innerHTML = '';
    
    if (mockData.doctors.length === 0) {
        doctorsList.innerHTML = '<div class="data-item">لا توجد بيانات</div>';
        return;
    }
    
    mockData.doctors.forEach(doctor => {
        const doctorDiv = document.createElement('div');
        doctorDiv.className = 'data-item';
        doctorDiv.innerHTML = `
            <strong>${doctor.name}</strong>
            <br>🩺 ${doctor.specialty}
            <br>📞 ${doctor.phone}
            <br>🏥 ${doctor.clinic}
            <br>💰 ${doctor.fees} ريال
        `;
        doctorsList.appendChild(doctorDiv);
    });
}

function addDoctor() {
    const name = document.getElementById('doctor-name').value;
    const specialty = document.getElementById('doctor-specialty').value;
    const phone = document.getElementById('doctor-phone').value;
    const clinic = document.getElementById('doctor-clinic').value;
    const fees = document.getElementById('doctor-fees').value;
    
    if (!name || !specialty) {
        showMessage('الرجاء إدخال اسم الطبيب والتخصص', 'error');
        return;
    }
    
    const newDoctor = {
        id: mockData.doctors.length + 1,
        name: name,
        specialty: specialty,
        phone: phone,
        clinic: clinic,
        fees: parseInt(fees) || 0
    };
    
    mockData.doctors.push(newDoctor);
    showMessage('تم إضافة الطبيب بنجاح');
    
    // مسح الحقول
    document.getElementById('doctor-name').value = '';
    document.getElementById('doctor-specialty').value = '';
    document.getElementById('doctor-phone').value = '';
    document.getElementById('doctor-clinic').value = '';
    document.getElementById('doctor-fees').value = '';
    
    hideForm('add-doctor-form');
    loadDoctors();
    updateDashboardStats();
}

// إدارة المواعيد
function loadAppointments() {
    const appointmentsList = document.getElementById('appointments-list');
    appointmentsList.innerHTML = '';
    
    if (mockData.appointments.length === 0) {
        appointmentsList.innerHTML = '<div class="data-item">لا توجد مواعيد</div>';
        return;
    }
    
    mockData.appointments.forEach(appointment => {
        const patient = mockData.patients.find(p => p.id === appointment.patient_id);
        const doctor = mockData.doctors.find(d => d.id === appointment.doctor_id);
        
        const appointmentDiv = document.createElement('div');
        appointmentDiv.className = 'data-item';
        appointmentDiv.innerHTML = `
            <strong>📅 موعد</strong>
            <br>👤 المريض: ${patient ? patient.full_name : 'غير معروف'}
            <br>🩺 الطبيب: ${doctor ? doctor.name : 'غير معروف'}
            <br>📅 التاريخ: ${appointment.date}
            <br>⏰ الوقت: ${appointment.time}
            <br>📝 ${appointment.notes}
            <br>✅ ${appointment.status}
        `;
        appointmentsList.appendChild(appointmentDiv);
    });
}

async function showAppointmentForm() {
    await loadPatientsForSelect();
    await loadDoctorsForSelect();
    showForm('add-appointment-form');
}

async function loadPatientsForSelect() {
    const select = document.getElementById('appointment-patient');
    select.innerHTML = '<option value="">اختر المريض</option>';
    
    mockData.patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = patient.full_name;
        select.appendChild(option);
    });
}

async function loadDoctorsForSelect() {
    const select = document.getElementById('appointment-doctor');
    select.innerHTML = '<option value="">اختر الطبيب</option>';
    
    mockData.doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = `${doctor.name} - ${doctor.specialty}`;
        select.appendChild(option);
    });
}

function addAppointment() {
    const patientId = document.getElementById('appointment-patient').value;
    const doctorId = document.getElementById('appointment-doctor').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const notes = document.getElementById('appointment-notes').value;
    
    if (!patientId || !doctorId || !date || !time) {
        showMessage('الرجاء ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const newAppointment = {
        id: mockData.appointments.length + 1,
        patient_id: parseInt(patientId),
        doctor_id: parseInt(doctorId),
        date: date,
        time: time,
        status: 'معلق',
        notes: notes
    };
    
    mockData.appointments.push(newAppointment);
    showMessage('تم حجز الموعد بنجاح');
    
    // مسح الحقول
    document.getElementById('appointment-patient').value = '';
    document.getElementById('appointment-doctor').value = '';
    document.getElementById('appointment-date').value = '';
    document.getElementById('appointment-time').value = '';
    document.getElementById('appointment-notes').value = '';
    
    hideForm('add-appointment-form');
    loadAppointments();
    updateDashboardStats();
}

// إدارة العيادات
function loadClinics() {
    const clinicsList = document.getElementById('clinics-list');
    clinicsList.innerHTML = '';
    
    mockData.clinics.forEach(clinic => {
        const clinicDiv = document.createElement('div');
        clinicDiv.className = 'clinic-card';
        clinicDiv.innerHTML = `
            <h4>${clinic.name}</h4>
            <div class="clinic-info">
                📍 ${clinic.address}<br>
                📞 ${clinic.phone}<br>
                🏙️ ${clinic.city}
            </div>
            <div class="clinic-actions">
                <button onclick="callClinic('${clinic.phone}')">📞 اتصل</button>
                <button onclick="showDirections('${clinic.address}')">🗺️ الاتجاهات</button>
            </div>
        `;
        clinicsList.appendChild(clinicDiv);
    });
}

function filterClinics() {
    const searchTerm = document.getElementById('clinic-search').value.toLowerCase();
    const cityFilter = document.getElementById('city-filter').value;
    
    const filteredClinics = mockData.clinics.filter(clinic => {
        const matchesSearch = clinic.name.toLowerCase().includes(searchTerm) || 
                            clinic.address.toLowerCase().includes(searchTerm);
        const matchesCity = !cityFilter || clinic.city === cityFilter;
        return matchesSearch && matchesCity;
    });
    
    const clinicsList = document.getElementById('clinics-list');
    clinicsList.innerHTML = '';
    
    filteredClinics.forEach(clinic => {
        const clinicDiv = document.createElement('div');
        clinicDiv.className = 'clinic-card';
        clinicDiv.innerHTML = `
            <h4>${clinic.name}</h4>
            <div class="clinic-info">
                📍 ${clinic.address}<br>
                📞 ${clinic.phone}<br>
                🏙️ ${clinic.city}
            </div>
            <div class="clinic-actions">
                <button onclick="callClinic('${clinic.phone}')">📞 اتصل</button>
                <button onclick="showDirections('${clinic.address}')">🗺️ الاتجاهات</button>
            </div>
        `;
        clinicsList.appendChild(clinicDiv);
    });
}

function callClinic(phone) {
    showMessage(`جاري الاتصال بالعيادة: ${phone}`, 'success');
    // في التطبيق الحقيقي: window.open(`tel:${phone}`);
}

function showDirections(address) {
    showMessage(`عرض الاتجاهات إلى: ${address}`, 'success');
    // في التطبيق الحقيقي: window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
}

function showMockMap() {
    const mapContainer = document.getElementById('clinics-map');
    mapContainer.innerHTML = `
        <div class="map-placeholder" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <h3>🗺️ خريطة العيادات التفاعلية</h3>
            <p>هنا تظهر الخريطة الحقيقية مع مواقع العيادات</p>
            <div style="margin: 20px 0;">
                <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 5px; margin: 5px 0;">
                    📍 العيادة المركزية - حي الرياض
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 5px; margin: 5px 0;">
                    📍 مستشفى الثورة - شارع الزبيري
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 5px; margin: 5px 0;">
                    📍 مركز العظام - حي التحرير
                </div>
            </div>
            <button onclick="loadClinics()" style="background: white; color: #667eea;">🔄 العودة للقائمة</button>
        </div>
    `;
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
    const chatMessages = document.getElementById('chat-messages');
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
        return 'بناءً على وصفك للألم، أنصحك بمراجعة طبيب باطنية. يمكنك حجز موعد من قسم "إدارة المواعيد". هل تريد المساعدة في العثور على طبيب قريب؟';
    } else if (lowerMessage.includes('حرارة') || lowerMessage.includes('سخونة')) {
        return 'الحرارة قد تكون عرضاً لعدة حالات. أنصح بعمل تحاليل دم وصورة شعاعية للصدر. يمكنني مساعدتك في العثور على مختبر قريب من قسم "العيادات".';
    } else if (lowerMessage.includes('ضغط') || lowerMessage.includes('دوار')) {
        return 'هذه الأعراض قد تكون مرتبطة بضغط الدم. أنصح بمراجعة طبيب قلب وأوعية دموية. لدينا أطباء متخصصون في هذا المجال في قسم "إدارة الأطباء".';
    } else if (lowerMessage.includes('حساسية') || lowerMessage.includes('حكة')) {
        return 'الأعراض تشير إلى احتمالية وجود حساسية. جرب تناول مضاد هستامين، وإذا استمرت الأعراض راجع طبيب جلدية من قسم "إدارة الأطباء".';
    } else {
        return 'شكراً لاستشارتك. للحصول على تشخيص دقيق، أنصح بمراجعة طبيب متخصص. يمكنني مساعدتك في حجز موعد مع طبيب مناسب من خلال التطبيق.';
    }
}

function askQuickQuestion(question) {
    document.getElementById('user-message').value = question;
    sendMessage();
}

// النظام المالي
function loadFinancialReports() {
    const totalIncome = mockData.transactions
        .filter(t => t.status === 'مكتمل')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingIncome = mockData.transactions
        .filter(t => t.status === 'معلق')
        .reduce((sum, t) => sum + t.amount, 0);
    
    document.getElementById('total-income').textContent = totalIncome + ' ريال';
    document.getElementById('pending-income').textContent = pendingIncome + ' ريال';
    document.getElementById('total-expenses').textContent = '0 ريال'; // يمكن إضافة بيانات المصروفات لاحقاً
    
    // تحديث التقارير المالية
    document.getElementById('daily-revenue').textContent = totalIncome + ' ريال';
    document.getElementById('monthly-revenue').textContent = (totalIncome * 30) + ' ريال';
    document.getElementById('top-doctor').textContent = 'د. أحمد محمد';
    
    showForm('financial-reports');
}

function loadTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '';
    
    mockData.transactions.forEach(transaction => {
        const transactionDiv = document.createElement('div');
        transactionDiv.className = 'data-item';
        transactionDiv.innerHTML = `
            <strong>${transaction.description}</strong>
            <br>💰 ${transaction.amount} ريال
            <br>📅 ${transaction.date}
            <br>✅ ${transaction.status}
            <br>📋 ${transaction.type}
        `;
        transactionsList.appendChild(transactionDiv);
    });
}

function generateFinancialReport() {
    showMessage('✅ تم إنشاء التقرير المالي بنجاح', 'success');
    // في التطبيق الحقيقي: تنزيل ملف PDF أو Excel
}

// الإحصائيات المتقدمة
function loadAdvancedStats() {
    // تحديث الإحصائيات المتقدمة
    document.getElementById('top-specialty').textContent = 'باطنية';
    document.getElementById('top-rated-doctor').textContent = 'د. أحمد محمد';
    document.getElementById('occupancy-rate').textContent = '75%';
    document.getElementById('growth-rate').textContent = '+15%';
}

// التصدير
function exportPatients() {
    showMessage('📄 جاري تصدير بيانات المرضى...', 'success');
    // في التطبيق الحقيقي: تنزيل ملف Excel أو CSV
}

function exportFinancialData() {
    showMessage('📊 جاري تصدير البيانات المالية...', 'success');
    // في التطبيق الحقيقي: تنزيل ملف Excel أو PDF
}

// التهيئة الأولية
document.addEventListener('DOMContentLoaded', function() {
    showSection('dashboard');
    loadPatients();
    loadDoctors();
    loadAppointments();
    loadClinics();
    loadTransactions();
    loadAdvancedStats();
    updateDashboardStats();
    
    // تهيئة فلتر المدن
    const cities = [...new Set(mockData.clinics.map(clinic => clinic.city))];
    const cityFilter = document.getElementById('city-filter');
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
});

// جعل الدوال متاحة globally
window.showSection = showSection;
window.showForm = showForm;
window.hideForm = hideForm;
window.addPatient = addPatient;
window.loadPatients = loadPatients;
window.addDoctor = addDoctor;
window.loadDoctors = loadDoctors;
window.showAppointmentForm = showAppointmentForm;
window.addAppointment = addAppointment;
window.loadAppointments = loadAppointments;
window.filterClinics = filterClinics;
window.callClinic = callClinic;
window.showDirections = showDirections;
window.showMockMap = showMockMap;
window.handleChatInput = handleChatInput;
window.sendMessage = sendMessage;
window.askQuickQuestion = askQuickQuestion;
window.loadFinancialReports = loadFinancialReports;
window.generateFinancialReport = generateFinancialReport;
window.exportPatients = exportPatients;
window.exportFinancialData = exportFinancialData;
