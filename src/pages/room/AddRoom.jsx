import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import React, { useState } from 'react';

function AddRoom({ visible, close, data }) {

    const onFinish = (e) => {
        close(false);
    }
    const onFinishFail = (e) => {

    }
    return (
        <>
            <Modal
                title="Thêm mới phòng"
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
                                <b>Tên phòng : </b>
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
                    <Form.Item
                        className="form-item"
                        // name=""
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Giá phòng: </b>
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
            </Modal>
        </>
    );
}

export default AddRoom;