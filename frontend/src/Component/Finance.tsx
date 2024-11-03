import React, { useState } from 'react';

interface Account {
  id: number;
  name: string;
  amount: number;
}

const FinanceSummary: React.FC<{ onAccountChange: (accounts: Account[]) => void; }> = ({ onAccountChange }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newAccount, setNewAccount] = useState<Account>({ id: 0, name: '', amount: 0 });

  const handleAddAccount = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccount.name && newAccount.amount >= 0) {
      const updatedAccounts = [...accounts, { ...newAccount, id: accounts.length + 1 }];
      setAccounts(updatedAccounts);
      onAccountChange(updatedAccounts);
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
        {accounts.map(account => (
          <div key={account.id} className="flex justify-between">
            <span>{account.name}</span>
            <span>{account.amount.toFixed(2)} zł</span>
          </div>
        ))}
        <div className="flex justify-between font-bold">
          <span>Łączna kwota:</span>
          <span>{totalAmount.toFixed(2)} zł</span>
        </div>
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
