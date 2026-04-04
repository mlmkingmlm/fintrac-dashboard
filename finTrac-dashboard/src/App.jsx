import { useState, useEffect } from "react";
import { initialTransactions } from "./data/transactions";

import RoleSwitcher from "./components/RoleSwitch";
import DashboardCards from "./components/DashboardCards";
import Charts from "./components/Charts";
import TransactionsTable from "./components/TransactionTable";
import Insights from "./components/Insights";
import { Sun, Moon } from "lucide-react";

function App() {
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || "viewer";
  });

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  // Save transactions
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    //  IMPORTANT WRAPPER
    <div className={theme === "dark" ? "dark" : ""}>

      {/*  THEME APPLY */}
      <div className="min-h-screen bg-white dark:bg-slate-900 text-black dark:text-white p-6 space-y-6 transition-colors duration-300">

        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">FinTrack Dashboard</h1>

          <div className="flex gap-3 items-center">
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 hover:scale-105 transition"
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-yellow-500" />
              ) : (
                <Moon size={18} className="text-blue-400" />
              )}
            </button>

            {/* Role */}
            <RoleSwitcher role={role} setRole={setRole} />
          </div>
        </div>

        {/* Components */}
        <DashboardCards transactions={transactions} />
        <Charts transactions={transactions} />

        <TransactionsTable
          transactions={transactions}
          setTransactions={setTransactions}
          role={role}
        />

        <Insights transactions={transactions} />
      </div>
    </div>
  );
}

export default App;