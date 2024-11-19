import json
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

def execute_query(query, values):
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="flavorsacademy"
    )
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute(query, values)
        db.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        db.close()

# Function to fetch data
def fetch_data(query, values):
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="flavorsacademy"
    )
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute(query, values)
        result = cursor.fetchall()
        return result
    finally:
        cursor.close()
        db.close()




@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    role = data.get('role')  # 'student' or 'teacher'
    hashed_password = generate_password_hash(password)
    print("role",role)
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
        print("inside teacher")
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
    content_name = request.args.get('courseContent')
    print(course_id, teacher_id, content_name)
    if not course_id or not teacher_id:
        return jsonify({"message": "Course ID and Teacher ID are required"}), 400

    query = """
        SELECT * FROM course_content
        WHERE cid = %s AND tid = %s AND content_name = %s
    """
    content = fetch_data(query, (course_id, teacher_id, content_name))
    print(content)
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
    print("cid, tid, cc, content", course_id, teacher_id, content_name, text)
    if not course_id or not teacher_id:
        return jsonify({"message": "Course ID and Teacher ID are required"}), 400

    if not content_name or not text:
        return jsonify({"message": "Content Name and Text are required"}), 400

    # Check if a specific content already exists based on cid, tid, and content_name
    existing_content = fetch_data(
        "SELECT idcourse_content FROM course_content WHERE cid = %s AND tid = %s AND content_name = %s",
        (course_id, teacher_id, content_name)
    )

    if existing_content:
        # Get idcourse_content from the existing record
        idcourse_content = existing_content[0]['idcourse_content']
        
        # Update the existing content using idcourse_content
        execute_query(
            "UPDATE course_content SET text = %s WHERE idcourse_content = %s",
            (text, idcourse_content)
        )
        message = "Content updated successfully"
    else:
        # Insert a new entry if no content exists with the specified content_name
        execute_query(
            "INSERT INTO course_content (cid, tid, content_name, text) VALUES (%s, %s, %s, %s)",
            (course_id, teacher_id, content_name, text)
        )
        message = "Content created successfully"

    return jsonify({"message": message}), 200


@app.route('/syllabus', methods=['GET', 'POST'])
def handle_syllabus():
    course_id = request.args.get('courseId') if request.method == 'GET' else request.json.get('courseId')
    teacher_id = request.args.get('teacherId') if request.method == 'GET' else request.json.get('teacherId')
    content_name = "syllabus"

    if not course_id or not teacher_id:
        return jsonify({"message": "Course ID and Teacher ID are required"}), 400

    if request.method == 'GET':
        try:
            query = """
                SELECT text FROM course_content 
                WHERE cid = %s AND tid = %s AND content_name = %s
            """
            content = fetch_data(query, (course_id, teacher_id, content_name))
            
            file_url = content[0]['text'] if content else ""  # Return empty if no syllabus entry exists
            return jsonify({"fileUrl": file_url}), 200
        except Exception as e:
            print(f"Error fetching syllabus: {e}")
            return jsonify({"message": "Error fetching syllabus"}), 500

    elif request.method == 'POST':
        file_url = request.json.get('fileUrl')  # URL of the uploaded file
        if not file_url:
            return jsonify({"message": "File URL is required"}), 400

        try:
            existing_content = fetch_data(
                "SELECT idcourse_content FROM course_content WHERE cid = %s AND tid = %s AND content_name = %s",
                (course_id, teacher_id, content_name)
            )

            if existing_content:
                execute_query(
                    "UPDATE course_content SET text = %s WHERE cid = %s AND tid = %s AND content_name = %s",
                    (file_url, course_id, teacher_id, content_name)
                )
                message = "Syllabus updated successfully"
            else:
                execute_query(
                    "INSERT INTO course_content (cid, tid, content_name, text) VALUES (%s, %s, %s, %s)",
                    (course_id, teacher_id, content_name, file_url)
                )
                message = "Syllabus uploaded successfully"

            return jsonify({"message": message}), 200
        except Exception as e:
            print(f"Error saving syllabus: {e}")
            return jsonify({"message": "Error saving syllabus"}), 500

@app.route('/courseContentHandler', methods=['GET', 'POST'])
def handle_course_content():
    course_id = request.args.get('courseId') if request.method == 'GET' else request.json.get('courseId')
    teacher_id = request.args.get('teacherId') if request.method == 'GET' else request.json.get('teacherId')
    print("sdfhaiurehf", course_id ,  teacher_id)
    content_name = 'course content'
     
    if not course_id or not teacher_id:
        return jsonify({"message": "Course ID and Teacher ID are required"}), 400

    # Handle GET request: retrieve course content
    if request.method == 'GET':
        try:
            content = fetch_data(
                "SELECT text FROM course_content WHERE cid = %s AND tid = %s AND content_name = %s", 
                (course_id, teacher_id, content_name)
            )

            if content:
                # Parse and return JSON data if content exists
                return jsonify({"contentData": json.loads(content[0]['text'])}), 200
            else:
                # Return empty string if no content exists
                return jsonify({"contentData": ""}), 200
        except Exception as e:
            print(f"Error fetching course content: {e}")
            return jsonify({"message": "Error fetching course content"}), 500

    # Handle POST request: save or update course content
    elif request.method == 'POST':
        new_content = request.json.get('content')  # New content to be appended

        if not new_content:
            return jsonify({"message": "Content data is required"}), 400

        try:
            # Check if existing course content exists
            existing_content = fetch_data(
                "SELECT text FROM course_content WHERE cid = %s AND tid = %s AND content_name = %s",
                (course_id, teacher_id, content_name)
            )

            if existing_content:
                # Append new content to existing JSON array
                existing_json = json.loads(existing_content[0]['text']) if existing_content[0]['text'] else []
                existing_json.append(new_content)
                updated_text = json.dumps(existing_json)
                
                # Update course content in the database
                execute_query(
                    "UPDATE course_content SET text = %s WHERE cid = %s AND tid = %s AND content_name = %s",
                    (updated_text, course_id, teacher_id, content_name)
                )
                message = "Course content updated successfully"
            else:
                # Insert new JSON array with content if none exists
                content_json = json.dumps([new_content])
                execute_query(
                    "INSERT INTO course_content (cid, tid, content_name, text) VALUES (%s, %s, %s, %s)",
                    (course_id, teacher_id, content_name, content_json)
                )
                message = "Course content added successfully"

            return jsonify({"message": message}), 200
        except Exception as e:
            print(f"Error saving course content: {e}")
            return jsonify({"message": "Error saving course content"}), 500
        
# 1. Get all courses

@app.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        query = "SELECT * FROM course"
        courses = fetch_data(query, ())

        # Ensure that `sid` is treated as JSON if it's a string, or set it to an empty list if not available
        for course in courses:
            sid = course.get('sid')
            if isinstance(sid, str):
                # Parse sid only if it's a valid JSON string
                try:
                    course['sid'] = json.loads(sid)
                except json.JSONDecodeError:
                    course['sid'] = []
            else:
                # If sid is not a string, set it to an empty list or handle it accordingly
                course['sid'] = [] if sid is None else [sid]

        return jsonify(courses), 200
    except Exception as e:
        print(f"Error fetching courses: {e}")
        return jsonify({"message": "Error fetching courses"}), 500



# 2. Get specific course details by course ID
@app.route('/api/courses/<int:idcourse>', methods=['GET'])
def get_course(idcourse):
    try:
        query = "SELECT * FROM course WHERE idcourse = %s"
        course = fetch_data(query, (idcourse))
        print(course)
        if not course:
            return jsonify({"message": "Course not found"}), 404

        course[0]['sid'] = json.loads(course[0]['sid']) if course[0]['sid'] else []
        return jsonify(course[0]), 200
    except Exception as e:
        print(f"Error fetching course: {e}")
        return jsonify({"message": "Error fetching course"}), 500

# 3. Enroll a student in a course
@app.route('/api/courses/<int:idcourse>/enroll', methods=['PUT'])
def enroll_student(idcourse):
    data = request.get_json()
    student_id = data.get("student_id")

    if not student_id:
        return jsonify({"message": "student_id is required"}), 400

    try:
        # Fetch the current sid for the course
        course = fetch_data("SELECT sid FROM course WHERE idcourse = %s", (idcourse,))
        
        if not course:
            return jsonify({"message": "Course not found"}), 404

        # Check if sid is already populated
        current_sid = course[0]['sid']
        
        if current_sid:
            # If sid exists and matches the student ID, prevent duplicate enrollment
            if current_sid == str(student_id):
                return jsonify({"message": "Student already enrolled"}), 400
            else:
                # Sid already has a value (another student), return success
                return jsonify({"message": "A new row will be created for this student enrollment."}), 200
        else:
            # If sid is empty, add this student as the first enrolled student
            execute_query("UPDATE course SET sid = %s WHERE idcourse = %s", (student_id, idcourse))
            return jsonify({"message": "Student enrolled successfully"}), 200
    except Exception as e:
        print(f"Error enrolling student: {e}")
        return jsonify({"message": "Error enrolling student"}), 500


# 4. Get teacher details by ID
@app.route('/api/teachers/<int:tid>', methods=['GET'])
def get_teacher(tid):
    # Check if tid is non-zero and a valid identifier
    if not tid:
        return jsonify({"message": "Invalid teacher ID"}), 400

    try:
        query = "SELECT idteacher, firstname, lastname, email FROM teacher WHERE idteacher = %s"
        teacher = fetch_data(query, (tid,))
        
        if not teacher:
            return jsonify({"message": "Teacher not found"}), 404
        
        return jsonify(teacher[0]), 200

    except Exception as e:
        print(f"Error fetching teacher details: {e}")
        return jsonify({"message": "Error fetching teacher details"}), 500
    








if __name__ == '__main__':
    app.run(debug=True)
