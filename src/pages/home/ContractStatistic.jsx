import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Button, Col, DatePicker, Divider, Row, Statistic } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "../../api/axios";
const GET_RENTER_CONTRACT = "manager/statistical/chart/room-contract";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const ContractStatistic = () => {
    let cookie = localStorage.getItem("Cookie");
    const [contractRenter, setContractRenter] = useState([]);
    const [selectYear, setSelectYear] = useState(moment().format('YYYY'));

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
                color: '#868d96'
            },
        },
    };
    const data = {
        labels: contractRenter?.list_by_month?.map(obj => { return "Tháng " + obj?.month }),
        datasets: [
            {
                label: 'Số hợp đồng đã lập',
                data: contractRenter?.list_by_month?.map(obj => { return obj?.total_created }),
                backgroundColor: "rgba(53, 162, 235)",
            },
            {
                label: 'Số hợp đồng đã kết thúc',
                data: contractRenter?.list_by_month?.map(obj => { return obj?.total_ended }),
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };
    useEffect(() => {
        getContractStatistic();
    }, []);

    const getContractStatistic = async (year = moment()) => {
        await axios
            .get(GET_RENTER_CONTRACT, {
                params: {
                    year: year.format('YYYY'),
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
                        // format={"MM/YYYY"}
                        onChange={(e) => {
                            getContractStatistic(e);
                            setSelectYear(e.format('YYYY'));
                        }}
                    />
                </Col>
            </Row>
            <Row className="margin-top-bottom">
                <Col>
                    <Statistic
                        title={
                            <>
                                <a href="/contract-renter" className="revenue-statistic">Tổng số hợp đồng đã lập</a>
                            </>
                        }
                        value={contractRenter?.total_all_created}
                        valueStyle={{
                            color: "rgba(53, 162, 235)",
                        }}
                    />
                </Col>
                <Col offset={1}>
                    <Statistic
                        title={
                            <>
                                <a href="/contract-renter" className="revenue-statistic">Tổng số hợp đồng đã kết thúc</a>
                            </>
                        }
                        value={contractRenter?.total_all_ended}
                        valueStyle={{
                            color: "#cf1322",
                        }}
                    />
                </Col>
            </Row>
            <div className="bar-chart">
                <Bar options={options} data={data} />
            </div>
            <Button icon={<ArrowRightOutlined />} href="/contract-renter" className="margin-top-bottom" type='primary' class>Quản lý hợp đồng cho thuê</Button>
        </>
    )
};

export default ContractStatistic;