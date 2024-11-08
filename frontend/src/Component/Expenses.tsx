import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import api from '../api'; // Upewnij się, że ścieżka jest poprawna

interface Category {
  category_author: number;
  category_title: string;
  category_note: string;
  assigned_amount: number;
  created_at: string;
  bank: number; // ID wybranego banku
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

interface Bank {
  id: number;
  bank_name: string;
}

const ExpensesSection: React.FC<{ group: Group }> = ({ group }) => {
  const [banks, setBanks] = useState<Bank[]>([]); // Przechowywanie dostępnych banków
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null); // Przechowywanie wybranego banku
  const [modalData, setModalData] = useState<{ category_name: string; amount: string; note: string; bankId: number }>({
    category_name: '', amount: '', note: '', bankId: 0
  });
  const [updatedCategories, setUpdatedCategories] = useState<Category[]>(group.categories); // stan do aktualizacji kategorii

  // Ładowanie dostępnych banków
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await api.get('/api/banks/name/');
        setBanks(response.data); // Ustawienie listy banków
      } catch (error) {
        console.error('Błąd podczas ładowania banków:', error);
      }
    };

    fetchBanks();
  }, []);

  // Dane do tabeli
  const columns = [
    {
      name: "Category Name",
      selector: (row: any) => row.category_title,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row: any) => row.assigned_amount,
      sortable: true,
    },
    {
      name: "Note",
      selector: (row: any) => row.category_note,
      sortable: true,
    },
    {
      name: "Bank",
      selector: (row: any) => {
        const bank = banks.find(b => b.id === row.bank);
        return bank ? bank.bank_name : 'N/A';
      },
      sortable: true,
    },
  ];

  // Funkcja do dodawania kategorii
  const addCategory = async () => {
    const amount = parseFloat(modalData.amount) || 0;
    if (amount > 0 && modalData.bankId > 0 && modalData.category_name.trim() !== '') {
      const newCategory = {
        category_author: 0, // Ustaw odpowiedni identyfikator autora
        category_title: modalData.category_name,
        category_note: modalData.note,
        assigned_amount: amount,
        created_at: new Date().toISOString(),
        bank: modalData.bankId,
      };

      try {
        const response = await api.post(`/api/groups/${group.id}/add-categories/`, newCategory);
        console.log("API response:", response);

        // Aktualizacja kategorii w stanie po dodaniu
        setUpdatedCategories(prevCategories => [...prevCategories, newCategory]);

        // Reset modal data
        setModalData({ category_name: '', amount: '', note: '', bankId: 0 });
      } catch (error) {
        console.error('Error adding category:', error);
      }
    } else {
      alert("Kwota musi być większa od 0 oraz wybierz bank.");
    }
  };

  return (
    <div className="mb-4">
      <h4 className="font-semibold">{group.groups_title}</h4>

      {/* Tabela z kategoriami */}
      <DataTable
        columns={columns}
        data={updatedCategories} // Używamy zaktualizowanego stanu kategorii
        pagination
      />

      {/* Formularz modalny */}
      <button
        onClick={() => document.getElementById(`expense_modal_${group.id}`).showModal()}
        className="mt-4 text-blue-400"
      >
        Dodaj kategorię
      </button>

      <dialog id={`expense_modal_${group.id}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Dodaj Kategorię</h3>
          <label className="block text-sm mt-2">Nazwa Kategorii</label>
          <input
            type="text"
            value={modalData.category_name}
            onChange={(e) => setModalData(prev => ({ ...prev, category_name: e.target.value }))}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Wpisz nazwę kategorii"
          />
          <label className="block text-sm mt-2">Kwota:</label>
          <input
            type="text"
            value={modalData.amount}
            onChange={(e) => setModalData(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Wpisz kwotę"
          />
          <label className="block text-sm mt-2">Notatka:</label>
          <input
            type="text"
            value={modalData.note}
            onChange={(e) => setModalData(prev => ({ ...prev, note: e.target.value }))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <label className="block text-sm">Wybierz bank:</label>
          <select
            value={modalData.bankId}
            onChange={(e) => setModalData(prev => ({ ...prev, bankId: parseInt(e.target.value) }))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="" disabled>Wybierz bank</option>
            {banks.map(bank => (
              <option key={bank.id} value={bank.id}>{bank.bank_name}</option>
            ))}
          </select>

          <button onClick={addCategory} className="btn btn-primary mt-4">Zapisz Kategorię</button>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById(`expense_modal_${group.id}`).close()} className="mt-2 text-white">Zamknij</button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ExpensesSection;
