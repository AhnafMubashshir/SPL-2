import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import axios from 'axios';

const ForgetPassword = () => {
    const [form] = Form.useForm();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showEmailField, setShowEmailField] = useState(true);
    const [showOtpField, setShowOtpField] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [emailFound, setEmailFound] = useState(false);
    const [userOTP, setUserOTP] = useState();
    const [error, setError] = useState();
    const [successMessage, setSuccessMessage] = useState();

    const sendOTP = (email) => {
        console.log(email);
        axios
            .post("http://localhost:5050/authentication", {
                email: email
            })
            .then((response) => {
                setUserOTP(response.data);
            })
            .catch((err) => {
                if (err) {
                    console.log(err);
                }
            });
    }

    const handleEmailSubmit = async () => {
        try {
            const emailExists = await checkEmailExists(email);
            console.log(emailExists);
            if (emailExists) {
                setEmailFound(true);
                setShowEmailField(false);
                setShowOtpField(true);
                setShowAlert(true);
                sendOTP(email);
                setSuccessMessage('Account found!!! Enter the OTP.');
            } else {
                setEmailFound(false);
                setShowAlert(true);

                console.log('Email does not exist.');
                setError('Email does not exist.');
            }
        } catch (error) {
            console.error('Error checking email existence:', error);
        }
    };

    const handleOtpSubmit = () => {
        setShowAlert(false);
        if (userOTP && otp === userOTP.toString()) {
            setShowOtpField(false);
            setShowPasswordField(true);
        } else {
            setError('Wrong OTP');
        }
    };

    const handlePasswordSubmit = async () => {
        try {
            if (!newPassword || !confirmPassword) {
                return;
            }
            form.resetFields();

            const updateResponse = await axios.post('http://localhost:5050/user/updatePassword', {
                email: email,
                newPassword: newPassword,
            });

            if (updateResponse.status === 200) {
                setSuccessMessage('Password updated!!! Login with your new Password.');
                setShowPasswordField(false);
                setShowAlert(true);
            } else {
                setError('OOPS!!! Something is wrong. Please try again.');
                setShowEmailField(true);
                setShowAlert(true);
            }
            console.log('Password updated successfully!');
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    const validatePassword = (_, value) => {
        if (value && value.length < 8) {
            return Promise.reject(new Error('Password must be at least 8 characters long.'));
        }
        else if (value === null){
            return Promise.reject(new Error('Enter a valid password.'));
        }
        return Promise.resolve();
    };

    const checkEmailExists = async (email) => {
        const response = await axios.post('http://localhost:5050/user/checkEmail', { email: email });
        console.log(response);
        return response.data.sign;
    };

    return (
        <>
            {emailFound && showAlert && (
                <Alert
                    message={successMessage}
                    type="success"
                    style={{ marginBottom: '1rem' }}
                />
            )}
            {showEmailField && showAlert && !emailFound && (
                <Alert
                    message={error}
                    type="error"
                    style={{ marginBottom: '1rem' }}
                />
            )}

            <Form form={form} layout="vertical" onFinish={handleEmailSubmit}>
                {showEmailField && (
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email address.' },
                            { type: 'email', message: 'Please enter a valid email address.' },
                        ]}
                    >
                        <Input onChange={(e) => setEmail(e.target.value)} />
                    </Form.Item>
                )}

                {showOtpField && (
                    <Form.Item
                        label="OTP"
                        name="otp"
                        rules={[{ required: true, message: 'Please enter the OTP.' }]}
                    >
                        <Input onChange={(e) => setOtp(e.target.value)} />
                    </Form.Item>
                )}

                {showPasswordField && (
                    <>
                        <Form.Item
                            label="New Password"
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Please enter a new password.' },
                                { validator: validatePassword },
                            ]}
                        >
                            <Input.Password onChange={(e) => setNewPassword(e.target.value)} />
                        </Form.Item>

                        <Form.Item
                            label="Confirm New Password"
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Please confirm your new password.' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords do not match.'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password onChange={(e) => setConfirmPassword(e.target.value)} />
                        </Form.Item>
                    </>
                )}

                {showEmailField && (
                    <Button type="primary" htmlType="submit" style={{ background: '#192841' }}>
                        Find Account
                    </Button>
                )}

                {showOtpField && (
                    <Button type="primary" onClick={handleOtpSubmit} style={{ background: '#192841' }}>
                        Verify OTP
                    </Button>
                )}

                {showPasswordField && (
                    <Button type="primary" onClick={handlePasswordSubmit} style={{ background: '#192841' }}>
                        Update Password
                    </Button>
                )}
            </Form>
        </>
    );
};

export default ForgetPassword;
