import React from "react";
import styles from "./NavBar.module.css";
import DarkModeToggle from "./DarkModeToggle";

const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <h1 className={styles.logo}>Netflix</h1>
      <ul className={styles.navLinks}>
        <li>Home</li>
        <li>TV Shows</li>
        <li>Movies</li>
        <li>My List</li>
      </ul>
      <DarkModeToggle />
    </div>
  );
};

export default NavBar;
