import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Map from "./Map";

function FindRideForm({ imgMap }) {
  const [isOpen, setIsOpen] = useState(true);
  const [img, setimg] = useState();
  const [value, setInputVal] = useState({ pickup: "", dropOff: "" });
  let query = useQuery();
  const navigate = useNavigate();

  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  useEffect(() => {
    console.log(value, "value");
  }, [value]);
  useEffect(() => {
    setimg(query.get("imgMap"));
  }, [img]);

  return (
    <>
      <div className="sidebarcon">
        <div className={` ${isOpen ? "sideform" : "slideremove"}`}>
          {/* <button
            className="close"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            X
          </button> */}
          <div className="searchform">
            <div className="mainform">
              <h1>Find your comfort here!</h1>
              <input
                type="text"
                placeholder="Enter pickup location"
                name="pickup"
                onChange={(e) => {
                  setInputVal({ ...value, [e.target.name]: e.target.value });
                }}
              />
              <input
                type="text"
                name="dropOff"
                placeholder="Where to?"
                onChange={(e) => {
                  setInputVal({ ...value, [e.target.name]: e.target.value });
                }}
              />
              {img ? (
                <button
                  onClick={() => {
                    navigate("/map", {
                      state: {
                        pickup: value.pickup,
                        dropOff: value.dropOff,
                        imgMap: img,
                      },
                    });
                  }}
                >
                  Confirm Locations
                </button>
              ) : (
                "wait.."
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FindRideForm;
