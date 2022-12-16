import { Button, Col, Modal, notification, Row, Statistic, Table, Tabs, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "../../api/axios";
import moment from "moment";

const DELETE_ROOM_CONTRACT = "manager/contract/room/end";

const textSize = {
  fontSize: 15,
};
function DeleteContractRenter({ reload, openView, closeView, dataContract, dataInvoice }) {
  // const [dataApartmentGroup, setDataApartmentGroup] = useState([]);
  let cookie = localStorage.getItem("Cookie");
  // console.log(dataInvoice);
  const handleOk = () => {
    closeView(false);
  };
  const handleCancel = () => {
    closeView(false);
  };
  const columnInvoice = [
    {
      title: "Số tiền cần thu",
      dataIndex: "total_money",
      key: "room_id",
      render: (total_money) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total_money);
      },
    },
    {
      title: "Ngày tạo hóa đơn",
      dataIndex: "bill_created_time",
      key: "room_id",
      render: (bill_created_time) => {
        return moment(bill_created_time).format("DD-MM-YYYY");
      },
    },
    {
      title: "Trạng thái",
      key: "room_id",
      render: () => {
        return <Tag color="error">Chưa thanh toán</Tag>;
      },
    },
  ];

  const onDeleteRoomContract = async (contract_id, total_money) => {
    // let cookie = localStorage.getItem("Cookie");
    await axios
      .post(
        DELETE_ROOM_CONTRACT,
        { contract_id: contract_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        }
      )
      .then((res) => {
        notification.success({
          message: ` Kết thúc hợp đồng thành công`,
          placement: "top",
          duration: 3,
        });
        closeView(false);
        reload();
      })
      .catch((error) => {
        notification.error({
          message: "Kết thúc hợp đồng thất bại",
          placement: "top",
          duration: 3,
        });
      });
  };
  return (
    <>
      <div>
        <Modal
          title={<h2>Hợp đồng phòng {dataContract?.room?.room_name}</h2>}
          width={1200}
          open={openView}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button
              key="back"
              onClick={() => {
                closeView(false);
              }}
            >
              Đóng
            </Button>,
          ]}
        >
          <div>
            <Tabs defaultActiveKey="2">
              <Tabs.TabPane tab={<span style={{ fontSize: "17px" }}>Hóa đơn chưa thanh toán</span>} key="1">
                <Row style={{ marginBottom: "2%" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col span={12}>
                    <Statistic
                      title={
                        <>
                          <span style={textSize}>Hóa đơn chưa thanh toán</span>
                        </>
                      }
                      value={dataInvoice?.length}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={
                        <>
                          <span style={textSize}>Số tiền chưa thanh toán (VND)</span>
                        </>
                      }
                      value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        dataInvoice?.map((invoice) => invoice?.total_money)?.reduce((pre, current) => pre + current, 0)
                      )}
                    />
                  </Col>
                </Row>
                <Table
                  // loading={loading}
                  columns={columnInvoice}
                  dataSource={dataInvoice}
                  scroll={{ x: 1000, y: 800 }}
                  bordered
                />
              </Tabs.TabPane>
            </Tabs>
            <Button
              disabled={dataInvoice.length === 0 ? false : true}
              onClick={() => {
                Modal.confirm({
                  title: `Bạn có chắc chắn muốn kết thúc hợp đồng phòng ${dataContract?.room_name} ?`,
                  okText: "Có",
                  cancelText: "Hủy",
                  onOk: () => {
                    onDeleteRoomContract(dataContract.contract_id);
                  },
                });
              }}
              style={{ marginTop: "3%" }}
              type="danger"
              icon={<DeleteOutlined />}
            >
              Kết thúc hợp đồng
            </Button>
            <p>
              <i style={{ color: "red" }}>Bạn cần thanh toán hết hóa đơn trước khi kết thúc hợp đồng</i>
            </p>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default DeleteContractRenter;
