import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useLocation } from "react-router-dom";
mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1lZXJzb2Z0ZGV2IiwiYSI6ImNsNDB5a3A0bjBiYnMzbG52NDVrZngxdmwifQ.CSFN5IyjbbXEPdKtp2stUA";
function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(73.135);
  const [lat, setLat] = useState(31.4504);
  let [zoom, setZoom] = useState(9);
  const location = useLocation();
  const { pickup, dropOff } = location.state;
  const [pickupCoordinate, setPickupCoordinate] = useState();
  const [dropOffCoordinate, setDroopOffCoordinate] = useState();
  const [imgMap, setImgMap] = useState(null);
  //   const pickup = "Faisalabad";
  //   const takeOff = "Pune";
  useEffect(() => {
    console.log(pickup);
    console.log(dropOff);

    if (dropOffCoordinate && pickupCoordinate) {
      console.log(pickupCoordinate, dropOffCoordinate, "look");
    }
  }, [pickupCoordinate, dropOffCoordinate]);
  const token =
    "pk.eyJ1IjoiYW1lZXJzb2Z0ZGV2IiwiYSI6ImNsNDB5a3A0bjBiYnMzbG52NDVrZngxdmwifQ.CSFN5IyjbbXEPdKtp2stUA";
  const [pickupUrl] = useState(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${
      pickup ? pickup : ""
    }.json?` +
      new URLSearchParams({
        access_token: token,
        limit: 1,
      })
  );
  const [takeOffUrl] = useState(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${
      dropOff ? dropOff : ""
    }.json?` +
      new URLSearchParams({
        access_token: token,
        limit: 1,
      })
  );
  function getPickupLatlng() {
    fetch(pickupUrl)
      .then((res) => res.json())
      .then((data) => {
        setPickupCoordinate(data.features[0].center);
      });
  }
  function gettakeOffLatlng() {
    fetch(takeOffUrl)
      .then((res) => res.json())
      .then((data) => setDroopOffCoordinate(data.features[0].center));
  }
  useEffect(() => {
    getPickupLatlng();
    gettakeOffLatlng();
  }, [pickup, dropOff]);
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
    if (pickupCoordinate) {
      AddmarkerToMap(map, pickupCoordinate);
    }
    if (dropOffCoordinate) {
      AddmarkerToMap(map, dropOffCoordinate);
    }
    if (dropOffCoordinate && pickupCoordinate) {
      map.fitBounds([pickupCoordinate, dropOffCoordinate]);
    }
  }, [pickupCoordinate, dropOffCoordinate]);

  function AddmarkerToMap(map, coordinates) {
    if (coordinates) {
      const marker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
    }
  }
  return (
    <div className="container2">
      <div className="map" ref={mapContainer}></div>
    </div>
  );
}

export default Map;
