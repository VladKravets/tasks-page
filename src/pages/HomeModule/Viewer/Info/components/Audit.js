import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';

import { ReactComponent as IconAudit } from 'assets/svg/IconAudit.svg';
import { ReactComponent as IconPdf } from 'assets/svg/IconPdf.svg';
import { ReactComponent as IconDocx } from 'assets/svg/IconDocx.svg';
import { ReactComponent as IconArrowRight } from 'assets/svg/IconArrowDocumentViewer.svg';
import { ReactComponent as IconArrowLeft } from 'assets/svg/IconLeftView.svg';

import { getAuditTrailMessage } from 'constants/auditStatuses';
import AuditModal from './AuditModal';

import * as S from './styled';

const Audit = ({ changesData, getChanges, id, handleSelectTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [changes, setChanges] = useState([]);
  const [isExpandVersion, setIsExpandVersion] = useState([]);

  const handleClick = () => {
    handleSelectTab(isOpen ? '' : 'audit');
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!changesData) return;
    setChanges(changesData);
    setIsExpandVersion(Array.from({ length: changesData.length }, (k, v) => isExpandVersion[v] || false));
    // prevent loop with isExpandVersion in deps
    // eslint-disable-next-line
  }, [changesData]);

  const handleExpandVersion = (index, isWithChanges) => () => {
    if (!isWithChanges) return;
    setIsExpandVersion(isExpandVersion.map((v, i) => (i === index ? !v : v)));
  };

  const getDocExtension = (title) => title.split('.').pop();

  return (
    <>
      <S.ListItem onClick={handleClick} isOpen={isOpen}>
        {isOpen ? (
          <S.HoverCircle>
            <IconArrowLeft />
          </S.HoverCircle>
        ) : (
          <S.HoverCircle>
            <IconAudit />
          </S.HoverCircle>
        )}
        <S.Title>Audit Trail</S.Title>
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
          <S.SubTitle>
            <div>Version history</div>
            <S.AddButton onClick={() => setIsNewModalOpen(true)}>New</S.AddButton>
          </S.SubTitle>
          {changes.map((change, index) => (
            <S.VersionWrapper key={change.version}>
              <S.VersionHeader clickable={change.changes.length} onClick={handleExpandVersion(index, change.changes.length)}>
                {/pdf/.test(getDocExtension(change.title)) ? <IconPdf /> : <IconDocx />}
                <S.VersionTitle>Version {`${change.version}${change.id === id ? ` (current)` : ``}`}</S.VersionTitle>
                <S.ChangesAmount>({change.changes.length})</S.ChangesAmount>
                {!!change.changes.length && (
                  <S.HoverCircle>
                    <S.Expand clickable={change.changes.length} expanded={isExpandVersion[index] ? 1 : 0} />
                  </S.HoverCircle>
                )}
              </S.VersionHeader>
              {isExpandVersion[index] && (
                <S.ChangesWrapper>
                  {change.changes.map((_) => (
                    <S.ChangeDescription key={_.at}>
                      <S.Dot />
                      <S.ChangeDate key={_.at}>
                        <S.Datum>
                          <Moment format="DD MMM , YYYY">{_.at}</Moment>
                        </S.Datum>
                        <S.Time>
                          <Moment format="hh:mm a">{_.at}</Moment>
                        </S.Time>
                      </S.ChangeDate>
                      <S.Message>{getAuditTrailMessage(_)}</S.Message>
                    </S.ChangeDescription>
                  ))}
                </S.ChangesWrapper>
              )}
            </S.VersionWrapper>
          ))}
        </>
      )}
      <AuditModal getChanges={getChanges} id={id} isOpen={isNewModalOpen} setIsOpen={setIsNewModalOpen} handleSelectTab={handleSelectTab} />
    </>
  );
};

export default Audit;
