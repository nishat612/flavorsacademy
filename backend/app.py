from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
app = Flask(__name__)
app.secret_key = secrets.token_hex(16)  # Replace with a strong secret key
app.config['SESSION_TYPE'] = 'filesystem'  # Store session data on the server's filesystem
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Adjust based on your testing environment
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production over HTTPS
app.config['SESSION_PERMANENT'] = False  # Set to False to make the session non-permanent
app.config['PERMANENT_SESSION_LIFETIME'] = 0  # Session expires immediately on browser close

Session(app)

CORS(app, supports_credentials=True)  # Enable credentials to allow cookies in CORS

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="flavorsacademy"
)

# Function to execute a query and return the last inserted ID
def execute_query(query, values):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute(query, values)
        db.commit()
        return cursor.lastrowid
    finally:
        cursor.close()

# Function to fetch data
def fetch_data(query, values):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute(query, values)
        result = cursor.fetchall()
        return result
    finally:
        cursor.close()




@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    role = data.get('role')  # 'student' or 'teacher'
    hashed_password = generate_password_hash(password)

    # Insert into role-specific table
    if role == 'student':
        student_id = execute_query(
            "INSERT INTO student (firstname, lastname, email) VALUES (%s, %s, %s)",
            (first_name, last_name, email)
        )
        execute_query(
            "INSERT INTO users (sid, email, password) VALUES (%s, %s, %s)",
            (student_id, email, hashed_password)
        )
    elif role == 'teacher':
        teacher_id = execute_query(
            "INSERT INTO teacher (firstname, lastname, email) VALUES (%s, %s, %s)",
            (first_name, last_name, email)
        )
        execute_query(
            "INSERT INTO users (tid, email, password) VALUES (%s, %s, %s)",
            (teacher_id, email, hashed_password)
        )
    else:
        return jsonify({"message": "Invalid role"}), 400

    return jsonify({"message": "Signup successful"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check user credentials from the users table
    user = fetch_data("SELECT * FROM users WHERE email = %s", (email,))
    if user and check_password_hash(user[0]['password'], password):
        if user[0]['tid'] is not None:
            # Fetch the teacher's first name
            teacher = fetch_data("SELECT firstname FROM teacher WHERE idteacher = %s", (user[0]['tid'],))
            role = 'teacher'
            first_name = teacher[0]['firstname'] if teacher else ""
            user_id = user[0]['tid']
        elif user[0]['sid'] is not None:
            # Fetch the student's first name
            student = fetch_data("SELECT firstname FROM student WHERE idstudent = %s", (user[0]['sid'],))
            role = 'student'
            first_name = student[0]['firstname'] if student else ""
            user_id = user[0]['sid']
        else:
            role = 'unknown'
            first_name = ""
            user_id = None

        # Store user information in session
        session['user_id'] = user_id
        session['role'] = role
        session['first_name'] = first_name

        return jsonify({
            "message": "Login successful",
            "role": role,
            "first_name": first_name,
            "user_id": user_id
        }), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  # Clear session data on the server
    response = jsonify({"message": "Logged out"})
    response.set_cookie('session', '', expires=0)  # Clear the session cookie
    return response, 200

@app.route('/get_user_info', methods=['GET'])
def get_user_info():
    if 'user_id' in session:
        return jsonify({
            "user_id": session['user_id'],
            "role": session['role'],
            "first_name": session['first_name']
        }), 200
    else:
        return jsonify({"message": "Not logged in"}), 401

@app.route('/course', methods=['GET'])
def get_courses_for_teacher():
    # Retrieve teacher_id from the session instead of query parameters
    teacher_id = session.get('user_id') if session.get('role') == 'teacher' else None

    # Validate that the teacher ID is available
    if not teacher_id:
        return jsonify({"message": "Teacher ID is required"}), 400

    try:
        # Fetch courses associated with the given teacher ID
        print(teacher_id)
        query = """
            SELECT idcourse, name
            FROM course
            WHERE tid = %s
        """
        courses = fetch_data(query, (teacher_id,))

        # Return the list of courses as JSON
        return jsonify({"courses": courses}), 200

    except Exception as e:
        print(f"Error fetching courses for teacher {teacher_id}: {e}")
        return jsonify({"message": "Error fetching courses"}), 500
@app.route('/get_course_content', methods=['GET'])
def get_all_course_content():
    course_id = request.args.get('courseId')
    teacher_id = request.args.get('teacherId')
    print("course id, teacher id", course_id, teacher_id)
    try:
        query = "SELECT * FROM course_content"
        content_data = fetch_data(query, ())
        return jsonify({"course_content": content_data}), 200
    except Exception as e:
        print(f"Error fetching course content: {e}")
        return jsonify({"message": "Error fetching course content"}), 500    

@app.route('/courseContent', methods=['GET'])
def get_course_content():
    course_id = request.args.get('courseId')
    teacher_id = request.args.get('teacherId')

    if not course_id or not teacher_id:
        return jsonify({"message": "Course ID and Teacher ID are required"}), 400

    query = """
        SELECT * FROM course_content
        WHERE cid = %s AND tid = %s AND content_name = 'course description'
    """
    content = fetch_data(query, (course_id, teacher_id))
    
    if content:
        return jsonify({"content": content[0]})
    else:
        # Return empty string for content if not found
        return jsonify({"content": ""}), 200



@app.route('/courseContent', methods=['POST'])
def save_course_content():
    data = request.get_json()
    course_id = data.get('courseId')
    teacher_id = data.get('teacherId')
    content_name = data.get('contentName')
    text = data.get('text')

    if not course_id or not teacher_id:
        return jsonify({"message": "Course ID and Teacher ID are required"}), 400

    if not content_name or not text:
        return jsonify({"message": "Content Name and Text are required"}), 400

    # Fetch the idcourse_content if it exists for the given cid and tid
    existing_content = fetch_data(
        "SELECT idcourse_content FROM course_content WHERE cid = %s AND tid = %s",
        (course_id, teacher_id)
    )

    if existing_content:
        # Get idcourse_content from the existing record
        idcourse_content = existing_content[0]['idcourse_content']
        
        # Update the existing content using idcourse_content
        execute_query(
            "UPDATE course_content SET content_name = %s, text = %s WHERE idcourse_content = %s",
            ("course description", text, idcourse_content)
        )
        message = "Content updated successfully"
    else:
        # Insert a new entry if no content exists
        execute_query(
            "INSERT INTO course_content (cid, tid, content_name, text) VALUES (%s, %s, %s, %s)",
            (course_id, teacher_id, "course description", text)
        )
        message = "Content created successfully"

    return jsonify({"message": message}), 200

# @app.route('/courseContent', methods=['POST'])
# def save_course_content():
#     data = request.get_json()
#     course_id = data.get('courseId')
#     teacher_id = data.get('teacherId')
#     content_name = data.get('contentName')
#     text = data.get('text')
#     file_name = data.get('fileName')

#     if not course_id or not teacher_id or not content_name:
#         return jsonify({"message": "Course ID, Teacher ID, and Content Name are required"}), 400

#     # Check if the content already exists
#     existing_content = fetch_data(
#         "SELECT * FROM course_content WHERE cid = %s AND tid = %s AND content_name = %s",
#         (course_id, teacher_id, content_name)
#     )

#     if existing_content:
#         # Update existing content
#         execute_query(
#             "UPDATE course_content SET text = %s, file_name = %s WHERE cid = %s AND tid = %s AND content_name = %s",
#             (text, file_name, course_id, teacher_id, content_name)
#         )
#     else:
#         # Insert new content
#         execute_query(
#             "INSERT INTO course_content (cid, tid, content_name, text, file_name) VALUES (%s, %s, %s, %s, %s)",
#             (course_id, teacher_id, content_name, text, file_name)
#         )

#     return jsonify({"message": "Content saved successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)
