import React, { useState, useEffect, useCallback } from 'react';
import { getCourseContentData, getCourseContent, saveCourseContentData, saveCourseDescription, getSyllabus, saveSyllabus } from '../../../services/apiService';
import './CourseContent.css';
import { useLocation, useNavigate, Link , useParams} from 'react-router-dom';
import UploadModal from './UploadModal';
import AddContentModal from './AddContentModal';

function CourseContent() {
  const { courseId: courseIdParam, teacherId: teacherIdParam } = useParams();
  const location = useLocation(); // Access location state for course details
  const navigate = useNavigate(); // Navigation hook for routing
  // const { courseId, teacherId, courseName } = location.state || {}; // Extract course info from state
  // Retrieve courseId, teacherId, and courseName from location.state or URL parameters as fallback
  const courseId = location.state?.courseId || courseIdParam;
  const teacherId = location.state?.teacherId || teacherIdParam;
  const courseName = location.state?.courseName || localStorage.getItem("courseName") || "Course";
  //

  // State variables for managing course content, syllabus, and UI interactions
  const [syllabusUrl, setSyllabusUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // States for course content management
  const [courseContents, setCourseContents] = useState([]); // Holds JSON blocks of course content
  const [showAddContentModal, setShowAddContentModal] = useState(false); // Controls add/edit modal visibility
  const [editingContent, setEditingContent] = useState(null); // Stores content block being edited

  // Fetches syllabus, course description, and course content data from the server
  const fetchData = useCallback(async () => {
    console.log(courseName)
    console.log(courseId, teacherId);
    if (!courseId || !teacherId) {
      console.error("courseId or teacherId is undefined");
      return;
    }

    try {
      // Fetch syllabus URL if it exists
      const syllabusResponse = await getSyllabus(courseId, teacherId);
      if (syllabusResponse?.fileUrl) {
        setSyllabusUrl(syllabusResponse.fileUrl);
        setFileName('Syllabus'); // Default name for syllabus file
      } else {
        setSyllabusUrl('');
        setFileName('');
      }

      // Fetch the course description
      const descriptionResponse = await getCourseContent(courseId, teacherId, 'course description');
      if (descriptionResponse?.content) {
        setDescription(descriptionResponse.content.text || '');
      }

      // Fetch JSON blocks for course content
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

        // Set unique content data to state
        setCourseContents(uniqueContentData);
        console.log("Updated course contents with unique data:", uniqueContentData);
      }
      
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  }, [courseId, teacherId]);

  // Run fetchData on initial render and when courseId or teacherId changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Opens the modal to add a new course description
  const handleAddDescription = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  // Opens the modal to edit the existing course description
  const handleEditDescription = () => {
    setIsEdit(true);
    setShowModal(true);
  };

  // Closes the description modal
  const handleModalClose = () => {
    setShowModal(false);
  };

  // Saves the course description to the database
  const handleSaveDescription = async () => {
    await saveCourseDescription(courseId, teacherId, description);
    setShowModal(false);
  };

  // Updates the syllabus URL in the state and database after file upload
  const handleUploadComplete = async (url, name) => {
    setSyllabusUrl(url);
    setFileName(name);
    setSuccessMessage("File uploaded successfully!");

    // Save the syllabus URL in the database
    await saveSyllabus({
      courseId,
      teacherId,
      fileUrl: url,
    });

    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Opens the modal to add new course content
  const handleAddContent = () => {
    setEditingContent(null); // Reset editing content to add new content
    setShowAddContentModal(true);
  };

  // Opens the modal to edit an existing content block
  const handleEditContent = (content) => {
    setEditingContent(content); // Set content block to be edited
    setShowAddContentModal(true);
  };

  // Saves or updates a course content JSON block in state and database
  const handleSaveContent = async (newContent) => {
    const teacherIdToUse = teacherId || localStorage.getItem('teacherId');
    
    const dataToSave = {
      courseId,
      teacherId: teacherIdToUse,
      contentName: 'course content',
      content: newContent,
    };
  
    console.log("Data being sent to saveCourseContentData:", dataToSave);
  
    try {
      const response = await saveCourseContentData(dataToSave);
      console.log("Course content saved successfully:", response);
  
      // Update the state with the new content
      setCourseContents((prevContents) => [...prevContents, newContent]);
      fetchData(); // Optionally, re-fetch data to update the view
    } catch (error) {
      console.error("Failed to save course content data:", error);
    }
  };
  
  useEffect(() => {
    console.log("Location state:", location.state);
  }, [location.state]);
  

  
  return (
    <div className="course-content-container">
      <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        {courseName}
      </h1>
      
      {/* Course Description Section */}
      <h2>Course Description</h2>
      {description ? (
        <div>
          <p>{description}</p>
          <button onClick={handleEditDescription}>Edit</button>
        </div>
      ) : (
        <button onClick={handleAddDescription}>Add Description</button>
      )}
      
      {/* Modal for adding/editing course description */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? 'Edit Description' : 'Add Description'}</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description"
            />
            <div className="button-container">
              <button onClick={handleSaveDescription}>OK</button>
              <button onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}
  
      {/* Syllabus Section */}
      <h2>Syllabus</h2>
      {syllabusUrl ? (
        <p>
          <a href={syllabusUrl} target="_blank" rel="noopener noreferrer" >
            {fileName || 'Download Syllabus'}
          </a>
        </p>
      ) : (
        <p>No syllabus uploaded yet.</p>
      )}
      <button onClick={() => setShowUploadModal(true)}>
        {syllabusUrl ? "Replace Syllabus" : "Upload Syllabus"}
      </button>

      {/* Upload modal for syllabus */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
          courseId={courseId}
          teacherId={teacherId}
        />
      )}
      {successMessage && <p className="success-message">{successMessage}</p>}
  
      {/* Course Content Section */}
      <h2>Course Content</h2>
      <button onClick={handleAddContent} style={{ marginBottom: '10px' }}>Add Content</button>
      {courseContents.map((content, index) => (
        <div key={`${content.contentNo}-${index}`} className="content-item">
          <h3>{content.title || 'No Title Available'}</h3>
          <p>{content.subtitle || 'No Subtitle Available'}</p>
          
          {/* Conditional links for downloadable content */}
          {content.fileUrl && (
            <div>
              <a href={content.fileUrl} target="_blank" rel="noopener noreferrer" className="link-button">
                Download File
              </a>
            </div>
          )}
          
          {content.videoUrl && (
            <div>
              <a href={content.videoUrl} target="_blank" rel="noopener noreferrer" className="link-button">
                Watch Video
              </a>
            </div>
          )}

          {content.assignmentUrl && (
            <div>
              <a href={content.assignmentUrl} target="_blank" rel="noopener noreferrer" className="link-button"> 
                Assignment 
              </a>
            </div>
          )}
          
          {/* Edit button for each content block */}
          <button onClick={() => handleEditContent(content)}>Edit</button>
        </div>
      ))}

      {/* Add/Edit Content Modal */}
      {showAddContentModal && (
        <AddContentModal
          onClose={() => setShowAddContentModal(false)}
          onSave={handleSaveContent}
          initialContent={editingContent}
        />
      )}
    </div>
  );
}

export default CourseContent;
