import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

class TestCourseContentComponent(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        cls.driver.get("http://localhost:3000/course-content")  # Ensure required state is passed in

    def test_rendering_initial_state(self):
        driver = self.driver
        try:
            # Wait for the main title to ensure the page has loaded
            main_title = WebDriverWait(driver, 15).until(
                EC.visibility_of_element_located((By.TAG_NAME, "h1"))
            )
            print("Main title found:", main_title.text)
            self.assertIn("Flavors Academy", main_title.text)
        except TimeoutException:
            self.fail("Main title (Flavors Academy) did not load as expected")

    def test_add_edit_description_modal(self):
        driver = self.driver

        # Try locating 'Add Description' button
        try:
            add_description_button = WebDriverWait(driver, 15).until(
                EC.visibility_of_element_located((By.XPATH, "//button[contains(text(), 'Add Description')]"))
            )
            print("Add Description button found. Clicking...")
            add_description_button.click()
        except TimeoutException:
            self.fail("Add Description button not found within wait time")

        # Verify modal appearance and enter description
        try:
            description_input = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.TAG_NAME, "textarea"))
            )
            print("Description textarea found. Entering text...")
            description_input.clear()
            description_input.send_keys("Test Course Description")
            
            save_button = driver.find_element(By.XPATH, "//button[contains(text(), 'OK')]")
            save_button.click()

            # Confirm the description is saved and modal closes
            WebDriverWait(driver, 5).until(EC.invisibility_of_element_located((By.CLASS_NAME, "modal-content")))
            description_paragraph = driver.find_element(By.XPATH, "//p[contains(text(), 'Test Course Description')]")
            self.assertTrue(description_paragraph.is_displayed())
        except TimeoutException:
            self.fail("Description modal or text input not working as expected")

    def test_upload_replace_syllabus(self):
        driver = self.driver

        # Try locating 'Upload Syllabus' button
        try:
            upload_button = WebDriverWait(driver, 15).until(
                EC.visibility_of_element_located((By.XPATH, "//button[contains(text(), 'Upload Syllabus')]"))
            )
            print("Upload Syllabus button found. Clicking...")
            upload_button.click()
        except TimeoutException:
            self.fail("Upload Syllabus button not found within wait time")

        # Assume the upload modal opens and simulate upload completion
        try:
            success_message = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "success-message"))
            )
            self.assertIn("File uploaded successfully!", success_message.text)
        except TimeoutException:
            self.fail("Success message not displayed after syllabus upload")

    def test_add_edit_course_content(self):
        driver = self.driver

        # Try locating 'Add Content' button
        try:
            add_content_button = WebDriverWait(driver, 15).until(
                EC.visibility_of_element_located((By.XPATH, "//button[contains(text(), 'Add Content')]"))
            )
            print("Add Content button found. Clicking...")
            add_content_button.click()
        except TimeoutException:
            self.fail("Add Content button not found within wait time")

        # Verify modal appearance and enter content details
        try:
            title_input = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.NAME, "title"))
            )
            subtitle_input = driver.find_element(By.NAME, "subtitle")
            print("Title and subtitle inputs found. Entering content details...")
            
            title_input.send_keys("Test Content Title")
            subtitle_input.send_keys("Test Content Subtitle")
            
            save_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Save')]")
            save_button.click()

            # Confirm content is added
            WebDriverWait(driver, 5).until(EC.invisibility_of_element_located((By.CLASS_NAME, "add-content-modal")))
            added_content_title = driver.find_element(By.XPATH, "//h3[contains(text(), 'Test Content Title')]")
            self.assertTrue(added_content_title.is_displayed())
        except TimeoutException:
            self.fail("Content modal or fields not behaving as expected")

    def test_success_message_disappears(self):
        driver = self.driver

        # Try locating 'Upload Syllabus' button
        try:
            upload_button = WebDriverWait(driver, 15).until(
                EC.visibility_of_element_located((By.XPATH, "//button[contains(text(), 'Upload Syllabus')]"))
            )
            print("Upload Syllabus button found. Clicking...")
            upload_button.click()

            # Wait for success message and confirm disappearance
            success_message = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "success-message"))
            )
            print("Success message appeared:", success_message.text)
            WebDriverWait(driver, 5).until(EC.invisibility_of_element_located((By.CLASS_NAME, "success-message")))
        except TimeoutException:
            self.fail("Success message did not appear or disappear as expected")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
