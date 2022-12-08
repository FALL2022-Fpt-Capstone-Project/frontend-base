import { AutoComplete, Button, Card, Col, Form, Input, InputNumber, message, Modal, notification, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
const ADD_ROOM = "manager/room/add";


function AddRoom({ reRender, visible, close, data }) {
    // const reload = () => window.location.reload();
    const [formAddRoom] = Form.useForm();
    const navigate = useNavigate();
    const [groupSelect, setGroupSelect] = useState([]);
    const [statusSelectFloor, setStatusSelectFloor] = useState(true);
    const [roomFloor, setRoomFloor] = useState([]);
    const [optionAutoComplete, setOptionAutoComplete] = useState([]);
    const [value, setValue] = useState('');
    let cookie = localStorage.getItem("Cookie");

    const onFinish = async (e) => {
        const data = [{
            room_name: e.roomName,
            room_floor: e.roomFloor,
            room_limit_people: e.numberOfPeople,
            contract_id: null,
            group_contract_id: null,
            group_id: e.groupId,
            room_price: e.roomPrice,
            room_area: e.roomSquare,
            is_old: false
        }];
        await axios
            .post(
                ADD_ROOM, data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookie}`,
                    },
                }
            )
            .then((res) => {
                // console.log(res.data.data);
                const key = `open${Date.now()}`;
                const btn = (
                    <>
                        <Button onClick={() => {
                            navigate('equipment', {
                                state: res.data.data?.map(room => {
                                    return { ...room, roomName: room.room_name }
                                })
                            });
                            notification.close(key);
                        }} type="primary">
                            Có
                        </Button>
                        <Button onClick={() => {
                            notification.close(key);
                        }}
                        >
                            Không
                        </Button>
                    </>
                );
                notification.success({
                    message: "Thêm mới thành công phòng " + e.roomName,
                    description: "Phòng chưa có trang thiết bị bạn có muốn thêm trang biết bị ?",
                    btn,
                    key,
                    placement: "top",
                    duration: 6,
                });
                // console.log(res);
                close(false);
                formAddRoom.resetFields();
                reRender();
            })
            .catch((error) => {
                // console.log(error);
                notification.error({
                    message: "Thêm mới phòng thất bại",
                    description: error.response.data.data,
                    placement: "top",
                    duration: 3,
                });
            });
    };

    const onFinishFail = (e) => {
        notification.error({
            message: "Thêm mới phòng thất bại",
            placement: "top",
            duration: 3,
        });
    }

    const onSearchAutoComplete = (searchText) => {

    };

    const checkDuplicate = (_, value) => {
        const check = groupSelect?.list_rooms?.find((room, index) =>
            room.room_name.trim().toUpperCase() === (value.trim().toUpperCase()));
        if (check !== undefined) {
            return Promise.reject(new Error('Tên phòng: ' + value + ' đã có trong chung cư bạn chọn'));
        } else {
            return Promise.resolve(new Error('Vui lòng nhập tên phòng'));
        }
    }

    const onSelectAutoComplete = (data) => {


    };
    const onChangeAutoComplete = (data) => {
        setValue(data);
    };

    return (
        <>
            <Modal
                title={<h2>Thêm mới phòng</h2>}
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
                    <Button htmlType="submit" type="primary" form="formAddRoom">
                        Tạo phòng
                    </Button>,
                ]}
                width={500}
            >
                <Form
                    form={formAddRoom}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFail}
                    layout="horizontal"
                    size={"default"}
                    id="formAddRoom"
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
                                        onChange={(e) => {
                                            setStatusSelectFloor(false);
                                            let listFloor = [{
                                                label: 'Chọn tầng',
                                                value: ""
                                            }];
                                            setGroupSelect(data?.find(group => group.group_id === e));
                                            const totalFloor = data?.find(group => group.group_id === e).total_floor;
                                            for (let i = 1; i <= totalFloor; i++) {
                                                listFloor.push({
                                                    label: 'Tầng ' + i,
                                                    value: i
                                                })
                                            }
                                            setRoomFloor(listFloor);
                                            formAddRoom.setFieldsValue({ roomFloor: "", roomName: "" })
                                        }}
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
                                        onChange={(e) => {
                                            let suggestRoomName = [];
                                            for (let i = 0; i <= 10; i++) {
                                                if (groupSelect?.list_rooms?.find(obj => obj.room_name === (e * 100 + i).toString()) === undefined)
                                                    suggestRoomName.push({
                                                        value: (e * 100 + i).toString()
                                                    })
                                            };
                                            setOptionAutoComplete(suggestRoomName)
                                        }}
                                        disabled={statusSelectFloor}
                                        placeholder="Chọn tầng"
                                        options={roomFloor}
                                    />
                                </Form.Item>
                                <Form.Item
                                    className="form-item"
                                    name="roomName"
                                    labelCol={{ span: 24 }}
                                    label={
                                        <span>
                                            <b>Tên phòng: </b>
                                        </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập tên phòng",
                                        },
                                        {
                                            validator: checkDuplicate,
                                        }
                                    ]}
                                >
                                    <AutoComplete
                                        filterOption={(inputValue, option) =>
                                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                        options={optionAutoComplete}
                                        onSelect={onSelectAutoComplete}
                                        onChange={onChangeAutoComplete}
                                        onSearch={onSearchAutoComplete}
                                        placeholder="Nhập tên phòng"
                                    />
                                </Form.Item>
                                <Form.Item
                                    className="form-item"
                                    name="roomPrice"
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
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                                        style={{ width: "100%" }}
                                        min={1}
                                    />
                                </Form.Item>
                                <Form.Item
                                    className="form-item"
                                    name="numberOfPeople"
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
                                        {
                                            pattern: new RegExp(/^[0-9]*$/),
                                            message: "Vui lòng nhập số nguyên",
                                        }
                                    ]}
                                >
                                    <InputNumber
                                        min={1}
                                        addonAfter="Người"
                                        style={{ width: "100%" }}
                                        controls={false}
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
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}

export default AddRoom;