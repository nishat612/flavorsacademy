import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
import os

class TestAddContentModal(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        cls.driver.get("http://localhost:3000/add-content-modal")  # Update with the URL for AddContentModal

    def test_fill_form_and_save(self):
        driver = self.driver

        # Fill out form fields for content number, title, and subtitle
        try:
            content_no_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='text' and @placeholder='Content No']"))
            )
            content_no_input.send_keys("101")

            title_input = driver.find_element(By.XPATH, "//input[@type='text' and @placeholder='Title']")
            title_input.send_keys("Test Title")

            subtitle_input = driver.find_element(By.XPATH, "//input[@type='text' and @placeholder='Subtitle']")
            subtitle_input.send_keys("Test Subtitle")

            print("Form fields filled successfully.")
        
            # Trigger Save
            save_button = driver.find_element(By.XPATH, "//button[text()='Save']")
            save_button.click()
            print("Save button clicked.")

        except TimeoutException:
            self.fail("Failed to find and fill form fields.")

    def test_file_upload_progress(self):
        driver = self.driver
        file_path = os.path.abspath("sample.pdf")  # Make sure this file exists in your test directory

        # Simulate selecting a file for upload and verifying progress display
        try:
            file_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='file' and @placeholder='Upload File']"))
            )
            file_input.send_keys(file_path)

            upload_file_button = driver.find_element(By.XPATH, "//button[text()='Upload File']")
            upload_file_button.click()

            # Check for progress indicator (assume > 0% as success)
            progress_text = WebDriverWait(driver, 15).until(
                EC.text_to_be_present_in_element((By.CLASS_NAME, "upload-progress"), "File Upload Progress")
            )
            print("File upload progress visible:", progress_text)

        except TimeoutException:
            self.fail("File upload or progress display failed.")

    def test_video_upload_progress(self):
        driver = self.driver
        video_path = os.path.abspath("sample.mp4")  # Ensure a sample file exists for testing

        # Simulate selecting a video for upload and verifying progress display
        try:
            video_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='file' and @placeholder='Upload Video']"))
            )
            video_input.send_keys(video_path)

            upload_video_button = driver.find_element(By.XPATH, "//button[text()='Upload Video']")
            upload_video_button.click()

            # Check for progress indicator (assume > 0% as success)
            progress_text = WebDriverWait(driver, 15).until(
                EC.text_to_be_present_in_element((By.CLASS_NAME, "upload-progress"), "Video Upload Progress")
            )
            print("Video upload progress visible:", progress_text)

        except TimeoutException:
            self.fail("Video upload or progress display failed.")

    def test_assignment_upload_progress(self):
        driver = self.driver
        assignment_path = os.path.abspath("sample.docx")  # Ensure a sample file exists for testing

        # Simulate selecting an assignment file for upload and verifying progress display
        try:
            assignment_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='file' and @placeholder='Upload Assignment']"))
            )
            assignment_input.send_keys(assignment_path)

            upload_assignment_button = driver.find_element(By.XPATH, "//button[text()='Upload Assignment']")
            upload_assignment_button.click()

            # Check for progress indicator (assume > 0% as success)
            progress_text = WebDriverWait(driver, 15).until(
                EC.text_to_be_present_in_element((By.CLASS_NAME, "upload-progress"), "Assignment Upload Progress")
            )
            print("Assignment upload progress visible:", progress_text)

        except TimeoutException:
            self.fail("Assignment upload or progress display failed.")

    def test_cancel_button(self):
        driver = self.driver

        # Locate and click the Cancel button
        try:
            cancel_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//button[text()='Cancel']"))
            )
            cancel_button.click()

            # Check that the modal closes
            WebDriverWait(driver, 5).until(EC.invisibility_of_element_located((By.CLASS_NAME, "modal-content")))
            print("Modal closed after clicking Cancel.")

        except TimeoutException:
            self.fail("Cancel button did not close the modal.")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
