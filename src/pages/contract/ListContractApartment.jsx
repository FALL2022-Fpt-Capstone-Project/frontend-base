import React, { useEffect, useState } from "react";
import "./listContract.scss";
import { Input, Table, Tag, Row, Tabs, Col, Select, DatePicker, Button, Tooltip, Switch, Form } from "antd";
import { EyeOutlined, EditOutlined, SearchOutlined, UndoOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import ViewContractBuilding from "./ViewContractBuilding";
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
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataSource(res.data.data);
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
    setLoading(true);
    await axios
      .get(GET_FILTER_CONTRACT_GROUP, {
        params: {
          name: ownerName.trim(),
          phoneNumber: phoneNumber.trim(),
          identity: ownerIdentity.toString().trim(),
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
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
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
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        const data = res.data.data.filter((room) =>
          dataCheck.list_lease_contracted_room.find((obj) => obj.room_id === room.room_id)
        );
        setInvoiceByGroup(data);
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
          <Tabs.TabPane tab="T??m ki???m nhanh" key="1">
            <Row>
              <Col xs={24} lg={16} xl={10} span={10}>
                <Search
                  placeholder="Nh???p t??n ng?????i cho thu?? ho???c s??? ??i???n tho???i ????? t??m ki???m"
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
          <Tabs.TabPane tab="T??m ki???m n??ng cao" key="2">
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
                          T??m ki???m theo t??n ng?????i cho thu??
                        </label>
                      </Row>
                      <Row>
                        <Input
                          placeholder="Nh???p t??n ng?????i cho thu??"
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
                          T??m ki???m theo s??? CCCD
                        </label>
                      </Row>
                      <Row>
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Nh???p s??? CCCD"
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
                          T??m ki???m theo s??? ??i???n tho???i
                        </label>
                      </Row>
                      <Row>
                        <Input
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                          }}
                          placeholder="Nh???p s??? ??i???n tho???i"
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
                          Ng??y b???t ?????u l???p h???p ?????ng
                        </label>
                      </Row>
                      <Row>
                        <RangePicker
                          onChange={(e) => {
                            setStartDate(e[0].format("YYYY-MM-DD"));
                            setEndDate(e[1].format("YYYY-MM-DD"));
                          }}
                          format={"DD-MM-YYYY"}
                          placeholder={["T???", "?????n"]}
                          style={{ width: "500px" }}
                        />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="groupId" className="form-item-renter">
                    <Col className="gutter-row" span={16}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          T??m ki???m theo t??n chung c??
                        </label>
                      </Row>
                      <Row>
                        <Select
                          options={options}
                          placeholder="Ch???n chung c??"
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
                      {endContract ? <span>H???p ?????ng ???? k???t th??c</span> : <span>H???p ?????ng c??n hi???u l???c</span>}
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
                      T??m ki???m
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
                      ?????t l???i
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
        </Tabs>
        <Table loading={loading} dataSource={dataSource} scroll={{ x: 1600 }} bordered>
          <Column
            filteredValue={[textSearch]}
            onFilter={(value, record) => {
              return (
                String(record.rack_renter_full_name).trim().toLowerCase()?.includes(value.trim().toLowerCase()) ||
                String(record.phone_number).trim().toLowerCase()?.includes(value.trim().toLowerCase())
              );
            }}
            title="T??n ng?????i cho thu??"
            dataIndex="rack_renter_full_name"
            key="key"
          />
          <Column title="S??? ??i???n tho???i" dataIndex="phone_number" key="key" />

          <Column title="T??n chung c??" dataIndex="group_name" key="key" />

          <Column
            title="Gi?? thu??"
            dataIndex="contract_price"
            key="key"
            render={(value) => {
              return <span>{value.toLocaleString("vn") + " ??"}</span>;
            }}
          />
          <Column title="S??? l?????ng t???ng" dataIndex="total_floor" key="key" />
          <Column
            title="S??? l?????ng ph??ng ???? thu??"
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
            title="Ng??y l???p h???p ?????ng"
            dataIndex="contract_start_date"
            render={(date) => getFullDate(date)}
            key="key"
          />
          <Column title="Ng??y k???t th??c" dataIndex="contract_end_date" render={(date) => getFullDate(date)} key="key" />
          <Column
            width="12%"
            title="Tr???ng th??i h???p ?????ng"
            dataIndex="contractIsDisable"
            render={(_, record) => {
              let status;
              if (record.contract_is_disable === true) {
                status = (
                  <Tag color="default" key={record.status}>
                    H???p ?????ng ???? k???t th??c
                  </Tag>
                );
              } else if (record.contract_is_disable === false) {
                status = (
                  <Tag color="green" key={record.status}>
                    H???p ?????ng c??n hi???u l???c
                  </Tag>
                );
              }
              return <>{status}</>;
            }}
          />
          <Column
            title="Thao t??c"
            key="action"
            render={(_, record) => {
              return record.contract_is_disable === true ? (
                <>
                  <Tooltip title="Xem chi ti???t">
                    <EyeOutlined
                      style={{ fontSize: "20px", color: "#46a6ff", margin: "0 5px" }}
                      onClick={() => {
                        setViewContract(true);
                        setDataContract(record);
                        apartmentGroupById(record.group_id);
                      }}
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Xem chi ti???t">
                    <EyeOutlined
                      style={{ fontSize: "20px", color: "#46a6ff", margin: "0 5px" }}
                      onClick={() => {
                        setViewContract(true);
                        setDataContract(record);
                        apartmentGroupById(record.group_id);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Ch???nh s???a h???p ?????ng">
                    <EditOutlined
                      onClick={() => {
                        navigate("/contract-apartment/edit", { state: record });
                      }}
                      style={{ fontSize: "20px", color: "#46a6ff", margin: "0 5px" }}
                    />
                  </Tooltip>
                  <Tooltip title="K???t th??c h???p ?????ng">
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
