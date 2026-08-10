/* ==========================================
   Financial System
   History Page
   Part 1
========================================== */


/* ==========================================
   العناصر
========================================== */

const historyContainer =
    document.getElementById("historyContainer");

const searchInput =
    document.getElementById("searchInput");

const fromDate =
    document.getElementById("fromDate");

const toDate =
    document.getElementById("toDate");


/* ==========================================
   البيانات
========================================== */

let transactions =
    STORAGE.getTransactions();


/* ==========================================
   عرض السجل
========================================== */

renderHistory(transactions);


function renderHistory(data) {

    historyContainer.innerHTML = "";


    /* ==========================
       لا توجد عمليات
    ========================== */

    if (data.length === 0) {

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

        historyContainer.innerHTML += `

            <div class="transaction-card">

                <div class="transaction-top">

                    <span class="${item.type}">

                        ${
                            item.type === "expense"
                                ? "صرف"
                                : "إيداع"
                        }

                    </span>

                    <strong>

                        ${
                            Number(item.amount)
                                .toLocaleString("ar-SA")
                        }

                        ريال

                    </strong>

                </div>


                <div class="transaction-body">

                    <p>

                        ${item.person || "-"}

                    </p>

                    <small>

                        ${item.note || "-"}

                    </small>

                </div>


                <div class="transaction-footer">

                    <span>

                        ${
                            item.payment === "cash"
                                ? "كاش"
                                : "بنك"
                        }

                    </span>

                    <span>

                        ${item.date}

                    </span>

                </div>


                <div class="history-actions">

                    <button
                        class="edit-btn"
                        onclick="editTransaction(${item.id})">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${item.id})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        `;

    });

}


/* ==========================================
   Filters
   Part 3
========================================== */

const typeFilter =
    document.getElementById("typeFilter");

const paymentFilter =
    document.getElementById("paymentFilter");


/* ==========================================
   Search
========================================== */

searchInput.addEventListener("input", () => {

    applyFilters();

});


/* ==========================================
   Month
========================================== */

fromDate.addEventListener("change", () => {

    applyFilters();

});


toDate.addEventListener("change", () => {

    applyFilters();

});

/* ==========================================
   Transaction Type
========================================== */

if (typeFilter) {

    typeFilter.addEventListener("change", () => {

        applyFilters();

    });

}


/* ==========================================
   Payment Method
========================================== */

if (paymentFilter) {

    paymentFilter.addEventListener("change", () => {

        applyFilters();

    });

}


/* ==========================================
   Apply All Filters
========================================== */

function applyFilters() {

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedFromDate =
    fromDate.value;

const selectedToDate =
    toDate.value;


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
                String(item.person || "")
                    .toLowerCase();


            const note =
                String(item.note || "")
                    .toLowerCase();


            const matchesSearch =
                !searchValue ||
                person.includes(searchValue) ||
                note.includes(searchValue);


            /* ==========================
               الشهر
            ========================== */

            const matchesFromDate =
    !selectedFromDate ||
    item.date >= selectedFromDate;


const matchesToDate =
    !selectedToDate ||
    item.date <= selectedToDate;

            /* ==========================
               نوع العملية
            ========================== */

            const matchesType =
                !selectedType ||
                item.type === selectedType;


            /* ==========================
               طريقة الدفع
            ========================== */

            const matchesPayment =
                !selectedPayment ||
                item.payment === selectedPayment;


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
   حذف الحركة
========================================== */

function deleteTransaction(id) {

    const confirmDelete =
        confirm("هل تريد حذف هذه الحركة؟");


    if (!confirmDelete) {

        return;

    }


    STORAGE.deleteTransaction(id);


    transactions =
        STORAGE.getTransactions();


    applyFilters();

}
/* ==========================================
   Financial System
   History Page
   Part 2
   Edit Transaction
========================================== */


/* ==========================================
   عناصر التعديل
========================================== */

const editModal =
    document.getElementById("editModal");

const closeEditModal =
    document.getElementById("closeEditModal");

const updateTransactionButton =
    document.getElementById("updateTransaction");


let currentId = null;


/* ==========================================
   فتح نافذة التعديل
========================================== */

function editTransaction(id) {

    currentId = id;


    const item =
        transactions.find(
            transaction => transaction.id === id
        );


    if (!item) {

        return;

    }


    document.getElementById("editDate").value =
        item.date;


    document.getElementById("editType").value =
        item.type;


    document.getElementById("editPayment").value =
        item.payment;


    document.getElementById("editAmount").value =
        item.amount;


    document.getElementById("editPerson").value =
        item.person || "";


    document.getElementById("editNote").value =
        item.note || "";


    editModal.classList.add("show");

}


/* ==========================================
   إغلاق نافذة التعديل
========================================== */

closeEditModal.addEventListener("click", () => {

    editModal.classList.remove("show");

});


/* ==========================================
   إغلاق عند الضغط خارج النافذة
========================================== */

window.addEventListener("click", event => {

    if (event.target === editModal) {

        editModal.classList.remove("show");

    }

});


/* ==========================================
   حفظ التعديل
========================================== */

updateTransactionButton.addEventListener(
    "click",
    () => {

        if (currentId === null) {

            return;

        }


        const index =
            transactions.findIndex(
                transaction =>
                    transaction.id === currentId
            );


        if (index === -1) {

            return;

        }


        /* ==========================
           تحديث البيانات
        ========================== */

        transactions[index].date =
            document.getElementById(
                "editDate"
            ).value;


        transactions[index].type =
            document.getElementById(
                "editType"
            ).value;


        transactions[index].payment =
            document.getElementById(
                "editPayment"
            ).value;


        transactions[index].amount =
            Number(
                document.getElementById(
                    "editAmount"
                ).value
            );


        transactions[index].person =
            document.getElementById(
                "editPerson"
            ).value.trim();


        transactions[index].note =
            document.getElementById(
                "editNote"
            ).value.trim();


        /* ==========================
           الحفظ
        ========================== */

        STORAGE.saveTransactions(
            transactions
        );


        /* ==========================
           إغلاق النافذة
        ========================== */

        editModal.classList.remove("show");


        /* ==========================
           إعادة عرض السجل
        ========================== */

        applyFilters();


        currentId = null;

    }
);
/* ==========================================
   Financial System
   Professional Print
   Part 4
========================================== */


/* ==========================================
   Print Button
========================================== */

const printButton =
    document.getElementById("printMonth");


if (printButton) {

    printButton.addEventListener(
        "click",
        printReport
    );

}


/* ==========================================
   Print Report
========================================== */

function printReport() {


    /* ==========================
       قراءة الفلاتر
    ========================== */

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedFromDate =
    fromDate.value;

const selectedToDate =
    toDate.value;


    const selectedType =
        typeFilter
            ? typeFilter.value
            : "";


    const selectedPayment =
        paymentFilter
            ? paymentFilter.value
            : "";


    /* ==========================
       تطبيق الفلاتر
    ========================== */

    let reportData =
        transactions.filter(item => {


            const person =
                String(item.person || "")
                    .toLowerCase();


            const note =
                String(item.note || "")
                    .toLowerCase();


            const matchesSearch =
                !searchValue ||
                person.includes(searchValue) ||
                note.includes(searchValue);


            const matchesFromDate =
    !selectedFromDate ||
    item.date >= selectedFromDate;


const matchesToDate =
    !selectedToDate ||
    item.date <= selectedToDate;


            const matchesType =
                !selectedType ||
                item.type === selectedType;


            const matchesPayment =
                !selectedPayment ||
                item.payment === selectedPayment;


            return (
    matchesSearch &&
    matchesFromDate &&
    matchesToDate &&
    matchesType &&
    matchesPayment
);

        });


    /* ==========================
       ترتيب العمليات
    ========================== */

    reportData.sort((a, b) => {

        return new Date(b.date) -
               new Date(a.date);

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


        /* ==========================
           الصرف
        ========================== */

        if (item.type === "expense") {


            totalExpenses += amount;


            if (item.payment === "cash") {

                cashWithdrawals++;

                cashWithdrawalsTotal +=
                    amount;

            }


            if (item.payment === "bank") {

                bankWithdrawals++;

                bankWithdrawalsTotal +=
                    amount;

            }

        }


        /* ==========================
           الإيداع
        ========================== */

        if (item.type === "income") {


            totalIncome += amount;


            if (item.payment === "cash") {

                cashDeposits++;

                cashDepositsTotal +=
                    amount;

            }


            if (item.payment === "bank") {

                bankDeposits++;

                bankDepositsTotal +=
                    amount;

            }

        }

    });


/* ==========================
   اسم الفترة
========================== */

let periodText = "جميع الحركات";


if (selectedFromDate && selectedToDate) {

    periodText =
        `من ${selectedFromDate} إلى ${selectedToDate}`;

} else if (selectedFromDate) {

    periodText =
        `من ${selectedFromDate}`;

} else if (selectedToDate) {

    periodText =
        `حتى ${selectedToDate}`;

}


    /* ==========================
       نوع التقرير
    ========================== */

    let reportTitle =
        "كشف الحركات المالية";


    if (
        selectedType === "expense"
    ) {

        reportTitle =
            "كشف عمليات الصرف";

    }


    if (
        selectedType === "income"
    ) {

        reportTitle =
            "كشف عمليات الإيداع";

    }


    /* ==========================
       تاريخ التقرير
    ========================== */

    const today =
        new Date();


    const generatedDate =
        today.toLocaleDateString(
            "ar-SA",
            {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        );


    /* ==========================
       جدول العمليات
    ========================== */

    let rows = "";


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
                Number(item.amount)
                    .toLocaleString(
                        "ar-SA",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    );


            const date =
                new Date(item.date)
                    .toLocaleDateString(
                        "en-GB"
                    );


            rows += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${date}
                    </td>

                    <td>
                        ${type}
                    </td>

                    <td>
                        ${payment}
                    </td>

                    <td>
                        ${item.person || "-"}
                    </td>

                    <td>
                        ${item.note || "-"}
                    </td>

                    <td class="amount">
                        ${amount} ريال
                    </td>

                </tr>

            `;

        }
    );


    /* ==========================
       لا توجد بيانات
    ========================== */

    if (!rows) {

        rows = `

            <tr>

                <td
                    colspan="7"
                    class="empty-print">

                    لا توجد عمليات
                    مطابقة للفلاتر المحددة

                </td>

            </tr>

        `;

    }


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
       التقرير
    ========================== */

    printWindow.document.write(`

<!DOCTYPE html>

<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<title>
    ${reportTitle}
</title>


<style>

@page {

    size: A4 portrait;

    margin: 10mm;

}


* {

    box-sizing: border-box;

}


body {

    margin: 0;

    background: #fff;

    color: #111;

    font-family:
        Arial,
        Tahoma,
        sans-serif;

    direction: rtl;

}


.report {

    width: 100%;

}


/* ==========================
   Header
========================== */

.report-header {

    background: #2478b9;

    color: #fff;

    text-align: center;

    padding: 14px 18px;

    margin-bottom: 10px;

}


.report-header h1 {

    margin: 0 0 5px;

    font-size: 20px;

    font-weight: 700;

}


.report-header h2 {

    margin: 0;

    font-size: 14px;

    font-weight: 500;

}


/* ==========================
   Meta
========================== */

.report-meta {

    display: flex;

    justify-content:
        space-between;

    margin-bottom: 10px;

    font-size: 10px;

    color: #555;

}


/* ==========================
   Table
========================== */

table {

    width: 100%;

    border-collapse:
        collapse;

    table-layout: fixed;

}


thead {

    display: table-header-group;

}


tr {

    page-break-inside:
        avoid;

}


th {

    background: #f1f3f5;

    border: 1px solid #d5d5d5;

    padding: 6px 4px;

    font-size: 9px;

    font-weight: 700;

    text-align: center;

}


td {

    border: 1px solid #ddd;

    padding: 5px 4px;

    font-size: 9px;

    text-align: center;

    vertical-align: middle;

    line-height: 1.35;

}


tbody tr:nth-child(even) {

    background: #fafafa;

}


td.amount {

    font-weight: 700;

    white-space:
        nowrap;

}


/* الأعمدة */

th:nth-child(1),
td:nth-child(1) {

    width: 5%;

}


th:nth-child(2),
td:nth-child(2) {

    width: 11%;

}


th:nth-child(3),
td:nth-child(3) {

    width: 10%;

}


th:nth-child(4),
td:nth-child(4) {

    width: 10%;

}


th:nth-child(5),
td:nth-child(5) {

    width: 17%;

}


th:nth-child(6),
td:nth-child(6) {

    width: 31%;

}


th:nth-child(7),
td:nth-child(7) {

    width: 16%;

}


.empty-print {

    padding: 25px;

    font-size: 12px;

}


/* ==========================
   Summary
========================== */

.summary-title {

    margin-top: 12px;

    margin-bottom: 6px;

    font-size: 12px;

    font-weight: 700;

}


.summary {

    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    width: 100%;

    border: 1px solid #d5d5d5;

}


.summary-box {

    min-height: 62px;

    text-align: center;

    padding: 7px;

    border-left:
        1px solid #d5d5d5;

}


.summary-box:last-child {

    border-left: none;

}


.summary-box .label {

    display: block;

    font-size: 9px;

    color: #555;

    margin-bottom: 4px;

}


.summary-box .count {

    display: block;

    font-size: 13px;

    font-weight: 700;

    margin-bottom: 3px;

}


.summary-box .summary-amount {

    display: block;

    font-size: 10px;

    font-weight: 600;

    color: #333;

}


/* ==========================
   Totals
========================== */

.totals {

    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    margin-top: 8px;

    border: 1px solid #d5d5d5;

}


.total-box {

    text-align: center;

    padding: 7px;

    border-left:
        1px solid #d5d5d5;

}


.total-box:last-child {

    border-left: none;

}


.total-box .label {

    display: block;

    font-size: 9px;

    color: #555;

    margin-bottom: 4px;

}


.total-box strong {

    font-size: 12px;

}


/* ==========================
   Footer
========================== */

.report-footer {

    margin-top: 14px;

    padding-top: 7px;

    border-top:
        1px solid #ddd;

    display: flex;

    justify-content:
        space-between;

    font-size: 8px;

    color: #777;

}


@media print {

    body {

        -webkit-print-color-adjust:
            exact;

        print-color-adjust:
            exact;

    }

}

</style>

</head>


<body>


<div class="report">


    <div class="report-header">

        <h1>
            نظام إدارة الصندوق
        </h1>

        <h2>
            ${reportTitle} — ${periodText}
        </h2>

    </div>


    <div class="report-meta">

        <span>

            الفترة:
            ${periodText}

        </span>


        <span>

            تاريخ استخراج التقرير:
            ${generatedDate}

        </span>

    </div>


    <table>

        <thead>

            <tr>

                <th>#</th>

                <th>التاريخ</th>

                <th>نوع العملية</th>

                <th>طريقة الدفع</th>

                <th>المستفيد</th>

                <th>البيان</th>

                <th>المبلغ</th>

            </tr>

        </thead>


        <tbody>

            ${rows}

        </tbody>

    </table>


    <div class="summary-title">

        ملخص العمليات

    </div>


    <div class="summary">


        <div class="summary-box">

            <span class="label">
                سحب بنكي
            </span>

            <strong class="count">
                ${bankWithdrawals} عملية
            </strong>

            <span class="summary-amount">

                ${
                    bankWithdrawalsTotal
                        .toLocaleString(
                            "ar-SA",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )
                }

                ريال

            </span>

        </div>


        <div class="summary-box">

            <span class="label">
                سحب كاش
            </span>

            <strong class="count">
                ${cashWithdrawals} عملية
            </strong>

            <span class="summary-amount">

                ${
                    cashWithdrawalsTotal
                        .toLocaleString(
                            "ar-SA",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )
                }

                ريال

            </span>

        </div>


        <div class="summary-box">

            <span class="label">
                إيداع بنكي
            </span>

            <strong class="count">
                ${bankDeposits} عملية
            </strong>

            <span class="summary-amount">

                ${
                    bankDepositsTotal
                        .toLocaleString(
                            "ar-SA",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )
                }

                ريال

            </span>

        </div>


        <div class="summary-box">

            <span class="label">
                إيداع كاش
            </span>

            <strong class="count">
                ${cashDeposits} عملية
            </strong>

            <span class="summary-amount">

                ${
                    cashDepositsTotal
                        .toLocaleString(
                            "ar-SA",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )
                }

                ريال

            </span>

        </div>


    </div>


    <div class="totals">


        <div class="total-box">

            <span class="label">
                إجمالي المصروفات
            </span>

            <strong>

                ${
                    totalExpenses
                        .toLocaleString(
                            "ar-SA",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )
                }

                ريال

            </strong>

        </div>


        <div class="total-box">

            <span class="label">
                إجمالي الإيداعات
            </span>

            <strong>

                ${
                    totalIncome
                        .toLocaleString(
                            "ar-SA",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )
                }

                ريال

            </strong>

        </div>


        <div class="total-box">

            <span class="label">
                إجمالي عدد العمليات
            </span>

            <strong>

                ${reportData.length}

                عملية

            </strong>

        </div>


    </div>


    <div class="report-footer">

        <span>
            نظام إدارة الصندوق
        </span>

        <span>
            تقرير مالي
        </span>

    </div>


</div>


<script>

window.onload = function() {

    window.print();

};


window.onafterprint = function() {

    window.close();

};

</script>


</body>

</html>

    `);


    printWindow.document.close();

}
