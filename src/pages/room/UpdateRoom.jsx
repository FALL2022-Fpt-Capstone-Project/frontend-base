import { AutoComplete, Button, Card, Col, Form, InputNumber, Modal, notification, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const UPDATE_ROOM = "manager/room/update";

let listFloor = [
  {
    label: "Chọn tầng",
    value: "",
  },
];

function UpdateRoom({ reRender, visible, close, data, dataUpdate, setDataUpdate }) {
  // const reload = () => window.location.reload();
  const [formUpdateRoom] = Form.useForm();
  const [groupSelect, setGroupSelect] = useState([]);
  const [optionAutoComplete, setOptionAutoComplete] = useState([]);
  const [roomFloor, setRoomFloor] = useState([]);
  const [value, setValue] = useState("");
  let cookie = localStorage.getItem("Cookie");

  if (dataUpdate !== undefined && visible === true) {
    listFloor = [];
    formUpdateRoom.setFieldsValue({
      roomId: dataUpdate.room_id,
      roomName: dataUpdate.roomName,
      groupId: dataUpdate.group_id,
      roomFloor: dataUpdate.roomFloor,
      roomPrice: dataUpdate.roomPrice,
      numberOfPeople: dataUpdate.room_limit_people,
      roomSquare: dataUpdate.roomSquare,
    });

    for (let i = 1; i <= data?.find((group) => group.group_id === dataUpdate.group_id)?.total_floor; i++) {
      listFloor.push({
        label: "Tầng " + i,
        value: i,
      });
    }
    setDataUpdate();
  }

  const onFinish = async (e) => {
    const data = [
      {
        room_id: e.roomId,
        room_name: e.roomName,
        room_floor: e.roomFloor,
        room_limit_people: e.numberOfPeople,
        room_current_water_index: null,
        room_current_electric_index: null,
        room_price: e.roomPrice,
        room_area: e.roomSquare,
      },
    ];
    await axios
      .put(UPDATE_ROOM, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Cập nhật thành công phòng " + e.roomName,
          placement: "top",
          duration: 8,
        });
        close(false);
        reRender();
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Cập nhật phòng thất bại",
          description: error.response.data.data,
          placement: "top",
          duration: 3,
        });
      });
  };

  const onFinishFail = (e) => {
    notification.error({
      message: "Cập nhật phòng thất bại",
      placement: "top",
      duration: 3,
    });
  };

  const onSearchAutoComplete = (searchText) => {};

  const onSelectAutoComplete = (data) => {};
  const onChangeAutoComplete = (data) => {
    setValue(data);
  };

  const checkDuplicate = (_, value) => {
    const check = data
      ?.find((group) => group.group_id === formUpdateRoom.getFieldsValue().groupId)
      ?.list_rooms?.filter((r) => r.room_id !== formUpdateRoom.getFieldsValue().roomId)
      ?.find((room, index) => room.room_name.trim().toUpperCase() === value.trim().toUpperCase());

    if (check !== undefined) {
      return Promise.reject(new Error("Tên phòng: " + value + " đã tồn tại"));
    } else {
      return Promise.resolve(new Error("Vui lòng nhập tên phòng"));
    }
  };

  return (
    <>
      <Modal
        title={<h2>Chỉnh sửa phòng</h2>}
        open={visible}
        onOk={() => {
          close(false);
        }}
        onCancel={() => {
          close(false);
        }}
        footer={[
          <Button htmlType="submit" type="primary" form="formUpdateRoom">
            Cập nhật
          </Button>,
          <Button
            key="back"
            onClick={() => {
              close(false);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={500}
      >
        <Form
          form={formUpdateRoom}
          onFinish={onFinish}
          onFinishFailed={onFinishFail}
          layout="horizontal"
          size={"default"}
          id="formUpdateRoom"
        >
          <Row>
            <Col span={24}>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={24}>
                  <Card className="card">
                    <Form.Item name="roomId" style={{ display: "none" }}></Form.Item>
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
                        disabled={true}
                        showSearch
                        placeholder="Chọn tòa nhà"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? "").includes(input)}
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        onChange={(e) => {
                          formUpdateRoom.setFieldsValue({ groupId: e, roomFloor: "", roomName: "" });
                          let listFloor = [
                            {
                              label: "Chọn tầng",
                              value: "",
                            },
                          ];
                          setGroupSelect(data?.find((group) => group.group_id === e));
                          const totalFloor = data?.find((group) => group.group_id === e).total_floor;
                          for (let i = 1; i <= totalFloor; i++) {
                            listFloor.push({
                              label: "Tầng " + i,
                              value: i,
                            });
                          }
                          setRoomFloor(listFloor);
                        }}
                        options={data?.map((obj, index) => {
                          return {
                            value: obj.group_id,
                            label: obj.group_name,
                          };
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
                      <Select placeholder="Chọn tầng" options={roomFloor.length === 0 ? listFloor : roomFloor} />
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
                        },
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
                      ]}
                    >
                      <InputNumber
                        placeholder="Nhập giá phòng"
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
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        addonAfter="Người"
                        style={{ width: "100%" }}
                        controls={false}
                        placeholder="Nhập số lượng người tối đa của phòng"
                      />
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
                        placeholder="Nhập diện tích phòng"
                      />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateRoom;
