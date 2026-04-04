/*
Name - Naveen Kumar
Purpose - Insights Component with cards and Chart
*/

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Insights({ transactions }) {
  const [filter, setFilter] = useState("all");

  const now = new Date();

  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.date);

    if (filter === "week") {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      return date >= start;
    }

    if (filter === "month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });

  // CATEGORY DATA
  const categoryMap = {};
  let income = 0;
  let expense = 0;

  filteredTransactions.forEach((t) => {
    if (t.type === "expense") {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
      expense += t.amount;
    } else {
      income += t.amount;
    }
  });

  const chartData = Object.keys(categoryMap).map((key) => ({
    category: key,
    amount: categoryMap[key],
  }));

  const highestCategory =
    chartData.length > 0
      ? chartData.reduce((a, b) =>
          a.amount > b.amount ? a : b
        ).category
      : "N/A";

  const balance = income - expense;


let insights = [];

// 1. Highest spending category
if (highestCategory !== "N/A") {
  insights.push(`You spent most on ${highestCategory} this period 💸`);
}

// 2. Expense increase/decrease (compare last vs current)
const prevTransactions = transactions.filter((t) => {
  const date = new Date(t.date);
  const prev = new Date(now);
  prev.setMonth(now.getMonth() - 1);

  return (
    date.getMonth() === prev.getMonth() &&
    date.getFullYear() === prev.getFullYear()
  );
});

let prevExpense = 0;
prevTransactions.forEach((t) => {
  if (t.type === "expense") prevExpense += t.amount;
});

if (prevExpense > 0) {
  const change = ((expense - prevExpense) / prevExpense) * 100;

  if (change > 0) {
    insights.push(`Your expenses increased by ${change.toFixed(0)}% 📈`);
  } else {
    insights.push(`Great! Expenses decreased by ${Math.abs(change).toFixed(0)}% 📉`);
  }
}

// 3. Balance health
if (balance < 0) {
  insights.push("Warning: You are spending more than earning ⚠️");
} else if (balance > 0) {
  insights.push("Good job! You are saving money 💰");
}

// 4. Low transactions
if (filteredTransactions.length < 3) {
  insights.push("Very few transactions — start tracking more 📊");
}

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Insights</h2>

        <select
          className="bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Highest */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow">
          <p className="text-sm opacity-80">Top Category</p>
          <h3 className="text-lg font-semibold">{highestCategory}</h3>
        </div>

        {/* Income */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow">
          <p className="text-sm opacity-80">Income</p>
          <h3 className="text-lg font-semibold">
            ₹{income.toLocaleString()}
          </h3>
        </div>

        {/* Expense */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow">
          <p className="text-sm opacity-80">Expense</p>
          <h3 className="text-lg font-semibold">
            ₹{expense.toLocaleString()}
          </h3>
        </div>

        {/* Balance */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow">
          <p className="text-sm opacity-80">Balance</p>
          <h3 className="text-lg font-semibold">
            ₹{balance.toLocaleString()}
          </h3>
        </div>

      </div>

      {/* SMART INSIGHTS UI */}
<div className="bg-indigo-50 dark:bg-slate-700 p-4 rounded-xl space-y-2">
  <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
    Smart Insights
  </h3>

  {insights.length > 0 ? (
    insights.map((text, i) => (
      <p key={i} className="text-sm text-gray-700 dark:text-gray-200">
        • {text}
      </p>
    ))
  ) : (
    <p className="text-sm text-gray-400">No insights available</p>
  )}
</div>

      {/* CHART */}
      {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>

              <defs>
                <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />

<Tooltip
  formatter={(value) => [`₹${value}`, "Amount"]}
  labelFormatter={(label) => `Category: ${label}`}
  contentStyle={{
    backgroundColor: "#1e293b",
    border: "none",
    borderRadius: "8px",
    color: "white",
  }}
/>
              <Legend />

              <Bar
                dataKey="amount"
                fill="url(#barColor)"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-gray-400 text-center">
          No expense data available
        </p>
      )}
    </div>
  );
}
