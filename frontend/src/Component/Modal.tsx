import React, { useState } from 'react';

interface ModalProps {
    addCategory: (name: string) => void;
}

export function Modal({addCategory}: ModalProps): JSX.Element {
    const [categoryName, setCategoryName] = useState('');

  const showModal = () => {
    const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
        addCategory(categoryName);
        setCategoryName('');
        const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
        if (modal) {
            modal.close();
        }
    }
  }

  return (
    <div>
    <button onClick={showModal}>Dodaj kategorię</button>
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Dodaj nową kategorię</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nazwa kategorii"
            className="input input-bordered"
            required
          />
          <div className="modal-action">
            <button type="submit" className="btn">Dodaj</button>
            <button type="button" onClick={() => document.getElementById('my_modal_1')?.close()} className="btn">Zamknij</button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
  );
}

export default Modal;
