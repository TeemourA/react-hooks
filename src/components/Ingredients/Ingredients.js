import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(
        ingredient => ingredient.id !== action.id
      );
    default:
      return currentIngredients;
  }
};

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientsReducer, []);
  const {
    isLoading,
    sendRequest,
    error,
    data,
    reqExtra,
    reqIdentifier,
    clear,
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredIngredientsHandler = useCallback(
    filteredIngredients =>
      dispatch({ type: 'SET', ingredients: filteredIngredients }),
    []
  );

  const addIngredientHandler = useCallback(
    ingredient => {
      sendRequest(
        'https://react-hooks-update-e4483-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'ADD_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const removeIngredient = useCallback(
    id => {
      sendRequest(
        `https://react-hooks-update-e4483-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${id}.json`,
        'DELETE',
        null,
        id,
        'REMOVE_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const ingredientList = useMemo(
    () => (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredient}
      />
    ),
    [ingredients, removeIngredient]
  );

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
