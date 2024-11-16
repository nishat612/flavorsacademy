import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import AppRoutes from './Routes';
import { getUserInfo } from './services/apiService';
function App() {
  const [role, setRole] = useState(null);
  const [firstName, setFirstName] = useState(''); // State for user's first name
  const [userId, setUserId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false); 
  // Function to handle login and store data in state and localStorage
  const handleLogin = ({ user_id, role, first_name }) => {
    setUserId(user_id);
    setRole(role);
    setFirstName(first_name);

    // Store user information in localStorage for persistence
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('role', role);
    localStorage.setItem('first_name', first_name);
  };

  // Function to clear user data on logout
  const handleLogout = () => {
    setUserId(null);
    setRole(null);
    setFirstName('');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    localStorage.removeItem('first_name');
  };

  // Load user data from localStorage on initial load
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUserInfo();
      if (response.user_id) {
        setUserId(response.user_id);
        setRole(response.role);
        setFirstName(response.first_name);
        setLoggedIn(true); // Set as logged in if we have user data
      } else {
        setUserId(null);
        setRole(null);
        setFirstName('');
        setLoggedIn(false); // Set as logged out if no user data
      }
    };

    fetchUserData();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header 
          role={role} 
          setRole={setRole} 
          setFirstName={setFirstName} 
          setUserId={setUserId} 
          onLogout={handleLogout}
        />
        <AppRoutes 
          onLogin={handleLogin}
          setRole={setRole} 
          setFirstName={setFirstName} 
          firstName={firstName} 
          setUserId={setUserId} 
          userId={userId} 
          teacherId={teacherId}
        />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
