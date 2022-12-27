import React, { useContext, useEffect, useRef, useState } from "react";
import { Table, Input, Button, Form, Select, Row, Col, notification, Modal, InputNumber, Card } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, inputType, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  const inputNode =
    inputType === "number" ? (
      <InputNumber min={1} style={{ width: "100%" }} ref={inputRef} onPressEnter={save} onBlur={save} />
    ) : (
      <Input ref={inputRef} onPressEnter={save} onBlur={save} />
    );
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `Vui lòng nhập ${title.toLowerCase()}`,
          },
        ]}
      >
        {inputNode}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const ADD_ROOM = "manager/room/add";
const LIST_ASSET_TYPE_URL = "manager/asset/type";
const LIST_ASSET_URL = "manager/asset/";

function PreviewAddAsset({ visible, close, dataRoom }) {
  const navigate = useNavigate();
  const [listAssetName, setListAssetName] = useState([]);
  const [listAssetTypeName, setListAssetTypeName] = useState([]);
  const [assetDefaultSelect, setAssetDefaultSelect] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  let cookie = localStorage.getItem("Cookie");

  const [formAddRoom] = Form.useForm();
  useEffect(() => {
    formAddRoom.setFieldsValue({
      list_additional_asset: [],
    });
  }, []);

  useEffect(() => {
    const getListAssetTypeBasic = async () => {
      await axios
        .get(LIST_ASSET_TYPE_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setListAssetTypeName(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getListAssetTypeBasic();
  }, []);

  useEffect(() => {
    const getListAssetBasic = async () => {
      await axios
        .get(LIST_ASSET_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setListAssetName(data);
          setSelectedRowKeys(data.map((obj) => obj.basic_asset_id));
          setAssetDefaultSelect(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getListAssetBasic();
  }, []);
  const assetCollumn = [
    {
      title: "Tên tài sản",
      dataIndex: "basic_asset_name",
      key: "basic_asset_id",
      width: "40%",
      editable: true,
    },
    {
      title: "Số lượng",
      dataIndex: "asset_quantity",
      key: "basic_asset_id",
      width: "30%",
      editable: true,
    },
    {
      title: "Nhóm tài sản",
      dataIndex: "asset_type_show_name",
      key: "basic_asset_id",
      width: "30%",
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columnAsset = assetCollumn.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        inputType: col.dataIndex === "asset_quantity" ? "number" : "text",
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleSave = (row) => {
    const newData = [...listAssetName];
    const index = newData.findIndex((item) => row.basic_asset_id === item.basic_asset_id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setListAssetName(newData);
  };

  const rowSelectionAsset = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setAssetDefaultSelect(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const onFinishPreview = async (e) => {
    const list_asset = listAssetName
      ?.filter((obj) => assetDefaultSelect.find((o) => o.basic_asset_id === obj.basic_asset_id))
      ?.map((asset) => {
        return {
          asset_quantity: Number.parseInt(asset.asset_quantity),
          asset_name: asset.basic_asset_name,
          asset_type_id: asset.asset_type_id,
        };
      });

    const data = dataRoom?.map((room) => {
      return {
        room_name: room.room_name,
        room_floor: room.room_floor,
        room_limit_people: room.room_limit_people,
        contract_id: null,
        group_contract_id: null,
        group_id: room.group_id,
        room_price: room.room_price,
        room_area: room.room_area,
        is_old: false,
        room_asset: list_asset.concat(e.list_additional_asset),
      };
    });
    await axios
      .post(ADD_ROOM, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Thêm mới thành công phòng ",
          placement: "top",
          duration: 3,
        });
        navigate("/room");
      })
      .catch((error) => {
        notification.error({
          message: "Thêm mới phòng thất bại",
          description: error.response.data.data,
          placement: "top",
          duration: 3,
        });
      });
  };

  const onFinishPreviewFail = (e) => {
    notification.error({
      message: "Thêm mới phòng thất bại",
      description: "Vui lòng kiểm tra lại thông tin",
      placement: "top",
      duration: 3,
    });
  };
  return (
    <Modal
      title={<h2>Tài sản mặc định cho tất cả các phòng</h2>}
      open={visible}
      onOk={() => {
        close(false);
      }}
      onCancel={() => {
        close(false);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            close(false);
          }}
        >
          Đóng
        </Button>,
        <Button htmlType="submit" type="primary" form="formAddRoom">
          Tạo mới phòng đã chọn
        </Button>,
      ]}
      width={650}
    >
      <Form
        form={formAddRoom}
        onFinish={onFinishPreview}
        onFinishFailed={onFinishPreviewFail}
        layout="horizontal"
        size={"default"}
        id="formAddRoom"
      >
        <Row>
          <Col span={24}>
            <Card className="card">
              <Table
                components={components}
                rowClassName={() => "editable-row"}
                rowKey={(record) => record.basic_asset_id}
                columns={columnAsset}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelectionAsset,
                }}
                dataSource={listAssetName.sort((a, b) => a.basic_asset_id - b.basic_asset_id)}
              />
              <Form.List name="list_additional_asset">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "asset_name"]}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message: "Vui lòng nhập tên tài sản, hoặc xoá trường này",
                              },
                            ]}
                          >
                            <Input placeholder="Tên tài sản" />
                          </Form.Item>
                        </Col>
                        <Col span={4} offset={1}>
                          <Form.Item
                            {...restField}
                            name={[name, "asset_quantity"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập số lượng lớn hơn 0",
                              },
                              {
                                pattern: new RegExp(/^[0-9]*$/),
                                message: "Vui lòng nhập số nguyên",
                              },
                            ]}
                          >
                            <InputNumber placeholder="Số lượng" style={{ width: "100%" }} min={1} />
                          </Form.Item>
                        </Col>
                        <Col span={8} offset={1}>
                          <Form.Item
                            {...restField}
                            name={[name, "asset_type_id"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn nhóm tài sản!",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Nhóm tài sản"
                              style={{
                                width: "100%",
                              }}
                            >
                              {listAssetTypeName?.map((obj, index) => {
                                return (
                                  <>
                                    <Select.Option key={index} value={obj.id}>
                                      {obj.asset_type_show_name}
                                    </Select.Option>
                                  </>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={1} offset={1}>
                          <DeleteOutlined
                            style={{
                              color: "red",
                            }}
                            className="dynamic-delete-button"
                            onClick={() => remove(name)}
                          />
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Thêm tài sản mới
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default PreviewAddAsset;
