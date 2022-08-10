import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout, Avatar, Button } from 'antd';
import styled, { css } from 'styled-components/macro';

import { ReactComponent as logo } from 'assets/logo.svg';

const { Header, Sider, Content } = Layout;

const menuTrigger = css`
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }
`;

export const MenuUnfold = styled(MenuUnfoldOutlined)`
  ${menuTrigger};
`;

export const MenuFold = styled(MenuFoldOutlined)`
  ${menuTrigger};
`;

export const Sidebar = styled(Sider)`
  overflow: auto;
  overflow-x: hidden;
  height: 100vh;
  position: fixed;
  left: 0;

  @media screen and (max-width: 450px) {
    z-index: 1000;
    max-width: 100vw !important;
    width: ${({ collapsed }) => !collapsed && '100vw !important'};

    /* .ant-layout-sider-children {
    } */
  }
`;

export const MobileCloseMenu = styled(MenuFoldOutlined)`
  ${menuTrigger};
  color: #e6f7ff;
  position: absolute;
  right: 24px;
  display: ${({ $hide }) => ($hide ? 'none' : 'block')};

  @media (min-width: 451px) {
    display: none;
  }
`;

export const LogoContainer = styled.div`
  margin: 24px;
  margin-right: 0px;
  width: 200px;
  display: flex;
  align-items: center;
`;

export const Logo = styled(logo)`
  height: 32px;
  width: 32px;
  background-color: #007e7a;
  border-radius: 2px;
  margin-right: 12px;
  padding: 3px;
`;

export const LogoTitle = styled.h2`
  font-size: 16px;
  line-height: 32px;
  color: #e6f7ff;
  transition: all 300ms ease;
  opacity: ${({ hide }) => (hide ? 0 : 1)};
  overflow: hidden;
  white-space: nowrap;
`;

export const LayoutContent = styled(Layout)`
  margin-left: ${({ $collapsed, $collapsedWidth }) => ($collapsed ? $collapsedWidth : 200)}px;
  background: #fff;
`;

export const HeaderBack = styled.div`
  background: #001529;
  position: fixed;
  z-index: 1;
  border-bottom: 1px solid #f0f0f0;
  width: ${({ collapsed, collapsedWidth }) => (collapsed ? `calc(100% - ${collapsedWidth}px)` : 'calc(100% - 200px)')};
`;

export const HeaderContent = styled(Header)`
  background: #fff;
  padding: 0;
  border-top-left-radius: 12px;
`;

export const ContentWhite = styled(Content)`
  padding: 0 24px 32px 24px;
  height: calc(100vh - 64px);
  width: ${({ $collapsed, $collapsedWidth }) => ($collapsed ? `calc(100% - ${$collapsedWidth}px)` : 'calc(100% - 200px)')};
  overflow: auto;
  background: #f0f5ff;
  position: absolute;
  top: 64px;
`;

export const AvatarWithCancel = styled(Avatar)`
  background-color: #f56a00;
  overflow: visible !important;
  cursor: default;
`;

export const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;

  & > span:nth-child(2) {
    margin-left: 6px;
  }
`;
