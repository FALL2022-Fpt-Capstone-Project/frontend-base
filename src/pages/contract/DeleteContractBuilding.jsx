import { Button, Col, Divider,  Modal, notification, Row, Statistic, Table, Tabs, Tag } from "antd";
import React, { useState, useEffect } from "react";
import {
    DeleteOutlined
} from "@ant-design/icons";
import axios from "../../api/axios";
import moment from "moment";
const DELETE_GROUP_CONTRACT = "manager/contract/group/end";


const textSize = {
    fontSize: 15,
};

function DeleteContractBuilding({ reload, openView, closeView, dataContract, dataInvoice, loading }) {
    console.log(dataInvoice);
    let cookie = localStorage.getItem("Cookie");

    const handleOk = () => {
        closeView(false);
    };
    const handleCancel = () => {
        closeView(false);
    };
    useEffect(() => {

    }, []);
    const columnInvoice = [
        {
            title: "Tên phòng",
            dataIndex: "room_name",
            key: "room_id",
        },
        {
            title: 'Số tiền cần thu',
            dataIndex: "need_to_paid",
            key: "room_id",
            render: (need_to_paid) => {
                return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(need_to_paid)
            }
        },
        {
            title: 'Ngày tạo hóa đơn',
            dataIndex: "created_time",
            key: "room_id",
            render: (created_time) => {
                return moment(created_time).format("DD-MM-YYYY")
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: "created_time",
            key: "room_id",
            render: () => {
                return <Tag color="error">Chưa thanh toán</Tag>
            }
        },
    ]

    const onDeleteGroupContract = async (contract_id, total_money) => {
        // let cookie = localStorage.getItem("Cookie");
        await axios
            .post(DELETE_GROUP_CONTRACT, { group_contract_id: contract_id }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
            })
            .then((res) => {
                notification.success({
                    message: ` Kết thúc hợp đồng thành công`,
                    placement: "top",
                    duration: 3,
                });
                closeView(false);
                reload();
            })
            .catch((error) => {
                notification.error({
                    message: "Kết thúc hợp đồng thất bại",
                    placement: "top",
                    duration: 3,
                });
            });
    };
    return (
        <>
            <div>
                <Modal
                    title={<h2>{dataContract?.group_name}</h2>}
                    width={1200}
                    open={openView}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button
                            key="back"
                            onClick={() => {
                                closeView(false);
                            }}
                        >
                            Đóng
                        </Button>,
                    ]}
                >
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab={<span style={{ fontSize: '17px' }}>Hóa đơn chưa thanh toán</span>} key="1">
                            <Row style={{ marginBottom: "2%" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col span={12}>
                                    <Statistic
                                        title={
                                            <>
                                                <span style={textSize}>Hóa đơn chưa thanh toán</span>
                                            </>
                                        }
                                        value={dataInvoice?.length}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title={
                                            <>
                                                <span style={textSize}>Số tiền chưa thanh toán (VND)</span>
                                            </>
                                        }
                                        value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                            dataInvoice?.map(invoice => invoice?.need_to_paid)?.reduce((pre, current) => pre + current, 0))}
                                    />
                                </Col>
                            </Row>
                            <Divider />
                            <Table
                                loading={loading}
                                columns={columnInvoice}
                                dataSource={dataInvoice}
                                scroll={{ x: 1000, y: 800 }}
                                bordered
                            />
                        </Tabs.TabPane>
                    </Tabs>
                    <Button
                        disabled={dataInvoice.length === 0 ? false : true}
                        onClick={() => {
                            Modal.confirm({
                                title: `Bạn có chắc chắn muốn kết thúc hợp đồng ${dataContract?.group_name} ?`,
                                okText: "Có",
                                cancelText: "Hủy",
                                onOk: () => {
                                    onDeleteGroupContract(dataContract?.contract_id)
                                },
                            });
                        }} style={{ marginTop: '3%' }} type='danger' icon={<DeleteOutlined />}>Kết thúc hợp đồng</Button>
                    <p>
                        <i style={{ color: 'red' }}>Bạn cần thanh toán hết hóa đơn trước khi kết thúc hợp đồng</i>
                    </p>
                </Modal>
            </div>
        </>
    );
}

export default DeleteContractBuilding;
