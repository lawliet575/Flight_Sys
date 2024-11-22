import React, { createContext, useState } from "react";

// Create the context
export const PassengerContext = createContext();

// Create the provider component
export const PassengerProvider = ({ children }) => {
  const [passengerId, setPassengerId] = useState(null); // State to store the ID

  console.log("Passenger ID in Provider:", passengerId);  // Log the passenger ID


  return (
    <PassengerContext.Provider value={{ passengerId, setPassengerId }}>
      {children}
    </PassengerContext.Provider>
  );
};
