import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Input, Form, Modal, Select, Row, Popover, Typography, Tooltip, notification } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import http from 'http/index';
import { getStreamsAll } from 'store/streams/actions.streams';

import AddUsersDropdown from './components/usersDropdown';
import { AvatarDefault } from './styled';

const { Option } = Select;

const AddStreamModal = ({ isEdit, id, visible, onCancel }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [streamUsers, setStreamUsers] = useState([]);
  const [adminsToAdd, setAdminsToAdd] = useState([]);
  const [usersToAdd, setUsersToAdd] = useState([]);
  const { streams } = useSelector(({ streams }) => streams);
  const stream = streams.find((stream) => stream.id === id);
  const { user } = useSelector((state) => state.auth);
  const invitedUsers = useSelector((state) => state.users.invitedUsers);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(stream);
  }, [form, stream]);

  const closePopup = useCallback(() => {
    setUsersToAdd(streamUsers.filter((user) => /user/i.test(user.streamRole)));
    setAdminsToAdd(streamUsers.filter((admin) => /admin/i.test(admin.streamRole)));
    form.resetFields();
    onCancel();
  }, [form, onCancel, streamUsers]);

  useAsync(async () => {
    if (!id) return;
    await http.get(`/streams/${id}/users`).then((result) => {
      setStreamUsers(result.data);
      setUsersToAdd(result.data.filter((user) => /user/i.test(user.streamRole)));
      setAdminsToAdd(result.data.filter((admin) => /admin/i.test(admin.streamRole)));
    });
  }, [id, stream]);

  const [{ loading }, onSubmit] = useAsyncFn(
    async ({ admins, users, emails, ...values }) => {
      if (isEdit) {
        await http.patch(`/streams/${id}`, {
          ...values,
          privacy: 'PRIVATE',
        });

        await http.patch(
          `/streams/${id}/users`,
          //*Owner
          [{ user: user.id, role: 'ADMIN' }]
            .concat(usersToAdd.map((user) => ({ user: user.id, role: 'user' })))
            .concat(adminsToAdd.map((admin) => ({ user: admin.id, role: 'admin' })))
        );

        const invitations = emails.filter(Boolean);
        await Promise.all(invitations.map(async (invite) => await http.post(`/streams/${id}/invite`, invite)));
        invitations.length &&
          notification.success({
            message: 'Invitation sent!',
          });
      } else {
        const { data: streamData } = await http.post(`/streams`, {
          ...values,
          privacy: 'PRIVATE',
        });

        await Promise.all(
          usersToAdd.map(async ({ id: userId }) => {
            await http.put(`/streams/${streamData.id}/users/${userId}?role=user`);
          })
        );
        await Promise.all(
          adminsToAdd.map(async ({ id: adminId }) => {
            await http.put(`/streams/${streamData.id}/users/${adminId}?role=admin`);
          })
        );

        const invitations = emails.filter(Boolean);
        await Promise.all(invitations.map(async (invite) => await http.post(`/streams/${streamData.id}/invite`, invite)));
        invitations.length &&
          notification.success({
            message: `Invitation${invitations.length > 1 ? 's' : ''} sent to ${invitations.map(({ email }) => email).join(', ')}!`,
          });

        history.push(`/streams/${streamData.id}`);
      }
      dispatch(getStreamsAll());

      closePopup();
      notification.success({
        message: `Stream was ${isEdit ? 'changed' : 'created'}!`,
      });
    },
    [onCancel, usersToAdd, adminsToAdd, dispatch, closePopup]
  );

  return (
    <Modal
      title="Basic Information"
      visible={visible}
      onOk={form.submit}
      okText="Save Stream"
      confirmLoading={loading}
      onCancel={closePopup}
      bodyStyle={{ height: '584px', overflowY: 'auto' }}
      width={420}
      centered
    >
      <Form
        form={form}
        forceRender
        onFinish={onSubmit}
        initialValues={{
          title: stream?.title,
          description: stream?.description,
          color: stream?.color,
          emails: [],
        }}
      >
        <Form.Item
          name="title"
          validateTrigger="onBlur"
          rules={[
            { required: true, message: 'Please add stream name!' },
            {
              min: 3,
              message: 'Title should be minimum 3 characters.',
            },
            {
              max: 32,
              message: 'Title should be between then 32 characters.',
            },
          ]}
          label="Stream name"
          labelCol={{ span: 24 }}
        >
          <Input placeholder="Stream name" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Subtitle"
          validateTrigger="onBlur"
          rules={[
            { required: true, message: 'Enter stream description.' },
            {
              min: 3,
              message: 'Description should be minimum 3 characters.',
            },
            {
              max: 32,
              message: 'Description should be between then 32 characters.',
            },
          ]}
          labelCol={{ span: 24 }}
        >
          <Input placeholder="Description" />
        </Form.Item>
        <Typography.Title level={5}>Assign Users</Typography.Title>
        <Form.Item name="admins" label="Manager" labelCol={{ span: 24 }}>
          <Row gutter={2}>
            <Col span={2}>
              <Popover
                content={<AddUsersDropdown usersState={adminsToAdd} setUsersState={setAdminsToAdd} filterState={usersToAdd} />}
                title="Select manager"
                trigger={['click']}
                placement="left"
              >
                <Button shape="circle" icon={<PlusOutlined />} />
              </Popover>
            </Col>
            <Col style={{ height: '32px' }}>
              <Avatar.Group
                maxCount={5}
                size={32}
                maxStyle={{
                  color: '#f56a00',
                  backgroundColor: '#fde3cf',
                }}
              >
                {adminsToAdd.map(({ username, id, defaultAvatar }) => (
                  <Tooltip title={username} key={id}>
                    <AvatarDefault color={defaultAvatar}>{username.charAt(0)}</AvatarDefault>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item name="users" label="Employee" labelCol={{ span: 24 }}>
          <Row gutter={2}>
            <Col span={2}>
              <Popover
                content={<AddUsersDropdown usersState={usersToAdd} setUsersState={setUsersToAdd} filterState={adminsToAdd} />}
                title="Select employee"
                trigger={['click']}
                placement="left"
              >
                <Button shape="circle" icon={<PlusOutlined />} />
              </Popover>
            </Col>
            <Col style={{ height: '32px' }}>
              <Avatar.Group
                maxCount={5}
                size={32}
                maxStyle={{
                  color: '#f56a00',
                  backgroundColor: '#fde3cf',
                }}
              >
                {usersToAdd.map(({ username, id, defaultAvatar }) => (
                  <Tooltip title={username} key={id}>
                    <AvatarDefault color={defaultAvatar}>{username.charAt(0)}</AvatarDefault>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </Col>
          </Row>
        </Form.Item>
        <Typography.Title level={5} style={{ marginBottom: '24px' }}>
          Invite New users
        </Typography.Title>
        <Form.List name="emails" shouldUpdate={(prevValues, curValues) => prevValues.users !== curValues.users}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field) => (
                <Form.Item key={field.key} style={{ width: 'calc(100% - 7px)' }}>
                  <Row gutter={4}>
                    <Col span={12} style={{ height: '32px' }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'email']}
                        fieldKey={[field.fieldKey, 'email']}
                        validateTrigger="onBlur"
                        rules={[
                          {
                            type: 'email',
                            message: 'Email is not a valid email!',
                          },
                          {
                            validator(_, v) {
                              const isEmailExist = invitedUsers.find(({ email }) => email === v);
                              const isEmailEnteredMultiple = form.getFieldsValue().emails.filter(({ email }) => email === v).length;
                              try {
                                if (isEmailEnteredMultiple > 1) {
                                  throw new Error('The email has already been entered.');
                                }
                                if (isEmailExist) {
                                  throw new Error('The invitation has already been sent.');
                                }
                                return Promise.resolve();
                              } catch (err) {
                                return Promise.reject(err);
                              }
                            },
                          },
                        ]}
                        noStyle
                      >
                        <Input placeholder="Invitation email" />
                      </Form.Item>
                    </Col>
                    <Col span={10} style={{ height: '32px' }}>
                      <Form.Item {...field} name={[field.name, 'role']} fieldKey={[field.fieldKey, 'role']}>
                        <Select placeholder="Role">
                          <Option value="admin">Manager</Option>
                          <Option value="user">Employee</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={2} style={{ height: '32px' }}>
                      <Button icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add({ email: '', role: 'user' })} style={{ width: '100%' }} icon={<PlusOutlined />}>
                  Add row
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default AddStreamModal;
