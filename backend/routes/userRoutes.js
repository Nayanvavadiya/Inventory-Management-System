const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  sendVerificationEmail,
  adminCreateUser,
  verifyOTP,
} = require("../controllers/userController");

router.post("/create", createUser);
router.post("/verify", verifyOTP);
router.post("/admin/create", adminCreateUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.get("/verify", (req, res) => {
  res.send("Email verified successfully");
});

module.exports = router;

