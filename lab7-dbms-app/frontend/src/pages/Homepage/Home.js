import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

function Home() {
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle navigation to the /viewflights page
  const handleBookNow = () => {
    navigate("/viewflights"); // Redirect to /viewflights page
  };

  // Function to handle sign out (navigate to the root page)
  const handleSignOut = () => {
    navigate("/"); // Redirect to the root page (sign-out / log out behavior)
  };

  return (
    <div style={styles.container}>
      {/* Sign Out Button */}
      <button onClick={handleSignOut} style={styles.signOutButton}>
        Sign Out
      </button>

      {/* Welcome message */}
      <div style={styles.header}>
        <h1>Welcome to the Flight Booking System</h1>
        <p style={styles.subtitle}>Your one-stop solution for booking and managing flights</p>
      </div>

      <div style={styles.content}>
        {/* Book Now Button */}
        <button onClick={handleBookNow} style={styles.bookButton}>
          Book Now
        </button>
      </div>

      <footer style={styles.footer}>
        <p>&copy; 2024 Flight Booking System. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Styles for centering the elements and buttons
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full height of the screen
    textAlign: "center",
    backgroundColor: "#e0f7fa", // Light blue background
    fontFamily: "'Arial', sans-serif", // Clean, readable font
    position: "relative", // Allow absolute positioning for the button
  },
  signOutButton: {
    position: "absolute", // Position button absolutely
    top: "20px", // 20px from the top
    left: "20px", // 20px from the left
    padding: "10px 20px",
    backgroundColor: "#f44336", // Red color for Sign Out button
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
  },
  header: {
    marginBottom: "30px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#555",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#f44336", // Red color for Sign Out button
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px", // Space between buttons
    borderRadius: "5px",
    fontSize: "16px",
  },
  content: {
    marginTop: "20px",
  },
  bookButton: {
    padding: "20px 40px",
    backgroundColor: "#007BFF", // Blue for Book Now button
    color: "white",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "5px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  footer: {
    marginTop: "50px",
    fontSize: "14px",
    color: "#777",
  },
};

export default Home;
