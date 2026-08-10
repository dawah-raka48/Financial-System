/* ==========================================
   Financial System
   History Page
========================================== */


/* ==========================================
   Elements
========================================== */

const historyContainer =
    document.getElementById("historyContainer");


const searchInput =
    document.getElementById("searchInput");


const fromDate =
    document.getElementById("fromDate");


const toDate =
    document.getElementById("toDate");


const typeFilter =
    document.getElementById("typeFilter");


const paymentFilter =
    document.getElementById("paymentFilter");


const printButton =
    document.getElementById("printMonth");


/* ==========================================
   Edit Modal
========================================== */

const editModal =
    document.getElementById("editModal");


const closeEditModal =
    document.getElementById("closeEditModal");


const updateTransactionButton =
    document.getElementById("updateTransaction");


/* ==========================================
   Data
========================================== */

let transactions = [];


let currentId = null;
/* ==========================================
   Load Transactions
========================================== */

async function loadTransactions() {

    try {

        historyContainer.innerHTML = `

            <div class="empty-state">

                جاري تحميل العمليات...

            </div>

        `;


        transactions =
            await STORAGE.syncFromGoogle();


        /* ==========================
           ترتيب الأحدث أولًا
        ========================== */

        transactions.sort((a, b) => {

            return Number(b.id) - Number(a.id);

        });


        renderHistory(transactions);


    } catch (error) {

        console.error(
            "Google Sheets Load Error:",
            error
        );


        /* ==========================
           محاولة استخدام النسخة المحلية
        ========================== */

        transactions =
            STORAGE.getTransactions();


        renderHistory(transactions);


        if (transactions.length === 0) {

            historyContainer.innerHTML = `

                <div class="empty-state">

                    تعذر تحميل العمليات

                </div>

            `;

        }

    }

}


/* تشغيل التحميل */

loadTransactions();
/* ==========================================
   Render History
========================================== */

function renderHistory(data) {

    historyContainer.innerHTML = "";


    /* ==========================
       لا توجد عمليات
    ========================== */

    if (!data || data.length === 0) {

        historyContainer.innerHTML = `

            <div class="empty-state">

                لا توجد أي عمليات

            </div>

        `;

        return;

    }


    /* ==========================
       عرض العمليات
    ========================== */

    data.forEach(item => {


        const typeText =
            item.type === "expense"
                ? "صرف"
                : "إيداع";


        const paymentText =
            item.payment === "cash"
                ? "كاش"
                : "بنك";


        const amount =
            Number(item.amount || 0)
                .toLocaleString("ar-SA");


        historyContainer.innerHTML += `

            <div class="transaction-card">


                <div class="transaction-top">

                    <span class="${item.type}">

                        ${typeText}

                    </span>


                    <strong>

                        ${amount} ريال

                    </strong>

                </div>


                <div class="transaction-body">

                    <p>

                        ${escapeHTML(
                            item.person || "—"
                        )}

                    </p>


                    <small>

                        ${escapeHTML(
                            item.note || "—"
                        )}

                    </small>

                </div>


                <div class="transaction-footer">

                    <span>

                        ${paymentText}

                    </span>


                    <span>

                        ${item.date || "—"}

                    </span>

                </div>


                <div class="history-actions">


                    <button

                        class="edit-btn"

                        onclick="
                            editTransaction(${item.id})
                        "

                    >

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button

                        class="delete-btn"

                        onclick="
                            deleteTransaction(${item.id})
                        "

                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>


                </div>


            </div>

        `;

    });

}
/* ==========================================
   Escape HTML
========================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
/* ==========================================
   Search
========================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        applyFilters
    );

}


/* ==========================================
   From Date
========================================== */

if (fromDate) {

    fromDate.addEventListener(
        "change",
        applyFilters
    );

}


/* ==========================================
   To Date
========================================== */

if (toDate) {

    toDate.addEventListener(
        "change",
        applyFilters
    );

}


/* ==========================================
   Type Filter
========================================== */

if (typeFilter) {

    typeFilter.addEventListener(
        "change",
        applyFilters
    );

}


/* ==========================================
   Payment Filter
========================================== */

if (paymentFilter) {

    paymentFilter.addEventListener(
        "change",
        applyFilters
    );

}


/* ==========================================
   Apply Filters
========================================== */

function applyFilters() {


    const searchValue =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedFromDate =
        fromDate
            ? fromDate.value
            : "";


    const selectedToDate =
        toDate
            ? toDate.value
            : "";


    const selectedType =
        typeFilter
            ? typeFilter.value
            : "";


    const selectedPayment =
        paymentFilter
            ? paymentFilter.value
            : "";


    const result =
        transactions.filter(item => {


            /* ==========================
               البحث
            ========================== */

            const person =
                String(
                    item.person || ""
                )
                .toLowerCase();


            const note =
                String(
                    item.note || ""
                )
                .toLowerCase();


            const matchesSearch =

                !searchValue ||

                person.includes(
                    searchValue
                ) ||

                note.includes(
                    searchValue
                );


            /* ==========================
               من تاريخ
            ========================== */

            const matchesFromDate =

                !selectedFromDate ||

                String(item.date || "") >=
                    selectedFromDate;


            /* ==========================
               إلى تاريخ
            ========================== */

            const matchesToDate =

                !selectedToDate ||

                String(item.date || "") <=
                    selectedToDate;


            /* ==========================
               نوع العملية
            ========================== */

            const matchesType =

                !selectedType ||

                item.type ===
                    selectedType;


            /* ==========================
               طريقة الدفع
            ========================== */

            const matchesPayment =

                !selectedPayment ||

                item.payment ===
                    selectedPayment;


            return (

                matchesSearch &&

                matchesFromDate &&

                matchesToDate &&

                matchesType &&

                matchesPayment

            );

        });


    renderHistory(result);

}
/* ==========================================
   Delete Transaction
========================================== */

async function deleteTransaction(id) {


    const confirmDelete =
        confirm(
            "هل تريد حذف هذه الحركة؟"
        );


    if (!confirmDelete) {

        return;

    }


    try {


        /* ==========================
           الحذف من Google Sheets
        ========================== */

        await STORAGE.deleteTransaction(
            id
        );


        /* ==========================
           إعادة تحميل البيانات
        ========================== */

        transactions =
            await STORAGE.syncFromGoogle();


        transactions.sort((a, b) => {

            return Number(b.id) - Number(a.id);

        });


        applyFilters();


        alert(
            "تم حذف الحركة بنجاح"
        );


    } catch (error) {


        console.error(
            "Delete Error:",
            error
        );


        alert(
            "تعذر حذف الحركة من Google Sheets"
        );

    }

}
/* ==========================================
   Edit Transaction
========================================== */

function editTransaction(id) {


    currentId =
        Number(id);


    const item =
        transactions.find(
            transaction =>
                Number(transaction.id) ===
                Number(id)
        );


    if (!item) {

        alert(
            "لم يتم العثور على الحركة"
        );

        return;

    }


    document.getElementById(
        "editDate"
    ).value =
        item.date || "";


    document.getElementById(
        "editType"
    ).value =
        item.type || "expense";


    document.getElementById(
        "editPayment"
    ).value =
        item.payment || "cash";


    document.getElementById(
        "editAmount"
    ).value =
        item.amount || 0;


    document.getElementById(
        "editPerson"
    ).value =
        item.person || "";


    document.getElementById(
        "editNote"
    ).value =
        item.note || "";


    editModal.classList.add(
        "show"
    );

}
/* ==========================================
   Close Edit Modal
========================================== */

if (closeEditModal) {

    closeEditModal.addEventListener(
        "click",
        () => {

            editModal.classList.remove(
                "show"
            );

            currentId = null;

        }
    );

}


/* ==========================================
   Close When Click Outside
========================================== */

window.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            editModal
        ) {

            editModal.classList.remove(
                "show"
            );

            currentId = null;

        }

    }
);
/* ==========================================
   Save Edit
========================================== */

if (updateTransactionButton) {

    updateTransactionButton.addEventListener(
        "click",
        saveEditedTransaction
    );

}


async function saveEditedTransaction() {


    if (currentId === null) {

        return;

    }


    try {


        /* ==========================
           تجهيز الحركة
        ========================== */

        const updatedTransaction = {

            id:
                Number(currentId),

            date:
                document.getElementById(
                    "editDate"
                ).value,

            type:
                document.getElementById(
                    "editType"
                ).value,

            payment:
                document.getElementById(
                    "editPayment"
                ).value,

            amount:
                Number(
                    document.getElementById(
                        "editAmount"
                    ).value
                ) || 0,

            person:
                document.getElementById(
                    "editPerson"
                ).value.trim(),

            note:
                document.getElementById(
                    "editNote"
                ).value.trim()

        };


        /* ==========================
           التحقق
        ========================== */

        if (!updatedTransaction.date) {

            alert(
                "يرجى اختيار التاريخ"
            );

            return;

        }


        if (
            !updatedTransaction.amount ||
            updatedTransaction.amount <= 0
        ) {

            alert(
                "يرجى إدخال مبلغ صحيح"
            );

            return;

        }


        /* ==========================
           تعطيل الزر أثناء الحفظ
        ========================== */

        updateTransactionButton.disabled =
            true;


        updateTransactionButton.textContent =
            "جاري الحفظ...";


        /* ==========================
           إرسال إلى Google Sheets
        ========================== */

        await STORAGE.updateTransaction(
            updatedTransaction
        );


        /* ==========================
           إعادة تحميل البيانات
        ========================== */

        transactions =
            await STORAGE.syncFromGoogle();


        transactions.sort((a, b) => {

            return Number(b.id) - Number(a.id);

        });


        /* ==========================
           إغلاق النافذة
        ========================== */

        editModal.classList.remove(
            "show"
        );


        currentId = null;


        /* ==========================
           إعادة العرض
        ========================== */

        applyFilters();


        alert(
            "تم تعديل الحركة بنجاح"
        );


    } catch (error) {


        console.error(
            "Update Error:",
            error
        );


        alert(
            "تعذر تعديل الحركة في Google Sheets"
        );


    } finally {


        updateTransactionButton.disabled =
            false;


        updateTransactionButton.textContent =
            "حفظ التعديل";

    }

}
