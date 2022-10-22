import React, { useEffect, useState } from "react";
import { Input, Table, Select, Checkbox, DatePicker, Tag, Row, Col, Button } from "antd";
import axios from "../../api/axios";
import { NavLink } from "react-router-dom";
import "./listStaff.scss";
import { EditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
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
  const children = [
    <Option value={1}>Quản lý cơ sở vật chất</Option>,
    <Option value={2}>Quản lý nguồn tiền</Option>,
    <Option value={3}>Quản lý hoá đơn</Option>,
    <Option value={4}>Quản lý hợp đồng</Option>,
    <Option value={5}>Quản lý nhân viên</Option>,
  ];

  useEffect(() => {
    getAllEmployees();
  }, []);
  const getAllEmployees = async () => {
    let cookie = localStorage.getItem("Cookie");
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
    let cookie = localStorage.getItem("Cookie");
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

    console.log("checked = ", value);
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
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col className="gutter-row" span={8}>
            <Row>
              <label htmlFor="" style={{ marginBottom: "10px" }}>
                Ngày bắt đầu làm việc
              </label>
            </Row>
            <Row>
              <RangePicker format={"DD-MM-YYYY"} placeholder={["Từ", "Đến"]} onChange={dateChange} />
            </Row>
          </Col>
          <Col className="gutter-row" span={8}>
            <Row>
              <label htmlFor="" style={{ marginBottom: "10px" }}>
                Tìm kiếm theo chức vụ
              </label>
            </Row>
            <Row>
              <Checkbox.Group options={options} value={[option]} onChange={filterRole} />
            </Row>
          </Col>
          <Col className="gutter-row" span={8}>
            <Row>
              <label htmlFor="" style={{ marginBottom: "10px" }}>
                Tìm kiếm theo quyền nhân viên
              </label>
            </Row>
            <Row>
              <Select
                mode="multiple"
                placeholder="Tìm kiếm theo quyền"
                style={{
                  width: "100%",
                }}
                defaultValue={[1, 3]}
              >
                {children}
              </Select>
            </Row>
          </Col>
        </Row>
        <Row style={{ marginBottom: "20px" }}>
          <Col offset={10}>
            <Button type="primary" icon={<SearchOutlined />} onClick={getFilterEmployees}>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
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
              if (record.role[0] === "ROLE_ADMIN" || record.role[0] === "admin") {
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
              if (record.deactivate === false && record.permission === null) {
                status = (
                  <Tag color="green" key={record.status}>
                    Chưa cấp quyền
                  </Tag>
                );
              } else if (record.deactivate === true) {
                status = (
                  <Tag color="default" key={record.status}>
                    Đã khoá
                  </Tag>
                );
              } else if (record.deactivate === false) {
                status = (
                  <Tag color="red" key={record.status}>
                    Đã cấp quyền
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
