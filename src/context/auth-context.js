import React, { useState } from 'react';

const AuthContext = React.createContext({
  isAuth: false,
  login: () => {},
});

const AuthContextProvider = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logInHandler = () => {
    setIsAuthenticated(true);
  };
  return (
    <AuthContext.Provider
      value={{ isAuth: isAuthenticated, login: logInHandler }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthContextProvider;
