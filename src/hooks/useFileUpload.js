import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import apiClient from '../api/apiClient';

export const useFileUpload = (options = {}) => {
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError(`File is too large. Max size is ${options.maxSize / 1024 / 1024}MB`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError(`Invalid file type. Accepted types: ${options.accept}`);
      }
      return;
    }

    const file = acceptedFiles[0];
    
    // Create preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }

    // Upload file
    const uploadFile = async () => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await apiClient.post('/upload', formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        });
        setIsUploading(false);
        return response;
      } catch (err) {
        setError(err.message);
        setIsUploading(false);
        throw err;
      }
    };

    return uploadFile();
  }, [options]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: options.accept || 'image/*',
    maxSize: options.maxSize || 5 * 1024 * 1024, // 5MB default
    multiple: options.multiple || false,
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    progress,
    preview,
    error,
    isUploading,
    reset: () => {
      setProgress(0);
      setPreview(null);
      setError(null);
    },
  };
};