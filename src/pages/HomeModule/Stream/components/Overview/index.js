import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Card, Progress, Button, Avatar, Tooltip, Col, Row, List, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { useAsync } from 'react-use';
import { format, formatDistance } from 'date-fns';

import http from 'http/index';
import activityTitleByAction from '../Activity/utils/activityTitleByAction';
import EditStreamModal from 'pages/HomeModule/AddStreamModal';
import StyledSpiner from 'components/Loader';
import { AvatarWithCancel } from 'pages/HomeModule/styled';

export const StyledRow = styled(Row)`
  //margin-bottom: 32px;
`;

const StyledCard = styled(Card)`
  border: 1px solid #f0f0f0;
  border-radius: 4px;

  .ant-card-body {
    height: 350px;
    font-family: roboto;
    font-weight: 400;
    color: black;
    display: grid;
    grid-template-rows: 0 2fr 1fr 1fr 0;
    padding: 0;

    .grey {
      color: #8c8c8c;
    }

    .first,
    .second,
    .third,
    .users {
      padding: 15px 25px;
    }

    .first {
      border-bottom: 1px solid #f0f0f0;

      .title {
        font-size: 16px;
      }
    }

    .users {
      .title {
        font-size: 16px;
      }

      .users-list {
        display: grid;
        grid-template-columns: 1fr 8fr;
      }
    }

    .second {
      border-bottom: 1px solid #f0f0f0;
    }

    .first,
    .users {
      display: grid;
      align-items: center;
      grid-template-rows: 1fr 2fr;
    }
  }
`;

const StyledProgress = styled(Progress)`
  .ant-progress-outer {
    padding: 0 10px;
  }
`;

const ProgressContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
`;

const STATUSES = [
  { value: 'ACTIVE', name: 'Active', color: '#61D47C' },
  { value: 'ON_HOLD', name: 'On hold', color: '#3896FF' },
  { value: 'ARCHIVED', name: 'Archived', color: '#FCA630' },
];

const Overview = ({ streamId, setTab }) => {
  const { streams } = useSelector(({ streams }) => streams);
  const stream = streams.find((stream) => stream.id === streamId);
  const owner = stream?.owner.username;
  const created = format(new Date(stream?.created || null), 'dd MMM yyyy');
  const status = stream?.status;

  let { documents } = useSelector((state) => state.documents);
  documents = documents.filter((task) => task.stream.id === streamId);
  const rejected = documents.filter((doc) => doc.status === 'REJECTED').length;
  const inProgress = documents.filter((doc) => doc.status === 'IN_PROGRESS').length;
  const approved = documents.filter((doc) => doc.status === 'APPROVED').length;

  let { tasks } = useSelector((state) => state.tasks);
  tasks = tasks.filter((task) => task.stream?.id === streamId);
  const completed = tasks.filter((task) => task.status === 'DONE').length;
  const open = tasks.filter((task) => task.status !== 'DONE').length;
  const overdue = tasks.filter((task) => new Date() > new Date(task.due)).length;

  const [streamUsers, setUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const { loading } = useAsync(async () => {
    await http.get(`/streams/${streamId}/users`).then((result) => {
      setUsers(result.data);
    });

    await http
      .get(`/streams/${streamId}/changes`)
      .then((res) => setRecentActivities(res.data.sort((a, b) => new Date(b.at) - new Date(a.at))))
      .catch((err) => console.error(err));
  }, [streamId, stream]);

  const [isEditStreamOpen, setIsEditStreamOpen] = useState(false);
  const handleEditStreamModal = useCallback(() => setIsEditStreamOpen(!isEditStreamOpen), [isEditStreamOpen]);

  if (loading) {
    return <StyledSpiner size="large" />;
  }

  return (
    <>
      <EditStreamModal isEdit id={streamId} visible={isEditStreamOpen} onCancel={handleEditStreamModal} />
      <Row gutter={[32, 24]}>
        <Col xs={24} md={12} lg={8} xl={6}>
          <StyledCard bordered={false}>
            <div className="first">
              <div className="title">Stream info</div>
              <div>
                <div className="grey">Owner</div>
                <div>{owner}</div>
              </div>
            </div>
            <div className="second">
              <div className="grey">Created</div>
              <div>{created}</div>
            </div>
            <div className="third">
              <div className="grey">Status</div>
              <div
                style={{
                  color: STATUSES.find(({ value }) => value === status)?.color,
                }}
              >
                {STATUSES.find(({ value }) => value === status)?.name}
              </div>
            </div>
          </StyledCard>
        </Col>
        <Col xs={24} md={12} lg={8} xl={6}>
          <StyledCard bordered={false}>
            <div className="first">
              <div className="title">Approved Documents</div>
              <ProgressContainer>
                <div className="grey" style={{ textAlign: 'left' }}>
                  {approved}
                </div>
                <StyledProgress format={() => null} percent={Math.round((approved * 100) / documents.length)} />
                <div className="grey" style={{ textAlign: 'right' }}>
                  {documents.length}
                </div>
              </ProgressContainer>
            </div>
            <div className="second">
              <div className="grey">In progress</div>
              <div>{inProgress} documents</div>
            </div>
            <div className="third">
              <div className="grey">Rejected</div>
              <div>{rejected} documents</div>
            </div>
          </StyledCard>
        </Col>
        <Col xs={24} md={12} lg={8} xl={6}>
          <StyledCard bordered={false}>
            <div className="first">
              <div className="title">Completed tasks</div>
              <ProgressContainer>
                <div className="grey" style={{ textAlign: 'left' }}>
                  {completed}
                </div>
                <StyledProgress format={() => null} percent={Math.round((completed * 100) / tasks.length)} />
                <div className="grey" style={{ textAlign: 'right' }}>
                  {tasks.length}
                </div>
              </ProgressContainer>
            </div>
            <div className="second">
              <div className="grey">Open</div>
              <div>{open} tasks</div>
            </div>
            <div className="third">
              <div className="grey">Overdue</div>
              <div>{overdue} tasks</div>
            </div>
          </StyledCard>
        </Col>
        <Col xs={24} md={12} lg={8} xl={6}>
          <StyledCard bordered={false}>
            <div className="users">
              <div className="title">Assigned Users</div>
              <div className="users-list">
                <Button onClick={() => handleEditStreamModal()} type="dashed" shape="circle" icon={<PlusOutlined />} />
                <Avatar.Group
                  maxCount={5}
                  size={32}
                  maxStyle={{
                    color: '#f56a00',
                    backgroundColor: '#fde3cf',
                  }}
                >
                  {streamUsers.map(({ username, id, defaultAvatar }) => (
                    <Tooltip title={username} key={id}>
                      <AvatarWithCancel
                        style={{
                          backgroundColor: defaultAvatar,
                        }}
                      >
                        {username.charAt(0).toUpperCase()}
                      </AvatarWithCancel>
                    </Tooltip>
                  ))}
                </Avatar.Group>
              </div>
            </div>
          </StyledCard>
        </Col>
      </Row>
      <StyledRow>
        <Col span={24}>
          <Card
            title="Recent Activities"
            extra={
              <Button type="link" onClick={() => setTab('Activity')}>
                All Activities
              </Button>
            }
          >
            <List
              dataSource={recentActivities.slice(0, 6)}
              locale={{ emptyText: <Empty description="No Activities Yet" /> }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: item.subject.defaultAvatar }}>{item.subject.username[0].toUpperCase()}</Avatar>
                    }
                    title={activityTitleByAction(item, streamId)}
                    description={`${formatDistance(new Date(item.at), new Date())} ago`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </StyledRow>
    </>
  );
};

export default Overview;
