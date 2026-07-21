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
   Print Month
========================================== */

document
.getElementById("printMonth")
.addEventListener("click",()=>{

    window.print();

});