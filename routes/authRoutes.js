const express = require("express");
const { register, login, verifyStudentEmailbyAdmin } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verifyEmail/:token/:userIdToVerify", verifyStudentEmailbyAdmin);


module.exports = router;
