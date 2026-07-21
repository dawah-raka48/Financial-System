/* ==========================================
   Financial System
   Storage Manager
========================================== */

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

    saveTransactions(transactions) {

        localStorage.setItem(

            this.TRANSACTIONS_KEY,

            JSON.stringify(transactions)

        );

    },

    addTransaction(transaction) {

        const transactions = this.getTransactions();

        transaction.id = Date.now();

        transactions.unshift(transaction);

        this.saveTransactions(transactions);

    },

   deleteTransaction(id) {

    let transactions = this.getTransactions();

    transactions = transactions.filter(
        item => item.id !== id
    );

    this.saveTransactions(transactions);

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
