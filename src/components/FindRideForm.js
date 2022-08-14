import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "./Map";

function FindRideForm({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  return (
    <>
      <div className={` ${isOpen ? "sideform" : "slideremove"}`}>
        <button
          className="close"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          X
        </button>
        <div className="searchform">
          <div className="mainform">
            <h1>Find your comfort here!</h1>
            <input type="text" placeholder="Enter pickup location" />
            <input type="text" placeholder="Where to?" />
            <button
              onClick={() => {
                navigate("/map", {
                  state: { pickup: "Faisalabad", dropOff: "Sahiwal" },
                });
              }}
            >
              Confirm Locations
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FindRideForm;
