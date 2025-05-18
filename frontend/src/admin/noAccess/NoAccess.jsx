import React from "react";
import { Link } from "react-router-dom";
import styles from "./NoAccess.module.scss";

const NoAccess = () => {
  return (
    <section className={`container ${styles.access}`}>
      <h1>Нажаль, ти маєш доступу до цієї сторінки!</h1>
      <Link to="/" className={styles.access__link}>Повернутись на головну</Link>
    </section>
  );
};

export default NoAccess;
