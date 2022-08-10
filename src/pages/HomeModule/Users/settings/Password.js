import React, {useState} from 'react';
import { Form, Input, Button, notification } from 'antd';
import styled from 'styled-components';
import {LockOutlined} from '@ant-design/icons';

import http from 'http/index';

const StyledLockOutlined = styled(LockOutlined)`
  svg {
    color: rgba(0, 0, 0, 0.65);
  }
`;

const Password = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onSubmit = async ({oldPassword, newPassword}) => {
    try {
      setLoading(true);
      await http.patch(`/users/password`, {
        oldPassword,
        newPassword
      });
      setLoading(false);
      form.resetFields();
      notification.success({
        message: 'The password has been changed',
      });
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
  }

  return(
    <>
      <Form
        form={form}
        onFinish={onSubmit}
      >
        <Form.Item
          label="Current password"
          name="oldPassword"
          validateTrigger="onBlur"
          labelCol={{ span: 24 }}
          rules={[{ required: true, message: 'Please input your Current Password' }]}
        >
          <Input.Password prefix={<StyledLockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item
          label="New password"
          name="password"
          validateTrigger="onBlur"
          labelCol={{ span: 24 }}
          rules={[
            { required: true, message: 'Please input your new Password' },
            { min: 6, message: 'The password should be minimum 6 characters' },
            { max: 32, message: 'The password should be less then 32 characters' },
          ]}
        >
          <Input.Password prefix={<StyledLockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          name="newPassword"
          validateTrigger="onBlur"
          labelCol={{ span: 24 }}
          rules={[
            { required: true, message: 'Please confirm your Password' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match');
              },
            }),
          ]}
        >
          <Input.Password prefix={<StyledLockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item style={{marginBottom: 0}}>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            style={{ width: '150px', float: 'right' }}
          >
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default Password;