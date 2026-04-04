/*
Name - Naveen Kumar
Purpose - Dashboard UI For Finance Record
Date - 03-04-2026
*/

import { useEffect, useState } from "react";

function useCountUp(value, duration = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return count;
}

// Card Component
function Card({ title, value, color }) {
  const animatedValue = useCountUp(value);

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
      
      {/* Title */}
      <p className="text-gray-500 dark:text-gray-400">
        {title}
      </p>

      {/* Value */}
      <h2 className={`text-2xl font-bold ${color}`}>
        ₹{animatedValue.toLocaleString()}
      </h2>
    </div>
  );
}

export default function DashboardCards({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card title="Balance" value={balance} color="text-blue-500 dark:text-blue-400" />
      <Card title="Income" value={income} color="text-green-600 dark:text-green-400" />
      <Card title="Expense" value={expense} color="text-red-600 dark:text-red-400" />
    </div>
  );
}