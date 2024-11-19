import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../../firebase/firebaseConfig';
import { saveSyllabus } from '../../../services/apiService';

// Component for uploading syllabus files with a modal interface
function UploadModal({ onClose, onUploadComplete, courseId, teacherId }) {
  const [file, setFile] = useState(null); // State to store selected file
  const [isUploading, setIsUploading] = useState(false); // Tracks upload status
  const [progress, setProgress] = useState(0); // Tracks upload progress as a percentage

  // Handles file selection from input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file in state
  };

  // Initiates file upload to Firebase Storage
  const handleUpload = () => {
    if (!file) return; // Return if no file is selected

    setIsUploading(true); // Set uploading state to true
    const storageRef = ref(storage, `syllabus/${courseId}_${teacherId}/${file.name}`); // Define storage path
    const uploadTask = uploadBytesResumable(storageRef, file); // Create resumable upload task

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate and update upload progress percentage
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        // Handle any errors during upload
        console.error("Upload error:", error);
        setIsUploading(false);
      },
      async () => {
        // On successful upload, get file download URL from Firebase
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Save the file URL to the database through an API call
        await saveSyllabus(courseId, teacherId, url);

        // Notify parent component of successful upload completion
        onUploadComplete(url, file.name);
        setIsUploading(false); // Reset uploading state
        onClose(); // Close the modal
      }
    );
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Upload Syllabus</h3>
        {/* File input to select syllabus file */}
        <input type="file" onChange={handleFileChange} />
        
        {/* Upload button, disabled if no file is selected or if already uploading */}
        <button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? `Uploading... ${progress}%` : "Upload"}
        </button>
        
        {/* Cancel button to close the modal without uploading */}
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default UploadModal;
