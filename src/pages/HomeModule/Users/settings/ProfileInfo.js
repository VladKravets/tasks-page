import React, { useState } from 'react';
import { Input, Form, Row, Col, Button, Avatar, notification } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styled from 'styled-components';
import { format } from 'date-fns';
import http from 'http/index';

const { TextArea } = Input;

const Name = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
`;

const Email = styled.div`
  font-weight: 400;

  a {
    color: rgba(0, 0, 0, 0.45);

    :hover {
      color: #1890ff;
    }
  }
`;

const InvitedBy = styled.div`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
`;

const Wrapper = styled.div`
  .phone-number {
    width: 100%;
    height: 32px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    font-size: 14px;

    :hover {
      border-color: #40a9ff;
    }
  }

  .phone-number:disabled {
    background-color: #f5f5f5;
    color: #bfbfbf;

    :hover {
      border: 1px solid #d9d9d9;
    }
  }

  ul {
    &.country-list {
      ::-webkit-scrollbar {
        display: none;
      }

      .country.highlight {
        background-color: #e6f7ff;
      }
    }

    li {
      outline: none;
    }
  }
`;

const ProfileInfo = ({ isMyProfile, user, fetchUser }) => {
  const [form] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (v) => {
    try {
      setLoading(true);
      await http.put('/users', {
        ...v,
      });
      setLoading(false);
      form.resetFields();
      notification.success({
        message: 'Profile info has been changed',
      });
      fetchUser();
    } catch (e) {
      setLoading(false);
      if (e?.response?.data?.message) {
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
    <>
      <Form
        form={form}
        onFinish={onSubmit}
        initialValues={{
          username: user.username,
          email: user.email,
          about: user.about,
          phoneNumber: user.phoneNumber,
          department: user.department,
        }}
        onFieldsChange={(_, allFields) => {
          const fields = allFields.map((field) => {
            return { name: field.name[0], value: field.value };
          });
          const changed = [];
          fields.forEach((field) => {
            if (field.value !== user[field.name]) {
              changed.push(true);
            } else {
              changed.push(false);
            }
          });
          if (changed.every((el) => el === false)) {
            setIsDisabled(true);
          } else {
            setIsDisabled(false);
          }
        }}
      >
        <Form.Item labelCol={{ span: 24 }} label="Profile info">
          <Row style={{ alignItems: 'center' }}>
            <Col>
              <Avatar size={40} style={{ backgroundColor: user?.defaultAvatar }}>
                {user?.username ? user.username[0].toUpperCase() : 'N'}
              </Avatar>
            </Col>
            <Col style={{ marginLeft: '10px' }}>
              <Name>{user?.username ? user.username : 'New User'}</Name>
              <Email>
                <a href={`mailto: ${user?.email}`}>{user?.email}</a>
              </Email>
            </Col>
          </Row>
        </Form.Item>
        {isMyProfile && (
          <>
            <Form.Item name="username" validateTrigger="onBlur" label="Username" labelCol={{ span: 24 }} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="E-mail" validateTrigger="onBlur" labelCol={{ span: 24 }}>
              <Input disabled />
            </Form.Item>
          </>
        )}
        <Row>
          <Col span={12}>
            <Wrapper>
              <Form.Item
                name="phoneNumber"
                label="Phone number"
                validateTrigger="onBlur"
                labelCol={{ span: 24 }}
                style={{ marginRight: '20px' }}
              >
                <PhoneInput country={'us'} disabled={!isMyProfile} inputClass="phone-number" />
              </Form.Item>
            </Wrapper>
          </Col>
          <Col span={12}>
            <Form.Item name="department" label="Departament or team" validateTrigger="onBlur" labelCol={{ span: 24 }}>
              <Input placeholder="Frontend department" disabled={!isMyProfile} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="about" label="About me" validateTrigger="onBlur" labelCol={{ span: 24 }}>
          <TextArea
            placeholder="I usually work from 9am-5pm PST. Feel free to assign me a task with a due date anytime. Also, I love dogs!"
            disabled={!isMyProfile}
          />
        </Form.Item>
        <InvitedBy>
          Invited {user?.invitedBy && `by: ${user?.invitedBy?.username} `}
          on {format(new Date(user?.created || null), 'dd MMM yyyy')}
        </InvitedBy>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            style={{ width: '150px', float: 'right' }}
            disabled={!isMyProfile || isDisabled}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProfileInfo;
