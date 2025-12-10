const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

let otpStore = {}; 

exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email not registered" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  // Email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    connectionTimeout: 10000,
    
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);

  res.json({ message: "OTP sent successfully" });
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  res.json({ message: "OTP Verified" });
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!otpStore[email])
    return res.status(400).json({ message: "OTP expired or not verified" });

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashed });

  delete otpStore[email];

  res.json({ message: "Password reset successful" });
};
