import React, { useState } from "react";
import styles from "./Header.module.css";
import { FaLeaf, FaUserCircle } from "react-icons/fa";

const Header = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        
        <FaLeaf className={styles.logoIcon} />
        <div>
          <h1 className={styles.logoText}>AgriView</h1>
          <p className={styles.subtitle}>Farm Insights & NDVI Monitoring</p>
        </div>
      </div>

      <div className={styles.usernameSection}>
        <p>
          <strong>Welcome back,</strong> {user?.firstname}
        </p>
      </div>

      <div
        className={styles.userSection}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FaUserCircle className={styles.userIcon} />
        <span className={styles.username}>{user?.username}</span>

        {showDropdown && (
          <div className={styles.dropdown}>
            <button>Profile</button>
            <button>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
