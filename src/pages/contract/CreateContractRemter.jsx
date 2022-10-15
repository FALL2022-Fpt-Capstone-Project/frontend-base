import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import axios from "axios";
import { EditOutlined, DeleteOutlined, UploadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, Form, Table, Space, Input, Select, Tabs, Row, Col, Radio, DatePicker, Upload, Tag, Checkbox, InputNumber, AutoComplete, Switch, message } from "antd";
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
  const [isAddService, setisAddService] = useState(false);
  const [formEditMem] = Form.useForm();
  const [formAddMem] = Form.useForm();
  const [formAddService] = Form.useForm();
  const [valueGender, setValueGender] = useState('Nam');

  const plainOptions = ['Nam', 'Nữ'];
  const options = [
    {
      label: 'Nam',
      value: 'nam',
    },
    {
      label: 'Nữ',
      value: 'nữ',
    },
  ]

  const validateMem = (e) => {

    // setisEditing(false)
    if (nMember !== "" && nPhone !== "" && nGender !== "" && nCmnd !== "" && nCarNumber !== "" && nAddress !== "") {
      console.log('in');
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
      console.log('Received values of form: ', newMember)

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

  const onFinish = (e) => {
    console.log(e);
  }
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const columns = [
    {
      title: 'Tầng',
      dataIndex: 'floor',
      key: 'index',
      filteredValue: [searched],
      onFilter: (value, record) => {
        return (
          String(record.floor).toLowerCase()?.includes(value.toLowerCase()) &&
          String(record.roomCode).toLowerCase()?.includes(value.toLowerCase()) &&
          String(record.assetName).toLowerCase()?.includes(value.toLowerCase())
        );
      },
    },
    {
      title: 'Phòng',
      dataIndex: 'roomCode',
      key: 'index',
    },
    {
      title: 'Tên tài sản',
      dataIndex: 'assetName',
      key: 'index',
    },
    {
      title: 'Số lượng',
      dataIndex: 'numberOfAsset',
      key: 'index',
    },
    {
      title: 'Ngày bàn giao',
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
    },
  ];

  const oldUser = [];
  const userColumn = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'index',
      filteredValue: [searched],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase()?.includes(value.toLowerCase()) &&
          String(record.phoneNumber).toLowerCase()?.includes(value.toLowerCase()) &&
          String(record.identityCard).toLowerCase()?.includes(value.toLowerCase()) &&
          String(record.email).toLowerCase()?.includes(value.toLowerCase())
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
        floor: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
        roomCode: i.toString(),
        assetName: `Tài sản ${i}`,
        numberOfAsset: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
        dateOfDelivery: `30/09/2022`,
        status: true,
      });
    } else {
      asset.push({
        index: i,
        floor: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
        roomCode: i.toString(),
        assetName: `Tài sản ${i}`,
        numberOfAsset: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
        dateOfDelivery: `30/09/2022`,
        status: false,
      });
    }
  }
  const [dataSource, setDataSource] = useState(asset);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
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
    console.log(dataOldUser.name);
    form.setFieldsValue({
      contractName: dataOldUser.name,
      renterName: dataOldUser.name

    });
    setisAdd(false);
  }

  const columnsService = [
    {
      title: 'Dịch vụ sử dụng',
      dataIndex: 'service',
      key: 'service',
      editable: true,
    },
    {
      title: 'Đơn giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (record) => {
        return (
          <>

            <Input placeholder={record}></Input>
          </>
        )
      }
    },
    {
      title: 'Chỉ số ban đầu',
      dataIndex: 'first_number',
      key: 'first_number',
      render: (record) => {
        return (
          <>
            <Input placeholder={record} />
          </>
        )
      }
    },

    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
      render: (record) => {

        return (
          <>
            <InputNumber placeholder={record} />
          </>
        )
      }
    },

    {
      title: "Thao tác",
      dataIndex: "thaotac",
      align: "center",
      render: (_, record) =>
      (
        <Space>

          <DeleteOutlined onClick={() => onDeleteService(record)} style={{ color: "red", marginLeft: 12 }} />

        </Space>
      )
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
  const [newService, setNewService] = useState([]);
  const [nService, setNService] = useState("");
  const [nPrice, setNPrice] = useState("");
  const [nAmount, setNAmount] = useState("");
  const [nFirstNumber, setNFirstNumber] = useState("");

  const member = [];
  member.push(
    {
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
  )

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

  const onDeleteService = (record) => {
    Modal.confirm({
      title: `Bạn có chắc chắn muốn xóa dịch vụ ${record.service} không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        setDataService(pre => {
          return pre.filter((service) => service.id !== record.id);
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
      address: record.address

    });
  }

  const resetEditing = () => {
    setisEditing(false);
    setEditingMember(null);

  }

  const resetEditingCl = () => {

    setisEditing(false);

  }

  const onAddService = () => {
    setisAddService(true);
  }



  const onAddMem = () => {
    setisAddMem(true);
  }

  const resetAddMemCl = () => {
    setisAddMem(false);
  }

  const resetAddServiceCl = () => {
    setisAddService(false);
  }

  const resetAddMem = (e) => {
    if (nMember !== "" && nPhone !== "" && nGender !== "" && nCmnd !== "" && nCarNumber !== "" && nAddress !== "") {
      console.log('in');
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
      console.log('Received values of form: ', newMember)

      setDataMember([...dataMember, newMember]);
      setNMember("")
      setisAddMem(false);
    }
    setisAddMem(true);


  }

  const resetAddService = (e) => {
    if (nService !== "" && nPrice !== "" && nFirstNumber !== "" && nAmount !== "") {
      const randomId = parseInt(Math.random() * 1000);
      let newService = {
        id: randomId,
        service: nService,
        price: nPrice,
        first_number: nFirstNumber,
        amount: nAmount,

      }
      console.log('Received values of form: ', newService)
      setDataService([...dataService, newService]);
      setNService("")
      setNPrice("")
      setNFirstNumber("")
      setNAmount("")
      setisAddService(false);
    } else {
      setisAddService(true)
    }

  }

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


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
            }}
          >
            <div
              className="site-layout-background"
              style={{
                minHeight: 360,
              }}
            >
              <div className="" style={{ overflow: "auto" }}>
                <Button htmlType="submit" style={{ float: "right" }} type="primary" form="create-contract">Lưu</Button>
                <Button type="primary" style={{ marginRight: 5, float: "right" }}>Quay lại</Button>
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
                        <Form.Item className="form-item" name="contractName">
                          <span><b>Tên hợp đồng: </b></span>
                          <Input
                            value={dataOldUser?.name} placeholder="Tên hợp đồng"
                            onChange={(e) => {
                              setDataOldUser(pre => {
                                return { ...pre, contractName: e.target.value }
                              })
                            }}>
                          </Input>
                        </Form.Item>
                        <Form.Item className="form-item" name="renterName" rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên khách thuê",
                          }
                        ]}>
                          <span><b>Tên khách thuê: </b></span>
                          <Input
                            value={editContract?.name}
                            placeholder="Tên khách thuê" onChange={(e) => {
                              setEditContract(pre => {
                                return { ...pre, renterName: e.target.value }
                              })
                            }}>
                          </Input>
                        </Form.Item>
                        <Form.Item className="form-item" name="sex">
                          <Radio.Group>
                            <Radio value={1}>Nam</Radio>
                            <Radio value={2}>Nữ</Radio>
                          </Radio.Group>
                        </Form.Item>
                        <Form.Item className="form-item" name="oldCustomer">
                          <Button type="primary" size="default"
                            onClick={() => {
                              onAdd()
                            }}>Khách cũ</Button>
                        </Form.Item>
                        <Form.Item className="form-item" name="phoneNumber">
                          <span><b>Số điện thoại: </b></span>
                          <Input
                            placeholder="Số điện thoại">
                          </Input>
                        </Form.Item>
                        <Form.Item className="form-item" name="email">
                          <span><b>Email: </b></span>
                          <Input
                            placeholder="Email">
                          </Input>
                        </Form.Item>
                        <Form.Item className="form-item" name="identityCard">
                          <span><b>CCCD/CMND: </b></span>
                          <Input
                            placeholder="CCCD/CMND" >
                          </Input>
                        </Form.Item>
                        <Row>
                          <Col span={9}>
                            <span><b>Tầng: </b></span>
                            <Form.Item className="form-item" name="floor">
                              <Select placeholder="Chọn tầng">
                                <Option value="">Tầng 1</Option>
                                <Option value="">Tầng 2</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <span><b>Phòng: </b></span>
                            <Form.Item className="form-item" name="room">
                              <Select placeholder="Chọn phòng">
                                <Option value="">201C</Option>
                                <Option value="">203C</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item className="form-item" name="contractTerm">
                          <span><b>Thời hạn hợp đồng: </b></span>
                          <Select placeholder="Thời hạn hợp đồng">
                            <Option value="6">6 tháng</Option>
                            <Option value="1">1 năm</Option>
                          </Select>
                        </Form.Item>
                        <Row>
                          <Col span={9}>
                            <span><b>Ngày vào ở: </b></span>
                            <Form.Item className="form-item" name="startDate">
                              <DatePicker placeholder="Ngày vào ở" />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <span><b>Ngày kết thúc: </b></span>
                            <Form.Item className="form-item" name="endDate">
                              <DatePicker placeholder="Ngày kết thúc" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item className="form-item" name="note">
                          <span><b>Ghi chú: </b></span>
                          <TextArea rows={4} placeholder="Ghi chú" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <p><b>Thông tin giá trị hợp đồng: </b></p>
                        <Form.Item className="form-item" name="roomPrice">
                          <span><b>Giá phòng: </b></span>
                          <Input
                            placeholder="Giá phòng">
                          </Input>
                        </Form.Item>
                        <Form.Item className="form-item" name="depositAmount">
                          <span><b>Số tiền cọc: </b></span>
                          <Input
                            placeholder="Số tiền cọc">
                          </Input>
                        </Form.Item>
                        <Form.Item className="form-item" name="billCycle">
                          <span><b>Chu kỳ tính tiền: </b></span>
                          <Select placeholder="Chu kỳ tính tiền" style={{ width: "100%" }}>
                            <Option value="1">1 tháng</Option>
                            <Option value="2">2 tháng</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item className="form-item" name="paymentCycle">
                          <span><b>Chu kỳ thanh toán: </b></span>
                          <Select placeholder="Kỳ thanh toán" style={{ width: "100%" }}>
                            <Option value="15">kỳ 15</Option>
                            <Option value="30">kỳ 30</Option>
                          </Select>
                        </Form.Item>
                        <p><i>Tập tin và hình ảnh upload thả vào đây</i></p>
                        <Form.Item className="form-item" name="file">
                          <Upload>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Row>
                    <p>Lưu ý:<br />
                      - Kỳ thanh toán tùy thuộc vào từng khu nhà trọ, nếu khu trọ bạn thu tiền 1 lần vào cuối tháng thì bạn chọn là kỳ 30. Trường hợp khu nhà trọ bạn có số lượng phòng nhiều, chia làm 2 đợt thu, bạn dựa vào ngày vào của khách để gán kỳ cho phù hợp, ví dụ: vào từ ngày 1 đến 15 của tháng thì gán kỳ 15; nếu vào từ ngày 16 đến 31 của tháng thì gán kỳ 30. Khi tính tiền phòng bạn sẽ tính tiền theo kỳ.<br />
                      - Tiền đặt cọc sẽ không tính vào doanh thu ở các báo cáo và thống kê doanh thu. Nếu bạn muốn tính vào doanh thu bạn ghi nhận vào trong phần thu/chi khác (phát sinh). Tiền đặt cọc sẽ được trừ ra khi tính tiền trả phòng.<br />
                      - Các thông tin có giá trị là ngày nhập đủ ngày tháng năm và đúng định dạng dd/MM/yyyy (ví dụ: 01/12/2020)<br />
                      - Chu kỳ tính tiền: là số tháng được tính trên mỗi hóa đơn.<br />
                    </p>
                    <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Dịch vụ" key="2">
                    <p><b>Các thông tin về dịch vụ </b></p>
                    <PlusCircleOutlined style={{ fontSize: 36, marginBottom: 20, color: "blue" }} onClick={() => {
                      onAddService()
                    }} />
                    <Row>
                      <Col span={24}>

                        <Table
                          rowSelection={rowSelection}
                          dataSource={dataService}
                          columns={columnsService}>
                        </Table>
                      </Col>
                      <p>Lưu ý:<br />
                        - Vui lòng chọn dịch vụ cho khách thuê. Nếu khách có chọn dịch vụ thì khi tính tiền phòng phần mềm sẽ tự tính các khoản phí vào hóa đơn; ngược lại nếu không chọn phần mềm sẽ bỏ qua.<br />
                        - Đối với dịch vụ là loại điện/ nước thì sẽ tính theo chỉ số điện/ nước
                        <br />
                      </p>
                    </Row>
                    <Modal
                      title="Thêm dịch vụ"
                      visible={isAddService}
                      onCancel={
                        resetAddServiceCl
                      }
                      id="formAddService"
                      destroyOnClose
                      onOk={resetAddService}
                      width={700}
                      footer={[
                        <Button htmlType="submit" key="submit" form="formAddService" type="primary" onClick={resetAddService}>
                          Lưu
                        </Button>,
                        <Button key="back" onClick={resetAddServiceCl}>
                          Huỷ
                        </Button>,
                      ]}
                    >
                      <Form id="formAddService"
                        preserve={false}
                        destroyOnClose={true}
                        form={formAddService}
                        name="addService"
                        onChange={(e) => setNAddress()}
                      >
                        <Form.Item
                          name="service"
                          label="Tên dịch vụ"
                          rules={[
                            {
                              required: true,
                              message: 'Chưa điền tên dịch vụ',
                            },
                          ]}
                          onChange={(e) => setNService(e.target.value)}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="price"
                          label="Đơn giá"
                          rules={[
                            {
                              required: true,
                              message: 'Chưa điền đơn giá',
                            },
                            {
                              pattern: /^[0-9]*$/,
                              message: "Đơn giá sai"
                            }
                          ]}
                          onChange={(e) => setNPrice(e.target.value)}
                        >
                          <Input
                            style={{
                              width: '100%',
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          name="first_number"
                          label="Chỉ số hiện tại"
                          rules={[
                            {
                              required: false,
                              message: 'Chưa điền chỉ số',
                            },
                            {
                              pattern: /^[0-9]*$/,
                              message: "Chỉ số sai"
                            }
                          ]}
                          onChange={(e) => setNFirstNumber(e.target.value)}
                        >
                          <Input
                            style={{
                              width: '100%',
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          name="amount"
                          label="Số lượng"
                          rules={[
                            {
                              required: true,
                              message: 'Chưa điền số lượng',
                            },
                            {
                              pattern: /^[0-9]*$/,
                              message: "Số lượng sai"
                            }
                          ]}
                          onChange={(e) => setNAmount(e.target.value)}
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
                  <Tabs.TabPane tab="Thành viên" key="3">
                    <p><b>Các thông tin về thành viên </b></p>
                    <PlusCircleOutlined style={{ fontSize: 36, marginBottom: 20, color: "blue" }} onClick={() => {
                      onAddMem()
                    }} />
                    <Table style={{ width: '100%' }}

                      dataSource={dataMember}
                      columns={columnsMember}>
                    </Table>
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
                        <p><b>Thông tin tài sản bàn giao</b></p>
                        <Input.Search placeholder="Tìm kiếm" style={{ marginBottom: 8, width: "30%" }}
                          onSearch={(e) => {
                            setSearched(e);
                          }}
                          onChange={(e) => {
                            setSearched(e.target.value);
                          }}
                        />
                        <Table
                          dataSource={dataSource}
                          columns={columns}
                          scroll={{ x: 800, y: 600 }}
                        >

                        </Table>
                      </Col>
                    </Row>
                    <Row>
                      <p><i>Tập tin và hình ảnh upload thả vào đây</i></p>
                    </Row>
                    <Row>
                      <Upload>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                      </Upload>
                    </Row>
                  </Tabs.TabPane>
                </Tabs>
              </Form>
              <Modal
                title="Khách hàng cũ"
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
                    <Input.Search placeholder="Tìm kiếm" style={{ marginBottom: 8, width: "30%" }}
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
    </div >
  );
};

export default CreateContractRenter;
