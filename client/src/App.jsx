import React from 'react';

import { useRoutes } from './routes';
import { Loader } from './components/Loader';
import 'materialize-css';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';
import { Navbar } from './components/Navbar';

function App() {
  const { login, logout, token, userId, ready } = useAuth();
  
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  if (!ready) {
    return <Loader />;
  }
  
  return (
    <AuthContext.Provider value={{ login, logout,token, userId, isAuthenticated }}>
      {isAuthenticated && <Navbar />}
      <div className="container">
        {routes}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
