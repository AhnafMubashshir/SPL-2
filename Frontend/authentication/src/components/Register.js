import React, { useState } from 'react';
import { Form, Input, Button, Select, Tooltip, Modal, Row, Col, Layout } from 'antd';
import { UserOutlined, MailOutlined, GlobalOutlined, PhoneOutlined, LockOutlined, QuestionCircleOutlined, BankOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const countries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'East Timor',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Korea, North',
    'Korea, South',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe'
];


const Register = () => {
    const [form] = Form.useForm();
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [userOTP, setUserOTP] = useState('');
    const confirmDirty = false;
    const [formValues, setFormValues] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    console.log("form values: ", formValues);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log("In here: ",values);
            setFormValues(values);
            
            console.log("in here forms");
            sendOTP(values.email);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const validateName = (_, value) => {
        if (!value || value.trim() === '') {
            return Promise.reject('Please enter your name');
        }
        return Promise.resolve();
    };

    const validateEmail = (_, value) => {
        if (!value || value.trim() === '') {
            return Promise.reject('Please enter your email');
        }
        if (!/^\S+@\S+\.\S+$/.test(value)) {
            return Promise.reject('Please enter a valid email address');
        }
        return Promise.resolve();
    };

    const validateCountry = (_, value) => {
        if (!value || value.trim() === '') {
            return Promise.reject('Please select your country');
        }
        return Promise.resolve();
    };

    const validatePhoneNumber = (_, value) => {
        if (!value || value.trim() === '') {
            return Promise.reject('Please enter your phone number');
        }
        if (!/^[0-9]{11}$/.test(value)) {
            return Promise.reject('Please enter a valid 11-digit phone number');
        }
        return Promise.resolve();
    };

    const validatePassword = (_, value) => {
        if (!value || value.trim() === '') {
            return Promise.reject('Please enter your password');
        }
        if (value.length < 8) {
            return Promise.reject('Password must be at least 8 characters');
        }
        return Promise.resolve();
    };

    const compareToFirstPassword = (_, value) => {
        if (!value || value !== form.getFieldValue('password')) {
            return Promise.reject('The passwords do not match');
        }
        return Promise.resolve();
    };

    const validateToNextPassword = (_, value) => {
        if (value && confirmDirty) {
            form.validateFields(['retypePassword']);
        }
        return Promise.resolve();
    };

    const handleOtpInputChange = (e) => {
        setOtp(e.target.value);
    };

    const handleOtpConfirm = async () => {
        if (otp === userOTP.toString()) {
            setShowOtpModal(false);
            try {
                const response = await axios.post('http://localhost:5050/user/generateUserID');
                const userID = response.data.uID;
                console.log(userID);

                try {
                    const response = await axios.post('http://localhost:5050/user/signUp', {
                        formValues,
                        userID,
                        userType: 'GU',
                    });
                    if (response.status === 200) {
                        console.log(response);
                        navigate('/login');
                    }
                } catch (error) {
                    console.log(error);
                }

            } catch (error) {
                console.log(error)
            }
        } else {
            Modal.error({
                title: 'Invalid OTP',
                content: 'Please enter a valid OTP.',
            });
        }
    };

    const handleOtpCancel = () => {
        setShowOtpModal(false);
    };

    const sendOTP = (email) => {
        console.log("In here.");
        axios.post("http://localhost:5050/authentication", {
            email: email
        }).then((response) => {
            console.log("response: ", response.data);
            setUserOTP(response.data);
            setShowOtpModal(true);

        }).catch((err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    return (
        <Layout>
            <div className="form-container">
                <h3>Registration Form</h3>
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label={<strong>Name</strong>} name="name" rules={[{ validator: validateName }]}>
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<strong>Company Name</strong>} name="companyName">
                                <Input prefix={<BankOutlined />} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label={<strong>Email</strong>} name="email" rules={[{ validator: validateEmail }]}>
                        <Input prefix={<MailOutlined />} />
                    </Form.Item>

                    <Form.Item label={<strong>Country</strong>} name="country" rules={[{ validator: validateCountry }]}>
                        <Select prefix={<GlobalOutlined />}>
                            <Option value="">Select country</Option>
                            {countries.map((country, index) => (
                                <Option key={index} value={country}>
                                    {country}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={<strong>Phone Number</strong>}
                        name="phoneNumber"
                        rules={[{ validator: validatePhoneNumber }]}
                    >
                        <Input prefix={<PhoneOutlined />} />
                    </Form.Item>

                    <Form.Item
                        label={
                            <span>
                                <strong>Password&nbsp;</strong>
                                <Tooltip title="Password must be at least 8 characters">
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            </span>
                        }
                        name="password"
                        rules={[{ validator: validatePassword }]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item
                        label={<strong>Retype Password</strong>}
                        name="retypePassword"
                        rules={[
                            { validator: compareToFirstPassword },
                            { validator: validateToNextPassword },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ background: '#192841' }}>
                            {loading ? 'Register' : 'Register'}
                        </Button>
                    </Form.Item>
                </Form>
                <Modal
                    title="OTP Verification"
                    visible={showOtpModal}
                    onCancel={handleOtpCancel}
                    footer={[
                        <Button key="back" onClick={handleOtpCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" style={{ background: '#192841' }} onClick={handleOtpConfirm}>
                            OK
                        </Button>,
                    ]}
                >
                    <Form>
                        <Form.Item label="OTP">
                            <Input value={otp} onChange={handleOtpInputChange} />
                        </Form.Item>
                    </Form>
                </Modal>

            </div>
        </Layout>
    );
};

export default Register;
