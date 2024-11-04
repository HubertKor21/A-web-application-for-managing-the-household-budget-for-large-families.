import React, { useState } from 'react';

interface Account {
  id: number;
  name: string;
  amount: number;
}

interface Category {
  id: number;
  name: string;
  amount: number;
  accountId: number | null;
}

const IncomeSection: React.FC<{
  sectionId: number;
  onRename: (id: number, newName: string) => void;
  accounts: Account[];
  onAccountChange: (updatedAccounts: Account[]) => void; // New prop for updating accounts
}> = ({ sectionId, onRename, accounts, onAccountChange }) => {
  const [name, setName] = useState(`Przychody ${sectionId}`);
  const [categories, setCategories] = useState<Category[]>([]);
  const [nextId, setNextId] = useState(1);
  const [modalData, setModalData] = useState<{ amount: number; accountId: number | null }>({ amount: 0, accountId: null });

  const addCategory = (categoryName: string) => {
    if (modalData.amount > 0 && modalData.accountId !== null) {
      const accountIndex = accounts.findIndex(account => account.id === modalData.accountId);
      if (accountIndex !== -1) {
        // Deduct the amount from the selected account
        const updatedAccounts = [...accounts];
        updatedAccounts[accountIndex].amount -= modalData.amount;

        setCategories([...categories, { id: nextId, name: categoryName, amount: modalData.amount, accountId: modalData.accountId }]);
        setNextId(nextId + 1);
        onAccountChange(updatedAccounts); // Update accounts in FinanceSummary
        handleModalClose(); // Close modal after adding category
      }
    } else {
      alert("Kwota musi być większa od 0 oraz konto musi być wybrane.");
    }
  };

  const handleModalClose = () => {
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
    modal.close();
    setModalData({ amount: 0, accountId: null });
  };

  const handleAmountChange = (newAmount: string) => {
    setModalData(prev => ({ ...prev, amount: parseFloat(newAmount) || 0 }));
  };

  const handleAccountChange = (accountId: number) => {
    setModalData(prev => ({ ...prev, accountId }));
  };

  const totalAmount = categories.reduce((sum, category) => sum + category.amount, 0);

  return (
    <div className="bg-dark p-4 rounded-lg text-white border w-[600px]">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => onRename(sectionId, name)}
        className="border rounded p-1 mb-2"
      />
      <button className="btn mt-4" onClick={() => document.getElementById('my_modal_2')?.showModal()}>
        Dodaj Kategorię
      </button>

      {categories.map((category) => (
        <div className="flex justify-between items-center" key={category.id}>
          <span>{category.name}</span>
          <span>{category.amount.toFixed(2)} zł</span>
        </div>
      ))}
      <div className="mt-4 text-green-500 font-bold">Suma: {totalAmount.toFixed(2)} zł</div>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Dodaj Kategorię</h3>
          <label className="block text-sm mt-2">Kwota:</label>
          <input
            type="number"
            value={modalData.amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            step="0.01"
          />
          <label className="block text-sm mt-2">Wybierz konto bankowe:</label>
          <select
            value={modalData.accountId || ''}
            onChange={(e) => handleAccountChange(parseInt(e.target.value))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="">Wybierz konto</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.amount.toFixed(2)} zł)
              </option>
            ))}
          </select>
          <button onClick={() => addCategory(`Kategoria ${nextId}`)} className="mt-4 bg-green-500 text-white p-2 rounded w-full">
            Zapisz Kategorię
          </button>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={handleModalClose} className="mt-2 text-white">Zamknij</button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default IncomeSection;
