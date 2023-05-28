import React, { useState } from 'react';
import { Radio, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const BaseScoreCalculationUsingBaseMetrics = () => {
    const [AVValue, setAVValue] = useState('');
    const [ACValue, setACValue] = useState('');
    const [PRValue, setPRValue] = useState('');
    const [UIValue, setUIValue] = useState('');
    const [SValue, setSValue] = useState('');
    const [CIValue, setCIValue] = useState('');
    const [IIValue, setIIValue] = useState('');
    const [AIValue, setAIValue] = useState('');
    const [score, setScore] = useState(0.0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const [severity, setSeverity] = useState();
    const [vulnerability, setVulnerability] = useState();

    const handleAVChange = (e) => {
        setAVValue(e.target.value);
    };

    const handleACChange = (e) => {
        setACValue(e.target.value);
    };

    const handlePRChange = (e) => {
        setPRValue(e.target.value);
    };

    const handleUIChange = (e) => {
        setUIValue(e.target.value);
    };

    const handleSChange = (e) => {
        setSValue(e.target.value);
    };

    const handleCIChange = (e) => {
        setCIValue(e.target.value);
    };

    const handleIIChange = (e) => {
        setIIValue(e.target.value);
    };

    const handleAIChange = (e) => {
        setAIValue(e.target.value);
    };

    const handleCalculateBaseScore = async () => {
        setLoading(true);

        if (
            AVValue === '' ||
            ACValue === '' ||
            PRValue === '' ||
            UIValue === '' ||
            SValue === '' ||
            CIValue === '' ||
            IIValue === '' ||
            AIValue === ''
        ) {
            setLoading(false)
            message.error('Please select a value for all fields');
            return;
        }

        try {
            const response = await axios.post('http://10.100.101.160:5000/calculate_score_using_base_metrics', {
                AV: AVValue.toUpperCase(),
                AC: ACValue.toUpperCase(),
                PR: PRValue.toUpperCase(),
                UI: UIValue.toUpperCase(),
                S: SValue.toUpperCase(),
                CI: CIValue.toUpperCase(),
                II: IIValue.toUpperCase(),
                AI: AIValue.toUpperCase(),
            })

            await axios.post('http://localhost:5050/vulnerability/push', {
                data: response.data,
                uID: params.uID,
            })

            setVulnerability(response.data);
            console.log(response.data.baseScore);

            setScore(response.data.baseScore)
            setSeverity(response.data.severity);
        } catch (error) {
            console.error('Error calculating base score:', error);
        } finally {
            setLoading(false);
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
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginLeft: 80,
                marginRight: 70,
                marginTop: 20,
                flexDirection: 'column'
            }}
            >
                <h2 style={{ color: '192841', marginBottom: 15 }}>CVSS Score Calculator</h2>
                <p>
                    The CVSS (Common Vulnerability Scoring System) Calculator is a tool that allows users to assess the severity
                    of software vulnerabilities based on the 8 base metrics defined in the CVSS framework. By entering the values
                    for each metric, shown below the calculator generates a base severity score. This score helps organizations
                    prioritize and address security issues effectively, enabling them to allocate resources efficiently and enhance
                    the security of their software systems.
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                <div style={{ border: '1px solid black', padding: '30px', borderRadius: '10px' }}>
                    <h6>Attack Vector</h6>
                    <Radio.Group
                        defaultValue={AVValue}
                        buttonStyle="solid"
                        onChange={handleAVChange}
                        style={{ marginBottom: 20 }}
                    >
                        <Radio.Button
                            value="PHYSICAL"
                            style={{ width: 90, background: AVValue === 'PHYSICAL' ? '#192841' : undefined }}
                        >
                            Physical
                        </Radio.Button>
                        <Radio.Button
                            value="LOCAL"
                            style={{ width: 90, background: AVValue === 'LOCAL' ? '#192841' : undefined }}
                        >
                            Local
                        </Radio.Button>
                        <Radio.Button
                            value="ADJACENT"
                            style={{ width: 90, background: AVValue === 'ADJACENT' ? '#192841' : undefined }}
                        >
                            Adjacent
                        </Radio.Button>
                        <Radio.Button
                            value="NETWORK"
                            style={{ width: 90, background: AVValue === 'NETWORK' ? '#192841' : undefined }}
                        >
                            Network
                        </Radio.Button>
                    </Radio.Group>

                    <h6>Attack Complexity</h6>
                    <Radio.Group
                        defaultValue={ACValue}
                        buttonStyle="solid"
                        onChange={handleACChange}
                        style={{ marginTop: 5, marginBottom: 20 }}
                    >
                        <Radio.Button
                            value="LOW"
                            style={{ width: 180, background: ACValue === 'LOW' ? '#192841' : undefined }}
                        >
                            Low
                        </Radio.Button>
                        <Radio.Button
                            value="HIGH"
                            style={{ width: 180, background: ACValue === 'HIGH' ? '#192841' : undefined }}
                        >
                            High
                        </Radio.Button>
                    </Radio.Group>

                    <h6>User Interaction</h6>
                    <Radio.Group
                        defaultValue={UIValue}
                        buttonStyle="solid"
                        onChange={handleUIChange}
                        style={{ marginTop: 5, marginBottom: 20 }}
                    >
                        <Radio.Button
                            value="NONE"
                            style={{ width: 180, background: UIValue === 'NONE' ? '#192841' : undefined }}
                        >
                            None
                        </Radio.Button>
                        <Radio.Button
                            value="REQUIRED"
                            style={{ width: 180, background: UIValue === 'REQUIRED' ? '#192841' : undefined }}
                        >
                            Required
                        </Radio.Button>
                    </Radio.Group>

                    <h6>Scope</h6>
                    <Radio.Group
                        defaultValue={SValue}
                        buttonStyle="solid"
                        onChange={handleSChange}
                        style={{ marginTop: 5, marginBottom: 20 }}
                    >
                        <Radio.Button
                            value="UNCHANGED"
                            style={{ width: 180, background: SValue === 'UNCHANGED' ? '#192841' : undefined }}
                        >
                            Unchanged
                        </Radio.Button>
                        <Radio.Button
                            value="CHANGED"
                            style={{ width: 180, background: SValue === 'CHANGED' ? '#192841' : undefined }}
                        >
                            Changed
                        </Radio.Button>
                    </Radio.Group>
                </div>

                <div
                    style=
                    {{
                        marginLeft: 40,
                        marginRight: 40,
                        width: 208,
                        height: 150,
                        border: '1px solid black',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        background: getSeverityColor(severity)
                    }}
                >
                    <h5 style={{ marginTop: 5, marginBottom: 10, color: 'white' }}><strong>CVSS Score</strong></h5>
                    <h6 style={{ color: 'white', marginBottom: 20 }}>{score}</h6>
                    <h5 style={{ marginTop: 5, marginBottom: 10, color: 'white' }}><strong>Severity</strong></h5>
                    <h6 style={{ color: 'white' }}>{severity}</h6>
                </div>

                <div style={{ border: '1px solid black', padding: '30px', borderRadius: '10px' }}>
                    <h6>Privileges Required</h6>
                    <Radio.Group
                        defaultValue={PRValue}
                        buttonStyle="solid"
                        onChange={handlePRChange}
                        style={{ marginTop: 5, marginBottom: 20 }}
                    >
                        <Radio.Button
                            value="HIGH"
                            style={{ width: 120, background: PRValue === 'HIGH' ? '#192841' : undefined }}
                        >
                            High
                        </Radio.Button>
                        <Radio.Button
                            value="LOW"
                            style={{ width: 120, background: PRValue === 'LOW' ? '#192841' : undefined }}
                        >
                            Low
                        </Radio.Button>
                        <Radio.Button
                            value="NONE"
                            style={{ width: 120, background: PRValue === 'NONE' ? '#192841' : undefined }}
                        >
                            None
                        </Radio.Button>
                    </Radio.Group>

                    <h6>Confidentiality Impact</h6>
                    <Radio.Group
                        defaultValue={CIValue}
                        buttonStyle="solid"
                        onChange={handleCIChange}
                        style={{ marginTop: 5, marginBottom: 20 }}
                    >
                        <Radio.Button
                            value="HIGH"
                            style={{ width: 120, background: CIValue === 'HIGH' ? '#192841' : undefined }}
                        >
                            High
                        </Radio.Button>
                        <Radio.Button
                            value="LOW"
                            style={{ width: 120, background: CIValue === 'LOW' ? '#192841' : undefined }}
                        >
                            Low
                        </Radio.Button>
                        <Radio.Button
                            value="NONE"
                            style={{ width: 120, background: CIValue === 'NONE' ? '#192841' : undefined }}
                        >
                            None
                        </Radio.Button>
                    </Radio.Group>

                    <h6>Integrity Impact</h6>
                    <Radio.Group
                        defaultValue={IIValue}
                        buttonStyle="solid"
                        onChange={handleIIChange}
                        style={{ marginTop: 5, marginBottom: 20 }}
                    >
                        <Radio.Button
                            value="HIGH"
                            style={{ width: 120, background: IIValue === 'HIGH' ? '#192841' : undefined }}
                        >
                            High
                        </Radio.Button>
                        <Radio.Button
                            value="LOW"
                            style={{ width: 120, background: IIValue === 'LOW' ? '#192841' : undefined }}
                        >
                            Low
                        </Radio.Button>
                        <Radio.Button
                            value="NONE"
                            style={{ width: 120, background: IIValue === 'NONE' ? '#192841' : undefined }}
                        >
                            None
                        </Radio.Button>
                    </Radio.Group>

                    <h6>Availability Impact</h6>
                    <Radio.Group
                        defaultValue={AIValue}
                        buttonStyle="solid"
                        onChange={handleAIChange}
                        style={{ marginTop: 5, marginBottom: 20 }}
                    >
                        <Radio.Button
                            value="HIGH"
                            style={{ width: 120, background: AIValue === 'HIGH' ? '#192841' : undefined }}
                        >
                            High
                        </Radio.Button>
                        <Radio.Button
                            value="LOW"
                            style={{ width: 120, background: AIValue === 'LOW' ? '#192841' : undefined }}
                        >
                            Low
                        </Radio.Button>
                        <Radio.Button
                            value="NONE"
                            style={{ width: 120, background: AIValue === 'NONE' ? '#192841' : undefined }}
                        >
                            None
                        </Radio.Button>
                    </Radio.Group>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: 20 }}>
                <Button
                    type="primary"
                    loading={loading}
                    onClick={handleCalculateBaseScore}
                    style=
                    {{
                        background: '#276221',
                        marginBottom: 50,
                        width: 180
                    }}
                >
                    Calculate Base Score
                </Button>
                {
                    vulnerability &&
                    <Button type="primary" onClick={handleVReport} style={{ background: '#276221', width: 180 }}>
                        Testing Report
                    </Button>
                }
            </div>
        </div>
    );
};

export default BaseScoreCalculationUsingBaseMetrics;
