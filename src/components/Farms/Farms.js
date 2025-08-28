import React, { useState, useEffect } from "react";
import styles from "./Farms.module.css";
import { createFarm, getUserFarms, deleteFarm, updateFarm } from "../../api/backend";

const Farms = ({ user }) => {
  const [farms, setFarms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFarmId, setEditingFarmId] = useState(null);
  const [newFarm, setNewFarm] = useState({
    name: "",
    location: "",
    boundaries: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const accessToken = user?.accessToken;
  const userId = user?.userId;

  useEffect(() => {
    fetchFarms();
  }, []);

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

  const isValidBoundary = (boundaries) => {
    try {
      const coords = JSON.parse(boundaries);
      return Array.isArray(coords) && coords.every(pair => Array.isArray(pair) && pair.length === 2);
    } catch {
      return false;
    }
  };

  const handleAddOrUpdateFarm = async () => {
    const { name, location, boundaries, description } = newFarm;
    if (!name || !location || !boundaries || !isValidBoundary(boundaries)) {
      alert("Please fill all fields and ensure boundaries are a valid JSON array of coordinates.");
      return;
    }

    try {
      const farmData = { ...newFarm, userId };

      if (editingFarmId) {
        const updatedFarm = await updateFarm(editingFarmId, accessToken, farmData);
        setFarms(farms.map(farm => (farm.id === editingFarmId ? updatedFarm : farm)));
      } else {
        const createdFarm = await createFarm(accessToken, farmData);
        setFarms([...farms, createdFarm]);
      }

      setNewFarm({
        name: "",
        location: "",
        boundaries: "",
        description: "",
      });
      setEditingFarmId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving farm:", error);
    }
  };

  const handleEdit = (farm) => {
    setNewFarm({
      name: farm.name,
      location: farm.location,
      boundaries: farm.boundaries,
      description: farm.description || "",
    });
    setEditingFarmId(farm.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
        const confirmDelete = window.confirm("Are you sure you want to delete this farm?");
        if (confirmDelete) {
          await deleteFarm(id, accessToken);
          setFarms(farms.filter((farm) => farm.id !== id));
        }
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  return (
    <div className={styles.farms}>
      <button
        onClick={() => {
          setShowForm(true);
          setEditingFarmId(null);
          setNewFarm({ name: "", location: "", boundaries: "", description: "" });
        }}
        className={styles.addBtn}
      >
        + Add a New Farm
      </button>

      {loading ? (
        <p>Loading farms...</p>
      ) : (
        <div className={styles.farmList}>
          {farms.map((farm) => (
            <div key={farm.id} className={styles.farmCard}>
              <h3>{farm.name}</h3>
              <p><strong>Location:</strong> {farm.location}</p>
              <p><strong>Boundaries:</strong> {farm.boundaries}</p>
              {farm.description && <p><strong>Description:</strong> {farm.description}</p>}
              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => handleEdit(farm)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(farm.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{editingFarmId ? "Edit Farm" : "Add New Farm"}</h3>
            <input
              type="text"
              placeholder="Farm Name"
              value={newFarm.name}
              onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              value={newFarm.location}
              onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
            />
            <input
              type="text"
              placeholder='Boundaries (e.g. [[28.045,-26.204],[28.05,-26.204]])'
              value={newFarm.boundaries}
              onChange={(e) => setNewFarm({ ...newFarm, boundaries: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newFarm.description}
              onChange={(e) => setNewFarm({ ...newFarm, description: e.target.value })}
            />
            <div className={styles.modalActions}>
              <button onClick={handleAddOrUpdateFarm} className={styles.saveBtn}>
                {editingFarmId ? "Update" : "Save"}
              </button>
              <button onClick={() => setShowForm(false)} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Farms;
