import { Button, Col, Form, Row, Table, Tooltip, Tag, Modal, Popconfirm, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { DollarCircleOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import "./listHistoryInvoice.scss";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
const ListHistoryInvoice = ({ visible, close, roomId, setFlag }) => {
  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState();
  const [dateFilter, setDateFilter] = useState("");
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");
  const [dataSource, setDataSource] = useState([]);

  const getListInvoice = async () => {
    setLoading(true);
    const response = await axios
      .get(`manager/bill/room/history/${roomId}`, {
        params: {
          time: dateFilter,
        },
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
    if (visible) {
      console.log(dateFilter);
      getListInvoice();
    } else {
      setDateFilter("");
    }
  }, [visible, dateFilter]);

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
        setFlag(true);

        setTimeout(() => {
          setFlag(false);
        }, "500");
      })
      .catch((error) => {
        console.log(error);
      });
    // setFlag(false);

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
    // setFlag(false);

    setLoading(false);
  };

  const getFullDate = (date) => {
    const dateAndTime = date.split(" ");

    return dateAndTime[0].split("-").reverse().join("-");
  };
  const dateFilterChange = (date, dateString) => {
    let [month1, year1] = dateString.split("-");
    let date1 = `${year1}-${month1}`;
    setDateFilter(date1);
  };
  return (
    <div className="list-history-invoice">
      <Modal
        title={<h2>L???ch s??? ho?? ????n ph??ng {roomName}</h2>}
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
              ????ng
            </Button>
          </>,
        ]}
      >
        <div className="list-history-invoice-search">
          <Row>
            <Col xs={24} lg={6}>
              <Row>
                <h4>T??m ki???m ho?? ????n theo th???i gian t???o</h4>
              </Row>
              <Row>
                <DatePicker
                  picker="month"
                  placeholder="Ch???n th???i gian"
                  format={"MM-YYYY"}
                  onChange={dateFilterChange}
                />
              </Row>
            </Col>
          </Row>
        </div>

        <Table
          bordered
          dataSource={dataSource}
          scroll={{
            x: 700,
          }}
          columns={[
            {
              title: "T??n ph??ng",
              dataIndex: "room_name",
            },

            {
              title: "Ng??y t???o ho?? ????n",
              dataIndex: "bill_created_time",
              render: (date) => getFullDate(date),
            },

            {
              title: "H???n ????ng ti???n",
              dataIndex: "payment_term",
              render: (date) => getFullDate(date),
            },

            {
              title: "T???ng ti???n",
              dataIndex: "total_money",
              render: (value) => {
                return value.toLocaleString("vn") + " ??";
              },
            },
            {
              title: "Ghi ch??",
              dataIndex: "description",
            },
            {
              title: "Tr???ng th??i ho?? ????n",
              dataIndex: "status",
              render: (_, record) => {
                let status;
                if (record.is_paid === false) {
                  status = (
                    <Tag color="red" key={record.is_paid}>
                      Ch??a thanh to??n
                    </Tag>
                  );
                } else if (record.is_paid === true) {
                  status = (
                    <Tag color="green" key={record.is_paid}>
                      ???? thanh to??n
                    </Tag>
                  );
                }

                return <>{status}</>;
              },
            },

            {
              title: "Thao t??c",
              dataIndex: "action",
              render: (_, record) => {
                return (
                  <>
                    {record.is_paid === true ? (
                      <>
                        <Tooltip title="Xem ho?? ????n">
                          <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            to={`/detail-invoice/${record.id}`}
                            onClick={() => localStorage.setItem("invoice_id", `${record.id}`)}
                          >
                            <EyeOutlined className="icon" />
                          </Link>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Xem ho?? ????n">
                          <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            to={`/detail-invoice/${record.id}`}
                            onClick={() => localStorage.setItem("invoice_id", `${record.id}`)}
                          >
                            <EyeOutlined className="icon" />
                          </Link>
                        </Tooltip>
                        <Tooltip title="Thu ti???n">
                          <Popconfirm
                            title="B???n c?? mu???n thanh to??n ho?? ????n n??y kh??ng?"
                            okText="?????ng ??"
                            cancelText="Kh??ng"
                            placement="topRight"
                            onConfirm={() => handlerPayInvoice(record.id)}
                          >
                            <DollarCircleOutlined className="icon" />
                          </Popconfirm>
                        </Tooltip>
                        <Tooltip title="Xo?? ho?? ????n">
                          <Popconfirm
                            title="B???n c?? mu???n xo?? ho?? ????n n??y kh??ng?"
                            okText="?????ng ??"
                            cancelText="Kh??ng"
                            placement="topRight"
                            onConfirm={() => handlerDeleteInvoice(record.id)}
                          >
                            <DeleteOutlined className="icon icon-delete" />
                          </Popconfirm>
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
