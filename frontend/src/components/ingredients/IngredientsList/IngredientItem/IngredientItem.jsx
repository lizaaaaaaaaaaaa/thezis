import React from "react";
import styles from "./IngredientItem.module.scss";

const IngredientItem = ({ ingredient }) => {
  return (
    <li className={styles.ingredient__item}>
      <h4>{ingredient.name}</h4>
      <div className={styles.ingredient__details}>
        <div>
          <div>Комедогенність</div>
          {ingredient.comedogenicRating}/5
        </div>
        <div>
          <div>Безпечність</div>
          {ingredient.safetyRating}
        </div>
      </div>
      <div className={styles.ingredient__functions}>
        {ingredient.function.map((func, index) => (
          <span key={index} className={styles.function}>
            {func}
          </span>
        ))}
      </div>
      <p>
        {!ingredient.isAllergen
          ? "Не є алергеном і безпечний для використання"
          : `Є алергеном. Тип ${
              ingredient.allergenType
                ? `: ${ingredient.allergenType}`
                : "невідомий"
            }. Будите оборежні у використанні.`}
      </p>
      <p>
        {ingredient.description.slice(0, 100)}
        {ingredient.description.length > 100 && "..."}
      </p>
    </li>
  );
};

export default IngredientItem;
