import { estimatedRideDurationHours } from '../utils/duration.js';
import { Vehicle } from "../models/Vehicle.js";
import { Booking } from '../models/Booking.js';
import Joi from "joi";

export const bookVehicle = async (req, res, next) => {
    const schema = Joi.object({
        vehicleId: Joi.string().required(),
        fromPincode: Joi.string().required(),
        toPincode: Joi.string().required(),
        startTime: Joi.date().iso().required(),
        customerId: Joi.string().required()
    });


    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });


    const vehicle = await Vehicle.findById(value.vehicleId);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });


    const duration = estimatedRideDurationHours(value.fromPincode, value.toPincode);
    const startTime = new Date(value.startTime);
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);


    const conflict = await Booking.exists({
        vehicleId: vehicle._id,
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    });


    if (conflict) return res.status(409).json({ error: 'Vehicle already booked for requested time window' });


    const booking = new Booking({
        vehicleId: vehicle._id,
        customerId: value.customerId,
        fromPincode: value.fromPincode,
        toPincode: value.toPincode,
        startTime,
        endTime
    });


    await booking.save();
    res.status(201).json({
        status: true,
        message: "Vehicle booked successfully",
        data: booking
    });
}

export const deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        res.status(200).json({ success: true, message: "Booking cancelled successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().populate("vehicleId");

        if (!bookings) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        res.status(200).json({ success: true, message: "Bookings Fetched Successfully", data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
} 
