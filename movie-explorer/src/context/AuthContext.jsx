import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Provides authentication context to the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('movieExplorerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username) => {
    const userData = { 
      username,
      timestamp: new Date().toISOString() 
    };
    localStorage.setItem('movieExplorerUser', JSON.stringify(userData));
    setUser(userData);
    // Removed navigate
  };

  const logout = () => {
    localStorage.removeItem('movieExplorerUser');
    setUser(null);
    // Removed navigate
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};