import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/firebaseConfig';
import './AddContentModal.css'; 

// Modal component for adding or editing course content
function AddContentModal({ onClose, onSave, initialContent }) {
  // Initialize state for content fields and upload tracking
  const [contentNo, setContentNo] = useState(initialContent?.contentNo || '');
  const [title, setTitle] = useState(initialContent?.title || '');
  const [subtitle, setSubtitle] = useState(initialContent?.subtitle || '');
  const [fileUrl, setFileUrl] = useState(initialContent?.fileUrl || '');
  const [videoUrl, setVideoUrl] = useState(initialContent?.videoUrl || '');
  const [assignmentUrl, setAssignmentUrl] = useState(initialContent?.assignmentUrl || '');
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [assignmentUploadProgress, setAssigmentUploadProgress] = useState(0);

  // Handlers for file input changes
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleVideoChange = (e) => setVideo(e.target.files[0]);
  const handleAssignmentChange = (e) => setAssignment(e.target.files[0]);

  // Helper function to upload a file to Firebase and track progress
  const uploadToFirebase = (file, path, setUrlCallback, setProgressCallback) => {
    const storageRef = ref(storage, path); // Reference to Firebase storage path
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Calculate and update upload progress percentage
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressCallback(progress); 
      },
      (error) => console.error('Upload error:', error), // Log any errors during upload
      async () => {
        // On successful upload, retrieve the file's download URL
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setUrlCallback(url); // Set the URL in state
        setProgressCallback(0); // Reset progress after completion
      }
    );
  };

  // Trigger file upload and set file URL in state
  const handleFileUpload = () => {
    if (file) {
      uploadToFirebase(
        file,
        `course_content/files/${file.name}`,
        setFileUrl,
        setFileUploadProgress
      );
    }
  };

  // Trigger video upload and set video URL in state
  const handleVideoUpload = () => {
    if (video) {
      uploadToFirebase(
        video,
        `course_content/videos/${video.name}`,
        setVideoUrl,
        setVideoUploadProgress
      );
    }
  };

  // Trigger assignment upload and set assignment URL in state
  const handleAssignmentUpload = () => {
    if (assignment) {
      uploadToFirebase(
        assignment,
        `course_content/assignment/${assignment.name}`,
        setAssignmentUrl,
        setAssigmentUploadProgress
      );
    }
  };

  // Handle saving the content data and closing the modal
  const handleSave = () => {
    const newContent = {
      contentNo,
      title,
      subtitle,
      fileUrl,
      videoUrl,
      assignmentUrl
    };

    // Ensure required fields are filled before saving
    if (!contentNo || !title || !subtitle) {
      console.error("All fields must be filled.");
      return;
    }

    onSave(newContent); // Send data to parent component
    onClose(); // Close the modal
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{initialContent ? 'Edit Content' : 'Add Content'}</h3>
        
        {/* Input field for content number */}
        <label>
          Content No:
          <input type="text" value={contentNo} onChange={(e) => setContentNo(e.target.value)} />
        </label>

        {/* Input field for title */}
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        {/* Input field for subtitle */}
        <label>
          Subtitle:
          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </label>

        {/* File upload section with progress tracking */}
        <label>
          Upload File:
          <div className="upload-section">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload File</button>
          </div>
          {fileUploadProgress > 0 && (
            <p className="upload-progress">File Upload Progress: {Math.round(fileUploadProgress)}%</p>
          )}
        </label>

        {/* Video upload section with progress tracking */}
        <label>
          Upload Video:
          <div className="upload-section">
            <input type="file" onChange={handleVideoChange} />
            <button onClick={handleVideoUpload}>Upload Video</button>
          </div>
          {videoUploadProgress > 0 && (
            <p className="upload-progress">Video Upload Progress: {Math.round(videoUploadProgress)}%</p>
          )}
        </label>

        {/* Assignment upload section with progress tracking */}
        <label>
          Upload Assignment:
          <div className="upload-section">
            <input type="file" onChange={handleAssignmentChange} />
            <button onClick={handleAssignmentUpload}>Upload Assignment</button>
          </div>
          {assignmentUploadProgress > 0 && (
            <p className="upload-progress">Assignment Upload Progress: {Math.round(assignmentUploadProgress)}%</p>
          )}
        </label>
        
        {/* Save and Cancel buttons */}
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default AddContentModal;
