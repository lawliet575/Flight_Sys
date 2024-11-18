import { BrowserRouter, Routes, Route } from "react-router-dom";
import Flights from "./pages/Flights";
import AddFlight from "./pages/Addflight";
import Bookings from "./pages/Bookings";
import Passengers from "./pages/Passengers";
import Airlines from "./pages/Airlines"; // New page for airlines
import FlightClasses from "./pages/FlightClasses";
import AddPassenger from "./pages/AddPassenger";
import Login from "./pages/Login";
import Admin_Home from "./pages/Admin_Home";
import EditFlight from "./pages/EditFlight";


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
