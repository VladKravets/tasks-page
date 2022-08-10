import React from 'react';
import styled from 'styled-components/macro';

const User = styled.div`
  display: contents;
  white-space: break-spaces;
  color: #007fd4;
  cursor: pointer;
`;

const AUDIT_STATUSES = {
  DOCUMENT_ATTACHED: ({ newValue, subject }) => (
    <>
      <User>{subject.username}</User> attached document {newValue.title}
    </>
  ),
  COMMENTED: ({ newValue, subject }) => (
    <>
      <User>{subject.username}</User> added comment {newValue}
    </>
  ),
  UPDATED: ({ newValue, subject, previousValue, property }) => (
    <>
      <User>{subject.username}</User> uppdated {property} {/* do not show if value is empty or more than one prop is changed */}
      {previousValue !== '{}' && !property.includes(',')
        ? `from ${JSON.parse(previousValue)[property]} to ${JSON.parse(newValue)[property]}`
        : ''}
    </>
  ),
  //   TAGGED: ``,
  //   UNTAGGED: ``,
  FILE_ATTACHED: ({ newValue, subject }) => (
    <>
      <User>{subject.username}</User> attached file {newValue.title}
    </>
  ),
  CHANGED_TYPE: ({ previousValue, newValue, subject }) => (
    <>
      <User>{subject.username}</User> changed type from {previousValue} to {newValue}
    </>
  ),
  ASSIGNED: ({ newValue, subject }) => (
    <>
      <User>{subject.username}</User> assigned document/task to <User>{newValue.username}</User>
    </>
  ),
  ADDED_APPROVER: ({ newValue, subject }) => (
    <>
      <User>{subject.username}</User> added approver <User>{newValue.username}</User>
    </>
  ),
  FILE_DETACHED: ({ newValue, subject }) => (
    <>
      <User>{subject.username}</User> detached file {newValue.title}
    </>
  ),
  // TODO
  REMOVED_APPROVER: ({ newValue, subject }) => (
    <>
      <User>{subject.username}</User> removed approver <User>{newValue.username}</User>
    </>
  ),
  CHANGED_STATUS: ({ previousValue, newValue, subject }) => (
    <>
      <User>{subject.username}</User> changed status from {previousValue.toLowerCase().split('_').join(' ')} to{' '}
      {newValue.toLowerCase().split('_').join(' ')}
    </>
  ),
  CHANGED_STREAM: ({ previousStream, newStream, subject }) => (
    <>
      <User>{subject.username}</User> changed stream from {previousStream} to {newStream}
    </>
  ),
  CHANGED_ASSIGNEE: ({ newValue, previousValue, subject }) => (
    <>
      <User>{subject.username}</User> changed assignee from {previousValue} to {newValue}
    </>
  ),
  APPROVED: ({ newValue, subject }) => (
    <>
      <User>{subject.username}</User> approved the {newValue.title}
    </>
  ),
  DOCUMENT_DETACHED: ({ previousValue, subject }) => (
    <>
      <User>{subject.username}</User> detached document {previousValue.title}
    </>
  ),
};

/**
 * action
 * document
 * comment
 * property
 * filename
 * oldType
 * newType
 * assignee
 * approver
 * oldStatus
 * newStatus
 * oldStream
 * newStream
 * oldAssignee
 * newAssignee
 *
 * subject
 */
export const getAuditTrailMessage = ({ action, ...props }) =>
  AUDIT_STATUSES[action] ? AUDIT_STATUSES[action](props) : 'TODO status message';
