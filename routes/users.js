import express from "express"
import { updateUser } from "../controllers/user.js"
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js"

const router = express.Router()

router.post("/update/:id", verifyUser, verifyAdmin, updateUser)
//router.get("/user/:id", verifyAdmin, singleAnyUser)

export default router