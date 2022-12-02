import { Link, useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import "./breadcrumb.scss";

const breadcrumbNameMap = {
  "/building": "Quản lý chung cư",
  "/room": "Quản lý phòng",
  "/room/member": "Quản lý thành viên trong phòng",
  "/room/equipment": "Trang thiết bị trong phòng",
  "/room/preview": "Xem trước tạo mới phòng nhanh",
  "/contract-apartment": "Quản lý hợp đồng đi thuê",
  "/contract-renter": "Quản lý hợp đồng cho thuê",
  "/contract-renter/create": "Tạo mới hợp đồng cho thuê",
  "/contract-renter/edit": "Cập nhật hợp đồng cho thuê",
  "/contract-apartment/create": "Tạo mới hợp đồng đi thuê",
  "/manage-staff": "Quản lý nhân viên",
  "/manage-staff/create-staff": "Tạo mới nhân viên",
  "/manage-staff/update-staff": "Cập nhật nhân viên",
  "/service": "Dịch vụ",
  "/invoice": "Quản lý hoá đơn",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return (
      <Breadcrumb.Item key={url} className="breadcrumb">
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [].concat(extraBreadcrumbItems);
  return (
    <div className="demo">
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    </div>
  );
};
export default Breadcrumbs;
