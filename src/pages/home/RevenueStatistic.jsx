import { Col, DatePicker, Divider, Row, Statistic, Table, Tag } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./home.scss";

const RevenueStatistic = ({ loading, data }) => {
  let cookie = localStorage.getItem("Cookie");

  const columns = [
    {
      title: "Tên chung cư",
      dataIndex: "group_name",
      key: "group_id",
    },
    {
      title: "Số phòng đi thuê",
      key: "group_id",
      render: (record) => {
        return (
          record?.list_rooms?.filter((group) => Number.isInteger(group?.group_contract_id)).length +
          " / " +
          record?.list_rooms?.length
        );
      },
    },
    {
      title: "Số phòng đã cho thuê lại",
      key: "group_id",
      render: (record) => {
        return (
          <>
            {record?.list_rooms?.filter(
              (group) => Number.isInteger(group?.group_contract_id) && Number.isInteger(group?.contract_id)
            )?.length +
              " / " +
              record?.list_rooms?.filter((group) => Number.isInteger(group?.group_contract_id))?.length}
          </>
        );
      },
    },
    {
      title: "Số tiền thu",
      key: "group_id",
      render: (record) => {
        return (
          <>
            <span>
              {record.group_contracted
                ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    data?.billGroup
                      ?.filter((bill) => bill.group_id === record.group_id && bill.is_paid === true)
                      ?.map((obj) => obj.total_money)
                      ?.reduce((pre, current) => pre + current, 0)
                  )
                : 0 + "đ"}
            </span>
          </>
        );
      },
    },
    {
      title: "Số tiền chi",
      key: "group_id",
      render: (record) => {
        return (
          <>
            <span>
              {record.group_contracted
                ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    record?.list_room_lease_contracted
                      ?.map((contract) => contract.contract_price)
                      ?.reduce((pre, current) => pre + current, 0)
                  )
                : 0 + "đ"}
            </span>
          </>
        );
      },
    },
    {
      title: "Lợi nhuận",
      key: "group_id",
      render: (record) => {
        return (
          <>
            <Tag
              color={
                data?.billGroup
                  ?.filter((bill) => bill.group_id === record.group_id && bill.is_paid === true)
                  ?.map((obj) => obj.total_money)
                  ?.reduce((pre, current) => pre + current, 0) -
                  record?.list_room_lease_contracted
                    ?.map((contract) => contract.contract_price)
                    ?.reduce((pre, current) => pre + current, 0) >
                0
                  ? "green"
                  : "red"
              }
            >
              {record.group_contracted
                ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    data?.billGroup
                      ?.filter((bill) => bill.group_id === record.group_id && bill.is_paid === true)
                      ?.map((obj) => obj.total_money)
                      ?.reduce((pre, current) => pre + current, 0) -
                      record?.list_room_lease_contracted
                        ?.map((contract) => contract.contract_price)
                        ?.reduce((pre, current) => pre + current, 0)
                  )
                : 0 + "đ"}
            </Tag>
          </>
        );
      },
    },
  ];

  let totalRentalRoom = 0;
  totalRentalRoom = data?.group
    ?.map((group) => {
      return group?.list_rooms?.filter((group) => Number.isInteger(group?.group_contract_id))?.length;
    })
    ?.reduce((pre, current) => pre + current, 0);

  let roomEmpty = 0;
  roomEmpty =
    data?.group
      ?.map((group) => {
        return group?.list_rooms?.filter((group) => Number.isInteger(group?.group_contract_id))?.length;
      })
      ?.reduce((pre, current) => pre + current, 0) -
    data?.group
      ?.map((group) => {
        return group?.list_rooms?.filter(
          (group) => Number.isInteger(group?.group_contract_id) && Number.isInteger(group?.contract_id)
        ).length;
      })
      ?.reduce((pre, current) => pre + current, 0);

  let roomSubRental = 0;
  roomSubRental = data?.group
    ?.map((group) => {
      return group?.list_rooms?.filter(
        (group) => Number.isInteger(group?.group_contract_id) && Number.isInteger(group?.contract_id)
      )?.length;
    })
    ?.reduce((pre, current) => pre + current, 0);

  return (
    <>
      <Row justify="center">
        <span className="header-statistic">Thống kê doanh thu các chung cư</span>
      </Row>
      <Divider />
      <Row gutter={[16]}>
        <Col span={12}>
          <Row>
            <Statistic
              title={
                <>
                  <span className="revenue-statistic">Tổng số phòng đã cho thuê lại</span>
                </>
              }
              value={roomSubRental + " / " + totalRentalRoom}
              valueStyle={{
                color: "#8bc34a",
              }}
            />
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Statistic
              title={
                <>
                  <span className="revenue-statistic">Tổng số phòng còn trống</span>
                </>
              }
              value={roomEmpty + " / " + totalRentalRoom}
              valueStyle={{
                color: "#cf1322",
              }}
            />
          </Row>
        </Col>
      </Row>
      {/* <Row>
        <Col span={24}><span className="statistic-time-title">Chọn tháng/năm để thống kê: </span>
          <DatePicker defaultValue={moment()} placeholder="Chọn thời gian" className="margin-top-bottom" size={"large"} picker="month" format={'MM/YYYY'} />
        </Col>
      </Row> */}
      <Table
        className="margin-top-bottom"
        bordered
        scroll={{ x: 1200, y: 600 }}
        columns={columns}
        loading={loading}
        dataSource={data.group}
        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ["5", "10", "20"] }}
      />
    </>
  );
};

export default RevenueStatistic;
