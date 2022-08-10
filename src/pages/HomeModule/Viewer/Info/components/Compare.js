import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { ReactComponent as IconCompare } from 'assets/svg/IconCompare.svg';
import { ReactComponent as IconArrowRight } from 'assets/svg/IconArrowDocumentViewer.svg';
import { ReactComponent as IconArrowLeft } from 'assets/svg/IconLeftView.svg';
import { ReactComponent as DocumentIcon } from 'assets/svg/document.svg';

import * as S from './styled';
import { Dialog } from '@material-ui/core';

const Compare = ({ data, handleSelectTab }) => {
  const documents = useSelector((state) => state.documents.documents);

  const [isOpen, setIsOpen] = useState(false);
  const [isCompareListOpen, setIsCompareListOpen] = useState(false);

  const handleClick = () => {
    handleSelectTab(isOpen ? '' : 'compare');
    setIsOpen(!isOpen);
  };

  const handleAddCompare = (id) => () => {};

  return (
    <>
      <S.ListItem onClick={handleClick} isOpen={isOpen}>
        {isOpen ? (
          <S.HoverCircle>
            {' '}
            <IconArrowLeft />
          </S.HoverCircle>
        ) : (
          <S.HoverCircle>
            <IconCompare />
          </S.HoverCircle>
        )}
        <S.Title>Compare</S.Title>
        {isOpen ? (
          ''
        ) : (
          <S.HoverCircle>
            {' '}
            <IconArrowRight />
          </S.HoverCircle>
        )}
      </S.ListItem>
      {isOpen && (
        <>
          <S.SubTitle>Compare your documents</S.SubTitle>
          <S.GridWrapper>
            <S.LinkWithIcon onClick={() => setIsCompareListOpen(true)}>
              <DocumentIcon />
              <S.Value isClickable>Select a document from your list</S.Value>
            </S.LinkWithIcon>
          </S.GridWrapper>
        </>
      )}
      <Dialog
        aria-labelledby="simple-dialog-title"
        open={isCompareListOpen}
        onClose={() => setIsCompareListOpen(false)}
      >
        <S.DialogList>
          {documents.map(({ title, id }) => (
            <S.DialogListItem key={id} onClick={handleAddCompare(id)}>
              <DocumentIcon />
              <S.Teams>{title}</S.Teams>
            </S.DialogListItem>
          ))}
        </S.DialogList>
      </Dialog>
    </>
  );
};

export default Compare;
