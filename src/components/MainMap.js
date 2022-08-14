import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import car from "../asserts/ubercar.jpg";
import Rides from "./Rides";
import FindRideForm from "./FindRideForm";
import { useNavigate } from "react-router-dom";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1lZXJzb2Z0ZGV2IiwiYSI6ImNsNDB5a3A0bjBiYnMzbG52NDVrZngxdmwifQ.CSFN5IyjbbXEPdKtp2stUA";
function MainMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(73.135);
  const [lat, setLat] = useState(31.4504);
  let [zoom, setZoom] = useState(9);
  const [isOpen, setIsOpen] = useState(false);
  const [imgMap, setImgMap] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // if (map.current) return; // initialize map only once
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/drakosi/ckvcwq3rwdw4314o3i2ho8tph",
      center: [lng, lat],
      zoom: zoom,
    });

    map.on("load", () => {
      // Load an image from an external URL.
      map.loadImage(imgMap, (error, image) => {
        if (error) throw error;
        // Add the image to the map style.
        map.addImage("ride", image);
        // Add a data source containing one point feature.
        map.addSource("point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [lng, lat],
                },
              },
            ],
          },
        });

        // Add a layer to use the image to represent the data.
        map.addLayer({
          id: "points",
          type: "symbol",
          source: "point", // reference the data source
          layout: {
            "icon-image": "ride", // reference the image
            "icon-size": 0.2,
            "icon-rotate": 1,
          },
        });
      });
    });
  }, []);
  useEffect(() => {
    console.log(zoom, "seee");
  }, [zoom]);

  return (
    <>
      <div className="container">
        <div className="map" ref={mapContainer}></div>
        <Rides setImgMap={setImgMap} setLat={setLat} setLng={setLng} />
        <button
          onClick={() =>
            navigate("/map", {
              state: {
                imgMap: imgMap,
                pickup: "Faisalabad",
                dropOff: "Germany",
              },
            })
          }
        >
          Go to Specific Location
        </button>
        <FindRideForm isOpen={isOpen} setIsOpen={setIsOpen} imgMap={imgMap} />
      </div>
    </>
  );
}

export default MainMap;
