import React, { useEffect, useMemo } from 'react';
import { Input, Layout, Menu, Modal, Spin, Typography, message } from 'antd';
import { BookOutlined, HomeOutlined, MoneyCollectOutlined, GlobalOutlined, LinuxOutlined, WechatWorkOutlined, LogoutOutlined } from '@ant-design/icons';
import './AdminLayout.css'; // Import file CSS tùy chỉnh
import { useState } from 'react';
import MenuItem from 'antd/es/menu/MenuItem';
import { useAuth } from '../../provider/auth';
import { useLocation, useNavigate } from 'react-router-dom';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const auth = useAuth();
  const [load, setLoad] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [input, setInput] = useState({
    name: "",
    description: "",
  })
  const [select, setSelect] = useState('');
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const routes = useMemo(() => ['feature', 'group', 'game', 'chat', 'blog', 'toeic'], [])

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    const url = location.pathname;
    routes.forEach((e) => {
      if (url.includes(e)) setSelect(e);
    });
  }, [location.pathname, routes]);

  const handleInput = (e) => {
    const { name, value } = e.target
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOk = async (e) => {
    try {
      e.preventDefault()
      setConfirmLoading(true);
      const response = await fetch(`${auth.urlAPI}/api/v1/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        },
        body: JSON.stringify(input)
      })
      const res = await response.json();
      setTimeout(() => {
        if (!res.success) {
          setConfirmLoading(false);
          messageApi.info(res.msg)
        } else {
          messageApi.success(res.msg)
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }, 500);
    } catch (err) {
      setConfirmLoading(false);
      navigate('/server-error')
    }
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={load} fullscreen />
      <Layout>
        <Layout>
          <Sider width={200} className="site-layout-background" collapsed={collapsed}>
            <div className="sider-button-container" onClick={() => {
              setCollapsed(!collapsed)
            }}>
              <strong style={{ color: 'white', userSelect: 'none' }}>Admin</strong>
            </div>
            <Menu
              mode="inline"
              selectedKeys={select}
              style={{ minHeight: '100%', borderRight: 0, userSelect: 'none' }}
            >
              <MenuItem key='feature' onClick={() => {
                navigate('/feature')
              }} icon={<HomeOutlined />}>
                Feature
              </MenuItem>
              <SubMenu key="group" icon={<MoneyCollectOutlined />} title="Finance">
                <Menu.Item key="add"
                  onClick={showModal}
                >Create Group</Menu.Item>
                <Menu.Item key="list_group"
                  onClick={() => {
                    navigate('/group')
                  }}
                >List Group</Menu.Item>
              </SubMenu>
              <SubMenu key="game" icon={<LinuxOutlined />} title="Game">
                <Menu.Item key="alliance">Alliance</Menu.Item>
                <Menu.Item key="account">Account</Menu.Item>
                <Menu.Item key="egg">Egg</Menu.Item>
                <Menu.Item key="cvc">CVC</Menu.Item>
              </SubMenu>
              <SubMenu key="chat" icon={<WechatWorkOutlined />} title="Chat">
                <Menu.Item key="addChat"
                  onClick={showModal}
                >Create Group</Menu.Item>
              </SubMenu>
              <MenuItem
                icon={<BookOutlined />}
                key='blog'
                onClick={() => {
                  navigate('/blog');
                }}
              >
                Blog
              </MenuItem>
              <MenuItem
                icon={<GlobalOutlined />}
                key='toeic'
                onClick={() => {
                  navigate('/toeic');
                }}
              >
                Toeic
              </MenuItem>
              <MenuItem onClick={async () => {
                try {
                  setLoad(true);
                  const res = await auth.logOut();
                  if (res.success) {
                    messageApi.success(res.msg);
                    setTimeout(() => {
                      auth.setUser(null)
                      auth.setToken('')
                      localStorage.removeItem('site')
                      navigate('/login')
                    }, 1000);
                  } else {
                    messageApi.error(res.msg)
                    setTimeout(() => {
                      setLoad(false);
                    }, 1000);
                  }
                } catch (err) {
                  setTimeout(() => {
                    navigate('/server-error')
                  }, 500);
                }
              }} key="13" icon={<LogoutOutlined />}>
                Logout
              </MenuItem>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              className="content-layout"
              style={{
                padding: 24,
                margin: 0,
                flex: 1
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <Modal
        title="New Group"
        open={open}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        onOk={handleOk}
      >
        <p>Add new Group Finance</p>
        <Typography.Title level={5}>Name Group</Typography.Title>
        <Input name='name' autoFocus placeholder='Name Group' onChange={handleInput} />
        <Typography.Title level={5}>Description</Typography.Title>
        <Input name='description' autoFocus placeholder='Description' onChange={handleInput} />
      </Modal>
    </>

  );
};

export default AdminLayout;
