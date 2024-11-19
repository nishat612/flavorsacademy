import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnrolledCourses } from '../../../services/apiService';

// Component for displaying a student's enrolled courses
function StudentCourse({ studentId: propStudentId }) {
  const [courses, setCourses] = useState([]); // State to store list of enrolled courses
  const [error, setError] = useState(null); // State to store error messages
  const navigate = useNavigate(); // Hook for navigation

  // Retrieve student ID from prop or localStorage as a fallback
  const studentId = propStudentId || localStorage.getItem('studentId');

  // Fetch enrolled courses on component mount or when studentId changes
  useEffect(() => {
    // Check if studentId is defined; if not, set an error and return early
    if (!studentId) {
      console.error("Student ID is undefined. Please log in.");
      setError("Student ID is undefined. Please log in.");
      return;
    }

    // Async function to fetch the student's enrolled courses
    const fetchEnrolledCourses = async () => {
      try {
        const data = await getEnrolledCourses(studentId); // Fetch courses from API
        setCourses(data); // Update state with the retrieved courses
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError("Failed to fetch enrolled courses."); // Set error message if fetch fails
      }
    };

    fetchEnrolledCourses(); // Call the function to fetch courses
  }, [studentId]);

  // Handler for navigating to specific course content when a course is clicked
  const handleCourseClick = (course) => {
    navigate(`/studentCourseContent/${course.idcourse}`, {
      state: {
        courseId: course.idcourse, // Pass course ID to the destination component
        teacherId: course.tid, // Ensure `tid` is part of the course object
        courseName: course.name, // Pass course name for display in the destination component
      },
    });
  };

  return (
    <div>
      <h2>Enrolled Courses</h2>
      {/* If there is an error, display the error message */}
      {error ? (
        <p>{error}</p>
      ) : courses.length > 0 ? (
        // Display a list of enrolled courses if available
        <ol className="course-list">
          {courses.map(course => (
            <li key={course.idcourse} className="course-item">
              <button onClick={() => handleCourseClick(course)} className="course-link">
                {course.name} {/* Display course name */}
              </button>
            </li>
          ))}
        </ol>
      ) : (
        // Message to display if no courses are found
        <p>No enrolled courses found.</p>
      )}
    </div>
  );
}

export default StudentCourse;
