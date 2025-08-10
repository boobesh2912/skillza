import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // The modal-overlay is the dark background
    <div className="modal-overlay" onClick={onClose}>
      {/* The modal-content is the white box. We stop click propagation
          so that clicking inside the modal doesn't close it. */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;