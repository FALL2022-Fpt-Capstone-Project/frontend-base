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
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      id: "1",
      staff_name: "Hải Phương",
      user_name: "phuongnh",
      phone_number: "09865612",
      role: "Admin",
    },
    {
      key: "2",
      id: "2",
      staff_name: "Đức Pháp",
      user_name: "phapnd",
      phone_number: "09865612",
      role: "Admin",
    },
  ]);

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
            dataIndex: "staff_name",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              // console.log(record);
              return record.staff_name.includes(value);
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
            title: "Vai trò",
            dataIndex: "role",
          },
          // {
          //   title: "Tổng số số người",
          //   // dataIndex: "building_total_floor",
          // },
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
                  <DeleteOutlined style={{ fontSize: "20px" }} />
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
              if (staff.id === editingStaff.id) {
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
          value={editingStaff?.staff_name}
          onChange={(e) => {
            setEditingStaff((pre) => {
              return { ...pre, staff_name: e.target.value };
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
        <label htmlFor="">Mật khẩu</label>
        <Input
          style={{ margin: "10px 0" }}
          value={editingStaff?.password}
          onChange={(e) => {
            setEditingStaff((pre) => {
              return { ...pre, password: e.target.value };
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
          <Option value="User">User</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default ListStaff;
