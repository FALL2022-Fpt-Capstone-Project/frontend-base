import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Col, DatePicker, Row } from "antd";
import moment from "moment";
import axios from "../../api/axios";
const GET_REVENUE = "manager/statistical/chart/revenue";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const RevenueStatistic = () => {
  let cookie = localStorage.getItem("Cookie");
  const [selectYear, setSelectYear] = useState(moment().format('YYYY'));
  const [revenue, setRevenue] = useState([]);
  useEffect(() => {
    getRevenue();
  }, []);

  const data = {
    labels: revenue?.map(obj => {
      return 'Tháng ' + obj?.month
    }),
    datasets: [
      {
        data: revenue?.map(obj => {
          return obj?.revenue
        }),
        backgroundColor: "rgba(53, 162, 235)",
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
        text: "Doanh thu " + selectYear + " (VNĐ)",
        font: {
          size: 21,
        },
        color: '#868d96'
      },
    },
  };

  const getRevenue = async (year = moment()) => {
    await axios
      .get(GET_REVENUE, {
        params: {
          year: year.format('YYYY'),
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
            // format={"MM/YYYY"}
            onChange={(e) => {
              setSelectYear(e.format('YYYY'));
              getRevenue(e);
              // getBillByGroupId(groupSelect, e.format("MM-YYYY"));
            }}
          />
        </Col>
        <div className="bar-chart">
          <Bar options={options} data={data} />
        </div>
      </Row>
    </>
  )
};

export default RevenueStatistic;