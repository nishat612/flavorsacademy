import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/apiService';

// Login component for user authentication
function Login({ setRole, setFirstName, setUserId }) {
  const [email, setEmail] = useState(''); // Stores email input
  const [password, setPassword] = useState(''); // Stores password input
  const [error, setError] = useState(''); // Stores error messages
  const navigate = useNavigate(); // Hook for navigation

  // Handlers for input changes
  const handleEmailChange = (e) => setEmail(e.target.value); // Update email state
  const handlePasswordChange = (e) => setPassword(e.target.value); // Update password state

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    try {
      // Call login API with email and password
      const response = await login({ email, password });

      if (response.message === "Login successful") {
        // Store user info in localStorage
        localStorage.setItem('user_id', response.user_id);
        localStorage.setItem('role', response.role);
        localStorage.setItem('first_name', response.first_name);
       
        // Store teacherId or studentId in localStorage based on role
        if (response.role === "teacher") {
          localStorage.setItem('teacherId', response.user_id);
        }
        if (response.role === "student") {
          localStorage.setItem('studentId', response.user_id);
        }

        // Update parent component state with user data
        setFirstName(response.first_name); 
        setUserId(response.user_id);
        setRole(response.role);

        // Navigate to appropriate dashboard based on role
        if (response.role === "teacher") {
          navigate('/teacherDashboard'); // Navigate to teacher's dashboard
        } else if (response.role === "student") {
          navigate('/studentDashboard'); // Navigate to student's dashboard
        } else {
          setError("Unknown role"); // Handle case of an unknown role
        }
      } else {
        // Display error message if login is unsuccessful
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      console.error("Login error:", err); // Log any errors during login
      setError('An error occurred during login.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      {/* Login form */}
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input 
            type="email" 
            value={email} 
            onChange={handleEmailChange} 
            required 
            className="form-input" 
          />
        </label>

        <label>
          Password
          <input 
            type="password" 
            value={password} 
            onChange={handlePasswordChange} 
            required 
            className="form-input" 
          />
        </label>

        {/* Submit button */}
        <div className="button-container">
          <button type="submit" className="login-button">Login</button>
        </div>

        {/* Uncomment below for "Forgot Password" link */}
        {/* <p className="forgot-password">
          <Link to="/forgotPassword">Forgot Password?</Link>
        </p> */}
      </form>

      {/* Display error message if there's an error */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;
