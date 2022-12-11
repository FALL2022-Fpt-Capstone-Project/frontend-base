import { Col, Input, Row, Table, Tooltip, Select, Tag, ConfigProvider } from "antd";
import React, { useEffect, useState } from "react";
import { InboxOutlined, AccountBookOutlined, ProfileOutlined } from "@ant-design/icons";
import "./listInvoice.scss";
import axios from "../../api/axios";
import ListHistoryInvoice from "./ListHistoryInvoice";
import CreateInvoice from "./CreateInvoice";
const { Search } = Input;
const LIST_BUILDING_FILTER = "manager/group/all";
const ListInvoice = () => {
  const [historyInvoice, setHistoryInvoice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createInvoice, setCreateInvoice] = useState(false);
  const [building, setBuilding] = useState(null);
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
  const option = [
    {
      value: "15",
      label: "Kỳ 15",
    },
    {
      value: "30",
      label: "Kỳ 30",
    },
  ];

  let cookie = localStorage.getItem("Cookie");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [flag, setFlag] = useState(false);
  const [statistic, setStatistic] = useState(false);
  const getListInvoice = async () => {
    setLoading(true);
    const response = await axios
      .get(`manager/bill/room/list/${building}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataSource(res.data.data);
        console.log(res);
        setStatistic(true);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };
  useEffect(() => {
    console.log(building);
    getListInvoice();
  }, [building]);
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
  const buildingChange = (value, option) => {
    setBuilding(value);
    console.log(value);
  };
  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <InboxOutlined style={{ fontSize: 70 }} />
      <p style={{ fontSize: 20 }}>Chọn chung cư để hiện thị dữ liệu</p>
    </div>
  );
  return (
    <div className="list-invoice">
      <div className="list-invoice-search">
        <Row>
          <Col xs={24} lg={4}>
            <Row>
              <h4>Chọn chung cư để xem hoá đơn</h4>
            </Row>
            <Row>
              <Select
                options={options}
                placeholder="Chọn chung cư"
                onChange={buildingChange}
                className="add-auto-filter"
              ></Select>
            </Row>
          </Col>
          <Col>
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
            },
            {
              title: "Tên phòng",
              dataIndex: "room_name",
              filteredValue: [textSearch],
              onFilter: (value, record) => {
                return String(record.room_name).toLowerCase()?.includes(value.toLowerCase());
              },
            },
            // {
            //   title: "Người đại diện",
            //   dataIndex: "represent_renter_name",
            //   filteredValue: [textSearch],
            //   onFilter: (value, record) => {
            //     return String(record.represent_renter_name).toLowerCase()?.includes(value.toLowerCase());
            //   },
            // },
            {
              title: "Chu kỳ thanh toán",
              dataIndex: "payment_circle",
            },
            {
              title: "Số điện",
              dataIndex: "current_electric_index",
            },

            {
              title: "Số nước",
              dataIndex: "current_water_index",
            },

            {
              title: "Tiền phòng",
              dataIndex: "room_price",
              render: (value) => {
                return value.toLocaleString("vn") + " đ";
              },
            },
            {
              title: "Trạng thái hoá đơn",
              dataIndex: "is_all_paid",
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
      {/* {dataSource?.length !== 0 ? (
        <div className="invoice-statistic">
          <Row>
            <h2 className="payment-term-alret">* Hiện tại chưa đến kỳ thanh toán</h2>
          </Row>
          <Row>
            <p>
              Tổng số hoá đơn đến kỳ thu đã lập: <span>0 hoá đơn</span>
            </p>
          </Row>
          <Row>
            <p>
              Tổng số hoá đơn đã lập trong tháng này: <span>0 hoá đơn</span>
            </p>
          </Row>
          <Row>
            <p>
              Tổng số hoá đơn chưa thanh toán trong tháng này: <span>0 hoá đơn</span>
            </p>
          </Row>
          <Row>
            <p>
              Tổng số số tiền đã thu trong tháng này: <span>0 đ</span>
            </p>
          </Row>
        </div>
      ) : (
        ""
      )} */}
      <CreateInvoice visible={createInvoice} close={setCreateInvoice} id={id} setFlag={setFlag} />
      <ListHistoryInvoice visible={historyInvoice} close={setHistoryInvoice} roomId={id} setFlag={setFlag} />
    </div>
  );
};

export default ListInvoice;
