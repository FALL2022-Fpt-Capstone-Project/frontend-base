import { Col, Divider, Row, Select, Table } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

const ContractSubRentalStatistic = ({ loading, data, dataGroup }) => {
    const [groupSelect, setGroupSelect] = useState("");
    const columns = [
        {
            title: "Tên khách thuê",
            // dataIndex: "groupName",
            key: "contract_id",
            render: (record) => {
                return record.list_renter.filter(renter => renter.represent === true)[0].renter_full_name
            }
        },
        {
            title: "Tên chung cư",
            dataIndex: "group_name",
            key: "contract_id",
        },
        {
            title: "Phòng",
            dataIndex: "room_name",
            key: "contract_id",
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "contract_end_date",
            key: "contract_id",
            render: (contract_end_date) => {
                return moment(contract_end_date).format("DD-MM-YYYY");
            }
        },
    ]
    return (
        <>
            <Row justify="center">
                <span className="header-statistic">Danh sách hợp đồng cho thuê sắp kết thúc </span>
            </Row>
            <Divider />
            <Row>
                <p className='statistic-time-title'>Chọn chung cư:</p>
            </Row>
            <Row>
                <Col span={24}>
                    <Select
                        defaultValue={""}
                        placeholder="Chọn chung cư"
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.trim().toLowerCase())
                        }
                        className='select-w-100'
                        options={[...dataGroup?.map(group => {
                            return { label: group.group_name, value: group.group_id }
                        }), {
                            label: 'Tất cả chung cư',
                            value: ""
                        },]}
                        onChange={(e) => {
                            setGroupSelect(e);
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <p className='statistic-time-title'>Tổng số hợp đồng sắp kết thúc: <b style={{ color: 'red' }}>{groupSelect === "" ? data.length : data.filter(room => room.group_id === groupSelect).length}</b></p>
            </Row>
            <Table
                bordered
                columns={columns}
                loading={loading}
                dataSource={groupSelect === "" ? data : data.filter(room => room.group_id === groupSelect)}
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
                scroll={{ x: 600, y: 500 }}
            />
        </>
    )
};

export default ContractSubRentalStatistic;
