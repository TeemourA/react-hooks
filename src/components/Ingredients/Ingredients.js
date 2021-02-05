import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => console.log('Ingredients component rendered'));

  // useEffect(() => {
  //   fetch(
  //     'https://react-hooks-update-e4483-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json'
  //   )
  //     .then(response => response.json())
  //     .then(responseData => {
  //       const loadedIngredients = Object.entries(responseData).map(
  //         ([id, ingredient]) => ({
  //           id,
  //           title: ingredient.title,
  //           amount: ingredient.amount,
  //         })
  //       );

  //       setIngredients(loadedIngredients);
  //     });
  // }, []);

  const filteredIngredientsHandler = useCallback(
    filteredIngredients => setIngredients(filteredIngredients),
    []
  );

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

  const removeIngredient = id => {
    fetch(
      `https://react-hooks-update-e4483-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${id}.json`,
      {
        method: 'DELETE',
      }
    ).then(response =>
      setIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== id)
      )
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredient}
        />
      </section>
    </div>
  );
};

export default Ingredients;
