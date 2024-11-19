import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AboutUs from './components/aboutUs/AboutUs';
import Courses from './components/courses/Courses';
import Login from './components/login/Login';
import ForgotPassword from './components/login/ForgotPassword';
import SignUp from './components/signUp/Signup';
import CourseContent from './components/teacher/courseContent/CourseContent';
import Course from './components/teacher/course/Course';
import TeacherDashboard from './components/teacher/dashboard/TeacherDashboard';
import StudentDashboard from './components/student/dashboard/StudentDashboard';
import EnrollPage from './components/student/enroll/EnrollPage';
import UploadCourse from './components/teacher/uploadCourse/UploadCourse';
import UploadQuiz from './components/teacher/uploadQuiz/UploadQuiz';
import UploadVideo from './components/teacher/uploadVideo/UploadVideo';

const AppRoutes = ({ setRole, setFirstName, firstName,  setUserId, userId, teacherId }) => {
  return (
    <Routes>
      <Route path="/" element={<h1>Welcome To Flavors Academy!</h1>} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/login" element={<Login setRole={setRole} setFirstName={setFirstName} setUserId={setUserId} />} /> {/* Pass setRole here */}
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/course" element={<Course userId={userId} teacherId={teacherId}/>} />
      <Route path="/teacherDashboard" element={<TeacherDashboard firstName={firstName} />} />
      <Route path="/studentDashboard" element={<StudentDashboard firstName={firstName} studentId={userId} />} /> 
      <Route path="/enrollPage/:courseId" element={<EnrollPage />} /> 
      <Route path="/uploadCourse" element={<UploadCourse />} />
      <Route path="/uploadQuiz" element={<UploadQuiz />} />
      <Route path="/uploadVideo" element={<UploadVideo />} />
      <Route path="/courseContent" element={<CourseContent />} />
    </Routes>
  );
};

export default AppRoutes;
