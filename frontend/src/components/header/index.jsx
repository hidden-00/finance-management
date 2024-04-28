import React, { useCallback, useEffect } from 'react';
import { Layout, Menu, Spin, message } from 'antd';
import { NotificationOutlined, HomeOutlined, MoneyCollectOutlined, LaptopOutlined, LogoutOutlined } from '@ant-design/icons';
import './AdminLayout.css'; // Import file CSS tùy chỉnh
import { useState } from 'react';
import MenuItem from 'antd/es/menu/MenuItem';
import { useAuth } from '../../provider/auth';
import { useNavigate } from 'react-router-dom';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const auth = useAuth();
  const [load, setLoad] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  const getGroupTitle = useCallback(async () => {
    try {
      setLoad(true);
      const response = await fetch(`${auth.urlAPI}/api/v1/group/list_name`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        }
      });
      const res = await response.json();
      if (res.success) {
        messageApi.success(res.msg);
        setGroups(res.data.groups);
      } else {
        messageApi.info(res.msg);
      }
      setLoad(false);
    } catch (err) {
      messageApi.error('SERVER ERROR');
      console.error(err);
      setTimeout(() => {
        setLoad(false);
      }, 1000);
    }
  }, [auth.urlAPI, auth.token, messageApi])

  useEffect(() => {
    getGroupTitle();
  }, [getGroupTitle]);

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
              defaultSelectedKeys={'0'}
              style={{ minHeight: '100vh', borderRight: 0, userSelect: 'none' }}
            >
              <MenuItem onClick={() => {
                navigate('/feature')
              }} key="0" icon={<HomeOutlined />}>
                Feature
              </MenuItem>
              <SubMenu key="sub1" icon={<MoneyCollectOutlined />} title="Finance">
                <Menu.Item key="1">Create Group</Menu.Item>
                {groups?.map((group) => {
                  return <Menu.Item key={groups._id}>{group.name}</Menu.Item>
                })}
                {/* <Menu.Item key="1">Create Group</Menu.Item>
                <Menu.Item key="2">User 2</Menu.Item>
                <Menu.Item key="3">User 3</Menu.Item>
                <Menu.Item key="4">User 4</Menu.Item> */}
              </SubMenu>
              <SubMenu key="sub2" icon={<LaptopOutlined />} title="Device">
                <Menu.Item key="5">Device 1</Menu.Item>
                <Menu.Item key="6">Device 2</Menu.Item>
                <Menu.Item key="7">Device 3</Menu.Item>
                <Menu.Item key="8">Device 4</Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" icon={<NotificationOutlined />} title="Notification">
                <Menu.Item key="9">Notification 1</Menu.Item>
                <Menu.Item key="10">Notification 2</Menu.Item>
                <Menu.Item key="11">Notification 3</Menu.Item>
                <Menu.Item key="12">Notification 4</Menu.Item>
              </SubMenu>
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
                  messageApi.error('SERVER ERROR')
                  setTimeout(() => {
                    setLoad(false);
                  }, 1000);
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
    </>

  );
};

export default AdminLayout;
