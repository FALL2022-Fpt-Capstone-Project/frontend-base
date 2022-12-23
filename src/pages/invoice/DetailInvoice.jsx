import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import "./detailInvoice.scss";
import { Table, Typography } from "antd";
import axios from "../../api/axios";
const { Text } = Typography;
const DetailInvoice = () => {
  const [dataSource, setDatasource] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  let cookie = localStorage.getItem("Cookie");
  let name = localStorage.getItem("name");
  let id = parseInt(localStorage.getItem("invoice_id"), 10);
  console.log(id);
  useEffect(() => {
    let dataTable = [];
    axios
      .get(`manager/bill/room/detail/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        console.log(res);
        console.log(res.data.data.service_bill);
        setData(res.data.data);
        dataTable.push(res.data.data);
        setDatasource(dataTable);
        console.log(dataTable);
        setLoading(true);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const getFullDate = (date) => {
    const dateAndTime = date.split(" ");

    return dateAndTime[0].split("-").reverse().join("-");
  };
  return (
    <div className="detail-invoice">
      {loading && (
        <div className="main-detail-invoice">
          <Row>
            <Col span={24}>
              <div className="title-invoice">
                <h1>Hoá đơn tiền phòng</h1>
                <b>
                  {data.group_name} - {data.description}
                </b>
              </div>
              <Row>
                <Col span={5} offset={3}>
                  <p>
                    Kính gửi: <b>{data.renter.renter_full_name}</b>
                  </p>
                </Col>
                <Col span={3} offset={3}>
                  <b>Phòng: {data.room_name}</b>
                </Col>
                <Col span={5} offset={3}>
                  <p>
                    Số điện thoại: <b>{data.renter.phone_number}</b>
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="table-invoice">
            <Row justify="center" align="center">
              <Table
                columns={[
                  {
                    title: "Khoản thu",
                    dataIndex: "service",
                    width: 400,
                    render: (_, services) => services.service_bill.map((service) => <p>{service.description}</p>),
                  },
                  {
                    title: "Chi tiết",
                    dataIndex: "detail",
                    width: 400,
                    render: (_, services) =>
                      services.service_bill.map((service) => (
                        <p>
                          {service.service_price.toLocaleString("vn") + " đ"} x {service.service_index}
                        </p>
                      )),
                  },
                  {
                    title: "Thành tiền",
                    dataIndex: "total",
                    width: 400,
                    render: (_, services) =>
                      services.service_bill.map((service) => (
                        <p>{service.service_bill_total_money.toLocaleString("vn") + " đ"}</p>
                      )),
                  },
                ]}
                dataSource={dataSource}
                pagination={false}
                bordered
                summary={(pageData) => {
                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={2}>
                          <b>Tiền phòng</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Text>{data.total_room_money.toLocaleString("vn") + " đ"}</Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={2}>
                          <b>Tổng tiền</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Text>{data.total_money.toLocaleString("vn") + " đ"}</Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
            </Row>
          </div>
          <div className="note">
            <Row>
              <b>Ghi chú thêm:</b>
            </Row>
            <Row>
              <p>
                Vui lòng thanh toán đúng hạn trước ngày <b>{getFullDate(data.payment_term)}</b>
              </p>
            </Row>
          </div>
          <div className="note">
            <Row>
              <Col span={6} offset={6}>
                <b>Người đại diện thu</b>
              </Col>
              <Col span={6} offset={6}>
                <b>Khách thuê</b>
              </Col>
            </Row>
            <Row>
              <Col span={6} offset={6}>
                <p>{name}</p>
              </Col>
              <Col span={6} offset={5}>
                <p>{data.renter.renter_full_name}</p>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailInvoice;
