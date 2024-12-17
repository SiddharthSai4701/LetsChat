import express from "express";
import { signup, login, logout, updateProfile, checkAuth } from "../controllers/auth.controller.js"
import { protectRoute } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Before allowing a user to update their profile, we must first check if the user is authenticated
// protectRoute is the middleware used to validate if a user is authenticated or not
router.put("/update-profile", protectRoute, updateProfile);


router.get("/check", protectRoute, checkAuth);

export default router;


/**
 * CONTINUATION POINT:
 3:48:00
 */