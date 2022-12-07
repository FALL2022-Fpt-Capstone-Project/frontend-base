import { Button, Card, Form, Input, InputNumber, Modal, notification, Radio, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
const UPDATE_ROOM_PRICE = "manager/room/room-price-adjust";

function IncreaseRoomPrice({ reRender, visible, close, data }) {
    const [formCoupon] = Form.useForm();
    let cookie = localStorage.getItem("Cookie");

    const onFinish = async (e) => {
        const data = {
            number: e.moneyNumber,
            increase: e.increaseDecrease,
            group_id: e.group_id
        };

        await axios
            .post(
                UPDATE_ROOM_PRICE, data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookie}`,
                    },
                }
            )
            .then((res) => {
                notification.success({
                    message: "Cập nhật giá thành công",
                    placement: "top",
                    duration: 6,
                });
                // console.log(res);
                close(false);
                formCoupon.resetFields();
                formCoupon.setFieldsValue({
                    increaseDecrease: true
                });
                reRender();
            })
            .catch((error) => {
                // console.log(error);
                notification.error({
                    message: "Cập nhật giá phòng thất bại",
                    description: error.response.data.data,
                    placement: "top",
                    duration: 3,
                });
            });
    }
    const onFinishFail = (e) => {
        notification.error({
            message: "Vui lòng kiểm tra lại thông tin",
            placement: "top",
            duration: 3,
        });
    }

    useEffect(() => {
        formCoupon.setFieldsValue({
            increaseDecrease: true
        });
    }, []);

    return (
        <>
            <Modal
                title="Cập nhật giá phòng"
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
                    <Button htmlType="submit" key="submit" form="formCoupon" type="primary">
                        Cập nhật giá
                    </Button>,
                ]}
            >
                <Card className='card'>
                    <Form
                        form={formCoupon}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFail}
                        layout="horizontal"
                        size={"default"}
                        id="formCoupon"
                    >
                        <Form.Item
                            className="form-item"
                            name="group_id"
                            labelCol={{ span: 24 }}
                            label={
                                <span>
                                    <b>Chọn chung cư: </b>
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn chung cư",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn chung cư"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label.toLowerCase().trim() ?? '').includes(input.toLowerCase().trim())}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
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
                            name="increaseDecrease"
                            labelCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn tăng hoặc giảm",
                                },
                            ]}
                        >
                            <Radio.Group onChange={(e) => {

                            }}>
                                <Radio value={true}>Tăng</Radio>
                                <Radio value={false}>Giảm</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            className="form-item"
                            name="moneyNumber"
                            labelCol={{ span: 24 }}
                            label={
                                <span>
                                    <b>Nhập số tiền: </b>
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập số tiền",
                                },
                            ]}
                        >
                            <InputNumber
                                placeholder='Nhập số tiền'
                                controls={false}
                                addonAfter="VNĐ"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                                style={{ width: "100%" }}
                                min={1}
                            />
                        </Form.Item>
                    </Form>
                    <p>
                        <i>
                            <b>Cập nhật giá phòng</b>: <b>tăng</b> hoặc <b>giảm</b> giá của tất cả các phòng trong chung cư bạn bạn chọn theo số tiền
                        </i>
                    </p>
                </Card>
            </Modal>
        </>
    );
}

export default IncreaseRoomPrice;