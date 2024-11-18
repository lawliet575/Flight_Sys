import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Addpassenger.css';

const AddPassenger = () => {
  // State to hold form input values
  const [id, setId] = useState('');
  const [passportId, setPassportId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  // Function to format the date to "d-MMMM-yyyy"
  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!id || !passportId || !firstName || !lastName || !email || !contact || !address || !gender || !dob) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill in all fields.',
        showConfirmButton: true,
      });
    }

    // Format date of birth to the required format "d-MMMM-yyyy"
    const formattedDob = formatDate(dob);

    // Create the passenger data object
    const newPassenger = {
      id,
      passportId,
      firstName,
      lastName,
      email,
      contact,
      address,
      gender,
      dob: formattedDob,
    };

    try {
      // Sending the POST request to the backend API
      const response = await fetch('http://localhost:3001/api/passengers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPassenger),
      });

      // Check if the response is successful
      if (response.ok) {
        await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Passenger ${firstName} ${lastName} added successfully.`,
          showConfirmButton: false,
          timer: 1500,
        });
        // Clear form after successful submission
        setId('');
        setPassportId('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setContact('');
        setAddress('');
        setGender('');
        setDob('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please try again later.',
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error('Error adding passenger:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Could not reach the server. Please try again.',
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="add-passenger-container">
      <h1 className="add-passenger-heading">Add New Passenger</h1>
      <form className="add-passenger-form" onSubmit={handleSubmit}>
        <label htmlFor="id">Passenger ID</label>
        <input
          type="number"
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />

        <label htmlFor="passportId">Passport ID</label>
        <input
          type="number"
          id="passportId"
          value={passportId}
          onChange={(e) => setPassportId(e.target.value)}
          required
        />

        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="contact">Contact No</label>
        <input
          type="text"
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />

        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label htmlFor="dob">Date of Birth</label>
        <input
          type="date"
          id="dob"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />

        <button type="submit" className="submit-button">
          Add Passenger
        </button>
      </form>
    </div>
  );
};

export default AddPassenger;
