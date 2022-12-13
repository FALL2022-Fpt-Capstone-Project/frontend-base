import React, { useEffect, useState } from "react";
import { Col, Input, notification, Popconfirm, Row, Select, Spin, Table, Tag, Tooltip } from "antd";
import "./building.scss";
import axios from "../../api/axios";
import { DeleteOutlined, EditOutlined, EyeOutlined, AuditOutlined, ContainerOutlined } from "@ant-design/icons";
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
          console.log(res.data.data.list_group_contracted.concat(res.data.data.list_group_non_contracted));
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
          console.log(res.data.data);
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
    console.log(id);
    const response = axios
      .delete(`manager/group/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        console.log(res);
        notification.success({
          message: "Xoá chung cư thành công",
          duration: 3,
        });
        reload();
      })
      .catch((e) => {
        console.log(e.request);
        notification.error({
          message: "Xoá chung cư thất bại",
          description: "Vui lòng thử lại.",
          duration: 3,
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
  console.log(building_address_city);
  const cityChange = (value, option) => {
    setBuildingCityId(value);
    setBuildingName(option.children);
    // console.log(option);
  };

  // const buildingDetail = async (id) => {
  //   await axios
  //     .get(`manager/group/${id}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${cookie}`,
  //       },
  //     })
  //     .then((res) => {
  //       setDataDetailBuilding(res.data.data)
  //     });
  // };

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
              defaultValue="Chọn thành phố"
              style={{
                width: "300px",
                padding: "10px 0",
              }}
              onChange={cityChange}
              // options={optionsCity}
            >
              <Select.Option value="">Tất cả</Select.Option>
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
            <span>Tìm kiếm theo địa chỉ chi tiết</span>
          </Row>
          <Row>
            <Search
              placeholder="Tìm kiếm theo địa chỉ"
              style={{ width: 400, padding: "10px 0" }}
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
        dataSource={dataSource}
        columns={[
          {
            title: "Tên chung cư",
            dataIndex: "group_name",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              return String(record.group_name).toLowerCase()?.includes(value.toLowerCase());
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
                  <p>{record.address.address_more_details}</p>
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
                        // buildingDetail(record.group_id);
                        setDetailBuilding(true);
                        // onClickDetailBuilding(record.group_id)
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
                        // buildingDetail(record.group_id);
                        setDetailBuilding(true);
                        // onClickDetailBuilding(record.group_id);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Xoá chung cư">
                    <Popconfirm
                      title="Bạn có muốn xoá chung cư này không?"
                      okText="Đồng ý"
                      cancelText="Không"
                      placement="topRight"
                      onConfirm={() => handleDeleteBuilding(record.group_id)}
                    >
                      <DeleteOutlined className="icon icon-delete" />
                    </Popconfirm>
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
