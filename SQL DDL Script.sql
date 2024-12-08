BEGIN
   FOR t IN (SELECT table_name FROM user_tables) LOOP
      EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS';
   END LOOP;
END;

BEGIN
   FOR s IN (SELECT sequence_name FROM user_sequences) LOOP
      EXECUTE IMMEDIATE 'DROP SEQUENCE ' || s.sequence_name;
   END LOOP;
END;

CREATE TABLE AIRPORTS (
    AIRPORT_ID VARCHAR(10) PRIMARY KEY,
    AIRPORT_NAME VARCHAR(255) NOT NULL,
    CITY VARCHAR(255) NOT NULL,
    LATITUDE DECIMAL(6, 4) NOT NULL,
    LONGITUDE DECIMAL(6, 4) NOT NULL
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



CREATE TABLE PASSENGERS(
    PASSENGER_ID VARCHAR(10) PRIMARY KEY,
    FIRSTNAME VARCHAR(255) NOT NULL,
    LASTNAME VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255),
    CONTACT_NO VARCHAR(255),
    ADDRESS VARCHAR(255),
    GENDER VARCHAR(1) CHECK (GENDER='M' OR GENDER='F'),
    DATE_OF_BIRTH DATE,
    LOGIN_PW varchar2(255)
);

CREATE TABLE FLIGHT_CLASS (
    CLASS_ID VARCHAR(10) PRIMARY KEY,
    CLASS_DESCRIPTION VARCHAR(255) NOT NULL,
    BAGGAGE_ALLOWED DECIMAL(10,2) NOT NULL,
    PRICE_MULTIPLIER DECIMAL(10, 2) NOT NULL
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


--CREATING TRIGGERS 

-- TRIGGER FOR AIRPORTS

CREATE OR REPLACE TRIGGER AIRPORT_BEFORE_INSERT
BEFORE INSERT ON AIRPORTS
FOR EACH ROW
BEGIN
    :NEW.AIRPORT_ID := 'AP' || AIRPORT_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE AIRLINE_ID WITH PREFIX 'A'
END;
/
-- TRIGGER FOR AIRLINE
CREATE OR REPLACE TRIGGER AIRLINE_BEFORE_INSERT
BEFORE INSERT ON AIRLINES
FOR EACH ROW
BEGIN
    :NEW.AIRLINE_ID := 'AL' || AIRLINE_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE AIRLINE_ID WITH PREFIX 'A'
END;
/
-- TRIGGER FOR AIRCRAFT
CREATE OR REPLACE TRIGGER AIRCRAFT_BEFORE_INSERT
BEFORE INSERT ON AIRCRAFTS
FOR EACH ROW
BEGIN
    :NEW.AIRCRAFT_ID := 'AC' || AIRCRAFT_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE AIRCRAFT_ID WITH PREFIX 'AC'
END;
/
-- TRIGGER FOR FLIGHT
CREATE OR REPLACE TRIGGER FLIGHT_BEFORE_INSERT
BEFORE INSERT ON FLIGHTS
FOR EACH ROW
BEGIN
    :NEW.FLIGHT_ID := 'F' || FLIGHT_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE FLIGHT_ID WITH PREFIX 'F'
END;
/
-- TRIGGER FOR PASSENGER
CREATE OR REPLACE TRIGGER PASSENGER_BEFORE_INSERT
BEFORE INSERT ON PASSENGERS
FOR EACH ROW
BEGIN
    :NEW.PASSENGER_ID := 'PS' || PASSENGER_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE PASSENGER_ID WITH PREFIX 'P'
END;
/
-- TRIGGER FOR FLIGHT_CLASS
CREATE OR REPLACE TRIGGER FLIGHT_CLASS_BEFORE_INSERT
BEFORE INSERT ON FLIGHT_CLASS
FOR EACH ROW
BEGIN
    :NEW.CLASS_ID := 'C' || FLIGHT_CLASS_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE CLASS_ID WITH PREFIX 'C'
END;
/
-- TRIGGER FOR BOOKINGS

CREATE OR REPLACE TRIGGER BOOKING_BEFORE_INSERT
BEFORE INSERT ON BOOKINGS
FOR EACH ROW
BEGIN
    :NEW.BOOKING_ID := 'B' || BOOKING_SEQ.NEXTVAL; -- USE SEQUENCE TO GENERATE THE BOOKING_ID WITH PREFIX 'B'
END;
/


CREATE OR REPLACE FUNCTION RADIANS(DEGREES IN NUMBER)
RETURN NUMBER
IS
BEGIN
    -- Convert degrees to radians using the formula radians = degrees * (? / 180)
    RETURN DEGREES * (ACOS(-1) / 180);
END;
/

CREATE OR REPLACE FUNCTION CALCULATE_PRICE(P_FLIGHT_ID IN VARCHAR2, P_CLASS_ID IN VARCHAR2) 
RETURN NUMBER
IS
    V_DEP_LAT AIRPORTS.LATITUDE%TYPE;
    V_DEP_LONG AIRPORTS.LONGITUDE%TYPE;
    V_ARR_LAT AIRPORTS.LATITUDE%TYPE;
    V_ARR_LONG AIRPORTS.LONGITUDE%TYPE;
    V_DISTANCE DECIMAL(10, 2);
    V_PRICE_MULTIPLIER FLIGHT_CLASS.PRICE_MULTIPLIER%TYPE;
    V_PRICE BOOKINGS.TOTAL_PRICE%TYPE;
BEGIN
    -- Get departure airport coordinates
    SELECT LATITUDE, LONGITUDE 
    INTO V_DEP_LAT, V_DEP_LONG
    FROM AIRPORTS 
    WHERE AIRPORT_ID = (SELECT DEP_AIRPORT_ID FROM FLIGHTS WHERE FLIGHT_ID=P_FLIGHT_ID);
    
    -- Get arrival airport coordinates
    SELECT LATITUDE, LONGITUDE 
    INTO V_ARR_LAT, V_ARR_LONG
    FROM AIRPORTS 
    WHERE AIRPORT_ID = (SELECT ARR_AIRPORT_ID FROM FLIGHTS WHERE FLIGHT_ID=P_FLIGHT_ID);
    
    V_DISTANCE := 6371*2*ASIN(SQRT(POWER(SIN((RADIANS(V_ARR_LAT) - RADIANS(V_DEP_LAT)) / 2), 2) + 
                            COS(RADIANS(V_DEP_LAT)) * COS(RADIANS(V_ARR_LAT)) *
                            POWER(SIN((RADIANS(V_ARR_LONG) - RADIANS(V_DEP_LONG)) / 2), 2)
                            ));
    
    SELECT PRICE_MULTIPLIER 
    INTO V_PRICE_MULTIPLIER
    FROM FLIGHT_CLASS
    WHERE CLASS_ID = P_CLASS_ID;
    
    V_PRICE := V_PRICE_MULTIPLIER*V_DISTANCE;   

    RETURN V_PRICE;
END;

select CALCULATE_PRICE('F3', 'C3') from dual;



CREATE OR REPLACE TRIGGER BOOKING_BEFORE_INSERT
BEFORE INSERT ON BOOKINGS
FOR EACH ROW
DECLARE 
    V_BOOKING_ID BOOKINGS.BOOKING_ID%TYPE;
BEGIN

    V_BOOKING_ID := 'B' || BOOKING_SEQ.NEXTVAL;
    :NEW.BOOKING_ID := V_BOOKING_ID;
    
    :NEW.TOTAL_PRICE := CALCULATE_PRICE(:NEW.FLIGHT_ID, :NEW.f_ClassID);
                               
END;
/

--AIRPORTS
TRUNCATE TABLE AIRPORTS;
INSERT INTO AIRPORTS (AIRPORT_NAME, CITY, LATITUDE, LONGITUDE)
VALUES ('JINNAH INTERNATIONAL AIRPORT', 'KARACHI', 24.9008, 67.1681);


INSERT INTO AIRPORTS (AIRPORT_NAME, CITY, LATITUDE, LONGITUDE)
VALUES ('IQBAL INTERNATIONAL AIRPORT', 'LAHORE', 31.5203, 74.4104);

INSERT INTO AIRPORTS (AIRPORT_NAME, CITY, LATITUDE, LONGITUDE)
VALUES ('HEATHROW AIRPORT', 'LONDON', 51.4680, 0.4551);
SELECT * FROM AIRPORTS;

--AIRLINES
INSERT INTO AIRLINES (AIRLINE_NAME, FOUNDING_DATE, A_SCOPE)
VALUES ('QATAR', TO_DATE('05-JUNE-2005', 'DD-MON-YYYY'), 'INT');

INSERT INTO AIRLINES (AIRLINE_NAME, FOUNDING_DATE, A_SCOPE)
VALUES ('PIA', TO_DATE('05-DEC-1998', 'DD-MON-YYYY'), 'DOM');

INSERT INTO AIRLINES (AIRLINE_NAME, FOUNDING_DATE, A_SCOPE)
VALUES ('EMIRATES', TO_DATE('05-JUNE-1995', 'DD-MON-YYYY'), 'INT');


--AIRCRAFTS
INSERT INTO AIRCRAFTS (MODELNO, A_CAPACITY, AIRLINE_ID)
VALUES (20, 500, 'AL1');

INSERT INTO AIRCRAFTS (MODELNO, A_CAPACITY, AIRLINE_ID)
VALUES (15, 400, 'AL2');

INSERT INTO AIRCRAFTS (MODELNO, A_CAPACITY, AIRLINE_ID)
VALUES (12, 900, 'AL3');

--FLIGHTS
INSERT INTO FLIGHTS (DEP_AIRPORT_ID, DEPARTURE_DATE, DEPARTURE_TIME, ARR_AIRPORT_ID, ARRIVAL_DATE, ARRIVAL_TIME, AIRCRAFT_ID)
VALUES ('AP1', TO_DATE('05-JUNE-2024', 'DD-MON-YYYY'), '08:00:00', 'AP2', TO_DATE('06-JUNE-2024', 'DD-MON-YYYY'), '11:00:00', 'AC1');

INSERT INTO FLIGHTS (DEP_AIRPORT_ID, DEPARTURE_DATE, DEPARTURE_TIME, ARR_AIRPORT_ID, ARRIVAL_DATE, ARRIVAL_TIME, AIRCRAFT_ID)
VALUES ('AP2', TO_DATE('15-AUG-2024', 'DD-MON-YYYY'), '12:30:00', 'AP3', TO_DATE('17-AUG-2024', 'DD-MON-YYYY'), '18:00:00', 'AC2');

INSERT INTO FLIGHTS (DEP_AIRPORT_ID, DEPARTURE_DATE, DEPARTURE_TIME, ARR_AIRPORT_ID, ARRIVAL_DATE, ARRIVAL_TIME, AIRCRAFT_ID)
VALUES ('AP3', TO_DATE('18-DEC-2024', 'DD-MON-YYYY'), '09:45:00', 'AP1', TO_DATE('19-DEC-2024', 'DD-MON-YYYY'), '17:30:00', 'AC3');

INSERT INTO FLIGHTS (DEP_AIRPORT_ID, DEPARTURE_DATE, DEPARTURE_TIME, ARR_AIRPORT_ID, ARRIVAL_DATE, ARRIVAL_TIME, AIRCRAFT_ID)
VALUES ('AP1', TO_DATE('17-AUG-2024', 'DD-MON-YYYY'), '10:00:00', 'AP3', TO_DATE('18-AUG-2024', 'DD-MON-YYYY'), '18:15:00', 'AC1');

INSERT INTO FLIGHTS (DEP_AIRPORT_ID, DEPARTURE_DATE, DEPARTURE_TIME, ARR_AIRPORT_ID, ARRIVAL_DATE, ARRIVAL_TIME, AIRCRAFT_ID)
VALUES ('AP2', TO_DATE('18-JAN-2024', 'DD-MON-YYYY'), '14:30:00', 'AP3', TO_DATE('20-JAN-2024', 'DD-MON-YYYY'), '22:45:00', 'AC2');

--PASSENGERS
INSERT INTO PASSENGERS (PASSPORT_ID, FIRSTNAME, LASTNAME, EMAIL, CONTACT_NO, ADDRESS, GENDER, DATE_OF_BIRTH,login_pw)
VALUES (12345678, 'John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St, Cityville', 'M', TO_DATE('1990-01-15', 'YYYY-MM-DD'),'pw1');

INSERT INTO PASSENGERS (PASSPORT_ID, FIRSTNAME, LASTNAME, EMAIL, CONTACT_NO, ADDRESS, GENDER, DATE_OF_BIRTH,login_pw)
VALUES (87654321, 'Jane', 'Smith', 'jane.smith@example.com', '098-765-4321', '456 Elm St, Townville', 'F', TO_DATE('1985-03-22', 'YYYY-MM-DD'),'pw2');

INSERT INTO PASSENGERS (PASSPORT_ID, FIRSTNAME, LASTNAME, EMAIL, CONTACT_NO, ADDRESS, GENDER, DATE_OF_BIRTH,login_pw)
VALUES (11223344, 'Alex', 'Johnson', 'alex.johnson@example.com', '555-123-4567', '789 Maple Ave, Villagetown', 'F', TO_DATE('1995-08-30', 'YYYY-MM-DD'),'pw3');
select * from passengers;

--CLASSES
INSERT INTO FLIGHT_CLASS (CLASS_DESCRIPTION, BAGGAGE_ALLOWED, PRICE_MULTIPLIER)
VALUES ('Economy', 23.00, 100);

INSERT INTO FLIGHT_CLASS (CLASS_DESCRIPTION, BAGGAGE_ALLOWED, PRICE_MULTIPLIER)
VALUES ('Business', 32.00, 300);

INSERT INTO FLIGHT_CLASS (CLASS_DESCRIPTION, BAGGAGE_ALLOWED, PRICE_MULTIPLIER)
VALUES ('First Class', 40.00, 500);

--BOOKINGS
INSERT INTO BOOKINGS (PASSENGER_ID, FLIGHT_ID, f_ClassID, BOOKING_DATE, SEAT_NO)
VALUES ('PS2', 'F5', 'C1', TO_DATE('2024-11-15', 'YYYY-MM-DD'), 'A23');

INSERT INTO BOOKINGS (PASSENGER_ID, FLIGHT_ID, f_ClassID, BOOKING_DATE, SEAT_NO)
VALUES ('PS1', 'F3', 'C2', TO_DATE('2024-11-16', 'YYYY-MM-DD'), 'B12');

INSERT INTO BOOKINGS (PASSENGER_ID, FLIGHT_ID, f_ClassID, BOOKING_DATE, SEAT_NO)
VALUES ('PS3', 'F4', 'C3', TO_DATE('2024-11-17', 'YYYY-MM-DD'), 'C10');

--SOME TESTINGS

select CALCULATE_PRICE('F3', 'C3') from dual;


select CALCULATE_PRICE('F3', 'C3') from dual;

commit;


--FOR STATS IN ADMIN TESTINGS
--MOST POPULAR FLIGHT/MOST BOOKED flight currently
select flight_id,count(*) from bookings group by flight_id order by 2 desc fetch first row only;
--yaha se jo flight id ayegi uski details show kara dena in a row

--avg price of all bookings
select round(avg(total_price),2) from bookings group by ;

select flight_id,max(total_price) from bookings group by flight_id order by 2 desc fetch first row only;
select max(total_price) from bookings;


select flight_id,min(total_price) from bookings group by flight_id order by 2 asc fetch first row only;
select round(avg(total_price),2) from bookings;



--count of each flight classes booked
select  fc.class_description,count(f_classid) 
from bookings b
inner join flight_class fc on b.f_classid=fc.class_id
group by fc.class_description;


--most profitable airline
select al.airline_name,sum(b.total_price) 
from bookings b 
inner join flights f on f.flight_id=b.flight_id
inner join aircrafts ar on f.aircraft_id=ar.aircraft_id
inner join airlines al on ar.airline_id=al.airline_id
group by al.airline_name order by 2 desc fetch first row only;







