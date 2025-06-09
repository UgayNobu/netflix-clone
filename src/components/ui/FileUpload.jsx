import { useFileUpload } from '../../hooks/useFileUpload';

export const FileUpload = ({ onUpload, accept, maxSize }) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    progress,
    preview,
    error,
    isUploading,
  } = useFileUpload({ accept, maxSize });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here</p>
        ) : (
          <p>Drag & drop a file here, or click to select</p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
};