import React from 'react';

// Functional component for the Teacher Dashboard
function TeacherDashboard({ firstName }) {
  return (
    <div className="dashboard-container">
      {/* Display a personalized welcome message with the teacher's first name */}
      <h1>Welcome, {firstName}!</h1>
      
      {/* Description text explaining the dashboard's purpose */}
      <p>This is your dashboard where you can manage your courses, upload quizzes, and more.</p>
      
      {/* Placeholder for additional dashboard content */}
    </div>
  );
}

export default TeacherDashboard;
