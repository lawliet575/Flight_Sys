import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PassengerContext } from "./PassengerContext";

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
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                margin: "5px 0",
                boxSizing: "border-box",
              }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                margin: "5px 0",
                boxSizing: "border-box",
              }}
            />
          </label>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Loading...</p>}
        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          Login
        </button>
      </form>
      <p style={{ marginTop: "20px" }}>Don't have an account?</p>
      <button
        onClick={() => navigate("/signup")}
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Create Account
      </button>
    </div>
  );
}

export default Login;
