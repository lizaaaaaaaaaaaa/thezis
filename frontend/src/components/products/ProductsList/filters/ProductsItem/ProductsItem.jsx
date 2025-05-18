import React from "react";
import styles from "./ProductsItem.module.scss";
import { Link } from "react-router-dom";

const ProductsItem = ({ product }) => {
  return (
    <li key={product.id} className={styles.products__item}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>
        {product.description[0].slice(0, 100)}
        {product.description[0].length >= 0 && "..."}
      </p>
      <Link to={`/products/${product.id}`} className={styles.products__link}>Дізнатись більше</Link>
    </li>
  );
};

export default ProductsItem;
