import React, { useState } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthService from './AuthService';
import './Login.css';
import ForgetPassword from './ForgetPassword';

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorShow, setErrorShow] = useState(false);
  const [forgottenPasswordModal, setForgottenPasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      console.log(values);
      checkLogin(values);
      setLoading(false);
    }, 2000);
  };

  const checkLogin = (user) => {
    axios.post("http://localhost:5050/user/checkPassword", {
      email: user.email,
      password: user.password,
    })
      .then((response) => {
        console.log(response);
        if (response.data.sign && response.data.length !== 0) {
          const UserID = response.data.userID
          const token = response.data.token
          const userType = response.data.userType;
          console.log("User Type: ", userType);

          if (token) {
            if (userType === 'GU') {
              console.log("in here", UserID);
              AuthService.setToken(token)
              navigate(`/user/${userType}/${UserID}/profile`);
            }
            else if (userType === 'AU') {
              console.log("in here", UserID);
              AuthService.setToken(token)
              navigate(`/admin/${userType}/${UserID}/profile`);
            }
          }
          else {
            setError('Login Error!!! Please try again.');
            setErrorShow(true);
          }
        }
        else {
          setError('Wrong Password/Email-ID!!! Please try again.')
          setErrorShow(true);
        }
      }).catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  }

  console.log(errorShow);

  function handleForgetPasswordModalCancel () {
    setForgottenPasswordModal(false);
  }

  function handleForgetPassword () {
    setForgottenPasswordModal(true);
  }

  return (
    <div className="login-container mt-3">
      <div className="form-container">
        <h3 style={{ fontSize: '32px', marginBottom: '32px' }}>Login</h3>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label={<strong style={{ fontSize: '18px' }}>Email</strong>}
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input prefix={<UserOutlined />} style={{ fontSize: '18px' }} />
          </Form.Item>

          <Form.Item
            label={<strong style={{ fontSize: '18px' }}>Password</strong>}
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password prefix={<LockOutlined />} style={{ fontSize: '18px' }} />
          </Form.Item>

          {errorShow && <div className="error-message" style={{ fontSize: '18px', marginBottom: '24px' }}>{error}</div>}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ fontSize: '18px', width: '100%', height: '38px', background: '#192841' }}>
              Login
            </Button>
          </Form.Item>

          <div className="register-link" style={{ marginTop: '24px', fontSize: '18px' }}>
            Don't have an account? <Link to="/register">Register now</Link>
          </div>
          <div className="register-link" style={{ marginTop: '24px', fontSize: '18px' }}>
            <Link onClick={handleForgetPassword}>Forgotten Password?</Link>
          </div>
        </Form>
      </div>

      <Modal
        visible={forgottenPasswordModal}
        title="Change Password"
        onCancel={handleForgetPasswordModalCancel}
        footer={null}
      >
        <ForgetPassword />
      </Modal>
    </div>
  )

};

export default Login;
