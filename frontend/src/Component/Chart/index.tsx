import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import api from "../../api";

const ChartComponent = () => {
  const [dates, setDates] = useState<string[]>([]);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [incomeDates, setIncomeDates] = useState<string[]>([]);
  const [incomeData, setIncomeData] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/group-balance-chart/");
        const { dates, expenses } = response.data;

        const expensesByDate = dates.reduce((acc, date, index) => {
          acc[date] = (acc[date] || 0) + expenses[index];
          return acc;
        }, {});

        const sortedDates = Object.keys(expensesByDate).sort();
        const sortedExpenses = sortedDates.map((date) => expensesByDate[date]);

        setDates(sortedDates);
        setSalesData(sortedExpenses);
      } catch (error) {
        console.error("Błąd podczas pobierania danych", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await api.get("/api/income-by-date/");
        const { dates, income } = response.data;

        const incomeByDate = dates.reduce((acc, date, index) => {
          acc[date] = (acc[date] || 0) + income[index];
          return acc;
        }, {});

        const sortedIncomeDates = Object.keys(incomeByDate).sort();
        const sortedIncome = sortedIncomeDates.map((date) => incomeByDate[date]);

        setIncomeData(sortedIncome);
        setIncomeDates(sortedIncomeDates);
      } catch (error) {
        console.log("Błąd podczas pobierania danych dochodów", error);
      }
    };
    fetchIncome();
  }, []);

  // Łączymy posortowane daty i przypisujemy wydatki oraz dochody do odpowiednich dat
  const mergedData = [...new Set([...dates, ...incomeDates])].sort();
  const mergedExpensesAndIncome = mergedData.map((date) => {
    const expense = salesData[dates.indexOf(date)] || 0; // Jeśli brak wydatków dla daty, ustawiamy 0
    const income = incomeData[incomeDates.indexOf(date)] || 0; // Jeśli brak dochodów dla daty, ustawiamy 0
    return { date, expense, income };
  });

  console.log("Połączone dane:", mergedExpensesAndIncome);

  const options = {
    chart: {
      type: "area",
    },
    xaxis: {
      type: "datetime",
      categories: mergedData.map((date) => new Date(date).getTime()), // Przekształcamy daty na timestampy
    },
  };

  const series = [
    {
      name: "expenses",
      data: mergedExpensesAndIncome.map((data) => data.expense),
    },
    {
      name: "income",
      data: mergedExpensesAndIncome.map((data) => data.income),
    },
  ];

  return (
    <div className="w-full bg-white shadow-sm rounded-xl py-4 px-3">
      <Chart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default ChartComponent;
