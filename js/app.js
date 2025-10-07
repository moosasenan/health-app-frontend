const API_BASE = 'https://health-app-backend.onrender.com/api';

// إظهار وإخفاء الأقسام
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

// إدارة المرضى
async function loadPatients() {
    try {
        const response = await fetch(`${API_BASE}/patients`);
        const patients = await response.json();
        
        const patientsList = document.getElementById('patients-list');
        patientsList.innerHTML = '';
        
        if (patients.length === 0) {
            patientsList.innerHTML = '<div class="data-item">لا توجد بيانات</div>';
            return;
        }
        
        patients.forEach(patient => {
            const patientDiv = document.createElement('div');
            patientDiv.className = 'data-item';
            patientDiv.innerHTML = `
                <strong>${patient.full_name || 'لا يوجد اسم'}</strong>
                <br>الهاتف: ${patient.phone || 'لا يوجد'}
                <br>المدينة: ${patient.city || 'لا يوجد'}
            `;
            patientsList.appendChild(patientDiv);
        });
        
        document.getElementById('patients-count').textContent = patients.length;
    } catch (error) {
        showMessage('خطأ في تحميل بيانات المرضى', 'error');
    }
}

async function addPatient() {
    const name = document.getElementById('patient-name').value;
    const phone = document.getElementById('patient-phone').value;
    const city = document.getElementById('patient-city').value;
    
    if (!name) {
        showMessage('الرجاء إدخال اسم المريض', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                full_name: name,
                phone: phone,
                city: city
            })
        });
        
        if (response.ok) {
            showMessage('تم إضافة المريض بنجاح');
            document.getElementById('patient-name').value = '';
            document.getElementById('patient-phone').value = '';
            document.getElementById('patient-city').value = '';
            hideForm('add-patient-form');
            loadPatients();
        } else {
            throw new Error('فشل في إضافة المريض');
        }
    } catch (error) {
        showMessage('خطأ في إضافة المريض', 'error');
    }
}

// إدارة الأطباء
async function loadDoctors() {
    try {
        const response = await fetch(`${API_BASE}/doctors`);
        const doctors = await response.json();
        
        const doctorsList = document.getElementById('doctors-list');
        doctorsList.innerHTML = '';
        
        if (doctors.length === 0) {
            doctorsList.innerHTML = '<div class="data-item">لا توجد بيانات</div>';
            return;
        }
        
        doctors.forEach(doctor => {
            const doctorDiv = document.createElement('div');
            doctorDiv.className = 'data-item';
            doctorDiv.innerHTML = `
                <strong>${doctor.name || 'لا يوجد اسم'}</strong>
                <br>التخصص: ${doctor.specialty || 'لا يوجد'}
                <br>الهاتف: ${doctor.phone || 'لا يوجد'}
                <br>العيادة: ${doctor.clinic || 'لا يوجد'}
            `;
            doctorsList.appendChild(doctorDiv);
        });
        
        document.getElementById('doctors-count').textContent = doctors.length;
    } catch (error) {
        showMessage('خطأ في تحميل بيانات الأطباء', 'error');
    }
}

async function addDoctor() {
    const name = document.getElementById('doctor-name').value;
    const specialty = document.getElementById('doctor-specialty').value;
    const phone = document.getElementById('doctor-phone').value;
    const clinic = document.getElementById('doctor-clinic').value;
    
    if (!name) {
        showMessage('الرجاء إدخال اسم الطبيب', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/doctors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                specialty: specialty,
                phone: phone,
                clinic: clinic
            })
        });
        
        if (response.ok) {
            showMessage('تم إضافة الطبيب بنجاح');
            document.getElementById('doctor-name').value = '';
            document.getElementById('doctor-specialty').value = '';
            document.getElementById('doctor-phone').value = '';
            document.getElementById('doctor-clinic').value = '';
            hideForm('add-doctor-form');
            loadDoctors();
        } else {
            throw new Error('فشل في إضافة الطبيب');
        }
    } catch (error) {
        showMessage('خطأ في إضافة الطبيب', 'error');
    }
}

// إدارة المواعيد
async function loadAppointments() {
    try {
        const response = await fetch(`${API_BASE}/appointments`);
        const appointments = await response.json();
        
        const appointmentsList = document.getElementById('appointments-list');
        appointmentsList.innerHTML = '';
        
        if (appointments.length === 0) {
            appointmentsList.innerHTML = '<div class="data-item">لا توجد بيانات</div>';
            return;
        }
        
        appointments.forEach(appointment => {
            const appointmentDiv = document.createElement('div');
            appointmentDiv.className = 'data-item';
            appointmentDiv.innerHTML = `
                <strong>موعد</strong>
                <br>المريض: ${appointment.patient_id}
                <br>الطبيب: ${appointment.doctor_id}
                <br>التاريخ: ${new Date(appointment.appointment_date).toLocaleString('ar-EG')}
                <br>ملاحظات: ${appointment.notes || 'لا يوجد'}
            `;
            appointmentsList.appendChild(appointmentDiv);
        });
        
        document.getElementById('appointments-count').textContent = appointments.length;
    } catch (error) {
        showMessage('خطأ في تحميل بيانات المواعيد', 'error');
    }
}

async function showAppointmentForm() {
    await loadPatientsForSelect();
    await loadDoctorsForSelect();
    showForm('add-appointment-form');
}

async function loadPatientsForSelect() {
    try {
        const response = await fetch(`${API_BASE}/patients`);
        const patients = await response.json();
        const select = document.getElementById('appointment-patient');
        select.innerHTML = '<option value="">اختر المريض</option>';
        
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = patient.full_name || 'مريض بدون اسم';
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading patients for select:', error);
    }
}

async function loadDoctorsForSelect() {
    try {
        const response = await fetch(`${API_BASE}/doctors`);
        const doctors = await response.json();
        const select = document.getElementById('appointment-doctor');
        select.innerHTML = '<option value="">اختر الطبيب</option>';
        
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.name || 'طبيب بدون اسم';
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading doctors for select:', error);
    }
}

async function addAppointment() {
    const patientId = document.getElementById('appointment-patient').value;
    const doctorId = document.getElementById('appointment-doctor').value;
    const date = document.getElementById('appointment-date').value;
    const notes = document.getElementById('appointment-notes').value;
    
    if (!patientId || !doctorId || !date) {
        showMessage('الرجاء ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patient_id: patientId,
                doctor_id: doctorId,
                appointment_date: date,
                notes: notes
            })
        });
        
        if (response.ok) {
            showMessage('تم حجز الموعد بنجاح');
            document.getElementById('appointment-patient').value = '';
            document.getElementById('appointment-doctor').value = '';
            document.getElementById('appointment-date').value = '';
            document.getElementById('appointment-notes').value = '';
            hideForm('add-appointment-form');
            loadAppointments();
        } else {
            throw new Error('فشل في حجز الموعد');
        }
    } catch (error) {
        showMessage('خطأ في حجز الموعد', 'error');
    }
}

// تحميل البيانات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    showSection('dashboard');
    loadPatients();
    loadDoctors();
    loadAppointments();
});
