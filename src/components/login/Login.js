import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/apiService';

function Login({ setRole, setFirstName, setUserId }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ email, password });
      if (response.message === "Login successful") {
        // Store user info in localStorage
        localStorage.setItem('user_id', response.user_id);
        localStorage.setItem('role', response.role);
        localStorage.setItem('first_name', response.first_name);

         // Store teacherId explicitly if the role is teacher
      if (response.role === "teacher") {
        localStorage.setItem('teacherId', response.user_id);
      }

        // Set user data in state
        setFirstName(response.first_name); 
        setUserId(response.user_id);
        setRole(response.role);

        // Navigate based on role
        if (response.role === "teacher") {
          navigate('/teacherDashboard'); // Navigate to teacher's dashboard
        } else if (response.role === "student") {
          navigate('/student/dashboard'); // Navigate to student's dashboard
        } else {
          setError("Unknown role");
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('An error occurred during login.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
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

        <div className="button-container">
          <button type="submit" className="login-button">Login</button>
        </div>

        <p className="forgot-password">
          <Link to="/forgotPassword">Forgot Password?</Link>
        </p>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;
