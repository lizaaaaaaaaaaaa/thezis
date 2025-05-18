import React from "react";
import ProductsItem from "./../../../../products/ProductsList/filters/ProductsItem/ProductsItem";

const FavoritesList = ({ items }) => {
    
  return (
    <ul>
      {items.map((product, index) => (
        <ProductsItem product={product} key={index} />
      ))}
    </ul>
  );
};

export default FavoritesList;
