import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const login = (email, password) => {
    // Simulate auth — in real app, call backend
    const stored = JSON.parse(localStorage.getItem('mediascan_users') || '[]');
    const found = stored.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safe } = found;
      setUser(safe);
      const history = JSON.parse(localStorage.getItem(`history_${safe.id}`) || '[]');
      setScanHistory(history);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (data) => {
    const stored = JSON.parse(localStorage.getItem('mediascan_users') || '[]');
    if (stored.find(u => u.email === data.email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
    localStorage.setItem('mediascan_users', JSON.stringify([...stored, newUser]));
    const { password: _, ...safe } = newUser;
    setUser(safe);
    setScanHistory([]);
    return { success: true };
  };

  const logout = () => { setUser(null); setScanHistory([]); };

  const addScanResult = (result) => {
    const updated = [result, ...scanHistory];
    setScanHistory(updated);
    if (user) localStorage.setItem(`history_${user.id}`, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, scanHistory, addScanResult }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);