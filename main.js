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

// Check which theme is saved in localStorage
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
}

// Logic for the theme toggle button
changeThemeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
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
let orders = [];

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

ordersList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
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

    orderForm.reset();

    renderOrder(order);
});