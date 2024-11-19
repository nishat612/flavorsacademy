import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components for various pages and functionalities
import AboutUs from './components/aboutUs/AboutUs';
import Courses from './components/courses/Courses';
import Login from './components/login/Login';
import SignUp from './components/signUp/Signup';
import CourseContent from './components/teacher/courseContent/CourseContent';
import StudentCourseContent from './components/student/courseContent/StudentCourseContent';
import StudentCourse from './components/student/studentCourse/StudentCourse';
import Course from './components/teacher/course/Course';
import TeacherDashboard from './components/teacher/dashboard/TeacherDashboard';
import StudentDashboard from './components/student/dashboard/StudentDashboard';
import EnrollPage from './components/student/enroll/EnrollPage';


// Main component for defining application routes
const AppRoutes = ({ setRole, setFirstName, firstName, setUserId, userId, teacherId }) => {
  return (
    <Routes>
      {/* Route for the home page */}
      <Route path="/" element={<h1>Welcome To Flavors Academy!</h1>} />

      {/* Route for the About Us page */}
      <Route path="/about" element={<AboutUs />} />

      {/* Route for the Courses page */}
      <Route path="/courses" element={<Courses />} />

      {/* Route for the Login page, passing props to set user role, name, and ID */}
      <Route 
        path="/login" 
        element={<Login setRole={setRole} setFirstName={setFirstName} setUserId={setUserId} />} 
      />


      {/* Route for the Signup page */}
      <Route path="/signup" element={<SignUp />} />

      {/* Route for the Teacher's Course page, passing user and teacher IDs as props */}
      <Route path="/course" element={<Course userId={userId} teacherId={teacherId} />} />

      {/* Route for the Teacher Dashboard, displaying the teacher's first name */}
      <Route path="/teacherDashboard" element={<TeacherDashboard firstName={firstName} />} />

      {/* Route for the Student Dashboard, displaying the student's first name and ID */}
      <Route 
        path="/studentDashboard" 
        element={<StudentDashboard firstName={firstName} studentId={userId} />} 
      />

      {/* Route for the Course Enrollment page, with course ID as a URL parameter */}
      <Route path="/enrollPage/:courseId" element={<EnrollPage />} />



      {/* Route for the Course Content page (for teachers) */}
      <Route path="/courseContent" element={<CourseContent />} />

      {/* Route for viewing course content, specific to students, with course ID parameter */}
      <Route path="/studentCourseContent/:courseId" element={<StudentCourseContent />} />

      {/* Route for the Student's enrolled courses page */}
      <Route path="/studentCourse" element={<StudentCourse />} />
    </Routes>
  );
};

// Export the AppRoutes component to be used in the main app
export default AppRoutes;
