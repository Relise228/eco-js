import React from 'react';
import './LoginPage.sass';

import {Form, Input, Button, Checkbox} from 'antd';
import {Redirect} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {selectIsAuth, setAuth} from '../../redux/features/authSlice';

const LoginPage = React.memo(() => {
  const auth = useSelector(selectIsAuth);

  const dispatch = useDispatch();

  const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  };
  const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
  };

  const onFinish = (values) => {
    console.log('Success:', values);
    if (values.username && values.password) {
      dispatch(setAuth(true));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (auth) return <Redirect to={'/'} />;
  return (
    <div className={'login'}>
      <Form
        {...layout}
        name='basic'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label='Username'
          name='username'
          rules={[{required: true, message: 'Please input your username!'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{required: true, message: 'Please input your password!'}]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            type='primary'
            htmlType='submit'
            size={'large'}
            style={{width: '187px', marginTop: '10px'}}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default LoginPage;
