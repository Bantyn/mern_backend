const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ----------------------
// Forgot Password
// ----------------------
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token + expire time
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
        await user.save();

        // Reset URL (frontend link)
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // Send email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const message = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset",
            text: `You requested a password reset. Click this link: ${resetUrl}`,
        };

        await transporter.sendMail(message);

        res.json({ message: "Password reset email sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ----------------------
// Reset Password
// ----------------------
exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user)
            return res.status(400).json({ message: "Invalid or expired token" });

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// register user
exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = await User.create({
            name: `${firstName} ${lastName}`,
            email,
            password,
            roles: "user"
        });

        res.json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
//login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
