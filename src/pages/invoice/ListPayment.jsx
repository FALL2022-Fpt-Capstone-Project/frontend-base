import React, { useEffect, useState } from "react";
import {
  Col,
  DatePicker,
  Row,
  Table,
  Tooltip,
  Select,
  Tag,
  ConfigProvider,
  Popconfirm,
  Button,
  Modal,
  notification,
} from "antd";
import { InboxOutlined, DeleteOutlined, PlusCircleOutlined, EyeOutlined } from "@ant-design/icons";

import axios from "../../api/axios";
import CreatePayment from "./CreatePayment";
import { Link } from "react-router-dom";

const LIST_BUILDING_FILTER = "manager/group/all";
const ListPayment = () => {
  let cookie = localStorage.getItem("Cookie");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [building, setBuilding] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createPaymentInvoice, setCreatePaymentInvoice] = useState(false);
  const [groupName, setGroupName] = useState();
  const [flag, setFlag] = useState(false);
  const onClickCreatePaymentInvoice = () => {
    setCreatePaymentInvoice(true);
  };
  const getListInvoice = async () => {
    setLoading(true);
    const response = await axios
      .get(`manager/bill/money-source/out?groupId=${building}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setDataSource(res.data.data);
        setGroupName(res.data.data[0].group_name);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };
  useEffect(() => {
    console.log(building);
    getListInvoice();
  }, [building]);
  useEffect(() => {
    if (flag) {
      getListInvoice();
    }
  }, [flag]);
  useEffect(() => {
    const getBuildingFilter = async () => {
      const response = await axios
        .get(LIST_BUILDING_FILTER, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setBuildingFilter(res.data.data.list_group_contracted);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getBuildingFilter();
  }, [cookie]);

  const onDeletePaymentInvoice = async (e) => {
    let cookie = localStorage.getItem("Cookie");
    await axios
      .delete(`manager/bill/money-source/out/delete/${e.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Xóa hoá đơn thành công",
          placement: "top",
          duration: 3,
        });
        getListInvoice();
      })
      .catch((error) => {
        notification.error({
          message: "Xóa hoá đơn thất bại",
          placement: "top",
          duration: 3,
        });
      });
  };
  const options = [];

  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].group_id,
    });
  }
  const buildingChange = (value) => {
    setBuilding(value);
  };
  console.log(building);
  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <InboxOutlined style={{ fontSize: 70 }} />
      <p style={{ fontSize: 20 }}>Vui lòng lựa chọn chung cư để hiển thị dữ liệu hoá đơn chi</p>
    </div>
  );
  const getFullDate = (date) => {
    const dateAndTime = date.split(" ");

    return dateAndTime[0].split("-").reverse().join("-");
  };
  return (
    <div className="list-invoice">
      <div className="list-invoice-search">
        <Row>
          <Col xs={24} lg={5}>
            <Row>
              <h4>Chọn chung cư để xem hoá đơn chi</h4>
            </Row>
            <Row>
              <Select
                options={options}
                placeholder="Chọn chung cư"
                onChange={buildingChange}
                className="add-auto-filter"
              ></Select>
            </Row>
          </Col>
          <Col xs={24} lg={5}>
            <Row>
              <h4>Tìm kiếm hoá đơn theo thời gian</h4>
            </Row>
            <Row>
              <DatePicker picker="month" placeholder="Chọn thời gian" format={"MM/YYYY"} />
            </Row>
          </Col>
          <Col xs={24} lg={4} offset={10} style={{ marginTop: "15px" }}>
            <Button
              disabled={building === null ? true : false}
              type="primary"
              icon={<PlusCircleOutlined />}
              size="middle"
              className="button-add"
              onClick={onClickCreatePaymentInvoice}
            >
              Tạo mới hoá đơn chi
            </Button>
          </Col>
        </Row>
      </div>
      <ConfigProvider renderEmpty={customizeRenderEmpty}>
        <Table
          bordered
          dataSource={dataSource}
          scroll={{
            x: 700,
          }}
          columns={[
            {
              title: "Tên chung cư",
              dataIndex: "group_name",
            },
            {
              title: "Tổng tiền thuê chung cư",
              dataIndex: "room_group_money",
              render: (value) => {
                return value.toLocaleString("vn") + " đ";
              },
            },
            {
              title: "Tổng tiền dịch vụ",
              dataIndex: "service_money",
              render: (value) => {
                return value.toLocaleString("vn") + " đ";
              },
            },
            {
              title: "Số tiền khác",
              dataIndex: "other_money",
              render: (value) => {
                return value.toLocaleString("vn") + " đ";
              },
            },
            {
              title: "Ngày lập hoá đơn",
              dataIndex: "time",
              render: (date) => getFullDate(date),
            },
            {
              title: "Tổng cộng",
              dataIndex: "total_money",
              render: (value) => {
                return value?.toLocaleString("vn") + " đ";
              },
            },
            {
              title: "Thao tác",
              dataIndex: "action",
              render: (_, record) => {
                return (
                  <>
                    <Tooltip title="Xoá hoá đơn">
                      <DeleteOutlined
                        className="icon icon-delete"
                        style={{ color: "red" }}
                        onClick={() => {
                          const data = record;
                          Modal.confirm({
                            title: `Bạn có chắc chắn muốn xóa hoá đơn này?`,
                            okText: "Có",
                            cancelText: "Hủy",
                            onOk: () => {
                              return onDeletePaymentInvoice(data);
                            },
                          });
                        }}
                      />
                    </Tooltip>
                  </>
                );
              },
            },
          ]}
          loading={loading}
        />
      </ConfigProvider>
      <CreatePayment
        visible={createPaymentInvoice}
        close={setCreatePaymentInvoice}
        groupName={groupName}
        groupId={building}
        setFlag={setFlag}
      />
    </div>
  );
};

export default ListPayment;
