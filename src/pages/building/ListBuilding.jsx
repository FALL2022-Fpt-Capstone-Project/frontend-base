import React, { useEffect, useState } from "react";
import { Col, Input, Row, Select, Table, Tooltip } from "antd";
import "./building.scss";
import axios from "../../api/axios";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
const { Search } = Input;
const LIST_EMPLOYEE_URL = "manager/get-list-building";
const ListBuilding = () => {
  const [dataSource, setDataSource] = useState([
    {
      building_name: "Trọ xanh",
      building_total_floor: "6",
      building_total_rooms: "40",
      building_empty_rooms: "3",
      total_people: "100",
      address_more_detail: "Đông Du, Đào Viên, Quế Võ,Bắc Ninh",
      description: "Toà nhà nằm ở hướng Đông Nam",
    },
    {
      building_name: "Trọ sạch",
      building_total_floor: "7",
      building_total_rooms: "50",
      building_empty_rooms: "9",
      total_people: "160",
      address_more_detail: "Đông Du, Đào Viên, Quế Võ,Bắc Ninh",
      description: "Toà nhà nằm ở hướng Đông Nam",
    },
  ]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [building_address_city, setBuildingCity] = useState("");
  const [building_address_city_id, setBuildingCityId] = useState("");
  const [building_address_district, setBuildingDistrict] = useState([]);
  // const [building_address_district_id, setBuildingDistrictId] = useState("");
  // const [building_address_more_detail, setBuildingAddress] = useState("");
  const [disabledDistrict, setDisableDistrict] = useState(true);
  useEffect(() => {
    const getCity = async () => {
      const response = await axios
        .get("https://provinces.open-api.vn/api/p/", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          setBuildingCity(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCity();
  }, []);

  // useEffect(() => {
  //   const getDistric = async () => {
  //     const response = await axios
  //       .get(`https://provinces.open-api.vn/api/p/${building_address_city_id}?depth=2`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       })
  //       .then((res) => {
  //         console.log(res.data.districts);

  //         setBuildingDistrict(res.data.districts);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };
  //   getDistric();
  // }, [building_address_city_id]);

  let optionsCity = [];
  for (let i = 0; i < building_address_city.length; i++) {
    optionsCity.push({
      label: building_address_city[i].name,
      value: building_address_city[i].code,
    });
  }

  const cityChange = (value) => {
    setBuildingDistrict([]);
    setBuildingCityId(value);
    setDisableDistrict(false);
    // form.setFieldsValue({ district: "", ward: "" });
  };
  // const districtChange = (value) => {
  //   console.log(value);
  //   setBuildingDistrictId(value);
  //   // form.setFieldsValue({ ward: "" });
  // };
  return (
    <div>
      <Row gutter={16}>
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
        <Col span={16}>
          <Row gutter={32}>
            <Col span={6}>
              <Row>
                <span>Tìm kiếm theo Tỉnh/Thành Phố</span>
              </Row>
              <Row>
                <Select
                  defaultValue="Chọn thành phố"
                  style={{
                    width: "100%",
                    padding: "10px 0",
                  }}
                  onChange={cityChange}
                  options={optionsCity}
                />
              </Row>
            </Col>
            {/* <Col span={6}>
              <Row>
                <span>Tìm kiếm theo Quận/Huyện</span>
              </Row>
              <Row>
                <Select
                  style={{
                    width: "100%",
                    padding: "10px 0",
                  }}
                  disabled={disabledDistrict}
                  onChange={districtChange}
                  // options={optionsDistrict}
                  defaultValue={defaultValue}
                >
                  <Select.Option value="default">Tất cả</Select.Option>
                  {building_address_district?.map((obj, index) => {
                    return (
                      <>
                        <Select.Option value={obj.code}>{obj.name}</Select.Option>
                      </>
                    );
                  })}
                </Select>
              </Row>
            </Col> */}
            <Col span={8}>
              <Row>
                <span>Tìm kiếm theo địa chỉ chi tiết</span>
              </Row>
              <Row>
                <Search
                  placeholder="Tìm kiếm theo địa chỉ"
                  style={{ width: 400, padding: "10px 0" }}
                  onSearch={(value) => {
                    setTextSearch(value);
                  }}
                  onChange={(e) => {
                    setTextSearch(e.target.value);
                  }}
                />
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Table
        bordered
        dataSource={dataSource}
        columns={[
          {
            title: "Tên chung cư",
            dataIndex: "building_name",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              return record.building_name.includes(value);
            },
          },
          {
            title: "Số lượng tầng đã thuê",
            dataIndex: "building_total_floor",
          },
          {
            title: "Số lượng phòng đã thuê",
            dataIndex: "building_total_rooms",
          },

          {
            title: "Số lượng phòng trống",
            dataIndex: "building_empty_rooms",
          },
          {
            title: "Số lượng người",
            dataIndex: "total_people",
          },
          {
            title: "Địa chỉ",
            dataIndex: "address_more_detail",
          },
          {
            title: "Mô tả",
            dataIndex: "description",
          },
          {
            title: "Thao tác",
            dataIndex: "action",
            render: (_, record) => {
              return (
                <>
                  <Tooltip title="Chỉnh sửa">
                    <EditOutlined className="icon" />
                  </Tooltip>
                  <Tooltip title="Xem">
                    <EyeOutlined className="icon" />
                  </Tooltip>
                </>
              );
            },
          },
        ]}
        loading={loading}
      />
    </div>
  );
};

export default ListBuilding;
