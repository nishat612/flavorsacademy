import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnrolledCourses } from '../../../services/apiService';

function StudentCourse({ studentId: propStudentId }) {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const studentId = propStudentId || localStorage.getItem('studentId');

  useEffect(() => {
    if (!studentId) {
      console.error("Student ID is undefined. Please log in.");
      setError("Student ID is undefined. Please log in.");
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        const data = await getEnrolledCourses(studentId);
        setCourses(data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError("Failed to fetch enrolled courses.");
      }
    };

    fetchEnrolledCourses();
  }, [studentId]);

  const handleCourseClick = (course) => {
    navigate(`/studentCourseContent/${course.idcourse}`, {
      state: {
        courseId: course.idcourse,
        teacherId: course.tid, // Make sure `tid` is available in the `course` object
        courseName: course.name,
      },
    });
  };

  return (
    <div>
      <h2>Enrolled Courses</h2>
      {error ? (
        <p>{error}</p>
      ) : courses.length > 0 ? (
        <ol className="course-list">
          {courses.map(course => (
            <li key={course.idcourse} className="course-item">
              <button onClick={() => handleCourseClick(course)} className="course-link">
                {course.name}
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p>No enrolled courses found.</p>
      )}
    </div>
  );
}

export default StudentCourse;
