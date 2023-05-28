import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Button, Row, Col, Card } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const Chats = ({ uID, userType }) => {
    const [chats, setChats] = useState([]);
    const [userName, setUserName] = useState();
    const [form] = Form.useForm();
    const chatContainerRef = useRef(null);

    function scrollToBottom() {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }

    useEffect(() => {
        axios
            .post('http://localhost:5050/chats/getChats', {
                uID: uID,
            })
            .then((response) => {
                setChats(response.data.chats);
                setUserName(response.data.userName);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [uID, form, scrollToBottom]);

    async function updateChats() {
        axios
            .post('http://localhost:5050/chats/getChats', {
                uID: uID,
            })
            .then((response) => {
                setChats(response.data.chats);
                setUserName(response.data.userName);
                scrollToBottom();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const isRightSide = (sender) => {
        return (sender === 'ADMIN' && userType === 'AU') || (sender === 'USER' && userType === 'GU');
    };

    const handleSubmit = async (values) => {
        console.log('Form values:', values, userType);

        const response = await axios.post('http://localhost:5050/chats/createChat', {
            userID: uID,
            userType: userType,
            message: values.message,
        });

        form.resetFields();
        updateChats();

        console.log(response.data);
        scrollToBottom();
    };

    return (
        <>
            <Card
                style={{
                    marginTop: 10,
                    height: '300px',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    marginBottom: 50,
                }}
                ref={chatContainerRef}
            >
                <div>
                    {chats.map((chat) => (
                        <div key={chat.id}>
                            <div
                                style={{
                                    textAlign: isRightSide(chat.sender) ? 'right' : 'left',
                                    background: isRightSide(chat.sender) ? '#2a9df4' : '#d0efff',
                                    padding: '10px',
                                    margin: '10px',
                                    borderRadius: '10px',
                                }}
                            >
                                {chat.sender === 'ADMIN' ? (
                                    <p>
                                        <strong>Admin</strong>
                                    </p>
                                ) : (
                                    <p>
                                        <strong>{userName}</strong>
                                    </p>
                                )}
                                {chat.message}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <Form form={form} onFinish={handleSubmit}>
                <Row gutter={16} align="bottom">
                    <Col flex="auto">
                        <Form.Item name="message">
                            <Input placeholder="Type your message" />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item>
                            <Button icon={<SendOutlined style={{ fontSize: 10 }} />} htmlType="submit" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default Chats;
