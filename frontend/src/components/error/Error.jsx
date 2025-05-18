import React from "react";
import styles from "./Error.module.scss";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <section className={`container ${styles.error}`}>
      <h1>Ой! Здається, ти помилився сторінкою!</h1>
      <Link to="/" className={styles.error__link}>
        Повернутись на головну
      </Link>
    </section>
  );
};

export default Error;
