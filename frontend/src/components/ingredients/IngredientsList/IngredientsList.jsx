import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./IngredientsList.module.scss";
import Pagination from "../../products/ProductsList/filters/Pagination/Pagination";
import IngredientItem from "./IngredientItem/IngredientItem";
import Loader from "../../UI/Loader/Loader";
import FilterCheckbox from "./FilterCheckbox/FilterCheckbox";
import { useData } from "../../../context/DataContext";

const IngredientsList = () => {
  const { ingredients, isIngredientsLoaded } = useData();
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ingredientsPerPage] = useState(10);
  const [lowComedogenic, setLowComedogenic] = useState(false);
  const [noAllergen, setNoAllergen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const applyFilters = useCallback(() => {
    const queryParams = new URLSearchParams(location.search);
    const selectedFunc = decodeURIComponent(queryParams.get("function") || "");

    let filtered = [...ingredients];

    if (selectedFunc && selectedFunc !== "Всі інгредієнти") {
      filtered = filtered.filter((ingredient) =>
        ingredient.function?.includes(selectedFunc)
      );
    }

    if (lowComedogenic) {
      filtered = filtered.filter((ing) => Number(ing.comedogenicRating) <= 2);
    }

    if (noAllergen) {
      filtered = filtered.filter((ing) => !ing.isAllergen);
    }

    setFilteredIngredients(filtered);
  }, [ingredients, location.search, lowComedogenic, noAllergen]);

  useEffect(() => {
    if (isIngredientsLoaded) {
      if (!ingredients.length) {
        navigate("/error", {
          state: { message: "Не вдалося завантажити інгредієнти." },
        });
      } else {
        applyFilters();
      }
    }
  }, [isIngredientsLoaded, ingredients, navigate, applyFilters]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", "1");
    navigate(`?${queryParams.toString()}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lowComedogenic, noAllergen]);

  useEffect(() => {
    const page = new URLSearchParams(location.search).get("page");
    setCurrentPage(page ? Number(page) : 1);
  }, [location.search]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", newPage);
    navigate(`?${queryParams.toString()}`);
  };

  const indexOfLastIngredient = currentPage * ingredientsPerPage;
  const indexOfFirstIngredient = indexOfLastIngredient - ingredientsPerPage;
  const currentIngredients = filteredIngredients.slice(
    indexOfFirstIngredient,
    indexOfLastIngredient
  );

  return (
    <section className={`container ${styles.ingredients}`}>
      {!isIngredientsLoaded ? (
        <Loader />
      ) : (
        <>
          <FilterCheckbox
            lowComedogenic={lowComedogenic}
            setLowComedogenic={setLowComedogenic}
            noAllergen={noAllergen}
            setNoAllergen={setNoAllergen}
          />

          <ul className={styles.ingredients__list}>
            {currentIngredients.length > 0 ? (
              currentIngredients.map((ingredient, index) => (
                <IngredientItem
                  ingredient={ingredient}
                  key={`${ingredient.name}-${index}`}
                />
              ))
            ) : (
              <div>Інгредієнти не знайдені</div>
            )}
          </ul>

          <Pagination
            currentPage={currentPage}
            totalProducts={filteredIngredients.length}
            productsPerPage={ingredientsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
};

export default IngredientsList;
