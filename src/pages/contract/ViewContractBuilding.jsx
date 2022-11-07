import { Button, Card, Checkbox, Col, Input, Modal, Row, Table, Tabs, Tag } from "antd";
import React, { useState, useEffect } from "react";
import {
  ArrowRightOutlined,
  UserOutlined,
  FilterOutlined,
  AuditOutlined,
  DollarOutlined,
  GoldOutlined,
} from "@ant-design/icons";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

function ViewContractBuilding({ openView, closeView, dataContract }) {
  const LIST_ASSET_TYPE = "manager/asset/type";
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState("");
  const [filterAssetType, setFilterAssetType] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);
  const [listAssetType, setListAssetType] = useState([]);
  const navigate = useNavigate();

  const dataFilter = {
    id: [],
    asset_type: [],
  };

  const handleOk = () => {
    closeView(false);
  };
  const handleCancel = () => {
    closeView(false);
  };
  useEffect(() => {
    getAssetType();
  }, []);

  const getAssetType = async () => {
    let cookie = localStorage.getItem("Cookie");
    await axios
      .get(LIST_ASSET_TYPE, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        setListAssetType(res.data.body);
      })
      .catch((error) => {
        console.log(error);
      });
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
      title: "Loại",
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
    {
      title: "Thời gian",
      dataIndex: "hand_over_asset_date_delivery",
      key: "asset_id",
      render: (hand_over_asset_date_delivery) => {
        return new Date(hand_over_asset_date_delivery).toLocaleDateString();
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "hand_over_asset_status",
      filters: [
        { text: "Tốt", value: true },
        { text: "Hỏng", value: false },
      ],
      filteredValue: assetStatus.hand_over_asset_status || null,
      onFilter: (value, record) => record.hand_over_asset_status === value,
      render: (status) => {
        return (
          <>
            <Tag color={status ? "success" : "error"}>{status ? "Tốt" : "Hỏng"}</Tag>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <Modal
          title={<h2>Tên chung cư mini/ căn hộ </h2>}
          width={1200}
          open={openView}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button
              key="back"
              onClick={() => {
                closeView(false);
              }}
            >
              Đóng
            </Button>,
          ]}
        >
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab={<span style={{ fontSize: "17px" }}>Thông tin chung</span>} key="1">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={12}>
                  <Card
                    style={{ wordBreak: "break-all", whiteSpace: "normal", height: "auto" }}
                    title={
                      <Tag style={{ fontSize: "15px", color: "black" }} color="blue">
                        <UserOutlined style={{ fontSize: "120%" }} /> Thông tin người cho thuê
                      </Tag>
                    }
                    bordered={false}
                  >
                    <Row>
                      <Col span={10}>
                        <h4>Họ và tên:</h4>
                      </Col>
                      <Col span={14}>
                        <p>Lê Văn Luyện</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>Số điện thoại:</h4>
                      </Col>
                      <Col span={14}>
                        <p>0345422402</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>Email:</h4>
                      </Col>
                      <Col span={14}>
                        <p>example@gmail.com</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>CCCD/CMND:</h4>
                      </Col>
                      <Col span={14}>
                        <p>012345678911</p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    style={{ wordBreak: "break-all", whiteSpace: "normal", height: "auto" }}
                    title={
                      <Tag style={{ fontSize: "15px", color: "black" }} color="blue">
                        <AuditOutlined style={{ fontSize: "120%" }} /> Thông tin chung cư mini / căn hộ
                      </Tag>
                    }
                    bordered={false}
                  >
                    <Row>
                      <Col span={10}>
                        <h4>Tên chung cư/căn hộ:</h4>
                      </Col>
                      <Col span={14}>
                        <p>trọ xanh</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>Địa chỉ:</h4>
                      </Col>
                      <Col span={14}>
                        <p>Hà nội</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>Thời hạn hợp đồng:</h4>
                      </Col>
                      <Col span={14}>
                        <p>6 tháng</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>Ngày hợp đồng có hiệu lực:</h4>
                      </Col>
                      <Col span={14}>
                        <p>29/10/2022</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>Ngày kết thúc: </h4>
                      </Col>
                      <Col span={14}>
                        <p>29/10/2023</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>Trạng thái hợp đồng: </h4>
                      </Col>
                      <Col span={14}>
                        <Tag color="green">Còn hiệu lực</Tag>| <Tag color="red">Hết hiệu lực</Tag>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>Số lượng tầng: </h4>
                      </Col>
                      <Col span={14}>
                        <p>10 tầng</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>Số lượng phòng: </h4>
                      </Col>
                      <Col span={14}>
                        <p>50 phòng</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>Số lượng phòng đã cho thuê: </h4>
                      </Col>
                      <Col span={14}>
                        <Tag color="green">30/50 phòng</Tag> | <Tag color="red">50/50 phòng</Tag>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={12}>
                  <Card
                    style={{ wordBreak: "break-all", whiteSpace: "normal", height: "auto" }}
                    title={
                      <Tag style={{ fontSize: "15px", color: "black" }} color="blue">
                        <DollarOutlined style={{ fontSize: "120%" }} /> Giá trị hợp đồng
                      </Tag>
                    }
                    bordered={false}
                  >
                    <Row>
                      <Col span={10}>
                        <h4>Giá thuê (VNĐ): </h4>
                      </Col>
                      <Col span={14}>
                        <p>
                          <b>300.000.000đ</b>
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>Tiền cọc (VNĐ): </h4>
                      </Col>
                      <Col span={14}>
                        <p>
                          <b>50.000.000đ</b>
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    style={{ wordBreak: "break-all", whiteSpace: "normal", height: "auto" }}
                    title={
                      <Tag style={{ fontSize: "15px", color: "black" }} color="blue">
                        <GoldOutlined /> Dịch vụ sử dụng
                      </Tag>
                    }
                    bordered={false}
                  >
                    <Row>
                      <Col span={10}>
                        <h4>Dịch vụ điện: </h4>
                      </Col>
                      <Col span={14}>
                        <p>
                          <b>3.500đ</b>
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <h4>Dịch vụ nước: </h4>
                      </Col>
                      <Col span={14}>
                        <p>
                          <b>30.000đ</b>
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span style={{ fontSize: "17px" }}>Tài sản đã bàn giao</span>} key="2">
              <Row>
                <Col span={24}>
                  <Row>
                    <Col span={8}>
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
                    <Col span={3}>
                      <FilterOutlined style={{ fontSize: "150%" }} />
                      Loại tài sản:
                    </Col>
                    <Col span={21}>
                      <Row>
                        <Checkbox.Group
                          options={listAssetType?.map((obj, index) => {
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
          <Button
            onClick={() => {
              // navigate(`/contract-renter/edit/${dataContract.contract_id}`)
            }}
            style={{ marginTop: "1%" }}
            type="primary"
            icon={<ArrowRightOutlined />}
          >
            Chỉnh sửa thông tin hợp đồng
          </Button>
        </Modal>
      </div>
    </>
  );
}

export default ViewContractBuilding;