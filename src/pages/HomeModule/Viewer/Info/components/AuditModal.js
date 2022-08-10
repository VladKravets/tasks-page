import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useAsyncFn } from 'react-use';
import { CircularProgress, Dialog } from '@material-ui/core';

import { ReactComponent as IconDownload } from 'assets/svg/IconDownload.svg';
import { ReactComponent as IconDuplicate } from 'assets/svg/IconDuplicate.svg';

import http from 'http/index';

import * as S from './styled';

const AuditModal = ({ getChanges, id, isOpen, setIsOpen, handleSelectTab }) => {
  const history = useHistory();
  const fileInputRef = useRef(null);

  const [
    { loading: loadingCopy },
    handleDocumentCopy,
  ] = useAsyncFn(async () => {
    setIsOpen(false);
    const { data } = await http.post(
      `/documents/${id}/copy`,
      {},
      {
        headers: {
          Authorization: `Basic YWJjOjEyMzQ1`,
        },
      }
    );
    handleSelectTab('');
    if (data.id) history.push('/viewer', { id: data.id });
  }, [history, id]);

  const [{ loading: loadingUpload }, handleUploadFile] = useAsyncFn(
    async ({ target }) => {
      const loadData = new FormData();
      loadData.append('file', target.files[0]);
      const { data } = await http.post(
        `/documents/${id}/new-version`,
        loadData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      handleSelectTab('');
      if (data.id) history.push('/viewer', { id: data.id });
    },
    [history, id]
  );

  return (
    <Dialog
      aria-labelledby="new-audit-version"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <S.DialogWrapper>
        {loadingCopy || loadingUpload ? (
          <CircularProgress />
        ) : (
          <>
            <S.TitleWrapper>
              <S.ModalTitle>Create new version</S.ModalTitle>
              <S.ModalSubtitle>Choose one of the options</S.ModalSubtitle>
            </S.TitleWrapper>
            <S.Actions>
              <S.Action onClick={handleDocumentCopy}>
                <S.IconCircle>
                  <IconDuplicate />
                </S.IconCircle>
                <S.ActionText>
                  Create a copy of the current document
                </S.ActionText>
              </S.Action>
              <S.Action
                onClick={() => {
                  return (
                    fileInputRef &&
                    fileInputRef.current &&
                    fileInputRef.current.click()
                  );
                }}
              >
                <S.IconCircle>
                  <IconDownload />
                </S.IconCircle>
                <S.ActionText>Upload file from your device</S.ActionText>
              </S.Action>
            </S.Actions>
          </>
        )}
      </S.DialogWrapper>
      <input
        type="file"
        ref={fileInputRef}
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          handleUploadFile(e);
        }}
      />
    </Dialog>
  );
};

export default AuditModal;
