import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import userModel from "../models/userModel.js";
import generateJWT from "../config/genrateJWT.js";
import genrateOTP from "../config/genrateOTP.js";

export const register = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password || !role)
      return res.json({ error: "All feilds requied" });

    const user = await userModel.findOne({ $or: [{ email }, { username }] });

    if (user) return res.json({ error: "user already exists" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await userModel.create({
      name,
      username,
      email,
      password: hash,
      role,
    });

    res.status(200).json({ message: `Hi ${name} welcome to ecommerce` });
  } catch (err) {
    res.json({ error: "something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.json({ error: "All fields required" });

    const user = await userModel.findOne({ username });

    if (!user) return res.json({ error: "User does not exist" });

    const result = await bcrypt.compare(password, user.password);

    if (!result) return res.json({ error: "Password does not match" });

    const token = generateJWT(user._id, user.role);

    res.json({ message: `Hi ${username}, you are logged in`, token });
  } catch (err) {
    res.json({ error: "Something went wrong" });
  }
};

export const googleLogin = async (req, res) => {
  const { email, email_verified, name, picture, clientId } = req.body;
  if (email_verified) {
    const user = await userModel.findOne({ email });
    let role = user.role || 'user';
    if (!user) {
      const user = await userModel.create({
        name,
        username: name,
        email,
        password: email + clientId,
        profilePic: picture,
        role,
      });
      const token = generateJWT(user._id, role);
      res.json({ message: `Hi ${name} you loggedIn`, token });
    } else {
      const token = generateJWT(user._id, role);
      res.json({ message: `Hi ${name} you loggedIn`, token });
    }
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) return res.json({ error: "user not found" });

    const otp = genrateOTP();

    const token = jwt.sign({ email, otp }, process.env.JWT_SECERT, {
      expiresIn: "10m",
    });
    res.cookie("otp-token", token);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "forgot password",
      text: `copy this OTP to reset-password ${otp}`,
    });

    res.json({ message: "OTP send to email" });
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const resetPassword = (req, res) => {
  const { otp, newpassword } = req.body;

  jwt.verify(
    req.cookies["otp-token"],
    process.env.JWT_SECERT,
    async (err, payload) => {
      if (err) return res.json({ err: err.message });

      if (otp === payload.otp) {
        const user = await userModel.findOne({ email: payload.email });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newpassword, salt);

        user.password = hash;

        await user.save();

        res.clearCookie("otp-token");
        return res.json({ message: "new password set sucessfull" });
      } else {
        return res.json({ error: "OTP not matched" });
      }
    }
  );
};
