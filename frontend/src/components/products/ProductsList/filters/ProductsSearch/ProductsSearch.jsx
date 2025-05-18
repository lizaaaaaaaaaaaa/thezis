import React from "react";
import styles from "./ProductsSearch.module.scss";

const ProductsSearch = ({ setSearchTerm }) => {
  return (
    <input
      type="text"
      name="searchProduct"
      placeholder="Введіть назву для пошуку..."
      className={styles.products__search}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

export default ProductsSearch;
