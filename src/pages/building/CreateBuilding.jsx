import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Checkbox } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./building.scss";
const GET_LIST_SERVICE_BASIC = "manager/service/basics";
const LIST_SERVICE_CACUL_METHOD = "manager/service/types";
const CheckboxGroup = Checkbox.Group;
const ADD_EMPLOYEE_URL = "manager/add-building";
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const CreateBuilding = ({ visible, close, data }) => {
  const [form] = Form.useForm();

  const [building_name, setBuildingName] = useState("");
  const [building_total_floor, setBuildingFloor] = useState("");
  const [building_total_room, setBuildingRoom] = useState("");
  const [building_address_city, setBuildingCity] = useState("");
  const [building_address_city_id, setBuildingCityId] = useState("");
  const [building_address_district, setBuildingDistrict] = useState([]);
  const [building_address_district_id, setBuildingDistrictId] = useState("");
  const [building_address_wards, setBuildingWard] = useState([]);
  const [building_address_more_detail, setBuildingAddress] = useState("");
  const [disabledDistrict, setDisableDistrict] = useState(true);
  const [disabledWard, setDisableWard] = useState(true);
  const [listServiceName, setListServiceName] = useState([]);
  const [serviceCalMethod, setServiceCalCuMethod] = useState([]);
  const [dien, setDien] = useState(true);
  const [nuoc, setNuoc] = useState(true);
  const [xe, setXe] = useState(true);
  const [mang, setMang] = useState(true);
  const [veSinh, setVesinh] = useState(true);
  const [khac, setKhac] = useState(true);
  let cookie = localStorage.getItem("Cookie");
  const handleCreateBuilding = async (value) => {
    const building = {
      building_name,
      building_total_room,
      building_total_floor,
      building_address_city,
      building_address_district,
      building_address_wards,
      building_address_more_detail,
    };
    const response = await axios
      .post(ADD_EMPLOYEE_URL, building, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => console.log(res))
      .catch((e) => console.log(e.request));
    console.log(JSON.stringify(response?.data));
    // console.log(value);
  };

  useEffect(() => {
    const getListServiceBasic = async () => {
      await axios
        .get(GET_LIST_SERVICE_BASIC, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setListServiceName(res.data.data);
          console.log(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getListServiceBasic();
  }, []);

  useEffect(() => {
    const getListServiceCaculMethod = async () => {
      await axios
        .get(LIST_SERVICE_CACUL_METHOD, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setServiceCalCuMethod(res.data.data);
          console.log(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getListServiceCaculMethod();
  }, []);

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

  const cityChange = (value) => {
    setBuildingDistrict([]);
    setBuildingCityId(value);
    setDisableDistrict(false);
    // optionsDistrict = [];
    setDisableWard(true);
    form.setFieldsValue({ district: "", ward: "" });
  };
  const districtChange = (value) => {
    console.log(value);
    setBuildingDistrictId(value);
    setDisableWard(false);
    form.setFieldsValue({ ward: "" });
  };
  const changeRoom = (value) => {
    setBuildingRoom(value);
  };
  const changeFloor = (value) => {
    setBuildingFloor(value);
  };
  const onFinish = (e) => {
    close(false);
    setDien(true);
    setNuoc(true);
    setMang(true);
    setVesinh(true);
    setKhac(true);
    setXe(true);
  };
  const onFinishFail = (e) => {};
  return (
    <>
      <Modal
        title="Thêm mới chung cư"
        open={visible}
        width={1000}
        destroyOnClose
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
          <Row gutter={24}>
            <Col span={12}>
              <Card title="Thông tin chung" className="card">
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
                  name="building_total_floor"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Số lượng tầng: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số lượng tầng của chung cư!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                    onChange={changeFloor}
                    placeholder="Nhập số lượng tầng của chung cư"
                  />
                </Form.Item>
                <Form.Item
                  name="building_total_room"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Số lượng phòng mỗi tầng: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số lượng phòng mỗi tầng!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                    onChange={changeRoom}
                    placeholder="Nhập số lượng phòng mỗi tầng"
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
                  >
                    <Select.Option value="">Chọn Quận/Huyện</Select.Option>
                    {building_address_district?.map((obj, index) => {
                      return (
                        <>
                          <Select.Option value={obj.code}>{obj.name}</Select.Option>
                        </>
                      );
                    })}
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
                  >
                    <Select.Option value="">Chọn Phường/Xã</Select.Option>
                    {building_address_wards?.map((obj, index) => {
                      return (
                        <>
                          <Select.Option value={obj.code}>{obj.name}</Select.Option>
                        </>
                      );
                    })}
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
                  rules={[
                    {
                      message: "Vui lòng nhập địa chỉ!",
                    },
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ!",
                    },
                  ]}
                >
                  <Input onChange={(e) => setBuildingAddress(e.target.value)} placeholder="Nhập địa chỉ chi tiết" />
                </Form.Item>
                <Form.Item
                  name="building_address_more_detail"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Mô tả: </b>
                    </span>
                  }
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Dịch vụ chung" className="card">
                <Row>
                  <Col span={12}>
                    <Row style={{ marginBottom: "10px" }}>
                      <b>Tên dịch vụ</b>
                    </Row>
                    <Row>
                      <CheckboxGroup>
                        <Row style={{ marginBottom: "23px" }}>
                          <Checkbox value="A" onChange={() => setDien(!dien)}>
                            Dịch vụ điện
                          </Checkbox>
                        </Row>
                        <Row style={{ marginBottom: "23px" }}>
                          <Checkbox value="B" onChange={() => setNuoc(!nuoc)}>
                            Dịch vụ nước
                          </Checkbox>
                        </Row>
                        <Row style={{ marginBottom: "23px" }}>
                          <Checkbox value="C" onChange={() => setMang(!mang)}>
                            Dịch vụ Internet
                          </Checkbox>
                        </Row>
                        <Row style={{ marginBottom: "23px" }}>
                          <Checkbox value="D" onChange={() => setXe(!xe)}>
                            Dịch vụ xe
                          </Checkbox>
                        </Row>
                        <Row style={{ marginBottom: "23px" }}>
                          <Checkbox value="E" onChange={() => setVesinh(!veSinh)}>
                            Vệ sinh
                          </Checkbox>
                        </Row>
                        <Row>
                          <Checkbox value="F" onChange={() => setKhac(!khac)}>
                            Khác
                          </Checkbox>
                        </Row>
                      </CheckboxGroup>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row style={{ marginBottom: "10px" }}>
                      <b>Cách tính giá dịch vụ</b>
                    </Row>
                    <Row>
                      <Select
                        defaultValue={1}
                        style={{
                          width: "100%",
                        }}
                        disabled={dien}
                      >
                        {serviceCalMethod?.map((obj, index) => {
                          return (
                            <>
                              <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>
                            </>
                          );
                        })}
                      </Select>
                      <br />
                      <br />
                    </Row>
                    <Row>
                      <Select
                        defaultValue={1}
                        style={{
                          width: "100%",
                        }}
                        disabled={nuoc}
                      >
                        {serviceCalMethod?.map((obj, index) => {
                          return (
                            <>
                              <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>
                            </>
                          );
                        })}
                      </Select>
                      <br />
                      <br />
                    </Row>
                    <Row>
                      <Select
                        defaultValue={1}
                        style={{
                          width: "100%",
                        }}
                        disabled={mang}
                      >
                        {serviceCalMethod?.map((obj, index) => {
                          return (
                            <>
                              <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>
                            </>
                          );
                        })}
                      </Select>
                      <br />
                      <br />
                    </Row>
                    <Row>
                      <Select
                        defaultValue={1}
                        style={{
                          width: "100%",
                        }}
                        disabled={xe}
                      >
                        {serviceCalMethod?.map((obj, index) => {
                          return (
                            <>
                              <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>
                            </>
                          );
                        })}
                      </Select>
                      <br />
                      <br />
                    </Row>
                    <Row>
                      <Select
                        defaultValue={1}
                        style={{
                          width: "100%",
                        }}
                        disabled={veSinh}
                      >
                        {serviceCalMethod?.map((obj, index) => {
                          return (
                            <>
                              <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>
                            </>
                          );
                        })}
                      </Select>
                      <br />
                      <br />
                    </Row>
                    <Row>
                      <Select
                        defaultValue={1}
                        style={{
                          width: "100%",
                        }}
                        disabled={khac}
                      >
                        {serviceCalMethod?.map((obj, index) => {
                          return (
                            <>
                              <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>
                            </>
                          );
                        })}
                      </Select>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CreateBuilding;
