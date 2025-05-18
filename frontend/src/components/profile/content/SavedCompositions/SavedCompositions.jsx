import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompositionsList from "./SavedCompositionsList/SavedCompositionsList";
import styles from "./SavedCompositions.module.scss";

const SavedCompositions = () => {
  const [compositions, setCompositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("userData"));
      if (currentUser?.savedCompositions?.length) {
        setCompositions(currentUser.savedCompositions);
      } else {
        setCompositions([]);
      }
    } catch (err) {
      navigate("/error", {
        state: { message: "Не вдалося завантажити збережені склади." },
      });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleDelete = async (idToDelete) => {
    const updated = compositions.filter((comp) => comp.id !== idToDelete);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ savedCompositions: updated }),
        }
      );

      if (!res.ok) {
        throw new Error("Помилка оновлення даних користувача");
      }

      const currentUser = JSON.parse(localStorage.getItem("userData")) || {};
      const updatedUser = { ...currentUser, savedCompositions: updated };

      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setCompositions(updated);
    } catch (error) {
      navigate("/error", {
        state: { message: "Не вдалося видалити склад." },
      });
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (!compositions.length) return <p>У вас ще немає збережених складів</p>;

  return (
    <div className={styles.profile__compositions}>
      <h1>Збережені склади</h1>
      <CompositionsList compositions={compositions} onDelete={handleDelete} />
    </div>
  );
};

export default SavedCompositions;
