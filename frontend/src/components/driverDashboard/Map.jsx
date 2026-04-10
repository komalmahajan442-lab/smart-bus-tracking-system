import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useContext, useEffect, useState } from "react";
import { socket } from "../Context.jsx/socket";
import { DriverContext } from "../Context.jsx/DriverContext";
import { getDistance } from "geolib";

function Recenter({ location }) {

  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.flyTo([location.lat, location.lng], 17);
    }
  }, [location]);

  return null;
}

function Map() {

  const { dashboard,currentStopIndex,setCurrentStopIndex } = useContext(DriverContext);

  const [location, setLocation] = useState(null);
 

  const busId = dashboard?.driver?.assignedbus?._id;

  const stops =
    dashboard?.driver?.assignedbus?.route?.stops || [];

  const routeCoordinates = stops.map(stop => {
    const [lng, lat] = stop.location.coordinates;
    return [lat, lng];
  });

  // 🚍 DRIVER GPS
  useEffect(() => {

    if (!busId) return;

    socket.emit("joinBus", busId);

    const watchId = navigator.geolocation.watchPosition(

      (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation({ lat, lng });

        socket.emit("sendLocation", { busId, lat, lng });
console.log("send location",lat,lng)
      },

      (err) => console.log(err),

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }

    );

    return () => navigator.geolocation.clearWatch(watchId);

  }, [busId]);

  // 📍 NEXT STOP DETECTION
  useEffect(() => {

    if (!location || stops.length === 0) return;

    stops.forEach((stop, i) => {

      const [lng, lat] = stop.location.coordinates;

      const distance = getDistance(
        { latitude: location.lat, longitude: location.lng },
        { latitude: lat, longitude: lng }
      );

      if (distance < 100) {
        setCurrentStopIndex(i + 1);
      }

    });

  }, [location, stops]);

  const nextStop = stops[currentStopIndex];

  let distance = null;

  if (location && nextStop) {

    const [lng, lat] = nextStop.location.coordinates;

    distance =
      getDistance(
        { latitude: location.lat, longitude: location.lng },
        { latitude: lat, longitude: lng }
      ) / 1000;

  }

  return (

    <div>

      {/* NEXT STOP INFO */}
      <div className="alert alert-info">

        {nextStop ? (
          <>
            <b>Next Stop:</b> {nextStop.stopname}
            <br />
            <b>Distance:</b> {distance ? distance.toFixed(2) : "Calculating"} km
          </>
        ) : (
          "Route Completed"
        )}

      </div>

      <MapContainer
        center={location ? [location.lat, location.lng] : [21.3072, 76.2303]}
        zoom={14}
        style={{ height: "500px", width: "100%" }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Recenter location={location} />

        {/* DRIVER MARKER */}
        {location && (

          <Marker position={[location.lat, location.lng]}>

            <Popup>
              🚍 Bus {dashboard?.driver?.assignedbus?.busnumber}
              
            </Popup>

          </Marker>

        )}

        {/* STOPS */}
        {stops.map((stop, i) => {

          const [lng, lat] = stop.location.coordinates;

          const isNext = i === currentStopIndex;

          return (

            <Marker key={i} position={[lat, lng]}>

              <Popup>

                {isNext ? "➡ NEXT STOP: " : ""}
                {stop.stopname}

              </Popup>

            </Marker>

          )

        })}

        {/* ROUTE LINE */}
        {routeCoordinates.length > 1 && (

          <Polyline
            positions={routeCoordinates}
            color="blue"
          />

        )}

      </MapContainer>

    </div>

  )

}

export default Map;