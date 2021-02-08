import React, { useContext } from 'react';
import { AuthContext } from './context/auth-context';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';

const App = props => {
  const authContext = useContext(AuthContext);

  let app = <Auth />;
  if (authContext.isAuth) {
    app = <Ingredients />;
  }

  return app;
};

export default App;
