import sys
import os

# Add the backend directory to the system path
sys.path.insert(0, r"C:\CourseWork\code\flavors-academy-local\backend")
from flask_session import Session

# Import app and required functions
from app import app, execute_query, fetch_data
import unittest
from flask import json

class AppTestCase(unittest.TestCase):
    def setUp(self):
        """Set up the Flask test client before each test."""
        app.config['TESTING'] = True
        self.client = app.test_client()

    def tearDown(self):
        """Clean up database entries created during testing."""
        # First delete entries from 'users' to avoid foreign key constraint violations
        execute_query("DELETE FROM users WHERE email IN (%s, %s)", ("student@example.com", "teacher@example.com"))
        # Then delete from 'student' and 'teacher'
        execute_query("DELETE FROM student WHERE email = %s", ("student@example.com",))
        execute_query("DELETE FROM teacher WHERE email = %s", ("teacher@example.com",))

    def test_signup_student_success(self):
        """Test for successful student signup."""
        payload = {
            "email": "student@example.com",
            "password": "password123",
            "firstName": "Student",
            "lastName": "One",
            "role": "student"
        }
        response = self.client.post('/signup', json=payload)
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data["message"], "Signup successful")

    def test_signup_teacher_success(self):
        """Test for successful teacher signup."""
        payload = {
            "email": "teacher@example.com",
            "password": "password123",
            "firstName": "Teacher",
            "lastName": "One",
            "role": "teacher"
        }
        response = self.client.post('/signup', json=payload)
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data["message"], "Signup successful")

    def test_signup_invalid_role(self):
        """Test signup with invalid role, expecting 400 error."""
        payload = {
            "email": "invalid@example.com",
            "password": "password123",
            "firstName": "Invalid",
            "lastName": "Role",
            "role": "invalid"
        }
        response = self.client.post('/signup', json=payload)
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["message"], "Invalid role")

    def test_login_success(self):
        """Test for successful login."""
        payload = {"email": "student@example.com", "password": "password123"}
        response = self.client.post('/login', json=payload)
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["message"], "Login successful")
        self.assertIn("role", data)
        self.assertIn("user_id", data)

    def test_login_invalid_credentials(self):
        """Test login with incorrect credentials, expecting 401 error."""
        payload = {"email": "nonexistent@example.com", "password": "wrongpassword"}
        response = self.client.post('/login', json=payload)
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(data["message"], "Invalid email or password")

    def test_logout_success(self):
        """Test for successful logout."""
        response = self.client.post('/logout')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["message"], "Logged out")

    def test_get_user_info_not_logged_in(self):
        """Test fetching user info when not logged in, expecting 401 error."""
        response = self.client.get('/get_user_info')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(data["message"], "Not logged in")

    def test_get_courses_for_teacher_not_logged_in(self):
        """Test fetching courses for a teacher without logging in, expecting 400 error."""
        response = self.client.get('/course')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["message"], "Teacher ID is required")

    def test_get_course_content_missing_params(self):
        """Test retrieving course content with missing parameters, expecting 400 error."""
        response = self.client.get('/courseContent')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data["message"], "Course ID and Teacher ID are required")

    def test_get_syllabus_not_found(self):
        """Test fetching a syllabus that does not exist, expecting empty fileUrl."""
        response = self.client.get('/syllabus', query_string={'courseId': 1, 'teacherId': 1})
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["fileUrl"], "")

    def test_get_course_success(self):
        """Test retrieving course details by ID."""
        response = self.client.get('/api/courses/1')
        if response.status_code == 200:
            self.assertIn("idcourse", json.loads(response.data))
        else:
            # Expecting a 404 if the course is not found
            self.assertEqual(response.status_code, 404)

    def test_enroll_student_in_course(self):
        """Test enrolling a student in a course."""
        payload = {"student_id": 1}
        response = self.client.put('/api/courses/1/enroll', json=payload)
        data = json.loads(response.data)
        self.assertIn(response.status_code, [200, 400])

if __name__ == '__main__':
    unittest.main()
