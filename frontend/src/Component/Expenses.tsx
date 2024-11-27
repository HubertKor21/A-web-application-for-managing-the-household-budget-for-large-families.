import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import api from '../api'; // Ensure the path is correct

interface Category {
  id: number;
  category_author: number;
  category_title: string;
  category_note: string;
  assigned_amount: number;
  created_at: string;
  bank: number; // ID of the selected bank
}

interface Group {
  id: number;
  groups_title: string;
  groups_author: number;
  created_at: string;
  categories: Category[];
  family: {
    name: string;
    members: number[];
  };
}

interface Bank {
  id: number;
  bank_name: string;
}

const ExpensesSection: React.FC<{ group: Group }> = ({ group }) => {
  const [banks, setBanks] = useState<Bank[]>([]); // List of available banks
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null); // Selected bank
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [modalData, setModalData] = useState<{ category_name: string; amount: string; note: string; bankId: number }>({
    category_name: '', amount: '', note: '', bankId: 0
  });
  const [updatedCategories, setUpdatedCategories] = useState<Category[]>(group.categories); // State for updated categories
  const [editCategory, setEditCategory] = useState<Category | null>(null); // State for the category being edited

  // Fetch available banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        console.log("Fetching banks...");
        const response = await api.get('/api/banks/name/');
        setBanks(response.data); // Set the list of banks
        console.log("Banks fetched:", response.data);
      } catch (error) {
        console.error('Error loading banks:', error);
      } finally {
        setIsLoadingBanks(false);
        console.log("Finished loading banks.");
      }
    };

    fetchBanks();
  }, []);

  // Function for adding a category
  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    const amount = parseFloat(modalData.amount.trim()) || 0;
    if (amount > 0 && modalData.bankId > 0 && modalData.category_name.trim() !== '') {
      const newCategory = {
        category_author: 0, // Set appropriate author ID
        category_title: modalData.category_name,
        category_note: modalData.note,
        assigned_amount: amount,
        created_at: new Date().toISOString(),
        bank: modalData.bankId,
      };

      try {
        const response = await api.post(`/api/groups/${group.id}/add-categories/`, newCategory);

        // Log the response
        console.log('Response from API:', response.data); // Check what the response contains

        // Ensure the response contains the 'id' field
        const categoryWithId = { ...response.data, id: response.data.id };

        // Check the category ID
        console.log('Category ID:', categoryWithId.id); // Log the category ID

        setUpdatedCategories(prevCategories => [...prevCategories, categoryWithId]); // Update categories after adding

        setModalData({ category_name: '', amount: '', note: '', bankId: 0 }); // Reset modal data

        // Close the modal after adding the category
        document.getElementById(`expense_modal_${group.id}`)?.close();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    } else {
      alert("Amount must be greater than 0 and a bank must be selected.");
    }
  };

  // Function for handling the "Edit" button click
  const handleEditCategory = (category: Category) => {
    setEditCategory(category); // Set the category to be edited
    setModalData({
      category_name: category.category_title,
      amount: category.assigned_amount.toString(),
      note: category.category_note,
      bankId: category.bank,
    });
    document.getElementById(`edit_expense_modal_${group.id}`)?.showModal();
  };

  // Function for submitting the edited category
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(modalData.amount.trim()) || 0;
    if (amount > 0 && modalData.bankId > 0 && modalData.category_name.trim() !== '') {
      const updatedCategory = {
        ...editCategory,
        category_title: modalData.category_name,
        category_note: modalData.note,
        assigned_amount: amount,
        bank: modalData.bankId,
      };

      try {
        const response = await api.put(`/api/groups/${group.id}/categories/${editCategory.id}/`, updatedCategory);

        // Log the response for debugging
        console.log('Category updated:', response.data);

        // Update the categories state with the updated category
        setUpdatedCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === editCategory.id ? { ...category, ...response.data } : category
          )
        );

        // Reset modal data and close modal
        setModalData({ category_name: '', amount: '', note: '', bankId: 0 });
        document.getElementById(`edit_expense_modal_${group.id}`)?.close();
      } catch (error) {
        console.error('Error updating category:', error);
      }
    } else {
      alert('Amount must be greater than 0 and a bank must be selected.');
    }
  };

  const deleteCategory = async (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/api/groups/${group.id}/categories/${categoryId}/`);
        setUpdatedCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
        );
        alert("Category deleted successfully.");
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  // Columns for DataTable
  const columns = [
    {
      name: "Category Name",
      selector: (row: any) => row.category_title,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row: any) => row.assigned_amount,
      sortable: true,
    },
    {
      name: "Note",
      selector: (row: any) => row.category_note,
      sortable: true,
    },
    {
      name: "Bank",
      selector: (row: any) => {
        const bank = banks.find(b => b.id === row.bank);
        return bank ? bank.bank_name : 'No bank';
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div>
        <button onClick={() => handleEditCategory(row)} className="btn btn-warning mr-2">Edit</button>
        <button onClick={() => deleteCategory(row.id)} className="btn btn-danger">Delete</button>
      </div>
      ),
    }
  ];

  return (
    <div className="mb-4">
      <h4 className="font-semibold">{group.groups_title}</h4>

      {/* Table for categories */}
      <DataTable
        columns={columns}
        data={updatedCategories} // Use the updated category state
      />

      {/* Modal for adding a category */}
      <button
        onClick={() => {
          document.getElementById(`expense_modal_${group.id}`).showModal();
        }}
        className="mt-4 text-blue-400"
      >
        Add Category
      </button>

      <dialog id={`expense_modal_${group.id}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Category</h3>
          <label className="block text-sm mt-2">Category Name</label>
          <input
            type="text"
            value={modalData.category_name}
            onChange={(e) => setModalData(prev => ({ ...prev, category_name: e.target.value }))}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter category name"
          />
          <label className="block text-sm mt-2">Amount:</label>
          <input
            type="text"
            value={modalData.amount}
            onChange={(e) => setModalData(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter amount"
          />
          <label className="block text-sm mt-2">Note:</label>
          <input
            type="text"
            value={modalData.note}
            onChange={(e) => setModalData(prev => ({ ...prev, note: e.target.value }))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <label className="block text-sm">Select Bank:</label>
          <select
            value={modalData.bankId}
            onChange={(e) => setModalData(prev => ({ ...prev, bankId: parseInt(e.target.value) }))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="" disabled selected={!modalData.bankId}>Select bank</option>
            {banks.map(bank => (
              <option key={bank.id} value={bank.id}>{bank.bank_name}</option>
            ))}
          </select>

          <button onClick={addCategory} className="btn btn-primary mt-4">Add Category</button>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => {
              document.getElementById(`expense_modal_${group.id}`).close();
            }} className="mt-2 text-white">Close</button>
          </form>
        </div>
      </dialog>

      {/* Modal for editing a category */}
      {editCategory && (
        <dialog id={`edit_expense_modal_${group.id}`} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit Category</h3>
            <label className="block text-sm mt-2">Category Name</label>
            <input
              type="text"
              value={modalData.category_name}
              onChange={(e) => setModalData(prev => ({ ...prev, category_name: e.target.value }))}
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter category name"
            />
            <label className="block text-sm mt-2">Amount:</label>
            <input
              type="text"
              value={modalData.amount}
              onChange={(e) => setModalData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter amount"
            />
            <label className="block text-sm mt-2">Note:</label>
            <input
              type="text"
              value={modalData.note}
              onChange={(e) => setModalData(prev => ({ ...prev, note: e.target.value }))}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <label className="block text-sm">Select Bank:</label>
            <select
              value={modalData.bankId}
              onChange={(e) => setModalData(prev => ({ ...prev, bankId: parseInt(e.target.value) }))}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="" disabled selected={!modalData.bankId}>Select bank</option>
              {banks.map(bank => (
                <option key={bank.id} value={bank.id}>{bank.bank_name}</option>
              ))}
            </select>

            <button onClick={handleEditFormSubmit} className="btn btn-primary mt-4">Save Changes</button>
            <form method="dialog" className="modal-backdrop">
              <button type="button" onClick={() => {
                document.getElementById(`edit_expense_modal_${group.id}`).close();
              }} className="mt-2 text-white">Close</button>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ExpensesSection;
