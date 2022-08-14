import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useLocation } from "react-router-dom";
import car from "../asserts/ubercar.jpg";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1lZXJzb2Z0ZGV2IiwiYSI6ImNsNDB5a3A0bjBiYnMzbG52NDVrZngxdmwifQ.CSFN5IyjbbXEPdKtp2stUA";
function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(73.135);
  const [lat, setLat] = useState(31.4504);
  let [zoom, setZoom] = useState(3);
  const location = useLocation();
  const { pickup, dropOff, imgMap } = location.state;
  const [pickupCoordinate, setPickupCoordinate] = useState();
  const [dropOffCoordinate, setDroopOffCoordinate] = useState();
  // const [imgMap, setImgMap] = useState(null);
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
  // fetch coordinated ln lat of searched spaces
  useEffect(() => {
    getPickupLatlng();
    gettakeOffLatlng();
  }, [pickup, dropOff]);
  useEffect(() => {
    if (imgMap) {
      console.log(imgMap, "imgMap");
    }
  }, []);

  useEffect(() => {
    // if (map.current) return; // initialize map only once
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 3,
    });
    AddMarkerImgLine(map);

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
      new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
    }
  }
  //Add line between two points and customs images on map you know
  function AddMarkerImgLine(map) {
    map.on("load", () => {
      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [pickupCoordinate, dropOffCoordinate],
            },
          },
        },
      });
      const geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              message: "Foo",
              iconSize: [40, 40],
            },
            geometry: {
              type: "Point",
              coordinates: pickupCoordinate,
            },
          },
          {
            type: "Feature",
            properties: {
              message: "Bar",
              iconSize: [40, 40],
            },
            geometry: {
              type: "Point",
              coordinates: dropOffCoordinate,
            },
          },
        ],
      };

      for (const marker of geojson.features) {
        // Create a DOM element for each marker.
        const el = document.createElement("div");
        const width = marker.properties.iconSize[0];
        const height = marker.properties.iconSize[1];
        el.className = "marker";
        el.style.backgroundImage = `url('${imgMap}')`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = "100%";

        el.addEventListener("click", () => {
          window.alert(marker.properties.message);
        });

        // Add markers to the map.
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .addTo(map);
      }
    });
  }
  return (
    <div className="container2">
      <div className="map" ref={mapContainer}></div>
    </div>
  );
}

export default Map;
