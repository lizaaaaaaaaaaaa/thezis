// src/components/AddIngredientForm.jsx
import React, { useEffect, useState } from "react";
import styles from "./AddIngredientForm.module.scss";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { ALLERGENS, FUNCTIONS } from "../../variables/constants";
import Dropdown from "../Dropdown/Dropdown";

const initialState = {
  name: "",
  safetyRating: "",
  comedogenicRating: "",
  isAllergen: false,
  allergenType: "",
  function: [],
  description: "",
};

const AddIngredientForm = () => {
  const { ingredients, refreshIngredients } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!selectedIngredientId) return;
    const ing = ingredients.find((i) => i.id === selectedIngredientId);
    if (!ing) return;
    setFormData({
      name: ing.name || "",
      safetyRating: ing.safetyRating != null ? ing.safetyRating.toString() : "",
      comedogenicRating:
        ing.comedogenicRating != null ? ing.comedogenicRating.toString() : "",
      isAllergen: !!ing.isAllergen,
      allergenType: ing.allergenType || "",
      function: ing.function || [],
      description: ing.description?.join("\n") || "",
    });
  }, [selectedIngredientId, ingredients]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFunctionSelect = (func) => {
    setFormData((prev) => ({
      ...prev,
      function: prev.function.includes(func)
        ? prev.function.filter((f) => f !== func)
        : [...prev.function, func],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      safetyRating: Number(formData.safetyRating),
      comedogenicRating: Number(formData.comedogenicRating),
      description: formData.description
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean),
    };
    const url = selectedIngredientId
      ? `${process.env.REACT_APP_API_BASE_URL}/api/ingredients/${selectedIngredientId}`
      : `${process.env.REACT_APP_API_BASE_URL}/api/ingredients`;
    const method = selectedIngredientId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      alert(isEditMode ? "Інгредієнт оновлено!" : "Інгредієнт додано!");
      setSelectedIngredientId("");
      setFormData(initialState);
      refreshIngredients();
    } catch (err) {
      navigate("/error", { state: { reason: err.message } });
    }
  };

  const handleDelete = async () => {
    if (!selectedIngredientId) return;
    if (!window.confirm("Точно видалити цей інгредієнт?")) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ingredients/${selectedIngredientId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      alert("Інгредієнт видалено!");
      setSelectedIngredientId("");
      setFormData(initialState);
      refreshIngredients();
    } catch (err) {
      alert("Помилка: " + err.message);
    }
  };

  return (
    <div className="container">
      <div className={styles.admin__tabs}>
        <button
          className={!isEditMode ? styles.active : ""}
          onClick={() => {
            setIsEditMode(false);
            setSelectedIngredientId("");
            setFormData(initialState);
          }}
        >
          Додати інгредієнт
        </button>
        <button
          className={isEditMode ? styles.active : ""}
          onClick={() => setIsEditMode(true)}
        >
          Редагувати інгредієнт
        </button>
      </div>

      <form className={styles.admin__form} onSubmit={handleSubmit}>
        <h2>{isEditMode ? "Редагувати інгредієнт" : "Додати інгредієнт"}</h2>

        {isEditMode && (
          <div className={styles.admin__select}>
            <Dropdown
              options={ingredients.map((i) => ({
                value: i.id,
                label: i.name,
              }))}
              value={selectedIngredientId}
              onChange={setSelectedIngredientId}
              placeholder="Оберіть інгредієнт"
            />
          </div>
        )}

        <input
          name="name"
          placeholder="Назва інгредієнта"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="safetyRating"
          type="number"
          min="1"
          max="10"
          placeholder="Безпека (1-10)"
          value={formData.safetyRating}
          onChange={handleChange}
          required
        />
        <input
          name="comedogenicRating"
          type="number"
          min="0"
          max="5"
          placeholder="Комедогенність (0-5)"
          value={formData.comedogenicRating}
          onChange={handleChange}
          required
        />

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="isAllergen"
            checked={formData.isAllergen}
            onChange={handleChange}
          />
          Є алергеном
        </label>

        {formData.isAllergen && (
          <div className={styles.admin__select}>
            <Dropdown
              options={ALLERGENS.map((type) => ({
                value: type,
                label: type,
              }))}
              value={formData.allergenType}
              onChange={(t) => setFormData((f) => ({ ...f, allergenType: t }))}
              placeholder="Оберіть тип алергену"
            />
          </div>
        )}

        <textarea
          name="description"
          placeholder="Опис інгредієнта (новий рядок — новий абзац)"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <div className={styles.functions}>
          <h5>Функції:</h5>
          <div className={styles.grid}>
            {FUNCTIONS.map((func) => (
              <label key={func}>
                <input
                  type="checkbox"
                  checked={formData.function.includes(func)}
                  onChange={() => handleFunctionSelect(func)}
                />
                {func}
              </label>
            ))}
          </div>
        </div>

        <button type="submit">
          {isEditMode ? "Зберегти зміни" : "Додати інгредієнт"}
        </button>
        {isEditMode && selectedIngredientId && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDelete}
          >
            Видалити інгредієнт
          </button>
        )}
      </form>
    </div>
  );
};

export default AddIngredientForm;
