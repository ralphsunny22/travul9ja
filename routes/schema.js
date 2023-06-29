import express from "express"
import { createSchema } from "../controllers/schema.js"

const router = express.Router()

router.get("/", createSchema)

export default router