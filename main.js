// Interactive Dashboard

// Get elements from html
const buttonsNav = document.querySelector("#btns-nav");
const allNavButtons = document.querySelectorAll(".nav-btn");
const tabContent = document.querySelectorAll(".tab-content");
const changeThemeButton = document.querySelector("#theme-toggle-btn");
const orderForm = document.querySelector("#order-form");
const clientNameInput = document.querySelector("#client-name-input");
const orderSumInput = document.querySelector("#order-sum-input");
const orderStatusSelect = document.querySelector("#order-status-select");
const createOrderButton = document.querySelector("#create-order-btn");
const ordersBlock = document.querySelector("#orders-block");
const ordersList = document.querySelector("#orders-list");
const overviewChart = document.querySelector("#overview-chart");
const totalRevenue = document.querySelector("#total-revenue");
const totalClients = document.querySelector("#total-clients");
const conversionRate = document.querySelector("#conversion-rate");

// Check which theme is saved in localStorage
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    changeThemeButton.textContent = "☀️";
} else {
    changeThemeButton.textContent = "🌙";
}

// Logic for the theme toggle button
changeThemeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
        changeThemeButton.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        changeThemeButton.textContent = "🌙";
    }
});

// Logic for showing blocks and toggling the hidden class
buttonsNav.addEventListener("click", (event) => {
    if (event.target.classList.contains("nav-btn")) {
        const targetId = event.target.dataset.tab;

        tabContent.forEach(tab => tab.classList.add("hidden"));

        const activeTab = document.querySelector("#tab-" + targetId);
        activeTab.classList.remove("hidden");

        allNavButtons.forEach(btn => btn.classList.remove("active"));
        event.target.classList.add("active");
    }
});

// Create order logic
const saved = localStorage.getItem("orders");
let orders = [];

if (saved !== null) {
    orders = JSON.parse(saved);
} else {
    const exampleOrder = {
        id: "1770",
        client: "Ivan",
        amount: "250",
        status: "Completed"
    };

    orders.unshift(exampleOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
}

// Render an order in the orders list
const renderOrder = (order) => {
    ordersList.insertAdjacentHTML("afterbegin", `
        <li>
            <div class="in-order-list-block">
                <h4>Client: ${order.client}</h4>
                <p>Order ID: <span class="order-id">${order.id}</span></p>
                <p>Total: <span class="order-amount">$${order.amount}</span></p>
                <p>Status: <span class="order-status">${order.status}</span></p>
                <button class="delete-btn" data-id="${order.id}">✕</button>
            </div>
        </li>
    `);
};

// Render all saved orders
orders.slice().reverse().forEach(order => renderOrder(order));

ordersList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        const id = event.target.dataset.id;

        orders = orders.filter(order => order.id !== id);
        localStorage.setItem("orders", JSON.stringify(orders));
        syncMetrics();

        event.target.closest("li").remove();
    }
});

orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const order = {
        id: String(Date.now()).slice(-8),
        client: clientNameInput.value,
        amount: Number(orderSumInput.value),
        status: orderStatusSelect.options[orderStatusSelect.selectedIndex].text
    };

    orders.unshift(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    syncMetrics();

    orderForm.reset();

    renderOrder(order);
});

// Chart rendering logic in the Overview block
const mainChart = new Chart(overviewChart, {
    type: "line",
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: "Weekly Revenue ($)",
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

const syncMetrics = () => {
    const revenue = orders.reduce((total, order) => {
        return total + order.amount;
    }, 0);

    totalRevenue.textContent = `$${revenue}`;

    totalClients.textContent = `${orders.length}`;

    if (orders.length === 0) {
        conversionRate.textContent = "0%";
    } else {
        const completedOrders = orders.filter(order => order.status.toLowerCase() === "completed");

        const conversion = (completedOrders.length / orders.length) * 100;

        conversionRate.textContent = `${conversion.toFixed(1)}%`;
    }

    let today = new Date().getDay();

    if (today === 0) {
        today = 6;
    } else {
        today = today - 1;
    }

    mainChart.data.datasets[0].data[today] = revenue;
    mainChart.update();
};

syncMetrics();