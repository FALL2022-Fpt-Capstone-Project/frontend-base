import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Form, Input, notification, Radio, Row, Select, Spin, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
const { Meta } = Card;

const memeber = {
  border: "1px solid #C0C0C0",
  borderRadius: "10px",
  height: "100%",
  width: "50%",
};

function Personal(props) {
  const [full_name, setName] = useState("");
  const [user_name, setUserName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address_more_detail, setAddress_more_detail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [deactivate, setDeactivate] = useState();
  const [roles, setRoles] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");
  let id = localStorage.getItem("id");

  useEffect(() => {
    getUserName();
  }, []);

  const getUserName = async () => {
    setLoading(true);
    await axios
      .get("manager/staff/" + localStorage.getItem("id"), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        let role = res.data.data?.role_name;
        let roleSlice = role.slice(5);
        let roleFinal = roleSlice.toLowerCase();
        form.setFieldsValue({
          full_name: res.data.data?.full_name,
          user_name: res.data.data?.user_name,
          phone_number: res.data.data?.phone_number,
          address_more_detail: res.data.data?.address_more_detail,
          gender: res.data.data?.gender,
          roles: roleFinal,
          status: res.data.data?.is_deactivate,
        });
        setName(res.data.data?.full_name);
        setUserName(res.data.data?.user_name);
        setPhoneNumber(res.data.data?.phone_number);
        setAddress_more_detail(res.data.data?.address_more_detail);
        setGender(res.data.data?.gender);
        setRoles(roleFinal);
        setDeactivate(res.data.data?.is_deactivate);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const data = {
    full_name: full_name.trim(),
    user_name: user_name.trim(),
    phone_number: phone_number.trim(),
    gender: gender,
    address_more_detail: address_more_detail,
    deactivate: deactivate,
    roles: roles,
    permission: localStorage
      .getItem("permission")
      ?.split(",")
      ?.map((obj) => Number.parseInt(obj)),
  };

  const genderChange = (e) => {
    setGender(e.target.value);
  };

  function Update(e) {
    axios
      .put(`manager/staff/update/${id}`, password === "" ? data : { ...data, password: password }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "C???p nh???t th??ng tin c?? nh??n th??nh c??ng",
          duration: 3,
          placement: "top",
        });
        window.localStorage.setItem("name", data.full_name);
        form.resetFields();
        getUserName();
      })
      .catch((e) =>
        notification.error({
          message: "C???p nh???t th??ng tin th???t b???i",
          description: "Vui l??ng ki???m tra l???i th??ng tin v?? th??? l???i.",
          duration: 3,
          placement: "top",
        })
      );
  }

  const onFinishFail = (e) => {
    notification.error({
      message: "C???p nh???t th??ng tin th???t b???i",
      description: "Vui l??ng ki???m tra l???i th??ng tin v?? th??? l???i.",
      duration: 3,
      placement: "top",
    });
  };

  return (
    <Spin spinning={loading} size="large">
      <div>
        <MainLayout title="Th??ng tin c?? nh??n">
          <Row justify="center">
            <Card bordered style={memeber}>
              <Row justify="center">
                <Avatar size={90} icon={<UserOutlined />} />
              </Row>
              <Form
                form={form}
                onFinish={Update}
                onFinishFailed={onFinishFail}
                layout="horizontal"
                size={"default"}
                name="UpdateStaff"
                id="UpdateStaff"
                autoComplete="off"
              >
                <Form.Item
                  className="form-item"
                  name="full_name"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>H??? v?? t??n:</b>
                    </span>
                  }
                  rules={[
                    {
                      message: "Vui l??ng nh???p h??? v?? t??n!",
                    },
                    {
                      required: true,
                      message: "Vui l??ng nh???p h??? v?? t??n!",
                    },
                  ]}
                >
                  <Input onChange={(e) => setName(e.target.value)} value={full_name} placeholder="Nh???p h??? v?? t??n" />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="user_name"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>T??n ????ng nh???p:</b>
                    </span>
                  }
                  rules={[
                    {
                      message: "Vui l??ng nh???p t??n ????ng nh???p!",
                    },
                    {
                      required: true,
                      message: "Vui l??ng nh???p t??n ????ng nh???p!",
                    },
                  ]}
                >
                  <Input
                    disabled
                    onChange={(e) => setUserName(e.target.value)}
                    value={user_name}
                    placeholder="Nh???p t??n ????ng nh???p"
                  />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="password"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>M???t kh???u m???i:</b>
                    </span>
                  }
                  hasFeedback
                >
                  <Input.Password onChange={(e) => setPassword(e.target.value)} placeholder="Nh???p m???t kh???u" />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="phone_number"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>S??? ??i???n tho???i: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng nh???p s??? ??i???n tho???i!",
                    },
                    {
                      pattern: /^((\+84|84|0)+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                      message: "S??? ??i???n tho???i ph???i b???t ?????u (+84,0,84)",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="S??? ??i???n tho???i"
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  className="form-item"
                  name="gender"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Gi???i t??nh:</b>
                    </span>
                  }
                >
                  <Radio.Group onChange={genderChange} defaultValue={gender}>
                    <Radio value={true}>Nam</Radio>
                    <Radio value={false}>N???</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="address_more_detail"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>?????a ch???: </b>
                    </span>
                  }
                >
                  <Input onChange={(e) => setAddress_more_detail(e.target.value)} placeholder="?????a ch???" />
                </Form.Item>
              </Form>
              <Row type="flex" style={{ alignItems: "center" }} justify="center" gutter={10}>
                <Button htmlType="submit" key="submit" form="UpdateStaff" type="primary" style={{ marginRight: "1%" }}>
                  C???p nh???t th??ng tin c?? nh??n
                </Button>
              </Row>
            </Card>
          </Row>
        </MainLayout>
      </div>
    </Spin>
  );
}

export default Personal;
