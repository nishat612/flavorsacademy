import unittest
from unittest.mock import patch, MagicMock
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService

class TestEnrollPageComponent(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        cls.driver.get("http://localhost:3000/enroll")  # Adjust URL to where EnrollPage component is served

    @patch("apiService.getCourseContent")
    @patch("apiService.enrollInCourse")
    def test_load_course_content(self, mock_enroll, mock_content):
        # Mock course content for syllabus and description
        mock_content.side_effect = [
            MagicMock(content={"text": "http://example.com/syllabus.pdf"}),  # Syllabus content
            MagicMock(content={"text": "This is the course description"})    # Description content
        ]

        driver = self.driver
        WebDriverWait(driver, 10).until(
            EC.text_to_be_present_in_element((By.CLASS_NAME, "course-title"), "Example Course")
        )

        # Check if the course description and syllabus link load properly
        description = driver.find_element(By.CSS_SELECTOR, ".course-description p").text
        syllabus_link = driver.find_element(By.CSS_SELECTOR, ".course-syllabus a").get_attribute("href")

        self.assertEqual(description, "This is the course description", "Course description text does not match.")
        self.assertEqual(syllabus_link, "http://example.com/syllabus.pdf", "Syllabus link does not match.")

    @patch("apiService.enrollInCourse")
    def test_successful_enrollment(self, mock_enroll):
        # Mock successful enrollment response
        mock_enroll.return_value = MagicMock(message="Student enrolled successfully")

        driver = self.driver
        enroll_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "enroll-button"))
        )
        enroll_button.click()

        # Verify success toast message appears
        try:
            success_toast = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "toast-success"))
            )
            self.assertIn("Successfully Enrolled!", success_toast.text)
        except TimeoutException:
            self.fail("Success toast did not appear on successful enrollment")

    @patch("apiService.enrollInCourse")
    def test_already_enrolled(self, mock_enroll):
        # Mock response for already enrolled student
        mock_enroll.return_value = MagicMock(message="Student already enrolled")

        driver = self.driver
        enroll_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "enroll-button"))
        )
        enroll_button.click()

        # Verify failure toast message appears
        try:
            failure_toast = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "toast-warning"))
            )
            self.assertIn("Already enrolled in this course!", failure_toast.text)
        except TimeoutException:
            self.fail("Failure toast did not appear on repeated enrollment")

    @patch("apiService.enrollInCourse")
    def test_enrollment_failure(self, mock_enroll):
        # Mock general failure response for enrollment
        mock_enroll.return_value = MagicMock(message="Enrollment failed")

        driver = self.driver
        enroll_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "enroll-button"))
        )
        enroll_button.click()

        # Verify failure toast message appears
        try:
            failure_toast = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "toast-warning"))
            )
            self.assertIn("Already enrolled in this course!", failure_toast.text)
        except TimeoutException:
            self.fail("Failure toast did not appear on enrollment failure")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
