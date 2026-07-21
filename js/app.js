/* ==========================================
   Financial System
   Dashboard
========================================== */

const modal = document.getElementById("transactionModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

const saveBtn = document.getElementById("saveTransaction");

const cashBalance = document.getElementById("cashBalance");
const bankBalance = document.getElementById("bankBalance");

const incomeMonth = document.getElementById("incomeMonth");
const expenseMonth = document.getElementById("expenseMonth");

const latestContainer = document.getElementById("latestContainer");

/* ==========================================
   Settings
========================================== */

let settings = STORAGE.getSettings();

let transactions = STORAGE.getTransactions();

/* ==========================================
   Open Modal
========================================== */

openModal.addEventListener("click", () => {

    modal.classList.add("show");

    document.getElementById("date").valueAsDate = new Date();

});

/* ==========================================
   Close Modal
========================================== */

closeModal.addEventListener("click", () => {

    modal.classList.remove("show");

});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.classList.remove("show");

    }

});

/* ==========================================
   Dashboard
========================================== */

function loadDashboard(){

    cashBalance.textContent =
        settings.cashBalance.toLocaleString("ar-SA") + " ريال";

    bankBalance.textContent =
        settings.bankBalance.toLocaleString("ar-SA") + " ريال";

    calculateMonth();

    renderLatest();

}

loadDashboard();
/* ==========================================
   Save Transaction
========================================== */

saveBtn.addEventListener("click", saveTransaction);

function saveTransaction() {

    const date = document.getElementById("date").value;

    const type = document.getElementById("type").value;

    const payment = document.getElementById("payment").value;

    const amount = Number(document.getElementById("amount").value);

    const person = document.getElementById("person").value.trim();

    const note = document.getElementById("note").value.trim();

    if (
        date === "" ||
        amount <= 0 ||
        person === "" ||
        note === ""
    ) {

        alert("يرجى إدخال جميع البيانات");

        return;

    }

    const transaction = {

        date,

        type,

        payment,

        amount,

        person,

        note

    };

    STORAGE.addTransaction(transaction);

    /* تحديث الرصيد */

    if (payment === "cash") {

        if (type === "expense") {

            settings.cashBalance -= amount;

        } else {

            settings.cashBalance += amount;

        }

    }

    if (payment === "bank") {

        if (type === "expense") {

            settings.bankBalance -= amount;

        } else {

            settings.bankBalance += amount;

        }

    }

    STORAGE.saveSettings(settings);

    /* إعادة تحميل البيانات */

    settings = STORAGE.getSettings();

    transactions = STORAGE.getTransactions();

    loadDashboard();

    clearForm();

    modal.classList.remove("show");

}

/* ==========================================
   Clear Form
========================================== */

function clearForm() {

    document.getElementById("amount").value = "";

    document.getElementById("person").value = "";

    document.getElementById("note").value = "";

    document.getElementById("type").value = "expense";

    document.getElementById("payment").value = "cash";

}
/* ==========================================
   Calculate Current Month
========================================== */

function calculateMonth() {

    let income = 0;
    let expense = 0;

    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    transactions.forEach(item => {

        const d = new Date(item.date);

        const m = d.getMonth() + 1;
        const y = d.getFullYear();

        if (m === month && y === year) {

            if (item.type === "income") {

                income += item.amount;

            } else {

                expense += item.amount;

            }

        }

    });

    incomeMonth.textContent =
        income.toLocaleString("ar-SA") + " ريال";

    expenseMonth.textContent =
        expense.toLocaleString("ar-SA") + " ريال";

}

/* ==========================================
   Latest Transactions
========================================== */

function renderLatest() {

    latestContainer.innerHTML = "";

    if (transactions.length === 0) {

        latestContainer.innerHTML = `
            <div class="empty-state">
                لا توجد عمليات حتى الآن
            </div>
        `;

        return;

    }

    transactions.slice(0,5).forEach(item=>{

        latestContainer.innerHTML += `

        <div class="transaction-card">

            <div class="transaction-top">

                <span class="${item.type}">

                    ${item.type === "expense" ? "صرف" : "إيداع"}

                </span>

                <strong>

                    ${Number(item.amount).toLocaleString("ar-SA")} ريال

                </strong>

            </div>

            <div class="transaction-body">

                <p>

                    ${item.person}

                </p>

                <small>

                    ${item.note}

                </small>

            </div>

            <div class="transaction-footer">

                <span>

                    ${item.payment === "cash" ? "كاش" : "بنك"}

                </span>

                <span>

                    ${item.date}

                </span>

            </div>

        </div>

        `;

    });

}

/* ==========================================
   Today's Date
========================================== */

const todayDate = document.getElementById("todayDate");

const today = new Date();

todayDate.textContent =
today.toLocaleDateString("ar-SA",{

    weekday:"long",

    year:"numeric",

    month:"long",

    day:"numeric"

});
/* ==========================================
   Live Clock
========================================== */

function updateClock(){

    const now = new Date();

    const day = now.toLocaleDateString("ar-SA",{

        weekday:"long"

    });

    const date = now.toLocaleDateString("ar-SA",{

        year:"numeric",

        month:"long",

        day:"numeric"

    });

    const time = now.toLocaleTimeString("ar-SA",{

        hour:"2-digit",

        minute:"2-digit"

    });

    document.getElementById("todayDay").textContent = day;

    document.getElementById("todayDate").textContent = date;

    document.getElementById("liveClock").textContent = time;

}

updateClock();

setInterval(updateClock,1000);