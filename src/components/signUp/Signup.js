import React, { useState } from 'react';
import './Signup.css';
import { signup } from '../../services/apiService';

// Signup component for registering students or teachers
function Signup() {
  // State variables for managing user input and form validation
  const [isStudent, setIsStudent] = useState(true); // Toggle between student and teacher signup
  const [email, setEmail] = useState(''); // Stores email input
  const [password, setPassword] = useState(''); // Stores password input
  const [confirmPassword, setConfirmPassword] = useState(''); // Stores confirm password input
  const [emailError, setEmailError] = useState(''); // Stores email validation error message
  const [passwordError, setPasswordError] = useState(''); // Stores password validation error message
  const [firstName, setFirstName] = useState(''); // Stores first name input
  const [lastName, setLastName] = useState(''); // Stores last name input
  const [showToast, setShowToast] = useState(false); // Controls the display of the success toast

  // Toggle to student signup and reset form fields
  const handleStudentClick = () => {
    setIsStudent(true);
    resetForm();
  };

  // Toggle to teacher signup and reset form fields
  const handleTeacherClick = () => {
    setIsStudent(false);
    resetForm();
  };

  // Reset form fields and error messages
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setPasswordError('');
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change and clear error message if it exists
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  // Handle password input change and clear password error message
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  // Handle confirm password input change and validate password match
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  // Handle form submission and validate inputs
  const handleSubmit = async (e) => {
    console.log("inside submit")
    e.preventDefault(); // Prevent form from refreshing the page

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Prepare user data based on inputs
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role: isStudent ? 'student' : 'teacher' // Assign role based on selected signup type
    };

    console.log("user data", userData)

    // Call signup API with user data
    const response = await signup(userData);
    if (response.message === "Signup successful") {
      setShowToast(true); // Show success toast if signup is successful
      setTimeout(() => setShowToast(false), 5000); // Hide toast after 5 seconds
      resetForm(); // Reset form after successful signup
    } else {
      console.error("Signup failed:", response.message); // Log error if signup fails
    }
  };

  // Close the success toast
  const closeToast = () => setShowToast(false);

  return (
    <div className="signup-container">
      <h1>Signup</h1>

      {/* Toggle buttons to select student or teacher signup */}
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

      {/* Signup form */}
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>{isStudent ? 'Student Signup' : 'Teacher Signup'}</h2>
        
        {/* First Name input field */}
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
        
        {/* Last Name input field */}
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
        
        {/* Email input field with error message display */}
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
        
        {/* Password input field */}
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

        {/* Confirm Password input field with match validation */}
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
        
        {/* Submit button */}
        <div className="button-container">
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </div>
      </form>

      {/* Success toast notification */}
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
