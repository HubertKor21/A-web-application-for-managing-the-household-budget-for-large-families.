import React, { useState, useEffect } from 'react';
import api from '../api';

interface Account {
  id: number;
  bank_name: string;
  balance: number;
}

interface FinanceSummaryProps {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const FinanceSummary: React.FC<FinanceSummaryProps> = ({ showForm, setShowForm }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccount, setNewAccount] = useState<Account>({ id: 0, bank_name: '', balance: 0 });
  const [, setTotalIncome] = useState<number>(0);
  const [, setTotalExpenses] = useState<number>(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [budgetResponse, bankResponse] = await Promise.all([
          api.get('/api/budget/'),
          api.get('/api/banks/'),
        ]);
        setTotalIncome(budgetResponse.data.total_income);
        setTotalExpenses(budgetResponse.data.total_expenses);
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
        setShowForm(false);
      } catch (error) {
        console.error('Error adding account:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAccount({
      ...newAccount,
      [name]: name === 'balance' ? parseFloat(value) : value,
    });
  };

  // Close modal on overlay click
  const handleClose = () => {
    setShowForm(false);
  };

  if (!showForm) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white p-6 rounded-lg border text-black h-[50%] w-[80%] max-w-md relative"
        onClick={(e) => e.stopPropagation()}  // Prevent closing on modal click
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          &#10005; {/* Close (X) icon */}
        </button>
        <h3 className="text-lg font-bold">Podsumowanie Finansowe</h3>
        

        <div className="mt-4">
          {accounts.map((account) => (
            <div key={account.id} className="flex justify-between">
              <span>{account.bank_name}</span>
              <span>{account.balance} zł</span>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleFormSubmit} className="mt-4">
          <input
            type="text"
            name="bank_name"
            value={newAccount.bank_name}
            onChange={handleInputChange}
            placeholder="Nazwa konta"
            className="border rounded p-1 mb-2 w-full"
            required
          />
          <input
            type="number"
            name="balance"
            value={newAccount.balance}
            onChange={handleInputChange}
            placeholder="Kwota"
            className="border rounded p-1 mb-2 w-full"
            step="0.01"
            required
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
            Zapisz Konto
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinanceSummary;
