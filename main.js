// Interactive Dashboard

// Get elements from html
const buttonsNav = document.querySelector("#btns-nav");
const allNavButtons = document.querySelectorAll(".nav-btn");
const tabContent = document.querySelectorAll(".tab-content");

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