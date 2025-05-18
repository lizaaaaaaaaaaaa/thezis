import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductsSearch from "./filters/ProductsSearch/ProductsSearch";
import ProductsBrandFilter from "./filters/ProductsBrandFilter/ProductsBrandFilter";
import ProductsTypeFilter from "./filters/ProductsTypeFilter/ProductsTypeFilter";
import AllergenTypeFilter from "./filters/AllergensFilter/AllergensFilter";
import styles from "./ProductsList.module.scss";
import Pagination from "./filters/Pagination/Pagination";
import ProductsItem from "./filters/ProductsItem/ProductsItem";
import Loader from "../../UI/Loader/Loader";
import { useData } from "../../../context/DataContext";

const ProductsList = () => {
  const {
    products,
    isProductsLoaded,
    ingredients: allIngredients,
    isIngredientsLoaded,
  } = useData();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [excludedAllergenTypes, setExcludedAllergenTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setProductsPerPage(8);
    }
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const allergens = queryParams.get("allergens");
    if (allergens) {
      setExcludedAllergenTypes(allergens.split(","));
    }

    const page = queryParams.get("page");
    setCurrentPage(page ? Number(page) : 1);
  }, [location.search]);

  useEffect(() => {
    if (
      isProductsLoaded &&
      isIngredientsLoaded &&
      (!products.length || !allIngredients.length)
    ) {
      navigate("/error", {
        state: { message: "Не вдалося завантажити продукти або інгредієнти." },
      });
    }
  }, [
    isProductsLoaded,
    isIngredientsLoaded,
    products,
    allIngredients,
    navigate,
  ]);

  const applyFilters = useCallback(() => {
    const normalize = (val) =>
      typeof val === "string" ? val.trim().toLowerCase() : "";

    const filtered = products.filter((product) => {
      const matchesSearchTerm = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesBrand =
        selectedBrand && selectedBrand !== "Бренд"
          ? product.brand === selectedBrand
          : true;

      const matchesPurpose =
        selectedPurpose && selectedPurpose !== "За призначенням"
          ? product.effects?.some(
              (effect) =>
                normalize(effect) ===
                normalize(selectedPurpose?.value || selectedPurpose)
            )
          : true;

      const compositionIngredients = product.composition
        ?.split(",")
        .map((i) => i.trim().toLowerCase());

      const matchesAllergenExclusion = !compositionIngredients?.some(
        (ingredientName) => {
          const matchedIngredient = allIngredients.find(
            (i) => i.name.toLowerCase() === ingredientName
          );
          return (
            matchedIngredient &&
            excludedAllergenTypes.includes(matchedIngredient.allergenType)
          );
        }
      );

      return (
        matchesSearchTerm &&
        matchesBrand &&
        matchesPurpose &&
        matchesAllergenExclusion
      );
    });

    setFilteredProducts(filtered);
  }, [
    products,
    searchTerm,
    selectedBrand,
    selectedPurpose,
    excludedAllergenTypes,
    allIngredients,
  ]);

  useEffect(() => {
    if (isProductsLoaded && isIngredientsLoaded) {
      applyFilters();
    }
  }, [applyFilters, isProductsLoaded, isIngredientsLoaded]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", "1");

    if (excludedAllergenTypes.length > 0) {
      queryParams.set("allergens", excludedAllergenTypes.join(","));
    } else {
      queryParams.delete("allergens");
    }

    navigate(`?${queryParams.toString()}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludedAllergenTypes]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", "1");
    navigate(`?${queryParams.toString()}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand, selectedPurpose, searchTerm]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", newPage);
    navigate(`?${queryParams.toString()}`);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <section className={`container ${styles.products}`}>
      <div className={styles.products__filters}>
        <ProductsSearch setSearchTerm={setSearchTerm} />
        <div>
          <ProductsBrandFilter
            setSelectedBrand={setSelectedBrand}
            products={products}
          />
          <ProductsTypeFilter
            setSelectedPurpose={setSelectedPurpose}
            products={products}
          />
        </div>
      </div>

      <AllergenTypeFilter
        excludedTypes={excludedAllergenTypes}
        setExcludedTypes={setExcludedAllergenTypes}
      />

      {!isProductsLoaded || !isIngredientsLoaded ? (
        <Loader />
      ) : (
        <>
          <ul className={styles.products__list}>
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <ProductsItem product={product} key={index} />
              ))
            ) : (
              <div>Продукти не знайдені</div>
            )}
          </ul>

          <Pagination
            currentPage={currentPage}
            totalProducts={filteredProducts.length}
            productsPerPage={productsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
};

export default ProductsList;
