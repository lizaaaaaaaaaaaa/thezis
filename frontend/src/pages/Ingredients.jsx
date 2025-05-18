import React from "react";
import { useSearchParams } from "react-router-dom";
import FunctionList from "./../components/ingredients/FunctionList/FunctionList";
import IngredientsList from "../components/ingredients/IngredientsList/IngredientsList";

const IngredientsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedFunction = searchParams.get("function") || "";

  const setSelectedFunction = (func) => {
    setSearchParams({ function: func });
  };

  return (
    <>
      <FunctionList setSelectedFunction={setSelectedFunction} />
      <IngredientsList selectedFunction={selectedFunction} />
    </>
  );
};

export default IngredientsPage;
