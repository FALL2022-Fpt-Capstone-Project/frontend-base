import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./contract.scss";
import axios from "axios";
import { EditOutlined, DeleteOutlined, UploadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, Form, Table, Space, Input, Select, Tabs, Row, Col, Radio, DatePicker, Upload, Tag, Checkbox, InputNumber, AutoComplete, Switch } from "antd";
import TextArea from "antd/lib/input/TextArea";
const { Content, Sider, Header } = Layout;
const { Option } = Select;

const CreateContractRenter = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isEditing, setisEditing] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [addingMember, setAddingMember] = useState(null);
  const [isAdd, setisAdd] = useState(false);
  const [formEdit] = Form.useForm();
  const [formAdd] = Form.useForm();

  const asset = [];
  const [searched, setSearched] = useState("");
  for (let i = 0; i < 100; i++) {
    if ((Math.floor(Math.random() * (100 - 1 + 1)) + 1) % 2 === 0) {
      asset.push({
        index: i + 1,
        floor: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
        roomCode: i.toString(),
        assetName: `Tài sản ${1}`,
        numberOfAsset: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
        dateOfDelivery: `30/09/2022`,
        status: true,
      });
    } else {
      asset.push({
        index: i + 1,
        floor: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
        roomCode: i.toString(),
        assetName: `Tài sản ${1}`,
        numberOfAsset: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
        dateOfDelivery: `30/09/2022`,
        status: false,
      });
    }
  }
  const [dataSource, setDataSource] = useState(asset);
  const columns = [
    {
      title: 'Tầng',
      dataIndex: 'floor',
      key: 'index',
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
    }
  ];


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
      address: record.address

    });
  }

  const resetEditing = () => {
    setisEditing(false);
    setEditingMember(null);
  }

  const onAdd = () => {
    setisAdd(true);
    setAddingMember("");
  }

  const resetAddCl = () => {
    setisAdd(false);
  }

  const resetAdd = (e) => {
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
    setisAdd(false);

  }

  console.log(nMember);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };



  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const validateRequired = (e) => {

    if (e.member !== null && e.phone !== null && e.car_number !== null) {

      resetEditing();
    }

  }

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
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
              <Row>
                <Button style={{ float: "right" }}>Lưu</Button>
                <Button style={{ marginRight: 5, float: "right" }}>Quay lại</Button>
              </Row>
              <Row>
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="Thông tin hợp đồng" key="1">
                    <Row>
                      <Col span={12} style={{ paddingRight: "10%" }}>
                        <Row style={{ marginBottom: 10 }}>
                          <Input
                            placeholder="Tên hợp đồng">
                          </Input>
                        </Row>
                        <Row>
                          <p><b>Thông tin hợp đồng với khách: </b></p>
                        </Row>
                        <Row>
                          <p><i>Các thông tin về khách và tiền cọc</i></p>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Input
                            placeholder="Tên khách thuê">
                          </Input>
                        </Row>
                        <Row>
                          <Radio.Group>
                            <Radio value={1}>Nam</Radio>
                            <Radio value={2}>Nữ</Radio>
                          </Radio.Group>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Button>Khách cũ</Button>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Input
                            placeholder="Số điện thoại">
                          </Input>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Input
                            placeholder="Gmail">
                          </Input>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Input
                            placeholder="CCCD/CMND">
                          </Input>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={12}>
                            <Select placeholder="Chọn tầng" style={{ width: "95%" }}>
                              <Option value="">Tầng 1</Option>
                              <Option value="">Tầng 2</Option>
                            </Select>
                          </Col>
                          <Col span={12}>
                            <Select placeholder="Chọn phòng" style={{ width: "100%" }}>
                              <Option value="">201C</Option>
                              <Option value="">203C</Option>
                            </Select>
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Select placeholder="Thời hạn hợp đồng" style={{ width: "100%" }}>
                            <Option value="">6 tháng</Option>
                            <Option value="">1 năm</Option>
                          </Select>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Col span={12}>
                            <DatePicker placeholder="Ngày vào ở" style={{ width: "95%" }} />
                          </Col>
                          <Col span={12}>
                            <DatePicker placeholder="Ngày kết thúc" style={{ width: "100%" }} />
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <TextArea rows={4} placeholder="Ghi chú" />
                        </Row>
                      </Col>
                      <Col span={12} style={{ paddingRight: "10%" }}>
                        <Row>
                          <p><b>Thông tin giá trị hợp đồng</b></p>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Input
                            placeholder="Giá phòng">
                          </Input>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Input
                            placeholder="Số tiền cọc">
                          </Input>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Select placeholder="Chu kỳ tính tiền" style={{ width: "100%" }}>
                            <Option value="">1 tháng</Option>
                            <Option value="">2 tháng</Option>
                          </Select>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                          <Select placeholder="Kỳ thanh toán" style={{ width: "100%" }}>
                            <Option value="">kỳ 15</Option>
                            <Option value="">kỳ 30</Option>
                          </Select>
                        </Row>
                        <Row>
                          <p><i>Tập tin và hình ảnh upload thả vào đây</i></p>
                        </Row>
                        <Row>
                          <Upload>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                          </Upload>
                        </Row>
                      </Col>
                    </Row>
                    <p>Lưu ý:<br />
                      - Kỳ thanh toán tùy thuộc vào từng khu nhà trọ, nếu khu trọ bạn thu tiền 1 lần vào cuối tháng thì bạn chọn là kỳ 30. Trường hợp khu nhà trọ bạn có số lượng phòng nhiều, chia làm 2 đợt thu, bạn dựa vào ngày vào của khách để gán kỳ cho phù hợp, ví dụ: vào từ ngày 1 đến 15 của tháng thì gán kỳ 15; nếu vào từ ngày 16 đến 31 của tháng thì gán kỳ 30. Khi tính tiền phòng bạn sẽ tính tiền theo kỳ.<br />
                      - Tiền đặt cọc sẽ không tính vào doanh thu ở các báo cáo và thống kê doanh thu. Nếu bạn muốn tính vào doanh thu bạn ghi nhận vào trong phần thu/chi khác (phát sinh). Tiền đặt cọc sẽ được trừ ra khi tính tiền trả phòng.<br />
                      - Các thông tin có giá trị là ngày nhập đủ ngày tháng năm và đúng định dạng dd/MM/yyyy (ví dụ: 01/12/2020)<br />
                      - Thanh toán mỗi lần: Nhập 1,2,3 ; là số tháng được tính trên mỗi hóa đơn.<br />
                    </p>
                    <p style={{ color: "red" }}>(*): Thông tin bắt buộc</p>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Dịch vụ" key="2" >
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
                    <PlusCircleOutlined style={{ fontSize: 36, marginBottom: 20, color: "blue" }} onClick={() => {
                      onAdd()
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
                        if (e.phone !== null) {
                          resetEditing()
                        }
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
                          validateRequired(editingMember);
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
                      visible={isAdd}
                      onCancel={
                        resetAddCl
                      }
                      destroyOnClose={true}
                      onOk={resetAdd}
                      width={700}
                      footer={[
                        <Button htmlType="submit" key="submit" form="formAdd" type="primary" onClick={resetAdd}>
                          Lưu
                        </Button>,
                        <Button key="back" onClick={resetAddCl}>
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
                        <p><b>Thông tin tài sản bàn giao</b></p>
                        <Input.Search placeholder="Tìm kiếm" style={{ marginBottom: 8, width: 500 }}
                          onSearch={(e) => {
                            setSearched(e);
                          }}
                          onChange={(e) => {
                            setSearched(e.target.value);
                          }}
                        />
                        <Table
                          dataSource={dataSource}
                          columns={columns}>
                        </Table>
                      </Col>
                    </Row>

                  </Tabs.TabPane>
                </Tabs>
              </Row>

            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default CreateContractRenter;
