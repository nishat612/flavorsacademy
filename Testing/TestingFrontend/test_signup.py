import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager

class TestSignupComponent(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Set up the Chrome driver
        cls.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        cls.driver.get("http://localhost:3000/signup")

    def test_toggle_roles(self):
        driver = self.driver
        student_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign up as Student')]")
        teacher_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign up as Teacher')]")
        
        # Check initial state is for student
        self.assertTrue("active" in student_button.get_attribute("class"))
        
        # Click teacher button and check toggle
        teacher_button.click()
        self.assertTrue("active" in teacher_button.get_attribute("class"))
        self.assertFalse("active" in student_button.get_attribute("class"))

        # Click student button again and check toggle
        student_button.click()
        self.assertTrue("active" in student_button.get_attribute("class"))
        self.assertFalse("active" in teacher_button.get_attribute("class"))

    def test_email_validation(self):
        driver = self.driver
        email_input = driver.find_element(By.NAME, "email")
        submit_button = driver.find_element(By.CSS_SELECTOR, ".submit-button")

        # Enter invalid email and submit form
        email_input.send_keys("invalidemail")
        submit_button.click()

        # Wait for email error message
        try:
            email_error = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CSS_SELECTOR, ".error-message"))
            )
            self.assertEqual(email_error.text, "Please enter a valid email address")
        except TimeoutException:
            # Capture and print any visible error messages for debugging
            errors = driver.find_elements(By.CSS_SELECTOR, ".error-message")
            error_texts = [error.text for error in errors]
            print(f"Error messages found: {error_texts}")
            self.fail("Email validation error message did not appear as expected.")

    def test_password_match_validation(self):
        driver = self.driver
        password_input = driver.find_element(By.NAME, "password")
        confirm_password_input = driver.find_element(By.NAME, "confirmPassword")
        submit_button = driver.find_element(By.CSS_SELECTOR, ".submit-button")

        # Enter non-matching passwords and submit
        password_input.send_keys("password123")
        confirm_password_input.send_keys("password321")
        submit_button.click()

        # Wait for password error message
        password_error = WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".error-message"))
        )
        self.assertEqual(password_error.text, "Passwords do not match")

        # Enter matching passwords
        confirm_password_input.clear()
        confirm_password_input.send_keys("password123")
        self.assertFalse(driver.find_elements(By.CSS_SELECTOR, ".error-message"))

    def test_successful_signup(self):
        driver = self.driver

        # Fill in form fields with valid data
        driver.find_element(By.NAME, "firstName").send_keys("John")
        driver.find_element(By.NAME, "lastName").send_keys("Doe")
        driver.find_element(By.NAME, "email").send_keys("john.doe@example.com")
        driver.find_element(By.NAME, "password").send_keys("password123")
        driver.find_element(By.NAME, "confirmPassword").send_keys("password123")

        # Submit form
        submit_button = driver.find_element(By.CSS_SELECTOR, ".submit-button")
        submit_button.click()

        # Check for success toast notification
        try:
            success_toast = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CSS_SELECTOR, ".toast"))
            )
            self.assertIn("Signup successful!", success_toast.text)
        except TimeoutException:
            self.fail("Success toast did not appear - signup may have failed.")

    @classmethod
    def tearDownClass(cls):
        # Close the browser once all tests are complete
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
