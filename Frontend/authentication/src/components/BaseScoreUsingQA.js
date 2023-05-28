import React, { useState } from 'react';
import { Form, Radio, Button, Row, Col, Card, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const questions = [
    {
        question: '1. Is it possible for your system to be hacked online?',
        options: [
            'No',
            'Yes, but only from the same network like LAN, Wifi or Bluetooth',
            'Yes, it can be accessed from anywhere using the internet',
        ],
    },
    {
        question: '2. How can your system be exploited using the vulnerability?',
        options: [
            'Attacker needs to physically touch the vulnerable component (USB, Direct Memory Access (DMA))',
            'Targeted system can be accessed locally using Keyboard, console or SSH',
        ],
    },
    {
        question: '3. Does an attacker need secret knowledge about your system to exploit the vulnerability?',
        options: ['Yes', 'No'],
    },
    {
        question: '4. Does an attacker need to have special skill to attack your system?',
        options: ['Yes', 'No'],
    },
    {
        question: '5.  an attacker enter your system unauthorized?',
        options: ['Yes', 'No'],
    },
    {
        question: '6. Can the attacker hack your system as a user or do they need special administrative permission?',
        options: ['As a user', 'Need administrator permission'],
    },
    {
        question: '7. Is your system can be exploited without any user or admins’ interaction like someone clicking a link, installing any software?',
        options: ['Yes', 'No'],
    },
    {
        question: '8. Is this vulnerability connected to any other security domain/authority?',
        options: ['Yes', 'No'],
    },
    {
        question: '9. Is there any possibility an attacker will be able to access password, encryption key?',
        options: ['Yes', 'No'],
    },
    {
        question: '10. Can the hacker steal information by exploiting the vulnerability?',
        options: ['Yes', 'No'],
    },
    {
        question: '11. Can an attacker add malicious code or data into the system?',
        options: ['Yes', 'No'],
    },
    {
        question: '12. Can an attacker modify the data of your system?',
        options: ['Yes', 'No'],
    },
    {
        question: '13. Will a successful attack on your system prevent other users from entering the system?',
        options: ['Yes', 'No'],
    },
    {
        question: '14. Will a successful attack on your system slow down the server?',
        options: ['Yes', 'No'],
    },
];

const RadioButtonGroup = Radio.Group;

const BaseScoreUsingQA = () => {
    const params = useParams();
    const [score, setScore] = useState();
    const [severity, setSeverity] = useState();
    const [loading, setLoading] = useState(false);
    const [vulnerability, setVulnerability] = useState();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        console.log('Form values:', values);
        for (const key in values) {
            if (values[key] === undefined || values[key] === null) {
                setLoading(false);
                message.error('Please select a value for all questions');
                return;
            }
        }
        const response = await axios.post('http://192.168.22.61:5000/calculate_score_using_QA', {
            q1: values.q1,
            q2: values.q2,
            q3: values.q3,
            q4: values.q4,
            q5: values.q5,
            q6: values.q6,
            q7: values.q7,
            q8: values.q8,
            q9: values.q9,
            q10: values.q10,
            q11: values.q11,
            q12: values.q12,
            q13: values.q13,
            q14: values.q14,
        });

        console.log("Hello: ", response.data);

        setVulnerability(response.data);

        setScore(response.data.baseScore);
        setSeverity(response.data.severity);


        await axios.post('http://localhost:5050/vulnerability/push', {
            data: response.data,
            uID: params.uID,
        });

        setLoading(false);
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'None':
                return 'green';
            case 'Low':
                return '#99cc33';
            case 'Medium':
                return 'orange';
            case 'High':
                return '#ff4545';
            case 'Critical':
                return '#cc0000';
            default:
                return 'white';
        }
    };

    const handleVReport = () => {
        if (params.userType === 'AU') {
            navigate(`/admin/${params.userType}/${params.uID}/CVSSReport`, { state: { vulnerability } });
        }
        else if (params.userType === 'GU') {
            navigate(`/user/${params.userType}/${params.uID}/CVSSReport`, { state: { vulnerability } });
        }
    }

    return (
        <div>
            <div>
                <h2 style={{ color: '#192841', marginBottom: 15, marginRight: 100, marginLeft: 35 }}>CVSS Score Calculator</h2>
                <p style={{ color: '#192841', marginBottom: 15, marginRight: 80, marginLeft: 35 }}>
                    Please provide a description of the vulnerability on your system. This calculator will evaluate the severity
                    of the vulnerability based on standardized base metrics. Once you have provided the description, click the
                    "Calculate Base Score" button to obtain the base severity score.
                </p>
            </div>
            <Row style={{ marginBottom: 100, marginTop: 20, marginLeft: 30 }}>
                <Col span={16}>
                    <Form onFinish={onFinish}>
                        {questions.map((q, index) => (
                            <Card key={index} style={{ marginBottom: '10px', width: '100%' }}>
                                <h4 style={{ marginBottom: 10 }}>{q.question}</h4>
                                <Form.Item name={`q${index + 1}`}>
                                    <RadioButtonGroup>
                                        {q.options.map((option, i) => (
                                            <Row key={i} style={{ marginBottom: 5 }}>
                                                <Radio value={`${i + 1}`}>{option}</Radio>
                                            </Row>
                                        ))}
                                    </RadioButtonGroup>
                                </Form.Item>
                            </Card>
                        ))}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} style={{ background: '#192841' }}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={8}>
                    <div style={{ position: 'fixed', right: 30, width: 200, height: 200, marginRight: '5%', marginTop: '5%' }}>
                        <Card title="CVSS Score" bordered={false} style={{ width: '100%', height: '100%', background: getSeverityColor(severity) }}>
                            <h3 style={{ color: 'white' }}>{score}</h3>
                        </Card>
                    </div>
                    <div style={{ position: 'fixed', right: 30, width: 200, height: 200, marginRight: '5%', marginTop: '20%' }}>
                        <Card title="Severity" bordered={false} style={{ width: '100%', height: '100%', background: getSeverityColor(severity) }}>
                            <h3 style={{ color: 'white' }}>{severity}</h3>
                        </Card>
                    </div>
                    <div style={{ position: 'fixed', right: 30, width: 200, height: 200, marginRight: '5%', marginTop: '34%' }}>
                        {
                            vulnerability &&
                            <Button
                                type="primary"
                                loading={loading}
                                onClick={handleVReport}
                                style={{ background: '#276221', width: 180 }}
                            >
                                Testing Report
                            </Button>
                        }
                    </div>
                </Col>
            </Row>
        </div>
    );

};

export default BaseScoreUsingQA;


