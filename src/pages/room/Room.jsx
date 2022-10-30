import Sidebar from "../../components/sidebar/Sidebar";
import "./room.scss";
import { Layout } from "antd";
import React from "react";
import ListRoom from "./ListRoom";
const { Content, Sider, Header } = Layout;

function room(props) {

    return (
        <div className="building">
            <Layout
                style={{
                    minHeight: "100vh",
                    minWidth: "100vh"
                }}
            >
                <Sider width={250}>
                    <p className="sider-title">QUẢN LÝ CHUNG CƯ MINI</p>
                    <Sidebar />
                </Sider>
                <Layout className="site-layout">
                    <Header
                        className="layout-header"
                    >
                        <p className="header-title">Quản lý danh sách phòng</p>
                    </Header>
                    <Content
                        style={{
                            margin: "10px 16px",
                        }}
                    >
                        <ListRoom />
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}

export default room;