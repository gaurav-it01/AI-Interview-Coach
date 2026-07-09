import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText, Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'react-toastify';
import ResumePreview from './resume/ResumePreview';
import { reset, uploadResume } from '../store/slices/resumeSlice';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const progressTimerRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message, currentResume } = useSelector(
    (state) => state.resume
  );

  const clearSelectedFile = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      setUploadProgress(0);
      progressTimerRef.current = setInterval(() => {
        setUploadProgress((prev) => (prev >= 92 ? prev : prev + Math.random() * 12));
      }, 280);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (isSuccess) setUploadProgress(100);
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isLoading, isSuccess]);

  useEffect(() => {
    if (!isError && !isSuccess) return;

    if (isError) {
      toast.error(message);
      setUploadProgress(0);
    }

    if (isSuccess && currentResume) {
      toast.success('Resume uploaded successfully!');
      clearSelectedFile();
    }

    dispatch(reset());
  }, [isError, isSuccess, message, currentResume, dispatch, clearSelectedFile]);

  const handleFileSelection = useCallback((selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File exceeds 10MB limit.');
      return;
    }

    setFile(selectedFile);
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, [handleFileSelection]);

  const onFileChange = (e) => {
    if (e.target.files?.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const submitFile = () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);
    dispatch(uploadResume(formData));
  };

  return (
    <div className="card p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">Upload Your Resume</h2>
        <p className="text-slate-500 text-sm mt-0.5">PDF only — we extract text to generate tailored interview questions.</p>
      </div>

      <button
        type="button"
        className={`relative w-full border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-300 overflow-hidden ${
          isDragging
            ? 'border-primary-500 bg-primary-50/80 scale-[1.01]'
            : file
              ? 'border-emerald-300 bg-emerald-50/50'
              : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50/80'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !file && !isLoading && fileInputRef.current?.click()}
      >
        <div className="absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary-100/40 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none animate-shimmer" aria-hidden="true" />

        {!file && !isLoading ? (
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100 flex items-center justify-center mx-auto mb-4 text-primary-600 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-slate-800 font-semibold mb-1">Drag & drop your resume here</p>
            <p className="text-slate-500 text-sm mb-4">or click to browse from your computer</p>

            <input
              type="file"
              id="file-upload"
              ref={fileInputRef}
              className="sr-only"
              accept=".pdf,application/pdf"
              onChange={onFileChange}
            />
            <label
              htmlFor="file-upload"
              onClick={(e) => e.stopPropagation()}
              className="inline-block px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-sm font-medium shadow-sm"
            >
              Select PDF
            </label>
            <p className="text-xs text-slate-400 mt-4">Maximum file size: 10MB</p>
          </div>
        ) : isLoading ? (
          <div className="relative py-4 max-w-xs mx-auto">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-primary-700 font-medium mb-3">Parsing your resume…</p>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(uploadProgress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Extracting text from PDF</p>
          </div>
        ) : (
          <div className="relative py-2" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <FileText className="w-7 h-7" />
            </div>
            <p className="text-emerald-800 font-semibold mb-0.5 break-all">{file.name}</p>
            <p className="text-sm text-emerald-600 mb-5">{(file.size / 1024 / 1024).toFixed(2)} MB · Ready to upload</p>

            <div className="flex flex-col sm:flex-row justify-center gap-2.5">
              <button
                type="button"
                onClick={clearSelectedFile}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-white transition-colors text-sm font-medium bg-white/80"
              >
                Change file
              </button>
              <button
                type="button"
                onClick={submitFile}
                className="btn-primary px-6 py-2"
              >
                Upload Resume
              </button>
            </div>
          </div>
        )}
      </button>

      {currentResume && (
        <div className="mt-5 space-y-4 animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-emerald-50/80 border border-emerald-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-emerald-900 text-sm">Upload successful</p>
                <p className="text-xs text-emerald-700">Resume parsed and ready for interview</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/interview/${currentResume._id}`)}
              className="btn-primary whitespace-nowrap"
            >
              Start Interview
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <ResumePreview
            fileName={currentResume.fileName}
            extractedText={currentResume.extractedTextSnippet || currentResume.extractedText}
          />
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
