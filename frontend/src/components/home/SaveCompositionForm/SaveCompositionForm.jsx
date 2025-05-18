import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SaveCompositionForm.module.scss";

const SaveCompositionForm = ({ ingredients, onSuccess, setSuccessMessage }) => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Назва обов'язкова");
      return;
    }

    const newComposition = {
      id: crypto.randomUUID(),
      name,
      brand,
      description,
      ingredients,
    };

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newComposition }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Склад збережено успішно!");

        const userData = JSON.parse(localStorage.getItem("userData")) || {};
        const updatedCompositions = [
          ...(userData.savedCompositions || []),
          newComposition,
        ];
        const updatedUser = {
          ...userData,
          savedCompositions: updatedCompositions,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUser));

        setName("");
        setBrand("");
        setDescription("");
        setError("");
        onSuccess();

        setTimeout(() => {
          setSuccessMessage("");
          onSuccess();
        }, 3000);
      } else {
        setError(data.error || "Помилка збереження");
      }
    } catch (err) {
      navigate("/error", {
        state: {
          reason: err.message || "Виникла помилка при збереженні складу.",
        },
      });
    }
  };

  return (
    <div className={styles["composition__form-save"]}>
      <h3>Заповніть дані для збереження складу</h3>
      <form className={styles["form-save"]} onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Введіть назву складу..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Введіть бренд складу..."
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <textarea
          placeholder="Опишіть ваш склад..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">Зберегти</button>
      </form>
    </div>
  );
};

export default SaveCompositionForm;
