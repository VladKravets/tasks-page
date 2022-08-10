import { Avatar } from 'antd';
import styled from 'styled-components/macro';

export const AssigneeDropdown = styled.div`
  display: flex;
  flex-direction: column;

  & > label {
    margin-left: 0 !important;
  }
  & > label:not(:last-child) {
    margin-bottom: 6px;
  }
`;

export const AvatarDropdown = styled(Avatar).attrs(() => ({
  size: 22,
}))`
  background-color: ${({ defaultAvatar }) => defaultAvatar};
  margin-right: 8px;
  font-size: 16px;
`;

export const AdminText = styled.span`
  color: #828d99;
`;
