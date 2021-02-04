import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => console.log('comp rendered'));

  useEffect(() => {
    fetch(
      'https://react-hooks-update-e4483-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json'
    )
      .then(response => response.json())
      .then(responseData => {
        const loadedIngredients = Object.entries(responseData).map(
          ([id, ingredient]) => ({
            id,
            title: ingredient.title,
            amount: ingredient.amount,
          })
        );

        setIngredients(loadedIngredients);
      });
  }, []);

  const addIngredientHandler = ingredient => {
    fetch(
      'https://react-hooks-update-e4483-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' },
      }
    )
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);
        setIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  const removeIngredient = id =>
    setIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== id)
    );

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredient}
        />
      </section>
    </div>
  );
};

export default Ingredients;
