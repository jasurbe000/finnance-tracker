import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrencyConverter = () => {
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("UZS");
  const [convertedAmount, setConvertedAmount] = useState(0);

  const API_KEY = "9604a67e8d804ec62f359814"; 

  useEffect(() => {
    axios
      .get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`)
      .then((response) => {
        setRates(response.data.conversion_rates);
      })
      .catch((error) => console.error("API xatosi:", error));
  }, [fromCurrency]);

  const convertCurrency = () => {
    if (rates[toCurrency]) {
      setConvertedAmount((amount * rates[toCurrency]).toFixed(2));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Valyuta Konverteri</h2>
      <div className="row">
        <div className="col">
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="col">
          <select
            className="form-select"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {Object.keys(rates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            className="form-select"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {Object.keys(rates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <button className="btn btn-primary" onClick={convertCurrency}>
            Aylantirish
          </button>
        </div>
      </div>
      <h4 className="mt-3">Natija: {convertedAmount} {toCurrency}</h4>
    </div>
  );
};

export default CurrencyConverter;
