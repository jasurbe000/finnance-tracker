import React from "react";
import CurrencyConverter from "./components/Currencyconverter";
import TransactionManager from "./components/Transactionmanager";

function App() {
  return (
    <div className="App container">
      <CurrencyConverter />
      <TransactionManager />
    </div>
  );
}

export default App;
