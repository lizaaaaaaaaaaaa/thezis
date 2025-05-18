import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FavoritesList from "./FavoritesList/FavoritesList";
import styles from "./Favorites.module.scss";
import Pagination from "./../../../products/ProductsList/filters/Pagination/Pagination";
import Loader from "../../../UI/Loader/Loader";

const Favorites = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const itemsPerPage = 6;

  const [currentPage, setCurrentPage] = useState(pageParam);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userData?.favorites?.length) {
        setFavorites([]);
        setIsLoading(false);
        return;
      }

      try {
        const productPromises = userData.favorites.map((id) =>
          fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`
          ).then((res) => {
            if (!res.ok) throw new Error("Продукт не знайдено");
            return res.json();
          })
        );

        const products = await Promise.all(productPromises);
        setFavorites(products);
      } catch (error) {
        navigate("/error", {
          state: { message: "Не вдалося завантажити улюблені продукти." },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [userData?.favorites, navigate]);

  useEffect(() => {
    setSearchParams({ view: "favorites", page: currentPage });
  }, [currentPage, setSearchParams]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = favorites.slice(indexOfFirst, indexOfLast);

  if (isLoading) return <Loader />;

  if (!favorites.length) return <p>У вас ще немає улюблених продуктів</p>;

  return (
    <section className={`container ${styles.profile__favorites}`}>
      <h1>Улюблені продукти</h1>

      <FavoritesList items={currentItems} />

      <Pagination
        currentPage={currentPage}
        totalProducts={favorites.length}
        productsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default Favorites;
