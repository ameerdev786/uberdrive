import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useLocation } from "react-router-dom";
import car from "../asserts/ubercar.jpg";
import * as turf from "@turf/turf";

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
  }, [imgMap]);

  useEffect(() => {
    // if (map.current) return; // initialize map only once
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 3,
      // pitch: 40,
      // projection: "globe",
    });
    map.loadImage(imgMap ? imgMap : null, (error, image) => {
      map.addImage("ride", image);

      map.on("style.load", () => {
        map.setFog({ "horizon-blend": 0.05 }); // Enable stars with reduced atmosphere
      });
      if (pickupCoordinate && dropOffCoordinate && imgMap) {
        // A simple line from source to destination.
        const route = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [pickupCoordinate, dropOffCoordinate],
              },
            },
          ],
        };
        // A single point that animates along the route.
        // Coordinates are initially set to origin.
        const point = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: pickupCoordinate,
              },
            },
          ],
        };
        // Calculate the distance in kilometers between route start/end point.
        const lineDistance = turf.length(route.features[0]);

        const arc = [];

        // Number of steps to use in the arc and animation, more steps means
        // a smoother arc and animation, but too many steps will result in a
        // low frame rate
        const steps = 380;

        // Draw an arc between the `origin` & `destination` of the two points
        for (let i = 0; i < lineDistance; i += lineDistance / steps) {
          const segment = turf.along(route.features[0], i);
          arc.push(segment.geometry.coordinates);
        }

        // Update the route with calculated arc coordinates
        route.features[0].geometry.coordinates = arc;

        // Used to increment the value of the point measurement against the route.
        let counter = 0;

        map.on("load", () => {
          // Add a source and layer displaying a point which will be animated in a circle.
          map.addSource("route", {
            type: "geojson",
            data: route,
          });

          map.addSource("point", {
            type: "geojson",
            data: point,
          });

          map.addLayer({
            id: "route",
            source: "route",
            type: "line",
            paint: {
              "line-width": 2,
              "line-color": "#007cbf",
            },
          });

          map.addLayer({
            id: "point",
            source: "point",
            type: "symbol",
            layout: {
              // This icon is a part of the Mapbox Streets style.
              // To view all images available in a Mapbox style, open
              // the style in Mapbox Studio and click the "Images" tab.
              // To add a new image to the style at runtime see
              // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
              "icon-image": "ride",
              "icon-size": 0.1,
              "icon-rotate": ["get", "bearing"],
              "icon-rotation-alignment": "map",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
              "icon-rotate": 1,
            },
          });

          function animate() {
            const start =
              route.features[0].geometry.coordinates[
                counter >= steps ? counter - 1 : counter
              ];
            const end =
              route.features[0].geometry.coordinates[
                counter >= steps ? counter : counter + 1
              ];
            if (!start || !end) return;

            // Update point geometry to a new position based on counter denoting
            // the index to access the arc
            point.features[0].geometry.coordinates =
              route.features[0].geometry.coordinates[counter];

            // Calculate the bearing to ensure the icon is rotated to match the route arc
            // The bearing is calculated between the current point and the next point, except
            // at the end of the arc, which uses the previous point and the current point
            point.features[0].properties.bearing = turf.bearing(
              turf.point(start),
              turf.point(end)
            );

            // Update the source with this new data
            map.getSource("point").setData(point);

            // Request the next frame of animation as long as the end has not been reached
            if (counter < steps) {
              requestAnimationFrame(animate);
            }

            counter = counter + 1;
          }

          // Start the animation
          animate(counter);
        });
      }
    });
  }, [pickupCoordinate, dropOffCoordinate]);

  return (
    <div className="container2">
      <div className="guide">
        <h1>
          Your Way from <span>{pickup}</span> to <span>{dropOff}</span>
        </h1>
      </div>
      <div className="map" ref={mapContainer}></div>
    </div>
  );
}

export default Map;
