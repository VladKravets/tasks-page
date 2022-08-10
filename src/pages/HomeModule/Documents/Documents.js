import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useAsync } from 'react-use';

import { uploadFile, deleteDocument, getDocumentsAll } from 'store/documents/actions.documents';
import { CLEAR_ADD_DOCUMENT_LIST } from 'store/documents/actionTypes.documents';

import PageTitle from 'components/PageTitle';
import StyledSpiner from 'components/Loader';
import StyledTabs from 'components/Tabs';
import Container from 'components/Container';

import defineFileIcon from 'utils/defineFileIcon';

import {
  Table,
  Tooltip,
  Avatar,
  Input,
  Select,
  Space,
  Button,
  Dropdown,
  Menu,
  Checkbox,
  Popover,
  Tabs,
  Empty,
  Modal,
  Form,
  Upload,
  message,
  Badge,
} from 'antd';

import { EllipsisOutlined, SearchOutlined, DownOutlined, FolderViewOutlined, DeleteOutlined, InboxOutlined } from '@ant-design/icons';

import styles from './documents.module.scss';

const { TabPane } = Tabs;
const { Option } = Select;
const { Dragger } = Upload;
const { confirm } = Modal;

export const StyledTable = styled(Table)`
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #f5f5f5;
  overflow-x: auto;
  //margin-bottom: 32px;

  .ant-spin-nested-loading {
    width: fit-content;
  }
`;

function Documents() {
  const dispatch = useDispatch();

  const [tableState, setTableState] = useState('All');
  const [hideColumns, setHideColumns] = useState([]);

  const { documents } = useSelector((state) => state.documents);
  const { streams } = useSelector((state) => state.streams);

  const { loading } = useAsync(async () => {
    await dispatch(getDocumentsAll());
  }, [dispatch]);

  //* Add files
  const [form] = Form.useForm();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documentStream, setDocumentStream] = useState('');
  const [uploadList, setUploadList] = useState([]);
  const addList = useSelector((state) => state.documents.addDocumentList);

  const addFiles = (e) => {
    if (e.file.status !== 'removed') {
      setUploadList((prev) => [...prev, e.file]);
    }
  };

  const uploadFiless = () => {
    form.submit();

    if (documentStream && uploadList.length > 0) {
      for (let i = 0; i < uploadList.length; i++) {
        dispatch(uploadFile(uploadList[i], documentStream));
      }
    }
  };
  // eslint-disable-next-line
  const deleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this document?',
      content: 'This will delete the document, without the right to restore.',
      onOk() {
        dispatch(deleteDocument(id));
      },
    });
  };

  useEffect(() => {
    if (addList.length === 0) return;

    setIsLoading(true);
    const loading = addList.find((file) => file.loading === true);

    if (!loading) {
      let totalUploaded = 0;
      let totalError = 0;

      addList.forEach((file) => {
        !file.error ? (totalUploaded += 1) : (totalError += 1);
      });

      message.config({
        top: 70,
        duration: 4,
        maxCount: 3,
      });

      setAddModalOpen(false);
      setIsLoading(false);

      totalUploaded && message.success(`${totalUploaded} ${totalUploaded === 1 ? 'document' : 'documents'} uploaded`);
      totalError && message.error(`${totalError} ${totalError === 1 ? 'document' : 'documents'} upload failed`);

      dispatch(getDocumentsAll());
      dispatch({ type: CLEAR_ADD_DOCUMENT_LIST });
      setUploadList([]);
    }
  }, [addList, dispatch]);

  //*Document types counting for table menu
  const documentTypes = {};
  documents.forEach((document) => {
    if (documentTypes[document['status']]) {
      documentTypes[document['status']] += 1;
      return;
    }
    documentTypes[document['status']] = 1;
  });

  const menuItems = {
    Assigned: documentTypes.ASSIGNED || 0,
    'In Progress': documentTypes['IN_PROGRESS'] || 0,
    Approved: documentTypes.APPROVED || 0,
    Rejected: documentTypes.REJECTED || 0,
  };

  //* Table data
  const data = useMemo(() => {
    if (tableState === 'All') {
      return documents.map((document, index) => {
        return {
          key: index,
          name: document.title,
          type: document.type.title,
          stream: document.stream.title,
          uploaded: document.uploaded,
          owner: document.owner.username,
          approvers: document.approvers,
          assignee: document.uploader.username,
          // team: document.team.title,
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
                  // team: document.team.title,
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
    } else {
      return documents
        .filter((document) => {
          if (tableState.includes(' ')) {
            return document.status === tableState.split(' ').join('_').toUpperCase();
          }
          return document.status === tableState.toUpperCase();
        })
        .map((document, index) => {
          return {
            key: index,
            name: document.title,
            type: document.type.title,
            stream: document.stream.title,
            uploaded: document.uploaded,
            owner: document.owner.username,
            approvers: document.approvers,
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
    }
  }, [documents, tableState]);

  //*Actions dropdown
  const moreDropdown = useCallback(
    (document) => (
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
    ),
    [deleteConfirm]
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
          <div>
            {defineFileIcon(text)}
            {text.length > 31 ? (
              <Tooltip title={text}>
                <Link
                  to={{
                    pathname: `/viewer`,
                    state: { id: record.id },
                  }}
                  // className={styles.fileName}
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
                // className={styles.fileName}
              >
                {text}
              </Link>
            )}
          </div>
        ),
        sorter: (a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0),
        sortDirections: ['descend', 'ascend'],
        width: 300,
        className: styles.name,
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
        className: styles.type,
      },
      {
        title: 'Stream',
        dataIndex: 'stream',
        key: 'stream',

        filters: data.reduce((acc, document) => {
          const stream = document.stream;
          if (!acc.find((exist) => exist.text === stream)) {
            return [...acc, { text: stream, value: stream }];
          }
          return acc;
        }, []),
        onFilter: (value, record) => record.stream === value,
        width: 200,
        className: styles.stream,
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
        className: styles.approvers,
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

          return <Badge color={bgc} text={transformedInProgress || record.status} />;
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
        className: styles.status,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <Dropdown overlay={moreDropdown(record)}>
            <div>
              <EllipsisOutlined />
            </div>
          </Dropdown>
        ),
        width: 96,
        className: styles.actions,
      },
    ],
    [data, moreDropdown]
  );

  //* Hide columns dropdown
  const toggleHideColumn = (column) => {
    !hideColumns.includes(column) ? setHideColumns([...hideColumns, column]) : setHideColumns(hideColumns.filter((col) => col !== column));
  };

  const showColumnsDropdown = (
    <>
      {columns.map((column, index) => {
        return (
          <Checkbox
            key={index}
            className={styles.showColumnsCheckbox}
            checked={!hideColumns.includes(column.title)}
            onChange={({ target }) => toggleHideColumn(target.name)}
            disabled={column.title === 'Name' || column.title === 'Actions'}
            name={column.title}
          >
            {column.title}
          </Checkbox>
        );
      })}
    </>
  );

  const AddDocumentModal = (
    <Modal
      visible={addModalOpen}
      title="Upload documents"
      onCancel={() => setAddModalOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setAddModalOpen(false)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => uploadFiless()} loading={isLoading}>
          Confirm upload
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        fields={[
          {
            name: 'stream',
            value: documentStream || null,
          },
        ]}
      >
        <Form.Item name="stream" rules={[{ required: true, message: 'Please input your stream!' }]} label="Stream">
          <Select placeholder="Select stream" onChange={(val) => setDocumentStream(val)}>
            {streams.map((stream, i) => (
              <Option key={i} value={stream.id}>
                {stream.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <Dragger
        name="documents"
        multiple
        beforeUpload={() => false}
        fileList={uploadList}
        onChange={(e) => addFiles(e)}
        onRemove={(file) => setUploadList(uploadList.filter((listFile) => listFile.name !== file.name))}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p>
          <span style={{ color: 'rgba(24, 144, 255, 1)' }}>Click or drag </span>
          file to this area to upload
        </p>
        <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>PDF, DOC only</p>
      </Dragger>
    </Modal>
  );

  if (loading) {
    return <StyledSpiner size="large" />;
  }

  return (
    <>
      <PageTitle
        title="Documents"
        handleAddClick={setAddModalOpen}
        extra={
          <Popover content={showColumnsDropdown} placement="bottom" trigger="click">
            <Button>
              Columns <DownOutlined />
            </Button>
          </Popover>
        }
        footer={
          <StyledTabs defaultActiveKey="All" onChange={(val) => setTableState(val)}>
            <TabPane tab="All" key="All"></TabPane>
            {Object.entries(menuItems).map(([key, value]) => (
              <TabPane tab={`${key} ${value}`} key={key}></TabPane>
            ))}
          </StyledTabs>
        }
      />
      <div className={styles.documents} id="documents">
        {/* //*Add New document Modal */}
        {AddDocumentModal}
        <Container>
          <StyledTable
            locale={{ emptyText: <Empty description="No Documents Yet" /> }}
            dataSource={data}
            columns={columns.filter((col) => !hideColumns.includes(col.title))}
            tableLayout="fixed"
            size="medium"
          />
        </Container>
      </div>
    </>
  );
}

export default Documents;
