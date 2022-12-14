import React, { useEffect, useState } from "react";
import { Input, Table, DatePicker, Select, Button, Row, Col, Tag, Tabs, Switch, Form, Tooltip, Modal } from "antd";
import "./listContract.scss";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { EditOutlined, SearchOutlined, EyeOutlined, UndoOutlined, DeleteOutlined } from "@ant-design/icons";
import ViewContractRenter from "./ViewContractRenter";
import DeleteContractRenter from "./DeleteContractRenter";

const { Search } = Input;
const LIST_CONTRACT_URL = "manager/contract";
const LIST_BUILDING_FILTER = "manager/group/all";
const ASSET_ROOM = "manager/asset/room/";
const GET_SERVICE_GROUP_BY_ID = "manager/service/general?groupId=";
const LIST_ASSET_TYPE = "manager/asset/type";
const GET_INVOICE_BY_ROOM_ID = "manager/bill/room/history/";

const { RangePicker } = DatePicker;
const ListContractRenter = () => {
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [identity, setIdentity] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [renterName, setRenterName] = useState("");
  const [building, setBuilding] = useState("");
  const [endContract, setEndContract] = useState(false);
  const [duration, setDuration] = useState();
  const [viewContract, setViewContract] = useState(false);
  const [deleteContract, setDeleteContract] = useState(false);
  const [contractInfor, setContractInfor] = useState([]);
  const [assetRoom, setAssetRoom] = useState([]);
  const [dataApartmentServiceGeneral, setDataApartmentServiceGeneral] = useState([]);
  const [listAssetType, setListAssetType] = useState([]);
  const [getInvoiceData, setInvoiceData] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const options = [];
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");
  useEffect(() => {
    getAllContract();
    getAssetType();
  }, []);

  const getAllContract = async () => {
    setLoading(true);
    const response = await axios
      .get(LIST_CONTRACT_URL, {
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

  const getAssetType = async () => {
    await axios
      .get(LIST_ASSET_TYPE, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setListAssetType(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getInvoiceByRoomId = async (room_id) => {
    await axios
      .get(GET_INVOICE_BY_ROOM_ID + room_id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setInvoiceData(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const getBuildingFilter = async () => {
      setLoading(true);
      const response = await axios
        .get(LIST_BUILDING_FILTER, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setBuildingFilter(res.data.data.list_group_contracted);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };

    getBuildingFilter();
  }, [cookie]);

  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].group_id,
    });
  }

  const getFullDate = (date) => {
    const dateAndTime = date.split(" ");

    return dateAndTime[0].split("-").reverse().join("-");
  };
  const dateChange = (value, dateString) => {
    let [day1, month1, year1] = dateString[0].split("-");
    let startDate = `${year1}-${month1}-${day1}`;
    let [day2, month2, year2] = dateString[1].split("-");
    let endDate = `${year2}-${month2}-${day2}`;
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const getFilterContractRenter = async () => {
    setLoading(true);
    const response = await axios
      .get(LIST_CONTRACT_URL, {
        params: {
          phoneNumber: phoneNumber.trim(),
          renterName: renterName.trim(),
          isDisable: endContract,
          startDate: startDate,
          endDate: endDate,
          identity: identity.trim(),
          groupId: building,
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
  const durationChange = (value) => {
    setDuration(value);
  };

  const renterNameChange = (e) => {
    setRenterName(e.target.value);
  };
  const phoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };
  const identityChange = (e) => {
    setIdentity(e.target.value);
  };
  const buildingChange = (value) => {
    setBuilding(value);
  };
  const endContractChange = (value) => {
    setEndContract(value);
  };
  const resetForm = async () => {
    form.resetFields();
    setRenterName("");
    setPhoneNumber("");
    setIdentity("");
    setBuilding("");
    setStartDate("");
    setEndDate("");
    setEndContract(false);
    setLoading(true);
    getAllContract();
  };

  const getAssetRoom = async (room_id) => {
    await axios
      .get(ASSET_ROOM + room_id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setAssetRoom(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const apartmentGroupById = async (groupId) => {
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
  };
  const reload = () => {
    getAllContract();
  };

  return (
    <div className="list-contract">
      <div className="list-contract-search">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tìm kiếm nhanh" key="1">
            <Row>
              <Col xs={24} lg={16} xl={10} span={10}>
                <Search
                  style={{ width: "70%" }}
                  placeholder="Tìm kiếm theo số phòng, số điện thoại, tên khách thuê,..."
                  className="quich-search"
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
              {...formItemLayout}
              form={form}
              name="filterStaff"
              id="filterStaff"
              onFinish={getFilterContractRenter}
            >
              <Row gutter={[16]} className="advanced-search" style={{ marginBottom: "20px", marginLeft: "20px" }}>
                <Row>
                  <Form.Item name="renterName" className="form-item-renter">
                    <Col className="gutter-row" xs={{ span: 24 }} lg={{ span: 24 }}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo tên khách thuê
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập tên khách thuê" autoComplete="off" onChange={renterNameChange} />
                      </Row>
                    </Col>
                  </Form.Item>

                  <Form.Item name="identity" className="form-item-renter">
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo số CCCD
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập số CCCD" autoComplete="off" onChange={identityChange} />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="phoneNumber" className="form-item-renter">
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo số điện thoại
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập số điện thoại" autoComplete="off" onChange={phoneNumberChange} />
                      </Row>
                    </Col>
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item name="date" className="form-item-renter">
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Ngày bắt đầu lập hợp đồng
                        </label>
                      </Row>
                      <Row>
                        <RangePicker
                          format={"DD-MM-YYYY"}
                          placeholder={["Từ", "Đến"]}
                          onChange={dateChange}
                          style={{ width: "500px" }}
                        />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="groupId" className="form-item-renter">
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" className="search-name">
                          Tìm kiếm theo tên chung cư
                        </label>
                      </Row>
                      <Row>
                        <Select options={options} placeholder="Chọn chung cư" onChange={buildingChange}></Select>
                      </Row>
                    </Col>
                  </Form.Item>
                  <Form.Item name="deactive" className="form-item-renter form-item-renter-deactive">
                    <Col className="gutter-row" span={24}>
                      <Switch onChange={endContractChange} />{" "}
                      {endContract ? <span>Hợp đồng đã kết thúc</span> : <span>Hợp đồng còn hiệu lực</span>}
                    </Col>
                  </Form.Item>
                </Row>
              </Row>
              <Row style={{ marginBottom: "20px" }}>
                <Col span={24}>
                  <Row justify="center">
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      style={{ marginRight: "20px" }}
                      onClick={getFilterContractRenter}
                      htmlType="submit"
                    >
                      Tìm kiếm
                    </Button>
                    <Button icon={<UndoOutlined />} onClick={resetForm}>
                      Đặt lại
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </div>
      <Table
        bordered
        dataSource={dataSource}
        scroll={{ x: 1500 }}
        columns={[
          {
            title: "Tên khách thuê",
            dataIndex: "list_renter",
            render: (list_renter) => {
              return list_renter?.find((obj, index) => obj?.represent === true)?.renter_full_name;
            },
          },
          {
            title: "Số điện thoại",
            dataIndex: "list_renter",
            render: (list_renter) => {
              return list_renter?.find((obj, index) => obj?.represent === true)?.phone_number;
            },
          },
          {
            title: "Tên chung cư",
            dataIndex: "group_name",
          },
          {
            title: "Phòng",
            dataIndex: "room",
            filteredValue: [textSearch],
            render: (room) => room.room_name,
            onFilter: (value, record) => {
              return (
                String(record.room.room_name).toLowerCase()?.includes(value.toLowerCase().trim()) ||
                String(record.list_renter.find((obj, index) => obj?.represent === true)?.renter_full_name)
                  .toLowerCase()
                  ?.includes(value.toLowerCase().trim()) ||
                String(record.list_renter.find((obj, index) => obj?.represent === true)?.phone_number)
                  .toLowerCase()
                  ?.includes(value.toLowerCase().trim())
              );
            },
          },

          {
            title: "Số tiền cọc",
            dataIndex: "contract_deposit",
            render: (value) => {
              return value.toLocaleString("vn") + " đ";
            },
          },
          {
            title: "Tiền phòng",
            dataIndex: "contract_price",
            render: (value) => {
              return value.toLocaleString("vn") + " đ";
            },
          },
          {
            title: "Ngày lập hợp đồng",
            dataIndex: "contract_start_date",
            render: (date) => getFullDate(date),
          },
          {
            title: "Ngày kết thúc",
            dataIndex: "contract_end_date",
            render: (date) => getFullDate(date),
          },

          {
            title: "Trạng thái hợp đồng",
            dataIndex: "contractIsDisable",
            render: (_, record) => {
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
            },
          },
          {
            title: "Thao tác",
            dataIndex: "action",
            render: (_, record) => {
              return record.contract_is_disable === true ? (
                <>
                  <Tooltip title="Xem chi tiết">
                    <EyeOutlined
                      className="icon"
                      onClick={() => {
                        apartmentGroupById(record.group_id);
                        setViewContract(true);
                        setContractInfor(record);
                        getAssetRoom(record.room_id);
                      }}
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Xem chi tiết">
                    <EyeOutlined
                      className="icon"
                      onClick={() => {
                        apartmentGroupById(record.group_id);
                        setViewContract(true);
                        setContractInfor(record);
                        getAssetRoom(record.room_id);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa hợp đồng">
                    <EditOutlined
                      className="icon"
                      onClick={() => {
                        navigate("/contract-renter/edit", { state: record });
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
                        apartmentGroupById(record.group_id);
                        setDeleteContract(true);
                        setContractInfor(record);
                        getInvoiceByRoomId(record.room_id);
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
      <ViewContractRenter
        openView={viewContract}
        closeView={setViewContract}
        dataContract={contractInfor}
        dataAsset={assetRoom}
        dataService={dataApartmentServiceGeneral}
        assetType={listAssetType}
      />
      <DeleteContractRenter
        reload={reload}
        openView={deleteContract}
        closeView={setDeleteContract}
        dataContract={contractInfor}
        dataInvoice={getInvoiceData.filter((invoice) => invoice.is_paid === false)}
      />
    </div>
  );
};

export default ListContractRenter;
