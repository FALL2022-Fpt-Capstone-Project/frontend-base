import {
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
} from 'antd';
import React, { useState } from 'react';
import moment from 'moment';

const EditRoom = (props) => {
    const [editRenter, setEditRenter] = useState();
    const [componentSize, setComponentSize] = useState('default');

    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };

    const onChange = (value) => {
        console.log(`selected ${value}`);
        setEditRenter(value);
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };
    const mapped = props.room.dataSource.map((obj, index) => obj.building);
    const buidlingFilter = mapped.filter((type, index) => mapped.indexOf(type) === index);
    const dateFormatList = ['DD/MM/YYYY', 'YYYY/MM/DD'];
    return (
        <Form
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
        >
            <Form.Item label="Phòng" rules={[
                {
                    required: true,
                    message: "Vui lòng nhập phòng",
                },
            ]}>
                <Select
                    showSearch
                    placeholder="Chọn phòng"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    value={editRenter}
                >
                    {props.room.dataSource.map((room) => {
                        return <Select.Option key={room.index} value={room.roomCode}>{room.roomCode}</Select.Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item label="Tên chủ hộ" rules={[
                {
                    required: true,
                    message: "Vui lòng nhập tên chủ hộ",
                },
                {
                    whitespace: true
                }
            ]}>
                <Input value={editRenter?.owner} onChange={(e) => {
                    setEditRenter(pre => {
                        return { ...pre, owner: e.target.value }
                    })
                }} />
            </Form.Item>
            <Form.Item label="Tòa" rules={[
                {
                    required: true,
                    message: "Vui lòng nhập tòa nhà",
                },
            ]}>
                <Select value={props.room.editRenter.building}>
                    {buidlingFilter.map((obj, index) => {
                        return <Select.Option key={index} value={index}>{obj}</Select.Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item label="Số lượng người" rules={[
                {
                    required: true,
                    message: "Vui lòng nhập số lượng người",
                },
            ]}>
                <InputNumber value={props.room.editRenter?.numberOfRenter} />
            </Form.Item>
            <Form.Item label="Thời hạn hợp đồng" rules={[
                {
                    required: true,
                    message: "Vui lòng nhập ngày thuê",
                },
            ]}>
                <DatePicker.RangePicker
                    defaultValue={[moment(props.room.editRenter?.dateOfHire, dateFormatList), moment(props.room.editRenter?.contractExpirationDate, dateFormatList)]}
                    format={dateFormatList} disabled={[true, false]} />
            </Form.Item>
            <Form.Item label="Tình trạng" valuePropName="checked">
                <Switch />
            </Form.Item>
        </Form>
    );
};

export default EditRoom;