import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Col, DatePicker, Row } from "antd";
import moment from "moment";
import axios from "../../api/axios";
const GET_REVENUE = "manager/statistical/chart/revenue";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueStatistic = ({ dataRevenue = [] }) => {
  let cookie = localStorage.getItem("Cookie");
  const [selectYear, setSelectYear] = useState(moment().format("YYYY"));
  const [revenue, setRevenue] = useState([]);

  const data = {
    labels:
      revenue?.length === 0
        ? dataRevenue?.map((obj) => {
            return "Tháng " + obj?.month;
          })
        : revenue?.map((obj) => {
            return "Tháng " + obj?.month;
          }),
    datasets: [
      {
        data:
          revenue?.length === 0
            ? dataRevenue?.map((obj) => {
                return obj?.revenue;
              })
            : revenue?.map((obj) => {
                return obj?.revenue;
              }),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgb(53, 162, 235)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Biểu đồ doanh thu " + selectYear + " (VNĐ)",
        font: {
          size: 21,
        },
        color: "#868d96",
      },
    },
  };

  const getRevenue = async (year = moment()) => {
    await axios
      .get(GET_REVENUE, {
        params: {
          year: year.format("YYYY"),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setRevenue(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <span className="statistic-time-title">Chọn năm: </span>
          <DatePicker
            defaultValue={moment()}
            placeholder="Chọn thời gian"
            size={"large"}
            picker="year"
            onChange={(e) => {
              setSelectYear(e.format("YYYY"));
              getRevenue(e);
            }}
          />
        </Col>
        <Line height={150} options={options} data={data} />
      </Row>
    </>
  );
};

export default RevenueStatistic;
