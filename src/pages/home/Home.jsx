import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import "./home.scss";
import { DollarOutlined, SolutionOutlined, ProfileOutlined, HomeOutlined } from "@ant-design/icons";
import RevenueStatistic from "./RevenueStatistic";
import MainLayout from "../../components/layout/MainLayout";
import axios from "../../api/axios";
import RoomStatus from "./RoomStatus";
import ContractStatistic from "./ContractStatistic";
import moment from "moment";
const APARTMENT_DATA_GROUP = "/manager/group/all";
const GET_ROOM_HISTORY = "manager/statistical/bill/list-room-billed";
const ROOM_STATUS = "manager/statistical/room/status";
const GET_REVENUE = "manager/statistical/chart/revenue";
const GET_RENTER_CONTRACT = "manager/statistical/chart/room-contract";

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
  const [roomStatus, setRoomStatus] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [contractRenter, setContractRenter] = useState([]);

  let cookie = localStorage.getItem("Cookie");

  useEffect(() => {
    apartmentGroup();
    getBillNotPay();
    getRoomStatus();
    getRevenue();
    getContractStatistic();
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
        setDataApartmentGroup(res.data.data.list_group_contracted);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getBillNotPay = async (groupId = null, createdTime = moment().format("MM-YYYY")) => {
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRoomStatus = async (groupId = null) => {
    await axios
      .get(ROOM_STATUS, {
        params: {
          groupId: groupId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setRoomStatus(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRevenue = async (year = moment()) => {
    await axios
      .get(GET_REVENUE, {
        params: {
          year: year.format("YYYY"),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setRevenue(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getContractStatistic = async (year = moment()) => {
    await axios
      .get(GET_RENTER_CONTRACT, {
        params: {
          year: year.format("YYYY"),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setContractRenter(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="home">
      <MainLayout title="Trang chủ">
        <Row gutter={[16]}>
          <Col className="margin-bottom-statistic" xs={12} lg={12} xl={6} span={6}>
            <Statistic
              className="statistic-style"
              title={
                <>
                  <a className="revenue-statistic" href="/invoice">
                    <HomeOutlined /> Trạng thái phòng
                  </a>
                  <Row>
                    <span className="statistic-detail">
                      Tổng số phòng đã thuê:
                      <b>{" " + roomStatus?.total_rented_room}</b>
                    </span>
                  </Row>
                  <Row>
                    <span className="statistic-detail">
                      Tổng số phòng còn trống:
                      <b>{" " + roomStatus?.total_empty_room}</b>
                    </span>
                  </Row>
                </>
              }
              valueStyle={{ display: "none" }}
            />
          </Col>
          <Col className="margin-bottom-statistic" xs={12} lg={12} xl={6} span={6}>
            <Statistic
              className="statistic-style"
              title={
                <>
                  <a className="revenue-statistic" href="/invoice">
                    <ProfileOutlined /> Hóa đơn ({moment().format("MM/YYYY")})
                  </a>
                  <Row>
                    <span className="statistic-detail">
                      Tổng số hóa đơn chưa thanh toán:
                      <b>{" " + billNotPay.length}</b>
                    </span>
                  </Row>
                  <Row>
                    <span className="statistic-detail">
                      Tổng số tiền cần thu:
                      <b style={billNotPay.length === 0 ? { color: "rgb(0, 128, 0)" } : { color: "rgb(205, 92, 92)" }}>
                        {" " +
                          new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                            billNotPay
                              ?.map((invoice) => invoice.need_to_paid)
                              .reduce((pre, current) => pre + current, 0)
                          )}
                      </b>
                    </span>
                  </Row>
                </>
              }
              valueStyle={{ display: "none" }}
            />
          </Col>
          <Col className="margin-bottom-statistic" xs={12} lg={12} xl={6} span={6}>
            <Statistic
              className="statistic-style"
              title={
                <>
                  <a className="revenue-statistic" href="/invoice">
                    <DollarOutlined /> Doanh thu (VNĐ)
                  </a>
                  <Row>
                    <span className="statistic-detail">
                      Doanh thu tháng {moment().format("MM/YYYY")}:
                      <b
                        style={
                          revenue?.find((obj) => obj.month === Number.parseInt(moment().format("MM")))?.revenue < 0
                            ? { color: "#CD5C5C" }
                            : { color: "#008000" }
                        }
                      >
                        {" " +
                          new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                            revenue?.find((obj) => obj.month === Number.parseInt(moment().format("MM")))?.revenue
                          ) +
                          " "}
                      </b>
                    </span>
                  </Row>
                  <Row>
                    <span className="statistic-detail">
                      Doanh thu năm {moment().format("YYYY")}:
                      <b
                        style={
                          revenue?.map((obj) => obj.revenue)?.reduce((pre, current) => pre + current, 0) < 0
                            ? { color: "#CD5C5C" }
                            : { color: "#008000" }
                        }
                      >
                        {" " +
                          new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                            revenue?.map((obj) => obj.revenue)?.reduce((pre, current) => pre + current, 0)
                          ) +
                          " "}
                      </b>
                    </span>
                  </Row>
                </>
              }
              valueStyle={{ display: "none" }}
            />
          </Col>
          <Col className="margin-bottom-statistic" xs={12} lg={12} xl={6} span={6}>
            <Statistic
              className="statistic-style"
              title={
                <>
                  <a className="revenue-statistic" href="/invoice">
                    <SolutionOutlined /> Hợp đồng cho thuê ({moment().format("MM/YYYY")})
                  </a>
                  <Row>
                    <span className="statistic-detail">
                      Tổng số hợp đồng đã lập:
                      <b>{" " + contractRenter?.total_all_created}</b>
                    </span>
                  </Row>
                  <Row>
                    <span className="statistic-detail">
                      Tổng số hợp đồng đã kết thúc:
                      <b>{" " + contractRenter?.total_all_ended}</b>
                    </span>
                  </Row>
                </>
              }
              valueStyle={{ display: "none" }}
            />
          </Col>
        </Row>
        <Row className="margin-bottom" gutter={[16]}>
          <Col className="margin-bottom" xs={24} xl={12} span={12}>
            <Card bordered className="card card-height-100">
              <RoomStatus dataGroup={dataApartmentGroup} dataRoomStatus={roomStatus} />
            </Card>
          </Col>
          <Col className="margin-bottom" xs={24} xl={12} span={12}>
            <Card bordered className="card card-height-100">
              <Row>
                <Col span={24}>
                  <RevenueStatistic dataRevenue={revenue} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row className="margin-bottom">
          <Col span={24}>
            <Card bordered className="card">
              <ContractStatistic dataContract={contractRenter} />
            </Card>
          </Col>
        </Row>
      </MainLayout>
    </div>
  );
};

export default Home;
