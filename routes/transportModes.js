import express from "express"
import { addTransportMode, deleteTransportMode, getAllTransportModes, getSingleTransportMode, updateTransportMode } from "../controllers/transportMode.js"
//import { addTransportMode } from "../controllers/transportMode.js"

const router = express.Router()

router.get("/", getAllTransportModes)
router.get("/:id", getSingleTransportMode)
router.post("/", addTransportMode)
router.delete("/:id", deleteTransportMode)
router.put("/:id", updateTransportMode)

export default router