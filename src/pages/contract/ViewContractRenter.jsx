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
import moment from "moment";
import { useNavigate } from "react-router-dom";

const cardTop = {
  height: "100%",
  border: "1px solid #C0C0C0",
  borderRadius: "10px",
};

const cardBellow = {
  height: "100%",
  marginTop: "2%",
  border: "1px solid #C0C0C0",
  borderRadius: "10px",
};
const memeber = {
  border: "1px solid #C0C0C0",
  borderRadius: "10px",
  height: "100%",
};

function ViewContractRenter({ openView, closeView, dataContract, dataAsset, dataService, assetType }) {
  // console.log(dataContract);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState("");
  const [filterAssetType, setFilterAssetType] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);
  // const [dataApartmentGroup, setDataApartmentGroup] = useState([]);

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
  // useEffect(() => {
  //     apartmentGroup();
  // }, []);

  // const apartmentGroup = async () => {
  //     setLoading(true);
  //     let cookie = localStorage.getItem("Cookie");
  //     await axios
  //         .get(APARTMENT_DATA_GROUP, {
  //             headers: {
  //                 "Content-Type": "application/json",
  //                 Authorization: `Bearer ${cookie}`,
  //             },
  //         })
  //         .then((res) => {
  //             setDataApartmentGroup(res.data.data.list_group_contracted.filter(group => group.group_id === dataContract.group_id)[0]);
  //         })
  //         .catch((error) => {
  //             console.log(error);
  //         });
  //     setLoading(false);
  // };
  const renterRepresent = dataContract?.list_renter?.find((obj, index) => obj.represent === true);

  return (
    <>
      <div>
        <Modal
          title={<h2>Hợp đồng phòng {dataContract?.room?.room_name}</h2>}
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
          <div>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab={<span style={{ fontSize: "17px" }}>Thông tin chung</span>} key="1">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} xl={12} span={12}>
                    <Card
                      style={cardTop}
                      title={
                        <>
                          <Tag style={{ fontSize: "15px", color: "black" }} color="blue">
                            <UserOutlined style={{ fontSize: "120%" }} /> Thông tin người đại diện
                          </Tag>
                        </>
                      }
                      bordered={true}
                    >
                      <Row>
                        <Col span={12}>
                          <h4>Họ và tên:</h4>
                        </Col>
                        <Col span={12}>
                          <p>{renterRepresent?.renter_full_name}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Giới tính:</h4>
                        </Col>
                        <Col span={12}>
                          <p>{renterRepresent === undefined ? "" : renterRepresent?.gender ? "Nam" : "Nữ"}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Số điện thoại:</h4>
                        </Col>
                        <Col span={12}>
                          <p>{renterRepresent?.phone_number}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>CMND/CCCD:</h4>
                        </Col>
                        <Col span={12}>
                          <p>{renterRepresent?.identity_number}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Email:</h4>
                        </Col>
                        <Col span={12}>
                          <p>{renterRepresent?.email}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Địa chỉ:</h4>
                        </Col>
                        <Col span={12}>
                          <p>{renterRepresent?.address?.address_more_details}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Biển số xe:</h4>
                        </Col>
                        <Col span={12}>
                          <p>{renterRepresent?.license_plates}</p>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col xs={24} xl={12} span={12}>
                    <Card
                      style={cardTop}
                      title={
                        <>
                          <Tag style={{ fontSize: "15px", color: "black" }} color="blue">
                            <AuditOutlined style={{ fontSize: "120%" }} /> Thông tin hợp đồng
                          </Tag>
                        </>
                      }
                      bordered={true}
                    >
                      <Row>
                        <Col span={12}>
                          <h4>Tên chung cư mini / căn hộ:</h4>
                        </Col>
                        <Col span={12}>
                          <p>{dataContract?.group_name}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Phòng cho thuê:</h4>
                        </Col>
                        <Col span={12}>
                          <p>
                            Tầng {dataContract?.room?.room_floor} phòng {dataContract?.room?.room_name}
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Thời hạn hợp đồng:</h4>
                        </Col>
                        <Col span={12}>
                          <p>
                            {dataContract?.contract_term < 12
                              ? dataContract?.contract_term + " tháng"
                              : dataContract?.contract_term % 12 !== 0
                              ? Math.floor(dataContract?.contract_term / 12) +
                                " năm " +
                                (dataContract?.contract_term % 12) +
                                " tháng"
                              : Math.floor(dataContract?.contract_term / 12) + " năm "}{" "}
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Ngày hợp đồng có hiệu lực:</h4>
                        </Col>
                        <Col span={12}>
                          <p>{moment(dataContract?.contract_start_date).format("DD-MM-YYYY")}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Ngày kết thúc: </h4>
                        </Col>
                        <Col span={12}>
                          <p>{moment(dataContract?.contract_end_date).format("DD-MM-YYYY")}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Trạng thái hợp đồng: </h4>
                        </Col>
                        <Col span={12}>
                          {!dataContract?.contract_is_disable ? (
                            <Tag color="green">Hợp đồng còn hiệu lực</Tag>
                          ) : (
                            <Tag color="red">Hợp đồng hết hiệu lực</Tag>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Chu kỳ thanh toán:</h4>
                        </Col>
                        <Col span={12}>
                          <p>{dataContract?.contract_bill_cycle} tháng 1 lần</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Thời gian thu tiền:</h4>
                        </Col>
                        <Col span={12}>
                          <p>Ngày {dataContract?.contract_payment_cycle} hàng tháng</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Ghi chú:</h4>
                        </Col>
                        <Col span={12}>
                          <p>{dataContract?.note}</p>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} xl={12} span={12}>
                    <Card
                      style={cardBellow}
                      title={
                        <Tag style={{ fontSize: "15px", color: "black" }} color="blue">
                          <DollarOutlined style={{ fontSize: "120%" }} /> Giá trị hợp đồng
                        </Tag>
                      }
                      bordered={true}
                    >
                      <Row>
                        <Col span={12}>
                          <h4>Tiền phòng (VNĐ): </h4>
                        </Col>
                        <Col span={12}>
                          <p>
                            <b>
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                dataContract.contract_price
                              )}
                            </b>
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <h4>Tiền cọc (VNĐ): </h4>
                        </Col>
                        <Col span={12}>
                          <p>
                            <b>
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                dataContract.contract_deposit
                              )}
                            </b>
                          </p>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col xs={24} xl={12} span={12}>
                    <Card
                      style={cardBellow}
                      title={
                        <Tag style={{ fontSize: "15px", color: "black" }} color="blue">
                          <GoldOutlined /> Dịch vụ sử dụng
                        </Tag>
                      }
                      bordered={true}
                    >
                      {dataService?.map((obj, index) => {
                        return (
                          <Row>
                            <Col span={12}>
                              <h4>{obj.service_show_name}: </h4>
                            </Col>
                            <Col span={12}>
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
              <Tabs.TabPane tab={<span style={{ fontSize: "17px" }}>Thành viên trong phòng</span>} key="2">
                <Row>
                  <div style={{ overflow: "auto" }}>
                    <h3>
                      Số lượng thành viên trong phòng: ({dataContract?.list_renter?.length}/
                      {dataContract?.room?.room_limit_people})
                    </h3>
                  </div>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  {dataContract?.list_renter?.map((obj, index) => {
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
              <Tabs.TabPane tab={<span style={{ fontSize: "17px" }}>Trang thiết bị trong phòng</span>} key="3">
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
            <Button
              onClick={() => {
                navigate("/contract-renter/edit", { state: dataContract });
              }}
              style={{ marginTop: "3%" }}
              type="primary"
              icon={<ArrowRightOutlined />}
            >
              {" "}
              Chỉnh sửa thông tin hợp đồng
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default ViewContractRenter;
