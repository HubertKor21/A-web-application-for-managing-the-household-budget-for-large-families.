import { useEffect, useState } from "react";
import LoanModal from "../LoanModal";
import api from "../../api";
import ReactApexChart from "react-apexcharts"; // Import ApexCharts

interface LoanFormData {
  name: string;
  amount_reaming: number;
  loan_type: "fixed" | "decreasing";
  interest_rate: number;
  payment_day: number;
  last_payment_date: string;
  installments_remaining: number;
}

interface LoanInstallmentData {
  loan_name: string;
  loan_type: "fixed" | "decreasing";
  total_amount_remaining: string;
  interest_rate: string;
  installments_remaining: number;
  installments: number[];
}

function LoanPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loans, setLoans] = useState<LoanFormData[]>([]);
  const [selectedLoanIndex, setSelectedLoanIndex] = useState<number | null>(null);
  const [loanData, setLoanData] = useState<LoanInstallmentData | null>(null);

  const [chartData, setChartData] = useState({
    series: [{ name: "Loan Installments", data: [] }],
    options: {
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: { curve: 'straight' },
      grid: {
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 }
      },
      xaxis: { categories: [] }
    }
  });

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleAddLoan = async (data: LoanFormData) => {
    try {
      const response = await api.post("/api/loans/", data);
      setLoans((prevLoans) => [...prevLoans, response.data]);
    } catch (error) {
      console.error("Failed to add loan:", error);
      alert("Wystąpił błąd podczas dodawania kredytu.");
    }
  };

  const handleLoanSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.value ? parseInt(event.target.value) : null;
    setSelectedLoanIndex(selectedIndex);
  
    if (selectedIndex !== null) {
      try {
        const response = await api.get(`/api/loan/${selectedIndex + 1}/installments/`);
        setLoanData(response.data);
  
        // Sprawdź, czy wszystkie raty są liczbami
        const installmentsData = response.data.installments || [];
        const validInstallments = installmentsData.map((installment: any) => 
          isNaN(installment) ? 0 : installment // jeśli rata jest NaN, ustaw ją na 0
        );
  
        const categories = Array.from({ length: validInstallments.length }, (_, index) => `Rata ${index + 1}`);
  
        setChartData({
          series: [{ name: response.data.loan_name, data: validInstallments }],
          options: {
            ...chartData.options,
            xaxis: { categories }
          }
        });

        
  
      } catch (error) {
        console.error("Failed to fetch loan data:", error);
      }
    }
  };
  

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await api.get("/api/loans/");
        setLoans(response.data);
      } catch (error) {
        console.error("Failed to fetch loans:", error);
      }
    };
    fetchLoans();
  }, []);

  return (
    <div className="md:w-[95%] w-[80%] bg-white shadow-sm rounded-xl mt-10 px-5 py-4 mb-8">
      <div className="flex w-full items-center justify-between mb-6">
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Dodaj Kredyt
        </button>
      </div>

      <LoanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(data: LoanFormData) => handleAddLoan(data)}
      />

      <div>
        <h2 className="text-lg font-bold mb-4">Wybierz Kredyt</h2>
        <select
          onChange={handleLoanSelect}
          value={selectedLoanIndex ?? ""}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="" disabled>Wybierz kredyt</option>
          {loans.map((loan, index) => (
            <option key={index} value={index}>
              {loan.name} - {loan.amount_reaming} zł
            </option>
          ))}
        </select>

        {selectedLoanIndex !== null && loans[selectedLoanIndex] && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Szczegóły Kredytu</h3>
            <p><strong>Typ kredytu:</strong> {loans[selectedLoanIndex].loan_type}</p>
            <p><strong>Kwota:</strong>{loans[selectedLoanIndex].amount_reaming}</p>
            <p><strong>Oprocentowanie:</strong> {loans[selectedLoanIndex].interest_rate}%</p>
            <p><strong>Rata pozostała:</strong> {loans[selectedLoanIndex].installments_remaining}</p>
            <p><strong>Data ostatniej spłaty:</strong> {loans[selectedLoanIndex].last_payment_date}</p>
          </div>
        )}
      </div>

      {/* Render Chart */}
      {loanData && loanData.installments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Raty Kredytu w Czasie</h3>
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={350}
          />
        </div>
      )}
    </div>
  );
}

export default LoanPage;
