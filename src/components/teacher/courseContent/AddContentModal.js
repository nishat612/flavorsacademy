import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/firebaseConfig';

function AddContentModal({ onClose, onSave, initialContent }) {
  const [contentNo, setContentNo] = useState(initialContent?.contentNo || '');
  const [title, setTitle] = useState(initialContent?.title || '');
  const [subtitle, setSubtitle] = useState(initialContent?.subtitle || '');
  const [fileUrl, setFileUrl] = useState(initialContent?.fileUrl || '');
  const [videoUrl, setVideoUrl] = useState(initialContent?.videoUrl || '');
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleVideoChange = (e) => setVideo(e.target.files[0]);

  const uploadToFirebase = (file, path, setUrlCallback) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => console.error('Upload error:', error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setUrlCallback(url);
      }
    );
  };

  const handleSave = () => {
    const newContent = {
      contentNo,
      title,
      subtitle,
      fileUrl,
      videoUrl,
    };
    onSave(newContent);
    onClose();
  };

  const handleFileUpload = () => uploadToFirebase(file, `course_content/files/${file.name}`, setFileUrl);
  const handleVideoUpload = () => uploadToFirebase(video, `course_content/videos/${video.name}`, setVideoUrl);

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
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Upload File</button>
        </label>
        <label>
          Upload Video:
          <input type="file" onChange={handleVideoChange} />
          <button onClick={handleVideoUpload}>Upload Video</button>
        </label>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default AddContentModal;
