import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Table,
  Tabs,
  Tooltip,
  DatePicker,
  Select,
  Tag,
  Checkbox,
  Modal,
  ConfigProvider,
} from "antd";
import React, { useEffect, useState } from "react";
import { InboxOutlined, AccountBookOutlined, ProfileOutlined } from "@ant-design/icons";
import "./listInvoice.scss";
import axios from "../../api/axios";
import ListHistoryInvoice from "./ListHistoryInvoice";
import CreateInvoice from "./CreateInvoice";

const { RangePicker } = DatePicker;
const LIST_BUILDING_FILTER = "manager/contract/group";
const ListInvoice = () => {
  const [isModalHistoryOpen, setIsModalHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createInvoice, setCreateInvoice] = useState(false);
  const [building, setBuilding] = useState(null);
  const onClickCreateInvoice = () => {
    setCreateInvoice(true);
  };
  const options = [];
  const option = [
    {
      value: "15",
      label: "Kỳ 15",
    },
    {
      value: "30",
      label: "Kỳ 30",
    },
  ];
  const plainOptions = ["Đã thanh toán hết", "Chưa thanh toán hết"];
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const showModalHistory = () => {
    setIsModalHistoryOpen(true);
  };
  const [form] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    const getListInvoice = async () => {
      setLoading(true);
      const response = await axios
        .get(`manager/bill/room/list/${building}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setDataSource(res.data.data);
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };
    getListInvoice();
  }, [cookie, building]);
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
          setBuildingFilter(res.data.data);
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getBuildingFilter();
  }, [cookie]);
  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].contract_id,
    });
  }
  const buildingChange = (value, option) => {
    setBuilding(value);
    console.log(value);
  };
  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <InboxOutlined style={{ fontSize: 70 }} />
      <p style={{ fontSize: 20 }}>Không có dữ liệu để hiển thị</p>
    </div>
  );
  return (
    <div className="list-invoice">
      <div className="list-invoice-search">
        <Row>
          <Col xs={24} lg={4}>
            <Row>
              <h4>Chọn chung cư để xem hoá đơn</h4>
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
          <Col>
            <Row>
              <h4>Tìm kiếm theo trạng thái hoá đơn</h4>
            </Row>
            <Row>
              <Checkbox.Group options={plainOptions} />
            </Row>
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
              title: "Tên phòng",
              dataIndex: "room_name",
            },
            {
              title: "Người đại diện",
              dataIndex: "represent_renter_name",
            },
            {
              title: "Chu kỳ thanh toán",
              dataIndex: "payment_circle",
            },
            {
              title: "Số điện",
              dataIndex: "current_electric_index",
            },

            {
              title: "Số nước",
              dataIndex: "current_water_index",
            },

            {
              title: "Tiền phòng",
              dataIndex: "room_price",
              render: (value) => {
                return value.toLocaleString("vn") + " đ";
              },
            },
            {
              title: "Trạng thái hoá đơn",
              dataIndex: "is_all_paid",
              render: (_, record) => {
                let status;
                if (record.is_all_paid === "Chưa thanh toán hết hoá đơn") {
                  status = (
                    <Tag color="red" key={record.is_all_paid}>
                      Chưa thanh toán hết hoá đơn
                    </Tag>
                  );
                } else if (record.is_all_paid === "Đã thanh toán hết hoá đơn") {
                  status = (
                    <Tag color="green" key={record.is_all_paid}>
                      Đã thanh toán hết hoá đơn
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
                    <Tooltip title="Xem lịch sử hoá đơn">
                      <AccountBookOutlined className="icon" onClick={showModalHistory} />
                    </Tooltip>
                    <Tooltip title="Tạo hoá đơn">
                      <ProfileOutlined className="icon" onClick={onClickCreateInvoice} />
                    </Tooltip>
                  </>
                );
              },
            },
          ]}
          loading={loading}
        />
      </ConfigProvider>
      <Modal
        title="Lịch sử hoá đơn phòng 101"
        // style={{ maxwidth: 900 }}
        width={1300}
        visible={isModalHistoryOpen}
        onOk={() => setIsModalHistoryOpen(false)}
        onCancel={() => setIsModalHistoryOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalHistoryOpen(false)}>
            Quay lại
          </Button>,
        ]}
      >
        <ListHistoryInvoice />
      </Modal>
      <CreateInvoice visible={createInvoice} close={setCreateInvoice} />
    </div>
  );
};

export default ListInvoice;
