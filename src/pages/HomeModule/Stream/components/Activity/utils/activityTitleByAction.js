import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const UserName = styled(Link)`
  font-weight: 800;
  text-transform: capitalize;
`;

export const NormalText = styled.span`
  font-weight: 400;
`;

export const StyledLink = styled(Link)`
  color: #1890ff !important;
`;

export default function activityTitleByAction({ action, subject, newValue: target, entity: ent, entityID, entityName: entName }, streamId) {
  const { username, id } = subject;
  const entity = ent.toLowerCase();
  const entityName = entName.charAt(0).toUpperCase() + entName.slice(1);

  switch (action) {
    case 'DOCUMENT_ATTACHED':
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>attached document </NormalText>
          <StyledLink
            to={{
              pathname: `/viewer`,
              state: { id: entityID },
            }}
          >
            {entityName}
          </StyledLink>
        </>
      );
    case 'COMMENTED':
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>added comment at {entity} </NormalText>
          <StyledLink
            to={
              entity === 'task'
                ? { pathname: '/tasks', state: { openTask: entityID } }
                : {
                    pathname: `/viewer`,
                    state: { id: entityID, fromStream: streamId },
                  }
            }
          >
            {entityName}
          </StyledLink>
        </>
      );
    case 'UPDATED':
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>uppdated {entity} </NormalText>
          <StyledLink
            to={
              entity === 'task'
                ? { pathname: '/tasks', state: { openTask: entityID } }
                : {
                    pathname: `/viewer`,
                    state: { id: entityID, fromStream: streamId },
                  }
            }
          >
            {entityName}
          </StyledLink>
        </>
      );
    // case 'TAGGED':
    //   return `${name}`;
    // case 'UNTAGGED':
    //   return `${name}`;
    case 'FILE_ATTACHED':
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>attached file at task </NormalText>
          <StyledLink to={{ pathname: '/tasks', state: { openTask: entityID } }}>{entityName}</StyledLink>
        </>
      );
    case 'CHANGED_TYPE': //?----------------
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>changed type from $old type to $new type</NormalText>
        </>
      );
    case 'ASSIGNED':
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>assigned {entity} to</NormalText>
          <StyledLink to={`/users/${target.id}`}> {target.username}</StyledLink>
        </>
      );
    case 'ADDED_APPROVER':
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>added approver </NormalText>
          <StyledLink to={`/users/${target.id}`}>{target.username}</StyledLink> <NormalText>to document </NormalText>
          <StyledLink
            to={{
              pathname: `/viewer`,
              state: { id: entityID, fromStream: streamId },
            }}
          >
            {entityName}
          </StyledLink>
        </>
      );
    case 'FILE_DETACHED':
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>detached file at task </NormalText>
          <StyledLink to={{ pathname: '/tasks', state: { openTask: entityID } }}>{entityName}</StyledLink>
        </>
      );
    case 'REMOVED_APPROVER':
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>removed approver </NormalText>
          <StyledLink to={`/users/${target.id}`}>{target.username}</StyledLink> <NormalText>from document </NormalText>
          <StyledLink
            to={{
              pathname: `/viewer`,
              state: { id: entityID, fromStream: streamId },
            }}
          >
            {entityName}
          </StyledLink>
        </>
      );
    case 'CHANGED_STATUS': //?-------------DONT WORK
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>changed status from $old status to $new status</NormalText>
        </>
      );
    case 'CHANGED_STREAM': //? SAME AS UPDATED STREAM-------------
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>changed stream </NormalText>
          <StyledLink to={`/streams/${entityID}`}>{entityName}</StyledLink>
        </>
      );
    case 'CHANGED_ASSIGNEE': //?-------------
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>changed assignee from $old assignee to $new assignee</NormalText>
        </>
      );
    case 'APPROVED':
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>approved the document </NormalText>
          <StyledLink
            to={{
              pathname: `/viewer`,
              state: { id: entityID, fromStream: streamId },
            }}
          >
            {entityName}
          </StyledLink>
        </>
      );
    case 'DOCUMENT_DETACHED':
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>detached document $document</NormalText>
        </>
      );
    case 'DOCUMENT_ADDED': //?-------------DONT WORK
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>added document $document_title</NormalText>
        </>
      );
    case 'TASK_ADDED':
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>added task </NormalText>
          <StyledLink to={{ pathname: '/tasks', state: { openTask: entityID } }}>{entityName}</StyledLink>
        </>
      );
    case 'STREAM_CREATED':
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>created </NormalText>
          <StyledLink to={`/streams/${entityID}`}>{entityName}</StyledLink>
          <NormalText> stream</NormalText>
        </>
      );
    // case 'UPDATED':
    //   return `${name} uppdated $property`;
    case 'USER_ADDED': //? ------------- newValue fix
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>added new user to </NormalText>
          <StyledLink to={`/streams/${entityID}`}>{entityName}</StyledLink>
          <NormalText> stream</NormalText>
        </>
      );
    case 'USER_INVITED': //? ------------- newValue fix
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>invited new user to stream</NormalText>
        </>
      );
    case 'REMOVED': //?-------------DONT WORK
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>deleted document $document_title</NormalText>
        </>
      );

    default:
      return (
        <>
          <UserName to={`/users/${id}`}>{username}</UserName> <NormalText>error</NormalText>
        </>
      );
  }
}
