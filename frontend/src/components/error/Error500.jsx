import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
const Error500 = () => {
    const navigate = useNavigate();
    return <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary" onClick={ ()=>{navigate('/')} }>Back Home</Button>}
    />
};
export default Error500;