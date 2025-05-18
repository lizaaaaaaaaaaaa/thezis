import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./ErrorMain.module.scss";

const ErrorMain = () => {
  const location = useLocation();
  const message =
    location.state?.message || "Сталася невідома помилка. Спробуйте пізніше.";

  return (
    <section className={`container ${styles.error}`}>
      <h1>Сталася помилка</h1>
      <p>{message}</p>
    </section>
  );
};

export default ErrorMain;
