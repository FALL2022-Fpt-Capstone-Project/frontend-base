import { Button, Form, Input, InputNumber, Modal } from 'antd';
import React from 'react';

function ModalExample({ visible, close, }) {
    const onFinish = (e) => {
      close(false);
    }
    const onFinishFail = (e) => {

    }
    return (
        <>
            <Modal
                title="Thêm mới nhân viên"
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
                    <Button htmlType="submit" key="submit" form="" type="primary">
                        Tạo mới
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    onFinish={handleCreateEmployee}
                    onFinishFailed={onFinishFail}
                    layout="horizontal"
                    size={"default"}
                // id=""
                >
                    <Form.Item
                        className="form-item"
                        name="full_name"
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Tên nhân viên:</b>
                            </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên nhân viên!",
                          },
                        ]}
                    >
                        <Input autoComplete="off" placeholder='Nhập tên nhân viên'/>
                    </Form.Item>
                    <Form.Item
                        className="form-item"
                        name="user_name"
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Tên đăng nhập:</b>
                            </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên đăng nhập!",
                          },
                        ]}
                    >
                        <Input autoComplete="off" placeholder='Nhập tên đăng nhập'/>
                    </Form.Item>
                    <Form.Item
                        className="form-item"
                        name="password"
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Mật khẩu:</b>
                            </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu!",
                          },
                        ]}
                    >
                        <Input.Password placeholder='Nhập mật khẩu'/>
                    </Form.Item>
                    <Form.Item
                        className="form-item"
                        name="comfirmPassword"
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Nhập lại mật khẩu:</b>
                            </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập lại mật khẩu!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error("Mật khẩu không khớp!"));
                            },
                          }),
                        ]}
                    >
                        <Input.Password placeholder='Nhập lại mật khẩu'/>
                    </Form.Item>
                    <Form.Item
                        className="form-item"
                         name="phone_number"
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Số điện thoại: </b>
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại",
                                whitespace: true,
                            },
                            {
                                pattern: /^((\+84|84|0)+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                                message: "Số điện thoại phải bắt đầu (+84,0,84)",
                            },
                        ]}
                    >
                        <Input placeholder="Số điện thoại" style={{ width: "100%" }} autoComplete="off"/>
                    </Form.Item>
                    
                    <Form.Item
                        className="form-item"
                        name="gender"
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Giới tính:</b>
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiền cọc",
                            },
                        ]}
                    >
                        <Radio.Group onChange={genderChange} defaultValue={true} style={{ marginLeft: "-9px" }}>
                    <Radio value={true}>Nam</Radio>
                    <Radio value={false}>Nữ</Radio>
                    </Form.Item>
                    <Form.Item
                        className="form-item"
                        name="address_more_detail"
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Địa chỉ: </b>
                            </span>
                        }
                        
                    >
                        <Input autoComplete="off" placeholder='Nhập địa chỉ' />
                    </Form.Item>
                    <Form.Item
                        className="form-item"
                        name="roles"
                        labelCol={{ span: 24 }}
                        label={
                            <span>
                                <b>Vai trò: </b>
                            </span>
                        }
                        
                    >
                        <Select
                    defaultValue="staff"
                    style={{
                      width: 120,
                      marginLeft: "-9px",
                    }}
                    onChange={roleChange}
                    options={options}
                  />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}