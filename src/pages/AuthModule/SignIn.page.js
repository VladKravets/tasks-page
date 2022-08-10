import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Row, Typography, Col, Tooltip, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import qs from 'qs';

import http from 'http/index';
import { saveTokens } from 'utils/storage';
import { login } from 'store/auth/actions.auth';

import { ReactComponent as DsLogo } from 'assets/dslogo.svg';

const { Title } = Typography;

export const LoginContainer = styled.div`
  min-height: 100vh;
  background: #f0f5ff;
  padding: 20px 0;

  .ant-typography {
    font-weight: 500;
  }

  @media (max-width: 300px) {
    .title p {
      text-align: start;
    }
  }
`;

export const HeaderText = styled.div`
  font-size: 16px;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
  padding-top: 10px;
  margin-bottom: 75px;
  width: 300px;
`;

export const StyledForm = styled(Form)`
  background: #ffffff;
  padding: 64px;
  max-width: 480px;
  margin: auto;
`;

export const StyledUserOutlined = styled(UserOutlined)`
  color: #c3c1c1;
`;

export const StyledLockOutlined = styled(LockOutlined)`
  color: #c3c1c1;
`;

const SignInPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onFinish = async ({ password, email }) => {
    try {
      setLoading(true);
      const {
        data: { token, ...user },
      } = await http.post(
        '/auth/login',
        qs.stringify({
          username: email,
          password,
        })
      );
      setLoading(false);
      saveTokens(token, user);
      dispatch(login(user));
      const { data } = await http.get('/streams');
      history.push(`/streams/${data[0].id}`);
    } catch (e) {
      setLoading(false);
      if(e?.response?.data?.message) {
        notification.error({
          message: e.response.data.message,
        });
      } else {
        notification.error({
          message: 'Something went wrong',
        });
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
          <StyledForm name="normal_login" initialValues={{ remember: true }} onFinish={onFinish}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: '30px' }}>
              Welcome!
              <br /> Nice to see you again!
            </Title>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]} labelCol={{ span: 24 }}>
              <Input prefix={<StyledUserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]} labelCol={{ span: 24 }}>
              <Input.Password prefix={<StyledLockOutlined />} placeholder="Password" />
            </Form.Item>
            <Row justify="space-between">
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Form.Item>
                <Tooltip title="Contact system administrator">
                  <Button block type="link" value="small" style={{ color: '#BFBFBF', padding: 0 }}>
                    forgot password?
                  </Button>
                </Tooltip>
              </Form.Item>
            </Row>
            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit" style={{ width: '100%' }}>
                Login
              </Button>
            </Form.Item>
          </StyledForm>
        </Col>
      </Row>
    </LoginContainer>
  );
};

export default SignInPage;
