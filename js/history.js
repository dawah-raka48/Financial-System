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
/* ==========================================
   Professional Print Report
========================================== */

if (printButton) {

    printButton.addEventListener(
        "click",
        printReport
    );

}


function printReport() {


    /* ==========================
       أخذ نفس الفلاتر
    ========================== */

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


    const searchValue =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    /* ==========================
       تجهيز البيانات
    ========================== */

    let reportData =
        transactions.filter(item => {


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


            const matchesFromDate =

                !selectedFromDate ||

                String(item.date || "") >=
                    selectedFromDate;


            const matchesToDate =

                !selectedToDate ||

                String(item.date || "") <=
                    selectedToDate;


            const matchesType =

                !selectedType ||

                item.type === selectedType;


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


    /* ==========================
       ترتيب من الأحدث
    ========================== */

    reportData.sort((a, b) => {

        return (
            new Date(b.date) -
            new Date(a.date)
        );

    });


    /* ==========================
       الإحصائيات
    ========================== */

    let cashWithdrawals = 0;

    let bankWithdrawals = 0;

    let cashDeposits = 0;

    let bankDeposits = 0;


    let cashWithdrawalsTotal = 0;

    let bankWithdrawalsTotal = 0;

    let cashDepositsTotal = 0;

    let bankDepositsTotal = 0;


    let totalExpenses = 0;

    let totalIncome = 0;


    reportData.forEach(item => {


        const amount =
            Number(item.amount) || 0;


        if (
            item.type ===
            "expense"
        ) {


            totalExpenses +=
                amount;


            if (
                item.payment ===
                "cash"
            ) {

                cashWithdrawals++;

                cashWithdrawalsTotal +=
                    amount;

            }


            if (
                item.payment ===
                "bank"
            ) {

                bankWithdrawals++;

                bankWithdrawalsTotal +=
                    amount;

            }

        }


        if (
            item.type ===
            "income"
        ) {


            totalIncome +=
                amount;


            if (
                item.payment ===
                "cash"
            ) {

                cashDeposits++;

                cashDepositsTotal +=
                    amount;

            }


            if (
                item.payment ===
                "bank"
            ) {

                bankDeposits++;

                bankDepositsTotal +=
                    amount;

            }

        }

    });


    /* ==========================
       الفترة
    ========================== */

    let periodText =
        "جميع الحركات";


    if (
        selectedFromDate &&
        selectedToDate
    ) {

        periodText =
            `من ${selectedFromDate} إلى ${selectedToDate}`;

    } else if (
        selectedFromDate
    ) {

        periodText =
            `من ${selectedFromDate}`;

    } else if (
        selectedToDate
    ) {

        periodText =
            `حتى ${selectedToDate}`;

    }


    /* ==========================
       نوع العملية
    ========================== */

    let typeText =
        "كل العمليات";


    if (
        selectedType ===
        "expense"
    ) {

        typeText = "صرف";

    }


    if (
        selectedType ===
        "income"
    ) {

        typeText = "إيداع";

    }


    /* ==========================
       طريقة الدفع
    ========================== */

    let paymentText =
        "كل الطرق";


    if (
        selectedPayment ===
        "cash"
    ) {

        paymentText = "كاش";

    }


    if (
        selectedPayment ===
        "bank"
    ) {

        paymentText = "بنك";

    }


    /*
       من هنا استخدم كود تصميم
       الطباعة الحالي الجميل الموجود
       عندك.

       لا نغير الـHTML/CSS الخاص
       بالتقرير.
    */


    openPrintWindow(
        reportData,
        periodText,
        typeText,
        paymentText,
        {
            cashWithdrawals,
            bankWithdrawals,
            cashDeposits,
            bankDeposits,

            cashWithdrawalsTotal,
            bankWithdrawalsTotal,
            cashDepositsTotal,
            bankDepositsTotal,

            totalExpenses,
            totalIncome
        }
    );

}
/* ==========================================
   Escape HTML For Print
========================================== */

function escapePrintHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
/* ==========================================
   Professional Print Window
========================================== */

function openPrintWindow(
    reportData,
    periodText,
    typeText,
    paymentText,
    stats
) {

    /* ==========================
       فتح نافذة الطباعة
    ========================== */

    const printWindow =
        window.open(
            "",
            "_blank",
            "width=1200,height=900"
        );


    if (!printWindow) {

        alert(
            "تعذر فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة."
        );

        return;

    }


    /* ==========================
       تاريخ الطباعة
    ========================== */

    const now =
        new Date();


    const printDate =
        now.toLocaleDateString(
            "ar-SA",
            {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        );


    /* ==========================
       تنسيق الأرقام
    ========================== */

    function money(value) {

        return Number(value || 0)
            .toLocaleString(
                "ar-SA"
            ) + " ريال";

    }


    /* ==========================
       جدول العمليات
    ========================== */

    let rows = "";


    if (
        !reportData ||
        reportData.length === 0
    ) {

        rows = `

            <tr>

                <td
                    colspan="7"
                    class="empty"
                >

                    لا توجد عمليات ضمن الفترة المحددة

                </td>

            </tr>

        `;

    } else {

        reportData.forEach(
            (item, index) => {


                const type =
                    item.type === "expense"
                        ? "صرف"
                        : "إيداع";


                const payment =
                    item.payment === "cash"
                        ? "كاش"
                        : "بنك";


                const amount =
                    money(
                        item.amount
                    );


                rows += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${item.date || "—"}
                        </td>

                        <td>

                            <span class="type">

                                ${type}

                            </span>

                        </td>

                        <td>
                            ${payment}
                        </td>

                        <td>
                            ${escapePrintHTML(
                                item.person || "—"
                            )}
                        </td>

                        <td class="note">

                            ${escapePrintHTML(
                                item.note || "—"
                            )}

                        </td>

                        <td class="amount">

                            ${amount}

                        </td>

                    </tr>

                `;

            }
        );

    }


    /* ==========================
       HTML التقرير
    ========================== */

    const html = `

<!DOCTYPE html>

<html
    lang="ar"
    dir="rtl"
>

<head>

<meta charset="UTF-8">

<title>
    كشف الحركات المالية
</title>


<style>

/* ==========================================
   Page
========================================== */

@page {

    size: A4 landscape;

    margin: 10mm;

}


* {

    box-sizing: border-box;

}


html,
body {

    margin: 0;

    padding: 0;

}


body {

    font-family:
        "Tahoma",
        "Arial",
        sans-serif;

    color: #111;

    background: white;

    direction: rtl;

    font-size: 10px;

}


/* ==========================================
   Header
========================================== */

.header {

    width: 100%;

    background: #287db7;

    color: white;

    text-align: center;

    padding: 12px 15px;

    margin-bottom: 10px;

}


.header h1 {

    margin: 0 0 5px;

    font-size: 22px;

    font-weight: 800;

}


.header h2 {

    margin: 0;

    font-size: 12px;

    font-weight: 400;

}


/* ==========================================
   Report Information
========================================== */

.report-info {

    display: flex;

    justify-content: space-between;

    align-items: center;

    margin-bottom: 8px;

    font-size: 9px;

}


.report-info strong {

    font-weight: 700;

}


/* ==========================================
   Filters
========================================== */

.filters {

    border: 1px solid #ddd;

    padding: 5px 8px;

    margin-bottom: 8px;

    display: flex;

    gap: 20px;

    justify-content: flex-start;

    background: #fafafa;

}


.filters span {

    font-weight: 600;

}


/* ==========================================
   Table
========================================== */

table {

    width: 100%;

    border-collapse: collapse;

    table-layout: fixed;

}


thead {

    background: #f1f1f1;

}


th {

    border: 1px solid #cfcfcf;

    padding: 6px 4px;

    font-size: 9px;

    font-weight: 800;

}


td {

    border: 1px solid #d8d8d8;

    padding: 5px 4px;

    height: 27px;

    font-size: 8.5px;

    vertical-align: middle;

}


tbody tr:nth-child(even) {

    background: #fafafa;

}


/* الأعمدة */

th:nth-child(1),
td:nth-child(1) {

    width: 4%;

    text-align: center;

}


th:nth-child(2),
td:nth-child(2) {

    width: 11%;

    text-align: center;

}


th:nth-child(3),
td:nth-child(3) {

    width: 10%;

    text-align: center;

}


th:nth-child(4),
td:nth-child(4) {

    width: 10%;

    text-align: center;

}


th:nth-child(5),
td:nth-child(5) {

    width: 17%;

}


th:nth-child(6),
td:nth-child(6) {

    width: 32%;

}


th:nth-child(7),
td:nth-child(7) {

    width: 16%;

    text-align: center;

}


.note {

    line-height: 1.4;

}


.amount {

    font-weight: 800;

    white-space: nowrap;

}


.type {

    font-weight: 700;

}


.empty {

    text-align: center;

    padding: 20px;

}


/* ==========================================
   Summary Title
========================================== */

.summary-title {

    margin-top: 10px;

    margin-bottom: 5px;

    font-size: 12px;

    font-weight: 800;

}


/* ==========================================
   Four Operation Boxes
========================================== */

.summary {

    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    width: 100%;

    border: 1px solid #d5d5d5;

}


.summary-box {

    min-height: 55px;

    text-align: center;

    padding: 6px;

    border-left:
        1px solid #d5d5d5;

}


.summary-box:last-child {

    border-left: none;

}


.summary-box .label {

    display: block;

    font-size: 8px;

    color: #555;

    margin-bottom: 3px;

}


.summary-box .number {

    display: block;

    font-size: 15px;

    font-weight: 800;

    line-height: 1.2;

}


.summary-box .amount {

    display: block;

    font-size: 8px;

    margin-top: 2px;

    font-weight: 600;

}


/* ==========================================
   Totals
========================================== */

.totals {

    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    width: 100%;

    margin-top: 9px;

    border: 1px solid #d5d5d5;

}


.total-box {

    min-height: 48px;

    padding: 6px;

    text-align: center;

    border-left:
        1px solid #d5d5d5;

}


.total-box:last-child {

    border-left: none;

}


.total-label {

    font-size: 8px;

    color: #555;

    margin-bottom: 4px;

}


.total-value {

    font-size: 13px;

    font-weight: 800;

}


/* ==========================================
   Footer
========================================== */

.footer {

    display: flex;

    justify-content: space-between;

    margin-top: 10px;

    padding-top: 6px;

    border-top: 1px solid #ddd;

    font-size: 8px;

    color: #777;

}


/* ==========================================
   Print
========================================== */

@media print {

    body {

        -webkit-print-color-adjust:
            exact;

        print-color-adjust:
            exact;

    }


    .header {

        background: #287db7 !important;

        color: white !important;

    }


    .summary-box,
    .total-box,
    tr,
    thead {

        break-inside: avoid;

    }

}

</style>

</head>


<body>


<!-- ==========================================
     Header
========================================== -->

<div class="header">

    <h1>
        نظام إدارة الصندوق
    </h1>

    <h2>
        كشف الحركات المالية — جميع الحركات
    </h2>

</div>


<!-- ==========================================
     Report Info
========================================== -->

<div class="report-info">

    <div>

        <strong>
            الفترة:
        </strong>

        ${escapePrintHTML(
            periodText
        )}

    </div>


    <div>

        <strong>
            تاريخ التقرير:
        </strong>

        ${printDate}

    </div>

</div>


<!-- ==========================================
     Applied Filters
========================================== -->

<div class="filters">

    <span>

        نوع العملية:
        ${escapePrintHTML(
            typeText
        )}

    </span>


    <span>

        طريقة الدفع:
        ${escapePrintHTML(
            paymentText
        )}

    </span>

</div>


<!-- ==========================================
     Operations Table
========================================== -->

<table>

    <thead>

        <tr>

            <th>
                #
            </th>

            <th>
                التاريخ
            </th>

            <th>
                نوع الحركة
            </th>

            <th>
                طريقة الدفع
            </th>

            <th>
                المستفيد
            </th>

            <th>
                البيان
            </th>

            <th>
                المبلغ
            </th>

        </tr>

    </thead>


    <tbody>

        ${rows}

    </tbody>

</table>


<!-- ==========================================
     Summary
========================================== -->

<div class="summary-title">

    ملخص عدد العمليات

</div>


<div class="summary">


    <div class="summary-box">

        <span class="label">
            سحب كاش
        </span>

        <span class="number">
            ${stats.cashWithdrawals}
        </span>

        <span class="amount">
            ${money(
                stats.cashWithdrawalsTotal
            )}
        </span>

    </div>


    <div class="summary-box">

        <span class="label">
            سحب بنكي
        </span>

        <span class="number">
            ${stats.bankWithdrawals}
        </span>

        <span class="amount">
            ${money(
                stats.bankWithdrawalsTotal
            )}
        </span>

    </div>


    <div class="summary-box">

        <span class="label">
            إيداع كاش
        </span>

        <span class="number">
            ${stats.cashDeposits}
        </span>

        <span class="amount">
            ${money(
                stats.cashDepositsTotal
            )}
        </span>

    </div>


    <div class="summary-box">

        <span class="label">
            إيداع بنكي
        </span>

        <span class="number">
            ${stats.bankDeposits}
        </span>

        <span class="amount">
            ${money(
                stats.bankDepositsTotal
            )}
        </span>

    </div>


</div>


<!-- ==========================================
     Totals
========================================== -->

<div class="totals">


    <div class="total-box">

        <div class="total-label">
            إجمالي المصروفات
        </div>

        <div class="total-value">
            ${money(
                stats.totalExpenses
            )}
        </div>

    </div>


    <div class="total-box">

        <div class="total-label">
            إجمالي الإيداعات
        </div>

        <div class="total-value">
            ${money(
                stats.totalIncome
            )}
        </div>

    </div>


    <div class="total-box">

        <div class="total-label">
            إجمالي العمليات
        </div>

        <div class="total-value">
            ${reportData.length}
            عملية
        </div>

    </div>


</div>


<!-- ==========================================
     Footer
========================================== -->

<div class="footer">

    <span>
        نظام إدارة الصندوق
    </span>

    <span>
        تقرير مالي
    </span>

</div>


<script>

window.onload = function() {

    setTimeout(
        function() {

            window.print();

        },
        400
    );

};




</script>


</body>

</html>

`;


    /* ==========================
       كتابة التقرير
    ========================== */

    printWindow.document.open();

    printWindow.document.write(
        html
    );

    printWindow.document.close();

}
