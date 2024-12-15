import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses, enrollInCourse, getTeacherById, getCourseById } from '../../../services/apiService';

// StudentDashboard component displays available courses and allows enrollment
function StudentDashboard({ studentId }) {
  const navigate = useNavigate(); // Hook for navigation
  const [courses, setCourses] = useState([]); // State to store all available courses
  const [filteredCourses, setFilteredCourses] = useState([]); // State to store search-filtered courses
  const [searchTerm, setSearchTerm] = useState(''); // State to store the current search term
  const [currentPage, setCurrentPage] = useState(1); // State for managing pagination
  const coursesPerPage = 5; // Number of courses displayed per page

  // Fetches all courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Function to fetch courses from the API
  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      const validData = Array.isArray(data) ? data : []; // Ensure data is an array
      setCourses(validData); // Store all fetched courses
      setFilteredCourses(validData); // Initialize filtered courses with all courses
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]); // Clear courses on error
      setFilteredCourses([]); // Clear filtered courses on error
    }
  };

  // Handles search input changes and filters courses based on the search term
  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    setSearchTerm(search); // Update the search term state
    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(search)
    );
    setFilteredCourses(filtered); // Update filtered courses based on search term
    setCurrentPage(1); // Reset to the first page on new search
  };

  // Calculate the indexes for paginated courses based on current page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  // Extract the current page courses to display
  const currentCourses = Array.isArray(filteredCourses)
    ? filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
    : [];

  // Calculate the total number of pages based on courses per page
  const totalPages = Math.ceil((filteredCourses.length || 0) / coursesPerPage);
  // Update the current page state when a pagination button is clicked
  const handlePageChange = (page) => setCurrentPage(page);

  // Handle click on the enroll button; checks enrollment and navigates accordingly
  const handleEnrollClick = async (courseId, teacherId, courseName) => {
    console.log("courseId:", courseId, "teacherId:", teacherId, "Course Name: ", courseName);
    try {
      console.log(courseId)
      const course = await getCourseById(courseId); // Fetch course details
      console.log(course)
      const teacherData = await getTeacherById(teacherId); // Fetch teacher details

      // Check if student is already enrolled in the course
      if (course.sid && course.sid.includes(studentId)) {
        // Navigate to course page if already enrolled
        navigate(`/course/${courseId}`);
      } else {
        // Navigate to enrollment page with course and teacher details if not enrolled
        navigate(`/enrollPage/${courseId}`, {
          state: {
            courseId,
            studentId,
            teacherId,
            courseName,
            teacherFirstName: teacherData?.firstname,
            teacherLastName: teacherData?.lastname,
            teacherEmail: teacherData?.email,
          },
        });
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      {/* Search input field */}
      <input
        type="text"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={handleSearch}
      />
      
      {/* Display list of courses with pagination */}
      <div className="course-list">
        {currentCourses.map((course) => (
          <div key={course.idcourse} className="course-item">
            <h3>{course.name}</h3>
            {/* Display teacher details for each course */}
            <TeacherDetails teacherId={course.tid} />
            {/* Enroll button for the course */}
            <button onClick={() => handleEnrollClick(course.idcourse, course.tid, course.name)}>Enroll</button>
          </div>
        ))}
      </div>
      
      {/* Pagination controls */}
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

// Component to display teacher details for each course
function TeacherDetails({ teacherId }) {
  const [teacher, setTeacher] = useState(null); // State to store teacher information

  // Function to fetch teacher details
  const fetchTeacher = useCallback(async () => {
    try {
      const data = await getTeacherById(teacherId); // Fetch teacher data by ID
      setTeacher(data); // Store fetched teacher details in state
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    }
  }, [teacherId]);

  // Fetch teacher details on component mount or when teacherId changes
  useEffect(() => {
    fetchTeacher();
  }, [fetchTeacher]);

  // If teacher data is not available, return nothing
  if (!teacher) return null;

  return (
    <div className="teacher-details">
      {/* Display teacher's name and email */}
      <p>Teacher: {teacher.firstname} {teacher.lastname}</p>
      <p>Email: {teacher.email}</p>
    </div>
  );
}

export default StudentDashboard;
