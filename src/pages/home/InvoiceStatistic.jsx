import { Col, DatePicker, Divider, Row, Select, Statistic, Table, Tag } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { DollarOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
const GET_ROOM_HISTORY = "manager/statistical/bill/list-room-billed";

const InvoiceStatistic = ({ dataGroup }) => {
  let cookie = localStorage.getItem("Cookie");
  const [groupSelect, setGroupSelect] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const columns = [
    {
      title: "Tên chung cư",
      dataIndex: "group_name",
      key: "room_id",
    },
    {
      title: "Tên phòng",
      dataIndex: "room_name",
      key: "room_id",
    },
    {
      title: "Ngày tạo hóa đơn",
      dataIndex: "created_time",
      key: "room_id",
    },
    {
      title: "Hạn đóng tiền",
      dataIndex: "payment_term",
      key: "room_id",
    },
    {
      title: "Số tiền cần thu",
      dataIndex: "need_to_paid",
      key: "room_id",
      render: (need_to_paid) => {
        return <Tag color='red'>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(need_to_paid)}</Tag>
      }
    },
  ];
  useEffect(() => {
    getBillByGroupId();
  }, []);

  const getBillByGroupId = async (groupId = null, createdTime = null) => {
    setLoadingInvoice(true);
    await axios
      .get(GET_ROOM_HISTORY, {
        params: {
          createdTime: createdTime,
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
    setLoadingInvoice(false);
  };
  return (
    <>
      <Row justify="center">
        <p className="header-statistic">Thống kê hóa đơn chưa thanh toán</p>
      </Row>
      <Row gutter={[16]}>
        <Col span={12}>
          <Row>
            <Statistic
              title={
                <>
                  <span className="revenue-statistic">Tổng số tiền cần thu</span>
                </>
              }
              value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(dataSource?.map(invoice => invoice.need_to_paid).reduce((pre, current) => pre + current, 0))}
              valueStyle={{
                color: "#cf1322",
              }}
              prefix={<DollarOutlined />}
            />
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Statistic
              title={
                <>
                  <span className="revenue-statistic">Tổng số hóa đơn chưa thanh toán</span>
                </>
              }
              value={dataSource?.length}
              valueStyle={{
                color: "#cf1322",
              }}
            />
          </Row>
        </Col>
      </Row>
      <Divider />
      <Row>
        <p className='statistic-time-title'>Chọn chung cư:</p>
      </Row>
      <Row>
        <Col span={24}>
          <Select
            defaultValue={""}
            placeholder="Chọn chung cư"
            className='select-w-100'
            options={[...dataGroup?.map(group => {
              return { label: group.group_name, value: group.group_id }
            }), {
              label: 'Tất cả chung cư',
              value: ""
            },]}
            onChange={(e) => {
              console.log(e);
              setGroupSelect(e);
              getBillByGroupId(e, null);
            }}
          />
        </Col>
      </Row>

      {/* <Row>
        <p className='statistic-time-title'>Tổng số hóa đơn chưa thanh toán: <b style={{ color: 'red' }}>{dataSource?.length}</b></p>
      </Row>
      <Row>
        <p className='statistic-time-title'>Tổng số tiền cần thu: <b style={{ color: 'red' }}>
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(dataSource?.map(invoice => invoice.need_to_paid).reduce((pre, current) => pre + current, 0))}</b></p>
      </Row> */}
      <Row>
        <Col span={24}>
          <span className="statistic-time-title">Chọn tháng/năm để thống kê: </span>
          <DatePicker
            defaultValue={moment()}
            placeholder="Chọn thời gian"
            className="date-picker"
            size={"large"}
            picker="month" format={'MM/YYYY'}
            onChange={(e) => {
              getBillByGroupId(groupSelect, e.format("MM-YYYY"))
            }}
          />
        </Col>
      </Row>
      <Table
        bordered
        scroll={{ x: 1200, y: 600 }}
        columns={columns}
        loading={loadingInvoice}
        dataSource={dataSource}
        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
      />
    </>
  )
};

export default InvoiceStatistic;
