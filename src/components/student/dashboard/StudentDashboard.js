import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, enrollInCourse, getTeacherById } from '../../../services/apiService';

function StudentDashboard({ studentId }) {
  const [courses, setCourses] = useState([]); // Initialize as an empty array
  const [filteredCourses, setFilteredCourses] = useState([]); // Initialize as an empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  // Fetch all courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses from the API
  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      const validData = Array.isArray(data) ? data : []; // Ensure data is an array
      setCourses(validData);
      setFilteredCourses(validData); // Initialize with all courses as an array
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]); // Fallback to an empty array in case of error
      setFilteredCourses([]); // Fallback to an empty array in case of error
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
    setCurrentPage(1); // Reset to first page on new search
  };

  // Calculate the courses to display for the current page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = Array.isArray(filteredCourses)
    ? filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
    : []; // Ensure it's an array before calling .slice()

  // Handle pagination
  const totalPages = Math.ceil((filteredCourses.length || 0) / coursesPerPage); // Fallback length to 0
  const handlePageChange = (page) => setCurrentPage(page);

  // Enroll student in a course
  const handleEnroll = async (courseId) => {
    try {
      const response = await enrollInCourse(courseId, studentId);
      alert(response.message); // Show success or error message from the API
      fetchCourses(); // Refresh the course list to reflect enrollment status
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
            <button onClick={() => handleEnroll(course.idcourse)}>Enroll</button>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button style={{margin:"5px"}}
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
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
