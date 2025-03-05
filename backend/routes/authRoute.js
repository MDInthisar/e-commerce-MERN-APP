import express from "express";
import { register, login, forgotPassword, resetPassword, googleLogin } from "../controllers/authController.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/googlelogin', googleLogin)
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);

export default router;