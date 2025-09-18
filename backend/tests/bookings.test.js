import request from "supertest";
import { describe, it, beforeAll, afterAll, afterEach, expect } from "vitest";
import app from "../src/app.js";
import { connectDB, closeDB, clearDB } from "./setup.js";
import { Vehicle } from "../src/models/Vehicle.js";
import { Booking } from "../src/models/Booking.js";

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
afterEach(async () => await clearDB());

describe("POST /api/bookings", () => {
  it("should book a vehicle successfully", async () => {
    const vehicle = await Vehicle.create({ name: "Truck", capacityKg: 1000, tyres: 6 });
    const startTime = new Date();

    const res = await request(app)
      .post("/api/bookings")
      .send({
        vehicleId: vehicle._id,
        fromPincode: "123",
        toPincode: "456",
        startTime: startTime.toISOString(),
        customerId: "C1",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.data.vehicleId).toBe(String(vehicle._id));
  });

  it("should fail if vehicle is already booked for overlapping time", async () => {
    const vehicle = await Vehicle.create({ name: "Truck", capacityKg: 1000, tyres: 6 });
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

    await Booking.create({
      vehicleId: vehicle._id,
      customerId: "C1",
      fromPincode: "123",
      toPincode: "456",
      startTime,
      endTime,
    });

    const res = await request(app)
      .post("/api/bookings")
      .send({
        vehicleId: vehicle._id,
        fromPincode: "123",
        toPincode: "456",
        startTime: startTime.toISOString(),
        customerId: "C2",
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe("Vehicle already booked for requested time window");
  });
});

describe("GET /api/bookings", () => {
  it("should fetch all bookings", async () => {
    const vehicle = await Vehicle.create({ name: "Mini Truck", capacityKg: 500, tyres: 4 });
    const booking = await Booking.create({
      vehicleId: vehicle._id,
      customerId: "C1",
      fromPincode: "111",
      toPincode: "222",
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
    });

    const res = await request(app).get("/api/bookings");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]._id).toBe(String(booking._id));
  });
});

describe("DELETE /api/bookings/:id", () => {
  it("should cancel a booking successfully", async () => {
    const vehicle = await Vehicle.create({ name: "Tempo", capacityKg: 300, tyres: 4 });
    const booking = await Booking.create({
      vehicleId: vehicle._id,
      customerId: "C2",
      fromPincode: "333",
      toPincode: "444",
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
    });

    const res = await request(app).delete(`/api/bookings/${booking._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Booking cancelled successfully");

    const check = await Booking.findById(booking._id);
    expect(check).toBeNull();
  });

  it("should return 404 if booking not found", async () => {
    const fakeId = "650fbcf4a4e7c6d2f8a7d9b1"; 
    const res = await request(app).delete(`/api/bookings/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Booking not found");
  });
});
