import { Button, Col, Form, Input, InputNumber, Modal, notification, Row, Select } from 'antd';
import React from 'react';
import {
    DeleteOutlined, PlusOutlined
} from "@ant-design/icons";
import axios from '../../api/axios';

const ADD_ASSET = "manager/asset/room/add";

function AddMultiEquipment({ reload, openView, closeView, assetTypeList, roomId }) {
    const [formMultiAsset] = Form.useForm();
    let cookie = localStorage.getItem("Cookie");

    const onFinish = async (dataAsset) => {
        const data = dataAsset?.list_additional_asset?.map(asset => {
            return {
                room_asset_id: null,
                asset_name: asset.asset_name.trim(),
                asset_type_id: asset.asset_type_id,
                asset_quantity: asset.asset_quantity,
                room_id: roomId
            }
        });

        await axios
            .post(ADD_ASSET, data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
            })
            .then((res) => {
                console.log(res.data.data);
                notification.success({
                    message: "Thêm mới tài sản thành công",
                    placement: "top",
                    duration: 2,
                });
                formMultiAsset.resetFields();
                closeView(false);
                reload();
            })
            .catch((error) => {
                console.log(error);
                notification.error({
                    message: "Thêm mới tài sản thất bại",
                    placement: "top",
                    duration: 2,
                });
            });
    };
    const onFinishFail = (e) => {

    }

    return (
        <>
            <Modal
                title="Thêm mới nhiều tài sản"
                open={openView}
                onOk={() => {
                    closeView(false);
                }}
                onCancel={() => {
                    closeView(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            closeView(false);
                        }}
                    >
                        Đóng
                    </Button>,
                    <Button htmlType="submit" key="submit" form="addMultiAsset" type="primary">
                        Thêm mới
                    </Button>,
                ]}
                width={900}
            >
                <Form
                    form={formMultiAsset}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFail}
                    layout="horizontal"
                    size={"default"}
                    id="addMultiAsset"
                >
                    <Form.List name="list_additional_asset">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row>
                                        <Col span={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "asset_name"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: "Vui lòng nhập tên tài sản, hoặc xoá trường này",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Nhập tên tài sản" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6} offset={1}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "asset_quantity"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Vui lòng nhập số lượng",
                                                    },
                                                    {
                                                        pattern: new RegExp(/^[0-9]*$/),
                                                        message: "Vui lòng nhập số nguyên",
                                                    }
                                                ]}
                                            >
                                                <InputNumber placeholder="Nhập số lượng tài sản" style={{ width: "100%" }} min={1} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6} offset={1}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "asset_type_id"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Vui lòng chọn nhóm tài sản!",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                    defaultValue="Chọn nhóm tài sản"
                                                // onChange={internetChange}
                                                >
                                                    {assetTypeList?.map((obj, index) => {
                                                        return (
                                                            <>
                                                                <Select.Option key={index} value={obj.id}>
                                                                    {obj.asset_type_show_name}
                                                                </Select.Option>
                                                            </>
                                                        );
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={3} offset={1}>
                                            <DeleteOutlined style={{
                                                color: 'red'
                                            }} className="dynamic-delete-button" onClick={() => remove(name)} />
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm tài sản mới
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </>
    );
}

export default AddMultiEquipment;