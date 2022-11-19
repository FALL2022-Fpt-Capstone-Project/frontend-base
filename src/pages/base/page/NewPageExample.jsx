import { Form, Input, Radio, Select, Switch, Layout, Button, Row, Col, Table } from "antd";
import React from 'react';
import {
    PlusCircleOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import Breadcrumbs from "../../components/BreadCrumb ";
const { Content, Sider, Header } = Layout;

function NewPageExample(data) {
    return (
        <div className="update-staff">
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
                    <Header className="layout-header">
                        <p className="header-title">Tiêu đề trang</p>
                    </Header>
                    <Content className="layout-content">
                        <Breadcrumbs />
                        <div
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                minHeight: 360,
                            }}
                        >

                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}

export default NewPageExample;