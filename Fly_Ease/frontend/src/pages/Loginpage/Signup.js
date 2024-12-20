import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Signupmodule.css'; // Import the CSS file

function Signup() {
  const [passportId, setPassportId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [loginPw, setLoginPw] = useState(""); // Keep the login password field
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // For displaying success message

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any of the required fields are empty
    if (!passportId || !firstName || !lastName || !email || !contact || !address || !gender || !dob || !loginPw) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);
    setSuccessMessage(""); // Reset success message

    const passengerData = {
      passportId,
      firstName,
      lastName,
      email,
      contact,
      address,
      gender,
      dob,
      loginpw: loginPw,  // Pass the login password to the API
    };

    try {
      // Step 1: Create the account
      const response = await fetch("http://localhost:3001/api/passengers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passengerData),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      const data = await response.json();
      setSuccess(true);
      console.log("Account created:", data);

      // Step 2: Call the /api/passengerpss/{passportId} API to get the login ID
      const loginIdResponse = await fetch(`http://localhost:3001/api/passengerpss/${passportId}`);
      if (!loginIdResponse.ok) {
        throw new Error("Failed to fetch login ID");
      }

      const loginIdData = await loginIdResponse.json();
      const loginId = loginIdData.data[0]; // Assuming the login ID is in the first element of the data array

      // Step 3: Display the login ID
      setSuccess(true);
      setError(""); // Clear any previous errors
      setSuccessMessage(`Account created successfully! Here is your login ID: ${loginId}`);

      console.log("Login ID: ", loginId); // Log the login ID for debugging

    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    navigate("/Login");
  };

  return (
    <div className="signup-container">
      <div className="body-overlay"></div>
      <div className="form-container">
        <h2 className="text-center fs-2 text-light fw-bold">Sign Up</h2>
        <form onSubmit={handleSubmit} className="mt-0 pt-4">
          <div className="input-field">
            <label>Passport ID:</label>
            <input type="text" className="input-box" value={passportId} onChange={(e) => setPassportId(e.target.value)} />
          </div>
          <div className="input-field">
            <label>First Name:</label>
            <input type="text" className="input-box" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Last Name:</label>
            <input type="text" className="input-box" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Email:</label>
            <input type="email" className="input-box" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Contact:</label>
            <input type="text" className="input-box" value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Address:</label>
            <input type="text" className="input-box" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Gender:</label>
            <select value={gender} className="input-box" onChange={(e) => setGender(e.target.value)}>
              <option className="input-box" value="">Select Gender</option>
              <option className="input-box" value="M">Male</option>
              <option className="input-box" value="F">Female</option>
            </select>
          </div>
          <div className="input-field">
            <label>Date of Birth:</label>
            <input className="input-box" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Login Password:</label>
            <input className="input-box" type="password" value={loginPw} onChange={(e) => setLoginPw(e.target.value)} />
          </div>

          <button type="submit" className="btn text-light fw-semibold btn-success" disabled={loading}>
            Sign Up
          </button>

          {error && <p className="error-message">{error}</p>}
          {success && !error && <p className="success-message">{successMessage}</p>}
          {loading && <p>Loading...</p>}


        </form>
        <button onClick={handleReturn} className="create-account-btn">
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
          </svg> */}
          Back


        </button>
      </div>
    </div>
  );
}

export default Signup;
