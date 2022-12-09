import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card } from "antd";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Thống kê doanh thu năm 2022 (VNĐ)",
      font: {
        size: 24,
      },
    },
  },
};
const month = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];
const data = {
  labels: month,
  datasets: [
    {
      data: [
        30000000, 33600000, 67000000, 30570000, 35600000, 45000000, 30000000, 33600000, 67000000, 30570000, 35600000,
        45000000,
      ],
      backgroundColor: "rgba(53, 162, 235)",
    },
  ],
};


const RevenueStatistic = () => {
  return (
    <Bar options={options} data={data} />
  )
};

export default RevenueStatistic;
