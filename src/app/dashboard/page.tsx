"use client"
import React from "react"
import { Layout, Menu } from "antd"
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons"

const { Header, Content, Footer, Sider } = Layout

export default function Dashboard() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div className='logo' />
        <Menu theme='light' defaultSelectedKeys={["1"]}>
          <Menu.Item key='1' icon={<PieChartOutlined />}>
            Option 1
          </Menu.Item>
          <Menu.Item key='2' icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className='site-layout'>
        <Content style={{ margin: "0 16px" }}>
          <div
            className='site-layout-background'
            style={{ padding: 24, minHeight: 360 }}
          >
            Content goes hereffffddsdsdsds
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  )
}
