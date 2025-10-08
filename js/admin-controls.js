/**
 * نظام التحكم المتقدم للمدير
 * ✅ إدارة المستخدمين والتخصصات
 * ✅ التحكم في المظهر والإعدادات
 * ✅ إدارة طرق الدفع والمالية
 * ✅ نظام التقارير والإحصائيات
 */

// دوال مساعدة أساسية
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function logUserActivity(userId, action, description) {
    console.log('📝 نشاط المستخدم:', { userId, action, description });
    if (window.sessionManager) {
        window.sessionManager.logUserActivity(userId, action, description);
    }
}

function getAllActivities(limit = 50) {
    if (window.sessionManager) {
        return window.sessionManager.getAllActivities(limit);
    }
    return [];
}

function getUserActivities(userId, limit = 20) {
    if (window.sessionManager) {
        return window.sessionManager.getUserActivities(userId, limit);
    }
    return [];
}

function isUserOnline(userId) {
    if (window.sessionManager) {
        return window.sessionManager.isUserOnline(userId);
    }
    return false;
}

function getRoleDisplayName(role) {
    const roleNames = {
        'admin': 'مدير النظام',
        'doctor': 'طبيب',
        'patient': 'مريض',
        'accountant': 'محاسب'
    };
    return roleNames[role] || role;
}

// بيانات المستخدمين الأساسية
if (!window.users) {
    window.users = JSON.parse(localStorage.getItem('systemUsers')) || [
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
        }
    ];
}

window.currentUser = null;

/**
 * نظام التحكم المتقدم للمدير
 */
class AdminControlSystem {
    constructor() {
        this.specialties = [];
        this.paymentMethods = [];
        this.appSettings = this.loadAppSettings();
        this.userManagement = new UserManagement();
        this.init();
    }

    init() {
        this.loadSpecialties();
        this.loadPaymentMethods();
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

    // إدارة طرق الدفع
    loadPaymentMethods() {
        this.paymentMethods = getPaymentMethods();
        this.renderPaymentMethods();
    }

    renderPaymentMethods() {
        const container = document.getElementById('payment-methods-list');
        if (!container) return;

        container.innerHTML = this.paymentMethods.map(method => `
            <div class="payment-method-card ${method.enabled ? 'enabled' : 'disabled'}">
                <div class="payment-method-header">
                    <h4>${method.name}</h4>
                    <label class="switch">
                        <input type="checkbox" ${method.enabled ? 'checked' : ''} 
                               onchange="adminSystem.togglePaymentMethod(${method.id}, this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                <p class="payment-description">${method.description}</p>
                <div class="payment-actions">
                    <button class="action-btn" onclick="adminSystem.editPaymentMethod(${method.id})">✏️ تعديل</button>
                    <button class="action-btn delete" onclick="adminSystem.deletePaymentMethod(${method.id})">🗑️ حذف</button>
                </div>
            </div>
        `).join('');

        // تحديث الإحصائيات
        this.updatePaymentStats();
    }

    togglePaymentMethod(methodId, enabled) {
        const method = this.paymentMethods.find(m => m.id === methodId);
        if (method) {
            method.enabled = enabled;
            this.savePaymentMethods();
            this.renderPaymentMethods();
            showNotification(`تم ${enabled ? 'تفعيل' : 'إيقاف'} ${method.name}`, 'success');
            
            if (window.currentUser) {
                logUserActivity(window.currentUser.id, 'toggle_payment', 
                    `${enabled ? 'تفعيل' : 'إيقاف'} طريقة الدفع: ${method.name}`);
            }
        }
    }

    showAddPaymentMethodForm() {
        const formHtml = `
            <div class="modal-overlay" id="payment-modal">
                <div class="modal-content">
                    <h3>➕ إضافة طريقة دفع جديدة</h3>
                    <div class="form-group">
                        <label>اسم طريقة الدفع:</label>
                        <input type="text" id="new-payment-name" placeholder="أدخل اسم طريقة الدفع">
                    </div>
                    <div class="form-group">
                        <label>وصف الطريقة:</label>
                        <textarea id="new-payment-description" placeholder="أدخل وصف طريقة الدفع" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="new-payment-enabled" checked>
                            مفعلة مباشرة
                        </label>
                    </div>
                    <div class="form-actions">
                        <button onclick="adminSystem.addPaymentMethod()" class="add-btn">💾 حفظ</button>
                        <button onclick="adminSystem.closeModal()" class="cancel-btn">❌ إلغاء</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
    }

    addPaymentMethod() {
        const name = document.getElementById('new-payment-name').value;
        const description = document.getElementById('new-payment-description').value;
        const enabled = document.getElementById('new-payment-enabled').checked;

        if (!name || !description) {
            showNotification('يرجى ملء جميع الحقول', 'error');
            return;
        }

        const newMethod = {
            id: Date.now(),
            name: name,
            description: description,
            enabled: enabled
        };

        this.paymentMethods.push(newMethod);
        this.savePaymentMethods();
        this.renderPaymentMethods();
        this.closeModal();
        showNotification('تم إضافة طريقة الدفع بنجاح', 'success');
        
        if (window.currentUser) {
            logUserActivity(window.currentUser.id, 'add_payment', `إضافة طريقة دفع جديدة: ${name}`);
        }
    }

    editPaymentMethod(methodId) {
        const method = this.paymentMethods.find(m => m.id === methodId);
        if (!method) return;

        const formHtml = `
            <div class="modal-overlay" id="payment-modal">
                <div class="modal-content">
                    <h3>✏️ تعديل طريقة الدفع</h3>
                    <div class="form-group">
                        <label>اسم طريقة الدفع:</label>
                        <input type="text" id="edit-payment-name" value="${method.name}">
                    </div>
                    <div class="form-group">
                        <label>وصف الطريقة:</label>
                        <textarea id="edit-payment-description" rows="3">${method.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="edit-payment-enabled" ${method.enabled ? 'checked' : ''}>
                            مفعلة
                        </label>
                    </div>
                    <div class="form-actions">
                        <button onclick="adminSystem.updatePaymentMethod(${methodId})" class="add-btn">💾 حفظ</button>
                        <button onclick="adminSystem.closeModal()" class="cancel-btn">❌ إلغاء</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
    }

    updatePaymentMethod(methodId) {
        const name = document.getElementById('edit-payment-name').value;
        const description = document.getElementById('edit-payment-description').value;
        const enabled = document.getElementById('edit-payment-enabled').checked;

        if (!name || !description) {
            showNotification('يرجى ملء جميع الحقول', 'error');
            return;
        }

        const methodIndex = this.paymentMethods.findIndex(m => m.id === methodId);
        if (methodIndex !== -1) {
            this.paymentMethods[methodIndex] = {
                ...this.paymentMethods[methodIndex],
                name,
                description,
                enabled
            };
            this.savePaymentMethods();
            this.renderPaymentMethods();
            this.closeModal();
            showNotification('تم تحديث طريقة الدفع بنجاح', 'success');
            
            if (window.currentUser) {
                logUserActivity(window.currentUser.id, 'update_payment', `تحديث طريقة الدفع: ${name}`);
            }
        }
    }

    deletePaymentMethod(methodId) {
        const method = this.paymentMethods.find(m => m.id === methodId);
        if (!method) return;

        if (confirm(`هل أنت متأكد من حذف طريقة الدفع "${method.name}"؟`)) {
            this.paymentMethods = this.paymentMethods.filter(m => m.id !== methodId);
            this.savePaymentMethods();
            this.renderPaymentMethods();
            showNotification('تم حذف طريقة الدفع بنجاح', 'success');
            
            if (window.currentUser) {
                logUserActivity(window.currentUser.id, 'delete_payment', `حذف طريقة الدفع: ${method.name}`);
            }
        }
    }

    savePaymentMethods() {
        savePaymentMethods(this.paymentMethods);
    }

    updatePaymentStats() {
        const activeMethods = this.paymentMethods.filter(m => m.enabled).length;
        const totalTransactions = window.appData?.transactions?.length || 0;
        
        document.getElementById('active-payment-methods').textContent = activeMethods;
        document.getElementById('total-transactions').textContent = totalTransactions;
    }

    // تحديث إحصائيات المدير
    updateAdminStats() {
        const stats = updateUserStatistics();
        
        document.getElementById('total-users').textContent = stats.totalUsers;
        document.getElementById('total-doctors').textContent = stats.totalDoctors;
        document.getElementById('today-appointments').textContent = stats.totalAppointments;
        document.getElementById('monthly-revenue').textContent = stats.monthlyRevenue.toLocaleString() + ' ريال';
        
        // تحديث النسب المئوية (محاكاة)
        document.getElementById('users-change').textContent = `+${Math.floor(Math.random() * 10)} هذا الشهر`;
        document.getElementById('doctors-change').textContent = `+${Math.floor(Math.random() * 5)} هذا الشهر`;
        document.getElementById('appointments-change').textContent = `${Math.floor(Math.random() * 30) + 70}% إشغال`;
        document.getElementById('revenue-change').textContent = `+${Math.floor(Math.random() * 20)}% عن الشهر الماضي`;
    }

    // باقي دوال النظام تبقى كما هي
    saveSpecialties() {
        localStorage.setItem('medicalSpecialties', JSON.stringify(this.specialties));
    }

    closeModal() {
        const modal = document.getElementById('specialty-modal') || document.getElementById('payment-modal');
        if (modal) {
            modal.remove();
        }
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

    applyAppSettings() {
        // تطبيق إعدادات التطبيق
        const appTitle = document.getElementById('app-title');
        const appName = document.getElementById('app-name');
        
        if (appTitle) appTitle.textContent = this.appSettings.appName;
        if (appName) appName.textContent = this.appSettings.appName;

        // تطبيق الألوان
        document.documentElement.style.setProperty('--primary-color', this.appSettings.primaryColor);
        document.documentElement.style.setProperty('--bg-color', this.appSettings.backgroundColor);
    }
}

/**
 * نظام إدارة المستخدمين المتقدم
 */
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
        window.users = this.users;
    }

    // دوال إدارة المستخدمين تبقى كما هي
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

    // دوال الأمان والإدارة تبقى كما هي
    forcePasswordResetForAll() {
        this.users.forEach(user => {
            user.requiresPasswordChange = true;
        });
        this.saveUsers();
        showNotification('تم تفعيل إجبار تغيير كلمات المرور لجميع المستخدمين', 'success');
        
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
        
        if (window.currentUser) {
            logUserActivity(window.currentUser.id, 'enable_2fa', 'تفعيل المصادقة الثنائية لجميع المستخدمين');
        }
    }

    getUsersByRole(role) {
        return this.users.filter(u => u.role === role);
    }

    getOnlineUsers() {
        return this.users.filter(user => isUserOnline(user.id));
    }
}

// إنشاء instance من نظام التحكم
const adminSystem = new AdminControlSystem();

// جعل النظام متاحاً globally
window.adminSystem = adminSystem;

// دوال عامة للتحكم
function showAddSpecialtyForm() {
    adminSystem.showAddSpecialtyForm();
}

function showAddPaymentMethodForm() {
    adminSystem.showAddPaymentMethodForm();
}

function updateAdminStats() {
    adminSystem.updateAdminStats();
}

// دوال الأمان
function enableTwoFactorAuth() {
    adminSystem.userManagement.enableTwoFactorAuth();
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
    const user = adminSystem.userManagement.users.find(u => u.id === userId);
    return user ? user.name : `مستخدم #${userId}`;
}

// إضافة أنماط CSS للعناصر الجديدة
const adminStyles = document.createElement('style');
adminStyles.textContent = `
    .payment-methods-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 20px;
        margin-top: 20px;
    }
    
    .payment-methods-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 15px;
    }
    
    .payment-method-card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #e0e0e0;
        transition: all 0.3s ease;
    }
    
    .payment-method-card.enabled {
        border-color: #27ae60;
        background: #f8fff9;
    }
    
    .payment-method-card.disabled {
        border-color: #bdc3c7;
        background: #f8f9fa;
        opacity: 0.7;
    }
    
    .payment-method-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .payment-method-header h4 {
        margin: 0;
        color: #2c3e50;
    }
    
    .payment-description {
        color: #666;
        margin-bottom: 15px;
        line-height: 1.4;
    }
    
    .payment-actions {
        display: flex;
        gap: 10px;
    }
    
    .payment-stats {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .payment-stats .stat-card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        border: 2px solid #3498db;
    }
    
    .payment-stats .stat-card h4 {
        margin-bottom: 10px;
        color: #2c3e50;
    }
    
    .payment-stats .stat-number {
        font-size: 2em;
        font-weight: bold;
        color: #3498db;
        margin: 0;
    }
    
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
document.head.appendChild(adminStyles);

console.log('✅ نظام التحكم الإداري تم تحميله بنجاح');
