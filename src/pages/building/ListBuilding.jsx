import React, { useEffect, useState } from "react";
import { Col, Input, Modal, notification, Popconfirm, Row, Select, Spin, Table, Tag, Tooltip } from "antd";
import "./building.scss";
import axios from "../../api/axios";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import DetailBuilding from "./DetailBuilding";
import UpdateBuilding from "./UpdateBuilding";
const { Search } = Input;
const LIST_BUILDING_URL = "manager/group/all";
const LIST_CITY_URL = "config/city";
const ListBuilding = () => {
  const [dataSource, setDataSource] = useState();
  const [textSearch, setTextSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [building_address_city, setBuildingCity] = useState("");
  const [building_address_city_id, setBuildingCityId] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [id, setId] = useState();
  const [detailBuilding, setDetailBuilding] = useState(false);
  const [updateBuilding, setUpdateBuilding] = useState(false);
  const [dataDetailBuilding, setDataDetailBuilding] = useState([]);
  const onClickUpdateBuilding = (id) => {
    setUpdateBuilding(true);
    setId(id);
  };
  const onClickDetailBuilding = (id) => {
    setDetailBuilding(true);
    setId(id);
  };
  let cookie = localStorage.getItem("Cookie");

  useEffect(() => {
    const getAllBuilding = async () => {
      setLoading(true);
      const response = await axios
        .get(LIST_BUILDING_URL, {
          params: {
            city: buildingName,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setDataSource(res.data.data.list_group_contracted.concat(res.data.data.list_group_non_contracted));
        })
        .catch((error) => {
          console.log(error);
          notification.error({
            message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
            // description: "Vui lòng kiểm tra lại thông tin và thử lại.",
            duration: 3,
            placement: "top",
          });
        });
      setLoading(false);
    };
    getAllBuilding();
  }, [cookie, buildingName]);

  useEffect(() => {
    const getCity = () => {
      const response = axios
        .get(LIST_CITY_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setBuildingCity(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCity();
  }, [cookie]);

  const reload = () => window.location.reload();
  const handleDeleteBuilding = (id) => {
    const response = axios
      .delete(`manager/group/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Xoá chung cư thành công",
          duration: 3,
          placement: "top",
        });
        reload();
      })
      .catch((e) => {
        console.log(e);
        notification.error({
          message: "Xoá chung cư thất bại",
          description: "Vui lòng thử lại.",
          duration: 3,
          placement: "top",
        });
      });
  };
  let optionsCity = [];
  for (let i = 0; i < building_address_city?.length; i++) {
    optionsCity.push({
      label: building_address_city[i].city,
      value: building_address_city[i].id,
    });
  }
  const cityChange = (value, option) => {
    setBuildingCityId(value);
    setBuildingName(option.children);
  };
  return (
    <div>
      <Row>
        <Col span={6}>
          <Row>
            <span>Tìm kiếm theo tên chung cư</span>
          </Row>
          <Row>
            <Search
              placeholder="Tìm kiếm theo tên chung cư"
              style={{ width: 300, padding: "10px 0" }}
              onSearch={(value) => {
                setTextSearch(value);
              }}
              onChange={(e) => {
                setTextSearch(e.target.value);
              }}
            />
          </Row>
        </Col>
        <Col span={6}>
          <Row>
            <span>Tìm kiếm theo Tỉnh/Thành Phố</span>
          </Row>
          <Row>
            <Select
              defaultValue={""}
              style={{
                width: "300px",
                padding: "10px 0",
              }}
              onChange={cityChange}
              // options={optionsCity}
            >
              <Select.Option value="">Tất cả thành phố</Select.Option>
              {optionsCity?.map((obj, index) => {
                return (
                  <>
                    <Select.Option value={obj.value}>{obj.label}</Select.Option>
                  </>
                );
              })}
            </Select>
          </Row>
        </Col>
        <Col span={8}>
          <Row>
            <span>Tìm kiếm theo địa chỉ</span>
          </Row>
          <Row>
            <Search
              placeholder="Tìm kiếm theo địa chỉ"
              style={{ width: 300, padding: "10px 0" }}
              onSearch={(value) => {
                setAddressSearch(value);
              }}
              onChange={(e) => {
                setAddressSearch(e.target.value);
              }}
            />
          </Row>
        </Col>
      </Row>
      <Table
        bordered
        scroll={{ x: 1500 }}
        dataSource={dataSource}
        columns={[
          {
            title: "Tên chung cư",
            dataIndex: "group_name",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              return String(record.group_name).toLowerCase()?.includes(value.toLowerCase().trim());
            },
            render: (_, record) => {
              return (
                <>
                  <p>{record.group_name}</p>
                </>
              );
            },
          },
          {
            title: "Số lượng tầng",
            dataIndex: "total_floor",
            render: (_, record) => {
              return (
                <>
                  <p>{record.total_floor}</p>
                </>
              );
            },
          },
          {
            title: "Số lượng phòng",
            dataIndex: "total_room",
            render: (_, record) => {
              return (
                <>
                  <p>{record.total_room}</p>
                </>
              );
            },
          },
          {
            title: "Địa chỉ",
            dataIndex: "address",
            filteredValue: [addressSearch],
            onFilter: (value, record) => {
              return String(record.address.address_more_details).toLowerCase()?.includes(value.toLowerCase());
            },
            render: (_, record) => {
              return (
                <>
                  <p>
                    {record.address.address_wards}, {record.address.address_district}, {record.address.address_city}
                  </p>
                </>
              );
            },
          },
          {
            title: "Trạng thái chung cư",
            dataIndex: "contractIsDisable",
            render: (_, record) => {
              let status;
              if (record.group_contracted === true) {
                status = (
                  <Tag color="green" key={record.status}>
                    Chung cư đã ký hợp đồng
                  </Tag>
                );
              } else if (record.group_contracted === false) {
                status = (
                  <Tag color="default" key={record.status}>
                    Chung cư chưa ký hợp đồng
                  </Tag>
                );
              }
              return <>{status}</>;
            },
          },
          {
            title: "Mô tả",
            dataIndex: "description",
          },
          {
            title: "Thao tác",
            dataIndex: "action",
            render: (_, record) => {
              return record.group_contracted ? (
                <>
                  <Tooltip title="Xem chi tiết chung cư">
                    <EyeOutlined
                      className="icon"
                      onClick={() => {
                        setDataDetailBuilding(record);
                        setDetailBuilding(true);
                      }}
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Chỉnh sửa chung cư">
                    <EditOutlined className="icon" onClick={() => onClickUpdateBuilding(record.group_id)} />
                  </Tooltip>
                  <Tooltip title="Xem chi tiết chung cư">
                    <EyeOutlined
                      className="icon"
                      onClick={() => {
                        setDataDetailBuilding(record);
                        setDetailBuilding(true);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Xoá chung cư">
                    <DeleteOutlined
                      className="icon icon-delete"
                      onClick={() => {
                        Modal.confirm({
                          title: `Bạn có chắc chắn muốn xóa hoá đơn này?`,
                          okText: "Có",
                          cancelText: "Hủy",
                          onOk: () => {
                            return handleDeleteBuilding(record.group_id);
                          },
                        });
                      }}
                    />
                  </Tooltip>
                </>
              );
            },
          },
        ]}
        loading={loading}
      />
      <DetailBuilding visible={detailBuilding} close={setDetailBuilding} data={dataDetailBuilding} />
      <UpdateBuilding visible={updateBuilding} close={setUpdateBuilding} id={id} />
    </div>
  );
};

export default ListBuilding;
