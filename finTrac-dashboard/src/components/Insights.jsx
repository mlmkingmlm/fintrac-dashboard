/*
Name - Naveen Kumar
Purpose - This Component Show Chart of Insight
Date - 03-04-2026
*/

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Insights({ transactions }) {
  const [filter, setFilter] = useState("all");

  // Date Filter Logic
  const now = new Date();

  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.date);

    if (filter === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      return date >= startOfWeek;
    }

    if (filter === "month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });

  //  Category wise expense
  const categoryMap = {};

  filteredTransactions.forEach((t) => {
    if (t.type === "expense") {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
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

  const total = filteredTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 space-y-4">

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Insights
        </h2>

        <select
          className="bg-gray-100 dark:bg-slate-700 text-black dark:text-white px-2 py-1 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* 🔥 Insights Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

  {/* Highest Spending */}
  <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg">
    <p className="text-sm text-gray-500 dark:text-gray-300">
      Highest Spending
    </p>
    <h3 className="text-lg font-semibold text-black dark:text-white">
      {highestCategory}
    </h3>
  </div>

  {/* Total Amount */}
  <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg">
    <p className="text-sm text-gray-500 dark:text-gray-300">
      Total Amount
    </p>
    <h3 className="text-lg font-semibold text-green-500">
      ₹{total.toLocaleString()}
    </h3>
  </div>

  {/* Transactions Count */}
  <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg">
    <p className="text-sm text-gray-500 dark:text-gray-300">
      Transactions
    </p>
    <h3 className="text-lg font-semibold text-blue-500">
      {filteredTransactions.length}
    </h3>
  </div>

</div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  color: "white",
                }}
              />

              <Bar
                dataKey="amount"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No expense data
        </p>
      )}
    </div>
  );
}