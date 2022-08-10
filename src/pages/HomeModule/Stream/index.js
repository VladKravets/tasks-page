import React, { useState, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAsyncFn } from 'react-use';
import { useSelector } from 'react-redux';
import { Tabs, Tag, Tooltip, Select, Popover, Empty, Modal } from 'antd';
import { DeleteOutlined, SettingFilled, EllipsisOutlined, FolderOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { useDispatch } from 'react-redux';

import DocumentsTable from './components/Documents';
import TaskTable from './components/Tasks';
import Overview from './components/Overview';
import Users from './components/Users';
import Activity from './components/Activity';
import PageTitle from 'components/PageTitle';
import EditStreamModal from '../AddStreamModal';
import http from 'http/index';
import styles from './components/Tasks/addTaskSidebar/addTaskSidebar.module.scss';
import { getStreamsAll } from 'store/streams/actions.streams';
import { StyledTabs } from 'components/Tabs';
import StyledSpiner from 'components/Loader';
import Container from 'components/Container';

const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

const StyledSettingFilled = styled(SettingFilled)`
  font-size: 16px;
  cursor: pointer;
  color: #bfbfbf;

  :hover {
    color: #1890ff;
  }
`;

const StyledEllipsisOutlined = styled(EllipsisOutlined)`
  font-size: 16px;
  margin: 0 0 0 15px;
  cursor: pointer;
  color: #bfbfbf;

  :hover {
    color: #1890ff;
  }
`;

const Options = styled.div`
  .option {
    display: flex;
    align-items: center;
    cursor: pointer;

    :hover {
      color: #1890ff;
    }

    svg {
      margin-right: 5px;
    }
  }
`;

export const StyledEmpty = styled(Empty)`
  margin-top: 25vh;
`;

const TABS = ['Overview', 'Documents', 'Tasks', 'Users', 'Activity'];
const STATUSES = [
  { value: 'ACTIVE', name: 'Active', color: 'green' },
  { value: 'ON_HOLD', name: 'On hold', color: 'blue' },
  { value: 'ARCHIVED', name: 'Archived', color: 'orange' },
];

const StreamPage = (props) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { push } = useHistory();
  const { streams } = useSelector(({ streams }) => streams);
  const stream = streams.find((stream) => stream.id === id);
  const [status, setStatus] = useState(null);
  const [isEditStreamOpen, setIsEditStreamOpen] = useState(false);
  const users = useSelector((state) => state.users.users);
  const [tab, setTab] = useState(TABS[0]);

  useEffect(() => {
    setStatus(stream?.status);
  }, [stream]);

  const info = () => {
    Modal.info({
      content: <div style={{ paddingLeft: '40px' }}>{`Unable to delete the last stream "${streams[0].title}" in the platform.`}</div>,
    });
  };

  const handleEditStreamModal = useCallback(() => setIsEditStreamOpen(!isEditStreamOpen), [isEditStreamOpen]);

  const handleChangeStatus = async (status) => {
    setStatus(status);
    await http.patch(`/streams/${id}`, {
      status,
      privacy: 'PRIVATE',
    });
    dispatch(getStreamsAll());
  };

  const [, handleDeleteStream] = useAsyncFn(async () => {
    await http.delete(`/streams/${id}`);
    push('/users');
  }, [id, push]);

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this stream?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>This will delete the stream, along with the following data:</p>
          <p>- Any documents that are only in this stream</p>
          <p>- Any tasks local to the stream</p>
        </div>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteStream();
      },
    });
  };

  if (!stream) {
    return <StyledSpiner size="large" />;
  }

  return (
    <>
      <EditStreamModal isEdit id={id} users={users} visible={isEditStreamOpen} onCancel={handleEditStreamModal} />
      <PageTitle
        avatar={{
          style: { backgroundColor: stream?.color },
          shape: 'square',
          icon: <FolderOutlined />,
        }}
        title={stream?.title[0].toUpperCase() + stream?.title.slice(1)}
        subTitle={stream?.description}
        tags={
          <>
            <Select
              onChange={handleChangeStatus}
              name="priority"
              className={styles.prioritySelect}
              dropdownClassName={styles.priorityDropdown}
              value={status}
              bordered={false}
              showArrow={false}
              size="small"
              dropdownAlign="left"
              trigger={['hover']}
            >
              {STATUSES.map((status) => (
                <Option key={status.value} value={status.value}>
                  <Tag color={status.color}>{status.name}</Tag>
                </Option>
              ))}
            </Select>
            <Tooltip title="Edit Stream">
              <StyledSettingFilled onClick={handleEditStreamModal} />
            </Tooltip>
            <Popover
              placement="bottom"
              content={
                <Options>
                  <div
                    className="option"
                    onClick={() => {
                      if (streams.length === 1) {
                        info();
                      } else {
                        showDeleteConfirm();
                      }
                    }}
                  >
                    <DeleteOutlined />
                    <div>Delete stream</div>
                  </div>
                </Options>
              }
            >
              <StyledEllipsisOutlined />
            </Popover>
          </>
        }
        footer={
          <StyledTabs defaultActiveKey="All" activeKey={tab} onChange={setTab}>
            {TABS.map((tab) => (
              <TabPane tab={tab} key={tab}></TabPane>
            ))}
          </StyledTabs>
        }
      />
      <Container>
        {tab === 'Overview' && <Overview streamId={id} setTab={setTab} />}
        {tab === 'Documents' && <DocumentsTable streamId={id} />}
        {tab === 'Tasks' && <TaskTable streamId={id} />}
        {tab === 'Users' && <Users streamId={id} />}
        {tab === 'Activity' && <Activity streamId={id} />}
      </Container>
    </>
  );
};

export default StreamPage;
