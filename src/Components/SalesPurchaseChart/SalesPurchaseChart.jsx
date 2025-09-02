import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchChartData } from "../../api/dashboard";
import "./SalesPurchaseChartStyle.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesPurchaseChart = () => {
  const [type, setType] = useState("weekly");
  const [chartData, setChartData] = useState({ labels: [], sales: [], purchases: [] });

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchChartData(type);
        setChartData(data);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      }
    };
    getData();
  }, [type]);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Sales & Purchase</h3>
        <select
          className="chart-dropdown"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="chart-body">
        <Bar
          key={JSON.stringify(chartData)} // avoids canvas reuse issue
          data={{
            labels: chartData.labels,
            datasets: [
              {
                label: "Purchase",
                data: chartData.purchases,
                backgroundColor: "rgba(54, 162, 235, 0.7)", // blue
                borderRadius: 6,
                barPercentage: 0.4,
              },
              {
                label: "Sales",
                data: chartData.sales,
                backgroundColor: "rgba(75, 192, 102, 0.7)", // green
                borderRadius: 6,
                barPercentage: 0.4,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { usePointStyle: true, boxWidth: 10 },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 10000,
                  callback: (value) =>
                    value >= 1000 ? value.toLocaleString() : value,
                },
                grid: { color: "#eaeaea" },
              },
              x: {
                grid: { display: false },
              },
            },
          }}
        />
      </div>

    </div>
  );
};

export default SalesPurchaseChart;


