import React, { useState, useEffect } from 'react';
import { getCourseContent, saveCourseDescription, getAllCourseContent, saveCourseContent } from '../../../services/apiService';
import './CourseContent.css';
import { useLocation, useNavigate } from 'react-router-dom';
import UploadModal from './UploadModal';

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
        // Fetch the syllabus
        const syllabusResponse = await getCourseContent(courseId, teacherId, 'syllabus');
        if (syllabusResponse?.content) {
          setSyllabusUrl(syllabusResponse.content.text);
          setFileName(syllabusResponse.content.fileName || '');
        }

        // Fetch the course description
        const descriptionResponse = await getCourseContent(courseId, teacherId);
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

    // Save the uploaded file link and file name to your database
    await saveCourseContent({
      courseId,
      teacherId,
      contentName: 'syllabus',
      text: url,
      fileName: name,
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
            {fileName}
          </a>
        </p>
      ) : (
        <p>No syllabus uploaded yet.</p>
      )}
      <button onClick={() => setShowUploadModal(true)}>
        Upload Syllabus
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
    </div>
  );
}

export default CourseContent;
