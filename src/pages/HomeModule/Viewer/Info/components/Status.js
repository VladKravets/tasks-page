import React, { useState } from 'react';

import { ReactComponent as IconLess } from 'assets/svg/IconLess.svg';
import StatusMark from 'components/StatusMark';
import Dropdown from 'shared/Dropdown';

import * as S from './styled';

const StatusItems = ['IN_PROGRESS', 'ASSIGNED', 'APPROVED', 'REJECTED'];

const ViewerStatus = ({ status, handleChangeStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickStatus = (newStatus) => () => {
    console.log({ newStatus });
    handleChangeStatus(newStatus);
    setIsOpen(false);
  };

  const handleClickDropdown = () => setIsOpen(!isOpen);

  return (
    <>
      <S.StatusContainer onClick={handleClickDropdown}>
        <StatusMark type={status}>{status.split('_').join(' ')}</StatusMark>
        <IconLess />
      </S.StatusContainer>
      {isOpen && (
        <Dropdown setOpen={handleClickDropdown}>
          <S.StatusList>
            {StatusItems.map((item) => (
              <StatusMark onClick={handleClickStatus(item)} key={item} type={item}>
                {item.split('_').join(' ').toLowerCase()}
              </StatusMark>
            ))}
          </S.StatusList>
        </Dropdown>
      )}
    </>
  );
};

export default ViewerStatus;
