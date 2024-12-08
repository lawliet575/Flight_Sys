import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Homepage/Homemodule.css";

function Stats() {
    const navigate = useNavigate();

    const [popularFlightID, setPopularFlightID] = useState(null);
    const [popularFlightCount, setPopularFlightCount] = useState(null)
    const [expensiveFlightID, setExpensiveFlightID] = useState(null);
    const [expensiveFlightPrice, setExpensiveFlightPrice] = useState(null);
    const [cheapFlightID, setCheapFlightID] = useState(null);
    const [cheapFlightPrice, setCheapFlightPrice] = useState(null);
    const [avgFlightCost, setAvgFlightCost] = useState(null);
    const [profAirline, setProfAirline] = useState(null);
    const [maxProfit, setMaxProfit] = useState(null);
    const [econBookings, setEconBookings] = useState(null);
    const [businessBookings, setBusinessBookings] = useState(null);
    const [firstBookings, setFirstBookings] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api//popularflight`);
                if (!response.ok) {
                    throw new Error("Failed to fetch price");
                }
                const popularflightData = await response.json();
                setPopularFlightID(popularflightData[0][0]);
                setPopularFlightCount(popularflightData[0][1]);


                // Extract price from the response

            } catch (err) {
                console.log(err.message);
            }
            try {
                const response = await fetch(`http://localhost:3001/api//expflight`);
                if (!response.ok) {
                    throw new Error("Failed to fetch price");
                }
                const expflightData = await response.json();
                setExpensiveFlightID(expflightData[0][0]);
                setExpensiveFlightPrice(expflightData[0][1]);


                // Extract price from the response

            } catch (err) {
                console.log(err.message);
            }

            try {
                const response = await fetch(`http://localhost:3001/api//cheapflight`);
                if (!response.ok) {
                    throw new Error("Failed to fetch price");
                }
                const cheapflightData = await response.json();
                setCheapFlightID(cheapflightData[0][0]);
                setCheapFlightPrice(cheapflightData[0][1]);


                // Extract price from the response

            } catch (err) {
                console.log(err.message);
            }

            try {
                const response = await fetch(`http://localhost:3001/api//avgflightcost`);
                if (!response.ok) {
                    throw new Error("Failed to fetch price");
                }
                const avgflightData = await response.json();
                setAvgFlightCost(avgflightData[0]);
                console.log(avgFlightCost);

                // Extract price from the response

            } catch (err) {
                console.log(err.message);
            }
            try {
                const response = await fetch(`http://localhost:3001/api//profitairline`);
                if (!response.ok) {
                    throw new Error("Failed to fetch price");
                }
                const profAirlineData = await response.json();
                setProfAirline(profAirlineData[0][0]);
                setMaxProfit(profAirlineData[0][1])
                console.log(profAirline);

                // Extract price from the response

            } catch (err) {
                console.log(err.message);
            }

            try {
                const response = await fetch(`http://localhost:3001/api//flightclassbookings`);
                if (!response.ok) {
                    throw new Error("Failed to fetch price");
                }
                const flightbookingsData = await response.json();
                setEconBookings(flightbookingsData[0][1]);
                setBusinessBookings(flightbookingsData[1][1]);
                setFirstBookings(flightbookingsData[2][1]);
                console.log(flightbookingsData);


                // Extract price from the response

            } catch (err) {
                console.log(err.message);
            }


        }




        fetchData();
    });
    const goToBookings = () => {
        navigate("/bookings");
    };

    const goToPassengers = () => {
        navigate("/passengers");
    };

    const goToAirlines = () => {
        navigate("/airlines");
    };

    const goToFlightClasses = () => {
        navigate("/flightclass");
    };

    const goToAirports = () => {
        navigate("/airports");
    };

    const Back = () => {
        // Redirect to login or home page
        navigate("/adminhome");
    };

    return (
        <div className="home-container mt-0 pt-4" style={{ textAlign: "center", marginTop: "50px" }}>
            {/* Logout Button */}

            <div className="d-flex flex-column justify-content-center h-100">
                <div className="text-light mb-5" style={{ textShadow: "0 0 15px #8c8c8c" }}>
                    <button
                        onClick={Back}
                        className="btn btn-danger fw-semibold mt-3"
                        style={{
                            position: "absolute",
                            top: "10px",
                            left: "25px",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Back
                    </button>
                    <h1 className="fw-bold">Financial Peformance Summary</h1>
                </div>

                <div class="container text-center">
                    <div class="row">
                        <div class="col-3">
                            <div>
                                <div class="card-body card-container d-flex flex-column justify-content-center" style={{ height: "150px" }}>
                                    <p class="fw-semibold fs-5 my-0 py-0">Most Popular Flight</p>
                                    <p class="fw-bold fs-2 my-0 py-0 text-info">{popularFlightID}</p>
                                    <p class="fw-semibold fs-4 py-0 mb-0">#Bookings: {popularFlightCount}</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-3">
                            <div>
                                <div class="card-body card-container d-flex flex-column justify-content-center" style={{ height: "150px" }}>
                                    <p class="fw-semibold fs-5 my-0 py-0">Most Expenive Flight</p>
                                    <p class="fw-bold fs-2 my-0 py-0 text-info">{expensiveFlightID}</p>
                                    <p class="fw-semibold fs-5 py-0 mb-0">Total Amount: PKR {expensiveFlightPrice}</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-3">
                            <div>
                                <div class="card-body card-container d-flex flex-column justify-content-center" style={{ height: "150px" }}>
                                    <p class="fw-semibold fs-5 my-0 py-0">Cheapest Flight</p>
                                    <p class="fw-bold fs-2 my-0 py-0 text-info">{cheapFlightID}</p>
                                    <p class="fw-semibold fs-5 py-0 mb-0">Amount: PKR {cheapFlightPrice}</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-3">
                            <div>
                                <div class="card-body card-container d-flex flex-column justify-content-center" style={{ height: "150px" }}>
                                    <p class="fw-semibold fs-5 my-0 py-0">Avg Ticket Value</p>
                                    <p class="fw-bold fs-2 my-0 py-0">PKR <span className="text-info">{avgFlightCost}</span></p>
                                </div>
                            </div>
                        </div>



                    </div>
                    <div class="row mt-4">
                        <div class="col-3">
                            <div>
                                <div class="card-body card-container d-flex flex-column justify-content-center" style={{ height: "150px" }}>
                                    <p class="fw-semibold fs-5 my-0 py-0">Most Profitable Airline</p>
                                    <p class="fw-bold fs-2 my-0 py-0 text-info">{profAirline}</p>
                                    <p class="fw-semibold fs-5 py-0 mb-0">Revenue: PKR {maxProfit}</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-3">
                            <div>
                                <div class="card-body card-container d-flex flex-column justify-content-center" style={{ height: "150px" }}>
                                    <p class="fw-semibold fs-4 my-0 py-0">#Economy Bookins</p>
                                    <p class="fw-bold fs-1 my-0 py-0 text-info">{econBookings}</p>                                    
                                </div>
                            </div>
                        </div>

                        <div class="col-3">
                            <div>
                                <div class="card-body card-container d-flex flex-column justify-content-center" style={{ height: "150px" }}>
                                    <p class="fw-semibold fs-5 my-0 py-0">#Business Class Bookings</p>
                                    <p class="fw-bold fs-1 my-0 py-0 text-info">{businessBookings}</p>                                    
                                </div>
                            </div>
                        </div>
                        <div class="col-3">
                            <div>
                                <div class="card-body card-container d-flex flex-column justify-content-center" style={{ height: "150px" }}>
                                    <p class="fw-semibold fs-5 my-0 py-0">#First Class Bookings</p>
                                    <p class="fw-bold fs-1 my-0 py-0 text-info">{firstBookings}</p>                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div>

          <button onClick={goToFlights} style={buttonStyle}>
            View Flights
          </button>
          <br />
          <button onClick={goToBookings} style={buttonStyle}>
            View Bookings
          </button>
          <br />
          <button onClick={goToPassengers} style={buttonStyle}>
            View Passengers
          </button>
          <br />
          <button onClick={goToAirlines} style={buttonStyle}>
            View Airlines
          </button>
          <br />
          <button onClick={goToFlightClasses} style={buttonStyle}>
            View Flight Classes
          </button>
          <br />
          <button onClick={goToAirports} style={buttonStyle}>
            View Airports
          </button>
        </div> */}
            </div>
        </div>
    );
}

const buttonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    marginBottom: "15px",
    width: "200px",
    fontSize: "16px",
};

export default Stats;
