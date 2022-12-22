import React, { useEffect, useState } from "react";
import { Card, Col, Divider, Row, Select, Statistic } from "antd";
import { FallOutlined, RiseOutlined, DollarOutlined } from "@ant-design/icons";
import "./home.scss";
import RevenueStatistic from "./RevenueStatistic";
import MainLayout from "../../components/layout/MainLayout";
import axios from "../../api/axios";
import RoomStatus from "./RoomStatus";
import ContractStatistic from "./ContractStatistic";
import moment from "moment";
const APARTMENT_DATA_GROUP = "/manager/group/all";
const GET_ROOM_HISTORY = "manager/statistical/bill/list-room-billed";

const durationOption = [];

for (let i = 1; i < 13; i++) {
  if (i < 12) {
    durationOption.push({
      label: `${i} tháng`,
      value: i,
    });
  } else {
    durationOption.push({
      label: `${i % 11} năm`,
      value: (i % 11) * 12,
    });
  }
}

const Home = () => {
  const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  const [billNotPay, setBillNotPay] = useState([]);

  let cookie = localStorage.getItem("Cookie");

  useEffect(() => {
    apartmentGroup();
    getBillNotPay();
  }, []);

  const apartmentGroup = async () => {
    await axios
      .get(APARTMENT_DATA_GROUP, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        // console.log(res.data.data);
        // const mergeGroup = res.data.data.list_group_non_contracted.concat(res.data.data.list_group_contracted);
        // const mapped = mergeGroup?.map((obj, index) => obj.group_id);
        // const filterGroupId = mergeGroup?.filter((obj, index) => mapped.indexOf(obj.group_id) === index);
        setDataApartmentGroup(res.data.data.list_group_contracted);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getBillNotPay = async (groupId = null, createdTime = moment().format('MM-YYYY')) => {
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
        setBillNotPay(res.data.data);
        // console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <div className="home">
      <MainLayout title="Trang chủ">
        <Row gutter={[16]}>
          <Col xs={12} lg={10} xl={7} span={7}>
            <Statistic
              className="statistic-style"
              title={
                <>
                  <a className="revenue-statistic" href="/invoice">Tổng số hóa đơn chưa thanh toán ({moment().format('MM/YYYY')})</a>
                </>
              }
              value={billNotPay.length}
              valueStyle={
                billNotPay.length === 0 ? { color: 'rgba(53, 162, 235)' } : { color: "#cf1322" }
              }
            />
          </Col>
          <Col xs={12} lg={10} xl={7} span={7}>
            <Statistic
              className="statistic-style"
              title={
                <>
                  <a className="revenue-statistic" href="/invoice">Tổng số tiền cần thu ({moment().format('MM/YYYY')})</a>
                </>
              }
              value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                billNotPay?.map((invoice) => invoice.need_to_paid).reduce((pre, current) => pre + current, 0)
              )}
              valueStyle={billNotPay.length === 0 ? { color: 'rgba(53, 162, 235)' } : { color: "#cf1322" }}
            />
          </Col>
        </Row>
        <Row className="margin-bottom" gutter={[16]}>
          <Col className="margin-bottom" xs={24} xl={12} span={12}>
            <Card bordered className="card card-height-100">
              <RoomStatus dataGroup={dataApartmentGroup} dataChart />
            </Card>
          </Col>
          <Col className="margin-bottom" xs={24} xl={12} span={12}>
            <Card bordered className="card card-height-100">
              <Row>
                <Col span={24}>
                  <RevenueStatistic />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row className="margin-bottom">
          <Col span={24}>
            <Card bordered className="card">
              <ContractStatistic />
            </Card>
          </Col>
        </Row>
      </MainLayout>
    </div>
  );
};

export default Home;
