import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chats from './Chats';
import { Button, Card } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';

const { Meta } = Card;

const ChatBox = ({ uID, userType }) => {
    console.log('chat:', uID, userType);

    const [uIDs, setUIDs] = useState([]);
    const [selectedUID, setSelectedUID] = useState(null);
    const [turn, setTurn] = useState(true);

    useEffect(() => {
        axios
            .get('http://localhost:5050/chats/getUIDs')
            .then((response) => {
                console.log(response.data);
                setUIDs(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [uID]);

    const handleBoxClick = (uid) => {
        setSelectedUID(uid);
        setTurn(true);
    };

    function handleReturnClick () {
        setTurn(false);
    }

    return (
        <div>
            {selectedUID && turn ? (
                <div>
                    <Button onClick={handleReturnClick}><RollbackOutlined /></Button>
                    {userType === 'AU' && <Chats uID={selectedUID.userID} userType={userType} />}
                </div>
            ) : (
                uIDs.map((uid) => (
                    <Card
                        key={uid.userID}
                        style={{ marginBottom: '10px', cursor: 'pointer' }}
                        onClick={() => handleBoxClick(uid)}
                    >
                        <Meta title={uid.name} />
                    </Card>
                ))
            )}
        </div>
    );
};

export default ChatBox;
