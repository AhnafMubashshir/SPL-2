import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;

const BaseScoreCalculationUsingDescription = () => {
    const params = useParams();
    const [form] = Form.useForm();
    const [score, setScore] = useState(0.0);
    const [severity, setSeverity] = useState();
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate('');
    const [vulnerability, setVulnerability] = useState();
    const [reportButton, setReportButton] = useState(false);

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleCalculateBaseScore = async () => {
        try {
            await form.validateFields();

            setLoading(true);

            const response = await axios.post('http://192.168.22.61:5000/calculate_score_using_description', {
                Description: description,
            });

            setReportButton(true);

            setVulnerability(response.data);
            setScore(response.data.baseScore);
            setSeverity(response.data.severity);

            await axios.post('http://localhost:5050/vulnerability/push', {
                data: response.data,
                uID: params.uID,
            });
        } catch (error) {
            console.error('Error calculating base score:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVReport = () => {
        if (params.userType === 'AU') {
            navigate(`/admin/${params.userType}/${params.uID}/CVSSReport`, { state: { vulnerability } });
        } else if (params.userType === 'GU') {
            navigate(`/user/${params.userType}/${params.uID}/CVSSReport`, { state: { vulnerability } });
        }
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

    return (
        <div>
            <div>
                <h2 style={{ color: '#192841', marginBottom: 15 }}>CVSS Score Calculator</h2>
                <p style={{ marginBottom: 15 }}>
                    Please provide a description of the vulnerability on your system. This calculator will evaluate the severity
                    of the vulnerability based on standardized base metrics. Once you have provided the description, click the
                    "Calculate Base Score" button to obtain the base severity score.
                </p>
            </div>

            <div>
                <Form form={form} layout="vertical" onFinish={handleCalculateBaseScore}>
                    <Form.Item
                        label={<strong>Description</strong>}
                        name="description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <TextArea rows={10} placeholder="Describe the vulnerability on your system...." onChange={handleDescriptionChange} />
                    </Form.Item>
                </Form>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: 20 }}>
                <Button type="primary" loading={loading} htmlType="submit" style={{ background: '#276221', marginBottom: 20, width: 180 }}>
                    Calculate Base Score
                </Button>

                {severity && (
                    <div style={{ marginBottom: 20, padding: 10, borderRadius: 10, background: getSeverityColor(severity) }}>
                        <h4 style={{ color: 'white' }}>
                            <strong>CVSS Score: </strong>
                            <span>{score}</span>
                        </h4>
                        <h4 style={{ color: 'white' }}>
                            <strong>Severity: </strong>
                            <span>{severity}</span>
                        </h4>
                    </div>
                )}

                {reportButton && (
                    <Button type="primary" loading={loading} onClick={handleVReport} style={{ background: '#276221', width: 180 }}>
                        Testing Report
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BaseScoreCalculationUsingDescription;
