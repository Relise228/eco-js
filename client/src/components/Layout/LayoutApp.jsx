import {Layout, Menu, Breadcrumb} from 'antd';
import {
  RadarChartOutlined,
  LaptopOutlined,
  NotificationOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import React, {useState} from 'react';
import {Link, Redirect, Route, Switch} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectIsAuth} from '../../redux/features/authSlice';
import StationsPage from '../StationsPage/StationsPage';
import StationPage from '../StationPage/StationPage';
import ComparePage from '../ComparePage/ComparePage';
import MapPage from '../MapPage/MapPage';
import {selectCurrentPageIndex} from '../../redux/features/stationsSlice';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
const LayoutApp = () => {
  const auth = useSelector(selectIsAuth);
  const index = useSelector(selectCurrentPageIndex);

  if (!auth) return <Redirect to={'/login'} />;

  return (
    <Layout style={{minHeight: '100vh'}}>
      {/* <Header className='header'>
        <div className='logo' />
      </Header> */}
      <Layout>
        <Sider collapsible width={200} className='site-layout-background'>
          <Menu
            theme='dark'
            mode='inline'
            selectedKeys={index}
            defaultOpenKeys={['sub1']}
            style={{height: '100%', borderRight: 0}}
          >
            <SubMenu key='sub1' icon={<RadarChartOutlined />} title='Stations'>
              <Menu.Item key='1'>
                <Link to='/'>Overview</Link>
              </Menu.Item>
              <Menu.Item key='2'>
                <Link to='/compare/'>Compare</Link>
              </Menu.Item>
              <Menu.Item key='3'>
                <Link to='/map/'>Map</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{padding: '0 24px 24px'}}>
          <Content
            className='site-layout-background'
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Switch>
              <Route exact path='/' component={StationsPage} />
              <Route exact path='/station/:id' component={StationPage} />
              <Route exact path='/compare' component={ComparePage} />
              <Route exact path='/map' component={MapPage} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;
