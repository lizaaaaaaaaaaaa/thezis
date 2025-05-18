import React, { useState, useMemo } from "react";
import styles from "../ProductsBrandFilter/ProductsBrandFilter.module.scss";
import styles_1 from "./ProductsTypeFilter.module.scss";

const ProductsTypeFilter = ({ setSelectedPurpose, products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("За призначенням");

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectType = (type) => {
    setSelected(type);
    setSelectedPurpose(type);
    setIsOpen(false);
  };

  const effectSourceMap = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      (product.effects || []).forEach((raw) => {
        const cleaned = raw.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
        if (!map.has(cleaned)) {
          map.set(cleaned, {
            brand: product.brand,
            name: product.name,
            raw,
          });
        }
      });
    });

    return map;
  }, [products]);

  const uniqueSortedTypes = useMemo(() => {
    return [...effectSourceMap.keys()].sort((a, b) =>
      a.localeCompare(b, "uk", { sensitivity: "base" })
    );
  }, [effectSourceMap]);

  return (
    <div className={styles.dropdown}>
      <button onClick={toggleDropdown} className={styles["dropdown-button"]}>
        {selected}
      </button>
      <div
        className={`${styles["dropdown-menu"]} ${styles_1["dropdown-menu"]} ${
          isOpen && styles["dropdown-menu-show"]
        }`}
      >
        {["За призначенням", ...uniqueSortedTypes].map((type, index) => (
          <div
            key={index}
            onClick={() => selectType(type)}
            className={styles["dropdown-item"]}
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsTypeFilter;
