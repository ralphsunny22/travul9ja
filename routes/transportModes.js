import express from "express"
import { addTransportMode, deleteTransportMode, getAllTransportModes, getSingleTransportMode, updateTransportMode } from "../controllers/transportMode.js"
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router()

router.get("/", getAllTransportModes)
router.get("/:id", getSingleTransportMode)
router.post("/", verifyAdmin, addTransportMode)
router.delete("/:id", verifyAdmin, deleteTransportMode)
router.put("/:id", verifyAdmin, updateTransportMode)

export default router