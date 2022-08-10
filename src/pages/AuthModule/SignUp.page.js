import React, { useState } from 'react';
import { Form, Input, Button, Row, Typography, message, Col } from 'antd';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import http from 'http/index';
import { login } from 'store/auth/actions.auth';
import { saveTokens } from 'utils/storage';
import { LoginContainer, HeaderText, StyledForm, StyledUserOutlined, StyledLockOutlined } from './SignIn.page';

import { ReactComponent as DsLogo } from 'assets/dslogo.svg';

const { Title, Paragraph } = Typography;

const SignUpPage = () => {
  const { code } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const userFromState = useSelector((state) => state.auth.user);

  if (userFromState) {
    return <Redirect to="/" />;
  }

  const onFinish = async ({ password, username, name }) => {
    try {
      setLoading(true);
      const {
        data: { token, ...user },
      } = await http.post(`/users/invited/create?code=${code}`, {
        name,
        password,
        username,
      });
      setLoading(false);
      saveTokens(token, user);
      dispatch(login(user));
      await http.get(`/streams/accept/${code}`);
      history.push('/documents');
    } catch (e) {
      setLoading(false);
      if (e?.response?.data?.message) {
        message.error(e.response.data.message);
      } else {
        message.error('Something went wrong');
      }
    }
  };

  return (
    <LoginContainer>
      <Row justify="center">
        <DsLogo />
      </Row>
      <Row justify="center" className="title">
        <HeaderText>
          <div>Artificial Intelligence powered solution for</div>
          <div>documents review and analysis</div>
        </HeaderText>
      </Row>
      <Row justify="center">
        <Col xs={24} sm={16} md={12} lg={12} xl={8} xxl={8}>
          <StyledForm
            name="normal_login"
            style={{
              marginTop: '40px',
              maxWidth: '480px',
              background: '#FFFFFF',
              padding: '48px',
            }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Title level={3} style={{ textAlign: 'center', marginBottom: '1em' }}>
              Welcome!
              <br />
              Fill the form to stay on board!
            </Title>
            <Paragraph>Please update your name and choose a password</Paragraph>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your Username!' },
                {
                  min: 3,
                  message: 'Username should be minimum 3 characters.',
                },
                {
                  max: 30,
                  message: 'Username should be less then 30 characters.',
                },
              ]}
              label="Username"
              labelCol={{ span: 24 }}
            >
              <Input prefix={<StyledUserOutlined />} autoComplete="off" placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: 'Please input your Name!' },
                {
                  min: 3,
                  message: 'Name should be minimum 3 characters.',
                },
                {
                  max: 50,
                  message: 'Name should be less then 50 characters.',
                },
              ]}
              label="Name"
              labelCol={{ span: 24 }}
            >
              <Input prefix={<StyledUserOutlined />} autoComplete="off" placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
                { min: 6, message: 'The password should be minimum 6 characters.' },
                { max: 32, message: 'The password should be less then 32 characters.' },
              ]}
              label="Password"
              labelCol={{ span: 24 }}
            >
              <Input.Password prefix={<StyledLockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },

                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('The two passwords that you entered do not match!');
                  },
                }),
              ]}
              labelCol={{ span: 24 }}
            >
              <Input.Password prefix={<StyledLockOutlined />} placeholder="Confirm Password" />
            </Form.Item>
            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit" style={{ width: '100%' }}>
                Register
              </Button>
            </Form.Item>
          </StyledForm>
        </Col>
      </Row>
    </LoginContainer>
  );
};

export default SignUpPage;
