import React, { useState, useRef, useEffect } from "react";
import styles from "./UserSearch.module.css";

const ID_LENGTH = 14;

const UserSearch = () => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const input = e.target.value.replace(/\D/g, "").slice(0, ID_LENGTH);
    setValue(input);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    console.log("Searching for:", value);
  };

  return (
    <div className={styles.searchContainer}>
      <h3 className={styles.subtitle}>Search by ID</h3>
      <h2>Search by ID card for your medical history</h2>

      <form onSubmit={handleSubmit}>
        <div
          className={styles.inputDisplay}
          onClick={() => inputRef.current?.focus()}
        >
          {value
            .padEnd(ID_LENGTH, "_")
            .split("")
            .map((char, i) => (
              <span
                key={i}
                className={`${styles.digit} ${char !== "_" ? styles.filled : ""}`}
              >
                {char}
              </span>
            ))}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          inputMode="numeric"
          className={styles.hiddenInput}
        />

        <button type="submit" className={styles.button}>
          Search
        </button>
      </form>
    </div>
  );
};

export default UserSearch;
