import { Col, Row, Select, Table } from 'antd';
import React, { useState } from 'react';

const ContractRentalStatistic = ({ loading, data, dataGroup }) => {
  const [groupSelect, setGroupSelect] = useState("");
  const columns = [
    {
      title: "Tên người cho thuê",
      // dataIndex: "groupName",
      // key: "room_id",
    },
    {
      title: "Tên chung cư",
      // dataIndex: "groupName",
      // key: "room_id",
    },
    {
      title: "Ngày kết thúc",
      // dataIndex: "groupName",
      // key: "room_id",
    },
  ]
  return (
    <>
      <Row justify="center">
        <p className="header-statistic">Danh sách hợp đồng đi thuê sắp kết thúc </p>
      </Row>
      <Row>
        <p className='statistic-time-title'>Chọn chung cư:</p>
      </Row>
      <Row>
        <Col span={24}>
          <Select
            defaultValue={""}
            placeholder="Chọn chung cư"
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
        columns={columns}
        loading={loading}
        dataSource={[]}
        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20'] }}
        scroll={{ x: 600, y: 500 }}
      />
    </>
  )
};

export default ContractRentalStatistic;
