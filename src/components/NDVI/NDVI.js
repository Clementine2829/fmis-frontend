import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, ImageOverlay, Polygon } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import { format } from "date-fns";
import { UserContext } from "../../utils/UserContext";
import { getFarmNDVI, getUserFarms } from "../../api/backend";
import styles from "./NDVI.module.css";

export default function NDVI() {
  const { user } = useContext(UserContext);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [ndviResult, setNdviResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const accessToken = user?.accessToken;

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoading(true);
        const fetchedFarms = await getUserFarms(accessToken);
        setFarms(fetchedFarms);
      } catch (error) {
        console.error("Failed to fetch farms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, [accessToken]);

  const fetchNDVIForDate = async (farmId, date) => {
    try {
      setLoading(true);
      const fetchedNDVI = await getFarmNDVI(accessToken, { farmId, date });
      console.log("Fetched NDVI 2:", fetchedNDVI);
      setNdviResult(fetchedNDVI);
    } catch (error) {
      console.error("Failed to fetch NDVI:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFarmChange = async (e) => {
    const farmId = e.target.value;
    setSelectedFarm(farmId);
    setNdviResult(null);
    setSelectedDate(null);
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setNdviResult(null);
    setError("");

    if (!selectedFarm || !date) return;

    const formattedDate = format(date, "yyyy-MM-dd");
    setLoading(true);

    await fetchNDVIForDate(selectedFarm, formattedDate);
  };

  const selectedFarmObj = farms.find((farm) => farm.id === selectedFarm);
  const polygonCoords = selectedFarmObj
    ? JSON.parse(selectedFarmObj.boundaries).map((coord) => [
        coord[1],
        coord[0],
      ]) // Convert to [lat, lng]
    : [];

  const bounds = polygonCoords.length
    ? new LatLngBounds(polygonCoords)
    : [
        [0, 0],
        [0, 0],
      ];

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Select Farm:</label>
          <select
            value={selectedFarm || ""}
            onChange={handleFarmChange}
            className={styles.select}
          >
            <option value="">-- Choose a farm --</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            maxDate={new Date()}
            placeholderText="Select a date"
            dateFormat="yyyy-MM-dd"
            className={styles.datePicker}
            disabled={!selectedFarm}
          />
        </div>
      </div>

      {loading && <p className={styles.loading}>Loading NDVI data...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {ndviResult && (
        <>
          <div className={styles.ndviCard}>
            <p className={styles.ndviValue}>
              NDVI on {ndviResult.date || format(selectedDate, "yyyy-MM-dd")}:{" "}
              <strong>{ndviResult.stats.mean.toFixed(2)}</strong>
            </p>
            <p>Standard Deviation: {ndviResult.stats.stddev.toFixed(2)}</p>
            <p>Min: {ndviResult.stats.min.toFixed(2)}</p>
            <p>Max: {ndviResult.stats.max.toFixed(2)}</p>
          </div>

          <div
            style={{
              marginTop: "20px",
              height: "400px",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <MapContainer
              bounds={bounds}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Polygon
                positions={polygonCoords}
                pathOptions={{ color: "green" }}
              />
              {ndviResult.image && (
                <ImageOverlay
                  url={ndviResult.image}
                  bounds={bounds}
                  opacity={0.6}
                />
              )}
            </MapContainer>
          </div>
        </>
      )}
    </div>
  );
}
