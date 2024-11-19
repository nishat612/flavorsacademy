import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses, enrollInCourse, getTeacherById, getCourseById } from '../../../services/apiService';

function StudentDashboard({ studentId }) {
  const navigate = useNavigate(); // Define navigate here
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  // Fetch all courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      const validData = Array.isArray(data) ? data : [];
      setCourses(validData);
      setFilteredCourses(validData);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
      setFilteredCourses([]);
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    setSearchTerm(search);
    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(search)
    );
    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  // Calculate the courses to display for the current page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = Array.isArray(filteredCourses)
    ? filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
    : [];

  const totalPages = Math.ceil((filteredCourses.length || 0) / coursesPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  const handleEnrollClick = async (courseId, teacherId, courseName) => {
    console.log("courseId:", courseId, "teacherId:", teacherId, "Course Name: ", courseName);
    try {
      const course = await getCourseById(courseId);
      if (course.sid && course.sid.includes(studentId)) {
        navigate(`/course/${courseId}`);
      } else {
        navigate(`/enrollPage/${courseId}`, { state: { courseId, studentId , teacherId, courseName} });
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const response = await enrollInCourse(courseId, studentId);
      alert(response.message);
      fetchCourses();
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert(error.message || 'Enrollment failed');
    }
  };

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      <input
        type="text"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="course-list">
        {currentCourses.map((course) => (
          <div key={course.idcourse} className="course-item">
            <h3>{course.name}</h3>
            <TeacherDetails teacherId={course.tid} />
            <button onClick={() => handleEnrollClick(course.idcourse, course.tid, course.name)}>Enroll</button>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
            style={{ margin: "5px" }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// Component to display teacher details
function TeacherDetails({ teacherId }) {
  const [teacher, setTeacher] = useState(null);

  const fetchTeacher = useCallback(async () => {
    try {
      const data = await getTeacherById(teacherId);
      setTeacher(data);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchTeacher();
  }, [fetchTeacher]);

  if (!teacher) return null;

  return (
    <div className="teacher-details">
      <p>Teacher: {teacher.firstname} {teacher.lastname}</p>
      <p>Email: {teacher.email}</p>
    </div>
  );
}

export default StudentDashboard;
