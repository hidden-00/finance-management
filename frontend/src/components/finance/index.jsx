import React, { useState } from 'react';
import { Button, Input, List, Modal, Popconfirm, Select, Space, Spin, Table, Typography, message } from 'antd';
import { FloatButton } from "antd";
import { MenuFoldOutlined, UserOutlined, FileAddOutlined, LogoutOutlined, DeleteOutlined } from '@ant-design/icons'
import { useCallback } from 'react';
import { useAuth } from '../../provider/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
const { Column } = Table;

const Finance = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [loadButton, setLoadButton] = useState(false);
  const [loadModalMembers, setLoadModalMembers] = useState({});
  const [input, setInput] = useState({
    name: "",
    mon_hang: "",
    type: "",
    money: "",
    method: "",
    place: "",
    email: ""
  })
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    setOpenForm(true);
  };

  const handleCancel = () => {
    setOpenForm(false);
  };

  const handleOkMembers = () => {
    setShowMembers(false);
  }

  const handleCancelMembers = () => {
    setShowMembers(false);
  }


  const handleInput = (e) => {
    const { name, value } = e.target
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const auth = useAuth();

  const getDataFinance = useCallback(async () => {
    try {
      setLoad(true);
      const response = await fetch(`${auth.urlAPI}/api/v1/group/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        }
      });
      const res = await response.json();
      if (res.success) {
        setData(res.data);
      } else {
        messageApi.info(res.msg || res.errors?.name);
        setTimeout(() => {
          navigate('/group');
        }, 500);
      }
      setLoad(false);
    } catch (err) {
      messageApi.error('SERVER ERROR');
      setTimeout(() => {
        setLoad(false);
      }, 500);
    }
  }, [auth.urlAPI, auth.token, id, messageApi, navigate])

  const handleRemoveMember = async (group_id, user_id) => {
    try {
      setLoadModalMembers({ ...loadModalMembers, [user_id]: true });
      const response = await fetch(`${auth.urlAPI}/api/v1/group/remove_member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        },
        body: JSON.stringify({ group_id, user_id })
      });
      const res = await response.json();
      if (res.success) {
        messageApi.success(res.msg);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        messageApi.info(res.msg);
        setTimeout(() => {
          setLoadModalMembers({ ...loadModalMembers, [user_id]: false });
        }, 500);
      }
    } catch (err) {
      navigate('/server-error')
    }
  }

  const sendRequestInsert = async () => {
    try {
      setConfirmLoading(true);
      const response = await fetch(`${auth.urlAPI}/api/v1/finance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        },
        body: JSON.stringify({ ...input, group: id })
      });
      const res = await response.json();
      if (res.success) {
        messageApi.success(res.msg);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        messageApi.info(res.msg);
      }
      setTimeout(() => {
        setConfirmLoading(false);
      }, 500);
    } catch (err) {
      navigate('/server-error')
    }
  }

  useEffect(() => {
    getDataFinance();
  }, [getDataFinance])

  const onChangeType = (value) => {
    setInput((prev) => ({
      ...prev,
      type: value,
    }))
  };

  const onChangeMethod = (value) => {
    setInput((prev) => ({
      ...prev,
      method: value,
    }))
  }

  const handleOk = async () => {
    await sendRequestInsert();
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  }

  const confirm = async (id) => {
    try {
      setLoad(true);
      const response = await fetch(`${auth.urlAPI}/api/v1/finance/delete/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        }
      });
      const res = await response.json();
      if (res.success) {
        messageApi.success(res.msg);
        setTimeout(() => {
          window.location.reload()
        }, 500);
      } else {
        messageApi.info(res.msg);
        setLoad(false);
      }
    } catch (err) {
      messageApi.error('SERVER ERROR');
      setTimeout(() => {
        setLoad(false);
      }, 500);
    }
  };
  const cancel = (e) => {
  };

  const showModalUser = () => {
    setShowMembers(true);
  }

  const handleAdd = async (id) => {
    try {
      setLoadButton(true);
      const response = await fetch(`${auth.urlAPI}/api/v1/group/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        },
        body: JSON.stringify({ email: input.email, group_id: id })
      })
      const res = await response.json();
      setTimeout(() => {
        if (!res.success) {
          messageApi.info(res.msg)
          setLoadButton(false);
        } else {
          messageApi.success(res.msg)
          setTimeout(() => {
            setLoadButton(false);
          }, 500);
        }
      }, 500);
    } catch (err) {
      navigate('/server-error');
    }
  }

  const handleDeleteGroup = async () => {
    try {
      setLoad(true);
      const response = await fetch(`${auth.urlAPI}/api/v1/group/delete/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        },
        body: JSON.stringify({ group_id: id })
      })
      const res = await response.json();
      setTimeout(() => {
        if (!res.success) {
          messageApi.info(res.msg)
          setLoad(false);
        } else {
          messageApi.success(res.msg)
          setTimeout(() => {
            navigate('/group');
          }, 500);
        }
      }, 500);
    } catch (err) {
      navigate('/server-error');
    }
  }

  const handleLeaveGroup = async () => {
    try {
      setLoad(true);
      const response = await fetch(`${auth.urlAPI}/api/v1/group/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        },
        body: JSON.stringify({ email: input.email, group_id: id })
      })
      const res = await response.json();
      setTimeout(() => {
        if (!res.success) {
          messageApi.info(res.msg)
          setLoad(false);
        } else {
          messageApi.success(res.msg)
          setTimeout(() => {
            navigate('/group');
          }, 500);
        }
      }, 500);
    } catch (err) {
      navigate('/server-error');
    }
  }
  return <>
    {contextHolder}
    <Helmet><title>Finances</title></Helmet>
    <Spin spinning={load} fullscreen />
    <FloatButton.Group
      open={open}
      trigger="click"
      style={{
        right: 24,
      }}
      icon={<MenuFoldOutlined />}
      onClick={() => {
        setOpen(!open);
      }}
    >
      <FloatButton icon={<FileAddOutlined />}
        onClick={showModal}
      />
      <FloatButton icon={<UserOutlined />}
        onClick={showModalUser}
      />
      <FloatButton onClick={handleLeaveGroup} icon={<LogoutOutlined />} />
      <FloatButton onClick={handleDeleteGroup} icon={<DeleteOutlined />} />
    </FloatButton.Group>
    <Table dataSource={data?.finances}>
      <Column title="Name" dataIndex="name" key="name" />
      <Column title="Name Product" dataIndex="mon_hang" key="mon_hang" />
      <Column title="Type" dataIndex="type" key="type" />
      <Column title="Money" dataIndex="money" key="money" />
      <Column title="Method" dataIndex="method" key="method" />
      <Column title="Place" dataIndex="place" key="place" />
      <Column title="User" key="user" render={(_, record) => { return record.user.name }} />
      <Column title="Date" key="date" render={(_, record) => formatDate(record.date)} />
      <Column
        title="Action"
        key="action"
        render={(_, record) => (
          <Space size="middle">
            <Popconfirm
              title="Delete the finance"
              description="Are you sure to delete this finance?"
              onConfirm={() => {
                confirm(record._id);
              }}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button type='dashed' danger>Delete</Button>
            </Popconfirm>
          </Space>
        )}
      />
    </Table>
    <Modal
      title="New Finance"
      open={openForm}
      style={{ top: 10 }}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
    >
      <Typography.Title level={5}>Name Finance</Typography.Title>
      <Input name='name' autoFocus placeholder='Name Finance' onChange={handleInput} />
      <Typography.Title level={5}>Name Product</Typography.Title>
      <Input name='mon_hang' autoFocus placeholder='Name Product' onChange={handleInput} />
      <Typography.Title level={5}>Type</Typography.Title>
      <Select
        showSearch
        placeholder="Select a type finance"
        onChange={onChangeType}
        style={{ width: '100%' }}
        options={[
          {
            value: 'Thu',
            label: 'Thu',
          },
          {
            value: 'Chi',
            label: 'Chi',
          },
          {
            value: 'Nợ',
            label: 'Nợ',
          },
        ]}
      />
      <Typography.Title level={5}>Price</Typography.Title>
      <Input name='money' autoFocus placeholder='10.000.000' onChange={handleInput} />
      <Typography.Title level={5}>Method</Typography.Title>
      <Select
        showSearch
        placeholder="Select a method"
        onChange={onChangeMethod}
        style={{ width: '100%' }}
        options={[
          {
            value: 'Tiền mặt',
            label: 'Tiền mặt',
          },
          {
            value: 'Vietcombank',
            label: 'Vietcombank',
          },
          {
            value: 'Timo',
            label: 'Timo',
          },
          {
            value: 'Momo',
            label: 'Momo',
          },
        ]}
      />
      <Typography.Title level={5}>Place</Typography.Title>
      <Input name='place' autoFocus placeholder='Place' onChange={handleInput} />
    </Modal>
    <Modal
      title={`List members group ${data?.name}`}
      open={showMembers}
      cancelButtonProps={{ style: { display: 'none' } }}
      onOk={handleOkMembers}
      onCancel={handleCancelMembers}
    >
      <div>
        <List
          style={{ margin: 5 }}
          bordered
          dataSource={data?.members}
          renderItem={(item) => (
            <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Typography.Text>({item.name})</Typography.Text> {item.email}
              </div>
              <Button loading={loadModalMembers[item._id]} onClick={async (e) => {
                e.stopPropagation();
                await handleRemoveMember(data._id, item._id);
              }} type="link">
                Remove
              </Button>
            </List.Item>
          )}
        />
        <div style={{ display: 'flex' }}>
          <Input style={{ margin: 5 }} autoFocus onChange={handleInput} name='email' placeholder='Invite Email' />
          <Button loading={loadButton} autoFocus style={{ margin: 5 }} onClick={
            (e) => {
              e.preventDefault();
              handleAdd(data._id);
            }
          }>Invite</Button>
        </div>
      </div>
    </Modal>
  </>
};
export default Finance;