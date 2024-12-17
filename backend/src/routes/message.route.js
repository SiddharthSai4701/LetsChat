import express from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// To get all the users on the sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get messages from a specific chat
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;