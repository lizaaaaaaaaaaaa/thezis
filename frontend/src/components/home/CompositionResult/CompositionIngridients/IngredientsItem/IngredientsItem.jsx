import React, { useState } from "react";
import styles from "./IngredientsItem.module.scss";
import arrow from "../../../../../assets/svg/show-details.svg";

const IngredientsItem = ({ ingredient, index }) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  return (
    <li key={index} className={styles.result__item}>
      <div>
        <div>
          <h4>{ingredient?.name}</h4>
          <p
            className={
              ingredient?.isAllergen
                ? styles.result__allergen
                : styles.result__noAllergen
            }
          >
            {ingredient?.isAllergen ? ingredient?.allergenType : ""}
          </p>
        </div>
        <p>{`${ingredient?.safetyRating}/10`}</p>
        <p>{`${ingredient.comedogenicRating}/5`}</p>
        <button
          className={styles.result__btn}
          onClick={() => setIsDetailsVisible(!isDetailsVisible)}
        >
          <img
            src={arrow}
            alt="show details"
            className={`${styles.result__arrow} ${isDetailsVisible ? styles["result__arrow-show"] : ""}`}
          />
        </button>
      </div>
      {isDetailsVisible && (
        <div className={styles.result__details}>
          <div className={styles.result__functions}>
            {ingredient?.function?.join(", ")}
          </div>

          <ul className={styles.result__descr}>
            {ingredient?.description?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default IngredientsItem;
