import React, { useState, useEffect, useCallback } from 'react';
import { getCourseContentData, getCourseContent, saveCourseContentData, saveCourseDescription, getSyllabus, saveSyllabus } from '../../../services/apiService';
import './CourseContent.css';
import { useLocation, useNavigate } from 'react-router-dom';
import UploadModal from './UploadModal';
import AddContentModal from './AddContentModal';

function CourseContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId, teacherId, courseName } = location.state || {};

  const [syllabusUrl, setSyllabusUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // New states for course content management
  const [courseContents, setCourseContents] = useState([]); // Store course content as JSON blocks
  const [showAddContentModal, setShowAddContentModal] = useState(false); // Control add/edit modal visibility
  const [editingContent, setEditingContent] = useState(null); // Store content being edited

  // Fetch all course-related data
  const fetchData = useCallback(async () => {
    if (!courseId || !teacherId) {
      console.error("courseId or teacherId is undefined");
      return;
    }

    try {
      // Fetch syllabus file path if it exists
      const syllabusResponse = await getSyllabus(courseId, teacherId);
      if (syllabusResponse?.fileUrl) {
        setSyllabusUrl(syllabusResponse.fileUrl);
        setFileName('Syllabus'); // Set a default name for the file link
      } else {
        setSyllabusUrl('');
        setFileName('');
      }

      // Fetch the course description
      const descriptionResponse = await getCourseContent(courseId, teacherId, 'course description');
      if (descriptionResponse?.content) {
        setDescription(descriptionResponse.content.text || '');
      }

      // Fetch the course content JSON blocks
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
      
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  }, [courseId, teacherId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddDescription = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEditDescription = () => {
    setIsEdit(true);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSaveDescription = async () => {
    await saveCourseDescription(courseId, teacherId, description);
    setShowModal(false);
  };

  const handleUploadComplete = async (url, name) => {
    setSyllabusUrl(url);
    setFileName(name);
    setSuccessMessage("File uploaded successfully!");

    // Save or update the syllabus URL in the database
    await saveSyllabus({
      courseId,
      teacherId,
      fileUrl: url,
    });

    // Clear the success message after 5 seconds
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Handle opening the add content modal
  const handleAddContent = () => {
    setEditingContent(null); // Reset to add new content
    setShowAddContentModal(true);
  };

  // Handle editing an existing content block
  const handleEditContent = (content) => {
    setEditingContent(content); // Set content to be edited
    setShowAddContentModal(true);
  };

  // Save or update course content JSON block
  const handleSaveContent = async (newContent) => {
    // Update the state immediately with a callback to avoid race conditions
    setCourseContents((prevContents) => {
      const updatedContents = editingContent
        ? prevContents.map((content) =>
            content.contentNo === editingContent.contentNo ? newContent : content
          )
        : [...prevContents, newContent];
  
      // Save updated contents to the database after updating the state
      saveCourseContentData({
        courseId,
        teacherId,
        contentName: 'course content',
        contentData: updatedContents,
      }).catch((error) => console.error("Error saving course content data:", error));
  
      return updatedContents;
    });
  
    // Re-fetch data to ensure it's fully up-to-date (optional depending on sync needs)
    fetchData();
    setShowAddContentModal(false); // Close modal
  };
  



  return (
    <div className="course-content-container">
      <h1>{courseName}</h1>
      <h2>Course Description</h2>
      {description ? (
        <div>
          <p>{description}</p>
          <button onClick={handleEditDescription}>Edit</button>
        </div>
      ) : (
        <button onClick={handleAddDescription}>Add Description</button>
      )}
      
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
  
      <h2>Syllabus</h2>
      {syllabusUrl ? (
        <p>
          <a href={syllabusUrl} target="_blank" rel="noopener noreferrer">
            {fileName || 'Download Syllabus'}
          </a>
        </p>
      ) : (
        <p>No syllabus uploaded yet.</p>
      )}
      <button onClick={() => setShowUploadModal(true)}>
        {syllabusUrl ? "Replace Syllabus" : "Upload Syllabus"}
      </button>
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
          
          {content.fileUrl && (
            <div>
              <a href={content.fileUrl} target="_blank" rel="noopener noreferrer">
                Download File
              </a>
            </div>
          )}
          
          {content.videoUrl && (
            <div>
              <a href={content.videoUrl} target="_blank" rel="noopener noreferrer">
                Watch Video
              </a>
            </div>
          )}


          {content.assignmentUrl && (
                      <div>
                        <a href={content.assignmentUrl} target="_blank" rel="noopener noreferrer">
                          Assignment 
                        </a>
                      </div>
                    )}
          
          <button onClick={() => handleEditContent(content)}>Edit</button>
        </div>
      ))}



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
