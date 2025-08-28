import React, { useState } from "react";
import styles from "./Signup.module.css";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/backend";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setMessage("All fields are required.");
      setSuccess(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setSuccess(false);
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setSuccess(false);
      return;
    }

    try {
      const response = await signup({ firstName, lastName, email, password });

      if (response.success) {
        setSuccess(true);
        setMessage("Signup successful! Please login.");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
      } else {
        setSuccess(false);
        setMessage(response.message || "Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSuccess(false);
      setMessage("Error connecting to the server. Please try again later.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Create Account</h2>
        {message && (
          <p className={success ? styles.success : styles.error}>{message}</p>
        )}
        <input
          type="text"
          placeholder="Firstname"
          className={styles.input}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Lastname"
          className={styles.input}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          Sign Up
        </button>
        <p className={styles.linkText}>
          Already have an account?{" "}
          <span className={styles.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
