import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

import { ReactComponent as Arrow } from 'assets/svg/IconLeftArrow.svg';

export const Loading = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  height: calc(100vh - 55px);
`;

export const Header = styled.div`
  align-items: center;
  display: flex;
  height: 56px;
  width: 320px;
  background: #000621;
`;

export const BackIcon = styled(Arrow)`
  width: 22px;
  height: 22px;
  position: absolute;
  left: 28px;
`;

export const BackSquare = styled.div`
  opacity: 0.2;
  border-radius: 4px;
  width: 36px;
  height: 36px;
  background: #ffffff;
  margin-right: 8px;
`;

export const BackLink = styled(Link)`
  color: #b3c0ce;
  font-weight: 500;
  font-size: 15px;
  padding-left: 21px;
  display: flex;
  align-items: center;
`;

export const ViewerContainer = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  height: 100vh;
`;

export const Column = styled.div``;
