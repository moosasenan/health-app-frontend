// نظام الذكاء الاصطناعي المتكامل للتطبيق الطبي
class AISystem {
    constructor() {
        this.isTrained = false;
        this.learningRate = 0.1;
        this.patterns = {};
        this.anomalies = [];
        this.systemHealth = 100;
        this.conversationHistory = [];
    }

    // تدريب النظام الذكي
    async trainSystem() {
        showNotification('🧠 جاري تدريب النظام الذكي...', 'info');
        
        try {
            // محاكاة عملية التدريب
            await this.simulateTraining();
            
            this.isTrained = true;
            this.systemHealth = 100;
            
            showNotification('✅ تم تدريب النظام الذكي بنجاح!', 'success');
            this.updateAIDashboard();
            
        } catch (error) {
            showNotification('❌ فشل في تدريب النظام', 'error');
            console.error('Training error:', error);
        }
    }

    async simulateTraining() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // تعلم الأنماط الأساسية
                this.patterns = {
                    transaction: this.learnTransactionPatterns(),
                    user: this.learnUserPatterns(),
                    medical: this.learnMedicalPatterns(),
                    financial: this.learnFinancialPatterns()
                };
                resolve();
            }, 3000);
        });
    }

    learnTransactionPatterns() {
        return {
            normalHours: ['09:00-12:00', '16:00-20:00'],
            peakHours: ['10:00-11:00', '17:00-19:00'],
            averageAmount: 150,
            commonCategories: ['كشف طبي', 'تحاليل', 'أشعة']
        };
    }

    learnUserPatterns() {
        return {
            activeHours: ['08:00-12:00', '16:00-21:00'],
            commonActions: ['حجز موعد', 'استشارة', 'دفع'],
            averageSession: 8 // دقائق
        };
    }

    learnMedicalPatterns() {
        return {
            commonSymptoms: ['صداع', 'ألم بطني', 'حرارة', 'سعال'],
            emergencyKeywords: ['نزيف', 'ألم صدر', 'ضيق تنفس', 'فقدان وعي'],
            specialistMapping: {
                'باطنية': ['حرارة', 'ألم بطني', 'غثيان'],
                'قلب': ['ألم صدر', 'خفقان', 'ضيق تنفس'],
                'عظام': ['ألم مفاصل', 'كسر', 'التهاب']
            }
        };
    }

    learnFinancialPatterns() {
        return {
            revenueTrends: {
                weekly: [120000, 135000, 128000, 142000],
                monthlyGrowth: 0.15,
                seasonalFactors: [1.1, 1.0, 0.9, 1.2]
            },
            expensePatterns: {
                fixed: ['رواتب', 'إيجار', 'مرافق'],
                variable: ['مستلزمات', 'صيانة', 'تطوير']
            }
        };
    }

    // فحص النظام الآلي
    async runSystemDiagnosis() {
        showNotification('🔍 جاري فحص النظام الذكي...', 'info');

        const diagnosis = {
            health: this.systemHealth,
            issues: [],
            recommendations: [],
            performance: {}
        };

        // فحص قاعدة البيانات
        const dbHealth = await this.checkDatabaseHealth();
        diagnosis.performance.database = dbHealth;

        // فحص الأمان
        const securityHealth = await this.checkSecurityHealth();
        diagnosis.performance.security = securityHealth;

        // فحص الأداء
        const performanceHealth = await this.checkPerformanceHealth();
        diagnosis.performance.system = performanceHealth;

        // اكتشاف المشاكل
        diagnosis.issues = await this.detectIssues();
        diagnosis.recommendations = this.generateRecommendations(diagnosis.issues);

        this.displayDiagnosisResults(diagnosis);
        return diagnosis;
    }

    async checkDatabaseHealth() {
        // محاكاة فحص قاعدة البيانات
        return {
            status: 'healthy',
            responseTime: '45ms',
            connections: 24,
            issues: []
        };
    }

    async checkSecurityHealth() {
        const users = window.users || [];
        const weakPasswords = users.filter(u => u.password && u.password.length < 8);
        
        return {
            status: weakPasswords.length > 0 ? 'warning' : 'healthy',
            weakPasswords: weakPasswords.length,
            lastSecurityScan: new Date().toISOString(),
            recommendations: weakPasswords.length > 0 ? 
                [`يوجد ${weakPasswords.length} مستخدم بكلمة مرور ضعيفة`] : []
        };
    }

    async checkPerformanceHealth() {
        return {
            status: 'healthy',
            loadTime: '1.2s',
            memoryUsage: '45%',
            activeUsers: 15
        };
    }

    async detectIssues() {
        const issues = [];

        // اكتشاف المعاملات غير الطبيعية
        const anomalousTransactions = this.detectTransactionAnomalies();
        if (anomalousTransactions.length > 0) {
            issues.push({
                type: 'financial_anomaly',
                severity: 'medium',
                message: `تم اكتشاف ${anomalousTransactions.length} معاملة غير طبيعية`,
                data: anomalousTransactions
            });
        }

        // اكتشاف مشاكل في النظام
        const systemIssues = this.detectSystemIssues();
        issues.push(...systemIssues);

        return issues;
    }

    detectTransactionAnomalies() {
        const anomalies = [];
        const transactions = window.appData?.transactions || [];
        
        transactions.forEach(transaction => {
            if (transaction.amount > 1000) { // مثال لاكتشاف المبالغ الكبيرة
                anomalies.push({
                    id: transaction.id,
                    amount: transaction.amount,
                    reason: 'مبلغ كبير غير معتاد',
                    risk: 'medium'
                });
            }
        });

        return anomalies;
    }

    detectSystemIssues() {
        const issues = [];
        
        // محاكاة اكتشاف المشاكل
        if (this.systemHealth < 80) {
            issues.push({
                type: 'system_performance',
                severity: 'high',
                message: 'أداء النظام منخفض',
                recommendation: 'تحقق من استخدام الذاكرة والمساحة'
            });
        }

        return issues;
    }

    generateRecommendations(issues) {
        const recommendations = [];
        
        issues.forEach(issue => {
            switch(issue.type) {
                case 'financial_anomaly':
                    recommendations.push('مراجعة المعاملات الكبيرة يدوياً');
                    break;
                case 'system_performance':
                    recommendations.push('تحسين أداء النظام وإعادة تشغيل الخدمات');
                    break;
                default:
                    recommendations.push('مراجعة النظام بشكل دوري');
            }
        });

        return recommendations.length > 0 ? recommendations : ['النظام يعمل بشكل ممتاز'];
    }

    // التحليل الذكي للمعاملات
    async aiAnalyzeTransactions() {
        showNotification('🤖 جاري التحليل الذكي للمعاملات...', 'info');

        const analysis = {
            summary: {},
            anomalies: [],
            predictions: [],
            recommendations: []
        };

        const transactions = window.appData?.transactions || [];

        if (transactions.length === 0) {
            analysis.summary.message = 'لا توجد معاملات للتحليل';
            this.displayTransactionAnalysis(analysis);
            return;
        }

        // تحليل الإيرادات
        analysis.summary.totalRevenue = transactions
            .filter(t => t.type === 'دخل' && t.status === 'مكتمل')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        analysis.summary.averageTransaction = analysis.summary.totalRevenue / transactions.length;
        analysis.summary.transactionCount = transactions.length;

        // اكتشاف الأنماط
        analysis.anomalies = this.detectTransactionAnomalies();
        
        // التنبؤ بالإيرادات
        analysis.predictions = this.predictRevenue(transactions);
        
        // التوصيات
        analysis.recommendations = this.generateFinancialRecommendations(analysis);

        this.displayTransactionAnalysis(analysis);
        showNotification('✅ تم التحليل الذكي للمعاملات', 'success');
    }

    predictRevenue(transactions) {
        const monthlyRevenue = {};
        
        transactions.forEach(transaction => {
            if (transaction.date) {
                const month = transaction.date.substr(0, 7); // YYYY-MM
                monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (transaction.amount || 0);
            }
        });

        const monthlyValues = Object.values(monthlyRevenue);
        const averageMonthly = monthlyValues.length > 0 ? 
            monthlyValues.reduce((a, b) => a + b, 0) / monthlyValues.length : 0;

        const prediction = {
            nextMonth: Math.round(averageMonthly * 1.1), // نمو 10%
            confidence: monthlyValues.length > 3 ? 0.85 : 0.65,
            trend: monthlyValues.length > 1 && monthlyValues[monthlyValues.length - 1] > monthlyValues[0] ? 'تصاعدي' : 'مستقر'
        };

        return [prediction];
    }

    generateFinancialRecommendations(analysis) {
        const recommendations = [];
        
        if (analysis.anomalies.length > 0) {
            recommendations.push('مراجعة المعاملات غير الطبيعية مع فريق المحاسبة');
        }
        
        if (analysis.summary.averageTransaction < 100) {
            recommendations.push('دراسة زيادة رسوم الخدمات لتحسين الإيرادات');
        }
        
        if (analysis.predictions[0]?.trend === 'تصاعدي') {
            recommendations.push('الاستعداد لموجة زيادة الطلب في الشهر القادم');
        }

        return recommendations.length > 0 ? recommendations : ['الأداء المالي ممتاز، حافظ على الاستراتيجية الحالية'];
    }

    // المساعد الذكي للمحاسبة
    async handleAccountingQuery(query) {
        // حفظ السؤال في السجل
        this.conversationHistory.push({
            type: 'user',
            message: query,
            timestamp: new Date().toISOString()
        });

        const responses = {
            'تحقق': await this.verifyTransactions(),
            'أخطاء': await this.findAccountingErrors(),
            'توقعات': await this.generateRevenuePredictions(),
            'تقارير': await this.suggestReports(),
            'مساعدة': 'يمكنني مساعدتك في: التحقق من المعاملات، اكتشاف الأخطاء، توقعات الإيرادات، وإنشاء التقارير.',
            'default': 'أهلاً! أنا المساعد الذكي للمحاسبة. يمكنني مساعدتك في تحليل المعاملات المالية واكتشاف الأنماط وتقديم التوصيات.'
        };

        const responseKey = this.extractIntent(query);
        const response = responses[responseKey] || responses['default'];

        // حفظ الرد في السجل
        this.conversationHistory.push({
            type: 'ai',
            message: response,
            timestamp: new Date().toISOString()
        });

        return response;
    }

    extractIntent(query) {
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes('تحقق') || lowerQuery.includes('تأكد')) return 'تحقق';
        if (lowerQuery.includes('خطأ') || lowerQuery.includes('مشكلة')) return 'أخطاء';
        if (lowerQuery.includes('توقع') || lowerQuery.includes('تنبأ')) return 'توقعات';
        if (lowerQuery.includes('تقرير') || lowerQuery.includes('تقرير')) return 'تقارير';
        if (lowerQuery.includes('مساعدة') || lowerQuery.includes('مساعدة')) return 'مساعدة';
        
        return 'default';
    }

    async verifyTransactions() {
        const transactions = window.appData?.transactions || [];
        const verified = transactions.filter(t => t.status === 'مكتمل').length;
        const pending = transactions.filter(t => t.status === 'معلق').length;
        const total = transactions.length;
        
        return `📊 تقرير التحقق:\n✅ ${verified} معاملة مؤكدة\n⏳ ${pending} قيد الانتظار\n📋 إجمالي ${total} معاملة\n\n${pending > 0 ? 'يوجد معاملات تحتاج مراجعة' : 'جميع المعاملات مؤكدة'}`;
    }

    async findAccountingErrors() {
        const transactions = window.appData?.transactions || [];
        const errors = transactions.filter(t => !t.amount || t.amount <= 0);
        
        if (errors.length > 0) {
            return `⚠️ تم اكتشاف ${errors.length} معاملة بها أخطاء:\n${errors.map(e => `• المعاملة ${e.id}: ${e.description}`).join('\n')}`;
        } else {
            return '✅ لم يتم اكتشاف أخطاء في المعاملات';
        }
    }

    async generateRevenuePredictions() {
        const transactions = window.appData?.transactions || [];
        const monthlyRevenue = this.predictRevenue(transactions)[0];
        
        return `📈 توقعات الإيرادات:\n• الشهر القادم: ${monthlyRevenue.nextMonth.toLocaleString()} ريال\n• الثقة: ${Math.round(monthlyRevenue.confidence * 100)}%\n• الاتجاه: ${monthlyRevenue.trend}\n\n💡 نصيحة: ${monthlyRevenue.trend === 'تصاعدي' ? 'استعد لزيادة الطلب' : 'حافظ على الأداء الحالي'}`;
    }

    async suggestReports() {
        return `📋 التقارير المقترحة:\n\n1. تقرير الإيرادات الشهري\n2. تحليل تكاليف التشغيل\n3. تقرير أداء الأطباء\n4. تحليل توزيع المرضى\n5. تقرير المصروفات التفصيلي\n\nلإنشاء أي تقرير، اضغط على الزر المناسب في لوحة التحكم.`;
    }

    // تحديث لوحة الذكاء الاصطناعي
    updateAIDashboard() {
        const aiStats = document.getElementById('ai-stats');
        if (aiStats) {
            aiStats.innerHTML = `
                <div class="ai-stat-card">
                    <h4>🧠 ذكاء النظام</h4>
                    <div class="ai-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.systemHealth}%"></div>
                        </div>
                        <span>${this.systemHealth}%</span>
                    </div>
                </div>
                <div class="ai-stat-card">
                    <h4>📊 دقة التحليل</h4>
                    <div class="ai-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 92%"></div>
                        </div>
                        <span>92%</span>
                    </div>
                </div>
                <div class="ai-stat-card">
                    <h4>🔍 الأنماط المكتشفة</h4>
                    <div class="ai-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 88%"></div>
                        </div>
                        <span>88%</span>
                    </div>
                </div>
            `;
        }
    }

    // عرض نتائج الفحص
    displayDiagnosisResults(diagnosis) {
        const alertsContainer = document.getElementById('ai-alerts-container');
        if (!alertsContainer) return;

        let html = '';

        diagnosis.issues.forEach(issue => {
            html += `
                <div class="ai-alert ${issue.severity === 'high' ? 'critical' : 'info'}">
                    <span>${issue.severity === 'high' ? '🚨' : '⚠️'}</span>
                    <div>
                        <strong>${issue.message}</strong>
                        ${issue.recommendation ? `<br><small>${issue.recommendation}</small>` : ''}
                    </div>
                </div>
            `;
        });

        if (diagnosis.issues.length === 0) {
            html = `
                <div class="ai-alert info">
                    <span>✅</span>
                    <div>
                        <strong>النظام يعمل بشكل ممتاز!</strong>
                        <br><small>لا توجد مشاكل مكتشفة</small>
                    </div>
                </div>
            `;
        }

        alertsContainer.innerHTML = html;
    }

    // عرض تحليل المعاملات
    displayTransactionAnalysis(analysis) {
        const financialAlerts = document.getElementById('financial-alerts');
        if (!financialAlerts) return;

        let html = '';

        // عرض الإحصائيات
        html += `
            <div class="ai-alert info">
                <span>📊</span>
                <div>
                    <strong>ملخص التحليل</strong>
                    <br><small>إجمالي الإيرادات: ${analysis.summary.totalRevenue.toLocaleString()} ريال</small>
                    <br><small>متوسط المعاملة: ${Math.round(analysis.summary.averageTransaction)} ريال</small>
                    <br><small>عدد المعاملات: ${analysis.summary.transactionCount}</small>
                </div>
            </div>
        `;

        if (analysis.anomalies.length > 0) {
            analysis.anomalies.forEach(anomaly => {
                html += `
                    <div class="ai-alert critical">
                        <span>🚨</span>
                        <div>
                            <strong>معاملة غير طبيعية</strong>
                            <br><small>المعاملة ${anomaly.id}: ${anomaly.amount} ريال - ${anomaly.reason}</small>
                        </div>
                    </div>
                `;
            });
        }

        if (analysis.recommendations.length > 0) {
            analysis.recommendations.forEach(rec => {
                html += `
                    <div class="ai-alert info">
                        <span>💡</span>
                        <div>
                            <strong>توصية</strong>
                            <br><small>${rec}</small>
                        </div>
                    </div>
                `;
            });
        }

        financialAlerts.innerHTML = html;
    }

    // الحصول على تاريخ المحادثة
    getConversationHistory(limit = 10) {
        return this.conversationHistory.slice(-limit);
    }

    // مسح تاريخ المحادثة
    clearConversationHistory() {
        this.conversationHistory = [];
        showNotification('تم مسح تاريخ المحادثة', 'success');
    }
}

// إنشاء instance من النظام الذكي
const aiSystem = new AISystem();

// دالات مساعدة للذكاء الاصطناعي
async function trainAISystem() {
    await aiSystem.trainSystem();
}

async function runSystemDiagnosis() {
    await aiSystem.runSystemDiagnosis();
}

async function aiAnalyzeTransactions() {
    await aiSystem.aiAnalyzeTransactions();
}

async function sendAccountingMessage() {
    const input = document.getElementById('accounting-message');
    const message = input.value.trim();
    
    if (!message) return;

    // إضافة رسالة المستخدم
    addAccountingMessage('user', message);
    input.value = '';

    // محاكاة معالجة الذكاء الاصطناعي
    setTimeout(async () => {
        const response = await aiSystem.handleAccountingQuery(message);
        addAccountingMessage('ai', response);
    }, 1000);
}

function addAccountingMessage(sender, message) {
    const chatMessages = document.getElementById('accounting-chat-messages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
    
    const timestamp = new Date().toLocaleTimeString('ar-EG', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <strong>${sender === 'user' ? 'أنت' : 'المساعد المحاسبي'}:</strong> 
        <div style="white-space: pre-line;">${message}</div>
        <div style="font-size: 0.8em; color: #666; margin-top: 5px; text-align: ${sender === 'user' ? 'left' : 'right'};">${timestamp}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// دالات المحاسبة الذكية
async function aiVerifyTransactions() {
    showNotification('✅ جاري التحقق الذكي من المعاملات...', 'info');
    const result = await aiSystem.verifyTransactions();
    addAccountingMessage('ai', result);
}

async function aiDetectAnomalies() {
    showNotification('🔍 جاري الكشف الذكي عن الشذوذ...', 'info');
    const result = await aiSystem.findAccountingErrors();
    addAccountingMessage('ai', result);
}

async function aiPredictRevenue() {
    showNotification('📈 جاري التنبؤ بالإيرادات...', 'info');
    const result = await aiSystem.generateRevenuePredictions();
    addAccountingMessage('ai', result);
}

async function aiGenerateReports() {
    showNotification('📊 جاري إنشاء التقارير...', 'info');
    const result = await aiSystem.suggestReports();
    addAccountingMessage('ai', result);
}

// جعل النظام متاحاً globally
window.aiSystem = aiSystem;
window.trainAISystem = trainAISystem;
window.runSystemDiagnosis = runSystemDiagnosis;
window.aiAnalyzeTransactions = aiAnalyzeTransactions;
window.sendAccountingMessage = sendAccountingMessage;
window.aiVerifyTransactions = aiVerifyTransactions;
window.aiDetectAnomalies = aiDetectAnomalies;
window.aiPredictRevenue = aiPredictRevenue;
window.aiGenerateReports = aiGenerateReports;

console.log('✅ نظام الذكاء الاصطناعي تم تحميله بنجاح');
