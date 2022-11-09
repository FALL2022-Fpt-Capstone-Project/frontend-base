import { Button, Form, Input, InputNumber, Modal } from 'antd';
import React from 'react';

function ModalExample({ visible }) {
    const onFinish = (e) => {

    }
    const onFinishFail = (e) => {

    }
    return (
        <>
            <Modal
                title="Tiêu đề"
                open={visible}
                onOk={() => {
                    //
                }}
                onCancel={() => {
                    //
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            //
                        }}
                    >
                        Đóng
                    </Button>,
                    <Button htmlType="submit" key="submit" form="" type="primary">
                        Lưu
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
                                <b>Tiêu đề</b>
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: "",
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input placeholder=""></Input>
                    </Form.Item>
                    <Form.Item
                        className="form-item"
                        // name=""
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Số điện thoại: </b>
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại",
                                whitespace: true,
                            },
                            {
                                pattern: /^((\+84|84|0)+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                                message: "Số điện thoại phải bắt đầu (+84,0,84)",
                            },
                        ]}
                    >
                        <Input placeholder="Số điện thoại" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        className="form-item"
                        // name="identity_card"
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>CMND/CCCD: </b>
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập CMND/CCCD",
                                whitespace: true,
                            },
                            {
                                pattern: /^([0-9]{12})\b/,
                                message: "Vui lòng nhập đúng CMND/CCCD (12 số)",
                            },
                        ]}
                    >
                        <Input disabled placeholder="CMND/CCCD" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        className="form-item"
                        name=""
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Tiền</b>
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiền cọc",
                            },
                        ]}
                    >
                        <InputNumber
                            controls={false}
                            addonAfter="VNĐ"
                            defaultValue={0}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                            style={{ width: "100%" }}
                            min={0}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default ModalExample;