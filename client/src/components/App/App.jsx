import React, {useEffect, useState} from 'react';

import 'antd/dist/antd.css';
import './App.sass';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import {withSuspense} from '../../hoc/withSuspense/withSuspense';
import LoginPage from '../LoginPage/LoginPage';
import StationsPage from '../StationsPage/StationsPage';
import StationPage from '../StationPage/StationPage';
import ComparePage from '../ComparePage/ComparePage';
import MapPage from '../MapPage/MapPage';

const LayoutLazy = React.lazy(() => import('../Layout/LayoutApp'));

const SuspendedLayout = withSuspense(LayoutLazy);



function App() {
  return (
    <div className='app'>
      <Switch>
        <Route path='/login' component={LoginPage} />
        <Route path='/' component={SuspendedLayout} >
              {/* <Route path='/all' component={StationsPage} />
              <Route exact path='/station/:id' component={StationPage} />
              <Route exact path='/compare' component={ComparePage} />
              <Route exact path='/map' component={MapPage} /> */}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
