import React, { useState } from 'react';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, onSave }) => {
  const [text, setText] = useState('');

  if (!isVisible) return null;

  return (
    <div className="modal">
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => onSave(text)}>Guardar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

export default Modal;
