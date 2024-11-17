import React, { useState, useEffect } from 'react';
import { getCourseContent, saveCourseDescription, getSyllabus, saveSyllabus } from '../../../services/apiService';
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

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !teacherId) {
        console.error("courseId or teacherId is undefined");
        return;
      }

      try {
        // Fetch syllabus file path if it exists
        const syllabusResponse = await getSyllabus(courseId, teacherId);
        if (syllabusResponse?.fileUrl) {
          setSyllabusUrl(syllabusResponse.fileUrl);
          setFileName('Syllabus');  // Set a default name for the file link
        } else {
          setSyllabusUrl('');
          setFileName('');
        }

        // Fetch the course description
        const descriptionResponse = await getCourseContent(courseId, teacherId, 'course description');
        if (descriptionResponse?.content) {
          setDescription(descriptionResponse.content.text || '');
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchData();
  }, [courseId, teacherId, navigate]);

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

      <h2>Course Content</h2>
    </div>
  );
}

export default CourseContent;
