import React, { useState, useEffect } from "react";
import styles from "../ingredients/AddIngredientForm.module.scss";
import { useData } from "../../context/DataContext";
import Dropdown from "./../Dropdown/Dropdown";

const SKIN_TYPES = [
  "Всі типи",
  "Нормальна",
  "Жирна",
  "Комбінована",
  "Суха",
  "Проблемна",
  "Чутлива",
  "Вікова",
];
const AGE_OPTIONS = ["18+", "25+", "30+", "35+", "40+", "45+", "55+", "65+"];

const initialState = {
  name: "",
  brand: "",
  volume: "",
  age: "",
  skinTypes: [],
  effects: "",
  composition: "",
  description: "",
  activeIngredients: "",
  image: "",
  link: "",
};

const AddProductForm = () => {
  const { products, refreshProducts } = useData();
  const [formData, setFormData] = useState(initialState);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!selectedProductId) return;
    const p = products.find((x) => x.id === selectedProductId);
    if (!p) return;
    setFormData({
      name: p.name || "",
      brand: p.brand || "",
      volume: p.volume || "",
      age: p.age || "",
      skinTypes: p.skinTypes || [],
      effects: (p.effects || []).join(", "),
      composition: p.composition || "",
      description: (p.description || []).join("\n"),
      activeIngredients: (p.activeIngredients || []).join(", "),
      image: p.image || "",
      link: p.link || "",
    });
  }, [selectedProductId, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSkinTypeChange = (type) => {
    setFormData((f) => {
      const curr = [...f.skinTypes];
      if (curr.includes(type)) {
        return { ...f, skinTypes: curr.filter((t) => t !== type) };
      }
      let next = [...curr, type];
      if (type === "Всі типи") {
        next = next.filter(
          (t) => !["Нормальна", "Жирна", "Суха", "Комбінована"].includes(t)
        );
      } else if (["Нормальна", "Жирна", "Суха", "Комбінована"].includes(type)) {
        next = next.filter((t) => t !== "Всі типи");
      }
      return { ...f, skinTypes: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...formData,
      effects: formData.effects
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      description: formData.description
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      activeIngredients: formData.activeIngredients
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      image: formData.image?.trim(),
    };
    const url = selectedProductId
      ? `${process.env.REACT_APP_API_BASE_URL}/api/products/${selectedProductId}`
      : `${process.env.REACT_APP_API_BASE_URL}/api/products`;
    const method = selectedProductId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      alert(selectedProductId ? "Продукт оновлено!" : "Продукт додано!");
      setFormData(initialState);
      setSelectedProductId("");
      refreshProducts();
    } catch (err) {
      alert(err.message || "Помилка сервера");
    }
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;
    if (!window.confirm("Точно видалити?")) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/products/${selectedProductId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error();
      alert("Видалено!");
      setSelectedProductId("");
      setFormData(initialState);
      refreshProducts();
    } catch {
      alert("Помилка видалення");
    }
  };

  return (
    <div className="container">
      <div className={styles.admin__tabs}>
        <button
          onClick={() => {
            setIsEditMode(false);
            setSelectedProductId("");
            setFormData(initialState);
          }}
          className={!isEditMode ? styles.active : ""}
        >
          Додати продукт
        </button>
        <button
          onClick={() => setIsEditMode(true)}
          className={isEditMode ? styles.active : ""}
        >
          Редагувати продукт
        </button>
      </div>

      <form className={styles.admin__form} onSubmit={handleSubmit}>
        <h2>{isEditMode ? "Редагувати продукт" : "Додати новий продукт"}</h2>

        {isEditMode && (
          <div className={styles.admin__select}>
            <Dropdown
              options={products.map((p) => ({ value: p.id, label: p.name }))}
              value={selectedProductId}
              onChange={setSelectedProductId}
              placeholder="Оберіть продукт для редагування"
            />
          </div>
        )}

        <input
          name="name"
          placeholder="Назва продукту"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="brand"
          placeholder="Бренд"
          value={formData.brand}
          onChange={handleChange}
          required
        />
        <input
          name="volume"
          placeholder="Обʼєм"
          value={formData.volume}
          onChange={handleChange}
          required
        />

        <div className={styles.admin__select}>
          <Dropdown
            options={AGE_OPTIONS.map((a) => ({ value: a, label: a }))}
            value={formData.age}
            onChange={(age) => setFormData((f) => ({ ...f, age }))}
            placeholder="Виберіть вік"
          />
        </div>

        <div className={styles.admin__skin}>
          <h6>Типи шкіри:</h6>
          <div>
            {SKIN_TYPES.map((t) => (
              <label key={t}>
                <input
                  type="checkbox"
                  checked={formData.skinTypes.includes(t)}
                  onChange={() => handleSkinTypeChange(t)}
                />{" "}
                {t}
              </label>
            ))}
          </div>
        </div>

        <input
          name="effects"
          placeholder="Ефекти (через кому)"
          value={formData.effects}
          onChange={handleChange}
          required
        />
        <textarea
          name="composition"
          placeholder="Склад (через кому)"
          value={formData.composition}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Опис (новий рядок—новий абзац)"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="activeIngredients"
          placeholder="Активні інгредієнти (через кому)"
          value={formData.activeIngredients}
          onChange={handleChange}
          required
        />
        <input
          name="image"
          placeholder="Посилання на зображення"
          value={formData.image}
          onChange={handleChange}
          required
        />
        <input
          name="link"
          placeholder="Посилання на продукт"
          value={formData.link}
          onChange={handleChange}
          required
        />

        <button type="submit">{isEditMode ? "Зберегти" : "Додати"}</button>
        {isEditMode && selectedProductId && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDelete}
          >
            Видалити
          </button>
        )}
      </form>
    </div>
  );
};

export default AddProductForm;
