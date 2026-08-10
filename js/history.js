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

const monthFilter =
    document.getElementById("monthFilter");


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

monthFilter.addEventListener("change", () => {

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


    const selectedMonth =
        monthFilter.value;


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

            const matchesMonth =
                !selectedMonth ||
                item.date.startsWith(
                    selectedMonth
                );


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
                matchesMonth &&
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
