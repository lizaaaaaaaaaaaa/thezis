import React from "react";
import styles from "./AllergensFilter.module.scss";
import { ALLERGENS } from "../../../../../variables/constants";

const AllergenTypeFilter = ({ excludedTypes, setExcludedTypes }) => {
  const toggleType = (type) => {
    if (excludedTypes.includes(type)) {
      setExcludedTypes(excludedTypes.filter((t) => t !== type));
    } else {
      setExcludedTypes([...excludedTypes, type]);
    }
  };

  return (
    <div className={styles.products__allergens}>
      <h4>Не показувати алергени:</h4>
      <div>
        {ALLERGENS.map((type) => (
          <label key={type} htmlFor={type}>
            <input
              id={type}
              name={type}
              type="checkbox"
              checked={excludedTypes.includes(type)}
              onChange={() => toggleType(type)}
            />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
};

export default AllergenTypeFilter;
