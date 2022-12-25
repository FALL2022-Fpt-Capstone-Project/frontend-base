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
        labels: contractRenter?.length === 0 ? dataContract?.list_by_month?.map(obj => { return "Tháng " + obj?.month }) :
            contractRenter?.list_by_month?.map(obj => { return "Tháng " + obj?.month }),
        datasets: [
            {
                label: 'Số hợp đồng đã lập',
                data: contractRenter?.length === 0 ? dataContract?.list_by_month?.map(obj => { return obj?.total_created }) :
                    contractRenter?.list_by_month?.map(obj => { return obj?.total_created }),
                backgroundColor: "rgba(53, 162, 235)",
            },
            {
                label: 'Số hợp đồng đã kết thúc',
                data: contractRenter?.length === 0 ? dataContract?.list_by_month?.map(obj => { return obj?.total_ended }) :
                    contractRenter?.list_by_month?.map(obj => { return obj?.total_ended }),
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };

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
            {/* <div className='title-bottom-contract'>
                <span className="title-margin-right">Tổng số hợp đồng đã lập: <b style={{ color: 'rgba(53, 162, 235)' }}>{contractRenter?.total_all_created}</b></span>
                <span className="title-margin-right">Tổng số hợp đồng đã kết thúc: <b style={{ color: '#cf1322' }}>{contractRenter?.total_all_ended}</b></span>
            </div> */}
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
            {/* <Row className="margin-top-bottom">
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
            </Row> */}
            <Bar height={100} options={options} data={data} />
            {/* <Button icon={<ArrowRightOutlined />} href="/contract-renter" className="margin-top-bottom" type='primary'>Quản lý hợp đồng cho thuê</Button> */}
        </>
    )
};

export default ContractStatistic;