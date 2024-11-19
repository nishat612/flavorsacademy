import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getCourseContent } from '../../../services/apiService';
import './EnrollPage.css';
function EnrollPage() {
  const location = useLocation();
  const { courseId, studentId, teacherId, courseName } = location.state || {}; // Destructure state values

  const [syllabasContent, setSyllabasContent] = useState(null);
  const [descriptionContent, setDescriptionContent] = useState(null);
  useEffect(() => {
    if (courseId && teacherId) {
      // Fetch course content, using both courseId and teacherId
      const fetchContent = async () => {
        try {
          const syllabusResponse = await getCourseContent(courseId, teacherId, 'syllabus');
          setSyllabasContent(syllabusResponse.content);

          const descriptionResponse = await getCourseContent(courseId, teacherId, 'course description');
          setDescriptionContent(descriptionResponse.content);
        } catch (error) {
          console.error('Error fetching course content:', error);
        }
      };
      fetchContent();
    } else {
      console.error('Course ID or Teacher ID is missing');
    }
  }, [courseId, teacherId]);

  if (!courseId || !teacherId) {
    return <p>Error: Missing course or teacher information.</p>;
  }

  return (
    <div>
      <h1>{courseName }</h1>
      {descriptionContent ? (
        <>
          <h2>Course Description</h2>
          {descriptionContent.text ? (
            <p>{descriptionContent.text}</p> // Display description text directly
          ) : (
            <p>No course description available.</p>
          )}
        </>
      ) : (
        <p>Loading description...</p>
      )}

      {syllabasContent ? (
        <>
          <h2>Course Syllabus</h2>
          {syllabasContent.text ? (
            <a href={syllabasContent.text} target="_blank" rel="noopener noreferrer">
              Syllabus
            </a>
          ) : (
            <p>No syllabus available.</p>
          )}
        </>
      ) : (
        <p>Loading content...</p>
      )}
    </div>
  );
}

export default EnrollPage;
