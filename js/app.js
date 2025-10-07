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
    document.getElementById(formId).classlist.add('hidden');
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

// تحميل البيانات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    showSection('dashboard');
    loadPatients();
});
