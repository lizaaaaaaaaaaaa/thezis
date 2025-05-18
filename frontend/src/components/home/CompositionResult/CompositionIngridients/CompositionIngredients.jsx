import React from "react";
import styles from "../CompositionResult.module.scss";
import IngredientsItem from "./IngredientsItem/IngredientsItem";
import IngredientsHeader from "./IngredientsHeader/IngredientsHeader";

const CompositionIngridients = ({ ingredients }) => {
  return (
    <div className={styles.result__table}>
      <IngredientsHeader />
      <ul className={styles.result__list}>
        {ingredients.map((ingredient, index) => (
          <IngredientsItem ingredient={ingredient} index={index} key={index} />
        ))}
      </ul>
    </div>
  );
};

export default CompositionIngridients;
