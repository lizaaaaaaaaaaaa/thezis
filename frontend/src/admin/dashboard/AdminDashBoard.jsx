import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashBoard.module.scss";
import { useData } from "../../context/DataContext";
import arrowIcon from "../../assets/svg/show-details.svg";

const StatSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

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

const AdminDashboard = () => {
  const { products, isProductsLoaded } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (isProductsLoaded && (!products || products.length === 0)) {
      navigate("/error", {
        state: {
          message:
            "Не вдалося завантажити дані для аналітики. Спробуйте пізніше.",
        },
      });
    }
  }, [isProductsLoaded, products, navigate]);

  const { topIngredients, topEffects, brandCounts } = useMemo(() => {
    const ingredientCount = {};
    const effectCount = {};
    const brandCount = {};

    products.forEach((product) => {
      const ingredients =
        product.composition?.split(", ").map((i) => i.trim()) || [];
      ingredients.forEach((ing) => {
        if (ing) ingredientCount[ing] = (ingredientCount[ing] || 0) + 1;
      });

      product.effects?.forEach((effect) => {
        if (effect) effectCount[effect] = (effectCount[effect] || 0) + 1;
      });

      if (product.brand) {
        brandCount[product.brand] = (brandCount[product.brand] || 0) + 1;
      }
    });

    const sortedIngredients = Object.entries(ingredientCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    const sortedEffects = Object.entries(effectCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const sortedBrands = Object.entries(brandCount).sort((a, b) => b[1] - a[1]);

    return {
      topIngredients: sortedIngredients,
      topEffects: sortedEffects,
      brandCounts: sortedBrands,
    };
  }, [products]);

  if (!isProductsLoaded) return <p>Завантаження статистики...</p>;

  return (
    <div className={`container ${styles.dashboard}`}>
      <h1>Аналітика</h1>

      <StatSection title="Топ-20 найчастіше використовуваних інгредієнтів">
        <ol>
          {topIngredients.map(([name, count]) => (
            <li key={name}>
              {name} — {count} разів
            </li>
          ))}
        </ol>
      </StatSection>

      <StatSection title="Топ-5 ефектів у продуктах">
        <ol>
          {topEffects.map(([effect, count]) => (
            <li key={effect}>
              {effect} — {count} згадок
            </li>
          ))}
        </ol>
      </StatSection>

      <StatSection title="Кількість продуктів по брендах">
        <ul>
          {brandCounts.map(([brand, count]) => (
            <li key={brand}>
              {brand}: {count} продуктів
            </li>
          ))}
        </ul>
      </StatSection>
    </div>
  );
};

export default AdminDashboard;
