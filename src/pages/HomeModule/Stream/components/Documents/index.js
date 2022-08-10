import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAsync } from 'react-use';

import { uploadFile, deleteDocument, getDocumentsAll } from 'store/documents/actions.documents';
import { CLEAR_ADD_DOCUMENT_LIST } from 'store/documents/actionTypes.documents';

import StyledSpiner from 'components/Loader';

import defineFileIcon from 'utils/defineFileIcon';

import * as S from './styled';

import { Tooltip, Avatar, Input, Space, Button, Dropdown, Menu, Popover, Empty, Modal, Form, Upload, message, Badge } from 'antd';

import {
  EllipsisOutlined,
  SearchOutlined,
  DownOutlined,
  FolderViewOutlined,
  DeleteOutlined,
  InboxOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const { Dragger } = Upload;
const { confirm } = Modal;

const DocumentsTable = ({ streamId }) => {
  const dispatch = useDispatch();

  const [hideColumns, setHideColumns] = useState([]);

  const { documents } = useSelector((state) => state.documents);
  const { streams } = useSelector((state) => state.streams);

  const currentStream = streams.find((stream) => stream.id === streamId);

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

  //* Add files
  const [form] = Form.useForm();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadList, setUploadList] = useState([]);

  const addList = useSelector((state) => state.documents.addDocumentList);

  const addFiles = (e) => {
    if (e.file.status !== 'removed') {
      setUploadList((prev) => [...prev, e.file]);
    }
  };

  const uploadFiless = () => {
    form.submit();

    if (uploadList.length > 0) {
      for (let i = 0; i < uploadList.length; i++) {
        dispatch(uploadFile(uploadList[i], streamId));
      }
    }
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

  //* Table data
  const data = useMemo(() => {
    return documents
      .filter((document) => document.stream.id === streamId)
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
  }, [documents, streamId]);

  //*Actions dropdown
  // eslint-disable-next-line
  const moreDropdown = (document) => (
    <Menu>
      <Menu.Item>
        <Link
          to={{
            pathname: `/viewer`,
            state: { id: document.id, fromStream: streamId },
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
                    state: { id: record.id, fromStream: streamId },
                  }}
                >
                  {text}
                </Link>
              </Tooltip>
            ) : (
              <Link
                to={{
                  pathname: `/viewer`,
                  state: { id: record.id, fromStream: streamId },
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
    [data, moreDropdown, streamId]
  );

  //* Hide columns dropdown
  const toggleHideColumn = (column) => {
    !hideColumns.includes(column) ? setHideColumns([...hideColumns, column]) : setHideColumns(hideColumns.filter((col) => col !== column));
  };

  const showColumnsDropdown = (
    <>
      {columns.map((column, index) => {
        return (
          <S.StyledCheckbox
            key={index}
            checked={!hideColumns.includes(column.title)}
            onChange={({ target }) => toggleHideColumn(target.name)}
            disabled={column.title === 'Name' || column.title === 'Actions'}
            name={column.title}
          >
            {column.title}
          </S.StyledCheckbox>
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
      <Form.Item name="stream" label="Stream">
        <Badge color={currentStream?.color} text={currentStream?.title} />
      </Form.Item>

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
      <S.TableMenu>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>
          Add Files
        </Button>
        <Popover content={showColumnsDropdown} placement="bottom" trigger="click">
          <Button>
            Columns <DownOutlined />
          </Button>
        </Popover>
      </S.TableMenu>

      {/* //*Add New document Modal */}
      {AddDocumentModal}
      <S.StyledTable
        locale={{ emptyText: <Empty description="No Documents Yet" /> }}
        dataSource={data}
        columns={columns.filter((col) => !hideColumns.includes(col.title))}
        tableLayout="fixed"
        size="medium"
      />
    </>
  );
};

export default DocumentsTable;
