import express from "express"
import { login, logout, register, singleAnyUser, singleAuthUser } from "../controllers/auth.js"
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/logout", verifyToken, logout)
router.get("/me", verifyUser, singleAuthUser)
router.get("/user/:id", verifyAdmin, singleAnyUser)

export default router