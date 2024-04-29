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

    const showMembers = (id) => {
        const data = groups.find((g) => { return g._id === id });
        Modal.info({
            title: `List members group ${data?.name}`,
            content: (
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
                        <Input style={{ margin: 5 }} name='email' placeholder='Invite Email' />
                        <Button style={{ margin: 5 }}>Invite</Button>
                    </div>
                </div>
            ),
            onOk() { },
        })
    }

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
                                showMembers(group._id);
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
        </>
    )
}

export default ListGroup;