CREATE TABLE pilot (
  Pilot_ID int PRIMARY KEY,
  Pilot_Name varchar(255) NOT NULL,
  Exp_Years int not NULL,
  pilot_rank char(1) not null,
  Date_of_birth date,
  ContactNo varchar(255),
  Email varchar(255),
  Address varchar(255)
);

create table airport(
airport_id int PRIMARY KEY,
airport_name varchar(255) not null,
city varchar(255) not null
);


create table Airline(
AirlineID int primary key,
airline_name varchar(255) not null,
founding_date date,
a_scope varchar(255) --domestic or international e.g
);

create table aircraft(
aircraftID int primary key,
modelno int not null,
a_capacity int not null,
airlineID int not null,
constraint afk1 foreign key (airlineID) references Airline(AirlineID)
);

create table flight(
FlightID int primary key,
Dep_airport_id int not null, --f2
DepartureDate date not null,
DepartureTime varchar(255) not null,
Arr_airport_id int not null, --f3
ArrivalDate date not null,
ArrivalTime varchar(255) not null,
Aircraft_ID int not null, --f1
constraint f1 foreign key (Aircraft_ID) references aircraft(aircraftID),
constraint f2 foreign key (Dep_airport_id) references airport(airport_id),
constraint f3 foreign key (Arr_airport_id) references airport(airport_id)
);

create table FlightAssignments(
FlightID int,
PilotID int,
constraint fa1 foreign key (FlightID) references flight(FlightID),
constraint fa2 foreign key (PilotID) references pilot(Pilot_ID),
Primary key(FlightID,PilotID)
);


create table passenger (
PassengerID int primary key,
passportID int not null unique,
Firstname varchar(255) not null,
Lastname varchar(255) not null,
Email varchar(255),
ContactNo varchar(255),
Address varchar(255),
Gender varchar(255),
DateofBirth date
--HealthConcerns char(1)
);

create table flight_class(
ClassID int primary key,
Class_Description varchar(255) not null,
BaggageAllowed decimal(10,2) not null
);


create table Bookings(
BookingID int primary key,
PassengerID int not null,
FLightID int not null,
f_ClassID int not null,
BookingDate date not null,
SeatNo varchar(255) not null,
TotalPrice decimal(10,2) not null,
constraint bk1 foreign key (PassengerID) references passenger(PassengerID),
constraint bk2 foreign key (FLightID) references flight(FlightID),
constraint bk3 foreign key (f_ClassID) references flight_class(ClassID)
);

create table sys_user(--normal users and admin yahi se ajayenge
u_id int primary key,
u_pw varchar(255),
u_name varchar(255),
email varchar(255)
);

--INSERTING SOME SAMPLE FLIGHT DATA
--Airports
 INSERT INTO airport (airport_id, airport_name, city)
VALUES (1, 'Jinnah International Airport', 'Karachi');

INSERT INTO airport (airport_id, airport_name, city)
VALUES (2, 'Iqbal International Airport', 'Lahore');

INSERT INTO airport (airport_id, airport_name, city)
VALUES (3, 'Heathrow Airport', 'London');

--Airlines

INSERT INTO Airline (AirlineID, airline_name, founding_date, a_scope)
VALUES (10, 'Qatar', '5-june-2005', 'International');

INSERT INTO Airline (AirlineID, airline_name, founding_date, a_scope)
VALUES (20, 'PIA', '5-dec-1998', 'Domestic');

INSERT INTO Airline (AirlineID, airline_name, founding_date, a_scope)
VALUES (30, 'Emirates', '5-june-1995', 'International');

--Aircrafts
INSERT INTO aircraft (aircraftID, modelno, a_capacity, airlineID)
VALUES (1, 20, 500, 10);

INSERT INTO aircraft (aircraftID, modelno, a_capacity, airlineID)
VALUES (2, 15, 400, 20);

INSERT INTO aircraft (aircraftID, modelno, a_capacity, airlineID)
VALUES (3, 12, 900, 30);

--FLIGHTS
INSERT INTO flight (FlightID, Dep_airport_id, DepartureDate, DepartureTime, Arr_airport_id, ArrivalDate, ArrivalTime, Aircraft_ID)
VALUES (1, 1, '5-june-2024', '08:00:00', 2, '6-june-2024', '11:00:00', 1);

INSERT INTO flight (FlightID, Dep_airport_id, DepartureDate, DepartureTime, Arr_airport_id, ArrivalDate, ArrivalTime, Aircraft_ID)
VALUES (2, 2, '15-aug-2024', '12:30:00', 3, '17-aug-2024', '18:00:00', 2);

INSERT INTO flight (FlightID, Dep_airport_id, DepartureDate, DepartureTime, Arr_airport_id, ArrivalDate, ArrivalTime, Aircraft_ID)
VALUES (3, 3, '18-dec-2024', '09:45:00', 1, '19-dec-2024', '17:30:00', 3);

INSERT INTO flight (FlightID, Dep_airport_id, DepartureDate, DepartureTime, Arr_airport_id, ArrivalDate, ArrivalTime, Aircraft_ID)
VALUES (4, 1, '17-aug-2024', '10:00:00', 3, '18-aug-2024', '18:15:00', 1);

INSERT INTO flight (FlightID, Dep_airport_id, DepartureDate, DepartureTime, Arr_airport_id, ArrivalDate, ArrivalTime, Aircraft_ID)
VALUES (5, 2, '18-jan-2024', '14:30:00', 3, '20-jan-2024', '22:45:00', 2);

--for bookings first we need passengerid,flassid,and flightid to be filled 
INSERT INTO Passenger (PassengerID, PassportID, Firstname, Lastname, Email, ContactNo, Address, Gender, DateofBirth)
VALUES (1, 12345678, 'John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St, Cityville', 'Male', TO_DATE('1990-01-15', 'YYYY-MM-DD'));

INSERT INTO Passenger (PassengerID, PassportID, Firstname, Lastname, Email, ContactNo, Address, Gender, DateofBirth)
VALUES (2, 87654321, 'Jane', 'Smith', 'jane.smith@example.com', '098-765-4321', '456 Elm St, Townville', 'Female', TO_DATE('1985-03-22', 'YYYY-MM-DD'));

INSERT INTO Passenger (PassengerID, PassportID, Firstname, Lastname, Email, ContactNo, Address, Gender, DateofBirth)
VALUES (3, 11223344, 'Alex', 'Johnson', 'alex.johnson@example.com', '555-123-4567', '789 Maple Ave, Villagetown', 'Female', TO_DATE('1995-08-30', 'YYYY-MM-DD'));

--now we add classes business,economy
INSERT INTO Flight_Class (ClassID, Class_Description, BaggageAllowed)
VALUES (100, 'Economy', 23.00);

INSERT INTO Flight_Class (ClassID, Class_Description, BaggageAllowed)
VALUES (200, 'Business', 32.00);

INSERT INTO Flight_Class (ClassID, Class_Description, BaggageAllowed)
VALUES (300, 'First Class', 40.00);

--FINALLY BOOKINGS
INSERT INTO Bookings (BookingID, PassengerID, FlightID, f_ClassID, BookingDate, SeatNo, TotalPrice) 
            VALUES (     1,           2,         5,         100,       TO_DATE('2024-11-15', 'YYYY-MM-DD'), 'A23', 500.00);

INSERT INTO Bookings (BookingID, PassengerID, FlightID, f_ClassID, BookingDate, SeatNo, TotalPrice) 
VALUES (2, 1, 3, 200, TO_DATE('2024-11-16', 'YYYY-MM-DD'), 'B12', 1200.00);

INSERT INTO Bookings (BookingID, PassengerID, FlightID, f_ClassID, BookingDate, SeatNo, TotalPrice) 
VALUES (3, 3, 4, 300, TO_DATE('2024-11-17', 'YYYY-MM-DD'), 'C10', 450.00);



select * from flight_Class;
select * from bookings;






