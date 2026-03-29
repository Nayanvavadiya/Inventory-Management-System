import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import Users from "./Pages/Users";
import Dashboard from "./Pages/Dashboard";
import Category from "./Pages/Category";
import Product from "./Pages/Product";
import Customer from "./Pages/Customer";
import Supplier from "./Pages/Supplier";
import Purchase from "./Pages/Purchase";
import Outgoing from "./Pages/Outgoing";
import EmailVerification from "./Pages/EmailVerification";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<EmailVerification />} />

        {/* Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/category" element={<ProtectedRoute><Category /></ProtectedRoute>} />
        <Route path="/product" element={<ProtectedRoute><Product /></ProtectedRoute>} />
        <Route path="/outgoing" element={<ProtectedRoute><Outgoing /></ProtectedRoute>} />

        {/* Admin Only Routes */}
        <Route path="/users" element={<ProtectedRoute isAdminOnly={true}><Users /></ProtectedRoute>} />
        <Route path="/customer" element={<ProtectedRoute isAdminOnly={true}><Customer /></ProtectedRoute>} />
        <Route path="/supplier" element={<ProtectedRoute isAdminOnly={true}><Supplier /></ProtectedRoute>} />
        <Route path="/purchase" element={<ProtectedRoute isAdminOnly={true}><Purchase /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
