import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Row } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import PageTitle from 'components/PageTitle';
import UserCard from './UserCard';
import InviteUserModal from './InviteUserModal';
import StyledSpiner from 'components/Loader';
import Container from 'components/Container';

const STATUSES = [
  { key: 'ACTIVE', name: 'Active', color: 'blue' },
  { key: 'NOT_ACTIVE', name: 'Not active', color: 'orange' },
  { key: 'DELETED', name: 'Deleted', color: 'red' },
];

const UsersPage = () => {
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false);
  const users = useSelector((state) => state.users.users);
  const invitedUsers = useSelector((state) => state.users.invitedUsers);
  const { documents } = useSelector((state) => state.documents);
  const { tasks } = useSelector((state) => state.tasks);
  const { streams } = useSelector((state) => state.streams);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  const handleInviteUserModal = () => {
    setIsInviteUserOpen(!isInviteUserOpen);
  };

  if (!users || !invitedUsers) {
    return <StyledSpiner size="large" />;
  }

  return (
    <>
      <PageTitle title="Users" handleAddClick={isAdmin && handleInviteUserModal} />
      <InviteUserModal streams={streams} isInviteUserOpen={isInviteUserOpen} handleInviteUserModal={handleInviteUserModal} />
      <Container>
        <Row gutter={[32, 24]}>
          {invitedUsers.map((invited) => {
            const documentsCount = documents?.filter((doc) => doc?.owner?.id === invited.id).length;
            const tasksCount = tasks?.filter((task) => task?.owner?.id === invited.id).length;
            return (
              <UserCard
                key={uuidv4()}
                user={invited}
                isAdmin={isAdmin}
                statuses={STATUSES}
                tasksCount={tasksCount}
                documentsCount={documentsCount}
              />
            );
          })}
          {users.map((user) => {
            const documentsCount = documents?.filter((doc) => doc?.owner?.id === user.id).length;
            const tasksCount = tasks?.filter((task) => task?.owner?.id === user.id).length;
            return (
              <UserCard
                user={user}
                tasksCount={tasksCount}
                key={user.id}
                isAdmin={isAdmin}
                statuses={STATUSES}
                documentsCount={documentsCount}
              />
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default UsersPage;
