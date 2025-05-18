import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FavoriteButton.module.scss";

const FavoriteButton = ({ productId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState(() =>
    JSON.parse(localStorage.getItem("userData"))
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.favorites?.includes(productId)) {
      setIsFavorite(true);
    }
  }, [productId, userData]);

  const toggleFavorite = async () => {
    if (!userData) {
      alert("Увійдіть в акаунт, щоб додавати до обраного");
      return;
    }

    const updatedFavorites = isFavorite
      ? userData.favorites.filter((id) => id !== productId)
      : [...(userData.favorites || []), productId];

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites: updatedFavorites }),
      });
      if (res.ok) {
        const updatedUser = { ...userData, favorites: updatedFavorites };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setIsFavorite(!isFavorite);
      } else {
        navigate("/error", {
          state: {
            message: "Не вдалося оновити список обраного. Спробуйте пізніше.",
          },
        });
      }
    } catch (err) {
      console.error("Помилка при оновленні обраного:", err);
      navigate("/error", {
        state: { message: "Помилка з'єднання з сервером: " + err.message },
      });
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`${styles.product__favorite} ${
        isFavorite
          ? styles["product__favorite-is"]
          : styles["product__favorite-not"]
      }`}
    >
      {isFavorite ? "Видалити з обраного" : "Додати до обраного"}
    </button>
  );
};

export default FavoriteButton;
