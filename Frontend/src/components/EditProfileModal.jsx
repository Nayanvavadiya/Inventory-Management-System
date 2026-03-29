import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import BadgeIcon from "@mui/icons-material/Badge";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";

/**
 * EditProfileModal component for updating user profile information.
 * 
 * @param {boolean} isOpen - Whether the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @param {object} user - The current user object.
 * @param {function} onSave - Function to save updated user data.
 */
const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form data when modal opens
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        fullName: user.fullName || "",
        mobile: user.mobile || "",
        username: user.username || "",
        password: "",
        confirmPassword: "",
      });
      setError("");
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return "Full Name is required";
    if (!formData.mobile.trim()) return "Mobile Number is required";
    if (!/^\d{10}$/.test(formData.mobile)) return "Mobile Number must be 10 digits";
    if (!formData.username.trim()) return "Username is required";
    
    if (formData.password) {
      if (formData.password.length < 6) return "Password must be at least 6 characters";
      if (!/\d/.test(formData.password)) return "Password must contain a number";
      if (!/[a-zA-Z]/.test(formData.password)) return "Password must contain a letter";
      if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    }
    
    return null;
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create a copy of the data to send, excluding confirmPassword and empty password
      const submissionData = { ...formData };
      delete submissionData.confirmPassword;
      
      if (!submissionData.password) {
        delete submissionData.password;
      }

      await onSave(submissionData);
      onClose();
    } catch (err) {
      console.error("Update profile failed:", err);
      setError(err?.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
      PaperProps={{
        sx: {
          borderRadius: "16px",
          padding: "8px"
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" component="span" fontWeight="bold"> Edit Profile </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "grey.500" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderTop: "1px solid", borderTopColor: "divider" }}>
          <Box className="space-y-4 pt-1">
            {error && (
              <Box className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold uppercase tracking-wider text-center border border-red-100">
                {error}
              </Box>
            )}

            <Box className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
                <PersonOutlineIcon sx={{ fontSize: 14, mr: 0.5 }} /> Full Name
              </label>
              <TextField
                fullWidth
                name="fullName"
                placeholder="Enter Full Name"
                value={formData.fullName}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "grey.50"
                  }
                }}
              />
            </Box>

            <Box className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
                <SmartphoneIcon sx={{ fontSize: 14, mr: 0.5 }} /> Mobile Number
              </label>
              <TextField
                fullWidth
                name="mobile"
                placeholder="10-digit Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "grey.50"
                  }
                }}
              />
            </Box>

            <Box className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
                <BadgeIcon sx={{ fontSize: 14, mr: 0.5 }} /> Username
              </label>
              <TextField
                fullWidth
                name="username"
                placeholder="Choose Username"
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "grey.50"
                  }
                }}
              />
            </Box>

            <Box className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
                <LockOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} /> New Password (Leave blank to keep current)
              </label>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "grey.50"
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center">
                <LockOutlinedIcon sx={{ fontSize: 14, mr: 0.5 }} /> Confirm New Password
              </label>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "grey.50"
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2, py: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              color: "grey.600",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "10px"
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: "#FB4C6E",
              "&:hover": { backgroundColor: "#e43c5b" },
              borderRadius: "10px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: "0 4px 6px -1px rgb(251 76 110 / 0.1), 0 2px 4px -2px rgb(251 76 110 / 0.1)"
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProfileModal;
