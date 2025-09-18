import express from "express";
import cors from "cors";
import vehicleRoutes from "./routes/vehicles.js";
import bookingRoutes from "./routes/bookings.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", vehicleRoutes);
app.use("/api", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Hey There Its Working");
});

export default app;
