import React, { useState, useRef } from "react";
import "./MultipleProductStyle.css";
import { toast } from "react-toastify";
import { bulkUploadProducts } from "../../../api/product";
import uploadIcon from '../../../assets/UploadIcon.png';

const MultipleProduct = ({ onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef();

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (file) {
      toast.error("You can only upload one file at a time");
      return;
    }
    if (!selected.name.endsWith(".csv")) {
      toast.error("Only .csv files are allowed");
      return;
    }
    setFile(selected);
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (file) {
      toast.error("You can only upload one file at a time");
      return;
    }
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith(".csv")) {
      setFile(dropped);
    } else {
      toast.error("Only .csv files are allowed");
    }
  };

  const onNext = () => {
    if (!file) {
      toast.error("Please select a CSV file first");
      return;
    }
    setStep(2);
  };

  const onUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      await bulkUploadProducts(fd);
      toast.success("CSV uploaded successfully");
      onUploaded?.();
      onClose();
    } catch (err) {
      toast.error("Failed to upload CSV");
    }
  };

  return (
    <div className="modal-overlay" onClick={() => {
      if(file){
        onUpload();
      }else{
        onClose();
      }
    }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <h3>CSV Upload</h3>
            <p>Add your document here</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Step 1: Drag & Drop / Browse */}
        <div
          className="drop-area"
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current.click()}
        >
          <img src={uploadIcon} />
          <div>
            <p>Drag your file to start uploading</p>
            <p>or</p>
            <button className="browse-btn">Browse files</button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={onFileChange}
            />
          </div>

        </div>

        {/* Step 2: Show selected file */}
        {step === 2 && file && (
          <div className="file-row">
            <span>{file.name}</span>
            <button className="delete-btn" onClick={() => setFile(null)}>
              &times;
            </button>
          </div>
        )}


        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          {step === 1 ? (
            <button className="next-btn" onClick={onNext}>
              Next
            </button>
          ) : (
            <button className="upload-btn" onClick={onUpload}>
              Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleProduct;

