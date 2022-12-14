import { Col, Input, Row, Table, Tooltip, Select, Tag, ConfigProvider, Button, notification } from "antd";
import React, { useEffect, useState } from "react";
import { InboxOutlined, AccountBookOutlined, ProfileOutlined, PlusCircleOutlined } from "@ant-design/icons";
import "./listInvoice.scss";
import axios from "../../api/axios";
import ListHistoryInvoice from "./ListHistoryInvoice";
import CreateInvoice from "./CreateInvoice";
import { Link } from "react-router-dom";
import moment from "moment";
const { Search } = Input;
const LIST_BUILDING_FILTER = "manager/group/all";
const ListInvoice = () => {
  const [historyInvoice, setHistoryInvoice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createInvoice, setCreateInvoice] = useState(false);
  const [building, setBuilding] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [id, setId] = useState();
  const onClickCreateInvoice = (id) => {
    setCreateInvoice(true);
    setId(id);
  };
  const onClickHistoryInvoice = (id) => {
    setHistoryInvoice(true);
    setId(id);
  };
  const options = [];

  let cookie = localStorage.getItem("Cookie");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [flag, setFlag] = useState(false);
  const [paymentCycle, setPaymentCycle] = useState(new Date().getDate() < 16 ? 15 : 30);
  const getListInvoice = async () => {
    setLoading(true);
    const response = await axios
      .get(`manager/bill/room/list`, {
        params: {
          groupId: building,
          paymentCycle: paymentCycle,
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
        notification.error({
          message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
          duration: 3,
          placement: "top",
        });
      });
    setLoading(false);
  };
  useEffect(() => {
    getListInvoice();
  }, [building, paymentCycle]);
  useEffect(() => {
    if (flag) {
      getListInvoice();
    }
  }, [flag]);
  useEffect(() => {
    const getBuildingFilter = async () => {
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
    };
    getBuildingFilter();
  }, [cookie]);
  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].group_id,
    });
  }
  const optionPayment = [
    {
      label: "Tất cả các kỳ",
      value: 0,
    },
    {
      label: "Kỳ 15",
      value: 15,
    },
    {
      label: "Kỳ 30",
      value: 30,
    },
  ];
  const paymentCycleChange = (value) => {
    setPaymentCycle(value);
  };
  const buildingChange = (value, option) => {
    setBuilding(value);
  };
  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <InboxOutlined style={{ fontSize: 70 }} />
      <p style={{ fontSize: 20 }}>Vui lòng lựa chọn chung cư để hiển thị dữ liệu hoá đơn thu</p>
    </div>
  );
  return (
    <div className="list-invoice">
      <div className="list-invoice-search">
        <Row>
          <Col xs={24} lg={5}>
            <Row>
              <h4>Chọn chung cư để xem hoá đơn thu</h4>
            </Row>
            <Row>
              <Select
                defaultValue={""}
                placeholder="Chọn chung cư"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.trim().toLowerCase())
                }
                style={{ width: "100%", marginBottom: "5%" }}
                onChange={buildingChange}
                className="add-auto-filter"
              >
                <Select.Option value="">Tất cả chung cư</Select.Option>
                {options?.map((obj, index) => {
                  return (
                    <>
                      <Select.Option value={obj.value}>{obj.label}</Select.Option>
                    </>
                  );
                })}
              </Select>
            </Row>
          </Col>
          <Col xs={24} lg={5} offset={1}>
            <Row>
              <h4>Lựa chọn kỳ thanh toán</h4>
            </Row>
            <Row>
              <Select
                defaultValue={paymentCycle}
                options={optionPayment}
                placeholder="Chọn kỳ thanh toán"
                onChange={paymentCycleChange}
                className="add-auto-filter"
              ></Select>
            </Row>
          </Col>
          <Col xs={24} lg={5} offset={1}>
            <Row>
              <h4>Tìm kiếm theo tên phòng</h4>
            </Row>
            <Row>
              <Search
                placeholder="Tìm kiếm theo tên phòng"
                style={{ width: 300 }}
                onSearch={(value) => {
                  setTextSearch(value);
                }}
                onChange={(e) => {
                  setTextSearch(e.target.value);
                }}
              />
            </Row>
          </Col>
          <Col xs={24} lg={4} offset={3} style={{ marginTop: "15px" }}>
            <Link to="/invoice/create-invoice-auto">
              <Button type="primary" icon={<PlusCircleOutlined />} size="middle" className="button-add">
                Tạo mới nhanh hoá đơn thu
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
      <ConfigProvider renderEmpty={customizeRenderEmpty}>
        <Table
          bordered
          dataSource={dataSource}
          scroll={{
            x: 700,
          }}
          columns={[
            {
              title: "Tên chung cư",
              dataIndex: "group_name",
              key: "Tên chung cư",
            },
            {
              title: "Tên phòng",
              dataIndex: "room_name",
              filteredValue: [textSearch],
              onFilter: (value, record) => {
                return String(record.room_name).toLowerCase()?.includes(value.toLowerCase().trim());
              },
              key: "Tên phòng",
            },
            {
              title: "Chu kỳ thanh toán",
              dataIndex: "payment_circle",
              key: "Chu kỳ thanh toán",
            },
            {
              title: "Số điện",
              dataIndex: "current_electric_index",
              key: "Số điện",
            },

            {
              title: "Số nước",
              dataIndex: "current_water_index",
              key: "Số nước",
            },

            {
              title: "Tiền phòng",
              dataIndex: "room_price",
              render: (value) => {
                return value.toLocaleString("vn") + " đ";
              },
              key: "Tiền phòng",
            },
            {
              title: "Trạng thái hoá đơn",
              dataIndex: "is_all_paid",
              key: "Trạng thái hoá đơn",

              render: (_, record) => {
                let status;
                if (record.is_all_paid === false) {
                  status = (
                    <Tag color="red" key={record.is_all_paid}>
                      Chưa thanh toán hết hoá đơn
                    </Tag>
                  );
                } else if (record.is_all_paid === true) {
                  status = (
                    <Tag color="green" key={record.is_all_paid}>
                      Đã thanh toán hết hoá đơn
                    </Tag>
                  );
                }
                return <>{status}</>;
              },
            },
            {
              title: "Thao tác",
              dataIndex: "action",
              key: "Thao tác",

              render: (_, record) => {
                return (
                  <>
                    <Tooltip title="Xem lịch sử hoá đơn">
                      <AccountBookOutlined className="icon" onClick={() => onClickHistoryInvoice(record.room_id)} />
                    </Tooltip>
                    <Tooltip title="Tạo hoá đơn">
                      <ProfileOutlined className="icon" onClick={() => onClickCreateInvoice(record.room_id)} />
                    </Tooltip>
                  </>
                );
              },
            },
          ]}
          loading={loading}
        />
      </ConfigProvider>

      <CreateInvoice visible={createInvoice} close={setCreateInvoice} id={id} setFlag={setFlag} />
      <ListHistoryInvoice visible={historyInvoice} close={setHistoryInvoice} roomId={id} setFlag={setFlag} />
    </div>
  );
};

export default ListInvoice;
