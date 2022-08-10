import React from 'react';
import styled from 'styled-components';
import { convertToCapital } from 'utils/convertText';

export const Bold = styled.span`
  color: rgba(0, 0, 0, 0.65);
  font-weight: 800;
`;

const notificationDescription = ({ action, topic: top, author: auth, topicID }, documents, tasks, streams) => {
  const topic = convertToCapital(top);
  const author = convertToCapital(auth.username);
  const stream =
    (topic === 'Task' && tasks.find((task) => task.id === topicID)?.stream.title) ||
    (topic === 'Document' && documents.find((document) => document.id === topicID)?.stream.title) ||
    (topic === 'Stream' && streams.find((task) => task.id === topicID)?.title) ||
    'Stream';

  switch (action) {
    case 'APPROVED':
      return (
        <>
          <Bold>{author}</Bold> approved <Bold>Document</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'APPROVER_ADDED':
      return (
        <>
          <Bold>{author}</Bold> added you as approver to <Bold>Document</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'APPROVER_REMOVED':
      return (
        <>
          <Bold>{author}</Bold> removed you as approver from <Bold>Document</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'ASSIGNED':
      return (
        <>
          <Bold>{author}</Bold> assigned <Bold>{topic}</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'ASSIGNEE_REMOVED':
      return (
        <>
          <Bold>{author}</Bold> removed assigning from <Bold>{topic}</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'ATTACHED':
      return (
        <>
          <Bold>{author}</Bold> attached a file to a <Bold>Task</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'COMMENTED':
      return (
        <>
          <Bold>{author}</Bold> added comment to a <Bold>{topic}</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'COPIED':
      return (
        <>
          <Bold>{author}</Bold> copied <Bold>{topic}</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'CREATED':
      return (
        <>
          <Bold>{author}</Bold> created <Bold>{topic}</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'DETACHED':
      return (
        <>
          <Bold>{author}</Bold> detached file from <Bold>{topic}</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'MEMBER_REMOVED':
      return (
        <>
          <Bold>{author}</Bold> removed member from <Bold>{topic}</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'MEMBER_ROLE_UPDATED':
      return (
        <>
          <Bold>{author}</Bold> updated member role in <Bold>{stream}</Bold>
        </>
      );
    case 'NEW_MEMBER':
      return (
        <>
          <Bold>{author}</Bold> added new member to <Bold>{stream}</Bold> stream
        </>
      );
    case 'TAGGED':
      return (
        <>
          <Bold>{author}</Bold> tagged <Bold>{topic}</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'UNTAGGED':
      return (
        <>
          <Bold>{author}</Bold> untagged <Bold>{topic}</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'UPDATED':
      if (topic === 'Stream')
        return (
          <>
            <Bold>{author}</Bold> updated <Bold>{stream}</Bold> stream
          </>
        );
      return (
        <>
          <Bold>{author}</Bold> updated <Bold>{topic}</Bold> in <Bold>{stream}</Bold>
        </>
      );
    case 'VERSION_UPDATED':
      return (
        <>
          <Bold>{author}</Bold> updated <Bold>{topic}</Bold> version in <Bold>{stream}</Bold>
        </>
      );

    default:
      return author;
  }
};

export default notificationDescription;
