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
      body: JSON.stringify(userData)
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
      body: JSON.stringify(credentials),
      credentials: 'include'  // Important to include cookies in CORS requests
    });
    return response.json();
  } catch (error) {
    console.error("Error in login:", error);
  }
};

// Function to get user info from session
export const getUserInfo = async () => {
  try {
    const response = await fetch('http://localhost:3000/get_user_info', {
      method: 'GET',
      credentials: 'include',  // Make sure cookies are sent
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
      credentials: 'include'  // Important for session-based logout
    });
    return response.json();
  } catch (error) {
    console.error("Error in logout:", error);
  }
};

// Function to get courses for a specific teacher
export const getCoursesForTeacher = async () => {
  try {
    const response = await fetch(`/course`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'  // Include cookies for session handling
    });
    return response.json();
  } catch (error) {
    console.error("Error in fetching courses:", error);
  }
};

export const getAllCourseContent = async (courseId, teacherId) => {
  try {
    const response = await fetch(`/get_course_content?courseId=${courseId}&teacherId=${teacherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'  // Include credentials if session handling is involved
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching all course content:", error);
  }
};

export const getCourseContent = async (courseId, teacherId, courseContent) => {
  try {
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



// Save or update course description
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

// Existing POST function to save syllabus
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

// New GET function to fetch syllabus file path
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

// services/apiService.js

// Function to retrieve existing course content JSON data from the handle_course_content endpoint
export const getCourseContentData = async (courseId, teacherId) => {
  try {
    console.log(courseId, teacherId )
    const response = await fetch(`/courseContentHandler?courseId=${courseId}&teacherId=${teacherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include credentials if session handling is involved
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching course content data:", error);
  }
};

// Function to save or update course content JSON data to the handle_course_content endpoint
export const saveCourseContentData = async ({ courseId, teacherId, contentName, contentData }) => {
  try {
    const response = await fetch('/courseContentHandler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        courseId, 
        teacherId, 
        contentName: contentName || 'course content',  // Default to 'course content' if not provided
        content: contentData  // Pass the course content data
      }),
    });
    return response.json();
  } catch (error) {
    console.error("Error saving course content data:", error);
  }
};

// Function to get all courses
export const getCourses = async () => {
  try {
    console.log("inside get course")
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

// Function to get a specific course by ID
export const getCourseById = async (courseId) => {
  try {
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
      body: JSON.stringify({ student_id: studentId })
    });
    return response.json();
  } catch (error) {
    console.error("Error enrolling in course:", error);
  }
};

// Function to get teacher details by ID
export const getTeacherById = async (teacherId) => {
  if (!teacherId) {
    // If teacherId is null, undefined, or 0, return an empty string immediately
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
      // If the response is successful, return the JSON data
      return await response.json();
    } else {
      // If the teacher is not found, return an empty string
      return "";
    }
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    // Return an empty string in case of an error
    return "";
  }
};