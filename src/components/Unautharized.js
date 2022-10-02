import { useNavigate } from "react-router-dom";
import { Button, Layout } from "antd";
import Sidebar from "./sidebar/Sidebar";

const { Content, Sider, Header } = Layout;

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className="unauthorized">
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider width={250}>
          <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
          <Sidebar />
        </Sider>
        <Layout className="site-layout">
          {/* <Header
          className="layout-header"
          style={{
            margin: "0 16px",
          }}
        >
          <p className="header-title">Quản lý chung cư</p>
        </Header> */}
          <Content
            style={{
              margin: "10px 16px",
            }}
          >
            <h1>Không có quyền truy cập</h1>
            <Button onClick={goBack} type="primary">
              Quay lại
            </Button>
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            ></div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Unauthorized;
