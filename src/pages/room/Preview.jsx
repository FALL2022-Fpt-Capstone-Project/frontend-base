import "./room.scss";
import axios from "../../api/axios";
import { Table, Input, Button, Form, Select, Row, Col, Tabs, Statistic, Tree, Card, Spin } from "antd";
import { DownOutlined, ArrowLeftOutlined, HomeOutlined, MinusCircleFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PreviewAddAsset from "./PreviewAddAsset";

const textSize = {
  fontSize: 15,
};
const iconSize = {
  fontSize: "130%",
  marginRight: "8%",
};

const APARTMENT_DATA_GROUP = "/manager/group/all";

let optionFloor = [{ label: "Tất cả các tầng", value: "" }];
for (let i = 1; i <= 10; i++) {
  optionFloor.push({
    value: i,
    label: "Tầng " + i,
  });
}

function Preview(props) {
  const { state } = useLocation();

  const listRoomGenerate = state.list_rooms.list_generate_room?.map((obj, index) => {
    return { ...obj, index: index };
  });
  const [componentSize, setComponentSize] = useState("default");
  const [formFilter] = Form.useForm();
  const [rowSelected, setRowSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  const [groupRoom, setGroupRoom] = useState([]);
  const [numberOfRoom, setNumberOfRoom] = useState(0);
  const [totalRoomPrice, setTotalRoomPrice] = useState(0);
  const [searchRoom, setSearchRoom] = useState("");
  const [room_status, setRoomStatus] = useState([]);
  const [filterSave, setFilterSave] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [listRoomPreview, setListRoomPreview] = useState([]);
  const [roomFloor, setRoomFloor] = useState([]);
  const [addAsset, setAddAsset] = useState(false);

  let cookie = localStorage.getItem("Cookie");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const columns = [
    {
      title: "Tên chung cư",
      dataIndex: "group_name",
      key: "index",
    },
    {
      title: "Tên phòng",
      dataIndex: "room_name",
      key: "index",
      filteredValue: [searchRoom],
      onFilter: (value, record) => {
        return String(record.room_name.trim()).toLowerCase()?.includes(value.trim().toLowerCase());
      },
    },
    {
      title: "Tầng",
      dataIndex: "room_floor",
      key: "index",
      render: (room_floor) => {
        return "Tầng " + room_floor;
      },
    },
    {
      title: "Giá phòng",
      dataIndex: "room_price",
      key: "index",
      render: (room_price) => {
        return <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(room_price)}</span>;
      },
    },
    {
      title: "Diện tích",
      dataIndex: "room_area",
      key: "index",
      render: (room_area) => {
        return room_area + " m2";
      },
    },
    {
      title: "Số người tối đa",
      dataIndex: "room_limit_people",
      key: "index",
      render: (room_limit_people) => {
        return room_limit_people + " người";
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(filterSave);
      if (filterSave === undefined) {
        setRowSelected(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
      } else {
        if (filterSave.roomFloor === "") {
          setRowSelected(selectedRows);
          setSelectedRowKeys(selectedRowKeys);
        } else {
          const mergeRoomSelect = rowSelected
            .filter((obj) => obj.room_floor !== filterSave.roomFloor)
            .concat(selectedRows);
          setRowSelected(mergeRoomSelect);
          setSelectedRowKeys(mergeRoomSelect.map((obj) => obj.index));
        }
      }
    },
    getCheckboxProps: (record) => ({
      disabled: record.roomStatus === true,
    }),
  };

  useEffect(() => {
    setListRoomPreview(listRoomGenerate);
    apartmentGroup();
    getRoomInfor();
    setRoomStatus({ ...room_status, roomStatus: [true, false] });
    formFilter.setFieldsValue({
      roomFloor: "",
    });

    setSelectedRowKeys(listRoomGenerate?.filter((room) => room.is_duplicate === false)?.map((o, i) => o.index));

    setRowSelected(listRoomGenerate?.filter((room) => room.is_duplicate === false));

    const expandedKeys = listRoomGenerate
      .filter((room) => room.is_duplicate === true)
      ?.map((obj, index) => {
        return obj.group_id.toString() + "-" + obj.room_floor;
      })
      .concat(state.groupId.toString());

    setExpandedKeys(expandedKeys);

    let listFloor = [
      {
        label: "Chọn tầng",
        value: "",
      },
    ];
    const totalFloor = state?.groupAll?.find((group) => group.group_id === state.groupId).total_floor;
    for (let i = 1; i <= totalFloor; i++) {
      listFloor.push({
        label: "Tầng " + i,
        value: i,
      });
    }
    setRoomFloor(listFloor);
  }, []);

  const apartmentGroup = async () => {
    setLoading(true);
    await axios
      .get(APARTMENT_DATA_GROUP, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        const mergeGroup = res.data.data.list_group_contracted
          ?.concat(res.data.data.list_group_non_contracted)
          ?.filter((group) => group.group_id === state.groupId);
        setDataApartmentGroup(mergeGroup);
        setGroupRoom((pre) => {
          return { ...pre, group: mergeGroup };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRoomInfor = async (group_id = "", sortRoom = "", roomFloor = "", roomStatus = []) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    let room_data =
      group_id === undefined || group_id === ""
        ? state.list_rooms.list_generate_room
        : state.list_rooms.list_generate_room?.filter((room, index) => room.group_id === group_id);

    room_data = Number.isInteger(roomFloor) ? room_data?.filter((room) => room.room_floor === roomFloor) : room_data;

    setNumberOfRoom(room_data.length);
    setTotalRoomPrice(
      room_data
        ?.map((obj, index) => obj.room_price)
        ?.reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    );
    setLoading(false);
  };

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
  };

  const treeData = dataApartmentGroup?.map((obj, index) => {
    let floor = [];
    for (let i = 1; i <= obj.total_floor; i++) {
      floor.push(i);
    }
    const list_rooms = obj.list_rooms.concat(state?.list_rooms?.list_generate_room);
    return {
      title: (
        <>
          <span>
            {obj.group_name}
            <b style={{ fontWeight: 600 }}>
              {" ( " +
                obj.total_floor +
                " tầng, " +
                list_rooms?.filter((u, y) => u.is_duplicate === false || u.is_duplicate === true).length +
                " phòng )"}
            </b>
          </span>
          <span style={{ color: "red" }}>
            {list_rooms?.filter((u, y) => u.is_duplicate === true).length === 0
              ? ""
              : " Có " + list_rooms?.filter((u, y) => u.is_duplicate === true).length + " phòng đã tồn tại"}
          </span>
        </>
      ),
      key: obj.group_id.toString(),
      icon: <HomeOutlined />,
      children: floor?.map((pre, k) => {
        return {
          title: (
            <>
              <span>
                {"Tầng " + pre}
                <b style={{ fontWeight: 600 }}>
                  {" "}
                  {"( " +
                    list_rooms?.filter(
                      (u, y) => u.room_floor === pre && (u.is_duplicate === false || u.is_duplicate === true)
                    ).length +
                    " phòng )"}{" "}
                </b>
              </span>
              <span style={{ color: "red" }}>
                {list_rooms?.filter((u, y) => u.is_duplicate === true && u.room_floor === pre).length === 0
                  ? ""
                  : " Có " +
                    list_rooms?.filter((u, y) => u.is_duplicate === true && u.room_floor === pre).length +
                    " phòng đã tồn tại"}
              </span>
            </>
          ),
          key: obj.group_id + "-" + pre,
          children: list_rooms
            ?.filter(
              (rooms) => rooms.room_floor === pre && (rooms.is_duplicate === true || rooms.is_duplicate === false)
            )
            ?.map((room, j) => {
              return {
                title: (
                  <span style={room.is_duplicate === false ? { color: "green" } : { color: "red" }}>
                    {"Phòng " + room.room_name}
                  </span>
                ),
                key: obj.group_id.toString() + "-" + pre.toString() + "-" + j.toString(),
              };
            }),
        };
      }),
    };
  });

  return (
    <>
      <Spin spinning={loading} size="large">
        <div
          className="site-layout-background"
          style={{
            padding: 0,
            minHeight: 360,
          }}
        >
          <Row>
            <Col span={24}>
              <Button
                href="/room"
                type="primary"
                size="default"
                style={{ marginBottom: "1%", marginLeft: "1%", float: "right" }}
                icon={<ArrowLeftOutlined style={textSize} />}
              >
                Danh sách phòng
              </Button>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} lg={24} xl={8} span={8}>
              <Card
                className="card-w100-h100"
                title={<p className="text-card">Thông tin chung cư và phòng xem trước</p>}
                bordered={false}
              >
                <Row>
                  <Col span={24}>
                    <p>
                      Địa chỉ chung cư:{" "}
                      {dataApartmentGroup[0]?.address?.address_wards +
                        ", " +
                        dataApartmentGroup[0]?.address?.address_district +
                        ", " +
                        dataApartmentGroup[0]?.address?.address_city}
                    </p>
                  </Col>
                </Row>
                <Tree
                  showIcon
                  checkable={false}
                  onExpand={onExpand}
                  expandedKeys={expandedKeys}
                  treeData={treeData}
                  switcherIcon={<DownOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} lg={24} xl={16} span={16}>
              <Card className="card-w100-h100" title={"Danh sách phòng xem trước"} bordered={false}>
                <Row style={{ marginBottom: "2%" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col span={12}>
                    <Statistic
                      title={
                        <>
                          <span style={textSize}>Tổng số phòng </span>
                        </>
                      }
                      value={numberOfRoom}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={
                        <>
                          <span style={textSize}>Tổng số tiền phòng (VND) </span>
                        </>
                      }
                      value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        totalRoomPrice
                      )}
                    />
                  </Col>
                </Row>
                <Tabs defaultActiveKey="1" style={{ marginBottom: "1%" }}>
                  <Tabs.TabPane tab="Tìm kiếm phòng" key="1">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col xs={12} xl={12} span={12}>
                        <Input.Search
                          onSearch={(e) => {
                            setSearchRoom(e);
                          }}
                          onChange={(e) => {
                            setSearchRoom(e.target.value);
                          }}
                          placeholder="Nhập tên phòng để tìm kiếm"
                        />
                      </Col>
                      <Col xs={12} xl={8} span={8}>
                        <Select
                          defaultValue={""}
                          options={optionFloor}
                          placeholder="Chọn tầng"
                          onChange={(e) => {
                            setFilterSave({ roomFloor: e });
                            getRoomInfor("", "", e, []);
                            setListRoomPreview(
                              e === "" ? listRoomGenerate : listRoomGenerate?.filter((room) => room.room_floor === e)
                            );
                          }}
                          style={{ width: "100%" }}
                        ></Select>
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                </Tabs>
                <Row>
                  <Col span={24}>
                    <span>
                      <MinusCircleFilled
                        style={{
                          fontSize: "130%",
                          margin: "1% 0",
                          color: "red",
                        }}
                      />{" "}
                      <i style={{ color: "red" }}>Những phòng đã tồn tại trong tòa nhà</i>
                    </span>
                  </Col>
                </Row>
                <Table
                  rowClassName={(record) => (record.is_duplicate === false ? "data-row" : "data-row active-row")}
                  rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                  }}
                  rowKey={(record) => record.index}
                  bordered
                  onChange={(pagination, filters, sorter, extra) => {
                    setRoomStatus({ ...room_status, roomStatus: filters.roomStatus });
                  }}
                  loading={loading}
                  dataSource={listRoomPreview
                    ?.sort((a, b) => b.is_duplicate - a.is_duplicate)
                    ?.map((obj, index) => {
                      return {
                        is_duplicate: obj.is_duplicate,
                        index: obj.index,
                        room_id: obj.room_id,
                        group_id: obj.group_id,
                        group_name: groupRoom?.group?.find((o, i) => o.group_id === obj.group_id)?.group_name,
                        room_name: obj.room_name,
                        room_floor: obj.room_floor,
                        room_price: obj.room_price,
                        room_area: obj.room_area,
                        room_limit_people: obj.room_limit_people,
                      };
                    })}
                  columns={columns}
                  scroll={{ x: 1000, y: 800 }}
                ></Table>
                <Row>
                  <p>Tổng số phòng đã chọn: {selectedRowKeys?.length}</p>
                </Row>
                <Row>
                  <Button
                    disabled={rowSelected.length === 0 ? true : false}
                    onClick={() => {
                      setAddAsset(true);
                    }}
                    type="primary"
                    style={{ marginTop: "1%" }}
                  >
                    Tạo mới phòng đã chọn
                  </Button>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
      <PreviewAddAsset visible={addAsset} close={setAddAsset} dataRoom={rowSelected} />
    </>
  );
}

export default Preview;
