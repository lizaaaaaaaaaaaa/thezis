import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CompositionResult.module.scss";
import CompositionIngridients from "./CompositionIngridients/CompositionIngredients";
import Loader from "../../UI/Loader/Loader";
import { useData } from "../../../context/DataContext";

const CompositionResult = ({ items, setParentIsLoading }) => {
  const { ingredients: allIngredients, isIngredientsLoaded } = useData();
  const [ingredientsData, setIngredientsData] = useState([]);
  const [notFoundIngredients, setNotFoundIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevItemsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const arraysEqual = (a, b) =>
      a.length === b.length && a.every((val, i) => val === b[i]);

    const shouldSkip =
      !isIngredientsLoaded ||
      !items ||
      items.length === 0 ||
      arraysEqual(items, prevItemsRef.current);

    if (isIngredientsLoaded && allIngredients.length === 0) {
      navigate("/error", {
        state: {
          message:
            "Не вдалося отримати список інгредієнтів для аналізу. Спробуйте пізніше.",
        },
      });
      return;
    }

    if (shouldSkip) {
      setIsLoading(false);
      setParentIsLoading(false);
      return;
    }

    prevItemsRef.current = [...items];
    setIsLoading(true);
    setParentIsLoading(true);

    const found = [];
    const notFound = [];

    items.forEach((item) => {
      const match = allIngredients.find(
        (ing) => ing.name.toLowerCase() === item.toLowerCase()
      );
      if (match) {
        found.push(match);
      } else {
        notFound.push(item);
      }
    });

    setIngredientsData(found);
    setNotFoundIngredients(notFound);
    setIsLoading(false);
    setParentIsLoading(false);
  }, [
    items,
    isIngredientsLoaded,
    allIngredients,
    setParentIsLoading,
    navigate,
  ]);

  const getAdvice = () => {
    if (ingredientsData.length === 0) return null;

    const partSize = Math.ceil(ingredientsData.length / 3);
    const firstTwoParts = ingredientsData.slice(0, partSize * 2);
    const lastPart = ingredientsData.slice(partSize * 2);

    const hasUnsafeFirstTwo = firstTwoParts.some(
      (i) => Number(i.safetyRating) > 5
    );
    const hasComedogenicFirstTwo = firstTwoParts.some(
      (i) => Number(i.comedogenicRating) >= 3
    );
    const hasUnsafeLast = lastPart.some((i) => Number(i.safetyRating) > 5);
    const hasComedogenicLast = lastPart.some(
      (i) => Number(i.comedogenicRating) > 3
    );

    if (hasUnsafeFirstTwo || hasComedogenicFirstTwo) {
      return "Даний склад містить інгредієнти, не бажані для вживання для здоров'я організму та шкіри. Будьте уважні при використанні.";
    }

    if (hasUnsafeLast || hasComedogenicLast) {
      return "Склад є переважно безпечним, але уважно слідкуйте за реакцією шкіри та перевіряйте засіб перед нанесенням на чутливі ділянки шкіри.";
    }

    return "Склад не є потенційно комедогенним та не має небезпечних складників. Продукт рекомендовано до використання.";
  };

  const advice = getAdvice();

  return (
    <section className={`container ${styles.result__inner}`}>
      {isLoading && <Loader />}

      {!isLoading &&
        notFoundIngredients.length > 0 &&
        ingredientsData.length !== 0 && (
          <div className={styles.result__warning}>
            ⚠ У складі є інгредієнти, які не вдалося знайти. Це може вплинути на
            точність аналізу.
          </div>
        )}

      {!isLoading && advice && (
        <div className={styles.result__advice}>{advice}</div>
      )}

      {ingredientsData.length > 0 && (
        <CompositionIngridients ingredients={ingredientsData} />
      )}

      {!isLoading && notFoundIngredients.length > 0 && (
        <div className={styles.result__notFound}>
          <span>Не знайдені інгредієнти:</span>{" "}
          <span>{notFoundIngredients.join(", ")}.</span>
        </div>
      )}
    </section>
  );
};

export default CompositionResult;
