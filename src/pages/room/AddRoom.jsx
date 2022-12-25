import {
  AutoComplete,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Select,
  Table,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./room.scss";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
const ADD_ROOM = "manager/room/add";
const LIST_ASSET_URL = "manager/asset/";
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
            message: `Vui lòng nhập số lượng ${title}`,
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

function AddRoom({ reRender, visible, close, data, assetType }) {
  const [formAddRoom] = Form.useForm();
  const navigate = useNavigate();
  const [groupSelect, setGroupSelect] = useState([]);
  const [statusSelectFloor, setStatusSelectFloor] = useState(true);
  const [roomFloor, setRoomFloor] = useState([]);
  const [optionAutoComplete, setOptionAutoComplete] = useState([]);
  const [listAssetName, setListAssetName] = useState([]);
  const [assetDefaultSelect, setAssetDefaultSelect] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [value, setValue] = useState("");
  let cookie = localStorage.getItem("Cookie");

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
  useEffect(() => {
    formAddRoom.setFieldsValue({
      numberOfPeople: 3,
      list_additional_asset: [],
      roomPrice: 3000000,
      roomSquare: 25,
    });
  }, []);

  useEffect(() => {
    getListAssetBasic();
  }, []);

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
        setSelectedRowKeys(data.map((asset) => asset.basic_asset_id));
        setAssetDefaultSelect(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onFinish = async (e) => {
    const data = [
      {
        room_name: e.roomName,
        room_floor: e.roomFloor,
        room_limit_people: e.numberOfPeople,
        contract_id: null,
        group_contract_id: null,
        group_id: e.groupId,
        room_price: e.roomPrice,
        room_area: e.roomSquare,
        is_old: false,
        room_asset: listAssetName
          ?.filter((obj) => assetDefaultSelect.find((o) => o.basic_asset_id === obj.basic_asset_id))
          ?.map((asset) => {
            return {
              asset_quantity: Number.parseInt(asset.asset_quantity),
              asset_name: asset.basic_asset_name,
              asset_type_id: asset.asset_type_id,
            };
          })
          .concat(e.list_additional_asset),
      },
    ];
    // console.log(JSON.stringify(data));
    await axios
      .post(ADD_ROOM, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      })
      .then((res) => {
        notification.success({
          message: "Thêm mới thành công phòng " + e.roomName,
          placement: "top",
          duration: 5,
        });
        close(false);
        formAddRoom.resetFields();
        formAddRoom.setFieldsValue({
          numberOfPeople: 3,
          list_additional_asset: [],
        });
        setSelectedRowKeys(listAssetName.map((asset) => asset.basic_asset_id));
        setAssetDefaultSelect(listAssetName);
        reRender();
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

  const onFinishFail = (e) => {
    notification.error({
      message: "Thêm mới phòng thất bại",
      placement: "top",
      duration: 3,
    });
  };

  const onSearchAutoComplete = (searchText) => {};

  const checkDuplicate = (_, value) => {
    const check = groupSelect?.list_rooms?.find(
      (room, index) => room.room_name.trim().toUpperCase() === value.trim().toUpperCase()
    );
    if (check !== undefined) {
      return Promise.reject(new Error("Tên phòng: " + value + " đã có trong chung cư bạn chọn"));
    } else {
      return Promise.resolve(new Error("Vui lòng nhập tên phòng"));
    }
  };

  const onSelectAutoComplete = (data) => {};
  const onChangeAutoComplete = (data) => {
    setValue(data);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = assetCollumn.map((col) => {
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
      setAssetDefaultSelect(selectedRows);
    },
  };
  return (
    <>
      <Modal
        title={<h2>Thêm mới phòng</h2>}
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
            Tạo phòng
          </Button>,
        ]}
        width={1050}
      >
        <Form
          form={formAddRoom}
          onFinish={onFinish}
          onFinishFailed={onFinishFail}
          layout="horizontal"
          size={"default"}
          id="formAddRoom"
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} lg={10} xl={10} span={10}>
              <Card title="Thông tin phòng" className="card">
                <Form.Item
                  className="form-item"
                  name="groupId"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Chọn chung cư: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn chung cư",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn chung cư"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label.toLowerCase().trim() ?? "").includes(input.toLowerCase().trim())
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    onChange={(e) => {
                      setStatusSelectFloor(false);
                      let listFloor = [
                        {
                          label: "Chọn tầng",
                          value: "",
                        },
                      ];
                      setGroupSelect(data?.find((group) => group.group_id === e));
                      const totalFloor = data?.find((group) => group.group_id === e).total_floor;
                      for (let i = 1; i <= totalFloor; i++) {
                        listFloor.push({
                          label: "Tầng " + i,
                          value: i,
                        });
                      }
                      setRoomFloor(listFloor);
                      formAddRoom.setFieldsValue({ roomFloor: "", roomName: "" });
                    }}
                    options={data?.map((obj, index) => {
                      return {
                        value: obj.group_id,
                        label: obj.group_name,
                      };
                    })}
                  />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="roomFloor"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Chọn tầng: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn tầng",
                    },
                  ]}
                >
                  <Select
                    onChange={(e) => {
                      let suggestRoomName = [];
                      for (let i = 0; i <= 10; i++) {
                        if (
                          groupSelect?.list_rooms?.find((obj) => obj.room_name === (e * 100 + i).toString()) ===
                          undefined
                        )
                          suggestRoomName.push({
                            value: (e * 100 + i).toString(),
                          });
                      }
                      setOptionAutoComplete(suggestRoomName);
                    }}
                    disabled={statusSelectFloor}
                    placeholder="Chọn tầng"
                    options={roomFloor}
                  />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="roomName"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Tên phòng: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên phòng",
                    },
                    {
                      validator: checkDuplicate,
                    },
                  ]}
                >
                  <AutoComplete
                    filterOption={(inputValue, option) =>
                      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    options={optionAutoComplete}
                    onSelect={onSelectAutoComplete}
                    onChange={onChangeAutoComplete}
                    onSearch={onSearchAutoComplete}
                    placeholder="Nhập tên phòng"
                  />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="roomPrice"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Giá phòng: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập giá phòng",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập giá phòng"
                    controls={false}
                    addonAfter="VNĐ"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "100%" }}
                    min={1}
                  />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="numberOfPeople"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Số lượng người tối đa: </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số lượng",
                    },
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Vui lòng nhập số nguyên",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    addonAfter="Người"
                    style={{ width: "100%" }}
                    controls={false}
                    placeholder="Nhập số lượng người tối đa của phòng"
                  />
                </Form.Item>
                <Form.Item
                  className="form-item"
                  name="roomSquare"
                  labelCol={{ span: 24 }}
                  label={
                    <span>
                      <b>Diện tích (m2): </b>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập diện tích phòng",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    addonAfter="m2"
                    controls={false}
                    placeholder="Nhập diện tích phòng"
                  />
                </Form.Item>
              </Card>
            </Col>
            <Col xs={24} lg={14} xl={14} span={14}>
              <Card title="Tài sản mặc định" className="card">
                <Table
                  components={components}
                  rowClassName={() => "editable-row"}
                  rowKey={(record) => record.basic_asset_id}
                  columns={columns}
                  rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                  }}
                  dataSource={listAssetName?.sort((a, b) => a.basic_asset_id - b.basic_asset_id)}
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
                                  message: "Vui lòng nhập số lượng",
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
                                {assetType?.map((obj, index) => {
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
    </>
  );
}

export default AddRoom;
