import React, {useState} from "react";
import { 
  Modal, Form, notification,
  Radio, Input, Select, message
} from 'antd';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';

import http from 'http/index';
import { useSelector } from 'react-redux';
import { getInvitedUsers } from 'store/users/actions.users';

const { Option } = Select;

const StyledGroup = styled(Radio.Group)`
  &.ant-radio-group {
    width: 100%;
    display: inline-flex;

    .ant-radio-button-wrapper {
      width: 100%;
      text-align: center;
    }
  }
`;

const ROLES = [
  {key: 'user', name: "Employee"},
  {key: 'admin', name: "Manager"},
  {key: 'ADMIN', name: "Admin"},
];

const InviteUserModal = ({
  isInviteUserOpen, handleInviteUserModal, streams, reInvite, code, fetchInvited
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const invitedUsers = useSelector((state) => state.users.invitedUsers);
  const [isSelectedAdminRole, setIsSelectedAdminRole] = useState(false);

  const onSubmit = async ({email, role, stream}) => {
    setLoading(true);
    try {
      if(reInvite) {
        if(isSelectedAdminRole){
          await http.patch(`/users/invited/${code}`, {
            role: "ADMIN",
            email
          });
        } else {
          await http.patch(`/users/invited/${code}`, {
            role,
            email
          });
        }
        fetchInvited()
      } else {
        if(isSelectedAdminRole){
          await http.post(`/users/invite`, {
            role: "ADMIN",
            email
          });
        } else {
          await http.post(`/streams/${stream}/invite`, {
            role,
            email
          });
        }
        dispatch(getInvitedUsers());
      }
      setLoading(false);
      handleInviteUserModal();
      form.resetFields();
      notification.success({
        message: reInvite ? 'Invitation resent successfully.' : 'User "New User" created successfully.',
      });
      notification.success({
        message: `Invite sent to ${email}.`,
      });
    } catch (err) {
      setLoading(false);
      message.error((err).toJSON().message);
    }
  }

  const onRoleChange = (e) => {
    if(e.target.value === "ADMIN") {
      setIsSelectedAdminRole(true);
    } else {
      setIsSelectedAdminRole(false);
    }
  }

  return (
    <Modal
      title={reInvite ? "Re-invite User" : "Invite User"}
      confirmLoading={loading}
      visible={isInviteUserOpen}
      okText="Send"
      width={380}
      onOk={form.submit}
      onCancel={handleInviteUserModal}
    >
      <Form
        form={form}
        onFinish={onSubmit}
        layout="vertical"
        initialValues={{ role: 'user'}}
      >
        <Form.Item
          label="Role"
          name="role"
          rules={[
            {required: true},
          ]}
        >
          <StyledGroup onChange={onRoleChange}>
            {
              ROLES.map(({key, name}) => (
                <Radio.Button key={key} value={key}>{name}</Radio.Button>
              ))
            }
          </StyledGroup>
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {required: true},
            {type: 'email'},
            {
              validator(_,v,callback) {
                const isEmailExist = invitedUsers.find(user => user.email === v);
                try {
                  if (isEmailExist) {
                    throw new Error('The invitation has already been sent.');
                  }
                  return Promise.resolve();
                } catch (err) {
                  return Promise.reject(err);
                }
              }
            },
          ]}
        >
          <Input placeholder="name@company.com" />
        </Form.Item>
        { !isSelectedAdminRole && (
          <Form.Item
            name="stream"
            label="Choose a starting stream"
            rules={[
              {required: true},
            ]}
          >
            <Select
              placeholder="Select stream"
              allowClear
            >
              {
                streams.map(({ title, id }) => (
                  <Option key={id} value={id}>{title}</Option>
                ))
              }
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

export default InviteUserModal;
