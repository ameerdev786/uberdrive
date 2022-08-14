import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Map from "./Map";

function FindRideForm({ isOpen, setIsOpen, imgMap }) {
  // const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    console.log(isOpen, "isOpen");
  }, [imgMap, isOpen]);

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
            {/* <button
              onClick={() => {
                navigate("/map", {
                  state: {
                    pickup: "Faisalabad",
                    dropOff: "Jaranwala",
                    imgMap: imgMap,
                  },
                });
              }}
            >
              Confirm Locations
            </button> */}
            <Link to="/map?name=Faisalabad">go to map page you know</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default FindRideForm;
