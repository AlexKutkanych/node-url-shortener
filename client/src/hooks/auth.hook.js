import { useState, useCallback, useEffect } from "react";

const storageName = 'userData';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);

    localStorage.setItem(storageName, JSON.stringify({ userId: id, token: jwtToken }))
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);

    localStorage.removeItem(storageName)
  }, []);

  useEffect(() => {
    const { userId, token } = JSON.parse(localStorage.getItem(storageName)) || {};

    if (token) {
      login(token, userId)
    }

    setReady(true);
  }, [login]);
  
 return { userId, token, login, logout, ready };
};