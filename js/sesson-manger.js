/**
 * نظام إدارة الجلسات والتهيئة التلقائية
 * ✅ إدارة جلسات المستخدمين
 * ✅ تتبع النشاطات والأمان
 * ✅ حفظ الإحصائيات والتقارير
 */

class SessionManager {
    constructor() {
        this.SESSION_KEYS = {
            CURRENT_USER: 'currentUser',
            THEME: 'appTheme',
            LANGUAGE: 'appLanguage',
            USER_ACTIVITIES: 'userActivities',
            APP_STATISTICS: 'appStatistics',
            ONLINE_USERS: 'onlineUsers',
            PAYMENT_METHODS: 'paymentMethods'
        };
        this.currentUser = null;
        this.init();
    }

    // تهيئة النظام
    init() {
        console.log('✅ نظام إدارة الجلسات جاهز');
        this.loadSessions();
    }

    // حفظ جلسة المستخدم
    saveUserSession(user) {
        try {
            const sessionData = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
                specialty: user.specialty,
                loginTime: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                sessionId: this.generateSessionId()
            };
            
            localStorage.setItem(this.SESSION_KEYS.CURRENT_USER, JSON.stringify(sessionData));
            this.addToOnlineUsers(user.id);
            console.log('✅ تم حفظ جلسة المستخدم بنجاح:', user.name);
            return true;
        } catch (error) {
            console.error('❌ خطأ في حفظ الجلسة:', error);
            return false;
        }
    }

    // استرجاع جلسة المستخدم
    loadUserSession() {
        try {
            const savedUser = localStorage.getItem(this.SESSION_KEYS.CURRENT_USER);
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                
                // التحقق من انتهاء الصلاحية (24 ساعة)
                const loginTime = new Date(userData.loginTime);
                const now = new Date();
                const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                
                if (hoursDiff > 24) {
                    this.clearUserSession();
                    console.log('🕒 انتهت صلاحية الجلسة');
                    return null;
                }
                
                // تحديث آخر نشاط
                userData.lastActivity = new Date().toISOString();
                localStorage.setItem(this.SESSION_KEYS.CURRENT_USER, JSON.stringify(userData));
                
                console.log('✅ تم تحميل جلسة المستخدم:', userData.name);
                return userData;
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل الجلسة:', error);
        }
        return null;
    }

    // مسح جلسة المستخدم
    clearUserSession() {
        try {
            const currentUser = this.loadUserSession();
            if (currentUser) {
                this.removeFromOnlineUsers(currentUser.id);
                this.logUserActivity(currentUser.id, 'logout', 'تسجيل خروج');
            }
            
            localStorage.removeItem(this.SESSION_KEYS.CURRENT_USER);
            console.log('✅ تم مسح جلسة المستخدم بنجاح');
            return true;
        } catch (error) {
            console.error('❌ خطأ في مسح الجلسة:', error);
            return false;
        }
    }

    // إنشاء معرف جلسة فريد
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // إضافة مستخدم إلى قائمة المتصلين
    addToOnlineUsers(userId) {
        try {
            const onlineUsers = JSON.parse(localStorage.getItem(this.SESSION_KEYS.ONLINE_USERS) || '[]');
            if (!onlineUsers.includes(userId)) {
                onlineUsers.push(userId);
                localStorage.setItem(this.SESSION_KEYS.ONLINE_USERS, JSON.stringify(onlineUsers));
            }
        } catch (error) {
            console.error('خطأ في إضافة مستخدم للمتصلين:', error);
        }
    }

    // إزالة مستخدم من قائمة المتصلين
    removeFromOnlineUsers(userId) {
        try {
            const onlineUsers = JSON.parse(localStorage.getItem(this.SESSION_KEYS.ONLINE_USERS) || '[]');
            const updatedUsers = onlineUsers.filter(id => id !== userId);
            localStorage.setItem(this.SESSION_KEYS.ONLINE_USERS, JSON.stringify(updatedUsers));
        } catch (error) {
            console.error('خطأ في إزالة مستخدم من المتصلين:', error);
        }
    }

    // التحقق إذا كان المستخدم متصل
    isUserOnline(userId) {
        try {
            const onlineUsers = JSON.parse(localStorage.getItem(this.SESSION_KEYS.ONLINE_USERS) || '[]');
            return onlineUsers.includes(userId);
        } catch (error) {
            console.error('خطأ في التحقق من حالة الاتصال:', error);
            return false;
        }
    }

    // تسجيل نشاط المستخدم
    logUserActivity(userId, action, description) {
        try {
            const activity = {
                userId: userId,
                action: action,
                description: description,
                timestamp: new Date().toISOString(),
                ip: '127.0.0.1',
                userAgent: navigator.userAgent
            };
            
            const activities = JSON.parse(localStorage.getItem(this.SESSION_KEYS.USER_ACTIVITIES) || '[]');
            activities.push(activity);
            
            // حفظ آخر 500 نشاط فقط
            const recentActivities = activities.slice(-500);
            localStorage.setItem(this.SESSION_KEYS.USER_ACTIVITIES, JSON.stringify(recentActivities));
            
            console.log('📝 تم تسجيل النشاط:', description);
        } catch (error) {
            console.error('❌ خطأ في تسجيل النشاط:', error);
        }
    }

    // الحصول على نشاط المستخدم
    getUserActivities(userId, limit = 50) {
        try {
            const activities = JSON.parse(localStorage.getItem(this.SESSION_KEYS.USER_ACTIVITIES) || '[]');
            const userActivities = activities.filter(activity => activity.userId === userId);
            return userActivities.slice(-limit).reverse();
        } catch (error) {
            console.error('❌ خطأ في جلب نشاط المستخدم:', error);
            return [];
        }
    }

    // الحصول على جميع النشاطات
    getAllActivities(limit = 100) {
        try {
            const activities = JSON.parse(localStorage.getItem(this.SESSION_KEYS.USER_ACTIVITIES) || '[]');
            return activities.slice(-limit).reverse();
        } catch (error) {
            console.error('❌ خطأ في جلب النشاطات:', error);
            return [];
        }
    }

    // حفظ إحصائيات التطبيق
    saveAppStatistics(stats) {
        try {
            localStorage.setItem(this.SESSION_KEYS.APP_STATISTICS, JSON.stringify({
                ...stats,
                lastUpdate: new Date().toISOString()
            }));
            return true;
        } catch (error) {
            console.error('❌ خطأ في حفظ الإحصائيات:', error);
            return false;
        }
    }

    // تحميل إحصائيات التطبيق
    loadAppStatistics() {
        try {
            const stats = localStorage.getItem(this.SESSION_KEYS.APP_STATISTICS);
            return stats ? JSON.parse(stats) : {
                totalUsers: 0,
                totalDoctors: 0,
                totalPatients: 0,
                totalAppointments: 0,
                monthlyRevenue: 0,
                activeUsers: 0
            };
        } catch (error) {
            console.error('❌ خطأ في تحميل الإحصائيات:', error);
            return null;
        }
    }

    // تحديث إحصائيات الجلسات
    updateSessionStats() {
        const stats = this.loadAppStatistics();
        
        stats.totalSessions = (stats.totalSessions || 0) + 1;
        stats.activeSessions = JSON.parse(localStorage.getItem(this.SESSION_KEYS.ONLINE_USERS) || '[]').length;
        stats.lastUpdate = new Date().toISOString();
        
        this.saveAppStatistics(stats);
        return stats;
    }

    // التحقق من صحة الجلسة
    validateSession() {
        const savedUser = this.loadUserSession();
        if (!savedUser) return false;

        // التحقق من أن المستخدم لا يزال موجوداً في النظام
        const currentUsers = window.users || [];
        const userExists = currentUsers.find(u => u.id === savedUser.id && u.email === savedUser.email);
        
        if (!userExists) {
            this.clearUserSession();
            return false;
        }
        
        return true;
    }

    // الحصول على معلومات الجلسة الحالية
    getSessionInfo() {
        const session = this.loadUserSession();
        if (!session) return null;

        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const sessionDuration = Math.floor((now - loginTime) / (1000 * 60));

        return {
            user: session,
            sessionId: session.sessionId,
            duration: sessionDuration,
            isExpired: sessionDuration > 1440
        };
    }

    // إدارة طرق الدفع
    getPaymentMethods() {
        try {
            const methods = localStorage.getItem(this.SESSION_KEYS.PAYMENT_METHODS);
            return methods ? JSON.parse(methods) : [
                { id: 1, name: 'الدفع نقداً', enabled: true, description: 'الدفع المباشر في العيادة' },
                { id: 2, name: 'بطاقة ائتمان', enabled: true, description: 'الدفع ببطاقات الائتمان' },
                { id: 3, name: 'تحويل بنكي', enabled: true, description: 'التحويل البنكي المباشر' },
                { id: 4, name: 'محفظة إلكترونية', enabled: false, description: 'الدفع عبر المحافظ الإلكترونية' }
            ];
        } catch (error) {
            console.error('❌ خطأ في تحميل طرق الدفع:', error);
            return [];
        }
    }

    savePaymentMethods(methods) {
        try {
            localStorage.setItem(this.SESSION_KEYS.PAYMENT_METHODS, JSON.stringify(methods));
            console.log('✅ تم حفظ طرق الدفع بنجاح');
            return true;
        } catch (error) {
            console.error('❌ خطأ في حفظ طرق الدفع:', error);
            return false;
        }
    }

    // تحديث إحصائيات المستخدمين
    updateUserStatistics() {
        const users = window.users || [];
        const stats = this.loadAppStatistics();
        
        stats.totalUsers = users.length;
        stats.totalDoctors = users.filter(u => u.role === 'doctor').length;
        stats.totalPatients = users.filter(u => u.role === 'patient').length;
        stats.totalAppointments = window.appData?.appointments?.length || 0;
        stats.monthlyRevenue = this.calculateMonthlyRevenue();
        stats.activeUsers = JSON.parse(localStorage.getItem(this.SESSION_KEYS.ONLINE_USERS) || '[]').length;
        
        this.saveAppStatistics(stats);
        return stats;
    }

    // حساب الإيرادات الشهرية
    calculateMonthlyRevenue() {
        const transactions = window.appData?.transactions || [];
        const currentMonth = new Date().toISOString().substr(0, 7); // YYYY-MM
        
        return transactions
            .filter(t => t.date && t.date.startsWith(currentMonth) && t.type === 'دخل' && t.status === 'مكتمل')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
    }

    // إنهاء جميع الجلسات
    terminateAllSessions() {
        try {
            localStorage.removeItem(this.SESSION_KEYS.CURRENT_USER);
            localStorage.removeItem(this.SESSION_KEYS.ONLINE_USERS);
            console.log('✅ تم إنهاء جميع الجلسات');
            return true;
        } catch (error) {
            console.error('❌ خطأ في إنهاء الجلسات:', error);
            return false;
        }
    }

    // تحميل الجلسات
    loadSessions() {
        try {
            const sessions = {
                currentUser: this.loadUserSession(),
                paymentMethods: this.getPaymentMethods(),
                statistics: this.loadAppStatistics(),
                onlineUsers: JSON.parse(localStorage.getItem(this.SESSION_KEYS.ONLINE_USERS) || '[]')
            };
            
            console.log('📊 حالة النظام:', {
                usersOnline: sessions.onlineUsers.length,
                currentUser: sessions.currentUser?.name,
                paymentMethods: sessions.paymentMethods.length
            });
            
            return sessions;
        } catch (error) {
            console.error('❌ خطأ في تحميل الجلسات:', error);
            return {};
        }
    }
}

// إنشاء instance من مدير الجلسات
const sessionManager = new SessionManager();

// دالات عامة للوصول من الملفات الأخرى
function saveUserSession(user) {
    return sessionManager.saveUserSession(user);
}

function loadUserSession() {
    return sessionManager.loadUserSession();
}

function clearUserSession() {
    return sessionManager.clearUserSession();
}

function validateUserSession() {
    return sessionManager.validateSession();
}

function logUserActivity(userId, action, description) {
    return sessionManager.logUserActivity(userId, action, description);
}

function getUserActivities(userId, limit = 50) {
    return sessionManager.getUserActivities(userId, limit);
}

function getAllActivities(limit = 100) {
    return sessionManager.getAllActivities(limit);
}

function isUserOnline(userId) {
    return sessionManager.isUserOnline(userId);
}

function getPaymentMethods() {
    return sessionManager.getPaymentMethods();
}

function savePaymentMethods(methods) {
    return sessionManager.savePaymentMethods(methods);
}

function updateUserStatistics() {
    return sessionManager.updateUserStatistics();
}

// جعل المدير متاحاً globally
window.sessionManager = sessionManager;

console.log('✅ نظام إدارة الجلسات تم تحميله بنجاح');
