import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UserContext } from "../../utils/UserContext";
import { getFarmNDVI, getNDVIHistory, getUserFarms } from "../../api/backend";
import styles from "./NDVI.module.css"; // ← Import CSS module

export default function NDVI() {
  const { user } = useContext(UserContext);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [ndviResult, setNdviResult] = useState(null);
  const [ndviTrend, setNdviTrend] = useState([]);
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
      setNdviResult(fetchedNDVI);
    } catch (error) {
      console.error("Failed to fetch NDVI:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNDVITrend = async (farmId) => {
    try {
      setLoading(true);
      const data = await getNDVIHistory(farmId, accessToken);
      return data.map((entry) => ({
        date: entry.request_date,
        ndvi: entry.mean_ndvi,
      }));
    } catch (error) {
      console.error("Failed to fetch NDVI trend:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFarmChange = async (e) => {
    const farmId = e.target.value;
    setSelectedFarm(farmId);
    setNdviResult(null);
    setSelectedDate(null);

    if (farmId) {
      const trend = await fetchNDVITrend(farmId);
      setNdviTrend(trend);
    } else {
      setNdviTrend([]);
    }
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setNdviResult(null);
    setError("");

    if (!selectedFarm || !date) return;

    const formattedDate = format(date, "yyyy-MM-dd");
    setLoading(true);

    try {
      const result = await fetchNDVIForDate(selectedFarm, formattedDate);
      if (result.mean !== undefined) {
        setNdviResult(result);
        const trend = await fetchNDVITrend(selectedFarm);
        setNdviTrend(trend);
      } else {
        setError("No NDVI data available for this date.");
      }
    } catch (err) {
      setError("Failed to fetch NDVI data.");
    } finally {
      setLoading(false);
    }
  };

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
        <div className={styles.ndviCard}>
          <p className={styles.ndviValue}>
            NDVI on {ndviResult.date || format(selectedDate, "yyyy-MM-dd")}:{" "}
            <strong>{ndviResult.stats.mean.toFixed(2)}</strong>
          </p>
          <p>Standard Deviation: {ndviResult.stats.stddev.toFixed(2)}</p>
          <p>Min: {ndviResult.stats.min.toFixed(2)}</p>
          <p>Max: {ndviResult.stats.max.toFixed(2)}</p>
          <img
            src={ndviResult.image}
            alt="NDVI Map"
            className={styles.ndviImage}
          />
        </div>
      )}

      {ndviTrend.length > 0 && (
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>NDVI Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ndviTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Line type="monotone" dataKey="ndvi" stroke="#4CAF50" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
