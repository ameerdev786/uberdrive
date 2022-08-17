import React, { useEffect, useState, useRef, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import car from "../asserts/ubercar.jpg";
import Rides from "./Rides";
import FindRideForm from "./FindRideForm";
import { useNavigate, Link, useLocation } from "react-router-dom";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1lZXJzb2Z0ZGV2IiwiYSI6ImNsNDB5a3A0bjBiYnMzbG52NDVrZngxdmwifQ.CSFN5IyjbbXEPdKtp2stUA";
function MainMap() {
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(73.135);
  const [lat, setLat] = useState(31.4504);
  let [zoom, setZoom] = useState(9);
  const [imgMap, setImgMap] = useState(null);

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
      map.loadImage(imgMap ? imgMap : null, (error, image) => {
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
  }, [imgMap, zoom]);
  useEffect(() => {
    console.log(zoom, "seee");
  }, [zoom]);

  return (
    <>
      <div className="container">
        <div className="zoomDiv">
          <button
            onClick={() => {
              setZoom(zoom + 1);
            }}
            className="zoomin"
          >
            Zoom+
          </button>
          <button
            onClick={() => {
              setZoom(zoom - 1);
            }}
            className="zoomout"
          >
            Zoom-
          </button>
          <input
            type={"range"}
            min="1"
            max="7"
            onChange={(e) => {
              setZoom(Number(e.target.value));
            }}
          />
        </div>
        <div className="map" ref={mapContainer}></div>
        <Rides setImgMap={setImgMap} setLat={setLat} setLng={setLng} />
        {/* <FindRideForm isOpen={isOpen} setIsOpen={setIsOpen} imgMap={imgMap} /> */}
        {imgMap ? (
          <Link className="mainLink" to={`/sidenav?imgMap=${imgMap}`}>
            Choose Locations
          </Link>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default MainMap;
