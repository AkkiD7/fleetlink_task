import Joi from "joi";
import {Vehicle} from "../models/Vehicle.js";
import { estimatedRideDurationHours } from '../utils/duration.js';
import { Booking } from '../models/Booking.js';

export const addVehicle = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        capacityKg: Joi.number().required(),
        tyres: Joi.number().required()
    });


    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });


    const vehicle = new Vehicle(value);
    await vehicle.save();
    res.status(201).json({ status: true, message: "Vehicle Added Successfully", data: vehicle });
}

export const availableVehicles = async (req, res, next) => {
    try {
        const capacityRequired = parseInt(req.query.capacityRequired || '0', 10);
        const fromPincode = req.query.fromPincode;
        const toPincode = req.query.toPincode;
        const startTimeRaw = req.query.startTime;

        if (!fromPincode || !toPincode || !startTimeRaw) {
            return res.status(400).json({ error: 'fromPincode, toPincode and startTime are required' });
        }

        const startTime = new Date(startTimeRaw);
        if (isNaN(startTime.getTime())) return res.status(400).json({ error: 'Invalid startTime' });


        const estimatedRideDuration = estimatedRideDurationHours(fromPincode, toPincode);
        const endTime = new Date(startTime.getTime() + estimatedRideDuration * 60 * 60 * 1000);

        const vehicles = await Vehicle.find({ capacityKg: { $gte: capacityRequired } }).lean();

        const available = [];
        for (const v of vehicles) {
            const overlapping = await Booking.exists({
                vehicleId: v._id,
                $or: [
                    { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                ]
            });
            if (!overlapping) {
                available.push({ ...v, estimatedRideDurationHours: estimatedRideDuration });
            }
        }
        res.status(200).json({
            status: true,
            message: available.length > 0
                ? "Available vehicles fetched successfully."
                : "No vehicles available for the given criteria.",
            data: available
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}