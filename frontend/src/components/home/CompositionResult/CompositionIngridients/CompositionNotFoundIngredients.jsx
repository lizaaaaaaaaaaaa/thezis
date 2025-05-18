import React from "react";

const CompositionNotFoundIngredients = ({notFoundIngredients}) => {
  return (
    <div>
      <h3>Не знайдені інгредієнти:</h3>
      <ul>
        {notFoundIngredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
};

export default CompositionNotFoundIngredients;
