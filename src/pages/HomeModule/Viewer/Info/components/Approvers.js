import React, { useState } from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import { Checkbox, CircularProgress, Dialog } from '@material-ui/core';

import { ReactComponent as IconCheckbox } from 'assets/svg/IconCheckbox.svg';
import { ReactComponent as IconArrowRight } from 'assets/svg/IconArrowDocumentViewer.svg';
import { ReactComponent as IconArrowLeft } from 'assets/svg/IconLeftView.svg';

import http from 'http/index';

import StatusMark from 'components/StatusMark';

import * as S from './styled';

const Approvers = ({ getChanges, handleSelectTab, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [approvers, setApprovers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [selectedApprovers, setSelectedApprovers] = useState([]);

  const [, getApprovers] = useAsyncFn(async () => {
    const { data: approversData } = await http.get(`/documents/${id}/approvers`);
    const { data: usersData } = await http.get(`/users`);
    setUsers(usersData);
    setApprovers(approversData);
    setSelectedApprovers(approversData.map(({ subject: { id } }) => id));
  }, [id]);

  useAsync(async () => {
    await getApprovers();
  }, [getApprovers]);

  const handleClick = () => {
    handleSelectTab(isOpen ? '' : 'approvers');
    setIsOpen(!isOpen);
  };

  const handleAddApprover = async (approverId) => {
    await http.put(`/documents/${id}/approvers/${approverId}`, null);
  };

  const handleRemoveApprover = async (approverId) => {
    await http.delete(`/documents/${id}/approvers/${approverId}`);
  };

  const [{ loading }, handleApply] = useAsyncFn(async () => {
    const defaultSelectedApprovers = approvers.map(({ subject: { id } }) => id);
    const addRequests = selectedApprovers
      .filter((userId) => !defaultSelectedApprovers.includes(userId))
      .map((userId) => handleAddApprover(userId));
    const removeRequests = defaultSelectedApprovers
      .filter((userId) => !selectedApprovers.includes(userId))
      .map((userId) => handleRemoveApprover(userId));

    await Promise.all(addRequests.concat(removeRequests));
    await getChanges();
    await getApprovers();
    setIsAddListOpen(false);
  }, [approvers, getApprovers, getChanges, handleAddApprover, handleRemoveApprover, selectedApprovers]);

  const handleCloseModal = () => {
    setIsAddListOpen(false);
    setSelectedApprovers(approvers.map(({ subject: { id } }) => id));
  };

  const handleChangeAprovers = (userId) => () => {
    if (selectedApprovers.includes(userId)) return setSelectedApprovers(selectedApprovers.filter((user) => user !== userId));
    setSelectedApprovers(selectedApprovers.concat(userId));
  };

  return (
    <>
      <S.ListItem onClick={handleClick} isOpen={isOpen}>
        {isOpen ? (
          <S.HoverCircle>
            <IconArrowLeft />
          </S.HoverCircle>
        ) : (
          <S.HoverCircle>
            <IconCheckbox />
          </S.HoverCircle>
        )}
        <S.Title>Approvers</S.Title>
        {isOpen ? (
          ''
        ) : (
          <S.HoverCircle>
            <IconArrowRight />
          </S.HoverCircle>
        )}
      </S.ListItem>
      {isOpen && (
        <>
          <S.SubTitle>
            <div>Approvers</div>
            <S.AddButton onClick={() => setIsAddListOpen(true)}>Add</S.AddButton>
          </S.SubTitle>
          {approvers.map((approver, approverIndex) => (
            <S.Approver key={approver.subject.id}>
              {/* <S.LargeCircle color={materialUIPallete[approverIndex]}>
                {approver.subject.username.charAt(0)}
              </S.LargeCircle> */}
              <S.AvatarIconLarge />
              <S.ApproverInfo>
                <S.Username>{approver.subject.username}</S.Username>
                <S.Teams>{approver.teams.map(({ title }) => title).join(', ')}</S.Teams>
              </S.ApproverInfo>
              <StatusMark type={approver.status}>{approver.status.split('_').join(' ')}</StatusMark>
            </S.Approver>
          ))}
        </>
      )}
      <Dialog aria-labelledby="simple-dialog-title" open={isAddListOpen} onClose={handleCloseModal}>
        {loading ? (
          <S.LoadingWrapper>
            <CircularProgress />
          </S.LoadingWrapper>
        ) : (
          <S.DialogList>
            <S.DialogApproversHeader>
              Add Approvers
              <S.HoverCircle onClick={handleCloseModal}>
                <S.Close />
              </S.HoverCircle>
            </S.DialogApproversHeader>
            <S.DialogBody>
              {users.map((user, index) => (
                <S.UserInfo key={user.id}>
                  {/* <S.Circle color={materialUIPallete[index]}>
                    {user.username.charAt(0)}
                  </S.Circle> */}
                  <S.AvatarIconSmall />
                  <S.Username>{user.username}</S.Username>
                  {/* add teams to users */}
                  {/* <S.Teams>
                    {user.teams.map(({ title }) => title).join(', ')}
                  </S.Teams> */}
                  <Checkbox color="primary" checked={selectedApprovers.includes(user.id)} onClick={handleChangeAprovers(user.id)} />
                </S.UserInfo>
              ))}
            </S.DialogBody>
            <S.DialogApproversFooter>
              {`Selected (${selectedApprovers.length})`}
              <S.Cancel onClick={handleCloseModal}>Cancel</S.Cancel>
              <S.Submit onClick={handleApply}>Apply</S.Submit>
            </S.DialogApproversFooter>
          </S.DialogList>
        )}
      </Dialog>
    </>
  );
};

export default Approvers;
