import React from "react";
import styles from "./Sidebar.module.css";
import { FaTractor, FaSeedling, FaChartLine } from "react-icons/fa";

const Sidebar = ({ onSelectView, currentView }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.title}>Navigation</div>

      <button
        className={`${styles.item} ${currentView === "farms" ? styles.active : ""}`}
        onClick={() => onSelectView("farms")}
      >
        <FaTractor className={styles.icon} />
        <span>Farms</span>
      </button>

      <button
        className={`${styles.item} ${currentView === "ndvi" ? styles.active : ""}`}
        onClick={() => onSelectView("ndvi")}
      >
        <FaChartLine className={styles.icon} />
        <span>NDVI</span>
      </button>

      <button
        className={`${styles.item} ${currentView === "profile" ? styles.active : ""}`}
        onClick={() => onSelectView("profile")}
      >
        <FaSeedling className={styles.icon} />
        <span>Profile</span>
      </button>
    </aside>
  );
};

export default Sidebar;
