"use client";

import React, { useRef, useState } from "react";
import { Folder } from "lucide-react"; // ✅ Folder icon
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  onChange?: (files: File[]) => void;
}

export const FileUploadField: React.FC<FileUploadProps> = ({
  accept = "*",
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB
  onChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => file.size <= maxSize);
    setFiles(validFiles);
    if (onChange) onChange(validFiles);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleBrowse = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    handleFiles(selectedFiles);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Falcorp label style */}
      <p className="text-[0.875rem] font-medium text-gray-700 dark:text-gray-300">
        File Attachment (Max 5MB)
      </p>

      {/* Drop zone */}
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full rounded-md border-2 border-dashed p-8 cursor-pointer transition-colors duration-200",
          isDragging
            ? "border-[#0066CC] bg-blue-50"
            : "border-gray-300 hover:border-[#0066CC] hover:bg-blue-50/30"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          type="file"
          ref={inputRef}
          accept={accept}
          multiple={maxFiles > 1}
          className="hidden"
          onChange={handleBrowse}
        />

        {/* Folder icon + text */}
        <div className="flex flex-col items-center text-center">
          <Folder
            className="h-10 w-10 mb-3 text-gray-400"
            strokeWidth={1.5}
          />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Drag and drop your file here
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
            className="text-sm text-[#0066CC] font-medium hover:underline"
          >
            or browse
          </button>
        </div>
      </div>

      {/* Thumbnail List */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3 shadow-sm"
            >
              {/* File icon + name */}
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                  {file.type.includes("pdf")
                    ? "PDF"
                    : file.type.includes("image")
                    ? "IMG"
                    : "FILE"}
                </div>

                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium text-gray-800 truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => {
                  const updated = files.filter((_, index) => index !== i);
                  setFiles(updated);
                  if (onChange) onChange(updated);
                }}
                className="flex items-center text-red-600 hover:text-red-700 font-medium text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadField;