import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, List, Avatar } from 'antd';
import './ChatApp.css'; // Import CSS file for custom styling
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../provider/auth';

const ChatPage = () => {
  const { id } = useParams();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const auth = useAuth();
  const [urlReady, setUrlReady] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!auth.urlAPI) return;

    const newSocket = io(auth.urlAPI);
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [auth.urlAPI]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!socket || !urlReady) return;

    socket.on('message', (message) => {
      console.log(message);
      setMessages([...messages, message]);
    });

    socket.emit('join', auth.user?._id);
    scrollToBottom();

    return () => {
      socket.off('message');
    };
  }, [socket, auth.user?._id, messages, urlReady]);

  useEffect(() => {
    if (auth.urlAPI) {
      setUrlReady(true);
    }
  }, [auth.urlAPI]);

  const sendMessage = () => {
    if (messageText.trim() !== '') {
      const newMessage = {
        content: messageText,
        sender: auth.user?._id,
        receiver: id,
        // Assume current user is sending the message
      };
      socket?.emit('message', newMessage);
      setMessages([...messages, newMessage]);
      setMessageText('');
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
              avatar={<Avatar src={msg.sender?._id === auth.user?._id ? '/avatar_me.png' : '/avatar_other.png'} />}
              title={(msg.sender?._id === auth.user?._id || msg.sender ===auth.user?._id) ? auth.user.name : msg.sender.name}
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
