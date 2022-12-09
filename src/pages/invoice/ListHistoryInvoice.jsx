import { Button, Col, Form, Input, Row, Table, Tooltip, Tag, Modal } from "antd";
import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  SearchOutlined,
  DollarCircleOutlined,
  EyeOutlined,
  UndoOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./listHistoryInvoice.scss";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
const ListHistoryInvoice = ({ visible, close, roomId, setFlag }) => {
  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState();

  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");
  const [dataSource, setDataSource] = useState([]);

  const getListInvoice = async () => {
    setLoading(true);
    const response = await axios
      .get(`manager/bill/room/history/${roomId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataSource(res.data.data);
        setRoomName(res.data.data[0]?.room_name);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };
  useEffect(() => {
    console.log(roomId);
    getListInvoice();
  }, [roomId]);

  const handlerPayInvoice = async (id) => {
    setLoading(true);
    let cookie = localStorage.getItem("Cookie");

    const response = await axios
      .put(`manager/bill/room/pay/${id}`, null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        getListInvoice();
        console.log(res);
        setFlag(true);

        setTimeout(() => {
          setFlag(false);
        }, "500");
      })
      .catch((error) => {
        console.log(error);
      });
    setFlag(false);

    setLoading(false);
  };

  const handlerDeleteInvoice = async (id) => {
    setLoading(true);
    const response = await axios
      .delete(`manager/bill/room/delete`, {
        params: {
          billId: id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setFlag(true);
        getListInvoice();
        setFlag(true);

        setTimeout(() => {
          setFlag(false);
        }, "500");
      })
      .catch((error) => {
        console.log(error.response.data.data);
      });
    setFlag(false);

    setLoading(false);
  };

  const getFullDate = (date) => {
    const dateAndTime = date.split(" ");

    return dateAndTime[0].split("-").reverse().join("-");
  };
  console.log(roomName);
  return (
    <div className="list-history-invoice">
      <div className="list-history-invoice-search"></div>
      <Modal
        title={<h2>Lịch sử hoá đơn phòng {roomName}</h2>}
        open={visible}
        width={1200}
        destroyOnClose={true}
        afterClose={() => form.resetFields()}
        onOk={() => {
          close(false);
        }}
        onCancel={() => {
          close(false);
        }}
        footer={[
          <>
            <Button
              key="back"
              onClick={() => {
                close(false);
              }}
            >
              Đóng
            </Button>
          </>,
        ]}
      >
        <Table
          bordered
          dataSource={dataSource}
          scroll={{
            x: 700,
          }}
          columns={[
            {
              title: "Tên phòng",
              dataIndex: "room_name",
            },

            {
              title: "Ngày tạo hoá đơn",
              dataIndex: "bill_created_time",
              render: (date) => getFullDate(date),
            },

            {
              title: "Hạn đóng tiền",
              dataIndex: "payment_term",
              render: (date) => getFullDate(date),
            },

            {
              title: "Tổng tiền",
              dataIndex: "total_money",
              render: (value) => {
                return value.toLocaleString("vn") + " đ";
              },
            },
            {
              title: "Ghi chú",
              dataIndex: "description",
            },
            {
              title: "Trạng thái hoá đơn",
              dataIndex: "status",
              render: (_, record) => {
                let status;
                if (record.is_paid === false) {
                  status = (
                    <Tag color="default" key={record.is_paid}>
                      Chưa thanh toán
                    </Tag>
                  );
                } else if (record.is_paid === true) {
                  status = (
                    <Tag color="green" key={record.is_paid}>
                      Đã thanh toán
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
                    {record.is_paid === true ? (
                      <>
                        <Tooltip title="Xem hoá đơn">
                          <Link target="_blank" to="/detail-invoice">
                            <EyeOutlined className="icon" />
                          </Link>
                        </Tooltip>
                        <Tooltip title="Xoá hoá đơn">
                          <DeleteOutlined
                            className="icon icon-delete"
                            onClick={() => handlerDeleteInvoice(record.id)}
                          />
                        </Tooltip>{" "}
                      </>
                    ) : (
                      <>
                        <Tooltip title="Xem hoá đơn">
                          <Link target="_blank" to="/detail-invoice">
                            <EyeOutlined className="icon" />
                          </Link>
                        </Tooltip>
                        <Tooltip title="Thu tiền">
                          <DollarCircleOutlined className="icon" onClick={() => handlerPayInvoice(record.id)} />
                        </Tooltip>
                        <Tooltip title="Xoá hoá đơn">
                          <DeleteOutlined
                            className="icon icon-delete"
                            onClick={() => handlerDeleteInvoice(record.id)}
                          />
                        </Tooltip>{" "}
                      </>
                    )}
                  </>
                );
              },
            },
          ]}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default ListHistoryInvoice;
