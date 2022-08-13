import React from "react";

function FindRideForm({ isOpen, setIsOpen }) {
  return (
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
          <button>Search your ride</button>
        </div>
      </div>
    </div>
  );
}

export default FindRideForm;
