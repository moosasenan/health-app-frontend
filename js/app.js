const API_BASE = 'https://health-app-backend.onrender.com/api';

// بيانات تجريبية
const mockData = {
    patients: [
        { id: 1, full_name: 'موسى إبراهيم', phone: '775686818', city: 'تقرأ' },
        { id: 2, full_name: 'أحمد محمد', phone: '123456789', city: 'الرياض' },
        { id: 3, full_name: 'فاطمة علي', phone: '555123456', city: 'جدة' }
    ],
    doctors: [
        { id: 1, name: 'د. خالد أحمد', specialty: 'طب عام', phone: '111222333', clinic: 'العيادة المركزية' },
        { id: 2, name: 'د. سارة محمد', specialty: 'أطفال', phone: '444555666', clinic: 'مستشفى الأطفال' }
    ],
    appointments: [
        { id: 1, patient_id: 1, doctor_id: 1, appointment_date: '2024-01-15T10:00:00', notes: 'كشف دوري' }
    ]
};

// وظائف أساسية
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
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

// إدارة المرضى (باستخدام البيانات التجريبية)
function loadPatients() {
    const patientsList = document.getElementById('patients-list');
    patientsList.innerHTML = '';
    
    mockData.patients.forEach(patient => {
        const patientDiv = document.createElement('div');
        patientDiv.className = 'data-item';
        patientDiv.innerHTML = `
            <strong>${patient.full_name}</strong>
            <br>الهاتف: ${patient.phone}
            <br>المدينة: ${patient.city}
        `;
        patientsList.appendChild(patientDiv);
    });
    
    document.getElementById('patients-count').textContent = mockData.patients.length;
}

function addPatient() {
    const name = document.getElementById('patient-name').value;
    const phone = document.getElementById('patient-phone').value;
    const city = document.getElementById('patient-city').value;
    
    if (!name) {
        showMessage('الرجاء إدخال اسم المريض', 'error');
        return;
    }
    
    // إضافة إلى البيانات التجريبية
    const newPatient = {
        id: mockData.patients.length + 1,
        full_name: name,
        phone: phone,
        city: city
    };
    
    mockData.patients.push(newPatient);
    showMessage('تم إضافة المريض بنجاح');
    document.getElementById('patient-name').value = '';
    document.getElementById('patient-phone').value = '';
    document.getElementById('patient-city').value = '';
    hideForm('add-patient-form');
    loadPatients();
}

// إدارة الأطباء
function loadDoctors() {
    const doctorsList = document.getElementById('doctors-list');
    doctorsList.innerHTML = '';
    
    mockData.doctors.forEach(doctor => {
        const doctorDiv = document.createElement('div');
        doctorDiv.className = 'data-item';
        doctorDiv.innerHTML = `
            <strong>${doctor.name}</strong>
            <br>التخصص: ${doctor.specialty}
            <br>الهاتف: ${doctor.phone}
            <br>العيادة: ${doctor.clinic}
        `;
        doctorsList.appendChild(doctorDiv);
    });
    
    document.getElementById('doctors-count').textContent = mockData.doctors.length;
}

// إدارة المواعيد
function loadAppointments() {
    const appointmentsList = document.getElementById('appointments-list');
    appointmentsList.innerHTML = '';
    
    mockData.appointments.forEach(appointment => {
        const appointmentDiv = document.createElement('div');
        appointmentDiv.className = 'data-item';
        appointmentDiv.innerHTML = `
            <strong>موعد</strong>
            <br>المريض: ${mockData.patients.find(p => p.id === appointment.patient_id)?.full_name || 'غير معروف'}
            <br>الطبيب: ${mockData.doctors.find(d => d.id === appointment.doctor_id)?.name || 'غير معروف'}
            <br>التاريخ: ${new Date(appointment.appointment_date).toLocaleString('ar-EG')}
            <br>ملاحظات: ${appointment.notes || 'لا يوجد'}
        `;
        appointmentsList.appendChild(appointmentDiv);
    });
    
    document.getElementById('appointments-count').textContent = mockData.appointments.length;
}

// تحميل البيانات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    showSection('dashboard');
    loadPatients();
    loadDoctors();
    loadAppointments();
});
