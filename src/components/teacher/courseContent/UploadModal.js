
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../../firebase/firebaseConfig';


function UploadModal({ onClose, onUploadComplete, courseId, teacherId }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;

    setIsUploading(true);
    const storageRef = ref(storage, `syllabus/${courseId}_${teacherId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        setIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          onUploadComplete(url, file.name);  // Call the callback with URL and filename
          setIsUploading(false);
          onClose();  // Close the modal
        });
      }
    );
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Upload Syllabus</h3>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? `Uploading... ${progress}%` : "Upload"}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default UploadModal;
