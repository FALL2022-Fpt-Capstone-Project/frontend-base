import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Button, Col, DatePicker, Row } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "../../api/axios";
const GET_RENTER_CONTRACT = "manager/statistical/chart/room-contract";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ContractStatistic = ({ dataContract = [] }) => {
  let cookie = localStorage.getItem("Cookie");
  const [contractRenter, setContractRenter] = useState([]);
  const [selectYear, setSelectYear] = useState(moment().format("YYYY"));

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Biểu đồ hợp đồng cho thuê " + selectYear,
        font: {
          size: 21,
        },
        color: "#868d96",
      },
    },
  };
  const data = {
    labels:
      contractRenter?.length === 0
        ? dataContract?.list_by_month?.map((obj) => {
            return "Tháng " + obj?.month;
          })
        : contractRenter?.list_by_month?.map((obj) => {
            return "Tháng " + obj?.month;
          }),
    datasets: [
      {
        label: "Số hợp đồng đã lập",
        data:
          contractRenter?.length === 0
            ? dataContract?.list_by_month?.map((obj) => {
                return obj?.total_created;
              })
            : contractRenter?.list_by_month?.map((obj) => {
                return obj?.total_created;
              }),
        backgroundColor: "rgba(53, 162, 235)",
      },
      {
        label: "Số hợp đồng đã kết thúc",
        data:
          contractRenter?.length === 0
            ? dataContract?.list_by_month?.map((obj) => {
                return obj?.total_ended;
              })
            : contractRenter?.list_by_month?.map((obj) => {
                return obj?.total_ended;
              }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const getContractStatistic = async (year = moment()) => {
    await axios
      .get(GET_RENTER_CONTRACT, {
        params: {
          year: year.format("YYYY"),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setContractRenter(res.data.data);
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
              getContractStatistic(e);
              setSelectYear(e.format("YYYY"));
            }}
          />
        </Col>
      </Row>
      <Bar height={100} options={options} data={data} />
    </>
  );
};

export default ContractStatistic;
