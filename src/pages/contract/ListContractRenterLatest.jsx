import React, { useEffect, useState } from "react";
import { Input, Table, Select, DatePicker, Tag, Button, Tabs, Row, Col, Switch, Form } from "antd";
import { EyeOutlined, EditOutlined, SearchOutlined, UndoOutlined } from "@ant-design/icons";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
const { Search } = Input;
const LIST_CONTRACT_LATEST_URL = "manager/contract/get-contract/1";
const { Option } = Select;
const { RangePicker } = DatePicker;
const ListContractRenterLatest = ({ duration }) => {
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    const getAllContractLatest = async () => {
      setLoading(true);
      const response = await axios
        .get(LIST_CONTRACT_LATEST_URL, {
          params: { filter: "latest", duration: duration },
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
    getAllContractLatest();
  }, [duration]);
  const { auth } = useAuth();
  let cookie = localStorage.getItem("Cookie");

  const getFullDate = (date) => {
    const dateAndTime = date.split("T");

    return dateAndTime[0].split("-").reverse().join("-");
  };
  const resetForm = () => {
    form.resetFields();
    // setDeactive("");
    // setEndDate("");
    // setStartDate("");
    // setFullname("");
    // setRoles("");
    // setUsername("");
  };
  return (
    <div>
      <div>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tìm kiếm nâng cao" key="1">
            <Form {...formItemLayout} form={form} name="filterStaff" id="filterStaff" style={{ width: "100%" }}>
              <Row gutter={[16, 32]} style={{ marginBottom: "20px" }}>
                <Col span={8}>
                  <Form.Item name="full_name" style={{ width: "500px" }}>
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Tìm kiếm theo tên khách thuê
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập tên khách thuê" autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>

                  <Form.Item name="user_name" style={{ width: "500px" }}>
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Tìm kiếm theo số CCCD/Số điện thoại
                        </label>
                      </Row>
                      <Row>
                        <Input placeholder="Nhập số CCCD/Số điện thoại" autoComplete="off" />
                      </Row>
                    </Col>
                  </Form.Item>
                </Col>
                <Col span={8} offset={3}>
                  <Form.Item name="date" style={{ width: "500px" }}>
                    <Col className="gutter-row" span={24}>
                      <Row>
                        <label htmlFor="" style={{ marginBottom: "10px" }}>
                          Ngày bắt đầu lập hợp đồng
                        </label>
                      </Row>
                      <Row>
                        <RangePicker format={"DD-MM-YYYY"} placeholder={["Từ", "Đến"]} />
                      </Row>
                    </Col>
                  </Form.Item>
                  <Col className="gutter-row" span={24}>
                    <Row style={{ flexWrap: "nowrap", width: "700px" }}>
                      <Form.Item name="user_name" style={{ width: "500px" }}>
                        <Row>
                          <label htmlFor="" style={{ marginBottom: "10px" }}>
                            Tìm kiếm theo chung cư
                          </label>
                        </Row>
                        <Row>
                          <Select></Select>
                        </Row>
                      </Form.Item>
                    </Row>
                  </Col>
                </Col>
              </Row>
              <Row style={{ marginBottom: "20px" }}>
                <Col offset={10}>
                  <Row>
                    <Button type="primary" icon={<SearchOutlined />} style={{ marginRight: "20px" }} htmlType="submit">
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
                  <EditOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                  <EyeOutlined style={{ fontSize: "20px" }} />
                </>
              );
            },
          },
        ]}
        pagination={{ pageSize: 5 }}
        loading={loading}
      />
    </div>
  );
};

export default ListContractRenterLatest;
