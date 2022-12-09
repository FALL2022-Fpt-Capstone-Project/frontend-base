import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Thống kê hoá đơn năm 2022",
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
      label: "Số hoá đơn đã lập",
      data: [4, 5, 7, 30, 7, 8, 8, 11, 12, 23, 5, 5],
      backgroundColor: "rgba(53, 162, 235)",
    },
    {
      label: "Số hoá đơn còn nợ",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
      backgroundColor: "rgba(255, 99, 132)",
    },
  ],
};
const InvoiceStatistic = () => {
  return <Bar options={options} data={data} />;
};

export default InvoiceStatistic;
