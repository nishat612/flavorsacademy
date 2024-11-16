import React from 'react';

function TeacherDashboard({ firstName }) {
  return (
    <div className="dashboard-container">
      <h1>Welcome, {firstName}!</h1>
      <p>This is your dashboard where you can manage your courses, upload quizzes, and more.</p>
      {/* Additional dashboard content */}
    </div>
  );
}

export default TeacherDashboard;