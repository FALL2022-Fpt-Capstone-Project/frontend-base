import React, { useEffect, useState } from "react";
import "./listContract.scss";
import {
  Input,
  Table,
  Tag,
  Row,
  Tabs,
  Col,
  Select,
  DatePicker,
  Button,
  Tooltip,
  Switch,
  Form,
  InputNumber,
} from "antd";
import { EyeOutlined, EditOutlined, SearchOutlined, UndoOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import ViewContractBuilding from "./ViewContractBuilding";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import DeleteContractBuilding from "./DeleteContractBuilding";

const { Search } = Input;
const LIST_CONTRACT_APARTMENT_URL = "manager/contract/group";
const { Column, ColumnGroup } = Table;
const LIST_BUILDING_FILTER = "manager/group/all/contracted";
const GET_SERVICE_GROUP_BY_ID = "manager/service/general?groupId=";
const GET_FILTER_CONTRACT_GROUP = "manager/contract/group";
const GET_INVOICE_BY_GROUP = "manager/statistical/bill/list-room-billed";

const ListContractApartment = () => {
  const { RangePicker } = DatePicker;
  const [filterContract] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerIdentity, setOwnerIdentity] = useState("");
  const [groupId, setGroupId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [viewContract, setViewContract] = useState(false);
  const [deleteContract, setDeleteContract] = useState(false);
  const [buildingFilter, setBuildingFilter] = useState("");
  const [endContract, setEndContract] = useState(false);
  const [dataApartmentServiceGeneral, setDataApartmentServiceGeneral] = useState([]);
  const [invoiceByGroup, setInvoiceByGroup] = useState([]);

  const [dataContract, setDataContract] = useState([]);

  let cookie = localStorage.getItem("Cookie");
  const navigate = useNavigate();

  useEffect(() => {
    getAllContractBuilding();
    getBuildingFilter();
  }, []);

  const getBuildingFilter = async (e) => {
    setLoading(true);
    await axios
      .get(LIST_BUILDING_FILTER, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setBuildingFilter(res.data.data);
        // setTimeout(() => {
        //   window.location.reload();
        // }, "10000");
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const options = [];
  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].group_id,
    });
  }
  const getAllContractBuilding = async () => {
    setLoading(true);
    const response = await axios
      .get(LIST_CONTRACT_APARTMENT_URL, {
        params: {},
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        setDataSource(res.data.data);
        console.log(res.data.data);
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

  const getFilterContractRenter = async (e) => {
    console.log({
      name: ownerName,
      phoneNumber: phoneNumber,
      identity: ownerIdentity.toString(),
      isDisable: endContract,
      startDate: startDate,
      endDate: endDate,
      groupId: groupId,
    });
    setLoading(true);
    await axios
      .get(GET_FILTER_CONTRACT_GROUP, {
        params: {
          name: ownerName,
          phoneNumber: phoneNumber,
          identity: ownerIdentity.toString(),
          isDisable: endContract,
          startDate: startDate,
          endDate: endDate,
          groupId: groupId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataSource(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };
  const apartmentGroupById = async (groupId) => {
    setLoadingModal(true);
    await axios
      .get(GET_SERVICE_GROUP_BY_ID + groupId, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.data);
        setDataApartmentServiceGeneral(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoadingModal(false);
  };

  const getInvoiceByGroup = async (groupId, dataCheck) => {
    setLoadingModal(true);
    await axios
      .get(GET_INVOICE_BY_GROUP, {
        params: {
          createdTime: null,
          groupId: groupId,
        },
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        const data = res.data.data.filter((room) =>
          dataCheck.list_lease_contracted_room.find((obj) => obj.room_id === room.room_id)
        );
        setInvoiceByGroup(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoadingModal(false);
  };

  const reloadApi = () => {
    getAllContractBuilding();
  };
  return (
    <div className="list-contract">
      <div className="list-contract-search">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
            <Row>
              <Col xs={24} lg={16} xl={10} span={10}>
                <Search
                  placeholder="Nhập tên người cho thuê hoặc số điện thoại để tìm kiếm"
                  style={{ marginBottom: "3%", width: "70%" }}
                  onSearch={(value) => {
                    setTextSearch(value);
                  }}
                  onChange={(e) => {
                    setTextSearch(e.target.value);
                  }}
                />
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tìm kiếm nâng cao" key="2">
            <Form
              onFinish={getFilterContractRenter}
              onFinishFailed={getAllContractBuilding}
              form={filterContract}
              id="filter"
              style={{ width: "100%" }}
            >
              <Row gutter={[16]} className="advanced-search" style={{ marginBottom: "20px", marginLeft: "20px" }}>
                <Row>
                  <Form.Item name="ownerName" className="form-item-renter">
                    <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 16 }}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo tên người cho thuê
                        </label>
                      </Row>
                      <Row>
                        <Input
                          placeholder="Nhập tên người cho thuê"
                          autoComplete="off"
                          onChange={(e) => {
                            setOwnerName(e.target.value);
                          }}
                        />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="ownerIdentity" className="form-item-renter">
                    <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 16 }}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo số CCCD
                        </label>
                      </Row>
                      <Row>
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Nhập số CCCD"
                          autoComplete="off"
                          onChange={(e) => {
                            setOwnerIdentity(e.target.value);
                          }}
                        />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="phoneNumber" className="form-item-renter">
                    <Col className="gutter-row" span={16}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo số điện thoại
                        </label>
                      </Row>
                      <Row>
                        <Input
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                          }}
                          placeholder="Nhập số điện thoại"
                          autoComplete="off"
                        />
                      </Row>
                    </Col>
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item name="date" className="form-item-renter">
                    <Col className="gutter-row" span={16}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Ngày bắt đầu lập hợp đồng
                        </label>
                      </Row>
                      <Row>
                        <RangePicker
                          onChange={(e) => {
                            setStartDate(e[0].format("YYYY-MM-DD"));
                            setEndDate(e[1].format("YYYY-MM-DD"));
                          }}
                          format={"DD-MM-YYYY"}
                          placeholder={["Từ", "Đến"]}
                          style={{ width: "500px" }}
                        />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="groupId" className="form-item-renter">
                    <Col className="gutter-row" span={16}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo tên chung cư
                        </label>
                      </Row>
                      <Row>
                        <Select
                          options={options}
                          placeholder="Chọn chung cư"
                          onChange={(e) => {
                            setGroupId(e);
                          }}
                        ></Select>
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="deactive" className="form-item-renter form-item-renter-deactive">
                    <Col className="gutter-row" span={24}>
                      <Switch
                        onChange={(e) => {
                          setEndContract(e);
                        }}
                      />{" "}
                      {endContract ? <span>Hợp đồng đã kết thúc</span> : <span>Hợp đồng còn hiệu lực</span>}
                    </Col>
                  </Form.Item>
                </Row>
              </Row>
              <Row style={{ marginBottom: "20px" }}>
                <Col span={24}>
                  <Row justify="center">
                    <Button
                      form="filter"
                      htmlType="submit"
                      key="submit"
                      type="primary"
                      icon={<SearchOutlined />}
                      style={{ marginRight: "20px" }}
                    >
                      Tìm kiếm
                    </Button>
                    <Button
                      onClick={() => {
                        getAllContractBuilding();
                        filterContract.resetFields();
                        setStartDate("");
                        setEndDate("");
                        setPhoneNumber("");
                        setOwnerName("");
                        setOwnerIdentity("");
                        setGroupId("");
                        setEndContract(false);
                      }}
                      icon={<UndoOutlined />}
                    >
                      Đặt lại
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
        </Tabs>
        <Table loading={loading} dataSource={dataSource} scroll={{ x: 1600, y: 600 }} bordered>
          {/* <Column width='10%' title="Tên hợp đồng" dataIndex="contract_name" key="key" /> */}
          <Column
            filteredValue={[textSearch]}
            onFilter={(value, record) => {
              return (
                String(record.rack_renter_full_name).trim().toLowerCase()?.includes(value.trim().toLowerCase()) ||
                String(record.phone_number).trim().toLowerCase()?.includes(value.trim().toLowerCase())
              );
            }}
            title="Tên người cho thuê"
            dataIndex="rack_renter_full_name"
            key="key"
          />
          <Column title="Số điện thoại" dataIndex="phone_number" key="key" />

          <Column title="Tên chung cư" dataIndex="group_name" key="key" />

          <Column
            title="Giá thuê"
            dataIndex="contract_price"
            key="key"
            render={(value) => {
              return <span>{value.toLocaleString("vn") + " đ"}</span>;
            }}
          />
          <Column title="Số lượng tầng" dataIndex="total_floor" key="key" />
          <Column
            title="Số lượng phòng đã thuê"
            width="12%"
            dataIndex="total_room"
            key="key"
            render={(_, record) => {
              return (
                <span>
                  {record?.list_lease_contracted_room?.length} / {record?.total_room}
                </span>
              );
            }}
          />
          <Column
            title="Ngày lập hợp đồng"
            dataIndex="contract_start_date"
            render={(date) => getFullDate(date)}
            key="key"
          />
          <Column title="Ngày kết thúc" dataIndex="contract_end_date" render={(date) => getFullDate(date)} key="key" />
          <Column
            width="12%"
            title="Trạng thái hợp đồng"
            dataIndex="contractIsDisable"
            render={(_, record) => {
              let status;
              if (record.contract_is_disable === true) {
                status = (
                  <Tag color="default" key={record.status}>
                    Hợp đồng đã kết thúc
                  </Tag>
                );
              } else if (record.contract_is_disable === false) {
                status = (
                  <Tag color="green" key={record.status}>
                    Hợp đồng còn hiệu lực
                  </Tag>
                );
              }
              return <>{status}</>;
            }}
          />
          <Column
            title="Thao tác"
            key="action"
            render={(_, record) => {
              return (
                <>
                  <Tooltip title="Chỉnh sửa">
                    <EditOutlined
                      onClick={() => {
                        navigate("/contract-apartment/edit", { state: record });
                      }}
                      style={{ fontSize: "20px", color: "#46a6ff", margin: "0 5px" }}
                    />
                  </Tooltip>
                  <Tooltip title="Xem">
                    <EyeOutlined
                      style={{ fontSize: "20px", color: "#46a6ff", margin: "0 5px" }}
                      onClick={() => {
                        setViewContract(true);
                        setDataContract(record);
                        apartmentGroupById(record.group_id);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Kết thúc hợp đồng">
                    <DeleteOutlined
                      style={{
                        fontSize: "20px",
                        margin: "0 5px",
                        color: "red",
                      }}
                      onClick={() => {
                        getInvoiceByGroup(record.group_id, record);
                        setDeleteContract(true);
                        setDataContract(record);
                      }}
                    />
                  </Tooltip>
                </>
              );
            }}
          />
        </Table>
        <ViewContractBuilding
          openView={viewContract}
          closeView={setViewContract}
          dataContract={dataContract}
          dataAsset={dataApartmentServiceGeneral}
          loading={loadingModal}
        />
        <DeleteContractBuilding
          reload={reloadApi}
          openView={deleteContract}
          closeView={setDeleteContract}
          dataContract={dataContract}
          dataInvoice={invoiceByGroup}
          loading={loadingModal}
        />
      </div>
    </div>
  );
};

export default ListContractApartment;
