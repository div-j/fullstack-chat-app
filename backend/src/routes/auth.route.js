import express from "express";
import { checkAuth, loginController, logout, signupController, updateProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup",  signupController);

router.post("/login", loginController);

router.post("/logout", logout);

router.put("/update-profile",protectedRoute, updateProfile );

router.get("/check",protectedRoute, checkAuth );

export default router;
