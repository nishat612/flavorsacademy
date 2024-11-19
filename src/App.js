import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import AppRoutes from './Routes';
import { getUserInfo } from './services/apiService';

function App() {
  // State variables for user details and login status
  const [role, setRole] = useState(null); // Stores user role (e.g., student or teacher)
  const [firstName, setFirstName] = useState(''); // Stores user's first name
  const [userId, setUserId] = useState(null); // Stores unique user ID
  const [teacherId, setTeacherId] = useState(null); // Stores teacher-specific ID, if applicable
  const [loggedIn, setLoggedIn] = useState(false); // Tracks whether the user is logged in

  // Function to handle login, storing user data in both state and localStorage
  const handleLogin = ({ user_id, role, first_name }) => {
    setUserId(user_id);
    setRole(role);
    setFirstName(first_name);

    // Persist user data in localStorage for session continuity
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('role', role);
    localStorage.setItem('first_name', first_name);
  };

  // Function to handle logout by clearing user data from state and localStorage
  const handleLogout = () => {
    setUserId(null);
    setRole(null);
    setFirstName('');
    localStorage.removeItem('user_id'); // Clear user ID from storage
    localStorage.removeItem('role'); // Clear role from storage
    localStorage.removeItem('first_name'); // Clear first name from storage
  };

  // Effect to load user data from localStorage on initial component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUserInfo(); // Fetch user info from API
      if (response.user_id) {
        // If user data is available, update state accordingly
        setUserId(response.user_id);
        setRole(response.role);
        setFirstName(response.first_name);
        setLoggedIn(true); // Mark user as logged in
      } else {
        // If no user data, clear state and mark as logged out
        setUserId(null);
        setRole(null);
        setFirstName('');
        setLoggedIn(false);
      }
    };

    fetchUserData(); // Call fetch function on component load
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Render Header with props for role and logout functionality */}
        <Header 
          role={role} 
          setRole={setRole} 
          setFirstName={setFirstName} 
          setUserId={setUserId} 
          onLogout={handleLogout} 
        />
        
        {/* Render AppRoutes, passing in user-related props and login handler */}
        <AppRoutes 
          onLogin={handleLogin} // Login handler to update state on login
          setRole={setRole} 
          setFirstName={setFirstName} 
          firstName={firstName} 
          setUserId={setUserId} 
          userId={userId} 
          teacherId={teacherId} 
        />
        
        {/* Render Footer component */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
