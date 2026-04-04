/*
Name - Naveen Kumar
Purpose - This Component for Showing Category Chart and Balance Chart on UI
Date - 03-04-2026
*/

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#facc15"];

export default function Charts({ transactions }) {
  // Line Chart Data
  const monthlyData = {};

  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });

    monthlyData[month] = (monthlyData[month] || 0) + t.amount;
  });

  const lineData = Object.keys(monthlyData).map((month) => ({
    name: month,
    value: monthlyData[month],
  }));

  // Pie Chart Data
  const categoryMap = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
    }
  });

  const pieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  return (
    <div className="grid md:grid-cols-2 gap-4">

      {/* Line Chart */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700">
        <h2 className="mb-3 text-black dark:text-white">
          Balance Trend
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            
            {/* Axis */}
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                color: "white",
              }}
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/*  Pie Chart */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700">
        <h2 className="mb-3 text-black dark:text-white">
          Category Breakdown
        </h2>

        {pieData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No expense data
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}