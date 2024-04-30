import { Button, Card, Col, Input, List, Modal, Row, Spin, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { useAuth } from "../../provider/auth";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const ListGroup = () => {
    const auth = useAuth();
    const [groups, setGroups] = useState([]);
    const [load, setLoad] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loadButton, setLoadButton] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [data, setData] = useState([]);

    const getListGroup = useCallback(async () => {
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
        getListGroup();
    }, [getListGroup])

    const handleInput = (e) => {
        const value = e.target.value;
        setEmail(value);
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
                body: JSON.stringify({ email: email, group_id: id })
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
                    }, 1000);
                }
            }, 500);
        } catch (err) {
            navigate('/server-error');
        }
    }

    const handleOk = ()=>{
        setShowMembers(false);
    }

    const funcShowMembers = (id) => {
        const data = groups.find((g) => { return g._id === id });
        setShowMembers(true);
        setData(data);
    }

    const handleCancel = () => {
        setShowMembers(false);
      };

    return (
        <>
            {contextHolder}
            <Helmet><title>Finances</title></Helmet>
            <Spin spinning={load} fullscreen />
            <Row gutter={16}>
                {groups?.map((group) => (
                    <Col span={8}>
                        <Card id={group._id} title={group.name} style={{ margin: '10px' }}
                            bordered={false}
                            extra={<Button onClick={(e) => {
                                e.stopPropagation();
                                funcShowMembers(group._id);
                            }}
                                type="link">Show Members</Button>}
                            onClick={() => {
                                navigate(`/group/${group._id}`)
                            }}
                        >
                            {group.description}
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal
                title={`List members group ${data?.name}`}
                open={showMembers}
                cancelButtonProps={{ style: { display: 'none' } }}
                onOk={handleOk}
                onCancel={handleCancel}
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
                                <Button onClick={(e) => {
                                    e.stopPropagation();
                                }} type="link">
                                    Remove
                                </Button>
                            </List.Item>
                        )}
                    />
                    <div style={{ display: 'flex' }}>
                        <Input style={{ margin: 5 }} autoFocus onChange={handleInput} name='email' placeholder='Invite Email' />
                        <Button loading={loadButton} autoFocus style={{ margin: 5 }} onClick={
                            (e)=>{
                                e.preventDefault();
                                handleAdd(data._id);
                            }
                        }>Invite</Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ListGroup;