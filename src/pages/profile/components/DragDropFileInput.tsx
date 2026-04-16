import React, { useRef, useState } from 'react';
import { Upload, File, Image } from 'lucide-react';

interface DragDropFileInputProps {
  label: string;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  currentFileUrl?: string | null;
  currentFileName?: string;
  icon?: 'upload' | 'file' | 'image';
  helpText?: string;
  className?: string;
}

const DragDropFileInput: React.FC<DragDropFileInputProps> = ({
  label,
  accept = '*/*',
  onFileSelect,
  currentFileUrl,
  currentFileName,
  icon = 'upload',
  helpText,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      setSelectedFile(null);
      onFileSelect(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getIcon = () => {
    switch (icon) {
      case 'file':
        return <File className="w-8 h-8" />;
      case 'image':
        return <Image className="w-8 h-8" />;
      default:
        return <Upload className="w-8 h-8" />;
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--sidebar-text)' }}>
        {label}
      </label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-md p-4 text-center cursor-pointer
          transition-colors duration-200
          ${isDragging ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10' : 'border-[var(--border-color)]'}
          hover:border-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/5
        `}
        onClick={() => fileInputRef.current?.click()}
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          {getIcon()}
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {selectedFile ? selectedFile.name : (currentFileName || 'Click or drag a file here')}
          </p>
          {helpText && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{helpText}</p>}
        </div>
      </div>
      {(currentFileUrl || selectedFile) && (
        <div className="mt-2 flex justify-between items-center">
          {currentFileUrl && !selectedFile && (
            <a
              href={currentFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent-blue)] hover:underline"
            >
              View current file
            </a>
          )}
          {selectedFile && (
            <button
              type="button"
              onClick={clearFile}
              className="text-xs text-red-500 hover:underline"
            >
              Remove selected
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DragDropFileInput;