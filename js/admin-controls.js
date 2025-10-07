// نظام التحكم المتقدم للمدير
class AdminControlSystem {
    constructor() {
        this.specialties = [];
        this.appSettings = this.loadAppSettings();
        this.userManagement = new UserManagement();
        this.init();
    }

    init() {
        this.loadSpecialties();
        this.applyAppSettings();
        console.log('✅ نظام التحكم الإداري جاهز');
    }

    // إدارة التخصصات الطبية
    loadSpecialties() {
        const savedSpecialties = localStorage.getItem('medicalSpecialties');
        this.specialties = savedSpecialties ? JSON.parse(savedSpecialties) : [
            { id: 1, name: 'باطنية', image: '', icon: '🫀', color: '#3498db', description: 'أمراض الباطنة والجهاز الهضمي' },
            { id: 2, name: 'قلب', image: '', icon: '❤️', color: '#e74c3c', description: 'أمراض القلب والشرايين' },
            { id: 3, name: 'عظام', image: '', icon: '🦴', color: '#f39c12', description: 'أمراض العظام والمفاصل' },
            { id: 4, name: 'أطفال', image: '', icon: '👶', color: '#9b59b6', description: 'طب الأطفال والمراهقين' },
            { id: 5, name: 'نساء وتوليد', image: '', icon: '🤰', color: '#e91e63', description: 'طب النساء والتوليد' },
            { id: 6, name: 'جلدية', image: '', icon: '🧴', color: '#2ecc71', description: 'أمراض الجلدية والتناسلية' },
            { id: 7, name: 'عيون', image: '', icon: '👁️', color: '#1abc9c', description: 'طب وجراحة العيون' },
            { id: 8, name: 'أنف وأذن', image: '', icon: '👂', color: '#34495e', description: 'أمراض الأنف والأذن والحنجرة' }
        ];
        this.renderSpecialtiesGrid();
    }

    renderSpecialtiesGrid() {
        const grid = document.getElementById('specialties-grid');
        if (!grid) return;

        grid.innerHTML = this.specialties.map(specialty => `
            <div class="specialty-card" style="border-color: ${specialty.color}">
                <div class="specialty-actions">
                    <button class="specialty-btn" onclick="adminSystem.editSpecialty(${specialty.id})" title="تعديل">✏️</button>
                    <button class="specialty-btn" onclick="adminSystem.deleteSpecialty(${specialty.id})" title="حذف">🗑️</button>
                </div>
                <div class="specialty-image" style="background: ${specialty.color}20">
                    ${specialty.image ? 
                        `<img src="${specialty.image}" alt="${specialty.name}" style="width: 60px; height: 60px; border-radius: 50%;">` : 
                        `<span style="font-size: 2em;">${specialty.icon}</span>`
                    }
                </div>
                <div class="specialty-name">${specialty.name}</div>
                <div class="specialty-description">${specialty.description}</div>
            </div>
        `).join('');
    }

    showAddSpecialtyForm() {
        const formHtml = `
            <div class="modal-overlay" id="specialty-modal">
                <div class="modal-content">
                    <h3>➕ إضافة تخصص جديد</h3>
                    <div class="form-group">
                        <label>اسم التخصص:</label>
                        <input type="text" id="new-specialty-name" placeholder="أدخل اسم التخصص">
                    </div>
                    <div class="form-group">
                        <label>وصف التخصص:</label>
                        <textarea id="new-specialty-description" placeholder="أدخل وصف التخصص" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label>الأيقونة:</label>
                        <select id="new-specialty-icon">
                            <option value="🫀">🫀 باطنية</option>
                            <option value="❤️">❤️ قلب</option>
                            <option value="🦴">🦴 عظام</option>
                            <option value="👶">👶 أطفال</option>
                            <option value="🤰">🤰 نساء</option>
                            <option value="🧴">🧴 جلدية</option>
                            <option value="👁️">👁️ عيون</option>
                            <option value="👂">👂 أنف وأذن</option>
                            <option value="🧠">🧠 مخ وأعصاب</option>
                            <option value="🦷">🦷 أسنان</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>لون التخصص:</label>
                        <input type="color" id="new-specialty-color" value="#3498db">
                    </div>
                    <div class="form-actions">
                        <button onclick="adminSystem.addSpecialty()" class="add-btn">💾 حفظ</button>
                        <button onclick="adminSystem.closeModal()" class="cancel-btn">❌ إلغاء</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
    }

    addSpecialty() {
        const name = document.getElementById('new-specialty-name').value;
        const description = document.getElementById('new-specialty-description').value;
        const icon = document.getElementById('new-specialty-icon').value;
        const color = document.getElementById('new-specialty-color').value;

        if (!name) {
            showNotification('يرجى إدخال اسم التخصص', 'error');
            return;
        }

        if (!description) {
            showNotification('يرجى إدخال وصف التخصص', 'error');
            return;
        }

        const newSpecialty = {
            id: Date.now(),
            name: name,
            description: description,
            icon: icon,
            color: color,
            image: ''
        };

        this.specialties.push(newSpecialty);
        this.saveSpecialties();
        this.renderSpecialtiesGrid();
        this.closeModal();
        showNotification('تم إضافة التخصص بنجاح', 'success');
        
        // تسجيل النشاط
        if (window.currentUser) {
            logUserActivity(window.currentUser.id, 'add_specialty', `إضافة تخصص جديد: ${name}`);
        }
    }

    editSpecialty(id) {
        const specialty = this.specialties.find(s => s.id === id);
        if (!specialty) return;

        const formHtml = `
            <div class="modal-overlay" id="specialty-modal">
                <div class="modal-content">
                    <h3>✏️ تعديل التخصص</h3>
                    <div class="form-group">
                        <label>اسم التخصص:</label>
                        <input type="text" id="edit-specialty-name" value="${specialty.name}">
                    </div>
                    <div class="form-group">
                        <label>وصف التخصص:</label>
                        <textarea id="edit-specialty-description" rows="3">${specialty.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>الأيقونة:</label>
                        <select id="edit-specialty-icon">
                            <option value="🫀" ${specialty.icon === '🫀' ? 'selected' : ''}>🫀 باطنية</option>
                            <option value="❤️" ${specialty.icon === '❤️' ? 'selected' : ''}>❤️ قلب</option>
                            <option value="🦴" ${specialty.icon === '🦴' ? 'selected' : ''}>🦴 عظام</option>
                            <option value="👶" ${specialty.icon === '👶' ? 'selected' : ''}>👶 أطفال</option>
                            <option value="🤰" ${specialty.icon === '🤰' ? 'selected' : ''}>🤰 نساء</option>
                            <option value="🧴" ${specialty.icon === '🧴' ? 'selected' : ''}>🧴 جلدية</option>
                            <option value="👁️" ${specialty.icon === '👁️' ? 'selected' : ''}>👁️ عيون</option>
                            <option value="👂" ${specialty.icon === '👂' ? 'selected' : ''}>👂 أنف وأذن</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>لون التخصص:</label>
                        <input type="color" id="edit-specialty-color" value="${specialty.color}">
                    </div>
                    <div class="form-actions">
                        <button onclick="adminSystem.updateSpecialty(${id})" class="add-btn">💾 حفظ</button>
                        <button onclick="adminSystem.closeModal()" class="cancel-btn">❌ إلغاء</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
    }

    updateSpecialty(id) {
        const name = document.getElementById('edit-specialty-name').value;
        const description = document.getElementById('edit-specialty-description').value;
        const icon = document.getElementById('edit-specialty-icon').value;
        const color = document.getElementById('edit-specialty-color').value;

        if (!name || !description) {
            showNotification('يرجى ملء جميع الحقول', 'error');
            return;
        }

        const specialtyIndex = this.specialties.findIndex(s => s.id === id);
        if (specialtyIndex !== -1) {
            const oldName = this.specialties[specialtyIndex].name;
            this.specialties[specialtyIndex] = {
                ...this.specialties[specialtyIndex],
                name,
                description,
                icon,
                color
            };
            this.saveSpecialties();
            this.renderSpecialtiesGrid();
            this.closeModal();
            showNotification('تم تحديث التخصص بنجاح', 'success');
            
            // تسجيل النشاط
            if (window.currentUser) {
                logUserActivity(window.currentUser.id, 'update_specialty', `تحديث التخصص: ${oldName} → ${name}`);
            }
        }
    }

    deleteSpecialty(id) {
        const specialty = this.specialties.find(s => s.id === id);
        if (!specialty) return;

        if (confirm(`هل أنت متأكد من حذف تخصص "${specialty.name}"؟`)) {
            const specialtyName = specialty.name;
            this.specialties = this.specialties.filter(s => s.id !== id);
            this.saveSpecialties();
            this.renderSpecialtiesGrid();
            showNotification('تم حذف التخصص بنجاح', 'success');
            
            // تسجيل النشاط
            if (window.currentUser) {
                logUserActivity(window.currentUser.id, 'delete_specialty', `حذف التخصص: ${specialtyName}`);
            }
        }
    }

    saveSpecialties() {
        localStorage.setItem('medicalSpecialties', JSON.stringify(this.specialties));
    }

    // إدارة مظهر التطبيق
    loadAppSettings() {
        const saved = localStorage.getItem('appSettings');
        return saved ? JSON.parse(saved) : {
            appName: 'تطبيق صحتي المتكامل',
            appDescription: 'نظام إدارة المستشفيات والعيادات',
            primaryColor: '#3498db',
            backgroundColor: '#667eea',
            logo: '',
            favicon: '',
            theme: 'default',
            language: 'ar',
            direction: 'rtl'
        };
    }

    saveAppSettings() {
        localStorage.setItem('appSettings', JSON.stringify(this.appSettings));
    }

    applyAppSettings() {
        // تطبيق اسم التطبيق
        const appTitle = document.getElementById('app-title');
        const appName = document.getElementById('app-name');
        const appSubtitle = document.getElementById('app-subtitle');
        
        if (appTitle) appTitle.textContent = this.appSettings.appName;
        if (appName) appName.textContent = this.appSettings.appName;
        if (appSubtitle) appSubtitle.textContent = this.appSettings.appDescription;

        // تطبيق الألوان
        document.documentElement.style.setProperty('--primary-color', this.appSettings.primaryColor);
        document.documentElement.style.setProperty('--bg-color', this.appSettings.backgroundColor);

        // تطبيق الشعار
        if (this.appSettings.logo) {
            const logoImg = document.getElementById('app-logo');
            if (logoImg) {
                logoImg.src = this.appSettings.logo;
                logoImg.classList.remove('hidden');
            }
        }

        // تطبيق الأيقونة
        if (this.appSettings.favicon) {
            const favicon = document.getElementById('app-favicon');
            if (favicon) {
                favicon.href = this.appSettings.favicon;
            }
        }

        // تطبيق الاتجاه
        document.documentElement.setAttribute('dir', this.appSettings.direction);
        
        console.log('✅ تم تطبيق إعدادات التطبيق');
    }

    updateAppName() {
        const newName = document.getElementById('app-name-input').value;
        if (!newName.trim()) {
            showNotification('يرجى إدخال اسم التطبيق', 'error');
            return;
        }

        this.appSettings.appName = newName;
        this.saveAppSettings();
        this.applyAppSettings();
        showNotification('تم تحديث اسم التطبيق', 'success');
        
        // تسجيل النشاط
        if (window.currentUser) {
            logUserActivity(window.currentUser.id, 'update_app_name', `تحديث اسم التطبيق إلى: ${newName}`);
        }
    }

    updateAppDescription() {
        const newDesc = document.getElementById('app-desc-input').value;
        if (!newDesc.trim()) {
            showNotification('يرجى إدخال وصف التطبيق', 'error');
            return;
        }

        this.appSettings.appDescription = newDesc;
        this.saveAppSettings();
        this.applyAppSettings();
        showNotification('تم تحديث وصف التطبيق', 'success');
        
        // تسجيل النشاط
        if (window.currentUser) {
            logUserActivity(window.currentUser.id, 'update_app_description', `تحديث وصف التطبيق`);
        }
    }

    updatePrimaryColor() {
        const newColor = document.getElementById('primary-color').value;
        this.appSettings.primaryColor = newColor;
        this.saveAppSettings();
        this.applyAppSettings();
        showNotification('تم تحديث اللون الأساسي', 'success');
        
        // تسجيل النشاط
        if (window.currentUser) {
            logUserActivity(window.currentUser.id, 'update_primary_color', `تحديث اللون الأساسي إلى: ${newColor}`);
        }
    }

    updateBackgroundColor() {
        const newColor = document.getElementById('bg-color').value;
        this.appSettings.backgroundColor = newColor;
        this.saveAppSettings();
        this.applyAppSettings();
        showNotification('تم تحديث لون الخلفية', 'success');
        
        // تسجيل النشاط
        if (window.currentUser) {
            logUserActivity(window.currentUser.id, 'update_bg_color', `تحديث لون الخلفية إلى: ${newColor}`);
        }
    }

    previewLogo(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewImg = document.getElementById('logo-preview-img');
                const logoStatus = document.getElementById('logo-status');
                if (previewImg) previewImg.src = e.target.result;
                if (logoStatus) logoStatus.textContent = 'معاينة الشعار';
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    uploadLogo() {
        const input = document.getElementById('logo-upload');
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.appSettings.logo = e.target.result;
                this.saveAppSettings();
                this.applyAppSettings();
                showNotification('تم رفع الشعار بنجاح', 'success');
                
                // تسجيل النشاط
                if (window.currentUser) {
                    logUserActivity(window.currentUser.id, 'upload_logo', 'رفع شعار جديد للتطبيق');
                }
            };
            reader.readAsDataURL(input.files[0]);
        } else {
            showNotification('يرجى اختيار صورة للشعار', 'error');
        }
    }

    closeModal() {
        const modal = document.getElementById('specialty-modal');
        if (modal) {
            modal.remove();
        }
    }
}

// نظام إدارة المستخدمين المتقدم
class UserManagement {
    constructor() {
        this.users = this.loadUsers();
    }

    loadUsers() {
        const saved = localStorage.getItem('systemUsers');
        return saved ? JSON.parse(saved) : window.users || [];
    }

    saveUsers() {
        localStorage.setItem('systemUsers', JSON.stringify(this.users));
    }

    updateUserCredentials(userId, newEmail, newPassword) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            const oldEmail = this.users[userIndex].email;
            this.users[userIndex].email = newEmail;
            
            if (newPassword && newPassword.trim() !== '') {
                this.users[userIndex].password = newPassword;
            }
            
            this.saveUsers();
            
            // إذا كان المستخدم هو المدير الحالي، تحديث الجلسة
            if (window.currentUser && window.currentUser.id === userId) {
                window.currentUser.email = newEmail;
                if (newPassword && newPassword.trim() !== '') {
                    window.currentUser.password = newPassword;
                }
            }
            
            // تسجيل النشاط
            if (window.currentUser) {
                const action = newPassword ? 'update_credentials' : 'update_email';
                const description = newPassword ? 
                    `تحديث بيانات الدخول للمستخدم #${userId}` : 
                    `تحديث البريد الإلكتروني: ${oldEmail} → ${newEmail}`;
                
                logUserActivity(window.currentUser.id, action, description);
            }
            
            return true;
        }
        return false;
    }

    forcePasswordResetForAll() {
        this.users.forEach(user => {
            user.requiresPasswordChange = true;
        });
        this.saveUsers();
        showNotification('تم تفعيل إجبار تغيير كلمات المرور لجميع المستخدمين', 'success');
        
        // تسجيل النشاط
        if (window.currentUser) {
            logUserActivity(window.currentUser.id, 'force_password_reset', 'إجبار جميع المستخدمين على تغيير كلمات المرور');
        }
    }

    enableTwoFactorAuth() {
        this.users.forEach(user => {
            user.twoFactorEnabled = true;
        });
        this.saveUsers();
        showNotification('تم تفعيل المصادقة الثنائية لجميع المستخدمين', 'success');
        
        // تسجيل النشاط
        if (window.currentUser) {
            logUserActivity(window.currentUser.id, 'enable_2fa', 'تفعيل المصادقة الثنائية لجميع المستخدمين');
        }
    }

    disableTwoFactorAuth() {
        this.users.forEach(user => {
            user.twoFactorEnabled = false;
        });
        this.saveUsers();
        showNotification('تم إيقاف المصادقة الثنائية لجميع المستخدمين', 'success');
        
        // تسجيل النشاط
        if (window.currentUser) {
            logUserActivity(window.currentUser.id, 'disable_2fa', 'إيقاف المصادقة الثنائية لجميع المستخدمين');
        }
    }

    getUserById(userId) {
        return this.users.find(u => u.id === userId);
    }

    getUsersByRole(role) {
        return this.users.filter(u => u.role === role);
    }

    getOnlineUsers() {
        return this.users.filter(user => isUserOnline(user.id));
    }

    getUsersStatistics() {
        const total = this.users.length;
        const byRole = {};
        this.users.forEach(user => {
            byRole[user.role] = (byRole[user.role] || 0) + 1;
        });

        return {
            total,
            byRole,
            online: this.getOnlineUsers().length,
            with2FA: this.users.filter(u => u.twoFactorEnabled).length,
            needPasswordChange: this.users.filter(u => u.requiresPasswordChange).length
        };
    }
}

// إنشاء instance من نظام التحكم
const adminSystem = new AdminControlSystem();

// جعل النظام متاحاً globally
window.adminSystem = adminSystem;

// دالات عامة للتحكم
function showAddSpecialtyForm() {
    adminSystem.showAddSpecialtyForm();
}

function updateAppName() {
    adminSystem.updateAppName();
}

function updateAppDescription() {
    adminSystem.updateAppDescription();
}

function updatePrimaryColor() {
    adminSystem.updatePrimaryColor();
}

function updateBackgroundColor() {
    adminSystem.updateBackgroundColor();
}

function previewLogo(input) {
    adminSystem.previewLogo(input);
}

function uploadLogo() {
    adminSystem.uploadLogo();
}

// دالات الأمان
function enableTwoFactorAuth() {
    adminSystem.userManagement.enableTwoFactorAuth();
}

function disableTwoFactorAuth() {
    if (confirm('هل أنت متأكد من إيقاف المصادقة الثنائية لجميع المستخدمين؟')) {
        adminSystem.userManagement.disableTwoFactorAuth();
    }
}

function forcePasswordReset() {
    if (confirm('هل أنت متأكد من إجبار جميع المستخدمين على تغيير كلمات المرور؟')) {
        adminSystem.userManagement.forcePasswordResetForAll();
    }
}

function viewSessionReports() {
    const activities = getAllActivities(50);
    const reportHtml = `
        <div class="modal-overlay" id="sessions-modal">
            <div class="modal-content" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
                <h3>📊 تقرير الجلسات والنشاطات</h3>
                <div class="sessions-stats">
                    <div class="stat-card">
                        <h4>إجمالي النشاطات</h4>
                        <p>${activities.length}</p>
                    </div>
                    <div class="stat-card">
                        <h4>المستخدمون المتصلون</h4>
                        <p>${adminSystem.userManagement.getOnlineUsers().length}</p>
                    </div>
                </div>
                <div class="activities-list">
                    <h4>أحدث النشاطات</h4>
                    ${activities.map(activity => `
                        <div class="activity-item">
                            <div class="activity-header">
                                <strong>${getUserDisplayName(activity.userId)}</strong>
                                <span class="activity-time">${new Date(activity.timestamp).toLocaleString('ar-EG')}</span>
                            </div>
                            <div class="activity-description">${activity.description}</div>
                            <div class="activity-action">${activity.action}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="form-actions">
                    <button onclick="closeSessionsModal()" class="cancel-btn">إغلاق</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', reportHtml);
}

function closeSessionsModal() {
    const modal = document.getElementById('sessions-modal');
    if (modal) modal.remove();
}

function getUserDisplayName(userId) {
    const user = adminSystem.userManagement.getUserById(userId);
    return user ? user.name : `مستخدم #${userId}`;
}

// تحديث app.js لإضافة الدعم للنظام الجديد
// دالة مساعدة لعرض إدارة المستخدمين المحسنة
function loadAdminUsers() {
    const usersList = document.getElementById('admin-users-list');
    if (!usersList) return;
    
    const users = adminSystem.userManagement.users;
    
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

function showEditUserForm(userId) {
    const user = adminSystem.userManagement.getUserById(userId);
    if (!user) return;

    const formHtml = `
        <div class="modal-overlay" id="user-modal">
            <div class="modal-content">
                <h3>✏️ تعديل بيانات المستخدم</h3>
                <div class="form-group">
                    <label>الاسم:</label>
                    <input type="text" id="edit-user-name" value="${user.name}">
                </div>
                <div class="form-group">
                    <label>البريد الإلكتروني:</label>
                    <input type="email" id="edit-user-email" value="${user.email}">
                </div>
                <div class="form-group">
                    <label>الهاتف:</label>
                    <input type="tel" id="edit-user-phone" value="${user.phone || ''}">
                </div>
                <div class="form-group">
                    <label>الدور:</label>
                    <select id="edit-user-role">
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>مدير</option>
                        <option value="doctor" ${user.role === 'doctor' ? 'selected' : ''}>طبيب</option>
                        <option value="patient" ${user.role === 'patient' ? 'selected' : ''}>مريض</option>
                        <option value="accountant" ${user.role === 'accountant' ? 'selected' : ''}>محاسب</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button onclick="updateUserData(${userId})" class="add-btn">💾 حفظ</button>
                    <button onclick="closeUserModal()" class="cancel-btn">❌ إلغاء</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
}

function showSecurityForm(userId) {
    const user = adminSystem.userManagement.getUserById(userId);
    if (!user) return;

    const formHtml = `
        <div class="modal-overlay" id="security-modal">
            <div class="modal-content">
                <h3>🔒 إعدادات الأمان للمستخدم</h3>
                <div class="form-group">
                    <label>البريد الإلكتروني الجديد:</label>
                    <input type="email" id="security-user-email" value="${user.email}">
                </div>
                <div class="form-group">
                    <label>كلمة المرور الجديدة:</label>
                    <input type="password" id="security-user-password" placeholder="اتركه فارغاً للحفاظ على كلمة المرور الحالية">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="require-password-change" ${user.requiresPasswordChange ? 'checked' : ''}>
                        إجبار تغيير كلمة المرور في next login
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enable-2fa" ${user.twoFactorEnabled ? 'checked' : ''}>
                        تفعيل المصادقة الثنائية
                    </label>
                </div>
                <div class="form-actions">
                    <button onclick="updateUserSecurity(${userId})" class="security-btn">🔐 تحديث الأمان</button>
                    <button onclick="closeSecurityModal()" class="cancel-btn">❌ إلغاء</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
}

function updateUserSecurity(userId) {
    const newEmail = document.getElementById('security-user-email').value;
    const newPassword = document.getElementById('security-user-password').value;
    const requireChange = document.getElementById('require-password-change').checked;
    const enable2FA = document.getElementById('enable-2fa').checked;

    if (!newEmail) {
        showNotification('يرجى إدخال البريد الإلكتروني', 'error');
        return;
    }

    const success = adminSystem.userManagement.updateUserCredentials(
        userId, 
        newEmail, 
        newPassword
    );

    if (success) {
        const userIndex = adminSystem.userManagement.users.findIndex(u => u.id === userId);
        adminSystem.userManagement.users[userIndex].requiresPasswordChange = requireChange;
        adminSystem.userManagement.users[userIndex].twoFactorEnabled = enable2FA;
        adminSystem.userManagement.saveUsers();
        
        closeSecurityModal();
        loadAdminUsers();
        showNotification('تم تحديث إعدادات الأمان بنجاح', 'success');
    }
}

function updateUserData(userId) {
    const name = document.getElementById('edit-user-name').value;
    const email = document.getElementById('edit-user-email').value;
    const phone = document.getElementById('edit-user-phone').value;
    const role = document.getElementById('edit-user-role').value;

    if (!name || !email) {
        showNotification('يرجى ملء الحقول المطلوبة', 'error');
        return;
    }

    const userIndex = adminSystem.userManagement.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const oldData = { ...adminSystem.userManagement.users[userIndex] };
        adminSystem.userManagement.users[userIndex] = {
            ...adminSystem.userManagement.users[userIndex],
            name,
            email,
            phone,
            role
        };
        adminSystem.userManagement.saveUsers();
        
        closeUserModal();
        loadAdminUsers();
        showNotification('تم تحديث بيانات المستخدم بنجاح', 'success');
        
        // تسجيل النشاط
        if (window.currentUser) {
            logUserActivity(window.currentUser.id, 'update_user', `تحديث بيانات المستخدم: ${oldData.name} → ${name}`);
        }
    }
}

function viewUserActivity(userId) {
    const user = adminSystem.userManagement.getUserById(userId);
    if (!user) return;

    const activities = getUserActivities(userId, 20);
    const activityHtml = `
        <div class="modal-overlay" id="activity-modal">
            <div class="modal-content" style="max-width: 700px;">
                <h3>📊 نشاط المستخدم: ${user.name}</h3>
                <div class="user-info">
                    <p><strong>البريد:</strong> ${user.email}</p>
                    <p><strong>الدور:</strong> ${getRoleDisplayName(user.role)}</p>
                    <p><strong>الحالة:</strong> ${isUserOnline(user.id) ? '🟢 متصل' : '🔴 غير متصل'}</p>
                </div>
                <div class="activities-list">
                    <h4>أحدث النشاطات</h4>
                    ${activities.length > 0 ? activities.map(activity => `
                        <div class="activity-item">
                            <div class="activity-header">
                                <span class="activity-action">${activity.action}</span>
                                <span class="activity-time">${new Date(activity.timestamp).toLocaleString('ar-EG')}</span>
                            </div>
                            <div class="activity-description">${activity.description}</div>
                        </div>
                    `).join('') : '<p>لا توجد نشاطات مسجلة</p>'}
                </div>
                <div class="form-actions">
                    <button onclick="closeActivityModal()" class="cancel-btn">إغلاق</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', activityHtml);
}

function closeUserModal() {
    const modal = document.getElementById('user-modal');
    if (modal) modal.remove();
}

function closeSecurityModal() {
    const modal = document.getElementById('security-modal');
    if (modal) modal.remove();
}

function closeActivityModal() {
    const modal = document.getElementById('activity-modal');
    if (modal) modal.remove();
}

// إضافة أنماط CSS للعناصر الجديدة
const adminStyles = document.createElement('style');
adminStyles.textContent = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    
    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-content h3 {
        color: var(--secondary-color);
        margin-bottom: 20px;
        text-align: center;
    }
    
    .form-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 25px;
    }
    
    .cancel-btn {
        background: #95a5a6;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
    }
    
    .cancel-btn:hover {
        background: #7f8c8d;
    }
    
    .sessions-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .stat-card {
        background: var(--light-bg);
        padding: 15px;
        border-radius: 8px;
        text-align: center;
    }
    
    .stat-card h4 {
        color: var(--secondary-color);
        margin-bottom: 8px;
        font-size: 0.9em;
    }
    
    .stat-card p {
        font-size: 1.5em;
        font-weight: bold;
        color: var(--primary-color);
    }
    
    .activities-list {
        margin-top: 20px;
    }
    
    .activity-item {
        background: var(--light-bg);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 10px;
        border-right: 3px solid var(--primary-color);
    }
    
    .activity-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    
    .activity-action {
        background: var(--primary-color);
        color: white;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.8em;
    }
    
    .activity-time {
        color: #666;
        font-size: 0.8em;
    }
    
    .activity-description {
        color: var(--secondary-color);
    }
    
    .user-info {
        background: var(--light-bg);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
    }
    
    .user-info p {
        margin: 5px 0;
    }
    
    textarea {
        width: 100%;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 14px;
        font-family: inherit;
        resize: vertical;
    }
    
    textarea:focus {
        border-color: var(--primary-color);
        outline: none;
    }
`;
document.head.appendChild(adminStyles);

console.log('✅ نظام التحكم الإداري تم تحميله بنجاح');
