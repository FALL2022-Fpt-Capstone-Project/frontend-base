import { Button, Card, Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import React, { useState } from 'react';

function IncreaseRoomPrice({ visible, close, data }) {

    const onFinish = (e) => {
        close(false);
    }
    const onFinishFail = (e) => {

    }
    return (
        <>
            <Modal
                title="Tăng/giảm giá phòng"
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
                        Chỉnh sửa giá
                    </Button>,
                ]}
            >
                <Card className='card'>
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
                        >
                            <Radio.Group onChange={(e) => {

                            }}>
                                <Radio value={true}>Tăng</Radio>
                                <Radio value={false}>Giảm</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            className="form-item"
                            // name=""
                            labelCol={{ span: 24 }}
                            label={
                                <span>
                                    <b>Chọn % tăng/giảm giá: </b>
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn % tăng/giảm giá",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn % tăng/giảm giá"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={[]}
                            />
                        </Form.Item>
                    </Form>
                    <p><i><b>Tăng/giảm giá phòng</b>: <b>tăng</b> hoặc <b>giảm</b> giá của tất cả các phòng trong chung cư bạn bạn chọn theo số % bạn nhập</i></p>
                </Card>
            </Modal>
        </>
    );
}

export default IncreaseRoomPrice;