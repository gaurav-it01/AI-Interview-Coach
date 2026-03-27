import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadResume, reset } from '../store/slices/resumeSlice';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message, currentResume } = useSelector(
    (state) => state.resume
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && currentResume) {
      toast.success('Resume uploaded successfully!');
      setFile(null); // Reset after upload
    }
    dispatch(reset());
  }, [isError, isSuccess, message, currentResume, dispatch]);

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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelection(droppedFile);
    }
  }, []);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File exceeds 10MB limit.');
      return;
    }
    setFile(selectedFile);
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Upload Your Resume</h2>
      <p className="text-slate-500 mb-6 text-sm">Upload your CV in PDF format for customized AI interview feedback.</p>
      
      {/* Target Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : file 
              ? 'border-green-400 bg-green-50' 
              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {!file && !isLoading ? (
          <div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 text-slate-400">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-slate-700 font-medium mb-1">Drag and drop your PDF here</p>
            <p className="text-slate-500 text-sm mb-4">or click to browse from your computer</p>
            
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept=".pdf" 
              onChange={onFileChange} 
            />
            <label 
              htmlFor="file-upload" 
              className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer inline-block shadow-sm text-sm font-medium"
            >
              Select File
            </label>
            <p className="text-xs text-slate-400 mt-4">Max file size: 10MB</p>
          </div>
        ) : isLoading ? (
          <div className="py-8">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-primary-700 font-medium animate-pulse">Analyzing and extracting text...</p>
          </div>
        ) : (
          <div className="py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <FileText className="w-8 h-8" />
            </div>
            <p className="text-green-800 font-medium mb-1">{file.name}</p>
            <p className="text-sm text-green-600 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setFile(null)} 
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium bg-white shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={submitFile} 
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-medium"
              >
                Confirm Upload
              </button>
            </div>
          </div>
        )}
      </div>

      {currentResume && (
        <div className="mt-8 bg-slate-50 rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-slate-800">Extraction Preview Successful</h3>
            </div>
            <button 
              onClick={() => window.location.href = `/interview/${currentResume._id}`}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm text-sm font-medium flex items-center gap-2"
            >
              Start Interview
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-600 line-clamp-3 italic bg-white p-3 rounded border border-slate-100">
            "{currentResume.extractedTextSnippet || currentResume.extractedText}"
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
