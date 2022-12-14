import "./room.scss";
import { Form, Input, Select, Button, Row, Col, Table, Modal, Checkbox, notification, InputNumber, Card } from "antd";
import React, { useEffect, useState } from "react";
import { PlusCircleOutlined, EditTwoTone, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import { useLocation } from "react-router-dom";
import AddMultiEquipment from "./AddMultiEquipment";
import MainLayout from "../../components/layout/MainLayout";
const fontSizeIcon = {
  fontSize: "120%",
};
const textSize = {
  fontSize: 15,
};
const LIST_ASSET_TYPE = "manager/asset/type";
const ASSET_ROOM = "manager/asset/room/";
const ADD_ASSET = "manager/asset/room/add";
const UPDATE_ASSET = "manager/asset/room/update";
const DELETE_ASSET = "manager/asset/room/delete";

function RoomEquipment(data) {
  const { state } = useLocation();
  const dataFilter = {
    id: [],
    asset_type: [],
  };
  const [createAssetForm] = Form.useForm();
  const [editAssetForm] = Form.useForm();
  const [searched, setSearched] = useState("");
  const [filterAssetType, setFilterAssetType] = useState([]);
  const [isEditAsset, setIsEditAsset] = useState(false);
  const [listAssetType, setListAssetType] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);
  const [addAssetInRoom, setAddAssetInRoom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [componentSize, setComponentSize] = useState("default");
  const [assetRoom, setAssetRoom] = useState([]);
  const [listAssetId, setListAssetId] = useState([]);
  const [addMultiAsset, setAddMultiAsset] = useState(false);
  let cookie = localStorage.getItem("Cookie");

  useEffect(() => {
    getAssetType();
    loadDefault();
    getAssetRoom();
  }, []);

  const loadDefault = () => {
    createAssetForm.setFieldsValue({
      hand_over_asset_quantity: 1,
    });
  };

  const getAssetType = async () => {
    setLoading(true);
    await axios
      .get(LIST_ASSET_TYPE, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setListAssetType(res.data.data);
        createAssetForm.setFieldsValue({
          asset_type_show_name: res.data.data?.find(
            (obj, index) => obj.asset_type_name === "OTHER" && obj.asset_type_show_name === "Kh??c"
          )?.id,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const getAssetRoom = async () => {
    setLoading(true);
    await axios
      .get(ASSET_ROOM + state[0].room_id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        setAssetRoom(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const columns = [
    {
      title: "T??n t??i s???n",
      dataIndex: "asset_name",
      key: "asset_id",
      filteredValue: [searched],
      onFilter: (value, record) => {
        return String(record.asset_name).toLowerCase()?.includes(value.toLowerCase());
      },
    },
    {
      title: "S??? l?????ng",
      dataIndex: "hand_over_asset_quantity",
      key: "asset_id",
    },
    {
      title: "Nh??m t??i s???n",
      dataIndex: "asset_type_show_name",
      filters: [
        { text: "Ph??ng ng???", value: "Ph??ng ng???" },
        { text: "Ph??ng kh??ch", value: "Ph??ng kh??ch" },
        { text: "Ph??ng b???p", value: "Ph??ng b???p" },
        { text: "Ph??ng t???m", value: "Ph??ng t???m" },
        { text: "Kh??c", value: "Kh??c" },
      ],
      filteredValue: filterAssetType.asset_type_show_name || null,
      onFilter: (value, record) => record.asset_type_show_name.indexOf(value) === 0,
    },
    {
      title: "Thao t??c",
      key: "asset_id",
      render: (record) => {
        return (
          <>
            <EditTwoTone
              onClick={() => {
                setIsEditAsset(true);
                editAssetForm.setFieldsValue({
                  asset_id: record.asset_id,
                  asset_name: record.asset_name,
                  hand_over_asset_quantity: record.hand_over_asset_quantity,
                  asset_type_show_name: record.asset_type_id,
                });
              }}
              style={fontSizeIcon}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteAsset(record);
              }}
              style={{ color: "red", marginLeft: 12, fontSize: "120%" }}
            />
          </>
        );
      },
    },
  ];

  const onDeleteAsset = (record) => {
    Modal.confirm({
      title: `B???n c?? ch???c ch???n mu???n x??a ${record.asset_name} n??y ?`,
      okText: "C??",
      cancelText: "H???y",
      onOk: () => {
        onDeleteAssetAPI(record.asset_id, record.asset_name);
      },
    });
  };

  const onDeleteAssetAPI = async (asset_id, asset_name) => {
    await axios
      .delete(DELETE_ASSET + "?roomAssetId=" + [asset_id], {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: ` X??a ${asset_name} th??nh c??ng`,
          placement: "top",
          duration: 3,
        });
        getAssetRoom();
      })
      .catch((error) => {
        notification.error({
          message: ` X??a ${asset_name} th???t b???i`,
          placement: "top",
          duration: 3,
        });
      });
  };

  const onDeleteListAssetAPI = async () => {
    let cookie = localStorage.getItem("Cookie");
    await axios
      .delete(DELETE_ASSET + "?roomAssetId=" + listAssetId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: ` X??a t??i s???n th??nh c??ng`,
          placement: "top",
          duration: 3,
        });
        getAssetRoom();
        setListAssetId([]);
      })
      .catch((error) => {
        notification.error({
          message: ` X??a t??i s???n th???t b???i`,
          placement: "top",
          duration: 3,
        });
      });
  };

  const addAssetFinish = async (dataAsset) => {
    const data = {
      room_asset_id: null,
      asset_name: dataAsset.asset_name.trim(),
      asset_type_id: dataAsset.asset_type_show_name,
      asset_quantity: dataAsset.hand_over_asset_quantity,
      room_id: state[0].room_id,
    };
    await axios
      .post(ADD_ASSET, [data], {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Th??m m???i t??i s???n th??nh c??ng",
          placement: "top",
          duration: 2,
        });
        getAssetRoom();
        setAddAssetInRoom(false);
        createAssetForm.setFieldsValue({
          asset_name: "",
          hand_over_asset_quantity: 1,
        });
      })
      .catch((error) => {
        notification.error({
          message: "Th??m m???i t??i s???n th???t b???i",
          placement: "top",
          duration: 2,
        });
      });
  };

  const addAssetFail = (e) => {
    setAddAssetInRoom(true);
  };

  const editAssetFinish = async (dataAsset) => {
    const data = {
      room_asset_id: dataAsset.asset_id,
      asset_name: dataAsset.asset_name,
      asset_type_id: dataAsset.asset_type_show_name,
      asset_quantity: dataAsset.hand_over_asset_quantity,
      room_id: state[0].room_id,
    };
    await axios
      .put(UPDATE_ASSET, [data], {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "C???p nh???t t??i s???n th??nh c??ng",
          placement: "top",
          duration: 3,
        });
        setIsEditAsset(false);
        getAssetRoom();
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Th??m m???i t??i s???n th???t b???i",
          placement: "top",
          duration: 3,
        });
      });
  };

  const editAssetFail = (e) => {
    setIsEditAsset(true);
    notification.error({
      message: "C???p nh???t t??i s???n th???t b???i",
      placement: "top",
      duration: 2,
    });
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListAssetId(selectedRows.map((asset) => asset.asset_id));
    },
  };
  const reloadData = () => {
    getAssetType();
    loadDefault();
    getAssetRoom();
  };
  return (
    <MainLayout title="Trang thi???t b??? trong ph??ng">
      <Row>
        <Col span={24}>
          <Button
            href="/room"
            type="primary"
            size="default"
            style={{ marginBottom: "1%", marginLeft: "1%", float: "right" }}
          >
            Quay l???i qu???n l?? ph??ng
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item className="form-item" name="list_hand_over_assets" labelCol={{ span: 24 }}>
            <p>
              <h3>
                <b>Danh s??ch trang thi???t b??? trong ph??ng {state[0].roomName}</b>
              </h3>
            </p>
          </Form.Item>
          <Row>
            <Col>
              <Input.Search
                placeholder="Nh???p t??n t??i s???n ????? t??m ki???m"
                style={{ marginBottom: 8, width: 400 }}
                onSearch={(e) => {
                  setSearched(e);
                }}
                onChange={(e) => {
                  setSearched(e.target.value);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} xl={16} span={16}>
              <Row>
                <FilterOutlined style={{ fontSize: "150%" }} />
                <b>Nh??m t??i s???n: </b>
                <Checkbox.Group
                  style={{ paddingLeft: "1%" }}
                  options={listAssetType?.map((obj, index) => {
                    return obj.asset_type_show_name;
                  })}
                  onChange={(checkedValues) => {
                    dataFilter.asset_type_show_name = checkedValues;
                    setFilterAssetType(dataFilter);
                  }}
                ></Checkbox.Group>
              </Row>
            </Col>
            <Col xs={12} xl={8} span={8}>
              <Button
                style={{ marginBottom: "2%", float: "right" }}
                onClick={() => {
                  setAddAssetInRoom(true);
                }}
                type="primary"
                icon={<PlusCircleOutlined style={textSize} />}
              >
                Th??m m???i t??i s???n
              </Button>
              <Button
                onClick={() => {
                  setAddMultiAsset(true);
                }}
                type="primary"
                style={{ marginBottom: "2%", marginRight: "2%", float: "right" }}
                icon={<PlusCircleOutlined style={textSize} />}
              >
                Th??m nhi???u t??i s???n
              </Button>
            </Col>
          </Row>
          <Row>
            <Table
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              rowKey={(record) => record.asset_id}
              bordered
              onChange={(pagination, filters, sorter, extra) => {
                setFilterAssetType(filters);
                setAssetStatus(filters);
              }}
              dataSource={assetRoom?.map((asset) => {
                return {
                  asset_id: asset.room_asset_id,
                  asset_name: asset.asset_name,
                  hand_over_asset_quantity: asset.asset_quantity,
                  asset_type_show_name: listAssetType?.find((a) => a?.id === asset?.asset_type_id)
                    ?.asset_type_show_name,
                  asset_type_id: listAssetType?.find((a) => a?.id === asset?.asset_type_id)?.id,
                };
              })}
              columns={columns}
              scroll={{ x: 800, y: 600 }}
              loading={loading}
            />
          </Row>
        </Col>
      </Row>
      <Row>
        <p>T???ng s??? t??i s???n ???? ch???n: {listAssetId?.length}</p>
      </Row>
      <Button
        disabled={listAssetId.length === 0 ? true : false}
        onClick={() => {
          Modal.confirm({
            title: `B???n c?? ch???c ch???n mu???n x??a c??c ph??ng ???? ch???n ?`,
            okText: "C??",
            cancelText: "H???y",
            onOk: () => {
              onDeleteListAssetAPI();
            },
          });
        }}
        type="danger"
        icon={<DeleteOutlined style={{ fontSize: "130%", color: "white" }} />}
      >
        X??a c??c t??i s???n ???? ch???n
      </Button>
      <Modal
        title={<h2>Th??m t??i s???n m???i</h2>}
        visible={addAssetInRoom}
        onCancel={() => {
          setAddAssetInRoom(false);
        }}
        onOk={() => {
          setAddAssetInRoom(false);
        }}
        width={500}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setAddAssetInRoom(false);
            }}
          >
            ????ng
          </Button>,
          <Button htmlType="submit" key="submit" form="create-asset" type="primary">
            Th??m m???i
          </Button>,
        ]}
      >
        <Card title="Th??ng tin t??i s???n" className="card">
          <Form
            form={createAssetForm}
            onFinish={addAssetFinish}
            onFinishFailed={addAssetFail}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 30 }}
            layout="horizontal"
            initialValues={{ size: componentSize }}
            onValuesChange={onFormLayoutChange}
            size={"default"}
            id="create-asset"
          >
            <Form.Item
              className="form-item"
              name="asset_name"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>T??n t??i s???n: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui l??ng nh???p t??n t??i s???n",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="T??n t??i s???n"></Input>
            </Form.Item>
            <Form.Item
              className="form-item"
              name="hand_over_asset_quantity"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>S??? l?????ng: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui l??ng nh???p s??? l?????ng l???n h??n 0",
                },
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: "Vui l??ng nh???p s??? nguy??n",
                },
              ]}
            >
              <InputNumber placeholder="Nh???p s??? l?????ng t??i s???n" style={{ width: "100%" }} min={1} />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="asset_type_show_name"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Nh??m t??i s???n: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui l??ng ch???n nh??m t??i s???n",
                },
              ]}
            >
              <Select placeholder="Ch???n nh??m t??i s???n">
                {listAssetType?.map((obj, index) => {
                  return <Select.Option value={obj.id}>{obj.asset_type_show_name}</Select.Option>;
                })}
              </Select>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <Modal
        title={<h2>Ch???nh s???a t??i s???n trong ph??ng</h2>}
        visible={isEditAsset}
        onCancel={() => {
          setIsEditAsset(false);
        }}
        onOk={() => {
          setIsEditAsset(false);
        }}
        width={500}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsEditAsset(false);
            }}
          >
            ????ng
          </Button>,
          <Button htmlType="submit" key="submit" form="edit-asset" type="primary">
            L??u
          </Button>,
        ]}
      >
        <Card title="Th??ng tin t??i s???n" className="card">
          <Form
            form={editAssetForm}
            onFinish={editAssetFinish}
            onFinishFailed={editAssetFail}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 30 }}
            layout="horizontal"
            initialValues={{ size: componentSize }}
            onValuesChange={onFormLayoutChange}
            size={"default"}
            id="edit-asset"
          >
            <Form.Item name="asset_id" style={{ display: "none" }}></Form.Item>
            <Form.Item
              className="form-item"
              name="asset_name"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>T??n t??i s???n: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui l??ng nh???p t??n t??i s???n",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="T??n t??i s???n"></Input>
            </Form.Item>
            <Form.Item
              className="form-item"
              name="hand_over_asset_quantity"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>S??? l?????ng: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui l??ng nh???p s??? l?????ng l??n h??n 0",
                },
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: "Vui l??ng nh???p s??? nguy??n",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
            <Form.Item
              className="form-item"
              name="asset_type_show_name"
              labelCol={{ span: 24 }}
              label={
                <span>
                  <b>Nh??m t??i s???n: </b>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui l??ng ch???n nh??m t??i s???n",
                },
              ]}
            >
              <Select placeholder={"Nh??m t??i s???n"}>
                {listAssetType?.map((obj, index) => {
                  return <Select.Option value={obj.id}>{obj.asset_type_show_name}</Select.Option>;
                })}
              </Select>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <AddMultiEquipment
        reload={reloadData}
        openView={addMultiAsset}
        closeView={setAddMultiAsset}
        assetTypeList={listAssetType}
        roomId={state[0].room_id}
      />
    </MainLayout>
  );
}

export default RoomEquipment;
