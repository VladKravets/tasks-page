import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer,
  Form,
  Checkbox,
  Input,
  Select,
  Comment,
  Tooltip,
  List,
  Avatar,
  Button,
  Badge,
  Tag,
  Tabs,
  Upload,
  Popover,
  Modal,
} from 'antd';

import DatePicker from 'components/DatePicker';

import {
  DeleteOutlined,
  EditOutlined,
  CommentOutlined,
  PaperClipOutlined,
  InboxOutlined,
  PlusOutlined,
  FileUnknownTwoTone,
} from '@ant-design/icons';

import { format, formatDistance } from 'date-fns';
import http from 'http/index';

import { patchTask, deleteTask, addComment, addAttachments, getTasks } from 'store/tasks/actions.tasks';

import styles from './addTaskSidebar.module.scss';

const { Option } = Select;
const { TabPane } = Tabs;
const { Dragger } = Upload;
const { confirm } = Modal;

function AddTaskSidebar({ isOpen, setNewTaskOpen, selectedTask, setSelectedTask }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { tasksGroups } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.users);
  const { documents } = useSelector((state) => state.documents);
  const { user } = useSelector((state) => state.auth);

  const [taskName, setTaskName] = useState('');
  const [taskGroup, setTaskGroup] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState([]);
  const [description, setDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [taskPriority, setTaskPriority] = useState('low');
  const [approvalDocument, setApprovalDocument] = useState('');
  const [approver, setApprover] = useState('');

  const [taskMenu, setTaskMenu] = useState('details');
  const [commentValue, setCommentValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const inputRef = useRef(null);

  //* Handle set focus on name field
  const setFocus = (isOpen) => {
    if (selectedTask) return;
    isOpen && inputRef.current.focus();
  };

  //* Assignee
  const addAssignee = (user) => {
    if (assignee.find((ass) => ass.id === user.id)) return setAssignee((prev) => prev.filter((ass) => ass.id !== user.id));
    setAssignee((prev) => [...prev, user]);
  };

  const addAssigneeDropdown = (
    <div className={styles.addAssigneeDropdown}>
      <Checkbox checked={assignee.find((ass) => ass.id === user.id)} onChange={() => addAssignee(user)}>
        <Avatar
          style={{
            marginRight: 8,
            backgroundColor: user.defaultAvatar,
          }}
          size={22}
        >
          {user.username[0].toUpperCase()}
        </Avatar>
        {user.username} <span style={{ color: '#828d99' }}>(you)</span>
      </Checkbox>
      <br />
      {users.map((usr, i) => {
        const { username, id, defaultAvatar } = usr;

        if (user.id !== usr.id) {
          return (
            <>
              <Checkbox key={i} checked={assignee.find((ass) => ass.id === id)} onChange={() => addAssignee(usr)}>
                <Avatar
                  style={{
                    marginRight: 8,
                    backgroundColor: defaultAvatar,
                    fontSize: 16,
                  }}
                  size={22}
                >
                  {username[0].toUpperCase()}
                </Avatar>
                {username}
              </Checkbox>
              {i + 1 !== usr.length && <br />}
            </>
          );
        }

        return false;
      })}
    </div>
  );

  //* Reset state
  const clearFields = () => {
    setTaskName('');
    setTaskGroup('');
    setDueDate('');
    setAssignee([]);
    setTaskStatus('todo');
    setTaskPriority('low');
    setComments([]);
    setAttachments([]);
    setDescription('');
    setSelectedTask('');
    setApprovalDocument('');
    // setTaskStream('');
  };

  const deleteConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete this task?',
      content: 'This will delete the task, without the right to restore.',
      cancelText: 'No',
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        handleDeleteTask();
      },
    });
  };

  //* Approval request task
  const getApprover = async () => {
    await http
      .get(`/documents/${selectedTask.approvalDocuments[0].id}/approvers`)
      .then((res) => {
        setApprover(res.data.find((approver) => approver.subject.id === selectedTask.assignee[0].id));
      })
      .catch((err) => console.log(err));
  };

  const changeApprovalDocumentStatus = (status) => {
    http
      .post(`/documents/${selectedTask.approvalDocuments[0].id}/approve?status=${status}`)
      .then((res) => getApprover())
      .catch((err) => console.log(err));
  };

  //* Approval status color
  const approvalTaskStatusColor = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return '#D9D9D9';
      case 'APPROVED':
        return '#52C41A';
      case 'REJECTED':
        return '#F5222D';

      default:
        return '#D9D9D9';
    }
  };

  //* Comments

  const postComment = async () => {
    if (commentValue === '') return;

    setSubmitting(true);

    selectedTask && (await dispatch(addComment(commentValue, selectedTask.id)));

    setSubmitting(false);

    setCommentValue('');
    setComments([
      ...comments,
      {
        author: <p className={styles.commentAuthor}>{user.username}</p>,
        avatar: <Avatar style={{ backgroundColor: user.defaultAvatar }}>{user.username[0].toUpperCase()}</Avatar>,
        content: <p>{commentValue}</p>,
        datetime: (
          <Tooltip title={format(new Date(), 'yyyy-MM-dd HH:mm:ss')}>
            <span>{formatDistance(new Date(), new Date())}</span>
          </Tooltip>
        ),
      },
    ]);
  };

  const commentEditor = (
    <div className={styles.commentForm}>
      <Form.Item>
        <Input
          placeholder="Write message"
          onChange={({ target }) => {
            setCommentValue(target.value);
          }}
          value={commentValue}
        />
      </Form.Item>
      <Form.Item className={styles.postButton}>
        <Button htmlType="submit" loading={submitting} onClick={() => postComment()} type="primary">
          Post
        </Button>
      </Form.Item>
    </div>
  );

  //*Attachments
  const uploadFiles = (e) => {
    if (e.fileList.length > 0 && e.file.status !== 'removed') {
      e.file.title = e.file.name;
      e.file.url = '';

      setAttachments((prev) => [...prev, e.file]);
      selectedTask && dispatch(addAttachments([e.file], selectedTask.id));
    }
  };

  const downloadAttachment = (file) => {
    if (!file.id) return;

    http
      .get(`/attachments/${file.id}`, {
        responseType: 'blob', // important
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => console.log(err));
  };

  const deleteAttachment = (file) => {
    setAttachments(attachments.filter((attachment) => attachment.uid !== file.uid));

    if (file.id) {
      http
        .delete(`/attachments/${file.id}`)
        .then(() => dispatch(getTasks()))
        .catch((err) => console.log(err));
    }
  };

  //* Task Requests

  const updateTask = () => {
    const updateData = {};

    //*Task Status
    if (selectedTask.status !== taskStatus.toUpperCase()) updateData.status = taskStatus.toUpperCase();

    //*Task Priority
    if (selectedTask.priority !== taskPriority.toUpperCase()) updateData.priority = taskPriority.toUpperCase();

    //*Task Name
    if (selectedTask.title !== taskName) updateData.title = taskName;

    //*Task Group
    if (selectedTask.group?.id !== taskGroup && taskGroup !== '') updateData.groupID = taskGroup;

    //*Task Due Date
    if (selectedTask.due !== dueDate && dueDate !== '') updateData.due = dueDate;

    //*Task Assignee
    if (
      assignee.length !== selectedTask.assignee.length ||
      assignee.filter((ass) => selectedTask.assignee.every((selected) => selected.id !== ass.id)).length > 0
    )
      updateData.assignee = assignee.map((ass) => ass.id);

    //*Task Description
    if (selectedTask.description !== description && description !== '') updateData.description = description;

    Object.keys(updateData).length > 0 && dispatch(patchTask(updateData, selectedTask.id));

    clearFields();
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(selectedTask.id));
    setNewTaskOpen(false);
  };

  //* Disable fields for non-assignee and owner
  const disabledInput = () => {
    if (selectedTask.owner.id !== user.id) return true;
    if (selectedTask.owner.id !== user.id && !selectedTask.assignee.find((ass) => ass.id === user.id)) return true;
  };

  //* Create/Change task trigger (onCloseModal)
  useEffect(() => {
    if (selectedTask !== '') {
      const { title, group, due, assignee, description, comments, attachments, status, priority } = selectedTask;

      setTaskName(title);
      // stream && setTaskStream(stream.id);
      group && setTaskGroup(group.id);
      due && setDueDate(due);
      assignee.length > 0 && setAssignee(assignee);
      description && setDescription(description);
      setTaskStatus(status);
      setTaskPriority(priority);

      //* Approvers get
      if (selectedTask.type === 'APPROVAL_REQUEST' && selectedTask.approvalDocuments?.length > 0) getApprover();

      //* Comments
      if (comments.length > 0) {
        const taskComments = comments.map((comment) => {
          return {
            author: <p className={styles.commentAuthor}>{comment.author.username}</p>,
            avatar: <Avatar style={{ backgroundColor: comment.author.defaultAvatar }}>{comment.author.username[0].toUpperCase()}</Avatar>,
            content: <p>{comment.text}</p>,
            datetime: (
              <Tooltip title={format(new Date(comment.created), 'yyyy-MM-dd HH:mm:ss')}>
                <span>{formatDistance(new Date(comment.created), new Date())}</span>
              </Tooltip>
            ),
          };
        });
        setComments(taskComments);
      }

      attachments.length > 0 &&
        setAttachments(
          attachments.map((attachment) => {
            return {
              ...attachment,
              name: attachment.title,
              uid: attachment.id,
              url: 'link',
            };
          })
        );
    }

    !selectedTask && setAssignee([user]);

    if (isOpen === false) {
      clearFields();

      if (selectedTask) updateTask();
    }
    // eslint-disable-next-line
  }, [isOpen]);

  //*Drawer header
  const title = (
    <>
      <div className={styles.headerContainer}>
        <p className={styles.headerTaskInfo}>
          By {selectedTask ? selectedTask.creator.username : user.username} on{' '}
          {selectedTask ? format(new Date(selectedTask.created), 'dd MMM yyyy') : format(new Date(), 'dd MMM yyyy')}
        </p>
        <div className={styles.headerDropdowns}>
          <Select
            value={taskStatus.toLowerCase()}
            defaultValue="todo"
            className={styles.statusSelect}
            onChange={(value) => setTaskStatus(value)}
            name="status"
            showArrow={false}
            size="small"
            dropdownClassName={styles.statusDropdown}
            disabled={selectedTask && disabledInput()}
          >
            <Option value="todo">
              <Badge color="#d9d9d9" text="To Do" />
            </Option>
            <Option value="in_progress">
              <Badge color="#0066ff" text="In Progress" />
            </Option>
            <Option value="done">
              <Badge color="#52c41a" text="Done" />
            </Option>
          </Select>
          <Select
            disabled={selectedTask && selectedTask.owner.id !== user.id}
            defaultValue="low"
            className={styles.prioritySelect}
            onChange={(value) => setTaskPriority(value)}
            name="priority"
            value={taskPriority.toLowerCase()}
            bordered={false}
            showArrow={false}
            size="small"
            dropdownClassName={styles.priorityDropdown}
            dropdownAlign="left"
            trigger={['hover']}
          >
            <Option value="low">
              <Tag color="cyan">Low</Tag>
            </Option>
            <Option value="middle">
              <Tag color="orange">Middle</Tag>
            </Option>
            <Option value="high">
              <Tag color="red">High</Tag>
            </Option>
          </Select>
          <Button
            size="small"
            style={{
              display: selectedTask && selectedTask.owner.id === user.id ? 'block' : 'none',
            }}
            onClick={deleteConfirm}
            icon={<DeleteOutlined />}
          />
        </div>
        {!selectedTask ? (
          <Form
            fields={[
              {
                name: 'name',
                value: taskName,
              },
            ]}
            form={form}
            style={{ width: '100%' }}
          >
            <Form.Item
              rules={[{ required: true, message: '' }]}
              name="name"
              validateTrigger={['onChange', 'onBlur']}
              className={styles.taskNameForm}
            >
              <Input
                size="small"
                autoComplete="off"
                allowClear
                ref={inputRef}
                onChange={({ target }) => setTaskName(target.value)}
                placeholder="Task Name"
              />
            </Form.Item>
          </Form>
        ) : selectedTask.owner.id === user.id ? (
          <Form
            fields={[
              {
                name: 'name',
                value: taskName,
              },
            ]}
            form={form}
            style={{ width: '100%' }}
          >
            <Form.Item
              rules={[{ required: true, message: '' }]}
              name="name"
              validateTrigger={['onChange', 'onBlur']}
              className={styles.taskNameForm}
            >
              <Input
                size="small"
                autoComplete="off"
                allowClear
                ref={inputRef}
                onChange={({ target }) => setTaskName(target.value)}
                placeholder="Task Name"
              />
            </Form.Item>
          </Form>
        ) : (
          <p className={styles.disabledTaskName}>{selectedTask.title}</p>
        )}
      </div>
      <Tabs className={styles.tabBar} defaultActiveKey="details" onChange={(val) => setTaskMenu(val)}>
        <TabPane
          tab={
            <span>
              <EditOutlined />
              Details
            </span>
          }
          key="details"
        />
        <TabPane
          tab={
            <span>
              <CommentOutlined />
              Comments
            </span>
          }
          key="comments"
        />
        <TabPane
          tab={
            <span>
              <PaperClipOutlined />
              Attachment
            </span>
          }
          key="attachment"
        />
      </Tabs>
    </>
  );

  return (
    <Drawer
      visible={isOpen}
      title={title}
      width={468}
      key="left"
      headerStyle={{ padding: 0, paddingTop: 16, border: 0 }}
      bodyStyle={{ padding: 0 }}
      closable={false}
      onClose={() => setNewTaskOpen(false)}
      className={styles.addTaskSidebar}
      afterVisibleChange={setFocus}
    >
      {taskMenu === 'details' && (
        <Form
          form={form}
          name="taskForm"
          className={styles.taskForm}
          fields={[
            {
              name: 'description',
              value: description || null,
            },
            {
              name: 'group',
              value: taskGroup || null,
            },
            {
              name: 'date',
              value: dueDate ? new Date(dueDate) : null,
            },
            {
              name: 'document',
              value: approvalDocument || null,
            },
          ]}
        >
          <Form.Item label="Stream" name="stream" className={styles.formItem}>
            <Badge style={{ width: 160 }} color={selectedTask.stream?.color} text={selectedTask.stream?.title} />
          </Form.Item>
          <Form.Item label="Task Group" name="group" className={styles.formItem}>
            {!selectedTask ? (
              <Select style={{ width: 160 }} placeholder="Select task group" onChange={(value) => setTaskGroup(value)}>
                {tasksGroups.map((group, index) => {
                  return (
                    <Option key={index} value={group.id}>
                      {group.title}
                    </Option>
                  );
                })}
              </Select>
            ) : selectedTask.owner.id === user.id ? (
              <Select style={{ width: 160 }} placeholder="Select task group" onChange={(value) => setTaskGroup(value)}>
                {tasksGroups.map((group, index) => {
                  return (
                    <Option key={index} value={group.id}>
                      {group.title}
                    </Option>
                  );
                })}
              </Select>
            ) : selectedTask.group ? (
              <p style={{ width: 160 }}>{selectedTask.group.title}</p>
            ) : (
              <p style={{ width: 160 }}>No group</p>
            )}
          </Form.Item>
          <Form.Item label="Due Date" name="date" className={styles.formItem}>
            {!selectedTask ? (
              <DatePicker
                format="DD MMM, YYYY"
                style={{ width: 160 }}
                onChange={(value) => setDueDate(value ? format(new Date(value), 'yyyy-MM-dd') : '')}
              />
            ) : selectedTask.owner.id === user.id ? (
              <DatePicker
                format="DD MMM, YYYY"
                style={{ width: 160 }}
                onChange={(value) => setDueDate(value ? format(new Date(value), 'yyyy-MM-dd') : '')}
              />
            ) : selectedTask.due ? (
              <p style={{ width: 160 }}>{selectedTask.due}</p>
            ) : (
              <p style={{ width: 160 }}>No due date</p>
            )}
          </Form.Item>
          <Form.Item label="Assigned Users" className={styles.assigneeContainer}>
            {!selectedTask ? (
              <>
                <Popover title="Select assignee" content={addAssigneeDropdown} trigger={['click']} placement="bottom">
                  <Button type="dashed" shape="circle" icon={<PlusOutlined />} />
                </Popover>
                <Avatar.Group style={{ marginLeft: 8 }} maxCount={3} size={32} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                  {assignee.length > 0 &&
                    assignee.map((ass, index) => {
                      const { username, defaultAvatar } = ass;

                      return (
                        <Tooltip title={username} key={index}>
                          <Avatar
                            style={{
                              backgroundColor: defaultAvatar,
                              fontSize: 16,
                            }}
                            className={styles.assigneeAvatar}
                          >
                            {username[0].toUpperCase()}
                          </Avatar>
                        </Tooltip>
                      );
                    })}
                </Avatar.Group>
              </>
            ) : selectedTask.owner.id === user.id && selectedTask.type !== 'APPROVAL_REQUEST' ? (
              <>
                <Popover title="Select assignee" content={addAssigneeDropdown} trigger={['click']} placement="bottom">
                  <Button type="dashed" shape="circle" icon={<PlusOutlined />} />
                </Popover>
                <Avatar.Group style={{ marginLeft: 8 }} maxCount={3} size={32} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                  {assignee.length > 0 &&
                    assignee.map((ass, index) => {
                      const { username, defaultAvatar } = ass;
                      return (
                        <Tooltip title={username} key={index}>
                          <Avatar
                            style={{
                              backgroundColor: defaultAvatar,
                              fontSize: 16,
                            }}
                            className={styles.assigneeAvatar}
                          >
                            {username[0].toUpperCase()}
                          </Avatar>
                        </Tooltip>
                      );
                    })}
                </Avatar.Group>
              </>
            ) : assignee.length > 0 ? (
              <Avatar.Group maxCount={3} size={32} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                {assignee.length > 0 &&
                  assignee.map((ass, index) => {
                    const { username, defaultAvatar } = ass;

                    return (
                      <Tooltip title={username} key={index}>
                        <Avatar
                          style={{
                            backgroundColor: defaultAvatar,
                            // color: textColor
                          }}
                          className={styles.assigneeAvatar}
                        >
                          {username[0].toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    );
                  })}
              </Avatar.Group>
            ) : (
              <p style={{ width: 160 }}>No assignee</p>
            )}
          </Form.Item>
          <Form.Item
            label="Snap to document"
            style={{ display: selectedTask?.type === 'TASK' ? 'none' : 'flex' }}
            className={styles.formItem}
          >
            {!selectedTask ? (
              <Form.Item name="document" noStyle>
                <Select
                  style={{ width: 160 }}
                  placeholder={'Select document to approve'}
                  onChange={(value) => setApprovalDocument(value)}
                  allowClear
                  dropdownClassName={styles.documentDropdown}
                  showSearch
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
                >
                  {documents
                    .filter((document) => document.stream.id === selectedTask?.stream?.id)
                    .map((document, index) => {
                      return (
                        <Option key={index} value={document.id}>
                          {document.title}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            ) : (
              selectedTask.approvalDocuments?.length > 0 && (
                <Form.Item name="document" noStyle>
                  <Tooltip title={selectedTask.approvalDocuments[0].title}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FileUnknownTwoTone />
                      <Link
                        to={{
                          pathname: `/viewer`,
                          state: { id: selectedTask.approvalDocuments[0].id },
                        }}
                        className={styles.documentLink}
                      >
                        {selectedTask.approvalDocuments[0].title}
                      </Link>
                    </div>
                  </Tooltip>
                </Form.Item>
              )
            )}
          </Form.Item>

          {selectedTask && selectedTask.type === 'APPROVAL_REQUEST' && (
            <Form.Item label="Approve document" className={styles.formItem}>
              {selectedTask.assignee.some((ass) => ass.id === user.id) ? (
                <Select
                  style={{ width: 160 }}
                  defaultValue="ASSIGNED"
                  onChange={(val) => changeApprovalDocumentStatus(val)}
                  value={approver.status}
                >
                  <Option value="ASSIGNED" disabled>
                    <Badge color="#D9D9D9" text="Assigned" />
                  </Option>
                  <Option value="APPROVED">
                    <Badge color="#52C41A" text="Approved" />
                  </Option>
                  <Option value="REJECTED">
                    <Badge color="#F5222D" text="Rejected" />
                  </Option>
                </Select>
              ) : (
                <Badge
                  style={{ width: 160 }}
                  color={approvalTaskStatusColor(approver.status)}
                  text={approver.status?.charAt(0) + approver.status?.slice(1).toLowerCase()}
                />
              )}
            </Form.Item>
          )}

          <Form.Item label="Description" name="description" className={styles.formItem}>
            <Input.TextArea
              readOnly={selectedTask && selectedTask.owner.id !== user.id}
              placeholder="Add more detail to this tasks..."
              rows={4}
              style={{ resize: 'none' }}
              onChange={({ target }) => setDescription(target.value)}
            />
          </Form.Item>
        </Form>
      )}
      {taskMenu === 'comments' && (
        <div className={styles.commentsContainer}>
          <div
            className={styles.commentsBody}
            style={
              comments.length === 0
                ? {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }
                : null
            }
          >
            <List
              className="comment-list"
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(item) => (
                <li>
                  <Comment
                    actions={item.actions}
                    author={item.author}
                    avatar={item.avatar}
                    content={item.content}
                    datetime={item.datetime}
                  />
                </li>
              )}
            />
          </div>
          <div className={styles.commentsFooter}>
            <Comment
              avatar={<Avatar style={{ backgroundColor: user.defaultAvatar }}>{user.username[0].toUpperCase()}</Avatar>}
              content={commentEditor}
            />
          </div>
        </div>
      )}
      {taskMenu === 'attachment' && (
        <div className={styles.attachmentContainer}>
          <Dragger
            name="file"
            multiple
            onChange={(e) => {
              console.log('change');
              console.log('e', e);
              uploadFiles(e);
            }}
            beforeUpload={() => false}
            onRemove={(file) => deleteAttachment(file)}
            fileList={attachments}
            listType="picture"
            onPreview={(file) => downloadAttachment(file)}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p>
              Drad and Drop or <span style={{ color: 'rgba(24, 144, 255, 1)' }}>Browse for files</span>{' '}
            </p>
            <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>Maximum size 5MB</p>
          </Dragger>
        </div>
      )}
    </Drawer>
  );
}

export default AddTaskSidebar;
