import React, { useEffect } from 'react';
import './Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/apiService';

function Header({ role, setRole, setFirstName, setUserId }) {
  const navigate = useNavigate();

  // Retrieve the role from localStorage on component mount
  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole) {
      setRole(savedRole); // Set the role if it exists in localStorage
    }
  }, [setRole]);

  const handleLogout = async () => {
    // Call the API to clear the session on the backend
    await logout();
    
    // Clear user data in the app state and localStorage
    setRole(null);
    setFirstName('');
    setUserId(null);
    localStorage.removeItem('role'); // Clear role from localStorage

    // Redirect to login page
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (role === 'teacher') {
      navigate('/teacherDashboard');
    } else if (role === 'student') {
      navigate('/studentDashboard');
    } else {
      navigate('/');
    }
  };

  // Save the role to localStorage whenever it changes
  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    }
  }, [role]);

  return (
    <header className="App-header">
      <nav className="nav-left">
        <div className="logo-link" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <h2 className="logo"><i className="fas fa-utensils logo-icon"></i> Flavors Academy</h2>
        </div>
      </nav>
      <nav className="nav-right">
        <ul>
          {role === 'teacher' ? (
            <>
              <li><Link to="/course">Your Courses</Link></li>
              <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
            </>
          ) : role === 'student' ? (
            <>
              <li><Link to="/studentCourses">Your Courses</Link></li>
              <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign up</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
