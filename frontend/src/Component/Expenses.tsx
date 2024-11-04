import React, { useEffect, useState } from 'react';
import api from '../api'; // Ensure the path is correct

interface Category {
  category_author: number;
  category_title: string;
  category_note: string;
  assigned_amount: number;
  created_at: string;
}

interface Group {
  id: number;
  groups_title: string;
  groups_author: number;
  created_at: string;
  categories: Category[];
  family: {
    name: string;
    members: number[];
  };
}

interface ExpensesSectionProps {
  group: Group;
  allGroups: Group[]; // Prop to receive all groups for dropdown
}

const ExpensesSection: React.FC<ExpensesSectionProps> = ({ group, allGroups }) => {
  const [modalData, setModalData] = useState<{ amount: number; note: string }>({ amount: 0, note: '' });
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null); // State to hold selected group ID

  const addCategory = async (groupId: number | null) => {
    console.log("Selected Group ID:", groupId); // Log the selected group ID
    console.log("Inside addCategory, groupId:", groupId, "modalData:", modalData);

    if (modalData.amount > 0 && groupId !== null) {
      const newCategory = {
        category_author: 0, // Set appropriate author ID
        category_title: `Kategoria ${modalData.amount.toFixed(2)}`, // Example category name
        category_note: modalData.note,
        assigned_amount: modalData.amount,
        created_at: new Date().toISOString(), // Set current time
      };

      try {
        console.log("Sending API request with data:", newCategory);
        const response = await api.post(`/api/groups/${groupId}/add-categories/`, newCategory);
        console.log("API response:", response);

        setModalData({ amount: 0, note: '' }); // Reset modal data
        handleModalClose(); // Close modal after adding category
      } catch (error) {
        console.error('Error adding category:', error);
      }
    } else if (modalData.amount <= 0) {
      alert("Kwota musi być większa od 0.");
    } else {
      console.log("No group ID selected.");
    }
  };

  const handleModalClose = () => {
    const modal = document.getElementById('expense_modal') as HTMLDialogElement;
    modal.close();
    setModalData({ amount: 0, note: '' });
    setSelectedGroupId(null); // Reset selected group ID
  };

  useEffect(() => {
    console.log("Updated selectedGroupId:", selectedGroupId);
  }, [selectedGroupId]); // This will run whenever selectedGroupId changes

  const openModalForGroup = (groupId: number) => {
    console.log("Opening modal for Group ID:", groupId);
    setSelectedGroupId(groupId); // This updates the state
    const modal = document.getElementById('expense_modal') as HTMLDialogElement;
    modal.showModal();
  };

  const handleAddCategory = () => {
    if (selectedGroupId !== null) {
      addCategory(selectedGroupId); // Ensure selectedGroupId is passed
    } else {
      console.error("Nie wybrano ID grupy.");
    }
  };

  return (
    <div className="mb-4">
      <h4 className="font-semibold">{group.groups_title}</h4>
      {group.categories.length > 0 ? (
        <div>
          {group.categories.map((category, index) => (
            <div className="flex justify-between" key={index}>
              <span>{category.category_note}</span>
              <span>{category.assigned_amount} zł</span>
            </div>
          ))}
        </div>
      ) : (
        <p>Brak kategorii</p>
      )}

      {/* <button
        onClick={() => openModalForGroup(group.id)}
        className="mt-4 text-blue-400"
      >
        Dodaj kategorię
      </button> */}

      <dialog id="expense_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Dodaj Kategorię</h3>
          <label className="block text-sm mt-2">Wybierz grupę:</label>
          <select 
            value={selectedGroupId ?? ''} 
            onChange={(e) => setSelectedGroupId(Number(e.target.value))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="">Wybierz grupę</option>
            {allGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.groups_title}
              </option>
            ))}
          </select>

          <label className="block text-sm mt-2">Kwota:</label>
          <input
            type="number"
            value={modalData.amount}
            onChange={(e) => setModalData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
            className="w-full p-2 rounded bg-gray-700 text-white"
            step="0.01"
          />

          <label className="block text-sm mt-2">Notatka:</label>
          <input
            type="text"
            value={modalData.note}
            onChange={(e) => setModalData(prev => ({ ...prev, note: e.target.value }))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <button onClick={handleAddCategory} className="btn btn-primary mt-4">Zapisz Kategorię</button>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={handleModalClose} className="mt-2 text-white">Zamknij</button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ExpensesSection;
