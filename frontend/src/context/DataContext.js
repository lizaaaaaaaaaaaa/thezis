import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

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
      setProducts(data);
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
