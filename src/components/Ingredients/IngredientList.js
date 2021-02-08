import React from 'react';

import './IngredientList.css';

const IngredientList = React.memo(props => {
  const { onRemoveItem } = props;
  console.log('[Ingredient list] rendered');
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map(ig => (
          <li key={ig.id} onClick={() => onRemoveItem(ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
});

export default IngredientList;
