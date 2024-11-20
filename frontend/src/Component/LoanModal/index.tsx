import { useState } from 'react';

function LoanModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    amount_reaming: 0, // Backend model field name
    loan_type: 'fixed',
    interest_rate: 0,
    payment_day: 1,
    last_payment_date: '',
    installments_remaining: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount_reaming' || name === 'interest_rate' || name === 'payment_day' || name === 'installments_remaining'
        ? parseFloat(value) 
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Submit form data as it is
    onClose(); // Close modal after submitting
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[50%] p-6">
        <h2 className="text-xl font-bold mb-4">Dodaj Kredyt</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nazwa</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kwota pozostała do spłaty</label>
            <input
              type="number"
              name="amount_reaming"
              value={formData.amount_reaming}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rodzaj rat</label>
            <select
              name="loan_type"
              value={formData.loan_type}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="fixed">Stałe</option>
              <option value="decreasing">Malejące</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Oprocentowanie (%)</label>
            <input
              type="number"
              name="interest_rate"
              value={formData.interest_rate}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              step="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Dzień płatności raty</label>
            <input
              type="number"
              name="payment_day"
              value={formData.payment_day}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              min="1"
              max="31"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Data spłaty ostatniej raty</label>
            <input
              type="date"
              name="last_payment_date"
              value={formData.last_payment_date}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Pozostało rat</label>
            <input
              type="number"
              name="installments_remaining"
              value={formData.installments_remaining}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Dodaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoanModal;
