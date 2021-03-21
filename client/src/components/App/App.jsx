import React, {useState} from 'react';


import 'antd/dist/antd.css';
import './App.sass';


import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {withSuspense} from "../../hoc/withSuspense/withSuspense";



const LoginLazy = React.lazy(() => import('../LoginPage/LoginPage'));
const LayoutLazy = React.lazy(() => import('../Layout/LayoutApp'));

const SuspendedLogin = withSuspense(LoginLazy);
const SuspendedLayout = withSuspense(LayoutLazy);

function App() {


    return (
        <div className="app">
                <Switch>
                    <Route path="/login" component={SuspendedLogin} />
                    <Route path="/" component={SuspendedLayout} />
                </Switch>
        </div>
    );
}

export default App;
