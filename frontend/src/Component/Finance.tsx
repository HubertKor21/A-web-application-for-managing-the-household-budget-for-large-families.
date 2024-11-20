import React, { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';  // Import toast from react-toastify

interface Account {
  id: number;
  bank_name: string;
  balance: number;
}

interface FinanceSummaryProps {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const FinanceSummary: React.FC<FinanceSummaryProps> = ({ setShowForm }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccount, setNewAccount] = useState<Account>({ id: 0, bank_name: '', balance: 0 });
  const [editAccount, setEditAccount] = useState<Account | null>(null);  // State to track which account to edit
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [budgetResponse, bankResponse] = await Promise.all([  // Fetch data in parallel
          api.get('/api/budget/'),
          api.get('/api/banks/'),
        ]);
        setAccounts(bankResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchSummary();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccount.bank_name && newAccount.balance >= 0) {
      try {
        const response = await api.post('/api/banks/', {
          bank_name: newAccount.bank_name,
          balance: newAccount.balance,
        });
        setAccounts([...accounts, response.data]);
        setNewAccount({ id: 0, bank_name: '', balance: 0 });
        setShowAddAccountModal(false); // Close the modal after submitting
        toast.success('Konto zostało pomyślnie zapisane!');  // Show success toast
      } catch (error) {
        console.error('Error adding account:', error);
      }
    }
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editAccount && editAccount.bank_name && editAccount.balance >= 0) {
      try {
        const response = await api.put(`/api/banks/${editAccount.id}/`, {
          bank_name: editAccount.bank_name,
          balance: editAccount.balance,
        });
        const updatedAccounts = accounts.map(account =>
          account.id === editAccount.id ? response.data : account
        );
        setAccounts(updatedAccounts);
        setEditAccount(null); // Close edit form
        toast.success('Zmiany zostały zapisane pomyślnie!');  // Show success toast
      } catch (error) {
        console.error('Error updating account:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editAccount) {
      setEditAccount({
        ...editAccount,
        [name]: name === 'balance' ? parseFloat(value) : value,
      });
    } else {
      setNewAccount({
        ...newAccount,
        [name]: name === 'balance' ? parseFloat(value) : value,
      });
    }
  };

  const handleEditClick = (account: Account) => {
    setEditAccount(account);
  };

  const handleClose = () => {
    setShowForm(false);
    setShowAddAccountModal(false); // Close both modals
    setEditAccount(null); // Close edit form
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white p-6 rounded-lg border text-black h-[70%] max-w-lg relative"  // Increased width and max-width
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          &#10005;
        </button>
        <h3 className="text-lg font-bold">Podsumowanie Finansowe</h3>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="p-4 bg-gray-100 rounded-lg shadow-md"
              onClick={() => handleEditClick(account)}  // Allow clicking on account to edit
            >
              <h4 className="font-bold text-xl">{account.bank_name}</h4>
              <p className="text-sm text-gray-600">Saldo: {account.balance} zł</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAddAccountModal(true)}  // Show the modal when clicked
          className="absolute bottom-4 right-4 bg-gray-400 text-white px-5 rounded-full shadow-lg flex items-center justify-center"
        >
          <span className="text-2xl">+</span>
        </button>
      </div>

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddAccountModal(false)}  // Close the modal when clicking outside
        >
          <div
            className="bg-white p-6 rounded-lg border text-black w-[80%] max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddAccountModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              &#10005;
            </button>
            <h3 className="text-lg font-bold">Dodaj Konto Bankowe</h3>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <input
                type="text"
                name="bank_name"
                value={newAccount.bank_name}
                onChange={handleInputChange}
                placeholder="Nazwa konta"
                className="border rounded p-1 mb-2 w-full text-white"
                required
              />
              <input
                type="number"
                name="balance"
                value={newAccount.balance}
                onChange={handleInputChange}
                placeholder="Kwota"
                className="border rounded p-1 mb-2 w-full text-white"
                step="0.01"
                required
              />
              <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
                Zapisz Konto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {editAccount && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClose}  // Close the modal when clicking outside
        >
          <div
            className="bg-white p-6 rounded-lg border text-black w-[80%] max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              &#10005;
            </button>
            <h3 className="text-lg font-bold">Edytuj Konto Bankowe</h3>

            <form onSubmit={handleEditFormSubmit} className="mt-4 space-y-4">
              <input
                type="text"
                name="bank_name"
                value={editAccount.bank_name}
                onChange={handleInputChange}
                placeholder="Nazwa konta"
                className="border rounded p-1 mb-2 w-full text-white"
                required
              />
              <input
                type="number"
                name="balance"
                value={editAccount.balance}
                onChange={handleInputChange}
                placeholder="Kwota"
                className="border rounded p-1 mb-2 w-full text-white"
                step="0.01"
                required
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                Zapisz Zmiany
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceSummary;
