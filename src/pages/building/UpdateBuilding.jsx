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
    if (visible) {
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
            building_address_more_detail: res.data.data?.address.address_more_details,
            city: res.data.data?.address.address_city,
            district: res.data.data?.address.address_district,
            ward: res.data.data?.address.address_wards,
            note: res.data.data?.description,
          });
          setBuildingName(res.data.data?.group_name);
          setBuildingAddress(res.data.data?.address.address_more_details);
          setCity(res.data.data?.address.address_city);
          setDistrict(res.data.data?.address.address_district);
          setWard(res.data.data?.address.address_wards);
          setNote(res.data.data?.description);
        });
    }
  }, [id, visible]);
  const data = {
    group_name: group_name,
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
          message: "C???p nh???t th??ng tin chung c?? th??nh c??ng",
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
          message: "C???p nh???t th??ng tin chung c?? th???t b???i",
          description: "Vui l??ng ki???m tra l???i th??ng tin v?? th??? l???i.",
          duration: 3,
          placement: "top",
        })
      );
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
    setDisableWard(true);
    form.setFieldsValue({ district: "", ward: "" });
    setCity(option.label);
  };
  const districtChange = (value, option) => {
    setBuildingDistrictId(value);
    setDisableWard(false);
    form.setFieldsValue({ ward: "" });
    setDistrict(option.label);
  };
  const wardChange = (value, option) => {
    setWard(option.label);
  };
  const reload = () => window.location.reload();
  return (
    <>
      <Modal
        title={<h2>Ch???nh s???a chung c??</h2>}
        open={visible}
        width={700}
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
            ????ng
          </Button>,
          <Button htmlType="submit" key="submit" form="updateBuilding" type="primary">
            Ch???nh s???a
          </Button>,
        ]}
      >
        <Form form={form} onFinish={Update} layout="horizontal" size={"default"} id="updateBuilding" autoComplete="off">
          <Row gutter={24}>
            <Col span={24}>
              <Card className="card">
                <Form.Item
                  name="building_name"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>T??n chung c??: </b>
                    </span>
                  }
                  rules={[
                    {
                      message: "Vui l??ng nh???p t??n chung c??!",
                    },
                    {
                      required: true,
                      message: "Vui l??ng nh???p t??n chung c??!",
                    },
                  ]}
                >
                  <Input onChange={(e) => setBuildingName(e.target.value)} placeholder="Nh???p t??n chung c??" />
                </Form.Item>
                <Form.Item
                  name="city"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Ch???n th??nh ph???: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng ch???n th??nh ph???!",
                    },
                  ]}
                >
                  <Select
                    defaultValue="Ch???n th??nh ph???"
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
                      <b>Ch???n Qu???n/Huy???n: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng ch???n qu???n/huy???n!",
                    },
                  ]}
                >
                  <Select
                    defaultValue="Ch???n Qu???n/Huy???n"
                    style={{
                      width: "100%",
                    }}
                    disabled={disabledDistrict}
                    onChange={districtChange}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase().trim() ?? "").includes(input?.toLowerCase().trim())
                    }
                    options={
                      building_address_district === undefined
                        ? []
                        : [
                            ...building_address_district?.map((obj) => {
                              return { label: obj.name, value: obj.code };
                            }),
                            {
                              label: "Ch???n Qu???n/Huy???n",
                              value: "",
                            },
                          ]
                    }
                  ></Select>
                </Form.Item>
                <Form.Item
                  name="ward"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Ch???n Ph?????ng/X??: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng ch???n ph?????ng/x??!",
                    },
                  ]}
                >
                  <Select
                    defaultValue="Ch???n Ph?????ng/X??"
                    style={{
                      width: "100%",
                    }}
                    disabled={disabledWard}
                    onChange={wardChange}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase().trim() ?? "").includes(input?.toLowerCase().trim())
                    }
                    options={
                      building_address_wards === undefined
                        ? []
                        : [
                            ...building_address_wards?.map((obj) => {
                              return { label: obj.name, value: obj.code };
                            }),
                            {
                              label: "Ch???n Ph?????ng/X??",
                              value: "",
                            },
                          ]
                    }
                  ></Select>
                </Form.Item>

                <Form.Item
                  name="building_address_more_detail"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>?????a ch??? chi ti???t: </b>
                    </span>
                  }
                >
                  <Input onChange={(e) => setBuildingAddress(e.target.value)} placeholder="Nh???p ?????a ch??? chi ti???t" />
                </Form.Item>
                <Form.Item
                  name="note"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>M?? t???: </b>
                    </span>
                  }
                >
                  <TextArea rows={4} onChange={(e) => setNote(e.target.value)} placeholder="Nh???p ghi ch??" />
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
