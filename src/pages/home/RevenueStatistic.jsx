import { Col, DatePicker, Row, Table, Tag } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./home.scss";
const GET_BILL_BY_GROUP_ID = "/bill/room/bill-status";

const RevenueStatistic = ({ loading, data }) => {

  let cookie = localStorage.getItem("Cookie");
  const [getBillRoom, setGetBillGroup] = useState([]);

  const columns = [
    {
      title: "Tên chung cư",
      dataIndex: "group_name",
      key: "group_id",
    },
    {
      title: "Số phòng đã thuê",
      key: "group_id",
      render: (record) => {
        return record?.list_rooms?.filter(group => Number.isInteger(group?.group_contract_id)).length + " / " + record?.list_rooms?.length
      }
    },
    {
      title: "Số phòng đã cho thuê lại",
      key: "group_id",
      render: (record) => {
        return (
          <>
            {
              record?.list_rooms?.filter(group => Number.isInteger(group?.group_contract_id) && Number.isInteger(group?.contract_id))?.length
              + " / " + record?.list_rooms?.filter(group => Number.isInteger(group?.group_contract_id))?.length
            }
          </>
        )

      }
    },
    {
      title: "Số tiền chi",
      key: "group_id",
      render: (record) => {
        return (<>
          <span>
            {
              new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(record?.list_room_lease_contracted?.map(contract => contract.contract_price)
                ?.reduce((pre, current) => pre + current, 0))
            }
          </span>
        </>)
      }
    },
    {
      title: "Số tiền thu",
      key: "group_id",
      render: (record) => {
        return (<>
          <span>
            {
              new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(record?.list_rooms?.filter(group => Number.isInteger(group?.group_contract_id) && Number.isInteger(group?.contract_id))
                ?.map(room => room.room_price)?.reduce((pre, current) => pre + current, 0))
            }
          </span>
        </>)
      }
    },
    {
      title: "Lợi nhuận",
      key: "group_id",
      render: (record) => {
        return (<>
          <Tag color={record?.list_rooms?.filter(group => Number.isInteger(group?.group_contract_id) && Number.isInteger(group?.contract_id))
            ?.map(room => room.room_price)?.reduce((pre, current) => pre + current, 0) - record?.list_room_lease_contracted?.map(contract => contract.contract_price)
              ?.reduce((pre, current) => pre + current, 0) > 0 ? 'green' : 'red'}>
            {
              new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                record?.list_rooms?.filter(group => Number.isInteger(group?.group_contract_id) && Number.isInteger(group?.contract_id))
                  ?.map(room => room.room_price)?.reduce((pre, current) => pre + current, 0) - record?.list_room_lease_contracted?.map(contract => contract.contract_price)
                    ?.reduce((pre, current) => pre + current, 0)
              )
            }
          </Tag>
        </>)
      }
    },
  ];

  const getBillByGroupId = async (groupId) => {
    await axios
      .get(GET_BILL_BY_GROUP_ID, {
        params: {
          paymentCycle: 0,
          groupId: groupId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {

      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Row justify="center">
        <p className="header-statistic">Thống kê doanh thu các chung cư</p>
      </Row>
      <Row>
        <Col span={24}>
          <span className="statistic-time-title">Chọn tháng/năm để thống kê: </span>
          <DatePicker defaultValue={moment()} placeholder="Chọn thời gian" className="date-picker" size={"large"} picker="month" format={'MM/YYYY'} />
        </Col>
      </Row>
      <Table
        bordered
        scroll={{ x: 1200, y: 600 }}
        columns={columns}
        loading={loading}
        dataSource={data}
        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
      />
    </>
  )
};

export default RevenueStatistic;
