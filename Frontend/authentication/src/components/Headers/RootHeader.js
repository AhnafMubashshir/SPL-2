import { HomeOutlined, FileDoneOutlined, LoginOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import Login from '../Login';
import Register from '../Register';
import Logo from '../../images/light.png';
import SearchUser from '../SearchUser';
import RootHome from '../RootHome';

const { Content, Footer, Sider } = Layout;

const items = [
  { key: '1', label: 'Home', icon: <HomeOutlined />, path: '/' },
  { key: '2', label: 'Sign Up', icon: <FileDoneOutlined />, path: '/register' },
  { key: '3', label: 'Sign In', icon: <LoginOutlined />, path: '/login' },
];

const RootHeader = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  

  return (
    <div style={{
      minHeight: '100vh',
    }}>
      <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ position: 'fixed', minHeight: '100vh', overflow: 'auto', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="demo-logo-vertical" style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={Logo} alt="Logo" style={{ width: '180px', marginTop: '10px', marginBottom: '10px' }} />
          </div>
          <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline">
            {items.map((item) => (
              <Menu.Item key={item.path} icon={item.icon}>
                <Link to={item.path} style={{ textDecoration: 'none' }}>
                  {item.label}
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Content style={{
            margin: '0 16px',
            minHeight: 'calc(100vh - 64px - 69px)',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}>
            <div style={{ paddingBottom: '69px' }}>
              <Routes>
                <Route path="/" element={<RootHome />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path='/search/:uID' element={<>{<SearchUser />}</>} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', position: 'fixed', bottom: 0, width: '100%' }}>
            SVAS ©2023
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default RootHeader;
