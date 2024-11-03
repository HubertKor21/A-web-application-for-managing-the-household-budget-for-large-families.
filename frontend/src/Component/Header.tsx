import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center mt-4 space-x-4">
      <h2 className="text-xl font-bold">LISTOPAD 2024</h2>
      <div className="text-green-500 text-xl font-bold">123 000,00 zł</div>
    </div>
  );
};

export default Header;
