import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;

        fetch(
          `https://react-hooks-update-e4483-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json${query}`
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

            onLoadIngredients(loadedIngredients);
          });
      }
      return () => {
        clearTimeout(timer);
      };
    }, 500);
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
