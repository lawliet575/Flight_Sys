const { getAllFlightClasses, addFlightClass } = require("../models/flightClassModel");

async function listAllFlightClasses(req, res) {
  try {
    const flightClasses = await getAllFlightClasses();
    res.status(200).json(flightClasses);
  } catch (error) {
    console.error("Error fetching flight classes:", error);
    res.status(500).json({ message: "Error fetching flight classes", error: error.message });
  }
}

async function newFlightClass(req, res) {
  const { Class_Description, BaggageAllowed } = req.body;

  if ( !Class_Description || !BaggageAllowed) {
    return res.status(400).json({ message: "Class description, and baggage allowance are required" });
  }

  try {
    const result = await addFlightClass({  Class_Description, BaggageAllowed });
    res.status(201).json({ message: "Flight class added successfully", classId: result });
  } catch (error) {
    console.error("Error adding flight class:", error);
    res.status(500).json({ message: "Error adding flight class", error: error.message });
  }
}

module.exports = {
  listAllFlightClasses,
  newFlightClass
};
