import React from "react";
import styles from "./IngredientsHeader.module.scss";

const IngredientsHeader = () => {
  return (
    <section className={styles.result__header}>
      <div>Назва інгрідієнта</div>
      <div>Небезпечність</div>
      <div>Комедогенність</div>
    </section>
  );
};

export default IngredientsHeader;
