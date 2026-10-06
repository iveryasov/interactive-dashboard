# ⚡️ Interactive CRM Dashboard

A high-performance Single Page Application (SPA) dashboard built with Vanilla JavaScript. Designed for real-time order tracking, business metrics calculation, and deep state management.

> 🖥️ **Display Architecture Note:**  
> This application is strictly optimized for **Desktop & Wide Displays (1440px+)**. The primary focus of this project is complex Vanilla JavaScript architecture, reactive state management, Chart.js integrations, and DOM manipulation rather than mobile responsive styling.

---

## 🚀 Key Features

* **Dynamic SPA Navigation:** Tab switching engine without page reloads using event delegation and dataset attributes.
* **Order Management Engine:** Real-time order creation, client search, dynamic filtering by status, and order deletion with instant DOM rendering.
* **Reactive Financial Analytics:** Automated calculation of Total Revenue, Conversion Rate, Average Order Value (AOV), and Top Sales using native array methods (`reduce`, `map`, `filter`).
* **Interactive Data Visualizations:** Real-time synchronized charts powered by Chart.js (Revenue Trend Line Chart & Order Status Doughnut Chart) with dynamic empty-state fallbacks.
* **Profile & Localization Control:** On-the-fly currency switching (USD $ / EUR €) and administrator profile name synchronization.
* **Persistent State & Safe Reset:** Full state persistence via `localStorage` with a dedicated factory reset mechanism protecting critical system preferences.
* **Theme Engine:** Persistent Dark / Light mode toggle using CSS Custom Properties.

---

## 🛠️ Tech Stack

* **Logic & State:** Pure Vanilla JavaScript (ES6+, DOM API, Event Delegation, Higher-Order Functions, LocalStorage)
* **Visualizations:** Chart.js
* **Structure:** Semantic HTML5 (`<aside>`, `<header>`, `<main>`, `<section>`)
* **Styling:** Modern CSS3 (CSS Variables, Flexbox, Desktop Layout)

---

## 📦 How to Run

1. Clone or download this repository.
2. Open `index.html` in any modern web browser (best viewed at 1920x1080 / Desktop screen).
3. No build tools, bundlers, or external dependencies required.
