import styled from 'styled-components/macro';

import StatusMark from 'components/StatusMark';

export const Sidebar = styled.div`
  overflow-y: auto;
  height: calc(100vh - 56px);
  /* width: calc(100% - 7px);

  &:hover {
    overflow-y: scroll;
    width: 100%;
  } */
`;

export const Status = styled(StatusMark)`
  grid-column: 2;
`;

export const ShortInfo = styled.div`
  display: grid;
  padding: 26px;
  grid-template-columns: 43px 1fr;
  grid-row-gap: 6px;
  align-items: center;
`;

export const DocInfo = styled.div`
  display: grid;
  color: #304156;
  font-weight: 500;
  font-size: 15px;
`;

export const Title = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const Subtitle = styled(Title)`
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
  color: #828D99;
  grid-row: 2;
`;

export const DocExtension = styled.div`
  grid-column: 2;
`;

export const List = styled.div`
  display: grid;
  & > div {
    border-top: 1px solid #f0f1f2;
  }
`;
