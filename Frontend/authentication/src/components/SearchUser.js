import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import UserProfileImage from '../images/user.png';
import axios from 'axios';

const SearchUser = () => {
    const params = useParams();
    const [userData, setUserData] = useState();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.post('http://localhost:5050/user/uIDSearch', { uID: params.otherUserID });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [params.otherUserID]);

    const columns = [
        {
            title: 'Field',
            dataIndex: 'field',
            key: 'field',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    const data = userData
    ? [
      { key: '1', field: 'Name', value: userData.name },
      { key: '2', field: 'Company Name', value: userData.companyName },
      { key: '3', field: 'Phone Number', value: userData.phoneNumber },
      { key: '4', field: 'Country', value: userData.country },
      { key: '5', field: 'Email', value: userData.email },
    ]
    : [];

    console.log(userData);
    return (
        <div>
            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                    <img
                        src={UserProfileImage}
                        alt="Profile"
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        bordered
                        size="middle"
                        style={{ marginTop: '20px', width: '80%' }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SearchUser