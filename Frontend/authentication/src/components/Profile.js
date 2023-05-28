import React, { useEffect, useState } from 'react';
import { Table, Menu, Modal, Dropdown, Button, Input, Form, FloatButton } from 'antd';
import { MenuOutlined, MailOutlined, CheckCircleOutlined, MessageOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import UserProfileImage from '../images/user.png';
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from './AuthService';
import Chats from './Chat/Chats';
import ChatBox from './Chat/ChatBox';

const { TextArea } = Input;

const Profile = ({ uID }) => {
  const [userData, setUserData] = useState(null);
  const params = useParams();
  const [form] = Form.useForm();
  const [infoUpdateForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldvalue, setFiledValue] = useState({
    name: '',
    companyName: '',
    phoneNumber: '',
    email: '',
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [changePasswordForm] = Form.useForm();
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const navigate = useNavigate();
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post('http://localhost:5050/user/uIDSearch', { uID });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [uID]);

  const handleMenuClick = ({ key }) => {
    if (key === 'edit') {
      fieldvalue.name = userData.name;
      fieldvalue.companyName = userData.companyName;
      fieldvalue.phoneNumber = userData.phoneNumber;
      fieldvalue.email = userData.email;
      setOpen(true);
    } else if (key === 'delete') {
      setDeleteModalVisible(true);
    } else if (key === 'changePassword') {
      setChangePasswordModalVisible(true);
    }
  };

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
      { key: '6', field: 'Type', value: userTypeToLabel(userData.userType) },
    ]
    : [];

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="edit">Edit Profile</Menu.Item>
      <Menu.Item key="delete">Delete Profile</Menu.Item>
      <Menu.Item key="changePassword">Change Password</Menu.Item>
    </Menu>
  );

  function userTypeToLabel(userType) {
    if (userType === 'GU') {
      return 'General User';
    } else if (userType === 'AU') {
      return 'Admin User';
    }

    return 'Unknown User Type';
  }

  const handleFormSubmit = (values) => {
    console.log('Concern title:', values.title);
    console.log('Concern body:', values.body);
    axios
      .post('http://localhost:5050/posts', {
        post: values,
        userID: uID,
      })
      .then((response) => {
        if (response) {
          console.log('Eta age', response);
          if (params.userType === 'GU') {
            navigate(`/user/${params.userType}/${params.uID}/yourPosts`);
          }
          else if (params.userType === 'AU') {
            navigate(`/admin/${params.userType}/${params.uID}/yourPosts`);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    form.resetFields();
  };

  const handleCancel = () => {
    handleClearValues();
    setOpen(false);
  };

  const handleClearValues = () => {
    setFiledValue({
      name: '',
      companyName: '',
      phoneNumber: '',
    });
  };

  const handleOk = async (data) => {
    setLoading(true);

    try {
      data.preventDefault();
      const { name, companyName, phoneNumber, email } = fieldvalue;

      if (!name || !companyName || !phoneNumber || !email) {
        setLoading(false);
        console.log('Please fill in all fields');
        return;
      }

      await infoUpdateForm.validateFields();

      console.log(fieldvalue);

      Modal.confirm({
        title: 'Confirm Changes',
        content: 'Are you sure you want to save the changes?',
        okButtonProps: {
          style: { background: '#192841' }
        },
        onOk: async () => {
          try {
            await axios.post('http://localhost:5050/user/update', fieldvalue);
            setLoading(false);
            setOpen(false);
            window.location.reload();
          } catch (error) {
            console.error('Error updating user:', error);
          }
        },
        onCancel: () => {
          console.log('Cancel');
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Error validating fields:', error);
      setLoading(false);
    }
  };

  console.log(fieldvalue);

  const getData = (data) => {
    const fieldName = data.target.name;
    const fieldValue = data.target.value;

    setFiledValue((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  const handleDeleteConfirm = () => {
    axios
      .post('http://localhost:5050/user/delete', userData)
      .then((response) => {
        if (response) {
          console.log('Eta age', response);
          AuthService.clearToken();
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
  };

  const handlePasswordChangeSubmit = () => {
    changePasswordForm.validateFields().then(async (values) => {
      try {
        setLoading(true);

        const response = await axios.post('http://localhost:5050/user/checkPassword', {
          email: userData.email,
          password: values.currentPassword,
        });

        console.log('success');

        if (response.data.sign === true) {

          if (values.newPassword === values.confirmPassword) {

            const updateResponse = await axios.post('http://localhost:5050/user/updatePassword', {
              email: userData.email,
              newPassword: values.newPassword,
            });

            console.log(updateResponse.status);

            if (updateResponse.status === 200) {

              setChangePasswordModalVisible(false);
              setPasswordChangeError('');
              setPasswordChangeSuccess(true);
              changePasswordForm.resetFields();
            } else {
              setPasswordChangeError('Failed to update password. Please try again.');
            }
          } else {
            setPasswordChangeError('New password and confirm password do not match.');
          }
        } else {
          setPasswordChangeError('Current password is incorrect.');
        }
      } catch (error) {
        console.error('Error checking password or updating password:', error);
        setPasswordChangeError('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    });
  };


  const handlePasswordChangeCancel = () => {
    setChangePasswordModalVisible(false);
    setPasswordChangeError('');
    setPasswordChangeSuccess(false);
    changePasswordForm.resetFields();
  };

  const showChatModal = () => {
    setIsChatModalVisible(true);
  };

  const handleChatOk = () => {
    setIsChatModalVisible(false);
  };

  const handleChatCancel = () => {
    setIsChatModalVisible(false);
  };

  function handleSearch(value) {
    if (params.userType === 'AU') {
      navigate(`/admin/${params.userType}/${params.uID}/search/${value}`);
    }
    else {
      navigate(`/user/${params.userType}/${params.uID}/search/${value}`);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: 10 }}>
        <Input.Search
          placeholder="Search"
          enterButton={
            <Button type="primary" icon={<SearchOutlined />} style={{ background: '#192841' }} />
          }
          style={{ marginRight: 50 }}
          onSearch={handleSearch}
        />
        <Dropdown overlay={menu} >
          <Button type="text" icon={<MenuOutlined />} />
        </Dropdown>
      </div>
      <FloatButton
        onClick={showChatModal}
        icon={<MessageOutlined style={{ fontSize: 20 }} />}
        style={{ height: 50, width: 50 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
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
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <div style={{ width: '80%', marginBottom: '80px' }}>
            <h2 style={{ textAlign: 'center' }}>Share your Concerns</h2>
            <Form form={form} onFinish={handleFormSubmit} layout="vertical" style={{ marginTop: '20px' }}>
              <Form.Item
                name="title"
                label={<strong>Title</strong>}
                rules={[
                  {
                    required: true,
                    message: 'Please enter a title',
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
              <Form.Item
                name="body"
                label={<strong>Concerns</strong>}
                rules={[
                  {
                    required: true,
                    message: 'Please enter the body of your concern',
                  },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ background: '#192841' }}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

      <Modal
        visible={open}
        title="Edit Your Profile"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk} style={{ background: '#192841' }}>
            Save Changes
          </Button>,
        ]}
      >
        <Form form={infoUpdateForm} layout="vertical" initialValues={fieldvalue}>
          <Form.Item
            name="name"
            label={<strong>Name</strong>}
            rules={[
              {
                required: true,
                message: 'Please enter your name',
              },
            ]}
          >
            <TextArea name='name' showCount style={{ height: 50, marginBottom: 24 }} onChange={getData} />
          </Form.Item>
          <Form.Item
            name="companyName"
            label={<strong>Company Name</strong>}
            rules={[
              {
                required: true,
                message: 'Please enter your company name',
              },
            ]}
          >
            <TextArea name='companyName' showCount style={{ height: 50, marginBottom: 24 }} onChange={getData} />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label={<strong>Phone Number</strong>}
            rules={[
              {
                required: true,
                message: 'Please enter your phone number',
              },
            ]}
          >
            <TextArea name='phoneNumber' showCount style={{ height: 50, marginBottom: 24 }} onChange={getData} />
          </Form.Item>
        </Form>
      </Modal>



      <Modal
        visible={deleteModalVisible}
        title="Delete Profile"
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okButtonProps={{ style: { background: '#192841' } }}
      >
        <p>Are you sure you want to delete your profile?</p>
      </Modal>

      <Modal
        visible={changePasswordModalVisible}
        title="Change Password"
        onOk={handlePasswordChangeSubmit}
        onCancel={handlePasswordChangeCancel}
        footer={[
          <Button key="back" onClick={handlePasswordChangeCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handlePasswordChangeSubmit} style={{ background: '#192841' }}>
            Change Password
          </Button>,
        ]}
      >
        <Form form={changePasswordForm} layout="vertical">
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              {
                required: true,
                message: 'Please enter your current password',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              {
                required: true,
                message: 'Please enter a new password',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value.length >= 8) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Password must be at least 8 characters long'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              {
                required: true,
                message: 'Please confirm your new password',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value.length >= 8) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Password must be at least 8 characters long'));
                },
              }),
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('New password and confirm password do not match'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          {passwordChangeError && <p style={{ color: 'red' }}>{passwordChangeError}</p>}
        </Form>
      </Modal>

      <Modal
        visible={passwordChangeSuccess}
        title="Password Updated"
        onCancel={handlePasswordChangeCancel}
        footer={[
          <Button key="close" onClick={handlePasswordChangeCancel}>
            Close
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleOutlined style={{ color: 'green', fontSize: 24, marginRight: 10 }} />
          <p style={{ margin: 0 }}>Your password has been updated successfully!</p>
        </div>
      </Modal>

      <Modal
        title="Chat Box"
        visible={isChatModalVisible}
        onOk={handleChatOk}
        onCancel={handleChatCancel}
        footer={null}
      >
        {params.userType === 'AU' ? (
          <ChatBox uID={params.uID} userType={params.userType} />
        ) : (
          <Chats uID={params.uID} userType={params.userType} />
        )}
      </Modal>
    </div>
  );
};

export default Profile;