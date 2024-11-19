import unittest
import requests
import requests_mock

# Base URL for the API (assume the server is running locally)
BASE_URL = "http://localhost:3000"

class TestApiService(unittest.TestCase):
    @requests_mock.Mocker()
    def test_signup(self, mock):
        # Define the endpoint URL for signup
        url = f"{BASE_URL}/signup"
        # Mock the POST request to return a JSON response indicating success
        mock.post(url, json={"success": True})
        # Send a POST request with test user data
        response = requests.post(url, json={"username": "testuser", "password": "testpass"})
        # Assert that the response matches the expected JSON output
        self.assertEqual(response.json(), {"success": True})

    @requests_mock.Mocker()
    def test_login(self, mock):
        # Define the endpoint URL for login
        url = f"{BASE_URL}/login"
        # Mock the POST request to return a JSON response with a token
        mock.post(url, json={"token": "abc123"})
        # Send a POST request with login credentials
        response = requests.post(url, json={"username": "testuser", "password": "testpass"})
        # Assert that the response contains the expected token
        self.assertEqual(response.json(), {"token": "abc123"})

    @requests_mock.Mocker()
    def test_get_user_info(self, mock):
        # Define the endpoint URL to retrieve user information
        url = f"{BASE_URL}/get_user_info"
        # Mock the GET request to return user details
        mock.get(url, json={"userId": "1", "username": "testuser"})
        # Send a GET request to fetch user information
        response = requests.get(url)
        # Assert that the response matches the expected JSON output
        self.assertEqual(response.json(), {"userId": "1", "username": "testuser"})

    @requests_mock.Mocker()
    def test_logout(self, mock):
        # Define the endpoint URL for logout
        url = f"{BASE_URL}/logout"
        # Mock the POST request to return a JSON response indicating success
        mock.post(url, json={"success": True})
        # Send a POST request to logout
        response = requests.post(url)
        # Assert that the response matches the expected JSON output
        self.assertEqual(response.json(), {"success": True})

    @requests_mock.Mocker()
    def test_get_courses_for_teacher(self, mock):
        # Define the endpoint URL to fetch courses for a specific teacher
        url = f"{BASE_URL}/course"
        # Mock the GET request to return a list of courses
        mock.get(url, json=[{"id": "course1", "name": "Course 1"}])
        # Send a GET request to retrieve courses
        response = requests.get(url)
        # Assert that the response matches the expected JSON list of courses
        self.assertEqual(response.json(), [{"id": "course1", "name": "Course 1"}])

    @requests_mock.Mocker()
    def test_save_course_content_data(self, mock):
        # Define the endpoint URL to save or update course content data
        url = f"{BASE_URL}/courseContentHandler"
        # Sample data payload for course content
        data = {"courseId": 1, "teacherId": 1, "contentName": "course content", "contentData": "Some new content data"}
        # Mock the POST request to return a success response
        mock.post(url, json={"success": True})
        # Send a POST request with the course content data
        response = requests.post(url, json=data)
        # Assert that the response matches the expected JSON output
        self.assertEqual(response.json(), {"success": True})

    @requests_mock.Mocker()
    def test_enroll_in_course(self, mock):
        # Define the endpoint URL for enrolling a student in a course
        course_id = "1"
        url = f"{BASE_URL}/api/courses/{course_id}/enroll"
        # Mock the PUT request to return a JSON response indicating enrollment success
        mock.put(url, json={"enrolled": True})
        # Send a PUT request with the student ID to enroll in the course
        response = requests.put(url, json={"student_id": "2"})
        # Assert that the response matches the expected JSON output
        self.assertEqual(response.json(), {"enrolled": True})

    @requests_mock.Mocker()
    def test_get_teacher_by_id(self, mock):
        # Define the endpoint URL to fetch teacher details by teacher ID
        teacher_id = "1"
        url = f"{BASE_URL}/api/teachers/{teacher_id}"
        # Mock the GET request to return teacher details
        mock.get(url, json={"firstname": "John", "lastname": "Doe", "email": "johndoe@example.com"})
        # Send a GET request to retrieve teacher details
        response = requests.get(url)
        # Assert that the response matches the expected JSON output
        self.assertEqual(response.json(), {"firstname": "John", "lastname": "Doe", "email": "johndoe@example.com"})

    @requests_mock.Mocker()
    def test_get_enrolled_courses(self, mock):
        # Define the endpoint URL to retrieve courses that a student is enrolled in
        student_id = "2"
        url = f"{BASE_URL}/api/enrolled_courses/{student_id}"
        # Mock the GET request to return a list of enrolled courses
        mock.get(url, json=[{"id": "course1", "name": "Course 1"}])
        # Send a GET request to retrieve the list of enrolled courses
        response = requests.get(url)
        # Assert that the response matches the expected JSON list of enrolled courses
        self.assertEqual(response.json(), [{"id": "course1", "name": "Course 1"}])

# Run the tests when the script is executed directly
if __name__ == "__main__":
    unittest.main()
