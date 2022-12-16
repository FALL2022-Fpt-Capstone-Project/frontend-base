import React, { useEffect, useState } from "react";
import { Col, Input, Row, Table, Tooltip, Select, Tag, ConfigProvider } from "antd";
import { InboxOutlined, AccountBookOutlined, ProfileOutlined } from "@ant-design/icons";

import axios from "../../api/axios";
import CreatePayment from "./CreatePayment";

const LIST_BUILDING_FILTER = "manager/group/all";
const ListPayment = () => {
  let cookie = localStorage.getItem("Cookie");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const [building, setBuilding] = useState(null);

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
  const options = [];

  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].group_id,
    });
  }
  const buildingChange = (value, option) => {
    setBuilding(value);
    // setPaymentCycle(0);
    console.log(value);
  };
  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <InboxOutlined style={{ fontSize: 70 }} />
      <p style={{ fontSize: 20 }}>Vui lòng lựa chọn chung cư để hiển thị dữ liệu hoá đơn chi</p>
    </div>
  );
  return (
    <div className="list-invoice">
      <div className="list-invoice-search">
        <Row>
          <Col xs={24} lg={4}>
            <Row>
              <h4>Chọn chung cư để xem hoá đơn chi</h4>
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
              // filteredValue: [textSearch],
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
              // render: (_, record) => {
              //   return (
              //     <>
              //       <Tooltip title="Xem lịch sử hoá đơn">
              //         <AccountBookOutlined className="icon" onClick={() => onClickHistoryInvoice(record.room_id)} />
              //       </Tooltip>
              //       <Tooltip title="Tạo hoá đơn">
              //         <ProfileOutlined className="icon" onClick={() => onClickCreateInvoice(record.room_id)} />
              //       </Tooltip>
              //     </>
              //   );
              // },
            },
          ]}
          loading={loading}
        />
      </ConfigProvider>
      {/* <CreatePayment visible={true} /> */}
    </div>
  );
};

export default ListPayment;
