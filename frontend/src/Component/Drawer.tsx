import React, { useState } from 'react';
import Navbar from '../Component/Navbar';
import Header from './Header';
import IncomeSection from './Income';
import ExpensesSection from './Expenses';
import FinanceSummary from './Finance';

export function Drawer() {
    const [incomeSections, setIncomeSections] = useState([{ id: 0, name: `Przychody 0` }]);
    const [accounts, setAccounts] = useState([]);

    const addIncomeSection = () => {
        const newId = incomeSections.length;
        setIncomeSections([...incomeSections, { id: newId, name: `Przychody ${newId}` }]);
    };

    const renameIncomeSection = (id: number, newName: string) => {
        setIncomeSections(incomeSections.map(section =>
            section.id === id ? { ...section, name: newName } : section
        ));
    };

    const handleAccountChange = (updatedAccounts) => {
        setAccounts(updatedAccounts);
    };

    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <Navbar />
                <div className="bg-dark min-h-screen p-8">
                    <Header />
                    <div className="flex flex-col md:flex-row justify-center mt-4 space-x-4">
                        <div className="flex flex-col space-y-4">
                            {incomeSections.map(section => (
                                <IncomeSection key={section.id} sectionId={section.id} onRename={renameIncomeSection} accounts={accounts} onAccountChange={handleAccountChange} />
                            ))}
                            <button onClick={addIncomeSection} className="btn btn-primary">Dodaj Kolejną sekcje</button>
                            <ExpensesSection />
                        </div>
                        <FinanceSummary onAccountChange={handleAccountChange} />
                    </div>
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <li><a>Sidebar Item 1</a></li>
                    <li><a>Sidebar Item 2</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Drawer;
