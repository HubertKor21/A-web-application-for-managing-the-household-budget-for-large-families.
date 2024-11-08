/* eslint-disable @typescript-eslint/no-explicit-any */
import Sidebar from "../Component/Siebar";
import Navbar from "../Component/Navbar";
import React, { useState } from 'react';
import FinanceSummary from "../Component/Finance";

interface Props {
  children: any;
}

const Layout = ({ children }: Props) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="w-screen bg-slate-100 relative">
      <Sidebar />
      <Navbar />
      <div className="w-full ml-[76px] mt-[70px] border-t border-gray-200 px-6 py-3 box-border flex flex-col">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#202224] text-[30px]">Dashboard</span>
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={() => setShowForm(!showForm)}
          >
            Add Balance
          </button>
        </div>
        {showForm && (
          <FinanceSummary showForm={showForm} setShowForm={setShowForm} />
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
