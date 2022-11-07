import React, { useEffect, useState } from "react";
import { Input, Table, Select, DatePicker, Tag, Row, Col, Button, Tabs, Form, Modal, Switch, Tooltip } from "antd";
import axios from "../../api/axios";
import { NavLink } from "react-router-dom";
import "./listStaff.scss";
import { EditOutlined, EyeOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
const { Search } = Input;
const { RangePicker } = DatePicker;
const ListStaff = () => {
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState();
  const [deactive, setDeactive] = useState(false);
  const [roles, setRoles] = useState("");
  const [rolesFilter, setRolesFilter] = useState("");
  const [roleInfo, setRoleInfo] = useState("");
  const [full_name, setFullname] = useState("");
  const [user_name, setUsername] = useState("");
  const [phone_number, setPhonenumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [user, setUser] = useState([]);
  const [id, setId] = useState();
  const LIST_EMPLOYEE_URL = "manager/staff";
  const LIST_ROLES_URL = "manager/staff/roles";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (id) => {
    setIsModalOpen(true);
    setId(id);
    console.log(id);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
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
  const [form] = Form.useForm();
  const options = [];
  let cookie = localStorage.getItem("Cookie");
  let role = localStorage.getItem("Role");
  useEffect(() => {
    const getAllEmployees = async () => {
      setLoading(true);
      const response = await axios
        .get(LIST_EMPLOYEE_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setDataSource(res.data.data);
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };
    getAllEmployees();
  }, [cookie]);
  useEffect(() => {
    const getRoleFilter = async () => {
      setLoading(true);
      const response = await axios
        .get(LIST_ROLES_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setRolesFilter(res.data.data);
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };
    getRoleFilter();
  }, [cookie]);

  for (let i = 0; i < rolesFilter.length; i++) {
    if (rolesFilter[i] === "STAFF") {
      options.push({
        label: "Nhân viên",
        value: rolesFilter[i].toLowerCase(),
      });
    } else {
      options.push({
        label: rolesFilter[i],
        value: rolesFilter[i].toLowerCase(),
      });
    }
  }

  useEffect(() => {
    axios
      .get(`manager/staff/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setUser(res.data.data);
        setRoleInfo(res.data.data.role_name);
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [id]);

  const getFilterEmployees = async (value) => {
    const data = {
      full_name: full_name,
      user_name: user_name,
      roles: roles,
      deactive: deactive,
      startDate: startDate,
      endDate: endDate,
      phoneNumber: phone_number,
    };

    setLoading(true);
    const response = await axios
      .get(LIST_EMPLOYEE_URL, {
        params: {
          name: full_name,
          userName: user_name,
          role: roles,
          deactivate: deactive,
          startDate: startDate,
          endDate: endDate,
          phoneNumber: phone_number,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataSource(res.data.data);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
    console.log(data);
  };
  const deactiveChange = (value) => {
    setDeactive(value);
  };
  const roleChange = (value) => {
    setRoles(value);
  };
  const nameChange = (e) => {
    setFullname(e.target.value);
  };
  const usernameChange = (e) => {
    setUsername(e.target.value);
  };
  const phonenumberChange = (e) => {
    setPhonenumber(e.target.value);
  };
  const getFullDate = (date) => {
    const dateAndTime = date.split(" ");

    return dateAndTime[0].split("-").reverse().join("-");
  };
  const dateChange = (value, dateString) => {
    let [day1, month1, year1] = dateString[0].split("-");
    let startDate = `${year1}-${month1}-${day1}`;
    let [day2, month2, year2] = dateString[1].split("-");
    let endDate = `${year2}-${month2}-${day2}`;
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const resetForm = async () => {
    form.resetFields();
    setDeactive("");
    setEndDate("");
    setStartDate("");
    setFullname("");
    setRoles("");
    setUsername("");
    setLoading(true);
    const response = await axios
      .get(LIST_EMPLOYEE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataSource(res.data.data);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };
  return (
    <div className="list-staff">
      <div className="list-staff-search">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
            <Search
              placeholder="Tìm kiếm theo tên nhân viên, tên đăng nhập, số điện thoại"
              style={{ marginBottom: 8, width: 400, padding: "10px 0" }}
              onSearch={(value) => {
                setTextSearch(value);
              }}
              onChange={(e) => {
                setTextSearch(e.target.value);
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tìm kiếm nâng cao" key="2">
            <Form
              {...formItemLayout}
              form={form}
              name="filterStaff"
              id="filterStaff"
              onFinish={getFilterEmployees}
              style={{ width: "100%" }}
            >
              <Row gutter={[16]} style={{ marginBottom: "20px" }}>
                <Row span={8}>
                  <Form.Item name="full_name" style={{ width: "500px", marginBottom: 0 }}>
                    <Col className="gutter-row" span={24} style={{ marginBottom: "15px" }}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Tìm kiếm theo tên nhân viên
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập tên nhân viên" onChange={nameChange} autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="user_name" style={{ width: "500px" }}>
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Tìm kiếm theo tên đăng nhập
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập tên đăng nhập" onChange={usernameChange} autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="phone_number" style={{ width: "500px" }}>
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Tìm kiếm theo số điện thoại
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập số điện thoại" onChange={phonenumberChange} autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item name="date" style={{ width: "500px" }}>
                    <Col className="gutter-row" span={24} style={{ marginBottom: "15px" }}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Ngày bắt đầu làm việc
                        </label>
                      </Row>
                      <Row>
                        <RangePicker format={"DD-MM-YYYY"} placeholder={["Từ", "Đến"]} onChange={dateChange} />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="role" style={{ width: "250px" }}>
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Tìm kiếm theo chức vụ
                        </label>
                      </Row>
                      <Row style={{ flexWrap: "nowrap", width: "700px" }}>
                        <Select
                          onChange={roleChange}
                          style={{
                            width: 150,
                            marginRight: 50,
                          }}
                          options={options}
                          placeholder="Chọn chức vụ"
                        />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="deactive" style={{ width: "500px", marginTop: "30px" }}>
                    <Col className="gutter-row" span={24}>
                      <Switch onChange={deactiveChange} /> <span>Nhân viên đã nghỉ việc</span>
                    </Col>
                  </Form.Item>
                </Row>
              </Row>
              <Row style={{ marginBottom: "20px" }}>
                <Col offset={10}>
                  <Row>
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      style={{ marginRight: "20px" }}
                      onClick={getFilterEmployees}
                      htmlType="submit"
                    >
                      Tìm kiếm
                    </Button>
                    <Button icon={<UndoOutlined />} onClick={resetForm}>
                      Đặt lại
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </div>
      <Table
        bordered
        dataSource={dataSource}
        columns={[
          {
            title: "Tên nhân viên",
            dataIndex: "full_name",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              return (
                String(record.full_name).toLowerCase()?.includes(value.toLowerCase()) ||
                String(record.user_name).toLowerCase()?.includes(value.toLowerCase()) ||
                String(record.phone_number).toLowerCase()?.includes(value.toLowerCase())
              );
            },
          },
          {
            title: "Tên đăng nhập",
            dataIndex: "user_name",
          },
          {
            title: "Số điện thoại",
            dataIndex: "phone_number",
          },
          {
            title: "Ngày bắt đầu làm việc",
            dataIndex: "created_at",
            render: (date) => getFullDate(date),
          },
          {
            title: "Giới tính",
            dataIndex: "gender",
            render: (_, record) => {
              let gender;
              if (record.gender === true) {
                gender = <p>Nam</p>;
              } else {
                gender = <p>Nữ</p>;
              }
              return <>{gender}</>;
            },
          },
          {
            title: "Vai trò",
            dataIndex: "role",
            render: (_, record) => {
              let role;
              if (record.role_name === "ROLE_ADMIN") {
                role = <p>ADMIN</p>;
              } else {
                role = <p>Nhân Viên</p>;
              }
              return <>{role}</>;
            },
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
            render: (_, record) => {
              let status;
              if (record.is_deactivate === true) {
                status = (
                  <Tag color="default" key={record.status}>
                    Đã nghỉ việc
                  </Tag>
                );
              } else if (record.is_deactivate === false) {
                status = (
                  <Tag color="green" key={record.status}>
                    Đang làm việc
                  </Tag>
                );
              }

              return <>{status}</>;
            },
          },

          {
            title: "Thao tác",
            dataIndex: "action",
            render: (_, record) => {
              return (
                <>
                  <Tooltip title="Chỉnh sửa">
                    <NavLink to={`/update-staff/${record.account_id}`}>
                      <EditOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                    </NavLink>
                  </Tooltip>
                  <Tooltip title="Xem">
                    <EyeOutlined
                      style={{ fontSize: "20px", color: "#46a6ff" }}
                      onClick={() => {
                        showModal(record.account_id);
                      }}
                    />
                  </Tooltip>
                </>
              );
            },
          },
        ]}
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
      <Modal
        title="Thông tin cá nhân"
        className="modalStyle"
        open={isModalOpen}
        footer={(null, null)}
        onCancel={handleCancel}
        width="700px"
      >
        <div
          className="basic-info"
          style={{
            marginLeft: "3%",
          }}
        >
          <Row>
            <Col span={12}>
              <img
                src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                style={{ width: "150px" }}
                alt=""
              />
            </Col>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <p style={{ fontSize: "14px", textTransform: "uppercase", color: "rgb(113 102 102)" }}>Họ và tên: </p>
                </Col>
                <Col span={12}>
                  <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>{user.full_name}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p style={{ fontSize: "14px", textTransform: "uppercase", color: "rgb(113 102 102)" }}>
                    Tên đăng nhập:
                  </p>
                </Col>

                <Col span={12}>
                  <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>{user.user_name}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p style={{ fontSize: "14px", textTransform: "uppercase", color: "rgb(113 102 102)" }}>Giới tính: </p>
                </Col>

                <Col span={12}>
                  {user.gender ? (
                    <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>Nam</p>
                  ) : (
                    <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>Nữ</p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p style={{ fontSize: "14px", textTransform: "uppercase", color: "rgb(113 102 102)" }}>Chức vụ: </p>
                </Col>
                <Col span={12}>
                  {roleInfo === "ROLE_ADMIN" ? (
                    <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>ADMIN</p>
                  ) : (
                    <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>Nhân viên</p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p style={{ fontSize: "14px", textTransform: "uppercase", color: "rgb(113 102 102)" }}>
                    Số điện thoại:
                  </p>
                </Col>

                <Col span={12}>
                  <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>{user.phone_number}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p style={{ fontSize: "14px", textTransform: "uppercase", color: "rgb(113 102 102)" }}>
                    Địa chỉ chi tiết:
                  </p>
                </Col>

                <Col span={12}>
                  <p style={{ fontSize: "14px", padding: "0 0 0 5px" }}>{user.address_more_detail}</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div style={{ marginLeft: "3%" }}>
          <Button onClick={handleCancel}>Quay lại</Button>
          <NavLink to={`/update-staff/${id}`}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ margin: "20px 20px" }}
              size="middle"
              className="button-add"
            >
              Sửa thông tin
            </Button>
          </NavLink>
        </div>
      </Modal>
    </div>
  );
};

export default ListStaff;
