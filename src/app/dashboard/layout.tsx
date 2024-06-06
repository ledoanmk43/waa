"use client"
import { Layout } from "antd"

const { Header, Content } = Layout

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Layout>
      <Header className='bg-white font-bold text-lg  items-center flex'>
        WWA
      </Header>
      <Content>{children}</Content>
    </Layout>
  )
}
