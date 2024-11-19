import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
import os

class TestUploadModal(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        cls.driver.get("http://localhost:3000/upload-modal")  # Update this with the correct URL for the UploadModal component
    
    def test_file_selection_and_upload(self):
        driver = self.driver

        # Mock a file to upload
        file_path = os.path.abspath("testfile.pdf")  # Ensure this file exists in your test directory

        # Wait for the file input and select a file
        try:
            file_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='file']"))
            )
            file_input.send_keys(file_path)
            print("File selected:", file_path)

            # Verify that the file is ready to be uploaded
            upload_button = driver.find_element(By.XPATH, "//button[text()='Upload']")
            self.assertFalse(upload_button.is_disabled(), "Upload button should be enabled after file selection")

            # Click the upload button to initiate upload
            upload_button.click()

            # Verify upload progress appears and reaches 100%
            progress_text = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Uploading...')]"))
            )
            print("Upload in progress, text found:", progress_text.text)
            self.assertIn("Uploading...", progress_text.text)

            # Wait until the upload completes and modal closes
            WebDriverWait(driver, 20).until(EC.invisibility_of_element_located((By.CLASS_NAME, "modal-content")))
            print("Upload completed and modal closed.")
        
        except TimeoutException:
            self.fail("File selection or upload progress not working as expected.")

    def test_cancel_button(self):
        driver = self.driver

        # Wait for the Cancel button and click it
        try:
            cancel_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//button[text()='Cancel']"))
            )
            cancel_button.click()

            # Verify that the modal closes on cancel
            WebDriverWait(driver, 5).until(EC.invisibility_of_element_located((By.CLASS_NAME, "modal-content")))
            print("Modal closed after clicking Cancel button.")

        except TimeoutException:
            self.fail("Cancel button did not close the modal as expected.")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
