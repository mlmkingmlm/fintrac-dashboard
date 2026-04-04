/*
Name - Naveen Kumar
Purpose - Modern Charts (Advanced UI)
*/

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ef4444"];

export default function Charts({ transactions }) {
  // 📊 Monthly Income vs Expense
  const monthlyData = {};

  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });

    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expense += t.amount;
    }
  });

  const lineData = Object.keys(monthlyData).map((month) => ({
    name: month,
    income: monthlyData[month].income,
    expense: monthlyData[month].expense,
  }));

  // 🍩 Pie / Donut Data (Expense Category)
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

      {/* 📈 Area Chart */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700">
        <h2 className="mb-3 text-black dark:text-white font-semibold">
          Income vs Expense Trend
        </h2>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={lineData}>

            {/* Gradient */}
            <defs>
              <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>

              <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />

            <Tooltip />

            <Legend />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#incomeColor)"
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#expenseColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 🍩 Donut Chart */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700">
        <h2 className="mb-3 text-black dark:text-white font-semibold">
          Expense Breakdown
        </h2>

        {pieData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
            No expense data
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}
