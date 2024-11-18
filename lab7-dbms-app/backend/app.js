const express = require("express");
const flightRoutes = require("./routes/FlightRoutes");
const passengerRoutes = require("./routes/PassengerRoutes");
const airlineRoutes = require("./routes/AirlineRoutes");
const aircraftRoutes = require("./routes/AircraftRoutes");
const bookingRoutes = require("./routes/BookingRoutes");
const flight_classRoutes = require("./routes/FlightClassRoutes");  
const admin_routes = require("./routes/AdminRoutes");  


const db = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", flightRoutes);
app.use("/api", passengerRoutes);
app.use("/api", bookingRoutes);  // Register the booking routes
app.use("/api", airlineRoutes);
app.use("/api", aircraftRoutes);
app.use("/api", flight_classRoutes);
app.use("/api", admin_routes);


// Catch-all route to verify that the app is running
app.use("/", (req, res) => {
  res.json({ message: "App is running!" });
});

// Start Server and DB
const PORT = process.env.PORT || 5000;
db.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
