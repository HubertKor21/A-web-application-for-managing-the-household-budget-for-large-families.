import React, { useState, useEffect } from 'react';
import api from '../api';

const Header: React.FC = () => {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [currentYear, setCurrentYear] = useState<number>(0);

  useEffect(() => {
    const fetchCurrentMonthBalance = async () => {
      try {
        const response = await api.get('/api/balance/monthly/');
        setCurrentMonth(response.data.month);
        setCurrentYear(response.data.year);
        setTotalBalance(response.data.total_balance);
      } catch (error) {
        console.error('Error fetching current month balance:', error);
      }
    };

    fetchCurrentMonthBalance();
  }, []);

  // Month names for display
  const monthNames = [
    'STYCZEŃ', 'LUTY', 'MARZEC', 'KWIECIEŃ', 'MAJ', 'CZERWIEC',
    'LIPIEC', 'SIERPIEŃ', 'WRZESIEŃ', 'PAŹDZIERNIK', 'LISTOPAD', 'GRUDZIEŃ'
  ];

  return (
    <div className="flex flex-col md:flex-row justify-center mt-4 space-x-4">
      <h2 className="text-xl font-bold">{`${monthNames[currentMonth - 1]} ${currentYear}`}</h2>
      <div className="text-green-500 text-xl font-bold">
        {totalBalance.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
      </div>
    </div>
  );
};

export default Header;
