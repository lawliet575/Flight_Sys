import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditPassenger() {
  const { id } = useParams();  // Extract the passenger ID from the URL parameter
  const navigate = useNavigate();  // Initialize the useNavigate hook
  const [passportId, setPassportId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
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
            setPassportId(passenger[1]);
            setFirstName(passenger[2]);
            setLastName(passenger[3]);
            setEmail(passenger[4]);
            setContact(passenger[5]);
            setAddress(passenger[6]);
            setGender(passenger[7]);
            setDob(passenger[8].split('T')[0]);
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
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passportId || !firstName || !lastName || !email || !contact || !address || !gender || !dob) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const passengerData = {
      passportId: passportId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      contact: contact,
      address: address,
      gender: gender,
      dob: dob,
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
      {/* Return to Home Page Button */}
      <button
        onClick={() => navigate('/passengers')}
        style={{
          backgroundColor: '#2980b9',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,  // Ensure it stays on top
        }}
      >
        Return to Home Page
      </button>
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
