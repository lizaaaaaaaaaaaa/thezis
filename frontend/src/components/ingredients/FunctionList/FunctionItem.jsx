import React from "react";
import styles from "./FunctionItem.module.scss";

const FunctionItem = ({ text, isActive, onClick }) => {
  return (
    <div
      className={`${styles.function__item} ${
        isActive ? styles["function__item-active"] : ""
      }`}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default FunctionItem;
