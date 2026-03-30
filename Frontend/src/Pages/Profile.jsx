import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Users from "../Pages/Users";
import { getAllUsers } from "../Service/userApi";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import BadgeIcon from '@mui/icons-material/Badge';
import EditProfileModal from "../components/EditProfileModal";
import { updateUser } from "../Service/userApi";
import { Snackbar, Alert } from "@mui/material";

function Profile() {
  const location = useLocation();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  // Use location state if available, otherwise fallback to localStorage user
  const email = location.state?.email || storedUser.email || "";
  const [userName, setUserName] = useState(storedUser.fullName || "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localUser, setLocalUser] = useState(storedUser);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      if (!localUser?._id || localUser._id === "admin_hardcoded_id") {
        throw new Error("Invalid User ID. Please Log Out and Log In again to refresh your session.");
      }

      const response = await updateUser(localUser._id, updatedData);
      if (response.data.success) {
        const fullUpdatedUser = {
          ...localUser,
          ...response.data.data,
          role: localUser.role // Preserve the existing role to keep sidebar visible
        };

        // Update local state and storage
        setLocalUser(fullUpdatedUser);
        localStorage.setItem("user", JSON.stringify(fullUpdatedUser));
        setUserName(fullUpdatedUser.fullName);

        setSnackbar({
          open: true,
          message: "Profile updated successfully!",
          severity: "success"
        });
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to update profile",
        severity: "error"
      });
      // Throw error back to modal so it doesn't close on failure
      throw err;
    }
  };

  // Get data from Redux for the chart
  const { categories } = useSelector((state) => state.category);
  const { products } = useSelector((state) => state.product);
  const { purchases } = useSelector((state) => state.purchase);
  const { outgoingRecords } = useSelector((state) => state.outgoing);

  const chartData = [
    { name: 'Categories', count: categories.length, color: '#10b981' }, // green-500
    { name: 'Products', count: products.length, color: '#f59e0b' },    // amber-500
    { name: 'Purchases', count: purchases.length, color: '#6366f1' },   // indigo-500
    { name: 'Outgoing', count: outgoingRecords.length, color: '#f97316' },    // orange-500
  ];

  // always look up name from backend when email is available
  useEffect(() => {
    if (email && !userName) {
      getAllUsers()
        .then((res) => {
          const list = res.data.data || res.data;
          const me = list.find((u) => u.email === email);
          if (me && me.fullName) {
            setUserName(me.fullName);
          }
        })
        .catch((err) => {
          console.error("failed to fetch user name", err);
        });
    }
  }, [email, userName]);

  return (
    <div className="flex h-screen bg-[#f0f5f9] overflow-hidden font-sans text-slate-900">
      {/* Sidebar (Responsive) */}
      <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">


        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 md:p-8">
          {/* Header Top Section (mimicking Topbar integration for seamless look) */}
          <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <PersonOutlineIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">My Profile</h1>
                <p className="text-sm text-gray-500">Manage your account details and settings</p>
              </div>
            </div>
            <button
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg flex items-center text-sm font-medium transition-colors shadow-sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              <EditOutlinedIcon style={{ fontSize: 18, marginRight: 6 }} /> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Profile Card (Left Column) */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-sm flex items-center justify-center text-blue-500 mb-4">
                  {(userName || email) ? (
                    <span className="text-4xl font-bold uppercase">
                      {(userName || email).charAt(0)}
                    </span>
                  ) : (
                    <AccountCircleOutlinedIcon style={{ fontSize: 64 }} />
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-1">{localUser?.fullName || 'User'}</h2>
                <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{localUser?.email || 'user@example.com'}</p>

                <div className="w-full mt-8 space-y-5 border-t border-gray-100 pt-6">
                  <div className="flex items-start">
                    <PersonOutlineIcon className="text-gray-400 mt-0.5 mr-3" style={{ fontSize: 20 }} />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                      <p className="text-gray-900 font-medium">{localUser?.fullName || 'User Name'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <BadgeIcon className="text-gray-400 mt-0.5 mr-3" style={{ fontSize: 20 }} />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Username</p>
                      <p className="text-gray-900 font-medium">{localUser?.username || 'user'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <SmartphoneIcon className="text-gray-400 mt-0.5 mr-3" style={{ fontSize: 20 }} />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Mobile</p>
                      <p className="text-gray-900 font-medium">{localUser?.mobile || '0000000000'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <EmailOutlinedIcon className="text-gray-400 mt-0.5 mr-3" style={{ fontSize: 20 }} />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                      <p className="text-gray-900 font-medium break-all">{localUser?.email || 'user@example.com'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <LockOutlinedIcon className="text-gray-400 mt-0.5 mr-3" style={{ fontSize: 20 }} />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Password</p>
                      <p className="text-gray-900 font-medium tracking-widest">●●●●●●●●</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Manager / Additional Details (Right Column) - Only for Admin */}
            {storedUser.role === "Admin" && (
              <div className="xl:col-span-2 space-y-8">
                {/* Statistics Chart Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Inventory Analytics</h3>
                    <p className="text-sm text-gray-500">Overview of system records distribution</p>
                  </div>
                  <div className="p-6">
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                          barSize={60}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                          />
                          <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{
                              borderRadius: '12px',
                              border: 'none',
                              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                              padding: '12px'
                            }}
                          />
                          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      {chartData.map((item, index) => (
                        <div key={index} className="flex flex-col items-center p-4 rounded-xl bg-gray-50 border border-gray-100 italic transition-transform hover:scale-105">
                          <span className="text-2xl font-black mb-1" style={{ color: item.color }}>{item.count}</span>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">System Users</h3>
                    <p className="text-sm text-gray-500">Manage other administrators and staff members</p>
                  </div>
                  <div className="p-6">
                    <Users isSubComponent={true} />
                  </div>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={localUser}
        onSave={handleSaveProfile}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "10px", fontWeight: "bold" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Profile;
