import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EditPassenger() {
  const { id } = useParams();  // Extract the passenger ID from the URL parameter
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
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPassengerData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/passengers/${id}`);
        const data = await response.json();

        if (data && data.data) {
          const passenger = data.data;
          if (passenger) {
            // Map the response fields to the form state values
            setPassportId(passenger[1]);   // Passport ID (Editable now)
            setFirstName(passenger[2]);    // First Name
            setLastName(passenger[3]);     // Last Name
            setEmail(passenger[4]);        // Email
            setContact(passenger[5]);      // Contact
            setAddress(passenger[6]);      // Address
            setGender(passenger[7]);       // Gender
            setDob(passenger[8].split('T')[0]);  // Date of Birth (converting ISO to yyyy-mm-dd)
            setLoginId(passenger[9]);      // Login ID
            setLoginPw(passenger[10]);     // Login Password
          } else {
            setError("Passenger not found");
          }
        } else {
          setError("Error fetching passenger data");
        }
      } catch (err) {
        setError("Error fetching passenger data");
      } finally {
        setLoading(false);
      }
    };

    fetchPassengerData();
  }, [id]); // Re-run when `id` changes

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
      passportId: passportId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      contact: contact,
      address: address,
      gender: gender,
      dob: dob,
      loginid: loginId,
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
        throw new Error("Failed to update passenger");
      }

      const data = await response.json();
      setSuccess(true); // If the passenger was updated successfully
      console.log("Passenger updated:", data);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <h2>Edit Passenger</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={formFieldStyle}>
            <label>Passport ID:</label>
            <input
              type="text"
              value={passportId}
              onChange={(e) => setPassportId(e.target.value)} // Now editable
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
          {success && <p style={{ color: "green" }}>Passenger updated successfully!</p>}

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
          >
            Update Passenger
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

export default EditPassenger;
