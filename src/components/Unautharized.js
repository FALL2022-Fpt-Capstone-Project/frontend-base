import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./Unauthorized.scss";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className="unauthorized">
      <div className="message">Bạn không có quyền truy cập vào mục này.</div>
      <div className="message2">Nếu đây là lỗi, hãy báo với quản trị viên.</div>
      <div>
        <Button onClick={goBack} type="primary" className="btnBack">
          Quay lại
        </Button>
      </div>
      <div className="container">
        <div className="neon">403</div>
        <div className="door-frame">
          <div className="door">
            <div className="rectangle"></div>
            <div className="handle"></div>
            <div className="window">
              <div className="eye"></div>
              <div className="eye eye2"></div>
              <div className="leaf"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
