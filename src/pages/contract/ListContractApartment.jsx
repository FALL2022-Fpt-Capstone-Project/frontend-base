import React, { useEffect, useState } from "react";
import { Input, Table, Tag, Row, Checkbox } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
const { Search } = Input;
const LIST_CONTRACT_APARTMENT_URL = "";
const { Column, ColumnGroup } = Table;

const options = [
  {
    label: "Hợp đồng còn hiệu lực",
    value: "Apple",
  },
  {
    label: "Hợp đồng còn hiệu lực",
    value: "Pear",
  },
  {
    label: "Sắp xếp theo số lượng phòng tăng dần",
    value: "Orange",
  },
  {
    label: "Sắp xếp theo số lượng phòng giảm dần",
    value: "Orange",
  },
];

const ListContractApartment = () => {
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAllContractExpired();
  }, []);
  let cookie = localStorage.getItem("Cookie");
  const getAllContractExpired = async () => {
    setLoading(true);
    const response = await axios
      .get(LIST_CONTRACT_APARTMENT_URL, {
        params: {},
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${cookie}`,
        },
        // withCredentials: true,
      })
      .then((res) => {
        setDataSource(res.data.body);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };
  const getFullDate = (date) => {
    const dateAndTime = date.split("T");

    return dateAndTime[0].split("-").reverse().join("-");
  };
  const data = [
    {
      key: "1",
      firstName: "John",
      lastName: "Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      firstName: "Jim",
      lastName: "Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      firstName: "Joe",
      lastName: "Black",
      age: 32,
      address: "Sidney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ];
  return (
    <div>
      <Row>
        <Search
          placeholder="Tìm kiếm theo tên chưng cư/căn hộ"
          style={{ marginBottom: 8, width: 400, padding: "10px 0", marginRight: 20 }}
          onSearch={(value) => {
            setTextSearch(value);
          }}
          onChange={(e) => {
            setTextSearch(e.target.value);
          }}
        />
      </Row>
      <Row style={{ alignItems: "center", marginBottom: "30px" }}>
        <span style={{ fontSize: "18px", fontWeight: "bold", marginRight: "20px" }}>Bộ lọc: </span>
        <Checkbox.Group options={options} defaultValue={["Pear"]} />
      </Row>
      <Table dataSource={data} bordered>
        <ColumnGroup title="Thông tin chung cư mini/căn hộ">
          <Column title="Tên chung cư mini/căn hộ" dataIndex="firstName" key="firstName" responsive={["xs"]} />
          <Column title="Ngày bắt đầu" dataIndex="lastName" key="lastName" />
          <Column title="Ngày kết thúc" dataIndex="lastName" key="lastName" />
          <Column
            title="Trạng thái"
            dataIndex="tags"
            key="tags"
            render={(tags) => (
              <>
                {tags.map((tag) => (
                  <Tag color="blue" key={tag}>
                    {tag}
                  </Tag>
                ))}
              </>
            )}
          />
        </ColumnGroup>
        <ColumnGroup title="Giá trị hợp đồng">
          <Column title="Giá thuê" dataIndex="age" key="age" responsive={["md"]} />
          <Column title="Số tiền cọc" dataIndex="address" key="address" />
        </ColumnGroup>
        <ColumnGroup title="Thông tin tầng/phòng">
          <Column title="Số lượng tầng" dataIndex="age" key="age" />
          <Column title="Số lượng phòng" dataIndex="address" key="address" />
          <Column
            title="Trạng thái"
            dataIndex="tags"
            key="tags"
            render={(tags) => (
              <>
                {tags.map((tag) => (
                  <Tag color="blue" key={tag}>
                    {tag}
                  </Tag>
                ))}
              </>
            )}
          />
        </ColumnGroup>

        <ColumnGroup title="Thao tác">
          <Column
            key="action"
            render={(_, record) => {
              return (
                <>
                  <EditOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                  <EyeOutlined style={{ fontSize: "20px" }} />
                </>
              );
            }}
          />
        </ColumnGroup>
      </Table>
    </div>
  );
};

export default ListContractApartment;
