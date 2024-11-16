import React, { useState } from 'react';
import './Signup.css';
import { signup } from '../../services/apiService';


function Signup() {
  const [isStudent, setIsStudent] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleStudentClick = () => {
    setIsStudent(true);
    resetForm();
  };

  const handleTeacherClick = () => {
    setIsStudent(false);
    resetForm();
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setPasswordError('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    console.log("inside submit")
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      role: isStudent ? 'student' : 'teacher'
    };

    console.log("user data", userData)

    const response = await signup(userData);
    if (response.message === "Signup successful") {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      resetForm();
    } else {
      console.error("Signup failed:", response.message);
    }
  };

  const closeToast = () => setShowToast(false);

  return (
    <div className="signup-container">
      <h1>Signup</h1>

      <div className="toggle-buttons">
        <button 
          onClick={handleStudentClick} 
          className={`toggle-button ${isStudent ? 'active' : ''}`}
        >
          Sign up as Student
        </button>
        
        <button 
          onClick={handleTeacherClick} 
          className={`toggle-button ${!isStudent ? 'active' : ''}`}
        >
          Sign up as Teacher
        </button>
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>{isStudent ? 'Student Signup' : 'Teacher Signup'}</h2>
        
        <label>
          First Name:
          <input 
            type="text" 
            name="firstName" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} 
            required 
            className="form-input" 
          />
        </label>
        
        <label>
          Last Name:
          <input 
            type="text" 
            name="lastName" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)} 
            required 
            className="form-input" 
          />
        </label>
        
        <label>
          Email:
          <input 
            type="email" 
            name="email" 
            value={email}
            onChange={handleEmailChange}
            required 
            className="form-input" 
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </label>
        
        <label>
          Password:
          <input 
            type="password" 
            name="password" 
            value={password}
            onChange={handlePasswordChange}
            required 
            className="form-input" 
          />
        </label>

        <label>
          Confirm Password:
          <input 
            type="password" 
            name="confirmPassword" 
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required 
            className="form-input" 
          />
          {passwordError && <span className="error-message">{passwordError}</span>}
        </label>
        
        <div className="button-container">
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </div>
      </form>

      {showToast && (
        <div className="toast">
          <button className="close-button" onClick={closeToast}>×</button>
          <p>Signup successful!</p>
        </div>
      )}
    </div>
  );
}

export default Signup;
