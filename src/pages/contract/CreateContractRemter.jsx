import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import axios from "../../api/axios";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, FilterOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
  Button, Layout, Modal, Form, Table, Space, Input, Select,
  Tabs, Row, Col, Radio, DatePicker, Tag, Checkbox, InputNumber, message,
} from "antd";
import TextArea from "antd/lib/input/TextArea";

const { Content, Sider, Header } = Layout;
const { Option } = Select;


const CreateContractRenter = () => {

  const LIST_OLD_RENTER = "manager/renter/old";
  const LIST_ASSET_TYPE = "manager/asset/type";
  const APARTMENT_DATA_GROUP = "manager/group/get-group/1";
  const dateFormatList = ['DD/MM/YYYY', 'YYYY/MM/DD'];
  const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  const [dataOldRenter, setDataOldRenter] = useState([]);
  const [listAssetType, setListAssetType] = useState([]);

  const defaultAddAsset = {
    dateOfDelivery: moment(),
    asset_unit: 1,
    asset_type: "Khác",
    asset_value: 0,
    asset_status: true
  };
  const contractTerm = [];
  for (let i = 1; i < 17; i++) {
    if (i < 12) {
      contractTerm.push(
        {
          id: i,
          contractTermName: `Tháng ${i}`,
          contractTermValue: i
        }
      );
    } else {
      contractTerm.push(
        {
          id: i,
          contractTermName: `${i % 11} năm`,
          contractTermValue: (i % 11) * 12
        }
      );
    }
  }
  const dataFilter = {
    id: [],
    asset_type: []
  };

  const [searched, setSearched] = useState("");
  const [filterAssetType, setFilterAssetType] = useState([]);
  const [assetStatus, setAssetStatus] = useState([]);
  const [isAdd, setisAdd] = useState(false);
  const [componentSize, setComponentSize] = useState('default');
  const [selectOldRenter, setSelectOldRenter] = useState([]);
  const [form] = Form.useForm();
  const [createAssetForm] = Form.useForm();
  const [editAssetForm] = Form.useForm();
  const [formAddAsset, setFormAddAsset] = useState(defaultAddAsset);
  const [isEditAsset, setIsEditAsset] = useState(false);
  const [dataMember, setDataMember] = useState([]);
  const [memberId, setMemberId] = useState(1);

  const [formEditMem] = Form.useForm();
  const [isEditMem, setIsEditMem] = useState(false);
  const [formAddMem] = Form.useForm();
  const [isAddMem, setIsAddMem] = useState(false);

  useEffect(() => {
    apartmentGroup();
  }, []);

  const apartmentGroup = async () => {
    let cookie = localStorage.getItem("Cookie");
    await axios
      .get(APARTMENT_DATA_GROUP, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        setDataApartmentGroup(res.data.body);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(dataApartmentGroup);

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const getFullDate = (date) => {
    const dateAndTime = date.split("T");

    return dateAndTime[0].split("/").reverse().join("/");
  };
  const columns = [
    {
      title: 'Tên tài sản',
      dataIndex: 'asset_name',
      key: 'asset_id',
      filteredValue: [searched],
      onFilter: (value, record) => {
        return (
          String(record.asset_name).toLowerCase()?.includes(value.toLowerCase())
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'hand_over_asset_quantity',
      key: 'asset_id',
    },
    {
      title: 'Loại',
      dataIndex: 'asset_type_show_name',
      filters: [
        { text: 'Phòng ngủ', value: 'Phòng ngủ' },
        { text: 'Phòng khách', value: 'Phòng khách' },
        { text: 'Phòng bếp', value: 'Phòng bếp' },
        { text: 'Phòng tắm', value: 'Phòng tắm' },
        { text: 'Khác', value: 'Khác' },
      ],
      filteredValue: filterAssetType.asset_type_show_name || null,
      onFilter: (value, record) => record.asset_type_show_name.indexOf(value) === 0,
    },
    {
      title: 'Thời gian',
      dataIndex: 'hand_over_asset_date_delivery',
      key: 'asset_id',
      render: (hand_over_asset_date_delivery) => {
        return new Date(hand_over_asset_date_delivery).getDate() + '/' + new Date(hand_over_asset_date_delivery).getMonth() + '/' + new Date(hand_over_asset_date_delivery).getFullYear()
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'hand_over_asset_status',
      filters: [
        { text: 'Tốt', value: true },
        { text: 'Hỏng', value: false },
      ],
      filteredValue: assetStatus.hand_over_asset_status || null,
      onFilter: (value, record) => record.hand_over_asset_status === value,
      render: (status) => {
        return (
          <>
            <Tag color={status ? "success" : "error"}>{status ? 'Tốt' : 'Hỏng'}</Tag>
          </>
        )
      }
    },
    {
      title: 'Thao tác',
      key: 'asset_id',
      render: (record) => {
        return (
          <>
            <EditOutlined onClick={() => {
              setIsEditAsset(true);
              editAssetForm.setFieldsValue({
                asset_id: record.id,
                asset_name: record.asset_name,
                dateOfDelivery: record.dateOfDelivery !== null ? moment(record.dateOfDelivery, dateFormatList) : '',
                asset_unit: record.asset_unit,
                asset_type: record.asset_type,
                asset_value: record.asset_value,
                asset_status: record.asset_status
              });
            }} />
            <DeleteOutlined onClick={() => {
              onDeleteAsset(record)
            }} style={{ color: "red", marginLeft: 12 }} />
          </>
        )
      }
    },
  ];
  const onDeleteAsset = (record) => {
    Modal.confirm({
      title: `Bạn có chắc chắn muốn xóa ${record.asset_name} này ?`,
      okText: 'Có',
      cancelText: 'Hủy',
      onOk: () => {
        setDataSource(pre => {
          return pre.filter((asset) => asset.id !== record.id)
        })
      },
    })
  }

  useEffect(() => {
    getAllOldRenter();
  }, []);

  const getAllOldRenter = async () => {
    let cookie = localStorage.getItem("Cookie");
    await axios
      .get(LIST_OLD_RENTER, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        setDataOldRenter(res.data.body);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAssetType();
  }, []);

  const getAssetType = async () => {
    let cookie = localStorage.getItem("Cookie");
    await axios
      .get(LIST_ASSET_TYPE, {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        setListAssetType(res.data.body);
      })
      .catch((error) => {
        console.log(error);
      });
  };



  const renterColumn = [
    {
      title: 'Họ và tên',
      dataIndex: 'renter_full_name',
      key: 'id',
      filteredValue: [searched],
      onFilter: (value, record) => {
        return (
          String(record.renter_full_name).toLowerCase()?.includes(value.toLowerCase())
        );
      },
    },
    {
      title: 'Giới tính',
      dataIndex: 'renter_gender',
      key: 'id',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'renter_phone_number',
      key: 'id',
    },
    {
      title: 'Email',
      dataIndex: 'renter_email',
      key: 'id',
    },
    {
      title: 'CCCD/CMND',
      dataIndex: 'renter_identity_number',
      key: 'id',
    },
  ];
  const assetData = [
    {
      asset_id: 1,
      asset_name: 'Giường',
      hand_over_asset_date_delivery: '19/10/2022',
      hand_over_asset_quantity: 10,
      hand_over_asset_status: "YES",
    },
  ];
  const [dataSource, setDataSource] = useState(assetData);
  const onAdd = (record) => {
    setisAdd(true);
  }


  const resetAdd = () => {
    setisAdd(false);
  }
  const onOk = () => {
    form.setFieldsValue({
      renterName: selectOldRenter.renter_full_name,
      phoneNumber: selectOldRenter.renter_phone_number,
      sex: selectOldRenter.renter_gender === "Nam" ? true : false,
      email: selectOldRenter.renter_email,
      identityCard: selectOldRenter.renter_identity_number,
    });
    setisAdd(false);
  };
  form.setFieldsValue({
    startDate: moment(),
    billCycle: 1,
  });
  const columnsService = [
    {
      title: 'Dịch vụ sử dụng',
      dataIndex: 'service_show_name',
      key: 'service_show_name',
    },
    {
      title: 'Đơn giá (VNĐ)',
      dataIndex: 'service_price',
      key: 'service_price',
      render: (price) => {
        return <span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</span>
      }
    },
    {
      title: 'Cách tính giá dịch vụ',
      dataIndex: 'service_type_name',
      key: 'service_type_name',
    },
  ];

  const columnsMember = [

    {
      title: "Họ và tên",
      dataIndex: "member_name",
      key: "member_id",
    },
    {
      title: "Giới tính",
      dataIndex: "member_gender",
      key: "member_id",
      render: (member_gender) => {
        return member_gender ? 'Nam' : 'Nữ'
      }
    },
    {
      title: "Số điện thoại",
      dataIndex: "member_number_phone",
      key: "member_id",
    },
    {
      title: "CMND/CCCD",
      dataIndex: "member_citizen_card",
      key: "member_id",
    },
    {
      title: "Biển số xe",
      dataIndex: "member_vehicle_number",
      key: "member_id",
    },
    {
      title: "Địa chỉ",
      dataIndex: "member_address",
      key: "member_id",
    },

    {
      title: "Thao tác",
      key: "member_id",
      render: (record) =>
      (
        <Space>
          <EditOutlined onClick={() => {
            setIsEditMem(true);
            console.log(record);
            formEditMem.setFieldsValue({
              member_id: record.member_id,
              member_gender: record.member_gender,
              member_name: record.member_name,
              member_citizen_card: record.member_citizen_card,
              member_number_phone: record.member_number_phone,
              member_vehicle_number: record.member_vehicle_number,
              member_address: record.member_address
            });
          }} />
          <DeleteOutlined onClick={() => onDeleteMember(record)} style={{ color: "red", marginLeft: 12 }} />
        </Space>
      )
    },
  ];




  const onFinishAddMem = (e) => {
    const duplicate = dataMember.find(
      (mem) => mem.member_name === e.member_name && mem.member_gender === e.member_gender && mem.member_citizen_card === e.member_citizen_card);

    if (!duplicate) {
      setMemberId(e.member_id + 1);
      setDataMember([...dataMember, e]);
      message.success('Thêm mới thành viên thành công');
      setIsAddMem(false);
      formAddMem.setFieldsValue({
        member_id: memberId,
        member_name: "",
        member_citizen_card: "",
        member_number_phone: "",
        member_vehicle_number: "",
        member_address: ""
      });
    } else {
      setIsAddMem(true);
      message.error('Thành viên đã tồn tại');
    }
  }
  const onFinishFailAddMem = (e) => {
    console.log(e);
  }

  const onFinishEditMem = (e) => {
    const duplicate = dataMember.find(
      (mem) => mem.member_name === e.member_name && mem.member_gender === e.member_gender && mem.member_citizen_card === e.member_citizen_card);
    if (!duplicate) {
      setDataMember((pre) => {
        return pre.map((obj, index) => {
          if (obj.member_id === e.member_id) {
            return e
          } else {
            return obj
          }
        })
      });
      message.success('Chỉnh sửa thành viên thành công');
      setIsEditMem(false);
    } else {
      setIsEditMem(true);
      message.error('Chỉnh sửa thành viên thất bại');
    }
  }
  const onFinishFailEditMem = (e) => {
    console.log(e);
    message.error('Chỉnh sửa thành viên thất bại');
  }

  const onDeleteMember = (record) => {
    Modal.confirm({
      title: `Bạn có chắc chắn muốn xóa ${record.member_name} không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        setDataMember(pre => {
          return pre.filter((member) => member.member_id !== record.member_id);
        })
      }
    })

  }


  const [addAssetInRoom, setAddAssetInRoom] = useState(false);
  const [floorRoom, setFloorRoom] = useState();

  const [roomStatus, setRoomStatus] = useState(true);

  const floors = dataApartmentGroup?.list_rooms?.map((obj, index) => obj.room_floor)?.filter((type, index) => dataApartmentGroup?.list_rooms?.map((obj, index) => obj.room_floor).indexOf(type) === index);
  const [room, setRoom] = useState([]);
  const [roomSelect, setRoomSelect] = useState("");

  const onFinish = (e) => {
    message.success('Thêm mới hợp đồng thành công');
    form.setFieldsValue({
      memberInRoom: dataMember,
    });
    console.log(e);
  }
  const onFinishContractFail = (e) => {
    message.error('Thêm mới hợp đồng không thành công');
  }

  const assetData2 = [
    {
      asset_id: 1,
      asset_name: 'Giường',
      hand_over_asset_date_delivery: '19/10/2022',
      hand_over_asset_quantity: 10,
      hand_over_asset_status: "YES",
    },
  ];
  const addAssetFinish = (e) => {
    message.success('Thêm mới tài sản thành công');
    console.log(e);
    const data = { ...e, dateOfDelivery: e.dateOfDelivery.format('DD/MM/YYYY') };
    setDataSource([...dataApartmentGroup.list_hand_over_assets, data]);
    setAddAssetInRoom(false);
  }
  const addAssetFail = (e) => {
    setAddAssetInRoom(true);
  }

  const editAssetFinish = (e) => {
    message.success('Cập nhật tài sản thành công');
    console.log(e);
    const data = {
      ...e,
      asset_name: e.asset_name,
      dateOfDelivery: e.dateOfDelivery.format('DD/MM/YYYY'),
      asset_unit: e.asset_unit,
      asset_type: e.asset_type,
      asset_status: e.asset_status,
    };
    setDataSource(pre => {
      return pre.map(asset => {
        if (asset.id === e.asset_id) {
          return { ...e, dateOfDelivery: e.dateOfDelivery.format('DD/MM/YYYY') };
        } else {
          return asset;
        }
      });
    });
    setIsEditAsset(false);
  }
  const editAssetFail = (e) => {
    setIsEditAsset(true);
  }

  return (
    <div className="contract">
      <Layout
        style={{
          minHeight: "100vh",
          minWidth: "100vh"
        }}
      >
        <Sider width={250}>
          <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
          <Sidebar />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="layout-header"
          >
            <p className="header-title">Thêm hợp đồng mới</p>
          </Header>
          <Content
            style={{
              margin: "10px 16px",
            }} >
            <div
              className="site-layout-background"
              style={{
                minHeight: 360,
              }}>
              <div style={{ overflow: "auto" }}>
                <Button htmlType="submit" style={{ float: "right" }} type="primary" form="create-contract">Lưu</Button>
                <Button href="/contract-renter" type="default" style={{ marginRight: 5, float: "right" }}>Quay lại</Button>
              </div>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishContractFail}
                form={form}
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 15,
                }}
                layout="horizontal"
                initialValues={{
                  size: componentSize,
                }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
                width={1000}
                id="create-contract"
              >
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="Thông tin hợp đồng" key="1">
                    <Row>
                      <Col span={8}>
                        <h3><b>Các thông tin về khách thuê: </b></h3>
                        <Form.Item className="form-item" name="contractName"
                          labelCol={{ span: 24 }} label={<span><b>Tên hợp đồng: </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tên hợp đồng",
                              whitespace: true,
                            }
                          ]}>
                          <Input
                            placeholder="Tên hợp đồng">
                          </Input>
                        </Form.Item>
                        <Form.Item className="form-item" name="renterName" rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên khách thuê",
                            whitespace: true,
                          }
                        ]} labelCol={{ span: 24 }} label={<span><b>Tên khách thuê: </b></span>}>
                          {/* <span><b>Tên khách thuê: </b></span> */}
                          <Input
                            placeholder="Tên khách thuê" onChange={(e) => {
                              setDataOldRenter(pre => {
                                return { ...pre, renter_full_name: e.target.value }
                              })
                            }}>
                          </Input>
                        </Form.Item>
                        <Form.Item className="form-item" name="sex" rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên khách thuê",
                          }
                        ]}>
                          <Radio.Group>
                            <Radio value={true}>Nam</Radio>
                            <Radio value={false}>Nữ</Radio>
                          </Radio.Group>
                        </Form.Item>
                        {/* <Form.Item className="form-item" name="oldCustomer"> */}
                        <Button type="primary" size="default"
                          onClick={() => {
                            onAdd()
                          }}>Khách cũ</Button>
                        {/* </Form.Item> */}
                        <Form.Item className="form-item" name="phoneNumber"
                          labelCol={{ span: 24 }} label={<span><b>Số điện thoại: </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số điện thoại",
                              whitespace: true,
                            }
                          ]}
                        >
                          <Input
                            placeholder="Số điện thoại" onChange={(e) => {
                              setDataOldRenter(pre => {
                                return { ...pre, renter_phone_number: e.target.value }
                              })
                            }}>
                          </Input>
                        </Form.Item>
                        <Form.Item className="form-item" name="email" labelCol={{ span: 24 }}
                          label={<span><b>Email: </b></span>}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Vui lòng nhập email",
                        //     whitespace: true,
                        //     type: "email",
                        //   }
                        // ]}
                        >
                          <Input
                            placeholder="Email" onChange={(e) => {
                              setDataOldRenter(pre => {
                                return { ...pre, renter_email: e.target.value }
                              })
                            }}>
                          </Input>
                        </Form.Item>
                        <Form.Item className="form-item" name="identityCard"
                          labelCol={{ span: 24 }} label={<span><b>CCCD/CMND: </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập CCCD/CMND",
                              whitespace: true,
                            }
                          ]}>
                          <Input
                            placeholder="CCCD/CMND" onChange={(e) => {
                              setDataOldRenter(pre => {
                                return { ...pre, renter_identity_number: e.target.value }
                              })
                            }}>
                          </Input>
                        </Form.Item>
                        <Form.Item className="form-item" name="note"
                          labelCol={{ span: 24 }} label={<span><b>Ghi chú: </b></span>}>
                          <TextArea rows={4} placeholder="Ghi chú" value={""} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <h3><b>Các thông tin về hợp đồng: </b></h3>
                        <Form.Item className="form-item" name="floor"
                          labelCol={{ span: 24 }} label={<span><b>Tầng: </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn tầng",
                            }
                          ]}>
                          <Select
                            // showSearch
                            placeholder="Chọn tầng"
                            optionFilterProp="children"
                            onChange={(e) => {
                              setRoomStatus(false)
                              setRoom(dataApartmentGroup?.list_rooms?.filter(data => { return data.room_floor === e }));
                              setFloorRoom(pre => {
                                return { ...pre, room_floor: e }
                              });
                            }}
                            // onSearch={onSearch}
                            // filterOption={(input, option) => {
                            //   option.children.toLowerCase().includes(input.toLowerCase())
                            // }
                            // }
                            value={floorRoom?.room_floor}
                          >
                            {floors?.sort((a, b) => a - b)?.map((obj, index) => {
                              return <Select.Option key={index} value={obj}>{obj}</Select.Option>
                            })}
                          </Select>
                        </Form.Item>
                        <Form.Item className="form-item" name="room"
                          labelCol={{ span: 24 }} label={<span><b>Phòng: </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn phòng",
                            }
                          ]}>
                          <Select placeholder="Chọn phòng" disabled={roomStatus}
                            onChange={(e) => {
                              setRoomSelect(e);
                            }}>
                            {room?.map((obj, index) => {
                              return <Select.Option key={index} value={obj.room_name}>{obj.room_name}</Select.Option>
                            })}
                          </Select>
                        </Form.Item>
                        {/* <Form.Item className="form-item" name="contractType"
                          labelCol={{ span: 24 }} label={<span><b>Loại hợp đồng: </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập chu kỳ tính tiền",
                            }
                          ]}>
                          <Select placeholder="Loại hợp đồng" style={{ width: "100%" }}>
                            <Option value="limit">Có thời hạn</Option>
                            <Option value="no limit">Không có thời hạn</Option>
                          </Select>
                        </Form.Item> */}
                        <Form.Item className="form-item" name="contractTerm"
                          labelCol={{ span: 24 }} label={<span><b>Thời hạn hợp đồng (Ít nhất 1 tháng): </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn thời hạn hợp đồng",
                            }
                          ]}
                        >
                          <Select placeholder="Thời hạn hợp đồng" onChange={(e) => {
                            form.setFieldsValue({
                              endDate: moment(form.getFieldsValue().startDate.add(e, 'M'), dateFormatList),
                              startDate: moment(form.getFieldsValue().startDate.add(-e, 'M'), dateFormatList)
                            });
                          }}>
                            {contractTerm.map((obj, index) => {
                              return <Option value={obj.contractTermValue}>{obj.contractTermName}</Option>
                            })}

                          </Select>
                        </Form.Item>

                        <Form.Item className="form-item" name="startDate"
                          labelCol={{ span: 24 }} label={<span><b>Ngày hợp đồng có hiệu lực: </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn ngày lập hợp đồng",
                            }
                          ]}>
                          <DatePicker allowClear={false} style={{ width: "100%" }} placeholder="Ngày vào ở" defaultValue={moment()} format='DD/MM/YYYY' />
                        </Form.Item>
                        <Form.Item className="form-item" name="endDate"
                          labelCol={{ span: 24 }} label={<span><b>Ngày kết thúc: </b></span>}>
                          <DatePicker allowClear={false} style={{ width: "100%" }} placeholder="Ngày kết thúc" format='DD/MM/YYYY' />
                        </Form.Item>
                        <Form.Item className="form-item" name="billCycle"
                          labelCol={{ span: 24 }} label={<span><b>Chu kỳ tính tiền (Tháng): </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập chu kỳ tính tiền",
                            }
                          ]}>
                          <Select placeholder="Chu kỳ tính tiền" style={{ width: "100%" }}>
                            {contractTerm.map((obj, index) => {
                              return <Option value={obj.contractTermValue}>{obj.contractTermName}</Option>
                            })}
                          </Select>
                        </Form.Item>
                        <Form.Item className="form-item" name="paymentCycle"
                          labelCol={{ span: 24 }} label={<span><b>Chu kỳ thanh toán: </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập chu kỳ thanh toán",
                            }
                          ]}>
                          <Select placeholder="Kỳ thanh toán" style={{ width: "100%" }}>
                            <Option value="15">kỳ 15</Option>
                            <Option value="30">kỳ 30</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Row>
                          <h3><b>Thông tin giá trị hợp đồng: </b></h3>
                          <Form.Item className="form-item" name="roomPrice"
                            labelCol={{ span: 24 }} label={<span><b>Giá phòng (VND): </b></span>}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập giá phòng",
                              },
                            ]}>
                            <InputNumber
                              defaultValue={0}
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                              style={{ width: '100%' }}
                              min={0}
                            />
                          </Form.Item>
                          <Form.Item className="form-item" name="depositAmount"
                            labelCol={{ span: 24 }} label={<span><b>Số tiền cọc (VND): </b></span>}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập tiền cọc",
                              }
                            ]}>
                            <InputNumber
                              defaultValue={0}
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                              style={{ width: '100%' }}
                              min={0}
                            />
                          </Form.Item>
                          {/* <Form.Item className="form-item" name="autoRenewContract"
                          labelCol={{ span: 24 }} label={<span><b>Tự động gia hạn hợp đồng:  </b></span>}>
                          <Switch defaultChecked onChange={onChangeAutoCheck} />
                        </Form.Item> */}
                          {/* <p><i>Tập tin và hình ảnh upload thả vào đây</i></p>
                        <Form.Item className="form-item" name="file1">
                          <Upload.Dragger multiple listType='picture' showUploadList={{ showRemoveIcon: true }}
                            accept=".png,jpeg,.doc"
                            beforeUpload={(file) => {
                              return false;
                            }}
                            iconRender={() => {
                              return <Spin></Spin>
                            }}
                            action={"http://localhost:3000/contract-renter/create"}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                          </Upload.Dragger>
                        </Form.Item> */}
                          {/* <Button><DownloadOutlined />Tải hợp đồng</Button> */}
                        </Row>
                      </Col>
                    </Row>
                    <p><i><b>Lưu ý:</b><br />
                      - Kỳ thanh toán tùy thuộc vào từng khu nhà trọ, nếu khu trọ bạn thu tiền 1 lần vào cuối tháng thì bạn chọn là kỳ 30. Trường hợp khu nhà trọ bạn có số lượng phòng nhiều, chia làm 2 đợt thu, bạn dựa vào ngày vào của khách để gán kỳ cho phù hợp, ví dụ: vào từ ngày 1 đến 15 của tháng thì gán kỳ 15; nếu vào từ ngày 16 đến 31 của tháng thì gán kỳ 30. Khi tính tiền phòng bạn sẽ tính tiền theo kỳ.<br />
                      - Tiền đặt cọc sẽ không tính vào doanh thu ở các báo cáo và thống kê doanh thu. Nếu bạn muốn tính vào doanh thu bạn ghi nhận vào trong phần thu/chi khác (phát sinh). Tiền đặt cọc sẽ được trừ ra khi tính tiền trả phòng.<br />
                      - Các thông tin có giá trị là ngày nhập đủ ngày tháng năm và đúng định dạng dd/MM/yyyy (ví dụ: 01/12/2020)<br />
                      - Chu kỳ tính tiền: là số tháng được tính trên mỗi hóa đơn.<br />
                    </i></p>
                    <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Dịch vụ" key="2">
                    <Row>
                      <Col span={23}>
                        <Form.Item className="form-item" name="service"
                          labelCol={{ span: 24 }}>
                          <h3><b>Các thông tin về dịch vụ sử dụng </b></h3>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        {dataApartmentGroup.list_general_service?.map((obj, index) => {
                          return (
                            <>
                              <Form.Item className="form-item" name={obj.service_name}
                                labelCol={{ span: 24 }}
                                label={<h4>{obj.service_show_name} <b>({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(obj.service_price)})</b></h4>}
                                rules={[
                                  {
                                    required: true,
                                    message: `Vui lòng không để trống`,
                                  },
                                ]}>
                                <InputNumber
                                  addonAfter={String(obj.service_type_name).toLowerCase()?.includes("Đồng hồ".toLowerCase()) ? 'Chỉ số hiện tại' : obj.service_type_name}
                                  defaultValue={0}
                                  style={{ width: '100%' }}
                                  min={0}
                                />
                              </Form.Item>
                            </>
                          )
                        })}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Table
                          rowKey={(record) => record.key}
                          dataSource={dataApartmentGroup.list_general_service}
                          columns={columnsService}>
                        </Table>
                      </Col>
                      <p><i><b>Lưu ý:</b><br />
                        - Trên đây là dịch vụ chung áp dụng cho tất cả các phòng trong một tòa nhà.<br />
                        - Nếu bạn muốn thay đổi dịch vụ chung này cần vào mục <b>Dịch Vụ</b>
                        <br />
                      </i></p>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Thành viên" key="3">
                    <Row>
                      <Col span={23}>
                        <Form.Item className="form-item" name="memberInRoom"
                          labelCol={{ span: 24 }}>
                          <h3><b>Các thông tin về thành viên trong phòng </b></h3>
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <PlusCircleOutlined style={{ fontSize: 36, marginBottom: 20, color: "#1890ff" }} onClick={() => {
                          setIsAddMem(true);
                          formAddMem.setFieldsValue({
                            member_gender: true,
                            member_id: memberId
                          })
                        }} />
                      </Col>
                      <Table style={{ width: '100%' }}
                        dataSource={dataMember}
                        columns={columnsMember}
                        scroll={{ x: 800, y: 600 }}>
                      </Table>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Tài sản" key="4">
                    <Row>
                      <Col span={24}>
                        <Form.Item className="form-item" name="asset"
                          labelCol={{ span: 24 }}>
                          <p>
                            <h3><b>Thông tin tài sản bàn giao {floorRoom?.room_floor !== undefined ? 'tầng ' + floorRoom?.room_floor : ''} {roomSelect === '' ? '' : 'phòng ' + roomSelect}</b></h3>
                          </p>
                        </Form.Item>
                        <Row>
                          <Col span={8}>
                            <Input.Search placeholder="Nhập tên tài sản để tìm kiếm" style={{ marginBottom: 8 }}
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
                          <Col span={2}>
                            <FilterOutlined style={{ fontSize: '150%' }} />
                            <b>Loại tài sản:</b>
                          </Col>
                          <Col span={18}>
                            <Row>
                              {/* {listAssetType.map((obj, index) => {
                                return <Col span={4}>
                                  <Checkbox key={obj.id} value={obj.asset_type}
                                    onChange={(e) => {
                                      // if (e.target.checked) {
                                      //   setFilterAssetType(obj);
                                      // } else {
                                      //   filterAssetType.splice(filterAssetType.indexOf(obj.asset_type_name), 1);
                                      //   setFilterAssetType([]);
                                      // }
                                      dataFilter.asset_type.push(obj.asset_type);
                                      setFilterAssetType(dataFilter);
                                      console.log(dataFilter);
                                    }}>
                                    {obj.asset_type}
                                  </Checkbox>
                                </Col>
                              })} */}
                              <Checkbox.Group options={listAssetType.map((obj, index) => { return obj.asset_type_show_name })}
                                onChange={(checkedValues) => {
                                  dataFilter.asset_type_show_name = checkedValues;
                                  setFilterAssetType(dataFilter);
                                }}
                              >

                              </Checkbox.Group>
                            </Row>
                          </Col>
                          <Col span={4}>
                            <PlusCircleOutlined onClick={() => {
                              setAddAssetInRoom(true);
                              createAssetForm.setFieldsValue({
                                dateOfDelivery: formAddAsset.dateOfDelivery,
                                asset_unit: formAddAsset.asset_unit,
                                asset_type: formAddAsset.asset_type,
                                asset_value: formAddAsset.asset_value,
                                asset_status: formAddAsset.asset_status
                              });
                            }} style={{ fontSize: 36, color: "#1890ff", float: "right" }} />
                          </Col>
                        </Row>
                        <Row>
                          <Table
                            bordered
                            // rowKey={(record) => record.id}
                            // rowSelection={{
                            //   onSelect: (record) => {
                            //     // arrayAsset.push({ ...record });
                            //     // const b = arrayAsset.filter((ele, ind) => ind === arrayAsset.findIndex(elem => elem.index === ele.index && elem.assetName === ele.assetName))
                            //     // console.log(record);
                            //   },
                            //   onChange: (pagination, filters, sorter, extra) => {
                            //     console.log('params', pagination, filters, sorter, extra);
                            //     // form.setFieldsValue({
                            //     //   asset: record.map(indexAsset => dataSource.find(obj => obj.index === indexAsset)),
                            //     // });
                            //   }
                            // }}
                            onChange={(pagination, filters, sorter, extra) => {
                              console.log(filters);
                              setFilterAssetType(filters);
                              setAssetStatus(filters)
                              // form.setFieldsValue({
                              //   asset: record.map(indexAsset => dataSource.find(obj => obj.index === indexAsset)),
                              // });
                            }}
                            dataSource={dataApartmentGroup.list_hand_over_assets}
                            columns={columns}
                            scroll={{ x: 800, y: 600 }}
                          >
                          </Table>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <p><i><b>Lưu ý:</b><br />
                        - Cột <b>"thời gian"</b>: trong bảng hiển thị là tính từ thời gian đó tới thời điểm hiện tại thì tài sản có trạng thái <b>"Tốt"</b> hoặc <b>"Hỏng"</b>. <br />
                        - Trong trường hợp bàn giao với khách thuê, tài sản ở thời điểm bàn giao <b>"trạng thái"</b> không như trong bảng hiển thị. Cần cập nhập để hệ thống ghi nhận trạng thái của tài sản ở thời điểm hiện tại.<br />
                      </i></p>

                    </Row>
                    <Row>
                      <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
                    </Row>
                    {/* <Row>
                      <Upload>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                      </Upload>
                    </Row> */}
                  </Tabs.TabPane>
                </Tabs>
              </Form>
              <Modal
                title="Khách cũ"
                visible={isAdd}
                onCancel={() => {
                  resetAdd()
                }}
                onOk={onOk}
                width={1000}
              >
                <Form
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 30 }}
                  layout="horizontal"
                  initialValues={{ size: componentSize }}
                  onValuesChange={onFormLayoutChange}
                  size={"default"}
                >
                  <Form.Item >
                    <Input.Search placeholder="Nhập tên khách cũ để tìm kiếm" style={{ marginBottom: 8, width: "30%" }}
                      onSearch={(e) => {
                        setSearched(e);
                      }}
                      onChange={(e) => {
                        setSearched(e.target.value);
                      }}
                    />
                    <Table
                      columns={renterColumn}
                      dataSource={dataOldRenter}
                      scroll={{ x: 1000, y: 400 }}
                      rowKey={(record) => record.id}
                      rowSelection={{
                        type: 'radio',
                        onSelect: (record) => {
                          setSelectOldRenter({ ...record });
                        }
                      }}
                    />
                  </Form.Item>
                </Form>
              </Modal>
              <Modal
                title="Thêm tài sản mới cho phòng"
                visible={addAssetInRoom}
                onCancel={() => {
                  setAddAssetInRoom(false)
                }}
                onOk={() => {
                  setAddAssetInRoom(false)
                }}
                width={500}
                footer={[
                  <Button htmlType="submit" key="submit" form="create-asset" type="primary">
                    Lưu
                  </Button>,
                  <Button key="back" onClick={() => {
                    setFormAddAsset(createAssetForm.getFieldsValue());
                    setAddAssetInRoom(false)
                  }}>
                    Huỷ
                  </Button>,
                ]}
              >
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
                  <Form.Item className="form-item" name="asset_name"
                    labelCol={{ span: 24 }} label={<span><b>Tên tài sản: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên tài sản",
                        whitespace: true,
                      }
                    ]}>
                    <Input
                      placeholder="Tên tài sản">
                    </Input>
                  </Form.Item>
                  <Form.Item className="form-item" name="dateOfDelivery"
                    labelCol={{ span: 24 }} label={<span><b>Ngày bàn giao: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày bàn giao",
                      }
                    ]}>
                    <DatePicker style={{ width: "100%" }} placeholder="Ngày bàn giao" defaultValue={moment()} format='DD/MM/YYYY' />
                  </Form.Item>
                  <Form.Item className="form-item" name="asset_unit"
                    labelCol={{ span: 24 }} label={<span><b>Số lượng: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số lượng",
                      },
                    ]}>
                    <InputNumber
                      defaultValue={1}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                      min={1}
                    />
                  </Form.Item>
                  <Form.Item className="form-item" name="asset_type"
                    labelCol={{ span: 24 }} label={<span><b>Loại tài sản: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn loại tài sản",
                      }
                    ]}>
                    <Select
                      placeholder="Chọn loại tài sản"
                    >
                      <Select.Option value={"Đồ phòng ngủ"}>Đồ phòng ngủ</Select.Option>
                      <Select.Option value={"Đồ phòng khách"}>Đồ phòng khách</Select.Option>
                      <Select.Option value={"Đồ phòng bếp"}>Đồ phòng bếp</Select.Option>
                      <Select.Option value={"Đồ phòng tắm"}>Đồ phòng tắm</Select.Option>
                      <Select.Option value={"Khác"}>Khác</Select.Option>
                    </Select>
                  </Form.Item>
                  {/* <Form.Item className="form-item" name="asset_value"
                    labelCol={{ span: 24 }} label={<span><b>Giá trị tài sản (VND): </b></span>}>
                    <InputNumber
                      defaultValue={0}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                      min={0}
                    />
                  </Form.Item> */}
                  <Form.Item className="form-item" name="asset_status"
                    labelCol={{ span: 24 }} label={<span><b>Trạng thái </b></span>} rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn trạng thái",
                      }
                    ]}>
                    <Radio.Group>
                      <Radio value={true}><Tag color="success">Tốt</Tag></Radio>
                      <Radio value={false}><Tag color="error">Hỏng</Tag></Radio>
                    </Radio.Group>
                  </Form.Item>
                </Form>
              </Modal>

              <Modal
                title="Chỉnh sửa tài sản trong phòng"
                visible={isEditAsset}
                onCancel={() => {
                  setIsEditAsset(false)
                }}
                onOk={() => {
                  setIsEditAsset(false)
                }}
                width={500}
                footer={[
                  <Button htmlType="submit" key="submit" form="edit-asset" type="primary">
                    Lưu
                  </Button>,
                  <Button key="back" onClick={() => {
                    setFormAddAsset(createAssetForm.getFieldsValue());
                    setAddAssetInRoom(false)
                  }}>
                    Huỷ
                  </Button>,
                ]}
              >
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
                  <Form.Item className="form-item" name="asset_name"
                    labelCol={{ span: 24 }} label={<span><b>Tên tài sản: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên tài sản",
                        whitespace: true,
                      }
                    ]}>
                    <Input
                      placeholder="Tên tài sản">
                    </Input>
                  </Form.Item>
                  <Form.Item className="form-item" name="asset_id" style={{ display: 'none' }}>
                  </Form.Item>
                  <Form.Item className="form-item" name="dateOfDelivery"
                    labelCol={{ span: 24 }} label={<span><b>Ngày bàn giao: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày bàn giao",
                      }
                    ]}>
                    <DatePicker style={{ width: "100%" }} placeholder="Ngày bàn giao" defaultValue={moment()} format='DD/MM/YYYY' />
                  </Form.Item>
                  <Form.Item className="form-item" name="asset_unit"
                    labelCol={{ span: 24 }} label={<span><b>Số lượng: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số lượng",
                      },
                    ]}>
                    <InputNumber
                      defaultValue={1}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                      min={1}
                    />
                  </Form.Item>
                  <Form.Item className="form-item" name="asset_type"
                    labelCol={{ span: 24 }} label={<span><b>Loại tài sản: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn loại tài sản",
                      }
                    ]}>
                    <Select
                      placeholder="Chọn loại tài sản"
                    >
                      <Select.Option value={"Đồ phòng ngủ"}>Đồ phòng ngủ</Select.Option>
                      <Select.Option value={"Đồ phòng khách"}>Đồ phòng khách</Select.Option>
                      <Select.Option value={"Đồ phòng bếp"}>Đồ phòng bếp</Select.Option>
                      <Select.Option value={"Đồ phòng tắm"}>Đồ phòng tắm</Select.Option>
                      <Select.Option value={"Khác"}>Khác</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item className="form-item" name="asset_value"
                    labelCol={{ span: 24 }} label={<span><b>Giá trị tài sản (VND): </b></span>}>
                    <InputNumber
                      defaultValue={0}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value?.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                      min={0}
                    />
                  </Form.Item>
                  <Form.Item className="form-item" name="asset_status"
                    labelCol={{ span: 24 }} label={<span><b>Trạng thái </b></span>} rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn trạng thái",
                      }
                    ]}>
                    <Radio.Group>
                      <Radio value={true}><Tag color="success">Tốt</Tag></Radio>
                      <Radio value={false}><Tag color="error">Hỏng</Tag></Radio>
                    </Radio.Group>
                  </Form.Item>
                </Form>
              </Modal>
              <Modal title={roomSelect === '' ? 'Thêm thành viên ' : 'Thêm thành viên vào Phòng ' + roomSelect}
                open={isAddMem} onOk={() => { setIsAddMem(false) }} onCancel={() => { setIsAddMem(false) }}
                footer={[
                  <Button htmlType="submit" key="submit" form="add-member" type="primary">
                    Thêm mới
                  </Button>,
                  <Button key="back" onClick={() => setIsAddMem(false)}>
                    Huỷ
                  </Button>,
                ]}
              >
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
                  <Form.Item className="form-item" name="member_id" style={{ display: 'none' }}></Form.Item>
                  <Form.Item className="form-item" name="member_name"
                    labelCol={{ span: 24 }} label={<span><b>Họ và tên: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ tên thành viên",
                        whitespace: true,
                      }
                    ]}>
                    <Input
                      placeholder="Họ và tên">
                    </Input>
                  </Form.Item>
                  <Form.Item className="form-item" name="member_gender"
                    labelCol={{ span: 24 }} label={<span><b>Giới tính: </b></span>}>
                    <Radio.Group>
                      <Radio value={true}>Nam</Radio>
                      <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item className="form-item" name="member_number_phone"
                    labelCol={{ span: 24 }} label={<span><b>Số điện thoại: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                        whitespace: true,
                      },
                      {
                        pattern: /^((\+84|84|0)+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}>
                    <Input
                      placeholder="Số điện thoại"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item className="form-item" name="member_citizen_card"
                    labelCol={{ span: 24 }} label={<span><b>CMND/CCCD: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập CMND/CCCD",
                        whitespace: true,
                      },
                      {
                        pattern: /^([0-9]{12})\b/,
                        message: "Vui lòng nhập đúng CMND/CCCD"
                      },
                    ]}>
                    <Input
                      placeholder="CMND/CCCD"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item className="form-item" name="member_vehicle_number"
                    labelCol={{ span: 24 }} label={<span><b>Biển số xe: </b></span>}>
                    <Input
                      placeholder="Biển số xe">
                    </Input>
                  </Form.Item>
                  <Form.Item className="form-item" name="member_address"
                    labelCol={{ span: 24 }} label={<span><b>Địa chỉ: </b></span>}>
                    <Input
                      placeholder="Địa chỉ">
                    </Input>
                  </Form.Item>
                </Form>
              </Modal>
              <Modal title="Chỉnh sửa thành viên "
                open={isEditMem} onOk={() => { setIsEditMem(false) }} onCancel={() => { setIsEditMem(false) }}
                footer={[
                  <Button htmlType="submit" key="submit" form="edit-member" type="primary">
                    Lưu
                  </Button>,
                  <Button key="back" onClick={() => { setIsEditMem(false) }}>
                    Huỷ
                  </Button>,
                ]}
              >
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
                  <Form.Item className="form-item" name="member_id" style={{ display: 'none' }}></Form.Item>
                  <Form.Item className="form-item" name="member_name"
                    labelCol={{ span: 24 }} label={<span><b>Họ và tên: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ tên thành viên",
                        whitespace: true,
                      }
                    ]}>
                    <Input
                      placeholder="Họ và tên">
                    </Input>
                  </Form.Item>
                  <Form.Item className="form-item" name="member_gender"
                    labelCol={{ span: 24 }} label={<span><b>Giới tính: </b></span>}>
                    <Radio.Group>
                      <Radio value={true}>Nam</Radio>
                      <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item className="form-item" name="member_number_phone"
                    labelCol={{ span: 24 }} label={<span><b>Số điện thoại: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                        whitespace: true,
                      },
                      {
                        pattern: /^((\+84|84|0)+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}>
                    <Input
                      placeholder="Số điện thoại"
                      style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item className="form-item" name="member_citizen_card"
                    labelCol={{ span: 24 }} label={<span><b>CMND/CCCD: </b></span>}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập CMND/CCCD",
                        whitespace: true,
                      },
                      {
                        pattern: /^([0-9]{12})\b/,
                        message: "Vui lòng nhập đúng CMND/CCCD"
                      },
                    ]}>
                    <Input
                      placeholder="CMND/CCCD"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item className="form-item" name="member_vehicle_number"
                    labelCol={{ span: 24 }} label={<span><b>Biển số xe: </b></span>}>
                    <Input
                      placeholder="Biển số xe">
                    </Input>
                  </Form.Item>
                  <Form.Item className="form-item" name="member_address"
                    labelCol={{ span: 24 }} label={<span><b>Địa chỉ: </b></span>}>
                    <Input
                      placeholder="Địa chỉ">
                    </Input>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default CreateContractRenter
