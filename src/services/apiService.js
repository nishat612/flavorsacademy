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

export const getCourseContent = async (courseId, teacherId) => {
  try {
    const response = await fetch(`/courseContent?courseId=${courseId}&teacherId=${teacherId}`, {
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