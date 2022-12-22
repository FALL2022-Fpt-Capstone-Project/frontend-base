import React, { useEffect, useState } from "react";
import { Input, Table, Tag } from "antd";
import "./listContract.scss";
import axios from "../../api/axios";
const { Search } = Input;
const LIST_CONTRACT_EXPIRED_URL = "manager/contract";
const LIST_BUILDING_FILTER = "manager/group/all";
const ListContractExpired = ({ duration }) => {
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const options = [];
  useEffect(() => {
    const getAllContractExpired = async () => {
      setLoading(true);
      const response = await axios
        .get(LIST_CONTRACT_EXPIRED_URL, {
          params: { status: 3, duration: duration },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setDataSource(res.data.data);
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };
    getAllContractExpired();
  }, [duration]);
  let cookie = localStorage.getItem("Cookie");
  useEffect(() => {
    const getBuildingFilter = async () => {
      setLoading(true);
      const response = await axios
        .get(LIST_BUILDING_FILTER, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setBuildingFilter(res.data.data.list_group_contracted);
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };
    getBuildingFilter();
  }, [cookie]);
  for (let i = 0; i < buildingFilter.length; i++) {
    options.push({
      label: buildingFilter[i].group_name,
      value: buildingFilter[i].group_id,
    });
  }

  const getFullDate = (date) => {
    const dateAndTime = date.split(" ");

    return dateAndTime[0].split("-").reverse().join("-");
  };
  return (
    <div>
      <div>
        <Search
          placeholder="Tìm kiếm theo tên hợp đồng, tên khách thuê"
          style={{ marginBottom: 8, width: 400, padding: "10px 0" }}
          onSearch={(value) => {
            setTextSearch(value);
          }}
          onChange={(e) => {
            setTextSearch(e.target.value);
          }}
        />
      </div>
      <Table
        bordered
        scroll={{ x: 1500 }}
        dataSource={dataSource}
        columns={[
          {
            title: "Tên khách thuê",
            dataIndex: "list_renter",
            render: (list_renter) => {
              return list_renter?.find((obj, index) => obj?.represent === true)?.renter_full_name;
            },
          },
          {
            title: "Số điện thoại",
            dataIndex: "list_renter",
            render: (list_renter) => {
              return list_renter?.find((obj, index) => obj?.represent === true)?.phone_number;
            },
          },
          {
            title: "Phòng",
            dataIndex: "room",
            filteredValue: [textSearch],
            render: (room) => room.room_name,
            onFilter: (value, record) => {
              return (
                String(record.room.room_name).toLowerCase()?.includes(value.toLowerCase().trim()) ||
                String(record.list_renter.find((obj, index) => obj?.represent === true)?.renter_full_name)
                  .toLowerCase()
                  ?.includes(value.toLowerCase().trim()) ||
                String(record.list_renter.find((obj, index) => obj?.represent === true)?.phone_number)
                  .toLowerCase()
                  ?.includes(value.toLowerCase().trim())
              );
            },
          },
          {
            title: "Tên chung cư",
            dataIndex: "group_name",
          },
          {
            title: "Số tiền cọc",
            dataIndex: "contract_deposit",
            render: (value) => {
              return value.toLocaleString("vn") + " đ";
            },
          },
          {
            title: "Tiền phòng",
            dataIndex: "contract_price",
            render: (value) => {
              return value.toLocaleString("vn") + " đ";
            },
          },
          {
            title: "Ngày lập hợp đồng",
            dataIndex: "contract_start_date",
            render: (date) => getFullDate(date),
          },
          {
            title: "Ngày kết thúc",
            dataIndex: "contract_end_date",
            render: (date) => getFullDate(date),
          },

          {
            title: "Trạng thái hợp đồng",
            dataIndex: "contractIsDisable",
            render: (_, record) => {
              let status;
              if (record.contract_is_disable === true) {
                status = (
                  <Tag color="default" key={record.status}>
                    Hợp đồng đã kết thúc
                  </Tag>
                );
              } else if (record.contract_is_disable === false) {
                status = (
                  <Tag color="green" key={record.status}>
                    Hợp đồng còn hiệu lực
                  </Tag>
                );
              }
              return <>{status}</>;
            },
          },
        ]}
        loading={loading}
      />
    </div>
  );
};

export default ListContractExpired;
