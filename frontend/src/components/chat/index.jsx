import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, List, Avatar } from 'antd';
import './ChatApp.css'; // Import CSS file for custom styling

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = {
        content: message,
        sender: 'me', // Assume current user is sending the message
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
