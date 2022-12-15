import { Button, Card, Col, Form, Input, InputNumber, Modal, notification, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import axios from "../../api/axios";
import "./building.scss";
const UPDATE_BUILDING_URL = "manager/group/add";
const UpdateBuilding = ({ visible, close, id }) => {
  const [form] = Form.useForm();

  const [group_name, setBuildingName] = useState("");
  const [building_address_city, setBuildingCity] = useState("");
  const [room_area, setRoomArea] = useState("");
  const [room_limited_people, setRoomPeople] = useState("");
  const [room_price, setRoomRate] = useState("");

  const [address_city, setCity] = useState("");
  const [address_district, setDistrict] = useState("");
  const [address_ward, setWard] = useState("");
  const [description, setNote] = useState("");
  const [building_address_city_id, setBuildingCityId] = useState("");
  const [building_address_district, setBuildingDistrict] = useState([]);
  const [building_address_district_id, setBuildingDistrictId] = useState("");
  const [building_address_wards, setBuildingWard] = useState([]);
  const [address_more_detail, setBuildingAddress] = useState("");
  const [disabledDistrict, setDisableDistrict] = useState(true);
  const [disabledWard, setDisableWard] = useState(true);

  let cookie = localStorage.getItem("Cookie");
  let roleInfo = localStorage.getItem("Role");
  useEffect(() => {
    axios
      .get(`manager/group/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        form.setFieldsValue({
          building_name: res.data.data?.group_name,
          room_rate: res.data.data?.list_rooms[0].room_price,
          room_people: res.data.data?.list_rooms[0].room_limit_people,
          building_address_more_detail: res.data.data?.address.address_more_details,
          city: res.data.data?.address.address_city,
          district: res.data.data?.address.address_district,
          ward: res.data.data?.address.address_wards,
          room_area: res.data?.data.list_rooms[0].room_area,
          note: res.data.data?.description,
        });
        setBuildingName(res.data.data?.group_name);
        setRoomPeople(res.data.data?.list_rooms[0].room_limit_people);
        setRoomArea(res.data?.data.list_rooms[0].room_area);
        setBuildingAddress(res.data.data?.address.address_more_details);
        setRoomRate(res.data.data?.list_rooms[0].room_price);
        setCity(res.data.data?.address.address_city);
        setDistrict(res.data.data?.address.address_district);
        setWard(res.data.data?.address.address_wards);
        setNote(res.data.data?.description);
        // console.log(res.data.data?.address.address_more_detail);
        // console.log(res);
      });
  }, [id]);
  const data = {
    group_name: group_name,
    room_limited_people: room_limited_people,
    room_price: room_price,
    room_area: room_area,
    address_city: address_city,
    address_district: address_district,
    address_ward: address_ward,
    address_more_detail: address_more_detail,
    description: description,
  };
  function Update(e) {
    axios
      .post(`manager/group/update/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Cập nhật thông tin chung cư thành công",
          duration: 3,
          placement: "top",
        });
        close(false);
        setTimeout(() => {
          reload();
        }, "1000");
      })
      .catch((e) =>
        notification.error({
          message: "Cập nhật thông tin chung cư thất bại",
          description: "Vui lòng kiểm tra lại thông tin và thử lại.",
          duration: 3,
          placement: "top",
        })
      );
    console.log(data);
  }
  useEffect(() => {
    const getCity = async () => {
      const response = await axios
        .get("https://provinces.open-api.vn/api/p/", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setBuildingCity(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCity();
  }, []);

  useEffect(() => {
    const getDistric = async () => {
      const response = await axios
        .get(`https://provinces.open-api.vn/api/p/${building_address_city_id}?depth=2`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setBuildingDistrict(res.data.districts);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getDistric();
  }, [building_address_city_id]);
  useEffect(() => {
    const getDistric = async () => {
      const response = await axios
        .get(`https://provinces.open-api.vn/api/d/${building_address_district_id}?depth=2`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setBuildingWard(res.data.wards);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getDistric();
  }, [building_address_district_id]);

  let optionsCity = [];
  for (let i = 0; i < building_address_city.length; i++) {
    optionsCity.push({
      label: building_address_city[i].name,
      value: building_address_city[i].code,
    });
  }

  const cityChange = (value, option) => {
    setBuildingDistrict([]);
    setBuildingCityId(value);
    setDisableDistrict(false);
    // optionsDistrict = [];
    setDisableWard(true);
    form.setFieldsValue({ district: "", ward: "" });
    setCity(option.label);
  };
  const districtChange = (value, option) => {
    console.log(value);
    setBuildingDistrictId(value);
    setDisableWard(false);
    form.setFieldsValue({ ward: "" });
    setDistrict(option.label);
  };
  const wardChange = (value, option) => {
    setWard(option.label);
  };
  const roomPeopleChange = (value) => {
    setRoomPeople(value);
  };
  const roomAreaChange = (value) => {
    setRoomArea(value);
  };
  const roomRateChange = (value) => {
    setRoomRate(value);
  };
  const reload = () => window.location.reload();
  return (
    <>
      <Modal
        title={<h2>Chỉnh sửa chung cư</h2>}
        open={visible}
        width={700}
        afterClose={() => form.resetFields()}
        onOk={() => {
          close(false);
          // reload();
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
          <Button htmlType="submit" key="submit" form="updateBuilding" type="primary">
            Chỉnh sửa
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={Update}
          // onFinishFailed={onFinishFail}
          layout="horizontal"
          size={"default"}
          id="updateBuilding"
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col span={24}>
              <Card className="card">
                <Form.Item
                  name="building_name"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Tên chung cư: </b>
                    </span>
                  }
                  rules={[
                    {
                      message: "Vui lòng nhập tên chung cư!",
                    },
                    {
                      required: true,
                      message: "Vui lòng nhập tên chung cư!",
                    },
                  ]}
                >
                  <Input onChange={(e) => setBuildingName(e.target.value)} placeholder="Nhập tên chung cư" />
                </Form.Item>

                <Form.Item
                  className="form-item"
                  name="room_rate"
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
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập giá phòng"
                    controls={false}
                    addonAfter="VNĐ"
                    defaultValue={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "100%" }}
                    min={0}
                    onChange={roomRateChange}
                  />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="room_people"
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
                    placeholder="Nhập số lượng người tối đa của phòng"
                    onChange={roomPeopleChange}
                  />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="room_area"
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
                    onChange={roomAreaChange}
                  />
                </Form.Item>
                <Form.Item
                  name="city"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Chọn thành phố: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn thành phố!",
                    },
                  ]}
                >
                  <Select
                    defaultValue="Chọn thành phố"
                    style={{
                      width: "100%",
                    }}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase().trim() ?? "").includes(input?.toLowerCase().trim())
                    }
                    onChange={cityChange}
                    options={optionsCity}
                  />
                </Form.Item>
                <Form.Item
                  name="district"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Chọn Quận/Huyện: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn quận/huyện!",
                    },
                  ]}
                >
                  <Select
                    defaultValue="Chọn Quận/Huyện"
                    style={{
                      width: "100%",
                    }}
                    disabled={disabledDistrict}
                    onChange={districtChange}
                    // options={optionsDistrict}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase().trim() ?? "").includes(input?.toLowerCase().trim())
                    }
                    options={building_address_district === undefined ? [] : [...building_address_district?.map(obj => {
                      return { label: obj.name, value: obj.code }
                    }), {
                      label: 'Chọn Quận/Huyện',
                      value: ""
                    },]}
                  >
                    {/* <Select.Option value="">Chọn Quận/Huyện</Select.Option>
                    {building_address_district?.map((obj, index) => {
                      return (
                        <>
                          <Select.Option value={obj.code}>{obj.name}</Select.Option>
                        </>
                      );
                    })} */}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="ward"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Chọn Phường/Xã: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn phường/xã!",
                    },
                  ]}
                >
                  <Select
                    defaultValue="Chọn Phường/Xã"
                    style={{
                      width: "100%",
                    }}
                    disabled={disabledWard}
                    onChange={wardChange}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase().trim() ?? "").includes(input?.toLowerCase().trim())
                    }
                    options={building_address_wards === undefined ? [] : [...building_address_wards?.map(obj => {
                      return { label: obj.name, value: obj.code }
                    }), {
                      label: 'Chọn Phường/Xã',
                      value: ""
                    },]}
                  >
                    {/* <Select.Option value="">Chọn Phường/Xã</Select.Option>
                    {building_address_wards?.map((obj, index) => {
                      return (
                        <>
                          <Select.Option value={obj.code}>{obj.name}</Select.Option>
                        </>
                      );
                    })} */}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="building_address_more_detail"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Địa chỉ chi tiết: </b>
                    </span>
                  }
                // rules={[
                //   {
                //     message: "Vui lòng nhập địa chỉ!",
                //   },
                //   {
                //     required: true,
                //     message: "Vui lòng nhập địa chỉ!",
                //   },
                // ]}
                >
                  <Input onChange={(e) => setBuildingAddress(e.target.value)} placeholder="Nhập địa chỉ chi tiết" />
                </Form.Item>
                <Form.Item
                  name="note"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Mô tả: </b>
                    </span>
                  }
                >
                  <TextArea rows={4} onChange={(e) => setNote(e.target.value)} placeholder="Nhập ghi chú" />
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateBuilding;
