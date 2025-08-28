import React, { useState, useContext } from "react";
import styles from "./Profile.module.css";
import { UserContext } from "../../utils/UserContext";

const Profile = ({ user }) => {
  const { updateUser } = useContext(UserContext); 

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    oldPassword: "",
    newPassword: "",
  });

  const [changePassword, setChangePassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    if (changePassword) {
      dataToSubmit.oldPassword = formData.oldPassword;
      dataToSubmit.newPassword = formData.newPassword;
    }

    updateUser(dataToSubmit);
  };

  return (
    <div className={styles.profile}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          First Name
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <div className={styles.passwordSection}>
          <button
            type="button"
            onClick={() => setChangePassword(!changePassword)}
            className={styles.toggleBtn}
          >
            {changePassword ? "Cancel Password Change" : "Change Password"}
          </button>

          {changePassword && (
            <>
              <label>
                Old Password
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                />
              </label>
              <label>
                New Password
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </label>
            </>
          )}
        </div>

        <button type="submit" className={styles.saveBtn}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
