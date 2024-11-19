import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager

class TestCourseComponent(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        cls.driver.get("http://localhost:3000/course")  # Adjust this URL to where the Course component is served
    
    def test_no_teacher_id_redirects_to_login(self):
        driver = self.driver
        driver.execute_script("localStorage.removeItem('teacherId');")  # Ensure teacherId is not set

        # Reload page to trigger effect
        driver.refresh()

        try:
            # Wait until redirected to login
            WebDriverWait(driver, 10).until(
                EC.url_contains("/login")
            )
            print("Redirected to login page as expected.")
        
        except TimeoutException:
            self.fail("Did not redirect to login page when teacherId is missing.")

    def test_display_courses_if_available(self):
        driver = self.driver

        # Set a mock teacherId in local storage to simulate logged-in state
        driver.execute_script("localStorage.setItem('teacherId', 'testTeacherId');")
        driver.refresh()

        # Wait for courses to load
        try:
            course_list = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "course-list"))
            )
            courses = course_list.find_elements(By.CLASS_NAME, "course-item")
            print(f"Found {len(courses)} courses displayed.")

            # Check that at least one course is displayed
            self.assertGreater(len(courses), 0, "Expected at least one course to be displayed.")

        except TimeoutException:
            self.fail("Courses did not load or display as expected.")

    def test_handle_no_courses_message(self):
        driver = self.driver

        # Simulate no courses available by providing an empty response
        driver.execute_script("localStorage.setItem('teacherId', 'emptyCoursesTeacherId');")
        driver.refresh()

        try:
            # Verify "No courses found" message
            no_courses_message = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//p[text()='No courses found.']"))
            )
            print("No courses found message displayed:", no_courses_message.text)
            self.assertEqual(no_courses_message.text, "No courses found.")

        except TimeoutException:
            self.fail("Did not display 'No courses found' message when courses are unavailable.")

    def test_error_message_on_fetch_failure(self):
        driver = self.driver

        # Simulate fetch error by using an invalid teacherId
        driver.execute_script("localStorage.setItem('teacherId', 'invalidTeacherId');")
        driver.refresh()

        try:
            # Verify error message display
            error_message = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//p[text()='Could not fetch courses']"))
            )
            print("Error message displayed:", error_message.text)
            self.assertEqual(error_message.text, "Could not fetch courses")

        except TimeoutException:
            self.fail("Did not display error message on fetch failure.")

    def test_click_course_navigates_to_content(self):
        driver = self.driver

        # Set a valid teacherId and reload to load courses
        driver.execute_script("localStorage.setItem('teacherId', 'validTeacherId');")
        driver.refresh()

        try:
            # Wait for courses to load and click the first course
            first_course_link = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CLASS_NAME, "course-link"))
            )
            first_course_name = first_course_link.text
            first_course_link.click()

            # Verify redirection to course content page with correct course name in state
            WebDriverWait(driver, 10).until(
                EC.url_contains("/courseContent")
            )
            print("Navigated to course content page successfully for course:", first_course_name)

        except TimeoutException:
            self.fail("Failed to navigate to course content page on course selection.")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
