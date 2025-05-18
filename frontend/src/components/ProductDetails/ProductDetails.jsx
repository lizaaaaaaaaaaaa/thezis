import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.scss";
import FavoriteButton from "./FavoriteButton/FavoriteButton";
import Loader from "../UI/Loader/Loader";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`
        );
        if (!response.ok) throw new Error("Не вдалося отримати продукт");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Помилка при отриманні даних продукту:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <Loader />;

  if (!product) return <div>Продукт не знайдений</div>;

  return (
    <section className={`container ${styles.product}`}>
      <div className={styles.product__inner}>
        <img src={product.image} alt={product.name} />
        <div className={styles.product__content}>
          <h1>{product.name}</h1>
          <div className={styles.product__top}>
            <p className={styles.product__brand}>{product.brand}</p>
            <p className={styles.product__volume}>{product.volume}</p>
            <p className={styles.product__age}>{product.age}</p>
          </div>

          <FavoriteButton productId={id} />

          <div className={styles.product__skin}>
            <div>Типи шкіри:</div>
            <div>
              {product.skinTypes.map((skinType, index) => (
                <span key={index}>{skinType}</span>
              ))}
            </div>
          </div>

          <ul className={styles.product__effects}>
            {product.effects.map((effect, index) => (
              <li key={index}>{effect}</li>
            ))}
          </ul>

          <div className={styles.product__actives}>
            <div>Активні інгредієнти:</div>
            <p>{product.activeIngredients.join(", ")}</p>
          </div>

          <a
            href={product.link}
            className={styles.product__link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Переглянути на сайті
          </a>
        </div>
      </div>

      <ul className={styles.product__descr}>
        {product.description.map((desc, index) => (
          <li key={index}>{desc}</li>
        ))}
      </ul>
    </section>
  );
};

export default ProductDetails;
