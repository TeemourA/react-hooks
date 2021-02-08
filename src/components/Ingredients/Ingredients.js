import React, { useEffect, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

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

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...httpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...httpState, error: null };
    default:
      return httpState;
  }
};

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
  // const [ingredients, setIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

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
    filteredIngredients =>
      dispatch({ type: 'SET', ingredients: filteredIngredients }),
    []
  );

  const addIngredientHandler = ingredient => {
    dispatchHttp({ type: 'SEND' });
    fetch(
      'https://react-hooks-update-e4483-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' },
      }
    )
      .then(response => {
        dispatchHttp({ type: 'RESPONSE' });
        return response.json();
      })
      .then(responseData => {
        console.log(responseData);
        // setIngredients(prevIngredients => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient },
        // ]);
        dispatch({
          type: 'ADD',
          ingredient: { id: responseData.name, ...ingredient },
        });
      });
  };

  const removeIngredient = id => {
    dispatchHttp({ type: 'SEND' });
    fetch(
      `https://react-hooks-update-e4483-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${id}.json`,
      {
        method: 'DELETE',
      }
    )
      .then(response => {
        dispatchHttp({ type: 'RESPONSE' });
        // setIngredients(prevIngredients =>
        //   prevIngredients.filter(ingredient => ingredient.id !== id)
        // );
        dispatch({ type: 'DELETE', id });
      })
      .catch(e => {
        dispatchHttp({
          type: 'ERROR',
          errorMessage: `Something went wrong: s${e.message}`,
        });
      });
  };

  const clearError = () => dispatchHttp({ type: 'CLEAR' });

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

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
