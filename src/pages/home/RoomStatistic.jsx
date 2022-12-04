import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Thống kê phòng",
      font: {
        size: 24,
      },
    },
  },
};
const data = {
  labels: ["Phòng đã thuê", "Phòng còn trống"],
  datasets: [
    {
      data: [130, 49],
      backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
      borderWidth: 1,
    },
  ],
};
const RoomStatistic = () => {
  return <Pie data={data} options={options} />;
};

export default RoomStatistic;
