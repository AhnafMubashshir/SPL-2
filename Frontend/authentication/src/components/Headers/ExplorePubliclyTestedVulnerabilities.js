import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const ExplorePubliclyTestedVulnerabilities = () => {
    const params = useParams();
    const navigate = useNavigate('');
    const [allVulnerability, setAllVulnerability] = useState([]);

    useEffect(() => {
        fetchData();
        async function fetchData() {
            console.log('Hello');
            const response = await axios.get('http://localhost:5050/vulnerability');
            console.log(response);
            setAllVulnerability(response.data);
        }
    }, []);

    function checkVulnerability(vulnerability) {
        if (params.userType === 'AU') {
            navigate(`/admin/${params.userType}/${params.uID}/test/CVSSReport/${vulnerability.id}`);
        }
        else if (params.userType === 'GU') {
            navigate(`/user/${params.userType}/${params.uID}/test/CVSSReport/${vulnerability.id}`);
        }
    }

    function handleSearch(value) {
        if (params.userType === 'AU') {
            navigate(`/admin/${params.userType}/${params.uID}/test/CVSSreport/${value}`);
        }
        else {
            navigate(`/user/${params.userType}/${params.uID}/test/CVSSreport/${value}`);
        }
    }


    return (
        <>
            <div className="homepage" style={{ marginBottom: 50 }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '10vh',
                        padding: '10px',
                        background: '#f5f5f5',
                        marginBottom: '10px',
                    }}
                >
                    <h1>
                        <strong>Publicity Tested Vulnerabilities</strong>
                    </h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: 10 }}>
                    <Input.Search
                        placeholder="Search"
                        enterButton={
                            <Button type="primary" icon={<SearchOutlined />} style={{ background: '#192841' }} />
                        }
                        style={{ marginRight: 50 }}
                        onSearch={handleSearch}
                    />
                </div>
                {
                    !allVulnerability ? (
                        <Spin size='large' />
                    ) : (
                        <main style={{ marginTop: 20 }}>
                            {allVulnerability.map((vulnerability) => (
                                <div className="post" key={vulnerability.id} onClick={() => checkVulnerability(vulnerability)}>
                                    <div className="post-info">
                                        <div className="post-uid" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <strong>{vulnerability.userName}</strong>
                                            </div>
                                            <div>
                                                <strong>CVSS Score: </strong>{vulnerability.baseScore}
                                            </div>
                                        </div>
                                        <hr className="divider" />
                                        {vulnerability.description ? (
                                            <>
                                                <p>{vulnerability.description.length > 500 ? vulnerability.description.substring(0, 500) + '...' : vulnerability.description}</p>
                                                <hr className="divider" />
                                            </>
                                        ) : (
                                            <p>Description not provided...</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </main>
                    )
                }
            </div>

        </>
    )
}

export default ExplorePubliclyTestedVulnerabilities;