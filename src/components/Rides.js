import React, { useState } from "react";
import cycle from "../asserts/cycle.jpg";
import car from "../asserts/ubercar.jpg";
import calendar from "../asserts/calendar.jpg";
import car2 from "../asserts/car2.jpg";
import bugati from "../asserts/bugati.jpg";
import FindRideForm from "./FindRideForm";
import { Link } from "react-router-dom";

function Rides({ setImgMap, setLat, setLng }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <h1 className="heading">Find your Ride</h1>
      <div className="rides">
        <div
          onClick={() => {
            setIsOpen(true);
            setImgMap(car);
            setLng(73.8567);
            setLat(18.5204);
          }}
        >
          <img src={car} />
          <p>Car</p>
        </div>
        <div
          className=""
          onClick={() => {
            setIsOpen(true);
            setImgMap(cycle);
            setLng(74.3587);
            setLat(31.5204);
          }}
        >
          <img src={cycle} />
          <p>wheels</p>
        </div>
        <div
          onClick={() => {
            setIsOpen(!isOpen);
            setIsOpen(true);
            setImgMap(bugati);
            setLng(74.3587);
            setLat(31.5204);
          }}
        >
          <img src={bugati} />
          <p>Luxury</p>
        </div>
        <div
          onClick={() => {
            setIsOpen(true);
            setImgMap(car2);
            setLng(74.3587);
            setLat(31.5204);
          }}
        >
          <img src={car2} />
          <p>Taxi</p>
        </div>
      </div>
    </>
  );
}

export default Rides;
