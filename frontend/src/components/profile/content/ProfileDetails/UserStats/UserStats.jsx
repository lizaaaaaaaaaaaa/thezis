import React, { useMemo, useEffect } from "react";
import styles from "./UserStats.module.scss";
import { useData } from "../../../../../context/DataContext";
import arrowIcon from "../../../../../assets/svg/show-details.svg";
import { useNavigate } from "react-router-dom";

const StatSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={styles["stat-section"]}>
      <div
        className={`${styles["stat-section__header"]} ${
          isOpen ? styles.open : ""
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h3>{title}</h3>
        <img src={arrowIcon} alt="Arrow" className={styles.arrow} />
      </div>
      <div
        className={`${styles["stat-section__content"]} ${
          isOpen ? "" : styles.closed
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const UserStats = () => {
  const { products, isProductsLoaded } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (isProductsLoaded && (!products || products.length === 0)) {
      navigate("/error", {
        state: { message: "Не вдалося завантажити дані для статистики." },
      });
    }
  }, [isProductsLoaded, products, navigate]);

  const savedCompositions = useMemo(() => {
    const user = JSON.parse(localStorage.getItem("userData")) || {};
    return user.savedCompositions || [];
  }, []);

  const favoriteIds = useMemo(() => {
    const user = JSON.parse(localStorage.getItem("userData")) || {};
    return user.favorites || [];
  }, []);

  const stats = useMemo(() => {
    const ingredientCount = {};
    const ingredientOriginalNames = {};
    const effectCount = {};
    const effectOriginalNames = {};

    savedCompositions.forEach((composition) => {
      composition.ingredients.forEach((ing) => {
        const key = ing.toLowerCase().trim();
        ingredientCount[key] = (ingredientCount[key] || 0) + 1;
        if (!ingredientOriginalNames[key]) {
          ingredientOriginalNames[key] = ing;
        }
      });
    });

    products.forEach((product) => {
      if (favoriteIds.includes(product.id)) {
        product.effects?.forEach((effect) => {
          const key = effect.toLowerCase().trim();
          effectCount[key] = (effectCount[key] || 0) + 1;
          if (!effectOriginalNames[key]) {
            effectOriginalNames[key] = effect;
          }
        });
      }
    });

    const topIngredients = Object.entries(ingredientCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key, count]) => [ingredientOriginalNames[key], count]);

    const topEffects = Object.entries(effectCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, count]) => [effectOriginalNames[key], count]);

    return { topIngredients, topEffects };
  }, [savedCompositions, favoriteIds, products]);

  return (
    <div className={`container ${styles.stats}`}>
      <h1>Статистика</h1>

      <StatSection title="Топ-10 інгредієнтів у збережених складах">
        {stats.topIngredients.length > 0 ? (
          <ul>
            {stats.topIngredients.map(([name, count]) => {
              let countText;

              if (count === 1) {
                countText = "раз";
              } else if (count >= 2 && count <= 4) {
                countText = "рази";
              } else {
                countText = "разів";
              }

              return (
                <li key={name}>
                  {name} — {count} {countText}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Немає даних</p>
        )}
      </StatSection>

      <StatSection title="Топ-5 ефектів з улюблених продуктів">
        {stats.topEffects.length > 0 ? (
          <ol>
            {stats.topEffects.map(([effect, count]) => {
              let effectText;

              if (count === 1) {
                effectText = "згадка";
              } else if (count < 5) {
                effectText = "згадки";
              } else {
                effectText = "згадок";
              }

              return (
                <li key={effect}>
                  {effect} — {count} {effectText}
                </li>
              );
            })}
          </ol>
        ) : (
          <p>Немає даних</p>
        )}
      </StatSection>
    </div>
  );
};

export default UserStats;
