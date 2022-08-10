import { Avatar } from 'antd';
import styled from 'styled-components/macro';

export const AvatarDefault = styled(Avatar)`
  background-color: ${({ color }) => color};
  font-size: 16px;
  text-transform: capitalize;
  cursor: default;
`;
