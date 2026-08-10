/* ==========================================
   Financial System
   History Page
========================================== */

const historyContainer = document.getElementById("historyContainer");
const searchInput = document.getElementById("searchInput");
const monthFilter = document.getElementById("monthFilter");

let transactions = STORAGE.getTransactions();

/* ==========================================
   Render
========================================== */

renderHistory(transactions);

function renderHistory(data){

    historyContainer.innerHTML = "";

    if(data.length === 0){

        historyContainer.innerHTML = `
            <div class="empty-state">

                لا توجد أي عمليات

            </div>
        `;

        return;

    }

    data.forEach(item=>{

        historyContainer.innerHTML += `

        <div class="transaction-card">

            <div class="transaction-top">

                <span class="${item.type}">

                    ${item.type==="expense" ? "صرف" : "إيداع"}

                </span>

                <strong>

                    ${Number(item.amount).toLocaleString("ar-SA")} ريال

                </strong>

            </div>

            <div class="transaction-body">

                <p>${item.person}</p>

                <small>${item.note}</small>

            </div>

            <div class="transaction-footer">

                <span>

                    ${item.payment==="cash" ? "كاش" : "بنك"}

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
   Search
========================================== */

searchInput.addEventListener("input",()=>{

    const value = searchInput.value
        .toLowerCase()
        .trim();

    const result = transactions.filter(item=>{

        return (

            item.person.toLowerCase().includes(value)

            ||

            item.note.toLowerCase().includes(value)

        );

    });

    renderHistory(result);

});

/* ==========================================
   Month Filter
========================================== */

monthFilter.addEventListener("change",()=>{

    if(monthFilter.value===""){

        renderHistory(transactions);

        return;

    }

    const result = transactions.filter(item=>{

        return item.date.startsWith(monthFilter.value);

    });

    renderHistory(result);

});
/* ==========================================
   Delete Transaction
========================================== */

function deleteTransaction(id){

    const confirmDelete = confirm("هل تريد حذف هذه الحركة؟");

    if(!confirmDelete) return;

    STORAGE.deleteTransaction(id);

    transactions = STORAGE.getTransactions();

    renderHistory(transactions);

}

/* ==========================================
   Edit Transaction
========================================== */

const editModal =
document.getElementById("editModal");

const closeEditModal =
document.getElementById("closeEditModal");

const updateTransaction =
document.getElementById("updateTransaction");

let currentId = null;

function editTransaction(id){

    currentId = id;

    const item =
    transactions.find(t=>t.id===id);

    if(!item) return;

    document.getElementById("editDate").value =
    item.date;

    document.getElementById("editType").value =
    item.type;

    document.getElementById("editPayment").value =
    item.payment;

    document.getElementById("editAmount").value =
    item.amount;

    document.getElementById("editPerson").value =
    item.person;

    document.getElementById("editNote").value =
    item.note;

    editModal.classList.add("show");

}

/* ==========================================
   Close Modal
========================================== */

closeEditModal.onclick=()=>{

    editModal.classList.remove("show");

}

window.addEventListener("click",(e)=>{

    if(e.target===editModal){

        editModal.classList.remove("show");

    }

});

/* ==========================================
   Save Edit
========================================== */

updateTransaction.addEventListener("click",()=>{

    const index =
    transactions.findIndex(t=>t.id===currentId);

    if(index===-1) return;

    transactions[index].date =
    document.getElementById("editDate").value;

    transactions[index].type =
    document.getElementById("editType").value;

    transactions[index].payment =
    document.getElementById("editPayment").value;

    transactions[index].amount =
    Number(document.getElementById("editAmount").value);

    transactions[index].person =
    document.getElementById("editPerson").value;

    transactions[index].note =
    document.getElementById("editNote").value;

    STORAGE.saveTransactions(transactions);

    editModal.classList.remove("show");

    renderHistory(transactions);

});
/* ==========================================
   Professional Print Report
========================================== */

document
.getElementById("printMonth")
.addEventListener("click", printReport);


function printReport() {

    const selectedMonth = monthFilter.value;

    let reportData = [...transactions];

    /* ==========================
       فلترة الشهر
    ========================== */

    if (selectedMonth) {

        reportData = reportData.filter(item => {

            return item.date.startsWith(selectedMonth);

        });

    }

    /* ==========================
       ترتيب العمليات
    ========================== */

    reportData.sort((a, b) => {

        return new Date(b.date) - new Date(a.date);

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

        const amount = Number(item.amount) || 0;

if (item.type === "expense") {

    totalExpenses += amount;

    if (item.payment === "cash") {

        cashWithdrawals++;

        cashWithdrawalsTotal += amount;

    }

    if (item.payment === "bank") {

        bankWithdrawals++;

        bankWithdrawalsTotal += amount;

    }

}

if (item.type === "income") {

    totalIncome += amount;

    if (item.payment === "cash") {

        cashDeposits++;

        cashDepositsTotal += amount;

    }

    if (item.payment === "bank") {

        bankDeposits++;

        bankDepositsTotal += amount;

    }

}

    });

    /* ==========================
       اسم الفترة
    ========================== */

    let periodText = "جميع الحركات";

    if (selectedMonth) {

        const [year, month] = selectedMonth.split("-");

        const date = new Date(
            Number(year),
            Number(month) - 1,
            1
        );

        const monthName = date.toLocaleDateString(
            "ar-SA",
            {
                month: "long"
            }
        );

        periodText = `${monthName} ${year}`;

    }

    /* ==========================
       تاريخ استخراج التقرير
    ========================== */

    const today = new Date();

    const generatedDate =
        today.toLocaleDateString("ar-SA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });

    /* ==========================
       جدول العمليات
    ========================== */

    let rows = "";

    reportData.forEach((item, index) => {

        const type =
            item.type === "expense"
                ? "سحب"
                : "إيداع";

        const payment =
            item.payment === "cash"
                ? "كاش"
                : "بنك";

        const amount =
            Number(item.amount).toLocaleString(
                "ar-SA",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

        const date =
            new Date(item.date).toLocaleDateString(
                "en-GB"
            );

        rows += `

        <tr>

            <td>${index + 1}</td>

            <td>${date}</td>

            <td>${type}</td>

            <td>${payment}</td>

            <td>${item.person || "-"}</td>

            <td>${item.note || "-"}</td>

            <td class="amount">
                ${amount} ريال
            </td>

        </tr>

        `;

    });

    if (!rows) {

        rows = `

        <tr>

            <td colspan="7" class="empty-print">

                لا توجد عمليات خلال الفترة المحددة

            </td>

        </tr>

        `;

    }

    /* ==========================
       إنشاء التقرير
    ========================== */

    const printWindow = window.open(
        "",
        "_blank",
        "width=1200,height=900"
    );

    printWindow.document.write(`

<!DOCTYPE html>

<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<title>كشف الحركات المالية</title>

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

    font-family: Arial, Tahoma, sans-serif;

    color: #111;

    background: #fff;

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

    padding: 15px 20px;

    margin-bottom: 12px;

    border-radius: 2px;

}

.report-header h1 {

    margin: 0 0 6px;

    font-size: 21px;

    font-weight: 700;

}

.report-header h2 {

    margin: 0;

    font-size: 15px;

    font-weight: 500;

}

.report-meta {

    display: flex;

    justify-content: space-between;

    align-items: center;

    font-size: 11px;

    margin-bottom: 10px;

    color: #444;

}

/* ==========================
   Table
========================== */

table {

    width: 100%;

    border-collapse: collapse;

    table-layout: fixed;

}

thead {

    display: table-header-group;

}

tr {

    page-break-inside: avoid;

}

th {

    background: #f1f3f5;

    border: 1px solid #d5d5d5;

    padding: 7px 5px;

    font-size: 10px;

    font-weight: 700;

    text-align: center;

}

td {

    border: 1px solid #ddd;

    padding: 6px 5px;

    font-size: 9.5px;

    line-height: 1.45;

    vertical-align: middle;

    text-align: center;

}

tbody tr:nth-child(even) {

    background: #fafafa;

}

td.amount {

    font-weight: 700;

    white-space: nowrap;

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

    margin-top: 14px;

    margin-bottom: 7px;

    font-size: 13px;

    font-weight: 700;

}

.summary {

    display: grid;

    grid-template-columns: repeat(4, 1fr);

    border: 1px solid #d5d5d5;

}

.summary-box {

    min-height: 55px;

    border-left: 1px solid #d5d5d5;

    text-align: center;

    padding: 7px;

}

.summary-box:last-child {

    border-left: none;

}

.summary-box .label {

    display: block;

    font-size: 9px;

    color: #555;

    margin-bottom: 6px;

}
.summary-box .count {

    display: block;

    font-size: 15px;

    font-weight: 700;

    margin-bottom: 4px;

}

.summary-box .summary-amount {

    display: block;

    font-size: 11px;

    font-weight: 600;

    color: #333;

}
.summary-box .number {

    display: block;

    font-size: 17px;

    font-weight: 700;

}

/* ==========================
   Totals
========================== */

.totals {

    display: grid;

    grid-template-columns: 1fr 1fr 1fr;

    margin-top: 10px;

    border: 1px solid #d5d5d5;

}

.total-box {

    text-align: center;

    padding: 9px;

    border-left: 1px solid #d5d5d5;

}

.total-box:last-child {

    border-left: none;

}

.total-box .label {

    font-size: 9px;

    color: #555;

    display: block;

    margin-bottom: 5px;

}

.total-box strong {

    font-size: 13px;

}

/* ==========================
   Footer
========================== */

.report-footer {

    margin-top: 18px;

    padding-top: 8px;

    border-top: 1px solid #ddd;

    display: flex;

    justify-content: space-between;

    font-size: 9px;

    color: #777;

}

@media print {

    body {

        -webkit-print-color-adjust: exact;

        print-color-adjust: exact;

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
            كشف الحركات المالية — ${periodText}
        </h2>

    </div>

    <div class="report-meta">

        <span>
            الفترة: ${periodText}
        </span>

        <span>
            تاريخ استخراج التقرير: ${generatedDate}
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

        ملخص عدد العمليات

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
            ${bankWithdrawalsTotal.toLocaleString("ar-SA", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} ريال
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
            ${cashWithdrawalsTotal.toLocaleString("ar-SA", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} ريال
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
            ${bankDepositsTotal.toLocaleString("ar-SA", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} ريال
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
            ${cashDepositsTotal.toLocaleString("ar-SA", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} ريال
        </span>

    </div>

</div>

        <div class="summary-box">

            <span class="label">
                سحب كاش
            </span>

            <span class="number">
                ${cashWithdrawals}
            </span>

        </div>

        <div class="summary-box">

            <span class="label">
                إيداع بنكي
            </span>

            <span class="number">
                ${bankDeposits}
            </span>

        </div>

        <div class="summary-box">

            <span class="label">
                إيداع كاش
            </span>

            <span class="number">
                ${cashDeposits}
            </span>

        </div>

    </div>

    <div class="totals">

        <div class="total-box">

            <span class="label">
                إجمالي المصروفات
            </span>

            <strong>
                ${totalExpenses.toLocaleString("ar-SA", {
                    minimumFractionDigits: 2
                })} ريال
            </strong>

        </div>

        <div class="total-box">

            <span class="label">
                إجمالي الإيداعات
            </span>

            <strong>
                ${totalIncome.toLocaleString("ar-SA", {
                    minimumFractionDigits: 2
                })} ريال
            </strong>

        </div>

        <div class="total-box">

            <span class="label">
                إجمالي عدد العمليات
            </span>

            <strong>
                ${reportData.length} عملية
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
