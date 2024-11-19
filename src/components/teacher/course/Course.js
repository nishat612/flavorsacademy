import React, { useEffect, useState } from 'react';
import { getCoursesForTeacher } from '../../../services/apiService';
import { useNavigate } from 'react-router-dom';
import './Course.css';
import { useLocation } from 'react-router-dom';
function Course({ teacherId: propTeacherId }) {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  // Retrieve teacherId from prop or localStorage
  const teacherId = propTeacherId || localStorage.getItem('teacherId');
  

  useEffect(() => {
    const fetchCourses = async () => {
      if (!teacherId) {
        console.error("teacherId is not defined. Redirecting to login.");
        navigate('/login');
        return;
      }
      try {
        console.log(teacherId)
        const response = await getCoursesForTeacher(teacherId);
        console.log("Course Response:", response);
        if (response && response.courses) {
          setCourses(response.courses);
          setError(null);
        } else if (response.message === "Not logged in") {
          navigate('/login');
        } else {
          setError("No courses found or error fetching courses.");
        }
      } catch (err) {
        setError('Could not fetch courses');
      }
    };

    fetchCourses();
  }, [teacherId, navigate]);

  const handleCourseClick = (course) => {
    console.log("Selected Course:", course);
    console.log("Teacher ID on Course Click:", teacherId);
    navigate('/courseContent', { state: { courseId: course.idcourse, teacherId, courseName: course.name } });
  };

  return (
    <div className="courses-container">
      <div className="card">
        <h2>Your Course List</h2>
        {error && courses.length === 0 && <p>{error}</p>}
        {courses.length > 0 ? (
          <ol className="course-list">
            {courses.map((course) => (
              <li key={course.idcourse} className="course-item">
                <a
                  onClick={() => handleCourseClick(course)}
                  className="course-link"
                  href="#"
                >
                  {course.name}
                </a>
              </li>
            ))}
          </ol>
        ) : (
          !error && <p>No courses found.</p>
        )}
      </div>
    </div>
  );
}

export default Course;
