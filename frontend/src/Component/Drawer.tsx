import { useState, useEffect } from 'react';
import Header from './Header';
import ExpensesSection from './Expenses';
import FinanceSummary from './Finance';
import api from '../api'; // Make sure to import your api 

interface Group {
    id: number; // Make sure the ID is part of the group data from your API
    groups_title: string;
    groups_author: number;
    created_at: string;
    categories: any[]; // Specify the type of categories if possible
    family: {
        name: string;
        members: any[]; // Specify the type of members if possible
    };
}

export function Drawer() {
    const [expensesSections, setExpensesSections] = useState<Group[]>([]); // Change state to Group[]
    const [newGroupTitle, setNewGroupTitle] = useState(''); // State for new group title
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State for authentication
    const [allGroups, setAllGroups] = useState<Group[]>([]);

    useEffect(() => {
        // Here you can fetch user data to check if they're logged in
        const checkLoginStatus = async () => {
            // Simulate a login check
            // You might want to replace this with an actual API call
            const loggedIn = true; // Simulate logged-in status
            setIsLoggedIn(loggedIn);
            if (loggedIn) {
                // Fetch groups if logged in
                await fetchGroups();
            }
        };

        checkLoginStatus();
    }, []);

    const fetchGroups = async () => {
        try {
          const response = await api.get('/api/groups/');
          setExpensesSections(response.data); // Assuming response.data is an array of groups
          setAllGroups(response.data); // Store all groups for dropdown
        } catch (error) {
          console.error('Error fetching groups:', error);
        }
      };


    const addGroup = async () => {
        if (newGroupTitle.trim() === '') {
            alert("Tytuł grupy nie może być pusty.");
            return;
        }
    
        const newGroup = {
            groups_title: newGroupTitle,
            groups_author: 0, // Set appropriate author ID
            created_at: new Date().toISOString(),
            categories: [], // Ensure categories is initialized as an empty array
            family: {
                name: "Nowa rodzina",
                members: [],
            },
        };
    
        try {
            const response = await api.post('/api/groups/', newGroup);
            setExpensesSections([...expensesSections, response.data]); // Add new group to expenses sections
            setNewGroupTitle(''); // Reset the title
        } catch (error) {
            console.error('Error adding group:', error);
        }
    };

    const addExpensesSection = () => {
        addGroup(); // Call addGroup when adding an expenses section
    };




    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <div className="bg-dark min-h-screen p-8">
                    <Header />
                    <div className="flex flex-col md:flex-row justify-center mt-4 space-x-4">
                        <div className="flex flex-col space-y-4">
                            {/* Render expenses section only if logged in */}
                            {isLoggedIn && expensesSections.map((section) => (
                            <ExpensesSection key={section.id} group={section} allGroups={allGroups} /> // Pass allGroups
                             ))}
                            {isLoggedIn && (
                                <>
                                    <input 
                                        type="text" 
                                        value={newGroupTitle} 
                                        onChange={(e) => setNewGroupTitle(e.target.value)} 
                                        placeholder="Tytuł grupy"
                                        className="input input-bordered" 
                                    />
                                    <button onClick={addExpensesSection} className="btn btn-primary mt-4">Dodaj Kolejną Sekcję Wydatków</button>
                                </>
                            )}
                        </div>
                        <FinanceSummary/>
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
