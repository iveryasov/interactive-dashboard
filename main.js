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
const lastOrdersList = document.querySelector("#last-orders-list");
const searchInput = document.querySelector("#order-search");
const orderStatusSearch = document.querySelector("#order-status-search");
const statusChart = document.querySelector("#status-chart");
const avgOrderValue = document.querySelector("#avg-order-value");
const maxOrderValue = document.querySelector("#max-order-value");
const completedOrdersCount = document.querySelector("#completed-orders-count");
const pendingOrdersCount = document.querySelector("#pending-orders-count");
const chartDonutStatus = document.querySelector("#chart-donut-status");
const currencySelect = document.querySelector("#currency-select");
const adminNameInput = document.querySelector("#admin-name-input");
const confirmNameButton = document.querySelector("#confirm-name-btn");
const adminNameDisplay = document.querySelector("#admin-name-display");
const resetDataButton = document.querySelector("#reset-data-btn");

let currentCurrency = localStorage.getItem("currency") || "$";

currencySelect.addEventListener("change", () => {
    if (currencySelect.value === "usd") {
        currentCurrency = "$";
    } else {
        currentCurrency = "€";
    }

    localStorage.setItem("currency", currentCurrency);

    syncMetrics();
    applyFilters();
});

let adminName = localStorage.getItem("adminName") || "Admin";

adminNameDisplay.textContent = adminName;

confirmNameButton.addEventListener("click", () => {
    if (adminNameInput.value === "") {
        adminName = "Admin";
    } else {
        adminName = `${adminNameInput.value.trim()}`;
    }

    localStorage.setItem("adminName", adminName);

    adminNameDisplay.textContent = adminName;

    adminNameInput.value = "";
});

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
        status: "Completed",
        createdAt: Date.now()
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
                <p>Total: <span class="order-amount">${currentCurrency}${order.amount}</span></p>
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
        status: orderStatusSelect.options[orderStatusSelect.selectedIndex].text,
        createdAt: Date.now()
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

    totalRevenue.textContent = `${currentCurrency}${revenue}`;

    totalClients.textContent = `${orders.length}`;

    if (orders.length === 0) {
        conversionRate.textContent = "0%";
    } else {
        const completedOrders = orders.filter(order => order.status.toLowerCase() === "completed");

        const conversion = (completedOrders.length / orders.length) * 100;

        conversionRate.textContent = `${conversion.toFixed(1)}%`;
    }

    const temporaryArray = [0, 0, 0, 0, 0, 0, 0];

    orders.forEach(order => {
        let suitableDay = new Date(order.createdAt).getDay();

        if (suitableDay === 0) {
            suitableDay = 6;
        } else {
            suitableDay = suitableDay - 1;
        }

        temporaryArray[suitableDay] += order.amount;
    });

    mainChart.data.datasets[0].data = temporaryArray;
    mainChart.update();

    renderLastOrders();

    updateAnalytics();
};

const renderLastOrders = () => {
    lastOrdersList.innerHTML = "";

    const lastOrders = orders.slice(0, 3);

    lastOrders.forEach(order => {
        lastOrdersList.insertAdjacentHTML("afterbegin", `
            <li>
                <div class="in-last-order-list-block">
                    <h4>Client: ${order.client}</h4>
                    <p>Total: <span class="order-amount">${currentCurrency}${order.amount}</span></p>
                    <p>Status: <span class="order-status">${order.status}</span></p>
                </div>
            </li>
        `);
    });
};

const applyFilters = () => {
    ordersList.innerHTML = "";

    // Get the customer name entered by the user in the input
    const userClientSearch = searchInput.value.trim().toLowerCase();

    // Get the selected by user order status
    const userStatusSearch = orderStatusSearch.value;

    const filteredOrders = orders.filter(order => order.client.trim().toLowerCase().includes(userClientSearch) && (userStatusSearch.toLowerCase() === "all" || order.status.toLowerCase() === userStatusSearch));

    filteredOrders.forEach(order => renderOrder(order));
};

searchInput.addEventListener("input", () => {
    applyFilters();
});

orderStatusSearch.addEventListener("change", () => {
    applyFilters();
});

// Declare the donut chart for analyzing completed and pending orders
const donutChart = new Chart(statusChart, {
    type: "doughnut",
    data: {
        labels: ['Completed', 'Pending'],
        datasets: [{
            label: "Completed and pending orders",
            data: [0, 0],
            backgroundColor: ["#22c55e", "#f59e0b"],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: 180,
        cutout: "70%"
    }
});

// Analytics block logic
const updateAnalytics = () => {
    if (orders.length === 0) {
        avgOrderValue.textContent = `${currentCurrency}0`;
        maxOrderValue.textContent = `${currentCurrency}0`;
        completedOrdersCount.textContent = "0";
        pendingOrdersCount.textContent = "0";

        chartDonutStatus.classList.remove("hidden");

        donutChart.data.datasets[0].data = [0, 0];
        donutChart.update();
    } else {
        // Average ticket value. Divide total revenue by the number of orders
        const avgOrder = orders.reduce((total, order) => {
            return total + order.amount;
        }, 0) / orders.length;

        avgOrderValue.textContent = `${currentCurrency}${avgOrder.toFixed(2)}`;

        // Largest bill
        const bills = orders.map(order => order.amount);

        const largestBill = Math.max(...bills);

        maxOrderValue.textContent = `${currentCurrency}${largestBill}`;

        // Completed orders
        const completedOrders = orders.filter(order => order.status.toLowerCase() === "completed");

        completedOrdersCount.textContent = `${completedOrders.length}`;

        // Pending orders
        const pendingOrders = orders.filter(order => order.status.toLowerCase() === "pending");

        pendingOrdersCount.textContent = `${pendingOrders.length}`;

        // Update doughnut chart data
        const ordersStatuses = [completedOrders.length, pendingOrders.length];

        chartDonutStatus.classList.add("hidden");

        donutChart.data.datasets[0].data = ordersStatuses;
        donutChart.update();
    }
};

// Function calls block
syncMetrics();

// Danger zone
resetDataButton.addEventListener("click", () => {
    const confirmWindow = confirm("Are you sure? All orders and stats will be permanently wiped.");

    if (confirmWindow === true) {
        localStorage.removeItem("orders");
        orders = [];

        localStorage.removeItem("adminName");
        adminName = "Admin";
        adminNameDisplay.textContent = adminName;

        localStorage.removeItem("currency");
        currentCurrency = "$";
        currencySelect.value = "usd";
        
        applyFilters();
        syncMetrics();
    } else {
        return null;
    }
});