import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/firebaseConfig';
import './AddContentModal.css'; 
function AddContentModal({ onClose, onSave, initialContent }) {
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
  const [assignmentUploadProgress,  setAssigmentUploadProgress] = useState(0);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleVideoChange = (e) => setVideo(e.target.files[0]);
  const handleAssignmentChange = (e) => setAssignment(e.target.files[0]);
  const uploadToFirebase = (file, path, setUrlCallback, setProgressCallback) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressCallback(progress); // Update progress
      },
      (error) => console.error('Upload error:', error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setUrlCallback(url);
        setProgressCallback(0); // Reset progress after completion
      }
    );
  };

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

  const handleSave = () => {
    const newContent = {
      contentNo,
      title,
      subtitle,
      fileUrl,
      videoUrl,
      assignmentUrl
    };

    // Check if all fields are filled
    if (!contentNo || !title || !subtitle) {
      console.error("All fields must be filled.");
      return;
    }

    onSave(newContent); // Send data to CourseContent component
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{initialContent ? 'Edit Content' : 'Add Content'}</h3>
        <label>
          Content No:
          <input type="text" value={contentNo} onChange={(e) => setContentNo(e.target.value)} />
        </label>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Subtitle:
          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </label>
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
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default AddContentModal;
