import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function AddPassenger() {
  const [passportId, setPassportId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // Initialize the useNavigate hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!passportId || !firstName || !lastName || !email || !contact || !address || !gender || !dob || !loginId || !loginPw) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors
    setSuccess(false); // Reset success message

    // Prepare the data to be sent to the API
    const passengerData = {
      passportId,
      firstName,
      lastName,
      email,
      contact,
      address,
      gender,
      dob,
      loginid: loginId,
      loginpw: loginPw,
    };

    try {
      const response = await fetch("http://localhost:3001/api/passengers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passengerData),
      });

      if (!response.ok) {
        throw new Error("Failed to add passenger");
      }

      const data = await response.json();
      setSuccess(true); // If the passenger was added successfully
      console.log("Passenger added:", data);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleReturn = () => {
    navigate("/passengers"); // Navigate to the /passengers page using useNavigate
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <h2>Add New Passenger</h2>
      <form onSubmit={handleSubmit}>
        <div style={formFieldStyle}>
          <label>Passport ID:</label>
          <input
            type="text"
            value={passportId}
            onChange={(e) => setPassportId(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Contact:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div style={formFieldStyle}>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Login ID:</label>
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
        </div>
        <div style={formFieldStyle}>
          <label>Login Password:</label>
          <input
            type="password"
            value={loginPw}
            onChange={(e) => setLoginPw(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Passenger added successfully!</p>}
        {loading && <p>Loading...</p>}

        <button
          type="submit"
          style={buttonStyle}
          disabled={loading}
        >
          Add Passenger
        </button>
      </form>

      <button
        onClick={handleReturn} // Trigger the return navigation
        style={returnButtonStyle}
      >
        Return to Passengers
      </button>
    </div>
  );
}

const formFieldStyle = {
  marginBottom: "15px",
  textAlign: "left",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 20px",
  border: "none",
  cursor: "pointer",
};

const returnButtonStyle = {
  backgroundColor: "#f44336", // Red color for the Return button
  color: "white",
  padding: "10px 20px",
  border: "none",
  cursor: "pointer",
  marginTop: "10px",
};

export default AddPassenger;
