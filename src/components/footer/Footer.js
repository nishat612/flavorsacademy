import React from 'react';
import './Footer.css';

// Footer component for displaying website footer links
function Footer() {
  return (
    <footer className="App-footer">
      <ul>
        {/* Navigation links in the footer */}
        <li><a href="#contact">Contact</a></li> {/* Link to contact section */}
        <li><a href="#news">News</a></li> {/* Link to news section */}
        <li><a href="#media">Media Resources</a></li> {/* Link to media resources section */}
        <li><a href="#privacy">Privacy Policy</a></li> {/* Link to privacy policy section */}
      </ul>
    </footer>
  );
}

export default Footer;
