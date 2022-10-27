import React, { useEffect, useState } from "react";
import { Input, Table, Select, Checkbox, DatePicker, Tag, Row, Col, Button, Tabs } from "antd";
import axios from "../../api/axios";
import { NavLink } from "react-router-dom";
import "./listStaff.scss";
import { EditOutlined, EyeOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import useAuth from "../../hooks/useAuth";
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const ListStaff = () => {
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState();
  const [option, setOption] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const LIST_EMPLOYEE_URL = "manager/account/list-all-staff-account";
  const FILTER_EMPOYEE_URL = "manager/account/list-staff-account";
  const { auth } = useAuth();
  const options = [
    {
      label: "Admin",
      value: "admin",
    },
    {
      label: "Nhân viên",
      value: "staff",
    },
  ];
  let cookie = localStorage.getItem("Cookie");
  useEffect(() => {
    getAllEmployees();
  }, []);
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
        setDataSource(res.data.body);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const getFilterEmployees = async () => {
    setLoading(true);
    const response = await axios
      .get(FILTER_EMPOYEE_URL, {
        params: { role: option, startDate: startDate, endDate: endDate },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataSource(res.data.body);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const getFullDate = (date) => {
    const dateAndTime = date.split("T");

    return dateAndTime[0].split("-").reverse().join("-");
  };
  const filterRole = (values) => {
    const valuesNew = values.filter((v) => v !== option);
    const value = valuesNew.length ? valuesNew[0] : "";
    setOption(value);
  };
  const dateChange = (value, dateString) => {
    let [day1, month1, year1] = dateString[0].split("-");
    let startDate = `${year1}-${month1}-${day1}`;
    let [day2, month2, year2] = dateString[1].split("-");
    let endDate = `${year2}-${month2}-${day2}`;
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <div className="list-staff">
      <div className="list-staff-search">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tìm kiếm nâng cao" key="1">
            <Row gutter={[16, 32]} style={{ marginBottom: "20px" }}>
              <Col span={8}>
                <Col className="gutter-row" span={16} style={{ marginBottom: "30px" }}>
                  <Row>
                    <label htmlFor="" style={{ marginBottom: "10px" }}>
                      Tìm kiếm theo tên nhân viên
                    </label>
                  </Row>
                  <Row>
                    <Input placeholder="Nhập tên nhân viên" />
                  </Row>
                </Col>
                <Col className="gutter-row" span={16}>
                  <Row>
                    <label htmlFor="" style={{ marginBottom: "10px" }}>
                      Tìm kiếm theo tên đăng nhập
                    </label>
                  </Row>
                  <Row>
                    <Input placeholder="Nhập tên đăng nhập" />
                  </Row>
                </Col>
              </Col>
              <Col span={8}>
                <Col className="gutter-row" span={24} style={{ marginBottom: "30px" }}>
                  <Row>
                    <label htmlFor="" style={{ marginBottom: "10px" }}>
                      Ngày bắt đầu làm việc
                    </label>
                  </Row>
                  <Row>
                    <RangePicker format={"DD-MM-YYYY"} placeholder={["Từ", "Đến"]} onChange={dateChange} />
                  </Row>
                </Col>
                <Col className="gutter-row" span={24}>
                  <Row>
                    <label htmlFor="" style={{ marginBottom: "10px" }}>
                      Tìm kiếm theo chức vụ
                    </label>
                  </Row>
                  <Row>
                    <Checkbox.Group options={options} style={{ marginRight: "150px" }} />
                    <Checkbox>Nhân viên đã nghỉ việc</Checkbox>
                  </Row>
                </Col>
              </Col>
            </Row>
            <Row style={{ marginBottom: "20px" }}>
              <Col offset={10}>
                <Row>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    style={{ marginRight: "20px" }}
                    onClick={getFilterEmployees}
                  >
                    Tìm kiếm
                  </Button>
                  <Button icon={<UndoOutlined />} onClick={getFilterEmployees}>
                    Đặt lại
                  </Button>
                </Row>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tìm kiếm nhanh" key="2">
            <Search
              placeholder="Tìm kiếm theo tên, số điện thoại"
              style={{ marginBottom: 8, width: 400, padding: "10px 0" }}
              onSearch={(value) => {
                setTextSearch(value);
              }}
              onChange={(e) => {
                setTextSearch(e.target.value);
              }}
            />
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
            dataIndex: "created_date",
            render: (date) => getFullDate(date),
          },
          {
            title: "Giới tính",
            dataIndex: "gender",
            render: (_, record) => {
              let gender;
              if (record.gender === "Nam") {
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
              if (record.role[0] === "ROLE_ADMIN" || record.role[0] === "admin" || record.role[0] === "Admin") {
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
              if (record.deactivate === true) {
                status = (
                  <Tag color="default" key={record.status}>
                    Đã nghỉ việc
                  </Tag>
                );
              } else if (record.deactivate === false) {
                status = (
                  <Tag color="red" key={record.status}>
                    Đang
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
                  <NavLink to={`/update-staff/${record.id}`}>
                    <EditOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                  </NavLink>
                  <NavLink to={`/detail-staff/${record.id}`}>
                    <EyeOutlined style={{ fontSize: "20px" }} />
                  </NavLink>
                </>
              );
            },
          },
        ]}
        pagination={{ pageSize: 5 }}
        loading={loading}
      />
    </div>
  );
};

export default ListStaff;
