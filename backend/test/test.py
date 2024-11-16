from werkzeug.security import generate_password_hash

# List of users' emails
emails = [
    "sophia.miller@example.com",
    "mason.wilson@example.com",
    "isabella.anderson@example.com",
    "ethan.taylor@example.com",
    "mia.thomas@example.com"
]

# Password to hash
plain_password = "111"

# Generate hashed passwords
hashed_passwords = {email: generate_password_hash(plain_password) for email in emails}

# Display the hashed passwords for each email
for email, hashed_password in hashed_passwords.items():
    print(f"Email: {email}, Hashed Password: {hashed_password}")
