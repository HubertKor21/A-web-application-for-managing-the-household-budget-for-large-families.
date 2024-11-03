import React from 'react';

const ExpensesSection: React.FC = () => {
  return (
    <div className="bg-dark p-4 rounded-lg text-white border">
      <h3 className="font-semibold mb-4">Rachunki</h3>
      {['Internet', 'Czynsz', 'Opłaty', 'Telefon'].map((item) => (
        <div key={item} className="flex justify-between">
          <span>{item}</span>
          <span>0,00 zł</span>
        </div>
      ))}
      <button className="mt-4 text-blue-400">Dodaj kategorię</button>
    </div>
  );
};

export default ExpensesSection;
