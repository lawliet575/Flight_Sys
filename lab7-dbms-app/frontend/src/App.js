import { BrowserRouter, Routes, Route } from "react-router-dom";
import Flights from "./pages/Flightpage/Flights";
import AddFlight from "./pages/Flightpage/Addflight";
import EditFlight from "./pages/Flightpage/EditFlight";
import Bookings from "./pages/Bookingpage/Bookings";
import AddBooking from "./pages/Bookingpage/AddBooking";
import EditBooking from "./pages/Bookingpage/EditBooking";
import Passengers from "./pages/Passengerpage/Passengers";
import AddPassenger from "./pages/Passengerpage/AddPassenger";
import Airlines from "./pages/Airlinepage/Airlines"; // New page for airlines
import FlightClasses from "./pages/Flightclasspage/FlightClasses";
import Login from "./pages/Loginpage/Login";
import Admin_Home from "./pages/Homepage/Admin_Home";


//import './App.css';
 


function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/adminhome" element={<Admin_Home/>} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/addflight" element={<AddFlight />} />
          <Route path="/editflight/:id" element={<EditFlight />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/addbooking" element={<AddBooking />} />
          <Route path="/editbooking/:id" element={<EditBooking />} />
          <Route path="/passengers" element={<Passengers />} />
          <Route path="/airlines" element={<Airlines />} />
          <Route path="/flightclass" element={<FlightClasses />} />
          <Route path="/addpassenger" element={<AddPassenger />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
