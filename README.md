# FinTrack Dashboard

A modern **Finance Management Dashboard** built using **React + Tailwind CSS + Recharts**.
It allows users to manage transactions, visualize financial data, and switch between roles with a clean and responsive UI.

---

## Features

### Role-Based Access

* **Admin** → Add, Edit, Delete transactions
* **Viewer** → Read-only access

### Transaction Management

* Add / Update / Delete transactions
* Form validation with UI error handling
* Cascading category dropdown (Income / Expense)

### Data Visualization

* Line Chart → Balance trend
* Pie Chart → Category breakdown
* Bar Chart → Insights (category-wise spending)

### Filters & Sorting

* Search by category
* Filter by type (Income / Expense / All)
* Sort by:

  * Date
  * Amount

### Insights Section

* Highest spending category
* Total amount
* Transaction count
* Weekly / Monthly filtering

### UI/UX

* Dark / Light mode toggle 🌙☀️
* Animated counters for dashboard cards
* Floating action button (+) with modal form
* Icon-based actions (edit/delete)

### Persistence

* Data stored in **localStorage**
* Theme & role persistence

---

## Tech Stack

* **Frontend:** React (Vite)
* **Styling:** Tailwind CSS
* **Charts:** Recharts
* **Icons:** Lucide React
* **State Management:** React Hooks (useState, useEffect)

---

## Project Structure

```
src/
│── components/
│   ├── Charts.jsx
│   ├── DashboardCards.jsx
│   ├── Insights.jsx
│   ├── RoleSwitch.jsx
│   ├── TransactionTable.jsx
│
│── data/
│   └── transaction.js
│
│── App.jsx
│── main.jsx
```

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/fintrack-dashboard.git

# Navigate to project
cd fintrack-dashboard

# Install dependencies
npm install

# Run project
npm run dev
```

---

## 📸 Screenshots

> Add your screenshots here (Dashboard, Charts, Modal, Dark Mode)

---

## 🧠 Key Learnings

* Role-based UI implementation
* Form validation (UI-based errors, not alerts)
* Data visualization with charts
* State persistence using localStorage
* Clean dashboard UI design

---

## 🚀 Future Improvements

* Backend integration (Node.js + MongoDB)
* Authentication system (Login / Signup)
* Export reports (PDF / CSV)
* Real-time data updates

---

## 👨‍💻 Author

**Naveen Kumar**

---
