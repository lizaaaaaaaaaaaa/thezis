import React from "react";
import styles from "./FilterCheckbox.module.scss";

const FilterCheckbox = ({
  lowComedogenic,
  setLowComedogenic,
  noAllergen,
  setNoAllergen,
}) => {
  return (
    <div className={styles.filters__checkboxes}>
      <label htmlFor="comedogenity">
        <input
          id="comedogenity"
          name="comedogenity"
          type="checkbox"
          checked={lowComedogenic}
          onChange={() => setLowComedogenic(!lowComedogenic)}
        />
        Потенційно некомедогенні
      </label>
      <label htmlFor="noAllergens">
        <input
          id="noAllergens"
          name="noAllergens"
          type="checkbox"
          checked={noAllergen}
          onChange={() => setNoAllergen(!noAllergen)}
        />
        Без алергенів
      </label>
    </div>
  );
};

export default FilterCheckbox;
