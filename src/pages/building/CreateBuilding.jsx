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
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [note, setNote] = useState("");
  const [building_address_city_id, setBuildingCityId] = useState("");
  const [building_address_district, setBuildingDistrict] = useState([]);
  const [building_address_district_id, setBuildingDistrictId] = useState("");
  const [building_address_wards, setBuildingWard] = useState([]);
  const [building_address_more_detail, setBuildingAddress] = useState("");
  const [disabledDistrict, setDisableDistrict] = useState(true);
  const [disabledWard, setDisableWard] = useState(true);
  const [listServiceName, setListServiceName] = useState([]);
  const [serviceCalMethod, setServiceCalCuMethod] = useState([]);
  const [service, setService] = useState(["Dịch vụ điện ", "Dịch vụ nước"]);
  const [electric, setElectric] = useState("Đồng hồ điện/nước");
  const [water, setWater] = useState("Đồng hồ điện/nước");
  const [park, setPark] = useState();
  const [internet, setInternet] = useState();
  const [clean, setClean] = useState();
  let optionRoom = [];
  let optionFloor = [];
  for (let i = 1; i <= 10; i++) {
    optionRoom.push({
      value: i,
      label: i + " Phòng",
    });
  }
  for (let i = 1; i <= 10; i++) {
    optionFloor.push({
      value: i,
      label: i + " Tầng",
    });
  }
  let serviceAdd = [];
  let cookie = localStorage.getItem("Cookie");
  const handleCreateBuilding = async (value) => {
    if (service?.includes("Dịch vụ điện ")) {
      serviceAdd.push({
        service: "Dịch vụ điện",
        method: electric,
      });
    }
    if (service?.includes("Dịch vụ nước")) {
      serviceAdd.push({
        service: "Dịch vụ nước",
        method: water,
      });
    }
    if (service?.includes("Dịch vụ xe")) {
      serviceAdd.push({
        service: "Dịch vụ xe ",
        method: park,
      });
    }
    if (service?.includes("Dịch vụ Internet")) {
      serviceAdd.push({
        service: "Dịch vụ Internet",
        method: internet,
      });
    }
    if (service?.includes("Vệ sinh")) {
      serviceAdd.push({
        service: "Vệ sinh",
        method: clean,
      });
    }
    const building = {
      building_name,
      building_total_room,
      building_total_floor,
      city,
      district,
      ward,
      building_address_more_detail,
      note,
      serviceAdd,
    };
    // const response = await axios
    //   .post(ADD_EMPLOYEE_URL, building, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       // "Access-Control-Allow-Origin": "*",
    //       Authorization: `Bearer ${cookie}`,
    //     },
    //     // withCredentials: true,
    //   })
    //   .then((res) => console.log(res))
    //   .catch((e) => console.log(e.request));
    // console.log(JSON.stringify(response?.data));
    console.log(building);
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
    setDistrict(option.children);
  };
  const wardChange = (value, option) => {
    setWard(option.children);
  };
  const changeRoom = (value) => {
    setBuildingRoom(value);
  };
  const changeFloor = (value) => {
    setBuildingFloor(value);
  };
  const serviceChange = (checkedValues) => {
    setService(checkedValues);
  };

  const electricChange = (value) => {
    setElectric(value);
  };
  const waterChange = (value) => {
    setWater(value);
  };
  const parkChange = (value) => {
    setPark(value);
  };
  const internetChange = (value) => {
    setInternet(value);
  };
  const cleanChange = (value) => {
    setClean(value);
  };

  const onFinish = (e) => {
    close(false);
  };

  const onFinishFail = (e) => {};
  return (
    <>
      <Modal
        title={<h2>Thêm mới chung cư</h2>}
        open={visible}
        width={1000}
        afterClose={() => form.resetFields()}
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
          <Button htmlType="submit" key="submit" form="createBuilding" type="primary">
            Thêm mới
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleCreateBuilding}
          onFinishFailed={onFinishFail}
          layout="horizontal"
          size={"default"}
          id="createBuilding"
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
                      message: "Vui lòng chọn số lượng tầng!",
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: "100%",
                    }}
                    onChange={changeFloor}
                    placeholder="Nhập số lượng tầng của chung cư"
                    options={optionFloor}
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
                      message: "Vui lòng chọn số lượng phòng!",
                    },
                  ]}
                >
                  <Select
                    style={{
                      width: "100%",
                    }}
                    onChange={changeRoom}
                    placeholder="Nhập số lượng phòng mỗi tầng"
                    options={optionRoom}
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
                    onChange={wardChange}
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
            <Col span={12}>
              <Card title="Dịch vụ chung" className="card">
                <Row>
                  <Col span={12}>
                    <Row style={{ marginBottom: "10px" }}>
                      <b>Tên dịch vụ</b>
                    </Row>
                    <Row>
                      <CheckboxGroup onChange={serviceChange} defaultValue={["Dịch vụ điện ", "Dịch vụ nước"]}>
                        {listServiceName
                          ?.filter(function (img) {
                            if (img.service_show_name === "Khác") {
                              return false; // skip
                            }
                            return true;
                          })
                          .map((obj, idx) => {
                            return (
                              <>
                                <Row style={{ marginBottom: "23px" }}>
                                  <Checkbox value={obj.service_show_name}>{obj.service_show_name}</Checkbox>
                                </Row>
                              </>
                            );
                          })}
                      </CheckboxGroup>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row style={{ marginBottom: "10px" }}>
                      <b>Cách tính giá dịch vụ</b>
                    </Row>
                    <Row>
                      <Select
                        defaultValue={"Đồng hồ điện/nước"}
                        style={{
                          width: "100%",
                        }}
                        onChange={electricChange}
                      >
                        <Select.Option value="">Chọn cách tính giá dịch vụ</Select.Option>
                        {serviceCalMethod?.map((obj, index) => {
                          return (
                            <>
                              <Select.Option value={obj.service_type_name}>{obj.service_type_name}</Select.Option>
                            </>
                          );
                        })}
                      </Select>
                      <br />
                      <br />
                    </Row>
                    <Row>
                      <Select
                        defaultValue={"Đồng hồ điện/nước"}
                        style={{
                          width: "100%",
                        }}
                        onChange={waterChange}
                      >
                        <Select.Option value="">Chọn cách tính giá dịch vụ</Select.Option>
                        {serviceCalMethod?.map((obj, index) => {
                          return (
                            <>
                              <Select.Option value={obj.service_type_name}>{obj.service_type_name}</Select.Option>
                            </>
                          );
                        })}
                      </Select>
                      <br />
                      <br />
                    </Row>
                    <Row>
                      <Select
                        defaultValue={""}
                        style={{
                          width: "100%",
                        }}
                        onChange={parkChange}
                      >
                        <Select.Option value="">Chọn cách tính giá dịch vụ</Select.Option>
                        {serviceCalMethod?.map((obj, index) => {
                          return (
                            <>
                              <Select.Option value={obj.service_type_name}>{obj.service_type_name}</Select.Option>
                            </>
                          );
                        })}
                      </Select>
                      <br />
                      <br />
                    </Row>
                    <Row>
                      <Select
                        defaultValue={""}
                        style={{
                          width: "100%",
                        }}
                        onChange={internetChange}
                      >
                        <Select.Option value="">Chọn cách tính giá dịch vụ</Select.Option>
                        {serviceCalMethod?.map((obj, index) => {
                          return (
                            <>
                              <Select.Option value={obj.service_type_name}>{obj.service_type_name}</Select.Option>
                            </>
                          );
                        })}
                      </Select>
                      <br />
                      <br />
                    </Row>
                    <Row>
                      <Select
                        defaultValue={""}
                        style={{
                          width: "100%",
                        }}
                        onChange={cleanChange}
                      >
                        <Select.Option value="">Chọn cách tính giá dịch vụ</Select.Option>
                        {serviceCalMethod?.map((obj, index) => {
                          return (
                            <>
                              <Select.Option value={obj.service_type_name}>{obj.service_type_name}</Select.Option>
                            </>
                          );
                        })}
                      </Select>
                      <br />
                      <br />
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
