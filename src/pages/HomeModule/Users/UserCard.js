import React, { useState } from 'react';
import { Col, Tag, Avatar, Button, Card, Popover, Modal } from 'antd';
import { MoreOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUsers, getInvitedUsers } from 'store/users/actions.users';
import styled from 'styled-components/macro';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import http from 'http/index';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledCard = styled(Card)`
  text-align: center;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
`;

const Name = styled.div`
  font-size: 16px;
  color: #595959;
  margin-top: 10px;
`;

const Email = styled.div`
  a {
    color: #8c8c8c;

    :hover {
      color: #1890ff;
    }
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const ItemInfo = styled.div`
  width: 33%;

  .count {
    font-weight: 500;
    color: #595959;
  }

  .name {
    font-size: 12px;
    color: #8c8c8c;
  }
`;

const StyledMoreOutlined = styled(MoreOutlined)`
  cursor: pointer;

  :hover {
    color: #1890ff;
  }
`;

export const Options = styled.div`
  .delete {
    display: flex;
    align-items: center;
    cursor: pointer;

    svg {
      margin-right: 5px;
    }
  }
`;

const UserCard = ({ isAdmin, user, documentsCount, tasksCount, statuses }) => {
  const [loading, setLoading] = useState(false);
  const { user: loggedUser } = useSelector((state) => state.auth);
  const isMyProfile = user?.id === loggedUser?.id;
  const status = statuses.find((status) => status.key === user.status);
  const [modal, contextHolder] = Modal.useModal();
  const dispatch = useDispatch();
  const history = useHistory();

  const config = {
    title: 'Are you sure you want to delete the user?',
    cancelText: 'No',
    okText: 'Yes',
    content: (
      <div>
        <p>Once deleted, the user will show as inactive for 20 days and won't be able to login to DocsStream.</p>
        <p>After that period the user will be permanently deleted.</p>
      </div>
    ),
    okType: 'danger',
    confirmLoading: loading,
    onOk: async () => {
      setLoading(true);
      if (user.id) {
        await http.delete(`/users/${user.id}`);
      } else {
        await http.delete(`/users/invite/${user.code}`);
      }
      dispatch(getUsers());
      dispatch(getInvitedUsers());
      setLoading(false);
    },
  };

  const handleDeleteUser = () => {
    modal.confirm(config);
  };

  return (
    <Col xs={24} md={12} lg={8} xl={6} xxl={6}>
      <StyledCard bordered={false}>
        <Header>
          <Tag color={status?.color ? status.color : 'gold'}>{status?.name ? status.name : 'Pending'}</Tag>
          <Popover
            placement="bottom"
            content={
              <Options>
                <div className="delete" onClick={handleDeleteUser}>
                  <DeleteOutlined />
                  <div>Delete user</div>
                </div>
              </Options>
            }
          >
            {loggedUser?.role === 'ADMIN' && !isMyProfile && <StyledMoreOutlined />}
          </Popover>
        </Header>
        <Avatar size={55} style={{ backgroundColor: user?.defaultAvatar }}>
          {user.username ? user.username[0].toUpperCase() : 'N'}
        </Avatar>
        <Name>{user.username ? user.username : 'New User'}</Name>
        <Email>
          <a href={`mailto: ${user?.email}`}>{user?.email}</a>
        </Email>
        <Info>
          {[
            { count: tasksCount, name: 'Tasks' },
            { count: documentsCount, name: 'Documents' },
            { count: 0, name: 'Activities' },
          ].map(({ count, name }) => (
            <ItemInfo key={name}>
              <div className="count">{count}</div>
              <div className="name">{name}</div>
            </ItemInfo>
          ))}
        </Info>
        <Button
          onClick={() => {
            history.push({
              pathname: `/users/${user.id ? user.id : user.code}`,
              state: { isVerifiedUser: user.id ? true : false },
            });
          }}
        >
          View Profile
        </Button>
      </StyledCard>
      {contextHolder}
    </Col>
  );
};

export default UserCard;
