// services/apiService.js

// Function to sign up a user
export const signup = async (userData) => {
  try {
    console.log("inside signup api");
    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)  // Send user data in JSON format
    });
    return response.json();
  } catch (error) {
    console.error("Error in signup:", error);
  }
};

// Function to log in and establish a session
export const login = async (credentials) => {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials),  // Send login credentials
      credentials: 'include'  // Include cookies for session management
    });
    return response.json();
  } catch (error) {
    console.error("Error in login:", error);
  }
};

// Function to retrieve user information from session
export const getUserInfo = async () => {
  try {
    const response = await fetch('http://localhost:3000/get_user_info', {
      method: 'GET',
      credentials: 'include',  // Ensure cookies are sent for session-based requests
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error in getUserInfo:", error);
  }
};

// Function to log out and clear the session
export const logout = async () => {
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      credentials: 'include'  // Include session credentials
    });
    return response.json();
  } catch (error) {
    console.error("Error in logout:", error);
  }
};

// Function to fetch courses for a specific teacher
export const getCoursesForTeacher = async () => {
  try {
    const response = await fetch(`/course`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'  // Include cookies to maintain session
    });
    return response.json();
  } catch (error) {
    console.error("Error in fetching courses:", error);
  }
};

// Function to fetch all content for a specific course and teacher
export const getAllCourseContent = async (courseId, teacherId) => {
  try {
    const response = await fetch(`/get_course_content?courseId=${courseId}&teacherId=${teacherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'  // Include credentials for session handling
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching all course content:", error);
  }
};

// Function to fetch specific course content by course ID, teacher ID, and content name
export const getCourseContent = async (courseId, teacherId, courseContent) => {
  try {
    console.log(courseId, teacherId, courseContent);
    const response = await fetch(`/courseContent?courseId=${courseId}&teacherId=${teacherId}&courseContent=${courseContent}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching course content:", error);
  }
};

// Function to save or update a course description
export const saveCourseDescription = async (courseId, teacherId, description) => {
  try {
    const response = await fetch('/courseContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ courseId, teacherId, contentName: 'course description', text: description })
    });
    return response.json();
  } catch (error) {
    console.error("Error saving course description:", error);
  }
};

// Function to save general course content with optional file name
export const saveCourseContent = async ({ courseId, teacherId, contentName, text, fileName }) => {
  try {
    const response = await fetch('/courseContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ courseId, teacherId, contentName, text, fileName }),
    });
    return response.json();
  } catch (error) {
    console.error("Error saving course content:", error);
  }
};

// Function to save syllabus file for a specific course and teacher
export const saveSyllabus = async ({ courseId, teacherId, fileUrl }) => {
  try {
    const response = await fetch('/syllabus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ courseId, teacherId, fileUrl })
    });
    return response.json();
  } catch (error) {
    console.error("Error saving syllabus:", error);
  }
};

// Function to fetch syllabus file path for a course
export const getSyllabus = async (courseId, teacherId) => {
  try {
    const response = await fetch(`/syllabus?courseId=${courseId}&teacherId=${teacherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching syllabus:", error);
  }
};

// Function to retrieve existing course content JSON data
export const getCourseContentData = async (courseId, teacherId) => {
  try {
    console.log(courseId, teacherId);
    const response = await fetch(`/courseContentHandler?courseId=${courseId}&teacherId=${teacherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching course content data:", error);
  }
};

// Function to save or update JSON data for course content
export const saveCourseContentData = async (data) => {
  console.log("Data being sent to the API:", data); // Log the data being sent
  try {
    const response = await fetch('/courseContentHandler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log("API call response:", response); // Log the response
    console.log("API call success:", response.ok);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to save course content data:', error);
    throw error;
  }
};


// Function to get all available courses
export const getCourses = async () => {
  try {
    console.log("inside get course");
    const response = await fetch('/api/courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

// Function to fetch course details by specific course ID
export const getCourseById = async (courseId) => {
  try {
    console.log(courseId);
    const response = await fetch(`/api/courses/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching course:", error);
  }
};

// Function to enroll a student in a course
export const enrollInCourse = async (courseId, studentId) => {
  try {
    const response = await fetch(`/api/courses/${courseId}/enroll`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ student_id: studentId })  // Send student ID in request body
    });
    return response.json();
  } catch (error) {
    console.error("Error enrolling in course:", error);
  }
};

// Function to get teacher details by teacher ID
export const getTeacherById = async (teacherId) => {
  if (!teacherId) {
    // If teacherId is not valid, return an empty string
    return "";
  }

  try {
    const response = await fetch(`/api/teachers/${teacherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (response.ok) {
      return await response.json();  // Return teacher details if successful
    } else {
      return "";  // Return empty string if teacher not found
    }
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    return "";
  }
};

// Function to get courses that a student is enrolled in
export const getEnrolledCourses = async (studentId) => {
  try {
    console.log(studentId);
    const response = await fetch(`/api/enrolled_courses/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.ok) {
      return response.json(); // Return enrolled courses data
    } else {
      console.error("Failed to fetch enrolled courses");
      return [];
    }
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return [];
  }
};

// Function to retrieve teacher details for a given teacher ID
export const getTeacherDetails = async (teacherId) => {
  try {
    const response = await fetch(`/api/teachers/${teacherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching teacher details:", error);
  }
};
