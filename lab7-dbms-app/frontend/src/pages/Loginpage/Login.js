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
      <div className="body-overlay"></div>
      <div className="login-content">
        <div className="form-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-field">
              <label>
                Username:
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            </div>
            <div className="input-field">
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            {error && <p className="error-message">{error}</p>}
            {loading && <p>Loading...</p>}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              Login
            </button>
          </form>
          <p className="create-account-text">Don't have an account?</p>
          <button
            onClick={() => navigate("/signup")}
            className="create-account-btn"
          >
            Create Account
          </button>
        </div>

        <div className="header-text">
          <h2>Boarding Awaits</h2>
          <p>
          Your gateway to seamless travel
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
