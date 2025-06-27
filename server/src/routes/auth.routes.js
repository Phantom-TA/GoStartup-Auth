import { Router } from "express";
import { loginUser, logoutUser, refresh, registerUser, verifyEmail } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register")
.post(registerUser)

router.route("/login")
.post(loginUser)

router.route("/verify-email/:token")
.get(verifyEmail)

router.route("/logout")
.get(authMiddleware,logoutUser)

router.route("/refresh")
.post(refresh)

export default router;