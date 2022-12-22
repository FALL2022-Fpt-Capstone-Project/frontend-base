import {
  Form,
  Layout,
  Button,
  Row,
  Col,
  Table,
  Space,
  Modal,
  Input,
  Radio,
  notification,
  message,
  Divider,
  Card,
} from "antd";
import React, { useEffect, useState } from "react";
import "./room.scss";
import { PlusCircleOutlined, EditTwoTone, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import Breadcrumbs from "../../components/BreadCrumb ";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import MainLayout from "../../components/layout/MainLayout";
const { Content, Sider, Header } = Layout;
const GET_ALL_CONTRACT = "manager/contract";
const ADD_RENTER = "manager/renter/add";
const DELETE_RENTER = "manager/renter/remove/";
const UPDATE_RENTER = "manager/renter/update/";
const fontSizeIcon = {
  fontSize: "130%",
  marginRight: "8%",
};

function AddMemInRoom(data) {
  const { state } = useLocation();
  // const { room_id } = useParams();
  const [componentSize, setComponentSize] = useState("default");
  const [loading, setLoading] = useState(false);
  const [isEditMem, setIsEditMem] = useState(false);
  const [isAddMem, setIsAddMem] = useState(false);
  let cookie = localStorage.getItem("Cookie");
  const [contractRoom, setContractRoom] = useState([]);
  const [formEditMem] = Form.useForm();
  const [formAddMem] = Form.useForm();

  useEffect(() => {
    getAllContract();
  }, []);
  const getAllContract = async () => {
    setLoading(true);
    await axios
      .get(GET_ALL_CONTRACT, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setContractRoom(res.data.data?.find((obj, index) => obj.room_id === parseInt(state)));
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };
  // console.log(contractRoom);
  const columnsMember = [
    {
      title: "Họ và tên",
      // dataIndex: "name",
      key: "member_id",
      render: (record) => {
        return record.represent ? record.name + " (Người đại diện)" : record.name;
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "member_id",
      render: (gender) => {
        return gender ? "Nam" : "Nữ";
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "member_id",
    },
    {
      title: "CMND/CCCD",
      dataIndex: "identity_card",
      key: "member_id",
    },
    {
      title: "Biển số xe",
      dataIndex: "license_plates",
      key: "member_id",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address_more_detail",
      key: "member_id",
    },

    {
      title: "Thao tác",
      key: "member_id",
      render: (record) => (
        <Space>
          <EditTwoTone
            style={fontSizeIcon}
            onClick={() => {
              setIsEditMem(true);
              formEditMem.setFieldsValue({
                member_id: record.member_id,
                gender: record.gender,
                name: record.name,
                identity_card: record.identity_card,
                phone_number: record.phone_number,
                license_plates: record.license_plates,
                address_more_detail: record.address_more_detail,
                represent: record.represent,
              });
            }}
          />
          {/* <DeleteOutlined
                        onClick={() => onDeleteMember(record)}
                        style={{ fontSize: "120%", color: "red", marginLeft: 12 }}
                    /> */}
          {record.represent ? (
            ""
          ) : (
            <DeleteOutlined
              onClick={() => onDeleteMember(record)}
              style={{ fontSize: "130%", color: "red", marginLeft: 12 }}
            />
          )}
        </Space>
      ),
    },
  ];

  const onDeleteMember = (record) => {
    Modal.confirm({
      title: `Bạn có chắc chắn muốn xóa ${record.name} không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        // console.log(record.member_id);
        // setLoading(true);
        await axios
          .delete(DELETE_RENTER + record.member_id, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookie}`,
            },
          })
          .then((res) => {
            notification.success({
              message: "Xóa thành viên thành công",
              placement: "top",
              duration: 2,
            });
            setIsAddMem(false);
            getAllContract();
          })
          .catch((error) => {
            console.log(error);
            notification.error({
              message: "Xóa thành viên thất bại",
              placement: "top",
              duration: 2,
            });
          });
        // setLoading(false);
      },
    });
  };
  const onFinishAddMem = async (dataMem) => {
    // console.log(dataMem);
    if (contractRoom?.list_renter?.length < contractRoom?.room?.room_limit_people) {
      const data = {
        ...dataMem,
        name: dataMem.name.trim(),
        gender: dataMem.gender,
        email: "",
        phone_number: dataMem.phone_number.trim(),
        identity_card: dataMem.identity_card.trim(),
        license_plates: dataMem.license_plates,
        room_id: contractRoom?.room_id,
        address_more_detail: dataMem.address_more_detail,
        represent: false,
      };
      // setLoading(true);
      await axios
        .post(ADD_RENTER, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          notification.success({
            message: "Thêm mới thành viên thành công",
            placement: "top",
            duration: 2,
          });
          setIsAddMem(false);
          formAddMem.setFieldsValue({
            // member_id: memberId,
            name: "",
            identity_card: "",
            phone_number: "",
            license_plates: "",
            address: "",
          });
          getAllContract();
        })
        .catch((error) => {
          notification.error({
            message: "Vui lòng kiểm tra lại " + error.response.data.data,
            placement: "top",
            duration: 2,
          });
        });
      // setLoading(false);
    } else {
      notification.error({
        message: "Số lượng người trong phòng tối đa",
        placement: "top",
        duration: 2,
      });
    }
  };
  const onFinishFailAddMem = (e) => {
    notification.error({
      message: "Thêm mới thành viên thất bại",
      placement: "top",
      duration: 2,
    });
  };

  const onFinishEditMem = async (dataMem) => {
    const data = {
      ...dataMem,
      id: dataMem.member_id,
      name: dataMem.name,
      gender: dataMem.gender,
      email: "",
      phone_number: dataMem.phone_number,
      identity_card: dataMem.identity_card,
      license_plates: dataMem.license_plates,
      room_id: contractRoom?.room_id,
      address_more_detail: dataMem.address_more_detail,
      represent: dataMem.represent,
    };
    // console.log(JSON.stringify(data));
    setLoading(true);
    await axios
      .put(UPDATE_RENTER + dataMem.member_id, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Cập nhật thành viên thành công",
          placement: "top",
          duration: 2,
        });
        setIsEditMem(false);
        formEditMem.setFieldsValue({
          // member_id: memberId,
          name: "",
          identity_card: "",
          phone_number: "",
          license_plates: "",
          address: "",
        });
        getAllContract();
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Cập nhật thành viên thất bại",
          placement: "top",
          duration: 2,
        });
      });
    setLoading(false);
  };
  const onFinishFailEditMem = (e) => {
    message.error("Chỉnh sửa thành viên thất bại");
  };
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  return (
    <MainLayout title="Danh sách thành viên trong phòng">
      <Row>
        <Col span={24}>
          <Button
            href="/room"
            type="primary"
            // icon={<ArrowLeftOutlined />}
            style={{ marginRight: 5, float: "right", marginBottom: 20 }}
          >
            Quay lại quản lý phòng
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={23}>
          {/* <Form.Item className="form-item" name="list_renter" labelCol={{ span: 24 }}> */}
          <h3>
            <b>Thông tin về thành viên phòng {contractRoom?.room_name}</b> (Số lượng:{" "}
            {contractRoom?.list_renter?.length}/{contractRoom?.room?.room_limit_people})
          </h3>
          {/* </Form.Item> */}
        </Col>
        <Col span={1}>
          <PlusCircleOutlined
            style={{ fontSize: 36, marginBottom: 20, color: "#1890ff", float: "right" }}
            onClick={() => {
              setIsAddMem(true);
              formAddMem.setFieldsValue({
                gender: true,
              });
            }}
          />
        </Col>
        <Table
          style={{ width: "100%" }}
          bordered
          dataSource={contractRoom?.list_renter?.map((obj, index) => {
            return {
              member_id: obj.renter_id,
              name: obj.renter_full_name,
              gender: obj.gender,
              identity_card: obj.identity_number,
              phone_number: obj.phone_number,
              license_plates: obj.license_plates,
              address_more_detail: obj.address.address_more_details,
              represent: obj.represent,
            };
          })}
          columns={columnsMember}
          scroll={{ x: 800, y: 600 }}
          loading={loading}
        ></Table>
      </Row>

      <Modal
        title={<h2>Thêm thành viên vào phòng {contractRoom?.room_name}</h2>}
        open={isAddMem}
        onOk={() => {
          setIsAddMem(false);
        }}
        onCancel={() => {
          setIsAddMem(false);
        }}
        footer={[
          <Button key="back" onClick={() => setIsAddMem(false)}>
            Đóng
          </Button>,
          <Button htmlType="submit" key="submit" form="add-member" type="primary">
            Thêm mới
          </Button>,
        ]}
      >
        <Card className="card">
          <Form
            form={formAddMem}
            onFinish={onFinishAddMem}
            onFinishFailed={onFinishFailAddMem}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 30 }}
            layout="horizontal"
            initialValues={{ size: componentSize }}
            onValuesChange={onFormLayoutChange}
            size={"default"}
            id="add-member"
          >
            {/* <Form.Item className="form-item" name="member_id" style={{ display: "none" }}></Form.Item> */}
            <Form.Item
              className="form-item"
              name="name"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Họ và tên: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ tên thành viên",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Họ và tên"></Input>
            </Form.Item>
            <Form.Item
              className="form-item"
              name="gender"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Giới tính: </b>
                </span>
              }
            >
              <Radio.Group>
                <Radio value={true}>Nam</Radio>
                <Radio value={false}>Nữ</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              className="form-item"
              name="phone_number"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Số điện thoại: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại",
                  whitespace: true,
                },
                {
                  pattern: /^((\+84|84|0)+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                  message: "Số điện thoại phải bắt đầu (+84,0,84)",
                },
              ]}
            >
              <Input placeholder="Số điện thoại" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="identity_card"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>CMND/CCCD: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập CMND/CCCD",
                  whitespace: true,
                },
                {
                  pattern: /^([0-9]{12})\b/,
                  message: "Vui lòng nhập đúng CMND/CCCD (12 số)",
                },
              ]}
            >
              <Input placeholder="CMND/CCCD" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="license_plates"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Biển số xe: </b>
                </span>
              }
            >
              <Input placeholder="Biển số xe"></Input>
            </Form.Item>
            <Form.Item
              className="form-item"
              name="address_more_detail"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Địa chỉ chi tiết: </b>
                </span>
              }
            >
              <Input placeholder="Địa chỉ chi tiết"></Input>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <Modal
        title={<h2>Chỉnh sửa thành viên </h2>}
        open={isEditMem}
        onOk={() => {
          setIsEditMem(false);
        }}
        onCancel={() => {
          setIsEditMem(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsEditMem(false);
            }}
          >
            Đóng
          </Button>,
          <Button htmlType="submit" key="submit" form="edit-member" type="primary">
            Lưu
          </Button>,
        ]}
      >
        <Card className="card">
          <Form
            form={formEditMem}
            onFinish={onFinishEditMem}
            onFinishFailed={onFinishFailEditMem}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 30 }}
            layout="horizontal"
            initialValues={{ size: componentSize }}
            onValuesChange={onFormLayoutChange}
            size={"default"}
            id="edit-member"
          >
            <Form.Item className="form-item" name="member_id" style={{ display: "none" }}></Form.Item>
            <Form.Item className="form-item" name="represent" style={{ display: "none" }}></Form.Item>
            <Form.Item
              className="form-item"
              name="name"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Họ và tên: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ tên thành viên",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Họ và tên"></Input>
            </Form.Item>
            <Form.Item
              className="form-item"
              name="gender"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Giới tính: </b>
                </span>
              }
            >
              <Radio.Group>
                <Radio value={true}>Nam</Radio>
                <Radio value={false}>Nữ</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              className="form-item"
              name="phone_number"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Số điện thoại: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại",
                  whitespace: true,
                },
                {
                  pattern: /^((\+84|84|0)+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                  message: "Số điện thoại phải bắt đầu (+84,0,84)",
                },
              ]}
            >
              <Input placeholder="Số điện thoại" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="identity_card"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>CMND/CCCD: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập CMND/CCCD",
                  whitespace: true,
                },
                {
                  pattern: /^([0-9]{12})\b/,
                  message: "Vui lòng nhập đúng CMND/CCCD (12 số)",
                },
              ]}
            >
              <Input disabled placeholder="CMND/CCCD" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="license_plates"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Biển số xe: </b>
                </span>
              }
            >
              <Input placeholder="Biển số xe"></Input>
            </Form.Item>
            <Form.Item
              className="form-item"
              name="address_more_detail"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Địa chỉ: </b>
                </span>
              }
            >
              <Input placeholder="Địa chỉ"></Input>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </MainLayout>
  );
}

export default AddMemInRoom;
