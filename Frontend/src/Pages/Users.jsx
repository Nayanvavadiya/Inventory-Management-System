import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  adminCreateUser,
  getAllUsers,
  deleteUser
} from "../Service/userApi";
import DeleteConfirmModal from "../components/DeleteConfirmModal";


import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function Users({ isSubComponent = false }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchNumber, setSearchNumber] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // "", "asc", "desc"
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { products } = useSelector((state) => state.product);
  const { suppliers } = useSelector((state) => state.supplier);
  const { categories } = useSelector((state) => state.category);
  const { purchases } = useSelector((state) => state.purchase);
  const { outgoingRecords } = useSelector((state) => state.outgoing);

  const inventoryStats = [
    { label: 'Products', value: products.length, color: 'bg-blue-500' },
    { label: 'Suppliers', value: suppliers.length, color: 'bg-purple-500' },
    { label: 'Purchases', value: purchases.length, color: 'bg-green-500' },
    { label: 'Outgoing', value: outgoingRecords.length, color: 'bg-orange-500' },
    { label: 'Categories', value: categories.length, color: 'bg-teal-500' },
  ];

  const highestValue = Math.max(...inventoryStats.map((stat) => stat.value), 1);

  // Fetch users
  const fetchUsers = () => {
    setLoading(true);
    getAllUsers().then((res) => {
      setUsers(res.data.data || res.data);
      setLoading(false);
    }).catch((err) => {
      console.error("getAllUsers failed", err);
      setError("Failed to fetch users");
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Create user
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.mobile || !formData.password) {
      setError("All fields are required");
      return;
    }

    // Full Name validation: No numbers allowed
    if (/\d/.test(formData.fullName)) {
      setError("Full Name cannot contain numbers");
      return;
    }

    // Mobile validation: Only numbers allowed and exactly 10 digits
    if (/[^\d]/.test(formData.mobile)) {
      setError("Mobile number must contain only digits");
      return;
    }
    if (formData.mobile.length !== 10) {
      setError("Mobile number must be exactly 10 digits");
      return;
    }

    adminCreateUser(formData).then(() => {
      fetchUsers();
      setFormData({ fullName: "", email: "", mobile: "", password: "" });
    }).catch((err) => {
      console.error("adminCreateUser failed:", err?.response || err);
      const msg = err?.response?.data?.message || err?.message || "Failed to create user";
      setError(msg);
    });
  };

  // Delete user
  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete._id).then(() => {
        fetchUsers();
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      }).catch((err) => {
        console.error("deleteUser failed", err);
        setError("Failed to delete user");
        setIsDeleteModalOpen(false);
      });
    }
  };

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "Admin";

  const mainContainerClass = isSubComponent
    ? "w-full"
    : "flex h-screen bg-[#f0f5f9] overflow-hidden font-sans text-slate-900";

  return (
    <div className={mainContainerClass}>
      {/* Sidebar (Responsive) */}
      {!isSubComponent && (
        <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar />
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {!isSubComponent && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className={isSubComponent ? "w-full" : "flex-1 flex flex-col min-w-0 overflow-hidden"}>
        {!isSubComponent && <Topbar toggleSidebar={toggleSidebar} />}

        <main className={isSubComponent ? "overflow-visible" : "flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 md:p-8"}>
          <div className="space-y-6">
            {!isSubComponent && (
              <div className="flex items-center mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold group cursor-pointer border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300"
                >
                  <div className="bg-blue-50 p-1.5 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                    <ArrowBackIcon fontSize="small" className="text-blue-600 group-hover:-translate-x-1 transition-transform" />
                  </div>
                  <span className="text-sm">Go Back</span>
                </button>
              </div>
            )}

      {/* Add User Form - Only for Admin and NOT in subcomponent mode */}
      {isAdmin && !isSubComponent && (
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New User</h3>


          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  name="fullName"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                <input
                  name="mobile"
                  placeholder="Enter mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full md:w-auto">
              Add User
            </button>
            {error && (
              <p className="mt-4 text-red-500 text-sm font-semibold italic">
                * {error}
              </p>
            )}
          </form>
        </div>
      )}

      {/* Users List */}
      <div className={isSubComponent ? "bg-white" : "card"}>
        {!isSubComponent && <h3 className="text-2xl font-bold text-gray-800 mb-6">Users List</h3>}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex flex-col md:flex-row mb-4 gap-4">
              <input
                className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Search by mobile..."
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
              />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">Sort by Name (Default)</option>
                <option value="asc">A - Z</option>
                <option value="desc">Z - A</option>
              </select>
            </div>
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mobile</th>
                  {isAdmin && <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users
                  .filter((user) =>
                    (user.mobile || "").toString().includes(searchNumber)
                  )
                  .filter((user) =>
                    (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .sort((a, b) => {
                    if (!sortOrder) return 0;
                    const nameA = (a.fullName || "").toLowerCase();
                    const nameB = (b.fullName || "").toLowerCase();
                    if (sortOrder === "asc") {
                      return nameA > nameB ? 1 : -1;
                    } else {
                      return nameA < nameB ? 1 : -1;
                    }
                  })
                  .map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{user.fullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.mobile}</td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleDelete(user)}
                            className="btn-danger text-sm py-1 px-3 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Users Analysis Dashboard */}
      {!isSubComponent && (
        <section className="space-y-6 mt-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Inventory Analysis</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Number of products, suppliers, purchase records, outgoing records and categories.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                {inventoryStats.slice(0, 3).map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase tracking-[0.18em] font-semibold">{stat.label}</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-3xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-[0.18em] font-semibold">Inventory counts</p>
                  <h3 className="text-lg font-semibold text-slate-900 mt-1">Comparison chart</h3>
                </div>
                <span className="text-sm text-slate-500">Largest value scaled to 100%</span>
              </div>

              <div className="space-y-4">
                {inventoryStats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
                      <span>{stat.label}</span>
                      <span className="font-semibold">{stat.value}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`${stat.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${(stat.value / highestValue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.fullName}
      />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Users;
