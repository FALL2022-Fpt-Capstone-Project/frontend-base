import { Col, Row } from "antd";
import React from "react";
import "./detailInvoice.scss";
import { Table, Typography } from "antd";
const { Text } = Typography;
const DetailInvoice = () => {
  const columns = [
    {
      title: "Khoản thu",
      dataIndex: "name",
      width: 400,
    },
    {
      title: "Chi tiết",
      dataIndex: "borrow",
      width: 400,
    },
    {
      title: "Thành tiền",
      dataIndex: "repayment",
      width: 400,
    },
  ];
  const data = [
    {
      key: "1",
      name: "Tiền phòng",
      borrow: "30 ngày x 3,000,000 đ",
      repayment: "3,000,000 đ",
    },
    {
      key: "2",
      name: "Tiền điện",
      borrow: "600,000 đ",
      repayment: "600,000 đ",
    },
    {
      key: "3",
      name: "Tiền nước",
      borrow: "100,000 đ",
      repayment: "100,000 đ",
    },
    {
      key: "4",
      name: "Tiền rác",
      borrow: "20,000 đ",
      repayment: "20,000 đ",
    },
    {
      key: "4",
      name: "Tiền cộng thêm",
      borrow: "Lý do: covid",
      repayment: "300,000 đ",
    },
  ];
  return (
    <div className="detail-invoice">
      <div className="main-detail-invoice">
        <Row>
          <Col span={24}>
            <div className="title-invoice">
              <h1>Hoá đơn tiền phòng</h1>
              <b>Chung cư Hoàng Nam - T11/2022</b>
            </div>
            <Row>
              <Col span={5} offset={3}>
                <p>
                  Kính gửi: <b>Nguyễn Hải Phương</b>
                </p>
              </Col>
              <Col span={3} offset={3}>
                <b>Phòng: 101</b>
              </Col>
              <Col span={5} offset={3}>
                <p>
                  Số điện thoại: <b>0978693674</b>
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="table-invoice">
          <Row justify="center" align="center">
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              bordered
              summary={(pageData) => {
                let totalBorrow = 0;
                let totalRepayment = 0;
                pageData.forEach(({ borrow, repayment }) => {
                  totalBorrow += borrow;
                  totalRepayment += repayment;
                });
                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={2}>
                        <b>Tổng tiền</b>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text>4,000,000 đ</Text>
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
              Vui lòng thanh toán đúng hạn trước ngày <b>26-11-2022</b>
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
              <p>Chung cư Hoàng Nam</p>
            </Col>
            <Col span={6} offset={5}>
              <p>Nguyễn Hải Phương</p>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default DetailInvoice;
