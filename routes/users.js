import express from "express"
import { deleteUser, updateUser } from "../controllers/user.js"
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js"

const router = express.Router()

router.post("/update/:id", verifyUser, updateUser)
router.get("/delete/:id", verifyUser, deleteUser)
//router.get("/user/:id", verifyAdmin, singleAnyUser)

export default router