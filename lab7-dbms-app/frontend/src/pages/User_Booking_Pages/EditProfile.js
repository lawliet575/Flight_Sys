import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProfileModule.css";

function EditProfile() {
  const { id } = useParams(); // Extract the passenger ID from the URL parameter
  const navigate = useNavigate(); // Navigation hook for routing

  const [passportId, setPassportId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Fetch passenger data when component mounts
  useEffect(() => {
    const fetchPassengerData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/passengers/${id}`);
        const data = await response.json();

        if (data && data.data) {
          const passenger = data.data;
          setPassportId(passenger[1]);
          setFirstName(passenger[2]);
          setLastName(passenger[3]);
          setEmail(passenger[4]);
          setContact(passenger[5]);
          setAddress(passenger[6]);
          setGender(passenger[7]);
          setDob(passenger[8].split("T")[0]);
          setLoginPw(passenger[10]);
        } else {
          setError("Passenger not found.");
        }
      } catch (err) {
        setError("Error fetching passenger data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPassengerData();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(false); // Reset success state

    if (!passportId || !firstName || !lastName || !email || !contact || !address || !gender || !dob || !loginPw) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    const passengerData = {
      passportId,
      firstName,
      lastName,
      email,
      contact,
      address,
      gender,
      dob,
      loginpw: loginPw,
    };

    try {
      const response = await fetch(`http://localhost:3001/api/passengers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passengerData),
      });

      if (!response.ok) {
        throw new Error("Failed to update passenger.");
      }

      const data = await response.json();
      setSuccess(true);
      console.log("Passenger updated:", data);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      {/* Return to Home Button */}
      <button className="edit-profile-back-button" onClick={() => navigate("/")}>
        Return to Home Page
      </button>

      <h2>Update Profile Info</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Passport ID:</label>
            <input
              type="text"
              value={passportId}
              onChange={(e) => setPassportId(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Contact:</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="form-field">
            <label>Date of Birth:</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Login Password:</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-button"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Account Details updated successfully!</p>}

          <button type="submit" className="submit-button" disabled={loading}>
            Update
          </button>
        </form>
      )}
    </div>
  );
}

export default EditProfile;
