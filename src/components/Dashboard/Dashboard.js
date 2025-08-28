import React, { useContext, useState } from "react";
import styles from "./Dashboard.module.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Farms from "../Farms/Farms";
import NDVI from "../NDVI/NDVI";
import Profile from "../Profile/Profile";
import { UserContext } from "../../utils/UserContext";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("farms");
  const { user, logout } = useContext(UserContext);

  const renderView = () => {
    switch (currentView) {
      case "farms":
        return <Farms user={user} />;
      case "ndvi":
        return <NDVI user={user} />;
      case "profile":
        return <Profile user={user} />;
      default:
        return <Farms user={user} />;
    }
  };

  const viewTitles = {
    farms: "My Farms",
    ndvi: "NDVI Analysis",
    profile: "My Profile",
  };

  return (
    <div className={styles.dashboard}>
      <Header user={user} />
      <div className={styles.body}>
        <Sidebar onSelectView={setCurrentView} currentView={currentView} />
        <main className={styles.main}>
          <div className={styles.pageHeader}>
            <h2>{viewTitles[currentView]}</h2>
          </div>
          <div className={styles.content}>{renderView()}</div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
