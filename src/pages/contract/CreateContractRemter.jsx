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
  const defaultAddAsset = {
    dateOfDelivery: moment(),
    asset_unit: 1,
    asset_type: "others",
    asset_value: 0,
    asset_status: true
  };
  const [searched, setSearched] = useState("");
  const [isAdd, setisAdd] = useState(false);
  const [componentSize, setComponentSize] = useState('default');
  const [dataOldRenter, setDataOldRenter] = useState([]);
  const [selectOldRenter, setSelectOldRenter] = useState([]);
  const [form] = Form.useForm();
  const [createAssetForm] = Form.useForm();
  const [isEditing, setisEditing] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isAddMem, setisAddMem] = useState(false);
  const [formAddAsset, setFormAddAsset] = useState(defaultAddAsset);
  const service = [
    {
      key: 1,
      service: "Tiền điện",
      price: 3000,
      amount: 1,

    },
    {
      key: 2,
      service: "Tiền nước",
      price: 30000,
      amount: 1,

    },
    {
      key: 3,
      service: "Gửi xe",
      price: 50000,
      amount: 1,
    }];

  const [dataService, setDataService] = useState(service);
  form.setFieldsValue({
    autoRenewContract: true,
    // sex: true,
    electricityIndex: 0,
    waterIndex: 0,
    service: dataService
  });
  const [formEditMem] = Form.useForm();
  const [formAddMem] = Form.useForm();
  const validateMem = (e) => {

    // setisEditing(false)
    if (nMember !== "" && nPhone !== "" && nGender !== "" && nCmnd !== "" && nCarNumber !== "" && nAddress !== "") {
      const randomId = parseInt(Math.random() * 1000);

      let newMember = {
        id: randomId,
        member: nMember,
        gender: nGender,
        phone: nPhone,
        cmnd: nCmnd,
        car_number: nCarNumber,
        address: nAddress,
      }
      setDataMember([...dataMember, newMember]);
      setNMember("")
      setNGender("")
      setNPhone("")
      setNCmnd("")
      setNCarNumber("")
      setNAddress("")
      setisAddMem(false);
    } else {
      setisAddMem(true);
    }


  }

  const validateEditMem = (e) => {

    // setisEditing(false)
    if (e.member !== "" && e.phone !== "" && e.gender !== "" && e.cmnd !== "" && e.car_number !== "" && e.address !== "") {
      setisEditing(false)
    } else {
      setisEditing(true)
    }


  }
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const columns = [
    {
      title: 'Tên tài sản',
      dataIndex: 'assetName',
      key: 'index',
      filteredValue: [searched],
      onFilter: (value, record) => {
        return (
          String(record.assetName).toLowerCase()?.includes(value.toLowerCase())
        );
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'numberOfAsset',
      key: 'index',
    },
    {
      title: 'Loại',
      dataIndex: 'typeOfAsset',
      key: 'index',
    },
    {
      title: 'Thời gian',
      dataIndex: 'dateOfDelivery',
      key: 'index',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'index',
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
      key: 'index',
      render: (record) => {
        return (
          <>
            <EditOutlined />
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
      title: `Bạn có chắc chắn muốn xóa ${record.assetName} này ?`,
      okText: 'Có',
      cancelText: 'Hủy',
      onOk: () => {
        setDataSource(pre => {
          return pre.filter((asset) => asset.index !== record.index)
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
  const assetData = [];
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
    startDate: moment()
  });
  const columnsService = [
    {
      title: 'Dịch vụ sử dụng',
      dataIndex: 'service',
      key: 'key',
      editable: true,
    },
    {
      title: 'Đơn giá (VNĐ)',
      dataIndex: 'price',
      key: 'key',
      render: (price) => {
        return <span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</span>
      }
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'key',
      render: (amount) => {
        return (
          <>
            <span>{amount}</span>
          </>
        )
      }
    },
  ];

  const columnsMember = [

    {
      title: "Họ và tên",
      dataIndex: "member",
      key: "member",
      align: "center",
      editTable: true
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      editTable: true
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      editTable: true
    },
    {
      title: "CMND/CCCD",
      dataIndex: "cmnd",
      key: "cmnd",
      align: "center",
      editTable: true
    },
    {
      title: "Biển số xe",
      dataIndex: "car_number",
      key: "car_number",
      align: "center",
      editTable: true
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      align: "center",
      editTable: true
    },

    {
      title: "Thao tác",
      dataIndex: "thaotac",
      align: "center",
      render: (_, record) =>
      (
        <Space>
          <EditOutlined onClick={() => {
            onEditMember(record);
          }} />
          <DeleteOutlined onClick={() => onDeleteMember(record)} style={{ color: "red", marginLeft: 12 }} />

        </Space>
      )
    },
  ];





  const member = [{
    id: 1,
    member: "Nguyễn Văn B",
    gender: "Nam",
    phone: "0645138795",
    cmnd: "001856447953",
    car_number: "30H-06789",
    address: "Hà Nội",
  },
  {
    id: 2,
    member: "Chu Đình A",
    gender: "Nữ",
    phone: "069413895",
    cmnd: "001856743684",
    car_number: "30H-01259",
    address: "Hà Nội",
  }
  ];

  const [dataMember, setDataMember] = useState(member);
  const [newMember, setNewMember] = useState([]);
  const [nMember, setNMember] = useState("");
  const [nGender, setNGender] = useState("");
  const [nPhone, setNPhone] = useState("");
  const [nCmnd, setNCmnd] = useState("");
  const [nCarNumber, setNCarNumber] = useState("");
  const [nAddress, setNAddress] = useState("");



  const onDeleteMember = (record) => {
    Modal.confirm({
      title: `Bạn có chắc chắn muốn xóa ${record.member} không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        setDataMember(pre => {
          return pre.filter((member) => member.id !== record.id);
        })
      }
    })

  }

  const onEditMember = (record) => {
    setisEditing(true);
    setEditingMember({ ...record })
    formEditMem.setFieldsValue({
      member: record.member,
      gender: record.gender,
      phone: record.phone,
      cmnd: record.cmnd,
      car_number: record.car_number,
      address: record.address,
    });
  }
  const resetEditing = () => {
    setisEditing(false);
    setEditingMember(null);

  }

  const resetEditingCl = () => {

    setisEditing(false);

  }



  const onAddMem = () => {
    setisAddMem(true);
  }

  const resetAddMemCl = () => {
    setisAddMem(false);
  }

  const resetAddMem = (e) => {
    if (nMember !== "" && nPhone !== "" && nGender !== "" && nCmnd !== "" && nCarNumber !== "" && nAddress !== "") {
      const randomId = parseInt(Math.random() * 1000);

      let newMember = {
        id: randomId,
        member: nMember,
        gender: nGender,
        phone: nPhone,
        cmnd: nCmnd,
        car_number: nCarNumber,
        address: nAddress,
      }

      setDataMember([...dataMember, newMember]);
      setNMember("")
      setisAddMem(false);
    }
    setisAddMem(true);


  }
  const [addAssetInRoom, setAddAssetInRoom] = useState(false);
  const [floorRoom, setFloorRoom] = useState();

  const [roomStatus, setRoomStatus] = useState(true);
  const dataFloorRoom = [
    {
      floor: 2,
      room: "Phòng 201"
    },
    {
      floor: 2,
      room: "Phòng 202"
    },
    {
      floor: 2,
      room: "Phòng 203"
    },
    {
      floor: 3,
      room: "Phòng 301"
    },
    {
      floor: 3,
      room: "Phòng 302"
    },
    {
      floor: 3,
      room: "Phòng 303"
    }
  ];
  const mapped = dataFloorRoom.map((obj, index) => obj.floor);
  const floors = mapped.filter((type, index) => mapped.indexOf(type) === index);
  const [room, setRoom] = useState(dataFloorRoom.map((obj, index) => obj.room));
  const onFinish = (e) => {
    message.success('Thêm mới hợp đồng thành công');
    form.setFieldsValue({
      memberInRoom: dataMember,
    });
    console.log(e);
  }

  const addAssetFinish = (e) => {
    console.log(e);
    setAddAssetInRoom(false);
  }
  const addAssetFail = (e) => {
    setAddAssetInRoom(true);
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
              <div className="" style={{ overflow: "auto" }}>
                <Button htmlType="submit" style={{ float: "right" }} type="primary" form="create-contract">Lưu</Button>
                <Button href="/contract-renter" type="primary" style={{ marginRight: 5, float: "right" }}>Quay lại</Button>
              </div>
              <Form
                onFinish={onFinish}
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
                              setRoom(dataFloorRoom.filter(data => { return data.floor === e }))
                              setFloorRoom(pre => {
                                return { ...pre, floor: e }
                              })
                            }}
                            // onSearch={onSearch}
                            // filterOption={(input, option) => {
                            //   option.children.toLowerCase().includes(input.toLowerCase())
                            // }
                            // }
                            value={floorRoom?.floor}
                          >
                            {floors.map((obj, index) => {
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
                          <Select placeholder="Chọn phòng" disabled={roomStatus}>
                            {room.map((obj, index) => {
                              return <Select.Option key={index} value={obj.room}>{obj.room}</Select.Option>
                            })}
                          </Select>
                        </Form.Item>
                        <Form.Item className="form-item" name="contractType"
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
                        </Form.Item>
                        <Form.Item className="form-item" name="contractTerm"
                          labelCol={{ span: 24 }} label={<span><b>Thời hạn hợp đồng (Ít nhất 1 tháng): </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn thời hạn hợp đồng",
                            }
                          ]}
                        >
                          <Select placeholder="Thời hạn hợp đồng">
                            <Option value="1 month">1 tháng</Option>
                            <Option value="2 months">2 tháng</Option>
                            <Option value="3 months">3 tháng</Option>
                            <Option value="4 months">4 tháng</Option>
                            <Option value="5 months">5 tháng</Option>
                            <Option value="6 months">6 tháng</Option>
                            <Option value="7 months">7 tháng</Option>
                            <Option value="8 months">8 tháng</Option>
                            <Option value="9 months">9 tháng</Option>
                            <Option value="10 months">10 tháng</Option>
                            <Option value="11 months">11 tháng</Option>
                            <Option value="1 year">1 năm</Option>
                            <Option value="2 year">2 năm</Option>
                            <Option value="3 year">3 năm</Option>
                            <Option value="4 year">4 năm</Option>
                            <Option value="5 year">5 năm</Option>
                            <Option value="5 year">Vô thời hạn</Option>
                          </Select>
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
                            <Option value="1 month">1 tháng</Option>
                            <Option value="2 months">2 tháng</Option>
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
                        <Form.Item className="form-item" name="startDate"
                          labelCol={{ span: 24 }} label={<span><b>Ngày hợp đồng có hiệu lực: </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn ngày vào ở",
                            }
                          ]}>
                          <DatePicker style={{ width: "100%" }} placeholder="Ngày vào ở" defaultValue={moment()} format='DD/MM/YYYY' />
                        </Form.Item>
                        <Form.Item className="form-item" name="endDate"
                          labelCol={{ span: 24 }} label={<span><b>Ngày kết thúc: </b></span>}>
                          <DatePicker style={{ width: "100%" }} placeholder="Ngày kết thúc" format='DD/MM/YYYY' />
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
                          <p><b>Các thông tin về dịch vụ </b></p>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Form.Item className="form-item" name="electricityIndex"
                          labelCol={1}
                          label={<span><b>Chỉ số điện hiện tại </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập chỉ số điện hiện tại",
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
                      </Col>
                      <Col span={8}>
                        <Form.Item className="form-item" name="waterIndex"
                          labelCol={1}
                          label={<span><b>Chỉ số nước hiện tại </b></span>}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập chỉ số nước hiện tại",
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
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Table
                          rowKey={(record) => record.key}
                          dataSource={dataService}
                          columns={columnsService}>
                        </Table>
                      </Col>
                      <p><i><b>Lưu ý:</b><br />
                        - Trên đây là dịch vụ chung áp dụng cho tất cả các phòng trong một tòa nhà.<br />
                        - Nếu bạn muốn thay đổi dịch vụ chung này cần vào mục <b>Quản Lý Dịch Vụ Chung</b>
                        <br />
                      </i></p>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Thành viên" key="3">
                    <Row>
                      <Col span={23}>
                        <Form.Item className="form-item" name="memberInRoom"
                          labelCol={{ span: 24 }}>
                          <p><b>Các thông tin về thành viên trong phòng </b></p>
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <PlusCircleOutlined style={{ fontSize: 36, marginBottom: 20, color: "#1890ff" }} onClick={() => {
                          onAddMem()
                        }} />
                      </Col>
                      <Table style={{ width: '100%' }}
                        dataSource={dataMember}
                        columns={columnsMember}>
                      </Table>
                    </Row>
                    <Modal
                      title="Thông tin thành viên"
                      visible={isEditing}
                      preserve={false}
                      id="formEditMem"
                      destroyOnClose
                      onCancel={() => {
                        resetEditingCl();
                      }}
                      onOk={(e) => {
                        setDataMember(pre => {
                          return pre.map(member => {
                            if (member.id === editingMember.id) {
                              return editingMember;
                            } else {
                              return member;
                            }
                          });
                        });
                        validateEditMem(editingMember);
                      }}

                      footer={[
                        <Button htmlType="submit" key="submit" form="formEditMem" type="primary" onClick={(e) => {
                          setDataMember((pre) => {
                            return pre.map(renter => {
                              if (renter.id === editingMember.id) {
                                return editingMember;
                              } else {
                                return renter;
                              }
                            });
                          });
                          validateEditMem(editingMember);
                        }}>
                          Lưu
                        </Button>,
                        <Button key="back" onClick={resetEditingCl}>

                          Huỷ
                        </Button>,
                      ]}
                    >
                      <Form
                        id="formEditMem"
                        preserve={false}
                        form={formEditMem}
                        destroyOnClose
                      >
                        <Form.Item
                          name="member"
                          label="Họ và tên"
                          rules={[
                            {
                              required: true,
                              message: 'Chưa điền họ và tên',
                            },
                          ]}

                        >
                          <Input disabled={true} value={editingMember?.member} />
                        </Form.Item>
                        <Form.Item
                          name="gender"
                          label="Giới tính"
                          rules={[
                            {
                              required: true,
                              message: 'Chưa chọn giới tính',
                            },
                          ]}

                        >
                          <Radio.Group value={editingMember?.gender} disabled={true}>
                            <Radio value={"Nam"}>Nam</Radio>
                            <Radio value={"Nữ"}>Nữ</Radio>

                          </Radio.Group>
                        </Form.Item>
                        <Form.Item
                          name="phone"
                          label="Số điện thoại"
                          rules={[
                            {
                              required: true,
                              message: 'Chưa điền số điện thoại',
                            },
                            {
                              len: 10,
                              message: "Số điện thoại phải có 10 chữ số"
                            },
                            {
                              pattern: /^[0-9]*$/,
                              message: "Số điện thoại không chứa chữ"

                            }

                          ]}


                        >
                          <Input value={editingMember?.phone}
                            onChange={(e) => {
                              setEditingMember(pre => {
                                return { ...pre, phone: e.target.value }
                              })
                            }}
                            style={{
                              width: '100%',
                            }}
                          />
                        </Form.Item>

                        <Form.Item
                          name="cmnd"
                          label="CMND/CCCD"
                          rules={[
                            {
                              required: false,
                              message: 'Chưa điền CMND/CCCD',
                            },
                          ]}

                        >
                          <Input disabled={true} value={editingMember?.cmnd}

                            style={{
                              width: '100%',
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          name="car_number"
                          label="Số xe"
                          rules={[
                            {
                              required: false,
                              message: 'Chưa điền số xe',
                            },
                          ]}

                        >
                          <Input
                            value={editingMember?.car_number}
                            onChange={(e) => {
                              setEditingMember(pre => {
                                return { ...pre, car_number: e.target.value }
                              })
                            }}
                            style={{
                              width: '100%',
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          name="address"
                          label="Địa chỉ"
                          rules={[
                            {
                              required: false,
                              message: 'Chưa điền địa chỉ',
                            },
                          ]}
                        >
                          <Input disabled={true}
                            value={editingMember?.address}

                            style={{
                              width: '100%',
                            }}
                          />
                        </Form.Item>
                      </Form>
                    </Modal>
                    <Modal
                      title="Thêm thành viên"
                      visible={isAddMem}
                      preserve={false}
                      onCancel={
                        resetAddMemCl
                      }
                      id="formAddMem"
                      destroyOnClose
                      onOk={resetAddMem}
                      width={700}
                      footer={[
                        <Button htmlType="submit" key="submit" form="formAddMem" type="primary" onClick={validateMem}>
                          Lưu
                        </Button>,
                        <Button key="back" onClick={resetAddMemCl}>
                          Huỷ
                        </Button>,
                      ]}
                    >
                      <Form
                        id="formAddMem"
                        preserve={false}
                        form={formAddMem}
                        destroyOnClose
                      >
                        <Form.Item
                          name="member"
                          label="Họ và tên"
                          rules={[
                            {
                              required: true,
                              message: 'Chưa điền họ và tên',
                            },
                          ]}

                        >
                          <Input onChange={(e) => setNMember(e.target.value)} />
                        </Form.Item>

                        <Form.Item
                          name="gender"
                          label="Giới tính"
                          rules={[
                            {
                              required: true,
                              message: 'Chưa chọn giới tính',
                            },
                          ]}

                        >
                          <Radio.Group onChange={(e) => setNGender(e.target.value)}>
                            <Radio value="Nam">Nam</Radio>
                            <Radio value="Nữ">Nữ</Radio>

                          </Radio.Group>
                          {/* <Radio.Group options={plainOptions} onChange={(e) => setNGender(e.target.value)} value={valueGender} />
                          <br /> */}
                        </Form.Item>
                        <Form.Item
                          name="phone"
                          label="Số điện thoại"

                          rules={[
                            {
                              required: true,
                              message: 'Chưa điền số điện thoại',
                            },
                            {
                              len: 10,
                              message: "Số điện thoại phải có 10 chữ số"
                            },
                            {
                              pattern: /^[0-9]*$/,
                              message: "Số điện thoại không chứa chữ"

                            }

                          ]}

                        >
                          <Input
                            style={{
                              width: '100%',
                            }}
                            onChange={(e) => setNPhone(e.target.value)}
                          />
                        </Form.Item>
                        <Form.Item
                          name="cmnd"
                          label="CMND/CCCD"
                          rules={[
                            {
                              required: false,
                              message: 'Chưa điền CMND/CCCD',
                            },

                            {
                              len: 12,
                              message: "CMND/CCCD phải có 12 chữ số"
                            },
                            {
                              pattern: /^[0-9]*$/,
                              message: "CMND/CCCD không chứa chữ"

                            }
                          ]}

                        >
                          <Input
                            style={{
                              width: '100%',
                            }}
                            onChange={(e) => setNCmnd(e.target.value)}
                          />
                        </Form.Item>
                        <Form.Item
                          name="car_number"
                          label="Biển số xe"


                        >
                          <Input
                            style={{
                              width: '100%',
                            }}
                            onChange={(e) => setNCarNumber(e.target.value)}
                          />
                        </Form.Item>
                        <Form.Item
                          name="address"
                          label="Địa chỉ"

                        >
                          <Input
                            style={{
                              width: '100%',
                            }}
                            onChange={(e) => setNAddress(e.target.value)}
                          />
                        </Form.Item>
                      </Form>
                    </Modal>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Tài sản" key="4">
                    <Row>
                      <Col span={24}>
                        <Form.Item className="form-item" name="asset"
                          labelCol={{ span: 24 }}>
                          <p><b>Thông tin tài sản bàn giao tòa A, tầng 5, phòng 501</b></p>
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
                              <Col span={4}>
                                <Checkbox>Đồ phòng ngủ</Checkbox>
                              </Col>
                              <Col span={4}>
                                <Checkbox>Đồ phòng khách</Checkbox>
                              </Col>
                              <Col span={4}>
                                <Checkbox>Đồ phòng bếp</Checkbox>
                              </Col>
                              <Col span={4}>
                                <Checkbox>Đồ phòng tắm</Checkbox>
                              </Col>
                              <Col span={4}>
                                <Checkbox>Khác</Checkbox>
                              </Col>
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
                            rowKey={(record) => record.index}
                            rowSelection={{
                              onSelect: (record) => {
                                // arrayAsset.push({ ...record });
                                // const b = arrayAsset.filter((ele, ind) => ind === arrayAsset.findIndex(elem => elem.index === ele.index && elem.assetName === ele.assetName))
                                // console.log(record);
                              },
                              onChange: (record) => {
                                form.setFieldsValue({
                                  asset: record.map(indexAsset => dataSource.find(obj => obj.index === indexAsset)),
                                });
                              }
                            }}
                            dataSource={dataSource}
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
                      <Select.Option value={"bedRoomItem"}>Đồ phòng ngủ</Select.Option>
                      <Select.Option value={"livingRoomItem"}>Đồ phòng khách</Select.Option>
                      <Select.Option value={"kitchenItem"}>Đồ phòng bếp</Select.Option>
                      <Select.Option value={"bathRoomItem"}>Đồ phòng tắm</Select.Option>
                      <Select.Option value={"others"}>khác</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item className="form-item" name="asset_value"
                    labelCol={{ span: 24 }} label={<span><b>Giá trị tài sản</b></span>}>
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
            </div>
          </Content>
        </Layout>
      </Layout >
    </div >
  );
};
export default CreateContractRenter
