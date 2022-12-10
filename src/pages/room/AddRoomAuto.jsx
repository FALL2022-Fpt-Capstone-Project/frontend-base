import { Button, Card, Col, Form, Input, InputNumber, Modal, notification, Row, Select } from 'antd';
import axios from "../../api/axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADD_ROOM_PREVIEW = "manager/room/generate/preview";

function AddRoomAuto({ visible, close, data }) {
    // console.log(data);
    const [formAddRoomAuto] = Form.useForm();
    const [statusSelectFloor, setStatusSelectFloor] = useState(true);
    const [groupSelect, setGroupSelect] = useState([]);
    const [roomFloor, setRoomFloor] = useState([]);
    const navigate = useNavigate();

    let cookie = localStorage.getItem("Cookie");
    // const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
    const onFinish = async (e) => {
        const dataSend = {
            group_id: e.groupId,
            total_room_per_floor: e.numberOfRoom,
            room_name_convention: e.roomConvention,
            room_limited_people: e.limitPeople,
            room_price: e.generalRoomPrice,
            room_area: e.roomSquare,
            list_floor: e.roomFloor
        };
        // console.log(data);
        console.log(JSON.stringify(dataSend));
        await axios
            .post(
                ADD_ROOM_PREVIEW, dataSend,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookie}`,
                    },
                }
            )
            .then((res) => {
                console.log(res.data.data);
                if (res.data.data.list_generate_room.length === 0) {
                    notification.error({
                        message: "Chung cư bạn chọn đã đầy, vui lòng chọn chung cư khác",
                        description: 'Mỗi chung cư tối đa 100 phòng',
                        placement: "top",
                        duration: 3,
                    });
                } else {
                    navigate('preview', { state: { list_rooms: res.data.data, groupId: e.groupId, groupAll: data } });
                }
            })
            .catch((error) => {
                console.log(error);
                notification.error({
                    message: "Thêm mới phòng nhanh thất bại",
                    placement: "top",
                    duration: 3,
                });
            });
    };
    const onFinishFail = (e) => {
        console.log(e);
        notification.error({
            message: "Thêm mới phòng nhanh thất bại",
            placement: "top",
            duration: 3,
        });
    };

    const validateNumberOfRoom = (_, value) => {
        if (value > 10 || value < 1) {
            return Promise.reject(new Error('Số lượng phòng mỗi tầng lớn hơn 0 và tối đa là 10 phòng'));
        } else {
            return Promise.resolve(new Error('Vui lòng nhập số lượng phòng'));
        }
    };

    return (
        <>
            <Modal
                title={<h2>Thêm mới phòng nhanh</h2>}
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
                    <Button htmlType="submit" type="primary" form="formAddRoomAuto">
                        Xem trước
                    </Button>,
                ]}
            >
                <Form
                    form={formAddRoomAuto}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFail}
                    layout="horizontal"
                    size={"default"}
                    id="formAddRoomAuto"
                >
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={24}>
                            <Card className='card'>
                                <Form.Item
                                    className="form-item"
                                    name="groupId"
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
                                        onChange={(e) => {
                                            setStatusSelectFloor(false);
                                            let listFloor = [];
                                            setGroupSelect(data?.find(group => group.group_id === e));
                                            const totalFloor = data?.find(group => group.group_id === e).total_floor;
                                            for (let i = 1; i <= totalFloor; i++) {
                                                listFloor.push({
                                                    label: 'Tầng ' + i,
                                                    value: i
                                                })
                                            }
                                            setRoomFloor(listFloor);
                                            formAddRoomAuto.setFieldsValue({ roomFloor: listFloor?.map(floor => floor.value), roomConvention: "" })
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    className="form-item"
                                    name="roomFloor"
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
                                        mode="multiple"
                                        disabled={statusSelectFloor}
                                        placeholder="Chọn tầng"
                                        options={roomFloor}
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
                                        {
                                            validator: validateNumberOfRoom
                                        }
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        controls={false}
                                        placeholder='Nhập số lượng phòng' />
                                </Form.Item>
                                <Form.Item
                                    className="form-item"
                                    name="roomConvention"
                                    labelCol={{ span: 24 }}
                                    label={
                                        <span>
                                            <b>Tên phòng quy ước: </b>
                                        </span>
                                    }
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: "Vui lòng nhập tên phòng",
                                //     },
                                // ]}
                                >
                                    <Input placeholder='Nhập tên phòng' />
                                </Form.Item>
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
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                                        style={{ width: "100%" }}
                                        min={0}
                                    />
                                </Form.Item>
                                <Form.Item
                                    className="form-item"
                                    name="limitPeople"
                                    labelCol={{ span: 24 }}
                                    label={
                                        <span>
                                            <b>Số lượng người tối đa / phòng: </b>
                                        </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập số lượng người tối đa mỗi phòng",
                                        },
                                        {
                                            validator: (_, value) => {
                                                if (value < 1) {
                                                    return Promise.reject(new Error('Số lượng người tối đa mỗi phòng ít nhất là 1 người'));
                                                } else {
                                                    return Promise.resolve(new Error("Vui lòng nhập số lượng người tối đa mỗi phòng"));
                                                }
                                            },
                                        }
                                    ]}
                                >
                                    <InputNumber
                                        addonAfter="Người"
                                        style={{ width: "100%" }}
                                        controls={false}
                                        placeholder='Nhập số lượng người tối đa mỗi phòng' />
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
                                        min={1}
                                        style={{ width: "100%" }}
                                        addonAfter="m2"
                                        controls={false}
                                        placeholder='Nhập diện tích phòng' />
                                </Form.Item>
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
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default AddRoomAuto;