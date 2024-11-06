import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';

interface Account {
  id: number;
  name: string;
  amount: number;
}

const FinanceSummary: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newAccount, setNewAccount] = useState<Account>({ id: 0, name: '', amount: 0 });
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  useEffect(() => {
    // Fetch financial summary from the backend (total income, total expenses)
    const fetchSummary = async () => {
      try {
        const response = await api.get('api/financial_summary/');
        setTotalIncome(response.data.total_income);
        setTotalExpenses(response.data.total_expenses);
      } catch (error) {
        console.error('Error fetching financial summary:', error);
      }
    };
    fetchSummary();
  }, []);

  const handleAddAccount = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccount.name && newAccount.amount >= 0) {
      const updatedAccounts = [...accounts, { ...newAccount, id: accounts.length + 1 }];
      setAccounts(updatedAccounts);
      setNewAccount({ id: 0, name: '', amount: 0 });
      setShowForm(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAccount({
      ...newAccount,
      [name]: name === 'amount' ? parseFloat(value) : value,
    });
  };

  const totalAmount = accounts.reduce((sum, account) => sum + account.amount, 0);

  return (
    <div className="bg-dark p-4 rounded-lg text-white border w-[300px]">
      <h3 className="text-lg font-bold">Podsumowanie Finansowe</h3>
      <div className="mt-4">
        <div className="flex justify-between font-bold">
          <span>Przychody:</span>
          <span>{totalIncome.toFixed(2)} zł</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Wydatki:</span>
          <span>{totalExpenses.toFixed(2)} zł</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Łączna kwota:</span>
          <span>{totalAmount.toFixed(2)} zł</span>
        </div>
        {accounts.map(account => (
          <div key={account.id} className="flex justify-between">
            <span>{account.name}</span>
            <span>{account.amount.toFixed(2)} zł</span>
          </div>
        ))}
      </div>
      <button onClick={handleAddAccount} className="mt-4 bg-blue-500 text-white p-2 rounded">Dodaj Konto</button>
      {showForm && (
        <form onSubmit={handleFormSubmit} className="mt-4">
          <input
            type="text"
            name="name"
            value={newAccount.name}
            onChange={handleInputChange}
            placeholder="Nazwa konta"
            className="border rounded p-1 mb-2 w-full"
            required
          />
          <input
            type="number"
            name="amount"
            value={newAccount.amount}
            onChange={handleInputChange}
            placeholder="Kwota"
            className="border rounded p-1 mb-2 w-full"
            step="0.01"
            required
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">Zapisz Konto</button>
        </form>
      )}
    </div>
  );
};

export default FinanceSummary;
