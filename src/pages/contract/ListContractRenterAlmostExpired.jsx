import React, { useEffect, useState } from "react";
import { Input, Table, Tag } from "antd";
import axios from "../../api/axios";
const { Search } = Input;
const LIST_CONTRACT_ALMOST_EXPIRED_URL = "manager/contract";
const LIST_BUILDING_FILTER = "manager/group/all";
const ListContractRenterAlmostExpired = ({ duration }) => {
  const [dataSource, setDataSource] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const options = [];
  useEffect(() => {
    const getAllContractAlmostExpired = async () => {
      setLoading(true);
      const response = await axios
        .get(LIST_CONTRACT_ALMOST_EXPIRED_URL, {
          params: { status: 1, duration: duration },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        })
        .then((res) => {
          setDataSource(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };
    getAllContractAlmostExpired();
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
          placeholder="T??m ki???m theo t??n ph??ng, t??n kh??ch thu??, s??? ??i???n tho???i"
          style={{ marginBottom: 8, width: "50%", padding: "10px 0" }}
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
            title: "T??n kh??ch thu??",
            dataIndex: "list_renter",
            render: (list_renter) => {
              return list_renter?.find((obj, index) => obj?.represent === true)?.renter_full_name;
            },
          },
          {
            title: "S??? ??i???n tho???i",
            dataIndex: "list_renter",
            render: (list_renter) => {
              return list_renter?.find((obj, index) => obj?.represent === true)?.phone_number;
            },
          },
          {
            title: "Ph??ng",
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
            title: "T??n chung c??",
            dataIndex: "group_name",
          },
          {
            title: "S??? ti???n c???c",
            dataIndex: "contract_deposit",
            render: (value) => {
              return value.toLocaleString("vn") + " ??";
            },
          },
          {
            title: "Ti???n ph??ng",
            dataIndex: "contract_price",
            render: (value) => {
              return value.toLocaleString("vn") + " ??";
            },
          },
          {
            title: "Ng??y l???p h???p ?????ng",
            dataIndex: "contract_start_date",
            render: (date) => getFullDate(date),
          },
          {
            title: "Ng??y k???t th??c",
            dataIndex: "contract_end_date",
            render: (date) => getFullDate(date),
          },

          {
            title: "Tr???ng th??i h???p ?????ng",
            dataIndex: "contractIsDisable",
            render: (_, record) => {
              let status;
              if (record.contract_is_disable === true) {
                status = (
                  <Tag color="default" key={record.status}>
                    H???p ?????ng ???? k???t th??c
                  </Tag>
                );
              } else if (record.contract_is_disable === false) {
                status = (
                  <Tag color="green" key={record.status}>
                    H???p ?????ng c??n hi???u l???c
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

export default ListContractRenterAlmostExpired;
