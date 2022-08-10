import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Row } from 'antd';

import http from 'http/index';
import UserCard from '../../../Users/UserCard';
import StyledSpiner from 'components/Loader';

const STATUSES = [
  { key: 'ACTIVE', name: 'Active', color: 'blue' },
  { key: 'NOT_ACTIVE', name: 'Not active', color: 'orange' },
  { key: 'DELETED', name: 'Deleted', color: 'red' },
];

const Users = ({ streamId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { documents } = useSelector((state) => state.documents);
  const { tasks } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      await http.get(`/streams/${streamId}/users`).then((result) => {
        setUsers(result.data);
      });

      setLoading(false);
    };

    fetchUsers();
  }, [streamId]);

  if (loading) {
    return <StyledSpiner size="large" />;
  }

  return (
    <>
      <Row gutter={[32, 32]}>
        {users.map((user) => {
          const documentsCount = documents?.filter((doc) => doc?.owner?.id === user.id).filter((doc) => doc?.stream?.id === streamId)
            .length;
          const tasksCount = tasks?.filter((task) => task?.owner?.id === user.id).filter((task) => task?.stream?.id === streamId).length;

          return (
            <UserCard
              user={user}
              key={user.id}
              isAdmin={isAdmin}
              statuses={STATUSES}
              tasksCount={tasksCount}
              documentsCount={documentsCount}
            />
          );
        })}
      </Row>
    </>
  );
};

export default Users;
