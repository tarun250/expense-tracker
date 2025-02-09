document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("add-expense-btn").addEventListener("click", () => {
        let name = document.getElementById("expense-name").value;
        let amount = document.getElementById("expense-amount").value;
        let category = document.getElementById("expense-category").value;

        if (name && amount) {
            addExpense(name, parseFloat(amount), category);
        }
    });

    fetchCurrencies();
    loadExpenses();
});

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let myChart = null;
let exchangeRates = {}; // Stores currency rates

// ✅ Add Expense Function
function addExpense(name, amount, category) {
    expenses.push({ name, amount, category });
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateTable();
    updateChart();
    fetchAdvice();
}

// ✅ Delete Expense Function
function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateTable();
    updateChart();
}

// ✅ Update Expenses Table
function updateTable() {
    const tableBody = document.getElementById("expense-table");
    tableBody.innerHTML = "";
    expenses.forEach((expense, index) => {
        const row = `<tr>
            <td>${expense.name}</td>
            <td>${convertCurrency(expense.amount)}</td>
            <td>${expense.category}</td>
            <td><button onclick="deleteExpense(${index})">❌</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// ✅ Update Pie Chart
function updateChart() {
    const ctx = document.getElementById("expense-chart").getContext("2d");

    if (myChart) {
        myChart.destroy();
    }

    const categories = ["Food", "Transport", "Entertainment", "Bills", "Other"];
    const categoryData = categories.map(cat => 
        expenses.filter(exp => exp.category === cat)
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
    );

    myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                data: categoryData,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// ✅ Fetch Currencies & Update UI
function fetchCurrencies() {
    fetch("https://open.er-api.com/v6/latest/USD?apikey=YOUR_API_KEY")
        .then(response => response.json())
        .then(data => {
            exchangeRates = data.rates;
            let currencySelector = document.getElementById("currency-selector");
            currencySelector.innerHTML = Object.keys(exchangeRates).map(currency => 
                `<option value="${currency}">${currency}</option>`
            ).join("");
            document.getElementById("conversion-rate").innerText = `💱 1 USD = ${exchangeRates.INR.toFixed(2)} INR`;
        })
        .catch(error => console.error("Error fetching exchange rates:", error));
}

// ✅ Convert Amount Based on Selected Currency
function convertCurrency(amount) {
    let selectedCurrency = document.getElementById("currency-selector").value;
    let rate = exchangeRates[selectedCurrency] || 1;
    return (amount * rate).toFixed(2) + " " + selectedCurrency;
}

// ✅ Fetch Financial Advice
function fetchAdvice() {
    fetch("https://api.adviceslip.com/advice")
        .then(response => response.json())
        .then(data => {
            document.getElementById("advice-box").innerText = `💡 Tip: ${data.slip.advice}`;
        })
        .catch(error => {
            console.error("Error fetching advice:", error);
            document.getElementById("advice-box").innerText = "💡 Save money, live better! 😉";
        });
}

// ✅ Load Expenses on Page Load
function loadExpenses() {
    updateTable();
    updateChart();
    fetchAdvice();
}
document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;

    // Check localStorage for dark mode preference
    if (localStorage.getItem("dark-mode") === "enabled") {
        body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        // Save preference in localStorage
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
        } else {
            localStorage.setItem("dark-mode", "disabled");
        }
    });
});

