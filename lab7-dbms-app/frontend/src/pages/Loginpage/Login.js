import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PassengerContext } from "./PassengerContext";
import './loginmodule.css'; // Import the CSS file

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Access the PassengerContext
  const { setPassengerId } = useContext(PassengerContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (username === "" || password === "") {
      setError("Please fill in all fields.");
      return;
    }

    setError(""); // Clear previous errors
    setLoading(true); // Show loading state

    try {
      // Fetch admin credentials
      const adminResponse = await fetch("http://localhost:3001/api/admin");
      if (!adminResponse.ok) {
        throw new Error("Failed to fetch admin data.");
      }
      const adminData = await adminResponse.json();
      const adminCredentials = adminData.data[0]; // Admin credentials array

      // Check if the entered credentials match the admin credentials
      if (adminCredentials[0] === username && adminCredentials[1] === password) {
        navigate("/adminhome"); // Redirect to admin home page
        return;
      }

      // Fetch passenger credentials
      const passengerResponse = await fetch("http://localhost:3001/api/passengers");
      if (!passengerResponse.ok) {
        throw new Error("Failed to fetch passenger data.");
      }
      const passengerData = await passengerResponse.json();

      // Check if the entered credentials match any passenger credentials
      const matchedPassenger = passengerData.data.find(
        (passenger) => passenger[9] === username && passenger[10] === password
      );

      if (matchedPassenger) {
        setPassengerId(matchedPassenger[0]); // Store passenger ID (e.g., "PS13") in the context
        navigate("/home"); // Redirect to user home page
      } else {
        setError("Invalid username or password."); // Show error if no match is found
      }
    } catch (err) {
      setError("An error occurred while checking credentials.");
      console.error(err);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="login-container">
      <nav class="navbar navbar-expand-lg pt-2" style={{textShadow: "0 0 15px #8c8c8c"}}>
        <div class="container-fluid px-5">
          <a class="navbar-brand text-light fw-bold fs-3 mt-2 ms-3" href="#" style={{ letterSpacing: "2px" }}>FlyEase<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-send mx-2 fw-bold" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
          </svg></a>

          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a href="#" class="nav-link fw-semibold text-light fs-5 px-3">Contact Us</a></li>
            <li class="nav-item"><a href="#" class="nav-link fw-semibold text-light fs-5 px-3">About</a></li>
            <li class="nav-item"><a href="#" class="nav-link fw-semibold text-light fs-5 px-3">Flights</a></li>
            <li class="nav-item"><a href="#" class="nav-link fw-semibold text-light fs-5 px-3">

              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-instagram fw-medium" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
              </svg> @FlyEase.pk

            </a>

            </li>

          </ul>
        </div>
      </nav>
      <div className="w-100 d-flex flex-row justify-content-center align-items-center mt-4">
        <div className="d-flex flex-column justify-content-center me-5 pe-5" style={{ width: "35%" }}>
          <h2 className="text-center fs-2 text-light fw-bold" style={{textShadow: "0 0 15px #8c8c8c"}}>Login</h2>
          <form onSubmit={handleLogin} className="bg-transparent w-100 mt-2 mb-0 pt-2 pb-1" style={{ boxShadow: "none" }}>
            <div className="mb-3">
              <label class="form-label text-light fw-medium" >Username</label>
              <input type="text" class="form-control  input-box" value={username}
                onChange={(e) => setUsername(e.target.value)} />

            </div>
            <div class="mb-3">
              <label class="form-label text-light fw-medium">Password</label>
              <input type="password" class="form-control input-box" value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-light fs-6">{error}</p>}
            {loading && <p>Loading...</p>}
            <div className="d-flex flex-row w-100 justify-content-center mb-1">
              <button
                type="submit"
                className="btn btn-success w-50 text-light fw-semibold"
                disabled={loading}>
                Login
              </button>
            </div>
          </form>
          <p className="text-light fw-medium fs-6 my-0 text-center">Don't have an account?</p>
          <div className="d-flex flex-row w-100 justify-content-center mb-1">
            <button
              onClick={() => navigate("/signup")}
              className="btn text-light fw-semibold w-75" style={{backgroundColor: "#375c84"}}>
              Create Account
            </button>
          </div>
        </div>

        <div className="text-light pb-5" style={{ width: "30%", textShadow: "0 0 8px #303030"}} >
          <h2 className="fs-1 text-start" style={{fontWeight: "700"}}>Boarding Awaits</h2>
          <p className="fw-bold fs-4 ps-0 text-start fst-italic">Your gateway to seamless travel
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
