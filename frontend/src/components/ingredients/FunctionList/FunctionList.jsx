import React, { useState } from "react";
import styles from "./FunctionList.module.scss";
import FunctionItem from "./FunctionItem";
import { FUNCTIONS } from "../../../variables/constants";

const FunctionList = ({ setSelectedFunction }) => {
  const [activeFunction, setActiveFunction] = useState("Всі інгредієнти");

  const handleClick = (func) => {
    setActiveFunction(func);
    setSelectedFunction(func);
  };

  return (
    <section className={`container ${styles.function__list}`}>
      {["Всі інгредієнти", ...FUNCTIONS].map((item) => (
        <FunctionItem
          key={item}
          text={item}
          isActive={activeFunction === item}
          onClick={() => handleClick(item)}
        />
      ))}
    </section>
  );
};

export default FunctionList;
