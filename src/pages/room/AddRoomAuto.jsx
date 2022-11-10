import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import React, { useState } from 'react';

function AddRoomAuto({ visible, close, data }) {

    const onFinish = (e) => {
        close(false);
    }
    const onFinishFail = (e) => {

    }
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
                    <Button htmlType="submit" key="submit" form="" type="primary">
                        Thêm mới
                    </Button>,
                ]}
            >
                <Form
                    // form={""}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFail}
                    layout="horizontal"
                    size={"default"}
                // id=""
                >
                    <Form.Item
                        className="form-item"
                        // name=""
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
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={[]}
                        />
                    </Form.Item>
                    <Form.Item
                        className="form-item"
                        // name=""
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
                        // name=""
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
                        <Col span={12}>
                            <Form.Item
                                className="form-item"
                                // name=""
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
                        <Col span={11} offset={1}>
                            <Form.Item
                                className="form-item"
                                // name=""
                                labelCol={{ span: 24 }}
                                label={
                                    <span>
                                        <b>Số phòng quy ước: </b>
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số phòng",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    controls={false}
                                    placeholder='Nhập số phòng' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <p><i><b>Ví dụ:</b>Tầng: <b>1</b>, Số lượng phòng: <b>10</b>, Tên phòng: <b>A</b>, Số phòng: <b>101</b>.
                                Phòng sẽ tự động được tạo lần lượt là: <b>A101, A102, A103 ... A110</b>
                            </i></p>
                        </Col>
                    </Row>
                    <Form.Item
                        className="form-item"
                        // name=""
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Giá phòng trung bình: </b>
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
                        // name=""
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
                        // name=""
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Diện tích phòng trung bình: </b>
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
            </Modal>
        </>
    );
}

export default AddRoomAuto;