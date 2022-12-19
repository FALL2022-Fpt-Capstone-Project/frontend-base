import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Select, Table, Tabs, Tag } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { UserOutlined, FilterOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
const sizeHeader = {
  fontSize: "17px",
};

const card = {
  border: "1px solid #C0C0C0",
  borderRadius: "10px",
  height: 500,
};
const memeber = {
  border: "1px solid #C0C0C0",
  borderRadius: "10px",
  height: 450,
};

function RoomDetail({ visible, close, data, dataAsset, assetType }) {
  console.log(data);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState("");
  const [filterAssetType, setFilterAssetType] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);

  const dataFilter = {
    id: [],
    asset_type: [],
  };

  const columns = [
    {
      title: "Tên tài sản",
      dataIndex: "asset_name",
      key: "asset_id",
      filteredValue: [searched],
      onFilter: (value, record) => {
        return String(record.asset_name).toLowerCase()?.includes(value.toLowerCase());
      },
    },
    {
      title: "Số lượng",
      dataIndex: "hand_over_asset_quantity",
      key: "asset_id",
    },
    {
      title: "Nhóm tài sản",
      dataIndex: "asset_type_show_name",
      filters: [
        { text: "Phòng ngủ", value: "Phòng ngủ" },
        { text: "Phòng khách", value: "Phòng khách" },
        { text: "Phòng bếp", value: "Phòng bếp" },
        { text: "Phòng tắm", value: "Phòng tắm" },
        { text: "Khác", value: "Khác" },
      ],
      filteredValue: filterAssetType.asset_type_show_name || null,
      onFilter: (value, record) => record.asset_type_show_name.indexOf(value) === 0,
    },
  ];
  // console.log(data);
  return (
    <>
      <Modal
        title={<h2>Xem chi tiết phòng {data?.roomName}</h2>}
        open={visible}
        onOk={() => {
          close(false);
        }}
        onCancel={() => {
          close(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              close(false);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={1200}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={<span style={sizeHeader}>Thông tin chi tiết</span>} key="1">
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col xs={24} xl={12} span={12}>
                <Card style={card} title="Thông tin phòng">
                  <Row>
                    <Col span={12}>
                      <h4>Tên chung cư: </h4>
                    </Col>
                    <Col span={12}>
                      <p>{data?.groupName}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <h4>Tên phòng:</h4>
                    </Col>
                    <Col span={12}>
                      <p>Phòng {data?.roomName}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <h4>Giá phòng: </h4>
                    </Col>
                    <Col span={12}>
                      <p>
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(data?.roomPrice)}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <h4>Tiền cọc: </h4>
                    </Col>
                    <Col span={12}>
                      <p>
                        {data?.roomDeposit
                          ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                            data?.roomDeposit
                          )
                          : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(0)}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <h4>Số lượng người trong phòng: </h4>
                    </Col>
                    <Col span={12}>
                      <p>
                        {data?.list_renter !== undefined ? data?.list_renter?.length : 0}/{data?.room_limit_people}{" "}
                        người{" "}
                        {data?.list_renter?.length === data?.room_limit_people ? (
                          <>
                            | <Tag color="red">Đã đầy</Tag>
                          </>
                        ) : (
                          ""
                        )}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <h4>Diện tích: </h4>
                    </Col>
                    <Col span={12}>
                      <p>{data?.roomSquare} m2</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <h4>Thời hạn hợp đồng: </h4>
                    </Col>
                    <Col span={12}>
                      <p>
                        {data?.durationContract !== undefined
                          ? data?.durationContract < 12
                            ? data?.durationContract + " tháng"
                            : data?.durationContract % 12 !== 0
                              ? Math.floor(data?.durationContract / 12) +
                              " năm " +
                              (data?.durationContract % 12) +
                              " tháng"
                              : Math.floor(data?.durationContract / 12) + " năm "
                          : "Chưa vào ở"}{" "}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <h4>Ngày bắt đầu ở: </h4>
                    </Col>
                    <Col span={12}>
                      <p>{data.startDate === undefined ? 'Chưa lập hợp đồng' : moment(data?.startDate).format("DD-MM-YYYY")}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <h4>Ngày kết thúc hợp đồng: </h4>
                    </Col>
                    <Col span={12}>
                      <p>{data.endDate === undefined ? 'Chưa lập hợp đồng' : moment(data?.endDate).format("DD-MM-YYYY")}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <h4>Trạng thái phòng: </h4>
                    </Col>
                    <Col span={12}>
                      {data?.roomStatus ? <Tag color="success">Đang ở</Tag> : <Tag color="error">Đang trống</Tag>}
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} xl={12} span={12}>
                <Card style={card} title="Dịch vụ sử dụng">
                  {data?.list_services?.map((obj, index) => {
                    return (
                      <Row>
                        <Col span={10}>
                          <h4>{obj.service_show_name}: </h4>
                        </Col>
                        <Col span={14}>
                          <p>
                            <b>
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                obj.service_price
                              )}
                            </b>{" "}
                            ({obj.service_type_name})
                          </p>
                        </Col>
                      </Row>
                    );
                  })}
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span style={sizeHeader}>Thành viên trong phòng</span>} key="2">
            <Row>
              <div style={{ overflow: "auto" }}>
                <h3>
                  Số lượng thành viên trong phòng: ({data?.list_renter !== undefined ? data?.list_renter?.length : 0}/
                  {data?.room_limit_people})
                </h3>
              </div>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {data?.list_renter?.map((obj, index) => {
                return (
                  <>
                    <Col xs={24} xl={8} span={8}>
                      <Card style={memeber} cover={<UserOutlined style={{ fontSize: "500%" }} />} bordered>
                        <Row justify="center">
                          <h3>{obj.represent ? "Người đại diện" : ""}</h3>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <h4>Họ và tên: </h4>
                          </Col>
                          <Col span={12}>
                            <p>{obj?.renter_full_name}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <h4>Giới tính: </h4>
                          </Col>
                          <Col span={12}>
                            <p>{obj?.gender ? "Nam" : "Nữ"}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <h4>Số điện thoại: </h4>
                          </Col>
                          <Col span={12}>
                            <p>{obj?.phone_number}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <h4>CMND/CCCD: </h4>
                          </Col>
                          <Col span={12}>
                            <p>{obj?.identity_number}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <h4>Địa chỉ: </h4>
                          </Col>
                          <Col span={12}>
                            <p>{obj?.address?.address_more_details}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <h4>Biển số xe: </h4>
                          </Col>
                          <Col span={12}>
                            <p>{obj?.license_plates}</p>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </>
                );
              })}
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span style={sizeHeader}>Trang thiết bị trong phòng</span>} key="3">
            <Row>
              <Col span={24}>
                <Row>
                  <Col xs={24} xl={8} span={8}>
                    <Input.Search
                      placeholder="Nhập tên tài sản để tìm kiếm"
                      style={{ marginBottom: 8 }}
                      onSearch={(e) => {
                        setSearched(e);
                      }}
                      onChange={(e) => {
                        setSearched(e.target.value);
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} xl={3} span={3}>
                    <FilterOutlined style={{ fontSize: "150%" }} />
                    Nhóm tài sản:
                  </Col>
                  <Col xs={24} xl={21} span={21}>
                    <Row>
                      <Checkbox.Group
                        options={assetType?.map((obj, index) => {
                          return obj.asset_type_show_name;
                        })}
                        onChange={(checkedValues) => {
                          dataFilter.asset_type_show_name = checkedValues;
                          setFilterAssetType(dataFilter);
                        }}
                      ></Checkbox.Group>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Table
                    bordered
                    onChange={(pagination, filters, sorter, extra) => {
                      setFilterAssetType(filters);
                      setAssetStatus(filters);
                    }}
                    dataSource={dataAsset?.map((asset) => {
                      return {
                        asset_id: asset.room_asset_id,
                        asset_name: asset.asset_name,
                        hand_over_asset_quantity: asset.asset_quantity,
                        asset_type_show_name: assetType?.find((a) => a?.id === asset?.asset_type_id)
                          ?.asset_type_show_name,
                        asset_type_id: assetType?.find((a) => a?.id === asset?.asset_type_id)?.id,
                      };
                    })}
                    columns={columns}
                    scroll={{ x: 800, y: 600 }}
                    loading={loading}
                  ></Table>
                </Row>
              </Col>
            </Row>
            <Row></Row>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  );
}

export default RoomDetail;
