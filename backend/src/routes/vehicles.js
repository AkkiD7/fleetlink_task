import express from "express"
import { addVehicle,availableVehicles } from "../controllers/vehicles.js"

const router = express.Router();

router.post("/vehicles",addVehicle)
router.get("/vehicles/available",availableVehicles)

export default router;