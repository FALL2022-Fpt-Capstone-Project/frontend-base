import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Row, Select } from 'antd';
import axios from '../../api/axios';
const ROOM_STATUS = "manager/statistical/room/status";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: "Trạng thái phòng",
            font: {
                size: 21,
            },
            color: '#868d96'
        },
    },
};




const RoomStatus = ({ dataGroup }) => {
    let cookie = localStorage.getItem("Cookie");
    const [roomStatus, setRoomStatus] = useState([]);
    useEffect(() => {
        getRoomStatus();
    }, []);
    
    const getRoomStatus = async (groupId = null) => {
        await axios
            .get(ROOM_STATUS, {
                params: {
                    groupId: groupId,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
            })
            .then((res) => {
                setRoomStatus(res.data.data);
                // console.log(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const data = {
        labels: ["Phòng còn trống", "Phòng đã thuê"],
        datasets: [
            {
                data: [roomStatus?.total_empty_room, roomStatus?.total_rented_room],
                backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                borderWidth: 1,
            },

        ],
    };

    return (
        <>
            <Row>
                <Select
                    defaultValue={""}
                    placeholder="Chọn chung cư"
                    className="select-w-100"
                    showSearch
                    filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.trim().toLowerCase())}
                    options={[
                        ...dataGroup?.map((group) => {
                            return { label: group.group_name, value: group.group_id };
                        }),
                        {
                            label: "Tất cả chung cư",
                            value: "",
                        },
                    ]}
                    onChange={(e) => {
                        getRoomStatus(e);
                    }}
                />
            </Row>
            <Row>
                <Col span={12}>
                    <Pie data={data} options={options} />
                </Col>
                <Col className='text-Center' span={12}>
                    <Row>
                        <Col span={24}>
                            <p className="statistic-time-title">Tổng số phòng đã thuê: <b>{roomStatus?.total_rented_room}</b></p>
                            <p className="statistic-time-title">Tổng số phòng còn trống: <b>{roomStatus?.total_empty_room}</b></p>
                            <Button icon={<ArrowRightOutlined />} href="/room" type='primary'>Quản lý phòng</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
};

export default RoomStatus;
