import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionManager = () => {
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("transactions")) || []
  );
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Oziq-ovqat");
  const [date, setDate] = useState("");
  const [type, setType] = useState("income");
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState({});
  const [filterCategory, setFilterCategory] = useState("Hammasi");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const API_KEY = "9604a67e8d804ec62f359814"; 


  useEffect(() => {
    axios
      .get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`)
      .then((response) => setRates(response.data.conversion_rates))
      .catch((error) => console.error("Valyuta API xatosi:", error));
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    const convertedAmount = amount / (rates[currency] || 1);
    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(convertedAmount.toFixed(2)),
      originalAmount: parseFloat(amount),
      currency,
      category,
      date,
      type,
    };
    setTransactions([...transactions, newTransaction]);
    resetForm();
  };

  const resetForm = () => {
    setDescription("");
    setAmount(0);
    setCategory("Oziq-ovqat");
    setDate("");
    setType("income");
    setCurrency("USD");
  };


  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => {
      const amount = Number(t.amount); 
      return sum + (isNaN(amount) ? 0 : amount); 
    }, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => {
      const amount = Number(t.amount); 
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

  const filteredTransactions = transactions.filter((t) => {
    const categoryMatch =
      filterCategory === "Hammasi" || t.category === filterCategory;
    const dateMatch =
      (!startDate || new Date(t.date) >= new Date(startDate)) &&
      (!endDate || new Date(t.date) <= new Date(endDate));
    return categoryMatch && dateMatch;
  });

  const expenseCategories = [
    "Oziq-ovqat",
    "Transport",
    "Ko‘ngilochar",
    "Boshqa",
  ];
  const chartData = expenseCategories.map((cat) =>
    transactions
      .filter((t) => t.type === "expense" && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  return (
    <div className="container mt-4">
      <h2>Moliyaviy Tranzaksiyalar</h2>
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            placeholder="Izoh"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="number"
            placeholder="Miqdor"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="col">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {expenseCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="col">
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="income">Daromad</option>
            <option value="expense">Xarajat</option>
          </select>
        </div>
        <div className="col">
          <select
            className="form-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {Object.keys(rates).map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <button className="btn btn-success" onClick={addTransaction}>
            Qo‘shish
          </button>
        </div>
      </div>

      <h4>Jami Daromad: {totalIncome.toFixed(2)} USD</h4>
      <h4>Jami Xarajat: {totalExpense.toFixed(2)} USD</h4>
      <h4>Sof Balans: {(totalIncome - totalExpense).toFixed(2)} USD</h4>

      <Doughnut
        data={{
          labels: expenseCategories,
          datasets: [
            {
              data: chartData,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            },
          ],
        }}
      />

      <ul className="list-group mt-3">
        {filteredTransactions.map((t) => (
          <li key={t.id} className="list-group-item">
            {t.date} - {t.description} ({t.category}): {t.originalAmount}{" "}
            {t.currency} → {t.amount} USD
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionManager;
