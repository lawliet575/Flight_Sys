import { BrowserRouter, Routes, Route } from "react-router-dom";
import Flights from "./pages/Flightpage/Flights";
import AddFlight from "./pages/Flightpage/Addflight";
import EditFlight from "./pages/Flightpage/EditFlight";
import Bookings from "./pages/Bookingpage/Bookings";
import AddBooking from "./pages/Bookingpage/AddBooking";
import EditBooking from "./pages/Bookingpage/EditBooking";
import Passengers from "./pages/Passengerpage/Passengers";
import AddPassenger from "./pages/Passengerpage/AddPassenger";
import EditPassenger from "./pages/Passengerpage/EditPassenger";
import Airlines from "./pages/Airlinepage/Airlines"; // New page for airlines
import FlightClasses from "./pages/Flightclasspage/FlightClasses";
import Airports from "./pages/Airportpage/Airports";
import Login from "./pages/Loginpage/Login";
import { PassengerProvider } from "./pages/Loginpage/PassengerContext";
import Signup from "./pages/Loginpage/Signup";
import Admin_Home from "./pages/Homepage/Admin_Home";
import Home from "./pages/Homepage/Home";

//for user
import ViewFlight from "./pages/User_Booking_Pages/View_Flights";
import UserBook from "./pages/User_Booking_Pages/UserBooking";
import EditProfile from "./pages/User_Booking_Pages/EditProfile";


//will create a home page a general one for /
//waha se admin login and admin home pe jayega
//the 


//import './App.css';
 


function App() {
  return (
    <div className="app">
      
      <PassengerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/adminhome" element={<Admin_Home/>} />

          <Route path="/flights" element={<Flights />} />
          <Route path="/addflight" element={<AddFlight />} />
          <Route path="/editflight/:id" element={<EditFlight />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/addbooking" element={<AddBooking />} />
          <Route path="/editbooking/:id" element={<EditBooking />} />
          <Route path="/passengers" element={<Passengers />} />
          <Route path="/addpassenger" element={<AddPassenger />} />
          <Route path="/editpassenger/:id" element={<EditPassenger />} />
          <Route path="/airlines" element={<Airlines />} />
          <Route path="/flightclass" element={<FlightClasses />} />
          <Route path="/airports" element={<Airports />} />

          <Route path="/viewflights" element={<ViewFlight/>} />
          <Route path="/userbooking/:id" element={<UserBook/>} />
          <Route path="/editprofile/:id" element={<EditProfile/>} />



        </Routes>
      </BrowserRouter>
      </PassengerProvider>

    </div>
  );
}

export default App;
