import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCourseContentData, getTeacherDetails, getCourseContent } from '../../../services/apiService';
import './StudentCourseContent.css';

function StudentCourseContent() {
  const location = useLocation();
  const { courseId, teacherId, courseName } = location.state || {};
  const [courseContents, setCourseContents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [courseDescription, setCourseDescription] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      if (!courseId || !teacherId) {
        console.error("Course ID or Teacher ID is missing");
        return;
      }
      try {
        const contentResponse = await getCourseContentData(courseId, teacherId);

        if (contentResponse?.contentData) {
          // Flatten the content data to ensure it's a single-level array
          const flattenedContentData = contentResponse.contentData.flat(Infinity);

          // Remove duplicates based on `contentNo`
          const uniqueContentData = flattenedContentData.reduce((acc, current) => {
            const duplicate = acc.find((item) => item.contentNo === current.contentNo);
            if (!duplicate) {
              acc.push(current);
            }
            return acc;
          }, []);

          // Set unique content data to the state
          setCourseContents(uniqueContentData);
          console.log("Updated course contents with unique data:", uniqueContentData);
        }

        const teacherResponse = await getTeacherDetails(teacherId);
        if (teacherResponse) {
          setTeacher(teacherResponse);
        }

        // Fetch course description
        const descriptionResponse = await getCourseContent(courseId, teacherId, 'course description');
        if (descriptionResponse && descriptionResponse.content) {
          setCourseDescription(descriptionResponse.content.text || 'No description available');
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchContent();
  }, [courseId, teacherId]);

  const extractFileName = (url) => {
    return url ? decodeURIComponent(url.split('/').pop().split('?')[0]) : '';
  };

  return (
    <div className="student-course-content-container">
      <h1>{courseName || 'Course Name Unavailable'}</h1>

      {teacher && (
        <div className="teacher-info">
          <h2>Instructor Information</h2>
          <p><strong>Teacher:</strong> {teacher.firstname} {teacher.lastname}</p>
          <p><strong>Email:</strong> {teacher.email}</p>
        </div>
      )}

      <h2>Course Description</h2>
      <p>{courseDescription}</p>

      <h2>Course Content</h2>
      {courseContents.length > 0 ? (
        courseContents.map((content, index) => (
          <div key={index} className="content-item">
            <h3>Content #{content.contentNo || 'N/A'}</h3>
            <p><strong>Title: </strong> {content.title || 'Untitled'}</p>
            <p><strong>Subtitle: </strong> {content.subtitle || 'No subtitle available'}</p>
            
            {content.fileUrl && (
              <p><strong>File: </strong> 
                <a href={content.fileUrl} target="_blank" rel="noopener noreferrer">
                  Lesson {content.contentNo}
                </a>
              </p>
            )}
            
            {content.videoUrl && (
              <p><strong>Video: </strong> 
                <a href={content.videoUrl} target="_blank" rel="noopener noreferrer">
                  Lesson {content.contentNo} Video
                </a>
              </p>
            )}

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
        <p>No course content available.</p>
      )}
    </div>
  );
}

export default StudentCourseContent;
