import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestStudentDashboard(unittest.TestCase):

    def setUp(self):
        # Initialize Selenium WebDriver
        self.driver = webdriver.Chrome()
        # Open the application URL (adjust if necessary)
        self.driver.get("http://localhost:3000/student-dashboard")  # Ensure this URL points to your local server

    def tearDown(self):
        # Close the browser after each test
        self.driver.quit()

    def test_fetch_courses_success(self):
        """Test that courses are fetched and displayed successfully on the dashboard."""
        # Increase wait time to 20 seconds
        try:
            courses = WebDriverWait(self.driver, 20).until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, "course-item"))
            )
            self.assertGreater(len(courses), 0, "Courses should be displayed on the dashboard")
        except Exception as e:
            print(f"Error in test_fetch_courses_success: {e}")
            self.fail("Courses were not displayed on the dashboard.")

    def test_course_search_filtering(self):
        """Test that the search functionality filters courses correctly."""
        try:
            search_input = WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Search courses...']"))
            )
            # Enter search term
            search_input.send_keys("React")

            # Check that filtered results contain courses with "React" in the name
            courses = self.driver.find_elements(By.CLASS_NAME, "course-item")
            for course in courses:
                course_name = course.find_element(By.TAG_NAME, "h3").text
                self.assertIn("React", course_name, "Filtered courses should contain 'React'")
        except Exception as e:
            print(f"Error in test_course_search_filtering: {e}")
            self.fail("Course search filtering did not work as expected.")

    def test_handle_enroll_click(self):
        """Test that clicking 'Enroll' navigates correctly based on enrollment status."""
        try:
            enroll_button = WebDriverWait(self.driver, 20).until(
                EC.element_to_be_clickable((By.XPATH, "//button[text()='Enroll']"))
            )
            enroll_button.click()

            # Check that the URL is correct (assuming `/enrollPage` route)
            WebDriverWait(self.driver, 20).until(
                lambda driver: "/enrollPage" in driver.current_url
            )
            self.assertIn("/enrollPage", self.driver.current_url, "Should navigate to enroll page")
        except Exception as e:
            print(f"Error in test_handle_enroll_click: {e}")
            self.fail("Enrollment navigation did not work as expected.")

if __name__ == "__main__":
    unittest.main()
