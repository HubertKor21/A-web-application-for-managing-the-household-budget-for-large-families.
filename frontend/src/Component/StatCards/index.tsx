import userIcon from "../../assets/images/userIcon.png";
import salesIcon from "../../assets/images/salesIcon.png";
import ordersIcon from "../../assets/images/ordersIcon.png";
import revenueIcon from "../../assets/images/revenueIcon.png";
import { CaretDown, CaretUp } from "react-ionicons";
import api from "../../api";
import { useEffect, useState } from "react";

interface Account {
	id: number;
	bank_name: string;
	balance: number;
  }

const StatCards = () => {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [totalIncome, setTotalIncome] = useState<number>(0);
	const [totalExpenses, setTotalExpenses] = useState<number>(0);
	const [newAccount, setNewAccount] = useState<Account>({ id: 0, bank_name: '', balance: 0 });
	
	useEffect(() => {
		// Fetch financial summary and bank accounts from backend
		const fetchSummary = async () => {
		  try {
			const [budgetResponse, bankResponse] = await Promise.all([
			  api.get('/api/budget/'),
			  api.get('/api/banks/')
			]);
			setTotalIncome(budgetResponse.data.total_income);
			setTotalExpenses(budgetResponse.data.total_expenses);
			setAccounts(bankResponse.data);
		  } catch (error) {
			console.error('Error fetching data:', error);
		  }
		};
		fetchSummary();
	  }, []);

	  const handleAddAccount = () => setShowForm(true);

	  const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newAccount.bank_name && newAccount.balance >= 0) {
		  try {
			// Send POST request to /api/banks/
			const response = await api.post('/api/banks/', {
			  bank_name: newAccount.bank_name,
			  balance: newAccount.balance,
			});
			// Append the new account to the list of accounts
			setAccounts([...accounts, response.data]);
			// Reset form state
			setNewAccount({ id: 0, bank_name: '', balance: 0 });
			setShowForm(false);
		  } catch (error) {
			console.error('Error adding account:', error);
		  }
		}
	  };
	
	  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewAccount({
		  ...newAccount,
		  [name]: name === 'balance' ? parseFloat(value) : value,
		});
	  };
	
	  
	const cards = [
		{
			title: "Users in family",
			value: "40,689",
			icon: userIcon,
			profit: true,
			percentage: "8.5%",
		},
		{
			title: "Number of expenses",
			value: "10293",
			icon: ordersIcon,
			profit: false,
			percentage: "1.3%",
		},
		{
			title: "Income",
			value: `${accounts.reduce((acc, account) => acc + account.balance, 0)} zł`,
			icon: salesIcon,
			profit: true,
			percentage: "4.7%",
		},
		{
			title: "Expenses",
			value: "$26,000",
			icon: revenueIcon,
			profit: false,
			percentage: "1.6%",
		},
	];
	return (
		<div className="flex md:w-[95%] w-[80%] items-center justify-between flex-wrap md:flex-row flex-col md:gap-3 gap-5 mt-5">
			{cards.map((card) => (
				<div
					key={card.title}
					className="bg-white rounded-xl shadow-sm pl-5 md:pr-10 pr-0 py-3 relative flex flex-col justify-between gap-3 md:w-[23%] w-full"
				>
					<span className="text-[#202224] font-semibold text-[15px]">{card.title}</span>
					<span className="text-[28px] font-bold text-[#202224]">{card.value}</span>
					<div className="flex items-center gap-2">
						<div className="flex items-center">
							{card.profit ? <CaretUp color="#00B69B" /> : <CaretDown color="#F93C65" />}
							<span
								className={`${
									card.profit ? "text-[#00B69B]" : "text-[#F93C65]"
								} font-semibold text-[15px]`}
							>
								{card.percentage}
							</span>
						</div>
						<span className="text-[#606060] text-[14px]">
							{card.profit ? "Up from yesterday" : "Down from yesterday"}
						</span>
					</div>
					<img
						src={card.icon}
						alt="icon"
						className="absolute right-5 top-3 w-[14.5%]"
					/>
				</div>
			))}
		</div>
	);
};

export default StatCards;
