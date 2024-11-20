import React, { useEffect, useState } from 'react';
import { getCoursesForTeacher } from '../../../services/apiService';
import { useNavigate } from 'react-router-dom';
import './Course.css';
import { useLocation } from 'react-router-dom';

// Course component for displaying the teacher's courses
function Course({ teacherId: propTeacherId }) {
  const [courses, setCourses] = useState([]); // State to store list of courses
  const [error, setError] = useState(null); // State to store any error messages
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook for accessing location state

  // Retrieve teacherId from prop or localStorage as fallback
  const teacherId = propTeacherId || localStorage.getItem('teacherId');
  
  // Fetch courses for the teacher on component mount or when teacherId changes
  useEffect(() => {
    const fetchCourses = async () => {
      // Redirect to login if teacherId is not defined
      if (!teacherId) {
        console.error("teacherId is not defined. Redirecting to login.");
        navigate('/login');
        return;
      }
      try {
        console.log(teacherId);
        const response = await getCoursesForTeacher(teacherId); // Fetch courses for the teacher
        console.log("Course Response:", response);
        if (response && response.courses) {
          setCourses(response.courses); // Update courses state if data is returned
          setError(null); // Clear any error messages
        } else if (response.message === "Not logged in") {
          navigate('/login'); // Redirect if not logged in
        } else {
          setError("No courses found or error fetching courses."); // Display error if no courses found
        }
      } catch (err) {
        setError('Could not fetch courses'); // Handle fetch error
      }
    };

    fetchCourses(); // Trigger the course fetching function
  }, [teacherId, navigate]);

  // Handler for clicking a course item to navigate to course content page
  const handleCourseClick = (course) => {
    console.log("Selected Course:", course);
    console.log("Teacher ID on Course Click:", teacherId);
    localStorage.setItem("courseName", course.name);
    if (course.idcourse && teacherId) {
      navigate(`/courseContent/${course.idcourse}/${teacherId}`, { state: { courseName: course.name, courseId: course.idcourse, teacherId: teacherId} });
    } else {
      console.error("Missing courseId or teacherId for navigation.");
    }
  };

  return (
    <div className="courses-container">
      <div className="card">
        <h2>Your Course List</h2>
        {/* Display error message if there is an error and no courses */}
        {error && courses.length === 0 && <p>{error}</p>}
        
        {/* Render course list if courses are available */}
        {courses.length > 0 ? (
          <ol className="course-list">
            {courses.map((course) => (
              <li key={course.idcourse} className="course-item">
                <a
                  onClick={() => handleCourseClick(course)} // Handle course selection
                  className="course-link"
                  href="#"
                >
                  {course.name}
                </a>
              </li>
            ))}
          </ol>
        ) : (
          !error && <p>No courses found.</p> // Display if no courses are found and no errors
        )}
      </div>
    </div>
  );
}

export default Course;
