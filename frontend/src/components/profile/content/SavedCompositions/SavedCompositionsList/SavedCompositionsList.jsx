import React from "react";
import styles from "./SavedCompositionsList.module.scss";
import CompositionCard from "./../CompositionCard/CompositionCard";

const SavedCompositionsList = ({ compositions, onDelete }) => {
  return (
    <ul className={styles.profile__list}>
      {compositions.map((comp) => (
        <CompositionCard key={comp.id} composition={comp} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default SavedCompositionsList;
