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
