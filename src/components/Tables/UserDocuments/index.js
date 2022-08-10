import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAsync } from 'react-use';

import { deleteDocument, getDocumentsAll } from 'store/documents/actions.documents';

import StyledSpiner from 'components/Loader';

import defineFileIcon from 'utils/defineFileIcon';

import * as S from './styled';

import { Tooltip, Avatar, Input, Space, Button, Dropdown, Menu, Empty, Modal, Badge } from 'antd';

import { EllipsisOutlined, SearchOutlined, FolderViewOutlined, DeleteOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const DocumentsTable = ({ userId }) => {
  const dispatch = useDispatch();
  const { documents } = useSelector((state) => state.documents);

  const { loading } = useAsync(async () => {
    await dispatch(getDocumentsAll());
  }, [dispatch]);

  const deleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this document?',
      content: 'This will delete the document, without the right to restore.',
      onOk() {
        dispatch(deleteDocument(id));
      },
    });
  };

  //* Table data
  const data = useMemo(() => {
    return documents
      .filter((doc) => doc.owner.id === userId || doc.approvers.some((app) => app.id === userId))
      .map((document, index) => {
        return {
          key: index,
          name: document.title,
          type: document.type.title,
          stream: document.stream.title,
          uploaded: document.uploaded,
          owner: document.owner.username,
          approvers: document.approvers,
          assignee: document.uploader.username,
          status: document.status.toLowerCase(),
          version: document.version,
          children: document.previousVersions
            ? document.previousVersions.map((version) => {
                return {
                  key: index,
                  id: version.id,
                  name: version.title,
                  owner: document.owner.username,
                  approvers: document.approvers,
                  status: version.status.toLowerCase(),
                  stream: document.stream.title,
                  type: document.type.title,
                  uploaded: version.uploaded,
                  version: version.version,
                  assignee: document.uploader.username,
                  oldVersion: true,
                };
              })
            : null,
          id: document.id,
        };
      });
    // eslint-disable-next-line
  }, [documents]);

  //*Actions dropdown
  // eslint-disable-next-line
  const moreDropdown = (document) => (
    <Menu>
      <Menu.Item>
        <Link
          to={{
            pathname: `/viewer`,
            state: { id: document.id },
          }}
        >
          <FolderViewOutlined /> View document
        </Link>
      </Menu.Item>
      {!document.oldVersion && (
        <Menu.Item onClick={() => deleteConfirm(document.id)}>
          <DeleteOutlined /> Delete
        </Menu.Item>
      )}
    </Menu>
  );

  //*Table columns
  const columns = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
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
        onFilter: (value, record) => (record['name'] ? record['name'].toString().toLowerCase().includes(value.toLowerCase()) : ''),
        render: (text, record) => (
          <S.DocumentName>
            {defineFileIcon(text)}
            {text?.length > 37 ? (
              <Tooltip title={text}>
                <Link
                  to={{
                    pathname: `/viewer`,
                    state: { id: record.id },
                  }}
                >
                  {text}
                </Link>
              </Tooltip>
            ) : (
              <Link
                to={{
                  pathname: `/viewer`,
                  state: { id: record.id },
                }}
              >
                {text}
              </Link>
            )}
          </S.DocumentName>
        ),
        sorter: (a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0),
        sortDirections: ['descend', 'ascend'],
        width: 300,
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        filters: data.reduce((acc, document) => {
          const type = document.type;
          if (!acc.find((exist) => exist.text === type)) {
            return [...acc, { text: type, value: type }];
          }
          return acc;
        }, []),
        onFilter: (value, record) => record.type === value,
        width: 240,
        render: (text, recort) => <S.DocumentType>{text}</S.DocumentType>,
      },
      {
        title: 'Stream',
        dataIndex: 'stream',
        key: 'stream',
        width: 200,
      },
      {
        title: 'Approvers',
        dataIndex: 'approvers',
        key: 'approvers',
        filters: data.reduce((acc, document) => {
          const approvers = document.approvers;
          approvers.forEach((approver) => {
            if (!acc.find((exist) => exist.text === approver.username)) {
              acc = [...acc, { text: approver.username, value: approver.username }];
            }
          });
          return acc;
        }, []),
        render: (text, record) => {
          return (
            <>
              <Avatar.Group
                size={28}
                maxCount={3}
                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                style={{ verticalAlign: 'middle' }}
              >
                {record.approvers.map((approver, index) => {
                  const { username, defaultAvatar } = approver;

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
            </>
          );
        },
        onFilter: (value, record) => record.approvers.find((approver) => approver.username === value),
        width: 160,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          let bgc;
          switch (text) {
            case 'assigned':
              bgc = '#D9D9D9';
              break;
            case 'in_progress':
              bgc = '#FA8C16';
              break;
            case 'reviewed':
              bgc = '#1890FF';
              break;
            case 'approved':
              bgc = '#52C41A';
              break;
            case 'rejected':
              bgc = '#F5222D';
              break;

            default:
              break;
          }

          const transformedInProgress = text === 'in_progress' && text.split('_').join(' ');

          return <Badge color={bgc} text={transformedInProgress || record.status} style={{ textTransform: 'capitalize' }} />;
        },

        filters: data.reduce((acc, document) => {
          const status = document.status;
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
        width: 140,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <S.DocumentAction>
            <Dropdown overlay={moreDropdown(record)}>
              <div>
                <EllipsisOutlined />
              </div>
            </Dropdown>
          </S.DocumentAction>
        ),
        width: 96,
      },
    ],
    [data, moreDropdown]
  );

  if (loading) {
    return <StyledSpiner size="large" />;
  }

  return (
    <S.Container>
      <S.StyledTable
        locale={{ emptyText: <Empty description="No Documents Yet" /> }}
        dataSource={data}
        columns={columns}
        tableLayout="fixed"
        size="medium"
      />
    </S.Container>
  );
};

export default DocumentsTable;
