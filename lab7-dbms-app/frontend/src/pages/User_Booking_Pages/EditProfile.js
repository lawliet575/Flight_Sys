import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      {/* Return to Home Button */}
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
      <button
  onClick={() => navigate("/")}
  style={{
    position: "fixed",
    top: "20px",
    left: "20px",
    padding: "10px 20px",
    backgroundColor: "rgb(142, 42, 6)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 4px 6px rgba(249, 248, 248, 0.1)"
  }}
>
  Return to Home Page
</button>
      </div>

      <h2>Update Profile Info</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
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
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
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
            <label>Login Password:</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: showPassword ? "green" : "red",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>Account Details updated successfully!</p>}

          <button type="submit" style={buttonStyle} disabled={loading}>
            Update
          </button>
        </form>
      )}
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

export default EditProfile;
