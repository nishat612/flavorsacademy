import React, { useState } from 'react';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(''); // Clear error message as user starts typing
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Logic for sending recovery email
    console.log('Recovery email sent to:', email);
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password?</h1>
      <p>Enter your email address, and we will send you a recovery link.</p>

      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input 
            type="email" 
            value={email} 
            onChange={handleEmailChange} 
            required 
            className="form-input" 
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </label>

        <div className="button-container">
          <button type="submit" className="recovery-button">Send Recovery Email</button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
