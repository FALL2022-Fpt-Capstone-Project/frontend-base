import React, { useState, useEffect } from "react";
import "./service.scss";
import {
  Button,
  Col,
  Layout,
  Modal,
  Row,
  Table,
  Form,
  InputNumber,
  Select,
  notification,
  message,
  Tooltip,
  ConfigProvider,
} from "antd";
import { PlusCircleOutlined, EditTwoTone, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import TextArea from "antd/lib/input/TextArea";
import MainLayout from "../../components/layout/MainLayout";

const APARTMENT_DATA_GROUP = "/manager/group/all";
const GET_SERVICE_GROUP_BY_ID = "manager/service/general?groupId=";
const GET_LIST_SERVICE_BASIC = "manager/service/basics";
const ADD_NEW_SERIVCE = "manager/service/general/add";
const DELETE_SERVICE = "manager/service/general/remove/";
const UPDATE_SERVICE = "manager/service/general/update/";
const LIST_SERVICE_CACUL_METHOD = "manager/service/types";
const QUICK_ADD_SERVICE = "manager/service/general/quick-add/";

function Service(props) {
  const [loading, setLoading] = useState(false);
  const [componentSize, setComponentSize] = useState("default");
  const [addServiceGeneral, setAddServiceGeneral] = useState(false);
  const [editServiceGeneral, setEditServiceGeneral] = useState(false);
  const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  const [dataApartmentServiceGeneral, setDataApartmentServiceGeneral] = useState([]);
  const [serviceCalCuMethod, setServiceCalCuMethod] = useState([]);
  const [listServiceName, setListServiceName] = useState([]);
  const [groupIdSelect, setGroupIdSelect] = useState(null);
  const [formAddSerivce] = Form.useForm();
  const [formEditSerivce] = Form.useForm();
  let cookie = localStorage.getItem("Cookie");

  const apartmentGroupById = async (groupId) => {
    setLoading(true);
    await axios
      .get(GET_SERVICE_GROUP_BY_ID + groupId, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        // console.log(res.data.data);
        setDataApartmentServiceGeneral(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  useEffect(() => {
    apartmentGroup();
    getListServiceBasic();
    getListServiceCaculMethod();
  }, []);

  const apartmentGroup = async () => {
    setLoading(true);
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
        // apartmentGroupById(res.data.data[0].group_id);
        // selectDefault.setFieldsValue({ selectApartment: res.data.data[0].group_id });
        // setGroupIdSelect(res.data.data[0].group_id);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const getListServiceBasic = async () => {
    await axios
      .get(GET_LIST_SERVICE_BASIC, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setListServiceName(res.data.data);
        // console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getListServiceCaculMethod = async () => {
    await axios
      .get(LIST_SERVICE_CACUL_METHOD, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setServiceCalCuMethod(res.data.data);
        // console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columnServiceGeneral = [
    {
      title: "Tên dịch vụ",
      dataIndex: "service_show_name",
      key: "general_service_id",
    },
    {
      title: "Đơn giá (VNĐ)",
      dataIndex: "service_price",
      key: "general_service_id",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.service_price - b.service_price,
      render: (price) => {
        return (
          <span style={{ fontWeight: "bold" }}>
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)}
          </span>
        );
      },
    },
    {
      title: "Cách tính giá dịch vụ",
      dataIndex: "service_type_name",
      key: "general_service_id",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "general_service_id",
    },
    {
      title: "Thao tác",
      key: "general_service_id",
      render: (record) => {
        return (
          <>
            <Tooltip title="Chỉnh sửa">
              <EditTwoTone
                onClick={() => {
                  setEditServiceGeneral(true);
                  formEditSerivce.setFieldsValue({
                    general_service_id: record.general_service_id,
                    service_id: record.service_id,
                    service_show_name: record.service_show_name,
                    general_service_price: record.service_price,
                    general_service_type: record.service_type_id,
                    note: record.note,
                  });
                }}
                style={{ fontSize: "120%" }}
              />
            </Tooltip>
            <Tooltip title="Xoá">
              <DeleteOutlined
                onClick={() => {
                  const data = record;
                  Modal.confirm({
                    title: `Bạn có chắc chắn muốn xóa ${record.service_show_name} ?`,
                    okText: "Có",
                    cancelText: "Hủy",
                    onOk: () => {
                      return onDeleteService(data);
                    },
                  });
                }}
                style={{ color: "red", marginLeft: 12, fontSize: "120%" }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];
  const onClikAddService = () => {
    setAddServiceGeneral(true);
  };

  const onFinishAddService = async (e) => {
    let cookie = localStorage.getItem("Cookie");
    await axios
      .post(
        ADD_NEW_SERIVCE,
        {
          ...e,
          group_id:
            groupIdSelect,
          service_id: parseInt(e.service_id),
          contract_id: dataApartmentGroup?.find(obj => obj.group_id === groupIdSelect)?.group_contracted ? 1 : null
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        }
      )
      .then((res) => {
        setAddServiceGeneral(false);
        notification.success({
          message: "Thêm mới dịch vụ thành công",
          placement: "top",
          duration: 3,
        });
        formAddSerivce.setFieldsValue({
          contract_id: null,
          service_id: null,
          general_service_price: null,
          general_service_type: null,
          note: null,
        });
        apartmentGroupById(groupIdSelect);
      })
      .catch((error) => {
        notification.error({
          message: "Thêm mới dịch vụ thất bại",
          description: "Vui lòng kiểm tra lại thông tin dịch vụ",
          placement: "top",
          duration: 3,
        });
      });
  };
  const onFinishAddServiceFail = (e) => {
    message.error("Vui lòng kiểm tra lại thông tin");
    // notification.error({
    //     message: "Thêm mới dịch vụ thất bại",
    //     description: "Vui lòng kiểm tra lại thông tin dịch vụ",
    //     placement: 'top',
    //     duration: 3,
    // });
  };

  const onFinishEditService = async (e) => {
    let cookie = localStorage.getItem("Cookie");
    await axios
      .put(
        UPDATE_SERVICE + e.general_service_id,
        { ...e, group_id: groupIdSelect },
        {
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${cookie}`,
          },
          // withCredentials: true,
        }
      )
      .then((res) => {
        notification.success({
          message: "Cập nhật dịch vụ thành công",
          placement: "top",
          duration: 3,
        });
        apartmentGroupById(groupIdSelect);
        setEditServiceGeneral(false);
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Cập nhật dịch vụ thất bại",
          placement: "top",
          duration: 3,
        });
        setEditServiceGeneral(true);
      });
  };

  const onFinishEditServiceFail = (e) => {
    message.error("Vui lòng kiểm tra lại thông tin");
  };

  const onDeleteService = async (e) => {
    let cookie = localStorage.getItem("Cookie");
    await axios
      .delete(DELETE_SERVICE + e.general_service_id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Xóa dịch vụ thành công",
          placement: "top",
          duration: 3,
        });
        apartmentGroupById(groupIdSelect);
      })
      .catch((error) => {
        notification.error({
          message: "Xóa dịch vụ thất bại",
          placement: "top",
          duration: 3,
        });
      });
  };

  const onQuickAdd = async () => {
    let cookie = localStorage.getItem("Cookie");
    await axios
      .post(
        QUICK_ADD_SERVICE + groupIdSelect,
        {
          groupId: groupIdSelect
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        }
      )
      .then((res) => {
        notification.success({
          message: "Thêm mới nhanh dịch vụ thành công",
          placement: "top",
          duration: 3,
        });
        apartmentGroupById(groupIdSelect);
      })
      .catch((error) => {
        // console.log(error.response.data.data);
        notification.error({
          message: "Thêm mới nhanh dịch vụ thất bại",
          description: error.response.data.data,
          placement: "top",
          duration: 3,
        });
      });
  };

  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <InboxOutlined style={{ fontSize: 70 }} />
      <p style={{ fontSize: 20 }}>Vui lòng lựa chọn chung cư để hiển thị dữ liệu dịch vụ</p>
    </div>
  );

  return (

    <MainLayout title="Thiết lập dịch vụ chung">
      <Row>
        <Col span={6} offset={18}>
          Chọn chung cư để thiết lập dịch vụ
        </Col>
      </Row>
      <Row>
        <Col span={14}>
          <Button
            disabled={groupIdSelect === null ? true : false}
            type="primary"
            style={{ marginBottom: "1%", marginRight: "1%", float: "left" }}
            icon={<PlusCircleOutlined style={{ fontSize: 15 }} />}
            onClick={onQuickAdd}
          >
            Thêm mới nhanh
          </Button>
          <Button
            disabled={groupIdSelect === null ? true : false}
            type="primary"
            style={{ marginBottom: "1%", float: "left" }}
            onClick={onClikAddService}
            icon={<PlusCircleOutlined style={{ fontSize: 15 }} />}
          >
            Thêm mới
          </Button>
          {/* <Button href="/service/setting" type="primary" style={{ marginBottom: '1%', float: 'right', marginRight: '1%' }}
                                        onClick={onClickSettingService} icon={<SettingOutlined />}>
                                        Thiết lập chung
                                    </Button> */}
        </Col>
        <Col span={6} offset={4}>
          {/* <Form form={selectDefault}> */}
          {/* <Form.Item name="selectApartment"> */}
          <Select
            showSearch
            style={{
              width: "100%",
            }}
            placeholder="Tìm và chọn chung cư mini / căn hộ "
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label.toLowerCase().trim() ?? "").includes(input.toLocaleLowerCase().trim())
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
            }
            onChange={(e) => {
              apartmentGroupById(e);
              setGroupIdSelect(e);
            }}
            options={dataApartmentGroup?.map((obj, index) => {
              return { value: obj.group_id, label: obj.group_name };
            })}
          />
          {/* </Form.Item> */}
          {/* </Form> */}
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            <i>
              <b>Thêm mới nhanh: </b> các dịch vụ cơ bản (điện, nước, internet, xe) giúp việc nhập dữ liệu nhanh
              hơn
            </i>
          </p>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ConfigProvider renderEmpty={customizeRenderEmpty}>
            <Table
              bordered
              columns={columnServiceGeneral}
              loading={loading}
              dataSource={dataApartmentServiceGeneral}
              scroll={{ x: 800, y: 600 }}
            />
          </ConfigProvider>
        </Col>
      </Row>
      <Modal
        title={"Thêm dịch vụ mới chung cư "}
        visible={addServiceGeneral}
        onCancel={() => {
          setAddServiceGeneral(false);
        }}
        onOk={() => {
          setAddServiceGeneral(false);
        }}
        width={500}
        footer={[
          <Button style={{ overflow: "auto" }} htmlType="submit" key="submit" form="add-service" type="primary">
            Thêm mới
          </Button>,
          <Button
            key="back"
            onClick={() => {
              setAddServiceGeneral(false);
            }}
          >
            Huỷ
          </Button>,
        ]}
      >
        <Form
          form={formAddSerivce}
          onFinish={onFinishAddService}
          onFinishFailed={onFinishAddServiceFail}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 30 }}
          layout="horizontal"
          initialValues={{ size: componentSize }}
          size={"default"}
          id="add-service"
        >
          <Form.Item
            className="form-item"
            name="service_id"
            labelCol={{ span: 24 }}
            label={
              <span>
                <b>Tên dịch vụ: </b>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Vui lòng chọn tên dịch vụ",
              },
            ]}
          >
            <Select placeholder="Chọn dịch vụ" optionFilterProp="children">
              {listServiceName.map((obj, index) => {
                return <Select.Option value={obj.id}>{obj.service_show_name}</Select.Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            className="form-item"
            name="general_service_price"
            labelCol={{ span: 24 }}
            label={
              <span>
                <b>Đơn giá (VND): </b>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá dịch vụ",
              },
            ]}
          >
            <InputNumber
              placeholder="Nhập giá dịch vụ"
              // defaultValue={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
              min={0}
            />
          </Form.Item>
          <Form.Item
            className="form-item"
            name="general_service_type"
            labelCol={{ span: 24 }}
            label={
              <span>
                <b>Cách tính giá dịch vụ: </b>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Vui lòng chọn cách tính giá dịch vụ",
              },
            ]}
          >
            <Select placeholder="Chọn cách tính giá dịch vụ" optionFilterProp="children">
              {serviceCalCuMethod.map((obj, index) => {
                return <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            className="form-item"
            name="note"
            labelCol={{ span: 24 }}
            label={
              <span>
                <b>Ghi chú: </b>
              </span>
            }
          >
            <TextArea className="text-area" rows={5} placeholder="Ghi chú"></TextArea>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Chỉnh sửa dịch vụ cho tòa nhà"
        visible={editServiceGeneral}
        onCancel={() => {
          setEditServiceGeneral(false);
        }}
        onOk={() => {
          setEditServiceGeneral(false);
        }}
        width={500}
        footer={[
          <Button
            style={{ overflow: "auto" }}
            htmlType="submit"
            key="submit"
            form="edit-service"
            type="primary"
          >
            Lưu
          </Button>,
          <Button
            key="back"
            onClick={() => {
              setEditServiceGeneral(false);
            }}
          >
            Huỷ
          </Button>,
        ]}
      >
        <Form
          form={formEditSerivce}
          onFinish={onFinishEditService}
          onFinishFailed={onFinishEditServiceFail}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 30 }}
          layout="horizontal"
          initialValues={{ size: componentSize }}
          size={"default"}
          id="edit-service"
        >
          <Form.Item className="form-item" name="general_service_id" style={{ display: "none" }}></Form.Item>
          <Form.Item
            className="form-item"
            name="service_id"
            labelCol={{ span: 24 }}
            label={
              <span>
                <b>Tên dịch vụ: </b>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên dịch vụ",
              },
            ]}
          >
            <Select placeholder="Chọn dịch vụ" optionFilterProp="children">
              {listServiceName.map((obj, index) => {
                return <Select.Option value={obj.id}>{obj.service_show_name}</Select.Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            className="form-item"
            name="general_service_price"
            labelCol={{ span: 24 }}
            label={
              <span>
                <b>Đơn giá (VND): </b>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá dịch vụ",
              },
            ]}
          >
            <InputNumber
              defaultValue={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
              min={0}
            />
          </Form.Item>
          <Form.Item
            className="form-item"
            name="general_service_type"
            labelCol={{ span: 24 }}
            label={
              <span>
                <b>Cách tính giá dịch vụ: </b>
              </span>
            }
            rules={[
              {
                required: true,
                message: "Vui lòng chọn cách tính giá dịch vụ",
              },
            ]}
          >
            <Select placeholder="Chọn cách tính giá dịch vụ" optionFilterProp="children">
              {serviceCalCuMethod.map((obj, index) => {
                return <Select.Option value={obj.id}>{obj.service_type_name}</Select.Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            className="form-item"
            name="note"
            labelCol={{ span: 24 }}
            label={
              <span>
                <b>Ghi chú: </b>
              </span>
            }
          >
            <TextArea className="text-area" rows={5} placeholder="Ghi chú"></TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
}

export default Service;
