import React, { useState } from "react";
import styles from "./ProductsBrandFilter.module.scss";

const ProductsBrandFilter = ({ setSelectedBrand }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Бренд");

  const brands = [
    "Бренд",
    "ANACIS",
    "DEBEAUS",
    "DERMALINE",
    "Dr.HEDISON",
    "PRO YOU PROFESSIONAL",
    "RAMOSU",
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectBrand = (brand) => {
    setSelected(brand);
    setSelectedBrand(brand);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button onClick={toggleDropdown} className={styles["dropdown-button"]}>
        {selected}
      </button>
      <div
        className={`${styles["dropdown-menu"]} ${
          isOpen ? styles["dropdown-menu-show"] : ""
        }`}
      >
        {brands.map((brand, index) => (
          <div
            key={index}
            onClick={() => selectBrand(brand)}
            className={styles["dropdown-item"]}
          >
            {brand}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsBrandFilter;
