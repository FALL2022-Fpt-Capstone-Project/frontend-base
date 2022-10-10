import React, { useEffect, useState } from "react";
import { Input, Modal, Table, Select } from "antd";
import axios from "../../api/axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Option } = Select;
const ListStaff = () => {
  // const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const LIST_EMPLOYEE_URL = "manager/user/list-assistant-account";
  const UPDATE_EMPLOYEE_URL = "manager/user/update-role-account";

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
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
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

  const onEditStudent = (record) => {
    setIsEditing(true);
    setEditingStaff({ ...record });
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingStaff(null);
  };
  const roleChange = (value) => {
    setEditingStaff((pre) => {
      return { ...pre, role: value };
    });
  };

  // const updateEmployee = async () => {
  //   let cookie = localStorage.getItem("Cookie");
  //   setLoading(true);
  //   const response = await axios
  //     .put(UPDATE_EMPLOYEE_URL, editingStaff, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         // "Access-Control-Allow-Origin": "*",
  //         Authorization: `Bearer ${cookie}`,
  //       },
  //       // withCredentials: true,
  //     })
  //     .then((res) => {
  //       setDataSource(res.data.body);
  //       console.log(res);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   setLoading(false);
  // };

  const onDeleteStudent = (record) => {
    Modal.confirm({
      title: "Bạn có muốn xoá nhân viên này không?",
      okText: "Có",
      cancelText: "Không",
      okType: "danger",
      onOk: () => {
        setDataSource((pre) => {
          return pre.filter((employee) => employee.user_name !== record.user_name);
        });
      },
    });
  };

  // console.log(editingStaff);

  return (
    <div className="list-staff">
      <Search
        placeholder="Tìm kiếm"
        style={{ marginBottom: 8, width: 400, padding: "10px 0" }}
        onSearch={(value) => {
          setTextSearch(value);
          // console.log(value);
        }}
        onChange={(e) => {
          setTextSearch(e.target.value);
          // console.log(e.target.value);
        }}
      />
      <Table
        bordered
        dataSource={dataSource}
        columns={[
          {
            title: "Tên nhân viên",
            dataIndex: "full_name",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              // console.log(record);
              return (
                String(record.full_name).toLowerCase()?.includes(value.toLowerCase()) ||
                String(record.user_name).toLowerCase()?.includes(value.toLowerCase())
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
            title: "Địa chỉ",
            dataIndex: "address_more_detail",
          },
          {
            title: "Giới tính",
            dataIndex: "gender",
            render: (_, record) => {
              let gender;
              if (record.gender === "Male") {
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
              if (record.role[0] === "ROLE_ADMIN") {
                role = <p>Admin</p>;
              } else {
                role = <p>Staff</p>;
              }
              return <>{role}</>;
            },
          },

          {
            title: "Thao tác",
            dataIndex: "action",
            render: (_, record) => {
              return (
                <>
                  <EditOutlined
                    style={{ fontSize: "20px", marginRight: "10px" }}
                    onClick={() => {
                      onEditStudent(record);
                    }}
                  />
                  <DeleteOutlined
                    onClick={() => {
                      onDeleteStudent(record);
                    }}
                    style={{ fontSize: "20px" }}
                  />
                </>
              );
            },
          },
        ]}
        pagination={{ pageSize: 5 }}
        loading={loading}
      />
      <Modal
        title="Cập nhật nhân viên"
        visible={isEditing}
        okText="Lưu"
        cancelText="Huỷ"
        onCancel={() => {
          resetEditing();
        }}
        onOk={() => {
          setDataSource((pre) => {
            return pre.map((staff) => {
              if (staff.user_name === editingStaff.user_name) {
                // updateEmployee();
                return editingStaff;
              } else {
                return staff;
              }
            });
          });

          resetEditing();
        }}
      >
        <label htmlFor="">Tên nhân viên</label>
        <Input
          style={{ margin: "10px 0" }}
          value={editingStaff?.full_name}
          onChange={(e) => {
            setEditingStaff((pre) => {
              return { ...pre, full_name: e.target.value };
            });
          }}
        />
        <label htmlFor="">Tên đăng nhập</label>
        <Input
          style={{ margin: "10px 0" }}
          value={editingStaff?.user_name}
          onChange={(e) => {
            setEditingStaff((pre) => {
              return { ...pre, user_name: e.target.value };
            });
          }}
        />
        <label htmlFor="">Số điện thoại</label>
        <Input
          style={{ margin: "10px 0" }}
          value={editingStaff?.phone_number}
          onChange={(e) => {
            setEditingStaff((pre) => {
              return { ...pre, phone_number: e.target.value };
            });
          }}
        />
        <label htmlFor="">Vai trò</label>
        <Select
          defaultValue={editingStaff?.role}
          style={{
            width: 120,
            display: "block",
          }}
          onChange={roleChange}
        >
          <Option value="Admin">Admin</Option>
          <Option value="Staff">Staff</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default ListStaff;
