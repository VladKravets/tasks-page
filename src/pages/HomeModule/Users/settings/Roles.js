import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Switch, Form, Row, Col, Select, Button, notification } from 'antd';
import styled from 'styled-components/macro';
import { isEqual, xorWith } from 'lodash';

import http from 'http/index';

const { Option } = Select;

const Container = styled.div`
  display: flex;
  align-items: center;

  > div {
    margin: 30px 30px 0 30px;
  }
`;

const Roles = ({isMyProfile, loggedUser ,user, fetchUser}) => {
  const { streams } = useSelector(({ streams }) => streams);
  const [form] = Form.useForm();
  const [isAdministrator, setIsAdministrator] = useState(user.role === 'ADMIN');
  const [role, setRole] = useState(user.role);
  const isLoggedUserAdmin = loggedUser.role === 'ADMIN';
  const [loading, setLoading] = useState(false);
  const [isRolesChanged, setIsRolesChanged] = useState(false);
  const [isDisabledButton, setIsDisabledButton] = useState(true);

  const isDisabled = (field) => {
    if(isLoggedUserAdmin) {
      return false;
    }
    if(isMyProfile) {
      return true;
    }
    let role = streams.find(({id}) => id === user.streamList[field.key].id)?.userRole;
    if(role === 'admin'){
      return false;
    } else {
      return true;
    }
  }

  useEffect(() => {
    if(user.role !== role) {
      setIsDisabledButton(false);
    } else if(isRolesChanged) {
      setIsDisabledButton(false);
    } else {
      setIsDisabledButton(true);
    }
  }, [isRolesChanged, role, user.role]);

  const handleChangeRoles = async () => {
    try {
      setLoading(true);

      if(isAdministrator && user.role === 'USER') {
        await http.patch(`users/${user.id}?role=ADMIN`);
      } else if (!isAdministrator && user.role === 'ADMIN') {
        await http.patch(`users/${user.id}?role=USER`);
      }

      if(!isAdministrator) {
        await http.patch(
          `/users/${user.id}/streams`,
          form.getFieldsValue().streams?.map(stream => { return {stream: stream.id, role: stream.userRole}})
        );
      }
      notification.success({
        message: 'Changed successfully',
      });
      fetchUser();
      setLoading(false);
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
      <div>
        The DocsStream platform consists of the Administrator, Manager and Employee roles. Each role gives you permission to perform a set of tasks on behalf of your Page. <a href="http://www.orimi.com/pdf-test.pdf">Read more</a>
      </div>
      {
        (isLoggedUserAdmin || user.role === 'ADMIN') && (
          <Container>
            <Switch
              checked={isAdministrator}
              onChange={(e) => {
                setIsAdministrator(e)
                if(e) {
                  setRole('ADMIN')
                } else {
                  setRole('USER')
                }
              }}
              disabled={(loggedUser.role === 'ADMIN' && isMyProfile) || loggedUser.role !== 'ADMIN'}
            />
            <div>
              <b>Administrator</b><br/>
              Members with this permission has every permission and also bypass streams specific permissions. This is a dangerous permission to grant
            </div>
          </Container>
        )
      }
      {
        !isAdministrator && (
          <Form
            forceRender
            form={form}
            initialValues={{
              streams: user.streamList.map(el => {return {userRole: el.userRole, id: el.id}})
            }}
            style={{marginTop: '30px'}}
            onFieldsChange={() => {
              if(
                xorWith(
                  form.getFieldsValue().streams,
                  user.streamList.map(el => {return {userRole: el.userRole, id: el.id}}), isEqual
                ).length
              ){
                setIsRolesChanged(true)
              } else {
                setIsRolesChanged(false)
              }
            }}
          >
            <Form.List
              name="streams"
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field) => (
                    <Form.Item
                      key={field.key}
                    >
                      <Row gutter={4}>
                      <Col span={16} style={{ height: '32px' }}>
                        <Form.Item
                            {...field}
                            name={[field.name, 'id']}
                            fieldKey={[field.fieldKey, 'id']}
                          >
                            <Select
                              disabled={!isLoggedUserAdmin}
                              placeholder="Stream"
                              allowClear
                            >
                              {
                                [...new Map(streams.concat(user.streamList).map(item => [item['id'], item])).values()].map(({ title, id }) => {
                                  const selectedStreams = form.getFieldsValue().streams ? form.getFieldsValue().streams : user.streamList;
                                  const isSelectedStream = selectedStreams.find(stream => stream.id === id);
                                  return (
                                    <Option disabled={isSelectedStream} key={id} value={id}>{title}</Option>
                                  )
                                })
                              }
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={6} style={{ height: '32px' }}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'userRole']}
                            fieldKey={[field.fieldKey, 'id']}
                          >
                            <Select
                              disabled={isDisabled(field)}
                              placeholder="Role"
                            >
                              <Option value="admin">Manager</Option>
                              <Option value="user">Employee</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={2} style={{ height: '32px' }}>
                          <Button
                            disabled={isDisabled(field)}
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        </Col>
                      </Row>
                    </Form.Item>
                  ))}
                  {
                    isLoggedUserAdmin && (
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add({})}
                          style={{ width: '100%' }}
                          icon={<PlusOutlined />}
                        >
                          Add row
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    )
                  }
                </>
              )}
            </Form.List>
          </Form>
        )
      }
      <Form.Item style={{marginBottom: 0}}>
        <Button
          type="primary"
          loading={loading}
          style={{ width: '150px', float: 'right' }}
          disabled={isDisabledButton}
          onClick={handleChangeRoles}
        >
          Change Roles
        </Button>
      </Form.Item>
    </>
  )
}

export default Roles;