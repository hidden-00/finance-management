import React, { useCallback, useEffect } from 'react';
import { Input, Layout, Menu, Modal, Spin, Typography, message } from 'antd';
import { NotificationOutlined, HomeOutlined, MoneyCollectOutlined, LinuxOutlined, WechatWorkOutlined, LogoutOutlined } from '@ant-design/icons';
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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [input, setInput] = useState({
    name: "",
    description: "",
  })
  const [select, setSelect] = useState('');
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

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
    const url = window.location.href;
    setSelect(url.split('/').at(url.split('/').length - 1));
  }, [getGroupTitle, window.location.href]);

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
      messageApi.error("ERROR SERVER");
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
              style={{ minHeight: '100vh', borderRight: 0, userSelect: 'none' }}
            >
              <MenuItem key='feature' onClick={() => {
                navigate('/feature')
              }} icon={<HomeOutlined />}>
                Feature
              </MenuItem>
              <SubMenu key="finance" icon={<MoneyCollectOutlined />} title="Finance">
                <Menu.Item key="add"
                  onClick={showModal}
                >Create Group</Menu.Item>
                {groups?.map((group) => {
                  return <Menu.Item key={group._id}
                    onClick={() => {
                      navigate(`/group/${group._id}`)
                    }}
                  >{group.name}</Menu.Item>
                })}
              </SubMenu>
              <SubMenu key="game" icon={<LinuxOutlined />} title="Game">
                <Menu.Item key="alliance">Alliance</Menu.Item>
                <Menu.Item key="user">User</Menu.Item>
                <Menu.Item key="egg">Egg</Menu.Item>
                <Menu.Item key="cvc">CVC</Menu.Item>
              </SubMenu>
              <SubMenu key="chat" icon={<WechatWorkOutlined />} title="Chat">
                <Menu.Item key="addChat"
                  onClick={showModal}
                >Create Group</Menu.Item>
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
