import React, { useState } from "react";
import CompositionForm from "../CompositionForm/CompositionForm";
import CompositionResult from "../CompositionResult/CompositionResult";
import styles from "./CompositionMain.module.scss";
import intro from "../../../assets/home/background.png";
import { useLocation } from "react-router-dom";

const CompositionMain = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();

  const handleAnalyze = (parsedList) => {
    setIngredients((prev) => {
      const isSame =
        prev.length === parsedList.length &&
        prev.every((val, i) => val === parsedList[i]);

      return isSame ? prev : parsedList;
    });
  };

  return (
    <section>
      {!location.pathname.includes("/products/") && (
        <img src={intro} alt="intro" className={styles.composition__intro} />
      )}
      <CompositionForm onAnalyze={handleAnalyze} isLoading={isLoading} />
      <CompositionResult
        items={ingredients}
        setParentIsLoading={setIsLoading}
      />
    </section>
  );
};

export default CompositionMain;
