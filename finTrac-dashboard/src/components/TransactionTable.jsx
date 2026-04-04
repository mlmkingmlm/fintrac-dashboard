/*
Name - Naveen Kumar
Purpose - Transaction Table
Date - 03-04-2026
*/

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

  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "",
    type: "expense",
  });



  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const categoryOptions = {
    income: ["Salary", "Freelance", "Bonus"],
    expense: ["Food", "Shopping", "Transport", "Bills"],
  };

  const filteredData = transactions.filter((t) => {
    return (
      (filter === "all" || t.type === filter) &&
      t.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  const validate = () => {
    let newErrors = {};

    if (!form.date) newErrors.date = "Date required";
    if (!form.amount || Number(form.amount) <= 0)
      newErrors.amount = "Valid amount required";
    if (!form.category) newErrors.category = "Select category";

    setErrors(newErrors);
    return newErrors;
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
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

  // ➕ Add or Update
  const handleSubmit = () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      showToast("Fix errors", "error");
      return;
    }

    if (editId) {
      const updated = transactions.map((t) =>
        t.id === editId
          ? {
            ...form,
            id: editId,
            amount: Number(form.amount), 
          }
          : t
      );

      setTransactions(updated);
      showToast("Updated successfully", "success");
    } else {
      const newTransaction = {
        ...form,
        id: Date.now(),
        amount: Number(form.amount),
      };

      setTransactions([newTransaction, ...transactions]);
      showToast("Added successfully", "success");
    }

    resetForm();
    setShowModal(false);
  };

  // Edit Function 
  const handleEdit = (t) => {
    setForm(t);
    setEditId(t.id);
    setShowModal(true);
  };

  //  Delete Confirm Modal
  const confirmDelete = () => {
    setTransactions(transactions.filter((t) => t.id !== deleteId));
    showToast("Deleted successfully", "success");
    setShowDeleteModal(false);
  };

  // Sorting Table State 
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    // date fix
    if (sortConfig.key === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    // amount fix
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

const handleDownloadPDF = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("FinTrack Dashboard", 14, 20);

  doc.setFontSize(12);
  doc.text("Transaction Statement", 14, 28);

  // Date
  const today = new Date().toLocaleDateString();
  doc.text(`Date: ${today}`, 150, 28);

  // Table Data
 const tableData = transactions.map((t) => {
  const amount = Number(t.amount); // ensure number

  return [
    String(t.date),
    amount,
    String(t.category),
    String(t.type),
  ];
});

  // Table
  autoTable(doc, {
  startY: 35,
  head: [["Date", "Amount", "Category", "Type"]],
  body: tableData,
  styles: {
    font: "helvetica",
    cellPadding: 3,
  },
});

  // Save
  doc.save("FinTrack_Statement.pdf");
};

  return (
<div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 relative">
<h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
  Transactions
</h2>
      {/* Toast */}
      {toast && (
        <div className={`mb-3 p-2 rounded ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search..."
className="bg-gray-100 dark:bg-slate-700 text-black dark:text-white p-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
className="bg-gray-100 dark:bg-slate-700 text-black dark:text-white p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button
  onClick={handleDownloadPDF}
  className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
>
  <Download size={18} />
</button>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-center">
<thead className="text-gray-600 dark:text-gray-400">
    <tr>
    <th className="py-2 text-center">
      <div
        onClick={() => handleSort("date")}
        className="cursor-pointer flex items-center justify-center gap-1"
      >
        Date <ArrowUpDown size={14} />
      </div>
    </th>

    <th className="py-2 text-center">
      <div
        onClick={() => handleSort("amount")}
        className="cursor-pointer flex items-center justify-center gap-1"
      >
        Amount <ArrowUpDown size={14} />
      </div>
    </th>

    <th className="py-2 text-center">Category</th>
    <th className="py-2 text-center">Type</th>

    {role === "admin" && (
      <th className="py-2 text-center">Action</th>
    )}
  </tr>
</thead>

        <tbody>
          {sortedData.map((t) => (
            <tr key={t.id} className="border-t border-gray-200 dark:border-slate-700">
              <td className="py-2">{t.date}</td>
              <td className="py-2">₹{t.amount}</td>
              <td className="py-2">{t.category}</td>
              <td className={t.type === "income" ? "text-green-400" : "text-red-400"}>
                {t.type}
              </td>

              {role === "admin" && (
                <td className="py-2 text-center">
                  <div className="flex justify-center items-center gap-3">

                    <button
                      onClick={() => handleEdit(t)}
                      title="Edit"
                      className="p-2 rounded-fullhover:bg-gray-200 dark:hover:bg-slate-700 transition"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => {
                        setDeleteId(t.id);
                        setShowDeleteModal(true);
                      }}
                      title="Delete"
                      className="p-2 rounded-full hover:bg-slate-700 text-red-400 transition"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Floating Button */}
      {role === "admin" && (
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="fixed z-50 bottom-6 right-6 bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl animate-spin-slow"
        >
          +
        </button>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded-xl w-[400px] space-y-3">

            <h2>{editId ? "Edit Transaction" : "Add Transaction"}</h2>

            <div>
              <input
                type="date"
                className={`bg-gray-100 dark:bg-slate-700 text-black dark:text-white p-2 w-full rounded ${errors.date ? "border border-red-500" : ""
                  }`}
                value={form.date}
                onChange={(e) => {
                  setForm({ ...form, date: e.target.value })
                  setErrors((prev) => ({ ...prev, date: "" }));
                }}
              />

              {errors.date && (
                <p className="text-red-400 text-xs mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <input
              type="number"
                placeholder="Amount"
                className={`bg-gray-100 dark:bg-slate-700 text-black dark:text-white p-2 w-full rounded ${errors.amount ? "border border-red-500" : ""
                  }`}
                value={form.amount}
                onChange={(e) => {
                  setForm({ ...form, amount: e.target.value })
                  setErrors((prev) => ({ ...prev, amount: "" }));
                }
                }
              />

              {errors.amount && (
                <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
              )}
            </div>

            <select className="bg-gray-100 dark:bg-slate-700 text-black dark:text-white p-2 w-full rounded"
              value={form.type}
              onChange={(e) => {
                setForm({ ...form, type: e.target.value, category: "" })
                setErrors((prev) => ({ ...prev, type: "" }));
              }
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <div>
              <select
                className={`bg-gray-100 dark:bg-slate-700 text-black dark:text-white p-2 w-full rounded ${errors.category ? "border border-red-500" : ""
                  }`}
                value={form.category}
                onChange={(e) => {
                  setForm({ ...form, category: e.target.value })
                  setErrors((prev) => ({ ...prev, category: "" }));
                }
                }
              >
                <option value="">Select Category</option>
                {categoryOptions[form.type].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              {errors.category && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.category}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="bg-gray-500 px-3 py-1 rounded">
                Cancel
              </button>

              <button onClick={handleSubmit} className="bg-blue-500 px-3 py-1 rounded">
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded-xl w-[300px] text-center">

            <p className="mb-4">Are you sure?</p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}