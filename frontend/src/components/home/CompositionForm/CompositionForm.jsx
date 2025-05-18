import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styles from "./CompositionForm.module.scss";
import SaveCompositionForm from "../SaveCompositionForm/SaveCompositionForm";

const CompositionForm = ({ onAnalyze, isLoading }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuth = localStorage.getItem("isAuth") === "true";

  const [inputValue, setInputValue] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [analyzedIngredients, setAnalyzedIngredients] = useState([]);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAnalyze = useCallback(
    (composition) => {
      const result = composition
        .split(/,(?!\d)/)
        .map((item) => item.trim())
        .filter(Boolean);

      setAnalyzedIngredients(result);
      onAnalyze(result);
    },
    [onAnalyze]
  );

  const loadData = useCallback(
    async (compositionId) => {
      if (location.pathname.includes("/composition/")) {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const saved = userData?.savedCompositions?.find(
          (c) => c.id === compositionId
        );

        if (saved) {
          const stringified = saved.ingredients.join(", ");
          setInputValue(stringified);
          setIsDisabled(true);
          handleAnalyze(stringified);
        }
        return;
      }

      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/products/${compositionId}`
        );
        if (!res.ok) {
          throw new Error("Не вдалося отримати продукт");
        }
        const product = await res.json();
        setInputValue(product.composition);
        setIsDisabled(true);
        handleAnalyze(product.composition);
      } catch (err) {
        navigate("/error", {
          state: {
            reason:
              err.message ||
              "Виникла помилка при завантаженні складу продукту.",
          },
        });
      }
    },
    [location.pathname, handleAnalyze, navigate]
  );

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id, loadData]);

  return (
    <section className={`container ${styles.form}`}>
      <textarea
        id="compositionArea"
        placeholder="Введіть ваш склад..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isDisabled || isLoading}
      ></textarea>

      {!id && (
        <div>
          <button
            onClick={() => handleAnalyze(inputValue)}
            disabled={isDisabled || isLoading}
          >
            Проаналізувати
          </button>

          {analyzedIngredients.length > 0 && isAuth && (
            <button onClick={() => setShowSaveForm(!showSaveForm)}>
              {showSaveForm ? "Приховати форму" : "Зберегти склад"}
            </button>
          )}
        </div>
      )}

      {analyzedIngredients.length > 0 && !id && showSaveForm && isAuth && (
        <SaveCompositionForm
          ingredients={analyzedIngredients}
          onSuccess={() => setShowSaveForm(false)}
          setSuccessMessage={setSuccessMessage}
          successMessage={successMessage}
        />
      )}

      {successMessage && <p className={styles.success}>{successMessage}</p>}
    </section>
  );
};

export default CompositionForm;
