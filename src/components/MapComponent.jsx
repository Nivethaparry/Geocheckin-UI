import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "ol/ol.css";
import { Map, View, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import travelIcon from "../assets/travel.png";
import locationIcon from "../assets/location.png";

const MapComponent = () => {
  const mapRef = useRef();
  const popupRef = useRef();
  const { userId , date } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !date) return;

    const container = popupRef.current;
    let map;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://localhost:7252/api/Attendances/GetDateAttendanceHistory?userId=${userId}&date=${date}`);

        const records = res.data || [];

        const markers = [];

        records.forEach((record) => {
          (record.details || []).forEach((detail) => {
            if (detail.latitude !== 0 && detail.longitude !== 0) {
              console.log("Creating marker at:", detail.latitude, detail.longitude)
              if (detail.checkIn) {
                console.log("Raw CheckIn Time:", detail.checkIn);
                const formattedCheckIn = new Date(detail.checkIn).toLocaleString("en-GB", {
                  timeZone: "Asia/Kolkata",
                  weekday: "long",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true
                });
                markers.push({
                  type: "checkin",
                  coords: [detail.longitude, detail.latitude],
                  time: formattedCheckIn,
                });
              }
              if (detail.checkOut) {
                console.log("Raw CheckOut Time:", detail.checkOut);
                const formattedCheckOut = new Date(detail.checkOut).toLocaleString("en-GB", {
                  timeZone: "Asia/Kolkata",
                  weekday: "long",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true
                });
                markers.push({
                  type: "checkout",
                  coords: [detail.longitude, detail.latitude],
                  time: formattedCheckOut,
                });
              }
            }
          });
        });
       

        const features = markers.map((marker) => {
          const coords = fromLonLat(marker.coords);
          const feature = new Feature({
            geometry: new Point(coords),
            name: marker.time,
            type: marker.type,
          });
          feature.setStyle(
            new Style({
              image: new Icon({
                anchor: [0.5, 1],
                anchorXUnits: "fraction",
                anchorYUnits: "fraction",
                src: marker.type === "checkin" ? travelIcon : locationIcon,
                scale: marker.type === "checkin" ? 0.1 : 0.08,
              }),
            })
          );
          return feature;
        });
        console.log("Number of markers:", markers.length);
        console.log("Feature coordinates:", features.map(f => f.getGeometry().getCoordinates()));

        const vectorLayer = new VectorLayer({
          source: new VectorSource({ features }),
        });

        const overlay = new Overlay({
          element: container,
          autoPan: { animation: { duration: 250 } },
        });

        map = new Map({
          target: mapRef.current,
          layers: [
            new TileLayer({ source: new OSM() }),
            vectorLayer,
          ],
          view: new View({
            center:
              features.length > 0
                ? features[0].getGeometry().getCoordinates()
                : fromLonLat([79.80796, 11.92544]),
            zoom: 15,
          }),
          overlays: [overlay],
        });

        map.on("singleclick", function (evt) {
          const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
          if (feature) {
            const coordinates = feature.getGeometry().getCoordinates();
            overlay.setPosition(coordinates);

            container.querySelector("#popup-title").textContent =
              feature.get("type") === "checkin"
                ? "Check-In Details"
                : "Check-Out Details";
            container.querySelector("#popup-content").textContent = feature.get("name");
            container.style.display = "flex";
          } else {
            container.style.display = "none";
          }
        });

        const closeButton = container.querySelector("#popup-close");
        closeButton.addEventListener("click", () => {
          container.style.display = "none";
        });

      } catch (error) {
        console.error("Map data fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

 return () => {
  if (map) {
    map.getOverlays().clear();
    map.getLayers().clear();
    map.setTarget(null);
    map = null;

    if (container) {
      container.style.display = "none"; 
    }
  }
};

  }, [userId, date]);

  return (
    <>
      <div ref={mapRef} style={{ width: "100%", height: "500px" }} />
      <div
        ref={popupRef}
        style={{
          position: "absolute",
          transform: "translate(-50%, -100%)",
          pointerEvents: "auto",
          display: "none",
          zIndex: 1000,
        }} >
        <div className="card border-dark" style={{ width: "17rem" }}>
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <span id="popup-title">Info</span>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              id="popup-close"
            ></button>
          </div>
          <div className="card-body">
            <p className="card-text" id="popup-content"></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapComponent;

