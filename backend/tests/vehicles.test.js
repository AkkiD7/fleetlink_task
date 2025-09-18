import request from 'supertest';
import { describe, it, beforeAll, afterAll, afterEach, expect } from 'vitest';
import app from '../src/app.js';
import { connectDB, closeDB, clearDB } from './setup.js';
import { Vehicle } from '../src/models/Vehicle.js';
import { Booking } from '../src/models/Booking.js';

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
afterEach(async () => await clearDB());

describe('POST /api/vehicles', () => {
  it('should add a new vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ name: 'Truck', capacityKg: 1000, tyres: 6 });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(true);
    expect(res.body.data.name).toBe('Truck');
  });

  it('should fail with missing fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ name: 'Truck' }); 

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('GET /api/vehicles/available', () => {
  it('should return vehicles available for the requested time and capacity', async () => {
    const truck = await Vehicle.create({ name: 'Truck', capacityKg: 1000, tyres: 6 });
    const van = await Vehicle.create({ name: 'Van', capacityKg: 500, tyres: 4 });

    const startTime = new Date();
    const estimatedHours = Math.abs(parseInt('456') - parseInt('123')) % 24;
    const endTime = new Date(startTime.getTime() + estimatedHours * 60 * 60 * 1000);

    await Booking.create({
      vehicleId: van._id,
      fromPincode: '123',
      toPincode: '456',
      startTime,
      endTime,
      customerId: 'cust123'
    });

    const res = await request(app)
      .get('/api/vehicles/available')
      .query({
        capacityRequired: 400,
        fromPincode: '123',
        toPincode: '456',
        startTime: startTime.toISOString()
      });

    expect(res.statusCode).toBe(200);

    const availableNames = res.body.data.map(v => v.name);
    expect(availableNames).toContain('Truck');
    expect(availableNames).not.toContain('Van');
  });
});
