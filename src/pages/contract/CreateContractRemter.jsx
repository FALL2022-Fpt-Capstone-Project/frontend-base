import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import axios from "axios";
import { EditOutlined, DeleteOutlined, UploadOutlined, PlusCircleOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
  Button, Layout, Modal, Form, Table, Space, Input, Select,
  Tabs, Row, Col, Radio, DatePicker, Upload, Tag, Checkbox, InputNumber, AutoComplete, Switch, message, Spin
} from "antd";
import TextArea from "antd/lib/input/TextArea";
const { Content, Sider, Header } = Layout;
const { Option } = Select;


const CreateContractRenter = () => {
  const asset = [];
  const [searched, setSearched] = useState("");
  const [isAdd, setisAdd] = useState(false);
  const [componentSize, setComponentSize] = useState('default');
  const [dataOldUser, setDataOldUser] = useState([]);
  const [editContract, setEditContract] = useState([]);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isEditing, setisEditing] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [addingMember, setAddingMember] = useState(null);
  const [isAddMem, setisAddMem] = useState(false);
  const [formEdit] = Form.useForm();
  const [formAdd] = Form.useForm();

  const onFinish = (e) => {
    message.success('Thêm mới hợp đồng thành công');
    console.log(JSON.stringify(e));
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
            <EyeOutlined />
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
      title: `Bạn có chắc chắn muốn xóa ${record.assetName} trong phòng ${record.roomCode} này ?`,
      okText: 'Có',
      cancelText: 'Hủy',
      onOk: () => {
        setDataSource(pre => {
          return pre.filter((asset) => asset.index !== record.index)
        })
      },
    })
  }

  const oldUser = [];
  const userColumn = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'index',
      filteredValue: [searched],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase()?.includes(value.toLowerCase())
        );
      },
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      key: 'index',
    },
    {
      title: 'Gmail',
      dataIndex: 'email',
      key: 'index',
    },
    {
      title: 'CCCD/CMND',
      dataIndex: 'identityCard',
      key: 'index',
    },
  ];
  for (let i = 1; i < 51; i++) {
    oldUser.push({
      index: i,
      name: `user${i}`,
      phoneNumber: `012345678${i}`,
      email: `user${i}@gmail.com`,
      identityCard: `03120000099${i}`
    });

  }
  for (let i = 1; i < 100; i++) {
    if ((Math.floor(Math.random() * (100 - 1 + 1)) + 1) % 2 === 0) {
      asset.push({
        index: i,
        assetName: `Tài sản ${i}`,
        numberOfAsset: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
        typeOfAsset: 'Đồ phòng ngủ',
        dateOfDelivery: `30/09/2022`,
        status: true,
      });
    } else {
      asset.push({
        index: i,
        assetName: `Tài sản ${i}`,
        numberOfAsset: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
        typeOfAsset: 'Đồ phòng khách',
        dateOfDelivery: `30/09/2022`,
        status: false,
      });
    }
  }
  const [dataSource, setDataSource] = useState(asset);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onChangeAutoCheck = (value) => {
    console.log(`switch ${value}`);
  }
  const onSearch = (value) => {
    console.log('search:', value);
  };
  const onAdd = (record) => {
    setisAdd(true);
  }
  const resetAdd = () => {
    setisAdd(false);
  }
  const onOk = () => {
    form.setFieldsValue({
      renterName: dataOldUser.name,
      phoneNumber: dataOldUser.phoneNumber,
      email: dataOldUser.email,
      identityCard: dataOldUser.identityCard,
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
      key: 'service',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Chỉ số ban đầu',
      dataIndex: 'first_number',
      key: 'first_number',
      render: (record) => {

        return (
          <>
            <Input />
          </>
        )
      }
    }
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
      title: "Số xe",
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



  const service = [];
  service.push(
    {
      key: 1,
      service: "Tiền điện",
      price: "3000",
      unit: "đ/KwH",
      amount: "1",

    },
    {
      key: 2,
      service: "Tiền nước",
      price: "2000",
      unit: "đ/Khối",
      amount: "1",

    },
    {
      key: 3,
      service: "Gửi xe",
      price: "5000",
      unit: "đ/lượt/xe",
      amount: "1",
    });

  const [dataService, setDataService] = useState(service);

  const member = [];
  member.push(
    {
      id: 1,
      member: "Nguyễn Văn B",
      phone: "0645138795",
      cmnd: "001856447953",
      car_number: "30H-06789",
      address: "Hà Nội",
    },
    {
      id: 2,
      member: "Chu Đình A",
      phone: "069413895",
      cmnd: "001856743684",
      car_number: "30H-01259",
      address: "Hà Nội",
    }
  )

  const [dataMember, setDataMember] = useState(member);
  const [newMember, setNewMember] = useState([]);
  const [nMember, setNMember] = useState("");
  const [nPhone, setNPhone] = useState("");
  const [nCmnd, setNCmnd] = useState("");
  const [nCarNumber, setNCarNumber] = useState("");
  const [nAddress, setNAddress] = useState("");



  const onDeleteMember = (record) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa không?",
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
    formEdit.setFieldsValue({
      member: record.member,
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

  const onAddMem = () => {
    setisAddMem(true);
    setAddingMember("");
  }

  const resetAddMemCl = () => {
    setisAddMem(false);
  }

  const resetAddMem = (e) => {
    const randomId = parseInt(Math.random() * 1000);
    let newMember = {
      id: randomId,
      member: nMember,
      phone: nPhone,
      cmnd: nCmnd,
      car_number: nCarNumber,
      address: nAddress,
    }

    setDataMember([...dataMember, newMember]);
    setNMember('');
    setNPhone('');
    setNCmnd('');
    setNAddress('');
    setNCarNumber('');
    setisAddMem(false);

  }

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
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
                      <Col span={12}>
                        <p><b>Các thông tin về khách và tiền cọc: </b></p>
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
                              setDataOldUser(pre => {
                                return { ...pre, name: e.target.value }
                              })
                            }}>
                          </Input>
                        </Form.Item>
                        <Form.Item className="form-item" name="sex">
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
                              setDataOldUser(pre => {
                                return { ...pre, phoneNumber: e.target.value }
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
                              setDataOldUser(pre => {
                                return { ...pre, email: e.target.value }
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
                              setDataOldUser(pre => {
                                return { ...pre, identityCard: e.target.value }
                              })
                            }}>
                          </Input>
                        </Form.Item>
                        <Row>
                          <Col span={9}>
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
                          </Col>
                          <Col span={9}>
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
                          </Col>
                        </Row>
                        <Form.Item className="form-item" name="contractTerm"
                          labelCol={{ span: 24 }} label={<span><b>Thời hạn hợp đồng: </b></span>}
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
                          </Select>
                        </Form.Item>
                        <Row>
                          <Col span={9}>
                            <Form.Item className="form-item" name="startDate"
                              labelCol={{ span: 24 }} label={<span><b>Ngày vào ở: </b></span>}
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn ngày vào ở",
                                }
                              ]}>
                              <DatePicker placeholder="Ngày vào ở" defaultValue={moment()} format='DD/MM/YYYY' />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <Form.Item className="form-item" name="endDate"
                              labelCol={{ span: 24 }} label={<span><b>Ngày kết thúc: </b></span>}
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng chọn ngày kết khúc",
                                }
                              ]}>
                              <DatePicker placeholder="Ngày kết thúc" format='DD/MM/YYYY' />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item className="form-item" name="note"
                          labelCol={{ span: 24 }} label={<span><b>Ghi chú: </b></span>}>
                          <TextArea rows={4} placeholder="Ghi chú" value={""} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <p><b>Thông tin giá trị hợp đồng: </b></p>
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
                          />
                        </Form.Item>
                        <Form.Item className="form-item" name="billCycle"
                          labelCol={{ span: 24 }} label={<span><b>Chu kỳ tính tiền: </b></span>}
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
                        <Form.Item className="form-item" name="autoRenewContract"
                          labelCol={{ span: 24 }} label={<span><b>Tự động gia hạn hợp đồng:  </b></span>}>
                          <Switch defaultChecked onChange={onChangeAutoCheck} />
                        </Form.Item>
                        <p><i>Tập tin và hình ảnh upload thả vào đây</i></p>
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
                        </Form.Item>
                      </Col>
                    </Row>
                    <p><i>Lưu ý:<br />
                      - Kỳ thanh toán tùy thuộc vào từng khu nhà trọ, nếu khu trọ bạn thu tiền 1 lần vào cuối tháng thì bạn chọn là kỳ 30. Trường hợp khu nhà trọ bạn có số lượng phòng nhiều, chia làm 2 đợt thu, bạn dựa vào ngày vào của khách để gán kỳ cho phù hợp, ví dụ: vào từ ngày 1 đến 15 của tháng thì gán kỳ 15; nếu vào từ ngày 16 đến 31 của tháng thì gán kỳ 30. Khi tính tiền phòng bạn sẽ tính tiền theo kỳ.<br />
                      - Tiền đặt cọc sẽ không tính vào doanh thu ở các báo cáo và thống kê doanh thu. Nếu bạn muốn tính vào doanh thu bạn ghi nhận vào trong phần thu/chi khác (phát sinh). Tiền đặt cọc sẽ được trừ ra khi tính tiền trả phòng.<br />
                      - Các thông tin có giá trị là ngày nhập đủ ngày tháng năm và đúng định dạng dd/MM/yyyy (ví dụ: 01/12/2020)<br />
                      - Chu kỳ tính tiền: là số tháng được tính trên mỗi hóa đơn.<br />
                    </i></p>
                    <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Dịch vụ" key="2">
                    <Row>
                      <Col span={24}>
                        <Table
                          rowSelection={rowSelection}
                          dataSource={dataService}
                          columns={columnsService}>
                        </Table>
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Thành viên" key="3">
                    <PlusCircleOutlined style={{ fontSize: 36, marginBottom: 20, color: "#1890ff" }} onClick={() => {
                      onAddMem()
                    }} />
                    <Table style={{ width: '100%' }}

                      dataSource={dataMember}
                      columns={columnsMember}>
                    </Table>

                    <Modal
                      title="Thông tin thành viên"
                      okText="Lưu"
                      cancelText="Hủy"
                      visible={isEditing}
                      onCancel={() => {
                        resetEditing();
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

                        resetEditing()

                      }}

                      footer={[
                        <Button htmlType="submit" form="editMember" type="primary" onClick={(e) => {
                          setDataMember((pre) => {
                            return pre.map(renter => {
                              if (renter.id === editingMember.id) {
                                return editingMember;
                              } else {
                                return renter;
                              }
                            });
                          });
                          resetEditing()
                        }}>
                          Lưu
                        </Button>,
                        <Button key="back" onClick={() => {
                          resetEditing();
                        }}>
                          Huỷ
                        </Button>,
                      ]}
                    >

                      <Form
                        form={formEdit}
                        name="edit"

                        scrollToFirstError
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

                          value={editingMember?.member}
                        >
                          <Input disabled={true} />
                        </Form.Item>


                        <Form.Item
                          name="phone"
                          label="Số điện thoại"
                          rules={[
                            {
                              required: true,
                              message: 'Chưa điền số điện thoại',
                            },
                          ]}
                          value={editingMember?.phone}
                          onChange={(e) => {
                            setEditingMember(pre => {
                              return { ...pre, phone: e.target.value }
                            })
                          }}
                        >
                          <Input

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
                              required: true,
                              message: 'Chưa điền CMND/CCCD',
                            },
                          ]}
                          value={editingMember?.cmnd}
                        >
                          <Input disabled={true}

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
                              required: true,
                              message: 'Chưa điền số xe',
                            },
                          ]}
                          value={editingMember?.car_number}
                          onChange={(e) => {
                            setEditingMember(pre => {
                              return { ...pre, car_number: e.target.value }
                            })
                          }}
                        >
                          <Input

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
                              required: true,
                              message: 'Chưa điền địa chỉ',
                            },
                          ]}
                          value={editingMember?.address}
                        >
                          <Input disabled={true}

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
                      onCancel={
                        resetAddMemCl
                      }
                      destroyOnClose={true}
                      onOk={resetAddMem}
                      width={700}
                      footer={[
                        <Button htmlType="submit" key="submit" form="formAdd" type="primary" onClick={resetAddMem}>
                          Lưu
                        </Button>,
                        <Button key="back" onClick={resetAddMemCl}>
                          Huỷ
                        </Button>,
                      ]}
                    >
                      <Form id="formAdd"
                        preserve={false}
                        form={formAdd}
                        name="add"
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
                          onChange={(e) => setNMember(e.target.value)}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="phone"
                          label="Số điện thoại"
                          rules={[
                            {
                              required: true,
                              message: 'Chưa điền số điện thoại',
                            },
                          ]}
                          onChange={(e) => setNPhone(e.target.value)}
                        >
                          <Input
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
                              required: true,
                              message: 'Chưa điền CMND/CCCD',
                            },
                          ]}
                          onChange={(e) => setNCmnd(e.target.value)}
                        >
                          <Input
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
                              required: true,
                              message: 'Chưa điền số xe',
                            },
                          ]}
                          onChange={(e) => setNCarNumber(e.target.value)}
                        >
                          <Input
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
                              required: true,
                              message: 'Chưa điền địa chỉ',
                            },
                          ]}
                          onChange={(e) => setNAddress(e.target.value)}
                        >
                          <Input
                            style={{
                              width: '100%',
                            }}
                          />
                        </Form.Item>
                      </Form>
                    </Modal>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Tài sản" key="4">
                    <Row>
                      <Col span={24}>
                        <p><b>Thông tin tài sản bàn giao tòa A, tầng 5, phòng 501</b></p>
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
                            <PlusCircleOutlined style={{ fontSize: 36, color: "#1890ff", float: "right" }} />
                          </Col>
                        </Row>
                        <Row>
                          <Table
                            rowKey={(record) => record.index}
                            rowSelection={{
                              onSelect: (record) => {
                                console.log(record);
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
                      <p><i>Lưu ý:<br />
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
                      columns={userColumn}
                      dataSource={oldUser}
                      scroll={{ x: 1000, y: 400 }}
                      rowKey={(record) => record.index}
                      rowSelection={{
                        type: 'radio',
                        onSelect: (record) => {
                          setDataOldUser({ ...record });
                        }
                      }}
                    />
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
