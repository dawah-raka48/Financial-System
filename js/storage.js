/* ==========================================
   Financial System
   Storage Manager
========================================== */

/* ==========================================
   Google Sheets API
========================================== */

const GOOGLE_SHEETS_API =
    "https://script.google.com/macros/s/AKfycbz1jnKuWGbB9UhQMfUqXV33xQB2SWJMiLM3Jme3fO6RvHcdh1yE9b_8N6q0XwjISP4h/exec";

const STORAGE = {

    SETTINGS_KEY: "financial_settings",

    TRANSACTIONS_KEY: "financial_transactions",

    /* ==========================
       الإعدادات
    ========================== */

    getSettings() {

        const settings = localStorage.getItem(this.SETTINGS_KEY);

        if (settings) {

            return JSON.parse(settings);

        }

        return {

            cashBalance: 0,

            bankBalance: 0,

            darkMode: true

        };

    },

    saveSettings(settings) {

        localStorage.setItem(

            this.SETTINGS_KEY,

            JSON.stringify(settings)

        );

    },

    /* ==========================
       العمليات
    ========================== */

    getTransactions() {

        const data = localStorage.getItem(

            this.TRANSACTIONS_KEY

        );

        if (data) {

            return JSON.parse(data);

        }

        return [];

    },

 /* ==========================================
   مزامنة العمليات من Google Sheets
========================================== */

async syncFromGoogle() {

    try {

        const response =
            await fetch(
                GOOGLE_SHEETS_API +
                "?action=getTransactions"
            );


        if (!response.ok) {

            throw new Error(
                "تعذر الاتصال بخدمة Google Sheets"
            );

        }


        const result =
            await response.json();


        if (
            !result.success ||
            !Array.isArray(result.data)
        ) {

            throw new Error(
                result.message ||
                "البيانات المستلمة غير صحيحة"
            );

        }


        /* ==========================
           حفظ نسخة محلية
        ========================== */

        this.saveTransactions(
            result.data
        );


        return result.data;


    } catch (error) {

        console.error(
            "Google Sheets Error:",
            error
        );


        throw error;

    }

},  

    saveTransactions(transactions) {

        localStorage.setItem(

            this.TRANSACTIONS_KEY,

            JSON.stringify(transactions)

        );

    },

/* ==========================================
   إضافة حركة إلى Google Sheets
========================================== */

async addTransaction(transaction) {

    try {

        /* ==========================
           تجهيز البيانات
        ========================== */

        const formData =
            new URLSearchParams();

        formData.append(
            "action",
            "addTransaction"
        );

        formData.append(
            "date",
            transaction.date || ""
        );

        formData.append(
            "type",
            transaction.type || ""
        );

        formData.append(
            "payment",
            transaction.payment || ""
        );

        formData.append(
            "amount",
            Number(transaction.amount) || 0
        );

        formData.append(
            "person",
            transaction.person || ""
        );

        formData.append(
            "note",
            transaction.note || ""
        );


        /* ==========================
           إرسال إلى Google Sheets
        ========================== */

        const response =
            await fetch(
                GOOGLE_SHEETS_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        formData.toString()
                }
            );


        if (!response.ok) {

            throw new Error(
                "فشل الاتصال بـ Google Sheets"
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "تعذر حفظ الحركة"
            );

        }


        /* ==========================
           تحديث البيانات المحلية
        ========================== */

        const transactions =
            this.getTransactions();


        transactions.unshift(
            result.data
        );


        this.saveTransactions(
            transactions
        );


        return result.data;


    } catch (error) {

        console.error(
            "Add Transaction Error:",
            error
        );


        throw error;

    }

},

/* ==========================================
   حذف حركة من Google Sheets
========================================== */

async deleteTransaction(id) {

    try {

        const formData =
            new URLSearchParams();

        formData.append(
            "action",
            "deleteTransaction"
        );

        formData.append(
            "id",
            id
        );


        const response =
            await fetch(
                GOOGLE_SHEETS_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        formData.toString()
                }
            );


        if (!response.ok) {

            throw new Error(
                "فشل الاتصال بـ Google Sheets"
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "تعذر حذف الحركة"
            );

        }


        /* تحديث النسخة المحلية */

        let transactions =
            this.getTransactions();


        transactions =
            transactions.filter(
                item =>
                    Number(item.id) !==
                    Number(id)
            );


        this.saveTransactions(
            transactions
        );


        return true;


    } catch (error) {

        console.error(
            "Delete Transaction Error:",
            error
        );


        throw error;

    }

},

/* ==========================================
   تعديل حركة في Google Sheets
========================================== */

async updateTransaction(transaction) {

    try {

        const formData =
            new URLSearchParams();

        formData.append(
            "action",
            "updateTransaction"
        );

        formData.append(
            "id",
            transaction.id
        );

        formData.append(
            "date",
            transaction.date || ""
        );

        formData.append(
            "type",
            transaction.type || ""
        );

        formData.append(
            "payment",
            transaction.payment || ""
        );

        formData.append(
            "amount",
            Number(transaction.amount) || 0
        );

        formData.append(
            "person",
            transaction.person || ""
        );

        formData.append(
            "note",
            transaction.note || ""
        );


        const response =
            await fetch(
                GOOGLE_SHEETS_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        formData.toString()
                }
            );


        if (!response.ok) {

            throw new Error(
                "فشل الاتصال بـ Google Sheets"
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "تعذر تعديل الحركة"
            );

        }


        /* ==========================
           تحديث النسخة المحلية
        ========================== */

        let transactions =
            this.getTransactions();


        const index =
            transactions.findIndex(
                item =>
                    Number(item.id) ===
                    Number(transaction.id)
            );


        if (index !== -1) {

            transactions[index] =
                result.data;

        }


        this.saveTransactions(
            transactions
        );


        return result.data;


    } catch (error) {

        console.error(
            "Update Transaction Error:",
            error
        );


        throw error;

    }

},
   
/* ==========================
   حساب الرصيد الحالي
========================== */

calculateBalances() {

    const settings = this.getSettings();
    const transactions = this.getTransactions();

    let cash = Number(settings.cashBalance) || 0;
    let bank = Number(settings.bankBalance) || 0;

    transactions.forEach(item => {

        if (item.payment === "cash") {

            if (item.type === "income") {
                cash += Number(item.amount);
            } else {
                cash -= Number(item.amount);
            }

        }

        if (item.payment === "bank") {

            if (item.type === "income") {
                bank += Number(item.amount);
            } else {
                bank -= Number(item.amount);
            }

        }

    });

    return {
        cash,
        bank
    };

}

};
