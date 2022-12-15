import { Button, Card, Col, Form, Input, InputNumber, Modal, notification, Row, Select, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    DeleteOutlined, PlusOutlined
} from "@ant-design/icons";
import axios from '../../api/axios';
import "./room.scss";
const ADD_ASSET = "manager/asset/room/add";
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
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    inputType,
    ...restProps
}) => {
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
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    const inputNode = inputType === 'number' ?
        <InputNumber min={1} style={{ width: '100%' }} ref={inputRef} onPressEnter={save} onBlur={save} />
        : <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
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

function AddMultiEquipment({ reload, openView, closeView, assetTypeList, roomId }) {
    const [formMultiAsset] = Form.useForm();
    let cookie = localStorage.getItem("Cookie");
    const [listAssetName, setListAssetName] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [assetDefaultSelect, setAssetDefaultSelect] = useState([]);
    useEffect(() => {
        formMultiAsset.setFieldsValue({
            list_additional_asset: []
        });
    }, []);
    const assetCollumn = [
        {
            title: "Tên tài sản",
            dataIndex: "basic_asset_name",
            key: "basic_asset_id",
            width: '40%',
            editable: true,
        },
        {
            title: "Số lượng",
            dataIndex: 'asset_quantity',
            key: "basic_asset_id",
            width: '30%',
            editable: true,
        },
        {
            title: "Nhóm tài sản",
            dataIndex: "asset_type_show_name",
            key: "basic_asset_id",
            width: '30%',
        },
    ];
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
                    // console.log(data);
                    setListAssetName(data);
                    setSelectedRowKeys(data.map(asset => asset.basic_asset_id));
                    setAssetDefaultSelect(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        getListAssetBasic();
    }, []);

    const onFinish = async (dataAsset) => {
        const data = dataAsset?.list_additional_asset?.map(assetAdd => {
            return {
                basic_asset_name: assetAdd.asset_name,
                asset_quantity: assetAdd.asset_quantity,
                asset_type_id: assetAdd.asset_type_id
            }
        })?.concat(
            listAssetName?.filter(obj => assetDefaultSelect.find(o => o.basic_asset_id === obj.basic_asset_id))
        )?.map(asset => {
            return {
                room_asset_id: null,
                asset_name: asset.basic_asset_name.trim(),
                asset_type_id: asset.asset_type_id,
                asset_quantity: asset.asset_quantity,
                room_id: roomId,
            }
        });
        // console.log(JSON.stringify(data));
        await axios
            .post(ADD_ASSET, data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookie}`,
                },
            })
            .then((res) => {
                // console.log(res.data.data);
                notification.success({
                    message: "Thêm mới tài sản thành công",
                    placement: "top",
                    duration: 2,
                });
                formMultiAsset.resetFields();
                formMultiAsset.setFieldsValue({
                    list_additional_asset: []
                });
                setSelectedRowKeys(listAssetName.map(asset => asset.basic_asset_id));
                setAssetDefaultSelect(listAssetName);
                closeView(false);
                reload();
            })
            .catch((error) => {
                console.log(error);
                notification.error({
                    message: "Thêm mới tài sản thất bại",
                    placement: "top",
                    duration: 2,
                });
            });
    };
    const onFinishFail = (e) => {

    }


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
                inputType: col.dataIndex === 'asset_quantity' ? 'number' : 'text',
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave
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
                title={<h2>Thêm mới nhiều tài sản</h2>}
                open={openView}
                onOk={() => {
                    closeView(false);
                }}
                onCancel={() => {
                    closeView(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            closeView(false);
                        }}
                    >
                        Đóng
                    </Button>,
                    <Button htmlType="submit" key="submit" form="addMultiAsset" type="primary">
                        Thêm mới
                    </Button>,
                ]}
                width={650}
            >
                <Card title="Tài sản mặc định" className='card'>
                    <Row>
                        <Col span={24}>
                            <Form
                                form={formMultiAsset}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFail}
                                layout="horizontal"
                                size={"default"}
                                id="addMultiAsset"
                            >
                                <Table
                                    components={components}
                                    rowClassName={() => 'editable-row'}
                                    rowKey={record => record.basic_asset_id}
                                    columns={columns}
                                    rowSelection={{
                                        type: 'checkbox',
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
                                                                }
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
                                                                {assetTypeList?.map((obj, index) => {
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
                                                        <DeleteOutlined style={{
                                                            color: 'red'
                                                        }} className="dynamic-delete-button" onClick={() => remove(name)} />
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
                            </Form>
                        </Col>
                    </Row>
                </Card>
            </Modal>
        </>
    );
}

export default AddMultiEquipment;