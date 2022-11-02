import React, { useEffect, useState } from "react";
import { Input, Table, DatePicker, Select, Button, Row, Col, Checkbox, Tag, Tabs, Slider, InputNumber } from "antd";
import "./listContract.scss";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import { DeleteOutlined, EditOutlined, SearchOutlined, EyeOutlined, UndoOutlined } from "@ant-design/icons";
import ViewContractRenter from "./ViewContractRenter";
import { useNavigate } from "react-router-dom";
const { Search } = Input;
const LIST_CONTRACT_URL = "manager/contract/get-contract/1";
const FILTER_CONTRACT_URL = "manager/contract/get-contract/1";
const { Option } = Select;
const { RangePicker } = DatePicker;

const ListContractRenter = () => {
  const GET_CONTRACT = "manager/contract/get-contract/rooms/";
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contractName, setContractName] = useState("");
  const [renterName, setRenterName] = useState("");
  const [endContract, setEndContract] = useState(false);
  const [duration, setDuration] = useState();
  const [price, setPrice] = useState({ min: 0, max: 1000000 });
  const [loading, setLoading] = useState(false);
  const [viewContract, setViewContract] = useState(false);
  const [contractId, setContractId] = useState();
  const [contractInfor, setContractInfor] = useState([]);

  const { auth } = useAuth();
  const navigate = useNavigate();

  let cookie = localStorage.getItem("Cookie");
  useEffect(() => {
    getAllContract();
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
        setDataSource(res.data.body);
        console.log(res);
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

  const dateChange = (value, dateString) => {
    let [day1, month1, year1] = dateString[0].split("-");
    let startDate = `${year1}-${month1}-${day1}`;
    let [day2, month2, year2] = dateString[1].split("-");
    let endDate = `${year2}-${month2}-${day2}`;
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const getFilterContract = async () => {
    // setLoading(true);
    // const response = await axios
    //   .get(FILTER_CONTRACT_URL, {
    //     params: { duration: duration },
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${cookie}`,
    //     },
    //   })
    //   .then((res) => {
    //     setDataSource(res.data.body);
    //     console.log(res);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // setLoading(false);
    console.log(filterContract);
  };

  const durationChange = (value) => {
    setDuration(value);
  };

  const filterContract = {
    contract_name: contractName,
    renter_name: renterName,
    endContract: endContract,
    startDate: startDate,
    endDate: endDate,
    price: price.min,
  };

  const onChange = (value) => {
    if (value[0] < value[1]) {
      setPrice({ min: value[0], max: value[1] });
    }
  };

  const onChangeMin = (value) => {
    if (price.max > value) {
      setPrice({ min: value });
    }
  };
  const onChangeMax = (value) => {
    if (price.min < value) {
      setPrice({ max: value });
    }
  };
  console.log(price);
  const renterNameChange = (e) => {
    setRenterName(e.target.value);
  };
  const endContractChange = (e) => {
    setEndContract(e.target.checked);
  };

  // useEffect(() => {
  //   getContractById();
  // }, []);

  const getContractById = async (contractId) => {
    let cookie = localStorage.getItem("Cookie");
    await axios
      .get(GET_CONTRACT + contractId, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        setContractInfor(res.data.body);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="list-contract">
      <div className="list-contract-search">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tìm kiếm nâng cao" key="1">
            <Row gutter={[16, 32]} style={{ marginBottom: "20px" }}>
              <Col className="gutter-row" span={6} style={{ marginBottom: "30px" }}>
                <Row>
                  <label htmlFor="" style={{ marginBottom: "10px" }}>
                    Tìm kiếm theo tiền phòng
                  </label>
                </Row>
                <Row>
                  <Slider
                    className="slider-main-div"
                    min={0}
                    max={10000000}
                    onChange={onChange}
                    range
                    defaultValue={[price.min, price.max]}
                    value={[price.min, price.max]}
                    style={{ width: "80%" }}
                    trackStyle={[{ color: "red" }]}
                  />
                </Row>
                <Row>
                  <InputNumber
                    className="min-input-main"
                    min={0}
                    max={10000000}
                    value={price.min}
                    onChange={onChangeMin}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  />
                  <span className="range-span"> - </span>
                  <InputNumber
                    className="min-input-main"
                    min={0}
                    max={10000000}
                    value={price.max}
                    onChange={onChangeMax}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  />
                </Row>
              </Col>
              <Col className="gutter-row" span={6}>
                <Row>
                  <label htmlFor="" style={{ marginBottom: "10px" }}>
                    Tìm kiếm theo tên khách thuê
                  </label>
                </Row>
                <Row>
                  <Input placeholder="Nhập tên khách thuê" onChange={renterNameChange} />
                </Row>
              </Col>

              <Col className="gutter-row" span={8} style={{ marginBottom: "30px" }}>
                <Row>
                  <label htmlFor="" style={{ marginBottom: "10px" }}>
                    Tìm kiếm theo thời gian hợp đồng
                  </label>
                </Row>
                <Row>
                  <RangePicker
                    format={"DD-MM-YYYY"}
                    placeholder={["Từ", "Đến"]}
                    onChange={dateChange}
                    style={{ marginRight: "50px" }}
                  />
                  <Checkbox onChange={endContractChange}>Hợp đồng đã kết thúc</Checkbox>
                </Row>
              </Col>
            </Row>
            <Row style={{ marginBottom: "20px" }}>
              <Col offset={10}>
                <Row>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    style={{ marginRight: "20px" }}
                    onClick={getFilterContract}
                  >
                    Tìm kiếm
                  </Button>
                  <Button icon={<UndoOutlined />}>Đặt lại</Button>
                </Row>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tìm kiếm nhanh" key="2">
            <Search
              placeholder="Tìm kiếm theo tên hợp đồng, tên khách thuê"
              style={{ marginBottom: 8, width: 400, padding: "10px 0" }}
              onSearch={(value) => {
                setTextSearch(value);
              }}
              onChange={(e) => {
                setTextSearch(e.target.value);
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <Table
        bordered
        dataSource={dataSource}
        columns={[
          // {
          //   title: 'STT',
          //   key: 'index',
          //   render: (text, record, index) => index,
          // },
          {
            title: "Tên hợp đồng",
            dataIndex: "contract_name",
            filteredValue: [textSearch],
            onFilter: (value, record) => {
              return (
                String(record.contract_name).toLowerCase()?.includes(value.toLowerCase()) ||
                String(record.renter_name).toLowerCase()?.includes(value.toLowerCase())
              );
            },
          },
          {
            title: "Tên khách thuê",
            dataIndex: "renter_name",
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
            dataIndex: "contract_is_disable",
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
              return (
                <>
                  <EditOutlined
                    style={{ fontSize: "20px", marginRight: "10px" }}
                    onClick={() => {
                      navigate(`/contract-renter/edit/${record.contract_id}`);
                    }}
                  />
                  <EyeOutlined
                    style={{ fontSize: "20px" }}
                    onClick={() => {
                      setViewContract(true);
                      // setContractId(record.contract_id);
                      getContractById(record.contract_id);
                    }}
                  />
                </>
              );
            },
          },
        ]}
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
      <ViewContractRenter openView={viewContract} closeView={setViewContract} dataContract={contractInfor} />
    </div>
  );
};

export default ListContractRenter;
