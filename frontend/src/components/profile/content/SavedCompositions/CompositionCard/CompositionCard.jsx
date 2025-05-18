import React from "react";
import styles from "./CompositionCard.module.scss";
import remove from "../../../../../assets/svg/remove-gray.svg";
import { Link } from "react-router-dom";

const CompositionCard = ({ composition, onDelete }) => {
  const { id, name, brand, description, ingredients } = composition;

  const truncate = (text) => {
    if (!text) return "";
    return text.length > 100 ? text.slice(0, 100) + "..." : text;
  };

  return (
    <li className={styles.profile__card}>
      <div>
        <div className={styles.profile__header}>
          <h3>{name}</h3>
          <button onClick={() => onDelete(id)} className={styles.delete}>
            <img src={remove} alt="remove btn" />
          </button>
        </div>
        {brand && <h5 className={styles.profile__brand}>{brand}</h5>}
        {description && (
          <p className={styles.profile__descr}>{truncate(description)}</p>
        )}
        <p className={styles.profile__composition}>
          <strong>Склад:</strong> {truncate(ingredients.join(", "))}
        </p>
      </div>
      <Link className={styles.profile__link} to={`/composition/${id}`}>
        Переглянути
      </Link>
    </li>
  );
};

export default CompositionCard;
