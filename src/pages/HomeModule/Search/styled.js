import styled from 'styled-components';
import { Drawer, List, Avatar, Tabs } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';

export const StyledDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    @media screen and (max-width: 450px) {
      width: 100vw !important;
    }
  }
`;

export const HeaderContainer = styled.div`
  padding: 0 24px;
  margin-bottom: 16px;
`;

export const SearchTitle = styled.p`
  font-size: ${({ size }) => size || 14}px;
  font-weight: ${({ weigth }) => weigth || 500};
  color: #000000;
  margin-bottom: ${({ margin }) => margin}px;
`;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    padding-left: 24px;
    margin: 0;
  }
`;

export const FragmentContainer = styled.div`
  margin-bottom: 20px;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const StyledItem = styled(List.Item)`
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  margin-left: -8px;
  text-transform: capitalize;

  :hover {
    background: #f5f5f5;
  }
`;

export const StyledMeta = styled(List.Item.Meta)`
  align-items: center;

  .ant-list-item-meta-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const StyledAvatar = styled(Avatar)`
  background-color: ${({ bgc }) => bgc};
  cursor: default;
`;

export const StyledUnorderedListOutlined = styled(UnorderedListOutlined)`
  & > svg {
    fill: #08979c;
  }
`;
