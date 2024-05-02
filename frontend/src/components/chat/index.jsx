import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, List, Avatar } from 'antd';
import './ChatApp.css'; // Import CSS file for custom styling
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../provider/auth';
import { message} from 'antd';
const socket = io('http://localhost:5050');

const ChatPage = () => {
  const { id } = useParams();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const auth = useAuth();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    socket.on('message', (message) => {
      console.log(message)
      setMessages([...messages, message])
    });
    socket.emit('join', auth.user?._id);
    scrollToBottom();
  }, [auth, messageApi, messages]);

  const sendMessage = () => {
    if (messageText.trim() !== '') {
      const newMessage = {
        content: messageText,
        sender: auth.user?._id,
        receiver: id,
        // Assume current user is sending the message
      };
      socket.emit('message', newMessage);
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  return (
    <div className="chat-container">
      {contextHolder}
      <List
        className="message-list"
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={(msg, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={msg.sender === 'me' ? '/avatar_me.png' : '/avatar_other.png'} />}
              title={msg.sender === 'me' ? 'You' : 'Other Person'}
              description={msg.content}
            />
          </List.Item>
        )}
      />
      <div ref={messagesEndRef} />
      <div className="input-container">
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onPressEnter={sendMessage}
          placeholder="Type your message..."
        />
        <Button type="primary" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
