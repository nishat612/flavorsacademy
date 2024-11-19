import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCourseContent, enrollInCourse } from '../../../services/apiService';
import './EnrollPage.css';

function EnrollPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId, studentId, teacherId, courseName, teacherFirstName, teacherLastName, teacherEmail } = location.state || {};
  
  const [syllabusContent, setSyllabusContent] = useState(null);
  const [descriptionContent, setDescriptionContent] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);

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

  const handleEnroll = async () => {
    try {
      const response = await enrollInCourse(courseId, studentId);
      if (response.message === "Student enrolled successfully") {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
        navigate('/studentCourseContent', { state: { courseId, teacherId, courseName } });
      } else if (response.message === "Student already enrolled") {
        setShowFailureToast(true);
        setTimeout(() => setShowFailureToast(false), 5000);
      } else {
        setShowFailureToast(true);
        setTimeout(() => setShowFailureToast(false), 5000);
        console.error("Enrollment failed:", response.message);
       
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      setShowFailureToast(true);
      setTimeout(() => setShowFailureToast(false), 5000);
    }
  };

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

      {showSuccessToast && (
        <div className="toast toast-success">
          <button className="close-button" onClick={() => setShowSuccessToast(false)}>×</button>
          <p>Successfully Enrolled!</p>
        </div>
      )}

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
