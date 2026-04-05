import { useState, useEffect } from "react";
import { Pencil, Trash2, ArrowUpDown, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TransactionsTable({
  transactions,
  setTransactions,
  role,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "",
    type: "expense",
  });

  const [errors, setErrors] = useState({});

  const categoryOptions = {
    income: ["Salary", "Freelance", "Bonus"],
    expense: ["Food", "Shopping", "Transport", "Bills"],
  };

  // ADVANCED SEARCH
  const filteredData = transactions.filter((t) => {
    const s = search.toLowerCase();

    return (
      (filter === "all" || t.type === filter) &&
      (t.category.toLowerCase().includes(s) ||
        t.type.toLowerCase().includes(s) ||
        t.amount.toString().includes(s))
    );
  });

  // VALIDATION
  const validate = () => {
    let newErrors = {};
    if (!form.date) newErrors.date = "Date required";
    if (!form.amount || Number(form.amount) <= 0)
      newErrors.amount = "Valid amount required";
    if (!form.category) newErrors.category = "Select category";

    setErrors(newErrors);
    return newErrors;
  };

  const resetForm = () => {
    setForm({
      date: "",
      amount: "",
      category: "",
      type: "expense",
    });
    setErrors({});
    setEditId(null);
  };

  // ADD / UPDATE
  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return;

    if (editId) {
      setTransactions(
        transactions.map((t) =>
          t.id === editId ? { ...form, id: editId, amount: Number(form.amount) } : t
        )
      );
      showToast("Transaction updated ✏️", "success");
    } else {
      setTransactions([
        { ...form, id: Date.now(), amount: Number(form.amount) },
        ...transactions,
      ]);
      showToast("Transaction added ✅", "success");
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (t) => {
    setForm(t);
    setEditId(t.id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setTransactions(transactions.filter((t) => t.id !== deleteId));
    setShowDeleteModal(false);
    showToast("Transaction deleted 🗑️", "error");
  };

  // PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.text("FinTrack Dashboard", 14, 20);

    const tableData = transactions.map((t) => [
      t.date,
      t.amount,
      t.category,
      t.type,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Amount", "Category", "Type"]],
      body: tableData,
    });

    doc.save("Transactions.pdf");
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    if (sortConfig.key === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (sortConfig.key === "amount") {
      valA = Number(valA);
      valB = Number(valB);
    }

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });

    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  return (
    <>
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg p-5 rounded-2xl shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Transactions</h2>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-blue-500 px-3 py-2 rounded-lg text-white hover:scale-105 transition"
          >
            <Download size={16} /> Export
          </button>
        </div>


        {/* SEARCH */}
        <div className="flex gap-3 mb-4">
          <input
            placeholder="Search transactions..."
            className="p-2 rounded-lg w-full bg-gray-100 dark:bg-slate-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {toast && (
          <div
            className={`fixed top-5 right-5 z-[9999] px-4 py-2 rounded-lg shadow-lg text-white
    ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
          >
            {toast.msg}
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700">
          <div className="overflow-auto max-h-[420px]">

            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0 z-10">
                <tr className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                  <th
                    className="px-4 py-3 text-left cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort("date")}
                  >
                    Date <ArrowUpDown size={16} className="inline ml-1" />
                  </th>

                  <th
                    className="px-4 py-3 text-left cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort("amount")}
                  >
                    Amount <ArrowUpDown size={16} className="inline ml-1" />
                  </th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  {role === "admin" && (
                    <th className="px-4 py-3 text-center">Actions</th>
                  )}
                </tr>
              </thead>

              {/* BODY */}
              <tbody>

                {sortedData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-400">
                      No transactions found 🚫
                    </td>
                  </tr>
                ) : (
                  sortedData.map((t, index) => (
                    <tr
                      key={t.id}
                      className={`
                transition
                ${index % 2 === 0
                          ? "bg-white dark:bg-slate-800"
                          : "bg-gray-50 dark:bg-slate-900"}
                hover:bg-blue-50 dark:hover:bg-slate-700
              `}
                    >
                      {/* DATE */}
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                        {t.date}
                      </td>

                      {/* AMOUNT */}
                      <td className="px-4 py-3 font-semibold text-black dark:text-white">
                        ₹{t.amount}
                      </td>

                      {/* CATEGORY */}
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {t.category}
                      </td>

                      {/* TYPE BADGE */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${t.type === "income"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          {t.type}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      {role === "admin" && (
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">

                            <button
                              onClick={() => handleEdit(t)}
                              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() => {
                                setDeleteId(t.id);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 transition"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>
        </div>

        {/* ADD BUTTON */}
        {role === "admin" && (
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="fixed bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full text-white text-2xl shadow-lg hover:scale-110 transition"
          >
            +
          </button>
        )}
      </div>
      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative w-[400px] rounded-3xl p-6 
      bg-white/80 dark:bg-slate-900/80 
      backdrop-blur-xl border border-white/20 
      shadow-[0_20px_60px_rgba(0,0,0,0.3)] 
      space-y-5 transition-all">

            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {editId ? "Edit Transaction" : "Add Transaction"}
            </h2>

            {/* Date */}
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl 
        bg-white/70 dark:bg-slate-800/70 
        border border-gray-200 dark:border-slate-600 
        focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            {/* Amount */}
            <input
              type="number"
              placeholder="Amount"
              className="w-full px-4 py-3 rounded-xl 
        bg-white/70 dark:bg-slate-800/70 
        border border-gray-200 dark:border-slate-600 
        focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            {/* Type */}
            <select
              className="w-full px-4 py-3 rounded-xl 
        bg-white/70 dark:bg-slate-800/70 
        border border-gray-200 dark:border-slate-600 
        focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value, category: "" })
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            {/* Category */}
            <select
              className="w-full px-4 py-3 rounded-xl 
        bg-white/70 dark:bg-slate-800/70 
        border border-gray-200 dark:border-slate-600 
        focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {categoryOptions[form.type].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() => {
                  setShowModal(false);
                  setErrors({});
                }}
                className="px-4 py-2 rounded-xl 
          bg-gray-200 dark:bg-slate-700 
          text-gray-700 dark:text-gray-200 
          hover:scale-105 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-xl 
          bg-gradient-to-r from-blue-500 to-indigo-500 
          text-white shadow-lg 
          hover:scale-105 hover:shadow-xl transition"
              >
                Save
              </button>

            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          ></div>

          <div className="relative bg-white dark:bg-slate-800 p-6 rounded-xl w-[300px] text-center space-y-4">

            <p className="text-lg font-semibold">Are you sure?</p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 rounded bg-gray-400 text-white"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-3 py-1 rounded bg-red-500 text-white"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
