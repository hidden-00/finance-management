import { Card, Col, Row, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { useAuth } from "../../provider/auth";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const ListChat = () => {
    const auth = useAuth();
    const [users, setUsers] = useState([]);
    const [load, setLoad] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const getListUsers = useCallback(async () => {
        try {
            setLoad(true);
            const response = await fetch(`${auth.urlAPI}/api/v1/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": auth.token
                }
            });
            const res = await response.json();
            if (res.success) {
                setUsers(res.data);
            } else {
                messageApi.info(res.msg);
            }
            setLoad(false);
        } catch (err) {
            messageApi.error('SERVER ERROR');
            navigate('/server-error');
        }
    }, [auth.urlAPI, auth.token, messageApi, navigate])

    useEffect(() => {
        getListUsers();
    }, [getListUsers])


    return (
        <>
            {contextHolder}
            <Helmet><title>Chat</title></Helmet>
            <Spin spinning={load} fullscreen />
            <Row gutter={16}>
                {users?.map((user) => user?._id !== auth.user?._id ? (
                    <Col span={8}>
                        <Card id={user._id} title={user.name} style={{ margin: '10px' }}
                            bordered={false}
                            onClick={() => {
                                navigate(`/chat/${user._id}`)
                            }}
                        >
                            {user.email}
                        </Card>
                    </Col>
                ) : <></>)}
            </Row>
        </>
    )
}

export default ListChat;