const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const emailPattern = /^\d{9}@student\.uj\.ac\.za$/;
    

    console.log("Email:", email);
    console.log("Valid:", emailPattern.test(email));

    if (emailPattern.test(email)) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ fullName, email, password: hashedPassword });

      await user.save();

      jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      
      res.status(201).json({ msg: "Student registered. Admin verifying acount." });
    } else {
      res.status(400).json({ msg: "Please use a student email to register." });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // I have to find a way to make sure the student is verifies
    //  (maybe file with student numbers then if its there ,verify automatically)
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.verifyStudentEmailbyAdmin = async (req, res) => {
  try {
    const { token, userIdToVerify } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const adminUser = await User.findById(decoded.userId);
    if (!adminUser) return res.status(400).json({ msg: "Admin user not found" });

    if (!adminUser.isAdmin) {
      return res.status(403).json({ msg: "You do not have permission to verify users" });
    }

    const userToVerify = await User.findById(userIdToVerify);
    if (!userToVerify) return res.status(400).json({ msg: "User not found" });

    userToVerify.isVerified = true;
    await userToVerify.save();

    res.json({ msg: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Forgot Password (send reset link)
// to be figured out

// Reset Password
// to be figured out 

