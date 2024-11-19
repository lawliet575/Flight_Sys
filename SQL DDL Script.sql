BEGIN
   FOR t IN (SELECT table_name FROM user_tables) LOOP
      EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS';
   END LOOP;
END;


CREATE TABLE PILOTS (
    PILOT_ID VARCHAR(10) PRIMARY KEY,
    PILOT_NAME VARCHAR(255) NOT NULL,
    EXP_YEARS INT NOT NULL,
    PILOT_RANK CHAR(1) NOT NULL,
    DATE_OF_BIRTH DATE,
    CONTACT_NO VARCHAR(255),
    EMAIL VARCHAR(255),
    ADDRESS VARCHAR(255)
);

CREATE TABLE AIRPORTS (
    AIRPORT_ID VARCHAR(10) PRIMARY KEY,
    AIRPORT_NAME VARCHAR(255) NOT NULL,
    CITY VARCHAR(255) NOT NULL
);

CREATE TABLE AIRLINES (
    AIRLINE_ID VARCHAR(10) PRIMARY KEY,
    AIRLINE_NAME VARCHAR(255) NOT NULL,
    FOUNDING_DATE DATE,
    A_SCOPE VARCHAR(3) CHECK (A_SCOPE='DOM' OR A_SCOPE='INT') -- Domestic or international, e.g.
);

CREATE TABLE AIRCRAFTS (
    AIRCRAFT_ID VARCHAR(10) PRIMARY KEY,
    MODELNO INT NOT NULL,
    A_CAPACITY INT NOT NULL,
    AIRLINE_ID VARCHAR(10) NOT NULL,
    CONSTRAINT AFK1 FOREIGN KEY (AIRLINE_ID) REFERENCES AIRLINES(AIRLINE_ID)
);

CREATE TABLE FLIGHTS (
    FLIGHT_ID VARCHAR(10) PRIMARY KEY,
    DEP_AIRPORT_ID VARCHAR(10) NOT NULL, -- f2
    DEPARTURE_DATE DATE NOT NULL,
    DEPARTURE_TIME VARCHAR(255) NOT NULL,
    ARR_AIRPORT_ID VARCHAR(10) NOT NULL, -- f3
    ARRIVAL_DATE DATE NOT NULL,
    ARRIVAL_TIME VARCHAR(255) NOT NULL,
    AIRCRAFT_ID VARCHAR(10) NOT NULL, -- f1
    CONSTRAINT F1 FOREIGN KEY (AIRCRAFT_ID) REFERENCES AIRCRAFTS(AIRCRAFT_ID),
    CONSTRAINT F2 FOREIGN KEY (DEP_AIRPORT_ID) REFERENCES AIRPORTS(AIRPORT_ID),
    CONSTRAINT F3 FOREIGN KEY (ARR_AIRPORT_ID) REFERENCES AIRPORTS(AIRPORT_ID)
);


CREATE TABLE FLIGHT_ASSIGNMENTS (
    FLIGHT_ID VARCHAR(10),
    PILOT_ID VARCHAR(10),
    CONSTRAINT FA1 FOREIGN KEY (FLIGHT_ID) REFERENCES FLIGHTS(FLIGHT_ID),
    CONSTRAINT FA2 FOREIGN KEY (PILOT_ID) REFERENCES PILOTS(PILOT_ID),
    PRIMARY KEY(FLIGHT_ID, PILOT_ID)
);

CREATE TABLE PASSENGERS(
    PASSENGER_ID VARCHAR(10) PRIMARY KEY,
    PASSPORT_ID INT NOT NULL UNIQUE,
    FIRSTNAME VARCHAR(255) NOT NULL,
    LASTNAME VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255),
    CONTACT_NO VARCHAR(255),
    ADDRESS VARCHAR(255),
    GENDER VARCHAR(1) CHECK (GENDER='M' OR GENDER='F'),
    DATE_OF_BIRTH DATE,
    LOGIN_ID varchar2(255),
    LOGIN_PW varchar2(255)
);



CREATE TABLE FLIGHT_CLASS (
    CLASS_ID VARCHAR(10) PRIMARY KEY,
    CLASS_DESCRIPTION VARCHAR(255) NOT NULL,
    BAGGAGE_ALLOWED DECIMAL(10,2) NOT NULL
);

CREATE TABLE BOOKINGS (
    BOOKING_ID VARCHAR(10) PRIMARY KEY,
    PASSENGER_ID VARCHAR(10) NOT NULL,
    FLIGHT_ID VARCHAR(10) NOT NULL,
    f_ClassID VARCHAR(10) NOT NULL,
    BOOKING_DATE DATE NOT NULL,
    SEAT_NO VARCHAR(255) NOT NULL,
    TOTAL_PRICE DECIMAL(10,2) NOT NULL,
    CONSTRAINT BK1 FOREIGN KEY (PASSENGER_ID) REFERENCES PASSENGERS(PASSENGER_ID),
    CONSTRAINT BK2 FOREIGN KEY (FLIGHT_ID) REFERENCES FLIGHTS(FLIGHT_ID),
    CONSTRAINT BK3 FOREIGN KEY (f_ClassID) REFERENCES FLIGHT_CLASS(CLASS_ID)
);

CREATE TABLE Admin_Login (
    A_ID VARCHAR(10) PRIMARY KEY,
    A_PW VARCHAR(255)
);

insert into Admin_Login values('admin','admin');
commit;

--SEQUENCES FOR EACH TABLE

--SEQUENCE FOR PILOT
CREATE SEQUENCE PILOT_SEQ INCREMENT BY 1 START WITH 1;

--SEQUENCE FOR AIRPORTS
CREATE SEQUENCE AIRPORT_SEQ INCREMENT BY 1 START WITH 1;

--SEQUENCE FOR AIRLINE
CREATE SEQUENCE AIRLINE_SEQ INCREMENT BY 1 START WITH 1;

--SEQUENCE FOR AIRCRAFT
CREATE SEQUENCE AIRCRAFT_SEQ INCREMENT BY 1 START WITH 1;

--SEQUENCE FOR FLIGHT
CREATE SEQUENCE FLIGHT_SEQ INCREMENT BY 1 START WITH 1;

--SEQUENCE FOR PASSENGER
CREATE SEQUENCE PASSENGER_SEQ INCREMENT BY 1 START WITH 1;

--SEQUENCE FOR FLIGHT_CLASS
CREATE SEQUENCE FLIGHT_CLASS_SEQ INCREMENT BY 1 START WITH 1;

--SEQUENCE FOR BOOKING
CREATE SEQUENCE BOOKING_SEQ INCREMENT BY 1 START WITH 1;

--SEQUENCE FOR SYS_USER
--CREATE SEQUENCE SYS_USER_SEQ INCREMENT BY 1 START WITH 1;


--CREATING TRIGGERS 

-- TRIGGER FOR PILOT
CREATE OR REPLACE TRIGGER PLIOT_BEFORE_INSERT
BEFORE INSERT ON PILOTS
FOR EACH ROW
BEGIN
    :NEW.PILOT_ID := 'P' || PILOT_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE AIRLINE_ID WITH PREFIX 'A'
END;

-- TRIGGER FOR AIRPORTS
CREATE OR REPLACE TRIGGER AIRPORT_BEFORE_INSERT
BEFORE INSERT ON AIRPORTS
FOR EACH ROW
BEGIN
    :NEW.AIRPORT_ID := 'AP' || AIRPORT_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE AIRLINE_ID WITH PREFIX 'A'
END;

-- TRIGGER FOR AIRLINE
CREATE OR REPLACE TRIGGER AIRLINE_BEFORE_INSERT
BEFORE INSERT ON AIRLINES
FOR EACH ROW
BEGIN
    :NEW.AIRLINE_ID := 'AL' || AIRLINE_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE AIRLINE_ID WITH PREFIX 'A'
END;

-- TRIGGER FOR AIRCRAFT
CREATE OR REPLACE TRIGGER AIRCRAFT_BEFORE_INSERT
BEFORE INSERT ON AIRCRAFTS
FOR EACH ROW
BEGIN
    :NEW.AIRCRAFT_ID := 'AC' || AIRCRAFT_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE AIRCRAFT_ID WITH PREFIX 'AC'
END;

-- TRIGGER FOR FLIGHT
CREATE OR REPLACE TRIGGER FLIGHT_BEFORE_INSERT
BEFORE INSERT ON FLIGHTS
FOR EACH ROW
BEGIN
    :NEW.FLIGHT_ID := 'F' || FLIGHT_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE FLIGHT_ID WITH PREFIX 'F'
END;

-- TRIGGER FOR PASSENGER
CREATE OR REPLACE TRIGGER PASSENGER_BEFORE_INSERT
BEFORE INSERT ON PASSENGERS
FOR EACH ROW
BEGIN
    :NEW.PASSENGER_ID := 'PS' || PASSENGER_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE PASSENGER_ID WITH PREFIX 'P'
END;

-- TRIGGER FOR FLIGHT_CLASS
CREATE OR REPLACE TRIGGER FLIGHT_CLASS_BEFORE_INSERT
BEFORE INSERT ON FLIGHT_CLASS
FOR EACH ROW
BEGIN
    :NEW.CLASS_ID := 'C' || FLIGHT_CLASS_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE CLASS_ID WITH PREFIX 'C'
END;

-- TRIGGER FOR BOOKINGS

CREATE OR REPLACE TRIGGER BOOKING_BEFORE_INSERT
BEFORE INSERT ON BOOKINGS
FOR EACH ROW
BEGIN
    :NEW.BOOKING_ID := 'B' || BOOKING_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE BOOKING_ID WITH PREFIX 'B'
END;


--AIRPORTS
INSERT INTO AIRPORTS (AIRPORT_NAME, CITY)
VALUES ('JINNAH INTERNATIONAL AIRPORT', 'KARACHI');

INSERT INTO AIRPORTS (AIRPORT_NAME, CITY)
VALUES ('IQBAL INTERNATIONAL AIRPORT', 'LAHORE');

INSERT INTO AIRPORTS (AIRPORT_NAME, CITY)
VALUES ('HEATHROW AIRPORT', 'LONDON');
SELECT * FROM AIRPORTS;

--AIRLINES
INSERT INTO AIRLINES (AIRLINE_NAME, FOUNDING_DATE, A_SCOPE)
VALUES ('QATAR', TO_DATE('05-JUNE-2005', 'DD-MON-YYYY'), 'INT');

INSERT INTO AIRLINES (AIRLINE_NAME, FOUNDING_DATE, A_SCOPE)
VALUES ('PIA', TO_DATE('05-DEC-1998', 'DD-MON-YYYY'), 'DOM');

INSERT INTO AIRLINES (AIRLINE_NAME, FOUNDING_DATE, A_SCOPE)
VALUES ('EMIRATES', TO_DATE('05-JUNE-1995', 'DD-MON-YYYY'), 'INT');
select * from airlines; --do remember all ids are now varchar2


--AIRCRAFTS
INSERT INTO AIRCRAFTS (MODELNO, A_CAPACITY, AIRLINE_ID)
VALUES (20, 500, 'AL1');

INSERT INTO AIRCRAFTS (MODELNO, A_CAPACITY, AIRLINE_ID)
VALUES (15, 400, 'AL2');

INSERT INTO AIRCRAFTS (MODELNO, A_CAPACITY, AIRLINE_ID)
VALUES (12, 900, 'AL3');
select * from aircrafts;

--FLIGHTS
INSERT INTO FLIGHTS (DEP_AIRPORT_ID, DEPARTURE_DATE, DEPARTURE_TIME, ARR_AIRPORT_ID, ARRIVAL_DATE, ARRIVAL_TIME, AIRCRAFT_ID)
VALUES ('AP1', '5-june-2024', '08:00:00', 'AP2', '6-june-2024', '11:00:00', 'AC1');

INSERT INTO FLIGHTS (DEP_AIRPORT_ID, DEPARTURE_DATE, DEPARTURE_TIME, ARR_AIRPORT_ID, ARRIVAL_DATE, ARRIVAL_TIME, AIRCRAFT_ID)
VALUES ('AP2', '15-AUG-2024', '12:30:00', 'AP3', '17-AUG-2024', '18:00:00', 'AC2');

INSERT INTO FLIGHTS (DEP_AIRPORT_ID, DEPARTURE_DATE, DEPARTURE_TIME, ARR_AIRPORT_ID, ARRIVAL_DATE, ARRIVAL_TIME, AIRCRAFT_ID)
VALUES ('AP3', '18-DEC-2024', '09:45:00', 'AP1', '19-DEC-2024', '17:30:00', 'AC3');

INSERT INTO FLIGHTS (DEP_AIRPORT_ID, DEPARTURE_DATE, DEPARTURE_TIME, ARR_AIRPORT_ID, ARRIVAL_DATE, ARRIVAL_TIME, AIRCRAFT_ID)
VALUES ('AP1', '17-AUG-2024', '10:00:00', 'AP3', '18-AUG-2024', '18:15:00', 'AC1');

INSERT INTO FLIGHTS (DEP_AIRPORT_ID, DEPARTURE_DATE, DEPARTURE_TIME, ARR_AIRPORT_ID, ARRIVAL_DATE, ARRIVAL_TIME, AIRCRAFT_ID)
VALUES ('AP2', '18-JAN-2024', '14:30:00', 'AP3', '20-JAN-2024', '22:45:00', 'AC2');
commit;
select * from flights;

commit;

--PASSENGERS
INSERT INTO PASSENGERS (PASSPORT_ID, FIRSTNAME, LASTNAME, EMAIL, CONTACT_NO, ADDRESS, GENDER, DATE_OF_BIRTH,login_id,login_pw)
VALUES (12345678, 'John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St, Cityville', 'M', TO_DATE('1990-01-15', 'YYYY-MM-DD'),'user1','pw1');

INSERT INTO PASSENGERS (PASSPORT_ID, FIRSTNAME, LASTNAME, EMAIL, CONTACT_NO, ADDRESS, GENDER, DATE_OF_BIRTH,login_id,login_pw)
VALUES (87654321, 'Jane', 'Smith', 'jane.smith@example.com', '098-765-4321', '456 Elm St, Townville', 'F', TO_DATE('1985-03-22', 'YYYY-MM-DD'),'user2','pw2');

INSERT INTO PASSENGERS (PASSPORT_ID, FIRSTNAME, LASTNAME, EMAIL, CONTACT_NO, ADDRESS, GENDER, DATE_OF_BIRTH,login_id,login_pw)
VALUES (11223344, 'Alex', 'Johnson', 'alex.johnson@example.com', '555-123-4567', '789 Maple Ave, Villagetown', 'F', TO_DATE('1995-08-30', 'YYYY-MM-DD'),'user3','pw3');
select * from passengers;

--CLASSES
INSERT INTO FLIGHT_CLASS (CLASS_DESCRIPTION, BAGGAGE_ALLOWED)
VALUES ('Economy', 23.00);

INSERT INTO FLIGHT_CLASS (CLASS_DESCRIPTION, BAGGAGE_ALLOWED)
VALUES ('Business', 32.00);

INSERT INTO FLIGHT_CLASS (CLASS_DESCRIPTION, BAGGAGE_ALLOWED)
VALUES ('First Class', 40.00);
select * from flight_class;

--BOOKINGS
INSERT INTO BOOKINGS (PASSENGER_ID, FLIGHT_ID, f_ClassID, BOOKING_DATE, SEAT_NO, TOTAL_PRICE)
VALUES ('PS2', 'F2', 'C1', TO_DATE('2024-11-15', 'YYYY-MM-DD'), 'A23', 500.00);

INSERT INTO BOOKINGS (PASSENGER_ID, FLIGHT_ID, f_ClassID, BOOKING_DATE, SEAT_NO, TOTAL_PRICE)
VALUES ('PS1', 'F3', 'C2', TO_DATE('2024-11-16', 'YYYY-MM-DD'), 'B12', 1200.00);

INSERT INTO BOOKINGS (PASSENGER_ID, FLIGHT_ID, f_ClassID, BOOKING_DATE, SEAT_NO, TOTAL_PRICE)
VALUES ('PS3', 'F4', 'C3', TO_DATE('2024-11-17', 'YYYY-MM-DD'), 'C10', 450.00);
SELECT * FROM BOOKINGS;

desc bookings;
desc flights;
commit;


--format for postman interaction
{
    "id": "F1",
    "dep_airport_id": "AP2",
    "dep_date": "15-aug-2024",
    "dep_time": "09:45:00",
    "arr_airport_id": "AP3",
    "arr_date": "17-aug-2024",
    "arr_time": "17:30:00",
    "aircraft_id": "AC1"
}

{
    "passportId": 123456789,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "contact": "9876543210",
    "address": "123 Elm Street, Springfield",
    "gender": "M",
    "dob": "1990-01-15",
    "loginid": "johndoe90",
    "loginpw": "securepassword123"
}

booking sample
{
    "PassengerID": "PS1",
    "FlightID": "F2",
    "ClassID": "C1",
    "BookingDate": "18-dec-2024",
    "SeatNo": "A34",
    "TotalPrice": 999
}

