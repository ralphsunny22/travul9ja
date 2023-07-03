import express from "express"
import { login, logout, register, singleAnyUser, singleAuthUser } from "../controllers/auth.js"
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/:id", verifyUser, singleAuthUser)
router.get("/user/:id", verifyAdmin, singleAnyUser)

export default router