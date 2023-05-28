import React, { useState } from 'react';
import { HomeOutlined, FileDoneOutlined, LogoutOutlined, FundProjectionScreenOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useEffect } from 'react';
import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import LogOut from '../../LogOut';
import Profile from '../../Profile';
import Logo from '../../../images/light.png';
import AuthService from '../../AuthService';
import SearchUser from '../../SearchUser';
import axios from 'axios';
import BaseScoreCalculationUsingBaseMetrics from '../../BaseScoreCalculationUsingBaseMetrics';
import BaseScoreCalculationUsingDescription from '../../BaseScoreCalculationUsingDescription';
import SearchVulnerability from '../../SearchVulnerability';
import OwnPosts from '../../OwnPosts';
import BaseScoreUsingQA from '../../BaseScoreUsingQA';
import ExplorePubliclyTestedVulnerabilities from '../ExplorePubliclyTestedVulnerabilities';
import ExploreOwnTestedVulnerabilities from '../../YourTests';
import CVSSReport from '../CVSSReport';
import LoggedInHome from '../LoggedInHome';

const { Content, Footer, Sider } = Layout;

const UserHeader = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const userID = useParams();
  const params = useParams();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { key: '2', label: 'Home', icon: <FileDoneOutlined />, path: `/user/${params.userType}/${params.uID}/home` },
    { key: '1', label: 'Profile', icon: <HomeOutlined />, path: `/user/${params.userType}/${params.uID}/profile`, },
    { key: '3', label: 'Your Posts', icon: <FileDoneOutlined />, path: `/user/${params.userType}/${params.uID}/yourPosts` },
    {
      key: '4',
      label: 'Base Score',
      icon: <FundProjectionScreenOutlined />,
      children: [
        {
          key: '1-1',
          label: 'Use Description',
          path: `/user/${params.userType}/${params.uID}/test/description`,
        },
        {
          key: '1-2',
          label: 'Use Q/A',
          path: `/user/${params.userType}/${params.uID}/test/qa`,
        },
        {
          key: '1-3',
          label: 'Use Base Metrics',
          path: `/user/${params.userType}/${params.uID}/test/baseMetrics`,
        },
      ],
    },
    {
      key: '6',
      label: 'Explore Vulnerability',
      icon: <FileSearchOutlined />,
      children: [
        {
          key: '1-1',
          label: 'public tests',
          path: `/user/${params.userType}/${params.uID}/publicVulnerabilityTestings`,
        },
        {
          key: '1-2',
          label: 'your tests',
          path: `/user/${params.userType}/${params.uID}/yourVulnerabilityTestings`,
        },
      ],
    },
    { key: '6', label: 'Log Out', icon: <LogoutOutlined />, path: `/user/${params.userType}/${params.uID}/logout` },
  ];


  useEffect(() => {
    const token = AuthService.getToken();
    console.log(userID);


    axios.post('http://localhost:5050/validator/checkValidation', {
      token: token,
      userID: params
    }).then((response) => {
      setIsAuthenticated(response.data);
    })
  }, [params, userID]);

  if (isAuthenticated === null) {
    return null;
  } else if (isAuthenticated === false) {
    navigate('/error');
    return null;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ position: 'fixed', minHeight: '100vh' }}
        >
          <div className="demo-logo-vertical" style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={Logo} alt="Logo" style={{ width: '180px', marginTop: '10px', marginBottom: '10px' }} />
          </div>
          <Menu theme="dark" mode="inline">
            {items.map((item) => {
              if (item.children) {
                return (
                  <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                    {item.children.map((child) => (
                      <Menu.Item key={child.path}>
                        <Link to={child.path} style={{ textDecoration: 'none' }}>
                          {child.label}
                        </Link>
                      </Menu.Item>
                    ))}
                  </Menu.SubMenu>
                );
              } else {
                return (
                  <Menu.Item key={item.path} icon={item.icon}>
                    <Link to={item.path} style={{ textDecoration: 'none' }}>
                      {item.label}
                    </Link>
                  </Menu.Item>
                );
              }
            })}
          </Menu>

        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Content style={{ margin: '0 16px', minHeight: 'calc(100vh - 64px - 69px)' }}>
            <Routes>
              <Route path="/profile" element={<Profile uID={params.uID} />} />
              <Route path="/home" element={<LoggedInHome />} />
              <Route path="/logout" element={<LogOut />} />
              <Route path="/yourPosts" element={<OwnPosts />} />
              <Route path="/search/:uID" element={<SearchUser />} />
              <Route path="/test/baseMetrics" element={<BaseScoreCalculationUsingBaseMetrics />} />
              <Route path="/test/description" element={<BaseScoreCalculationUsingDescription />} />
              <Route path='/test/CVSSreport/:vID' element={<SearchVulnerability />} />
              <Route path='/CVSSreport' element={<CVSSReport />} />
              <Route path='/publicVulnerabilityTestings' element={<ExplorePubliclyTestedVulnerabilities />} />
              <Route path='/yourVulnerabilityTestings' element={<ExploreOwnTestedVulnerabilities />} />
              <Route path='/test/qa' element={<BaseScoreUsingQA />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center', position: 'fixed', bottom: 0, width: '85%' }}>SVAS ©2023</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default UserHeader;
