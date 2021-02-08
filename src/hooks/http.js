import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  indetifier: null,
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case 'RESPONSE':
      return {
        ...httpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;
    default:
      return httpState;
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
      fetch(url, {
        method,
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          return response.json();
        })
        .then(responseData =>
          dispatchHttp({ type: 'RESPONSE', responseData, extra: reqExtra })
        )
        .catch(e => {
          dispatchHttp({
            type: 'ERROR',
            errorMessage: `Something went wrong: s${e.message}`,
          });
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear,
    sendRequest,
  };
};

export default useHttp;
