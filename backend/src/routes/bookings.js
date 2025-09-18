import express from "express"
import { bookVehicle, getBookings,deleteBooking } from "../controllers/bookings.js";

const router = express.Router();

router.get('/bookings', getBookings)
router.post('/bookings', bookVehicle)
router.delete('/bookings/:id', deleteBooking)

export default router;