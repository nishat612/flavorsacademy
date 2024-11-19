import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getCourseContent, enrollInCourse } from '../../../services/apiService';
import './EnrollPage.css';
function EnrollPage() {
  const location = useLocation();
  const { courseId, studentId, teacherId, courseName, teacherFirstName, teacherLastName, teacherEmail } = location.state || {}; // Destructure state values

  const [syllabusContent, setSyllabusContent] = useState(null);
  const [descriptionContent, setDescriptionContent] = useState(null);
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (courseId && teacherId) {
      const fetchContent = async () => {
        try {
          const syllabusResponse = await getCourseContent(courseId, teacherId, 'syllabus');
          setSyllabusContent(syllabusResponse.content);

          const descriptionResponse = await getCourseContent(courseId, teacherId, 'course description');
          setDescriptionContent(descriptionResponse.content);
        } catch (error) {
          console.error('Error fetching course content:', error);
        }
      };
      fetchContent();
    } else {
      console.error('Course ID or Teacher ID is missing');
    }
  }, [courseId, teacherId]);

  if (!courseId || !teacherId) {
    return <p>Error: Missing course or teacher information.</p>;
  }

  const handleEnroll = async () => {
    try {
      const response = await enrollInCourse(courseId, studentId);
      if (response.message === "Student enrolled successfully") {
        setShowToast(true); // Show toast on success
        setTimeout(() => setShowToast(false), 5000); // Hide toast after 5 seconds
      } else {
        console.error("Enrollment failed:", response.message);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };
  const closeToast = () => setShowToast(false);

  return (
    <div className="enroll-page">
      <h1 className="course-title">{courseName}</h1>

      <div className="instructor-info">
        <h2>Instructor Information</h2>
        <p><strong>Teacher:</strong> {teacherFirstName} {teacherLastName}</p>
        <p><strong>Email:</strong> {teacherEmail}</p>
      </div>

      <div className="course-description">
        <h2>Course Description</h2>
        {descriptionContent ? (
          <p>{descriptionContent.text}</p>
        ) : (
          <p>Loading description...</p>
        )}
      </div>

      <div className="course-syllabus">
        <h2>Course Syllabus</h2>
        {syllabusContent ? (
          syllabusContent.text ? (
            <a href={syllabusContent.text} target="_blank" rel="noopener noreferrer">
              View Syllabus
            </a>
          ) : (
            <p>No syllabus available.</p>
          )
        ) : (
          <p>Loading syllabus...</p>
        )}
      </div>
      <div><button onClick={handleEnroll} className="enroll-button">Enroll</button></div>
      {showToast && (
        <div className="toast">
          <button className="close-button" onClick={closeToast}>×</button>
          <p>Successfully Enrolled!</p>
        </div>
      )}
    </div>
  );
}

export default EnrollPage;
