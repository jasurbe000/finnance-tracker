import React from "react";
import { Doughnut } from "react-chartjs-2";

const ChartsVisualization = ({ transactions }) => {
  const expenses = transactions.filter((t) => t.type === "expense");

  const categories = ["Oziq-ovqat", "Transport", "Ko‘ngilochar"];
  const data = categories.map(
    (category) =>
      expenses
        .filter((t) => t.description.includes(category))
        .reduce((sum, t) => sum + t.amount, 0)
  );

  return (
    <div className="container mt-4">
      <h2>Xarajatlar Bo‘yicha Diagramma</h2>
      <Doughnut
        data={{
          labels: categories,
          datasets: [
            {
              label: "Xarajatlar",
              data,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        }}
      />
    </div>
  );
};

export default ChartsVisualization;
