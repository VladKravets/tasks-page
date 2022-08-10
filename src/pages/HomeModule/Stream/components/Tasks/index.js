import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAsync } from 'react-use';
import { format } from 'date-fns';

import { getTasks, getTasksGroups } from 'store/tasks/actions.tasks';

import { Tooltip, message, Avatar, Empty, Badge, Tag, Input, Space, Button, Radio } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

import AddTaskSidebar from './addTaskSidebar/AddTaskSidebar';
import HideColumnsDropdown from 'components/HideColumnsDropdown';
import StyledSpiner from 'components/Loader';

import * as S from './styled';

const bodyNode = document.querySelector('body');

function TaskTable({ streamId }) {
  const dispatch = useDispatch();
  const { tasks, alerts } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [tasksState, setTasksState] = useState('All Tasks');
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const [hideColumns, setHideColumns] = useState([]);

  useEffect(() => {
    const { deleted, created, changed, loading } = alerts;
    message.config({
      top: 70,
      duration: 2,
    });
    loading && message.loading('In progress...');
    deleted && message.success('Task deleted');
    created && message.success('New task created');
    changed && message.success('Task changed');
  }, [alerts]);

  useEffect(() => {
    if (newTaskOpen) {
      bodyNode.style.overflow = 'hidden';
    }
  }, [newTaskOpen]);

  const { loading } = useAsync(async () => {
    await dispatch(getTasks());
    await dispatch(getTasksGroups());
  }, [dispatch]);

  const data = useMemo(() => {
    if (tasksState === 'All Tasks') {
      return tasks
        .filter((task) => task.stream?.id === streamId)
        .map((task, index) => {
          return {
            key: index,
            selectedTask: task.id,
            title: task.title,
            stream: task.stream && task.stream.title,
            assignee: task.assignee,
            due: task.due ? format(new Date(task.due), 'dd MMM yyyy') : null,
            priority: task.priority,
            attachments: task.attachments.length,
            comments: task.comments.length,
            status: task.status.toLowerCase(),
            type: task.type.includes('_') ? task.type.split('_').join(' ').toLowerCase() : task.type.toLowerCase(),
          };
        });
    }

    return tasks
      .filter((task) => task.stream?.id === streamId)
      .filter((task) => task.assignee.find((ass) => ass.id === user.id))
      .map((task, index) => {
        return {
          key: index,
          selectedTask: task.id,
          title: task.title,
          stream: task.stream && task.stream.title,
          assignee: task.assignee,
          due: task.due ? format(new Date(task.due), 'dd MMM yyyy') : null,
          priority: task.priority,
          attachments: task.attachments.length,
          comments: task.comments.length,
          status: task.status.toLowerCase(),
          type: task.type.includes('_') ? task.type.split('_').join(' ').toLowerCase() : task.type.toLowerCase(),
        };
      });
    // eslint-disable-next-line
  }, [tasks, tasksState, hideColumns, streamId, user.id]);

  const columns = useMemo(
    () => [
      {
        title: 'Task name',
        dataIndex: 'title',
        key: 'title',
        width: 394,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder={`Search name`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => confirm()}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
                Search
              </Button>
              <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => (record['title'] ? record['title'].toString().toLowerCase().includes(value.toLowerCase()) : ''),
        sorter: (a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0),
        sortDirections: ['descend', 'ascend'],

        render: (text) => {
          if (text.length > 53)
            return (
              <Tooltip title={text}>
                <S.TaskName>{text}</S.TaskName>
              </Tooltip>
            );
          return <S.TaskName>{text}</S.TaskName>;
        },
      },
      {
        title: 'Stream',
        dataIndex: 'stream',
        key: 'stream',
        width: 200,
      },
      {
        title: 'Assignee',
        dataIndex: 'assignee',
        key: 'assignee',
        width: 120,
        filters: data.reduce((acc, document) => {
          const assignee = document.assignee;
          assignee.forEach((ass) => {
            if (!acc.find((exist) => exist.text === ass.username)) {
              acc = [...acc, { text: ass.username, value: ass.username }];
            }
          });
          return acc;
        }, []),
        onFilter: (value, record) => record.assignee.find((ass) => ass.username === value),
        render: (text, record) => (
          <Avatar.Group
            size={28}
            maxCount={3}
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
            style={{ verticalAlign: 'middle' }}
          >
            {record.assignee.map((ass, index) => {
              const { username, defaultAvatar } = ass;

              return (
                <Tooltip key={index} title={username}>
                  <Avatar
                    style={{
                      backgroundColor: defaultAvatar,
                      fontSize: 16,
                    }}
                  >
                    {username[0].toUpperCase()}
                  </Avatar>
                </Tooltip>
              );
            })}
          </Avatar.Group>
        ),
      },
      {
        title: 'Due date',
        dataIndex: 'due',
        key: 'due',
        width: 160,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        filters: data.reduce((acc, task) => {
          const status = task.status;
          const transformedInProgress = status === 'in_progress' && status.split('_').join(' ');
          const transformedStatus = transformedInProgress
            ? transformedInProgress.charAt(0).toUpperCase() + transformedInProgress.slice(1)
            : status.charAt(0).toUpperCase() + status.slice(1);

          if (!acc.find((exist) => exist.value === status)) {
            return [
              ...acc,
              {
                text: transformedStatus,
                value: status,
              },
            ];
          }
          return acc;
        }, []),
        onFilter: (value, record) => record.status === value,
        render: (text, record) => {
          switch (text) {
            case 'todo':
              return <Badge color="#d9d9d9" text="To Do" />;
            case 'in_progress':
              return <Badge color="#0066ff" text="In Progress" />;
            case 'done':
              return <Badge color="#52c41a" text="Done" />;

            default:
              return text;
          }
        },
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        width: 100,
        filters: data.reduce((acc, task) => {
          const priority = task.priority;
          if (!acc.find((exist) => exist.value === priority)) {
            return [
              ...acc,
              {
                text: priority[0] + priority.slice(1).toLowerCase(),
                value: priority,
              },
            ];
          }
          return acc;
        }, []),
        onFilter: (value, record) => record.priority === value,
        render: (text, record) => {
          switch (text) {
            case 'LOW':
              return <Tag color="cyan">Low</Tag>;
            case 'MIDDLE':
              return <Tag color="orange">Middle</Tag>;
            case 'HIGH':
              return <Tag color="red">High</Tag>;

            default:
              return text;
          }
        },
      },
    ],
    [data]
  );

  //* Hide columns dropdown
  const toggleHideColumn = (column) => {
    !hideColumns.includes(column) ? setHideColumns([...hideColumns, column]) : setHideColumns(hideColumns.filter((col) => col !== column));
  };

  //* Open task
  const openTask = (id) => {
    setSelectedTask(tasks.find((task) => task.id === id));
    setNewTaskOpen(true);
  };

  if (loading) {
    return <StyledSpiner size="large" />;
  }

  return (
    <S.Container>
      <S.TableMenu>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setNewTaskOpen(true)}>
          Add Task
        </Button>
        <div>
          <Radio.Group
            defaultValue="All Tasks"
            onChange={({ target }) => setTasksState(target.value)}
            style={{
              marginRight: 8,
            }}
          >
            <Radio.Button value="All Tasks">All tasks</Radio.Button>
            <Radio.Button value="My tasks">My tasks</Radio.Button>
          </Radio.Group>
          <HideColumnsDropdown toggleHideColumn={toggleHideColumn} hideColumns={hideColumns} columns={columns} />
        </div>
      </S.TableMenu>

      <S.StyledTable
        locale={{ emptyText: <Empty description="No Tasks Yet" /> }}
        dataSource={data}
        columns={columns.filter((col) => !hideColumns.includes(col.title))}
        tableLayout="fixed"
        size="medium"
        onRow={(record) => {
          return {
            onClick: () => openTask(record.selectedTask),
          };
        }}
      />

      <AddTaskSidebar
        streamId={streamId}
        isOpen={newTaskOpen}
        setNewTaskOpen={setNewTaskOpen}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
    </S.Container>
  );
}

export default TaskTable;
