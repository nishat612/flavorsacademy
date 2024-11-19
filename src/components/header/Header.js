import React, { useEffect } from 'react';
import './Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/apiService';

// Header component that displays navigation links and handles logout functionality
function Header({ role, setRole, setFirstName, setUserId }) {
  const navigate = useNavigate(); // Hook for navigation

  // Retrieve the user role from localStorage on component mount
  useEffect(() => {
    const savedRole = localStorage.getItem('role'); // Get role from localStorage
    if (savedRole) {
      setRole(savedRole); // Set the role in app state if it exists in localStorage
    }
  }, [setRole]);

  // Handle logout action
  const handleLogout = async () => {
    // Call the logout API to clear the session on the backend
    await logout();
    
    // Clear user data in the app state and remove from localStorage
    setRole(null);
    setFirstName('');
    setUserId(null);
    localStorage.removeItem('role'); // Remove role from localStorage

    // Redirect the user to the login page after logout
    navigate('/login');
  };

  // Handle logo click to navigate based on user role
  const handleLogoClick = () => {
    if (role === 'teacher') {
      navigate('/teacherDashboard'); // Navigate to teacher's dashboard if role is teacher
    } else if (role === 'student') {
      navigate('/studentDashboard'); // Navigate to student's dashboard if role is student
    } else {
      navigate('/'); // Navigate to home page for all other cases
    }
  };

  // Save the user role to localStorage whenever it changes
  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role); // Update role in localStorage if role changes
    }
  }, [role]);

  return (
    <header className="App-header">
      <nav className="nav-left">
        {/* Logo with click handler to navigate based on user role */}
        <div className="logo-link" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <h2 className="logo"><i className="fas fa-utensils logo-icon"></i> Flavors Academy</h2>
        </div>
      </nav>
      <nav className="nav-right">
        <ul>
          {/* Display navigation links based on user role */}
          {role === 'teacher' ? (
            <>
              <li><Link to="/course">Your Courses</Link></li> {/* Link to teacher's courses */}
              <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
            </>
          ) : role === 'student' ? (
            <>
              <li><Link to="/studentCourse">Your Courses</Link></li> {/* Link to student's courses */}
              <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
            </>
          ) : (
            <>
              {/* Links for non-logged-in users */}
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
