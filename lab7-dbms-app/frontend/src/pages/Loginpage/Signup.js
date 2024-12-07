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
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passportId || !firstName || !lastName || !email || !contact || !address || !gender || !dob || !loginId || !loginPw) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

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
        throw new Error("Failed to create account");
      }

      const data = await response.json();
      setSuccess(true);
      console.log("Account created:", data);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="body-overlay"></div>
      <div className="form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label>Passport ID:</label>
            <input type="text" value={passportId} onChange={(e) => setPassportId(e.target.value)} />
          </div>
          <div className="input-field">
            <label>First Name:</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Last Name:</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Contact:</label>
            <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Address:</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="input-field">
            <label>Date of Birth:</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Login ID:</label>
            <input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
          </div>
          <div className="input-field">
            <label>Login Password:</label>
            <input type="password" value={loginPw} onChange={(e) => setLoginPw(e.target.value)} />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Account created successfully!</p>}
          {loading && <p>Loading...</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            Sign Up
          </button>
        </form>
        <button onClick={handleReturn} className="create-account-btn">
        ←
        </button>
      </div>
    </div>
  );
}

export default Signup;
