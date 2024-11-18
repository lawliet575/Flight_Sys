import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      // Fetch admin credentials from the API
      const response = await fetch("http://localhost:3001/api/admin");

      if (!response.ok) {
        throw new Error("Failed to fetch admin data.");
      }

      const data = await response.json();
      const adminCredentials = data.data[0]; // The first item in the array

      // Check if entered username and password match the admin credentials
      if (adminCredentials[0] === username && adminCredentials[1] === password) {
        // Redirect to the Flights page if the credentials match
        navigate("/adminhome"); //navigate to home page of admin here 
      } else {
        setError("Invalid username or password.");
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
    </div>
  );
}

export default Login;
