import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

// === фіксація лише "зламаних" слів ===

const fixWordIfCyrillicLike = (word = "") => {
  const onlyLatin = /^[a-zA-Z0-9\.\-]+$/;
  if (onlyLatin.test(word)) return word;

  return word
    .replace(/a/g, "а")
    .replace(/e/g, "е")
    .replace(/o/g, "о")
    .replace(/p/g, "р")
    .replace(/c/g, "с")
    .replace(/x/g, "х")
    .replace(/y/g, "у")
    .replace(/i/g, "і")
    .replace(/A/g, "А")
    .replace(/E/g, "Е")
    .replace(/O/g, "О")
    .replace(/P/g, "Р")
    .replace(/C/g, "С")
    .replace(/X/g, "Х")
    .replace(/Y/g, "У")
    .replace(/I/g, "І");
};

const fixBrokenLettersSmart = (str = "") =>
  str
    .split(" ")
    .map(fixWordIfCyrillicLike)
    .join(" ")
    .replace(/\u00AD/g, "") // приховані символи
    .trim();

export const DataProvider = ({ children }) => {
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  const [isIngredientsLoaded, setIsIngredientsLoaded] = useState(false);
  const [isProductsLoaded, setIsProductsLoaded] = useState(false);

  const fetchIngredients = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/ingredients`
      );
      const data = await res.json();
      setIngredients(data);
      setIsIngredientsLoaded(true);
    } catch (e) {
      console.error("Помилка при завантаженні інгредієнтів", e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/products`
      );
      const data = await res.json();

      const fixed = data.map((p) => ({
        ...p,
        name: fixBrokenLettersSmart(p.name),
        description: p.description?.map?.(fixBrokenLettersSmart),
      }));

      setProducts(fixed);
      setIsProductsLoaded(true);
    } catch (e) {
      console.error("Помилка при завантаженні продуктів", e);
    }
  };

  useEffect(() => {
    fetchIngredients();
    fetchProducts();
  }, []);

  return (
    <DataContext.Provider
      value={{
        ingredients,
        isIngredientsLoaded,
        products,
        isProductsLoaded,
        refreshIngredients: fetchIngredients,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
