import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import axios from "../../api/axios";
import React, { useEffect, useState } from 'react';


function AddRoomAuto({ visible, close, data }) {
    const [form] = Form.useForm();
    let cookie = localStorage.getItem("Cookie");
    // const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
    const onFinish = (e) => {
        close(false);
    }
    const onFinishFail = (e) => {

    };
    console.log(data);
    return (
        <>
            <Modal
                title="Thêm mới phòng nhanh"
                open={visible}
                onOk={() => {
                    close(false);
                }}
                onCancel={() => {
                    close(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            close(false);
                        }}
                    >
                        Đóng
                    </Button>,
                    <Button href='room/preview' htmlType="submit" key="submit" form="addRoomAuto" type="primary">
                        Xem trước
                    </Button>,
                ]}
            >
                <Card className='card'>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFail}
                        layout="horizontal"
                        size={"default"}
                        id="addRoomAuto"
                    >
                        <Form.Item
                            className="form-item"
                            name="building"
                            labelCol={{ span: 24 }}
                            label={
                                <span>
                                    <b>Chọn chung cư: </b>
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn tòa nhà",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn tòa nhà"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={data?.map((obj, index) => {
                                    return {
                                        value: obj.group_id,
                                        label: obj.group_name
                                    }
                                })}
                            />
                        </Form.Item>
                        <Form.Item
                            className="form-item"
                            name="floor"
                            labelCol={{ span: 24 }}
                            label={
                                <span>
                                    <b>Chọn tầng: </b>
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn tầng",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn tầng"
                                options={[]}
                            />
                        </Form.Item>
                        <Form.Item
                            className="form-item"
                            name="numberOfRoom"
                            labelCol={{ span: 24 }}
                            label={
                                <span>
                                    <b>Số lượng phòng mỗi tầng: </b>
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng só lượng phòng",
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                controls={false}
                                placeholder='Nhập số lượng phòng' />
                        </Form.Item>
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    className="form-item"
                                    name="roomConvention"
                                    labelCol={{ span: 24 }}
                                    label={
                                        <span>
                                            <b>Tên phòng quy ước: </b>
                                        </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập tên phòng",
                                        },
                                    ]}
                                >
                                    <Input placeholder='Nhập tên phòng' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <p><i><b>Ví dụ:</b>Tầng: <b>1</b>, Số lượng phòng mỗi tầng: <b>10</b>, Tên phòng quy ước: <b>A</b>.
                                    Phòng sẽ tự động được tạo lần lượt là: <b>A101, A102, A103 ... A110.</b>
                                </i></p>
                            </Col>
                        </Row>
                        <Form.Item
                            className="form-item"
                            name="generalRoomPrice"
                            labelCol={{ span: 24 }}
                            label={
                                <span>
                                    <b>Giá phòng chung: </b>
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập giá phòng",
                                },
                            ]}>
                            <InputNumber
                                placeholder='Nhập giá phòng'
                                controls={false}
                                addonAfter="VNĐ"
                                defaultValue={0}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                                style={{ width: "100%" }}
                                min={0}
                            />
                        </Form.Item>
                        <Form.Item
                            className="form-item"
                            name="numberOfPerson"
                            labelCol={{ span: 24 }}
                            label={
                                <span>
                                    <b>Số lượng người tối đa / phòng: </b>
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số lượng",
                                },
                            ]}
                        >
                            <InputNumber
                                addonAfter="Người"
                                style={{ width: "100%" }}
                                controls={false}
                                defaultValue={1}
                                placeholder='Nhập số lượng người tối đa của phòng' />
                        </Form.Item>
                        <Form.Item
                            className="form-item"
                            name="roomSquare"
                            labelCol={{ span: 24 }}
                            label={
                                <span>
                                    <b>Diện tích (m2): </b>
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập diện tích phòng",
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                addonAfter="m2"
                                controls={false}
                                placeholder='Nhập diện tích phòng' />
                        </Form.Item>
                    </Form>
                    <Row>
                        <Col>
                            <p>
                                <i>
                                    <b>Thêm mới phòng nhanh: </b> các thông tin về phòng sẽ tự động được thêm vào giúp việc nhập dữ liệu nhanh
                                    hơn
                                </i>
                            </p>
                        </Col>
                    </Row>
                </Card>
            </Modal>
        </>
    );
}

export default AddRoomAuto;