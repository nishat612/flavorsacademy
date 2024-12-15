import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCourseContent, enrollInCourse } from '../../../services/apiService';
import './EnrollPage.css';

// Component for course enrollment page, displaying course info and handling enrollment
function EnrollPage() {
  const location = useLocation(); // Access the location state for course details
  const navigate = useNavigate(); // Hook for navigation
  // Extract course and instructor details from location state
  const { courseId, studentId, teacherId, courseName, teacherFirstName, teacherLastName, teacherEmail } = location.state || {};
  
  // State variables for storing course syllabus and description content
  const [syllabusContent, setSyllabusContent] = useState(null);
  const [descriptionContent, setDescriptionContent] = useState(null);
  // State variables to control success and failure toast notifications
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);

  // Fetch course content on component mount or when courseId/teacherId changes
  useEffect(() => {
    if (courseId && teacherId) {
      const fetchContent = async () => {
        try {
          // Fetch syllabus content for the course
          const syllabusResponse = await getCourseContent(courseId, teacherId, 'syllabus');
          setSyllabusContent(syllabusResponse.content);

          // Fetch course description content
          const descriptionResponse = await getCourseContent(courseId, teacherId, 'course description');
          setDescriptionContent(descriptionResponse.content);
        } catch (error) {
          console.error('Error fetching course content:', error);
        }
      };
      fetchContent(); // Invoke the content fetch function
    } else {
      console.error('Course ID or Teacher ID is missing');
    }
  }, [courseId, teacherId]);

  // Handle course enrollment when "Enroll" button is clicked
  const handleEnroll = async () => {
    try {
      const response = await enrollInCourse(courseId, studentId); // API call to enroll student
      if (response.message === "Student enrolled successfully") {
        // Show success toast if enrollment is successful
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000); // Hide toast after 5 seconds
        // Navigate to course content page after successful enrollment
        navigate(`/studentCourseContent/${courseId}`, { state: { courseId, teacherId, courseName } });
      } else if (response.message === "Student already enrolled") {
        console.log("student already enrolled")
        // Show failure toast if student is already enrolled
        setShowFailureToast(true);
        setTimeout(() => setShowFailureToast(false), 5000);
      } else {
        // Show generic failure toast for other errors
        setShowFailureToast(true);
        setTimeout(() => setShowFailureToast(false), 5000);
        console.error("Enrollment failed:", response.message);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      setShowFailureToast(true); // Show failure toast if enrollment API call fails
      setTimeout(() => setShowFailureToast(false), 5000);
    }
  };

  return (
    <div className="enroll-page">
      <h1 className="course-title">{courseName}</h1>

      {/* Display instructor information */}
      <div className="instructor-info">
        <h2>Instructor Information</h2>
        <p><strong>Teacher:</strong> {teacherFirstName} {teacherLastName}</p>
        <p><strong>Email:</strong> {teacherEmail}</p>
      </div>

      {/* Display course description */}
      <div className="course-description">
        <h2>Course Description</h2>
        {descriptionContent ? (
          <p>{descriptionContent.text}</p> // Show description if available
        ) : (
          <p>Loading description...</p> // Show loading message if description is not yet available
        )}
      </div>

      {/* Display course syllabus link */}
      <div className="course-syllabus">
        <h2>Course Syllabus</h2>
        {syllabusContent ? (
          syllabusContent.text ? (
            // Display syllabus link if available
            <a href={syllabusContent.text} target="_blank" rel="noopener noreferrer">
              View Syllabus
            </a>
          ) : (
            <p>No syllabus available.</p> // Show message if syllabus is not available
          )
        ) : (
          <p>Loading syllabus...</p> // Show loading message if syllabus is not yet available
        )}
      </div>

      {/* Enroll button */}
      <div><button onClick={handleEnroll} className="enroll-button">Enroll</button></div>

      {/* Success toast for successful enrollment */}
      {showSuccessToast && (
        <div className="toast toast-success">
          <button className="close-button" onClick={() => setShowSuccessToast(false)}>×</button>
          <p>Successfully Enrolled!</p>
        </div>
      )}

      {/* Failure toast for unsuccessful or repeated enrollment attempts */}
      {showFailureToast && (
        <div className="toast toast-warning">
          <button className="close-button" onClick={() => setShowFailureToast(false)}>×</button>
          <p>Already enrolled in this course!</p>
        </div>
      )}
    </div>
  );
}

export default EnrollPage;
