import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useLocation, useHistory } from 'react-router-dom';
import { SettingFilled, EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tag, Tabs, Empty, Popover, Modal, notification, message } from 'antd';
import styled from 'styled-components/macro';

import http from 'http/index';
import PageTitle from 'components/PageTitle';
import StyledSpiner from 'components/Loader';
import InviteUserModal from './InviteUserModal';
import ProfileSettingsModal from './settings/ProfileSettingsModal';
import UserDocuments from 'components/Tables/UserDocuments';
import UserTasks from 'components/Tables/UserTasks';
import { StyledTabs } from 'components/Tabs';
import { Options } from './UserCard';
import { convertToCapital } from 'utils/convertText';

const { TabPane } = Tabs;

const USER_STATUSES = [
  { value: 'ACTIVE', name: 'Active', color: 'blue' },
  { value: 'NOT_ACTIVE', name: 'Not active', color: 'orange' },
  { value: 'DELETED', name: 'Deleted', color: 'red' },
];

const StyledSettingFilled = styled(SettingFilled)`
  font-size: 16px;
  margin-left: 5px;
  cursor: pointer;
  color: #bfbfbf;

  :hover {
    color: #1890ff;
  }
`;

const StyledEllipsisOutlined = styled(EllipsisOutlined)`
  font-size: 16px;
  margin-left: 10px;
  cursor: pointer;
  color: #bfbfbf;

  :hover {
    color: #1890ff;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Email = styled.div`
  margin-right: 12px;
  a {
    color: rgba(0, 0, 0, 0.45);

    :hover {
      color: #1890ff;
    }
  }
`;

const Dot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  margin-right: 12px;
  background: rgba(0, 0, 0, 0.65);
`;

const Message = styled.div`
  color: #faad14;
  margin-right: 12px;

  span {
    color: #1890ff;
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const StyledEmpty = styled(Empty)`
  margin-top: 25vh;
`;

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { user: loggedUser } = useSelector((state) => state.auth);
  const isMyProfile = user?.id === loggedUser?.id;
  const TABS = ['Documents', 'Tasks', (isMyProfile || loggedUser.role === 'ADMIN') && 'Activity'];
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [tab, setTab] = useState(TABS[0]);
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const { streams } = useSelector((state) => state.streams);
  const { id } = useParams();
  const { state } = useLocation();
  const history = useHistory();
  const [modal, contextHolder] = Modal.useModal();

  const isVerifiedUser = state.isVerifiedUser;
  const isAdmin = user?.role === 'ADMIN';
  const userStatus = USER_STATUSES.find(({ value }) => value === user?.status);

  const itemRender = ({ link, name }) => {
    if (link) {
      return (
        <Link to={link} key={name}>
          {name}
        </Link>
      );
    } else {
      return <span key={name}>{name}</span>;
    }
  };

  const fetchInvited = useCallback(async () => {
    setLoading(true);

    await http.get(`/users/invited/${id}`).then(({ data }) => {
      setUser({ ...data, name: 'New user' });
      setRoutes([{ name: 'Users', link: '/users' }, { name: 'New User' }]);
    });

    setLoading(false);
  }, [id]);

  const fetchUser = useCallback(async () => {
    setLoading(true);

    await http.get(`/users/${id}`).then(({ data }) => {
      setUser({ ...data, username: convertToCapital(data?.username) });
      setRoutes([{ name: 'Users', link: '/users' }, { name: convertToCapital(data?.username) }]);
    });

    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (isVerifiedUser) {
      fetchUser();
    } else {
      fetchInvited();
    }
  }, [fetchInvited, fetchUser, id, isVerifiedUser, state]);

  const handleInviteUserModal = () => {
    setIsInviteUserOpen(!isInviteUserOpen);
  };

  const handleProfileSettingsModal = () => {
    setIsProfileSettingsOpen(!isProfileSettingsOpen);
  };

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
    confirmLoading: deleteLoading,
    onOk: async () => {
      setDeleteLoading(true);
      if (isVerifiedUser) {
        await http.delete(`/users/${user.id}`);
      } else {
        await http.delete(`/users/invite/${user.code}`);
      }
      history.push('/users');
      setDeleteLoading(false);
    },
  };

  const handleDeleteUser = () => {
    modal.confirm(config);
  };

  const handleResetLink = async () => {
    try {
      let temp;
      if (user.role === 'ADMIN') {
        temp = await http.post(`/users/invite`, {
          role: 'ADMIN',
          email: user.email,
        });
      } else {
        temp = await http.post(`/streams/${user.streamID}/invite`, {
          role: user.role,
          email: user.email,
        });
      }
      setLoading(false);
      history.push({
        pathname: `/users/${temp.data.code}`,
        state: { isVerifiedUser: false },
      });
      notification.success({
        message: 'Invite successfully resended.',
      });
      notification.success({
        message: `Invite sent to ${user.email}.`,
      });
    } catch (e) {
      setLoading(false);
      if (e?.response?.data?.message) {
        message.error(e.response.data.message);
      } else {
        message.error('Something went wrong');
      }
    }
  };

  if (loading) {
    return <StyledSpiner size="large" />;
  }

  return (
    <>
      <InviteUserModal
        reInvite
        code={user?.code}
        fetchInvited={fetchInvited}
        streams={streams}
        isInviteUserOpen={isInviteUserOpen}
        handleInviteUserModal={handleInviteUserModal}
      />
      <ProfileSettingsModal
        user={user}
        fetchUser={fetchUser}
        isProfileSettingsOpen={isProfileSettingsOpen}
        handleProfileSettingsModal={handleProfileSettingsModal}
      />
      <PageTitle
        avatar={{
          style: { backgroundColor: user?.defaultAvatar },
          shape: 'circle',
          icon: <>{user?.username ? user.username[0].toUpperCase() : 'N'}</>,
        }}
        title={user?.username}
        breadcrumb={{ routes, itemRender }}
        subTitle={isAdmin && 'Admin'}
        onBack={() => history.goBack()}
        tags={
          <Container>
            {isVerifiedUser && isAdmin && <Dot />}
            <Email>
              <a href={`mailto: ${user?.email}`}>{user?.email}</a>
            </Email>
            {!isVerifiedUser && <Dot />}
            {!isVerifiedUser && (
              <Message>
                user not confirmed
                <span onClick={handleResetLink}> Resend Link</span>
              </Message>
            )}
            <Tag color={userStatus ? userStatus.color : 'gold'}>{userStatus ? userStatus.name : 'Pending'}</Tag>
            <StyledSettingFilled onClick={() => (isVerifiedUser ? handleProfileSettingsModal() : handleInviteUserModal())} />
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
              {loggedUser?.role === 'ADMIN' && !isMyProfile && <StyledEllipsisOutlined />}
            </Popover>
          </Container>
        }
        footer={
          <StyledTabs defaultActiveKey="All" onChange={setTab}>
            {TABS.map((tab) => (
              <TabPane tab={tab} key={tab}></TabPane>
            ))}
          </StyledTabs>
        }
      />
      {contextHolder}
      {tab === 'Documents' && <UserDocuments userId={id} />}
      {tab === 'Tasks' && <UserTasks userId={id} />}
      {tab === 'Activity' && <StyledEmpty description="Page under construction." />}
    </>
  );
};

export default UserPage;
