import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager

class TestLoginComponent(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        cls.driver.get("http://localhost:3000/login")

    def test_login_success(self):
        driver = self.driver

        # Locate and fill email and password fields
        email_input = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        email_input.send_keys("test@example.com")
        password_input.send_keys("password123")

        # Submit the form
        submit_button = driver.find_element(By.CSS_SELECTOR, ".login-button")
        submit_button.click()

        # Increase wait time and handle redirection
        try:
            WebDriverWait(driver, 20).until(
                lambda d: d.current_url.endswith("/teacherDashboard") or d.current_url.endswith("/studentDashboard")
            )
            current_url = driver.current_url
            self.assertIn(current_url, ["/teacherDashboard", "/studentDashboard"], "Failed to navigate to dashboard")
        except TimeoutException:
            self.fail("Login redirection timed out - login may have failed or URL did not redirect as expected.")

    def test_login_failure(self):
        driver = self.driver

        # Enter incorrect credentials
        email_input = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        email_input.clear()
        password_input.clear()
        email_input.send_keys("invalid@example.com")
        password_input.send_keys("wrongpassword")

        # Submit the form
        submit_button = driver.find_element(By.CSS_SELECTOR, ".login-button")
        submit_button.click()

        # Wait for error message to appear
        error_message = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".error-message"))
        )

        # Validate error message
        self.assertIn("Invalid email or password", error_message.text)

    def test_input_fields_exist(self):
        driver = self.driver

        # Check email and password fields
        email_input = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        self.assertTrue(email_input.is_displayed(), "Email input field is not displayed")
        self.assertTrue(password_input.is_displayed(), "Password input field is not displayed")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
