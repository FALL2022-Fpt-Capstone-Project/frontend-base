import React, { useEffect, useState } from "react";
import { Button, Card, Col, DatePicker, Divider, Row, Select, Statistic } from "antd";
import { FallOutlined, RiseOutlined, ArrowDownOutlined, ArrowUpOutlined, DollarOutlined } from "@ant-design/icons";
import "./home.scss";
import RevenueStatistic from "./RevenueStatistic";
import InvoiceStatistic from "./InvoiceStatistic";
import MainLayout from "../../components/layout/MainLayout";
import locale from 'antd/es/date-picker/locale/vi_VN';
import ContractRentalStatistic from "./ContractRentalStatistic";
import ContractSubRentalStatistic from "./ContractSubRentalStatistic";
import axios from "../../api/axios";
const APARTMENT_DATA_GROUP = "/manager/group/all";
const ROOM_CONTRACT_COMMING_END = "manager/contract";
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
  const [loadingSubRental, setLoadingSubRental] = useState(false);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [loadingRental, setLoadingRental] = useState(false);
  const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  const [contractComingEnd, setContractComingEnd] = useState([]);
  const [duration, setDuration] = useState(1);

  let cookie = localStorage.getItem("Cookie");

  useEffect(() => {
    apartmentGroup();
    getComingEnd();
  }, []);

  const apartmentGroup = async () => {
    setLoadingRevenue(true);
    await axios
      .get(APARTMENT_DATA_GROUP, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        const mergeGroup = res.data.data.list_group_non_contracted.concat(res.data.data.list_group_contracted);
        const mapped = mergeGroup?.map((obj, index) => obj.group_id);
        const filterGroupId = mergeGroup?.filter((obj, index) => mapped.indexOf(obj.group_id) === index);
        setDataApartmentGroup(filterGroupId);
        console.log(filterGroupId);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoadingRevenue(false);
  };

  const getComingEnd = async (duration = 1) => {
    // console.log(duration);
    setLoadingSubRental(true);
    await axios
      .get(ROOM_CONTRACT_COMMING_END, {
        params: {
          status: 1,
          duration: duration,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setContractComingEnd(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoadingSubRental(false);
  };

  return (
    <div className="home">
      <MainLayout title="Trang chủ">
        <Row gutter={[16]}>
          <Col span={24}>
            <Card bordered className="card">
              <Row>
                <Col span={24}>
                  <RevenueStatistic loading={loadingRevenue} data={dataApartmentGroup} />
                </Col>
              </Row>
              <Divider />
              <Row gutter={[16]}>
                <Col xs={12} lg={8} xl={8} span={8}>
                  <Row justify="center">
                    <Statistic
                      title={
                        <>
                          <span className="revenue-statistic">Tổng thu</span>
                        </>
                      }
                      value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(10000000000)}
                      valueStyle={{
                        color: "#8bc34a",
                      }}
                      prefix={<RiseOutlined />}
                    />
                  </Row>
                </Col>
                <Col xs={12} lg={8} xl={8} span={8}>
                  <Row justify="center">
                    <Statistic
                      title={
                        <>
                          <span className="revenue-statistic">Tổng chi</span>
                        </>
                      }
                      value={
                        dataApartmentGroup?.map(group => {
                          return group.list_rooms?.filter(obj => Number.parseInt(obj.group_contract_id))?.map(room => room.room_price).reduce((pre, current) => pre + current, 0)
                        })?.reduce((a, b) => a + b, 0)
                      }
                      valueStyle={{
                        color: "#cf1322",
                      }}
                      prefix={<FallOutlined />}
                    />
                  </Row>
                </Col>
                <Col xs={12} lg={8} xl={8} span={8}>
                  <Row justify="center">
                    <Statistic
                      title={
                        <>
                          <span className="revenue-statistic">Lợi nhuận</span>
                        </>
                      }
                      value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(10000000000)}
                      valueStyle={{
                        color: "#03a9f4",
                      }}
                      prefix={<DollarOutlined />}
                    />
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16]}>
          <Col xs={24} xl={12} span={12}>
            <Card bordered className="card card-height-100">
              <ContractRentalStatistic loading={loadingRental} data={[]} dataGroup={dataApartmentGroup} />
              <span>
                <p>
                  <i>Thống kê hợp đồng cho thuê sắp kết thúc trong
                    <b>{" "}{duration < 12
                      ? duration + ' tháng'
                      : duration % 12 !== 0 ?
                        Math.floor(duration / 12) + ' năm ' + duration % 12 + ' tháng' :
                        Math.floor(duration / 12) + ' năm '} tới
                    </b>
                  </i>
                </p>
                <p><i>Thay đổi thời gian thống kê</i></p>
                <Select
                  defaultValue={1}
                  style={{ width: '300px' }}
                  placeholder="Chọn thời gian thống kê"
                  options={durationOption}
                  onChange={(e) => {

                  }}
                />
              </span>
            </Card>
          </Col>
          <Col xs={24} xl={12} span={12}>
            <Card bordered className="card card-height-100">
              <ContractSubRentalStatistic loading={loadingSubRental} data={contractComingEnd} dataGroup={dataApartmentGroup} />
              <span>
                <p>
                  <i>Thống kê hợp đồng cho thuê sắp kết thúc trong
                    <b>{" "}{duration < 12
                      ? duration + ' tháng'
                      : duration % 12 !== 0 ?
                        Math.floor(duration / 12) + ' năm ' + duration % 12 + ' tháng' :
                        Math.floor(duration / 12) + ' năm '} tới
                    </b>
                  </i>
                </p>
                <p><i>Thay đổi thời gian thống kê</i></p>
                <Select
                  defaultValue={1}
                  style={{ width: '300px' }}
                  placeholder="Chọn thời gian thống kê"
                  options={durationOption}
                  onChange={(e) => {
                    setDuration(e);
                    getComingEnd(e);
                  }}
                />
              </span>
            </Card>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Card bordered className="card">
              <InvoiceStatistic dataGroup={dataApartmentGroup} />
            </Card>
          </Col>
        </Row>
      </MainLayout>
    </div>
  );
};

export default Home;
