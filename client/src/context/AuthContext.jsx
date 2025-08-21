import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, tokenValue) => {
    console.log('Login called with:', { userData, tokenValue }); // Debug
    
    if (!userData || !tokenValue) {
      console.error('Login called with missing data:', { userData, tokenValue });
      return;
    }

    setUser(userData);
    setToken(tokenValue);
    
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', tokenValue);
      
      // Verify the data was stored correctly
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      console.log('Storage verification:', {
        tokenStored: !!storedToken,
        userStored: !!storedUser,
        token: storedToken,
        user: storedUser
      });
    } catch (error) {
      console.error('Error storing auth data:', error);
    }

    console.log('Logged in user:', userData);
    // Redirect to the correct dashboard based on role
    if (userData.role === 'admin') {
      navigate('/admin/verifications');
    } else if (userData.role === 'farmer') {
      navigate('/farm-dashboard');
    } else {
      navigate('/marketplace');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
