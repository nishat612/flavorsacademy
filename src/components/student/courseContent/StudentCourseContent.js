import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCourseContentData, getTeacherDetails, getCourseContent } from '../../../services/apiService';
import './StudentCourseContent.css';

// Component for displaying course content and instructor information for students
function StudentCourseContent() {
  const location = useLocation(); // Access location state for course details
  const { courseId, teacherId, courseName } = location.state || {}; // Destructure course and teacher details from state

  // State variables to store course content, teacher information, and course description
  const [courseContents, setCourseContents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [courseDescription, setCourseDescription] = useState('');

  // Fetch course content, teacher details, and course description on component mount
  useEffect(() => {
    const fetchContent = async () => {
      // Ensure courseId and teacherId are provided
      if (!courseId || !teacherId) {
        console.error("Course ID or Teacher ID is missing");
        return;
      }
      try {
        // Fetch course content data
        const contentResponse = await getCourseContentData(courseId, teacherId);

        if (contentResponse?.contentData) {
          // Flatten nested content data and remove duplicates based on `contentNo`
          const flattenedContentData = contentResponse.contentData.flat(Infinity);
          const uniqueContentData = flattenedContentData.reduce((acc, current) => {
            const duplicate = acc.find((item) => item.contentNo === current.contentNo);
            if (!duplicate) {
              acc.push(current);
            }
            return acc;
          }, []);

          // Update state with unique course content data
          setCourseContents(uniqueContentData);
          console.log("Updated course contents with unique data:", uniqueContentData);
        }

        // Fetch teacher details
        const teacherResponse = await getTeacherDetails(teacherId);
        if (teacherResponse) {
          setTeacher(teacherResponse);
        }

        // Fetch course description content
        const descriptionResponse = await getCourseContent(courseId, teacherId, 'course description');
        if (descriptionResponse && descriptionResponse.content) {
          setCourseDescription(descriptionResponse.content.text || 'No description available');
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchContent(); // Call fetchContent to retrieve data
  }, [courseId, teacherId]);

  // Helper function to extract and decode file name from a URL
  const extractFileName = (url) => {
    return url ? decodeURIComponent(url.split('/').pop().split('?')[0]) : '';
  };

  return (
    <div className="student-course-content-container">
      <h1>{courseName || 'Course Name Unavailable'}</h1>

      {/* Display teacher information if available */}
      {teacher && (
        <div className="teacher-info">
          <h2>Instructor Information</h2>
          <p><strong>Teacher:</strong> {teacher.firstname} {teacher.lastname}</p>
          <p><strong>Email:</strong> {teacher.email}</p>
        </div>
      )}

      {/* Display course description */}
      <h2>Course Description</h2>
      <p>{courseDescription}</p>

      {/* Display course content items if available */}
      <h2>Course Content</h2>
      {courseContents.length > 0 ? (
        courseContents.map((content, index) => (
          <div key={index} className="content-item">
            <h3>Content #{content.contentNo || 'N/A'}</h3>
            <p><strong>Title: </strong> {content.title || 'Untitled'}</p>
            <p><strong>Subtitle: </strong> {content.subtitle || 'No subtitle available'}</p>
            
            {/* Display file link if available */}
            {content.fileUrl && (
              <p><strong>File: </strong> 
                <a href={content.fileUrl} target="_blank" rel="noopener noreferrer">
                  Lesson {content.contentNo}
                </a>
              </p>
            )}
            
            {/* Display video link if available */}
            {content.videoUrl && (
              <p><strong>Video: </strong> 
                <a href={content.videoUrl} target="_blank" rel="noopener noreferrer">
                  Lesson {content.contentNo} Video
                </a>
              </p>
            )}

            {/* Display assignment link if available */}
            {content.assignmentUrl && (
              <p><strong>Assignment: </strong> 
                <a href={content.assignmentUrl} target="_blank" rel="noopener noreferrer">
                  Lesson {content.contentNo} Assignment
                </a>
              </p>
            )}
          </div>
        ))
      ) : (
        <p>No course content available.</p> // Display if no course content found
      )}
    </div>
  );
}

export default StudentCourseContent;
