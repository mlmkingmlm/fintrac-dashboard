/*
Name - Naveen Kumar
Purpose - Role Switch Component
Date - 03-04-2026
*/

export default function RoleSwitcher({ role, setRole }) {
  return (
    <div className="flex justify-between items-center">

      <select
        className="bg-gray-100 dark:bg-slate-800 text-black dark:text-white border border-gray-300 dark:border-slate-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>

    </div>
  );
}